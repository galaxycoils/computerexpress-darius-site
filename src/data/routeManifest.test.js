import { describe, expect, it } from 'vitest'
import { prerenderRoutes, sitemapRoutes, createSitemapXml, getRoutePageModule } from './routeManifest'

describe('newsroom route manifest', () => {
  it('keeps the removed Guides section out of prerendering and sitemap', () => {
    for (const routes of [prerenderRoutes, sitemapRoutes]) {
      expect(routes.some(route => route === '/guides' || route.startsWith('/guides/'))).toBe(false)
    }
  })
  it.each(['/', '/news', '/council', '/planning-tracker', '/votes', '/welland-votes'])('retains core newsroom route %s', route => {
    expect(prerenderRoutes).toContain(route)
    expect(sitemapRoutes).toContain(route)
  })
  it('prerenders the private preferences route without adding it to the sitemap', () => {
    expect(prerenderRoutes).toContain('/preferences')
    expect(sitemapRoutes).not.toContain('/preferences')
  })
  it('maps every prerendered route to its page module', () => {
    for (const route of prerenderRoutes) expect(getRoutePageModule(route)).toMatch(/^src\/pages\/.+\.jsx$/)
    expect(getRoutePageModule('/news/police')).toBe('src/pages/PoliceNewsPage.jsx')
    expect(getRoutePageModule('/news/st-catharines')).toBe('src/pages/CityNewsPage.jsx')
    expect(getRoutePageModule('/articles/example')).toBe('src/pages/ArticlePage.jsx')
  })
})

it('uses a verified content date only for an article route', () => {
  const xml = createSitemapXml()
  expect(xml).toContain('<lastmod>2026-09-02</lastmod>')
  expect(xml).not.toContain(`<lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`)
  expect(createSitemapXml()).toContain('<loc>https://stcatharinesdigital.ca/</loc>')
})
