import { describe, expect, it } from 'vitest'
import { prerenderRoutes, sitemapRoutes } from './routeManifest'

const GUIDE = '/guides/st-catharines-ontario-street-corridor-plan'

const BLOG_SLUGS = [
  'local-seo-checklist-2026',
  'how-to-get-more-leads-from-website',
  'technical-seo-explained',
  'google-business-profile-tips-local-seo',
  'how-to-rank-1-on-google-maps',
  'website-speed-optimization-tips',
  'how-much-does-local-seo-cost',
  'service-business-website-examples',
]

describe('route manifest guides', () => {
  it('includes guide routes in prerendering and the sitemap', () => {
    expect(prerenderRoutes).toContain(GUIDE)
    expect(sitemapRoutes).toContain(GUIDE)
  })

  it.each(BLOG_SLUGS)('prerenders and sitemaps blog post %s', (slug) => {
    expect(prerenderRoutes).toContain(`/blog/${slug}`)
    expect(sitemapRoutes).toContain(`/blog/${slug}`)
  })
})