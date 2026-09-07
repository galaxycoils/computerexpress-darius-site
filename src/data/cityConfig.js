export const cities = [
  {
    slug: 'st-catharines',
    name: 'St. Catharines',
    officialSite: 'https://www.stcatharines.ca/',
    planningKey: 'St. Catharines',
    description: 'Official municipal notices, council decisions, and planning updates for St. Catharines.',
  },
  {
    slug: 'welland',
    name: 'Welland',
    officialSite: 'https://www.welland.ca/',
    planningKey: 'Welland',
    description: 'Official municipal notices, council decisions, and planning updates for Welland.',
  },
  {
    slug: 'thorold',
    name: 'Thorold',
    officialSite: 'https://www.thorold.ca/',
    planningKey: 'Thorold',
    description: 'Official municipal notices, council decisions, and planning updates for Thorold.',
  },
]

export const cityBySlug = Object.fromEntries(cities.map(c => [c.slug, c]))
