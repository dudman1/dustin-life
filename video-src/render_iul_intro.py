#!/usr/bin/env python3
"""
IUL whiteboard intro renderer.

Pipeline:
  1) Kokoro-82M local TTS (fallback: macOS Premium/Enhanced say voices — never Samantha)
  2) Pillow frames (hand-drawn ink on off-white, gold accent only)
  3) ffmpeg: frames + audio -> H.264 MP4; also poster PNG + WebVTT

Outputs (repo-relative):
  public/video/iul-intro.mp4
  public/video/iul-intro.vtt
  public/video/iul-intro-poster.png

Re-run from repo root:
  python3 video-src/render_iul_intro.py
"""

from __future__ import annotations

import math
import os
import random
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "video"
FPS = 24
WIDTH, HEIGHT = 1280, 720
# Keep bottom ~15% clear for captions (VTT line/size + CSS ::cue)
CAPTION_CLEAR_TOP = int(HEIGHT * 0.85)  # 612
BG = (246, 241, 232)  # off-white board
INK = (29, 27, 24)  # dark ink
INK_SOFT = (70, 64, 56)
GOLD = (201, 169, 110)  # #C9A96E
GOLD_DEEP = (143, 109, 52)  # #8F6D34
BOARD_LINE = (230, 220, 207)

# Narration segments — order matches SCRIPT.md beats.
SEGMENTS = [
    {
        "id": "b1",
        "text": (
            "Indexed Universal Life is permanent life insurance first — "
            "a death benefit for the people you care about, plus a cash value "
            "that can grow inside the policy."
        ),
    },
    {
        "id": "b2",
        "text": (
            "When you pay a premium, it splits. Part covers the cost of insurance "
            "and charges. What is left can go toward cash value."
        ),
    },
    {
        "id": "b3",
        "text": (
            "That cash value may receive indexed crediting — tied to how an index moves, "
            "but not invested in the index itself. Policies typically use a floor so "
            "credited interest does not go below zero for that period, and a cap or "
            "participation rate that limits the upside. Policy charges still come out, "
            "so cash value can still decline in a flat year. Any numbers you see here are hypothetical."
        ),
    },
    {
        "id": "b4",
        "text": (
            "Here is what people often get wrong. An illustration is not a guarantee. "
            "If a policy is underfunded, it can lapse. Insurance costs generally rise with age. "
            "And loans against cash value have real mechanics and tradeoffs."
        ),
    },
    {
        "id": "b5",
        "text": (
            "Who it can fit: someone who wants permanent coverage, can fund it consistently, "
            "and wants a clear explanation — not hype. Who it usually does not fit: anyone "
            "chasing guaranteed market-beating returns, or who needs short-term, temporary coverage only."
        ),
    },
    {
        "id": "b6",
        "text": (
            "Let's figure out whether it actually fits — no pressure, no obligation. "
            "Call 248-970-9094."
        ),
    },
]

# Kokoro: af_heart is warm/calm and most natural among candidates tested.
KOKORO_VOICE = os.environ.get("IUL_KOKORO_VOICE", "af_heart")
KOKORO_SPEED = float(os.environ.get("IUL_KOKORO_SPEED", "0.98"))  # unhurried ~150–160 wpm
SAY_FALLBACK_VOICES = [
    "Ava (Premium)",
    "Zoe (Premium)",
    "Evan (Premium)",
    "Ava (Enhanced)",
    "Zoe (Enhanced)",
    "Evan (Enhanced)",
]
SAY_RATE = 155


def which(cmd: str) -> str | None:
    return shutil.which(cmd)


def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Rounded MT Bold.ttf" if bold else None,
        "/System/Library/Fonts/Supplemental/Noteworthy.ttc",
        "/System/Library/Fonts/Noteworthy.ttc",
        "/System/Library/Fonts/Supplemental/MarkerFelt.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if not path:
            continue
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def wobble_line(draw: ImageDraw.ImageDraw, points, fill, width=3, seed=0):
    """Draw a slightly imperfect polyline for hand-drawn feel."""
    rng = random.Random(seed)
    if len(points) < 2:
        return
    densified = []
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        steps = max(2, int(math.hypot(x1 - x0, y1 - y0) / 8))
        for i in range(steps):
            t = i / steps
            x = x0 + (x1 - x0) * t + rng.uniform(-1.2, 1.2)
            y = y0 + (y1 - y0) * t + rng.uniform(-1.2, 1.2)
            densified.append((x, y))
    densified.append(points[-1])
    draw.line(densified, fill=fill, width=width, joint="curve")


def sketch_rect(draw, xy, outline, width=3, seed=0, radius=12):
    x0, y0, x1, y1 = xy
    pts = [
        (x0 + radius, y0),
        (x1 - radius, y0),
        (x1, y0 + radius),
        (x1, y1 - radius),
        (x1 - radius, y1),
        (x0 + radius, y1),
        (x0, y1 - radius),
        (x0, y0 + radius),
        (x0 + radius, y0),
    ]
    wobble_line(draw, pts, outline, width=width, seed=seed)


def text_size(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_board_base(progress_label: str = "") -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(img)
    # Board frame stops above caption band
    sketch_rect(
        draw,
        (28, 24, WIDTH - 28, CAPTION_CLEAR_TOP - 8),
        BOARD_LINE,
        width=2,
        seed=3,
        radius=18,
    )
    # faint ruled hint — never into caption zone
    for y in range(100, CAPTION_CLEAR_TOP - 36, 40):
        draw.line([(60, y), (WIDTH - 60, y)], fill=(238, 231, 220), width=1)
    font_s = load_font(22)
    draw.text((56, 36), "IUL — without the sales pitch", fill=INK_SOFT, font=font_s)
    if progress_label:
        tw, _ = text_size(draw, progress_label, font_s)
        draw.text((WIDTH - 56 - tw, 36), progress_label, fill=GOLD_DEEP, font=font_s)
    wobble_line(draw, [(56, 68), (320, 68)], GOLD, width=3, seed=11)
    return img


def beat_progress(local_t: float, dur: float) -> float:
    if dur <= 0:
        return 1.0
    return max(0.0, min(1.0, local_t / dur))


def render_beat1(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("1 / Permanent first")
    draw = ImageDraw.Draw(img)
    title = load_font(58, bold=True)
    body = load_font(30)
    small = load_font(22)

    if p > 0.05:
        draw.text((140, 120), "IUL", fill=INK, font=title)
        wobble_line(draw, [(140, 190), (280, 190)], GOLD, width=4, seed=21)
    if p > 0.2:
        cx, cy = 200, 290
        shield = [
            (cx, cy - 60),
            (cx + 50, cy - 42),
            (cx + 45, cy + 18),
            (cx, cy + 60),
            (cx - 45, cy + 18),
            (cx - 50, cy - 42),
            (cx, cy - 60),
        ]
        wobble_line(draw, shield, INK, width=4, seed=22)
        draw.text((cx - 28, cy - 10), "life", fill=INK_SOFT, font=small)
    if p > 0.4:
        sketch_rect(draw, (360, 210, 620, 320), INK, width=3, seed=23)
        draw.text((380, 235), "Death benefit", fill=INK, font=body)
        draw.text((380, 275), "for people you love", fill=INK_SOFT, font=small)
    if p > 0.65:
        sketch_rect(draw, (680, 210, 1040, 320), INK, width=3, seed=24)
        draw.text((700, 235), "Cash value", fill=INK, font=body)
        draw.text((700, 275), "can grow inside", fill=INK_SOFT, font=small)
        wobble_line(draw, [(630, 265), (670, 265)], GOLD_DEEP, width=4, seed=25)
        wobble_line(draw, [(650, 245), (650, 285)], GOLD_DEEP, width=4, seed=26)
    if p > 0.85:
        draw.text((360, 380), "Permanent life insurance first.", fill=INK, font=body)
    return img


def render_beat2(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("2 / Premium split")
    draw = ImageDraw.Draw(img)
    body = load_font(32)
    small = load_font(22)
    draw.text((120, 110), "Your premium", fill=INK, font=body)

    x0, y0, x1, y1 = 120, 190, 1160, 265
    if p > 0.1:
        sketch_rect(draw, (x0, y0, x1, y1), INK, width=3, seed=31)
    split = x0 + int((x1 - x0) * 0.62)
    if p > 0.35:
        for x in range(x0 + 8, split - 4, 14):
            draw.line([(x, y0 + 8), (x + 8, y1 - 8)], fill=INK_SOFT, width=2)
        wobble_line(draw, [(split, y0), (split, y1)], GOLD_DEEP, width=4, seed=32)
        draw.text((x0 + 20, y0 + 22), "COI / charges", fill=INK, font=small)
    if p > 0.55:
        draw.text((split + 20, y0 + 22), "to cash value", fill=INK, font=small)
        wobble_line(draw, [(split + 120, y1 + 10), (split + 120, y1 + 55)], GOLD, width=3, seed=33)
    if p > 0.75:
        draw.text((120, 340), "Simplified picture — design and charges vary.", fill=INK_SOFT, font=small)
        draw.text((120, 390), "What remains after costs can build cash value.", fill=INK, font=body)
    return img


def render_beat3(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("3 / Indexed crediting")
    draw = ImageDraw.Draw(img)
    body = load_font(26)
    small = load_font(20)
    tiny = load_font(18)

    draw.text((100, 100), "Tied to index movement — not invested in the index", fill=INK, font=body)

    # Chart kept well above caption band
    cx0, cy0, cx1, cy1 = 100, 160, 820, 430
    if p > 0.08:
        wobble_line(draw, [(cx0, cy1), (cx1, cy1)], INK, width=3, seed=41)
        wobble_line(draw, [(cx0, cy0), (cx0, cy1)], INK, width=3, seed=42)

    floor_y = cy1 - 55
    cap_y = cy0 + 55

    if p > 0.18:
        pts = []
        for i in range(0, 21):
            x = cx0 + 20 + i * ((cx1 - cx0 - 40) / 20)
            wave = math.sin(i * 0.55) * 45 + math.sin(i * 0.2) * 16
            y = (cy0 + cy1) / 2 - wave
            pts.append((x, y))
        visible = max(2, int(len(pts) * min(1.0, (p - 0.18) / 0.28)))
        wobble_line(draw, pts[:visible], INK_SOFT, width=3, seed=43)

    if p > 0.42:
        wobble_line(draw, [(cx0 + 10, floor_y), (cx1 - 10, floor_y)], GOLD_DEEP, width=3, seed=44)
        draw.text((cx1 + 8, floor_y - 10), "typical floor (hyp.)", fill=GOLD_DEEP, font=tiny)
    if p > 0.52:
        x = cx0 + 10
        while x < cx1 - 10:
            draw.line([(x, cap_y), (min(x + 12, cx1 - 10), cap_y)], fill=GOLD, width=3)
            x += 22
        draw.text((cx1 + 8, cap_y - 10), "cap / participation (hyp.)", fill=GOLD, font=tiny)

    # Charges note (new beat-3 content)
    if p > 0.68:
        draw.text(
            (100, 460),
            "Charges still come out — cash value can decline in a flat year.",
            fill=INK,
            font=small,
        )

    if p > 0.82:
        sketch_rect(draw, (900, 200, 1180, 290), GOLD_DEEP, width=3, seed=45)
        draw.text((925, 225), "HYPOTHETICAL", fill=GOLD_DEEP, font=small)
        draw.text((900, 320), "Numbers are examples only.", fill=INK_SOFT, font=tiny)
        draw.text((900, 350), "Not a real offer or projection.", fill=INK_SOFT, font=tiny)
    return img


def render_beat4(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("4 / Common mistakes")
    draw = ImageDraw.Draw(img)
    body = load_font(32)
    item = load_font(26)
    draw.text((110, 100), "What people get wrong", fill=INK, font=body)
    wobble_line(draw, [(110, 145), (520, 145)], GOLD, width=3, seed=51)

    items = [
        "Illustration ≠ guarantee",
        "Underfunded policies can lapse",
        "Insurance costs generally rise with age",
        "Loans have mechanics and tradeoffs",
    ]
    for i, label in enumerate(items):
        threshold = 0.2 + i * 0.18
        if p < threshold:
            continue
        y = 175 + i * 80
        if y + 40 > CAPTION_CLEAR_TOP - 20:
            continue
        sketch_rect(draw, (120, y, 158, y + 36), INK, width=3, seed=52 + i, radius=6)
        wobble_line(draw, [(128, y + 20), (138, y + 30), (152, y + 10)], GOLD_DEEP, width=3, seed=60 + i)
        draw.text((180, y + 4), label, fill=INK, font=item)
    return img


def render_beat5(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("5 / Fit vs usually not")
    draw = ImageDraw.Draw(img)
    head = load_font(30)
    item = load_font(22)

    if p > 0.1:
        draw.text((120, 100), "Can fit", fill=GOLD_DEEP, font=head)
        draw.text((700, 100), "Usually doesn't", fill=INK, font=head)
        wobble_line(draw, [(640, 140), (640, CAPTION_CLEAR_TOP - 40)], GOLD, width=3, seed=71)

    left = [
        "Wants permanent coverage",
        "Can fund consistently",
        "Wants clarity — not hype",
    ]
    right = [
        "Chasing guaranteed",
        "  market-beating returns",
        "Needs short-term / temporary",
        "  coverage only",
    ]
    if p > 0.3:
        for i, t in enumerate(left):
            y = 170 + i * 60
            if y < CAPTION_CLEAR_TOP - 30:
                draw.text((120, y), f"•  {t}", fill=INK, font=item)
    if p > 0.6:
        for i, t in enumerate(right):
            y = 170 + i * 48
            if y < CAPTION_CLEAR_TOP - 30:
                draw.text((700, y), f"•  {t}" if not t.startswith(" ") else t, fill=INK, font=item)
    return img


def render_beat6(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("6 / Next step")
    draw = ImageDraw.Draw(img)
    head = load_font(36, bold=True)
    body = load_font(28)
    phone = load_font(50, bold=True)
    small = load_font(22)

    if p > 0.1:
        draw.text((160, 140), "Let's figure out whether it actually fits.", fill=INK, font=head)
    if p > 0.35:
        draw.text((160, 210), "No pressure. No obligation.", fill=INK_SOFT, font=body)
    if p > 0.55:
        sketch_rect(draw, (160, 280, 820, 400), INK, width=3, seed=81, radius=16)
        draw.text((200, 310), "248-970-9094", fill=INK, font=phone)
        wobble_line(draw, [(200, 375), (620, 375)], GOLD_DEEP, width=4, seed=82)
    if p > 0.8:
        draw.text((160, 440), "Dustin McCormick  ·  dustinlife.com", fill=INK_SOFT, font=small)
    return img


BEAT_RENDERERS = {
    "b1": render_beat1,
    "b2": render_beat2,
    "b3": render_beat3,
    "b4": render_beat4,
    "b5": render_beat5,
    "b6": render_beat6,
}


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd))
    subprocess.check_call(cmd)


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as w:
        return w.getnframes() / float(w.getframerate())


def aiff_or_wav_duration(path: Path) -> float:
    if path.suffix.lower() == ".wav":
        try:
            return wav_duration(path)
        except Exception:
            pass
    ffprobe = which("ffprobe") or "/usr/local/bin/ffprobe"
    out = subprocess.check_output(
        [
            ffprobe,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


def list_say_voices() -> set[str]:
    say = which("say")
    if not say:
        return set()
    out = subprocess.check_output([say, "-v", "?"], text=True, stderr=subprocess.STDOUT)
    names = set()
    for line in out.splitlines():
        # "Name                lang    # sample"
        if not line.strip():
            continue
        name = line.split("  ")[0].strip()
        if name:
            names.add(name)
    return names


def pick_say_fallback_voice() -> str:
    installed = list_say_voices()
    for cand in SAY_FALLBACK_VOICES:
        if cand in installed:
            return cand
    # Partial match (some macOS builds vary the label)
    lowered = {n.lower(): n for n in installed}
    for cand in SAY_FALLBACK_VOICES:
        key = cand.lower()
        if key in lowered:
            return lowered[key]
        for n in installed:
            if "samantha" in n.lower() or "compact" in n.lower():
                continue
            if cand.split()[0].lower() in n.lower() and (
                "premium" in n.lower() or "enhanced" in n.lower()
            ):
                return n
    raise RuntimeError(
        "Kokoro unavailable and no Premium/Enhanced Ava/Zoe/Evan say voice installed. "
        "Refusing Samantha/compact voices."
    )


def kokoro_to_wav(text: str, out_wav: Path, voice: str, speed: float) -> None:
    import numpy as np
    import soundfile as sf
    from kokoro import KPipeline

    if not hasattr(kokoro_to_wav, "_pipeline"):
        print(f"Loading Kokoro pipeline (voice={voice}, speed={speed})...")
        kokoro_to_wav._pipeline = KPipeline(lang_code="a")
    pipeline = kokoro_to_wav._pipeline
    chunks = []
    for result in pipeline(text, voice=voice, speed=speed):
        if hasattr(result, "audio"):
            chunks.append(np.asarray(result.audio, dtype=np.float32))
        elif isinstance(result, (tuple, list)) and len(result) >= 3:
            chunks.append(np.asarray(result[2], dtype=np.float32))
        else:
            raise RuntimeError(f"Unexpected Kokoro result: {type(result)}")
    if not chunks:
        raise RuntimeError("Kokoro produced no audio")
    audio = np.concatenate(chunks)
    sf.write(str(out_wav), audio, 24000)


def say_to_audio(text: str, out_aiff: Path, voice: str) -> None:
    say = which("say")
    if not say:
        raise RuntimeError("macOS `say` not found")
    if "samantha" in voice.lower():
        raise RuntimeError("Refusing Samantha voice")
    run([say, "-v", voice, "-r", str(SAY_RATE), "-o", str(out_aiff), text])


def synthesize_segment(text: str, out_path: Path, engine: str, voice: str) -> None:
    if engine == "kokoro":
        # always wav for kokoro
        wav = out_path.with_suffix(".wav")
        kokoro_to_wav(text, wav, voice=voice, speed=KOKORO_SPEED)
        if wav != out_path:
            shutil.move(str(wav), str(out_path))
    else:
        aiff = out_path.with_suffix(".aiff")
        say_to_audio(text, aiff, voice=voice)
        if aiff != out_path:
            shutil.move(str(aiff), str(out_path))


def choose_tts_engine() -> tuple[str, str]:
    """Return (engine, voice). Prefer Kokoro; else Premium say."""
    try:
        import soundfile  # noqa: F401
        from kokoro import KPipeline  # noqa: F401

        # quick sanity: voice id string
        voice = KOKORO_VOICE
        print(f"TTS engine: Kokoro-82M voice={voice} speed={KOKORO_SPEED}")
        return "kokoro", voice
    except Exception as e:
        print(f"Kokoro unavailable ({type(e).__name__}: {e}); trying Premium say fallback")
        voice = pick_say_fallback_voice()
        print(f"TTS engine: macOS say voice={voice!r} rate={SAY_RATE}")
        return "say", voice


def concat_audio(parts: list[Path], out_wav: Path, gap_sec: float = 0.35) -> list[tuple[str, float, float]]:
    """Return list of (segment_id, start, end) timeline after concat with gaps."""
    ffmpeg = which("ffmpeg") or "/usr/local/bin/ffmpeg"
    timeline = []
    t = 0.0
    filter_parts = []
    inputs = []
    idx = 0
    for i, part in enumerate(parts):
        inputs.extend(["-i", str(part)])
        dur = aiff_or_wav_duration(part)
        timeline.append((SEGMENTS[i]["id"], t, t + dur))
        filter_parts.append(f"[{idx}:a]")
        idx += 1
        t += dur
        if i < len(parts) - 1:
            inputs.extend(["-f", "lavfi", "-t", str(gap_sec), "-i", "anullsrc=r=24000:cl=mono"])
            filter_parts.append(f"[{idx}:a]")
            idx += 1
            t += gap_sec
    n = idx
    filt = "".join(filter_parts) + f"concat=n={n}:v=0:a=1[aout]"
    cmd = [
        ffmpeg,
        "-y",
        *inputs,
        "-filter_complex",
        filt,
        "-map",
        "[aout]",
        "-ar",
        "24000",
        str(out_wav),
    ]
    run(cmd)
    return timeline


def split_caption_lines(text: str, max_len: int = 45) -> list[str]:
    """Split into short single-line caption cues (≤ max_len chars)."""
    # Normalize whitespace
    text = " ".join(text.replace("—", "—").split())
    words = text.split(" ")
    lines: list[str] = []
    cur: list[str] = []
    for w in words:
        trial = (" ".join(cur + [w])).strip()
        if cur and len(trial) > max_len:
            lines.append(" ".join(cur))
            cur = [w]
        else:
            cur.append(w)
    if cur:
        lines.append(" ".join(cur))
    # Prefer breaking on punctuation when a line is still long-ish
    return lines


def write_vtt(timeline: list[tuple[str, float, float]], path: Path) -> None:
    def vtt_ts(sec: float) -> str:
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = sec % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}"

    lines = ["WEBVTT", ""]
    cue_i = 1
    for i, seg in enumerate(SEGMENTS):
        _id, start, end = timeline[i]
        # Small pad so cues don't touch neighbors
        seg_start = start + 0.05
        seg_end = max(seg_start + 0.2, end - 0.05)
        captions = split_caption_lines(seg["text"], max_len=45)
        # Weight by character length for timing
        weights = [max(1, len(c)) for c in captions]
        total_w = float(sum(weights))
        dur = seg_end - seg_start
        t = seg_start
        for j, (cap, w) in enumerate(zip(captions, weights)):
            piece = dur * (w / total_w)
            c_start = t
            c_end = seg_end if j == len(captions) - 1 else min(seg_end, t + piece)
            # Ensure strictly increasing, non-overlapping
            if c_end <= c_start:
                c_end = c_start + 0.15
            # position: bottom ~15% via line 85% + size
            lines.append(str(cue_i))
            lines.append(
                f"{vtt_ts(c_start)} --> {vtt_ts(c_end)} line:85% position:50% size:90% align:middle"
            )
            lines.append(cap)
            lines.append("")
            cue_i += 1
            t = c_end
    path.write_text("\n".join(lines))
    print("Wrote", path)


def render_frames(timeline: list[tuple[str, float, float]], frames_dir: Path) -> int:
    frames_dir.mkdir(parents=True, exist_ok=True)
    total_dur = timeline[-1][2] + 0.6
    n_frames = int(math.ceil(total_dur * FPS))
    for fi in range(n_frames):
        t = fi / FPS
        beat_id = timeline[-1][0]
        local_t = t - timeline[-1][1]
        dur = timeline[-1][2] - timeline[-1][1]
        for bid, start, end in timeline:
            if start <= t <= end + 0.001:
                beat_id = bid
                local_t = t - start
                dur = max(0.01, end - start)
                break
            if t < start:
                break
        if all(not (start <= t <= end) for _, start, end in timeline):
            prev = None
            for bid, start, end in timeline:
                if end <= t:
                    prev = (bid, start, end)
            if prev:
                beat_id, start, end = prev
                local_t = end - start
                dur = max(0.01, end - start)

        renderer = BEAT_RENDERERS[beat_id]
        frame = renderer(local_t, dur)
        frame.save(frames_dir / f"frame_{fi:05d}.png")
        if fi % (FPS * 2) == 0:
            print(f"  frame {fi}/{n_frames} t={t:.1f}s beat={beat_id}")
    return n_frames


def encode_mp4(frames_dir: Path, audio_wav: Path, out_mp4: Path) -> None:
    ffmpeg = which("ffmpeg") or "/usr/local/bin/ffmpeg"
    run(
        [
            ffmpeg,
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(frames_dir / "frame_%05d.png"),
            "-i",
            str(audio_wav),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-profile:v",
            "main",
            "-crf",
            "23",
            "-preset",
            "medium",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out_mp4),
        ]
    )


def make_poster(timeline, out_png: Path) -> None:
    img = render_beat1(10.0, 12.0)
    img.save(out_png)
    print("Wrote poster", out_png)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ffmpeg = which("ffmpeg") or ("/usr/local/bin/ffmpeg" if os.path.exists("/usr/local/bin/ffmpeg") else None)
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found")

    engine, voice = choose_tts_engine()

    with tempfile.TemporaryDirectory(prefix="iul-intro-") as td:
        td_path = Path(td)
        parts = []
        for seg in SEGMENTS:
            ext = ".wav" if engine == "kokoro" else ".aiff"
            out = td_path / f"{seg['id']}{ext}"
            print(f"TTS {seg['id']} via {engine}/{voice}...")
            synthesize_segment(seg["text"], out, engine, voice)
            parts.append(out)

        wav = td_path / "narration.wav"
        timeline = concat_audio(parts, wav)
        total = timeline[-1][2]
        print("Timeline:")
        for bid, s, e in timeline:
            print(f"  {bid}: {s:.2f} -> {e:.2f} ({e-s:.2f}s)")
        print(f"Total narration ~{total:.1f}s")
        words = sum(len(s["text"].split()) for s in SEGMENTS)
        print(f"Approx WPM: {words / (total / 60):.0f}")
        if total < 75 or total > 110:
            print("WARNING: length outside ~75–100s target (slack to 110)")

        # Persist engine choice note
        (td_path / "tts_choice.txt").write_text(f"{engine}\t{voice}\t{KOKORO_SPEED if engine=='kokoro' else SAY_RATE}\n")

        frames_dir = td_path / "frames"
        print("Rendering frames...")
        render_frames(timeline, frames_dir)

        out_mp4 = OUT_DIR / "iul-intro.mp4"
        print("Encoding MP4...")
        encode_mp4(frames_dir, wav, out_mp4)

        out_vtt = OUT_DIR / "iul-intro.vtt"
        write_vtt(timeline, out_vtt)

        out_poster = OUT_DIR / "iul-intro-poster.png"
        make_poster(timeline, out_poster)

        # Copy TTS choice next to outputs for reporting
        (OUT_DIR / "iul-intro-tts.txt").write_text(
            f"engine={engine}\nvoice={voice}\nspeed_or_rate={KOKORO_SPEED if engine=='kokoro' else SAY_RATE}\n"
            f"total_sec={total:.2f}\n"
        )

        size_mb = out_mp4.stat().st_size / (1024 * 1024)
        print(f"Done. {out_mp4} ({size_mb:.1f} MB)")
        if size_mb > 15:
            print("WARNING: file exceeds 15MB target — consider higher CRF")


if __name__ == "__main__":
    main()
