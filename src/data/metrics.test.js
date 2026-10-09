import { describe, expect, it } from 'vitest'
import { getSiteMetrics, siteMetrics } from './metrics.js'
import { planningNotices, getActiveNotices } from './planningNotices.js'
import { nrpsReleases, verifiedNrpsReleases } from './nrpsReleases.js'
import { councilData } from './councilData.js'
import { sourceRegistry } from './sourceRegistry.js'

// Every published count derives from these values. If this test fails, the
// pitch deck and income plan are wrong too — run `npm run audit:metrics`.

describe('getSiteMetrics', () => {
  it('derives counts from the data modules rather than restating them', () => {
    const metrics = getSiteMetrics()
    expect(metrics.police).toBe(verifiedNrpsReleases.length)
    expect(metrics.policeTotal).toBe(nrpsReleases.length)
    expect(metrics.planning).toBe(planningNotices.length)
    expect(metrics.civic).toBe(councilData.length)
    expect(metrics.sources).toBe(sourceRegistry.length)
  })

  it('never publishes more verified police releases than it holds', () => {
    const metrics = getSiteMetrics()
    expect(metrics.police).toBeLessThanOrEqual(metrics.policeTotal)
  })

  it('counts active planning notices as a subset of all notices', () => {
    const metrics = getSiteMetrics()
    expect(metrics.planningActive).toBeLessThanOrEqual(metrics.planning)
    expect(metrics.planningWithMeetings).toBeLessThanOrEqual(metrics.planning)
  })

  it('totals the three published feeds', () => {
    const metrics = getSiteMetrics()
    expect(metrics.total).toBe(metrics.police + metrics.planning + metrics.civic)
  })

  it('renders a label that matches the individual figures', () => {
    const metrics = getSiteMetrics()
    expect(metrics.label).toContain(`${metrics.police} police`)
    expect(metrics.label).toContain(`${metrics.planning} planning`)
    expect(metrics.label).toContain(`${metrics.civic} civic`)
    expect(metrics.label).toContain(`${metrics.total} verified records`)
  })

  it('honours an injected clock so active counts are deterministic', () => {
    const frozen = new Date('2026-10-09T12:00:00-04:00')
    const metrics = getSiteMetrics(frozen)
    expect(metrics.asOf).toBe('2026-10-09')
    expect(metrics.planningActive).toBe(getActiveNotices(frozen).length)
  })

  it('exposes a module-level snapshot for non-React consumers', () => {
    expect(siteMetrics.total).toBe(getSiteMetrics().total)
  })
})
