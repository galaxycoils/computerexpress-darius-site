import { useSearchParams, Link } from "react-router-dom";
import {
  getPublication,
  filterPublication,
  TOPICS,
} from "../../data/publication";
import { CITIES } from "../../data/cities";
import Story from "./Story";
export default function NewsFeed({ city = "", search = false }) {
  const [params, setParams] = useSearchParams();
  const query = Object.fromEntries(params);
  const results = filterPublication(getPublication(), {
    ...query,
    city: city || query.city,
  });
  const pages = Math.max(1, Math.ceil(results.length / 12));
  const page = Math.min(
    pages,
    Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
  );
  function change(key, value) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    next.delete("page");
    setParams(next);
  }
  return (
    <>
      <form
        className="journal-filters"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          change("q", new FormData(e.currentTarget).get("q"));
        }}
      >
        <label className="journal-filter-query">
          Search coverage
          <div>
            <input
              key={query.q || ""}
              type="search"
              name="q"
              defaultValue={query.q || ""}
              placeholder="A street, city, or topic…"
            />
            <button type="submit" className="journal-button">
              Search
            </button>
          </div>
        </label>
        {!city && (
          <label>
            City
            <select
              aria-label="City"
              value={query.city || ""}
              onChange={(e) => change("city", e.target.value)}
            >
              <option value="">All Niagara</option>
              {CITIES.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
              <option>Niagara Region</option>
            </select>
          </label>
        )}
        <label>
          Topic
          <select
            aria-label="Topic"
            value={query.topic || ""}
            onChange={(e) => change("topic", e.target.value)}
          >
            <option value="">All topics</option>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Content
          <select
            aria-label="Content"
            value={query.kind || ""}
            onChange={(e) => change("kind", e.target.value)}
          >
            <option value="">All types</option>
            {[
              "Source brief",
              "Official notice",
              "Official release",
              "Official source link",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <details className="journal-date-filter">
          <summary>Date range</summary>
          <div>
            <label>
              From
              <input
                type="date"
                value={query.from || ""}
                onChange={(e) => change("from", e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={query.to || ""}
                onChange={(e) => change("to", e.target.value)}
              />
            </label>
          </div>
        </details>
      </form>
      <div className="journal-results-meta">
        <p role="status">
          {results.length} {results.length === 1 ? "record" : "records"}
          {query.q ? ` matching “${query.q}”` : ""}
        </p>
        {params.size > 0 && (
          <button className="journal-link" onClick={() => setParams({})}>
            Clear filters
          </button>
        )}
        <a href="/rss.xml">RSS feed ↗</a>
      </div>
      <p className="journal-small">
        Dated records appear newest first. Links without a source publication
        date appear afterward.
      </p>
      {results.length ? (
        <div className="journal-feed">
          {results.slice((page - 1) * 12, page * 12).map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="journal-empty">
          <h2>No matching records</h2>
          <p>Try a broader topic or remove a date filter.</p>
          <Link to="/planning-tracker">Browse development records →</Link>
        </div>
      )}
      {pages > 1 && (
        <nav className="journal-pagination" aria-label="Results pages">
          <button disabled={page === 1} onClick={() => changePage(page - 1)}>
            ← Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => changePage(page + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </>
  );
  function changePage(value) {
    const next = new URLSearchParams(params);
    next.set("page", String(value));
    setParams(next);
    document
      .querySelector(".journal-filters")
      ?.scrollIntoView({ block: "start" });
  }
}
