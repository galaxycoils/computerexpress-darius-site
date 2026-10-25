import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import SponsorPage from './SponsorPage'
import { getSponsorCorpusCounts } from '../data/metrics.js'
import { planningNotices } from '../data/planningNotices.js'
import { verifiedNrpsReleases } from '../data/nrpsReleases.js'
import { SPONSOR_RATE_LINE } from '../data/sponsorOffer.js'

const RATE_LINE = '$250/month. One page, one rate. No fine print.'
const here = dirname(fileURLToPath(import.meta.url))

function renderPage() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <SponsorPage />
      </BrowserRouter>
    </HelmetProvider>,
  )
}

function sourceFiles(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      sourceFiles(full, found)
      continue
    }
    if (/\.(jsx?|tsx?|mjs|html|json)$/.test(name) && !/\.test\./.test(name)) found.push(full)
  }
  return found
}

describe('SponsorPage inquiry', () => {
  it('offers contact without promising unverified delivery or audience numbers', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeInTheDocument()
    expect(screen.getByLabelText('Interest')).toBeInTheDocument()
    expect(screen.queryByText(/41 active notices/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/within 24 hours/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/pay now/i)).not.toBeInTheDocument()
  })

  it('publishes one flat sponsorship rate', () => {
    renderPage()
    expect(SPONSOR_RATE_LINE).toBe(RATE_LINE)
    expect(screen.getAllByText(RATE_LINE).length).toBeGreaterThan(0)
    const text = document.body.textContent
    expect(text).not.toMatch(/starts at/i)
    expect(text).not.toMatch(/from\s+\$250/i)
    expect(text).not.toMatch(/depends on availability/i)
    expect(text).not.toMatch(/final pricing/i)
  })

  it('renders corpus counts from the shared selector and drops the stale ratio', () => {
    const counts = getSponsorCorpusCounts()
    expect(counts.policeReleases).toBe(verifiedNrpsReleases.length)
    expect(counts.planningNotices).toBe(planningNotices.length)

    renderPage()
    expect(screen.getByTestId('sponsor-corpus-counts')).toHaveTextContent(counts.summary)
    expect(screen.getByTestId('sponsor-corpus-ratio')).toHaveTextContent(
      `not part of the ${counts.ratio} count above`,
    )

    const text = document.body.textContent
    const policeMentions = [...text.matchAll(/(\d+)\s+police media releases/g)]
    const planningMentions = [...text.matchAll(/(\d+)\s+municipal planning notices/g)]
    const ratios = [...text.matchAll(/(\d+)\/(\d+)\s+count/g)]
    expect(policeMentions.length).toBeGreaterThan(0)
    expect(planningMentions.length).toBeGreaterThan(0)
    expect(ratios.length).toBeGreaterThan(0)
    for (const match of policeMentions) expect(Number(match[1])).toBe(counts.policeReleases)
    for (const match of planningMentions) expect(Number(match[1])).toBe(counts.planningNotices)
    for (const match of ratios) {
      expect(Number(match[1])).toBe(counts.policeReleases)
      expect(Number(match[2])).toBe(counts.planningNotices)
    }

    expect(text).not.toContain('52/47')
    const source = readFileSync(join(here, 'SponsorPage.jsx'), 'utf8')
    expect(source).not.toContain('52/47')
    expect(source).not.toMatch(/\d+\s+police media releases/)
    expect(source).not.toMatch(/\d+\s+municipal planning notices/)
    expect(source).not.toMatch(/\d+\/\d+/)
  })

  it('keeps sponsor price hedges out of product source', () => {
    const srcRoot = join(here, '..')
    const hedges = [/starts at/i, /from\s+\$250/i, /depends on availability/i]
    const hits = []
    for (const file of sourceFiles(srcRoot)) {
      const content = readFileSync(file, 'utf8')
      for (const hedge of hedges) {
        if (hedge.test(content)) hits.push(`${file} matches ${hedge}`)
      }
    }
    expect(hits).toEqual([])

    const confirmation = readFileSync(join(here, '../../functions/api/sponsor.js'), 'utf8')
    expect(confirmation).toContain('SPONSOR_RATE_LINE')
    expect(confirmation).not.toMatch(/starts at/i)
    expect(confirmation).not.toMatch(/depends on availability/i)
    expect(confirmation).not.toMatch(/pricing will be confirmed/i)
  })
})
