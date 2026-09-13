// Cloudflare Pages Function: POST /api/alerts/unsubscribe
// One-click unsubscribe by email

export async function onRequestPost(context) {
  const { env } = context;
  const { STC_D1 } = env;

  if (!STC_D1) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  const url = new URL(context.request.url);
  const email = url.searchParams.get('email');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: 'Valid email required' }, 400);
  }

  await STC_D1.prepare('DELETE FROM alerts WHERE email = ?').bind(email.toLowerCase().trim()).run();

  return jsonResponse({ success: true, message: 'Unsubscribed. You will not receive further alerts.' });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}