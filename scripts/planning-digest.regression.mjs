import test from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync } from 'node:fs'
import { onRequest } from '../functions/cron/daily-digest.js'

function database() {
  const sqlite = new DatabaseSync(':memory:')
  for (const file of ['0001_create_alerts.sql', '0006_create_email_delivery_log.sql', '0010_alert_sent_items.sql']) {
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

test('weekly digest reads the published feed and sends each source only once', async t => {
  const { sqlite, db } = database()
  t.after(() => sqlite.close())
  const now = Date.now()
  sqlite.prepare("INSERT INTO alerts (id,email,verified,frequency,wards,types,statuses,keywords,created_at,updated_at) VALUES ('a1','reader@example.com',1,'daily','[]','[]','[]','',?,?)").run(now - 3 * 86400000, now)
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
  assert.deepEqual(await (await onRequest(context)).json(), { sent: 1, failed: 0, total: 1 })
  assert.equal(sent, 1)
  assert.match(message.html, /Zoning &lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.equal(sqlite.prepare('SELECT source_id FROM alert_sent_items').get().source_id, 'new-source')
  assert.deepEqual(await (await onRequest(context)).json(), { sent: 0, failed: 0, total: 1 })
  assert.equal(sent, 1)
})
