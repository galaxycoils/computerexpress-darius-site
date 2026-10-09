import { describe, expect, it, vi } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MAX_BATCH_SIZE,
  buildHook,
  domainHasMx,
  isSuppressed,
  loadTargets,
  renderEmail,
  selectBatch,
  validateTargets,
} from './lib.mjs'

// The MX lookup is the send gate: a DNS failure must mean "do not send".
// Mocking it keeps these tests offline while still exercising both branches.
// node:dns/promises is a builtin, so the factory supplies a default export too.
const resolveMx = vi.hoisted(() => vi.fn())
vi.mock('node:dns/promises', () => ({ resolveMx, default: { resolveMx } }))

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

  it('rejects a target with a malformed email', () => {
    const errors = validateTargets({
      targets: [{ id: 'x', firm: 'X', email: 'not-an-email', domain: 'x.ca', status: 'queued' }],
    })
    expect(errors.join(' ')).toMatch(/invalid email/)
  })

  it('rejects a target with no email at all', () => {
    const errors = validateTargets({
      targets: [{ id: 'x', firm: 'X', domain: 'x.ca', status: 'queued' }],
    })
    expect(errors.join(' ')).toMatch(/invalid email/)
  })

  it('reports missing ids, including in the error message it builds', () => {
    const errors = validateTargets({
      targets: [{ firm: 'Anon', email: 'a@a.ca', domain: 'a.ca', status: 'queued' }],
    })
    expect(errors.join(' ')).toMatch(/target missing id/)
  })

  it('rejects a file that is not an object at all', () => {
    expect(validateTargets(null)).toEqual(['targets file is not an object'])
    expect(validateTargets(undefined)).toEqual(['targets file is not an object'])
    expect(validateTargets('nope')).toEqual(['targets file is not an object'])
    expect(validateTargets(42)).toEqual(['targets file is not an object'])
  })

  it('rejects an empty target list', () => {
    expect(validateTargets({ targets: [] }).join(' ')).toMatch(/no targets listed/)
  })

  it('rejects a file with no targets key', () => {
    expect(validateTargets({}).join(' ')).toMatch(/no targets listed/)
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

  // Defensive branches: this is a send gate, so partial data must resolve to
  // "nothing is suppressed" rather than throwing mid-batch.
  it('tolerates a missing suppression list entirely', () => {
    expect(isSuppressed({ email: 'hi@ok.ca', domain: 'ok.ca' })).toBeNull()
  })

  it('tolerates a suppression list with no emails or domains keys', () => {
    expect(isSuppressed({ email: 'hi@ok.ca', domain: 'ok.ca' }, {})).toBeNull()
  })

  it('tolerates a target with no email or domain', () => {
    expect(isSuppressed({}, suppressed)).toBeNull()
    expect(isSuppressed({ email: 'info@dead.ca' }, suppressed)).toMatch(/hard-bounced/)
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

  it('returns an empty batch for a data file with no targets', () => {
    expect(selectBatch({}).batch).toEqual([])
    expect(selectBatch({}).remaining).toBe(0)
  })

  it('falls back to the default cap when no limit is given', () => {
    const many = {
      targets: Array.from({ length: 40 }, (_, i) => ({
        id: `t${i}`, email: `t${i}@x.ca`, domain: 'x.ca', status: 'queued',
      })),
    }
    expect(selectBatch(many).batch).toHaveLength(MAX_BATCH_SIZE)
  })

  it('tolerates a target with no status field', () => {
    const { batch, skipped } = selectBatch({ targets: [{ id: 'nostatus', email: 'a@a.ca', domain: 'a.ca' }] })
    expect(batch).toEqual([])
    expect(skipped[0].reason).toBe('status is undefined')
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

  it('returns null when handed no notice list at all', () => {
    expect(buildHook(undefined, now)).toBeNull()
    expect(buildHook(null, now)).toBeNull()
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

describe('domainHasMx', () => {
  it('reports ok with the exchanges when the domain publishes MX records', async () => {
    resolveMx.mockResolvedValueOnce([{ exchange: 'mx1.example.com' }, { exchange: 'mx2.example.com' }])
    const result = await domainHasMx('example.com')
    expect(result.ok).toBe(true)
    expect(result.records).toEqual(['mx1.example.com', 'mx2.example.com'])
  })

  it('fails closed when the domain has an empty MX set', async () => {
    resolveMx.mockResolvedValueOnce([])
    expect((await domainHasMx('nomail.example.com')).ok).toBe(false)
  })

  it('fails closed and surfaces the DNS error code when the lookup throws', async () => {
    const error = new Error('queryMx ENOTFOUND')
    error.code = 'ENOTFOUND'
    resolveMx.mockRejectedValueOnce(error)
    const result = await domainHasMx('nxdomain.example')
    expect(result.ok).toBe(false)
    expect(result.records).toEqual([])
    expect(result.error).toBe('ENOTFOUND')
  })

  it('falls back to the message when the error carries no code', async () => {
    resolveMx.mockRejectedValueOnce(new Error('dns blew up'))
    expect((await domainHasMx('broken.example')).error).toBe('dns blew up')
  })
})

describe('loadTargets', () => {
  // Reads the real file, so a malformed docs/outreach-targets.json fails here
  // rather than at send time.
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

  it('loads the committed target file and passes its own validation', () => {
    const { data, file } = loadTargets(root)
    expect(file).toBe(path.join(root, 'docs/outreach-targets.json'))
    expect(Array.isArray(data.targets)).toBe(true)
    expect(data.targets.length).toBeGreaterThan(0)
    expect(validateTargets(data)).toEqual([])
  })

  it('comes with a suppression list and an offer that names the current price', () => {
    const { data } = loadTargets(root)
    expect(data.suppressed.emails.length).toBeGreaterThan(0)
    expect(data.suppressed.domains.length).toBeGreaterThan(0)
    expect(data.offer.pilot).toContain('$250')
    // The withdrawn offers must not creep back into the live copy.
    expect(data.offer.pilot).not.toContain('$300')
  })

  it('marks every queued target as MX-checkable', () => {
    const { data } = loadTargets(root)
    const queued = data.targets.filter((target) => target.status === 'queued')
    expect(queued.length).toBeGreaterThan(0)
    for (const target of queued) expect(target.domain, `${target.id} has no domain`).toBeTruthy()
  })
})
