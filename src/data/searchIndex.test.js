import { describe, expect, it } from "vitest";
import { getSearchIndex, searchSite } from "./searchIndex";

describe("searching the whole site", () => {
  const items = getSearchIndex(new Date("2026-09-21T12:00:00Z"));

  it("includes guides and their useful body text", () => {
    const matches = searchSite(items, { q: "Merritt" });
    expect(matches.some((item) => item.href === "/explore/queen-street")).toBe(
      true,
    );
  });

  it("finds development files and their associated meetings", () => {
    const matches = searchSite(items, { q: "A-53/26" });
    expect(
      matches.some(
        (item) => item.href === "/development/stc-103-105-maple-st-a-53-26",
      ),
    ).toBe(true);
    expect(
      matches.some(
        (item) => item.href === "/events/stc-103-105-maple-st-a-53-26",
      ),
    ).toBe(true);
    expect(
      searchSite(items, { q: "A-53/26", section: "Civic calendar" }),
    ).toHaveLength(1);
  });

  it("filters meetings by the scheduled date, not the source's publication date", () => {
    const matches = searchSite(items, {
      section: "Civic calendar",
      from: "2026-10-14",
      to: "2026-10-14",
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every((item) => item.startsAt.startsWith("2026-10-14")),
    ).toBe(true);
  });

  it("keeps unpublished news out of search and gives every item a distinct save identity", () => {
    expect(
      items
        .filter((item) => item.section === "News")
        .every((item) => !item.date || item.date <= "2026-09-21"),
    ).toBe(true);
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
  });

  it("handles accents and apostrophes and ranks a title match ahead of a passing mention", () => {
    const records = [
      {
        id: "mention",
        title: "A neighbourhood walk",
        description: "Visit the café's waterfront.",
        date: "2026-09-21",
      },
      { id: "title", title: "The Café’s waterfront", date: "2026-09-20" },
    ];
    expect(
      searchSite(records, { q: "CAFES waterfront" }).map((item) => item.id),
    ).toEqual(["title", "mention"]);
  });

  it("combines section and city filters without including other communities", () => {
    const matches = searchSite(items, {
      city: "Welland",
      section: "Development",
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (item) => item.city === "Welland" && item.section === "Development",
      ),
    ).toBe(true);
  });
});
