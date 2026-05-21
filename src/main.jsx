import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'

// Global error listener for monitoring unhandled exceptions in production
window.addEventListener('error', (event) => {
  const err = event.error || event.message
  console.error("St. Catharines Digital App Monitor caught error:", err)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
)
