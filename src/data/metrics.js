/**
 * Canonical site metrics.
 *
 * Every published count — pitch deck, income plan, outreach copy, sponsor
 * one-pager — must come from here. The numbers previously drifted apart across
 * six documents (the deck contradicted itself: 98 records on one line, 92 on
 * another), so `scripts/audit-metrics.js` fails the build when a tracked file
 * states a figure that differs from these values.
 *
 * Counts are derived, never typed by hand. `npm run metrics:sync` rewrites the
 * marked lines in the pitch deck and income plan from these values.
 */
import { planningNotices, getActiveNotices } from './planningNotices.js'
import { nrpsReleases, verifiedNrpsReleases } from './nrpsReleases.js'
import { councilData } from './councilData.js'
import { sourceRegistry } from './sourceRegistry.js'
import { getRenderNow } from '../utils/renderClock.js'

/**
 * Sponsor-page corpus counts.
 *
 * Police releases are the verified set the police desk publishes
 * (`verifiedNrpsReleases`). Planning notices are the planning-tracker archive
 * (`planningNotices`). Every mention on the sponsor page must use this
 * selector so the figures cannot drift from the records themselves.
 */
export function getSponsorCorpusCounts() {
  const policeReleases = verifiedNrpsReleases.length
  const planningNoticeCount = planningNotices.length
  return {
    policeReleases,
    planningNotices: planningNoticeCount,
    summary: `${policeReleases} police media releases and ${planningNoticeCount} municipal planning notices`,
    ratio: `${policeReleases}/${planningNoticeCount}`,
  }
}

/**
 * @param {Date} [now]
 * @returns {{
 *   police: number, policeTotal: number, planning: number, planningActive: number,
 *   planningWithMeetings: number, civic: number, sources: number, total: number,
 *   asOf: string, label: string,
 * }}
 */
export function getSiteMetrics(now = getRenderNow()) {
  const corpus = getSponsorCorpusCounts()
  const active = getActiveNotices(now)
  const metrics = {
    // Published dataset: only releases whose source URL was verified.
    police: corpus.policeReleases,
    // Everything held in the archive, including unverified and quarantined items.
    policeTotal: nrpsReleases.length,
    planning: corpus.planningNotices,
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
