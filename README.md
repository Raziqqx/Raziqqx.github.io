# Raziqqx.github.io

Portfolio site for Muhd Raziq: https://raziqqx.github.io. Astro 4, plain CSS, no client-side JavaScript.

- Content: `src/data/projects.json` (one entry per repo, every number with its `source` file).
  Media: `public/media/<repo>/`. Adding a project means editing those two places only.
- `npm run dev` / `npm run build` / `npm run preview`
- `npm run verify:data`: checks every number against its source file and every code excerpt against
  its file and lines (needs the project repos next to this folder, and clones of the GitHub-only ones).
- `npm run media`: re-copies media from the sibling repos and makes reduced-motion stills.
- `CHROME=/path/to/chrome npm run screenshots` (with the preview server running): screenshots at
  360 px and 1440 px into `screenshots/`, plus overflow, reduced-motion and keyboard-focus checks.
- Deploy: `.github/workflows/deploy.yml` publishes `dist/` to GitHub Pages on every push to `main`.

Design tokens and rationale: `DESIGN_PLAN.md`. Decisions: `DECISIONS.md`.
