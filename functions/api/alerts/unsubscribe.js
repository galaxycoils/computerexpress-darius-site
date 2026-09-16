import { verifyAlertToken } from './_auth.js'

export async function onRequestPost(context) {
  const { STC_D1, ALERT_TOKEN_SECRET } = context.env
  if (!STC_D1 || !ALERT_TOKEN_SECRET) return jsonResponse({ error: 'Service not configured' }, 503)
  const token = context.request.headers.get('X-Alert-Token')
  const auth = await verifyAlertToken(token, ALERT_TOKEN_SECRET)
  if (!auth) return jsonResponse({ error: 'Unauthorized' }, 401)
  const result = await STC_D1.prepare(
    'DELETE FROM alerts WHERE id = ? AND created_at = ?',
  ).bind(auth.id, auth.createdAt).run()
  if (!result?.success) return jsonResponse({ error: 'Unable to unsubscribe' }, 502)
  return jsonResponse({ success: true, message: 'Unsubscribed. You will not receive further alerts.' })
}

export async function onRequestGet() {
  return jsonResponse({ error: 'Use your authenticated alert-management session to unsubscribe.' }, 405)
}
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders() } })
}
function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-Alert-Token' }
}
