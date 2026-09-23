import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import SponsorPage from './SponsorPage'

describe('SponsorPage inquiry', () => {
  it('offers contact without promising unverified delivery or audience numbers', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <SponsorPage />
        </BrowserRouter>
      </HelmetProvider>,
    )
    expect(screen.getByRole('button', { name: 'Send inquiry' })).toBeInTheDocument()
    expect(screen.getByLabelText('Interest')).toBeInTheDocument()
    expect(screen.queryByText(/41 active notices/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/within 24 hours/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/pay now/i)).not.toBeInTheDocument()
  })
})
