import { Suspense, useState, useEffect, useRef } from "react";
import {
  Outlet,
  useLocation,
  Link,
  NavLink,
  useNavigationType,
} from "react-router-dom";
import {
  SavedStoriesProvider,
  SavedStoriesAnnouncement,
} from "./journal/SavedStories";
import UiIcon from "./journal/UiIcon";
import RouteAccessibility from "./RouteAccessibility";
import ErrorBoundary from "./ErrorBoundary";
import { CITIES } from "../data/cities";
import { useLiveNow } from "../hooks/useLiveNow.js";
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
  const now = useLiveNow();
  const [menu, setMenu] = useState(false),
    [theme, setTheme] = useState("light"),
    [preference, setPreference] = useState("system"),
    [preferencesReady, setPreferencesReady] = useState(false),
    [edition, setEdition] = useState("st-catharines");
  const location = useLocation(),
    navigationType = useNavigationType(),
    menuButton = useRef(null),
    menuPanel = useRef(null),
    previousPath = useRef(location.pathname),
    positions = useRef(new Map());
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("theme-v3") ||
        localStorage.getItem("theme-v2") ||
        "system";
      setPreference(
        ["system", "light", "dark"].includes(stored) ? stored : "system",
      );
      const value = localStorage.getItem("scd-edition");
      if (editions.some((x) => x.slug === value)) setEdition(value);
    } catch {}
    setPreferencesReady(true);
  }, []);
  useEffect(() => {
    if (!preferencesReady) return;
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
      document.documentElement.style.colorScheme = next;
      document.body.classList.toggle("light", next === "light");
      document.body.classList.add("news-mode");
    };
    apply();
    media.addEventListener?.("change", apply);
    try {
      localStorage.setItem("theme-v3", preference);
    } catch {}
    return () => media.removeEventListener?.("change", apply);
  }, [preference, preferencesReady]);
  useEffect(() => {
    setMenu(false);
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const frame = requestAnimationFrame(() => {
      if (!location.hash && (changedPage || navigationType === "POP"))
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
      // Reading positions.current during cleanup is intentional. `positions` is a
      // useRef(new Map()) that is never reassigned, so the Map identity is stable
      // for the component's life; this saves the final scroll offset for the
      // location being left. The rule assumes a ref pointing at a DOM node React
      // may have swapped, which is not this case.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      positions.current.set(location.key, window.scrollY);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
    };
  }, [location.key, location.pathname, location.hash, navigationType]);
  useEffect(() => {
    const city = editions.find(
      (value) => location.pathname.replace(/\/$/, "") === `/news/${value.slug}`,
    );
    if (city) chooseEdition(city.slug);
  }, [location.pathname]);
  useEffect(() => {
    const original = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = original;
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const frame = requestAnimationFrame(() =>
      menuPanel.current?.querySelector("a")?.focus(),
    );
    const escape = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event) => {
      if (
        !menuPanel.current?.contains(event.target) &&
        !menuButton.current?.contains(event.target)
      )
        setMenu(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
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
                Search <UiIcon name="search" size={14} />
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
              <time
                dateTime={now.toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "America/Toronto",
                })}
              >
                {now.toLocaleDateString("en-CA", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/Toronto",
                })}
              </time>
            </div>
            <Link className="journal-wordmark" to="/">
              St. Catharines
              <span>
                Digital<span className="journal-brand-dot">.</span>
              </span>
            </Link>
            <Link
              className="journal-button journal-subscribe"
              to="/planning-alerts"
            >
              Stay in the know <UiIcon name="external" size={17} />
            </Link>
            <button
              className="journal-menu-button"
              type="button"
              ref={menuButton}
              aria-expanded={menu}
              aria-controls="journal-mobile-menu"
              onClick={() => setMenu(!menu)}
            >
              {menu ? "Close" : "Menu"}{" "}
              <UiIcon name={menu ? "close" : "menu"} size={17} />
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
                aria-label={`Open ${editions.find((city) => city.slug === edition)?.name} edition`}
              >
                <UiIcon />
              </Link>
            </div>
          </div>
          {menu && (
            <nav
              className="journal-mobile-menu"
              ref={menuPanel}
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
                  {label} <UiIcon name="external" size={16} />
                </Link>
              ))}
              <div className="journal-mobile-edition">
                <label htmlFor="mobile-edition">Your city edition</label>
                <div>
                  <select
                    id="mobile-edition"
                    value={edition}
                    onChange={(event) => chooseEdition(event.target.value)}
                  >
                    {editions.map((city) => (
                      <option key={city.slug} value={city.slug}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <Link className="journal-button" to={`/news/${edition}`}>
                    Open edition <UiIcon />
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </header>
        <SavedStoriesAnnouncement />
        <main id="main-content" className="scd-main" tabIndex="-1">
          <ErrorBoundary inline resetKey={location.pathname}>
            <Suspense
              fallback={
                <div className="scd-page journal-route-loading" role="status">
                  <span className="journal-kicker">One moment</span>
                  <p>Loading your next read…</p>
                </div>
              }
            >
              <Outlet />
              <RouteAccessibility />
            </Suspense>
          </ErrorBoundary>
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
              <a href="/rss.xml">
                RSS feed <UiIcon name="external" size={16} />
              </a>
            </div>
          </div>
          <div className="journal-footer-bottom">
            <span>
              ©{" "}
              {now.toLocaleDateString("en-CA", {
                year: "numeric",
                timeZone: "America/Toronto",
              })}{" "}
              St. Catharines Digital
            </span>
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
