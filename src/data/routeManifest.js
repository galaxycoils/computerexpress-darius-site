import { BASE_URL, serviceAreaCities } from './siteConfig.js'

export const baseRoutes = [
  '/',
  '/about',
  '/contact',
  '/sponsor',
  '/votes',
  '/editorial-policy',
  '/corrections',
  '/welland-votes',
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
  '/reader-services',
  '/search',
]

export const programmaticRoutes = []
export const privateRoutes = ['/preferences']

export const sitemapRoutes = baseRoutes.filter((r) => r !== '/404').concat(programmaticRoutes)
export const prerenderRoutes = [...baseRoutes, ...programmaticRoutes, ...privateRoutes, '/404']

export function getRouteSitemapMeta(route) {
  if (route === '/') return { priority: '1.0', changefreq: 'weekly' }
  if (['/about', '/contact', '/privacy', '/terms'].includes(route)) {
    return { priority: '0.8', changefreq: 'monthly' }
  }
  return { priority: '0.6', changefreq: 'monthly' }
}

export function canonicalRouteUrl(route) {
  const base = BASE_URL.replace(/\/$/, '')
  if (route === '/') return `${base}/`
  return `${base}${route.replace(/\/$/, '')}/`
}

export function createSitemapXml(routes = sitemapRoutes) {
  // Omit lastmod until a verified per-route content modification date is available.
  const urls = routes
    .filter((route) => route !== '/404')
    .map((route) => {
      const { priority, changefreq } = getRouteSitemapMeta(route)
      const loc = canonicalRouteUrl(route)
      return `  <url>
    <loc>${loc}</loc>
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
