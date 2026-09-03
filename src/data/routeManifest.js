import { BASE_URL, serviceAreaCities, serviceAreaServices } from './siteConfig.js'

export const baseRoutes = [
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
  '/partner',
  '/planning-tracker',
  '/privacy',
  '/terms',
]

export const programmaticRoutes = serviceAreaServices.flatMap((service) =>
  serviceAreaCities.map((city) => `/service-areas/${service.slug}/${city.slug}`)
)

export const sitemapRoutes = [...baseRoutes, ...programmaticRoutes]
export const prerenderRoutes = [...sitemapRoutes, '/404']

export function getRouteSitemapMeta(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' }
  if (['/services', '/contact', '/free-audit'].includes(route)) {
    return { priority: '0.9', changefreq: 'monthly' }
  }
  if (route.startsWith('/services/') || route.startsWith('/service-areas/')) {
    return { priority: '0.8', changefreq: 'monthly' }
  }
  return { priority: '0.7', changefreq: 'monthly' }
}

export function canonicalRouteUrl(route) {
  const base = BASE_URL.replace(/\/$/, '')
  if (route === '/') return `${base}/`
  return `${base}${route.replace(/\/$/, '')}/`
}

export function createSitemapXml(routes = sitemapRoutes, date = new Date()) {
  const today = date.toISOString().split('T')[0]
  const urls = routes
    .filter((route) => route !== '/404')
    .map((route) => {
      const { priority, changefreq } = getRouteSitemapMeta(route)
      const loc = canonicalRouteUrl(route)
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}
