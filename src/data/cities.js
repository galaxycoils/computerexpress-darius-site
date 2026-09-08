/** Single source of truth for cities + official sources. */

export const CITIES = [
  {
    slug: 'st-catharines',
    name: 'St. Catharines',
    planningKey: 'St. Catharines',
    planningKeys: ['St. Catharines', 'St Catharines'],
    officialUrl: 'https://www.stcatharines.ca/',
    officialSite: 'https://www.stcatharines.ca/',
    description:
      'Official municipal notices, council decisions, and planning updates for St. Catharines.',
  },
  {
    slug: 'welland',
    name: 'Welland',
    planningKey: 'Welland',
    planningKeys: ['Welland'],
    officialUrl: 'https://www.welland.ca/',
    officialSite: 'https://www.welland.ca/',
    description: 'Official municipal notices, council decisions, and planning updates for Welland.',
  },
  {
    slug: 'thorold',
    name: 'Thorold',
    planningKey: 'Thorold',
    planningKeys: ['Thorold'],
    officialUrl: 'https://www.thorold.ca/',
    officialSite: 'https://www.thorold.ca/',
    description: 'Official municipal notices, council decisions, and planning updates for Thorold.',
  },
]

/** @deprecated use CITIES — kept for older imports */
export const cities = CITIES

export const cityBySlug = Object.fromEntries(CITIES.map((c) => [c.slug, c]))

export const OFFICIAL_SOURCES = [
  { label: 'Niagara Regional Police', href: 'https://www.niagarapolice.ca/' },
  { label: 'City of St. Catharines', href: 'https://www.stcatharines.ca/' },
  { label: 'City of Welland', href: 'https://www.welland.ca/' },
  { label: 'City of Thorold', href: 'https://www.thorold.ca/' },
  { label: 'Niagara Region', href: 'https://www.niagararegion.ca/' },
]

export function cityBySlugFn(slug) {
  return cityBySlug[slug] || null
}

export function matchesCity(municipality, city) {
  if (!municipality || !city) return false
  const m = String(municipality).toLowerCase()
  const keys = city.planningKeys || [city.planningKey, city.name]
  return keys.some((k) => k && m.includes(String(k).toLowerCase()))
}
