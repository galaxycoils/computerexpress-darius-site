import { getRenderNow } from "../utils/renderClock.js";

function publicationDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : value;
}

function torontoToday(now) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isEligibleLocalStory(story, today) {
  const day = publicationDay(story?.date);
  return Boolean(
    day &&
      day <= today &&
      story.slug &&
      story.cities?.includes("St. Catharines") &&
      story.topic?.toLowerCase() !== "public safety",
  );
}

export function selectHomepageLead(stories, preferredSlug = "", now = getRenderNow()) {
  const today = torontoToday(now);
  const eligible = (Array.isArray(stories) ? stories : []).filter((story) =>
    isEligibleLocalStory(story, today),
  );
  const preferred = eligible.find((story) => story.slug === preferredSlug);

  return (
    preferred ||
    eligible.sort((left, right) => right.date.localeCompare(left.date))[0] ||
    null
  );
}
