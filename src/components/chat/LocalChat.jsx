import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import UiIcon from "../journal/UiIcon";
import { MODEL_PAGE, MODEL_REPO, checkBrowserSupport, fetchModelCatalog, formatBytes } from "./modelCatalog";
import { buildChatMessages, findChatSources } from "./chatContext";
import "./local-chat.css";

export default function LocalChat({ opened, onClose }) {
  const dialog = useRef(null);
  const session = useRef(null);
  const operation = useRef(null);
  const output = useRef(null);
  const input = useRef(null);
  const { pathname } = useLocation();
  const [stage, setStage] = useState("intro");
  const [variants, setVariants] = useState([]);
  const [selected, setSelected] = useState("");
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [turns, setTurns] = useState([]);
  const [question, setQuestion] = useState("");
  const busy = ["checking", "loading", "replying", "forgetting"].includes(stage);
  const model = variants.find((variant) => variant.id === selected);

  useEffect(() => {
    if (opened) {
      if (!dialog.current.open) dialog.current.showModal();
    } else if (dialog.current.open) dialog.current.close();
  }, [opened]);
  useEffect(() => () => {
    operation.current?.abort();
    void session.current?.dispose().catch(() => {});
  }, []);
  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [turns, stage]);

  function close() {
    // Closing during a download/startup frees the worker and stops network work.
    if (stage === "loading" || stage === "checking") cancel();
    if (stage === "replying") operation.current?.abort();
    onClose();
  }
  function begin(next) {
    const controller = new AbortController();
    operation.current = controller;
    setStage(next);
    setError("");
    setNotice("");
    return controller;
  }
  async function catalog() {
    const controller = begin("checking");
    try {
      await checkBrowserSupport();
      controller.signal.throwIfAborted();
      const list = await fetchModelCatalog(controller.signal);
      if (operation.current !== controller) return;
      setVariants(list);
      setSelected(list[0].id);
      setStage("choose");
    } catch (failure) {
      if (operation.current !== controller) return;
      if (failure.name !== "AbortError") setError(failure.message || "Model files could not be checked. Please try again.");
      setStage("intro");
    } finally {
      if (operation.current === controller) operation.current = null;
    }
  }
  async function load() {
    if (!model || busy) return;
    const controller = begin("loading");
    setProgress({ stage: "download", loaded: 0, total: model.bytes });
    try {
      await checkBrowserSupport();
      controller.signal.throwIfAborted();
      const runtime = await import("./localRuntime");
      controller.signal.throwIfAborted();
      const current = runtime.createLocalSession();
      session.current = current;
      const estimate = await navigator.storage?.estimate?.();
      if (estimate && Number.isFinite(estimate.quota) && Number.isFinite(estimate.usage)
        && model.bytes > estimate.quota - estimate.usage && !(await current.isCached(model))) {
        throw new Error("There is not enough browser storage for this download. Free space or choose a smaller model file.");
      }
      controller.signal.throwIfAborted();
      await current.load(model, {
        signal: controller.signal,
        onProgress: (value) => { if (operation.current === controller) setProgress(value); },
      });
      if (operation.current !== controller) return;
      setStage("ready");
      setNotice("Model ready. Your messages stay on this device.");
      requestAnimationFrame(() => input.current?.focus());
    } catch (failure) {
      if (operation.current !== controller) return;
      await session.current?.dispose();
      session.current = null;
      if (failure.name !== "AbortError") setError(failure.type === "load_error"
        ? "The model could not fit or initialize on this device. Try a smaller quantization or a desktop with more memory."
        : failure.message || "The download or model startup failed. Please try again.");
      setStage("choose");
    } finally {
      if (operation.current === controller) operation.current = null;
    }
  }
  function cancel() {
    operation.current?.abort();
    operation.current = null;
    const current = session.current;
    session.current = null;
    void current?.dispose().catch(() => {});
    setStage(variants.length ? "choose" : "intro");
    setNotice("Cancelled. Completed download files may remain cached.");
  }
  async function send(event) {
    event.preventDefault();
    const text = question.trim();
    if (stage !== "ready" || !text || !session.current) return;
    const controller = begin("replying");
    const history = [...turns, { role: "user", content: text }];
    setQuestion("");
    const responseId = crypto.randomUUID();
    setTurns([...turns, { role: "user", content: text }, { id: responseId, role: "assistant", content: "", sources: [] }]);
    try {
      const { getSearchIndex } = await import("../../data/searchIndex");
      controller.signal.throwIfAborted();
      const sources = findChatSources(getSearchIndex(new Date()), text, pathname);
      setTurns((current) => current.map((turn) => turn.id === responseId ? { ...turn, sources } : turn));
      const result = await session.current.reply(buildChatMessages(history, sources), {
        signal: controller.signal,
        onToken: (token) => setTurns((current) => current.map((turn) => turn.id === responseId ? { ...turn, content: turn.content + token } : turn)),
      });
      if (result?.truncated) setTurns((current) => current.map((turn) => turn.id === responseId ? { ...turn, truncated: true } : turn));
      setNotice(result?.truncated ? "Reply reached its length limit. You can ask a follow-up question." : "Reply complete. Check the source records for local facts.");
    } catch (failure) {
      const stopped = failure.name === "AbortError";
      setTurns((current) => current.map((turn) => turn.id === responseId ? { ...turn, stopped, failed: !stopped } : turn));
      if (!stopped) {
        setError("The reply could not finish. Try a shorter question, or start a new conversation.");
        setQuestion(text);
      }
      setNotice(stopped ? "Reply stopped." : "");
    } finally {
      if (operation.current === controller) {
        operation.current = null;
        setStage("ready");
      }
    }
  }
  async function unload(forget = false) {
    if (busy) return;
    setStage("forgetting");
    setError("");
    try {
      const current = session.current;
      session.current = null;
      if (forget) {
        // A cancelled/failed download can also leave cached shards to remove.
        await current?.dispose();
        const runtime = await import("./localRuntime");
        await runtime.clearModelCache();
      } else await current?.dispose();
      setTurns([]);
      setNotice(forget ? "Downloaded model files removed." : "Model unloaded. Browser memory released.");
    } catch {
      setError("The cached files could not be removed. Try clearing this site's storage in your browser settings.");
    } finally {
      setStage(variants.length ? "choose" : "intro");
    }
  }

  return (
    <dialog id="scd-local-chat" className="local-chat" ref={dialog} aria-labelledby="local-chat-title" onCancel={(event) => { event.preventDefault(); close(); }}>
      <header className="local-chat-heading">
        <div><span className="journal-kicker">ON YOUR DEVICE</span><h2 id="local-chat-title">Ask SC Digital</h2></div>
        <button type="button" onClick={close} aria-label="Close local chat" autoFocus><UiIcon name="close" /></button>
      </header>
      <div className="local-chat-body">
        <p className="local-chat-intro">A local assistant for news, city decisions and the stories close to home. Answers are generated by AI; check the linked records.</p>
        <details className="local-chat-model">
          <summary>Model & privacy</summary>
          <p><a href={MODEL_PAGE} target="_blank" rel="noreferrer">{MODEL_REPO}</a></p>
          <p>WebGPU runs the model on your device. Messages are kept in this tab and never sent to our chat server. Hugging Face receives requests for the model list and downloads. Downloaded files are cached in your browser until removed.</p>
        </details>
        {error && <p className="local-chat-error" role="alert">{error}</p>}
        <p className="local-chat-status" role="status" aria-live="polite">{notice || (stage === "replying" ? "Writing a reply…" : stage === "checking" ? "Checking WebGPU and model files…" : stage === "forgetting" ? "Releasing model storage…" : "")}</p>
        {stage === "intro" && <div className="local-chat-setup">
          <p>The 9B model needs a capable desktop and several gigabytes of free memory and storage. You’ll see the exact download size before starting.</p>
          <button className="journal-button" onClick={catalog}>Check browser & model files</button>
        </div>}
        {stage === "checking" && <button className="local-chat-secondary" onClick={cancel}>Cancel check</button>}
        {stage === "choose" && model && <div className="local-chat-setup">
          <label htmlFor="local-chat-variant">Model download</label>
          <select id="local-chat-variant" value={selected} onChange={(event) => setSelected(event.target.value)}>
            {variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.label} · {formatBytes(variant.bytes)} · {variant.shards} {variant.shards === 1 ? "file" : "files"}</option>)}
          </select>
          <p>{formatBytes(model.bytes)} download the first time. Loading may take several minutes. Cached files can be reused; enough working memory is still required.</p>
          <button className="journal-button" onClick={load}>Download & start local chat</button>
          <button className="local-chat-secondary" onClick={catalog}>Refresh model files</button>
        </div>}
        {stage === "loading" && <div className="local-chat-setup">
          <p role="status">{progress?.stage === "initialize" ? "Download complete. Preparing the model on your GPU…" : `Downloading model: ${formatBytes(progress?.loaded)} of ${formatBytes(progress?.total)}`}</p>
          <progress aria-label="Model download progress" max="1" value={progress?.total ? Math.min(1, progress.loaded / progress.total) : undefined} />
          <button className="local-chat-secondary" onClick={cancel}>Cancel loading</button>
        </div>}
        {["ready", "replying"].includes(stage) && <>
          <div className="local-chat-conversation" ref={output} role="region" aria-label="Chat conversation" tabIndex="0">
            {!turns.length && <p>Ask about a street, a planning notice or a council decision. Relevant site records will appear with the answer.</p>}
            {turns.map((turn, index) => <article className={`local-chat-turn local-chat-turn--${turn.role}`} key={turn.id || index} aria-label={turn.role === "user" ? "Your message" : "Assistant reply"}>
              <span className="journal-kicker">{turn.role === "user" ? "YOU" : "SC DIGITAL · AI"}</span>
              <p>{turn.content || (turn.failed ? "No reply was generated." : turn.stopped ? "Reply stopped." : "Thinking…")}</p>
              {turn.stopped && turn.content && <small>Reply stopped before completion.</small>}
              {turn.failed && turn.content && <small>This reply could not finish.</small>}
              {turn.truncated && <small>Reply reached its length limit.</small>}
              {!!turn.sources?.length && <div className="local-chat-sources"><span>Related records</span>{turn.sources.map((source) => <Link key={source.id} to={source.href} onClick={close}>{source.title}</Link>)}</div>}
            </article>)}
          </div>
          <form className="local-chat-composer" onSubmit={send}>
            <label htmlFor="local-chat-question">Your question</label>
            <textarea id="local-chat-question" ref={input} rows="3" maxLength="1500" value={question} onChange={(event) => setQuestion(event.target.value)} disabled={stage === "replying"} placeholder="What’s happening on Ontario Street?" />
            {stage === "replying" ? <button type="button" className="journal-button" onClick={() => operation.current?.abort()}>Stop reply</button> : <button className="journal-button" disabled={!question.trim()}>Send question <UiIcon name="arrow" /></button>}
          </form>
          <div className="local-chat-tools"><button disabled={busy} onClick={() => { setTurns([]); setQuestion(""); setError(""); setNotice("New conversation started."); input.current?.focus(); }}>New conversation</button><button disabled={busy} onClick={() => unload()}>Unload model</button></div>
        </>}
        <button className="local-chat-secondary" disabled={busy} onClick={() => unload(true)}>Remove downloaded model files</button>
        <nav className="local-chat-links" aria-label="Find answers on the site"><Link to="/search" onClick={close}>Search the site</Link><Link to="/contact" onClick={close}>Contact the newsroom</Link></nav>
      </div>
    </dialog>
  );
}
