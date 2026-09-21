import { describe, it, expect } from "vitest";
import {
  getPublication,
  filterPublication,
  namedCities,
  dateLabel,
  canonicalSource,
} from "./publication";
import { createCalendarEvent, filterEvents } from "./events";
describe("publication boundaries", () => {
  it("deduplicates canonical sources and excludes future source dates", () => {
    const items = getPublication(new Date("2026-09-21T12:00:00Z"));
    expect(new Set(items.map((s) => canonicalSource(s.sourceUrl))).size).toBe(
      items.length,
    );
    expect(
      items.every((s) => !s.date || s.date.slice(0, 10) <= "2026-09-21"),
    ).toBe(true);
  });
  it("keeps undated records out of date-filter results", () => {
    const items = [
      {
        title: "Road record",
        city: "Thorold",
        cities: ["Thorold"],
        topic: "Roads & services",
        date: null,
      },
      {
        title: "Road update",
        city: "Thorold",
        cities: ["Thorold"],
        topic: "Roads & services",
        date: "2026-09-20",
      },
    ];
    expect(filterPublication(items, { from: "2026-09-01" })).toHaveLength(1);
    expect(filterPublication(items, { city: "Welland" })).toHaveLength(0);
  });
  it("does not treat Wellandport as Welland or mislabel other cities", () => {
    expect(namedCities("Wellandport traffic update")).toEqual([]);
    expect(namedCities("Niagara Falls investigation")).toEqual([
      "Niagara Falls",
    ]);
    expect(namedCities("St Catharines update")).toEqual(["St. Catharines"]);
  });
  it("preserves source calendar dates and unknown dates", () => {
    expect(dateLabel("2026-09-21")).toBe("Sep 21, 2026");
    expect(dateLabel(null)).toBe("Source date unavailable");
  });
  it("produces a Niagara timezone calendar file without inventing an end time", () => {
    const text = createCalendarEvent({
      id: "test",
      title: "Council, meeting",
      startsAt: "2026-11-05T17:00:00",
      sourceUrl: "https://example.com",
      meetingLocation: "City Hall",
    });
    expect(text).toContain("DTSTART;TZID=America/Toronto:20261105T170000");
    expect(text).toContain("BEGIN:VTIMEZONE");
    expect(text).toContain("Council\\, meeting");
    expect(text).not.toContain("DTEND");
  });
  it("keeps past civic dates out of the upcoming calendar", () => {
    const upcoming = filterEvents({}, new Date("2026-09-21T12:00:00Z"));
    expect(upcoming.every((e) => e.startsAt.slice(0, 10) >= "2026-09-21")).toBe(
      true,
    );
  });
});
