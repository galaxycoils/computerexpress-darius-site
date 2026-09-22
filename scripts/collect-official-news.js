import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceRegistry } from "../src/data/sourceRegistry.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "src/data/generated/discovery.json");
const MAX_BYTES = 2_000_000;
const MAX_ITEMS_PER_SOURCE = 50;
const USER_AGENT =
  "StCatharinesDigitalSourceCollector/1.0 (+https://stcatharinesdigital.ca/editorial-policy)";

const NAV_TITLE =
  /^(read more|learn more|view all|news|next|previous|all categories|media releases?|public notices?|news releases?|upcoming events?|subscribe|city of .+|niagara regional police service)$/i;

function parseArgs(argv) {
  const args = { write: false, source: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--write") args.write = true;
    else if (value === "--dry-run") args.write = false;
    else if (value === "--source") {
      args.source = argv[++index];
      if (!args.source || args.source.startsWith("--"))
        throw new Error("Missing source ID");
    } else if (value.startsWith("--source="))
      args.source = value.slice("--source=".length);
    else throw new Error("Unknown argument: " + value);
  }
  return args;
}

function codePoint(value) {
  return Number.isInteger(value) &&
    value >= 0 &&
    value <= 0x10ffff &&
    !(value >= 0xd800 && value <= 0xdfff)
    ? String.fromCodePoint(value)
    : "\uFFFD";
}

function decodeEntities(value) {
  const named = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };
  return value
    .replace(/&#(\d+);/g, (_, code) => codePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      codePoint(Number.parseInt(code, 16)),
    )
    .replace(
      /&([a-z]+);/gi,
      (match, name) => named[name.toLowerCase()] ?? match,
    );
}

function cleanText(value) {
  return decodeEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

function canonicalizeLink(href, sourceUrl) {
  try {
    const candidate = new URL(decodeEntities(href), sourceUrl);
    const source = new URL(sourceUrl);
    if (
      candidate.protocol !== "https:" ||
      candidate.origin !== source.origin ||
      candidate.username ||
      candidate.password
    )
      return null;
    candidate.hash = "";
    for (const key of [...candidate.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(key))
        candidate.searchParams.delete(key);
    }
    candidate.pathname = candidate.pathname.replace(/\/{2,}/g, "/");
    return candidate.href;
  } catch {
    return null;
  }
}

function looksLikeNews(url, sourceUrl) {
  const candidate = new URL(url);
  const source = new URL(sourceUrl);
  if (url === sourceUrl || candidate.pathname === source.pathname) return false;
  const pathname = candidate.pathname;

  if (
    /(^|\/)(contacts?|categories|archive|authors?)(\/|$|\.aspx)/i.test(pathname)
  )
    return false;
  if (/\/news\/?$/i.test(pathname)) return false;
  if (/\/news\/(media-releases|public-notices?|notices?)\/?$/i.test(pathname))
    return false;
  if (/\/news\/default\.aspx$/i.test(pathname)) return false;
  if (/events\.aspx$/i.test(pathname)) return false;

  if (/\/news\/posts?\//i.test(pathname)) return true;
  if (/\/news\/news\//i.test(pathname)) return true;
  if (/\/news\/[^/]+\/[^/]+/i.test(pathname)) return true;
  if (/article\.aspx$/i.test(pathname) && candidate.searchParams.has("id"))
    return true;
  if (/notice\.aspx$/i.test(pathname) && candidate.searchParams.has("q"))
    return true;

  return false;
}

function extractCandidates(html, source) {
  html = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  const found = new Map();
  const anchorPattern =
    /<a\b[^>]*\bhref\s*=\s*(['"])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(anchorPattern)) {
    const title = cleanText(match[3]);
    const url = canonicalizeLink(match[2], source.url);
    if (!url || !looksLikeNews(url, source.url) || title.length < 12) continue;
    if (NAV_TITLE.test(title)) continue;
    found.set(url, {
      id: createHash("sha256").update(url).digest("hex").slice(0, 16),
      title,
      url,
      sourceId: source.id,
      sourceName: source.name,
      city: source.city,
      kind: source.kind,
      sourcePublishedAt: null,
      firstObservedAt: null,
      lastObservedAt: null,
      status: source.reviewRequired ? "pending-review" : "published",
      reviewRequired: Boolean(source.reviewRequired),
    });
    if (found.size >= MAX_ITEMS_PER_SOURCE) break;
  }
  return [...found.values()];
}

// Accept explicit publication metadata only. Event dates, modification dates,
// crawl times and dates mentioned in an article are not publication dates.
function extractPublicationDate(html) {
  const values = [];
  // Observed article dateline component used by the approved municipal/NRPS sites.
  for (const match of html.matchAll(/<span\b[^>]*class\s*=\s*["'][^"']*\bgs-news-details-date\b[^"']*["'][^>]*>([^<]+)<\/span>/gi)) {
    const text = cleanText(match[1]);
    if (/^[A-Z][a-z]{2,8} \d{1,2}, \d{4}$/.test(text)) {
      const date = new Date(text + ' 12:00:00 GMT');
      if (!Number.isNaN(+date)) values.push(date.toISOString().slice(0, 10));
    }
  }
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m => [m[1].toLowerCase(), decodeEntities(m[3])]));
    if (/^(article:published_time|datepublished|date\.issued|dc\.date\.issued)$/i.test(attrs.property || attrs.name || attrs.itemprop || '')) values.push(attrs.content);
  }
  for (const script of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = value => {
        if (!value || typeof value !== 'object') return;
        const types = [].concat(value['@type'] || []);
        if (types.some(type => ['NewsArticle', 'Article', 'BlogPosting', 'Report'].includes(type)) && typeof value.datePublished === 'string') values.push(value.datePublished);
        if (Array.isArray(value)) value.forEach(walk);
        else if (value['@graph']) walk(value['@graph']);
      };
      walk(JSON.parse(script[1]));
    } catch { /* Malformed metadata must not break collection. */ }
  }
  return values.find(value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value.slice(0, 10)) || null;
}

function mergeCandidate(item, old, collectedAt) {
  return {
    ...item,
    ...(old?.status && ['rejected', 'withdrawn', 'pending-review'].includes(old.status)
      ? { status: old.status, reviewRequired: old.reviewRequired ?? true } : {}),
    ...(old?.editorialOverride ? { ...old.editorialOverride, editorialOverride: old.editorialOverride } : {}),
    sourcePublishedAt: old?.sourcePublishedAt || item.sourcePublishedAt,
    firstObservedAt: old?.firstObservedAt || collectedAt,
    lastObservedAt: collectedAt,
  };
}

async function fetchHtml(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(source.url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": USER_AGENT,
      },
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const contentType = response.headers.get("content-type") || "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Unsupported content type: " + contentType);
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_BYTES)
      throw new Error("Response exceeds size limit");
    if (!response.body) throw new Error("Empty response");
    const reader = response.body.getReader();
    const chunks = [];
    let bytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_BYTES) {
          await reader.cancel();
          throw new Error("Response exceeds size limit");
        }
        chunks.push(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }
    return Buffer.concat(chunks).toString("utf8");
  } finally {
    clearTimeout(timeout);
  }
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { items: [] };
    throw error;
  }
}

function validateSource(source) {
  const url = new URL(source.url);
  if (!source.enabled || url.protocol !== "https:") {
    throw new Error("Unsafe source configuration: " + source.id);
  }
  if (typeof source.reviewRequired !== "boolean") {
    throw new Error("Source must set reviewRequired boolean: " + source.id);
  }
}

function publicationFields(item) {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    sourceId: item.sourceId,
    sourceName: item.sourceName,
    city: item.city,
    kind: item.kind,
    sourcePublishedAt: item.sourcePublishedAt ?? null,
    status: item.status,
    reviewRequired: Boolean(item.reviewRequired),
  };
}

function hasSemanticChanges(existingItems, nextItems) {
  const existing = new Map(
    (existingItems || []).map((item) => [
      item.url,
      JSON.stringify(publicationFields(item)),
    ]),
  );
  const next = new Map(
    (nextItems || []).map((item) => [
      item.url,
      JSON.stringify(publicationFields(item)),
    ]),
  );
  if (existing.size !== next.size) return true;
  for (const [url, value] of next) {
    if (existing.get(url) !== value) return true;
  }
  return false;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const enabled = sourceRegistry.filter((source) => source.enabled);
  const selected = args.source
    ? enabled.filter((source) => source.id === args.source)
    : enabled;
  if (!selected.length)
    throw new Error("No enabled source matched the request");
  selected.forEach(validateSource);

  const existing = await readExisting();
  const collectedAt = new Date().toISOString();
  const previous = new Map(
    (existing.items || []).map((item) => [item.url, item]),
  );
  const collected = [];
  const statuses = [];
  let successfulSources = 0;

  for (const source of selected) {
    try {
      const html = await fetchHtml(source);
      const candidates = extractCandidates(html, source);
      let metadataFailures = 0;
      // Keep requests bounded and use only URLs already restricted to the source origin.
      for (let start = 0; start < candidates.length; start += 4) {
        await Promise.all(candidates.slice(start, start + 4).map(async item => {
          if (!previous.get(item.url)?.sourcePublishedAt) {
            try { item.sourcePublishedAt = extractPublicationDate(await fetchHtml({url: item.url})); }
            catch { metadataFailures += 1; }
          }
          Object.assign(item, mergeCandidate(item, previous.get(item.url), collectedAt));
        }));
      }
      if (!candidates.length)
        throw new Error("No candidates extracted; source requires review");
      collected.push(...candidates);
      statuses.push({
        id: source.id,
        ok: true,
        itemCount: candidates.length,
        datedItems: candidates.filter(item => item.sourcePublishedAt).length,
        metadataFailures,
        checkedAt: collectedAt,
      });
      successfulSources += 1;
    } catch (error) {
      statuses.push({
        id: source.id,
        ok: false,
        itemCount: 0,
        checkedAt: collectedAt,
        error: String(error.message || error).slice(0, 180),
      });
    }
  }

  if (!successfulSources) {
    await writeFile(path.join(ROOT, 'collector-report.json'), JSON.stringify({collectedAt, sources: statuses, contentChanged: false, preservedSnapshot: true}, null, 2) + '\n');
    throw new Error(
      "Every requested source failed; the last-known-good snapshot was preserved",
    );
  }

  const merged = new Map();
  for (const item of existing.items || []) merged.set(item.url, item);
  for (const item of collected) merged.set(item.url, item);

  const items = [...merged.values()].sort(
    (a, b) =>
      a.sourceId.localeCompare(b.sourceId) || a.title.localeCompare(b.title),
  );

  const snapshot = {
    version: 2,
    collectedAt,
    publicationState: "autonomous",
    notice:
      "Autonomous official-source discovery. Items are links to primary municipal/police pages only; no invented reporting.",
    sources: [
      ...new Map([
        ...(existing.sources || []).map((s) => [s.id, s]),
        ...statuses.map((s) => [s.id, s]),
      ]).values(),
    ],
    items,
  };

  await writeFile(
    path.join(ROOT, "collector-report.json"),
    JSON.stringify(
      {
        collectedAt,
        sources: statuses,
        contentChanged: hasSemanticChanges(existing.items, items),
      },
      null,
      2,
    ) + "\n",
  );

  const summary = statuses
    .map(
      (status) =>
        status.id +
        ": " +
        (status.ok ? status.itemCount + " candidates, " + status.datedItems + " dated" : "FAILED: " + status.error),
    )
    .join("\n");
  console.log(summary);
  console.log("Total review candidates: " + items.length);

  if (!args.write) {
    console.log("Dry run complete; publication snapshot unchanged. Source-health report saved.");
    return;
  }

  if (!hasSemanticChanges(existing.items, items)) {
    console.log(
      "No publishable content changes; preserved the existing snapshot.",
    );
    return;
  }

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  const temporary = OUTPUT + ".tmp";
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n", "utf8");
  await rename(temporary, OUTPUT);
  console.log("Wrote " + path.relative(ROOT, OUTPUT));
}

export {
  parseArgs,
  canonicalizeLink,
  extractCandidates,
  fetchHtml,
  decodeEntities,
  hasSemanticChanges,
  extractPublicationDate,
  mergeCandidate,
};

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
