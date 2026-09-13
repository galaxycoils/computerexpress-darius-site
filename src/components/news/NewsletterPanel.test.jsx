import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NewsletterPanel from './NewsletterPanel'

describe('NewsletterPanel', () => {
  it('sends its placement in the request body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<NewsletterPanel placement="guide_inline" />)

    const input = screen.getByRole('textbox', { name: /email address/i })
    fireEvent.change(input, { target: { value: 'reader@example.com' } })

    const button = screen.getByRole('button', { name: /subscribe free/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(init.body)
    expect(body).toEqual({ email: 'reader@example.com', placement: 'guide_inline' })
  })

  it('defaults placement to site_rail when no prop is passed', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<NewsletterPanel />)

    const input = screen.getByRole('textbox', { name: /email address/i })
    fireEvent.change(input, { target: { value: 'reader@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /subscribe free/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.placement).toBe('site_rail')
  })
})