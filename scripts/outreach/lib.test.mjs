import { describe, expect, it } from 'vitest'
import {
  MAX_BATCH_SIZE,
  buildHook,
  isSuppressed,
  renderEmail,
  selectBatch,
  validateTargets,
} from './lib.mjs'

// These guard the two failure modes that cost the September round: sending to
// addresses nobody verified, and pitching a hook that expires in two days.

const offer = { pilot: '$250/mo monitored pilot' }

const notice = (overrides) => ({
  id: 'n1',
  municipality: 'St. Catharines',
  title: '1262 and 1290 Fourth Avenue — Official Plan and Zoning Decision',
  submissionDeadline: '2026-10-19T17:00:00',
  ...overrides,
})

describe('validateTargets', () => {
  const base = {
    targets: [
      { id: 'a', firm: 'A', email: 'a@a.ca', domain: 'a.ca', status: 'queued' },
    ],
  }

  it('accepts a well-formed target', () => {
    expect(validateTargets(base)).toEqual([])
  })

  it('rejects a duplicate id and a duplicate address', () => {
    const errors = validateTargets({
      targets: [
        ...base.targets,
        { id: 'a', firm: 'B', email: 'a@a.ca', domain: 'a.ca', status: 'queued' },
      ],
    })
    expect(errors.join(' ')).toMatch(/duplicate target id/)
    expect(errors.join(' ')).toMatch(/duplicate email/)
  })

  it('requires a domain for the MX gate', () => {
    const errors = validateTargets({ targets: [{ id: 'x', firm: 'X', email: 'x@x.ca', status: 'queued' }] })
    expect(errors.join(' ')).toMatch(/missing domain/)
  })

  it('rejects an email that does not match its domain field', () => {
    const errors = validateTargets({
      targets: [{ id: 'x', firm: 'X', email: 'x@other.ca', domain: 'x.ca', status: 'queued' }],
    })
    expect(errors.join(' ')).toMatch(/does not match domain/)
  })

  it('rejects an unknown status', () => {
    const errors = validateTargets({ targets: [{ ...base.targets[0], status: 'bounced' }] })
    expect(errors.join(' ')).toMatch(/unknown status/)
  })
})

describe('isSuppressed', () => {
  const suppressed = { emails: ['info@dead.ca'], domains: ['nxdomain.ca'] }

  it('blocks a previously bounced address', () => {
    expect(isSuppressed({ email: 'info@dead.ca', domain: 'dead.ca' }, suppressed)).toMatch(/hard-bounced/)
  })

  it('blocks a domain with no mail exchanger', () => {
    expect(isSuppressed({ email: 'any@nxdomain.ca', domain: 'nxdomain.ca' }, suppressed)).toMatch(/no mail exchanger/)
  })

  it('matches case-insensitively', () => {
    expect(isSuppressed({ email: 'INFO@DEAD.CA', domain: 'DEAD.CA' }, suppressed)).toMatch(/hard-bounced/)
  })

  it('allows a clean address', () => {
    expect(isSuppressed({ email: 'hi@ok.ca', domain: 'ok.ca' }, suppressed)).toBeNull()
  })
})

describe('selectBatch', () => {
  const data = {
    suppressed: { emails: ['info@bounced.ca'], domains: [] },
    targets: [
      { id: 'queued-1', email: 'a@a.ca', domain: 'a.ca', status: 'queued' },
      { id: 'queued-2', email: 'b@b.ca', domain: 'b.ca', status: 'queued' },
      { id: 'already', email: 'c@c.ca', domain: 'c.ca', status: 'contacted' },
      { id: 'bounced', email: 'info@bounced.ca', domain: 'bounced.ca', status: 'queued' },
    ],
  }

  it('selects only queued, unsuppressed targets', () => {
    const { batch } = selectBatch(data)
    expect(batch.map((t) => t.id)).toEqual(['queued-1', 'queued-2'])
  })

  it('explains every skip', () => {
    const { skipped } = selectBatch(data)
    expect(skipped).toEqual([
      { id: 'already', reason: 'status is contacted' },
      { id: 'bounced', reason: 'address hard-bounced previously' },
    ])
  })

  it('never exceeds the batch cap, even if asked to', () => {
    const many = {
      targets: Array.from({ length: 40 }, (_, i) => ({
        id: `t${i}`, email: `t${i}@x.ca`, domain: 'x.ca', status: 'queued',
      })),
    }
    const { batch, remaining } = selectBatch(many, { limit: 999 })
    expect(batch).toHaveLength(MAX_BATCH_SIZE)
    expect(remaining).toBe(40 - MAX_BATCH_SIZE)
  })
})

describe('buildHook', () => {
  const now = new Date('2026-10-09T12:00:00-04:00')

  it('leads with the nearest upcoming deadline', () => {
    const hook = buildHook(
      [notice({ id: 'far', submissionDeadline: '2026-12-01T17:00:00' }), notice({ id: 'near', submissionDeadline: '2026-10-19T17:00:00' })],
      now,
    )
    expect(hook.noticeId).toBe('near')
    expect(hook.text).toContain('St. Catharines')
  })

  it('prefers a category a buyer acts on over a weaker but sooner deadline', () => {
    const hook = buildHook(
      [
        notice({ id: 'weak', category: 'property-standards', submissionDeadline: '2026-10-11T17:00:00' }),
        notice({ id: 'strong', category: 'official-plan-amendment', submissionDeadline: '2026-10-19T17:00:00' }),
      ],
      now,
    )
    expect(hook.noticeId).toBe('strong')
    expect(hook.category).toBe('official-plan-amendment')
  })

  it('falls back to the nearest deadline when no category is preferred', () => {
    const hook = buildHook(
      [
        notice({ id: 'weak-later', category: 'budget', submissionDeadline: '2026-11-01T17:00:00' }),
        notice({ id: 'weak-sooner', category: 'advisory', submissionDeadline: '2026-10-11T17:00:00' }),
      ],
      now,
    )
    expect(hook.noticeId).toBe('weak-sooner')
  })

  it('ignores deadlines that have already passed', () => {
    const hook = buildHook([notice({ submissionDeadline: '2026-10-01T17:00:00' })], now)
    expect(hook).toBeNull()
  })

  it('returns null rather than inventing a hook when nothing is live', () => {
    expect(buildHook([notice({ submissionDeadline: undefined, meetingDate: '2026-11-01T17:00:00' })], now)).toBeNull()
    expect(buildHook([], now)).toBeNull()
  })

  it('survives a malformed deadline', () => {
    expect(buildHook([notice({ submissionDeadline: 'not-a-date' })], now)).toBeNull()
  })
})

describe('renderEmail', () => {
  const hook = { text: 'A real deadline closes Friday.', municipality: 'Thorold', noticeId: 'n1' }

  it('addresses a named contact and otherwise greets generically', () => {
    expect(renderEmail({ firm: 'A', contact: 'Nick' }, hook, offer).text.split('\n')[0]).toBe('Hi Nick,')
    expect(renderEmail({ firm: 'A', contact: null }, hook, offer).text.split('\n')[0]).toBe('Hi,')
  })

  it('puts the live deadline in the opening line, before the pitch', () => {
    const { text } = renderEmail({ firm: 'A', contact: null }, hook, offer)
    const lines = text.split('\n').filter(Boolean)
    expect(lines[1]).toContain('A real deadline closes Friday.')
  })

  it('states the revised offer and never the withdrawn one', () => {
    const { text } = renderEmail({ firm: 'A', contact: null }, hook, offer)
    expect(text).toContain('$250/mo monitored pilot')
    expect(text).not.toContain('$300')
    expect(text).not.toContain('$500')
  })

  it('does not repeat the offer terms', () => {
    const { text } = renderEmail({ firm: 'A', contact: null }, hook, {
      pilot: '$250/mo monitored pilot, 30 days, cancel anytime',
    })
    expect(text.match(/cancel anytime/g)).toHaveLength(1)
  })

  it('refuses to render without a live hook', () => {
    expect(() => renderEmail({ firm: 'A' }, null, offer)).toThrow(/no live deadline/)
  })
})
