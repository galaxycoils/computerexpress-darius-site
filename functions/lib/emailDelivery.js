export async function recipientFingerprint(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(value).trim().toLowerCase()))
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function createDelivery(d1, { channel, recipientRef, template, nextRetryAt = null }) {
  const id = crypto.randomUUID()
  const now = Date.now()
  await d1.prepare(
    `INSERT INTO email_delivery_log (id, channel, recipient_ref, template, status, attempt_count, created_at, updated_at, next_retry_at)
     VALUES (?, ?, ?, ?, 'pending', 1, ?, ?, ?)`
  ).bind(id, channel, recipientRef, template, now, now, nextRetryAt).run()
  return id
}

export async function completeDelivery(d1, id, providerStatus) {
  await d1.prepare(
    `UPDATE email_delivery_log SET status = 'sent', provider_status = ?, error_code = NULL, next_retry_at = NULL, updated_at = ? WHERE id = ?`
  ).bind(providerStatus, Date.now(), id).run()
}

export async function failDelivery(d1, id, providerStatus, errorCode, retryAt) {
  await d1.prepare(
    `UPDATE email_delivery_log SET status = 'failed', provider_status = ?, error_code = ?, next_retry_at = ?, updated_at = ? WHERE id = ?`
  ).bind(providerStatus || null, String(errorCode || 'provider_rejected').slice(0, 120), retryAt, Date.now(), id).run()
}
