import { useState, useEffect, useRef } from "react";
import {
  Outlet,
  useLocation,
  Link,
  NavLink,
  useNavigationType,
} from "react-router-dom";
import { SavedStoriesProvider } from "./journal/SavedStories";
import { CITIES } from "../data/cities";
const SECTIONS = [
  ["/news", "News"],
  ["/council", "City Hall"],
  ["/planning-tracker", "Development"],
  ["/events", "What’s On"],
  ["/explore", "Explore"],
];
const editions = [...CITIES].sort((a, b) =>
  a.slug === "st-catharines"
    ? -1
    : b.slug === "st-catharines"
      ? 1
      : a.name.localeCompare(b.name),
);
export default function Layout() {
  const [menu, setMenu] = useState(false),
    [theme, setTheme] = useState("light"),
    [preference, setPreference] = useState("system"),
    [edition, setEdition] = useState("st-catharines");
  const location = useLocation(),
    navigationType = useNavigationType(),
    menuButton = useRef(null),
    positions = useRef(new Map());
  useEffect(() => {
    try {
      setPreference(
        localStorage.getItem("theme-v3") ||
          localStorage.getItem("theme-v2") ||
          "system",
      );
      const value = localStorage.getItem("scd-edition");
      if (editions.some((x) => x.slug === value)) setEdition(value);
    } catch {}
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      setTheme(next);
      document.documentElement.dataset.theme = next;
      document.body.classList.toggle("light", next === "light");
      document.body.classList.add("news-mode");
    };
    apply();
    media.addEventListener?.("change", apply);
    try {
      localStorage.setItem("theme-v3", preference);
    } catch {}
    return () => media.removeEventListener?.("change", apply);
  }, [preference]);
  useEffect(() => {
    setMenu(false);
    const frame = requestAnimationFrame(() => {
      if (location.hash)
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else
        window.scrollTo(
          0,
          navigationType === "POP"
            ? positions.current.get(location.key) || 0
            : 0,
        );
    });
    const save = () => positions.current.set(location.key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
    };
  }, [location.key, location.hash, navigationType]);
  useEffect(() => {
    if (!menu) return;
    const escape = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [menu]);
  function chooseEdition(value) {
    setEdition(value);
    try {
      localStorage.setItem("scd-edition", value);
    } catch {}
  }
  return (
    <SavedStoriesProvider>
      <div className={`news-root journal-root is-${theme}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <header className="journal-header">
          <div className="journal-utility">
            <span>LOCAL ROOTS. A WIDER VIEW.</span>
            <div>
              <Link to="/saved">Saved stories</Link>
              <Link to="/search">
                Search <span aria-hidden="true">⌕</span>
              </Link>
              <label className="journal-theme">
                <span className="visually-hidden">Colour theme</span>
                <select
                  aria-label="Colour theme"
                  value={preference}
                  onChange={(e) => setPreference(e.target.value)}
                >
                  <option value="system">System theme</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
          </div>
          <div className="journal-masthead">
            <div className="journal-edition">
              <span>THE NIAGARA EDITION</span>
              <time suppressHydrationWarning>
                {new Date().toLocaleDateString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/Toronto",
                })}
              </time>
            </div>
            <Link
              className="journal-wordmark"
              to="/"
              aria-label="St. Catharines Digital home"
            >
              St. Catharines
              <span>
                Digital<span className="journal-brand-dot">.</span>
              </span>
            </Link>
            <Link
              className="journal-button journal-subscribe"
              to="/planning-alerts"
            >
              Stay in the know <span aria-hidden="true">↗</span>
            </Link>
            <button
              className="journal-menu-button"
              ref={menuButton}
              aria-expanded={menu}
              aria-controls="journal-mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? "Close ×" : "Menu ☰"}
            </button>
          </div>
          <div className="journal-nav-wrap">
            <nav className="journal-nav" aria-label="Primary">
              {SECTIONS.map(([path, label]) => (
                <NavLink key={path} to={path}>
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="journal-city-select">
              <label htmlFor="edition">Your city</label>
              <select
                id="edition"
                value={edition}
                onChange={(e) => chooseEdition(e.target.value)}
              >
                {editions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Link
                to={`/news/${edition}`}
                aria-label="Open selected city edition"
              >
                →
              </Link>
            </div>
          </div>
          {menu && (
            <nav
              className="journal-mobile-menu"
              id="journal-mobile-menu"
              aria-label="Mobile navigation"
            >
              {[
                ...SECTIONS,
                ["/search", "Search"],
                ["/saved", "Saved stories"],
                ["/reader-services", "Reader services"],
                ["/votes", "Elections"],
                ["/police", "Public safety"],
              ].map(([path, label]) => (
                <Link key={path} to={path}>
                  {label} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </nav>
          )}
        </header>
        <main id="main-content" className="scd-main" tabIndex="-1">
          <Outlet />
        </main>
        <footer className="journal-footer">
          <div className="journal-footer-top">
            <div>
              <Link to="/" className="journal-wordmark">
                St. Catharines<span>Digital.</span>
              </Link>
              <p>
                Close to home.
                <br />
                Connected to the source.
              </p>
            </div>
            <div>
              <h2>Read & discover</h2>
              {SECTIONS.map(([path, label]) => (
                <Link key={path} to={path}>
                  {label}
                </Link>
              ))}
              <Link to="/votes">Elections</Link>
              <Link to="/police">Public safety</Link>
            </div>
            <div>
              <h2>Your community</h2>
              {editions.map((c) => (
                <Link key={c.slug} to={`/news/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
              <Link to="/contact">Send a news tip</Link>
              <Link to="/contact?subject=Event%20submission">
                Submit an event
              </Link>
            </div>
            <div>
              <h2>Reader services</h2>
              <Link to="/planning-alerts">Newsletters & alerts</Link>
              <Link to="/saved">Saved stories</Link>
              <Link to="/corrections">Report a correction</Link>
              <Link to="/about">About & ownership</Link>
              <Link to="/editorial-policy">Editorial policy</Link>
              <Link to="/accessibility">Accessibility</Link>
              <a href="/rss.xml">RSS feed ↗</a>
            </div>
          </div>
          <div className="journal-footer-bottom">
            <span>© {new Date().getFullYear()} St. Catharines Digital</span>
            <div>
              <Link to="/reader-services">Reader services</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </SavedStoriesProvider>
  );
}
