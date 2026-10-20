import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { filterEvents } from "../data/events.js";
import PlanningTrackerPage, { formatRelativeDate } from "./PlanningTrackerPage.jsx";

afterEach(() => {
  vi.useRealTimers();
  delete globalThis.__SCD_RENDER_NOW__;
});

function renderTracker(iso) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
  globalThis.__SCD_RENDER_NOW__ = iso;
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PlanningTrackerPage />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("planning dates", () => {
  it("uses Niagara calendar days around daylight saving time", () => {
    const now = new Date("2026-11-01T05:30:00Z");
    expect(formatRelativeDate("2026-11-01T00:30:00", now)).toBe("Earlier today");
    expect(formatRelativeDate("2026-11-02T17:00:00", now)).toBe("Tomorrow");
  });

  it("shows the same upcoming meetings as the civic calendar, past the seven-day window", () => {
    const now = "2026-10-20T16:00:00Z";
    renderTracker(now);
    const calendar = filterEvents({ period: "upcoming" }, new Date(now));
    const overview = screen.getByRole("group", { name: "Planning notice overview" });
    const upcoming = screen.getByRole("region", { name: "Upcoming Public Meetings & Hearings" });

    expect(within(overview).getByText("Upcoming Meetings").previousElementSibling).toHaveTextContent(
      String(calendar.length),
    );
    expect(within(upcoming).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(
      calendar.map((event) => event.title),
    );
    expect(within(upcoming).getByRole("heading", { name: /1 Griffith Street/ })).toBeInTheDocument();
    expect(within(upcoming).getByRole("heading", { name: /159 Ontario Street/ })).toBeInTheDocument();
    expect(within(upcoming).getByRole("heading", { name: /11 & 13 Paxton Avenue/ })).toBeInTheDocument();
    expect(within(upcoming).queryByRole("heading", { name: /777-803 Niagara Street/ })).not.toBeInTheDocument();
  });

  it("drops hearings from the upcoming count after their Toronto start time", () => {
    renderTracker("2026-11-12T22:00:00Z");
    const overview = screen.getByRole("group", { name: "Planning notice overview" });
    expect(within(overview).getByText("Upcoming Meetings").previousElementSibling).toHaveTextContent("0");
    expect(screen.queryByRole("region", { name: "Upcoming Public Meetings & Hearings" })).not.toBeInTheDocument();
  });
});
