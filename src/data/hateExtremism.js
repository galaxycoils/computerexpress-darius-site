/**
 * Validation for the Hate & Extremism in Niagara public record.
 *
 * Editorial rules (v1, 17 Oct 2026) plus the statistic, scope and resource
 * additions: two credible sources, except an official statistic may cite one
 * official publisher and a support resource may cite one verified source;
 * named people only with a qualifying basis; no address, phone, workplace,
 * family, private photo, or minor-identifying fields. Phones are allowed
 * only on a resource.
 */

export const ENTRY_TYPES = ['court-case', 'group', 'incident', 'response', 'statistic', 'resource']

export const SCOPES = ['niagara', 'regional-context']

export const NAMING_BASES = ['charged', 'convicted', 'self-identified-leader', 'public-figure']

export const COURT_STATUSES = ['charged', 'convicted', 'acquitted', 'stayed', 'withdrawn']

export const OFFICIAL_STATISTIC_OUTLETS = [
  'statistics canada',
  'canadian centre for justice and community safety statistics',
  'niagara regional police service',
  'niagara regional police',
  'public safety canada',
]

const PROHIBITED_KEYS = new Set([
  'address',
  'homeaddress',
  'streetaddress',
  'street',
  'postalcode',
  'phone',
  'telephone',
  'phonenumber',
  'mobile',
  'cell',
  'workplace',
  'employer',
  'workaddress',
  'family',
  'familymembers',
  'relatives',
  'spouse',
  'children',
  'photo',
  'photourl',
  'image',
  'imageurl',
  'images',
  'portrait',
  'mugshot',
  'minor',
  'minors',
  'isminor',
  'underage',
  'dateofbirth',
  'dob',
  'age',
])

const SOCIAL_HOSTS = [
  'facebook.com',
  'fb.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'tiktok.com',
  'reddit.com',
  't.me',
  'telegram.org',
  'gab.com',
  '4chan.org',
  'truthsocial.com',
]

const OWN_VOICE_LABELS = [
  /\bwhite supremacists?\b/i,
  /\bwhite nationalists?\b/i,
  /\bneo-nazis?\b/i,
  /\bnazis?\b/i,
  /\bterrorists?\b/i,
  /\bhate groups?\b/i,
  /\bextremists?\b/i,
]

const MINOR_AGE = /\b\d{1,2}-year-olds?\b/i
const PHONE_NUMBER = /\b(?:\+?1[-.\s]*)?\(?\d{3}\)?[-.\s]*\d{3}[-.\s]*\d{4}\b/

export function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function isAllowedSourceDate(value) {
  if (typeof value !== 'string' || !value.trim()) return false
  if (isIsoDate(value)) return true
  if (/^last amended \d{4}-\d{2}-\d{2}$/.test(value)) return true
  if (/verify exact day/i.test(value)) return true
  if (/^undated\b/i.test(value)) return true
  if (/^TODO\b/.test(value)) return true
  return false
}

export function formatSourceDate(value) {
  if (isIsoDate(value)) {
    return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  }
  if (/verify exact day|^TODO\b/i.test(value || '')) return 'undated'
  return value
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return ''
  }
}

function isSocialUrl(url) {
  const host = hostOf(url)
  return SOCIAL_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))
}

function unquoted(text) {
  return String(text).replace(/“[^”]*”|"[^"]*"/g, ' ')
}

export function hasQuotedOrAttributedDescription(text) {
  const value = String(text || '')
  if (/“[^”]+”|"[^"]+"/.test(value)) return true
  return /\b(described by|called it|calls it|according to|reported by|quoted by|CBC|Standard|GPAHE|RCMP|StatCan|Statistics Canada|Niagara Daily News|Niagara Falls Review|The River)\b/i.test(value)
}

function isOfficialStatisticOutlet(outlet) {
  const name = String(outlet || '').trim().toLowerCase()
  return OFFICIAL_STATISTIC_OUTLETS.some((allowed) => name.includes(allowed))
}

function pushProhibited(value, path, errors, { allowPhones = false } = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => pushProhibited(item, `${path}[${index}]`, errors, { allowPhones }))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      if (PROHIBITED_KEYS.has(normalizeKey(key))) {
        errors.push(`${path}.${key} is a prohibited field`)
      }
      pushProhibited(nested, `${path}.${key}`, errors, { allowPhones })
    }
    return
  }
  if (typeof value === 'string') {
    if (MINOR_AGE.test(value)) errors.push(`${path} identifies a minor by age`)
    if (!allowPhones && PHONE_NUMBER.test(value)) errors.push(`${path} includes a phone number`)
  }
}

function validateSource(source, path, errors) {
  if (!source || typeof source !== 'object') {
    errors.push(`${path} must be an object`)
    return
  }
  if (!String(source.outlet || '').trim()) errors.push(`${path}.outlet is required`)
  if (!String(source.title || '').trim()) errors.push(`${path}.title is required`)
  if (!isAllowedSourceDate(source.date)) errors.push(`${path}.date must be an exact date or a clearly marked TODO`)
  if (source.updated && !isIsoDate(source.updated)) errors.push(`${path}.updated must be an exact date`)
  let url
  try {
    url = new URL(source.url)
  } catch {
    errors.push(`${path}.url must be an https URL`)
    return
  }
  if (url.protocol !== 'https:' || url.username || url.password) errors.push(`${path}.url must be an https URL`)
  if (isSocialUrl(source.url)) errors.push(`${path}.url is a social-media source`)
}

function validateNamedPerson(person, entry, path, errors) {
  if (!person || typeof person !== 'object') {
    errors.push(`${path} must be an object`)
    return
  }
  if (!String(person.name || '').trim()) errors.push(`${path}.name is required`)
  if (!NAMING_BASES.includes(person.basis)) {
    errors.push(`${path}.basis must be a qualifying basis (charged, convicted, self-identified leader, or public figure)`)
  }
  if (person.qualifies !== true) errors.push(`${path}.qualifies must be true when a person is named`)
  if (!hasQuotedOrAttributedDescription(person.quotedDescription)) {
    errors.push(`${path}.quotedDescription must quote or attribute the source wording`)
  }
  const described = unquoted(person.quotedDescription || '')
  for (const label of OWN_VOICE_LABELS) {
    if (label.test(described)) errors.push(`${path}.quotedDescription uses a label in our own voice`)
  }
  if (!Array.isArray(person.sources) || person.sources.length < 2) {
    errors.push(`${path} needs two confirming sources`)
  } else if (entry.sources?.length >= 2) {
    const entryUrls = new Set(entry.sources.map((source) => source.url))
    for (const url of person.sources) {
      if (!entryUrls.has(url)) errors.push(`${path} cites a source that is not on the entry`)
    }
  }
  if ((entry.sources || []).length < 2) errors.push(`${path} cannot be published with fewer than two entry sources`)
}

function validateCommonText(entry, errors, { requireAttribution = true } = {}) {
  for (const field of ['title', 'summary']) {
    const described = unquoted(entry[field] || '')
    for (const label of OWN_VOICE_LABELS) {
      if (label.test(described)) errors.push(`${field} uses a label in our own voice; attribute it`)
    }
  }
  if (requireAttribution && !hasQuotedOrAttributedDescription(entry.summary)) {
    errors.push('summary must quote or attribute source wording')
  }
}

export function validateEntry(entry) {
  const errors = []
  if (!entry || typeof entry !== 'object') return { ok: false, errors: ['entry must be an object'] }

  pushProhibited(entry, 'entry', errors, { allowPhones: entry.type === 'resource' })
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id || '')) errors.push('id must be a lowercase slug')
  if (!ENTRY_TYPES.includes(entry.type)) errors.push('type is not a supported record type')
  if (!SCOPES.includes(entry.scope)) errors.push('scope must be niagara or regional-context')
  if (!String(entry.title || '').trim()) errors.push('title is required')
  if (!String(entry.summary || '').trim()) errors.push('summary is required')
  if (!String(entry.location || '').trim()) errors.push('location is required')
  if (!String(entry.status || '').trim()) errors.push('status is required')
  if (entry.type === 'court-case' && !COURT_STATUSES.some((status) => new RegExp(`^${status}\\b`, 'i').test(entry.status || ''))) {
    errors.push('court-case status must start with charged, convicted, acquitted, stayed, or withdrawn')
  }
  if (!isIsoDate(entry.dateAdded)) errors.push('dateAdded must be an exact date')
  if (!isIsoDate(entry.lastReviewed)) errors.push('lastReviewed must be an exact date')
  if (isIsoDate(entry.dateAdded) && isIsoDate(entry.lastReviewed) && entry.lastReviewed < entry.dateAdded) {
    errors.push('lastReviewed cannot be earlier than dateAdded')
  }
  if (!/^\/corrections\?entry=[a-z0-9-]+$/.test(entry.correctionRequest || '')) {
    errors.push('correctionRequest must link to the corrections page for this entry')
  }
  if (entry.eventDateLabel && typeof entry.eventDateLabel !== 'string') errors.push('eventDateLabel must be text')
  if (entry.methodologyNote != null && typeof entry.methodologyNote !== 'string') {
    errors.push('methodologyNote must be text')
  }
  if (entry.type !== 'statistic' && entry.methodologyNote) {
    errors.push('methodologyNote is only used on statistic entries')
  }

  const sources = Array.isArray(entry.sources) ? entry.sources : null
  if (!sources) errors.push('sources must be a list')
  else {
    const singleSourceType = entry.type === 'statistic' || entry.type === 'resource'
    const minimum = singleSourceType ? 1 : 2
    if (sources.length < minimum) {
      errors.push(entry.type === 'statistic'
        ? 'statistic entries need at least one official source'
        : entry.type === 'resource'
          ? 'resource entries need at least one source'
          : 'entries need at least two sources')
    }
    sources.forEach((source, index) => validateSource(source, `sources[${index}]`, errors))
    if (entry.type === 'statistic' && sources.length < 2) {
      sources.forEach((source, index) => {
        if (source && !isOfficialStatisticOutlet(source.outlet)) {
          errors.push(`sources[${index}].outlet must be an official statistics publisher when it is the only source`)
        }
      })
    }
  }

  if (entry.namedIndividuals != null && !Array.isArray(entry.namedIndividuals)) {
    errors.push('namedIndividuals must be a list')
  } else {
    for (const [index, person] of (entry.namedIndividuals || []).entries()) {
      validateNamedPerson(person, entry, `namedIndividuals[${index}]`, errors)
    }
  }

  if (!Array.isArray(entry.corrections)) errors.push('corrections must be a list')
  else {
    entry.corrections.forEach((correction, index) => {
      if (!isIsoDate(correction?.date)) errors.push(`corrections[${index}].date must be an exact date`)
      if (!String(correction?.note || '').trim()) errors.push(`corrections[${index}].note is required`)
    })
  }

  if (entry.summary) validateCommonText(entry, errors, { requireAttribution: entry.type !== 'resource' })
  return { ok: errors.length === 0, errors }
}

export function validateEntries(entries) {
  const errors = []
  if (!Array.isArray(entries)) return { ok: false, errors: ['entries must be a list'] }
  const seen = new Set()
  entries.forEach((entry, index) => {
    const result = validateEntry(entry)
    for (const error of result.errors) errors.push(`${entry?.id || index}: ${error}`)
    if (entry?.id && seen.has(entry.id)) errors.push(`${entry.id}: duplicate id`)
    if (entry?.id) seen.add(entry.id)
  })
  return { ok: errors.length === 0, errors }
}

export function validateSupportResource(resource) {
  if (!resource || typeof resource !== 'object') return { ok: false, errors: ['resource must be an object'] }
  if (resource.type !== 'resource') return { ok: false, errors: ['support resources must use type resource'] }
  const result = validateEntry(resource)
  if (resource.namedIndividuals?.length) {
    result.errors.push('support resources do not name individuals')
    result.ok = false
  }
  return result
}

export function validateSupportResources(resources) {
  const errors = []
  if (!Array.isArray(resources)) return { ok: false, errors: ['resources must be a list'] }
  resources.forEach((resource, index) => {
    const result = validateSupportResource(resource)
    for (const error of result.errors) errors.push(`${resource?.id || index}: ${error}`)
  })
  return { ok: errors.length === 0, errors }
}

export function filterEntries(entries, { type = '', municipality = '', scope = '' } = {}) {
  return entries.filter((entry) => {
    if (type && entry.type !== type) return false
    if (municipality && entry.location !== municipality) return false
    if (scope && entry.scope !== scope) return false
    return true
  })
}

export const TYPE_LABELS = {
  'court-case': 'Court case',
  group: 'Group',
  incident: 'Incident',
  response: 'Response',
  statistic: 'Statistic',
  resource: 'Resource',
}

export const SCOPE_LABELS = {
  niagara: 'Niagara',
  'regional-context': 'Regional context',
}
