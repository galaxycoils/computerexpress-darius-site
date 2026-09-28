import { afterEach, describe, expect, it, vi } from "vitest";
import { getRenderNow, parseTorontoDate } from "./renderClock.js";

const originalRenderNow = globalThis.__SCD_RENDER_NOW__;

afterEach(() => {
  vi.useRealTimers();
  if (originalRenderNow === undefined) delete globalThis.__SCD_RENDER_NOW__;
  else globalThis.__SCD_RENDER_NOW__ = originalRenderNow;
});

describe("render clock", () => {
  it("uses the serialized build timestamp during hydration", () => {
    globalThis.__SCD_RENDER_NOW__ = "2026-09-28T15:30:00.000Z";

    expect(getRenderNow()).toEqual(new Date("2026-09-28T15:30:00.000Z"));
  });

  it("uses the runtime clock outside prerender and hydration", () => {
    delete globalThis.__SCD_RENDER_NOW__;
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-28T15:30:00.000Z"));

    expect(getRenderNow()).toEqual(new Date("2026-09-28T15:30:00.000Z"));
  });

  it("falls back to the runtime clock when the serialized timestamp is invalid", () => {
    globalThis.__SCD_RENDER_NOW__ = "not-a-timestamp";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-28T15:30:00.000Z"));

    expect(getRenderNow()).toEqual(new Date("2026-09-28T15:30:00.000Z"));
  });

  it("keeps date-only values on their written calendar day", () => {
    expect(parseTorontoDate("2026-09-28").toISOString()).toBe(
      "2026-09-28T00:00:00.000Z",
    );
  });

  it("interprets offset-free meeting times as Toronto civil time", () => {
    expect(parseTorontoDate("2026-10-14T17:00:00").toISOString()).toBe(
      "2026-10-14T21:00:00.000Z",
    );
  });

  it("preserves explicit timezone offsets", () => {
    expect(parseTorontoDate("2026-10-14T17:00:00-04:00").toISOString()).toBe(
      "2026-10-14T21:00:00.000Z",
    );
  });

  it("returns invalid dates for malformed input without throwing", () => {
    expect(Number.isNaN(parseTorontoDate("2026-02-30").getTime())).toBe(true);
    expect(Number.isNaN(parseTorontoDate("not-a-date").getTime())).toBe(true);
  });

  it("accepts an existing Date instance unchanged", () => {
    const date = new Date("2026-09-28T15:30:00.000Z");
    expect(parseTorontoDate(date).getTime()).toBe(date.getTime());
  });
});
