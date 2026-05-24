export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  if (typeof window.__loadAnalytics === 'function') {
    window.__loadAnalytics()
  }

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )

  window.gtag('event', eventName, safeParams)
}

export function trackLead(formId, extra = {}) {
  trackEvent('generate_lead', {
    form_id: formId,
    ...extra,
  })
}
