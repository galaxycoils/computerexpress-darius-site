import React from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Layout from './components/Layout'

// Static imports keep renderToString prerendering complete.
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import PlanningTrackerPage from './pages/PlanningTrackerPage'
import CouncilPage from './pages/CouncilPage'
import PolicePage from './pages/PolicePage'
import NewsPage from './pages/NewsPage'
import CityNewsPage from './pages/CityNewsPage'
import PoliceNewsPage from './pages/PoliceNewsPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import VotesHubPage from './pages/VotesHubPage'
import EditorialPolicyPage from './pages/EditorialPolicyPage'
import CorrectionsPage from './pages/CorrectionsPage'
import SponsorPage from './pages/SponsorPage'
import WellandVotesPage from './pages/WellandVotesPage'
import PlanningAlertsPage from './pages/PlanningAlertsPage'
import MembershipPage from './pages/MembershipPage'
import GuidePage from './pages/GuidePage'

function BlogPostWrapper() {\n  const { slug } = useParams()\n  return <BlogPostPage slug={slug} />\n}\n\nfunction GuidePageWrapper() {
  const { slug } = useParams()
  return <GuidePage slug={slug} />
}

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
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
          <Route path="news" element={<NewsPage />} />
          <Route path="news/police" element={<PoliceNewsPage />} />
          <Route path="news/:citySlug" element={<CityNewsPage />} />
          <Route path="blog" element={<BlogPage />} />\n          <Route path="blog/:slug" element={<BlogPostWrapper />} />\n          <Route path="votes" element={<VotesHubPage />} />\n          <Route path="editorial-policy" element={<EditorialPolicyPage />} />\n          <Route path="corrections" element={<CorrectionsPage />} />\n          <Route path="guides/:slug" element={<GuidePageWrapper />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
