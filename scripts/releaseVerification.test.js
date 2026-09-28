import { describe, expect, it } from "vitest";
import {
  getReleaseRenderNow,
  isExpectedRelease,
  resolveRenderNow,
} from "./releaseVerification.js";

describe("release verification", () => {
  const expected = {
    sha: "old-sha",
    snapshotHash: "snapshot-123",
    renderedAt: "2026-09-28T03:30:00.000Z",
  };

  it("requires the exact requested commit and content snapshot", () => {
    expect(
      isExpectedRelease(
        { ...expected, sha: "new-sha" },
        expected,
        "new-sha",
      ),
    ).toBe(true);
  });

  it("uses the built commit when no override is supplied", () => {
    expect(isExpectedRelease(expected, expected)).toBe(true);
  });

  it("rejects a live site that still serves the previous commit", () => {
    expect(
      isExpectedRelease(
        expected,
        expected,
        "new-sha",
      ),
    ).toBe(false);
  });

  it("rejects a revision with stale publication content", () => {
    expect(
      isExpectedRelease(
        { ...expected, sha: "new-sha", snapshotHash: "stale-snapshot" },
        expected,
        "new-sha",
      ),
    ).toBe(false);
  });

  it("rejects missing or incomplete release metadata", () => {
    expect(isExpectedRelease(null, expected, "new-sha")).toBe(false);
    expect(isExpectedRelease({ ...expected, sha: "new-sha" }, null, "new-sha")).toBe(false);
    expect(isExpectedRelease({ sha: "new-sha", snapshotHash: "snapshot-123" }, expected, "")).toBe(false);
    expect(isExpectedRelease({ ...expected, sha: "new-sha", renderedAt: undefined }, expected, "new-sha")).toBe(false);
  });

  it("rejects a release with a different render timestamp", () => {
    expect(
      isExpectedRelease(
        { ...expected, sha: "new-sha", renderedAt: "2026-09-28T03:31:00.000Z" },
        expected,
        "new-sha",
      ),
    ).toBe(false);
  });

  it("accepts a previously deployed build when its commit and content match", () => {
    const live = {
      ...expected,
      sha: "new-sha",
      renderedAt: "2026-09-28T03:31:00.000Z",
    };
    const options = { matchRenderTime: false };
    expect(isExpectedRelease(live, expected, "new-sha", options)).toBe(true);
    expect(isExpectedRelease({ ...live, snapshotHash: "stale" }, expected, "new-sha", options)).toBe(false);
    expect(isExpectedRelease({ ...live, renderedAt: undefined }, expected, "new-sha", options)).toBe(false);
  });

  it("uses the serialized render time from release metadata", () => {
    expect(
      getReleaseRenderNow(expected).toISOString(),
    ).toBe("2026-09-28T03:30:00.000Z");
  });

  it("reuses a configured render time or falls back to the current build time", () => {
    const fallback = new Date("2026-09-28T04:00:00.000Z");
    expect(resolveRenderNow(undefined, fallback)).toBe(fallback);
    expect(resolveRenderNow("", fallback)).toBe(fallback);
    expect(
      resolveRenderNow("2026-09-28T03:30:00.000Z", fallback).toISOString(),
    ).toBe(expected.renderedAt);
    expect(() => resolveRenderNow("not-a-time", fallback)).toThrow(
      "missing a valid renderedAt timestamp",
    );
  });

  it("rejects releases without a valid serialized render time", () => {
    expect(() => getReleaseRenderNow(null)).toThrow("missing a valid renderedAt timestamp");
    expect(() => getReleaseRenderNow({})).toThrow("missing a valid renderedAt timestamp");
    expect(() => getReleaseRenderNow({ renderedAt: "not-a-time" })).toThrow(
      "missing a valid renderedAt timestamp",
    );
  });
});
