import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import WardRacePage from './WardRacePage'
import { wellandWardRaces } from '../data/wardRaces'

const renderAt = (url) => render(
  <HelmetProvider><MemoryRouter initialEntries={[url]}><Routes>
    <Route path="/elections/welland/:ward" element={<WardRacePage />} />
  </Routes></MemoryRouter></HelmetProvider>,
)

describe('WardRacePage', () => {
  it('has six wards with two seats each and no vote or incumbency claims', () => {
    expect(wellandWardRaces).toHaveLength(6)
    wellandWardRaces.forEach((w) => expect(w.seats).toBe(2))
    expect(JSON.stringify(wellandWardRaces)).not.toMatch(/incumbent|voted/i)
  })
  it('renders ward 4 candidates with source and newsletter CTA', () => {
    renderAt('/elections/welland/ward-4')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ward 4')
    expect(screen.getByText('Terry Zorgel')).toBeInTheDocument()
    expect(screen.getByText(/Registered Candidates/)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })
})
