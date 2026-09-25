#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []
const isHttpsUrl = value => { try { return new URL(value).protocol === 'https:' } catch { return false } }
const load = relative => import(pathToFileURL(path.join(root, relative)).href)

const [{ sourceRegistry }, { planningNotices }, nrps] = await Promise.all([
  load('src/data/sourceRegistry.js'),
  load('src/data/planningNotices.js'),
  load('src/data/nrpsReleases.js'),
])

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
const { nrpsReleases } = nrps
if (!Array.isArray(nrpsReleases) || nrpsReleases.length < 20) errors.push('NRPS archive is unexpectedly truncated')
for (const helper of ['getLatestNrpsReleases', 'getNrpsReleasesByMunicipality', 'getNrpsReleasesByCategory', 'getNrpsStats']) {
  if (typeof nrps[helper] !== 'function') errors.push(`NRPS module is missing ${helper}`)
}
const releaseIds = new Set()
const releaseUrls = new Set()
for (const release of nrpsReleases || []) {
  if (!release.id || releaseIds.has(release.id)) errors.push(`Duplicate or missing NRPS ID: ${release.id || '(missing)'}`)
  releaseIds.add(release.id)
  if (!isHttpsUrl(release.url) || releaseUrls.has(release.url)) errors.push(`Invalid or duplicate NRPS source URL: ${release.id}`)
  releaseUrls.add(release.url)
  if (!release.headline || !release.date) errors.push(`Incomplete NRPS release: ${release.id}`)
}

try {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/data/generated/manifest.json'), 'utf8'))
  for (const [id, source] of Object.entries(manifest.sources || {})) {
    if (source.status === 'failed') warnings.push(`Source adapter requires review: ${id}`)
  }
} catch (error) {
  errors.push(`Generated source manifest could not be read: ${error.message}`)
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), sources: sourceRegistry.length, planningRecords: planningNotices.length, policeReleases: nrpsReleases?.length || 0, warnings, errors }, null, 2))
if (errors.length) process.exit(1)
