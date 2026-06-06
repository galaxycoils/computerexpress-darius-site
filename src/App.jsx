import React from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import SuccessPage from './pages/SuccessPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ServiceLandingPage from './pages/ServiceLandingPage'
import ServicePage from './pages/ServicePage'
import WhatToExpectPage from './pages/WhatToExpectPage'
import NotFoundPage from './pages/NotFoundPage'
import FreeAuditPage from './pages/FreeAuditPage'
import CaseStudyPage from './pages/CaseStudyPage'
import LocalServiceAreaPage from './pages/LocalServiceAreaPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import PartnerPage from './pages/PartnerPage'

function BlogPostWrapper() {
  const { slug } = useParams()
  return <BlogPostPage slug={slug} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/website-design" element={<ServicePage slug="website-design" />} />
        <Route path="services/technical-seo" element={<ServicePage slug="technical-seo" />} />
        <Route path="services/gbp-optimization" element={<ServicePage slug="gbp-optimization" />} />
        <Route path="services/web-design-for-plumbers" element={<ServiceLandingPage slug="web-design-for-plumbers" />} />
        <Route path="services/web-design-for-hvac" element={<ServiceLandingPage slug="web-design-for-hvac" />} />
        <Route path="services/web-design-for-electricians" element={<ServiceLandingPage slug="web-design-for-electricians" />} />
        <Route path="services/web-design-for-landlords" element={<ServiceLandingPage slug="web-design-for-landlords" />} />
        <Route path="services/local-seo-for-service-businesses" element={<ServiceLandingPage slug="local-seo-for-service-businesses" />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="success" element={<SuccessPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostWrapper />} />
        <Route path="case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="service-areas/:serviceSlug/:citySlug" element={<LocalServiceAreaPage />} />
        <Route path="what-to-expect" element={<WhatToExpectPage />} />
        <Route path="free-audit" element={<FreeAuditPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="partner" element={<PartnerPage />} />
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
