# Lighthouse

## After the typography and motion rework (11.7.1, desktop preset, headless Chromium, `python3 -m http.server -d dist`), 2026-11-17

| page | performance | accessibility | best practices | SEO |
|---|---|---|---|---|
| / | 99 | 100 | 100 | 100 |

Checks from `npm run screenshots` on the same build: horizontal overflow 0 px on home and the
terminal-digital-twin case study at 360 and 1440 px, light and dark; every reveal target visible after
scrolling; 0 reveal targets hidden at load with reduced motion and with JavaScript disabled; reduced motion
resolves to `replay-still.svg` and `demo-still.png`; first Tab stop is the skip link, all checked stops show
the 3 px outline.

## Earlier run
Lighthouse (11.7.1, desktop defaults, headless Chromium, against `astro preview`), 2026-11-17

| page | performance | accessibility | best practices | SEO |
|---|---|---|---|---|
| / | 100 | 100 | 100 | 100 |
| /projects/terminal-digital-twin/ | 100 | 100 | 100 | 100 |
| /projects/agentic-threat-hunter/ | 100 | 100 | 100 | 100 |

Other checks from `npm run screenshots` (scripts/screenshots.mjs):
- Horizontal overflow at 360 px and 1440 px: 0 px on all three pages (light and dark).
- Reduced motion: the page resolves to `replay-still.svg` and `demo-still.png`.
- Keyboard: the first Tab stop is "Skip to content"; every stop checked shows the 3 px outline with the yellow halo.
