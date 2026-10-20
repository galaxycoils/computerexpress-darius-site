import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import NewsFeed from './NewsFeed'

vi.mock('../../data/searchIndex', () => ({
  SEARCH_SECTIONS: [],
  getSearchIndex: () => Array.from({ length: 24 }, (_, index) => ({
    id: `record:${index}`, title: 'A shared official headline',
    href: `/development/record-${index}`, city: 'Welland', topic: 'Development',
    kind: 'Development record', date: '2026-10-16',
  })),
  searchSite: items => items,
}))

describe('search pagination', () => {
  it('advances and returns distinct records even when every headline is identical', () => {
    const { container } = render(<MemoryRouter><NewsFeed search /></MemoryRouter>)
    const ids = () => Array.from(container.querySelectorAll('.journal-story'), node => node.dataset.storyId)
    expect(ids()).toEqual(Array.from({ length: 12 }, (_, i) => `record:${i}`))
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
    expect(screen.getByRole('status')).toHaveTextContent('Showing 13–24')
    expect(ids()).toEqual(Array.from({ length: 12 }, (_, i) => `record:${i + 12}`))
    expect(screen.getByRole('button', { name: 'Next →' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: '← Previous' }))
    expect(ids()).toEqual(Array.from({ length: 12 }, (_, i) => `record:${i}`))
  })
})
