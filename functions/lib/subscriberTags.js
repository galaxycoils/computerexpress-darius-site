export const COUNCIL_RECORD_TAG = 'council-record'

const ALLOWED_TAGS = new Set([COUNCIL_RECORD_TAG])

function addTag(tags, value) {
  if (ALLOWED_TAGS.has(value) && !tags.includes(value)) tags.push(value)
}

/** Tags requested by a signup. Unknown values are ignored so this cannot open a second list. */
export function tagsFromSignup(body) {
  const tags = []
  if (!body || typeof body !== 'object') return tags
  addTag(tags, body.source)
  addTag(tags, body.tag)
  if (Array.isArray(body.tags)) {
    for (const value of body.tags) addTag(tags, value)
  }
  if (body.placement === COUNCIL_RECORD_TAG) addTag(tags, COUNCIL_RECORD_TAG)
  return tags
}

/** Keep allowed tags already stored and add the ones from this signup. */
export function mergeTags(existing, incoming) {
  let prior = []
  if (Array.isArray(existing)) prior = existing
  else if (typeof existing === 'string' && existing.trim()) {
    try {
      const parsed = JSON.parse(existing)
      if (Array.isArray(parsed)) prior = parsed
    } catch {
      prior = []
    }
  }
  const tags = []
  for (const value of prior) addTag(tags, value)
  for (const value of incoming || []) addTag(tags, value)
  return tags
}
