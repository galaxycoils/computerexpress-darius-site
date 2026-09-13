// Cloudflare Pages Function: GET /api/alerts/verify?token=...
// Verify email and activate alert

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequestGet(context) {
  const { env } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;

  if (!STC_D1) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  const url = new URL(context.request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return jsonResponse({ error: 'Missing verification token' }, 400);
  }

  try {
    // Use atob for base64url decoding (Cloudflare Workers doesn't have Buffer)
    let decoded;
    try {
      // Convert base64url to base64
      const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      decoded = atob(padded);
    } catch (e) {
      console.error('[verify] Failed to decode token:', e);
      return jsonResponse({ error: 'Invalid token format' }, 400);
    }
    const [id, createdStr] = decoded.split(':');
    const created = parseInt(createdStr, 10);
    const now = Date.now();
    const expiry = 24 * 60 * 60 * 1000;

    if (now - created > expiry) {
      return jsonResponse({ error: 'Verification link expired. Please sign up again.' }, 410);
    }

    const updateResult = await STC_D1.prepare(
      'UPDATE alerts SET verified = 1, updated_at = ? WHERE id = ? AND verified = 0 AND created_at = ?'
    ).bind(now, id, created).run();

    if (updateResult.changes === 0) {
      return jsonResponse({ error: 'Invalid or already verified link' }, 404);
    }

    // Fetch the updated alert to get email for confirmation
    const selectResult = await STC_D1.prepare(
      'SELECT id, email FROM alerts WHERE id = ? AND created_at = ?'
    ).bind(id, created).first();

    if (!selectResult || !selectResult.email) {
      return jsonResponse({ error: 'Alert not found after update' }, 500);
    }

    const result = selectResult;

    // Send confirmation email
    if (apiKey) {
      try {
        const inbox = await getPrimaryInbox(apiKey);
        await sendEmail(apiKey, inbox.inbox_id, {
          to: result.email,
          subject: 'Your planning alerts are active — St. Catharines Digital',
          text: `Your planning alerts are now active.\n\nYou'll receive a weekly digest of planning notices matching your filters.\n\nManage or pause your alerts anytime:\nhttps://stcatharinesdigital.ca/alerts\n\nUnsubscribe: reply to any alert email with "unsubscribe".\n\n— St. Catharines Digital`,
          html: buildConfirmedHtml(),
          labels: ['planning-alerts', 'verified', 'welcome'],
        });
      } catch (mailErr) {
        console.error('Confirmation email failed:', mailErr);
      }
    }

    return jsonResponse({ success: true, message: 'Email verified. Your alerts are active.' });
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

function buildConfirmedHtml() {
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
    <p style="font-size:.85rem;color:#666;">Manage your alerts: <a href="https://stcatharinesdigital.ca/alerts" style="color:#12d6ff;">stcatharinesdigital.ca/alerts</a></p>
    <p style="font-size:.8rem;color:#999;margin-top:2rem;">Unsubscribe: reply to any alert email with "unsubscribe".</p>
  </div>
</div></body></html>`;
}