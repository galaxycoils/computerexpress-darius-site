import { createAlertToken, verifyAlertToken } from './_auth.js'

// Cloudflare Pages Function: GET /api/alerts/verify?token=...
// Verify email and activate alert

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequestGet(context) {
  const { env } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;
  const tokenSecret = env.ALERT_TOKEN_SECRET;

  if (!STC_D1 || !tokenSecret) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return jsonResponse({ error: 'Missing verification token' }, 400);
  }

  try {
    const now = Date.now()
    const auth = await verifyAlertToken(token, tokenSecret)
    if (!auth) return jsonResponse({ error: 'Invalid or expired verification link' }, 410)

    const updateResult = await STC_D1.prepare(
      'UPDATE alerts SET verified = 1, updated_at = ? WHERE id = ? AND verified = 0 AND created_at = ?'
    ).bind(now, auth.id, auth.createdAt).run();

    // Fetch the alert after the idempotent update. A valid link can be reopened
    // during its verification lifetime without locking the reader out.
    const selectResult = await STC_D1.prepare(
      'SELECT id, email, verified FROM alerts WHERE id = ? AND created_at = ?'
    ).bind(auth.id, auth.createdAt).first();

    if (!selectResult || !selectResult.email || !selectResult.verified) {
      return jsonResponse({ error: 'Alert not found' }, 404);
    }

    const result = selectResult;
    const manageToken = await createAlertToken(auth.id, auth.createdAt, tokenSecret, 'manage')
    const manageUrl = `https://stcatharinesdigital.ca/preferences?verified=1&token=${encodeURIComponent(manageToken)}`

    // Send confirmation email
    if (apiKey && updateResult.changes > 0) {
      try {
        const inbox = await getPrimaryInbox(apiKey);
        await sendEmail(apiKey, inbox.inbox_id, {
          to: result.email,
          subject: 'Your planning alerts are active — St. Catharines Digital',
          text: `Your planning alerts are now active.\n\nYou'll receive a weekly digest of planning notices matching your filters.\n\nManage or stop your alerts:\n${manageUrl}\n\n— St. Catharines Digital`,
          html: buildConfirmedHtml(manageUrl),
          labels: ['planning-alerts', 'verified', 'welcome'],
        });
      } catch (mailErr) {
        console.error('Confirmation email failed:', mailErr);
      }
    }

    return Response.redirect(manageUrl, 303);
  } catch (err) {
    console.error('Alerts verify error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
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

function buildConfirmedHtml(manageUrl) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
      <div style="width:40px;height:40px;border-radius:50%;background:#0d3b66;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">✓</div>
      <h1 style="color:#0d3b66;margin:0;">Alerts are active</h1>
    </div>
    <p>Your planning alerts are now live. You'll receive a weekly digest of notices matching your filters.</p>
    <div style="background:#0d1b30;border-radius:8px;padding:1rem;margin:1.5rem 0;text-align:center;">
      <p style="color:#0d3b66;font-weight:700;margin:0;">Next digest: Every Thursday, 6 AM</p>
      <p style="color:#8899b8;font-size:.85rem;margin:4px 0 0;">You can pause, edit, or delete your filters anytime.</p>
    </div>
    <p style="font-size:.85rem;color:#666;"><a href="${manageUrl}" style="color:#0d3b66;">Manage or stop your planning alerts</a></p>
  </div>
</div></body></html>`;
}
