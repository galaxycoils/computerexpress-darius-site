import { describe, expect, it } from 'vitest'
import { appRoutes, concreteRoutePaths, routePageNames } from './appRoutes.js'
import { staticPages } from './staticPages.js'
import { lazyPages } from './lazyPages.js'
import {
  baseRoutes,
  getRoutePageModule,
  prerenderRoutes,
  privateRoutes,
  clientOnlyRoutes,
} from '../data/routeManifest.js'

// These guard the single-source-of-truth refactor. The same 33 routes used to be
// written out twice (App.jsx and AppClient.jsx) with a third, hand-maintained
// page map in routeManifest.js, and nothing checked that they agreed.

describe('appRoutes table', () => {
  it('has no duplicate paths, which would silently shadow a route', () => {
    const paths = appRoutes.map((route) => route.path)
    expect(paths.length).toBe(new Set(paths).size)
  })

  it('declares exactly one index route', () => {
    expect(appRoutes.filter((route) => route.index)).toHaveLength(1)
  })

  it('declares the catch-all last so specific routes are matched first', () => {
    expect(appRoutes[appRoutes.length - 1].path).toBe('*')
  })

  it('keeps the static news/police route ahead of the dynamic news/:citySlug route', () => {
    const police = appRoutes.findIndex((route) => route.path === 'news/police')
    const city = appRoutes.findIndex((route) => route.path === 'news/:citySlug')
    expect(police).toBeGreaterThan(-1)
    expect(city).toBeGreaterThan(-1)
    expect(police).toBeLessThan(city)
  })
})

describe('page component maps', () => {
  // The failure this prevents: adding a route to the table but forgetting one of
  // the two maps, which renders a blank route in the browser or drops it from
  // prerendering. buildChildRoutes also throws at render time as a backstop.
  it('covers every page the route table references, in both maps', () => {
    const missingStatic = routePageNames.filter((name) => !staticPages[name])
    const missingLazy = routePageNames.filter((name) => !lazyPages[name])
    expect(missingStatic).toEqual([])
    expect(missingLazy).toEqual([])
  })

  it('exposes the same page keys from both maps', () => {
    expect(Object.keys(staticPages).sort()).toEqual(Object.keys(lazyPages).sort())
  })

  it('registers no page the route table never uses', () => {
    const unusedStatic = Object.keys(staticPages).filter((name) => !routePageNames.includes(name))
    expect(unusedStatic).toEqual([])
  })

  it('keeps HomePage eager in the browser map', () => {
    // HomePage is the entry route; lazy-loading it would add a round trip
    // before first paint. The lazy map imports it directly rather than via lazy().
    expect(lazyPages.HomePage).toBe(staticPages.HomePage)
  })
})

describe('routeManifest consistency', () => {
  it('resolves a page module for every concrete, non-private route', () => {
    for (const path of concreteRoutePaths()) {
      expect(getRoutePageModule(path), `no page module for ${path}`).toBeTruthy()
    }
  })

  it('lists every concrete route in baseRoutes', () => {
    const missing = concreteRoutePaths().filter((path) => !baseRoutes.includes(path))
    expect(missing).toEqual([])
  })

  it('lists every concrete route for prerendering', () => {
    const missing = concreteRoutePaths().filter((path) => !prerenderRoutes.includes(path))
    expect(missing).toEqual([])
  })

  it('keeps private and client-only routes out of the prerender list', () => {
    for (const path of privateRoutes) expect(prerenderRoutes).toContain(path)
    expect(prerenderRoutes).toContain('/404')
    for (const path of clientOnlyRoutes) expect(prerenderRoutes).not.toContain(path)
  })

  it('maps the public pages the sitemap advertises', () => {
    expect(getRoutePageModule('/')).toBe('src/pages/HomePage.jsx')
    expect(getRoutePageModule('/sponsor')).toBe('src/pages/SponsorPage.jsx')
    expect(getRoutePageModule('/planning-alerts')).toBe('src/pages/PlanningAlertsPage.jsx')
    expect(getRoutePageModule('/404')).toBe('src/pages/NotFoundPage.jsx')
  })
})
