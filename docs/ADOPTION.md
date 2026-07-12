# ADOPTION

How the canonical ATOM design system was applied to this app.

## Constraints honoured

- **All security / red-team content, routes, workflows, and behaviour were
  preserved.** No view, data set, credential handling, or interaction was
  removed. The change is a visual-identity re-skin plus low-risk bug fixes.
- **Red stays a severity semantic.** Teal (`#00F0DF`) became the single identity
  accent for all chrome; red (`#f0596b`) was confined to genuine risk signals.

## Architecture

This is a **single-file static app** (`index.html`) with no bundler. The design
system is therefore applied directly:

- Tokens + component styles live in the one `<style>` block, mirroring the
  canonical `globals.css` token ladder (teal, surfaces, functional colors,
  motion, focus ring, traffic-light vars).
- The orbital mark is inline SVG so it inherits tokens and animates via CSS.
- No runtime dependency was added; `gsap` and `chart.js` remain CDN-loaded.

## Low-risk fixes made during QA

1. **Broken navigation tabs** — the `redteam` tab was empty and the `killchain`
   tab had a second icon + the "Red Team" label spliced onto it. Reconstructed
   both tabs.
2. **Malformed document tail** — `</html` was unterminated and a stray
   `#v-killchain` fragment (with a leaked `${i}` template literal) sat outside
   `<html>`. Closed the document and relocated a clean kill-chain view inside
   `<main>`.
3. **Kill-chain route** — `showV('killchain')` had no in-page view target (the
   real markup was the orphaned fragment). Added a proper `#v-killchain` view
   hosting `#kc-chain-inner`, removed the dead off-canvas `#kc-panel`
   (eliminating a duplicate id), and wired `showV()` to call `buildKC()`.
4. **Corrupted Architecture / Dev Hub markup** — stray text tails
   (`ub">Streaming…`, `-->kpi-val">48…`) were repaired and the API
   Services / Quickstart block re-parented into the Dev Hub view.
5. **Fatal JS syntax errors** — two single-quoted strings in the boot sequence
   contained literal newlines (invalid JS that broke the entire script).
   Replaced with `\n` escapes.
6. **Mobile** — added a bottom navigation bar and a `≤760px` scroll fix.

## Verification

Run `npm test` — the teal drift guard plus `node --test` design-system tests.
