import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ support: vi.fn(), catalog: vi.fn(), create: vi.fn(), clear: vi.fn(), session: {} }));
vi.mock("./modelCatalog", async () => ({ ...await vi.importActual("./modelCatalog"), checkBrowserSupport: mocks.support, fetchModelCatalog: mocks.catalog }));
vi.mock("./localRuntime", () => ({ createLocalSession: mocks.create, clearModelCache: mocks.clear }));
import LocalChat from "./LocalChat";

const model = { id: "q4", label: "Q4_K_M", bytes: 5 * 1024 ** 3, shards: 10, url: "https://huggingface.co/exact/model.gguf" };
const renderChat = (onClose = vi.fn()) => render(<MemoryRouter><LocalChat opened onClose={onClose} /></MemoryRouter>);
const originalDialogMethods = Object.fromEntries(["showModal", "close"].map((name) => [name, Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name)]));

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function () { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function () { this.open = false; } });
  mocks.support.mockResolvedValue({});
  mocks.catalog.mockResolvedValue([model]);
  mocks.clear.mockResolvedValue();
  mocks.session = {
    load: vi.fn().mockResolvedValue(), reply: vi.fn().mockImplementation(async (_messages, { onToken }) => onToken("A local answer.")),
    dispose: vi.fn().mockResolvedValue(), isCached: vi.fn().mockResolvedValue(false),
  };
  mocks.create.mockImplementation(() => mocks.session);
  Object.defineProperty(navigator, "storage", { configurable: true, value: { estimate: vi.fn().mockResolvedValue({ quota: 20 * 1024 ** 3, usage: 0 }) } });
});
afterEach(() => {
  vi.restoreAllMocks();
  for (const [name, descriptor] of Object.entries(originalDialogMethods)) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else delete HTMLDialogElement.prototype[name];
  }
});

async function choose() {
  fireEvent.click(screen.getByRole("button", { name: "Check browser & model files" }));
  await screen.findByLabelText("Model download");
}
async function ready() {
  await choose();
  fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
  await screen.findByLabelText("Your question");
}

describe("local chat consent and recovery", () => {
  it("does not contact the model host or initialize a runtime on open", () => {
    renderChat();
    expect(screen.getByRole("dialog", { name: "Ask SC Digital" })).toBeVisible();
    expect(mocks.support).not.toHaveBeenCalled();
    expect(mocks.catalog).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("checks capability before the catalog and asks for a separate download action", async () => {
    renderChat();
    await choose();
    expect(mocks.support.mock.invocationCallOrder[0]).toBeLessThan(mocks.catalog.mock.invocationCallOrder[0]);
    expect(screen.getByRole("option")).toHaveTextContent("5.00 GB");
    expect(mocks.create).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    await screen.findByLabelText("Your question");
    expect(mocks.session.load).toHaveBeenCalledWith(model, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });
  it("offers site links and retries when WebGPU is unavailable", async () => {
    mocks.support.mockRejectedValueOnce(new Error("WebGPU unavailable"));
    renderChat();
    fireEvent.click(screen.getByRole("button", { name: "Check browser & model files" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("WebGPU unavailable");
    expect(mocks.catalog).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Search the site" })).toHaveAttribute("href", "/search");
    await choose();
  });
  it("cancels an in-progress download, frees the worker and ignores late completion", async () => {
    let finish;
    mocks.session.load.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    renderChat();
    await choose();
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    await waitFor(() => expect(mocks.session.load).toHaveBeenCalled());
    const signal = mocks.session.load.mock.calls[0][1].signal;
    fireEvent.click(screen.getByRole("button", { name: "Cancel loading" }));
    expect(signal.aborted).toBe(true);
    expect(mocks.session.dispose).toHaveBeenCalled();
    await act(async () => finish());
    expect(screen.queryByLabelText("Your question")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Model download")).toBeInTheDocument();
  });
  it("handles failed initialization and lets the reader retry", async () => {
    mocks.session.load.mockRejectedValueOnce(Object.assign(new Error("out of memory"), { type: "load_error" }));
    renderChat();
    await choose();
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("could not fit or initialize");
    expect(mocks.session.dispose).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    await screen.findByLabelText("Your question");
  });
  it("blocks insufficient storage but allows complete cached downloads", async () => {
    navigator.storage.estimate.mockResolvedValue({ quota: 100, usage: 90 });
    renderChat();
    await choose();
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("not enough browser storage");
    expect(mocks.session.load).not.toHaveBeenCalled();
    mocks.session.isCached.mockResolvedValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Download & start local chat" }));
    await screen.findByLabelText("Your question");
  });
  it("streams plain text safely and shows independently retrieved site records", async () => {
    const text = '<script>window.injected=true</script><img src=x onerror=alert(1)>';
    mocks.session.reply.mockImplementation(async (_messages, { onToken }) => { onToken(text); });
    const { container } = renderChat();
    await ready();
    fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Ontario Street" } });
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector(".local-chat-turn img")).toBeNull();
    expect(screen.getAllByText("Related records")).toHaveLength(1);
    expect(mocks.session.reply.mock.calls[0][0][0].content).toContain("REFERENCE RECORDS");
  });
  it("stops generation without inventing a completed answer", async () => {
    mocks.session.reply.mockImplementation((_messages, { signal, onToken }) => new Promise((_resolve, reject) => {
      onToken("Partial answer");
      signal.addEventListener("abort", () => reject(new DOMException("Stopped", "AbortError")), { once: true });
    }));
    renderChat();
    await ready();
    fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Ontario Street" } });
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    await screen.findByText("Partial answer");
    fireEvent.click(screen.getByRole("button", { name: "Stop reply" }));
    expect(await screen.findByText("Reply stopped before completion.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send question" })).toBeDisabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("clears conversations, releases model memory and removes caches separately", async () => {
    renderChat();
    await ready();
    fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    await screen.findByText("A local answer.");
    fireEvent.click(screen.getByRole("button", { name: "New conversation" }));
    expect(screen.queryByText("A local answer.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Unload model" }));
    await screen.findByLabelText("Model download");
    expect(mocks.session.dispose).toHaveBeenCalled();
    expect(mocks.clear).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Remove downloaded model files" }));
    await screen.findByText("Downloaded model files removed.");
    expect(mocks.clear).toHaveBeenCalledOnce();
  });
  it("can clear old cached files before model discovery without requiring a GPU", async () => {
    renderChat();
    fireEvent.click(screen.getByRole("button", { name: "Remove downloaded model files" }));
    await screen.findByText("Downloaded model files removed.");
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.support).not.toHaveBeenCalled();
  });
  it("keeps a failed question available for retry and labels length-limited answers", async () => {
    mocks.session.reply.mockRejectedValueOnce(new Error("GPU lost"));
    renderChat();
    await ready();
    fireEvent.change(screen.getByLabelText("Your question"), { target: { value: "Ontario Street" } });
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("reply could not finish");
    expect(screen.getByLabelText("Your question")).toHaveValue("Ontario Street");
    await waitFor(() => expect(screen.getByRole("button", { name: "Send question" })).toBeEnabled());
    mocks.session.reply.mockImplementationOnce(async (_messages, { onToken }) => { onToken("Partial but useful"); return { truncated: true }; });
    fireEvent.click(screen.getByRole("button", { name: "Send question" }));
    expect(await screen.findByText("Reply reached its length limit.")).toBeInTheDocument();
    expect(screen.getByText("No reply was generated.")).toBeInTheDocument();
  });
});
