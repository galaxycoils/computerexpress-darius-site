import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ engine: {}, cachedClear: vi.fn() }));
vi.mock("@wllama/wllama/esm/index.js", () => ({
  Wllama: vi.fn(function () { return mocks.engine; }),
  CacheManager: vi.fn(function () { return { clear: mocks.cachedClear }; }),
}));
import { Wllama } from "@wllama/wllama/esm/index.js";
import { clearModelCache, createLocalSession } from "./localRuntime";

const model = { url: "https://huggingface.co/model/resolve/revision/model.gguf", bytes: 100 };
beforeEach(() => {
  vi.clearAllMocks();
  mocks.engine = {
    setCompat: vi.fn(), modelManager: { getModelOrDownload: vi.fn().mockResolvedValue({}), getModels: vi.fn().mockResolvedValue([]) },
    loadModel: vi.fn().mockImplementation(async () => Wllama.mock.calls.at(-1)[1].logger.debug("load_tensors: offloaded 40/40 layers to GPU")), getChatTemplate: vi.fn().mockReturnValue("chat template"),
    createChatCompletion: vi.fn(), exit: vi.fn().mockResolvedValue(),
  };
});

describe("local runtime lifecycle", () => {
  it("explicitly requests GPU layers and the embedded chat template", async () => {
    const session = createLocalSession();
    const controller = new AbortController();
    const onProgress = vi.fn();
    await session.load(model, { signal: controller.signal, onProgress });
    expect(Wllama).toHaveBeenCalledOnce();
    expect(mocks.engine.setCompat).toHaveBeenCalledWith(null);
    expect(mocks.engine.modelManager.getModelOrDownload).toHaveBeenCalledWith({ url: model.url }, expect.objectContaining({ signal: controller.signal }));
    expect(mocks.engine.loadModel).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ n_gpu_layers: 99999, n_threads: 1, n_ctx: 4096 }));
    expect(onProgress).toHaveBeenCalledWith({ stage: "initialize", loaded: 100, total: 100 });
  });
  it("never initializes a cancelled or disposed download", async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(createLocalSession().load(model, { signal: controller.signal, onProgress: vi.fn() })).rejects.toMatchObject({ name: "AbortError" });
    expect(mocks.engine.loadModel).not.toHaveBeenCalled();
    const session = createLocalSession();
    await session.dispose();
    await expect(session.load(model, { signal: new AbortController().signal, onProgress: vi.fn() })).rejects.toMatchObject({ name: "AbortError" });
    expect(mocks.engine.exit).toHaveBeenCalled();
  });
  it("refuses to guess the chat template for an incompatible GGUF", async () => {
    mocks.engine.getChatTemplate.mockReturnValue(null);
    await expect(createLocalSession().load(model, { signal: new AbortController().signal, onProgress: vi.fn() })).rejects.toThrow("no chat template");
    expect(mocks.engine.exit).toHaveBeenCalled();
  });
  it("rejects a silent CPU fallback and frees its memory", async () => {
    mocks.engine.loadModel.mockResolvedValueOnce();
    await expect(createLocalSession().load(model, { signal: new AbortController().signal, onProgress: vi.fn() })).rejects.toThrow("without GPU offloading");
    expect(mocks.engine.exit).toHaveBeenCalled();
  });
  it("streams only assistant text and passes cancellation to inference", async () => {
    mocks.engine.createChatCompletion.mockResolvedValue((async function* () {
      yield { choices: [{ delta: { reasoning_content: "private reasoning" } }] };
      yield { choices: [{ delta: { content: "Hello" } }] };
      yield { choices: [{ delta: { content: " reader" } }] };
    })());
    const onToken = vi.fn();
    const signal = new AbortController().signal;
    const messages = [{ role: "user", content: "hello" }];
    await createLocalSession().reply(messages, { signal, onToken });
    expect(onToken.mock.calls.flat()).toEqual(["Hello", " reader"]);
    expect(mocks.engine.createChatCompletion).toHaveBeenCalledWith(expect.objectContaining({ messages, abortSignal: signal, stream: true }));
  });
  it("stops emitting tokens when the reader cancels", async () => {
    const controller = new AbortController();
    mocks.engine.createChatCompletion.mockResolvedValue((async function* () {
      yield { choices: [{ delta: { content: "first" } }] };
      controller.abort();
      yield { choices: [{ delta: { content: "should not appear" } }] };
    })());
    const onToken = vi.fn();
    await expect(createLocalSession().reply([], { signal: controller.signal, onToken })).rejects.toMatchObject({ name: "AbortError" });
    expect(onToken.mock.calls.flat()).toEqual(["first"]);
  });
  it("reports empty and length-limited replies explicitly", async () => {
    mocks.engine.createChatCompletion.mockResolvedValueOnce((async function* () { yield { choices: [{ delta: {} }] }; })());
    await expect(createLocalSession().reply([], { signal: new AbortController().signal, onToken: vi.fn() })).rejects.toThrow("no answer");
    mocks.engine.createChatCompletion.mockResolvedValueOnce((async function* () { yield { choices: [{ delta: { content: "partial" }, finish_reason: "length" }] }; })());
    expect(await createLocalSession().reply([], { signal: new AbortController().signal, onToken: vi.fn() })).toEqual({ truncated: true });
  });
  it("recognizes a complete cached model by its immutable URL and size", async () => {
    mocks.engine.modelManager.getModels.mockResolvedValue([{ url: model.url, size: 100 }]);
    expect(await createLocalSession().isCached(model)).toBe(true);
    mocks.engine.modelManager.getModels.mockResolvedValue([{ url: model.url, size: 50 }]);
    expect(await createLocalSession().isCached(model)).toBe(false);
  });
  it("can clear cached files without creating an inference engine", async () => {
    await clearModelCache();
    expect(Wllama).not.toHaveBeenCalled();
    expect(mocks.cachedClear).toHaveBeenCalledOnce();
  });
});
