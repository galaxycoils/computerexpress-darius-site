import { getPublishableContent } from "./contentRegistry.js";
import { planningNotices } from "./planningNotices.js";
import { nrpsReleases } from "./nrpsReleases.js";
import discovery from "./generated/discovery.json" with { type: "json" };

export function canonicalSource(value) {
  try {
    const u = new URL(value);
    u.hash = "";
    for (const k of [...u.searchParams.keys()])
      if (/^(utm_|fbclid|gclid)/i.test(k)) u.searchParams.delete(k);
    return u.href.replace(/\/$/, "");
  } catch {
    return "";
  }
}
export function citySlug(name) {
  return name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-");
}
export function dateLabel(value, options = {}) {
  if (!value) return "Source date unavailable";
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value,
  );
  return Number.isNaN(+date)
    ? "Source date unavailable"
    : date.toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Toronto",
        ...options,
      });
}
export function todayToronto(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function namedCities(text = "") {
  return ["St. Catharines", "Welland", "Thorold", "Niagara Falls"].filter(
    (name) => new RegExp(`\\b${name.replace(".", "\\.?")}\\b`, "i").test(text),
  );
}
function topicOf(item) {
  if (
    /police|safety|nrps/i.test(
      [item.kind, item.type, item.sourceName].join(" "),
    )
  )
    return "Public safety";
  if (
    /road|bridge|watermain|infrastructure|closure/i.test(
      [item.type, item.category, item.title].join(" "),
    )
  )
    return "Roads & services";
  if (/council|official plan/i.test([item.type, item.title].join(" ")))
    return "City Hall";
  return "Development";
}
export function getPublication(now = new Date()) {
  const today = todayToronto(now);
  const output = new Map();
  const add = (item) => {
    const key = canonicalSource(item.sourceUrl);
    if (
      !key ||
      output.has(key) ||
      !item.title ||
      (item.date && item.date.slice(0, 10) > today)
    )
      return;
    output.set(key, {
      ...item,
      sourceUrl: key,
      topic: item.topic || topicOf(item),
    });
  };
  for (const a of getPublishableContent())
    add({
      id: a.slug,
      slug: a.slug,
      title: a.title,
      description: a.description,
      city: a.city,
      cities: [a.city],
      type: a.type,
      date: a.publishedDate,
      sourceUrl: a.primarySource,
      sourceName: "Public source",
      href: `/articles/${a.slug}`,
      kind: "Source brief",
    });
  for (const n of planningNotices)
    add({
      id: n.id,
      title: n.title,
      description: n.description,
      city: n.municipality,
      cities: [n.municipality],
      type: n.type,
      date: n.publishedDate,
      sourceUrl: n.sourceUrl,
      sourceName: n.municipality,
      href: n.sourceUrl,
      kind: "Official notice",
      category: n.category,
      fileNumber: n.fileNumber,
    });
  for (const r of nrpsReleases) {
    const cities = namedCities(r.headline);
    add({
      id: r.id,
      title: r.headline,
      description: "",
      city: cities.join(" · ") || "Niagara Region",
      cities,
      date: r.date,
      sourceUrl: r.url,
      sourceName: "Niagara Regional Police",
      href: r.url,
      kind: "Official release",
      topic: "Public safety",
    });
  }
  for (const d of discovery.items || []) {
    if (d.status !== "published" || d.reviewRequired) continue;
    const cities = d.kind === "public-safety" ? namedCities(d.title) : [d.city];
    add({
      id: d.id,
      title: d.title,
      description: "",
      city: cities.join(" · ") || "Niagara Region",
      cities,
      date: d.sourcePublishedAt,
      sourceUrl: d.url,
      sourceName: d.sourceName,
      href: d.url,
      kind: "Official source link",
      type: d.kind,
    });
  }
  return [...output.values()].sort(
    (a, b) =>
      String(b.date || "").localeCompare(String(a.date || "")) ||
      a.title.localeCompare(b.title),
  );
}
export function filterPublication(
  items,
  { q = "", city = "", topic = "", kind = "", from = "", to = "" } = {},
) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return items.filter(
    (item) =>
      (!city || item.cities.includes(city) || item.city === city) &&
      (!topic || item.topic === topic) &&
      (!kind || item.kind === kind) &&
      (!from || (item.date && item.date.slice(0, 10) >= from)) &&
      (!to || (item.date && item.date.slice(0, 10) <= to)) &&
      terms.every((term) =>
        [
          item.title,
          item.description,
          item.city,
          item.topic,
          item.fileNumber,
          item.sourceName,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
  );
}
export const TOPICS = [
  "City Hall",
  "Development",
  "Roads & services",
  "Public safety",
];
