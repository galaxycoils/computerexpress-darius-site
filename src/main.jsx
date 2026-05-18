import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './styles.css'

// Error logging to DOM for debugging
window.addEventListener('error', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.style.whiteSpace = 'pre-wrap';
  errorDiv.innerText = `FATAL ERROR: ${event.message}\n${event.filename}:${event.lineno}`;
  document.body.prepend(errorDiv);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
)
