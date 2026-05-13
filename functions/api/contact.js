// Cloudflare Pages Function: Contact form → AgentMail
// POST /api/contact

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequestPost(context) {
  const apiKey = context.env.AGENTMAIL_API_KEY;
  if (!apiKey) {
    console.error('AGENTMAIL_API_KEY not set');
    return jsonResponse({ error: 'Service temporarily unavailable' }, 503);
  }

  try {
    const body = await context.request.json();
    const { businessName, email, website, serviceInterest, goals } = body;

    if (!businessName || !email || !goals) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Invalid email format' }, 400);
    }

    const serviceLabels = {
      website: 'Website design / redesign',
      seo: 'Technical SEO',
      local: 'Local SEO / GBP optimization',
      full: 'Full package (Website + SEO + Local)',
      other: 'Something else',
    };

    const textBody = `New audit request from ComputerExpress website.

Business: ${businessName}
Email: ${email}
Website: ${website || 'Not provided'}
Service needed: ${serviceLabels[serviceInterest] || 'Not specified'}

Goals:
${goals}

---
Sent from ComputerExpress contact form
${new Date().toISOString()}`;

    const inbox = await getPrimaryInbox(apiKey);

    const sendRes = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: inbox.email,
        reply_to: email,
        subject: `Audit Request: ${businessName}`,
        text: textBody,
        labels: ['audit-request', 'website-form'],
      }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      console.error('AgentMail send failed:', sendRes.status, errText);
      return jsonResponse({ error: 'Failed to send. Please try again later.' }, 502);
    }

    const result = await sendRes.json();
    console.log('Audit request sent:', result.message_id, 'for:', businessName);
    return jsonResponse({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
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
