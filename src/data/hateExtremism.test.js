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

  it('accepts one source and a phone number on a resource', () => {
    const result = validateEntry(validEntry({
      id: 'example-resource',
      type: 'resource',
      correctionRequest: '/corrections?entry=example-resource',
      summary: 'Example help line: (905) 555-0100.',
      sources: [source()],
    }))
    expect(result.ok).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects a resource with no source and a phone number on any other type', () => {
    const empty = validateEntry(validEntry({
      id: 'example-resource',
      type: 'resource',
      correctionRequest: '/corrections?entry=example-resource',
      summary: 'Example help line.',
      sources: [],
    }))
    expect(empty.ok).toBe(false)
    expect(empty.errors.join(' ')).toMatch(/at least one source/)
    const phone = validateEntry(validEntry({
      summary: 'Described by the Example Gazette as "a fictional club". Call (905) 555-0199.',
    }))
    expect(phone.ok).toBe(false)
    expect(phone.errors.join(' ')).toMatch(/phone number/)
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

  it('loads the approved records and leaves held items out', () => {
    expect(hateExtremismEntries.map((entry) => entry.id)).toEqual([
      'grp-second-sons',
      'grp-diagolon',
      'inc-brocks-monument-2025',
      'inc-stats-statcan',
      'ctx-ns13',
      'case-nf-graffiti-2026',
      'case-welland-graffiti-2024',
      'inc-notl-response-2025',
      'inc-stats-nrps-2023',
    ])
    expect(hateExtremismEntries.every((entry) => entry.lastReviewed === '2026-10-17')).toBe(true)
    expect(hateExtremismEntries.every((entry) => entry.correctionRequest === `/corrections?entry=${entry.id}`)).toBe(true)
    const supportIds = hateExtremismSupport.map((entry) => entry.id)
    expect(supportIds).toEqual(['res-nrps', 'res-nrara', 'res-legal-clinic', 'res-pride-niagara'])
    expect(hateExtremismSupport.every((entry) => entry.type === 'resource')).toBe(true)
    expect(hateExtremismSupport.find((entry) => entry.id === 'res-pride-niagara').sources).toHaveLength(1)
    const serialized = JSON.stringify({ hateExtremismEntries, hateExtremismSupport })
    expect(serialized).not.toMatch(/14-year-old|15-year-old|71-year-old|goof busters|proud boys|bradley|sauer|hildred|queen st|zimmerman/i)
    const falls = hateExtremismEntries.find((entry) => entry.id === 'case-nf-graffiti-2026')
    expect(falls.status).toBe('charged: mischief (not charged as a hate crime); before the courts')
    expect(falls.summary).toBe('Niagara Daily News: "hate-related graffiti"; "hate speech was spray painted on several buildings." 105.7 The River: "hate speech had been spray painted on buildings."')
    expect(falls.namedIndividuals).toEqual([])
    const welland = hateExtremismEntries.find((entry) => entry.id === 'case-welland-graffiti-2024')
    expect(JSON.stringify(welland)).not.toMatch(/\bschool\b|\bage\b/i)
    expect(welland.namedIndividuals).toEqual([])
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
    expect(diagolon.sources.map((item) => item.url)).toContain('https://www.antihate.ca/diagolon_canada_homegrown_white_nationalist_network')
    expect(diagolon.namedIndividuals).toHaveLength(1)
    expect(diagolon.namedIndividuals[0].name).toBe('Jeremy MacKenzie')
    expect(diagolon.namedIndividuals[0].quotedDescription).toBe('founder of Diagolon (CBC 2025-09-09; St. Catharines Standard)')
    expect(diagolon.namedIndividuals[0].basis).toBe('self-identified-leader')
    expect(group.sources.some((source) => source.date === '2025 (verify exact day)')).toBe(true)
  })

  it('lets the Statistics Canada figure through with one source and a methodology note', () => {
    const entry = hateExtremismEntries.find((item) => item.id === 'inc-stats-statcan')
    expect(entry.type).toBe('statistic')
    expect(entry.sources).toHaveLength(1)
    expect(entry.sources[0].outlet).toBe('Statistics Canada')
    expect(entry.sources[0].date).toBe('2026-03-30')
    expect(entry.methodologyNote).toBe('includes suspected incidents')
  })

  it('marks unfinished source days as TODO material and keeps regional context', () => {
    const diagolon = hateExtremismEntries.find((item) => item.id === 'grp-diagolon')
    expect(diagolon.sources.some((source) => source.date === '2024 (verify exact day)')).toBe(true)
    const context = hateExtremismEntries.find((item) => item.id === 'ctx-ns13')
    expect(context.scope).toBe('regional-context')
    expect(context.title).toMatch(/Hamilton-based/)
    expect(context.summary).toBe('CBC News: "A CBC visual investigation recently found Second Sons and active club Nationalist-13 to be training in martial arts studios, gyms and parks in the Hamilton and Niagara area."')
    expect(context.summary).not.toMatch(/also calls it|active in Niagara/)
    expect(context.namedIndividuals).toEqual([])
    const nrps = hateExtremismEntries.find((item) => item.id === 'inc-stats-nrps-2023')
    expect(nrps.summary).toContain('as reported by the Standard')
    expect(nrps.sources.map((source) => source.outlet)).toEqual(['St. Catharines Standard', 'St. Catharines Standard'])
    const notl = hateExtremismEntries.find((item) => item.id === 'inc-notl-response-2025')
    expect(notl.summary).toContain('this type of hate has no place in our Town')
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
