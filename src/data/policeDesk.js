import discovery from "./generated/discovery.json" with { type: "json" };
import { verifiedNrpsReleases } from "./nrpsReleases.js";
import { canonicalSource, namedCities } from "./publication.js";
import { getRenderNow } from "../utils/renderClock.js";

/**
 * The curated NRPS archive is a hand-maintained module. The official-source
 * collector writes later releases into discovery.json, which /news already
 * reads. The police desk pages combine both so the public archive does not
 * stop on the last hand-entered day.
 */
export function discoveryPoliceReleases(archive = verifiedNrpsReleases) {
  const seen = new Set(archive.map((release) => canonicalSource(release.url)));
  const latestCurated = archive.reduce(
    (latest, release) => (release.date > latest ? release.date : latest),
    "",
  );
  return (discovery.items || [])
    .filter(
      (item) =>
        item?.sourceId === "nrps-media-releases" &&
        item.status === "published" &&
        !item.reviewRequired &&
        item.url &&
        item.title &&
        item.sourcePublishedAt &&
        item.sourcePublishedAt > latestCurated &&
        !seen.has(canonicalSource(item.url)),
    )
    .map((item) => {
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
    });
}

export function policeDeskReleases(archive = verifiedNrpsReleases) {
  return [...discoveryPoliceReleases(archive), ...archive].sort(
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
