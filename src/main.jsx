// Hard error catcher at the absolute top of the entry point
window.addEventListener('error', (event) => {
  const err = event.error || event.message;
  console.error("CRITICAL APP CRASH:", err);
  document.body.innerHTML = `<div style="color:red; font-family:sans-serif; padding:50px;">
    <h1>Application Crash</h1>
    <p>The website is failing to load. Error details:</p>
    <pre>${err}</pre>
  </div>`;
});

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
  console.error("DEBUG ERROR:", event.error);
  document.body.prepend(errorDiv);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>Hello World</div>
)
