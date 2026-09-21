import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Seo, { BASE_URL } from "../components/Seo";
import {
  planningNotices,
  noticeCategories,
  municipalities,
  getNoticeStats,
  getUpcomingMeetings,
  getActiveNotices,
} from "../data/planningNotices";
import { siteConfig } from "../data/siteConfig";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...(date.getHours() || date.getMinutes()
        ? { hour: "numeric", minute: "2-digit" }
        : {}),
    });
  } catch {
    return dateStr;
  }
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Past";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays <= 14) return `In 1 week`;
    if (diffDays <= 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return formatDate(dateStr);
  } catch {
    return "";
  }
}

function CategoryBadge({ category }) {
  const cat = noticeCategories.find((c) => c.key === category);
  if (!cat) return <span className="badge badge-default">{category}</span>;
  return (
    <span
      className="badge badge-cat"
      style={{ "--badge-tint": cat.color || "var(--signal)" }}
      title={cat.label}
    >
      {cat.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    "Public Meeting Scheduled": {
      label: "Meeting Scheduled",
      color: "var(--primary)",
    },
    "Hearing Scheduled": { label: "Hearing Scheduled", color: "var(--accent)" },
    "Meeting Complete": { label: "Meeting Complete", color: "var(--success)" },
    "Hearing Complete": { label: "Hearing Complete", color: "var(--success)" },
    Approved: { label: "Approved", color: "var(--success)" },
    Active: { label: "Active", color: "var(--info)" },
    "Under Construction": {
      label: "Under Construction",
      color: "var(--warning)",
    },
    "Pre-construction": { label: "Pre-construction", color: "var(--warning)" },
    Complete: { label: "Complete", color: "var(--muted)" },
    "Open House Complete": {
      label: "Open House Complete",
      color: "var(--success)",
    },
    "Application Complete": {
      label: "Application Complete",
      color: "var(--info)",
    },
    "Meeting Scheduled": {
      label: "Meeting Scheduled",
      color: "var(--primary)",
    },
  };
  const config = statusConfig[status] || {
    label: status,
    color: "var(--muted)",
  };
  return (
    <span
      className="badge badge-status"
      style={{ "--badge-tint": config.color }}
      title={config.label}
    >
      {config.label}
    </span>
  );
}

export default function PlanningTrackerPage() {
  const [search, setSearch] = useState("");
  const [municipalityFilter, setMunicipalityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [viewMode, setViewMode] = useState("table");

  const stats = useMemo(() => getNoticeStats(), []);
  const upcomingMeetings = useMemo(() => getUpcomingMeetings(), []);

  const filteredNotices = useMemo(() => {
    let result = planningNotices;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(s) ||
          n.description.toLowerCase().includes(s) ||
          n.municipality.toLowerCase().includes(s) ||
          n.fileNumber?.toLowerCase().includes(s) ||
          n.tags?.some((t) => t.toLowerCase().includes(s)),
      );
    }
    if (municipalityFilter !== "all") {
      result = result.filter((n) =>
        n.municipality.toLowerCase().includes(municipalityFilter.toLowerCase()),
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((n) => n.category === categoryFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((n) => n.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "date":
          aVal = new Date(a.publishedDate || 0).getTime();
          bVal = new Date(b.publishedDate || 0).getTime();
          break;
        case "meeting":
          aVal = a.meetingDate ? new Date(a.meetingDate).getTime() : 0;
          bVal = b.meetingDate ? new Date(b.meetingDate).getTime() : 0;
          break;
        case "municipality":
          aVal = a.municipality;
          bVal = b.municipality;
          break;
        case "category":
          aVal = a.category;
          bVal = b.category;
          break;
        default:
          aVal = new Date(a.publishedDate || 0).getTime();
          bVal = new Date(b.publishedDate || 0).getTime();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [
    search,
    municipalityFilter,
    categoryFilter,
    statusFilter,
    sortBy,
    sortDir,
  ]);

  const uniqueStatuses = useMemo(
    () => [...new Set(planningNotices.map((n) => n.status))].sort(),
    [],
  );

  return (
    <>
      <Seo
        title="Planning Tracker | St. Catharines Digital"
        description="Official planning notices, zoning changes, and public meetings for St. Catharines, Welland, Thorold, and Niagara Region. Sourced exclusively from municipal websites."
        path="/planning-tracker"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Planning & Development Tracker",
          url: BASE_URL,
        }}
      />
      <div className="planning-tracker-page">
        <nav className="scd-article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Planning tracker</span>
        </nav>
        <header className="page-header">
          <div className="container">
            <h1>Planning & Development Tracker</h1>
            <p className="page-subtitle">
              Official notices from St. Catharines, Welland, Thorold, and
              Niagara Region. Sourced exclusively from municipal websites.
              Updated weekly.
            </p>
            <div className="stats-bar">
              <div className="stat">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">Total Notices</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.active}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat">
                <span className="stat-value">{stats.upcomingMeetings}</span>
                <span className="stat-label">Upcoming Meetings</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  {Object.keys(stats.byMunicipality).length}
                </span>
                <span className="stat-label">Municipalities</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container">
          <section
            className="filters-section"
            aria-label="Filter planning notices"
          >
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="search" className="visually-hidden">
                  Search notices
                </label>
                <input
                  type="search"
                  id="search"
                  className="filter-input filter-search"
                  placeholder="Search by address, file number, keyword…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="municipality" className="visually-hidden">
                  Filter by municipality
                </label>
                <select
                  id="municipality"
                  className="filter-select"
                  value={municipalityFilter}
                  onChange={(e) => setMunicipalityFilter(e.target.value)}
                >
                  <option value="all">All Municipalities</option>
                  {municipalities.map((m) => (
                    <option key={m.key} value={m.key.toLowerCase()}>
                      {m.label}
                    </option>
                  ))}
                  <option value="niagara-region">Niagara Region</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="category" className="visually-hidden">
                  Filter by category
                </label>
                <select
                  id="category"
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {noticeCategories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="status" className="visually-hidden">
                  Filter by status
                </label>
                <select
                  id="status"
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {uniqueStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group filter-sort">
                <label htmlFor="sort" className="visually-hidden">
                  Sort by
                </label>
                <select
                  id="sort"
                  className="filter-select filter-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Published Date</option>
                  <option value="meeting">Meeting Date</option>
                  <option value="municipality">Municipality</option>
                  <option value="category">Category</option>
                </select>
                <button
                  className="filter-sort-dir"
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
                  aria-label={
                    sortDir === "asc" ? "Sort descending" : "Sort ascending"
                  }
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>
              <div className="filter-group filter-view">
                <button
                  className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  aria-pressed={viewMode === "table"}
                  title="Table view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  aria-pressed={viewMode === "cards"}
                  title="Card view"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6M9 15h4" />
                  </svg>
                </button>
              </div>
            </div>
            {(search ||
              municipalityFilter !== "all" ||
              categoryFilter !== "all" ||
              statusFilter !== "all") && (
              <div className="active-filters">
                <span>Active filters:</span>
                {search && (
                  <span className="filter-chip" onClick={() => setSearch("")}>
                    Search: "{search}" ×
                  </span>
                )}
                {municipalityFilter !== "all" && (
                  <span
                    className="filter-chip"
                    onClick={() => setMunicipalityFilter("all")}
                  >
                    Municipality: {municipalityFilter} ×
                  </span>
                )}
                {categoryFilter !== "all" && (
                  <span
                    className="filter-chip"
                    onClick={() => setCategoryFilter("all")}
                  >
                    Category:{" "}
                    {noticeCategories.find((c) => c.key === categoryFilter)
                      ?.label || categoryFilter}{" "}
                    ×
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span
                    className="filter-chip"
                    onClick={() => setStatusFilter("all")}
                  >
                    Status: {statusFilter} ×
                  </span>
                )}
                <button
                  className="filter-chip filter-clear"
                  onClick={() => {
                    setSearch("");
                    setMunicipalityFilter("all");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear all
                </button>
              </div>
            )}
          </section>

          {upcomingMeetings.length > 0 && (
            <section
              className="upcoming-meetings"
              aria-labelledby="upcoming-heading"
            >
              <h2 id="upcoming-heading">Upcoming Public Meetings & Hearings</h2>
              <div className="meetings-list">
                {upcomingMeetings.slice(0, 5).map((notice) => (
                  <article key={notice.id} className="meeting-card">
                    <div className="meeting-meta">
                      <CategoryBadge category={notice.category} />
                      <span className="meeting-municipality">
                        {notice.municipality}
                      </span>
                    </div>
                    <h3 className="meeting-title">
                      <Link to={`/development/${notice.id}`}>
                        {notice.title}
                      </Link>
                    </h3>
                    <p className="meeting-desc">{notice.description}</p>
                    <div className="meeting-details">
                      {notice.meetingDate && (
                        <span className="meeting-detail">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          <span>{formatDate(notice.meetingDate)}</span>
                          <span className="meeting-relative">
                            ({formatRelativeDate(notice.meetingDate)})
                          </span>
                        </span>
                      )}
                      {notice.meetingLocation && (
                        <span className="meeting-detail">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{notice.meetingLocation}</span>
                        </span>
                      )}
                      {notice.submissionDeadline && (
                        <span className="meeting-detail deadline">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                          <span>
                            Submission deadline:{" "}
                            {formatDate(notice.submissionDeadline)}
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="meeting-actions">
                      <a
                        href={notice.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-ghost button-sm"
                      >
                        View Official Notice
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="results-section" aria-label="Planning notices">
            <div className="results-header">
              <h2>
                {filteredNotices.length} notice
                {filteredNotices.length !== 1 ? "s" : ""} found
              </h2>
              <p className="results-hint">
                Data sourced from{" "}
                <a
                  href="https://www.stcatharines.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  stcatharines.ca
                </a>
                ,{" "}
                <a
                  href="https://www.welland.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  welland.ca
                </a>
                ,{" "}
                <a
                  href="https://www.thorold.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  thorold.ca
                </a>
                ,{" "}
                <a
                  href="https://www.niagararegion.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  niagararegion.ca
                </a>
                .
              </p>
            </div>

            {viewMode === "table" ? (
              <div
                className="table-wrapper"
                role="region"
                aria-label="Planning notices table"
                tabIndex={0}
              >
                <table className="planning-table">
                  <thead>
                    <tr>
                      <th scope="col">Title / Description</th>
                      <th scope="col">Municipality</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Meeting / Effective</th>
                      <th scope="col">Published</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.map((notice) => (
                      <tr key={notice.id}>
                        <td className="col-title">
                          <strong>
                            <Link to={`/development/${notice.id}`}>
                              {notice.title}
                            </Link>
                          </strong>
                          <p className="notice-desc">{notice.description}</p>
                          {notice.fileNumber && (
                            <span className="file-number">
                              File: {notice.fileNumber}
                            </span>
                          )}
                          {notice.tags && notice.tags.length > 0 && (
                            <div className="notice-tags">
                              {notice.tags.slice(0, 4).map((tag) => (
                                <span key={tag} className="tag">
                                  {tag}
                                </span>
                              ))}
                              {notice.tags.length > 4 && (
                                <span className="tag more">
                                  +{notice.tags.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="col-municipality">
                          {notice.municipality}
                        </td>
                        <td className="col-category">
                          <CategoryBadge category={notice.category} />
                        </td>
                        <td className="col-status">
                          <StatusBadge status={notice.status} />
                        </td>
                        <td className="col-meeting">
                          {notice.meetingDate ? (
                            <>
                              <time dateTime={notice.meetingDate}>
                                {formatDate(notice.meetingDate)}
                              </time>
                              <span className="relative">
                                {formatRelativeDate(notice.meetingDate)}
                              </span>
                            </>
                          ) : (
                            <span className="no-date">—</span>
                          )}
                        </td>
                        <td className="col-published">
                          <time dateTime={notice.publishedDate}>
                            {formatDate(notice.publishedDate)}
                          </time>
                        </td>
                        <td className="col-actions">
                          <a
                            href={notice.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button-ghost button-sm"
                          >
                            View Source
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="cards-grid" role="list">
                {filteredNotices.map((notice) => (
                  <article
                    key={notice.id}
                    className="notice-card"
                    role="listitem"
                  >
                    <div className="meeting-meta">
                      <CategoryBadge category={notice.category} />
                      <span className="meeting-municipality">
                        {notice.municipality}
                      </span>
                    </div>
                    <h3 className="meeting-title">
                      <Link to={`/development/${notice.id}`}>
                        {notice.title}
                      </Link>
                    </h3>
                    <p className="meeting-desc">{notice.description}</p>
                    <div className="meeting-actions">
                      <StatusBadge status={notice.status} />
                      <a
                        href={notice.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button-primary button-sm"
                      >
                        Official Notice
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {filteredNotices.length === 0 && (
              <div className="no-results">
                <h3>No notices match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
                <button
                  className="button button-primary"
                  onClick={() => {
                    setSearch("");
                    setMunicipalityFilter("all");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
