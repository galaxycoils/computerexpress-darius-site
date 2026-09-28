import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { planningNotices } from '../data/planningNotices'
import { nrpsReleases } from '../data/nrpsReleases'
import PlanningTrackerPage from './PlanningTrackerPage'
import PoliceNewsPage from './PoliceNewsPage'

function renderPage(page) {
  return render(<HelmetProvider><BrowserRouter>{page}</BrowserRouter></HelmetProvider>)
}

describe('source municipality filters', () => {
  it('finds planning notices for St. Catharines', () => {
    const { container } = renderPage(<PlanningTrackerPage />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by municipality' }), { target: { value: 'st. catharines' } })
    expect(container.querySelectorAll('.planning-table tbody tr')).toHaveLength(
      planningNotices.filter(({ municipality }) => municipality === 'St. Catharines').length,
    )
    expect(screen.getAllByRole('option', { name: 'Niagara Region' })).toHaveLength(1)
  })

  it('finds police releases for St. Catharines', () => {
    const { container } = renderPage(<PoliceNewsPage />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by municipality' }), { target: { value: 'st. catharines' } })
    expect(container.querySelectorAll('.release-card')).toHaveLength(
      nrpsReleases.filter(({ municipality }) => municipality.toLowerCase().includes('st. catharines')).length,
    )
  })
})
