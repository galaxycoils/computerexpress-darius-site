/**
 * Local News for St. Catharines Digital
 *
 * Replaced static RSS-generated file with a D1-backed API client.
 * Auto-scraped news is fetched from /api/local-news (Cloudflare Functions → D1).
 * Seeds from localNewsSeeds.js are used as fallback during SSR / API outages.
 *
 * DO NOT EDIT MANUALLY — news is populated by functions/cron/fetch-local-news.js
 */

import { localNewsSeeds, getNewsFallback } from './localNewsSeeds.js';

const API_BASE = '';

/**
 * Fetch local news from the D1-backed API.
 * Falls back to seeds if the API is unavailable (e.g. during SSR/prerender).
 */
export async function readLocalNews(options = {}) {
  const { limit = 20, offset = 0, category, municipality, sourceId } = options;

  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (category) params.set('category', category);
  if (municipality) params.set('municipality', municipality);
  if (sourceId) params.set('sourceId', sourceId);

  try {
    const res = await fetch(`${API_BASE}/api/local-news?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    // Normalize API response to match the seed shape for consumers.
    const articles = (data.articles || []).map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      sourceId: item.sourceId,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      municipality: item.municipality,
      category: item.category,
      description: item.description || '',
      pubDate: item.pubDate,
      tags: buildTags(item),
    }));

    return {
      articles,
      pagination: data.pagination || {
        limit,
        offset,
        total: articles.length,
        hasMore: false,
      },
    };
  } catch (error) {
    // During prerender/SSR, fetch may not be available.
    console.warn('Local news API fetch failed, using seeds:', error);
    const articles = getNewsFallback(limit + offset).slice(offset, offset + limit);
    return {
      articles,
      pagination: { limit, offset, total: localNewsSeeds.length, hasMore: false },
    };
  }
}

/**
 * Latest local news — convenience wrapper for the news page hero.
 */
export async function readLatestNews(count = 10) {
  try {
    const res = await fetch(`${API_BASE}/api/local-news/latest?count=${count}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return (data.articles || []).map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      sourceId: item.sourceId,
      sourceName: item.sourceName,
      sourceUrl: item.sourceUrl,
      municipality: item.municipality,
      category: item.category,
      description: item.description || '',
      pubDate: item.pubDate,
      tags: buildTags(item),
    }));
  } catch (error) {
    console.warn('Local news latest API failed, using seeds:', error);
    return getNewsFallback(count).map(applyShape);
  }
}

/** Build tags array from raw item for consumers that expect it. */
function buildTags(item) {
  const tags = [];
  if (item.category) tags.push(item.category);
  if (item.municipality) tags.push(item.municipality);
  return tags;
}

/** Apply the standard shape to a seed item. */
function applyShape(item) {
  return {
    ...item,
    tags: item.tags || [item.category, item.municipality].filter(Boolean),
  };
}

/** Re-export seeds for backward compatibility. */
export { localNewsSeeds, getNewsFallback };
