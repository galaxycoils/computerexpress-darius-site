import { afterEach, describe, expect, it, vi } from "vitest";
import { MODEL_API, MODEL_REPO, checkBrowserSupport, fetchModelCatalog, formatBytes, parseModelCatalog } from "./modelCatalog";

const sha = "a".repeat(40);
const file = (rfilename, size = 100) => ({ rfilename, lfs: { size } });
const catalog = (siblings) => ({ sha, siblings });
afterEach(() => vi.unstubAllGlobals());

describe("requested model catalog", () => {
  it("pins downloads to the requested repository and immutable revision", () => {
    const [model] = parseModelCatalog(catalog([file("folder/model-Q4_K_M.gguf", 5_000_000_000)]));
    expect(model).toMatchObject({ label: "Q4_K_M", bytes: 5_000_000_000, shards: 1, revision: sha });
    expect(model.url).toBe(`https://huggingface.co/${MODEL_REPO}/resolve/${sha}/folder/model-Q4_K_M.gguf`);
  });
  it("prefers Q4_K_M and sums a complete set of shards", () => {
    const models = parseModelCatalog(catalog([
      file("model-Q5_K_M.gguf", 900),
      file("model-Q4_K_M-00002-of-00002.gguf", 200),
      file("model-Q4_K_M-00001-of-00002.gguf", 100),
    ]));
    expect(models[0]).toMatchObject({ label: "Q4_K_M", shards: 2, bytes: 300 });
    expect(models[0].url).toContain("00001-of-00002.gguf");
  });
  it("excludes partial, duplicate and inconsistent shard sets", () => {
    expect(parseModelCatalog(catalog([
      file("partial-00001-of-00002.gguf"),
      file("duplicate-00001-of-00002.gguf"),
      file("duplicate-00001-of-00002.gguf"),
      file("wrong-00001-of-00002.gguf"),
      file("wrong-00002-of-00003.gguf"),
    ]))).toEqual([]);
  });
  it("excludes unknown sizes, projector files and path traversal", () => {
    expect(parseModelCatalog(catalog([
      { rfilename: "unknown.gguf" }, file("empty.gguf", 0), file("negative.gguf", -1),
      file("mmproj-f16.gguf"), file("../outside.gguf"), file("folder/../outside.gguf"),
      file("a//outside.gguf"), file("model.gguf?secret=value"), file("README.md"),
    ]))).toEqual([]);
  });
  it("encodes filenames and accepts published non-LFS sizes", () => {
    const [model] = parseModelCatalog(catalog([{ rfilename: "a model.gguf", size: 100 }]));
    expect(model.url).toContain("a%20model.gguf");
    expect(model.label).toBe("GGUF");
  });
  it("rejects unpinned or malformed catalog metadata", () => {
    for (const data of [null, {}, { sha: "main", siblings: [] }, { sha, siblings: {} }]) {
      expect(() => parseModelCatalog(data)).toThrow("invalid file list");
    }
  });
  it("uses an abortable metadata-only request without credentials", async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => catalog([file("model.gguf")]) });
    vi.stubGlobal("fetch", fetch);
    const signal = new AbortController().signal;
    expect(await fetchModelCatalog(signal)).toHaveLength(1);
    expect(fetch).toHaveBeenCalledExactlyOnceWith(MODEL_API, { signal, credentials: "omit" });
  });
  it("reports missing repositories, upstream failures and empty file lists", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(fetchModelCatalog()).rejects.toThrow("could not be found");
    fetch.mockResolvedValueOnce({ ok: false, status: 503 });
    await expect(fetchModelCatalog()).rejects.toThrow("could not provide");
    fetch.mockResolvedValueOnce({ ok: true, json: async () => catalog([]) });
    await expect(fetchModelCatalog()).rejects.toThrow("No complete GGUF");
  });
  it("formats download sizes including zero progress", () => {
    expect(formatBytes(1024 ** 3)).toBe("1.00 GB");
    expect(formatBytes(0)).toBe("0.00 GB");
    expect(formatBytes(undefined)).toBe("Size unavailable");
    expect(formatBytes(-1)).toBe("Size unavailable");
  });
});

describe("WebGPU preflight", () => {
  function browser(adapter = { features: new Set(["shader-f16"]) }) {
    return {
      isSecureContext: true,
      navigator: { gpu: { requestAdapter: vi.fn().mockResolvedValue(adapter) } },
      WebAssembly: { Suspending: () => {}, Memory: vi.fn(function () {}) },
    };
  }
  it("requires HTTPS, a hardware adapter, native JSPI and Memory64", async () => {
    await expect(checkBrowserSupport({})).rejects.toThrow("WebGPU");
    const b = browser();
    b.isSecureContext = false;
    await expect(checkBrowserSupport(b)).rejects.toThrow("WebGPU");
    b.isSecureContext = true;
    b.WebAssembly.Suspending = undefined;
    await expect(checkBrowserSupport(b)).rejects.toThrow("WebAssembly");
    b.WebAssembly.Suspending = () => {};
    b.WebAssembly.Memory = vi.fn(function () { throw new Error("unsupported"); });
    await expect(checkBrowserSupport(b)).rejects.toThrow("memory");
  });
  it("does not accept missing or software-only adapters", async () => {
    for (const adapter of [null, { isFallbackAdapter: true }, { info: { isFallbackAdapter: true } }]) {
      await expect(checkBrowserSupport(browser(adapter))).rejects.toThrow("hardware WebGPU adapter");
    }
  });
  it("returns the real adapter without allocating a device or downloading anything", async () => {
    const adapter = { features: new Set(["shader-f16"]), limits: { maxBufferSize: 1_000_000_000 } };
    const b = browser(adapter);
    expect(await checkBrowserSupport(b)).toBe(adapter);
    expect(b.navigator.gpu.requestAdapter).toHaveBeenCalledWith({ powerPreference: "high-performance" });
  });
  it("rejects GPUs without the backend's required float16 feature", async () => {
    for (const adapter of [{}, { features: new Set(["subgroups"]) }]) {
      await expect(checkBrowserSupport(browser(adapter))).rejects.toThrow("shader-f16");
    }
  });
});
