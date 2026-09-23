/**
 * Approved official source registry.
 *
 * Collection runs against enabled entries and proposes discovery.json
 * changes through checked pull requests. Items are primary-source links only.
 */
export const sourceRegistry = [
  { id: 'st-catharines-news', name: 'City of St. Catharines News', city: 'St. Catharines', kind: 'official-notice', url: 'https://www.stcatharines.ca/news/', enabled: true, reviewRequired: false },
  { id: 'st-catharines-public-notices', name: 'City of St. Catharines Public Notices', city: 'St. Catharines', kind: 'official-notice', url: 'https://www.stcatharines.ca/news/public-notices/', enabled: true, reviewRequired: false },
  { id: 'welland-news', name: 'City of Welland News', city: 'Welland', kind: 'official-notice', url: 'https://www.welland.ca/news/', enabled: true, reviewRequired: false },
  { id: 'thorold-news', name: 'City of Thorold News', city: 'Thorold', kind: 'official-notice', url: 'https://www.thorold.ca/news/', enabled: true, reviewRequired: false },
  { id: 'niagara-region-news', name: 'Niagara Region Public Notices', city: 'Niagara Region', kind: 'official-notice', url: 'https://www.niagararegion.ca/news/notices/default.aspx', enabled: true, reviewRequired: false },
  { id: 'nrps-media-releases', name: 'Niagara Regional Police Service media releases', city: 'Niagara Region', kind: 'public-safety', url: 'https://www.niagarapolice.ca/news/media-releases/', enabled: true, reviewRequired: false },
]

export const sourceById = Object.fromEntries(sourceRegistry.map(source => [source.id, source]))
