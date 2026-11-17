# Design plan

Subject: a systems engineer's project portfolio (fleet robotics, port logistics simulation, LiDAR,
core banking, security agents, market-data C++). Audience: technical hiring managers in Singapore who
skim. Job: in under a minute, show what each project is, what it proves, and where the code is.

## Pass 1 (first draft)

- Color: near-black background, one bright accent, white text.
- Type: a serif display for the name, a sans for body, monospace for metric labels.
- Layout: hero with name, big stat row ("8 projects / 5 languages"), then a 2-column grid of rounded
  project cards with a screenshot on top, tags, and three big-number stat tiles.

## Critique of pass 1 against the skill's generic defaults

| Draft choice | Matches default | Revision |
|---|---|---|
| Near-black + one bright accent | #2 (black + acid accent) | Cool concrete-grey paper and deep harbour-navy ink; the accent is used as a fill, not as text colour. |
| Serif display + sans + mono labels | #1 and #5 (mono for small data labels) | One family, Archivo, using its width axis as the type treatment: expanded for names, normal for body. Monospace only for real code excerpts. |
| "8 projects / 5 languages" stat row | the big-number hero the skill warns about | Dropped. Those numbers say nothing about quality. |
| Identical rounded cards in a grid | #4 (SaaS-card kit) | Each project is a full-width sheet separated by a rule, text left, evidence right. No shadows, one small radius on media frames only. |
| Big-number stat tiles per card | default stat treatment | A small "readings" table: value with unit, what was measured, and the file it came from. The source path is the point: it makes every number checkable. |

## Final tokens

### Color

| token | light | dark | role |
|---|---|---|---|
| paper | #E8ECEA | #0F1B22 | page background (concrete grey / harbour night) |
| ink | #13212B | #E2E8E6 | text |
| ink-2 | #4F5D66 | #9FB0B8 | secondary text, captions |
| rule | #BFC8C6 | #2A3A44 | dividers, table lines, media frames |
| signal | #F2C200 | #F2C200 | hazard yellow, as a fill: reading bars, focus ring, the skip link, current page |
| link | #1B56A0 | #8EB9F2 | links |

Contrast (WCAG, computed with a script): ink/paper 13.8:1, ink-2/paper 5.7:1, link/paper 6.1:1,
ink on signal 9.8:1. Dark: ink 14.1:1, ink-2 7.8:1, link 8.6:1. Signal on light paper is only 1.4:1,
so yellow is never used alone as a line on the light theme: the focus ring is a two-tone ring
(3px ink outline with a yellow halo), and yellow fills always carry ink text.

### Type (reworked 2026-11-17 after user feedback)

The first build used Archivo at its expanded width (wdth 125, weight 800) for names and titles. The user
found it read as "weird and AI generated": stretched heavy wide headings are a template tell, and project
repo names in that face wrapped mid-word. Replaced with:

- **IBM Plex Sans** for all text, weights 400 / 500 / 600 only, normal width. An engineering face (IBM's,
  drawn for technical documentation) that suits the subject without performing it. Self-hosted through
  Fontsource, latin subset, `font-display: swap`.
- **IBM Plex Mono** (400) only for code excerpts, file paths and repo names, which are identifiers.
- One scale, ratio 1.25 from a 17px body: 13.6 (`--step--1`: captions, tags, labels, source lines) /
  17 (body, line-height 1.6, measure ≤ 68ch) / 21.25 (`--step-1`: h3, other-work names, reading values,
  summaries on case studies) / 26.6 (`--step-2`: project titles on phones, case-study section heads on
  desktop) / 33.2 (`--step-3`: project titles on desktop) / 41.5 (case-study h1 on desktop).
- Hero name: 600, tracking −0.022em, `clamp(2.25rem, 1.75rem + 2.2vw, 3.5rem)` (36px at 360, 56px at 1440),
  capped at 12em so "Muhammad Raziq / Bin Mohd Rafig" sets on two lines at both widths.
- Projects show a human title (`title` in projects.json) with the repo name as a small mono line under it,
  so nothing breaks mid-word. Headings use `text-wrap: balance`.
- Reading values: 600 at `--step-1` (`--step-0` under 420px), tabular figures.
- Sentence case everywhere. No all-caps labels, no eyebrows.

### Layout

Left-aligned throughout, one 12-column grid, max width 1240px, 16px gutter on phones.

```
HOME, ≥ 1000px
+---------------------------------------------------------------+
| Muhd Raziq                                     GitHub LinkedIn |
|                                                                |
| MUHD RAZIQ (expanded, huge)          +-----------------------+ |
| Systems software, measured.           | replay.svg: 20 robots | |
| 2-line plain intro                    | (real CBS plan)       | |
|                                       +-----------------------+ |
|---------------------------------------------------------------|
| terminal-digital-twin                 +-----------------------+ |
| one-line summary                      |   screenshot          | |
| C++20  OpenGL  ...                    |                       | |
| readings table (value | what | src)   +-----------------------+ |
| Read the case study / Code / See it working     caption        |
|---------------------------------------------------------------|
| ... 9 more sheets ...                                          |
|---------------------------------------------------------------|
| Other work: compact rows (name, one line, link)                |
| Footer: GitHub, LinkedIn, how numbers are sourced              |
+---------------------------------------------------------------+

HOME, 360px: single column; the visual follows the summary, readings follow the visual.

DETAIL PAGE
+---------------------------------------------------------------+
| back to all projects                                          |
| PROJECT NAME (expanded)                                       |
| summary; stack; links; data caveat if synthetic/mock          |
| media (full width of the text column + 2 cols)                |
| The problem / How it works / Key decision / Results (table)   |
+---------------------------------------------------------------+
```

### Principles

1. Evidence over adjectives: every number shows its unit and its source file; caveats (synthetic
   data, mock LLM) sit next to the numbers they qualify, not in a footnote.
2. One loud thing: the hazard-yellow signal (caveats, focus, reading-progress bar). Type is quiet and
   technical: Plex Sans at one scale, rules, grey paper, no shadows.
3. The hero shows a real output (the MAPF replay), not a decoration. It animates once per load cycle
   as SMIL; with reduced motion a static first frame is served instead.
5. Scroll reveals (added at the user's request): each sheet's text column rises in, then its media
   (slight scale), then its reading rows in sequence; a 3px yellow progress bar tracks the page. Opacity and
   transform only, 600ms ease-out, once per element; off under reduced motion and without JS.
4. Hazard yellow marks state and attention only: focus, the current page, the reading bar.

## Changes made while building

- **Hero: a project index instead of the MAPF replay.** The replay would have appeared twice (hero and the
  mapf card). The site's job is "what is each project, in under a minute", so the hero's right column is a
  table of contents (name and domain, linking to each sheet). Ambient motion is now only the MAPF replay and
  the ROS 2 GIF inside their own sheets, and both swap to stills under reduced motion.
- **Hazard yellow marks caveats.** A pale yellow block with a solid yellow edge holds each "synthetic data /
  mock model" note: caution is what the colour means on a quay. Values in readings are not highlighted.
- **Domain sits in its own narrow column** on wide screens (a title-block cell), and above the name on phones.
