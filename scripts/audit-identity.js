#!/usr/bin/env node
/**
 * Fails when a customer-facing email address differs from the canonical one in
 * src/data/siteConfig.js.
 *
 * The repo previously published two addresses at once: the site showed
 * cccemt@pm.me while the payment, contact and scrape paths used
 * hello@stcatharinesdigital.ca. A reader who paid was told to write somewhere
 * the site never mentions. This audit makes that class of drift impossible.
 *
 * Pages Functions cannot cleanly import from src/, so equality is enforced by
 * inspection rather than by a shared constant — the same approach
 * scripts/content-audit.js takes for cross-module invariants.
 *
 * Usage: node scripts/audit-identity.js [--verbose]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/data/siteConfig.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const verbose = process.argv.includes('--verbose')
const canonical = siteConfig.email

/**
 * Files that render or send a contact address to a human.
 * Third-party sending inboxes (e.g. AgentMail) are not customer-facing and are
 * deliberately out of scope.
 */
const TRACKED_FILES = [
  'src/data/siteConfig.js',
  'src/data/siteData.js',
  'src/pages/SponsorPage.jsx',
  'functions/api/sponsor.js',
  'functions/api/contact.js',
  'functions/api/alerts/payment.js',
  'functions/api/alerts/verify.js',
  'functions/cron/scrape.js',
  'functions/cron/daily-digest.js',
  // Served to crawlers and assistants, so it is customer-facing.
  'public/llms.txt',
]

/** Addresses that are infrastructure, not a reply-to address. */
const ALLOWED_OTHER = new Set([
  'stcatharines-digital@agentmail.to',
])

// No file should still carry the retired address.
const RETIRED = 'hello@stcatharinesdigital.ca'

const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

const failures = []
const notes = []

for (const relative of TRACKED_FILES) {
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) {
    failures.push(`${relative}: tracked file is missing`)
    continue
  }

  const lines = fs.readFileSync(absolute, 'utf8').split('\n')
  let found = 0

  lines.forEach((line, index) => {
    const matches = line.match(EMAIL_PATTERN) || []
    for (const address of matches) {
      found++
      if (address === canonical) {
        if (verbose) notes.push(`${relative}:${index + 1}: OK ${address}`)
        continue
      }
      if (address === RETIRED) {
        failures.push(
          `${relative}:${index + 1}: retired address ${address} — use ${canonical}`,
        )
        continue
      }
      if (!ALLOWED_OTHER.has(address)) {
        failures.push(
          `${relative}:${index + 1}: unexpected address ${address} — canonical is ${canonical}`,
        )
        continue
      }
      if (verbose) notes.push(`${relative}:${index + 1}: allowed infrastructure address ${address}`)
    }
  })

  // A file that stops mentioning any address is a signal worth surfacing: either
  // the contact path was removed, or the file was reworded and this list is stale.
  if (found === 0) {
    failures.push(
      `${relative}: no email address found. Either the contact path was removed, or this TRACKED_FILES entry is stale.`,
    )
  }
}

if (verbose) for (const note of notes) console.log(note)

if (failures.length) {
  console.error(JSON.stringify({ canonical, failures }, null, 2))
  console.error(`\naudit-identity: ${failures.length} address problem(s). Canonical: ${canonical}`)
  process.exit(1)
}

console.log(JSON.stringify({ ok: true, canonical, checkedFiles: TRACKED_FILES.length }, null, 2))
