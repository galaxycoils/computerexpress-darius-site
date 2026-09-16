import { getPublishableContent } from '../src/data/contentRegistry.js'

const SITE_URL = 'https://stcatharinesdigital.ca'

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function publicationDate(value) {
  return new Date(`${value}T12:00:00Z`).toUTCString()
}

export function createRssXml(items = getPublishableContent()) {
  const sorted = [...items].sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
  const entries = sorted.map((item) => {
    const url = `${SITE_URL}/articles/${item.slug}/`
    return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${publicationDate(item.publishedDate)}</pubDate>
      <category>${escapeXml(item.type)}</category>
    </item>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>St. Catharines Digital</title>
    <link>${SITE_URL}/</link>
    <description>Verified local coverage from official primary sources in Niagara.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${entries}
  </channel>
</rss>
`
}

export function onRequestGet() {
  return new Response(createRssXml(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
