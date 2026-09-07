export const BASE_URL = import.meta.env?.VITE_BASE_URL || 'https://stcatharinesdigital.ca'

export const siteConfig = {
  name: 'St. Catharines Digital',
  shortName: 'StCatharinesDigital',
  domain: 'stcatharinesdigital.ca',
  url: BASE_URL,
  locale: 'en_CA',
  language: 'en-CA',
  email: 'hello@stcatharinesdigital.ca',
  calendlyUrl: 'https://calendly.com/tahamtandariush/30min',
  city: 'St. Catharines',
  region: 'ON',
  country: 'CA',
  geo: {
    latitude: 43.1594,
    longitude: -79.2449,
  },
  description: 'Scans St. Catharines, Welland, Thorold, and Niagara Region notices every week and puts the active ones in one free digest. Official municipal sources only, no paywalls, no editorial interference.',
  defaultImage: '/og-card.webp',
  googleBusinessProfile: {
    status: 'verified',
    cid: '17016497002048344369',
    addressMode: 'hidden-service-area',
    profileUrl: 'https://www.google.com/maps?cid=17016497002048344369',
    reviewUrl: '',
    mapsUrl: 'https://www.google.com/maps?cid=17016497002048344369',
    mapEmbedUrl: 'https://www.google.com/maps?q=St.%20Catharines%2C%20ON&output=embed',
    primaryCategory: 'News publisher',
    secondaryCategories: [
      'Local news service',
    ],
    hoursNote: 'Digital news service.',
    verificationNote: 'Google Business Profile is live.',
  },
}

export const serviceAreaCities = [
  {
    slug: 'st-catharines',
    name: 'St. Catharines',
    region: 'Niagara',
    searchAngle: 'local news, council, planning and municipal updates',
  },
  {
    slug: 'welland',
    name: 'Welland',
    region: 'Niagara',
    searchAngle: 'local news, council and planning updates',
  },
  {
    slug: 'thorold',
    name: 'Thorold',
    region: 'Niagara',
    searchAngle: 'local news, council and planning updates',
  },
]
