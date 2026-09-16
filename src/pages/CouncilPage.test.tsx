import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import CouncilPage from './CouncilPage'
import { planningNotices } from '../data/planningNotices'

function renderPage() {
  return render(<HelmetProvider><BrowserRouter><CouncilPage /></BrowserRouter></HelmetProvider>)
}

describe('Council portal and civic records', () => {
  it('provides three official council portals with secure external links', () => {
    renderPage()
    const portals = within(screen.getByRole('region', { name: 'Official council portals' }))
    const links = portals.getAllByRole('link', { name: /Open council portal/ })
    expect(links.map(link => new URL(link.getAttribute('href')!).hostname)).toEqual([
      'www.stcatharines.ca', 'www.welland.ca', 'www.thorold.ca',
    ])
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })
  it('distinguishes documented proposals from approval', () => {
    renderPage()
    expect(screen.getByText(/A meeting having occurred does not mean a proposal was approved/)).toBeInTheDocument()
  })
  it('renders sourced records and their documented statuses', () => {
    const { container } = renderPage()
    const cards = container.querySelectorAll('.scd-record-card')
    expect(cards.length).toBeGreaterThan(0)
    cards.forEach(card => {
      const link = within(card as HTMLElement).getByRole('link', { name: /Read official record/ })
      const record = planningNotices.find(item => item.sourceUrl === link.getAttribute('href'))
      expect(record).toBeDefined()
      expect(within(card as HTMLElement).getByText(record!.status)).toBeInTheDocument()
    })
  })
  it('does not mix police releases into council records', () => {
    renderPage()
    screen.getAllByRole('link').forEach(link => {
      expect(link.getAttribute('href')).not.toContain('niagarapolice.ca')
    })
  })
  it('provides a planning tracker destination', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /Explore the full Planning Tracker/ })).toHaveAttribute('href', '/planning-tracker')
  })
})
