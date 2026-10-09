#!/usr/bin/env node
/**
 * MX gate. Nothing goes out unless the recipient's domain has a mail exchanger.
 *
 * The September batch sent 27 emails with no verification and 15 hard-bounced
 * (55.6%). A bounce rate that high gets a young sending domain throttled or
 * blocked, so this is not just wasted effort — it damages the asset.
 *
 * Usage:
 *   node scripts/outreach/check-mx.mjs            # queued targets only
 *   node scripts/outreach/check-mx.mjs --all      # every target
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadTargets, isSuppressed, validateTargets, domainHasMx } from './lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const checkAll = process.argv.includes('--all')

const { data } = loadTargets(root)

const structureErrors = validateTargets(data)
if (structureErrors.length) {
  console.error(JSON.stringify({ ok: false, structureErrors }, null, 2))
  process.exit(1)
}

const candidates = (data.targets ?? []).filter(
  (target) => checkAll || target.status === 'queued',
)

const results = []
for (const target of candidates) {
  const suppressed = isSuppressed(target, data.suppressed)
  if (suppressed) {
    results.push({ id: target.id, domain: target.domain, ok: false, reason: `suppressed: ${suppressed}` })
    continue
  }
  const mx = await domainHasMx(target.domain)
  results.push({
    id: target.id,
    domain: target.domain,
    ok: mx.ok,
    ...(mx.ok ? { exchanges: mx.records.slice(0, 2) } : { reason: mx.error || 'no MX record' }),
  })
}

const failures = results.filter((r) => !r.ok)
const summary = {
  ok: failures.length === 0,
  checked: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  results,
}

console.log(JSON.stringify(summary, null, 2))
if (failures.length) {
  console.error(`\ncheck-mx: ${failures.length} domain(s) cannot receive mail. Fix or remove them before sending.`)
  process.exit(1)
}
