# On-device news assistant

The requested model repository is
[`localellm/WebGPU-mimo-ornith-9b-agsi-abliterated-hq-i1-gguf`](https://huggingface.co/localellm/WebGPU-mimo-ornith-9b-agsi-abliterated-hq-i1-gguf).
The implementation uses Wllama 3.8.1, whose current llama.cpp backend supports
GGUF and WebGPU directly. It does not use WebLLM's MLC weight format, replace
the requested model, or send chat messages to `/api/chat`.

## Reader flow

1. “Ask SC Digital” opens an accessible native dialog. No model host, inference
   runtime or WASM asset is requested when the page loads or the dialog opens.
2. “Check browser & model files” checks secure context, native WebAssembly JSPI
   and Memory64, and a hardware WebGPU adapter before requesting model metadata.
3. The file picker lists complete GGUF variants with known total download sizes.
   Q4_K_M is preferred when available. Split GGUF sets must contain every shard.
   Download URLs are pinned to the immutable repository SHA returned by the API.
4. “Download & start local chat” loads the separately bundled runtime and caches
   the selected model in the browser. The WASM is served from our own built
   assets. All GPU layers are requested; compatibility/CPU-only engines are not
   substituted. The pinned native backend's GPU offload status is checked; a
   model that loads without GPU layers is rejected and freed. Native diagnostics
   and prompt/reply text are not logged. A missing chat template is an actionable
   error, not guessed.
5. Replies stream as plain text, with a stop control. The assistant receives up
   to three relevant records from the site's local search index and a bounded
   conversation. Related links come from the index rather than generated URLs.
6. New conversation clears messages; unload releases the worker/model memory;
   remove downloaded files clears Wllama's model cache. Closing during startup
   cancels work. Closing a ready dialog retains the model and conversation for
   this tab; closing the tab loses the conversation.

Model downloads can be several gigabytes and GPU/memory requirements vary by
quantization. A recent desktop Chrome/Edge with hardware acceleration is the
initial supported target. Browser GPU support alone does not guarantee the
selected 9B model will fit. Startup errors allow a smaller variant or retry.
Hugging Face and its file-delivery hosts see download/metadata requests; chat
content is kept on the device. Browser storage eviction can require a download
again. No offline capability is promised.

## Validation

Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and
`npm run budget:bundle`. `npm run test:browser` runs the newsroom journeys and
the local chat browser suite. `npm run test:chat:browser` runs chat alone.
Set `CHROME_PATH` and `QA_BASE_URL` when using an existing production preview.

The chat browser suite uses mock catalog metadata, a mock GPU adapter and mock
inference. It checks consent, immutable model selection, modal keyboard behavior,
safe text rendering, local-only messages, cache/memory actions, site navigation,
and WCAG/layout in light/dark themes at 320/390/768/1440 px. These checks do not
demonstrate real 9B inference or the existence/compatibility of upstream files.

Before calling the requested model verified, inspect the real Hugging Face file
list, download a complete chosen variant, and test startup, streaming, stop and
memory release on a WebGPU device. This cloud environment currently blocks
Hugging Face and has no hardware GPU; those integration checks remain pending.

The normal page bundle has a small launcher only. The model runtime, chat CSS
and model weights remain outside the initial page transfer budget.
