// Cloudflare Pages Function: Newsletter signup → AgentMail
// POST /api/newsletter

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequestPost(context) {
  const apiKey = context.env.AGENTMAIL_API_KEY;
  const { STC_D1 } = context.env;
  if (!apiKey || !STC_D1) {
    console.error('AGENTMAIL_API_KEY not set');
    return jsonResponse({ error: 'Service temporarily unavailable' }, 503);
  }

  try {
    let email = null;
    const contentType = context.request.headers.get('content-type') || '';
    let body = await context.request.text();
    let json = {};
    if (contentType.includes('application/json')) {
      try {
        json = JSON.parse(body);
        email = json.email;
      } catch {
        // invalid json
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(body);
      email = params.get('email') || null;
    } else {
      try {
        json = JSON.parse(body);
        email = json.email;
      } catch {
        const params = new URLSearchParams(body);
        email = params.get('email') || null;
      }
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Invalid email' }, 400);
    }

    const inbox = await getPrimaryInbox(apiKey);

    const ALLOWED_PLACEMENTS = new Set(['site_rail', 'guide_inline', 'planning_tracker', 'home']);
    const placement = ALLOWED_PLACEMENTS.has(json?.placement) ? json.placement : 'site_rail';

    const ALLOWED_TOPICS = new Set(['council', 'planning', 'police']);
    const topics = Array.isArray(json?.topics)
      ? [...new Set(json.topics.filter((t) => ALLOWED_TOPICS.has(String(t).toLowerCase())))]
      : [];
    const topicLabels = topics.map((t) => `topic:${String(t).toLowerCase()}`);

    const now = Date.now()
    const normalizedEmail = email.toLowerCase().trim()
    await STC_D1.prepare(
      `INSERT INTO newsletter_subscribers (email, topics, placement, status, created_at, updated_at)
       VALUES (?, ?, ?, 'pending', ?, ?)
       ON CONFLICT(email) DO UPDATE SET topics = excluded.topics, placement = excluded.placement, updated_at = excluded.updated_at`
    ).bind(normalizedEmail, JSON.stringify(topics), placement, now, now).run()

    const sendRes = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: normalizedEmail,
        subject: 'Welcome to St. Catharines Digital — your planning alerts digest',
        text: `Welcome to St. Catharines Digital!\n\nYou're on the list. Expect new planning notices, upcoming hearings, and what changed across St. Catharines, Welland and Thorold.\n\nNo spam. Unsubscribe anytime by replying.\n\nVisit: https://stcatharinesdigital.ca`,
        html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
    <body style="font-family:Inter,-apple-system,sans-serif;color:#e8f0fe;background:#060d1b;padding:2rem;">
    <div style="max-width:600px;margin:0 auto;text-align:center;">
    <h1 style="color:#12d6ff;">Welcome to St. Catharines Digital</h1>
    <p style="color:#9ab4d2;font-size:1.1rem;">You're on the list. Expect new planning notices, upcoming hearings, and what changed across St. Catharines, Welland and Thorold.</p>
    <div style="margin:2rem 0;padding:1.5rem;background:#0d1b30;border-radius:12px;border:1px solid rgba(125,249,255,.1);">
    <p style="margin:0;color:#8899b8;font-size:.9rem;">No spam. Unsubscribe anytime by replying.</p>
    </div>
    <a href="https://stcatharinesdigital.ca" style="display:inline-block;padding:.75rem 2rem;background:#12d6ff;color:#060d1b;text-decoration:none;border-radius:8px;font-weight:700;">Visit St. Catharines Digital</a>
    </div></body></html>`,
        labels: ['newsletter', 'welcome', `placement:${placement}`, ...topicLabels],
      }),
    });

    if (!sendRes.ok) {
      await STC_D1.prepare('UPDATE newsletter_subscribers SET status = \'failed\', last_error = ?, updated_at = ? WHERE email = ?').bind('provider_rejected', Date.now(), normalizedEmail).run()
      const errText = await sendRes.text();
      console.error('Newsletter send failed:', sendRes.status, errText);
      return jsonResponse({ error: 'Failed. Try again later.' }, 502);
    }

    await STC_D1.prepare('UPDATE newsletter_subscribers SET status = \'active\', confirmed_at = ?, updated_at = ?, last_error = NULL WHERE email = ?').bind(Date.now(), Date.now(), normalizedEmail).run()
    console.log('Newsletter welcome sent to:', normalizedEmail);
    return jsonResponse({ success: true, message: "You're on the list. Check your inbox for a welcome email." });
  } catch (err) {
    console.error('Newsletter error:', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

export async function onRequest() {
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

async function getPrimaryInbox(apiKey) {
  const listRes = await fetch(`${AGENTMAIL_BASE}/inboxes`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });
  if (!listRes.ok) throw new Error('Failed to list inboxes');
  const data = await listRes.json();
  if (data.inboxes && data.inboxes.length > 0) {
    const inbox = data.inboxes[0];
    return { inbox_id: inbox.inbox_id, email: inbox.email };
  }
  throw new Error('No inboxes found');
}