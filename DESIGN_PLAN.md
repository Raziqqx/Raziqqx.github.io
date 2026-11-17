# Design plan (redesign, 2026-11-17)

The grey-paper, one-long-page design was rejected. Brief from the user: distinctive fonts (no Inter, Roboto,
Arial, system, Space Grotesk, IBM Plex, Archivo), one committed palette in CSS variables with dominant colour
and sharp accents, one orchestrated page-load moment, atmospheric backgrounds tied to the subject, and a
multi-page site with clear buttons. Subject: a student engineer whose work is robots, port logistics
simulation, LiDAR, path planning, trading-system C++, banking ledgers and AI-security tooling.

## Three concepts

**A. Cyanotype planner (picked).** The page is a planner's map.
- Palette: Prussian field `#123e66`, deep field `#0b2c4a`, chalk `#eef3f7`, chalk-2 `#b9cbdc`,
  path amber `#ffb627`, goal orange `#ff6a3d` (markers only, never text).
- Type: Big Shoulders Display (condensed, from Chicago street signage; port and yard signage feel) for
  headings and numbers; Atkinson Hyperlegible for body; Martian Mono for repo names, code and sources.
- Layout: a header with three destinations; home is a split hero (name left, grid map right), then four
  highlighted projects in an uneven grid; projects index grouped by area with jump buttons.
- Memorable element: the hero grid runs a real A* search when the site is built. On load the expanded
  cells flood out in the order the search visited them, then the amber path draws and a robot drives it.
  The 404 page runs the same search with the goal walled off: it floods and finds no path.

**B. Container yard.** Corrugated container steel.
- Palette: ISO blue `#1d4e89`, rust `#a63d2a`, dock yellow `#f2b705`, asphalt `#2b2d2f`, white `#f4f6f8`.
- Type: Big Shoulders Stencil for headings, Overpass for body.
- Layout: projects as containers stacked in yard bays, each with a BIC-style code.
- Memorable element: ribbed container doors (repeating gradients) that swing open into a case study.
- Rejected: it ties every project to the port simulator; the ledger and the security work look dressed up.

**C. Gruvbox editor.** A warm IDE theme.
- Palette: `#282828`, `#ebdbb2`, `#fe8019`, `#b8bb26`, `#83a598`.
- Type: Recursive, animating its MONO axis from sans to mono on load.
- Layout: a file-tree nav, projects as open tabs, line-number gutter.
- Rejected: the "terminal portfolio" is a common student trope, and long case studies read worse dressed as
  source files.

## Why A
Path planning, LiDAR and the port twin all show a world as a grid or a map with a route through it. That is the
shared picture across his strongest work, so the site uses it. The search is computed rather than drawn: the
number of expanded cells under the hero comes from running the code at build time, which fits a site whose rule is
"every number comes from running something".

## Check against the generic defaults
- Not the near-black + one acid accent: the field is a saturated mid blue, with two warm accents that have
  separate jobs (amber = route and primary action, orange = goal/robot marker and caveat flag).
- Not cream + serif, not broadsheet hairlines, not the SaaS card kit: tiles have no shadows; images get a
  LiDAR-style detection box (amber corner brackets) instead of a rounded card.
- No all-caps eyebrows, no middle-dot meta strings, no arrows appended to buttons, no 01/02/03 numbering
  (projects are not a sequence). Mono is used for identifiers (repo names, file paths, code), where it carries
  meaning, not as a label style.
- Motion: one load sequence on the hero (and on the 404). The old per-section scroll reveals and the reading bar
  are removed: they don't belong to the planner idea.

## Tokens
- Background: the field with a 24 px chalk grid at 6 % alpha, a lighter cobalt glow top-left and a deeper wash at
  the bottom (layered gradients), so the page reads as a lit chart table rather than a flat fill.
- Scale: 1.25 ratio from an 18 px Atkinson body; headings in Big Shoulders 800 sized by clamp(); numbers in Big
  Shoulders 700 amber.
- Alignment: left aligned throughout; measure under 70 ch.
- One theme only (dark-on-blue). Contrast: chalk on field 9.9:1, chalk-2 on field 6.6:1, amber on field 6.3:1,
  field-deep on amber 8.1:1; orange on field 3.9:1, so orange is never text (computed by script; see DECISIONS.md).
