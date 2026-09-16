import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { beforeEach, describe, expect, it } from 'vitest'
import AlertPreferencesPage from './AlertPreferencesPage'

describe('AlertPreferencesPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.history.replaceState({}, '', '/preferences')
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
})
