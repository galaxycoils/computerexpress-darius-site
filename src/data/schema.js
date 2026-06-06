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

export function getPartnerPageSchema({ retainerTiers } = {}) {
  const tiers = retainerTiers || []
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${BASE_URL}/partner#service`,
      name: 'Local Authority Partner',
      description: 'Done-for-you monthly local SEO, content, and Google Business Profile management for service businesses. Three tiers: Foundation, Growth, Dominance.',
      provider: {
        '@type': 'Organization',
        name: 'St. Catharines Digital',
        url: BASE_URL,
      },
      areaServed: [
        { '@type': 'City', name: 'St. Catharines' },
        { '@type': 'State', name: 'Ontario' },
        { '@type': 'Country', name: 'Canada' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Local Authority Partner Retainer Tiers',
        itemListElement: tiers.map((t, i) => ({
          '@type': 'Offer',
          position: i + 1,
          name: t.name,
          price: t.price.replace(/[$,]/g, ''),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: t.price.replace(/[$,]/g, ''),
            priceCurrency: 'USD',
            billingDuration: 'P1M',
          },
          itemOffered: {
            '@type': 'Service',
            name: t.name,
            description: t.ideal,
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (tiers.length > 0 ? [] : [
        {
          '@type': 'Question',
          name: 'Is there a long-term contract?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Month-to-month after an initial 3-month commitment. Local SEO compounds over time — 90 days is the minimum to see meaningful movement. After 3 months, cancel anytime with 30 days notice.'
          }
        },
        {
          '@type': 'Question',
          name: 'What happens in the quarterly strategy call?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We review rankings, traffic, leads, and revenue impact. We adjust the content calendar, identify new service-area opportunities, and set priorities for the next quarter. You get a 1-page PDF summary + Loom walkthrough.'
          }
        },
        {
          '@type': 'Question',
          name: 'Do you write the blog posts or do I?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We write, optimize, and publish them. You approve topics via a shared Notion board. Posts target your service-area keywords and include local schema, internal links, and GBP post syndication.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do you track rankings?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We use LocalFalcon / Places Scout for grid-based Maps tracking across your service areas, plus standard organic rank tracking for your top 20 keywords. Reports delivered monthly.'
          }
        },
        {
          '@type': 'Question',
          name: 'What if I need to pause?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Life happens. One pause per 12 months (up to 60 days) at 50% retainer to hold your slot. No penalty, no awkward conversations.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I upgrade/downgrade tiers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, anytime. Changes take effect next billing cycle. Prorated adjustments applied automatically.'
          }
        },
      ]),
    },
  ].filter(Boolean)
}

export function getRetainerTierSchema(tier) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${BASE_URL}/partner#${tier.id}`,
    name: tier.name,
    description: tier.ideal,
    provider: {
      '@type': 'Organization',
      name: 'St. Catharines Digital',
      url: BASE_URL,
    },
    offers: {
      '@type': 'Offer',
      name: tier.name,
      price: tier.price.replace(/[$,]/g, ''),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: tier.price.replace(/[$,]/g, ''),
        priceCurrency: 'USD',
        billingDuration: 'P1M',
      },
    },
  }
}
