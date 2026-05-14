import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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

function BlogPostWrapper() {
  const slug = window.location.pathname.replace('/blog/', '')
  return <BlogPostPage slug={slug} />
}

function ServiceLandingWrapper() {
  const slug = window.location.pathname.replace('/services/', '')
  return <ServiceLandingPage slug={slug} />
}

function ServicePageWrapper() {
  const slug = window.location.pathname.replace('/services/', '')
  return <ServicePage slug={slug} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/website-design', element: <ServicePageWrapper /> },
      { path: 'services/technical-seo', element: <ServicePageWrapper /> },
      { path: 'services/gbp-optimization', element: <ServicePageWrapper /> },
      { path: 'services/web-design-for-plumbers', element: <ServiceLandingWrapper /> },
      { path: 'services/web-design-for-hvac', element: <ServiceLandingWrapper /> },
      { path: 'services/web-design-for-electricians', element: <ServiceLandingWrapper /> },
      { path: 'services/local-seo-for-service-businesses', element: <ServiceLandingWrapper /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'success', element: <SuccessPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostWrapper /> },
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
