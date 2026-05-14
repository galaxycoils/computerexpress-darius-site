import { Helmet } from 'react-helmet-async'

const SITE = 'ComputerExpress'
const BASE = import.meta.env.VITE_BASE_URL || 'https://computerexpress.pages.dev'
const DEFAULT_IMG = '/og-card.png'

export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMG,
  type = 'website',
  noIndex = false,
  jsonLd
}) {
  const url = `${BASE}${path}`
  const img = image.startsWith('http') ? image : `${BASE}${image}`

  const defaults = {
    '/': {
      title: `${SITE} | Web Design & Local SEO for Service Businesses`,
      description: 'ComputerExpress builds premium websites, technical SEO systems, and local growth engines for service businesses. AI-first web design + local SEO that ranks.',
    },
    '/services': {
      title: `Web Design, Technical SEO & GBP Optimization Services | ${SITE}`,
      description: 'Expert web design, technical SEO, and Google Business Profile optimization for service businesses. Custom websites that rank on Google and convert visitors into leads.',
    },
    '/about': {
      title: `About ${SITE} | AI-First Web Design & SEO Agency`,
      description: 'ComputerExpress is an AI-first web design and local SEO agency. We combine modern design, technical SEO, and local growth systems for service businesses.',
    },
    '/contact': {
      title: `Get a Free SEO Audit | ${SITE}`,
      description: 'Request a free SEO audit from ComputerExpress. Tell us about your website, service area, and goals. We typically respond within 24 hours.',
    },
    '/success': {
      title: `Request Received | ${SITE}`,
      description: 'Your audit request has been submitted.',
    },
  }

  const pageDefaults = defaults[path] || defaults['/']
  const finalTitle = title || pageDefaults.title
  const finalDesc = description || pageDefaults.description

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
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
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={`${finalTitle}`} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
