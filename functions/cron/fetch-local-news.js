// Cloudflare Pages Cron: Fetch local news RSS feeds → D1
// Runs on schedule via wrangler.toml [triggers]
// GET/POST /functions/cron/fetch-local-news

const RSS_SOURCES = [
  {
    id: 'stcatharines-standard',
    name: 'St. Catharines Standard',
    baseUrl: 'https://www.stcatharinesstandard.ca',
    rssUrl: 'https://www.stcatharinesstandard.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    municipality: 'St. Catharines',
    region: 'Niagara',
  },
  {
    id: 'niagara-this-week',
    name: 'Niagara This Week',
    baseUrl: 'https://www.niagarathisweek.com',
    rssUrl: 'https://www.niagarathisweek.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    municipality: 'Region-wide',
    region: 'Niagara',
  },
  {
    id: 'welland-tribune',
    name: 'Welland Tribune',
    baseUrl: 'https://www.wellandtribune.ca',
    rssUrl: 'https://www.wellandtribune.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    municipality: 'Welland',
    region: 'Niagara',
  },
  {
    id: 'niagara-falls-review',
    name: 'Niagara Falls Review',
    baseUrl: 'https://www.niagarafallsreview.ca',
    rssUrl: 'https://www.niagarafallsreview.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    municipality: 'Niagara Falls',
    region: 'Niagara',
  },
];

const USER_AGENT = 'StCatharinesDigitalRSSFetcher/1.0 (+https://stcatharinesdigital.ca)';

export async function onRequest(context) {
  const { STC_D1 } = context.env;

  if (!STC_D1) {
    console.error('STC_D1 not configured');
    return new Response('Database not configured', { status: 503 });
  }

  // Auth guard — only the scheduled cron or an authorized admin can trigger this.
  const cronSecret = context.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = context.request.headers.get('Authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const results = { added: 0, updated: 0, skipped: 0, errors: 0, sources: [] };

  for (const source of RSS_SOURCES) {
    try {
      const articles = await fetchSource(context, source);
      for (const article of articles) {
        const action = await upsertArticle(STC_D1, article);
        if (action === 'added') results.added++;
        else if (action === 'updated') results.updated++;
        else results.skipped++;
      }
      results.sources.push({
        id: source.id,
        ok: true,
        articles: articles.length,
      });
      // Be polite — wait between sources to avoid 429s.
      await sleep(3000);
    } catch (err) {
      results.errors++;
      results.sources.push({
        id: source.id,
        ok: false,
        error: err.message.slice(0, 200),
      });
      console.error(`Failed to fetch ${source.name}:`, err);
    }
  }

  console.log(`RSS fetch complete: added=${results.added} updated=${results.updated} skipped=${results.skipped} errors=${results.errors}`);

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchSource(context, source) {
  const res = await fetch(source.rssUrl, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${source.rssUrl}`);
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const text = await res.text();

  // Some CDNs return HTML for error/non-XML responses.
  if (contentType.includes('html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error('RSS endpoint returned HTML instead of XML');
  }

  return parseRss(text, source);
}

function parseRss(xml, source) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('XML parse error');

  const items = doc.querySelectorAll('item');
  if (items.length === 0) {
    // Try Atom.
    const entries = doc.querySelectorAll('entry');
    if (entries.length === 0) return [];
    return parseAtom(entries, source);
  }

  return parseItems(items, source);
}

function parseItems(items, source) {
  const articles = [];
  const seen = new Set();

  for (const item of items) {
    const titleEl = item.querySelector('title');
    const linkEl = item.querySelector('link');
    const descEl = item.querySelector('description');
    const pubDateEl = item.querySelector('pubDate, dc:date');
    const guidEl = item.querySelector('guid');

    const title = titleEl?.textContent?.trim() || '';
    const link = linkEl?.textContent?.trim() || '';
    const description = descEl?.textContent?.trim() || '';
    const pubDate = pubDateEl?.textContent?.trim() || new Date().toISOString();
    const guid = guidEl?.textContent?.trim() || link;

    if (!title || !link) continue;
    if (seen.has(guid)) continue;
    seen.add(guid);

    const cleanDesc = sanitizeHtml(description).slice(0, 400);

    articles.push({
      id: generateId(source.id, title, pubDate),
      title,
      url: link,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.baseUrl,
      municipality: source.municipality,
      region: source.region,
      category: categorize(title, cleanDesc),
      description: cleanDesc,
      pubDate: parseDate(pubDate) || new Date().toISOString(),
      fetchedAt: Date.now(),
      lastSeenAt: Date.now(),
    });
  }

  // Sort newest first, cap at 50 per source.
  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return articles.slice(0, 50);
}

function parseAtom(entries, source) {
  const articles = [];
  const seen = new Set();

  for (const entry of entries) {
    const titleEl = entry.querySelector('title');
    const linkEl = entry.querySelector('link[href]');
    const summaryEl = entry.querySelector('summary, content');
    const updatedEl = entry.querySelector('updated, published');
    const idEl = entry.querySelector('id');

    const title = titleEl?.textContent?.trim() || '';
    const link = linkEl?.getAttribute('href') || '';
    const summary = summaryEl?.textContent?.trim() || '';
    const updated = updatedEl?.textContent?.trim() || new Date().toISOString();
    const guid = idEl?.textContent?.trim() || link;

    if (!title || !link) continue;
    if (seen.has(guid)) continue;
    seen.add(guid);

    articles.push({
      id: generateId(source.id, title, updated),
      title,
      url: link,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.baseUrl,
      municipality: source.municipality,
      region: source.region,
      category: categorize(title, summary),
      description: sanitizeHtml(summary).slice(0, 400),
      pubDate: parseDate(updated) || new Date().toISOString(),
      fetchedAt: Date.now(),
      lastSeenAt: Date.now(),
    });
  }

  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return articles.slice(0, 50);
}

async function upsertArticle(d1, article) {
  // If the article already exists for this source, update last_seen_at and leave the rest.
  const existing = await d1.prepare(
    'SELECT id, last_seen_at FROM local_news WHERE id = ?'
  ).bind(article.id).first();

  if (existing) {
    // Only update if the article is recent (within 7 days) to avoid churn on stale re-fetches.
    const age = Date.now() - existing.last_seen_at;
    if (age > 7 * 24 * 60 * 60 * 1000) {
      // Treat as a fresh re-appearance — overwrite.
      await d1.prepare(
        `INSERT OR REPLACE INTO local_news (id, title, url, source_id, source_name, source_url, municipality, region, category, description, pub_date, fetched_at, last_seen_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        article.id, article.title, article.url, article.sourceId, article.sourceName,
        article.sourceUrl, article.municipality, article.region, article.category,
        article.description, article.pubDate, article.fetchedAt, article.lastSeenAt
      ).run();
      return 'updated';
    }
    await d1.prepare(
      'UPDATE local_news SET last_seen_at = ? WHERE id = ?'
    ).bind(article.lastSeenAt, article.id).run();
    return 'skipped';
  }

  await d1.prepare(
    `INSERT OR REPLACE INTO local_news (id, title, url, source_id, source_name, source_url, municipality, region, category, description, pub_date, fetched_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    article.id, article.title, article.url, article.sourceId, article.sourceName,
    article.sourceUrl, article.municipality, article.region, article.category,
    article.description, article.pubDate, article.fetchedAt, article.lastSeenAt
  ).run();
  return 'added';
}

function generateId(sourceId, title, pubDate) {
  const hash = simpleHash(sourceId + '|' + title + '|' + pubDate);
  return `${sourceId}-${hash}`;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36).slice(0, 10);
}

function categorize(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('council') || text.includes('mayor') || text.includes('bylaw') || text.includes('by-law') || text.includes('municipal') || text.includes('government') || text.includes('election') || text.includes('vote') || text.includes('zoning') || text.includes('housing')) return 'council';
  if (text.includes('crime') || text.includes('police') || text.includes('arrest') || text.includes('court') || text.includes('charge') || text.includes('theft') || text.includes('assault') || text.includes('drug') || text.includes('traffic') || text.includes('collision') || text.includes('shooting') || text.includes('homicide') || text.includes('warrant') || text.includes('missing person')) return 'crime';
  if (text.includes('business') || text.includes('economy') || text.includes('development') || text.includes('construction') || text.includes('real estate') || text.includes('jobs') || text.includes('employment') || text.includes('budget') || text.includes('taxes')) return 'business';
  if (text.includes('event') || text.includes('festival') || text.includes('community') || text.includes('parade') || text.includes('fair') || text.includes('celebration') || text.includes('charity') || text.includes('fundraiser') || text.includes('road closure') || text.includes('weather') || text.includes('storm')) return 'community';
  if (text.includes('sport') || text.includes('hockey') || text.includes('football') || text.includes('baseball') || text.includes('soccer') || text.includes('tournament') || text.includes('championship') || text.includes('team') || text.includes('player') || text.includes('niagara falls review')) return 'sports';
  if (text.includes('opinion') || text.includes('editorial') || text.includes('column') || text.includes('letter') || text.includes('viewpoint')) return 'opinion';
  return 'other';
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString();
  // Try common RSS formats.
  const matches = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (matches) {
    const d2 = new Date(`${matches[1]}-${matches[2]}-${matches[3]}T00:00:00Z`);
    if (!isNaN(d2.getTime())) return d2.toISOString();
  }
  return null;
}

function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
