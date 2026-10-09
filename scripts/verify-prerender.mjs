#!/usr/bin/env node
/**
 * Post-build spot checks on the prerendered HTML.
 *
 * Ported from the computerexpress-darius-site WU-006 work unit, which canonical
 * never received. Two changes from the original:
 *
 *   - the route list matches this site rather than the September branch
 *   - assertions cover a few things that have silently regressed before: the
 *     price a reader is shown, and the homepage's routes to revenue
 *
 * A route that renders an empty shell still exits 0 from the build, so this is
 * the check that notices. Thresholds are ~50% of the real rendered size, so
 * ordinary copy edits pass and a failed prerender does not.
 *
 * Usage: npm run verify:prerender   (requires a prior `npm run build`)
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'dist')

const CHECKS = [
  {
    path: 'index.html',
    minBytes: 12000,
    expect: ['St. Catharines Digital', '/planning-tracker'],
    why: 'the homepage renders, and keeps a route into the tracker',
  },
  {
    path: 'index.html',
    minBytes: 12000,
    expect: ['/planning-alerts', '/sponsor'],
    why: 'the homepage keeps its routes to the paid and sponsored services',
  },
  {
    path: 'planning-tracker/index.html',
    minBytes: 20000,
    expect: ['Planning'],
    why: 'the tracker renders notice records, not an empty shell',
  },
  {
    path: 'planning-alerts/index.html',
    minBytes: 8000,
    expect: ['Planning Alerts'],
    why: 'the signup page renders',
  },
  {
    path: 'planning-alerts/index.html',
    minBytes: 8000,
    expect: ['$49'],
    why: 'the paid digest states its price before collecting an email',
  },
  {
    path: 'sponsor/index.html',
    minBytes: 6000,
    expect: ['$250'],
    why: 'the sponsor page keeps its price anchor so leads can self-qualify',
  },
  {
    path: 'council/index.html',
    minBytes: 10000,
    expect: ['Council'],
    why: 'the council page renders civic records',
  },
  {
    path: 'about/index.html',
    minBytes: 6000,
    expect: ['St. Catharines Digital'],
    why: 'the about page renders',
  },
  {
    path: 'news/index.html',
    minBytes: 9000,
    expect: ['St. Catharines Digital'],
    why: 'the news index renders',
  },
]

if (!existsSync(root)) {
  console.error(`FAIL: ${root} does not exist — run "npm run build" first.`)
  process.exit(1)
}

let failed = 0
// Several checks share a file; read each once and report per check.
const cache = new Map()
const readOnce = (file) => {
  if (!cache.has(file)) cache.set(file, readFileSync(file, 'utf8'))
  return cache.get(file)
}

for (const check of CHECKS) {
  const full = resolve(root, check.path)
  try {
    const content = readOnce(full)
    if (content.length < check.minBytes) {
      console.error(`FAIL: ${check.path} is ${content.length} bytes (min ${check.minBytes}) — ${check.why}`)
      failed++
      continue
    }
    const missing = check.expect.filter((needle) => !content.includes(needle))
    if (missing.length) {
      console.error(`FAIL: ${check.path} missing ${missing.map((m) => `"${m}"`).join(', ')} — ${check.why}`)
      failed++
      continue
    }
    console.log(`OK:   ${check.path} (${content.length} bytes) — ${check.why}`)
  } catch (error) {
    console.error(`FAIL: ${check.path} — ${error.message}`)
    failed++
  }
}

if (failed) {
  console.error(`\nverify-prerender: ${failed} of ${CHECKS.length} checks failed.`)
  process.exit(1)
}
console.log(`\nverify-prerender: all ${CHECKS.length} checks passed.`)
