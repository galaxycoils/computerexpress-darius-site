import { describe, expect, it } from 'vitest'
import { generateId, onRequest, parseDate } from './fetch-local-news.js'

const request = (method, authorization) => new Request('https://stcatharinesdigital.ca/cron/fetch-local-news', {
  method,
  headers: authorization ? { Authorization: authorization } : undefined,
})

describe('RSS collection endpoint', () => {
  it('fails closed when its secret is absent', async () => {
    const response = await onRequest({ env: { STC_D1: {} }, request: request('POST') })
    expect(response.status).toBe(503)
  })

  it('accepts only authenticated POST requests', async () => {
    const env = { STC_D1: {}, CRON_SECRET: 'scheduled-secret' }
    expect((await onRequest({ env, request: request('GET', 'Bearer scheduled-secret') })).status).toBe(405)
    expect((await onRequest({ env, request: request('POST') })).status).toBe(401)
  })

  it('keeps an unknown source date unknown and gives a feed item a stable identity', () => {
    expect(parseDate('not a date')).toBeNull()
    expect(generateId('source', 'stable-guid')).toBe(generateId('source', 'stable-guid'))
    expect(generateId('source', 'stable-guid')).not.toBe(generateId('source', 'other-guid'))
  })
})
