import { describe, expect, it } from 'vitest'
import { MAYORAL_CANDIDATES, KEY_DATES, DOWN_BALLOT, RELATED_COVERAGE, CITY_RESULTS } from './wellandVotes'

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

  it('carries certified vote counts with exactly one elected mayor', () => {
    for (const c of MAYORAL_CANDIDATES) {
      expect(typeof c.votes).toBe('number')
      expect(c.votes).toBeGreaterThan(0)
      expect(typeof c.elected).toBe('boolean')
    }
    const elected = MAYORAL_CANDIDATES.filter((c) => c.elected)
    expect(elected).toHaveLength(1)
    expect(elected[0].name).toBe('Pat Chiocchio')
    expect(elected[0].votes).toBe(4271)
    for (const c of MAYORAL_CANDIDATES) {
      if (!c.elected) expect(c.votes).toBeLessThan(elected[0].votes)
    }
  })

  it('covers key dates, down-ballot races, and related coverage', () => {
    expect(KEY_DATES.length).toBeGreaterThanOrEqual(7)
    expect(DOWN_BALLOT.length).toBe(10)
    expect(RELATED_COVERAGE.length).toBeGreaterThan(0)
  })

  it('links office history and the acclaimed French Separate trustee to City of Welland pages', () => {
    for (const candidate of MAYORAL_CANDIDATES) {
      if (!candidate.office) {
        expect(candidate.officeSource).toBeUndefined()
        continue
      }
      expect(candidate.officeSource).toMatch(/^https:\/\/www\.welland\.ca\//)
    }
    const philome = DOWN_BALLOT.find((race) => race.detail.includes('Jean Max Philome'))
    expect(philome.office).toMatch(/French Separate/)
    expect(philome.detail).toMatch(/Acclaimed/)
    expect(philome.source).toBe(CITY_RESULTS)
  })

  it('names two elected councillors for each of the six wards', () => {
    const wards = DOWN_BALLOT.filter((d) => d.slug)
    expect(wards).toHaveLength(6)
    for (const w of wards) {
      expect(w.detail).toMatch(/^Elected: .+ · .+$/)
      expect(w.slug).toMatch(/^ward-[1-6]$/)
    }
  })
})
