import { CacheManager, Wllama } from "@wllama/wllama/esm/index.js";
import wasmUrl from "@wllama/wllama/esm/wasm/wllama.wasm?url";

export async function clearModelCache() {
  await new CacheManager().clear();
}

export function createLocalSession() {
  let gpuOffloaded = false;
  // The pinned llama.cpp backend reports the actual GPU layer offload. Observe
  // this one status line without logging prompts, replies or native diagnostics.
  // Wllama's worker maps native INFO messages to the logger's debug channel.
  const observe = (...args) => {
    const count = args.filter((value) => typeof value === "string").join(" ")
      .match(/offloaded\s+(\d+)\/\d+\s+layers to GPU/i);
    if (count && Number(count[1]) > 0) gpuOffloaded = true;
  };
  const engine = new Wllama({ default: wasmUrl }, {
    suppressNativeLog: false,
    parallelDownloads: 2,
    logger: { debug: observe, log: observe, warn: observe, error: observe },
  });
  // Native WebGPU/Memory64 only: don't silently download compatibility engines
  // or replace the requested model with a server or a CPU-only implementation.
  engine.setCompat(null);
  let disposed = false;
  return {
    async isCached(model) {
      const cached = await engine.modelManager.getModels();
      return cached.some((item) => item.url === model.url && item.size >= model.bytes);
    },
    async load(model, { signal, onProgress }) {
      signal.throwIfAborted();
      if (disposed) throw new DOMException("Cancelled", "AbortError");
      let lastProgressTime = 0;
      const downloaded = await engine.modelManager.getModelOrDownload({ url: model.url }, {
        signal,
        progressCallback: ({ loaded, total }) => {
          const time = performance.now();
          if (loaded === total || time - lastProgressTime >= 1000) {
            lastProgressTime = time;
            onProgress({ stage: "download", loaded, total });
          }
        },
      });
      signal.throwIfAborted();
      if (disposed) throw new DOMException("Cancelled", "AbortError");
      onProgress({ stage: "initialize", loaded: model.bytes, total: model.bytes });
      await engine.loadModel(downloaded, {
        n_gpu_layers: 99999,
        n_ctx: 4096,
        n_batch: 128,
        n_ubatch: 64,
        n_threads: 1,
        reasoning: false,
        default_template_kwargs: { enable_thinking: false },
      });
      signal.throwIfAborted();
      if (disposed) throw new DOMException("Cancelled", "AbortError");
      if (!gpuOffloaded) {
        await engine.exit();
        throw new Error("The model loaded without GPU offloading. Try another quantization or a WebGPU-capable device.");
      }
      if (!engine.getChatTemplate()) {
        await engine.exit();
        throw new Error("This GGUF has no chat template. A chat-enabled export of the requested model is needed.");
      }
    },
    async reply(messages, { signal, onToken }) {
      signal.throwIfAborted();
      const stream = await engine.createChatCompletion({
        messages,
        stream: true,
        abortSignal: signal,
        max_tokens: 384,
        temperature: 0.3,
        top_p: 0.9,
      });
      let emitted = false;
      let truncated = false;
      for await (const chunk of stream) {
        signal.throwIfAborted();
        const token = chunk.choices?.[0]?.delta?.content;
        if (token) { emitted = true; onToken(token); }
        if (chunk.choices?.[0]?.finish_reason === "length") truncated = true;
      }
      if (!emitted) throw new Error("The model returned no answer.");
      return { truncated };
    },
    async dispose() {
      disposed = true;
      await engine.exit();
    },
  };
}
