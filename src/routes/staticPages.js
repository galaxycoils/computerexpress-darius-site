/**
 * Static page imports, used by entry-server.jsx so renderToString can prerender
 * every route in one pass. The browser uses lazyPages.js instead.
 *
 * Both maps must cover every `page` key in src/routes/appRoutes.js;
 * src/routes/appRoutes.test.js enforces that.
 */
import SavedPage from '../pages/SavedPage'
import EventsPage, { EventPage } from '../pages/EventsPage'
import ExplorePage, { ExploreGuidePage } from '../pages/ExplorePage'
import ProjectPage from '../pages/ProjectPage'
import AccessibilityPage from '../pages/AccessibilityPage'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import NotFoundPage from '../pages/NotFoundPage'
import PrivacyPage from '../pages/PrivacyPage'
import TermsPage from '../pages/TermsPage'
import PlanningTrackerPage from '../pages/PlanningTrackerPage'
import CouncilPage from '../pages/CouncilPage'
import PolicePage from '../pages/PolicePage'
import NewsPage from '../pages/NewsPage'
import CityNewsPage from '../pages/CityNewsPage'
import PoliceNewsPage from '../pages/PoliceNewsPage'
import VotesHubPage from '../pages/VotesHubPage'
import EditorialPolicyPage from '../pages/EditorialPolicyPage'
import CorrectionsPage from '../pages/CorrectionsPage'
import SponsorPage from '../pages/SponsorPage'
import WellandVotesPage from '../pages/WellandVotesPage'
import PlanningAlertsPage from '../pages/PlanningAlertsPage'
import MembershipPage from '../pages/MembershipPage'
import ReaderServicesPage from '../pages/ReaderServicesPage'
import SearchPage from '../pages/SearchPage'
import AlertPreferencesPage from '../pages/AlertPreferencesPage'
import ArticlePage from '../pages/ArticlePage'
import EditorialDeskPage from '../pages/EditorialDeskPage'

export const staticPages = {
  SavedPage,
  EventsPage,
  EventPage,
  ExplorePage,
  ExploreGuidePage,
  ProjectPage,
  AccessibilityPage,
  HomePage,
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
