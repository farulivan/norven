#!/usr/bin/env node
// I sum every .js and .css file in dist/_astro/ and compare the totals against
// bundle-budget.json. The script fails non-zero when over budget. Pass --write
// to rewrite the budget file to the current totals after intentional growth.
//
// I rejected size-limit, bundlewatch, and bundle-stats here: each needs a config
// language or an account token for an extra check that 60 lines of Node cover.
// The point of the gate is "did the bundle suddenly bloat?", which compares
// cleanly against a committed JSON.

import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootURL = new URL("..", import.meta.url);
const budgetPath = fileURLToPath(new URL("bundle-budget.json", rootURL));
const assetsDir = fileURLToPath(new URL("dist/_astro", rootURL));
const writeMode = process.argv.includes("--write");

const human = (n) => `${(n / 1024).toFixed(1)} KB`;

async function sumByExt(dir) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      console.error(`dist/_astro/ not found — run \`pnpm build\` first.`);
      process.exit(1);
    }
    throw err;
  }
  const totals = { js: 0, css: 0 };
  for (const entry of entries) {
    const full = join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) continue;
    const ext = entry.split(".").pop();
    if (ext === "js" || ext === "css") totals[ext] += info.size;
  }
  return totals;
}

const totals = await sumByExt(assetsDir);

if (writeMode) {
  const next = {
    _comment:
      "Bundle size budgets in bytes for dist/_astro/*. Re-baseline with `pnpm check:bundle --write`.",
    js: totals.js,
    css: totals.css,
  };
  await writeFile(budgetPath, JSON.stringify(next, null, 2) + "\n");
  console.warn(`Wrote bundle-budget.json — JS ${human(totals.js)}, CSS ${human(totals.css)}`);
  process.exit(0);
}

const budget = JSON.parse(await readFile(budgetPath, "utf8"));
let failed = false;
for (const ext of ["js", "css"]) {
  const actual = totals[ext];
  const max = budget[ext];
  const pct = Math.round((actual / max) * 100);
  const label = `${ext.toUpperCase()}: ${human(actual)} / ${human(max)} (${pct}%)`;
  if (actual > max) {
    console.error(`✗ ${label} — over budget by ${human(actual - max)}`);
    failed = true;
  } else {
    console.warn(`✓ ${label}`);
  }
}

if (failed) {
  console.error("");
  console.error("If the growth is intentional, rebaseline with:");
  console.error("  pnpm check:bundle --write");
  process.exit(1);
}
