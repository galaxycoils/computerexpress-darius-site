import { useEffect, useState } from "react";
import Seo from "../components/Seo";

const TOKEN_KEY = "scd-editorial-token-v1";
const STATUSES = ["pending", "reviewing", "accepted", "rejected", "closed"];
function api(path, token, options = {}) {
  return fetch(path, { ...options, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers } });
}

export default function EditorialDeskPage() {
  const [token, setToken] = useState(() => typeof window === "undefined" ? "" : sessionStorage.getItem(TOKEN_KEY) || "");
  const [draft, setDraft] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function load(accessToken = token) {
    if (!accessToken) return;
    setLoading(true); setError("");
    try {
      const [submissions, health] = await Promise.all([api("/api/editorial/submissions", accessToken), api("/api/editorial/health", accessToken)]);
      if (!submissions.ok || !health.ok) throw new Error("Access was not accepted. Check the editorial access code.");
      setData({ ...(await submissions.json()), health: await health.json() });
      sessionStorage.setItem(TOKEN_KEY, accessToken); setToken(accessToken);
    } catch (err) { setError(err.message); setData(null); }
    finally { setLoading(false); }
  }
  useEffect(() => { if (token) load(token); }, []);
  async function update(id, status) {
    const response = await api("/api/editorial/submissions", token, { method: "PATCH", body: JSON.stringify({ id, status }) });
    if (!response.ok) { setError("The status could not be saved."); return; }
    load(token);
  }
  return <div className="scd-page journal-page">
    <Seo title="Editorial desk | St. Catharines Digital" path="/editorial" noIndex />
    <header className="journal-page-heading"><p className="journal-kicker">Private workspace</p><h1>Editorial desk</h1><p>Review reader submissions and monitor consent states. This page does not publish content.</p></header>
    {!data ? <form className="journal-filters" onSubmit={event => { event.preventDefault(); load(draft); }}>
      <label>Editorial access code<input type="password" autoComplete="current-password" value={draft} onChange={event => setDraft(event.target.value)} required /></label>
      <button className="journal-button" disabled={loading}>{loading ? "Opening…" : "Open desk"}</button>
      {error && <p role="alert">{error}</p>}
    </form> : <>
      <div className="journal-results-meta"><p>Signed in as {data.role}.</p><button className="journal-link" onClick={() => { sessionStorage.removeItem(TOKEN_KEY); setToken(""); setDraft(""); setData(null); }}>Sign out</button></div>
      <section className="journal-prose"><h2>Operational counts</h2><p>Submissions: {data.health.submissions.map(item => `${item.status} ${item.count}`).join(" · ") || "none"}</p><p>Newsletter: {data.health.newsletter.map(item => `${item.status} ${item.count}`).join(" · ") || "none"}</p></section>
      <section className="journal-feed" aria-label="Reader submissions">{data.submissions.length ? data.submissions.map(item => <article className="journal-story" key={item.id}><p className="journal-kicker">{item.kind} / {item.status}</p><h2>{item.name}</h2><p><a href={`mailto:${item.email}`}>{item.email}</a></p><p>{item.message}</p>{item.source_url && <p><a href={item.source_url}>Submitted source ↗</a></p>}{data.role === "admin" && <label>Review status<select value={item.status} onChange={event => update(item.id, event.target.value)}>{STATUSES.map(status => <option key={status}>{status}</option>)}</select></label>}</article>) : <div className="journal-empty"><h2>No submissions</h2><p>New contacts, event suggestions and accessibility feedback appear here.</p></div>}</section>
    </>}
  </div>;
}
