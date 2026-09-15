// Cloudflare Pages Cron: Scrape municipal planning notices (runs 7 AM ET daily)
// POST /functions/cron/scrape

const AGENTMAIL_BASE = 'https://api.agentmail.to/v0';

// Municipal planning page URLs
const SOURCES = [
  {
    city: 'St. Catharines',
    url: 'https://www.stcatharines.ca/news/',
    type: 'stcatharines',
  },
  {
    city: 'Welland',
    url: 'https://www.welland.ca/news/',
    type: 'welland',
  },
  {
    city: 'Thorold',
    url: 'https://www.thorold.ca/news/',
    type: 'thorold',
  },
  {
    city: 'Niagara Region',
    url: 'https://www.niagararegion.ca/news/default.aspx',
    type: 'niagara',
  },
];

export async function onRequest(context) {
  const { STC_D1 } = context.env;
  const apiKey = context.env.AGENTMAIL_API_KEY;

  if (!STC_D1) {
    console.error('STC_D1 not configured');
    return new Response('Database not configured', { status: 503 });
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

  const results = { added: 0, updated: 0, unchanged: 0, errors: 0, items: [] };

  for (const source of SOURCES) {
    try {
      const notices = await scrapeSource(source);
      for (const notice of notices) {
        try {
          const result = await upsertNotice(STC_D1, notice);
          results[result]++;
          results.items.push({ city: source.city, title: notice.title, action: result });
        } catch (err) {
          results.errors++;
          console.error(`Failed to upsert notice ${notice.id}:`, err.message);
        }
      }
    } catch (err) {
      results.errors++;
      console.error(`Failed to scrape ${source.city}:`, err.message);
    }
  }

  // Send admin notification
  if (apiKey && results.added > 0) {
    try {
      const inbox = await getPrimaryInbox(apiKey);
      await sendEmail(apiKey, inbox.inbox_id, {
        to: 'hello@stcatharinesdigital.ca',
        subject: `Scrape complete: ${results.added} new notices`,
        text: `Planning Alert scrape results:\n\nAdded: ${results.added}\nUpdated: ${results.updated}\nUnchanged: ${results.unchanged}\nErrors: ${results.errors}\n\nNew items:\n${results.items.filter(i => i.action === 'added').map(i => `  - ${i.city}: ${i.title}`).join('\n') || '  (none)'}`,
        labels: ['planning-alerts', 'scrape-summary'],
      });
    } catch (mailErr) {
      console.error('Scrape notification failed:', mailErr);
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function scrapeSource(source) {
  const res = await fetch(source.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-CA,en-US;q=0.9,en;q=0.8',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${source.url}`);
  }

  const html = await res.text();

  // Extract notice links from the HTML
  // Looking for links to news/posts/notice patterns
  const notices = [];
  const seen = new Set();

  // Common municipal notice URL patterns
  const patterns = [
    /<a[^>]+href="([^"]*(?:notice|hearing|variance|amendment|consent| zoning)[^"]*)"[^>]*>([^<]+)<\/a>/gi,
    /<a[^>]+href="([^"]*\/(?:news|posts|media|notices)\/[^"]+)"[^>]*>([^<]+)<\/a>/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const url = match[1].startsWith('http') ? match[1] : new URL(match[1], source.url).href;
      const title = match[2].trim();

      // Skip if too short or already seen
      if (title.length < 20 || seen.has(url)) continue;
      seen.add(url);

      notices.push({
        id: `${source.type}-${hashUrl(url)}`,
        municipality: source.city,
        type: classifyNoticeType(title),
        title: cleanTitle(title),
        description: '',
        status: 'Received',
        source_url: url,
        tags: `${source.city} ${classifyNoticeType(title)} ${cleanTitle(title)}`.toLowerCase(),
        created_at: Date.now(),
        updated_at: Date.now(),
        last_seen_at: Date.now(),
      });
    }
  }

  return notices;
}

async function upsertNotice(d1, notice) {
  // Check if notice already exists
  const existing = await d1.prepare(
    'SELECT id, updated_at FROM notices WHERE source_url = ?'
  ).bind(notice.source_url).first();

  if (existing) {
    // Update last_seen_at
    await d1.prepare(
      'UPDATE notices SET last_seen_at = ? WHERE id = ?'
    ).bind(Date.now(), existing.id).run();
    return 'unchanged';
  } else {
    // Insert new
    const cols = Object.keys(notice);
    const placeholders = cols.map(() => '?').join(', ');
    const vals = cols.map(c => notice[c]);

    await d1.prepare(
      `INSERT OR REPLACE INTO notices (${cols.join(', ')}) VALUES (${placeholders})`
    ).bind(...vals).run();
    return 'added';
  }
}

function hashUrl(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).slice(0, 8);
}

function classifyNoticeType(title) {
  const t = title.toLowerCase();
  if (t.includes('official plan')) return 'Official Plan Amendment';
  if (t.includes('zoning by-law') || t.includes('zoning amendment')) return 'Zoning By-law Amendment';
  if (t.includes('minor variance') || t.includes('committee of adjustment')) return 'Committee of Adjustment';
  if (t.includes('consent')) return 'Consent Application';
  if (t.includes('site plan')) return 'Site Plan Control';
  if (t.includes('part lot')) return 'Part Lot Control';
  if (t.includes('public meeting') || t.includes('hearing')) return 'Public Meeting / Hearing';
  return 'Planning Notice';
}

function cleanTitle(title) {
  // Decode HTML entities
  return title
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
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
