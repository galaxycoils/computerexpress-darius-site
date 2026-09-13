import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Layout from './components/Layout'

// Lazy load pages not needed on first paint
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PlanningTrackerPage = lazy(() => import('./pages/PlanningTrackerPage'))
const CouncilPage = lazy(() => import('./pages/CouncilPage'))
const PolicePage = lazy(() => import('./pages/PolicePage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const CityNewsPage = lazy(() => import('./pages/CityNewsPage'))
const PoliceNewsPage = lazy(() => import('./pages/PoliceNewsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const SponsorPage = lazy(() => import('./pages/SponsorPage'))
const WellandVotesPage = lazy(() => import('./pages/WellandVotesPage'))
const PlanningAlertsPage = lazy(() => import('./pages/PlanningAlertsPage'))
const MembershipPage = lazy(() => import('./pages/MembershipPage'))
const GuidePage = lazy(() => import('./pages/GuidePage'))

function BlogPostWrapper() {
  const { slug } = useParams()
  return <BlogPostPage slug={slug} />
}

function GuidePageWrapper() {
  const { slug } = useParams()
  return <GuidePage slug={slug} />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="scd-page scd-paper"><div className="animate-on-scroll"><p style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading…</p></div></div>}>
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
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostWrapper />} />
          <Route path="guides/:slug" element={<GuidePageWrapper />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
