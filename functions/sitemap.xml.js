const BASE_URL = 'https://stcatharinesdigital.ca'

const ROUTES = [
  '/',
  '/services',
  '/services/website-design',
  '/services/technical-seo',
  '/services/gbp-optimization',
  '/services/web-design-for-plumbers',
  '/services/web-design-for-hvac',
  '/services/web-design-for-electricians',
  '/services/web-design-for-landlords',
  '/services/local-seo-for-service-businesses',
  '/about',
  '/contact',
  '/success',
  '/blog',
  '/blog/local-seo-checklist-2026',
  '/blog/how-to-get-more-leads-from-website',
  '/blog/technical-seo-explained',
  '/blog/google-business-profile-tips-local-seo',
  '/blog/how-to-rank-1-on-google-maps',
  '/blog/website-speed-optimization-tips',
  '/blog/how-much-does-local-seo-cost',
  '/blog/service-business-website-examples',
  '/case-studies/plumber-case-study',
  '/case-studies/hvac-case-study',
  '/case-studies/legal-case-study',
  '/what-to-expect',
  '/free-audit',
  '/privacy',
  '/terms',
  ...['st-catharines', 'niagara-falls', 'welland', 'grimsby', 'thorold', 'fort-erie']
    .flatMap((city) => [`/service-areas/web-design/${city}`, `/service-areas/local-seo/${city}`])
]

export function onRequestGet() {
  const today = new Date().toISOString().split('T')[0]
  const urls = ROUTES.map((route) => {
    const priority = route === '/' ? '1.0' : ['/services', '/contact', '/free-audit'].includes(route) ? '0.9' : route.startsWith('/services/') || route.startsWith('/service-areas/') ? '0.8' : '0.7'
    const changefreq = route === '/' ? 'weekly' : 'monthly'
    return `  <url>
    <loc>${BASE_URL}${route === '/' ? '' : route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
