import { describe, expect, it } from "vitest";
import { formatRelativeDate } from "./PlanningTrackerPage.jsx";

describe("planning dates", () => {
  it("uses Niagara calendar days around daylight saving time", () => {
    const now = new Date("2026-11-01T05:30:00Z");
    expect(formatRelativeDate("2026-11-01T00:30:00", now)).toBe("Earlier today");
    expect(formatRelativeDate("2026-11-02T17:00:00", now)).toBe("Tomorrow");
  });
});
