import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

const originalRenderNow = globalThis.__SCD_RENDER_NOW__;

afterEach(() => {
  vi.useRealTimers();
  if (originalRenderNow === undefined) delete globalThis.__SCD_RENDER_NOW__;
  else globalThis.__SCD_RENDER_NOW__ = originalRenderNow;
});

describe("site dateline", () => {
  it("shows today's Toronto date even when the page was built yesterday", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-29T12:00:00Z"));
    globalThis.__SCD_RENDER_NOW__ = "2026-09-28T12:00:00Z";

    render(
      <MemoryRouter>
        <Routes><Route element={<Layout />}><Route index element={<p>Home</p>} /></Route></Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Tuesday, September 29, 2026")).toBeInTheDocument();
  });
});
