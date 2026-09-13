import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import PlanningAlertsPage from './PlanningAlertsPage'

describe('PlanningAlertsPage', () => {
  it('describes the $49 beta without offering checkout', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <PlanningAlertsPage />
        </BrowserRouter>
      </HelmetProvider>,
    )
    expect(screen.getByRole('heading', { name: /notices that matter/i })).toBeInTheDocument()
    expect(screen.getByText(/\$49\/month/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create alert/i })).toBeInTheDocument()
    expect(screen.queryByText(/pay now|subscribe now/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/checkout/i)).not.toBeInTheDocument()
  })
})
