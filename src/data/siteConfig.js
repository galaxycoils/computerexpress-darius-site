export const BASE_URL = import.meta.env?.VITE_BASE_URL || 'https://stcatharinesdigital.ca'

export const siteConfig = {
  name: 'St. Catharines Digital',
  shortName: 'StCatharinesDigital',
  domain: 'stcatharinesdigital.ca',
  url: BASE_URL,
  locale: 'en_CA',
  language: 'en-CA',
  phone: '+13653595973',
  phoneDisplay: '(365) 359-5973',
  email: 'hello@stcatharinesdigital.ca',
  calendlyUrl: 'https://calendly.com/tahamtandariush/30min',
  city: 'St. Catharines',
  region: 'ON',
  country: 'CA',
  geo: {
    latitude: 43.1594,
    longitude: -79.2449,
  },
  description:
    'Premium web design, technical SEO, and local growth systems for service businesses in St. Catharines, Niagara, and Ontario.',
  defaultImage: '/og-card.webp',
  googleBusinessProfile: {
    status: 'verified',
    cid: '17016497002048344369',
    addressMode: 'hidden-service-area',
    profileUrl: 'https://www.google.com/maps?cid=17016497002048344369',
    reviewUrl: '',
    mapsUrl: 'https://www.google.com/maps?cid=17016497002048344369',
    mapEmbedUrl: 'https://www.google.com/maps?q=St.%20Catharines%2C%20ON&output=embed',
    primaryCategory: 'Website designer',
    secondaryCategories: [
      'Internet marketing service',
      'Marketing agency',
      'Business development service',
    ],
    hoursNote: 'By appointment for service-area clients.',
    verificationNote: 'Google Business Profile is live. Direct review link will be enabled after the Google Place ID or review URL is confirmed.',
  },
}

export const serviceAreaCities = [
  {
    slug: 'st-catharines',
    name: 'St. Catharines',
    region: 'Niagara',
    searchAngle: 'competitive home-service searches around downtown, north end, and surrounding Niagara neighbourhoods',
  },
  {
    slug: 'niagara-falls',
    name: 'Niagara Falls',
    region: 'Niagara',
    searchAngle: 'tourism-adjacent local competition, mobile searches, and high-intent service-area queries',
  },
  {
    slug: 'welland',
    name: 'Welland',
    region: 'Niagara',
    searchAngle: 'contractor, repair, professional-service, and neighbourhood-intent searches across south Niagara',
  },
  {
    slug: 'grimsby',
    name: 'Grimsby',
    region: 'Niagara West',
    searchAngle: 'premium local services, commuter households, and west-Niagara buyer-intent searches',
  },
  {
    slug: 'thorold',
    name: 'Thorold',
    region: 'Niagara',
    searchAngle: 'fast-growing residential searches, service-area visibility, and Google Maps discovery',
  },
  {
    slug: 'fort-erie',
    name: 'Fort Erie',
    region: 'Niagara South',
    searchAngle: 'border-area searches, seasonal demand, and local service discovery across Niagara South',
  },
]

export const serviceAreaServices = [
  { slug: 'web-design', name: 'Web Design', keyword: 'web design' },
  { slug: 'local-seo', name: 'Local SEO', keyword: 'local SEO' },
]
