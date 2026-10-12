import { afterEach, describe, expect, it, vi } from "vitest";
import { useLayoutEffect } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const originalRenderNow = globalThis.__SCD_RENDER_NOW__;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalRenderNow === undefined) delete globalThis.__SCD_RENDER_NOW__;
  else globalThis.__SCD_RENDER_NOW__ = originalRenderNow;
});

function ReadingJourney({ title, clamp }) {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (clamp) {
      // A shorter destination clamps scroll during DOM commit, before passive
      // effects run. It must not replace the departing page's saved position.
      window.scrollY = 0;
      window.dispatchEvent(new Event("scroll"));
    }
  }, [clamp]);
  return <>
    <h1>{title}</h1>
    <button onClick={() => navigate("/")}>Journey home</button>
    <button onClick={() => navigate(-1)}>Journey back</button>
  </>;
}

function readingJourney(clamp = false) {
  const frames = new Map();
  let nextFrame = 0;
  vi.stubGlobal("requestAnimationFrame", callback => { frames.set(++nextFrame, callback); return nextFrame; });
  vi.stubGlobal("cancelAnimationFrame", id => frames.delete(id));
  window.scrollY = 0;
  vi.spyOn(window, "scrollTo").mockImplementation((_x, y) => {
    window.scrollY = y;
    window.dispatchEvent(new Event("scroll"));
  });
  render(<MemoryRouter initialEntries={["/news"]}>
    <Routes><Route element={<Layout />}>
      <Route path="news" element={<ReadingJourney title="News" />} />
      <Route index element={<ReadingJourney title="Home" clamp={clamp} />} />
    </Route></Routes>
  </MemoryRouter>);
  const flush = () => act(() => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(0);
  });
  flush();
  return flush;
}

describe("reading position restoration", () => {
  it("retains the saved destination when a stale scroll event arrives before restoration", () => {
    const flush = readingJourney();
    act(() => window.scrollTo(0, 600));
    fireEvent.click(screen.getByRole("button", { name: "Journey home" }));
    flush();
    expect(window.scrollY).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Journey back" }));
    fireEvent.scroll(window);
    flush();
    expect(window.scrollY).toBe(600);
  });

  it("captures the departing offset before the destination clamps the viewport", () => {
    const flush = readingJourney(true);
    // The user can follow a link before the browser delivers the scroll event.
    window.scrollY = 600;
    fireEvent.click(screen.getByRole("button", { name: "Journey home" }));
    flush();
    fireEvent.click(screen.getByRole("button", { name: "Journey back" }));
    flush();
    expect(window.scrollY).toBe(600);
  });
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
