import { describe, expect, it } from 'vitest'
import { MAYORAL_CANDIDATES, KEY_DATES, DOWN_BALLOT, RELATED_COVERAGE } from './wellandVotes'

describe('wellandVotes registry dataset', () => {
  it('lists all 8 certified mayoral candidates in registry order', () => {
    expect(MAYORAL_CANDIDATES.map((c) => c.name)).toEqual([
      'Natashia Bergen',
      'Pat Chiocchio',
      'David Clow',
      'Gary Graziani',
      'April Jeffs',
      'David McLeod',
      'Brandon Simon',
      'Graham Speck',
    ])
  })

  it('gives every candidate the same shape with equal weight', () => {
    for (const c of MAYORAL_CANDIDATES) {
      expect(typeof c.name).toBe('string')
      expect(typeof c.office).toBe('string')
      expect(Array.isArray(c.points)).toBe(true)
      if (c.site !== null) {
        expect(c.site).toMatch(/^https:\/\//)
        expect(typeof c.label).toBe('string')
      }
    }
  })

  it('covers key dates, down-ballot races, and related coverage', () => {
    expect(KEY_DATES.length).toBeGreaterThanOrEqual(7)
    expect(DOWN_BALLOT.length).toBe(9)
    expect(RELATED_COVERAGE.length).toBeGreaterThan(0)
  })
})
