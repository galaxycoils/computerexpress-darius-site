// Cloudflare Pages Function: Sponsorship inquiry → AgentMail
// POST /api/sponsor

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0'

export async function onRequestPost(context) {
  try {
    const body = await context.request.json()
    const { businessName, contactName, email, phone, sponsorshipType, message } = body

    if (!businessName || !contactName || !email) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Invalid email format' }, 400)
    }

    const typeLabels = {
      primary: 'Planning Alert sponsorship inquiry',
      category: 'Planning Tracker placement inquiry',
      notice: 'Other local sponsorship inquiry'
    }

    const typeLabel = typeLabels[sponsorshipType] || 'General inquiry'

    const inquiryText = `New sponsorship inquiry from St. Catharines Digital website.

Business: ${businessName}
Contact: ${contactName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Sponsorship Type: ${typeLabel}

Message:
${message || 'No message provided'}

---
Sent from St. Catharines Digital sponsorship form
${new Date().toISOString()}`

    // Send inquiry to our inbox
    const apiKey = context.env.AGENTMAIL_API_KEY
    if (apiKey) {
      try {
        const inbox = await getPrimaryInbox(apiKey)

        // 1. Send inquiry notification to us
        const notification = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: inbox.email,
            reply_to: email,
            subject: `Sponsorship Inquiry: ${businessName} (${typeLabel})`,
            text: inquiryText,
            labels: ['sponsorship-inquiry', 'website-form'],
          }),
        })
        if (!notification.ok) throw new Error('Inquiry notification failed')

        // Send an accurate copy of the request, with no implied invoice or timeline.
        try {
          const confirmation = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: 'Your St. Catharines Digital sponsorship inquiry',
            text: `Hello ${contactName},\n\nThank you for your interest in sponsoring St. Catharines Digital. We received your inquiry about ${typeLabel}. Placement, timing and pricing will be confirmed directly before an agreement. Reply to this email with any additional details.\n\n— St. Catharines Digital`,
            labels: ['sponsorship-auto'],
          }),
          })
          if (!confirmation.ok) console.error('Inquiry confirmation failed:', confirmation.status)
        } catch (confirmationError) {
          console.error('Inquiry confirmation failed:', confirmationError)
        }

        console.log('Sponsorship inquiry processed for:', businessName)
        return jsonResponse({ success: true, message: 'Your inquiry was sent.' })
      } catch (err) {
        console.error('AgentMail failed:', err)
        return jsonResponse({ error: 'Failed to send. Please email cccemt@pm.me' }, 502)
      }
    }

    // No API key configured
    return jsonResponse({ error: 'Service not configured. Please email cccemt@pm.me' }, 503)
  } catch (err) {
    console.error('Sponsor form error:', err)
    return jsonResponse({ error: 'Internal server error' }, 500)
  }
}

export async function onRequest() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

async function getPrimaryInbox(apiKey) {
  const listRes = await fetch(`${AGENTMAIL_BASE}/inboxes`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })
  if (!listRes.ok) throw new Error('Failed to list inboxes')
  const data = await listRes.json()
  if (data.inboxes && data.inboxes.length > 0) {
    const inbox = data.inboxes[0]
    return { inbox_id: inbox.inbox_id, email: inbox.email }
  }
  throw new Error('No inboxes found')
}
