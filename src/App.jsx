import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import SuccessPage from './pages/SuccessPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'

// Extract slug from URL for blog posts
function BlogPostWrapper() {
  const path = window.location.pathname
  const slug = path.replace('/blog/', '')
  return <BlogPostPage slug={slug} />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
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
