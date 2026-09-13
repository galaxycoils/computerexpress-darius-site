import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import GuidePage from './GuidePage'

function renderPage() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <GuidePage slug="st-catharines-ontario-street-corridor-plan" />
      </BrowserRouter>
    </HelmetProvider>,
  )
}

describe('GuidePage', () => {
  it('shows its official source, Planning Tracker link, and newsletter CTA', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /Ontario Street Corridor/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view the official notice/i })).toHaveAttribute('href', expect.stringContaining('stcatharines.ca'))
    expect(screen.getByRole('link', { name: /planning tracker/i })).toHaveAttribute('href', '/planning-tracker')
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
  })
})