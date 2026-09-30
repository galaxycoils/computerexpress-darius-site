import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
const NewsPage = lazy(() => import("./pages/NewsPage"));
const CityNewsPage = lazy(() => import("./pages/CityNewsPage"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const PlanningTrackerPage = lazy(() => import("./pages/PlanningTrackerPage"));
const CouncilPage = lazy(() => import("./pages/CouncilPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventPage = lazy(() =>
  import("./pages/EventsPage").then((module) => ({
    default: module.EventPage,
  })),
);
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const ExploreGuidePage = lazy(() =>
  import("./pages/ExplorePage").then((module) => ({
    default: module.ExploreGuidePage,
  })),
);

const SavedPage = lazy(() => import("./pages/SavedPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PolicePage = lazy(() => import("./pages/PolicePage"));
const PoliceNewsPage = lazy(() => import("./pages/PoliceNewsPage"));
const VotesHubPage = lazy(() => import("./pages/VotesHubPage"));
const EditorialPolicyPage = lazy(() => import("./pages/EditorialPolicyPage"));
const CorrectionsPage = lazy(() => import("./pages/CorrectionsPage"));
const SponsorPage = lazy(() => import("./pages/SponsorPage"));
const WellandVotesPage = lazy(() => import("./pages/WellandVotesPage"));
const PlanningAlertsPage = lazy(() => import("./pages/PlanningAlertsPage"));
const MembershipPage = lazy(() => import("./pages/MembershipPage"));
const ReaderServicesPage = lazy(() => import("./pages/ReaderServicesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AlertPreferencesPage = lazy(() => import("./pages/AlertPreferencesPage"));
const EditorialDeskPage = lazy(() => import("./pages/EditorialDeskPage"));

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="saved" element={<SavedPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/:slug" element={<ExploreGuidePage />} />
        <Route path="development/:id" element={<ProjectPage />} />
        <Route path="accessibility" element={<AccessibilityPage />} />
        <Route index element={<HomePage />} />
        <Route path="council" element={<CouncilPage />} />
        <Route path="police" element={<PolicePage />} />
        <Route path="planning-tracker" element={<PlanningTrackerPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="sponsor" element={<SponsorPage />} />
        <Route path="welland-votes" element={<WellandVotesPage />} />
        <Route path="planning-alerts" element={<PlanningAlertsPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="reader-services" element={<ReaderServicesPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="preferences" element={<AlertPreferencesPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/police" element={<PoliceNewsPage />} />
        <Route path="news/:citySlug" element={<CityNewsPage />} />
        <Route path="votes" element={<VotesHubPage />} />
        <Route path="editorial-policy" element={<EditorialPolicyPage />} />
        <Route path="corrections" element={<CorrectionsPage />} />
        <Route path="editorial" element={<EditorialDeskPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default function AppClient() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
