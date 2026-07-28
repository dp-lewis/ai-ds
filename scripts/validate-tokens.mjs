#!/usr/bin/env node
/*
 * Token contract check.
 *
 * Every brand must define the FULL colour set for both light and dark. A
 * missing colour is not a visible error — it silently falls back to the
 * :where(:root) light default, so `tabloid` dark forgetting --ds-color-fg
 * yields black text on a black ground. That class of bug is invisible in a
 * diff and easy to miss by eye, which is why it is checked mechanically.
 *
 * Only colour is mandatory. Type, shape, and space overrides are optional by
 * design — wireframe deliberately inherits the base space scale.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tokensPath = join(root, 'src/styles/tokens.css');
const themesDir = join(root, 'src/styles/themes');

/** Collect `--ds-*` custom property names declared in a block of CSS text. */
function declaredTokens(css) {
  return new Set(css.match(/--ds-[a-z0-9-]+(?=\s*:)/g) ?? []);
}

/**
 * Extract the body of the first rule whose selector matches `predicate`.
 * Deliberately simple: these files are flat, hand-written token blocks with
 * no nesting, so a brace-counting parse would be overkill.
 */
function ruleBody(css, predicate) {
  const rules = css.split('}');
  for (const rule of rules) {
    const [selector, body] = rule.split('{');
    if (selector && body && predicate(selector.trim())) return body;
  }
  return null;
}

const tokensCss = readFileSync(tokensPath, 'utf8');
const baseBody = ruleBody(tokensCss, (s) => s.includes(':where(:root)'));

if (!baseBody) {
  console.error('✗ Could not find the :where(:root) block in tokens.css.');
  process.exit(1);
}

// The required set is every colour token the base layer declares.
const required = [...declaredTokens(baseBody)]
  .filter((name) => name.startsWith('--ds-color-'))
  .sort();

if (required.length === 0) {
  console.error('✗ No --ds-color-* tokens found in tokens.css.');
  process.exit(1);
}

const themeFiles = readdirSync(themesDir)
  .filter((file) => file.endsWith('.css'))
  .sort();

if (themeFiles.length === 0) {
  console.error(`✗ No theme files found in ${themesDir}.`);
  process.exit(1);
}

const failures = [];

for (const file of themeFiles) {
  const brand = file.replace(/\.css$/, '');
  const css = readFileSync(join(themesDir, file), 'utf8');

  // Light lives in [data-theme='brand']; dark in the same selector plus
  // [data-mode='dark']. Match on the mode attribute to tell them apart.
  const lightBody = ruleBody(
    css,
    (s) => s.includes(`data-theme='${brand}'`) && !s.includes('data-mode'),
  );
  const darkBody = ruleBody(
    css,
    (s) => s.includes(`data-theme='${brand}'`) && s.includes("data-mode='dark'"),
  );

  for (const [mode, body] of [
    ['light', lightBody],
    ['dark', darkBody],
  ]) {
    if (!body) {
      failures.push(`${brand} / ${mode}: no matching selector block found`);
      continue;
    }

    const present = declaredTokens(body);
    const missing = required.filter((name) => !present.has(name));

    if (missing.length > 0) {
      failures.push(`${brand} / ${mode}: missing ${missing.join(', ')}`);
    }
  }
}

const combinations = themeFiles.length * 2;

if (failures.length > 0) {
  console.error(`✗ Token contract violations:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(
    `\n${required.length} colour tokens are required in each of ${combinations} brand/mode combinations.`,
  );
  process.exit(1);
}

console.log(
  `✓ ${required.length} colour tokens present in all ${combinations} brand/mode combinations ` +
    `(${themeFiles.map((f) => f.replace(/\.css$/, '')).join(', ')}).`,
);
