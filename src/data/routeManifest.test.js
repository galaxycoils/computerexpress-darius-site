import { describe, expect, it } from 'vitest'
import { prerenderRoutes, sitemapRoutes, createSitemapXml } from './routeManifest'

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
})

it('does not invent sitemap modification dates from build time', () => {
  expect(createSitemapXml()).not.toContain('<lastmod>')
  expect(createSitemapXml()).toContain('<loc>https://stcatharinesdigital.ca/</loc>')
})
