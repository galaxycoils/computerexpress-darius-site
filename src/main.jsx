import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'
import './styles/layout-news.css'

window.addEventListener('error', (event) => {
  const err = event.error || event.message
  console.error('St. Catharines Digital App Monitor caught error:', err)
})

const baseUrl = import.meta.env.VITE_BASE_URL
if (baseUrl) {
  try {
    const parsedUrl = new URL(baseUrl)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      console.warn(
        `[Env Validation Warning]: VITE_BASE_URL ("${baseUrl}") must use http:// or https:// protocol.`
      )
    }
  } catch {
    console.warn(`[Env Validation Warning]: VITE_BASE_URL ("${baseUrl}") is not a valid URL.`)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
)
