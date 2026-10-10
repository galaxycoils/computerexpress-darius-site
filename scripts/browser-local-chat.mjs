import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { MODEL_API, MODEL_REPO } from "../src/components/chat/modelCatalog.js";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
const artifacts = "artifacts/local-chat";
await mkdir(artifacts, { recursive: true });
let preview;
try {
  if (!(await fetch(base)).ok) throw new Error("Preview unavailable");
} catch {
  if (!process.env.QA_BASE_URL) preview = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { stdio: "ignore" });
}
let ready = false;
for (let i = 0; i < 30; i++) {
  try { ready = (await fetch(base)).ok; } catch {}
  if (ready) break;
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
if (!ready) { preview?.kill(); throw new Error("Chat preview did not become ready"); }

// Deliberately mock inference and the large external model download. This suite
// verifies the real UI/lifecycle; it does NOT claim a 9B GPU inference result.
const runtimeMock = `
window.__chatTest = { loads: 0, replies: 0, disposed: 0, cleared: 0 };
function delay(signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, 150);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Stopped', 'AbortError')); }, { once: true });
  });
}
export function createLocalSession() {
  return {
    isCached: async () => false,
    load: async (model, { signal, onProgress }) => {
      window.__chatTest.loads++; window.__chatTest.model = model;
      onProgress({ stage: 'download', loaded: model.bytes / 2, total: model.bytes });
      await delay(signal);
      onProgress({ stage: 'initialize', loaded: model.bytes, total: model.bytes });
      await delay(signal);
    },
    reply: async (messages, { signal, onToken }) => {
      window.__chatTest.replies++; window.__chatTest.messages = messages;
      onToken('The related records are below. ');
      await delay(signal);
      onToken('<img src="https://injected.invalid/x" onerror="alert(1)">');
    },
    dispose: async () => { window.__chatTest.disposed++; },
  };
}
export async function clearModelCache() { window.__chatTest.cleared++; }
`;
const sha = "f".repeat(40);
const files = Array.from({ length: 10 }, (_, i) => ({ rfilename: `test-Q4_K_M-${String(i + 1).padStart(5, "0")}-of-00010.gguf`, lfs: { size: 512 * 1024 ** 2 } }));
const report = [], errors = [];
const axeSource = await readFile("node_modules/axe-core/axe.min.js", "utf8");
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || undefined });
try {
  for (const theme of ["light", "dark"]) for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => requests.push(request.url()));
    await page.addInitScript((value) => {
      localStorage.setItem("theme-v3", value);
      Object.defineProperty(navigator, "gpu", { configurable: true, value: undefined });
    }, theme);
    await page.route("**/googletagmanager.com/**", (route) => route.abort());
    await page.route("**/assets/localRuntime-*.js", (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: runtimeMock }));
    await page.route("**/huggingface.co/**", (route) => {
      assert.equal(route.request().url(), MODEL_API, "Only the catalog may contact the model host in this mocked suite");
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ sha, siblings: files }) });
    });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    assert.equal(requests.some((url) => /local-llm|localRuntime|wllama|huggingface/.test(url)), false, "No model runtime or host request on initial page load");
    await page.getByRole("button", { name: "Ask SC Digital" }).click();
    const dialog = page.getByRole("dialog", { name: "Ask SC Digital" });
    await expect(dialog).toBeVisible();
    await page.getByText("Model & privacy", { exact: true }).click();
    assert.equal(requests.some((url) => /local-llm|localRuntime|wllama|huggingface/.test(url)), false, "Opening chat does not load model resources");
    await page.addScriptTag({ content: axeSource });
    async function audit(state) {
      const result = await page.evaluate(async () => ({
        violations: (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] } })).violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
        overflow: document.documentElement.scrollWidth > innerWidth + 1 || document.querySelector("dialog").scrollWidth > document.querySelector("dialog").clientWidth + 1,
      }));
      report.push({ theme, width, state, ...result });
      assert.deepEqual(result.violations, [], `${theme}/${width}/${state}: WCAG violations`);
      assert.equal(result.overflow, false, `${theme}/${width}/${state}: horizontal overflow`);
    }
    await audit("intro");
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      assert.equal(await dialog.evaluate((element) => !document.hasFocus() || element.contains(document.activeElement)), true, "Keyboard focus cannot enter the background page (browser chrome remains available)");
    }
    await page.getByRole("button", { name: "Check browser & model files" }).click();
    await expect(page.getByRole("alert")).toContainText("WebGPU");
    assert.equal(requests.some((url) => url.includes("huggingface.co")), false, "Unsupported browser never contacts the model host");
    await audit("unsupported");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Ask SC Digital" })).toBeFocused();
    await page.getByRole("button", { name: "Ask SC Digital" }).click();
    await page.evaluate(() => Object.defineProperty(navigator, "gpu", { configurable: true, value: { requestAdapter: async () => ({ info: { isFallbackAdapter: false } }) } }));
    await page.getByRole("button", { name: "Check browser & model files" }).click();
    await expect(page.getByLabel("Model download")).toBeVisible();
    await expect(dialog.getByRole("option")).toHaveText("Q4_K_M · 5.00 GB · 10 files");
    assert.equal(requests.some((url) => /localRuntime|wllama/.test(url)), false, "The model list doesn't initialize the inference runtime");
    await audit("choose");
    await page.getByRole("button", { name: "Download & start local chat" }).click();
    await expect(page.getByLabel("Your question")).toBeVisible();
    assert.equal(await page.evaluate(() => window.__chatTest.model.url), `https://huggingface.co/${MODEL_REPO}/resolve/${sha}/${files[0].rfilename}`);
    await page.getByLabel("Your question").fill("Ontario Street");
    await page.getByRole("button", { name: "Send question" }).click();
    await expect(page.getByText(/<img src="https:\/\/injected\.invalid/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Send question" })).toBeVisible();
    assert.equal(await dialog.locator(".local-chat-turn img").count(), 0, "Generated HTML remains inert text");
    assert.equal(requests.some((url) => url.includes("injected.invalid") || url.includes("/api/chat")), false, "No generated URLs or conversation content are sent to a server");
    await expect(dialog.locator(".local-chat-sources a").first()).toBeVisible();
    await audit("ready");
    await page.screenshot({ path: `${artifacts}/chat-${theme}-${width}.png` });
    await page.getByRole("button", { name: "New conversation" }).click();
    await expect(dialog.locator(".local-chat-turn")).toHaveCount(0);
    await page.getByRole("button", { name: "Unload model", exact: true }).click();
    await expect(page.getByLabel("Model download")).toBeVisible();
    await page.getByRole("button", { name: "Remove downloaded model files" }).click();
    await expect(page.getByText("Downloaded model files removed.")).toBeVisible();
    assert.equal(await page.evaluate(() => window.__chatTest.cleared), 1);
    await page.getByRole("link", { name: "Search the site", exact: true }).click();
    await expect(page).toHaveURL(base + "/search");
    await expect(dialog).not.toBeVisible();
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(`Local chat browser QA passed: ${report.length} accessibility/layout checks; lifecycle journeys at 4 widths in both themes. Inference and model downloads mocked.`);
} finally {
  await writeFile(`${artifacts}/report.json`, JSON.stringify({ inference: "mocked", modelDownloads: "mocked", checks: report, errors }, null, 2));
  await browser.close();
  preview?.kill();
}
