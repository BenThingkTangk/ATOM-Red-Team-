# ATOM Design System — Red Team adoption

This app adopts the canonical **ATOM design system** (a Nirmata Holdings brand
standard) as its visual identity. This document records what was adopted, how
to keep it in sync with the canonical source, and how to roll back.

## Version metadata

| Field | Value |
| --- | --- |
| Local design-system version | `v1` |
| Canonical source repo | `ATOM-Nirmata-Holdings-Brand-Design-Standard` |
| Canonical version | `2.2.2` |
| Canonical commit | `4dc80b9` |
| Proven pilot | `BenThingkTangk/atom-sales-os` PR #2 |

The version string is embedded in three places and must stay consistent:

- `<meta name="atom-ds-version">` in `index.html` `<head>`
- the `.f-ver` chip in the footer
- `atomDesignSystem` in `package.json`

## What the identity looks like

- **Dark-first surfaces** — layered near-black surface ladder (`--bg-base` →
  `--bg-hover`).
- **Canonical teal `#00F0DF`** is the single shared identity accent used for all
  chrome: borders, focus rings, brand mark, active navigation, links, glows.
  It is declared once as `--teal-core` and consumed everywhere via the
  `--teal-*` ladder.
- **Restrained red is a severity/risk semantic only** — canonical error red
  `#f0596b`. It appears exclusively on genuine risk signals: the MITRE heatmap
  intensity ladder (`.h0`–`.h5`), critical pills (`.p-crit`), risk KPIs
  (`.kr .kpi-val`), attack-vector fills (`.pf-r`), the active kill-chain node
  pulse (`kc-pulse`), the live-threat map arc, and the primary attack series in
  the threat chart. Red is **never** used as decorative wallpaper and never
  dilutes severity meaning.
- **Typography** — Cabinet Grotesk (display), Satoshi (body), JetBrains Mono
  (mono), served from Fontshare.
- **Official orbital atom mark** — inline SVG (three rotated orbits, pulsing
  nucleus, orbiting electron) with `prefers-reduced-motion` support; replaces
  the previous external raster PNG.
- **Traffic-light window controls** on terminal/evidence panels — a meaningful
  macOS-style chrome for the reconstruction/log surfaces.
- **Accessibility** — visible `:focus-visible` ring, `forced-colors` support,
  reduced-motion fallbacks, ≥44px touch targets on inputs and controls.
- **Nirmata Holdings endorsement** — "a Nirmata Holdings company" on the login
  screen and in the topbar.

See [ADOPTION.md](./ADOPTION.md), [SYNC.md](./SYNC.md), and
[ROLLBACK.md](./ROLLBACK.md).
