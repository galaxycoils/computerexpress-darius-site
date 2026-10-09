/**
 * Code-split page imports for the browser bundle.
 *
 * HomePage stays eager: it is the entry route, so lazy-loading it would add a
 * round trip before first paint for the most common visit. Every other page is
 * fetched only when its route is entered, which is what keeps the homepage
 * transfer at ~43 KB gzip instead of shipping all 30 pages.
 *
 * entry-server.jsx uses staticPages.js instead; both maps must cover every
 * `page` key in appRoutes.js, and src/routes/appRoutes.test.js enforces it.
 */
import { lazy } from 'react'
import HomePage from '../pages/HomePage'

const NewsPage = lazy(() => import('../pages/NewsPage'))
const CityNewsPage = lazy(() => import('../pages/CityNewsPage'))
const ArticlePage = lazy(() => import('../pages/ArticlePage'))
const PlanningTrackerPage = lazy(() => import('../pages/PlanningTrackerPage'))
const CouncilPage = lazy(() => import('../pages/CouncilPage'))
const EventsPage = lazy(() => import('../pages/EventsPage'))
const EventPage = lazy(() =>
  import('../pages/EventsPage').then((module) => ({ default: module.EventPage })),
)
const ExplorePage = lazy(() => import('../pages/ExplorePage'))
const ExploreGuidePage = lazy(() =>
  import('../pages/ExplorePage').then((module) => ({ default: module.ExploreGuidePage })),
)
const SavedPage = lazy(() => import('../pages/SavedPage'))
const ProjectPage = lazy(() => import('../pages/ProjectPage'))
const AccessibilityPage = lazy(() => import('../pages/AccessibilityPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const PrivacyPage = lazy(() => import('../pages/PrivacyPage'))
const TermsPage = lazy(() => import('../pages/TermsPage'))
const PolicePage = lazy(() => import('../pages/PolicePage'))
const PoliceNewsPage = lazy(() => import('../pages/PoliceNewsPage'))
const VotesHubPage = lazy(() => import('../pages/VotesHubPage'))
const EditorialPolicyPage = lazy(() => import('../pages/EditorialPolicyPage'))
const CorrectionsPage = lazy(() => import('../pages/CorrectionsPage'))
const SponsorPage = lazy(() => import('../pages/SponsorPage'))
const WellandVotesPage = lazy(() => import('../pages/WellandVotesPage'))
const PlanningAlertsPage = lazy(() => import('../pages/PlanningAlertsPage'))
const MembershipPage = lazy(() => import('../pages/MembershipPage'))
const ReaderServicesPage = lazy(() => import('../pages/ReaderServicesPage'))
const SearchPage = lazy(() => import('../pages/SearchPage'))
const AlertPreferencesPage = lazy(() => import('../pages/AlertPreferencesPage'))
const EditorialDeskPage = lazy(() => import('../pages/EditorialDeskPage'))

export const lazyPages = {
  HomePage,
  SavedPage,
  EventsPage,
  EventPage,
  ExplorePage,
  ExploreGuidePage,
  ProjectPage,
  AccessibilityPage,
  CouncilPage,
  PolicePage,
  PlanningTrackerPage,
  AboutPage,
  ContactPage,
  PrivacyPage,
  TermsPage,
  SponsorPage,
  WellandVotesPage,
  PlanningAlertsPage,
  MembershipPage,
  ReaderServicesPage,
  SearchPage,
  ArticlePage,
  AlertPreferencesPage,
  NewsPage,
  PoliceNewsPage,
  CityNewsPage,
  VotesHubPage,
  EditorialPolicyPage,
  CorrectionsPage,
  EditorialDeskPage,
  NotFoundPage,
}
