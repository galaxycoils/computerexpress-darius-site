import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import SponsorPage from './SponsorPage'

describe('SponsorPage offer', () => {
  it('shows the three approved manual-inquiry tiers', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SponsorPage />
        </BrowserRouter>
      </HelmetProvider>,
    )
    expect(screen.getAllByText('$300').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('$150').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('$50').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText(/pay now/i)).not.toBeInTheDocument()
  })
})