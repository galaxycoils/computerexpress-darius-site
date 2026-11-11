import discovery from "./generated/discovery.json" with { type: "json" };
import { verifiedNrpsReleases } from "./nrpsReleases.js";
import { canonicalSource, namedCities } from "./publication.js";
import { getRenderNow } from "../utils/renderClock.js";

const PLACE_OR_AGENCY = new Set([
  "niagara",
  "falls",
  "st",
  "catharines",
  "thorold",
  "welland",
  "pelham",
  "grimsby",
  "lincoln",
  "fonthill",
  "wainfleet",
  "fort",
  "erie",
  "port",
  "colborne",
  "regional",
  "region",
  "police",
  "service",
  "nrps",
  "ontario",
  "canada",
  "crime",
  "stoppers",
]);

function wordKey(token) {
  return token.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
}

/**
 * A collector headline may name a person when it contains "youth" or
 * "young person", or two consecutive capitalized words that are not a
 * place or agency on PLACE_OR_AGENCY. Title case can trip this too.
 */
export function headlineNamesPerson(headline) {
  const text = String(headline || "");
  if (/youth|young person/i.test(text)) return true;
  let run = 0;
  for (const token of text.split(/\s+/)) {
    const key = wordKey(token);
    const startsWithCapital = /^[^A-Za-z]*[A-Z]/.test(token);
    if (key && startsWithCapital && !PLACE_OR_AGENCY.has(key)) run += 1;
    else run = 0;
    if (run >= 2) return true;
  }
  return false;
}

export function withoutNamedCollectorHeadlines(items) {
  const kept = [];
  const skipped = [];
  for (const item of items) {
    if (headlineNamesPerson(item?.title)) skipped.push(item.title);
    else kept.push(item);
  }
  if (skipped.length) {
    console.warn(
      `policeDesk skipped ${skipped.length} collector headline(s) that may name a person:\n${skipped.map((title) => `- ${title}`).join("\n")}`,
    );
  }
  return kept;
}

/**
 * The curated NRPS archive is a hand-maintained module. The official-source
 * collector writes later releases into discovery.json, which /news already
 * reads. The police desk pages add those later releases except headlines
 * the name guard holds back.
 */
export function discoveryPoliceReleases(archive = verifiedNrpsReleases) {
  const seen = new Set(archive.map((release) => canonicalSource(release.url)));
  const latestCurated = archive.reduce(
    (latest, release) => (release.date > latest ? release.date : latest),
    "",
  );
  return withoutNamedCollectorHeadlines(discovery.items || [])
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
