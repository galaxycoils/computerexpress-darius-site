import test from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { onRequest } from '../functions/cron/daily-digest.js'

function database() {
  const sqlite = new DatabaseSync(':memory:')
  // 0004 adds payment_status; 0011 adds the grace columns the delivery gate reads.
  // Without them the recipient query cannot run at all.
  for (const file of [
    '0001_create_alerts.sql',
    '0004_add_payment.sql',
    '0006_create_email_delivery_log.sql',
    '0010_alert_sent_items.sql',
    '0011_add_alert_entitlement.sql',
  ]) {
    sqlite.exec(readFileSync(new URL(`../migrations/${file}`, import.meta.url), 'utf8'))
  }
  const db = {
    prepare(sql) {
      const statement = sqlite.prepare(sql)
      const execute = args => ({
        async first() { return statement.get(...args) },
        async all() { return { results: statement.all(...args) } },
        async run() { const result = statement.run(...args); return { meta: { changes: result.changes } } },
      })
      return { ...execute([]), bind(...args) { return execute(args) } }
    },
    async batch(statements) { for (const statement of statements) await statement.run() },
  }
  return { sqlite, db }
}

function insertAlert(sqlite, { id, email, paymentStatus, graceUntil = null, createdAt, updatedAt }) {
  sqlite.prepare(
    'INSERT INTO alerts (id,email,verified,frequency,wards,types,statuses,keywords,created_at,updated_at,payment_status,grace_until) VALUES (?,?,1,\'daily\',\'[]\',\'[]\',\'[]\',\'\',?,?,?,?)'
  ).run(id, email, createdAt, updatedAt, paymentStatus, graceUntil)
}

test('weekly digest reads the published feed and sends each source only once', async t => {
  const { sqlite, db } = database()
  t.after(() => sqlite.close())
  const now = Date.now()
  // The digest is the paid product, so this subscriber must have paid.
  insertAlert(sqlite, {
    id: 'a1',
    email: 'reader@example.com',
    paymentStatus: 'confirmed',
    createdAt: now - 3 * 86400000,
    updatedAt: now,
  })
  const date = new Date().toISOString().slice(0, 10)
  let sent = 0
  let message
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.includes('/planning-alert-feed.json')) return Response.json({ version: 1, notices: [
      { id: 'new-source', title: 'Zoning <script>alert(1)</script>', description: '', municipality: 'Welland', publishedDate: date, sourceUrl: 'https://www.welland.ca/news/zoning', category: 'zoning-bylaw-amendment', status: null, tags: '' },
      { id: 'old-source', title: 'Old zoning file', description: '', municipality: 'Welland', publishedDate: '2020-01-01', sourceUrl: 'https://www.welland.ca/news/old', category: 'zoning-bylaw-amendment', status: null, tags: '' },
    ] })
    if (url.endsWith('/inboxes')) return Response.json({ inboxes: [{ inbox_id: 'test-inbox' }] })
    message = JSON.parse(options.body)
    sent++
    return Response.json({ id: 'sent' })
  })
  const context = { env: { STC_D1: db, AGENTMAIL_API_KEY: 'mock', ALERT_TOKEN_SECRET: 'test-secret', CRON_SECRET: 'cron' }, request: new Request('https://stcatharinesdigital.ca/cron/daily-digest', { method: 'POST', headers: { Authorization: 'Bearer cron' } }) }
  assert.deepEqual(await (await onRequest(context)).json(), { sent: 1, failed: 0, graceNotices: 0, total: 1 })
  assert.equal(sent, 1)
  assert.match(message.html, /Zoning &lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.equal(sqlite.prepare('SELECT source_id FROM alert_sent_items').get().source_id, 'new-source')
  assert.deepEqual(await (await onRequest(context)).json(), { sent: 0, failed: 0, graceNotices: 0, total: 1 })
  assert.equal(sent, 1)
})

// Regression guard for the revenue leak: before migration 0011 the digest went to
// every verified alert, so the $49/mo product was free to anyone who confirmed an
// address. An unpaid subscriber must receive nothing.
test('an unpaid subscriber is not sent the paid digest', async t => {
  const { sqlite, db } = database()
  t.after(() => sqlite.close())
  const now = Date.now()
  insertAlert(sqlite, {
    id: 'unpaid',
    email: 'unpaid@example.com',
    paymentStatus: 'pending_interac',
    createdAt: now - 3 * 86400000,
    updatedAt: now,
  })
  const date = new Date().toISOString().slice(0, 10)
  let sent = 0
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    if (url.includes('/planning-alert-feed.json')) return Response.json({ version: 1, notices: [
      { id: 'new-source', title: 'Zoning change', description: '', municipality: 'Welland', publishedDate: date, sourceUrl: 'https://www.welland.ca/news/zoning', category: 'zoning-bylaw-amendment', status: null, tags: '' },
    ] })
    if (url.endsWith('/inboxes')) return Response.json({ inboxes: [{ inbox_id: 'test-inbox' }] })
    message = JSON.parse(options.body)
    sent++
    return Response.json({ id: 'sent' })
  })
  const context = { env: { STC_D1: db, AGENTMAIL_API_KEY: 'mock', ALERT_TOKEN_SECRET: 'test-secret', CRON_SECRET: 'cron' }, request: new Request('https://stcatharinesdigital.ca/cron/daily-digest', { method: 'POST', headers: { Authorization: 'Bearer cron' } }) }
  assert.deepEqual(await (await onRequest(context)).json(), { sent: 0, failed: 0, graceNotices: 0, total: 0 })
  assert.equal(sent, 0)
})

// A reader mid-grace keeps receiving the digest, so gating the product does not
// silently cut off people who were already subscribed when the gate shipped.
test('a subscriber inside the grace window still receives the digest', async t => {
  const { sqlite, db } = database()
  t.after(() => sqlite.close())
  const now = Date.now()
  insertAlert(sqlite, {
    id: 'grace',
    email: 'grace@example.com',
    paymentStatus: 'pending_interac',
    graceUntil: now + 10 * 86400000,
    createdAt: now - 3 * 86400000,
    updatedAt: now,
  })
  const date = new Date().toISOString().slice(0, 10)
  let sent = 0
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (url.includes('/planning-alert-feed.json')) return Response.json({ version: 1, notices: [
      { id: 'new-source', title: 'Zoning change', description: '', municipality: 'Welland', publishedDate: date, sourceUrl: 'https://www.welland.ca/news/zoning', category: 'zoning-bylaw-amendment', status: null, tags: '' },
    ] })
    if (url.endsWith('/inboxes')) return Response.json({ inboxes: [{ inbox_id: 'test-inbox' }] })
    sent++
    return Response.json({ id: 'sent' })
  })
  const context = { env: { STC_D1: db, AGENTMAIL_API_KEY: 'mock', ALERT_TOKEN_SECRET: 'test-secret', CRON_SECRET: 'cron' }, request: new Request('https://stcatharinesdigital.ca/cron/daily-digest', { method: 'POST', headers: { Authorization: 'Bearer cron' } }) }
  const body = await (await onRequest(context)).json()
  assert.equal(body.total, 1)
  // Grace closes in 10 days, inside the 7-day warning lead only at the boundary;
  // either way the digest itself must go out.
  assert.equal(sent, 1)
})
