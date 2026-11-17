# Decisions

## Content
1. **Ten featured projects, two "other work" rows, none dropped.** cpp-latency-lab and seam-carving both
   have READMEs and both built cleanly from a fresh shallow clone (CMake + Ninja, Release; OpenCV 4.6 present).
2. **Every number carries a `source`** (repo-relative path) in `src/data/projects.json`, shown under the
   number on the page. When the README derives a figure (median of 3 runs, a percentage change), the source
   names the README section and the raw file. `npm run verify:data` checks that every number in a value
   appears in its source files and that every code excerpt matches its file verbatim at the stated lines.
   The number check is necessary, not sufficient: it catches typos and invented values, not a number quoted
   against the wrong row.
3. **Caveats sit next to the numbers** (synthetic LiDAR data, mock LLMs for threat-hunter and red-team, mock
   generator for RAG, 2D simulator for ROS 2, laptop single instance for the ledger), not in a footnote.
4. **Code excerpts instead of images** for agentic-threat-hunter (no image in the repo), Limit_order_book and
   Market_Data_Feed_Handler_UDP (GitHub only, no screenshots). Each excerpt shows the decision the project is
   about: the registration-time allow-list, the O(1) unlink, the SPSC claim/publish pair.
5. **No detail pages for Limit_order_book and Market_Data_Feed_Handler_UDP.** Their READMEs have strong
   results tables, but the in-depth write-ups live in NOTES.txt, outside the content sources this site may
   use (README, docs/FEATURES.md, docs/DESIGN.md, results/). Their cards link to the README instead.
6. **"Build and run" instead of "See it working"** for those two: their READMEs have no "See it working"
   section, so the link points to the section that exists.
7. **seam-carving names no teammates.** It says it was a six-person assignment and which part was mine
   (milestone 1 in its README). Other people's names stay off the site.
8. **No contact email or phone**: GitHub and LinkedIn only. The verify script also scans the data for
   anything that looks like an email address.

## Design
See DESIGN_PLAN.md for tokens and the critique of the first draft. In short: cool concrete-grey paper,
harbour-navy ink, hazard yellow used only as a fill; one type family (Archivo) with its width axis as the
headline treatment; full-width project sheets instead of a card grid; a readings table with sources instead
of stat tiles.

## Tech
9. **Astro 4.16.19** (last 4.x; supports Node 18.17+), no integrations, plain CSS in one global file plus
   component-scoped styles. Static output, `site: https://raziqqx.github.io`, no `base`.
10. **Fonts self-hosted** via Fontsource packages (Archivo variable with the width axis, IBM Plex Mono 400),
    so the page makes no third-party requests and has no font CDN dependency.
11. **Media prepared by a script** (`npm run media`): copies files from the sibling repos, makes reduced-motion
    stills (SMIL animations stripped from the MAPF replay; first GIF frame for ROS 2), checks the 1.5 MB
    budget, and writes pixel sizes to `src/data/media-meta.json` so images reserve their space. The
    committed media is what the deploy uses; CI does not need the sibling repos.
12. **Reduced motion** uses `<picture><source media="(prefers-reduced-motion: reduce)">` to serve the still,
    because SMIL and GIF animations cannot be stopped from CSS.
13. **Themes follow the system setting** (`prefers-color-scheme`); no toggle, so no JavaScript is needed
    on the page at all.

## Verification (M4)
14. **Screenshots by playwright-core** driving the Chromium already in `~/.cache/ms-playwright`
    (`CHROME=... npm run screenshots` with `npm run preview` running). Saved in `screenshots/`.
15. **Fixed from screenshots:** a 624 px horizontal overflow at 360 px (grid items' default `min-width: auto`
    let the code excerpt widen the page; set `min-width: 0`), and the detail-page gallery was capped at the
    text measure, which made dense plots unreadable; it now uses the wider media width.
16. **Lighthouse** 100 for accessibility (and the other three categories) on the home page and two case
    studies; see results/lighthouse.md. Dark-theme contrast was computed by script (DESIGN_PLAN.md).

## Deploy (M5)
17. **GitHub Actions → Pages** with the official upload-pages-artifact / deploy-pages actions, Node 20 in CI
    (Astro 4.16 supports it; local builds use Node 18.19). Not pushed: the repo `Raziqqx/Raziqqx.github.io`
    has to be created by the user and Pages set to "GitHub Actions".
