#!/usr/bin/env node
/**
 * Rewrite marked count lines in the pitch deck and income plan from
 * src/data/metrics.js. The collector runs this in the same commit as new
 * data so audit:metrics stays a real check and does not block publishing.
 *
 * Usage: node scripts/sync-metrics-docs.js [--check]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSiteMetrics } from '../src/data/metrics.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

export const METRIC_FILES = ['PITCH_DECK.md', 'INCOME_PRIORITY_PLAN.md']

export function metricTemplates(metrics) {
  const m = metrics
  return {
    'pitch-verified-counts': `**Verified counts (live site)**: ${m.police} verified police + **${m.planning}** planning + **${m.civic}** civic = **${m.total} verified records**`,
    'pitch-verification-note': `**Note**: ${m.police} of ${m.policeTotal} held NRPS releases are source-verified; the rest are quarantined until their links resolve. ${m.planning} planning notices. Active status is calculated from Toronto time when the site is rendered.`,
    'pitch-triptych': `**Visual**: Screenshot triptych — Police feed (${m.police} verified releases), Planning tracker (${m.planning} notices), Council calendar (${m.civic} civic events)`,
    'pitch-sources': `**Stat**: ${m.sources} registered official sources (4 municipalities + NRPS). 0 unified feed. $1.37B in Niagara construction starts 2025 (StatsCan) — all flying blind`,
    'pitch-indexed': `| **${m.police} releases** indexed | **${m.planning} notices** tracked | **${m.civic} civic events** |`,
    'pitch-headline': `**Headline**: Deployed. Green CI. 3 feeds live. ${m.total} verified records. Outreach run, no paid account yet.`,
    'pitch-metrics-row': `**3 feeds** | **${m.total} structured records** | **100% coverage on 3 critical-logic modules** | **Cloudflare Pages + Workers + D1**`,
    'pitch-content-audit': `**Content audit**: 0 errors, ${m.sources} sources, ${m.police} police / ${m.planning} planning / ${m.civic} council`,
    'income-verified-counts': `**Verified counts (live site)**: ${m.police} police + ${m.planning} planning + ${m.civic} civic = **${m.total} verified records**`,
    'income-deck-pointer': `- \`PITCH_DECK.md\` — investor deck with verified numbers (${m.police} police + ${m.planning} planning + ${m.civic} civic = ${m.total} records)`,
    'income-held-releases': `${m.police} of ${m.policeTotal} held releases are source-verified`,
    'income-planning-live': `${m.planning} planning notices are live`,
    'income-civic-live': `${m.civic} civic records are live`,
    'income-bottom-line': `**The product is live and the data is verified.** ${m.police} police + ${m.planning} planning + ${m.civic} civic = ${m.total} records, all derived from source and enforced against drift by \`npm run audit:metrics\`.`,
  }
}

const marker = /<!-- metrics:([a-z0-9-]+) -->([\s\S]*?)<!-- \/metrics:\1 -->/g

export function syncMetricText(text, metrics = getSiteMetrics()) {
  const templates = metricTemplates(metrics)
  const seen = new Set()
  const next = text.replace(marker, (full, id) => {
    if (!Object.hasOwn(templates, id)) throw new Error(`Unknown metrics block: ${id}`)
    seen.add(id)
    return `<!-- metrics:${id} -->${templates[id]}<!-- /metrics:${id} -->`
  })
  if (seen.size === 0) throw new Error('No metrics blocks found')
  return next
}

function syncFile(relative, metrics) {
  const absolute = path.join(root, relative)
  const current = fs.readFileSync(absolute, 'utf8')
  const next = syncMetricText(current, metrics)
  if (next === current) return false
  if (!check) fs.writeFileSync(absolute, next)
  return true
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isDirectRun) {
  const metrics = getSiteMetrics()
  const changed = METRIC_FILES.filter(file => syncFile(file, metrics))
  if (check && changed.length) {
    console.error(`metrics sync: ${changed.join(', ')} drifted from ${metrics.label}`)
    process.exit(1)
  }
  console.log(JSON.stringify({ ok: true, changed, canonical: metrics.label, asOf: metrics.asOf }, null, 2))
}
