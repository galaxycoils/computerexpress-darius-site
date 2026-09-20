#!/usr/bin/env node
/**
 * Fetch Local News from RSS Feeds
 * Populates src/data/localNews.js with latest articles from Niagara news sources.
 *
 * Behavior:
 *  - Tries canonical RSS URLs per source with browser-grade UA.
 *  - Retries once on 429/5xx after honoring Retry-After when present.
 *  - Waits between sources to avoid triggering rate limits.
 *  - Only overwrites localNews.js when at least one article is fetched.
 *  - If all sources fail, leaves the existing data untouched and reports failure.
 *
 * Run: node scripts/fetch-local-news.js
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMParser } from '@xmldom/xmldom';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DATA_FILE = path.join(PROJECT_ROOT, 'src/data/localNews.js');

// Sources defined here so the script does not depend on the file it may overwrite.
const SOURCES = [
  {
    id: 'stcatharines-standard',
    name: 'St. Catharines Standard',
    baseUrl: 'https://www.stcatharinesstandard.ca',
    rssUrls: [
      // TNCMS editorial calendar feed, wants #topstory tag
      'https://www.stcatharinesstandard.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc&k%5B%5D=%23topstory',
    ],
    municipality: 'St. Catharines',
    region: 'Niagara',
  },
  {
    id: 'niagara-this-week',
    name: 'Niagara This Week',
    baseUrl: 'https://www.niagarathisweek.com',
    rssUrls: [
      'https://www.niagarathisweek.com/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    ],
    municipality: 'Region-wide',
    region: 'Niagara',
  },
  {
    id: 'welland-tribune',
    name: 'Welland Tribune',
    baseUrl: 'https://www.wellandtribune.ca',
    rssUrls: [
      'https://www.wellandtribune.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    ],
    municipality: 'Welland',
    region: 'Niagara',
  },
  {
    id: 'niagara-falls-review',
    name: 'Niagara Falls Review',
    baseUrl: 'https://www.niagarafallsreview.ca',
    rssUrls: [
      'https://www.niagarafallsreview.ca/search/?f=rss&t=article&l=50&s=start_time&sd=desc',
    ],
    municipality: 'Niagara Falls',
    region: 'Niagara',
  },
];

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const COLD_START_MS = 4000;
const DELAY_BETWEEN_SOURCES_MS = 12000;
const RETRY_DELAY_MS = 15000;
const MAX_BACKOFF_MS = 60000;
const MAX_TITLE_DISPLAY_LENGTH = 300;

const seenUrls = new Set();
const seenTitles = new Set();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80);
}

function categorizeArticle(title, description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (text.includes('council') || text.includes('mayor') || text.includes('bylaw') || text.includes('by-law') || text.includes('municipal') || text.includes('government') || text.includes('election') || text.includes('vote') || text.includes('zoning') || text.includes('housing')) return 'council';
  if (text.includes('crime') || text.includes('police') || text.includes('arrest') || text.includes('court') || text.includes('charge') || text.includes('theft') || text.includes('assault') || text.includes('drug') || text.includes('traffic') || text.includes('collision') || text.includes('shooting') || text.includes('homicide') || text.includes('warrant') || text.includes('missing person')) return 'crime';
  if (text.includes('business') || text.includes('economy') || text.includes('development') || text.includes('construction') || text.includes('real estate') || text.includes('jobs') || text.includes('employment') || text.includes('budget') || text.includes('taxes')) return 'business';
  if (text.includes('event') || text.includes('festival') || text.includes('community') || text.includes('parade') || text.includes('fair') || text.includes('celebration') || text.includes('charity') || text.includes('fundraiser') || text.includes('road closure') || text.includes('weather') || text.includes('storm')) return 'community';
  if (text.includes('sport') || text.includes('hockey') || text.includes('football') || text.includes('baseball') || text.includes('soccer') || text.includes('tournament') || text.includes('championship') || text.includes('team') || text.includes('player') || text.includes('niagara falls review')) return 'sports';
  if (text.includes('opinion') || text.includes('editorial') || text.includes('column') || text.includes('letter') || text.includes('viewpoint')) return 'opinion';
  return 'other';
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const wait = retryAfter
        ? Math.max(parseInt(retryAfter, 10) || RETRY_DELAY_MS, RETRY_DELAY_MS)
        : RETRY_DELAY_MS;
      console.warn(`  ↻ ${source.name}: 429, waiting ${wait}ms before retry`);
      await sleep(Math.min(wait + 2000, MAX_BACKOFF_MS));
      const retry = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/rss+xml, application/xml, text/xml, */*',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
      });
      if (!retry.ok) throw new Error(`Retry failed: HTTP ${retry.status}`);
      return retry;
    }

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const text = await response.text();

    if (
      !contentType.includes('xml') &&
      !contentType.includes('rss') &&
      !contentType.includes('atom')
    ) {
      const trimmed = text.trim();
      if (
        trimmed.startsWith('<html') ||
        trimmed.startsWith('<!DOCTYPE html') ||
        trimmed.startsWith('<base')
      ) {
        throw new Error('RSS URL returned HTML, not XML');
      }
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function parseXml(xml, source) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) throw new Error('XML parse error');

  const items = doc.querySelectorAll('item');
  if (items.length === 0) {
    const entries = doc.querySelectorAll('entry');
    if (entries.length > 0) return parseAtomEntries(entries, source);
    throw new Error('No <item> or <entry> elements found');
  }

  return items;
}

function parseAtomEntries(entries, source) {
  const articles = [];
  for (const entry of entries) {
    const titleEl = entry.querySelector('title');
    const linkEl = entry.querySelector('link[href]');
    const pubDateEl = entry.querySelector('updated, published');
    const descriptionEl = entry.querySelector('summary, content');
    const idEl = entry.querySelector('id');

    const title = titleEl?.textContent?.trim() || '';
    const link = linkEl?.getAttribute('href') || '';
    const pubDate = pubDateEl?.textContent?.trim() || new Date().toISOString();
    const description = descriptionEl?.textContent?.trim() || '';
    const guid = idEl?.textContent?.trim() || link;

    if (!title || !link) continue;

    const urlKey = link.toLowerCase();
    const titleKey = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 100);
    if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) continue;
    seenUrls.add(urlKey);
    seenTitles.add(titleKey);

    let pubDateObj;
    try {
      pubDateObj = new Date(pubDate);
      if (isNaN(pubDateObj.getTime())) throw new Error();
    } catch {
      pubDateObj = new Date();
    }

    const cleanDesc = description
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, MAX_TITLE_DISPLAY_LENGTH || 300);

    const category = categorizeArticle(title, cleanDesc);
    const id = `${source.id}-${slugify(title)}-${pubDateObj.getTime()}`;

    articles.push({
      id,
      title,
      url: link,
      pubDate: pubDateObj.toISOString(),
      description: cleanDesc,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.baseUrl,
      municipality: source.municipality,
      region: source.region,
      category,
      tags: [category, source.municipality],
    });
  }
  return articles;
}

async function fetchSource(source) {
  console.log(`Fetching ${source.name}...`);
  for (const rssUrl of source.rssUrls) {
    try {
      const xml = await fetchWithRetry(rssUrl, source);
      const nodes = parseXml(xml, source);
      const articles = [];

      for (const node of nodes) {
        const titleEl = node.querySelector('title');
        const linkEl = node.querySelector('link');
        const pubDateEl = node.querySelector(
          'pubDate, dc:date, iso8601:pubDate, published',
        );
        const descriptionEl = node.querySelector(
          'description, summary, content',
        );
        const guidEl = node.querySelector('guid');

        const title = titleEl?.textContent?.trim() || '';
        const link =
          linkEl?.textContent?.trim() ||
          linkEl?.getAttribute?.('href') ||
          '';
        const pubDate = pubDateEl?.textContent?.trim() || new Date().toISOString();
        const description = descriptionEl?.textContent?.trim() || '';
        const guid = guidEl?.textContent?.trim() || link;

        if (!title || !link) continue;

        const urlKey = link.toLowerCase();
        const titleKey = title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 100);
        if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) continue;
        seenUrls.add(urlKey);
        seenTitles.add(titleKey);

        let pubDateObj;
        try {
          pubDateObj = new Date(pubDate);
          if (isNaN(pubDateObj.getTime())) throw new Error();
        } catch {
          pubDateObj = new Date();
        }

        const cleanDesc = description
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, MAX_TITLE_DISPLAY_LENGTH || 300);

        const category = categorizeArticle(title, cleanDesc);
        const id = `${source.id}-${slugify(title)}-${pubDateObj.getTime()}`;

        articles.push({
          id,
          title,
          url: link,
          pubDate: pubDateObj.toISOString(),
          description: cleanDesc,
          sourceId: source.id,
          sourceName: source.name,
          sourceUrl: source.baseUrl,
          municipality: source.municipality,
          region: source.region,
          category,
          tags: [category, source.municipality],
        });
      }

      console.log(`  ✓ ${source.name}: ${articles.length} articles from ${rssUrl}`);
      return articles;
    } catch (error) {
      console.warn(`  ⚠ ${source.name}: ${rssUrl} — ${error.message}`);
    }
  }

  console.warn(`  ✗ ${source.name}: all RSS URLs failed`);
  return [];
}

async function main() {
  console.log('Fetching local news from RSS feeds...\n');

  // Cold start pause to reset per-IP rate window across multiple invocations.
  await sleep(COLD_START_MS);

  const allArticles = [];
  const skippedSources = [];

  // Two-pass: first attempt all; if any 429 early, retry those later with bigger gaps.
  for (let i = 0; i < SOURCES.length; i++) {
    const source = SOURCES[i];
    const articles = await fetchSource(source);
    allArticles.push(...articles);

    if (articles.length === 0) {
      skippedSources.push(source);
    }

    if (i < SOURCES.length - 1) {
      await sleep(DELAY_BETWEEN_SOURCES_MS);
    }
  }

  // Retry any source that failed first pass, with longer gaps.
  if (skippedSources.length > 0) {
    console.log('\nRetrying failed sources with extended delays...');
    for (const source of skippedSources) {
      await sleep(DELAY_BETWEEN_SOURCES_MS * 2);
      const articles = await fetchSource(source);
      allArticles.push(...articles);
      if (articles.length > 0) {
        console.log(`  ✓ ${source.name} (retry): ${articles.length} articles`);
      }
    }
  }

  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const recentArticles = allArticles.slice(0, 50);

  if (recentArticles.length === 0) {
    console.log('\n⚠ No articles fetched from any source.');
    console.log('Leaving existing localNews.js untouched. Verify UA blocking / RSS URL changes.');
    return;
  }

  const now = new Date().toISOString().split('T')[0];
  const fileContent = `/**
 * Local News Articles for St. Catharines Digital
 * Auto-generated from RSS feeds on ${now}
 * Sources: ${SOURCES.filter(s => true).map(s => s.name).join(', ')}
 * DO NOT EDIT MANUALLY - Run scripts/fetch-local-news.js to update
 */

export const localNews = ${JSON.stringify(recentArticles, null, 2)};

export const localNewsCategories = [
  { key: 'council', label: 'Council & Government', color: 'var(--primary)' },
  { key: 'crime', label: 'Crime & Courts', color: 'var(--danger)' },
  { key: 'business', label: 'Business & Economy', color: 'var(--success)' },
  { key: 'community', label: 'Community & Events', color: 'var(--accent)' },
  { key: 'sports', label: 'Sports', color: 'var(--info)' },
  { key: 'opinion', label: 'Opinion', color: 'var(--warning)' },
  { key: 'other', label: 'Other', color: 'var(--muted)' }
];

export const localNewsSources = ${JSON.stringify(SOURCES, null, 2)};

export function getNewsBySource(sourceId) {
  return localNews.filter(n => n.sourceId === sourceId);
}

export function getNewsByMunicipality(municipality) {
  return localNews.filter(n =>
    n.municipality.toLowerCase().includes(municipality.toLowerCase())
  );
}

export function getNewsByCategory(category) {
  return localNews.filter(n => n.category === category);
}

export function getRecentNews(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return localNews
    .filter(n => new Date(n.pubDate) >= cutoff)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

export function getLatestNews(count = 10) {
  return localNews
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, count);
}

export function getNewsStats() {
  const recent = getRecentNews(30);
  const bySource = {};
  const byMunicipality = {};
  const byCategory = {};

  recent.forEach(n => {
    bySource[n.sourceName] = (bySource[n.sourceName] || 0) + 1;
    byMunicipality[n.municipality] = (byMunicipality[n.municipality] || 0) + 1;
    byCategory[n.category] = (byCategory[n.category] || 0) + 1;
  });

  return {
    total: localNews.length,
    recent30Days: recent.length,
    bySource,
    byMunicipality,
    byCategory,
    latestDate: localNews.length > 0 ? localNews[0].pubDate : null,
    sourcesActive: ${SOURCES.length}
  };
}
`;

  await fs.writeFile(DATA_FILE, fileContent, 'utf8');
  console.log(`\n✓ Updated ${DATA_FILE} with ${recentArticles.length} articles`);
  console.log('\nBreakdown by source:');
  const bySource = {};
  recentArticles.forEach(a => {
    bySource[a.sourceName] = (bySource[a.sourceName] || 0) + 1;
  });
  Object.entries(bySource).forEach(([source, count]) =>
    console.log(`  ${source}: ${count}`),
  );
}

main().catch(error => {
  console.error('Fatal error during local news fetch:', error);
  process.exit(1);
});
