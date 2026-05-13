import { Helmet } from 'react-helmet-async'

const SITE = 'ComputerExpress'
const BASE = 'https://computerexpress.pages.dev'
const DEFAULT_TITLE = 'ComputerExpress | AI-First Web Design & Local SEO'
const DEFAULT_DESC = 'ComputerExpress builds premium websites, technical SEO systems, and local growth engines for service businesses that need better visibility and more qualified leads.'
const DEFAULT_IMG = '/og-card.svg'

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '/',
  image = DEFAULT_IMG,
  type = 'website',
  noIndex = false,
  jsonLd
}) {
  const url = `${BASE}${path}`
  const img = image.startsWith('http') ? image : `${BASE}${image}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      )}
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE} — AI-First Web Design & Local SEO`} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={`${SITE} — AI-First Web Design & Local SEO`} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
