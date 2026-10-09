import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getPublication,
  filterPublication,
  TOPICS,
} from "../../data/publication";
import { CITIES } from "../../data/cities";
import Story from "./Story";
import { useLiveNow } from "../../hooks/useLiveNow.js";
import {
  getSearchIndex,
  searchSite,
  SEARCH_SECTIONS,
} from "../../data/searchIndex";
import UiIcon from "./UiIcon";
export default function NewsFeed({ city = "", search = false }) {
  const now = useLiveNow();
  const [params, setParams] = useSearchParams();
  const query = Object.fromEntries(params);
  const inputId = useId();
  const resultsRef = useRef(null);
  const [searchText, setSearchText] = useState(query.q || "");
  useEffect(() => setSearchText(query.q || ""), [query.q]);
  const invalidDates = Boolean(query.from && query.to && query.from > query.to);
  const results = invalidDates
    ? []
    : (search ? searchSite : filterPublication)(
        search ? getSearchIndex(now) : getPublication(now),
        {
          ...query,
          city: city || query.city,
        },
      );
  const pages = Math.max(1, Math.ceil(results.length / 12));
  const page = Math.min(
    pages,
    Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
  );
  function change(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    if (key === "section") next.delete("kind");
    setParams(next);
  }
  const activeFilters = Object.entries(query).filter(
    ([key, value]) =>
      value &&
      ["q", "city", "topic", "kind", "section", "from", "to"].includes(key) &&
      !(city && key === "city"),
  );
  const filterLabels = {
    q: "Search",
    city: "City",
    topic: "Topic",
    kind: "Content",
    section: "Section",
    from: "From",
    to: "To",
  };
  function changePage(value) {
    const next = new URLSearchParams(params);
    next.set("page", String(value));
    setParams(next);
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({ block: "start" });
    });
  }
  return (
    <>
      <form
        className="journal-filters"
        role="search"
        aria-label={search ? "Search the site" : "Filter news coverage"}
        onSubmit={(e) => {
          e.preventDefault();
          change("q", searchText.trim());
        }}
      >
        <div className="journal-filter-query">
          <label htmlFor={inputId}>
            {search ? "Search the whole site" : "Search coverage"}
          </label>
          <div>
            <input
              id={inputId}
              type="search"
              name="q"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              maxLength={200}
              placeholder="A street, city, or topic…"
            />
            <button type="submit" className="journal-button">
              <UiIcon name="search" size={16} /> Search
            </button>
          </div>
        </div>
        {search && (
          <label>
            Section
            <select
              aria-label="Section"
              value={query.section || ""}
              onChange={(event) => change("section", event.target.value)}
            >
              <option value="">Everything</option>
              {SEARCH_SECTIONS.map((section) => (
                <option key={section}>{section}</option>
              ))}
            </select>
          </label>
        )}
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
        {!search && (
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
        )}
        <details
          className="journal-date-filter"
          open={query.from || query.to ? true : undefined}
        >
          <summary>Date range</summary>
          <div>
            <label>
              From
              <input
                type="date"
                value={query.from || ""}
                max={query.to || undefined}
                onChange={(e) => change("from", e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={query.to || ""}
                min={query.from || undefined}
                onChange={(e) => change("to", e.target.value)}
              />
            </label>
          </div>
        </details>
        {invalidDates && (
          <p className="journal-filter-error" role="alert">
            The start date must be on or before the end date.
          </p>
        )}
      </form>
      {activeFilters.length > 0 && (
        <div className="journal-filter-chips" aria-label="Applied filters">
          {activeFilters.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => change(key, "")}
              aria-label={`Remove ${filterLabels[key].toLowerCase()} filter: ${value}`}
            >
              {filterLabels[key]}: {value}
              <UiIcon name="close" size={14} />
            </button>
          ))}
        </div>
      )}
      {search && !query.q && (
        <div className="journal-search-suggestions">
          <span>Try a local search</span>
          {["Port Dalhousie", "housing", "Thomas Street"].map((term) => (
            <button type="button" key={term} onClick={() => change("q", term)}>
              {term}
              <UiIcon name="arrow" size={14} />
            </button>
          ))}
        </div>
      )}
      <div className="journal-results-meta" ref={resultsRef} tabIndex={-1}>
        <p role="status">
          {results.length} {results.length === 1 ? "record" : "records"}
          {query.q ? ` matching “${query.q}”` : ""}
          {results.length > 12
            ? ` · Showing ${(page - 1) * 12 + 1}–${Math.min(page * 12, results.length)}`
            : ""}
        </p>
        {activeFilters.length > 0 && (
          <button className="journal-link" onClick={() => setParams({})}>
            Clear filters
          </button>
        )}
        <a href="/rss.xml">
          RSS feed <UiIcon name="external" size={16} />
        </a>
      </div>
      <p className="journal-small">
        {search
          ? "Search news, development files, civic meetings and local guides. Check the official source for current details."
          : "Dated records appear newest first. Links without a source publication date appear afterward."}
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
          <p>
            {invalidDates
              ? "Correct the date range above to see matching records."
              : "Try fewer words, a street name, or another city. You can also remove the filters above."}
          </p>
          <div className="journal-actions">
            {activeFilters.length > 0 && (
              <button type="button" onClick={() => setParams({})}>
                Reset search
              </button>
            )}
            <Link className="journal-link" to="/planning-tracker">
              Browse development records <UiIcon />
            </Link>
          </div>
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
}
