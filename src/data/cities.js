/** City + official-source config for news hubs and shared UI. */
export const CITIES = [
  {
    slug: 'st-catharines',
    name: 'St. Catharines',
    planningKeys: ['St. Catharines', 'St Catharines'],
    officialUrl: 'https://www.stcatharines.ca/',
  },
  {
    slug: 'welland',
    name: 'Welland',
    planningKeys: ['Welland'],
    officialUrl: 'https://www.welland.ca/',
  },
  {
    slug: 'thorold',
    name: 'Thorold',
    planningKeys: ['Thorold'],
    officialUrl: 'https://www.thorold.ca/',
  },
]

export const OFFICIAL_SOURCES = [
  { label: 'Niagara Regional Police', href: 'https://www.niagarapolice.ca/' },
  { label: 'City of St. Catharines', href: 'https://www.stcatharines.ca/' },
  { label: 'City of Welland', href: 'https://www.welland.ca/' },
  { label: 'City of Thorold', href: 'https://www.thorold.ca/' },
  { label: 'Niagara Region', href: 'https://www.niagararegion.ca/' },
]

export function cityBySlug(slug) {
  return CITIES.find((c) => c.slug === slug) || null
}

export function matchesCity(municipality, city) {
  if (!municipality || !city) return false
  const m = String(municipality).toLowerCase()
  return city.planningKeys.some((k) => m.includes(k.toLowerCase()))
}
