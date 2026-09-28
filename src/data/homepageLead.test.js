import { describe, expect, it } from 'vitest'
import { selectHomepageLead } from './homepageLead'

const story = (slug, date, overrides = {}) => ({
  id: slug,
  slug,
  date,
  sourceUrl: `https://example.ca/${slug}`,
  cities: ['St. Catharines'],
  topic: 'Local news',
  title: slug,
  ...overrides,
})

describe('homepage lead selection', () => {
  const now = new Date('2026-09-28T12:00:00Z')

  it('selects newest eligible St. Catharines story regardless of input order', () => {
    const older = story('older-story', '2026-09-20')
    const newer = story('newer-story', '2026-09-27')

    expect(selectHomepageLead([newer, older], '', now)).toBe(newer)
  })

  it('ignores undated, future, other-city, and public-safety stories', () => {
    const eligible = story('eligible', '2026-09-20')
    const records = [
      story('undated', null),
      story('future', '2026-09-29'),
      story('other-city', '2026-09-28', { cities: ['Welland'] }),
      story('police', '2026-09-28', { topic: 'Public safety' }),
      eligible,
    ]

    expect(selectHomepageLead(records, '', now)).toBe(eligible)
  })

  it('honours a configured eligible slug override', () => {
    const newest = story('newest', '2026-09-27')
    const selected = story('editorial-choice', '2026-09-01')

    expect(selectHomepageLead([newest, selected], 'editorial-choice', now)).toBe(selected)
  })

  it('falls back to freshest eligible story for an invalid override', () => {
    const newest = story('newest', '2026-09-27')

    expect(selectHomepageLead([newest], 'missing-story', now)).toBe(newest)
  })

  it('returns null when no eligible local stories exist', () => {
    expect(selectHomepageLead([story('police', '2026-09-27', { topic: 'Public safety' })], '', now)).toBeNull()
  })

  it('rejects impossible calendar dates and stories without a routeable slug', () => {
    expect(selectHomepageLead([
      story('invalid-day', '2026-02-30'),
      story('missing-slug', '2026-09-27', { slug: '' }),
    ], '', now)).toBeNull()
  })

  it('returns null for non-array input', () => {
    expect(selectHomepageLead(null, '', now)).toBeNull()
  })
})
