#!/usr/bin/env node
/**
 * Guarded outreach sender. Replaces scripts/send-outreach.sh, which hardcoded
 * stale counts, pitched a withdrawn $300 offer, guessed addresses, and had no
 * MX gate.
 *
 * Safeguards, in order:
 *   1. requires --confirm-send (this sends real mail)
 *   2. requires AGENTMAIL_API_KEY from the environment
 *   3. validates the targets file structurally
 *   4. passes the MX gate for every recipient
 *   5. caps the batch at 15
 *   6. refuses to render if there is no live deadline to lead with
 *   7. appends every attempt to docs/outreach-log.jsonl
 *
 * Usage:
 *   node scripts/outreach/send.mjs --dry-run      # render, send nothing
 *   node scripts/outreach/send.mjs --confirm-send # actually send
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTargets, selectBatch, buildHook, renderEmail, validateTargets, domainHasMx, MAX_BATCH_SIZE } from './lib.mjs'
import { planningNotices } from '../../src/data/planningNotices.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const confirmSend = process.argv.includes('--confirm-send')
const dryRun = process.argv.includes('--dry-run') || !confirmSend

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0'
const LOG_FILE = path.join(root, 'docs/outreach-log.jsonl')

const { data } = loadTargets(root)

const structureErrors = validateTargets(data)
if (structureErrors.length) {
  console.error(JSON.stringify({ ok: false, structureErrors }, null, 2))
  process.exit(1)
}

const hook = buildHook(planningNotices, new Date())
if (!hook) {
  console.error('No upcoming submission deadline in planningNotices — refusing to send a hookless batch.')
  process.exit(1)
}

const { batch, skipped, remaining } = selectBatch(data, { limit: MAX_BATCH_SIZE })

if (batch.length === 0) {
  console.log(JSON.stringify({ ok: true, sent: 0, message: 'no queued targets eligible to send', skipped }, null, 2))
  process.exit(0)
}

// Gate every recipient before a single message goes out.
const mxResults = []
for (const target of batch) {
  const mx = await domainHasMx(target.domain)
  mxResults.push({ id: target.id, domain: target.domain, ok: mx.ok, reason: mx.ok ? null : mx.error || 'no MX record' })
}
const mxFailures = mxResults.filter((r) => !r.ok)

console.log(
  JSON.stringify(
    {
      mode: dryRun ? 'dry-run' : 'SEND',
      hook,
      batchSize: batch.length,
      remainingAfterBatch: remaining,
      skipped,
      mx: mxResults,
    },
    null,
    2,
  ),
)

if (mxFailures.length) {
  console.error(`\nRefusing to send: ${mxFailures.length} recipient(s) failed the MX gate.`)
  process.exit(1)
}

if (dryRun) {
  const preview = renderEmail(batch[0], hook, data.offer)
  console.log('\n--- preview (first target) ---\n')
  console.log(`To: ${batch[0].email}`)
  console.log(`Subject: ${preview.subject}\n`)
  console.log(preview.text)
  console.log('\nDry run complete. Re-run with --confirm-send to send.')
  process.exit(0)
}

const apiKey = process.env.AGENTMAIL_API_KEY
if (!apiKey) {
  console.error('AGENTMAIL_API_KEY is not set. Refusing to send.')
  process.exit(1)
}
const inbox = process.env.AGENTMAIL_INBOX || 'stcatharines-digital@agentmail.to'

const logLines = []
let sent = 0
let failed = 0

for (const target of batch) {
  const { subject, text } = renderEmail(target, hook, data.offer)
  const attempt = {
    at: new Date().toISOString(),
    id: target.id,
    email: target.email,
    domain: target.domain,
    round: (target.lastRound ?? 0) + 1,
    hookNoticeId: hook.noticeId,
    subject,
    ok: false,
  }
  try {
    const response = await fetch(
      `${AGENTMAIL_BASE}/inboxes/${encodeURIComponent(inbox)}/messages/send`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: target.email, subject, text, labels: ['outreach', `target:${target.id}`] }),
      },
    )
    if (!response.ok) {
      attempt.error = `HTTP ${response.status}`
      failed++
    } else {
      const body = await response.json().catch(() => ({}))
      attempt.ok = true
      attempt.messageId = body.message_id ?? null
      sent++
    }
  } catch (error) {
    attempt.error = error.message
    failed++
  }
  logLines.push(JSON.stringify(attempt))
  console.log(`${attempt.ok ? 'OK  ' : 'FAIL'} | ${target.email} | ${attempt.error ?? attempt.messageId ?? ''}`)
}

fs.appendFileSync(LOG_FILE, logLines.join('\n') + '\n')

console.log(`\n=== ${sent} sent, ${failed} failed, ${batch.length} attempted ===`)
console.log(`Logged to ${path.relative(root, LOG_FILE)}. Update docs/SPONSORSHIP_OUTREACH_TRACKER.md and the targets file statuses.`)
process.exit(failed > 0 ? 1 : 0)
