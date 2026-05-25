import { Helmet } from 'react-helmet-async'
import { siteConfig, BASE_URL } from '../data/siteConfig'

export { BASE_URL }

const SITE = siteConfig.name
const BASE = BASE_URL.replace(/\/$/, '')
const DEFAULT_IMG = siteConfig.defaultImage

function canonicalUrl(path) {
  if (path === '/') return `${BASE}/`
  return `${BASE}${path.replace(/\/$/, '')}/`
}

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMG,
  type = 'website',
  noIndex = false,
  jsonLd
}) {
  const url = canonicalUrl(path)
  const img = image.startsWith('http') ? image : `${BASE}${image}`

  const defaults = {
    '/': {
      title: `${SITE} | Web Design, SEO & Digital Marketing for Service Businesses`,
      description: `${SITE} builds premium websites, technical SEO systems, and local growth engines for service businesses in St. Catharines and across Ontario. AI-first web design + local SEO that ranks.`,
    },
    '/services': {
      title: `${SITE} | Web Design, Technical SEO & GBP Optimization Services`,
      description: `Expert web design, technical SEO, and Google Business Profile optimization for service businesses. Custom websites that rank on Google and convert visitors into qualified leads.`,
    },
    '/about': {
      title: `About ${SITE} | Web Design & SEO Agency`,
      description: `${SITE} is a St. Catharines-based web design and local SEO agency. We combine modern design, technical SEO, and local growth systems for service businesses.`,
    },
    '/contact': {
      title: `Contact ${SITE} | Get a Free SEO Audit`,
      description: `Contact ${SITE} for web design, technical SEO, and local SEO services. Book a free 30-minute call or send us a message.`,
    },
    '/success': {
      title: `Request Received | ${SITE}`,
      description: 'Your request has been submitted.',
    },
  }

  const pageDefaults = defaults[path] || defaults['/']
  const finalTitle = title || pageDefaults.title
  const finalDesc = description || pageDefaults.description

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content={siteConfig.city} />
      <meta name="geo.position" content={`${siteConfig.geo.latitude};${siteConfig.geo.longitude}`} />
      <meta name="ICBM" content={`${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      )}
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${finalTitle}`} />
      <meta property="og:locale" content={siteConfig.locale.replace('-', '_')} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={`${finalTitle}`} />
      {jsonLd && (
        Array.isArray(jsonLd) ? (
          jsonLd.map((schema, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        )
      )}
    </Helmet>
  )
}
