// Cloudflare Pages Function: GET/POST/DELETE /api/alerts/manage
// Manage user's alert (auth via X-Alert-Token header = alert_id:created_at base64url)

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequest(context) {
  const { env, request } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;

  if (!STC_D1) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  const auth = authenticate(request);
  if (!auth) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  try {
    if (request.method === 'GET') {
      const rows = await STC_D1.prepare(
        'SELECT id, email, verified, frequency, wards, types, statuses, keywords, created_at, last_sent_at FROM alerts WHERE id = ?'
      ).bind(auth.id).all();

      if (!rows || rows.length === 0) {
        return jsonResponse({ alert: null });
      }

      const row = rows[0];
      return jsonResponse({
        alert: {
          id: row.id,
          email: row.email,
          verified: Boolean(row.verified),
          frequency: row.frequency,
          wards: JSON.parse(row.wards || '[]'),
          types: JSON.parse(row.types || '[]'),
          statuses: JSON.parse(row.statuses || '[]'),
          keywords: row.keywords || '',
          created_at: row.created_at,
          last_sent_at: row.last_sent_at,
        }
      });
    } else if (request.method === 'POST') {
      const body = await request.json();
      const { frequency, wards, types, statuses, keywords } = body;
      const now = Date.now();

      await STC_D1.prepare(
        `UPDATE alerts SET frequency = ?, wards = ?, types = ?, statuses = ?, keywords = ?, updated_at = ?, last_sent_at = NULL
         WHERE id = ?`
      ).bind(
        frequency || 'daily',
        JSON.stringify(wards || []),
        JSON.stringify(types || []),
        JSON.stringify(statuses || []),
        keywords || '',
        now,
        auth.id
      ).run();

      // Send update confirmation email
      if (apiKey) {
        try {
          const inbox = await getPrimaryInbox(apiKey);
          const fetchResult = await STC_D1.prepare(
            'SELECT email FROM alerts WHERE id = ?'
          ).bind(auth.id).first();

          if (fetchResult) {
            await sendEmail(apiKey, inbox.inbox_id, {
              to: fetchResult.email,
              subject: 'Your planning alerts were updated — St. Catharines Digital',
              text: `Your planning alert filters were updated.\n\nNext digest: ${frequency === 'daily' ? 'Every Thursday, 6 AM' : 'Each time a matching notice is published'}\n\nManage your alerts: https://stcatharinesdigital.ca/alerts\n\n— St. Catharines Digital`,
              html: buildUpdateHtml(frequency),
              labels: ['planning-alerts', 'updated'],
            });
          }
        } catch (mailErr) {
          console.error('Update confirmation email failed:', mailErr);
        }
      }

      return jsonResponse({ success: true, message: 'Alert filters updated.' });
    } else if (request.method === 'DELETE') {
      const row = await STC_D1.prepare('SELECT email FROM alerts WHERE id = ?').bind(auth.id).first();

      await STC_D1.prepare('DELETE FROM alerts WHERE id = ?').bind(auth.id).run();

      if (apiKey && row) {
        try {
          const inbox = await getPrimaryInbox(apiKey);
          await sendEmail(apiKey, inbox.inbox_id, {
            to: row.email,
            subject: 'Your planning alerts were paused — St. Catharines Digital',
            text: `Your planning alerts have been paused.\n\nYou will no longer receive digests.\n\nTo re-activate, create a new alert at:\nhttps://stcatharinesdigital.ca/planning-alerts\n\n— St. Catharines Digital`,
            html: buildPausedHtml(),
            labels: ['planning-alerts', 'paused'],
          });
        } catch (mailErr) {
          console.error('Goodbye email failed:', mailErr);
        }
      }

      return jsonResponse({ success: true, message: 'Alert deleted.' });
    }
  } catch (err) {
    console.error('Manage error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }

  return new Response('Not Found', { status: 404 });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function authenticate(request) {
  const header = request.headers.get('X-Alert-Token');
  if (!header) return null;

  try {
    const decoded = Buffer.from(header, 'base64url').toString('utf-8');
    const [id, created] = decoded.split(':');
    return { id, created: parseInt(created, 10) };
  } catch {
    return null;
  }
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
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Alert-Token',
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

function buildUpdateHtml(frequency) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
      <div style="width:40px;height:40px;border-radius:50%;background:#0d3b66;display:flex;align-items:center;justify-content:center;color:#fff;">✓</div>
      <h1 style="color:#0d3b66;margin:0;">Alerts updated</h1>
    </div>
    <p>Your planning alert filters were updated successfully.</p>
    <p style="margin:1rem 0;"><strong>Next digest:</strong> ${frequency === 'daily' ? 'Every Thursday, 6 AM' : 'Each matching notice triggers an immediate email'}</p>
    <p style="font-size:.85rem;color:#666;">Manage your alerts: <a href="https://stcatharinesdigital.ca/alerts" style="color:#12d6ff;">stcatharinesdigital.ca/alerts</a></p>
  </div>
</div></body></html>`;
}

function buildPausedHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem;">
      <div style="width:40px;height:40px;border-radius:50%;background:#e2e8f0;display:flex;align-items:center;justify-content:center;color:#666;">✕</div>
      <h1 style="color:#0d3b66;margin:0;">Alerts paused</h1>
    </div>
    <p>Your planning alerts have been paused. You will no longer receive digests.</p>
    <p style="margin:1rem 0;">To re-activate, create a new alert at:<br>
    <a href="https://stcatharinesdigital.ca/planning-alerts" style="color:#12d6ff;">stcatharinesdigital.ca/planning-alerts</a></p>
    <p style="font-size:.8rem;color:#999;margin-top:2rem;">— St. Catharines Digital</p>
  </div>
</div></body></html>`;
}