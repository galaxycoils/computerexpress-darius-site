/**
 * Council Record pairs a public statement with the council vote on the
 * city record. The shipped dataset starts empty. Validation runs before
 * any entry is rendered.
 *
 * @typedef {'Welland' | 'St. Catharines'} CouncilRecordCity
 * @typedef {'Voted for' | 'Voted against' | 'Abstained' | 'Absent' | 'No vote yet'} CouncilRecordPosition
 * @typedef {'Published' | 'Updated' | 'Comment requested' | 'Reply received'} CouncilRecordStatus
 * @typedef {{ url: string, publisher: string, date: string, councillor_own: boolean }} CouncilRecordSource
 * @typedef {{ exact_quote: string, sources: CouncilRecordSource[], archived_copy_url?: string }} CouncilRecordStatement
 * @typedef {{ item: string, position: CouncilRecordPosition, minutes_url: string, date: string }} CouncilRecordVote
 * @typedef {{ text: string, signed_by: string }} CouncilRecordCommentary
 * @typedef {{
 *   id: string,
 *   councillor_name: string,
 *   ward: string,
 *   city: CouncilRecordCity,
 *   statement: CouncilRecordStatement,
 *   vote: CouncilRecordVote,
 *   published_date: string,
 *   last_verified_date: string,
 *   status: CouncilRecordStatus,
 *   comment_requested_date: string,
 *   reply_deadline: string,
 *   reply: string | null,
 *   commentary?: CouncilRecordCommentary
 * }} CouncilRecordEntry
 */

export const COUNCIL_RECORD_CITIES = ['Welland', 'St. Catharines']

export const COUNCIL_RECORD_POSITIONS = [
  'Voted for',
  'Voted against',
  'Abstained',
  'Absent',
  'No vote yet',
]

export const COUNCIL_RECORD_STATUSES = [
  'Published',
  'Updated',
  'Comment requested',
  'Reply received',
]

const PROHIBITED_KEYS = new Set([
  'address',
  'home',
  'homeaddress',
  'street',
  'streetaddress',
  'postalcode',
  'family',
  'familymembers',
  'spouse',
  'children',
  'employer',
  'workplace',
  'privatebusiness',
  'phone',
  'telephone',
  'phonenumber',
  'photo',
  'photourl',
  'image',
  'imageurl',
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
  'youtube.com',
  'threads.net',
  'bsky.app',
]

const JUDGMENT_STATUS = /\b(kept|broken|flip-flops?|liars?)\b/i

export function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function formatRecordDate(value) {
  if (!isIsoDate(value)) return value
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/** Monday–Friday. The count starts the day after `isoDate`. */
export function addBusinessDays(isoDate, days) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  let added = 0
  while (added < days) {
    date.setUTCDate(date.getUTCDate() + 1)
    const weekday = date.getUTCDay()
    if (weekday !== 0 && weekday !== 6) added += 1
  }
  const monthText = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dayText = String(date.getUTCDate()).padStart(2, '0')
  return `${date.getUTCFullYear()}-${monthText}-${dayText}`
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, '')
}

function httpsUrl(value) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url
  } catch {
    return null
  }
}

function isSocialUrl(url) {
  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  return SOCIAL_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))
}

function pushProhibited(value, path, errors) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => pushProhibited(item, `${path}[${index}]`, errors))
    return
  }
  if (!value || typeof value !== 'object') return
  for (const [key, nested] of Object.entries(value)) {
    const next = `${path}.${key}`
    if (PROHIBITED_KEYS.has(normalizeKey(key))) errors.push(`${next} is private and is not published`)
    pushProhibited(nested, next, errors)
  }
}

function requireText(value, path, errors) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${path} is required`)
}

function validateStatement(statement, path, errors, timing = {}) {
  if (!statement || typeof statement !== 'object' || Array.isArray(statement)) {
    errors.push(`${path} is required`)
    errors.push(`${path} needs two credible sources`)
    return
  }
  requireText(statement.exact_quote, `${path}.exact_quote`, errors)
  const sources = Array.isArray(statement.sources) ? statement.sources : []
  if (!Array.isArray(statement.sources)) errors.push(`${path}.sources must be a list`)
  const credible = []
  const seen = new Set()
  let needsArchive = false
  sources.forEach((source, index) => {
    const sourcePath = `${path}.sources[${index}]`
    if (!source || typeof source !== 'object') {
      errors.push(`${sourcePath} must be an object`)
      return
    }
    if (typeof source.councillor_own !== 'boolean') errors.push(`${sourcePath}.councillor_own must be true or false`)
    else if (source.councillor_own) needsArchive = true
    requireText(source.publisher, `${sourcePath}.publisher`, errors)
    if (!isIsoDate(source.date)) errors.push(`${sourcePath}.date must be an exact date`)
    const url = httpsUrl(source.url)
    if (!url) {
      errors.push(`${sourcePath}.url must be an https URL`)
      return
    }
    if (seen.has(url.href) || isSocialUrl(url)) return
    seen.add(url.href)
    credible.push(url.href)
  })
  let archiveOk = false
  if (statement.archived_copy_url) {
    const archive = httpsUrl(statement.archived_copy_url)
    if (!archive) errors.push(`${path}.archived_copy_url must be an https URL`)
    else if (isSocialUrl(archive)) errors.push(`${path}.archived_copy_url cannot be a social media page`)
    else archiveOk = true
  }
  if (needsArchive && !archiveOk) {
    errors.push(`${path} needs an archived copy when a source is the councillor's own page or post`)
  }
  if (credible.length < 2) {
    errors.push(`${path} needs two credible sources. Social media alone is not enough.`)
  }
  if (timing.reply === null && isIsoDate(timing.published_date) && isIsoDate(timing.reply_deadline) && timing.published_date <= timing.reply_deadline) {
    errors.push(`${path} cannot publish no reply until after reply_deadline`)
  }
}

function validateVote(vote, path, errors) {
  if (!vote || typeof vote !== 'object' || Array.isArray(vote)) {
    errors.push(`${path} is required`)
    errors.push(`${path}.minutes_url is required`)
    return
  }
  requireText(vote.item, `${path}.item`, errors)
  if (!COUNCIL_RECORD_POSITIONS.includes(vote.position)) errors.push(`${path}.position is not a recorded position`)
  if (!httpsUrl(vote.minutes_url)) errors.push(`${path}.minutes_url is required`)
  if (!isIsoDate(vote.date)) errors.push(`${path}.date must be an exact date`)
}

function validateEntry(entry, index, ids, errors) {
  const path = `entries[${index}]`
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    errors.push(`${path} must be an object`)
    errors.push(`${path}.vote.minutes_url is required`)
    errors.push(`${path}.comment_requested_date is required`)
    errors.push(`${path}.last_verified_date is required`)
    errors.push(`${path}.statement needs two credible sources`)
    return
  }
  if (typeof entry.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
    errors.push(`${path}.id must be a lowercase slug`)
  } else if (ids.has(entry.id)) {
    errors.push(`${path}.id is duplicated`)
  } else {
    ids.add(entry.id)
  }
  requireText(entry.councillor_name, `${path}.councillor_name`, errors)
  requireText(entry.ward, `${path}.ward`, errors)
  if (!COUNCIL_RECORD_CITIES.includes(entry.city)) errors.push(`${path}.city must be Welland or St. Catharines`)
  validateStatement(entry.statement, `${path}.statement`, errors, {
    reply: entry.reply,
    published_date: entry.published_date,
    reply_deadline: entry.reply_deadline,
  })
  validateVote(entry.vote, `${path}.vote`, errors)
  if (!isIsoDate(entry.published_date)) errors.push(`${path}.published_date is required`)
  if (!isIsoDate(entry.last_verified_date)) errors.push(`${path}.last_verified_date is required`)
  if (!isIsoDate(entry.comment_requested_date)) errors.push(`${path}.comment_requested_date is required`)
  if (!isIsoDate(entry.reply_deadline)) errors.push(`${path}.reply_deadline is required`)
  else if (isIsoDate(entry.comment_requested_date) && entry.reply_deadline < addBusinessDays(entry.comment_requested_date, 2)) {
    errors.push(`${path}.reply_deadline must be at least two business days after comment_requested_date`)
  }
  if (typeof entry.status !== 'string' || JUDGMENT_STATUS.test(entry.status) || !COUNCIL_RECORD_STATUSES.includes(entry.status)) {
    errors.push(`${path}.status must be a neutral record label`)
  }
  if (entry.reply !== null && (typeof entry.reply !== 'string' || !entry.reply.trim())) {
    errors.push(`${path}.reply must be text or null`)
  }
  if (entry.commentary !== undefined) {
    const note = entry.commentary
    if (!note || typeof note !== 'object' || Array.isArray(note) || !String(note.text || '').trim() || !String(note.signed_by || '').trim()) {
      errors.push(`${path}.commentary must include text and signed_by`)
    }
  }
  pushProhibited(entry, path, errors)
}

export function validateCouncilRecordEntries(entries) {
  if (!Array.isArray(entries)) return { ok: false, errors: ['Council Record entries must be an array'] }
  const errors = []
  const ids = new Set()
  entries.forEach((entry, index) => validateEntry(entry, index, ids, errors))
  return { ok: errors.length === 0, errors }
}

export function correctionPath(id) {
  return `/corrections?entry=${encodeURIComponent(id)}`
}
