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
  it('renders the newsroom headline and attribution promise', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/public records and primary sources/i)).toBeInTheDocument()
  })

  it('uses local file photos with dates and credits', () => {
    renderWithProviders(<HomePage />)
    const photo = screen.getByRole('img', { name: /Stone facade of St. Catharines City Hall/i })
    expect(photo).toHaveAttribute('src', '/images/local/st-catharines-city-hall.webp')
    expect(screen.getByText(/File photo, December 2023/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Hannah Clover/i })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:St._Catharines_City_Hall_2023.jpg')
  })

  it('renders the local calendar', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { name: 'This week locally' })).toBeInTheDocument()
  })

  it('has Planning Tracker CTA', () => {
    renderWithProviders(<HomePage />)
    const cta = screen.getByRole('link', { name: /Planning Tracker/i })
    expect(cta).toBeInTheDocument()
    expect(cta.getAttribute('href')).toBe('/planning-tracker')
  })

  it('links reporting to an official municipal source', () => {
    renderWithProviders(<HomePage />)
    const nrps = screen.getByRole('link', { name: 'Read official source' })
    expect(nrps).toBeInTheDocument()
    expect(new URL(nrps.getAttribute('href')).hostname).toBe('www.stcatharines.ca')
  })

  it('renders active notices from planningNotices data', () => {
    renderWithProviders(<HomePage />)
    const notices = screen.getAllByText(/Ontario Street Corridor/i)
    expect(notices.length).toBeGreaterThan(0)
  })

  it('keeps the newsletter forms accessible', () => {
    renderWithProviders(<HomePage />)
    const boxes = screen.getAllByRole('textbox', { name: /email address/i })
    expect(boxes.length).toBe(1)
    boxes.forEach((box) => expect(box).toHaveAttribute('type', 'email'))
  })

  it('links to the elections hub without hard-coded candidate counts', () => {
    renderWithProviders(<HomePage />)
    expect(screen.queryByText(/Eight candidates\. One mayor\./i)).not.toBeInTheDocument()
    const guide = screen.getByRole('link', { name: /Election guides and civic information/i })
    expect(guide.getAttribute('href')).toBe('/votes')
  })

  it('offers topic checkboxes in the home capture', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('checkbox', { name: /Council/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Planning/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Police/i })).toBeInTheDocument()
  })

  it('has no duplicate-destination CTAs', () => {
    renderWithProviders(<HomePage />)
    expect(screen.queryByRole('link', { name: /Pay with eTransfer/i })).not.toBeInTheDocument()
  })

  it('links lead photo to its official source', () => {
    renderWithProviders(<HomePage />)
    const img = screen.getByRole('img', { name: /Stone facade of St. Catharines City Hall/i })
    const link = img.closest('a')
    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toMatch(/^https?:\/\//)
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('preserves a date-only publication day', () => {
    const { container } = renderWithProviders(<HomePage />)
    expect(container.querySelector('time[datetime="2026-08-25"]')).toHaveTextContent('Aug 25, 2026')
  })

  it('marks story times machine-readable', () => {
    const { container } = renderWithProviders(<HomePage />)
    const times = container.querySelectorAll('time[dateTime]')
    expect(times.length).toBeGreaterThan(0)
  })
})