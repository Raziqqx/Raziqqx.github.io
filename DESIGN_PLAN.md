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

### Type

- Archivo (variable, wght 100–900, wdth 62–125), self-hosted through Fontsource.
  - Name and project titles: wdth 125, weight 800, tight tracking. This is the one loud thing.
  - Body: wdth 100, weight 400, 1.0625rem / 1.55, measure ≤ 68ch.
  - Reading values: wdth 87, weight 700, tabular figures.
- IBM Plex Mono only inside code excerpts and for file paths in captions (they are code).
- Scale (ratio 1.25 from 17px): 13.6 / 17 / 21.25 / 26.5 / 33 / 41.5; hero name clamps 40–88px.
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
2. One loud thing: the expanded-width name type. Everything else is quiet: rules, grey paper, no shadows.
3. The hero shows a real output (the MAPF replay), not a decoration. It animates once per load cycle
   as SMIL; with reduced motion a static first frame is served instead. That is the only ambient motion.
4. Hazard yellow marks state and attention only: focus, the current page, the reading bar.
