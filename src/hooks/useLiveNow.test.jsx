import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveNow } from "./useLiveNow.js";

const originalRenderNow = globalThis.__SCD_RENDER_NOW__;

afterEach(() => {
  vi.useRealTimers();
  if (originalRenderNow === undefined) delete globalThis.__SCD_RENDER_NOW__;
  else globalThis.__SCD_RENDER_NOW__ = originalRenderNow;
});

describe("useLiveNow", () => {
  it("starts with the prerender timestamp, then uses the visitor clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-29T12:00:00Z"));
    globalThis.__SCD_RENDER_NOW__ = "2026-09-28T12:00:00Z";

    const { result } = renderHook(() => useLiveNow());
    expect(result.current.toISOString()).toBe("2026-09-29T12:00:00.000Z");

    act(() => {
      vi.setSystemTime(new Date("2026-09-30T04:00:30Z"));
      vi.advanceTimersByTime(30_000);
    });
    expect(result.current.toISOString()).toBe("2026-09-30T04:01:00.000Z");
  });

  it("refreshes on tab visibility and clears its timer on unmount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-29T12:00:00Z"));
    const { result, unmount } = renderHook(() => useLiveNow());
    vi.setSystemTime(new Date("2026-09-30T12:00:00Z"));

    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(result.current.toISOString()).toBe("2026-09-30T12:00:00.000Z");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
