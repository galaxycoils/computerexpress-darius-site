import discovery from "./generated/discovery.json" with { type: "json" };
import { verifiedNrpsReleases } from "./nrpsReleases.js";
import { canonicalSource, namedCities } from "./publication.js";
import { publishableDiscoveryItems } from "./reviewedCollectorHeadlines.js";
import { getRenderNow } from "../utils/renderClock.js";

function toPoliceRelease(item) {
  const cities = namedCities(item.title);
  return {
    id: `discovery-${item.id}`,
    date: item.sourcePublishedAt,
    headline: item.title,
    municipality: cities.join(", ") || "Niagara Region",
    type: "Media Release",
    url: item.url,
    source: "Niagara Regional Police Service",
    tags: [],
    category: "official-release",
  };
}

/**
 * Later NRPS releases from the collector, after the reviewed-headline
 * allowlist and the age/youth hold. The curated archive is unchanged.
 */
export function discoveryPoliceReleases(archive = verifiedNrpsReleases, items = discovery.items || []) {
  const seen = new Set(archive.map((release) => canonicalSource(release.url)));
  const latestCurated = archive.reduce(
    (latest, release) => (release.date > latest ? release.date : latest),
    "",
  );
  return publishableDiscoveryItems(items)
    .filter(
      (item) =>
        item?.sourceId === "nrps-media-releases" &&
        item.url &&
        item.title &&
        item.sourcePublishedAt &&
        item.sourcePublishedAt > latestCurated &&
        !seen.has(canonicalSource(item.url)),
    )
    .map(toPoliceRelease);
}

export function policeDeskReleases(archive = verifiedNrpsReleases, items = discovery.items || []) {
  return [...discoveryPoliceReleases(archive, items), ...archive].sort(
    (a, b) =>
      String(b.date).localeCompare(String(a.date)) ||
      String(a.headline).localeCompare(String(b.headline)),
  );
}

export function getRecentPoliceDeskReleases(count = 8, days = 30, now = getRenderNow()) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return policeDeskReleases()
    .filter((release) => new Date(release.date) >= cutoff)
    .slice(0, count);
}
