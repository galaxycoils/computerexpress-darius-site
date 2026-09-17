import { completeDelivery, createDelivery, failDelivery, recipientFingerprint } from '../lib/emailDelivery.js'

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0'

export async function onRequest(context) {
  const { STC_D1, AGENTMAIL_API_KEY, CRON_SECRET } = context.env
  if (!STC_D1 || !AGENTMAIL_API_KEY || !CRON_SECRET) return new Response('Service not configured', { status: 503 })
  if (context.request.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) return new Response('Unauthorized', { status: 401 })

  // SQLite/D1 does not provide sha256() consistently, so reconciliation is bounded
  // and compares the fingerprint in JavaScript rather than exposing raw email in logs.
  const failed = await STC_D1.prepare("SELECT email FROM newsletter_subscribers WHERE status = 'failed' LIMIT 25").all()
  const inbox = await getPrimaryInbox(AGENTMAIL_API_KEY)
  let sent = 0
  let failedCount = 0
  for (const subscriber of failed.results || []) {
    const recipientRef = await recipientFingerprint(subscriber.email)
    const last = await STC_D1.prepare(
      "SELECT next_retry_at FROM email_delivery_log WHERE recipient_ref = ? AND status = 'failed' ORDER BY created_at DESC LIMIT 1"
    ).bind(recipientRef).first()
    if (!last || last.next_retry_at > Date.now()) continue
    const attempts = await STC_D1.prepare(
      "SELECT COUNT(*) AS count FROM email_delivery_log WHERE recipient_ref = ? AND template IN ('welcome', 'welcome-retry')"
    ).bind(recipientRef).first()
    if (Number(attempts?.count || 0) >= 3) continue
    const deliveryId = await createDelivery(STC_D1, { channel: 'newsletter', recipientRef, template: 'welcome-retry' })
    const response = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
      method: 'POST', headers: { Authorization: `Bearer ${AGENTMAIL_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: subscriber.email, subject: 'Welcome to St. Catharines Digital', text: 'Welcome to St. Catharines Digital. You are on the list for local newsroom updates. Visit: https://stcatharinesdigital.ca', labels: ['newsletter', 'welcome', 'retry'] }),
    })
    if (response.ok) {
      await completeDelivery(STC_D1, deliveryId, response.status)
      await STC_D1.prepare("UPDATE newsletter_subscribers SET status = 'active', confirmed_at = ?, updated_at = ?, last_error = NULL WHERE email = ?").bind(Date.now(), Date.now(), subscriber.email).run()
      sent += 1
    } else {
      await failDelivery(STC_D1, deliveryId, response.status, 'provider_rejected', Date.now() + 6 * 60 * 60 * 1000)
      failedCount += 1
    }
  }
  return Response.json({ sent, failed: failedCount })
}

async function getPrimaryInbox(apiKey) {
  const response = await fetch(`${AGENTMAIL_BASE}/inboxes`, { headers: { Authorization: `Bearer ${apiKey}` } })
  if (!response.ok) throw new Error('Failed to list inboxes')
  const data = await response.json()
  if (!data.inboxes?.length) throw new Error('No inboxes found')
  return data.inboxes[0]
}
