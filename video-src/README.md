# IUL intro video source

Whiteboard explainer for `/indexed-universal-life`.

## Generate / regenerate

On the Mac mini (needs `say`, `ffmpeg`, Pillow):

```bash
cd ~/dustin-life
python3 -c "from PIL import Image"  # verify Pillow
python3 video-src/render_iul_intro.py
```

Outputs:

- `public/video/iul-intro.mp4`
- `public/video/iul-intro.vtt`
- `public/video/iul-intro-poster.png`

TTS: macOS `say -v Samantha -r 160` (no paid API). Edit voice/rate in `render_iul_intro.py`.

Script + compliance notes: `video-src/SCRIPT.md`.

## Aesthetic constraints

- Hand-drawn ink on off-white board
- Gold accent only (`#C9A96E` / `#8F6D34`)
- No stock footage / clip-art / corporate explainer kit
