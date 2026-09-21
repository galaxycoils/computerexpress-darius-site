export async function onRequest(context) {
  const { STC_D1, CRON_SECRET } = context.env
  if (!STC_D1 || !CRON_SECRET) return new Response('Service not configured', { status: 503 })
  if (context.request.headers.get('Authorization') !== `Bearer ${CRON_SECRET}`) return new Response('Unauthorized', { status: 401 })
  const [failed, pending] = await STC_D1.batch([
    STC_D1.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'failed'"),
    STC_D1.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'pending'"),
  ])
  return Response.json({
    failedConfirmations: Number(failed.results?.[0]?.count || 0),
    pendingConfirmations: Number(pending.results?.[0]?.count || 0),
    action: 'Readers must submit the signup form again to receive a new confirmation link.',
  })
}
