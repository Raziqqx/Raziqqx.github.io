# Portfolio site: rules for every session

A personal portfolio site for Muhammad Raziq Bin Mohd Rafig (GitHub: Raziqqx). Its single job: let a recruiter or engineer
see in under a minute what each project is, what it proves, and click through to the repo.

## Design
- Use the `frontend-design` skill (installed at `~/.claude/skills/frontend-design/`) for every visual
  decision. Follow its two-pass process: write the token plan (palette, type, layout, principles) into
  `DESIGN_PLAN.md`, check it against the generic defaults that skill lists, then build.
- Subject: systems/robotics/security/backend engineering. The audience is technical hiring managers in
  Singapore (logistics, defence/public safety, banking). Let the look come from that subject, not a template.
- Quality floor: responsive to 360px, visible keyboard focus, `prefers-reduced-motion` respected, light
  and dark themes, Lighthouse accessibility ≥ 95. Check by running it, not by assuming.

## Stack
- Static site, no backend. Astro 4 (works with the installed Node 18.19) + plain CSS. No UI kit.
- Deploy target: GitHub Pages at https://raziqqx.github.io (repo `Raziqqx.github.io`, user decision
  2026-11-17) via a GitHub Actions workflow. Set Astro `site` to that URL, no `base` path.
- Project data lives in `src/data/projects.json` (one entry per repo). Pages render from it; adding a
  project means editing only that file plus dropping its media into `public/media/<repo>/`.

## Which projects to show
Featured (full cards, in this order — strongest first):
1. terminal-digital-twin (C++20, OpenGL) — `docs/screenshot.png`, `results/m2_policy_comparison.png`
2. mapf-fleet-planner (C++20, pybind11) — `docs/replay.svg`, `results/bench_*.png`
3. ros2-autonomy-stack (ROS 2 Jazzy, C++) — `docs/demo.gif`
4. lidar-perception-pipeline (C++20) — `docs/viewer.png`
5. core-banking-ledger (Java 21, Spring Boot) — `docs/grafana-dashboard.png`, `docs/swagger-ui.png`
6. research-rag-platform (Python, React) — `docs/screenshot-ask.png`
7. agentic-threat-hunter (Python, MCP) — no image yet: use a short terminal/code snippet instead
8. agent-redteam-eval (Python) — `docs/report_screenshot.png`
Secondary ("Other work", compact rows, in this order): Limit_order_book, Market_Data_Feed_Handler_UDP
(moved from featured, user decision 2026-11-17), cpp-latency-lab, seam-carving (team assignment: say so). Before listing each, open its
GitHub README; drop any that has no README or doesn't build.
Never show: DATA-STRUCT-HW-2 (coursework), forks, empty repos.

Local copies of the 8 featured repos are in `../<repo-name>/`; the others are only on GitHub
(`https://github.com/Raziqqx/<repo>`).

## What each project card shows (the "snippet")
- Name, one-line plain-English summary (what it does, not how), stack tags.
- One visual: screenshot/GIF/plot copied from the repo, or a short (≤ 15 line) real code excerpt
  taken verbatim from the repo, with a file path caption, when there's no good image.
- 2–3 headline results with their unit, each taken from that repo's `results/` or README.
- Links: GitHub repo, and the README's "See it working" section.
- A project detail page per featured project: problem, approach, key design decision, results, media.

## Content rules
- Every number on the site must appear in that repo's `results/` or README. No invented metrics,
  no "blazing fast", no star counts. If a project runs on synthetic data or a mock LLM, say so plainly
  (lidar: synthetic data; threat-hunter, redteam-eval, rag: mock LLM/generator).
- Source material: each repo's README, docs/FEATURES.md, docs/DESIGN.md and results/.
- `../study/` is private. Never copy its files or quote GUIDE/INTERVIEW_NOTES/TARGET_ROLES on the site,
  and never mention target employers. RESUME_BULLETS.md may inform wording only.
- No email address or phone number in the page source. Contact links: GitHub
  (https://github.com/Raziqqx) and LinkedIn (https://www.linkedin.com/in/muhammadraziqbmr/).
- Copy in sentence case, plain verbs, no filler (see the writing section of the frontend-design skill).

## Working rules
- Keep decisions in `DECISIONS.md`. Commit at milestones; no Co-Authored-By lines.
- Milestones: M1 design plan + data file; M2 home page + cards; M3 detail pages; M4 a11y/perf pass with
  screenshots at 360px and 1440px; M5 Pages deploy workflow.
- Before calling a milestone done, run `npm run build` and view the result in a browser/screenshot.
