import { describe, expect, it } from 'vitest'
import {
  filterEntries,
  validateEntries,
  validateEntry,
  validateSupportResources,
} from './hateExtremism'
import {
  hateExtremismEntries,
  hateExtremismSupport,
  hateReportContacts,
} from './hateExtremismEntries'

const ISO = '2026-01-15'

function source(partial = {}) {
  return {
    outlet: 'Example Gazette',
    title: 'Example report about a fictional group',
    url: 'https://example.test/report',
    date: ISO,
    ...partial,
  }
}

function validEntry(partial = {}) {
  return {
    id: 'example-record',
    type: 'group',
    scope: 'niagara',
    title: 'Example group',
    summary: 'Described by the Example Gazette as "a fictional club used only in tests".',
    location: 'Example Harbour',
    status: 'documented',
    dateAdded: ISO,
    lastReviewed: '2026-02-01',
    correctionRequest: '/corrections?entry=example-record',
    sources: [
      source(),
      source({ outlet: 'Example Tribune', title: 'Second fictional report', url: 'https://example.test/second', date: '2026-01-16' }),
    ],
    namedIndividuals: [],
    corrections: [],
    ...partial,
  }
}

describe('hate and extremism validation', () => {
  it('accepts a fictional record with two attributed sources', () => {
    expect(validateEntry(validEntry()).ok).toBe(true)
  })

  it('rejects fewer than two sources for ordinary records', () => {
    const result = validateEntry(validEntry({ sources: [source()] }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/at least two sources/)
  })

  it('accepts one official statistics source and a methodology note', () => {
    const result = validateEntry(validEntry({
      id: 'example-stat',
      type: 'statistic',
      correctionRequest: '/corrections?entry=example-stat',
      summary: 'StatCan: 1 fictional count. Note: includes suspected incidents.',
      methodologyNote: 'includes suspected incidents',
      sources: [source({
        outlet: 'Statistics Canada',
        title: 'Fictional table',
        url: 'https://example.test/statcan',
      })],
    }))
    expect(result.ok).toBe(true)
  })

  it('rejects a single unofficial source on a statistic', () => {
    const result = validateEntry(validEntry({
      id: 'example-stat',
      type: 'statistic',
      correctionRequest: '/corrections?entry=example-stat',
      summary: 'Example Gazette: "1 fictional count".',
      sources: [source()],
    }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/official statistics publisher/)
  })

  it('rejects a named person without a qualifying basis', () => {
    const result = validateEntry(validEntry({
      namedIndividuals: [{
        name: 'Example Person',
        basis: 'rumour',
        qualifies: true,
        quotedDescription: '"Example Person leads the fictional club" (Example Gazette)',
        sources: ['https://example.test/report', 'https://example.test/second'],
      }],
    }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/qualifying basis/)
  })

  it('rejects a named person when the qualifying flag is missing', () => {
    const result = validateEntry(validEntry({
      namedIndividuals: [{
        name: 'Example Person',
        basis: 'public-figure',
        qualifies: false,
        quotedDescription: '"Example Person" (Example Gazette)',
        sources: ['https://example.test/report', 'https://example.test/second'],
      }],
    }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/qualifies/)
  })

  it('accepts a fictional public figure confirmed by two sources', () => {
    const result = validateEntry(validEntry({
      namedIndividuals: [{
        name: 'Example Person',
        basis: 'public-figure',
        qualifies: true,
        quotedDescription: '"Example Person is the fictional leader" (Example Gazette)',
        sources: ['https://example.test/report', 'https://example.test/second'],
      }],
    }))
    expect(result.ok).toBe(true)
  })

  it('rejects address, phone, workplace, photo, family and minor fields', () => {
    for (const field of ['address', 'phone', 'workplace', 'photo', 'familyMembers', 'age']) {
      const result = validateEntry(validEntry({ [field]: 'secret' }))
      expect(result.ok, field).toBe(false)
      expect(result.errors.join(' '), field).toMatch(/prohibited field/)
    }
  })

  it('rejects a nested workplace and a minor age in prose', () => {
    const workplace = validateEntry(validEntry({
      namedIndividuals: [{
        name: 'Example Person',
        basis: 'charged',
        qualifies: true,
        quotedDescription: '"Example Person was charged" (Example Gazette)',
        sources: ['https://example.test/report', 'https://example.test/second'],
        workplace: 'Example Shop',
      }],
    }))
    expect(workplace.ok).toBe(false)
    const age = validateEntry(validEntry({ summary: 'Described by the Example Gazette as "a 14-year-old".' }))
    expect(age.ok).toBe(false)
    expect(age.errors.join(' ')).toMatch(/minor/)
  })

  it('rejects a label used in our own voice', () => {
    const result = validateEntry(validEntry({
      summary: 'This fictional person is a white supremacist, according to nobody in particular.',
    }))
    expect(result.ok).toBe(false)
    expect(result.errors.join(' ')).toMatch(/own voice/)
  })

  it('rejects a social-media source and a missing last-reviewed date', () => {
    const social = validateEntry(validEntry({
      sources: [
        source({ url: 'https://twitter.com/example/status/1' }),
        source({ url: 'https://example.test/second' }),
      ],
    }))
    expect(social.errors.join(' ')).toMatch(/social-media/)
    const reviewed = validateEntry(validEntry({ lastReviewed: '' }))
    expect(reviewed.errors.join(' ')).toMatch(/lastReviewed/)
  })

  it('filters by type, municipality and scope', () => {
    const rows = [
      validEntry({ id: 'a', location: 'Welland', type: 'incident' }),
      validEntry({ id: 'b', location: 'Thorold', scope: 'regional-context', type: 'group' }),
    ]
    expect(filterEntries(rows, { municipality: 'Welland' }).map((row) => row.id)).toEqual(['a'])
    expect(filterEntries(rows, { scope: 'regional-context' }).map((row) => row.id)).toEqual(['b'])
    expect(filterEntries(rows, { type: 'group' }).map((row) => row.id)).toEqual(['b'])
  })
})

describe('approved production records', () => {
  it('validates the approved entries and support list', () => {
    expect(validateEntries(hateExtremismEntries)).toEqual({ ok: true, errors: [] })
    expect(validateSupportResources(hateExtremismSupport).ok).toBe(true)
  })

  it('loads the approved ids and leaves unapproved records out', () => {
    expect(hateExtremismEntries.map((entry) => entry.id)).toEqual([
      'case-nf-graffiti-2026',
      'case-welland-graffiti-2024',
      'grp-second-sons',
      'grp-diagolon',
      'ctx-ns13',
      'inc-brocks-monument-2025',
      'inc-notl-response-2025',
      'inc-stats-statcan',
      'inc-stats-nrps-2023',
    ])
    const supportIds = hateExtremismSupport.map((entry) => entry.id)
    expect(supportIds).toEqual(['res-nrps', 'res-nrara', 'res-legal-clinic', 'res-pride-niagara'])
    const serialized = JSON.stringify({ hateExtremismEntries, hateExtremismSupport })
    expect(serialized).not.toMatch(/antihate\.ca|14-year-old|goof busters|proud boys/i)
  })

  it('keeps the Niagara Falls charge in the sources’ words and names nobody', () => {
    const entry = hateExtremismEntries.find((item) => item.id === 'case-nf-graffiti-2026')
    expect(entry.status).toBe('charged: mischief (not charged as a hate crime); before the courts')
    expect(entry.summary).toMatch(/hate-related graffiti/)
    expect(entry.summary).toMatch(/hate speech was spray painted on several buildings/)
    expect(entry.namedIndividuals).toEqual([])
    expect(entry.summary).not.toMatch(/\d{1,2}-year-old/)
  })

  it('loads the Welland youth case without names, ages, a school or a street', () => {
    const entry = hateExtremismEntries.find((item) => item.id === 'case-welland-graffiti-2024')
    const standard = entry.sources.find((item) => item.outlet === 'St. Catharines Standard')
    const review = entry.sources.find((item) => item.outlet === 'Niagara Falls Review')
    expect(standard.title).toBe('Hateful vandalism in Welland neighbourhood')
    expect(standard.date).toBe('2024-05-19')
    expect(standard.updated).toBe('2024-07-25')
    expect(review.date).toBe('2024-07-25')
    expect(entry.namedIndividuals).toEqual([])
    const text = JSON.stringify(entry)
    expect(text).not.toMatch(/\b\d{1,2}-year-olds?\b|\bschool\b|\bstreet\b|\bavenue\b|bradley|sauer/i)
    expect(text).not.toMatch(/niagarathisweek\.com/)
  })

  it('dates the rally to Labour Day weekend 2025 and does not call Diagolon a listed terrorist entity', () => {
    const rally = hateExtremismEntries.find((item) => item.id === 'inc-brocks-monument-2025')
    const group = hateExtremismEntries.find((item) => item.id === 'grp-second-sons')
    const diagolon = hateExtremismEntries.find((item) => item.id === 'grp-diagolon')
    expect(rally.eventDateLabel).toBe('Labour Day weekend 2025')
    expect(group.eventDateLabel).toBe('Labour Day weekend 2025')
    expect(rally.summary).toMatch(/Labour Day weekend 2025/)
    expect(rally.summary).not.toMatch(/Aug\. 30-31/)
    expect(diagolon.summary).toMatch(/NOT on Public Safety Canada's listed-entities list/)
    expect(diagolon.summary).not.toMatch(/listed terrorist entity/i)
    expect(diagolon.sources.map((item) => item.url).join(' ')).not.toMatch(/antihate\.ca/)
    expect(group.sources.map((item) => item.url).join(' ')).not.toMatch(/antihate\.ca/)
    expect(diagolon.namedIndividuals[0].quotedDescription).toMatch(/founder of Diagolon/)
    expect(diagolon.namedIndividuals[0].basis).toBe('public-figure')
  })

  it('lets the Statistics Canada figure through with one source and a methodology note', () => {
    const entry = hateExtremismEntries.find((item) => item.id === 'inc-stats-statcan')
    expect(entry.type).toBe('statistic')
    expect(entry.sources).toHaveLength(1)
    expect(entry.sources[0].outlet).toBe('Statistics Canada')
    expect(entry.sources[0].date).toBe('2026-03-30')
    expect(entry.methodologyNote).toBe('includes suspected incidents')
  })

  it('marks the unfinished Standard day as TODO material and keeps regional context', () => {
    const stats = hateExtremismEntries.find((item) => item.id === 'inc-stats-nrps-2023')
    expect(stats.sources[0].date).toBe('2024 (verify exact day)')
    const context = hateExtremismEntries.find((item) => item.id === 'ctx-ns13')
    expect(context.scope).toBe('regional-context')
    expect(context.namedIndividuals).toEqual([])
  })

  it('keeps the police numbers inside the approved support summary', () => {
    const police = hateExtremismSupport.find((item) => item.id === 'res-nrps')
    for (const contact of hateReportContacts) {
      expect(police.summary).toContain(contact.value.replace(/[()]/g, (char) => char))
    }
    expect(police.summary).toContain('911')
    expect(police.summary).toContain('(905) 688-4111')
  })
})
