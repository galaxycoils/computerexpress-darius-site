import { getPublication } from "../src/data/publication.js";
const SITE_URL = "https://stcatharinesdigital.ca";
function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
export function createRssXml(items = getPublication()) {
  const entries = [...items]
    .sort((a, b) =>
      String(b.date || b.publishedDate || "").localeCompare(
        String(a.date || a.publishedDate || ""),
      ),
    )
    .map((item) => {
      const href = item.href || `/articles/${item.slug}/`,
        url = href.startsWith("/") ? `${SITE_URL}${href}` : href,
        date = item.date || item.publishedDate;
      return `<item><title>${escapeXml(item.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(item.description)}</description>${date ? `<pubDate>${new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? date + "T12:00:00Z" : date).toUTCString()}</pubDate>` : ""}<category>${escapeXml(item.topic || item.type)}</category></item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>St. Catharines Digital</title><link>${SITE_URL}/</link><description>Source-linked local coverage and official notices across Niagara.</description><language>en-ca</language>${entries}</channel></rss>`;
}
export function onRequestGet() {
  return new Response(createRssXml(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });
}
