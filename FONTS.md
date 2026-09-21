# Mubiey Studio Fonts

Mubiey Studio uses installed/browser-native font families only; no font files or third-party font assets are bundled.

- `Georgia` and `Times New Roman`: Microsoft Core Fonts / Monotype system fonts. Their use is governed by the operating system license; Mubiey does not redistribute font files.
- `Arial` and `Verdana`: Microsoft system fonts. Their use is governed by the operating system license; Mubiey does not redistribute font files.
- `Segoe Script` and `Brush Script MT`: optional installed system fonts used as graceful script fallbacks. Their use is governed by the operating system license; Mubiey does not redistribute font files.
- `cursive`: browser generic fallback selected by the user's platform.

The app falls back to serif or sans-serif families when an optional font is unavailable. Arabic and Malayalam text remain editable and use the browser's installed script-capable fallback fonts; no webfont shaping asset is currently bundled.
