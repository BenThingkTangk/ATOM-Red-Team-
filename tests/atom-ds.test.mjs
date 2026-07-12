import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

test('carries ATOM design-system version metadata', () => {
  assert.match(html, /<meta name="atom-ds-version" content="v1 · canonical 2\.2\.2 · 4dc80b9"\/>/);
  assert.match(html, /class="f-ver"[^>]*>ATOM DS v1 · canonical 2\.2\.2 · 4dc80b9/);
});

test('canonical teal is the single identity hue', () => {
  const defs = html.match(/--teal-core:\s*#00f0df/gi) || [];
  assert.equal(defs.length, 1, 'exactly one canonical --teal-core definition');
});

test('uses the official orbital atom mark (not the external raster logo)', () => {
  assert.ok(!html.includes('gemini_images'), 'external gemini PNG removed');
  const marks = html.match(/class="atom-mark"/g) || [];
  assert.ok(marks.length >= 2, 'orbital mark present in login and topbar');
  assert.match(html, /@keyframes orbitSpin/);
  assert.match(html, /class="orbits"/);
  assert.match(html, /class="nucleus"/);
});

test('displays the Nirmata Holdings endorsement', () => {
  assert.match(html, /a <b>Nirmata Holdings<\/b> company/);
  assert.match(html, /class="tb-endorse"[^>]*>a Nirmata Holdings company/);
});

test('canonical fontshare typography is loaded', () => {
  assert.match(html, /api\.fontshare\.com\/v2\/css\?f\[\]=cabinet-grotesk/);
  assert.match(html, /f\[\]=satoshi/);
  assert.ok(!/family=Orbitron/.test(html), 'legacy Orbitron webfont removed');
});

test('all eight navigable views exist exactly once', () => {
  for (const v of ['command', 'threatmap', 'intelligence', 'quantum', 'redteam', 'killchain', 'architecture', 'devhub']) {
    const occ = html.match(new RegExp(`id="v-${v}"`, 'g')) || [];
    assert.equal(occ.length, 1, `view v-${v} present exactly once`);
  }
});

test('kill-chain route is wired and self-contained (no duplicate ids, no template leak)', () => {
  assert.ok(!html.includes('id="kc-panel"'), 'dead collapsible kc-panel removed');
  const chain = html.match(/id="kc-chain-inner"/g) || [];
  assert.equal(chain.length, 1, 'single kc-chain-inner target for buildKC()');
  assert.ok(!html.includes('ab${i}'), 'no leaked template literal in markup');
  assert.match(html, /if\(v==='killchain'\)\s*buildKC\(\);/);
});

test('document terminates with a well-formed html close tag', () => {
  assert.match(html.trimEnd(), /<\/body>\s*<\/html>$/);
});

test('provides a mobile bottom-navigation with a handler', () => {
  assert.match(html, /class="mnav"/);
  assert.match(html, /function mnav\(el\)\{/);
});

test('restrained red is reserved for severity, not chrome identity', () => {
  // Legacy harsh decorative red must be gone; canonical severity red may remain.
  assert.ok(!/#FF0033/i.test(html), 'legacy decorative red #FF0033 removed');
  assert.ok(!/rgba\(255,\s*0,\s*51/.test(html), 'legacy decorative red rgba removed');
});

test('inline JavaScript parses without syntax errors', () => {
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  const tmp = path.join(os.tmpdir(), `atom-inline-${process.pid}.js`);
  writeFileSync(tmp, scripts.join('\n;\n'));
  try {
    execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' });
  } finally {
    rmSync(tmp, { force: true });
  }
});

test('teal drift guard script passes', () => {
  execFileSync(process.execPath, [path.join(root, 'scripts', 'teal-drift-guard.mjs')], { stdio: 'pipe' });
});
