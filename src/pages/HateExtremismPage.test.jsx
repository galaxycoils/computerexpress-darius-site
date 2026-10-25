import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import HateExtremismPage, { HateExtremismView } from './HateExtremismPage'
import MethodologyPage from './HateExtremismMethodologyPage'

function renderPage(ui) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Hate & Extremism pages', () => {
  it('shows the approved records and the support block', () => {
    renderPage(<HateExtremismPage />)
    expect(screen.queryByRole('heading', { name: 'Pending legal review' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Second Sons (Second Sons Canada)' })).toBeInTheDocument()
    expect(screen.getAllByText(/Labour Day weekend 2025/).length).toBeGreaterThan(0)
    expect(screen.getByText(/NOT on Public Safety Canada's listed-entities list/)).toBeInTheDocument()
    expect(screen.getByText(/"hate-related graffiti"/)).toBeInTheDocument()
    expect(screen.getByText(/charged: mischief \(not charged as a hate crime\); before the courts/)).toBeInTheDocument()
    expect(screen.queryByText(/71-year-old/)).not.toBeInTheDocument()
    expect(screen.getByText(/Methodology note: includes suspected incidents/)).toBeInTheDocument()
    expect(screen.getAllByText('Regional context').length).toBeGreaterThan(0)
    expect(screen.getByText(/This group is based outside Niagara/)).toBeInTheDocument()
    expect(screen.getByText(/A CBC visual investigation recently found Second Sons and active club Nationalist-13/)).toBeInTheDocument()
    expect(screen.queryByText(/CBC also calls it/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Niagara Falls 'hate-related graffiti' case: one arrest, mischief charge" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Welland hateful graffiti case (youth)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Lord Mayor condemns rally/ })).toBeInTheDocument()
    expect(screen.getByText(/as reported by the Standard/)).toBeInTheDocument()
    expect(screen.queryByText(/14-year-old/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Bradley/)).not.toBeInTheDocument()
    const support = screen.getByRole('region', { name: 'Report hate / get support' })
    expect(within(support).getByRole('heading', { name: 'Pride Niagara' })).toBeInTheDocument()
    expect(within(support).getByRole('heading', { name: 'Niagara Region Anti-Racism Association (NRARA)' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '911' })).toHaveAttribute('href', 'tel:911')
    expect(screen.getByRole('link', { name: '(905) 688-4111' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Request a correction / right of reply' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('June 11, 2025').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Editorial standards' })).toBeInTheDocument()
    expect(screen.getByText(/A support resource may cite one verified page or phone number\. Social media, forums and rumour do not\./)).toBeInTheDocument()
    expect(screen.queryByText(/An unverified contact is marked/)).not.toBeInTheDocument()
    expect(screen.getByText(/photos of private people and anything that identifies a minor stay out/)).toBeInTheDocument()
  })

  it('applies the cleared text fixes and does not render TODO', () => {
    const { container } = renderPage(<HateExtremismPage />)
    expect(container.textContent).not.toMatch(/TODO/)
    expect(document.body.textContent).not.toMatch(/TODO/)

    const falls = document.getElementById('case-nf-graffiti-2026')
    expect(falls.textContent).toMatch(/105-1 The River/)
    expect(falls.textContent).not.toMatch(/105\.7/)
    expect(falls.textContent).toMatch(/105-1 The River: "hate speech had been spray painted on buildings\."/)

    const diagolon = document.getElementById('grp-diagolon')
    expect(diagolon.textContent).not.toMatch(/TODO/)
    expect(diagolon.textContent).not.toMatch(/\bundated\b/i)
    const lgbtq = within(diagolon).getByRole('link', { name: /Targets the LGBTQ/ })
    const deportation = within(diagolon).getByRole('link', { name: /Deportation of All Indians/ })
    expect(lgbtq.closest('li').textContent).toMatch(/GPAHE\s+April 27, 2023/)
    expect(lgbtq.closest('li').textContent).not.toMatch(/TODO|undated|white supremacist Canadian movement|June 6, 2024|August 19, 2024/)
    expect(deportation.closest('li').textContent).toMatch(/GPAHE\s+June 6, 2024\s+Updated August 19, 2024/)
    expect(deportation.closest('li').textContent).not.toMatch(/TODO|undated|April 27, 2023|white supremacist Canadian movement/)
    const summary = [...diagolon.querySelectorAll('p')].find((node) => node.textContent.includes('white supremacist Canadian movement'))
    expect(summary.textContent).toContain('GPAHE\'s June 6, 2024 page calls it a "white supremacist Canadian movement"')
    expect(summary.textContent).not.toMatch(/April 27|Apr\. 27/)

    const notl = document.getElementById('inc-notl-response-2025')
    expect(notl.textContent).toMatch(/Sept\. 9, 2025/)
    expect(notl.textContent).not.toMatch(/Sept\. 10/)
    expect(notl.textContent).not.toMatch(/council meeting minutes/i)

    const brock = document.getElementById('inc-brocks-monument-2025')
    expect(brock.textContent).toContain('CBC (Sept. 9, 2025): Second Sons "shared photos and videos on social media showing about 50 people marching, chanting and carrying flags through Queenston Heights Park"')
    expect(brock.textContent).toContain('"Most of the people in those images are wearing matching white masks and black T-shirts."')
    expect(brock.textContent).toContain('CBC said the rally "is prompting concern about rising anti-immigrant sentiment and recruitment efforts of extremist groups."')
    expect(brock.textContent).toContain('Niagara Parks (via CBC): "no incidents were reported."')
    expect(brock.textContent).toContain('St. Catharines Standard (Sept. 4, 2025): "dozens of men wearing white face coverings" and "One video showed more than 50 men."')
    expect(brock.textContent).toContain('Date: Aug. 30, 2025 (per Niagara Parks, via CBC).')
    expect(brock.textContent).toContain('Aug. 30, 2025 (per Niagara Parks, via CBC)')
    expect(container.textContent).not.toContain('About 50 masked men')
    expect(container.textContent).not.toContain('"About 50" masked men')
    expect(document.body.textContent).not.toContain('About 50 masked men')
    expect(document.body.textContent).not.toContain('"About 50" masked men')
  })

  it('filters by type, municipality and scope', () => {
    renderPage(<HateExtremismPage />)
    fireEvent.change(screen.getByLabelText('Type'), { target: { value: 'statistic' } })
    expect(screen.getByRole('heading', { name: /Police-reported hate crimes/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Second Sons (Second Sons Canada)' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show all records' }))
    fireEvent.change(screen.getByLabelText('Municipality'), { target: { value: 'Niagara-on-the-Lake' } })
    expect(screen.getByRole('heading', { name: /Brock's Monument/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Police-reported hate crimes/ })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Show all records' }))
    fireEvent.change(screen.getByLabelText('Scope'), { target: { value: 'regional-context' } })
    const records = screen.getByRole('region', { name: 'Records' })
    expect(within(records).getByRole('heading', { name: /Nationalist-13 \(NS13\)/ })).toBeInTheDocument()
    expect(within(records).queryByRole('heading', { name: 'Diagolon' })).not.toBeInTheDocument()
  })

  it('shows loading, error and empty states', () => {
    const { unmount } = renderPage(<HateExtremismView status="loading" entries={[]} support={[]} />)
    expect(screen.getByRole('status').textContent).toMatch(/Loading records/)
    expect(screen.queryByRole('heading', { name: 'Second Sons (Second Sons Canada)' })).not.toBeInTheDocument()
    unmount()

    renderPage(<HateExtremismView status="error" entries={[]} support={[]} error="Example check failed" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Example check failed')
    expect(screen.queryByText(/hate-related graffiti/)).not.toBeInTheDocument()

    renderPage(<HateExtremismView status="ready" entries={[]} support={[]} />)
    expect(screen.getByText('Entries are being verified and will appear after editorial review.')).toBeInTheDocument()
  })

  it('explains the method, the statistic exception and the right of reply', () => {
    renderPage(<MethodologyPage />)
    expect(screen.getByRole('heading', { name: 'How entries are chosen' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Pending legal review' })).not.toBeInTheDocument()
    expect(screen.getByText(/Canadian Anti-Hate Network/)).toBeInTheDocument()
    expect(screen.getByText(/single official publisher/)).toBeInTheDocument()
    expect(screen.getByText(/support resource, shown only under Report hate/)).toBeInTheDocument()
    expect(screen.getByText(/Labour Day weekend 2025/)).toBeInTheDocument()
    expect(screen.getByText(/within 72 hours/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Request a correction / right of reply' })).toHaveAttribute('href', '/corrections')
    expect(screen.getByText(/photos of private people|Photos of private people/)).toBeInTheDocument()
  })
})
