// Cloudflare Pages Function: POST /api/alerts
// Create a planning alert + send verification email

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequestPost(context) {
  const { env } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;

  if (!STC_D1) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  try {
    const body = await context.request.json();
    const { email, frequency, wards, types, statuses, keywords } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Valid email required' }, 400);
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    await STC_D1.prepare(
      `INSERT INTO alerts (id, email, verified, frequency, wards, types, statuses, keywords, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      email.toLowerCase().trim(),
      frequency || 'daily',
      JSON.stringify(wards || []),
      JSON.stringify(types || []),
      JSON.stringify(statuses || []),
      keywords || '',
      now,
      now
    ).run();

    // Send verification email
    const verifyToken = Buffer.from(`${id}:${now}`).toString('base64url');

    if (apiKey) {
      try {
        const inbox = await getPrimaryInbox(apiKey);
        await sendEmail(apiKey, inbox.inbox_id, {
          to: email,
          subject: 'Verify your planning alerts — St. Catharines Digital',
          text: `You're on the list. Click below to confirm your alert filters and start receiving planning notices.\n\nVERIFY: https://stcatharinesdigital.ca/api/alerts/verify?token=${verifyToken}\n\nThis link expires in 24 hours.\n\nManage your alerts: https://stcatharinesdigital.ca/alerts\n\n— St. Catharines Digital`,
          html: buildVerifyHtml(verifyToken),
          labels: ['planning-alerts', 'verify', 'welcome'],
        });
      } catch (mailErr) {
        console.error('Verification email failed:', mailErr);
      }
    }

    return jsonResponse({
      success: true,
      alert_id: id,
      token: `${id}:${now}`,
      message: 'Alert created. Check your email to verify.'
    });
  } catch (err) {
    console.error('Alerts create error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

async function getPrimaryInbox(apiKey) {
  const res = await fetch(`${AGENTMAIL_BASE}/inboxes`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Failed to list inboxes');
  const data = await res.json();
  if (!data.inboxes || data.inboxes.length === 0) throw new Error('No inboxes found');
  return { inbox_id: data.inboxes[0].inbox_id, email: data.inboxes[0].email };
}

async function sendEmail(apiKey, inboxId, { to, subject, text, html, labels = [] }) {
  const res = await fetch(`${AGENTMAIL_BASE}/inboxes/${inboxId}/messages/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, text, html, labels }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AgentMail send failed: ${res.status} — ${errText}`);
  }
}

function buildVerifyHtml(token) {
  const verifyUrl = `https://stcatharinesdigital.ca/api/alerts/verify?token=${token}`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <h1 style="color:#0d3b66;margin-bottom:1rem;">Confirm Your Planning Alerts</h1>
    <p>You're on the list for St. Catharines Digital Planning Alerts. Click below to confirm your email and activate your filters.</p>
    <div style="margin:2rem 0;padding:1rem;background:#e8f4fd;border-radius:8px;text-align:center;">
      <a href="${verifyUrl}" style="display:inline-block;padding:.75rem 2rem;background:#0d3b66;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Verify Email →</a>
    </div>
    <p style="font-size:.85rem;color:#666;">Or paste this link in your browser:<br>
    <a href="${verifyUrl}" style="color:#12d6ff;">${verifyUrl}</a></p>
    <p style="font-size:.8rem;color:#999;margin-top:2rem;">This link expires in 24 hours. Manage your alerts: <a href="https://stcatharinesdigital.ca/alerts" style="color:#12d6ff;">stcatharinesdigital.ca/alerts</a></p>
  </div>
</div></body></html>`;
}