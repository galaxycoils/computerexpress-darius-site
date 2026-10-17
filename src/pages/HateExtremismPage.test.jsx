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
  it('shows the legal-review banner, approved records and the support block', () => {
    renderPage(<HateExtremismPage />)
    expect(screen.getByRole('heading', { name: 'Pending legal review' })).toBeInTheDocument()
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
    expect(screen.getByText(/TODO: 2024 \(verify exact day\)/)).toBeInTheDocument()
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
    expect(screen.getByText(/Canadian Anti-Hate Network/)).toBeInTheDocument()
    expect(screen.getByText(/single official publisher/)).toBeInTheDocument()
    expect(screen.getByText(/support resource, shown only under Report hate/)).toBeInTheDocument()
    expect(screen.getByText(/Labour Day weekend 2025/)).toBeInTheDocument()
    expect(screen.getByText(/within 72 hours/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Request a correction / right of reply' })).toHaveAttribute('href', '/corrections')
    expect(screen.getByText(/photos of private people|Photos of private people/)).toBeInTheDocument()
  })
})
