#!/usr/bin/env node
/**
 * Monetization readiness report for stcatharinesdigital.
 *
 * Advisory, not a gate: it scores the revenue paths that are visible to a
 * visitor. `npm run audit:monetization`.
 *
 * This script previously had three defects that made its score untrustworthy:
 *   1. ROOT was hardcoded to one developer's absolute path, so it silently
 *      scored an empty tree anywhere else (including CI).
 *   2. It scanned test files, so a `eTransfer` mention inside HomePage.test.jsx
 *      satisfied the payment-path check even after the product copy changed.
 *   3. When the sponsor page existed but published no price, it awarded 0 points
 *      and emitted no finding — a silent failure inside a 75/100 score.
 *
 * Every check now reports a finding whether it passes or fails, so a partial
 * score is always explainable.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../src/data/siteConfig.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src')
const FUNCTIONS = path.join(root, 'functions')

const verbose = process.argv.includes('--verbose')

const read = (file) => {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return ''
  }
}

/** Product source only. Tests encode intent, they are not shipped surface. */
function walk(dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.css']) {
  const out = []
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walk(full, extensions))
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      if (/\.test\.[jt]sx?$/.test(entry.name) || /\.spec\.[jt]sx?$/.test(entry.name)) continue
      out.push(full)
    }
  }
  return out
}

const sourceFiles = walk(SRC)
const functionFiles = walk(FUNCTIONS)
const productFiles = [...sourceFiles, ...functionFiles]
const productContent = productFiles.map(read).join('\n')

const fileMatching = (needle) => productFiles.find((file) => file.includes(needle))
const fileContents = (file) => (file ? read(file) : '')

/** Routes that can produce revenue or a lead. */
const MONETIZATION_ROUTES = ['/sponsor', '/planning-alerts', '/membership', '/pricing']

const homePageFile =
  fileMatching('HomePage.jsx') || sourceFiles.find((file) => /index\.jsx?$/.test(file))

const sponsorshipFile = fileMatching('SponsorPage')
const membershipFile = fileMatching('MembershipPage')
const alertsPageFile = fileMatching('PlanningAlertsPage')

const CHECKS = [
  {
    id: 'sponsorship-page',
    weight: 15,
    label: 'Sponsorship page with a published price anchor',
    run() {
      if (!sponsorshipFile) return { passed: false, detail: 'no sponsor page found' }
      const content = fileContents(sponsorshipFile)
      // A price anchor is what lets a lead self-qualify. Absence used to score 0
      // with no finding at all.
      const prices = content.match(/\$\s?\d[\d,]*/g) || []
      if (prices.length >= 1) {
        return { passed: true, detail: `${prices.length} price anchor(s): ${[...new Set(prices)].join(', ')}` }
      }
      return {
        passed: false,
        detail: 'sponsor page is inquiry-only and publishes no price — leads cannot self-qualify',
      }
    },
  },
  {
    id: 'alerts-api',
    weight: 20,
    label: 'Planning Alerts API with email verification',
    run() {
      const hasApi = productContent.includes('/api/alerts')
      const hasVerify = Boolean(
        productFiles.find((file) => /alerts[/\\]verify\.js$/.test(file)) ||
          productContent.includes('alerts/verify'),
      )
      if (hasApi && hasVerify) return { passed: true, detail: 'subscribe + verify endpoints present' }
      return { passed: false, detail: `api=${hasApi} verify=${hasVerify}` }
    },
  },
  {
    id: 'payment-path',
    weight: 15,
    label: 'Reader-visible payment path for the paid tier',
    run() {
      const paymentFile = productFiles.find((file) => /alerts[/\\]payment\.js$/.test(file))
      const addresses = productContent.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []
      const mentionsInterac = /interac/i.test(productContent)
      const hasCanonical = addresses.includes(siteConfig.email)
      if (paymentFile && mentionsInterac && hasCanonical) {
        return { passed: true, detail: `Interac path documented, payable to ${siteConfig.email}` }
      }
      return {
        passed: false,
        detail: `payment endpoint=${Boolean(paymentFile)} interac=${mentionsInterac} canonicalAddress=${hasCanonical}`,
      }
    },
  },
  {
    id: 'alerts-price-disclosed',
    weight: 10,
    label: 'Planning Alerts price stated on the signup page',
    run() {
      if (!alertsPageFile) return { passed: false, detail: 'no PlanningAlertsPage found' }
      const content = fileContents(alertsPageFile)
      const price = content.match(/\$\s?\d[\d,]*\s*(?:\/|per\s)?\s*(?:mo|month)/i)
      if (price) return { passed: true, detail: `discloses ${price[0].trim()}` }
      return { passed: false, detail: 'signup page does not state the price before collecting an email' }
    },
  },
  {
    id: 'newsletter-capture',
    weight: 10,
    label: 'Newsletter capture API',
    run() {
      const hasApi = productContent.includes('/api/newsletter')
      const hasSubscribe = /subscribe/i.test(productContent)
      if (hasApi && hasSubscribe) return { passed: true, detail: 'capture + subscribe copy present' }
      return { passed: false, detail: `api=${hasApi} subscribeCopy=${hasSubscribe}` }
    },
  },
  {
    id: 'homepage-ctas',
    weight: 15,
    label: 'Homepage links to revenue routes',
    run() {
      if (!homePageFile) return { passed: false, detail: 'no homepage found' }
      const content = fileContents(homePageFile)
      const found = MONETIZATION_ROUTES.filter((route) => content.includes(route))
      if (found.length >= 2) return { passed: true, detail: `links to ${found.join(', ')}` }
      return {
        passed: false,
        detail: `links to ${found.length ? found.join(', ') : 'none'} of ${MONETIZATION_ROUTES.join(', ')}`,
      }
    },
  },
  {
    id: 'reader-support',
    weight: 10,
    label: 'Reader support / membership surface',
    run() {
      if (!membershipFile && !/reader-services/i.test(productContent)) {
        return { passed: false, detail: 'no membership or reader-services surface' }
      }
      const named = membershipFile ? path.basename(membershipFile) : 'ReaderServicesPage'
      return { passed: true, detail: `${named} present` }
    },
  },
  {
    id: 'canonical-contact',
    weight: 5,
    label: 'Canonical contact address published',
    run() {
      const published = productContent.includes(siteConfig.email) || read(path.join(root, 'public/llms.txt')).includes(siteConfig.email)
      if (published) return { passed: true, detail: siteConfig.email }
      return { passed: false, detail: `canonical ${siteConfig.email} not found in product surface` }
    },
  },
]

const findings = []
let score = 0
let maxScore = 0

for (const check of CHECKS) {
  maxScore += check.weight
  const { passed, detail } = check.run()
  if (passed) score += check.weight
  findings.push({
    check: check.id,
    weight: check.weight,
    earned: passed ? check.weight : 0,
    status: passed ? 'pass' : 'fail',
    detail,
  })
}

const result = {
  score,
  maxScore,
  percent: Math.round((score / maxScore) * 100),
  canonicalContact: siteConfig.email,
  findings: findings.map((f) => `${f.status === 'pass' ? '+' : '-'}${f.status === 'pass' ? f.earned : f.weight} ${f.check}: ${f.detail}`),
}

if (verbose) {
  console.log(JSON.stringify({ ...result, checks: findings }, null, 2))
} else {
  console.log(JSON.stringify(result, null, 2))
}
