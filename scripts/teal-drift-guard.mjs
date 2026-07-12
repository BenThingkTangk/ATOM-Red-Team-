#!/usr/bin/env node
/**
 * ATOM teal drift guard.
 *
 * The canonical ATOM identity teal is a single hue family. The core token
 * `--teal-core:#00f0df` must be declared exactly once (single source of truth),
 * and no near-teal / cyan drift hex (mismatched cyans standing in for teal)
 * may appear anywhere in the shipped HTML. All teal usage must flow through
 * the canonical ladder (--teal-core/bright/dim/deep) via CSS variables.
 *
 * Exit code 0 = clean, 1 = drift detected. Safe to run in CI.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'index.html');
const html = readFileSync(file, 'utf8');

// The canonical teal ladder — the ONLY teal-family hexes permitted anywhere.
const CANONICAL = new Set(['#00f0df', '#5cf7ec', '#00b6ab', '#00766e']);

// Teal / cyan family hex literals we govern (bright greenish-cyans).
const TEAL_HEX = /#(?:00f[0-9a-f]{3}|00e[0-9a-f]{3}|0ff[0-9a-f]{3}|00d[0-9a-f]{3}|00c[89a-f][0-9a-f]{2}|1[0-9a-f]f[0-9a-f]e[0-9a-f]|2[0-9a-f]f[0-9a-f]e[0-9a-f]|5cf7ec|00b6ab|00766e)/gi;

const errors = [];

// 1) Single source of truth for the core token.
const coreDefs = html.match(/--teal-core:\s*#00f0df/gi) || [];
if (coreDefs.length !== 1) {
  errors.push(`Expected exactly one canonical "--teal-core:#00f0df" definition, found ${coreDefs.length}.`);
}

// 2) No non-canonical teal/cyan drift hexes anywhere.
const lines = html.split('\n');
lines.forEach((line, i) => {
  const matches = line.match(TEAL_HEX);
  if (!matches) return;
  for (const raw of matches) {
    if (!CANONICAL.has(raw.toLowerCase())) {
      errors.push(`Line ${i + 1}: non-canonical teal/cyan hex "${raw}" — use the --teal-* ladder instead.`);
    }
  }
});

if (errors.length) {
  console.error('✗ ATOM teal drift guard FAILED:\n' + errors.map(e => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('✓ ATOM teal drift guard passed — canonical teal (#00f0df) is the single identity hue.');
