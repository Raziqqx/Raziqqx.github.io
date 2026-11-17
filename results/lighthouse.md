# Lighthouse (11.7.1, desktop defaults, headless Chromium, against `astro preview`), 2026-11-17

| page | performance | accessibility | best practices | SEO |
|---|---|---|---|---|
| / | 100 | 100 | 100 | 100 |
| /projects/terminal-digital-twin/ | 100 | 100 | 100 | 100 |
| /projects/agentic-threat-hunter/ | 100 | 100 | 100 | 100 |

Other checks from `npm run screenshots` (scripts/screenshots.mjs):
- Horizontal overflow at 360 px and 1440 px: 0 px on all three pages (light and dark).
- Reduced motion: the page resolves to `replay-still.svg` and `demo-still.png`.
- Keyboard: the first Tab stop is "Skip to content"; every stop checked shows the 3 px outline with the yellow halo.
