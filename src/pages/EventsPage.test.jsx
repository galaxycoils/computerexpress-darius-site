import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { EventPage } from "./EventsPage.jsx";

afterEach(() => {
  vi.useRealTimers();
  delete globalThis.__SCD_RENDER_NOW__;
});

describe("event detail time", () => {
  it("stops offering an elapsed same-day hearing as upcoming", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-14T22:00:00Z"));
    globalThis.__SCD_RENDER_NOW__ = "2026-10-14T12:00:00Z";

    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/events/welland-777-803-niagara-st-signs"]}>
          <Routes><Route path="/events/:id" element={<EventPage />} /></Routes>
        </MemoryRouter>
      </HelmetProvider>,
    );

    expect(screen.getByText(/Past scheduled date/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add to calendar/ })).not.toBeInTheDocument();
  });
});
