import { createAlertToken } from './_auth.js'

// Cloudflare Pages Function: POST /api/alerts
// Create a planning alert + send verification email

export async function onRequestPost(context) {
  const { env } = context;
  const { STC_D1 } = env;
  const apiKey = env.AGENTMAIL_API_KEY;
  const tokenSecret = env.ALERT_TOKEN_SECRET;

  if (!STC_D1 || !tokenSecret) {
    return jsonResponse({ error: 'Service not configured' }, 503);
  }

  try {
    const body = await context.request.json();
    const email = body.email;
    const frequency = body.frequency || 'daily';
    const wards = body.wards || [];
    const types = body.types || [];
    const statuses = body.statuses || [];
    const keywords = body.keywords || '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Valid email required' }, 400);
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    // Insert into D1
    const insertResult = await STC_D1.prepare(
      `INSERT INTO alerts (id, email, verified, frequency, wards, types, statuses, keywords, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      email.toLowerCase().trim(),
      frequency,
      JSON.stringify(wards),
      JSON.stringify(types),
      JSON.stringify(statuses),
      keywords,
      now,
      now
    ).run();

    if (!insertResult || !insertResult.success) {
      return jsonResponse({ error: 'Failed to create alert' }, 500);
    }

    // Send verification email
    if (apiKey) {
      try {
        const token = await createAlertToken(id, now, tokenSecret, 'verify');
        const verifyUrl = 'https://stcatharinesdigital.ca/api/alerts/verify?token=' + encodeURIComponent(token);
        
        const inboxRes = await fetch('https://api.agentmail.to/v0/inboxes', {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        
        if (!inboxRes.ok) {
          throw new Error(`AgentMail inboxes failed: ${inboxRes.status}`);
        }
        
        const inboxData = await inboxRes.json();
        if (!inboxData.inboxes || inboxData.inboxes.length === 0) {
          throw new Error('No inboxes found');
        }
        
        const inboxId = inboxData.inboxes[0].inbox_id;
        
        const sendRes = await fetch(`https://api.agentmail.to/v0/inboxes/${inboxId}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: 'Verify your planning alerts — St. Catharines Digital',
            text: `You're on the list. Click below to confirm your alert filters and start receiving planning notices.\n\nVERIFY: ${verifyUrl}\n\nThis link expires in 24 hours. After verification, your private preferences link will be displayed and emailed to you.\n\n— St. Catharines Digital`,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Inter,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;"><div style="max-width:640px;margin:0 auto;"><div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;"><h1 style="color:#0d3b66;">Confirm Your Planning Alerts</h1><p>You're on the list for St. Catharines Digital Planning Alerts.</p><div style="margin:2rem 0;text-align:center;"><a href="${verifyUrl}" style="display:inline-block;padding:.75rem 2rem;background:#0d3b66;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">Verify Email</a></div></div></div></body></html>`,
            labels: ['planning-alerts', 'verify', 'welcome'],
          }),
        });
        
        if (!sendRes.ok) {
          const errText = await sendRes.text();
          console.error('AgentMail send failed:', sendRes.status, errText);
        }
      } catch (mailErr) {
        console.error('Verification email error:', mailErr.message);
      }
    }

    return jsonResponse({
      success: true,
      alert_id: id,
      message: 'Alert created. Check your email to verify.'
    });
  } catch (err) {
    console.error('Alerts create error:', err.message, err.stack);
    return jsonResponse({ error: 'Internal server error: ' + err.message }, 500);
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
