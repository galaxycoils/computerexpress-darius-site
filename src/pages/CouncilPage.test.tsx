import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import CouncilPage from './CouncilPage'

// Use vi.hoisted to create the mock object so that Vitest's hoisted mock
// factory can reference it without triggering a TDZ "before initialization"
// error. vi.hoisted returns a getter whose body runs at the point Vitest
// expects for top-level mock setup.
const mockManifest = vi.hoisted(() => ({
  generationId: 'gen-test',
  lastAttemptedAt: '2026-09-12T20:00:00Z',
  sources: {} as Record<string, any>,
}))

// Mock the manifest default import. The factory returns a frozen envelope so
// that repeated require() calls in tests resolve to the same object skeleton,
// while `mockManifest.sources` is the live part we mutate per test.
vi.mock('../data/generated/manifest.json', () => ({
  default: mockManifest,
}))

// react-dom/test-utils act shim — add only if Vitest surfaces
// "React.act is not a function" during render. Per @municipal-core's
// ruling, do NOT include this unconditionally.

function wrapInProviders(ui: React.ReactElement) {
  return (
    <HelmetProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </HelmetProvider>
  )
}

// Helper: build three council sources with the given timestamp config.
function councilSources(allNull: boolean, staleTs?: string) {
  const base = (municipality: string, url: string) => ({
    municipality,
    sourcePageUrl: url,
    sourceType: 'council_document',
    status: 'failed' as const,
    lastSuccessfulScanAt: allNull ? null : (staleTs ?? null),
    itemCount: 0,
    rejectedLinks: 0,
    items: [],
  })
  return {
    st_catharines: base('St. Catharines', 'https://www.stcatharines.ca/council-and-administration/mayor-and-council/'),
    welland: base('Welland', 'https://www.welland.ca/city-hall/mayor-and-council/council-agendas-and-minutes/'),
    thorold: base('Thorold', 'https://www.thorold.ca/council-administration/council/council-meetings/'),
  }
}

// Replace mockManifest.sources with a new object so Vitest's proxy fires
// and the ESM import that CouncilPage sees picks up the change.
// (In-place key mutation on the nested sources object is NOT intercepted
// by the proxy, so we always swap the whole sources reference here.)
function mockSources(sources: Record<string, any>) {
  mockManifest.sources = sources
}

describe('CouncilPage', () => {
  // ---
  // Test 1: All three council sources fail + null lastSuccessfulScanAt
  // → renders "No successful scan yet." for each + zero document cards
  // ---
  test('renders "No successful scan yet." when all three council sources fail with null lastSuccessfulScanAt', () => {
    mockSources(councilSources(true))

    render(wrapInProviders(<CouncilPage />))

    // exactly three "No successful scan yet." rows (one per council source)
    expect(screen.getAllByText('No successful scan yet.')).toHaveLength(3)
    expect(screen.getByText('St. Catharines')).toBeInTheDocument()
    expect(screen.getByText('Welland')).toBeInTheDocument()
    expect(screen.getByText('Thorold')).toBeInTheDocument()

    const failedBadges = screen.getAllByText('Failed')
    expect(failedBadges.length).toBeGreaterThanOrEqual(3)

    const noScanMessages = screen.getAllByText('No successful scan yet.')
    expect(noScanMessages.length).toBeGreaterThanOrEqual(3)

    // Zero document titles/dates rendered
    expect(screen.queryByText(/July 28, 2026/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Minutes -/)).not.toBeInTheDocument()
  })

  // ---
  // Test 2: No loading skeleton — static import, no useEffect
  // ---
  test('renders no loading skeleton when manifest is present (static import, no useEffect)', () => {
    mockSources(councilSources(true))

    render(wrapInProviders(<CouncilPage />))
    expect(screen.queryByText(/loading municipal/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/loading spinner/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Loading municipal/i)).not.toBeInTheDocument()
  })

  // ---
  // Test 3: Stale branch — real behavioral test.
  // Mock manifest with one source having non-null lastSuccessfulScanAt,
  // render, and assert the "Stale — last successful scan: …" text appears.
  // Per council-document-scraper/references/ui-contract-test-patterns.md
  // ---
  test('renders stale text for the source with failed + timestamp (behavioral stale branch)', () => {
    // Set up manifest where st_catharines has a stale timestamp
    // and welland/thorold have null timestamps.
    // NOTE: CouncilPage.jsx now computes COUNCIL_SOURCES inside the function
    // Build a manifest where st_catharines has a stale timestamp
    // and welland/thorold have null timestamps. Pass the whole object
    // through mockSources() (not in-place mutation) so Vitest's proxy fires.
    mockSources({
      st_catharines: councilSources(false, '2026-09-01T12:00:00Z').st_catharines,
      welland: councilSources(false).welland,
      thorold: councilSources(false).thorold,
    })

    render(wrapInProviders(<CouncilPage />))

    const stale = screen.getByText('Stale —').parentElement
    expect(stale).toHaveTextContent('Stale — last successful scan: Sep 1, 2026')

    // Non-stale sources (null timestamp: welland + thorold) render
    // "No successful scan yet." — expect exactly two such rows
    const noScanRows = screen.getAllByText('No successful scan yet.')
    expect(noScanRows.length).toBe(2)
  })

  // ---
  // Test 4: NRPS exclusion — NRPS is official_press_release, not
  // council_document; must not appear in council feed at all
  // ---
  test('does not render NRPS items in council feed (NRPS is official_press_release)', () => {
    mockSources(councilSources(true))

    render(wrapInProviders(<CouncilPage />))

    expect(screen.queryByText('Niagara Regional Police Service')).not.toBeInTheDocument()
    expect(screen.queryByText('Two Arrested in Welland Break and Enter Investigation')).not.toBeInTheDocument()
    expect(screen.queryByText('Police Investigating Serious E-Scooter Collision in Welland')).not.toBeInTheDocument()

    const allLinks = screen.getAllByRole('link')
    const nrpsLinks = allLinks.filter(
      (link: HTMLAnchorElement | null) => link && link.getAttribute('href')?.includes('niagarapolice.ca'),
    )
    expect(nrpsLinks.length).toBe(0)
  })

  // ---
  // Test 5: Council source rows have clickable sourcePageUrl links
  // with correct official-domain hrefs
  // ---
  test('council source rows link to correct official domain URLs', () => {
    mockSources(councilSources(true))

    render(wrapInProviders(<CouncilPage />))

    const links = screen.getAllByRole('link')
    const cityLinks = links.filter(
      (link: HTMLAnchorElement | null) => link && link.getAttribute('href')?.startsWith('https://www.'),
    ) as HTMLAnchorElement[]

    expect(cityLinks.length).toBe(3)

    const hrefs = cityLinks.map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('https://www.stcatharines.ca/council-and-administration/mayor-and-council/')
    expect(hrefs).toContain('https://www.welland.ca/city-hall/mayor-and-council/council-agendas-and-minutes/')
    expect(hrefs).toContain('https://www.thorold.ca/council-administration/council/council-meetings/')
  })
})
