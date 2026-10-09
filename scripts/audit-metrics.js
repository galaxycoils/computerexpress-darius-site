#!/usr/bin/env node
/**
 * Fails when a tracked document states a count that differs from the derived
 * values in src/data/metrics.js.
 *
 * Design note: prose cannot be parsed reliably, so claims are matched by an
 * explicit rule table. The failure mode of a rule table is silence — a document
 * gets reworded and the auditor stops seeing it. That is guarded against: every
 * tracked file must match at least one claim, so rewording turns into a loud CI
 * failure instead of a quiet pass.
 *
 * Usage: node scripts/audit-metrics.js [--verbose]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSiteMetrics } from '../src/data/metrics.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const verbose = process.argv.includes('--verbose')

const metrics = getSiteMetrics()

/**
 * Each rule maps a phrase used in prose to the metric(s) it asserts.
 * `pattern` must be global; capture group N holds the claim for `metrics[N-1]`.
 * Use `metric` for a single capture, `metrics` for several.
 */
const RULES = [
  // Compound summary lines carry the most drift risk, so they are matched first
  // and explicitly rather than relying on each number being phrased identically.
  {
    metrics: ['police', 'planning', 'civic'],
    label: 'dataset summary',
    pattern: /(\d+)\s+police\s*\+\s*(\d+)\s*planning\s*\+\s*(\d+)\s+civic/gi,
  },
  {
    metrics: ['police', 'planning', 'civic'],
    label: 'content audit summary',
    pattern: /(\d+)\s+police\s*\/\s*(\d+)\s+planning\s*\/\s*(\d+)\s+(?:council|civic)/gi,
  },
  { metric: 'police', label: 'verified police count', pattern: /(\d+)\s+verified\s+(?:NRPS\s+)?police/gi },
  { metric: 'police', label: 'indexed police releases', pattern: /(\d+)\s+(?:releases|police releases)\s+indexed/gi },
  { metric: 'planningActive', label: 'active planning notices', pattern: /(\d+)\s+active\s+planning\s+notices/gi },
  { metric: 'planning', label: 'total planning notices', pattern: /(\d+)\s+planning\s+notices/gi },
  { metric: 'planning', label: 'tracked notices', pattern: /(\d+)\s+notices\s+tracked/gi },
  { metric: 'civic', label: 'civic events', pattern: /(\d+)\s+civic\s+events/gi },
  { metric: 'total', label: 'verified records total', pattern: /(\d+)\s+verified\s+records/gi },
  { metric: 'total', label: 'structured records total', pattern: /(\d+)\s+structured\s+records/gi },
]

/**
 * Files whose site-wide numeric claims are checked.
 *
 * Deliberately excluded:
 * - docs/REVENUE_POSTMORTEM_2026-10-02.md — a historical record. Rewriting its
 *   numbers would destroy the evidence that makes the rest of the doc set
 *   trustworthy.
 * - docs/SPONSOR_ONE_PAGER_DRAFT.md, docs/MEDIA_KIT_PLANNING_ALERT.md — dated
 *   inventory snapshots ("Notice volume — 2026-09-03 scan") that enumerate
 *   per-municipality counts, not dataset totals. Refresh them before reuse
 *   rather than treating them as standing claims.
 * - B2B_OUTREACH_LIST.md — its "50 accounts" claim is an outreach-list figure
 *   validated by the MX tooling in scripts/outreach/, not a dataset count.
 */
const TRACKED_FILES = [
  'PITCH_DECK.md',
  'INCOME_PRIORITY_PLAN.md',
]

/**
 * Per-municipality breakdowns ("St. Catharines — 7 planning notices") are not
 * site-wide totals and must not be compared against them. A claim is treated as
 * a breakdown entry when the number is preceded by a dash separator.
 */
function isBreakdownEntry(line, matchStart) {
  return /[—–-]\s*$/.test(line.slice(0, matchStart))
}

const failures = []
const notes = []

for (const relative of TRACKED_FILES) {
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) {
    failures.push(`${relative}: tracked file is missing`)
    continue
  }

  const lines = fs.readFileSync(absolute, 'utf8').split('\n')
  let matched = 0

  lines.forEach((line, index) => {
    for (const rule of RULES) {
      // Rules are global; reset before each line so lastIndex cannot leak.
      rule.pattern.lastIndex = 0
      const capturers = rule.metrics ?? [rule.metric]
      let match
      while ((match = rule.pattern.exec(line)) !== null) {
        if (isBreakdownEntry(line, match.index)) continue
        matched++
        capturers.forEach((metric, position) => {
          const claimed = Number(match[position + 1])
          const actual = metrics[metric]
          if (claimed !== actual) {
            failures.push(
              `${relative}:${index + 1}: ${rule.label} (${metric}) says ${claimed}, derived value is ${actual} — "${match[0].trim()}"`,
            )
          } else if (verbose) {
            notes.push(`${relative}:${index + 1}: OK ${rule.label} (${metric}) = ${actual}`)
          }
        })
      }
    }
  })

  if (matched === 0) {
    failures.push(
      `${relative}: no metric claims matched. Either the file no longer states counts, or it was reworded and these RULES need updating — do not let the audit pass silently.`,
    )
  } else if (verbose) {
    notes.push(`${relative}: ${matched} claim(s) checked`)
  }
}

if (verbose) for (const note of notes) console.log(note)

if (failures.length) {
  console.error(JSON.stringify({ asOf: metrics.asOf, derived: metrics, failures }, null, 2))
  console.error(`\naudit-metrics: ${failures.length} stale claim(s). Canonical values: ${metrics.label}`)
  process.exit(1)
}

console.log(
  JSON.stringify(
    { ok: true, checkedFiles: TRACKED_FILES.length, canonical: metrics.label, asOf: metrics.asOf },
    null,
    2,
  ),
)
