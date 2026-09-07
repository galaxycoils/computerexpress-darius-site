import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HomePage from './HomePage'

const renderWithProviders = (ui) =>
  render(
    <HelmetProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </HelmetProvider>,
  )

describe('HomePage — Editorial Newsroom', () => {
  it('renders hero with primary-document headline', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/primary documents/i)).toBeInTheDocument()
  })

  it('renders city location labels', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/St. Catharines · Welland · Thorold/i)).toBeInTheDocument()
  })

  it('has Planning Tracker CTA', () => {
    renderWithProviders(<HomePage />)
    const cta = screen.getByRole('link', { name: /Planning Tracker/i })
    expect(cta).toBeInTheDocument()
    expect(cta.getAttribute('href')).toBe('/planning-tracker')
  })

  it('has NRPS Releases external link', () => {
    renderWithProviders(<HomePage />)
    const nrps = screen.getByRole('link', { name: /NRPS Releases/i })
    expect(nrps).toBeInTheDocument()
    expect(nrps.getAttribute('href')).toBe('https://www.niagarapolice.ca/')
  })

  it('renders active notices from planningNotices data', () => {
    renderWithProviders(<HomePage />)
    const notices = screen.getAllByText(/Ontario Street Corridor/i)
    expect(notices.length).toBeGreaterThan(0)
  })

  it('renders stat counters', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/Municipalities/i)).toBeInTheDocument()
  })
})