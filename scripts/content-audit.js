#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { auditDiscovery } from './discoveryIntegrity.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []
const isHttpsUrl = value => { try { return new URL(value).protocol === 'https:' } catch { return false } }
const load = relative => import(pathToFileURL(path.join(root, relative)).href)

const [
  { sourceRegistry },
  { planningNotices },
  nrps,
  { getPublication },
  { selectHomepageLead },
] = await Promise.all([
  load('src/data/sourceRegistry.js'),
  load('src/data/planningNotices.js'),
  load('src/data/nrpsReleases.js'),
  load('src/data/publication.js'),
  load('src/data/homepageLead.js'),
])

const homepageLeadSlug = process.env.VITE_HOMEPAGE_LEAD_SLUG?.trim()
if (homepageLeadSlug) {
  const lead = selectHomepageLead(getPublication(), homepageLeadSlug)
  if (lead?.slug !== homepageLeadSlug) errors.push(`Homepage lead override is not an eligible local story: ${homepageLeadSlug}`)
}

const sourceIds = new Set()
for (const source of sourceRegistry) {
  if (!source.id || sourceIds.has(source.id)) errors.push(`Duplicate or missing source ID: ${source.id || '(missing)'}`)
  sourceIds.add(source.id)
  if (!source.name || !source.city || !source.kind || !isHttpsUrl(source.url)) errors.push(`Invalid source record: ${source.id}`)
  if (typeof source.reviewRequired !== 'boolean') errors.push(`Source must set reviewRequired boolean: ${source.id}`)
}

const noticeIds = new Set()
for (const notice of planningNotices) {
  if (!notice.id || noticeIds.has(notice.id)) errors.push(`Duplicate or missing planning ID: ${notice.id || '(missing)'}`)
  noticeIds.add(notice.id)
  for (const field of ['municipality', 'title', 'type', 'status', 'sourceUrl']) if (!notice[field]) errors.push(`${notice.id} is missing ${field}`)
  if (!isHttpsUrl(notice.sourceUrl)) errors.push(`${notice.id} has an invalid source URL`)
  if (!notice.publishedDate) warnings.push(`${notice.id} has no publication date`)
}

// The police archive is a reader-facing dataset and a module API used by
// PolicePage. A daily desk update must append records without replacing it.
// The helper-presence guard below reads these off the `nrps` namespace object
// (`nrps[helper]`), so only the values used directly are destructured here.
const { nrpsReleases, verifiedNrpsReleases, getNrpsStats } = nrps
if (!Array.isArray(verifiedNrpsReleases) || verifiedNrpsReleases.length < 20) errors.push('NRPS archive is unexpectedly truncated')
for (const helper of ['getLatestNrpsReleases', 'getNrpsReleasesByMunicipality', 'getNrpsReleasesByCategory', 'getNrpsStats']) {
  if (typeof nrps[helper] !== 'function') errors.push(`NRPS module is missing ${helper}`)
}
const releaseIds = new Set()
const releaseUrls = new Set()
for (const release of verifiedNrpsReleases || []) {
  if (!release.id || releaseIds.has(release.id)) errors.push(`Duplicate or missing NRPS ID: ${release.id || '(missing)'}`)
  releaseIds.add(release.id)
  if (!isHttpsUrl(release.url) || releaseUrls.has(release.url)) errors.push(`Invalid or duplicate NRPS source URL: ${release.id}`)
  releaseUrls.add(release.url)
  if (!release.headline || !release.date) errors.push(`Incomplete NRPS release: ${release.id}`)
}
const stats = getNrpsStats()
if (stats.total !== verifiedNrpsReleases.length) errors.push(`getNrpsStats.total (${stats.total}) does not match verified array length (${verifiedNrpsReleases.length})`)

// Source health is read from discovery.json, the artifact the collector actually
// writes (scripts/collect-official-news.js, plus a gitignored collector-report.json).
//
// This check previously read src/data/generated/manifest.json — a legacy artifact
// that no script in this repo produces any more. It had been frozen at
// 2026-09-13 and reported three "source adapter requires review" warnings forever,
// while the live collector was reporting all six sources healthy. Warnings that
// can never be cleared train people to ignore warnings.
const discoveryPath = path.join(root, 'src/data/generated/discovery.json')
try {
  const discovery = JSON.parse(await fs.readFile(discoveryPath, 'utf8'))
  errors.push(...auditDiscovery(discovery, sourceRegistry))
  const sources = discovery.sources
  if (!Array.isArray(sources) || sources.length === 0) {
    errors.push('Discovery snapshot lists no sources')
  } else {
    for (const source of sources) {
      if (source.ok === false) warnings.push(`Source adapter requires review: ${source.id}`)
    }
  }
  const collectedAt = Date.parse(discovery.collectedAt)
  if (Number.isNaN(collectedAt)) {
    errors.push('Discovery snapshot has no valid collectedAt timestamp')
  } else if (Date.now() - collectedAt > 30 * 86400000) {
    const ageDays = Math.floor((Date.now() - collectedAt) / 86400000)
    warnings.push(`Discovery snapshot is ${ageDays} days old — collection may have stopped`)
  }
} catch (error) {
  errors.push(`Discovery snapshot could not be read: ${error.message}`)
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), sources: sourceRegistry.length, planningRecords: planningNotices.length, policeReleases: nrpsReleases?.length || 0, warnings, errors }, null, 2))
if (errors.length) process.exit(1)
