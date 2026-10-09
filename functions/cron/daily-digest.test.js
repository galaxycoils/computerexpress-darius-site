import { describe, expect, it } from 'vitest'
import {
  GRACE_WARNING_LEAD_MS,
  buildGraceNotice,
  buildGraceNoticeQuery,
  buildRecipientQuery,
} from './daily-digest.js'

// The digest is the paid product. These tests exist because the delivery path
// previously selected on `verified = 1` alone, which gave the $49/mo product
// away to every confirmed signup.

describe('digest recipient gate', () => {
  const now = 1_800_000_000_000

  it('requires a confirmed payment or a live grace window', () => {
    const { sql } = buildRecipientQuery(now)
    expect(sql).toContain("payment_status = 'confirmed'")
    expect(sql).toContain('grace_until IS NOT NULL')
    expect(sql).toContain('grace_until > ?')
  })

  it('never selects purely on verification', () => {
    const { sql } = buildRecipientQuery(now)
    // A bare `WHERE verified = 1 AND frequency = ?` was the leak.
    expect(sql).not.toMatch(/WHERE\s+verified\s*=\s*1\s+AND\s+frequency\s*=\s*\?\s*$/)
    expect(sql).toContain('AND (')
  })

  it('binds the evaluation time so an expired grace window does not deliver', () => {
    const { bindings } = buildRecipientQuery(now)
    expect(bindings).toEqual(['daily', now])
  })

  it('addresses the paid weekly digest frequency', () => {
    const { bindings } = buildRecipientQuery(now)
    expect(bindings[0]).toBe('daily')
  })
})

describe('grace notice', () => {
  const now = 1_800_000_000_000

  it('targets only unpaid readers whose window is closing and who were not warned', () => {
    const { sql, bindings } = buildGraceNoticeQuery(now)
    expect(sql).toContain("payment_status != 'confirmed'")
    expect(sql).toContain('grace_notified_at IS NULL')
    expect(bindings).toEqual([now, now + GRACE_WARNING_LEAD_MS])
  })

  it('does not warn readers whose grace window has already lapsed', () => {
    const { sql } = buildGraceNoticeQuery(now)
    expect(sql).toContain('grace_until > ?')
  })

  it('quotes the price and the Interac address', () => {
    const { text, html } = buildGraceNotice(now + 1000)
    expect(text).toContain('$49/month')
    expect(text).toContain('cccemt@pm.me')
    expect(html).toContain('cccemt@pm.me')
  })

  it('renders the deadline as a readable date rather than a raw timestamp', () => {
    const graceUntil = Date.UTC(2026, 10, 5)
    const { text, html } = buildGraceNotice(graceUntil)
    expect(text).toContain('2026')
    expect(text).not.toContain(String(graceUntil))
    expect(html).toContain('2026')
  })
})
