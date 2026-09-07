import { BASE_URL, serviceAreaCities, siteConfig } from './siteConfig'

export function getServiceAreaSchema() {
  return serviceAreaCities.map(city => ({
    '@type': 'City',
    name: city.name,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: city.region,
    },
  }))
}

export function getLocalBusinessSchema(overrides = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${BASE_URL}/#localbusiness`,
    name: siteConfig.name,
    url: BASE_URL,
    logo: `${BASE_URL}/logo-mark.svg`,
    image: `${BASE_URL}${siteConfig.defaultImage}`,
    email: siteConfig.email,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      ...getServiceAreaSchema(),
      { '@type': 'AdministrativeArea', name: 'Niagara Region' },
      { '@type': 'Country', name: 'Canada' },
    ],
    knowsAbout: [
      'Municipal Planning Notices',
      'Council Decisions',
      'Police Media Releases',
      'Official Sources',
      'Local News',
      'St. Catharines',
      'Welland',
      'Thorold',
    ],
  }

  if (siteConfig.googleBusinessProfile?.mapsUrl) schema.hasMap = siteConfig.googleBusinessProfile.mapsUrl
  if (siteConfig.googleBusinessProfile?.profileUrl) schema.sameAs = [siteConfig.googleBusinessProfile.profileUrl]

  return { ...schema, ...overrides }
}

export function getVideoObjectSchema({ name, description, path, thumbnailPath, uploadDate = '2026-05-23', duration = 'PT25S' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name, description,
    thumbnailUrl: `${BASE_URL}${thumbnailPath}`,
    contentUrl: `${BASE_URL}${path}`,
    embedUrl: `${BASE_URL}${path}`,
    uploadDate, duration,
  }
}

export function getNewsMediaSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: siteConfig.name,
    url: BASE_URL,
    description: siteConfig.description,
    logo: `${BASE_URL}/logo-mark.svg`,
    sameAs: [siteConfig.googleBusinessProfile?.mapsUrl].filter(Boolean),
    areaServed: getServiceAreaSchema(),
    knowsAbout: ['Municipal News', 'Council Decisions', 'Police Releases', 'Planning Tracker'],
  }
}

export function getContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact St. Catharines Digital',
    url: `${BASE_URL}/contact`,
    description: 'Contact the St. Catharines Digital editorial team.',
  }
}

export function getBlogPostSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    name: 'Blog Post',
    url: BASE_URL,
    description: 'Latest municipal news and planning updates from St. Catharines Digital.',
  }
}

export function getNotFoundSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Page Not Found',
    url: BASE_URL,
    description: 'The page you are looking for does not exist on St. Catharines Digital.',
  }
}

export function getPrivacySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    url: `${BASE_URL}/privacy`,
    description: 'Privacy policy for St. Catharines Digital.',
  }
}

export function getTermsSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Terms of Use',
    url: `${BASE_URL}/terms`,
    description: 'Terms of use for St. Catharines Digital.',
  }
}