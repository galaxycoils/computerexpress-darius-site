import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'

const renderWithProviders = (ui) =>
  render(
    <HelmetProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </HelmetProvider>,
  )

describe('HomePage — Planning Alert primary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero with Planning Alert as the lead', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/Official municipal planning notices/i)).toBeInTheDocument()
    expect(screen.getByText(/tracked and delivered/i)).toBeInTheDocument()
  })

  it('hero CTA is "Get the free Planning Alert" with inline email capture', () => {
    renderWithProviders(<HomePage />)
    const submitButton = screen.getByRole('button', {
      name: /get the free planning alert/i,
    })
    expect(submitButton).toBeInTheDocument()
    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    expect(emailInput).toBeInTheDocument()
  })

  it('rejects empty email submission', async () => {
    renderWithProviders(<HomePage />)
    const submitButton = screen.getByRole('button', {
      name: /get the free planning alert/i,
    })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.queryByText(/subscribed/i)).not.toBeInTheDocument()
    })
  })

  it('accepts valid email and posts to /api/newsletter', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    renderWithProviders(<HomePage />)
    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    const submitButton = screen.getByRole('button', {
      name: /get the free planning alert/i,
    })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/newsletter',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com' }),
        }),
      )
    })

    await waitFor(() => {
      expect(screen.getByText(/subscribed/i)).toBeInTheDocument()
    })
  })

  it('shows error state on failed submission', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Already subscribed' }),
    })

    renderWithProviders(<HomePage />)
    const emailInput = screen.getByRole('textbox', { name: /email address/i })
    const submitButton = screen.getByRole('button', {
      name: /get the free planning alert/i,
    })

    fireEvent.change(emailInput, { target: { value: 'taken@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  it('renders live active notices from planningNotices data', () => {
    renderWithProviders(<HomePage />)
    const notices = screen.getAllByText(/Ontario Street Corridor/i)
    expect(notices.length).toBeGreaterThan(0)
  })

  it('renders "Browse active notices" secondary CTA linking to /planning-tracker', () => {
    renderWithProviders(<HomePage />)
    const planningTrackerLink = screen.getByRole('link', {
      name: /browse active notices/i,
    })
    expect(planningTrackerLink).toBeInTheDocument()
    expect(planningTrackerLink.getAttribute('href')).toBe('/planning-tracker')
  })

  it('secondary CTA and live-notice section do not include sponsor pricing above the proof-of-inventory', () => {
    renderWithProviders(<HomePage />)
    // Sponsor pricing must not appear before the bottom sponsor CTA section.
    // Find the sponsor section heading and confirm no price text precedes it.
    const sponsorHeading = screen.getByRole('heading', {
      name: /sponsor the planning alert/i,
    })
    const proofTree = sponsorHeading.closest('main') || sponsorHeading.parentNode
    const proofHTML = proofTree.innerHTML
    expect(proofHTML).not.toContain('$300')
    expect(proofHTML).not.toContain('$250')
    expect(proofHTML).not.toContain('$500')
  })

  it('footer contains compact services route, not a primary services pitch above the fold', () => {
    renderWithProviders(<HomePage />)
    // The homepage links to /services from the services section, not a
    // standalone "web design" link in a homepage footer.
    const servicesLink = screen.getByRole('link', { name: /view all services/i })
    expect(servicesLink).toBeInTheDocument()
    expect(servicesLink.getAttribute('href')).toBe('/services')
  })
})
