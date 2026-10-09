/**
 * Canonical site metrics.
 *
 * Every published count — pitch deck, income plan, outreach copy, sponsor
 * one-pager — must come from here. The numbers previously drifted apart across
 * six documents (the deck contradicted itself: 98 records on one line, 92 on
 * another), so `scripts/audit-metrics.js` fails the build when a tracked file
 * states a figure that differs from these values.
 *
 * Counts are derived, never typed by hand.
 */
import { planningNotices, getActiveNotices } from './planningNotices.js'
import { nrpsReleases, verifiedNrpsReleases } from './nrpsReleases.js'
import { councilData } from './councilData.js'
import { sourceRegistry } from './sourceRegistry.js'
import { getRenderNow } from '../utils/renderClock.js'

/**
 * @param {Date} [now]
 * @returns {{
 *   police: number, policeTotal: number, planning: number, planningActive: number,
 *   planningWithMeetings: number, civic: number, sources: number, total: number,
 *   asOf: string, label: string,
 * }}
 */
export function getSiteMetrics(now = getRenderNow()) {
  const active = getActiveNotices(now)
  const metrics = {
    // Published dataset: only releases whose source URL was verified.
    police: verifiedNrpsReleases.length,
    // Everything held in the archive, including unverified and quarantined items.
    policeTotal: nrpsReleases.length,
    planning: planningNotices.length,
    planningActive: active.length,
    planningWithMeetings: planningNotices.filter(notice => notice.meetingDate).length,
    civic: councilData.length,
    sources: sourceRegistry.length,
  }
  return {
    ...metrics,
    total: metrics.police + metrics.planning + metrics.civic,
    asOf: now.toISOString().slice(0, 10),
    label: `${metrics.police} police + ${metrics.planning} planning + ${metrics.civic} civic = ${metrics.police + metrics.planning + metrics.civic} verified records`,
  }
}

export const siteMetrics = getSiteMetrics()
