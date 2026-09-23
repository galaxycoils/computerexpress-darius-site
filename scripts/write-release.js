import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { canonicalSource, getPublication } from "../src/data/publication.js";
import { planningNotices } from "../src/data/planningNotices.js";
const publication = getPublication();
const planningBySource = new Map(planningNotices.map(notice => [canonicalSource(notice.sourceUrl), notice]));
function categoryOf(item, manual) {
  if (manual?.category) return manual.category;
  const text = `${item.type || ''} ${item.title}`;
  if (/minor variance|committee of adjustment|\bcoa\b/i.test(text)) return 'minor-variance';
  if (/consent|severance/i.test(text)) return 'consent-application';
  if (/site plan/i.test(text)) return 'site-plan';
  if (/official plan|secondary plan|\bopa\b/i.test(text)) return 'official-plan-amendment';
  if (/zoning|\bzba\b/i.test(text)) return 'zoning-bylaw-amendment';
  return null;
}
const alertNotices = publication.filter(item => item.topic === 'Development' && item.date && item.sourceUrl).map(item => {
  const manual = planningBySource.get(canonicalSource(item.sourceUrl));
  return {
    id: item.id,
    municipality: item.city,
    title: item.title,
    description: item.description || '',
    publishedDate: item.date.slice(0, 10),
    sourceUrl: item.sourceUrl,
    category: categoryOf(item, manual),
    status: manual?.status || null,
    meetingDate: manual?.meetingDate || null,
    meetingLocation: manual?.meetingLocation || null,
    tags: '',
  };
});
const sha =
  process.env.RELEASE_SHA ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const snapshotHash = createHash("sha256")
  .update(JSON.stringify(publication))
  .digest("hex");
writeFileSync(
  "dist/release.json",
  JSON.stringify(
    {
      sha,
      snapshotHash,
      builtAt: new Date().toISOString(),
      records: publication.length,
      design: "garden-city-journal",
    },
    null,
    2,
  ) + "\n",
);
writeFileSync("dist/planning-alert-feed.json", JSON.stringify({ version: 1, notices: alertNotices }, null, 2) + "\n");
