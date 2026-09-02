#!/usr/bin/env python3
"""
IUL whiteboard intro renderer (draft v1).

Pipeline:
  1) macOS `say` -> AIFF narration (Samantha, calm rate)
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
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "video"
FPS = 24
WIDTH, HEIGHT = 1280, 720
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
            "participation rate that limits the upside. Any numbers you see here are hypothetical."
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

SAY_VOICE = "Samantha"
SAY_RATE = 160  # calmer than default


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
    # subtle board frame
    sketch_rect(draw, (28, 24, WIDTH - 28, HEIGHT - 24), BOARD_LINE, width=2, seed=3, radius=18)
    # faint ruled hint
    for y in range(110, HEIGHT - 60, 42):
        draw.line([(60, y), (WIDTH - 60, y)], fill=(238, 231, 220), width=1)
    font_s = load_font(22)
    draw.text((56, 40), "IUL — without the sales pitch", fill=INK_SOFT, font=font_s)
    if progress_label:
        tw, _ = text_size(draw, progress_label, font_s)
        draw.text((WIDTH - 56 - tw, 40), progress_label, fill=GOLD_DEEP, font=font_s)
    # gold accent underline under title
    wobble_line(draw, [(56, 72), (320, 72)], GOLD, width=3, seed=11)
    return img


def beat_progress(local_t: float, dur: float) -> float:
    if dur <= 0:
        return 1.0
    return max(0.0, min(1.0, local_t / dur))


def render_beat1(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("1 / Permanent first")
    draw = ImageDraw.Draw(img)
    title = load_font(64, bold=True)
    body = load_font(32)
    small = load_font(24)

    if p > 0.05:
        draw.text((140, 140), "IUL", fill=INK, font=title)
        wobble_line(draw, [(140, 215), (280, 215)], GOLD, width=4, seed=21)
    if p > 0.2:
        # shield sketch
        cx, cy = 200, 320
        shield = [
            (cx, cy - 70),
            (cx + 55, cy - 50),
            (cx + 50, cy + 20),
            (cx, cy + 70),
            (cx - 50, cy + 20),
            (cx - 55, cy - 50),
            (cx, cy - 70),
        ]
        wobble_line(draw, shield, INK, width=4, seed=22)
        draw.text((cx - 30, cy - 12), "life", fill=INK_SOFT, font=small)
    if p > 0.4:
        sketch_rect(draw, (360, 240, 620, 360), INK, width=3, seed=23)
        draw.text((380, 270), "Death benefit", fill=INK, font=body)
        draw.text((380, 315), "for people you love", fill=INK_SOFT, font=small)
    if p > 0.65:
        sketch_rect(draw, (680, 240, 1040, 360), INK, width=3, seed=24)
        draw.text((700, 270), "Cash value", fill=INK, font=body)
        draw.text((700, 315), "can grow inside", fill=INK_SOFT, font=small)
        # gold plus
        wobble_line(draw, [(630, 300), (670, 300)], GOLD_DEEP, width=4, seed=25)
        wobble_line(draw, [(650, 280), (650, 320)], GOLD_DEEP, width=4, seed=26)
    if p > 0.85:
        draw.text((360, 420), "Permanent life insurance first.", fill=INK, font=body)
    return img


def render_beat2(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("2 / Premium split")
    draw = ImageDraw.Draw(img)
    body = load_font(34)
    small = load_font(24)
    draw.text((120, 130), "Your premium", fill=INK, font=body)

    # full bar
    x0, y0, x1, y1 = 120, 220, 1160, 300
    if p > 0.1:
        sketch_rect(draw, (x0, y0, x1, y1), INK, width=3, seed=31)
    # split reveal
    split = x0 + int((x1 - x0) * 0.62)
    if p > 0.35:
        # left fill hatch for COI
        for x in range(x0 + 8, split - 4, 14):
            draw.line([(x, y0 + 8), (x + 8, y1 - 8)], fill=INK_SOFT, width=2)
        wobble_line(draw, [(split, y0), (split, y1)], GOLD_DEEP, width=4, seed=32)
        draw.text((x0 + 20, y0 + 22), "COI / charges", fill=INK, font=small)
    if p > 0.55:
        draw.text((split + 20, y0 + 22), "to cash value", fill=INK, font=small)
        # arrow down to cash value note
        wobble_line(draw, [(split + 120, y1 + 10), (split + 120, y1 + 70)], GOLD, width=3, seed=33)
    if p > 0.75:
        draw.text((120, 380), "Simplified picture — design and charges vary.", fill=INK_SOFT, font=small)
        draw.text((120, 430), "What remains after costs can build cash value.", fill=INK, font=body)
    return img


def render_beat3(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("3 / Indexed crediting")
    draw = ImageDraw.Draw(img)
    body = load_font(30)
    small = load_font(22)
    tiny = load_font(20)

    draw.text((100, 120), "Tied to index movement — not invested in the index", fill=INK, font=body)

    # chart frame
    cx0, cy0, cx1, cy1 = 100, 200, 860, 520
    if p > 0.1:
        wobble_line(draw, [(cx0, cy1), (cx1, cy1)], INK, width=3, seed=41)  # x
        wobble_line(draw, [(cx0, cy0), (cx0, cy1)], INK, width=3, seed=42)  # y

    floor_y = cy1 - 70
    cap_y = cy0 + 70

    if p > 0.25:
        # index wavy line
        pts = []
        for i in range(0, 21):
            x = cx0 + 20 + i * ((cx1 - cx0 - 40) / 20)
            wave = math.sin(i * 0.55) * 55 + math.sin(i * 0.2) * 20
            y = (cy0 + cy1) / 2 - wave
            pts.append((x, y))
        visible = max(2, int(len(pts) * min(1.0, (p - 0.25) / 0.35)))
        wobble_line(draw, pts[:visible], INK_SOFT, width=3, seed=43)

    if p > 0.55:
        wobble_line(draw, [(cx0 + 10, floor_y), (cx1 - 10, floor_y)], GOLD_DEEP, width=3, seed=44)
        draw.text((cx1 + 10, floor_y - 12), "typical floor (hyp.)", fill=GOLD_DEEP, font=tiny)
    if p > 0.7:
        # dashed cap
        x = cx0 + 10
        while x < cx1 - 10:
            draw.line([(x, cap_y), (min(x + 12, cx1 - 10), cap_y)], fill=GOLD, width=3)
            x += 22
        draw.text((cx1 + 10, cap_y - 12), "cap / participation (hyp.)", fill=GOLD, font=tiny)

    if p > 0.85:
        # hypothetical stamp
        sketch_rect(draw, (920, 240, 1180, 340), GOLD_DEEP, width=3, seed=45)
        draw.text((945, 270), "HYPOTHETICAL", fill=GOLD_DEEP, font=small)
        draw.text((940, 370), "Numbers are examples only.", fill=INK_SOFT, font=tiny)
        draw.text((940, 405), "Not a real offer or projection.", fill=INK_SOFT, font=tiny)
    return img


def render_beat4(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("4 / Common mistakes")
    draw = ImageDraw.Draw(img)
    body = load_font(34)
    item = load_font(28)
    draw.text((110, 120), "What people get wrong", fill=INK, font=body)
    wobble_line(draw, [(110, 165), (520, 165)], GOLD, width=3, seed=51)

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
        y = 210 + i * 90
        # checkbox
        sketch_rect(draw, (120, y, 160, y + 40), INK, width=3, seed=52 + i, radius=6)
        wobble_line(draw, [(128, y + 22), (140, y + 34), (155, y + 10)], GOLD_DEEP, width=3, seed=60 + i)
        draw.text((180, y + 4), label, fill=INK, font=item)
    return img


def render_beat5(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("5 / Fit vs usually not")
    draw = ImageDraw.Draw(img)
    head = load_font(32)
    item = load_font(24)

    # columns
    if p > 0.1:
        draw.text((120, 120), "Can fit", fill=GOLD_DEEP, font=head)
        draw.text((700, 120), "Usually doesn't", fill=INK, font=head)
        wobble_line(draw, [(640, 160), (640, 560)], GOLD, width=3, seed=71)

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
            draw.text((120, 200 + i * 70), f"•  {t}", fill=INK, font=item)
    if p > 0.6:
        for i, t in enumerate(right):
            draw.text((700, 200 + i * 55), f"•  {t}" if not t.startswith(" ") else t, fill=INK, font=item)
    return img


def render_beat6(local_t: float, dur: float) -> Image.Image:
    p = beat_progress(local_t, dur)
    img = draw_board_base("6 / Next step")
    draw = ImageDraw.Draw(img)
    head = load_font(40, bold=True)
    body = load_font(30)
    phone = load_font(54, bold=True)
    small = load_font(24)

    if p > 0.1:
        draw.text((160, 180), "Let's figure out whether it actually fits.", fill=INK, font=head)
    if p > 0.35:
        draw.text((160, 260), "No pressure. No obligation.", fill=INK_SOFT, font=body)
    if p > 0.55:
        sketch_rect(draw, (160, 340, 820, 470), INK, width=3, seed=81, radius=16)
        draw.text((200, 375), "248-970-9094", fill=INK, font=phone)
        wobble_line(draw, [(200, 445), (620, 445)], GOLD_DEEP, width=4, seed=82)
    if p > 0.8:
        draw.text((160, 520), "Dustin McCormick  ·  dustinlife.com", fill=INK_SOFT, font=small)
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


def say_to_aiff(text: str, out_aiff: Path) -> None:
    say = which("say")
    if not say:
        raise RuntimeError("macOS `say` not found — required for free TTS on Mini")
    run([say, "-v", SAY_VOICE, "-r", str(SAY_RATE), "-o", str(out_aiff), text])


def aiff_duration(path: Path) -> float:
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


def concat_audio(aiffs: list[Path], out_wav: Path, gap_sec: float = 0.35) -> list[tuple[str, float, float]]:
    """Return list of (segment_id, start, end) timeline after concat with gaps."""
    ffmpeg = which("ffmpeg") or "/usr/local/bin/ffmpeg"
    # Build filter that concatenates with short silences between beats
    timeline = []
    t = 0.0
    filter_parts = []
    inputs = []
    idx = 0
    for i, aiff in enumerate(aiffs):
        inputs.extend(["-i", str(aiff)])
        dur = aiff_duration(aiff)
        timeline.append((SEGMENTS[i]["id"], t, t + dur))
        filter_parts.append(f"[{idx}:a]")
        idx += 1
        t += dur
        if i < len(aiffs) - 1:
            # synthetic silence
            inputs.extend(["-f", "lavfi", "-t", str(gap_sec), "-i", "anullsrc=r=22050:cl=mono"])
            filter_parts.append(f"[{idx}:a]")
            idx += 1
            t += gap_sec
    n = idx
    filt = "".join(filter_parts) + f"concat=n={n}:v=0:a=1[aout]"
    cmd = [ffmpeg, "-y", *inputs, "-filter_complex", filt, "-map", "[aout]", str(out_wav)]
    run(cmd)
    return timeline


def write_vtt(timeline: list[tuple[str, float, float]], path: Path) -> None:
    def ts(sec: float) -> str:
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = sec % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}".replace(".", ",") if False else f"{h:02d}:{m:02d}:{s:06.3f}"

    # WebVTT uses . as decimal separator
    def vtt_ts(sec: float) -> str:
        h = int(sec // 3600)
        m = int((sec % 3600) // 60)
        s = sec % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}"

    lines = ["WEBVTT", ""]
    for i, seg in enumerate(SEGMENTS):
        _id, start, end = timeline[i]
        lines.append(str(i + 1))
        lines.append(f"{vtt_ts(start)} --> {vtt_ts(end)}")
        # Cap cue length a bit for readability
        text = seg["text"]
        if len(text) > 120:
            # split on sentence boundary near middle
            cut = text.find(". ", len(text) // 3)
            if cut == -1:
                cut = text.find(", ", len(text) // 3)
            if cut != -1:
                text = text[: cut + 1] + "\n" + text[cut + 2 :]
        lines.append(text)
        lines.append("")
    path.write_text("\n".join(lines))
    print("Wrote", path)


def render_frames(timeline: list[tuple[str, float, float]], frames_dir: Path) -> int:
    frames_dir.mkdir(parents=True, exist_ok=True)
    total_dur = timeline[-1][2] + 0.6  # brief hold on last
    n_frames = int(math.ceil(total_dur * FPS))
    for fi in range(n_frames):
        t = fi / FPS
        # find beat
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
        # during gaps, hold previous beat at end
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
    # Use a mid-beat-1 frame look as brand poster
    img = render_beat1(10.0, 12.0)
    img.save(out_png)
    print("Wrote poster", out_png)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ffmpeg = which("ffmpeg") or ("/usr/local/bin/ffmpeg" if os.path.exists("/usr/local/bin/ffmpeg") else None)
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found")
    if not which("say"):
        raise RuntimeError("macOS say not found")

    with tempfile.TemporaryDirectory(prefix="iul-intro-") as td:
        td_path = Path(td)
        aiffs = []
        for seg in SEGMENTS:
            out = td_path / f"{seg['id']}.aiff"
            print(f"TTS {seg['id']}...")
            say_to_aiff(seg["text"], out)
            aiffs.append(out)

        wav = td_path / "narration.wav"
        timeline = concat_audio(aiffs, wav)
        total = timeline[-1][2]
        print("Timeline:")
        for bid, s, e in timeline:
            print(f"  {bid}: {s:.2f} -> {e:.2f} ({e-s:.2f}s)")
        print(f"Total narration ~{total:.1f}s")
        if total < 75 or total > 105:
            print("WARNING: length outside 75–100s target (allowing small slack to 105)")

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

        size_mb = out_mp4.stat().st_size / (1024 * 1024)
        print(f"Done. {out_mp4} ({size_mb:.1f} MB)")
        if size_mb > 15:
            print("WARNING: file exceeds 15MB target — consider higher CRF")


if __name__ == "__main__":
    main()
