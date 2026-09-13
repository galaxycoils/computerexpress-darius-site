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
      primary: 'Primary Sponsor — $300/mo',
      category: 'Category Sponsor — $150/mo',
      notice: 'Notice Sponsor — $50/notice'
    }

    const typeLabel = typeLabels[sponsorshipType] || sponsorshipType

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
        await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
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

        // 2. Send confirmation + sample digest to the inquirer
        const sampleDigest = getSampleDigest(businessName, typeLabel)
        await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: `Your Planning Alert sponsorship details + sample digest`,
            text: sampleDigest.text,
            html: sampleDigest.html,
            labels: ['sponsorship-auto', 'sample-digest'],
          }),
        })

        console.log('Sponsorship inquiry processed for:', businessName)
        return jsonResponse({ success: true, message: 'Check your email for the sample digest and next steps.' })
      } catch (err) {
        console.error('AgentMail failed:', err)
        return jsonResponse({ error: 'Failed to send. Please email hello@stcatharinesdigital.ca' }, 502)
      }
    }

    // No API key configured
    return jsonResponse({ error: 'Service not configured. Please email hello@stcatharinesdigital.ca' }, 503)
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

function getSampleDigest(businessName, typeLabel) {
  const text = `Hi ${businessName} team,

Thank you for your interest in sponsoring St. Catharines Digital.

=== SAMPLE DIGEST ===
Here's what a typical Planning Alert looks like:
---
PLANNING ALERT — Week of September 8, 2026

New planning notices across St. Catharines, Welland, Thorold:

1. 455 Welland Avenue — Parking Variance
   Variance to reduce minimum parking from 1.25 to 0.85 spaces/unit
   for 248 residential + 12 commercial units.
   Meeting: September 16, 2026, 5:00 p.m.

2. Ontario Street Corridor Secondary Plan
   City-initiated Official Plan amendment
   Meeting: September 14, 2026, 6:00 p.m.

3. Pamela Drive Watermain Replacement
   Pre-construction notice — Thorold
   Work begins: September 18, 2026

[Your business logo/name here]
[Sponsor message: "Serving Niagara home buyers since 1995"]
[Link to your website]

View all 41 notices: https://stcatharinesdigital.ca/planning-tracker
---

=== NEXT STEPS ===

Your selected package: ${typeLabel}

To get started:
1. Reply to this email with your logo file (PNG/SVG, 300x100px ideal)
2. Tell us your tagline and website URL
3. We'll send you a manual invoice and next steps
4. Sponsorship goes live within 24 hours of payment

Questions? Reply to this email or call (365) 359-5973.

— St. Catharines Digital
https://stcatharinesdigital.ca`

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <h1 style="color:#0d3b66;border-bottom:3px solid #12d6ff;padding-bottom:.5rem;">Planning Alert Sponsorship</h1>
  <p>Hi ${businessName} team,</p>
  <p>Thank you for your interest in sponsoring <strong>St. Catharines Digital</strong>.</p>

  <h2 style="color:#0d3b66;margin-top:2rem;">📬 Sample Digest</h2>
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;margin:1rem 0;">
    <p style="color:#555;font-size:.9rem;margin:0 0 .5rem;"><strong>Subject:</strong> Planning Alert: 3 new notices in St. Catharines</p>
    <hr style="border:none;border-top:1px solid #eee;margin:1rem 0;">
    <p style="font-weight:600;color:#0d3b66;">1. 455 Welland Avenue — Parking Variance</p>
    <p style="color:#555;margin:.25rem 0;">Variance for 248 residential + 12 commercial units. Meeting: Sep 16.</p>
    <p style="font-weight:600;color:#0d3b66;">2. Ontario Street Corridor Secondary Plan</p>
    <p style="color:#555;margin:.25rem 0;">City-initiated Official Plan amendment. Meeting: Sep 14.</p>
    <p style="font-weight:600;color:#0d3b66;">3. Pamela Drive Watermain Replacement</p>
    <p style="color:#555;margin:.25rem 0;">Pre-construction notice — Thorold. Begins Sep 18.</p>

    <div style="margin:1.5rem 0;padding:1rem;background:#fffbe6;border:1px solid #ffd700;border-radius:8px;text-align:center;">
      <p style="margin:0;color:#b8860b;font-size:.8rem;">SPONSORED BY</p>
      <p style="margin:.25rem 0;font-size:1.2rem;font-weight:700;color:#0d3b66;">[Your Business Name]</p>
      <p style="margin:.25rem 0;color:#666;">[Your tagline or offer here]</p>
      <a href="#" style="color:#12d6ff;text-decoration:none;font-weight:600;">Visit your website →</a>
    </div>
  </div>

  <h2 style="color:#0d3b66;margin-top:2rem;">✅ Next Steps</h2>
  <p><strong>Your package:</strong> ${typeLabel}</p>
  <ol>
    <li>Reply with your logo (PNG/SVG, 300x100px ideal)</li>
    <li>Send your tagline and website URL</li>
    <li>We'll send you a manual invoice and next steps</li>
    <li>Sponsorship goes live within 24 hours</li>
  </ol>

  <div style="margin:2rem 0;padding:1.5rem;background:#e8f4fd;border-radius:12px;text-align:center;">
    <a href="https://stcatharinesdigital.ca/planning-tracker" style="display:inline-block;padding:.75rem 2rem;background:#0d3b66;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">View Planning Tracker</a>
  </div>

  <p style="color:#666;font-size:.9rem;">Questions? Reply to this email or call (365) 359-5973.</p>
  <p style="color:#999;font-size:.8rem;">— St. Catharines Digital</p>
</div></body></html>`

  return { text, html }
}
