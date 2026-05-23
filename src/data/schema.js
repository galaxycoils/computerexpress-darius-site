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
  const gbp = siteConfig.googleBusinessProfile
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: siteConfig.name,
    url: BASE_URL,
    logo: `${BASE_URL}/logo-horizontal.svg`,
    image: `${BASE_URL}${siteConfig.defaultImage}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: siteConfig.description,
    priceRange: '$$',
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
      'Web Design',
      'Technical SEO',
      'Local SEO',
      'Google Business Profile',
      'Google Maps visibility',
    ],
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Google Business Profile status',
        value: gbp.status,
      },
      {
        '@type': 'PropertyValue',
        name: 'Address display',
        value: gbp.addressMode,
      },
    ],
  }

  if (gbp.mapsUrl) schema.hasMap = gbp.mapsUrl
  if (gbp.profileUrl) schema.sameAs = [gbp.profileUrl]

  return { ...schema, ...overrides }
}

export function getVideoObjectSchema({
  name,
  description,
  path,
  thumbnailPath,
  uploadDate = '2026-05-23',
  duration = 'PT25S',
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl: `${BASE_URL}${thumbnailPath}`,
    contentUrl: `${BASE_URL}${path}`,
    embedUrl: `${BASE_URL}${path}`,
    uploadDate,
    duration,
  }
}
