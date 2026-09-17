import { createAlertToken } from '../api/alerts/_auth.js'
import { completeDelivery, createDelivery, failDelivery, recipientFingerprint } from '../lib/emailDelivery.js'

// Cloudflare Pages Cron: Daily planning alert digest (runs 6 AM ET daily)
// POST /functions/cron/daily-digest

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

export async function onRequest(context) {
  const { STC_D1 } = context.env;
  const apiKey = context.env.AGENTMAIL_API_KEY;
  const tokenSecret = context.env.ALERT_TOKEN_SECRET;

  if (!STC_D1) {
    console.error('STC_D1 not configured');
    return new Response('Database not configured', { status: 503 });
  }
  if (!apiKey) {
    console.error('AGENTMAIL_API_KEY not configured');
    return new Response('Email not configured', { status: 503 });
  }
  if (!tokenSecret) {
    console.error('ALERT_TOKEN_SECRET not configured');
    return new Response('Alert token service not configured', { status: 503 });
  }

  // Scheduled handlers must not have a fallback production secret.
  const cronSecret = context.env.CRON_SECRET;
  if (!cronSecret) {
    console.error('CRON_SECRET not configured');
    return new Response('Scheduler not configured', { status: 503 });
  }
  const authHeader = context.request.headers.get('Authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const inbox = await getPrimaryInbox(apiKey);

    // Fetch all verified alerts
    const alertResult = await STC_D1.prepare(
      'SELECT id, email, frequency, wards, types, statuses, keywords, created_at FROM alerts WHERE verified = 1 AND frequency = ?'
    ).bind('daily').all();
    const alerts = alertResult.results || [];

    console.log(`Found ${alerts.length} daily alerts to process`);

    let sent = 0;
    let failed = 0;

    for (const alert of alerts) {
      try {
        const matches = await findMatchingNotices(STC_D1, alert);

        if (matches.length === 0) {
          console.log(`No matches for ${alert.email}`);
          continue;
        }

        const manageToken = await createAlertToken(alert.id, alert.created_at, tokenSecret, 'manage');
        const manageUrl = `https://stcatharinesdigital.ca/preferences?token=${encodeURIComponent(manageToken)}`;
        const { text, html } = buildDigest(alert, matches, manageUrl);
        const deliveryId = await createDelivery(STC_D1, { channel: 'planning-alert', recipientRef: await recipientFingerprint(alert.email), template: 'digest' });

        const sendResponse = await fetch(`${AGENTMAIL_BASE}/inboxes/${inbox.inbox_id}/messages/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: alert.email,
            subject: `Planning Alert: ${matches.length} new notice${matches.length !== 1 ? 's' : ''} in your area`,
            text,
            html,
            labels: ['planning-alerts', 'daily-digest', `alert:${alert.id}`],
          }),
        });

        if (!sendResponse.ok) {
          await failDelivery(STC_D1, deliveryId, sendResponse.status, 'provider_rejected', Date.now() + 60 * 60 * 1000);
          throw new Error(`Email provider rejected digest: ${sendResponse.status}`);
        }
        await completeDelivery(STC_D1, deliveryId, sendResponse.status);

        // Update last_sent_at
        await STC_D1.prepare(
          'UPDATE alerts SET last_sent_at = ? WHERE id = ?'
        ).bind(Date.now(), alert.id).run();

        sent++;
        console.log(`Sent digest to ${alert.email} (${matches.length} notices)`);
      } catch (err) {
        failed++;
        console.error(`Failed to send to ${alert.email}:`, err.message);
      }
    }

    console.log(`Digest complete: ${sent} sent, ${failed} failed`);
    return new Response(JSON.stringify({ sent, failed, total: alerts.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Digest cron error:', err);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}

// ── Match Engine ────────────────────────────────────────────────────

async function findMatchingNotices(d1, alert) {
  const wards = JSON.parse(alert.wards || '[]');
  const types = JSON.parse(alert.types || '[]');
  const statuses = JSON.parse(alert.statuses || '[]');
  const keywords = (alert.keywords || '').toLowerCase().split(',').map(k => k.trim()).filter(Boolean);

  // Load from D1
  const notices = await getPlanningNotices(d1);
  if (notices.length === 0) return [];

  let results = notices;

  // Filter by type (category match)
  if (types.length > 0) {
    const typeMap = {
      'OPA': ['official-plan-amendment'],
      'ZBA': ['zoning-bylaw-amendment'],
      'Site Plan': ['draft-plan-subdivision', 'public-meeting'],
      'CoA': ['minor-variance', 'consent-application'],
      'Consent': ['consent-application'],
      'Part Lot Control': ['part-lot-control'],
    };

    const relevantCategories = new Set();
    for (const t of types) {
      const cats = typeMap[t] || [];
      cats.forEach(c => relevantCategories.add(c));
    }

    if (relevantCategories.size > 0) {
      results = results.filter(n => relevantCategories.has(n.category));
    }
  }

  // Filter by status
  if (statuses.length > 0) {
    results = results.filter(n => statuses.includes(n.status));
  }

  // Keyword filter (simple substring)
  if (keywords.length > 0) {
    results = results.filter(n =>
      keywords.some(k =>
        n.title?.toLowerCase().includes(k) ||
        n.description?.toLowerCase().includes(k) ||
        n.tags?.toLowerCase().includes(k)
      )
    );
  }

  // Ward = municipality filter for MVP
  if (wards.length > 0 && !wards.includes('all')) {
    const wardPatterns = {
      '1': [/st[- ]?catharines/i], '2': [/st[- ]?catharines/i],
      '3': [/st[- ]?catharines/i], '4': [/st[- ]?catharines/i],
      '5': [/st[- ]?catharines/i], '6': [/st[- ]?catharines/i],
      'welland': [/welland/i], 'thorold': [/thorold/i], 'niagara': [/niagara/i],
    };
    const patterns = wards.flatMap(w => wardPatterns[w] || []);
    if (patterns.length > 0) {
      results = results.filter(n => patterns.some(p => p.test(n.municipality)));
    }
  }

  // Sort by meeting date (upcoming first) then published date
  return results.sort((a, b) => {
    const aMeeting = a.meetingDate ? new Date(a.meetingDate).getTime() : Infinity;
    const bMeeting = b.meetingDate ? new Date(b.meetingDate).getTime() : Infinity;
    if (aMeeting !== bMeeting) return aMeeting - bMeeting;
    return new Date(b.publishedDate) - new Date(a.publishedDate);
  });
}

// ── Load Planning Notices from D1 ───────────────────────────────────

async function getPlanningNotices(d1) {
  try {
    const result = await d1.prepare(
      'SELECT id, municipality, type, title, description, file_number, status, meeting_date, meeting_location, submission_deadline, submission_email, published_date, source_url, category, tags FROM notices ORDER BY published_date DESC LIMIT 200'
    ).all();
    return (result.results || []).map((notice) => ({
      ...notice,
      fileNumber: notice.file_number,
      meetingDate: notice.meeting_date,
      meetingLocation: notice.meeting_location,
      submissionDeadline: notice.submission_deadline,
      submissionEmail: notice.submission_email,
      publishedDate: notice.published_date,
      sourceUrl: notice.source_url,
    }));
  } catch (err) {
    console.error('Failed to query notices from D1:', err.message);
    return [];
  }
}

// ── Digest Builder ──────────────────────────────────────────────────

function buildDigest(alert, notices, manageUrl) {
  const title = notices.map(n => {
    const meeting = n.meetingDate ? ` · Meeting: ${formatDate(n.meetingDate)}` : '';
    return `${n.title}${meeting}`;
  }).join('\n\n');

  const items = notices.map((n, i) => {
    const desc = n.description.length > 180 ? n.description.slice(0, 180) + '…' : n.description;
    const meetingLine = n.meetingDate
      ? `   Meeting: ${formatDate(n.meetingDate)}${n.meetingLocation ? ` — ${n.meetingLocation}` : ''}`
      : '';
    return [
      `${i + 1}. ${n.title}`,
      `   ${desc}`,
      meetingLine,
      `   Source: ${n.sourceUrl}`,
      '',
    ].filter(Boolean).join('\n');
  }).join('\n');

  const text = `PLANNING ALERT — ${formatDate(new Date().toISOString())}

${notices.length} new planning notice${notices.length !== 1 ? 's' : ''} matching your filters:

${items}
View all notices: https://stcatharinesdigital.ca/planning-tracker

---
St. Catharines Digital
https://stcatharinesdigital.ca
Manage preferences or unsubscribe: ${manageUrl}`;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Inter,-apple-system,sans-serif;color:#1a1a2e;background:#f8fafb;padding:2rem;">
<div style="max-width:640px;margin:0 auto;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:2rem;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
      <h1 style="color:#0d3b66;margin:0;font-size:1.25rem;">Planning Alert</h1>
      <span style="color:#8899b8;font-size:.8rem;">${formatDate(new Date().toISOString())}</span>
    </div>
    <p style="color:#0d3b66;font-weight:600;margin-bottom:1rem;">${notices.length} new notice${notices.length !== 1 ? 's' : ''} matching your filters:</p>
    <div style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;padding:1rem 0;margin-bottom:1.5rem;">
      ${notices.map((n, i) => `
      <div style="padding:0.75rem 0;border-bottom:1px solid #f1f5f9;">
        <p style="font-weight:600;color:#0d3b66;margin:0 0 0.25rem;">${i + 1}. ${n.title}</p>
        <p style="color:#555;font-size:.9rem;margin:0 0 0.5rem;line-height:1.4;">${(n.description || '').length > 200 ? (n.description || '').slice(0, 200) + '…' : (n.description || '')}</p>
        ${n.meetingDate ? `<p style="font-size:.85rem;color:#8899b8;margin:0;">📅 ${formatDate(n.meetingDate)}${n.meetingLocation ? ' — ' + n.meetingLocation : ''}</p>` : ''}
      </div>
      `).join('')}
    </div>
    <a href="https://stcatharinesdigital.ca/planning-tracker" style="display:inline-block;padding:.75rem 2rem;background:#0d3b66;color:#fff;text-decoration:none;border-radius:8px;font-weight:700;">View all notices →</a>
    <div style="margin-top:2rem;padding-top:1rem;border-top:1px solid #e2e8f0;font-size:.8rem;color:#999;text-align:center;">
      <p>St. Catharines Digital · https://stcatharinesdigital.ca</p>
      <p><a href="${manageUrl}" style="color:#0d3b66;">Manage preferences or unsubscribe</a></p>
    </div>
  </div>
</div></body></html>`;

  return { text, html };
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-CA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
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
