// Cloudflare Pages Function: GET local news from D1
// GET /api/local-news?limit=20&offset=0&category=council&municipality=St. Catharines
// GET /api/local-news/latest — returns just the latest N articles

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function onRequestGet(context) {
  const { STC_D1 } = context.env;

  if (!STC_D1) {
    console.error('STC_D1 not configured');
    return jsonResponse({ error: 'Database not configured' }, 503);
  }

  const url = new URL(context.request.url);
  const path = url.pathname;

  // /api/local-news/latest → returns latest articles only
  if (path === '/api/local-news/latest') {
    const count = Math.min(parseInt(url.searchParams.get('count') || '10'), 50);
    return getLatestNews(STC_D1, count);
  }

  // /api/local-news → paginated query
  return getLocalNews(STC_D1, url);
}

export async function onRequest() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

async function getLocalNews(d1, url) {
  const limit = Math.min(parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT)), MAX_LIMIT);
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const category = url.searchParams.get('category') || null;
  const municipality = url.searchParams.get('municipality') || null;
  const sourceId = url.searchParams.get('sourceId') || null;

  let sql = 'SELECT * FROM local_news WHERE 1=1';
  const bindings = [];

  if (category) {
    sql += ' AND LOWER(category) = LOWER(?)';
    bindings.push(category);
  }
  if (municipality) {
    sql += ' AND LOWER(municipality) = LOWER(?)';
    bindings.push(municipality);
  }
  if (sourceId) {
    sql += ' AND source_id = ?';
    bindings.push(sourceId);
  }

  sql += ' ORDER BY pub_date DESC, fetched_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);

  let totalSql = 'SELECT COUNT(*) as count FROM local_news WHERE 1=1';
  const totalBindings = [];

  if (category) {
    totalSql += ' AND LOWER(category) = LOWER(?)';
    totalBindings.push(category);
  }
  if (municipality) {
    totalSql += ' AND LOWER(municipality) = LOWER(?)';
    totalBindings.push(municipality);
  }
  if (sourceId) {
    totalSql += ' AND source_id = ?';
    totalBindings.push(sourceId);
  }

  try {
    const result = await d1.prepare(sql).bind(...bindings).all();
    const totalResult = await d1.prepare(totalSql).bind(...totalBindings).all();
    const total = totalResult.results?.[0]?.count ?? 0;

    const articles = (result.results || []).map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      sourceId: row.source_id,
      sourceName: row.source_name,
      sourceUrl: row.source_url,
      municipality: row.municipality,
      region: row.region,
      category: row.category,
      description: row.description,
      pubDate: row.pub_date,
      fetchedAt: new Date(row.fetched_at).toISOString(),
      lastSeenAt: new Date(row.last_seen_at).toISOString(),
    }));

    return jsonResponse({
      articles,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + articles.length < total,
      },
    });
  } catch (err) {
    console.error('Failed to query local_news:', err);
    return jsonResponse({ error: 'Failed to fetch news' }, 500);
  }
}

async function getLatestNews(d1, count) {
  try {
    const result = await d1.prepare(
      'SELECT * FROM local_news ORDER BY pub_date DESC, fetched_at DESC LIMIT ?',
    ).bind(count).all();

    const articles = (result.results || []).map(row => ({
      id: row.id,
      title: row.title,
      url: row.url,
      sourceId: row.source_id,
      sourceName: row.source_name,
      sourceUrl: row.source_url,
      municipality: row.municipality,
      region: row.region,
      category: row.category,
      description: row.description,
      pubDate: row.pub_date,
      fetchedAt: new Date(row.fetched_at).toISOString(),
      lastSeenAt: new Date(row.last_seen_at).toISOString(),
    }));

    return jsonResponse({ articles });
  } catch (err) {
    console.error('Failed to query latest news:', err);
    return jsonResponse({ error: 'Failed to fetch news' }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
