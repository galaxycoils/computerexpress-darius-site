#!/usr/bin/env node
/**
 * Fetch Local News from RSS Feeds
 * Populates src/data/localNews.js with latest articles from Niagara news sources
 * Run: node scripts/fetch-local-news.js
 */

import fs from 'fs';
import path from 'path';
import { DOMParser } from 'xmldom';
import { localNewsSources } from '../src/data/localNews.js';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DATA_FILE = path.join(PROJECT_ROOT, 'src/data/localNews.js');

// Simple in-memory cache to avoid duplicate articles across sources
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
  if (text.includes('council') || text.includes('mayor') || text.includes('bylaw') || text.includes('by-law') || text.includes('municipal') || text.includes('government') || text.includes('election') || text.includes('vote')) return 'council';
  if (text.includes('crime') || text.includes('police') || text.includes('arrest') || text.includes('court') || text.includes('charge') || text.includes('theft') || text.includes('assault') || text.includes('drug') || text.includes('traffic') || text.includes('collision') || text.includes('shooting') || text.includes('homicide')) return 'crime';
  if (text.includes('business') || text.includes('economy') || text.includes('development') || text.includes('construction') || text.includes('housing') || text.includes('real estate') || text.includes('jobs') || text.includes('employment')) return 'business';
  if (text.includes('event') || text.includes('festival') || text.includes('community') || text.includes('parade') || text.includes('fair') || text.includes('celebration') || text.includes('charity') || text.includes('fundraiser')) return 'community';
  if (text.includes('sport') || text.includes('hockey') || text.includes('football') || text.includes('baseball') || text.includes('soccer') || text.includes('tournament') || text.includes('championship') || text.includes('team') || text.includes('player')) return 'sports';
  if (text.includes('opinion') || text.includes('editorial') || text.includes('column') || text.includes('letter') || text.includes('viewpoint')) return 'opinion';
  return 'other';
}

async function fetchRss(url, source) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'StCatharinesDigital/1.0 (+https://stcatharinesdigital.ca)' }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`  ⚠ ${source.name}: HTTP ${response.status}`);
      return [];
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('xml') && !contentType.includes('rss') && !contentType.includes('atom')) {
      // Might be HTML - check if it's actually an RSS feed
      const text = await response.text();
      if (text.trim().startsWith('<html') || text.trim().startsWith('<!DOCTYPE html')) {
        console.warn(`  ⚠ ${source.name}: RSS URL returns HTML, not XML`);
        return [];
      }
    }

    const xml = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');

    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      console.warn(`  ⚠ ${source.name}: XML parse error`);
      return [];
    }

    const items = doc.querySelectorAll('item');
    if (items.length === 0) {
      // Try Atom format
      const entries = doc.querySelectorAll('entry');
      if (entries.length > 0) {
        return parseAtomEntries(entries, source);
      }
      console.warn(`  ⚠ ${source.name}: No <item> or <entry> elements found`);
      return [];
    }

    const articles = [];

    for (const item of items) {
      const titleEl = item.querySelector('title');
      const linkEl = item.querySelector('link');
      const pubDateEl = item.querySelector('pubDate');
      const descriptionEl = item.querySelector('description');
      const guidEl = item.querySelector('guid');

      const title = titleEl?.textContent?.trim() || '';
      const link = linkEl?.textContent?.trim() || '';
      const pubDate = pubDateEl?.textContent?.trim() || new Date().toISOString();
      const description = descriptionEl?.textContent?.trim() || '';
      const guid = guidEl?.textContent?.trim() || link;

      // Skip if no title or link
      if (!title || !link) continue;

      // Dedupe by URL and normalized title
      const urlKey = link.toLowerCase();
      const titleKey = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 100);
      if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) continue;
      seenUrls.add(urlKey);
      seenTitles.add(titleKey);

      // Parse date
      let pubDateObj;
      try {
        pubDateObj = new Date(pubDate);
        if (isNaN(pubDateObj.getTime())) throw new Error();
      } catch {
        pubDateObj = new Date();
      }

      // Clean description (strip HTML)
      const cleanDesc = description
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

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
        tags: [category, source.municipality]
      });
    }

    console.log(`  ✓ ${source.name}: ${articles.length} new articles`);
    return articles;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`  ⚠ ${source.name}: Request timeout`);
    } else {
      console.warn(`  ⚠ ${source.name}: ${error.message}`);
    }
    return [];
  }
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
    const titleKey = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 100);
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
      .substring(0, 300);

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
      tags: [category, source.municipality]
    });
  }
  return articles;
}

async function main() {
  console.log('Fetching local news from RSS feeds...\n');

  const allArticles = [];

  for (const source of localNewsSources.filter(s => s.active)) {
    console.log(`Fetching ${source.name}...`);
    const articles = await fetchRss(source.rssUrl, source);
    allArticles.push(...articles);
  }

  // Sort by date descending
  allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Take the most recent 50 articles
  const recentArticles = allArticles.slice(0, 50);

  // Generate the updated localNews.js
  const now = new Date().toISOString().split('T')[0];
  const fileContent = `/**
 * Local News Articles for St. Catharines Digital
 * Auto-generated from RSS feeds on ${now}
 * Sources: ${localNewsSources.filter(s => s.active).map(s => s.name).join(', ')}
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

export const localNewsSources = ${JSON.stringify(localNewsSources, null, 2)};

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
    sourcesActive: localNewsSources.filter(s => s.active).length
  };
}
`;

  fs.writeFileSync(DATA_FILE, fileContent);
  console.log(`\n✓ Updated ${DATA_FILE} with ${recentArticles.length} articles`);
  console.log('\nBreakdown by source:');
  const bySource = {};
  recentArticles.forEach(a => { bySource[a.sourceName] = (bySource[a.sourceName] || 0) + 1; });
  Object.entries(bySource).forEach(([source, count]) => console.log(`  ${source}: ${count}`));
}

main().catch(console.error);