export const MODEL_REPO = "localellm/WebGPU-mimo-ornith-9b-agsi-abliterated-hq-i1-gguf";
export const MODEL_PAGE = `https://huggingface.co/${MODEL_REPO}`;
export const MODEL_API = `https://huggingface.co/api/models/${MODEL_REPO}?blobs=true`;

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Size unavailable";
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

// Only list real files from this repository, pinned to its returned revision.
// Split files must form a complete set; downloading one shard isn't a model.
export function parseModelCatalog(data) {
  if (!/^[a-f0-9]{40}$/i.test(data?.sha) || !Array.isArray(data?.siblings)) {
    throw new Error("The model repository returned an invalid file list.");
  }
  const files = data.siblings.filter((file) =>
    typeof file.rfilename === "string" &&
    /\.gguf$/i.test(file.rfilename) &&
    !/(?:^|[/_-])mmproj/i.test(file.rfilename) &&
    !file.rfilename.split("/").some((part) => ["", ".", ".."].includes(part)),
  );
  const groups = new Map();
  for (const file of files) {
    const split = file.rfilename.match(/^(.*)-(\d{5})-of-(\d{5})\.gguf$/i);
    const key = split ? split[1] : file.rfilename;
    const group = groups.get(key) || [];
    group.push({ ...file, part: split ? Number(split[2]) : 1, count: split ? Number(split[3]) : 1 });
    groups.set(key, group);
  }
  const variants = [];
  for (const [name, parts] of groups) {
    parts.sort((a, b) => a.part - b.part);
    if (parts.length !== parts[0].count || parts.some((part, i) => part.part !== i + 1 || part.count !== parts.length)) continue;
    const sizes = parts.map((part) => part.lfs?.size ?? part.size);
    // No hidden multi-GB download when the upstream file size is unknown.
    if (sizes.some((size) => !Number.isSafeInteger(size) || size <= 0)) continue;
    const quant = name.match(/(?:^|[-_.])(IQ\d[A-Z0-9_]*|Q\d[A-Z0-9_]*|F16|BF16)(?=[-.]|$)/i)?.[1]?.toUpperCase() || "GGUF";
    const encoded = parts[0].rfilename.split("/").map(encodeURIComponent).join("/");
    variants.push({
      id: name,
      label: quant,
      filename: parts[0].rfilename,
      bytes: sizes.reduce((sum, size) => sum + size, 0),
      shards: parts.length,
      revision: data.sha,
      url: `https://huggingface.co/${MODEL_REPO}/resolve/${data.sha}/${encoded}`,
    });
  }
  const preferred = ["Q4_K_M", "Q4_K_S", "Q5_K_M", "Q4_0", "Q3_K_M"];
  return variants.sort((a, b) => {
    const rank = (item) => preferred.includes(item.label) ? preferred.indexOf(item.label) : preferred.length;
    return rank(a) - rank(b) || a.bytes - b.bytes || a.id.localeCompare(b.id);
  });
}

export async function fetchModelCatalog(signal) {
  const response = await fetch(MODEL_API, { signal, credentials: "omit" });
  if (!response.ok) {
    throw new Error(response.status === 404
      ? "The requested model repository could not be found on Hugging Face."
      : "Hugging Face could not provide the model files. Please try again later.");
  }
  const variants = parseModelCatalog(await response.json());
  if (!variants.length) throw new Error("No complete GGUF model with a published download size is available in this repository.");
  return variants;
}

export async function checkBrowserSupport(browser = globalThis) {
  if (!browser.isSecureContext || !browser.navigator?.gpu) {
    throw new Error("Local chat needs WebGPU. Try a recent desktop Chrome or Edge browser with hardware acceleration enabled.");
  }
  if (!browser.WebAssembly?.Suspending) {
    throw new Error("This browser needs newer WebAssembly support for this model. Please update desktop Chrome or Edge.");
  }
  try {
    new browser.WebAssembly.Memory({ address: "i64", initial: 1n });
  } catch {
    throw new Error("This browser cannot allocate the memory needed by the local model. Please update desktop Chrome or Edge.");
  }
  const adapter = await browser.navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter || adapter.info?.isFallbackAdapter || adapter.isFallbackAdapter) {
    throw new Error("A hardware WebGPU adapter is unavailable. Enable hardware acceleration or try another device.");
  }
  if (!adapter.features?.has("shader-f16")) {
    throw new Error("This GPU does not support the shader-f16 feature required by the local model. Update your browser and graphics driver, or try another desktop GPU.");
  }
  return adapter;
}
