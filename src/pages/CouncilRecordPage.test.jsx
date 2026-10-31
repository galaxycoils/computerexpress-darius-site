import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import CouncilRecordPage, { CouncilRecordEntries, CouncilRecordView } from './CouncilRecordPage'
import RulesPage from './CouncilRecordRulesPage'

function renderPage(ui) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>,
  )
}

const entry = {
  id: 'sample-ward-1',
  councillor_name: 'Alex Example',
  ward: 'Ward 1',
  city: 'Welland',
  statement: {
    exact_quote: 'The budget should be published before the vote.',
    sources: [
      { url: 'https://www.wellandtribune.ca/example-a', publisher: 'Welland Tribune', date: '2026-11-01' },
      { url: 'https://www.stcatharinesstandard.ca/example-b', publisher: 'St. Catharines Standard', date: '2026-11-02' },
    ],
    archived_copy_url: 'https://web.archive.org/web/example',
  },
  vote: {
    item: '2027 operating budget',
    position: 'Voted against',
    minutes_url: 'https://www.welland.ca/meetings/minutes-example',
    date: '2026-11-20',
  },
  published_date: '2026-11-21',
  last_verified_date: '2026-11-22',
  status: 'Reply received',
  comment_requested_date: '2026-11-18',
  reply_deadline: '2026-11-20',
  reply: null,
  commentary: { text: 'The two records are shown here without a conclusion.', signed_by: 'Darius T' },
}

describe('Council Record pages', () => {
  it('shows the intro, the empty state, and no entries', () => {
    renderPage(<CouncilRecordPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Council Record' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'How we choose entries' })).toHaveAttribute('href', '/council-record/how-we-choose-entries')
    expect(screen.getByText('Entries will be added after the new councils take office (Nov. 15, 2026) once each one has been checked and approved, with legal review of the format and first batch.')).toBeInTheDocument()
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByText('Darius T')).toBeInTheDocument()
    expect(screen.queryByText(/sponsor/i)).not.toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/\bWatch\b/)
  })

  it('renders nothing from the entry list when there are no entries', () => {
    const { container } = renderPage(<CouncilRecordEntries entries={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a checked entry beside its vote, including no reply and the correction link', () => {
    renderPage(<CouncilRecordView entries={[entry]} />)
    expect(screen.getByRole('heading', { name: 'Alex Example' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Statement' })).toHaveTextContent('The budget should be published before the vote.')
    expect(screen.getByRole('region', { name: 'Vote' })).toHaveTextContent('Voted against')
    expect(screen.getByRole('link', { name: 'City minutes' })).toHaveAttribute('href', entry.vote.minutes_url)
    expect(screen.getByText('No reply by November 20, 2026')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Commentary' })).toHaveTextContent('Signed by Darius T')
    expect(screen.getByRole('link', { name: 'Request a correction / right of reply' })).toHaveAttribute('href', '/corrections?entry=sample-ward-1')
    expect(screen.getByText('Reply received')).toBeInTheDocument()
  })

  it('hides entries that failed the editorial checks', () => {
    renderPage(<CouncilRecordView status="error" entries={[entry]} />)
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Nothing from the failed check is displayed.')
  })

  it('sends the notify-me signup to the existing newsletter endpoint with the Council Record tag', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Check your inbox and confirm your email to finish subscribing.' }),
    })
    vi.stubGlobal('fetch', fetchMock)
    renderPage(<CouncilRecordPage />)
    fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), { target: { value: 'reader@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Notify me' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    const [endpoint, init] = fetchMock.mock.calls[0]
    expect(endpoint).toBe('/api/newsletter')
    expect(JSON.parse(init.body)).toEqual({
      email: 'reader@example.com',
      placement: 'council-record',
      source: 'council-record',
      topics: [],
    })
  })

  it('states how entries are chosen', () => {
    renderPage(<RulesPage />)
    const text = document.body.textContent
    expect(screen.getByRole('heading', { level: 1, name: 'How we choose entries' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Council Record' })).toHaveAttribute('href', '/council-record')
    expect(text).toMatch(/quoted exactly/)
    expect(text).toMatch(/Each quote needs two credible sources\./)
    expect(text).not.toMatch(/one credible source plus an archived copy/)
    expect(text).toMatch(/When either source is the councillor's own page or post, the entry also needs an archived copy/)
    expect(text).toMatch(/on-record statements \(council meetings, campaign material, credible press\)/)
    expect(text).toMatch(/The same standard applies to every councillor in both cities/)
    expect(text).toMatch(/Each entry is approved by the editor before publication/)
    expect(text).toMatch(/primary city record/)
    expect(text).toMatch(/side by side/)
    expect(text).toMatch(/separate commentary field/)
    expect(text).toMatch(/signed by the person who wrote it/)
    expect(text).toMatch(/date it was published/)
    expect(text).toMatch(/date it was last verified/)
    expect(text).toMatch(/neutral label/)
    expect(text).toMatch(/\/corrections\?entry=/)
    expect(text).toMatch(/Correction requests are reviewed within 72 hours/)
    expect(text).toMatch(/updated within 48 hours and marked Updated/)
    expect(text).toMatch(/asks the councillor for comment before an entry is published/)
    expect(text).toMatch(/at least two business days/)
    expect(text).toMatch(/No reply by/)
    expect(text).toMatch(/nothing about family, home or private business/)
    expect(text).not.toMatch(/conflict-of-interest filing|integrity commissioner/)
    expect(text).toMatch(/A lawyer reviews the format and the first batch before entries go live/)
    expect(screen.getByText('Darius T')).toBeInTheDocument()
    expect(text).not.toMatch(/\bWatch\b/)
    expect(text).not.toMatch(/sponsor/i)
  })
})
