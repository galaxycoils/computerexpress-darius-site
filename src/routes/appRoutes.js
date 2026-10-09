/**
 * The site's SPA route table — the single source of truth for what routes exist.
 *
 * Before this file, the same 33 routes were listed twice, once in App.jsx with
 * static imports (used by entry-server.jsx for prerendering) and again in
 * AppClient.jsx with lazy imports (used by the browser). I diffed them: the
 * lists were identical, but nothing enforced that. Adding a route meant editing
 * both, and missing one produced a page that prerendered but would not hydrate,
 * or a route that worked on first paint and 404'd on client navigation.
 *
 * `src/data/routeManifest.js` derives its route-to-page map from this table, so
 * the page names cannot drift either.
 *
 * Fields:
 *   path   — path relative to Layout, exactly as react-router expects
 *   page   — key into the static/lazy component maps (src/routes/*Pages.js)
 *   index  — this is the index route for "/"
 *   group  — optional marker; "private" and "clientOnly" mirror the manifest
 *
 * Order is preserved deliberately: `news/police` is declared before
 * `news/:citySlug` so the static segment wins regardless of router ranking.
 */
export const appRoutes = [
  { path: 'saved', page: 'SavedPage', group: 'private' },
  { path: 'events', page: 'EventsPage' },
  { path: 'events/:id', page: 'EventPage' },
  { path: 'explore', page: 'ExplorePage' },
  { path: 'explore/:slug', page: 'ExploreGuidePage' },
  { path: 'development/:id', page: 'ProjectPage' },
  { path: 'accessibility', page: 'AccessibilityPage' },
  { path: '/', page: 'HomePage', index: true },
  { path: 'council', page: 'CouncilPage' },
  { path: 'police', page: 'PolicePage' },
  { path: 'planning-tracker', page: 'PlanningTrackerPage' },
  { path: 'about', page: 'AboutPage' },
  { path: 'contact', page: 'ContactPage' },
  { path: 'privacy', page: 'PrivacyPage' },
  { path: 'terms', page: 'TermsPage' },
  { path: 'sponsor', page: 'SponsorPage' },
  { path: 'welland-votes', page: 'WellandVotesPage' },
  { path: 'planning-alerts', page: 'PlanningAlertsPage' },
  { path: 'membership', page: 'MembershipPage' },
  { path: 'reader-services', page: 'ReaderServicesPage' },
  { path: 'search', page: 'SearchPage' },
  { path: 'articles/:slug', page: 'ArticlePage' },
  { path: 'preferences', page: 'AlertPreferencesPage', group: 'private' },
  { path: 'news', page: 'NewsPage' },
  { path: 'news/police', page: 'PoliceNewsPage' },
  { path: 'news/:citySlug', page: 'CityNewsPage' },
  { path: 'votes', page: 'VotesHubPage' },
  { path: 'editorial-policy', page: 'EditorialPolicyPage' },
  { path: 'corrections', page: 'CorrectionsPage' },
  { path: 'editorial', page: 'EditorialDeskPage', group: 'clientOnly' },
  { path: '*', page: 'NotFoundPage' },
]

/** Every page key the table can reference. Used to assert both maps are complete. */
export const routePageNames = [...new Set(appRoutes.map((route) => route.page))].sort()

/**
 * Concrete, prerenderable paths derived from the table: no dynamic segments,
 * no catch-all, and nothing marked private or client-only.
 */
export function concreteRoutePaths() {
  return appRoutes
    .filter((route) => !route.index && route.path !== '*' && !route.path.includes(':'))
    .filter((route) => route.group !== 'private' && route.group !== 'clientOnly')
    .map((route) => `/${route.path}`)
}
