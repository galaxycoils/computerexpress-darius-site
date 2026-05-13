import { Helmet } from 'react-helmet-async'

const SITE = 'ComputerExpress'
const DEFAULT_TITLE = 'ComputerExpress | AI-First Web Design & Local SEO'
const DEFAULT_DESC = 'ComputerExpress builds premium websites, technical SEO systems, and local growth engines for service businesses that need better visibility and more qualified leads.'

export default function Seo({ title = DEFAULT_TITLE, description = DEFAULT_DESC, path = '/', image = '/og-card.svg', type = 'website', jsonLd }) {
  const base = '' // will be set by Cloudflare Pages domain
  const url = base ? `${base}${path}` : undefined
  const img = base ? `${base}${image}` : image

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta property="og:site_name" content={SITE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:url" content={url} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
