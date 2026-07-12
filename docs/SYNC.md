# SYNC

Keeping this app aligned with the canonical ATOM design system.

## Source of truth

- Repo: `ATOM-Nirmata-Holdings-Brand-Design-Standard`
- Pinned at: version **2.2.2**, commit **4dc80b9**
- Canonical token file: `src/app/globals.css`
- Canonical governance test: `src/tokens/color-governance.test.ts`

## When the canonical system releases a new version

1. Diff the canonical `globals.css` token ladder against this app's `<style>`
   `:root` block. Focus on the teal ladder, surface ladder, functional colors,
   radius/motion vars, and the focus-ring recipe.
2. Update the tokens in `index.html` to match. Because usage flows through CSS
   variables, most updates are token-only and require no component edits.
3. Re-sync the orbital mark geometry and the endorsement wording if the brand
   changed them.
4. Bump the version metadata in **all three** locations (see
   [ATOM-DESIGN-SYSTEM.md](./ATOM-DESIGN-SYSTEM.md)): the `<meta>` tag, the
   `.f-ver` footer chip, and `package.json`'s `atomDesignSystem`.
5. Run `npm test`. The teal drift guard fails the build if any non-canonical
   teal/cyan hex slips in or if `--teal-core` is defined anything other than
   exactly once.

## Drift guard

`scripts/teal-drift-guard.mjs` enforces:

- `--teal-core:#00f0df` is declared **exactly once** (single source of truth).
- No near-teal / cyan drift hex appears anywhere; the only teal-family literals
  permitted are the canonical ladder (`#00f0df`, `#5cf7ec`, `#00b6ab`,
  `#00766e`). Everything else must inherit via `--teal-*`.

It runs locally (`npm run guard`) and in CI on every push and pull request.
