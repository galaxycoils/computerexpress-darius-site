import { BASE_URL } from "./siteConfig.js";
import { planningNotices } from "./planningNotices.js";
import { exploreGuides } from "./exploreGuides.js";
import { getPublishableContent } from "./contentRegistry.js";
import { appRoutes } from "../routes/appRoutes.js";

export const baseRoutes = [
  "/",
  "/about",
  "/contact",
  "/sponsor",
  "/votes",
  "/editorial-policy",
  "/corrections",
  "/welland-votes",
  "/privacy",
  "/terms",
  "/planning-tracker",
  "/council",
  "/police",
  "/news",
  "/news/police",
  "/news/st-catharines",
  "/news/welland",
  "/news/thorold",
  "/news/niagara-falls",
  "/planning-alerts",
  "/membership",
  "/reader-services",
  "/search",
  "/events",
  "/explore",
  "/accessibility",
];

export const programmaticRoutes = [
  ...getPublishableContent().map((item) => `/articles/${item.slug}`),
  ...planningNotices.map((n) => `/development/${n.id}`),
  ...planningNotices.filter((n) => n.meetingDate).map((n) => `/events/${n.id}`),
  ...exploreGuides.map((g) => `/explore/${g.slug}`),
];
export const privateRoutes = ["/preferences", "/saved"];
export const clientOnlyRoutes = ["/editorial"];

/**
 * Route-to-page map, derived from the shared route table so it cannot drift.
 *
 * This was a hand-written 26-entry object. Nothing tied it to the <Route>
 * elements in App.jsx/AppClient.jsx, so a page could be renamed in the router
 * and left stale here, which silently changed what the prerenderer imported.
 */
const exactPageModules = {
  ...Object.fromEntries(
    appRoutes
      .filter((route) => route.path !== '*' && !route.path.includes(':'))
      .map((route) => [route.index ? '/' : `/${route.path}`, route.page]),
  ),
  // Prerendered 404 document; the catch-all route above renders the same page.
  '/404': 'NotFoundPage',
};

export function getRoutePageModule(route) {
  let page = exactPageModules[route];
  if (!page && route.startsWith("/articles/")) page = "ArticlePage";
  if (!page && route.startsWith("/development/")) page = "ProjectPage";
  if (!page && route.startsWith("/events/")) page = "EventsPage";
  if (!page && route.startsWith("/explore/")) page = "ExplorePage";
  if (!page && route.startsWith("/news/")) page = "CityNewsPage";
  return page ? `src/pages/${page}.jsx` : null;
}

const articleModifiedDates = new Map(
  getPublishableContent().map((item) => [
    `/articles/${item.slug}`,
    item.publishedDate,
  ]),
);

export const sitemapRoutes = baseRoutes
  .filter((r) => r !== "/404")
  .concat(programmaticRoutes);
export const prerenderRoutes = [
  ...baseRoutes,
  ...programmaticRoutes,
  ...privateRoutes,
  "/404",
];

export function getRouteSitemapMeta(route) {
  const lastmod = articleModifiedDates.get(route);
  if (lastmod) return { priority: "0.7", changefreq: "monthly", lastmod };
  if (route === "/") return { priority: "1.0", changefreq: "weekly" };
  if (["/about", "/contact", "/privacy", "/terms"].includes(route)) {
    return { priority: "0.8", changefreq: "monthly" };
  }
  return { priority: "0.6", changefreq: "monthly" };
}

export function canonicalRouteUrl(route) {
  const base = BASE_URL.replace(/\/$/, "");
  if (route === "/") return `${base}/`;
  return `${base}${route.replace(/\/$/, "")}/`;
}

export function createSitemapXml(routes = sitemapRoutes) {
  const urls = routes
    .filter((route) => route !== "/404")
    .map((route) => {
      const { priority, changefreq, lastmod } = getRouteSitemapMeta(route);
      const loc = canonicalRouteUrl(route);
      return `  <url>
    <loc>${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
