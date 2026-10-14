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

function normalizeCollectionTimestamp(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}

function formatCollectionDate(value) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(parsed));
}

export function getCollectionTimestamp() {
  return normalizeCollectionTimestamp(discovery?.collectedAt);
}

export function getLastRefreshed() {
  return getCollectionTimestamp();
}

export function formatCollectionTimestamp(value = discovery?.collectedAt) {
  return formatCollectionDate(value);
}

export const lastRefreshed = getCollectionTimestamp();

export function getLastRefreshedLabel(prefix = 'Source corpus last verified ') {
  const date = formatCollectionDate(discovery?.collectedAt);
  return date ? `${prefix}${date}` : null;
}

export function formatLastRefreshed(prefix = 'Source corpus last verified ') {
  return getLastRefreshedLabel(prefix);
}

export function getDiscoveryMeta() {
  const collectedAt = normalizeCollectionTimestamp(discovery?.collectedAt);
  return {
    collectedAt,
    // Do not render this through anything that assumes `collectedAt` is present.
    // Callers should use `lastRefreshedLabel`, which is null rather than blank or
    // malformed when the source collection snapshot has no usable timestamp.
    lastRefreshed: collectedAt,
    lastRefreshedLabel: formatCollectionDate(collectedAt),
    publicationState: discovery?.publicationState ?? 'unknown',
    total: Array.isArray(discovery?.items) ? discovery.items.length : 0,
    sources: discovery?.sources ?? [],
  };
}
