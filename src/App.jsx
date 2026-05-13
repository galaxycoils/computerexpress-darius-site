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

function BlogPostWrapper() {
  const slug = window.location.pathname.replace('/blog/', '')
  return <BlogPostPage slug={slug} />
}

function ServiceLandingWrapper() {
  const slug = window.location.pathname.replace('/services/', '')
  return <ServiceLandingPage slug={slug} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:slug', element: <ServiceLandingWrapper /> },
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
