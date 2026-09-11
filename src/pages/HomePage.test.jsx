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

  it('uses local file photos with dates and credits', () => {
    renderWithProviders(<HomePage />)
    const photo = screen.getByRole('img', { name: /Stone facade of St. Catharines City Hall/i })
    expect(photo).toHaveAttribute('src', '/images/local/st-catharines-city-hall.webp')
    expect(screen.getByText(/File photo, December 2023/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Hannah Clover/i })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:St._Catharines_City_Hall_2023.jpg')
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
    const nrps = screen.getByRole('link', { name: /Niagara Regional Police/i })
    expect(nrps).toBeInTheDocument()
    expect(nrps.getAttribute('href')).toBe('https://www.niagarapolice.ca/')
  })

  it('renders active notices from planningNotices data', () => {
    renderWithProviders(<HomePage />)
    const notices = screen.getAllByText(/Ontario Street Corridor/i)
    expect(notices.length).toBeGreaterThan(0)
  })

  it('keeps the newsletter form accessible', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('textbox', { name: /email address/i })).toHaveAttribute('type', 'email')
  })
})
