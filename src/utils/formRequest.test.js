import { afterEach, describe, expect, it, vi } from "vitest";
import { submitForm } from "./formRequest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("confirmed form delivery", () => {
  it("rejects a development HTML response rather than claiming success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError();
        },
      }),
    );
    await expect(
      submitForm("/api/contact", {}, "No confirmation."),
    ).rejects.toThrow("No confirmation.");
  });
  it("reports a connection failure without losing the submitted payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );
    await expect(
      submitForm("/api/contact", {}, "No confirmation."),
    ).rejects.toThrow(/your details are still here/);
  });
  it("ends a stalled request and never retries a potentially delivered submission", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url, options) =>
        new Promise((_resolve, reject) =>
          options.signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          ),
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const pending = expect(
      submitForm("/api/contact", {}, "No confirmation."),
    ).rejects.toThrow(/may have arrived/);
    await vi.advanceTimersByTimeAsync(20000);
    await pending;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
