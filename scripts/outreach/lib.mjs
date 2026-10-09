/**
 * Outreach logic, kept pure so it can be tested without sending mail.
 *
 * Written after the September round bounced 15 of 27 addresses (55.6%) because
 * nobody verified a domain before sending, and after the pitch rotted onto a
 * police story that expired in two days. Both failure modes are structural here:
 * sending requires an MX pass, and the hook is generated from live notice data
 * rather than typed into a template.
 */
import fs from 'node:fs'
import path from 'node:path'
import { resolveMx } from 'node:dns/promises'
import { parseTorontoDate } from '../../src/utils/renderClock.js'

export const TRACKER_URL = 'https://stcatharinesdigital.pages.dev/planning-tracker'
export const MAX_BATCH_SIZE = 15

/**
 * Does the domain accept mail? Never throws: a DNS failure means "do not send".
 * Kept here rather than in check-mx.mjs so the sender can import it without
 * executing that CLI's top-level work.
 */
export async function domainHasMx(domain) {
  try {
    const records = await resolveMx(domain)
    return { ok: records.length > 0, records: records.map((record) => record.exchange) }
  } catch (error) {
    return { ok: false, records: [], error: error.code || error.message }
  }
}

export function loadTargets(root) {
  const file = path.join(root, 'docs/outreach-targets.json')
  return { data: JSON.parse(fs.readFileSync(file, 'utf8')), file }
}

export function validateTargets(data) {
  const errors = []
  if (!data || typeof data !== 'object') return ['targets file is not an object']
  if (!Array.isArray(data.targets) || data.targets.length === 0) errors.push('no targets listed')

  const ids = new Set()
  const emails = new Set()
  for (const target of data.targets ?? []) {
    if (!target.id) errors.push(`target missing id: ${JSON.stringify(target).slice(0, 60)}`)
    else if (ids.has(target.id)) errors.push(`duplicate target id: ${target.id}`)
    ids.add(target.id)

    if (!target.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target.email)) {
      errors.push(`${target.id}: invalid email`)
    } else if (emails.has(target.email.toLowerCase())) {
      errors.push(`${target.id}: duplicate email ${target.email}`)
    }
    emails.add(String(target.email).toLowerCase())

    if (!target.domain) errors.push(`${target.id}: missing domain for the MX gate`)
    else if (!String(target.email).toLowerCase().endsWith(`@${String(target.domain).toLowerCase()}`)) {
      errors.push(`${target.id}: email domain does not match domain field`)
    }
    if (!['contacted', 'queued', 'replied', 'paying', 'declined'].includes(target.status)) {
      errors.push(`${target.id}: unknown status ${target.status}`)
    }
  }
  return errors
}

export function isSuppressed(target, suppressed = {}) {
  const emails = (suppressed.emails ?? []).map((value) => value.toLowerCase())
  const domains = (suppressed.domains ?? []).map((value) => value.toLowerCase())
  const email = String(target.email ?? '').toLowerCase()
  const domain = String(target.domain ?? '').toLowerCase()
  if (emails.includes(email)) return 'address hard-bounced previously'
  if (domain && domains.includes(domain)) return 'domain has no mail exchanger'
  return null
}

/** Targets eligible for a first-contact or follow-up batch. */
export function selectBatch(data, { limit = MAX_BATCH_SIZE } = {}) {
  const suppressed = data.suppressed ?? {}
  const eligible = []
  const skipped = []
  for (const target of data.targets ?? []) {
    if (target.status !== 'queued') {
      skipped.push({ id: target.id, reason: `status is ${target.status}` })
      continue
    }
    const suppression = isSuppressed(target, suppressed)
    if (suppression) {
      skipped.push({ id: target.id, reason: suppression })
      continue
    }
    eligible.push(target)
  }
  const capped = Math.min(limit, MAX_BATCH_SIZE)
  return { batch: eligible.slice(0, capped), skipped, remaining: Math.max(0, eligible.length - capped) }
}

/**
 * Categories that a land, construction or municipal-law buyer acts on, best
 * first. A property-standards appeal is a real deadline but a weak hook for a
 * paving contractor, so it is only used when nothing stronger is live.
 */
export const HOOK_CATEGORY_PRIORITY = [
  'official-plan-amendment',
  'notice-of-decision',
  'zoning-bylaw-amendment',
  'minor-variance',
  'consent-application',
  'draft-plan-subdivision',
  'road-closure',
  'construction',
  'site-plan',
  'public-meeting',
]

function formatDeadline(date) {
  return date.toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto',
  })
}

/**
 * Builds the opening line from live notice data.
 *
 * Rule (2026-10-02): lead with a planning decision, a closure, or a deadline.
 * Never a police release — that is the wrong buyer and it expires in days.
 * Among live deadlines, prefer the categories a buyer actually acts on.
 */
export function buildHook(notices, now = new Date()) {
  const live = []
  for (const notice of notices ?? []) {
    if (!notice.submissionDeadline) continue
    const deadline = parseTorontoDate(notice.submissionDeadline)
    if (Number.isNaN(deadline.getTime())) continue
    if (deadline.getTime() <= now.getTime()) continue
    live.push({ notice, deadline })
  }
  if (live.length === 0) return null

  const rank = (notice) => {
    const index = HOOK_CATEGORY_PRIORITY.indexOf(notice.category)
    return index === -1 ? HOOK_CATEGORY_PRIORITY.length : index
  }
  live.sort((a, b) => {
    const byRank = rank(a.notice) - rank(b.notice)
    if (byRank !== 0) return byRank
    return a.deadline - b.deadline
  })

  const { notice, deadline } = live[0]
  return {
    noticeId: notice.id,
    municipality: notice.municipality,
    category: notice.category ?? null,
    title: notice.title,
    deadline: deadline.toISOString(),
    text: `${notice.title} — ${notice.municipality}. The window to respond closes ${formatDeadline(deadline)}.`,
  }
}

export function renderEmail(target, hook, offer) {
  const greeting = target.contact ? `Hi ${target.contact},` : 'Hi,'
  if (!hook) throw new Error('refusing to render: no live deadline to lead with')
  const subject = `${hook.municipality} planning notice — ${target.firm}`
  const text = `${greeting}

${hook.text}

We publish every planning notice, council decision, road closure and public consultation for St. Catharines, Welland, Thorold and Niagara Region — one feed, each record linked to its official municipal source, each carrying its submission deadline and meeting date.

Free public tracker, no signup: ${TRACKER_URL}

Raw feed for your own pipeline is free. A monitored version with advance notice before each deadline is ${offer.pilot}.

Worth a look?`
  return { subject, text }
}
