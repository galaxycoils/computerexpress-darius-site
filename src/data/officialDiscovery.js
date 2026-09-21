/**
 * Autonomous official-source discovery feed.
 * Generated snapshot lives in src/data/generated/discovery.json
 */
import discovery from "./generated/discovery.json";

export function getOfficialDiscovery(limit = 20) {
  const items = Array.isArray(discovery?.items) ? discovery.items : [];
  return items
    .filter(
      (item) =>
        item?.url &&
        item?.title &&
        item.status === "published" &&
        !item.reviewRequired,
    )
    .slice(0, limit);
}

export function getOfficialDiscoveryBySource(sourceId, limit = 10) {
  return getOfficialDiscovery(200)
    .filter((item) => item.sourceId === sourceId)
    .slice(0, limit);
}

export function getDiscoveryMeta() {
  return {
    collectedAt: discovery?.collectedAt ?? null,
    publicationState: discovery?.publicationState ?? "unknown",
    total: Array.isArray(discovery?.items) ? discovery.items.length : 0,
    sources: discovery?.sources ?? [],
  };
}
