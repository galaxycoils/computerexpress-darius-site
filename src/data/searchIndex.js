import {
  getPublication,
  filterPublication,
  normalizeSearchText,
} from "./publication.js";
import { planningNotices } from "./planningNotices.js";
import { civicEvents } from "./events.js";
import { exploreGuides } from "./exploreGuides.js";

export const SEARCH_SECTIONS = [
  "News",
  "Development",
  "Civic calendar",
  "Local guides",
];

export function getSearchIndex(now) {
  const news = getPublication(now).map((item) => ({
    ...item,
    section: "News",
  }));
  const projects = planningNotices.map((item) => ({
    id: `project:${item.id}`,
    title: item.title,
    description: item.description,
    city: item.municipality,
    cities: [item.municipality],
    topic: "Development",
    kind: "Development record",
    section: "Development",
    date: item.publishedDate,
    fileNumber: item.fileNumber,
    sourceName: item.municipality,
    href: `/development/${item.id}`,
    sourceUrl: item.sourceUrl,
  }));
  const events = civicEvents.map((item) => ({
    id: `event:${item.id}`,
    title: item.title,
    description: item.meetingLocation,
    city: item.municipality,
    cities: [item.municipality],
    topic: "City Hall",
    kind: "Civic meeting",
    section: "Civic calendar",
    date: item.startsAt.slice(0, 10),
    startsAt: item.startsAt,
    fileNumber: item.fileNumber,
    sourceName: item.municipality,
    href: `/events/${item.id}`,
    sourceUrl: item.sourceUrl,
  }));
  const guides = exploreGuides.map((item) => ({
    id: `guide:${item.slug}`,
    title: item.title,
    description: item.description,
    city: "St. Catharines",
    cities: ["St. Catharines"],
    topic: "Local news",
    kind: "Local guide",
    section: "Local guides",
    date: null,
    searchText: item.paragraphs.join(" "),
    sourceName: item.tag,
    href: `/explore/${item.slug}`,
  }));
  return [...news, ...projects, ...events, ...guides];
}

export function searchSite(items, { section = "", ...filters } = {}) {
  const matches = filterPublication(items, filters).filter(
    (item) => !section || item.section === section,
  );
  const query = normalizeSearchText(filters.q);
  return matches.sort((a, b) => {
    // Put exact title matches ahead of mentions, then keep source dates newest first.
    const rank = (item) =>
      query && normalizeSearchText(item.title).includes(query) ? 1 : 0;
    return (
      rank(b) - rank(a) ||
      String(b.date || "").localeCompare(String(a.date || "")) ||
      a.title.localeCompare(b.title)
    );
  });
}
