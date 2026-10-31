import { describe, expect, it } from 'vitest'
import { councilRecordEntries } from './councilRecordEntries'
import { validateCouncilRecordEntries } from './councilRecord'

function source(url, publisher = 'St. Catharines Standard', councillorOwn = false) {
  return { url, publisher, date: '2026-10-01', councillor_own: councillorOwn }
}

function validEntry(overrides = {}) {
  return {
    id: 'sample-ward-1',
    councillor_name: 'Alex Example',
    ward: 'Ward 1',
    city: 'St. Catharines',
    statement: {
      exact_quote: 'The budget should be published before the vote.',
      sources: [
        source('https://www.stcatharinesstandard.ca/example-a'),
        source('https://www.wellandtribune.ca/example-b', 'Welland Tribune'),
      ],
    },
    vote: {
      item: '2027 operating budget',
      position: 'Voted for',
      minutes_url: 'https://www.stcatharines.ca/meetings/minutes-example',
      date: '2026-11-20',
    },
    published_date: '2026-11-21',
    last_verified_date: '2026-11-22',
    status: 'Comment requested',
    comment_requested_date: '2026-11-18',
    reply_deadline: '2026-11-20',
    reply: null,
    ...overrides,
  }
}

describe('Council Record validation', () => {
  it('ships with zero entries', () => {
    expect(councilRecordEntries).toEqual([])
    expect(validateCouncilRecordEntries(councilRecordEntries)).toEqual({ ok: true, errors: [] })
  })

  it('requires two credible sources, and an archived copy when a source is the councillor\'s own page', () => {
    expect(validateCouncilRecordEntries([validEntry()]).ok).toBe(true)

    const onePlusArchive = validEntry({ id: 'one-plus-archive' })
    onePlusArchive.statement = {
      exact_quote: onePlusArchive.statement.exact_quote,
      sources: [onePlusArchive.statement.sources[0]],
      archived_copy_url: 'https://web.archive.org/web/20261101000000/https://www.stcatharinesstandard.ca/example-a',
    }
    const oneResult = validateCouncilRecordEntries([onePlusArchive])
    expect(oneResult.ok).toBe(false)
    expect(oneResult.errors.join(' ')).toMatch(/two credible sources/)
    expect(oneResult.errors.join(' ')).not.toMatch(/one credible source plus an archived copy/)

    const ownPage = validEntry({ id: 'own-page' })
    ownPage.statement = {
      ...ownPage.statement,
      sources: [
        source('https://www.stcatharinesstandard.ca/example-a'),
        source('https://alexexample.ca/budget', 'Alex Example', true),
      ],
    }
    const ownResult = validateCouncilRecordEntries([ownPage])
    expect(ownResult.ok).toBe(false)
    expect(ownResult.errors.join(' ')).toMatch(/archived copy when a source is the councillor's own page or post/)

    ownPage.statement = {
      ...ownPage.statement,
      archived_copy_url: 'https://web.archive.org/web/20261118000000/https://alexexample.ca/budget',
    }
    expect(validateCouncilRecordEntries([ownPage]).ok).toBe(true)
  })

  it('rejects a missing second source, minutes link, comment request date, or last verified date', () => {
    const oneSource = validEntry()
    oneSource.statement = {
      exact_quote: oneSource.statement.exact_quote,
      sources: [oneSource.statement.sources[0]],
    }
    const noMinutes = validEntry({ id: 'no-minutes' })
    noMinutes.vote = { ...noMinutes.vote, minutes_url: '' }
    const noComment = validEntry({ id: 'no-comment' })
    delete noComment.comment_requested_date
    const noVerified = validEntry({ id: 'no-verified' })
    noVerified.last_verified_date = ''
    const socialOnly = validEntry({ id: 'social-only' })
    socialOnly.statement = {
      exact_quote: 'Posted online.',
      sources: [
        source('https://x.com/example/status/1', 'X'),
        source('https://www.facebook.com/example/posts/1', 'Facebook'),
      ],
      archived_copy_url: 'https://web.archive.org/web/1/https://x.com/example/status/1',
    }

    for (const entry of [oneSource, noMinutes, noComment, noVerified, socialOnly]) {
      const result = validateCouncilRecordEntries([entry])
      expect(result.ok, entry.id).toBe(false)
    }

    expect(validateCouncilRecordEntries([oneSource]).errors.join(' ')).toMatch(/two credible sources/)
    expect(validateCouncilRecordEntries([noMinutes]).errors.join(' ')).toMatch(/minutes_url is required/)
    expect(validateCouncilRecordEntries([noComment]).errors.join(' ')).toMatch(/comment_requested_date is required/)
    expect(validateCouncilRecordEntries([noVerified]).errors.join(' ')).toMatch(/last_verified_date is required/)
    expect(validateCouncilRecordEntries([socialOnly]).errors.join(' ')).toMatch(/Social media alone is not enough/)
  })

  it('keeps status labels neutral and leaves private life out of the record', () => {
    for (const status of ['kept', 'broken', 'flip-flop', 'liar']) {
      const entry = validEntry({ id: `status-${status}`, status })
      const result = validateCouncilRecordEntries([entry])
      expect(result.ok).toBe(false)
      expect(result.errors.join(' ')).toMatch(/neutral record label/)
    }

    const family = validEntry({ id: 'family' })
    family.family = 'a relative'
    expect(validateCouncilRecordEntries([family]).ok).toBe(false)

    const undisclosed = validEntry({ id: 'home' })
    undisclosed.public_disclosure = { home: 'a street' }
    expect(validateCouncilRecordEntries([undisclosed]).ok).toBe(false)

    const filing = validEntry({ id: 'filing' })
    filing.disclosure_basis = 'conflict-of-interest-filing'
    filing.public_disclosure = { privatebusiness: 'named in the filing' }
    expect(validateCouncilRecordEntries([filing]).ok).toBe(false)
    expect(validateCouncilRecordEntries([filing]).errors.join(' ')).toMatch(/private and is not published/)
  })

  it('requires a reply deadline at least two business days after the comment request', () => {
    const missing = validEntry({ id: 'no-deadline' })
    delete missing.reply_deadline
    expect(validateCouncilRecordEntries([missing]).errors.join(' ')).toMatch(/reply_deadline is required/)

    const tooSoon = validEntry({ id: 'too-soon', reply_deadline: '2026-11-19' })
    expect(validateCouncilRecordEntries([tooSoon]).ok).toBe(false)
    expect(validateCouncilRecordEntries([tooSoon]).errors.join(' ')).toMatch(/at least two business days/)

    expect(validateCouncilRecordEntries([validEntry({ id: 'on-time', reply_deadline: '2026-11-20' })]).ok).toBe(true)

    const friday = validEntry({
      id: 'friday-request',
      comment_requested_date: '2026-11-13',
      reply_deadline: '2026-11-16',
    })
    expect(validateCouncilRecordEntries([friday]).ok).toBe(false)
    friday.reply_deadline = '2026-11-17'
    expect(validateCouncilRecordEntries([friday]).ok).toBe(true)

    const saturday = validEntry({
      id: 'saturday-request',
      comment_requested_date: '2026-11-14',
      reply_deadline: '2026-11-16',
    })
    expect(validateCouncilRecordEntries([saturday]).ok).toBe(false)
    saturday.reply_deadline = '2026-11-17'
    expect(validateCouncilRecordEntries([saturday]).ok).toBe(true)
  })

  it('rejects a no-reply entry published on or before the reply deadline', () => {
    const onDeadline = validEntry({ id: 'published-on-deadline', published_date: '2026-11-20', reply: null })
    const beforeDeadline = validEntry({ id: 'published-before-deadline', published_date: '2026-11-19', reply: null })
    for (const entry of [onDeadline, beforeDeadline]) {
      const result = validateCouncilRecordEntries([entry])
      expect(result.ok, entry.id).toBe(false)
      expect(result.errors.join(' ')).toMatch(/cannot publish no reply until after reply_deadline/)
    }

    expect(validateCouncilRecordEntries([validEntry({ id: 'published-after', published_date: '2026-11-21', reply: null })]).ok).toBe(true)
    expect(validateCouncilRecordEntries([validEntry({
      id: 'reply-received-early',
      published_date: '2026-11-19',
      reply: 'The minutes match what I said.',
    })]).ok).toBe(true)
  })
})
