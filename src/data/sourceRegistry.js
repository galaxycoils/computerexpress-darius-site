/**
 * Approved official source registry.
 *
 * Collection jobs may request only enabled entries. Every enabled source
 * defaults to editorial review; this configuration cannot auto-publish news.
 */
export const sourceRegistry = [
  { id: 'st-catharines-news', name: 'City of St. Catharines News', city: 'St. Catharines', kind: 'official-notice', url: 'https://www.stcatharines.ca/news/', enabled: true, reviewRequired: true },
  { id: 'welland-news', name: 'City of Welland News', city: 'Welland', kind: 'official-notice', url: 'https://www.welland.ca/news/', enabled: true, reviewRequired: true },
  { id: 'thorold-news', name: 'City of Thorold News', city: 'Thorold', kind: 'official-notice', url: 'https://www.thorold.ca/news/', enabled: true, reviewRequired: true },
  { id: 'niagara-region-news', name: 'Niagara Region News', city: 'Niagara Region', kind: 'official-notice', url: 'https://www.niagararegion.ca/news/default.aspx', enabled: true, reviewRequired: true },
  { id: 'nrps-media-releases', name: 'Niagara Regional Police Service media releases', city: 'Niagara Region', kind: 'public-safety', url: 'https://www.niagarapolice.ca/news/media-releases/', enabled: true, reviewRequired: true },
]

export const sourceById = Object.fromEntries(sourceRegistry.map(source => [source.id, source]))
