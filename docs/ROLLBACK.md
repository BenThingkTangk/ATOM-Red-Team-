# ROLLBACK

The entire design-system adoption is a single-file change plus additive tooling
(`docs/`, `scripts/`, `tests/`, `package.json`, `vercel.json`, CI). Rolling back
is low-risk.

## Full rollback

The design system landed on the branch `feat/atom-design-system-v1` via one PR.
To revert everything:

```bash
git revert -m 1 <merge_commit_sha>
```

or, if not yet merged, simply close the PR — `main` is untouched.

## Partial rollback (keep bug fixes, drop the re-skin)

The visual identity is almost entirely contained in the single `<style>` block
of `index.html`. To restore the previous look while keeping the structural /
runtime / mobile bug fixes:

1. Restore the previous `<style>` block from git history:
   ```bash
   git show <previous_sha>:index.html
   ```
   and copy its `<style>…</style>` contents back over the current block.
2. Leave the HTML/JS fixes (navigation tabs, document tail, kill-chain view,
   boot-sequence JS syntax, mobile nav) in place — they are correctness fixes
   independent of the palette.

## Verifying a rollback

Run `npm test`. On a clean canonical adoption it passes; after a full rollback
to the pre-adoption state the design-system tests are expected to fail (that is
the signal the identity is gone). Remove `scripts/`, `tests/`, `package.json`,
and the CI workflow if a full rollback is intended to be permanent.

## Vercel

`vercel.json` declares a static, build-less deploy (`outputDirectory: "."`).
Removing it returns Vercel to auto-detection. Production is never auto-deployed
from a preview branch; only `main` promotes to production.
