import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AlertPreferencesPage from './AlertPreferencesPage'

const ALERT = {
  id: 'a1',
  email: 'reader@example.com',
  verified: true,
  frequency: 'daily',
  wards: [],
  types: [],
  statuses: [],
  keywords: '',
  created_at: Date.now(),
  last_sent_at: null,
}

function renderPage(alert) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ alert }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })))
  window.sessionStorage.setItem('scd-alert-token', 'token')
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <AlertPreferencesPage />
      </BrowserRouter>
    </HelmetProvider>,
  )
}

describe('AlertPreferencesPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.history.replaceState({}, '', '/preferences')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not expose alert data without a private token', async () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <AlertPreferencesPage />
        </BrowserRouter>
      </HelmetProvider>,
    )

    expect(await screen.findByRole('heading', { name: /Open your private email link/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create a new planning alert/i })).toHaveAttribute('href', '/planning-alerts')
  })

  // Delivery is gated on payment, so the page must explain the stop rather than
  // leave a lapsed reader looking at an unchanged screen.
  it('explains a paused digest and how to restart it', async () => {
    renderPage({ ...ALERT, delivery_state: 'paused', payment_status: 'pending_interac', grace_until: null })

    expect(await screen.findByText(/Delivery paused/i)).toBeInTheDocument()
    expect(screen.getByText(/\$49\/month/)).toBeInTheDocument()
    expect(screen.getByText(/cccemt@pm\.me/)).toBeInTheDocument()
  })

  it('warns a reader whose complimentary window is closing', async () => {
    renderPage({
      ...ALERT,
      delivery_state: 'grace',
      payment_status: 'pending_interac',
      grace_until: Date.UTC(2026, 10, 5),
    })

    expect(await screen.findByText(/Payment due/i)).toBeInTheDocument()
    expect(screen.getByText(/complimentary until/i)).toBeInTheDocument()
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('confirms an active subscription without payment copy', async () => {
    renderPage({ ...ALERT, delivery_state: 'active', payment_status: 'confirmed', grace_until: null })

    expect(await screen.findByText(/Subscription active/i)).toBeInTheDocument()
    expect(screen.queryByText(/Delivery paused/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Interac e-Transfer/)).not.toBeInTheDocument()
  })
})
