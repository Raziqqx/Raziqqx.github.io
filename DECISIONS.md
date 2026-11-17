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
Superseded by the redesign below (2026-11-17). The first design was cool grey paper, navy ink and Archivo,
later IBM Plex, on one long page.

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

## Typography and motion rework (2026-11-17, user feedback)
18. **Archivo expanded dropped for IBM Plex Sans 400/500/600 + Plex Mono.** The wide 800-weight headings read
    as generated and broke repo names mid-word. Plex is a documentation face from an engineering company; one
    1.25 scale (17px body) now covers every page. Details in DESIGN_PLAN.md, Type.
19. **Human project titles** (`title` in projects.json) with the repo name as a mono subtitle. Titles are plain
    descriptions of what each repo is; "other work" rows keep repo names (they are compact links to GitHub).
20. **Display name is "Muhammad Raziq Bin Mohd Rafig"** (user request). Hero name sized to sit on two lines.
21. **Scroll reveals via IntersectionObserver, not CSS scroll timelines**: works in every current browser and
    each element animates once. The hidden start state is behind `.js` on `<html>` (set by an inline head
    script only when IntersectionObserver exists) and inside `prefers-reduced-motion: no-preference`, so
    no-JS and reduced-motion visitors get the full page with no motion. The hero is not animated, so the
    first paint (and LCP) is unchanged. The skill warns that per-section fade-ups are a generic default;
    the user asked for them, so they are kept short (18px travel, 600ms) and run once.
22. **Screenshots renamed**: `-top` is the viewport at scrollY 0 (the old `-fold` shots were mislabeled),
    `-mid` is the ROS 2 sheet after its reveals, `-full` is the whole page after scrolling through it.
    Captured against `python3 -m http.server -d dist`.

## Redesign: "Cyanotype planner" (2026-11-17, user rejected the grey-paper design)
23. **Concept A of three** (DESIGN_PLAN.md): a Prussian-blue planner map. Big Shoulders Display (headings,
    numbers), Atkinson Hyperlegible (body), Martian Mono (repo names, paths, code), all self-hosted via
    Fontsource 5.3.0. Fontsource 5 maps `pkg/latin-700` to the CSS file, so imports omit `.css`.
24. **One theme, no light mode.** The user's brief allows it when the concept commits to one; the blue field is
    the concept. This overrides the "light and dark themes" line in CLAUDE.md for this design. Contrast was
    computed by script: chalk 9.9:1, chalk-2 6.6:1 and amber 6.3:1 on the field; orange (3.9:1) is used only
    for markers, never text.
25. **The hero runs a real A\* search at build time** (`src/components/PlannerGrid.astro`) and animates the
    expanded cells in search order, then the route and a robot. The caption's counts (cells expanded, path
    steps) come from that run, so they follow the site's rule that every number is produced by code. The 404
    page walls off the goal and shows the search failing.
26. **Motion is one CSS load sequence** (`.rise` with `--i` stagger, the planner animation). The
    IntersectionObserver scroll reveals and reading bar were removed: they did not fit the concept. No
    JavaScript ships at all; reduced motion shows the finished state (0 running animations, checked).
27. **Multi-page IA**: `/`, `/projects/` (grouped by a new `area` field with jump buttons, then other work),
    `/projects/<slug>/` (sticky headline numbers, full results, prev/next wrapping around, back button),
    `/about/`, 404. Home highlights the four entries with `highlight: true`.
28. **Areas**: Robots and autonomy (MAPF, ROS 2, LiDAR), Logistics and finance systems (terminal twin, ledger),
    AI and security (RAG, threat hunter, red-team). Declared in `areas`; verify-data checks each project's area.
29. **About uses only repo facts**: the tagline, the areas, language counts computed from stack tags, and how
    the work is checked (tests, reproducible numbers, stated limits, DESIGN.md per repo). `person.education`
    exists and is empty; the Education block renders only when it has entries.
30. **Detection-box frames**: images and code get amber corner brackets (CSS mask on one pseudo-element), like
    the LiDAR viewer's boxes, instead of rounded cards with shadows. Thumbnails letterbox to 16:10.
31. **Checks**: `npm run build`, `npm run verify:data` pass; `npm run screenshots` reports 0 px horizontal
    overflow on all five pages at 360 and 1440; Lighthouse 11.7.1 desktop: accessibility 100 on home, projects,
    about and one case study (results/lighthouse.md). verify-data needs the GitHub-only repos cloned to
    /tmp/claude-1000/portfolio-src (re-cloned for this run).
