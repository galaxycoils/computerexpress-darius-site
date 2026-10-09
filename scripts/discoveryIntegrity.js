// Audit the generated feed as well as the hand-maintained newsroom datasets.
export function auditDiscovery(snapshot, sources) {
  const errors = [];
  if (snapshot?.version !== 2 || !Array.isArray(snapshot?.items))
    return ['Discovery snapshot must be version 2 with an items array'];
  const registry = new Map(sources.map(source => [source.id, source]));
  const ids = new Set();
  const urls = new Set();
  for (const item of snapshot.items) {
    if (!item || typeof item !== 'object') {
      errors.push('Invalid discovery record');
      continue;
    }
    const label = item.id || '(missing ID)';
    if (!item.id || ids.has(item.id)) errors.push(`Duplicate or missing discovery ID: ${label}`);
    ids.add(item.id);
    if (typeof item.title !== 'string' || !item.title.trim()) errors.push(`Discovery ${label} has no title`);
    const source = registry.get(item.sourceId);
    if (!source) errors.push(`Discovery ${label} uses an unapproved source: ${item.sourceId}`);
    try {
      const url = new URL(item.url);
      if (url.protocol !== 'https:' || url.username || url.password || (source && url.origin !== new URL(source.url).origin))
        errors.push(`Discovery ${label} has an unsafe source URL`);
      if (urls.has(url.href)) errors.push(`Duplicate discovery URL: ${url.href}`);
      urls.add(url.href);
    } catch { errors.push(`Discovery ${label} has an invalid source URL`); }
    if (!['published', 'pending-review', 'rejected', 'withdrawn'].includes(item.status) || typeof item.reviewRequired !== 'boolean')
      errors.push(`Discovery ${label} has an invalid review state`);
    if (item.sourcePublishedAt != null) {
      const value = item.sourcePublishedAt;
      const day = typeof value === 'string' ? value.slice(0, 10) : '';
      const date = new Date(day + 'T12:00:00Z');
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) || Number.isNaN(+date) || date.toISOString().slice(0, 10) !== day || Number.isNaN(Date.parse(value)))
        errors.push(`Discovery ${label} has an invalid publication date`);
    }
  }
  return errors;
}
