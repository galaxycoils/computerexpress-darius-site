import { BASE_URL, serviceAreaCities } from './siteConfig.js'

export const guideRoutes = [
  '/guides/st-catharines-ontario-street-corridor-plan',
  '/guides/welland-first-street-consent-variance',
  '/guides/thorold-pamela-drive-watermain',
]

export const baseRoutes = [
  '/',
  '/about',
  '/contact',
  '/sponsor',
  '/welland-votes',
  '/blog',
  '/privacy',
  '/terms',
  '/planning-tracker',
  '/council',
  '/police',
  '/news',
  '/news/police',
  '/news/st-catharines',
  '/news/welland',
  '/news/thorold',
  '/news/niagara-falls',
  '/planning-alerts',
  '/membership',
  ...guideRoutes,
]

export const programmaticRoutes = [
  '/blog/local-seo-checklist-2026',
  '/blog/how-to-get-more-leads-from-website',
  '/blog/technical-seo-explained',
  '/blog/google-business-profile-tips-local-seo',
  '/blog/how-to-rank-1-on-google-maps',
  '/blog/website-speed-optimization-tips',
  '/blog/how-much-does-local-seo-cost',
  '/blog/service-business-website-examples',
]

export const sitemapRoutes = baseRoutes.filter((r) => r !== '/404').concat(programmaticRoutes)
export const prerenderRoutes = [...baseRoutes, ...programmaticRoutes, '/404']

export function getRouteSitemapMeta(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' }
  if (['/about', '/contact', '/privacy', '/terms'].includes(route)) {
    return { priority: '0.8', changefreq: 'monthly' }
  }
  if (route.startsWith('/blog/')) {
    return { priority: '0.7', changefreq: 'monthly' }
  }
  return { priority: '0.6', changefreq: 'monthly' }
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
