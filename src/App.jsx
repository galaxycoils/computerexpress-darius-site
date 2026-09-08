import React from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Layout from './components/Layout'
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
import PartnerPage from './pages/PartnerPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

function BlogPostWrapper() {
  const { slug } = useParams()
  return <BlogPostPage slug={slug} />
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
        <Route path="partner" element={<PartnerPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/police" element={<PoliceNewsPage />} />
        <Route path="news/:citySlug" element={<CityNewsPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostWrapper />} />
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
