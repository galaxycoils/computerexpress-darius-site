// Cloudflare Pages Function: /api/alerts/payment (admin-only, Bearer ADMIN_SECRET)
//   GET  ?reference=PA-XXXXXXXX  -> look up the signup an e-Transfer reference belongs to
//   POST { alert_id } or { reference, note } -> confirm the Interac e-Transfer and activate
import { alertIdPrefixForReference, normalizePaymentReference, paymentReferenceForAlertId } from '../../../src/data/paymentReference.js'

function isAuthorized(context) {
  const adminSecret = context.env.ADMIN_SECRET
  const authHeader = context.request.headers.get('Authorization')
  return Boolean(adminSecret) && authHeader === `Bearer ${adminSecret}`
}

// Resolve a reference code to exactly one alert. Returns { alert } or { error, status }.
export async function findAlertByReference(db, reference) {
  const prefix = alertIdPrefixForReference(reference)
  if (!prefix) return { error: 'Reference must look like PA-XXXXXXXX', status: 400 }
  const { results = [] } = await db.prepare(
    `SELECT id, email, verified, payment_status, payment_confirmed_at, created_at FROM alerts WHERE lower(replace(id, '-', '')) LIKE ? LIMIT 2`
  ).bind(`${prefix}%`).all()
  if (results.length === 0) return { error: 'No signup matches that reference', status: 404 }
  if (results.length > 1) return { error: 'Reference matches more than one signup; confirm by alert_id instead', status: 409 }
  return { alert: results[0] }
}

export async function onRequestGet(context) {
  const { STC_D1 } = context.env
  if (!STC_D1) return jsonResponse({ error: 'Service not configured' }, 503)
  if (!isAuthorized(context)) return jsonResponse({ error: 'Unauthorized' }, 401)
  const reference = new URL(context.request.url).searchParams.get('reference')
  const found = await findAlertByReference(STC_D1, reference)
  if (found.error) return jsonResponse({ error: found.error }, found.status)
  return jsonResponse({ reference: normalizePaymentReference(reference), alert: found.alert })
}

export async function onRequestPost(context) {
  const { env } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;

  if (!STC_D1) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  if (!isAuthorized(context)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await context.request.json();
    const { note, reference } = body;
    let alert_id = body.alert_id;

    if (!alert_id && reference) {
      const found = await findAlertByReference(STC_D1, reference);
      if (found.error) return jsonResponse({ error: found.error }, found.status);
      alert_id = found.alert.id;
    }

    if (!alert_id) {
      return jsonResponse({ error: 'alert_id or reference required' }, 400);
    }

    const existing = await STC_D1.prepare('SELECT id FROM alerts WHERE id = ?').bind(alert_id).first();
    if (!existing) {
      return jsonResponse({ error: 'Alert not found' }, 404);
    }

    const now = Date.now();
    await STC_D1.prepare(
      `UPDATE alerts SET payment_status = 'confirmed', payment_confirmed_at = ?, updated_at = ?, payment_note = ? WHERE id = ?`
    ).bind(now, now, note || 'Interac e-Transfer received', alert_id).run();

    // Fetch alert to notify user
    const result = await STC_D1.prepare(
      'SELECT id, email, frequency, wards, types, statuses, keywords FROM alerts WHERE id = ?'
    ).bind(alert_id).first();

    if (!result) {
      return jsonResponse({ error: 'Alert not found' }, 404);
    }

    // Send payment received confirmation
    if (apiKey) {
      try {
        const inbox = await getPrimaryInbox(apiKey);
        await sendEmail(apiKey, inbox.inbox_id, {
          to: result.email,
          subject: 'Payment received — Planning alerts activated 🎉',
          text: `Thanks! We received your $49 payment via Interac e-Transfer.\n\nYour Planning Alerts are now fully active.\n\nManage your alerts: https://stcatharinesdigital.ca/alerts\n\n— St. Catharines Digital`,
          html: buildPaymentConfirmedHtml(),
          labels: ['planning-alerts', 'payment-received'],
        });
      } catch (mailErr) {
        console.error('Payment confirmation email failed:', mailErr);
      }
    }

    return jsonResponse({ success: true, alert_id, reference: paymentReferenceForAlertId(alert_id), message: 'Payment confirmed' });
  } catch (err) {
    console.error('Payment confirm error:', err);
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

async function getPrimaryInbox(apiKey) {
  const res = await fetch('https://api.agentmail.to/v0/inboxes', {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error('Failed to list inboxes');
  const data = await res.json();
  if (!data.inboxes || data.inboxes.length === 0) throw new Error('No inboxes found');
  return { inbox_id: data.inboxes[0].inbox_id, email: data.inboxes[0].email };
}

async function sendEmail(apiKey, inboxId, { to, subject, text, html, labels = [] }) {
  const res = await fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`, {
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

function buildPaymentConfirmedHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="width:48px;height:48px;background:#e6f4ea;border-radius:50%;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;">
        <span style="color:#34a853;font-size:1.5rem;">✓</span>
      </div>
      <h1 style="color:#0d3b66;margin:0;">Payment Received</h1>
      <p style="color:#34a853;font-weight:600;margin:.5rem 0 0;">$49.00 CAD</p>
    </div>
    <p>Thanks! We received your Interac e-Transfer.</p>
    <p>Your Planning Alerts are now <strong>fully active</strong>. Your first digest arrives next Thursday at 6 AM.</p>
    <div style="margin:2rem 0;padding:1rem;background:#f0f7ff;border-radius:8px;text-align:center;">
      <a href="https://stcatharinesdigital.ca/alerts" style="display:inline-block;padding:.75rem 2rem;background:#0d3b66;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Manage Alerts →</a>
    </div>
    <p style="font-size:.85rem;color:#666;">Send each month's $49 to cccemt@pm.me via Interac e-Transfer. Reply to any alert email to pause or cancel.</p>
  </div>
</div></body></html>`;
}
