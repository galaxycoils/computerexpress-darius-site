import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const manifest = JSON.parse(
  readFileSync(path.join(dist, ".vite/manifest.json"), "utf8"),
);
const budgets = { javascriptGzipKb: 125, cssGzipKb: 22 };
const visited = new Set();
const javascript = new Set();
const stylesheets = new Set();

function collectStaticAssets(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const entry = manifest[key];
  if (!entry) throw new Error(`Build manifest is missing ${key}`);
  if (entry.file.endsWith(".js")) javascript.add(entry.file);
  for (const css of entry.css || []) stylesheets.add(css);
  for (const dependency of entry.imports || []) collectStaticAssets(dependency);
}

function gzipSize(files) {
  return [...files].reduce(
    (total, file) =>
      total + gzipSync(readFileSync(path.join(dist, file))).length / 1024,
    0,
  );
}

collectStaticAssets("index.html");
const measured = {
  javascriptGzipKb: gzipSize(javascript),
  cssGzipKb: gzipSize(stylesheets),
};
const warnings = Object.entries(budgets)
  .filter(([metric, limit]) => measured[metric] > limit)
  .map(([metric, limit]) => `${metric} ${measured[metric].toFixed(1)} KB exceeds ${limit} KB`);

console.log(
  `Homepage transfer (gzip): JS ${measured.javascriptGzipKb.toFixed(1)} KB, CSS ${measured.cssGzipKb.toFixed(1)} KB`,
);
for (const warning of warnings) console.warn(`::warning::Bundle budget: ${warning}`);

// Fail the run when a budget is exceeded. This previously only emitted
// ::warning:: annotations and always exited 0, so the budget could be blown
// without turning anything red — the gate existed on paper only.
if (warnings.length) {
  console.error(
    `\nBundle budget exceeded (${warnings.length} metric(s)). Budgets: JS ${budgets.javascriptGzipKb} KB, CSS ${budgets.cssGzipKb} KB.`,
  );
  process.exit(1);
}
