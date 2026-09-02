# IUL intro video source

Whiteboard explainer for `/indexed-universal-life`.

## Generate / regenerate

On the Mac mini (needs `ffmpeg`, Pillow, and Kokoro TTS — or Premium/Enhanced `say` voices as fallback):

```bash
cd ~/dustin-life
python3 -c "from PIL import Image"  # verify Pillow
# Kokoro-82M (preferred): pip install --user kokoro soundfile
python3 video-src/render_iul_intro.py
```

Optional env overrides:

- `IUL_KOKORO_VOICE` (default `af_heart`)
- `IUL_KOKORO_SPEED` (default `0.98` for ~150–160 wpm)

Outputs:

- `public/video/iul-intro.mp4`
- `public/video/iul-intro.vtt`
- `public/video/iul-intro-poster.png`

TTS: local Kokoro-82M (`af_heart` / `af_bella` / `am_michael` candidates). Fallback only: macOS Premium/Enhanced Ava/Zoe/Evan via `say`. Do **not** use Samantha/compact voices.

Script + compliance notes: `video-src/SCRIPT.md`.

Captions: short single-line VTT cues; board leaves bottom ~15% clear; page styles `video::cue`.

## Aesthetic constraints

- Hand-drawn ink on off-white board
- Gold accent only (`#C9A96E` / `#8F6D34`)
- No stock footage / clip-art / corporate explainer kit
- Bottom ~15% of frame kept clear for captions
