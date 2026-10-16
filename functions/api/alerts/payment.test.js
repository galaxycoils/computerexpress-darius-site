import { describe, expect, it } from 'vitest'
import { onRequestGet, onRequestPost } from './payment.js'

const ID = '3f9a12bc-1111-4222-8333-444455556666'
function fakeDb(rows) {
  const calls = []
  return {
    calls,
    prepare(sql) {
      return {
        bind(...args) {
          calls.push({ sql, args })
          return {
            all: async () => ({ results: rows.filter((r) => r.id.replace(/-/g, '').startsWith(String(args[0]).replace('%', ''))) }),
            first: async () => rows.find((r) => r.id === args[args.length - 1]) || null,
            run: async () => ({ meta: { changes: 1 } }),
          }
        },
      }
    },
  }
}
const ctx = (method, { auth = 'Bearer s3cret', body, query = '', rows = [{ id: ID, email: 'a@b.ca' }] } = {}) => {
  const db = fakeDb(rows)
  return { db, context: {
    env: { STC_D1: db, ADMIN_SECRET: 's3cret' },
    request: new Request(`https://x.test/api/alerts/payment${query}`, { method, headers: auth ? { Authorization: auth } : {}, body: body ? JSON.stringify(body) : undefined }),
  } }
}

describe('admin payment endpoint', () => {
  it('rejects requests without the admin secret', async () => {
    expect((await onRequestGet(ctx('GET', { auth: 'Bearer nope', query: '?reference=PA-3F9A12BC' }).context)).status).toBe(401)
    expect((await onRequestPost(ctx('POST', { auth: null, body: { reference: 'PA-3F9A12BC' } }).context)).status).toBe(401)
  })
  it('looks up a signup by reference', async () => {
    const res = await onRequestGet(ctx('GET', { query: '?reference=pa-3f9a12bc' }).context)
    expect(res.status).toBe(200)
    expect((await res.json()).alert.id).toBe(ID)
  })
  it('rejects malformed references and unknown ones', async () => {
    expect((await onRequestGet(ctx('GET', { query: '?reference=DROP' }).context)).status).toBe(400)
    expect((await onRequestGet(ctx('GET', { query: '?reference=PA-00000000' }).context)).status).toBe(404)
  })
  it('activates by reference', async () => {
    const { db, context } = ctx('POST', { body: { reference: 'PA-3F9A12BC' } })
    const res = await onRequestPost(context)
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json).toMatchObject({ success: true, alert_id: ID, reference: 'PA-3F9A12BC' })
    expect(db.calls.some((c) => c.sql.startsWith('UPDATE alerts SET payment_status'))).toBe(true)
  })
  it('refuses an ambiguous reference', async () => {
    const rows = [{ id: ID }, { id: '3f9a12bc-9999-4222-8333-444455556666' }]
    expect((await onRequestPost(ctx('POST', { body: { reference: 'PA-3F9A12BC' }, rows }).context)).status).toBe(409)
  })
})
