#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const warnings = []
const isHttpsUrl = value => { try { return new URL(value).protocol === 'https:' } catch { return false } }
const load = relative => import(pathToFileURL(path.join(root, relative)).href)

const [{ sourceRegistry }, { planningNotices }] = await Promise.all([
  load('src/data/sourceRegistry.js'),
  load('src/data/planningNotices.js'),
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

try {
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/data/generated/manifest.json'), 'utf8'))
  for (const [id, source] of Object.entries(manifest.sources || {})) {
    if (source.status === 'failed') warnings.push(`Source adapter requires review: ${id}`)
  }
} catch (error) {
  errors.push(`Generated source manifest could not be read: ${error.message}`)
}

console.log(JSON.stringify({ checkedAt: new Date().toISOString(), sources: sourceRegistry.length, planningRecords: planningNotices.length, warnings, errors }, null, 2))
if (errors.length) process.exit(1)
