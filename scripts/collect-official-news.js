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
      const candidates = extractCandidates(html, source).map((item) => {
        const old = previous.get(item.url);
        return {
          ...item,
          ...(old?.status &&
          ["rejected", "withdrawn", "pending-review"].includes(old.status)
            ? { status: old.status, reviewRequired: old.reviewRequired ?? true }
            : {}),
          ...(old?.editorialOverride
            ? {
                ...old.editorialOverride,
                editorialOverride: old.editorialOverride,
              }
            : {}),
          sourcePublishedAt: old?.sourcePublishedAt || item.sourcePublishedAt,
          firstObservedAt: old?.firstObservedAt || collectedAt,
          lastObservedAt: collectedAt,
        };
      });
      if (!candidates.length)
        throw new Error("No candidates extracted; source requires review");
      collected.push(...candidates);
      statuses.push({
        id: source.id,
        ok: true,
        itemCount: candidates.length,
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

  if (!successfulSources)
    throw new Error(
      "Every requested source failed; the last-known-good snapshot was preserved",
    );

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
        (status.ok ? status.itemCount + " candidates" : "FAILED"),
    )
    .join("\n");
  console.log(summary);
  console.log("Total review candidates: " + items.length);

  if (!args.write) {
    console.log("Dry run complete; no files changed.");
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
};

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
