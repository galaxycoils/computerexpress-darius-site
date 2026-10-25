import { describe, expect, it } from 'vitest'
import {
  filterEntries,
  formatSourceDate,
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
    published: '2026-01-20',
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
    const published = validateEntry(validEntry({ published: '' }))
    expect(published.errors.join(' ')).toMatch(/published/)
    const addedAfterPublished = validateEntry(validEntry({ dateAdded: '2026-03-02', published: '2026-03-01' }))
    expect(addedAfterPublished.ok).toBe(false)
    expect(addedAfterPublished.errors.join(' ')).toMatch(/dateAdded cannot be later than published/)
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
    expect(hateExtremismEntries.every((entry) => entry.published === '2026-10-16')).toBe(true)
    expect(hateExtremismEntries.every((entry) => entry.dateAdded === '2026-10-16')).toBe(true)
    expect(hateExtremismSupport.every((entry) => entry.published === '2026-10-16')).toBe(true)
    expect(hateExtremismSupport.every((entry) => entry.dateAdded === '2026-10-16')).toBe(true)
    for (const entry of [...hateExtremismEntries, ...hateExtremismSupport]) {
      expect(entry.dateAdded <= entry.published, entry.id).toBe(true)
    }
    expect(hateExtremismEntries.every((entry) => entry.correctionRequest === `/corrections?entry=${entry.id}`)).toBe(true)
    const supportIds = hateExtremismSupport.map((entry) => entry.id)
    expect(supportIds).toEqual(['res-nrps', 'res-nrara', 'res-legal-clinic', 'res-pride-niagara'])
    expect(hateExtremismSupport.every((entry) => entry.type === 'resource')).toBe(true)
    expect(hateExtremismSupport.find((entry) => entry.id === 'res-pride-niagara').sources).toHaveLength(1)
    const serialized = JSON.stringify({ hateExtremismEntries, hateExtremismSupport })
    expect(serialized).not.toMatch(/14-year-old|15-year-old|71-year-old|goof busters|proud boys|bradley|sauer|hildred|queen st|zimmerman/i)
    const falls = hateExtremismEntries.find((entry) => entry.id === 'case-nf-graffiti-2026')
    expect(falls.status).toBe('charged with mischief under $5,000; released with a future court date (Niagara Daily News, May 8, 2026)')
    expect(falls.status).not.toMatch(/not charged as a hate crime|before the courts|undertaking/)
    expect(serialized).not.toMatch(/undertaking/i)
    expect(falls.summary).toBe('Niagara Daily News: "hate-related graffiti"; "hate speech was spray painted on several buildings." 105-1 The River: "hate speech had been spray painted on buildings."')
    expect(falls.sources.map((source) => source.outlet)).toContain('105-1 The River')
    expect(JSON.stringify(falls)).not.toMatch(/105\.7/)
    expect(falls.namedIndividuals).toEqual([])
    const welland = hateExtremismEntries.find((entry) => entry.id === 'case-welland-graffiti-2024')
    expect(JSON.stringify(welland)).not.toMatch(/\bschool\b|\bage\b/i)
    expect(welland.namedIndividuals).toEqual([])
  })

  it('dates the Brock rally to Aug. 30, 2025 and does not call Diagolon a listed terrorist entity', () => {
    const rally = hateExtremismEntries.find((item) => item.id === 'inc-brocks-monument-2025')
    const group = hateExtremismEntries.find((item) => item.id === 'grp-second-sons')
    const diagolon = hateExtremismEntries.find((item) => item.id === 'grp-diagolon')
    expect(rally.eventDateLabel).toBe('Aug. 30, 2025 (per Niagara Parks, via CBC)')
    expect(group.eventDateLabel).toBe('Aug. 30, 2025')
    expect(group.summary).toMatch(/Aug\. 30, 2025/)
    expect(rally.summary).toContain('Date: Aug. 30, 2025 (per Niagara Parks, via CBC).')
    expect(rally.summary).toContain('CBC (Sept. 9, 2025): Second Sons "shared photos and videos on social media showing about 50 people marching, chanting and carrying flags through Queenston Heights Park"')
    expect(rally.summary).toContain('"Most of the people in those images are wearing matching white masks and black T-shirts."')
    expect(rally.summary).toContain('CBC said the rally "is prompting concern about rising anti-immigrant sentiment and recruitment efforts of extremist groups."')
    expect(rally.summary).toContain('Niagara Parks (via CBC): "no incidents were reported."')
    expect(rally.summary).toContain('St. Catharines Standard (Sept. 4, 2025): "dozens of men wearing white face coverings" and "One video showed more than 50 men."')
    expect(rally.summary).not.toMatch(/Labour Day weekend|Aug\. 31|does not assign a single day/)
    expect(rally.summary).not.toContain('About 50 masked men')
    expect(rally.summary).not.toContain('"About 50" masked men')
    expect(diagolon.summary).toContain('GPAHE\'s June 6, 2024 page calls it a "white supremacist Canadian movement"')
    expect(diagolon.summary).not.toMatch(/April 27|Apr\. 27/)
    expect(diagolon.summary).toMatch(/NOT on Public Safety Canada's listed-entities list/)
    expect(diagolon.summary).not.toMatch(/listed terrorist entity/i)
    expect(diagolon.sources.map((item) => item.url)).toContain('https://www.antihate.ca/diagolon_canada_homegrown_white_nationalist_network')
    expect(diagolon.namedIndividuals).toHaveLength(1)
    expect(diagolon.namedIndividuals[0].name).toBe('Jeremy MacKenzie')
    expect(diagolon.namedIndividuals[0].quotedDescription).toBe('"Second Sons leader Jeremy MacKenzie is also the founder of Diagolon" (CBC, 2025-09-09). St. Catharines Standard (2025-09-04): "Diagolon was founded during the COVID-19 pandemic as an anti-government and anti-institution movement by social media influencer Jeremy MacKenzie."')
    expect(diagolon.namedIndividuals[0].sources).toEqual([
      'https://www.cbc.ca/news/canada/hamilton/second-sons-rally-in-niagara-1.7628162',
      'https://www.stcatharinesstandard.ca/news/niagara-region/public-and-open-with-their-hate-masked-white-nationalist-group-marches-at-popular-niagara-monument/article_e197d7cf-445b-5e9e-9bb5-36dd4986ac0e.html',
    ])
    expect(diagolon.namedIndividuals[0].basis).toBe('self-identified-leader')
    expect(group.sources.some((source) => source.date === '2025-06-11')).toBe(true)
  })

  it('lets the Statistics Canada figure through with one source and a methodology note', () => {
    const entry = hateExtremismEntries.find((item) => item.id === 'inc-stats-statcan')
    expect(entry.type).toBe('statistic')
    expect(entry.sources).toHaveLength(1)
    expect(entry.sources[0].outlet).toBe('Statistics Canada')
    expect(entry.sources[0].date).toBe('2026-03-30')
    expect(entry.methodologyNote).toBe('includes suspected incidents')
  })

  it('dates the GPAHE Diagolon posts and keeps regional context', () => {
    const diagolon = hateExtremismEntries.find((item) => item.id === 'grp-diagolon')
    const gpahe = diagolon.sources.filter((source) => source.outlet === 'GPAHE')
    expect(gpahe.map((source) => ({ url: source.url, date: source.date, updated: source.updated }))).toEqual([
      {
        url: 'https://globalextremism.org/post/diagolon-lgbtq/',
        date: '2023-04-27',
        updated: undefined,
      },
      {
        url: 'https://globalextremism.org/post/white-supremacist-diagolon-movement-now-calling-for-deportation-of-all-indians/',
        date: '2024-06-06',
        updated: '2024-08-19',
      },
    ])
    expect(gpahe.some((source) => source.date === 'undated' || /TODO|verify exact day/i.test(source.date))).toBe(false)
    expect(formatSourceDate('2023-04-27')).toBe('April 27, 2023')
    expect(formatSourceDate('2024-06-06')).toBe('June 6, 2024')
    expect(formatSourceDate('2024-08-19')).toBe('August 19, 2024')
    expect(formatSourceDate('2023 (verify exact day)')).toBe('undated')
    expect(formatSourceDate('TODO: 2024')).toBe('undated')
    expect(formatSourceDate('TODO: 2024')).not.toMatch(/TODO/)
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
    expect(notl.summary).toContain('Sept. 9, 2025')
    expect(notl.summary).not.toContain('Sept. 10')
    expect(notl.summary).toContain('this type of hate has no place in our Town')
    expect(notl.summary).not.toMatch(/council meeting minutes/i)
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
