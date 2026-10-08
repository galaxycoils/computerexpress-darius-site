import { readFileSync } from "node:fs";
import { getPublication } from '../src/data/publication.js';
import { decodeEntities } from './collect-official-news.js';
import { fetchVerifiedText } from './verifiedFetch.js';
import { getReleaseRenderNow, isExpectedRelease } from './releaseVerification.js';
const expected = JSON.parse(readFileSync("dist/release.json", "utf8"));
const base = process.env.VERIFY_BASE_URL || "https://stcatharinesdigital.ca";
const expectedSha = process.env.EXPECTED_RELEASE_SHA || expected.sha;
const matchRenderTime = process.env.VERIFY_EXISTING_RELEASE !== "1";
const matches = (release) => isExpectedRelease(
  release,
  expected,
  expectedSha,
  { matchRenderTime },
);
let actual;
for (let attempt = 0; attempt < 6; attempt++) {
  try {
    const r = await fetch(
      `${base}/release.json?revision=${expectedSha}&attempt=${attempt}`,
      { cache: "no-store", signal: AbortSignal.timeout(15000) },
    );
    if (r.ok) {
      actual = await r.json();
      if (matches(actual)) break;
    }
  } catch {}
  if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 10000));
}
if (!matches(actual))
  throw new Error("Live release does not match the expected commit and content snapshot");
const publication = getPublication(getReleaseRenderNow(matchRenderTime ? expected : actual));
const latestPublication = publication.slice(0, 3);
for (const [path, text] of [
  ["/", "Your city. Your stories."],
  ["/events/", "Make a little room"],
  ["/explore/", "There’s more"],
  ["/news/", "News, close to home."],
]) {
  await fetchVerifiedText(base + path, html => {
    if (!html.includes(text)) return false;
    if (path !== '/news/') return true;
    const readable = decodeEntities(html);
    return latestPublication.every(item => readable.includes(item.title));
  });
}
await fetchVerifiedText(`${base}/rss.xml?revision=${expectedSha}`, text => {
  const rss = decodeEntities(text);
  return latestPublication.every(item => rss.includes(item.title));
});
console.log(
  `Verified ${actual.sha}, ${actual.records} records, four public routes, and latest titles in news/RSS.`,
);
