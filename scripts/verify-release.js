import { readFileSync } from "node:fs";
const expected = JSON.parse(readFileSync("dist/release.json", "utf8"));
const base = process.env.VERIFY_BASE_URL || "https://stcatharinesdigital.ca";
let actual;
for (let attempt = 0; attempt < 6; attempt++) {
  try {
    const r = await fetch(
      `${base}/release.json?revision=${expected.sha}&attempt=${attempt}`,
      { cache: "no-store", signal: AbortSignal.timeout(15000) },
    );
    if (r.ok) {
      actual = await r.json();
      if (
        actual.sha === expected.sha &&
        actual.snapshotHash === expected.snapshotHash
      )
        break;
    }
  } catch {}
  if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 10000));
}
if (
  actual?.sha !== expected.sha ||
  actual?.snapshotHash !== expected.snapshotHash
)
  throw new Error("Live release does not match the built content revision");
for (const [path, text] of [
  ["/", "Your city. Your stories."],
  ["/events/", "Make a little room"],
  ["/explore/", "There’s more"],
  ["/news/", "News, close to home."],
]) {
  const r = await fetch(base + path, { signal: AbortSignal.timeout(15000) });
  const html = await r.text();
  if (!r.ok || !html.includes(text))
    throw new Error(`Live route verification failed: ${path}`);
}
console.log(
  `Verified ${actual.sha}, ${actual.records} records, and four public routes.`,
);
