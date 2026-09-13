import { describe, expect, it } from 'vitest'
import { prerenderRoutes, sitemapRoutes } from './routeManifest'

const GUIDE = '/guides/st-catharines-ontario-street-corridor-plan'

describe('route manifest guides', () => {
  it('includes guide routes in prerendering and the sitemap', () => {
    expect(prerenderRoutes).toContain(GUIDE)
    expect(sitemapRoutes).toContain(GUIDE)
  })
})