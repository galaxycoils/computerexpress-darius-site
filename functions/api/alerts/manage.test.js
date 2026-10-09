import { describe, expect, it } from 'vitest'
import { resolveDeliveryState } from './manage.js'

// Mirrors the entitlement gate in functions/cron/daily-digest.js. If these two
// ever disagree, a reader is told one thing on /preferences while the digest
// does another — which is how the paid product went out free for three weeks.
describe('resolveDeliveryState', () => {
  const now = 1_800_000_000_000

  it('reports active once payment is confirmed', () => {
    expect(resolveDeliveryState({ payment_status: 'confirmed', grace_until: null }, now)).toBe('active')
  })

  it('reports active even if a stale grace window is present', () => {
    expect(resolveDeliveryState({ payment_status: 'confirmed', grace_until: now - 1 }, now)).toBe('active')
  })

  it('reports grace while the window is open and unpaid', () => {
    expect(resolveDeliveryState({ payment_status: 'pending_interac', grace_until: now + 1 }, now)).toBe('grace')
  })

  it('reports paused once the grace window closes', () => {
    expect(resolveDeliveryState({ payment_status: 'pending_interac', grace_until: now - 1 }, now)).toBe('paused')
  })

  it('treats the exact expiry instant as paused', () => {
    expect(resolveDeliveryState({ payment_status: 'pending_interac', grace_until: now }, now)).toBe('paused')
  })

  it('reports paused when no grace was ever granted', () => {
    expect(resolveDeliveryState({ payment_status: 'pending_interac', grace_until: null }, now)).toBe('paused')
  })

  it('reports paused for a missing payment status', () => {
    expect(resolveDeliveryState({ grace_until: null }, now)).toBe('paused')
    expect(resolveDeliveryState({}, now)).toBe('paused')
  })

  it('does not crash on a missing row', () => {
    expect(resolveDeliveryState(null, now)).toBe('paused')
    expect(resolveDeliveryState(undefined, now)).toBe('paused')
  })
})
