// Cloudflare Pages Function: Contact form → AgentMail
// POST /api/contact

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';
const FORMSUBMIT_BASE = 'https://formsubmit.co/ajax';
const DEFAULT_CONTACT_EMAIL = 'hello@stcatharinesdigital.ca';

export async function onRequestPost(context) {
  try {
    const raw = await context.request.text();
    if (raw.length > 8192) return jsonResponse({ error: 'Request too large' }, 413);
    const body = JSON.parse(raw);
    const { name, email, message } = body;

    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' || !name || !email || !message) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Invalid email format' }, 400);
    }

    if (body.website) return jsonResponse({ success: true });

    const kind = ['event', 'correction', 'accessibility'].includes(body.kind) ? body.kind : 'contact';
    const sourceUrl = typeof body.sourceUrl === 'string' && /^https:\/\//.test(body.sourceUrl) ? body.sourceUrl.slice(0, 2048) : null;
    if (!context.env.STC_D1) return jsonResponse({ error: 'Submission service is temporarily unavailable.' }, 503);
    const now = Date.now();
    const id = crypto.randomUUID();
    await context.env.STC_D1.prepare(
      'INSERT INTO editorial_submissions (id,kind,name,email,message,source_url,status,created_at,updated_at) VALUES (?,?,?,?,?,?,' + "'pending'" + ',?,?)'
    ).bind(id, kind, name.trim().slice(0, 160), email.trim().toLowerCase(), message.trim().slice(0, 6000), sourceUrl, now, now).run();

    const textBody = `New message from St. Catharines Digital website.

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from St. Catharines Digital contact form
${new Date().toISOString()}`;

    const apiKey = context.env.AGENTMAIL_API_KEY;
    if (apiKey) {
      try {
        await sendWithAgentMail(apiKey, { name, email, textBody });
        console.log('Contact form sent via AgentMail from:', name);
        return jsonResponse({ success: true, received: true });
      } catch (err) {
        console.error('AgentMail failed, trying fallback provider:', err);
      }
    }

    const fallbackEmail = context.env.CONTACT_FORM_EMAIL || DEFAULT_CONTACT_EMAIL;
    try {
      await sendWithFormSubmit(fallbackEmail, { name, email, message, textBody });
      console.log('Contact form sent via fallback provider from:', name);
    } catch (fallbackError) {
      console.error('Contact notification failed after moderation queue write:', fallbackError);
    }
    return jsonResponse({ success: true, received: true, fallback: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return jsonResponse({
      error: `We could not send this automatically. Please email ${DEFAULT_CONTACT_EMAIL} or call (365) 359-5973.`,
    }, 502);
  }
}

export async function onRequest({ request }) {
  return new Response(null, { status: request.method === 'OPTIONS' ? 204 : 405, headers: { Allow: 'POST, OPTIONS' } });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function sendWithAgentMail(apiKey, { name, email, textBody }) {
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
      subject: `Contact: ${name}`,
      text: textBody,
      labels: ['editorial-contact', 'website-form'],
    }),
  });

  if (!sendRes.ok) {
    const errText = await sendRes.text();
    throw new Error(`AgentMail send failed: ${sendRes.status} ${errText}`);
  }
}

async function sendWithFormSubmit(recipientEmail, { name, email, message, textBody }) {
  const sendRes = await fetch(`${FORMSUBMIT_BASE}/${encodeURIComponent(recipientEmail)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: `Website contact: ${name}`,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: 'Thanks for contacting St. Catharines Digital. We received your message and will follow up within one business day.',
      diagnostics: textBody,
    }),
  });

  if (!sendRes.ok) {
    const errText = await sendRes.text();
    throw new Error(`FormSubmit fallback failed: ${sendRes.status} ${errText}`);
  }
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
