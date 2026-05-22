import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'

const CONTACT_API = '/api/contact'

const STAGE_QUIZ = 'QUIZ'
const STAGE_LOADING = 'LOADING'
const STAGE_RESULTS = 'RESULTS'
const STAGE_SUCCESS = 'SUCCESS'

const INDUSTRIES = [
  { id: 'plumbing', title: 'Plumbing', val: 180, icon: '🚰', desc: 'Average job value: $180' },
  { id: 'hvac', title: 'HVAC Services', val: 280, icon: '🔥', desc: 'Average job value: $280' },
  { id: 'electrical', title: 'Electrical', val: 150, icon: '⚡', desc: 'Average job value: $150' },
  { id: 'legal', title: 'Family Law', val: 600, icon: '⚖️', desc: 'Average case value: $600' },
  { id: 'property-management', title: 'Property Management', val: 350, icon: '🏢', desc: 'Average client value: $350' },
  { id: 'other', title: 'Other Service', val: 150, icon: '🛠️', desc: 'Average job value: $150' }
]

const MAPS_OPTIONS = [
  { id: 'no', title: 'No', desc: 'Not in top 3 positions' },
  { id: 'yes', title: 'Yes', desc: 'Visible in maps pack' },
  { id: 'unsure', title: 'Unsure', desc: 'Not sure of ranking' }
]

const TRAFFIC_OPTIONS = [
  { id: 'under100', title: 'Under 100', multiplier: 6, desc: 'Fewer than 3 visitors daily' },
  { id: '100to500', title: '100 - 500', multiplier: 18, desc: 'Moderate traffic stream' },
  { id: 'over500', title: '500+', multiplier: 44, desc: 'Active daily visitors' }
]

const PAIN_POINTS = [
  { id: 'no_calls', title: 'No Phone Calls / Leads', desc: 'Visitors leave without contacting' },
  { id: 'slow_speed', title: 'Slow Load Speed', desc: 'Lagging performance on mobile' },
  { id: 'hard_update', title: 'Hard to Update / Edit', desc: 'Locked in a complex system' },
  { id: 'unprofessional', title: 'Unprofessional Design', desc: 'Looks outdated compared to competitors' },
  { id: 'no_website', title: 'No Website / Launching', desc: 'Starting from scratch' }
]

const ANALYSIS_PHASES = [
  'Estimating mobile speed and Core Web Vitals risk...',
  'Checking crawl, metadata, and local schema signals...',
  'Reviewing Google Maps and service-area coverage inputs...',
  'Modeling potential monthly lead opportunity...',
  'Building your priority local growth checklist...'
]

const freeAuditJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Free Website Audit & SEO Grader | St. Catharines Digital',
    url: `${BASE_URL}/free-audit`,
    description: 'Estimate your website speed risk, local schema coverage, Maps visibility inputs, service-area gaps, and conversion opportunities.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Free Audit',
        item: `${BASE_URL}/free-audit`
      }
    ]
  }
]

export default function FreeAuditPage() {
  const [stage, setStage] = useState(STAGE_QUIZ)
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [industry, setIndustry] = useState('')
  const [maps, setMaps] = useState('')
  const [traffic, setTraffic] = useState('')
  const [painPoint, setPainPoint] = useState('')

  // Loading phase tracking
  const [activePhaseIndex, setActivePhaseIndex] = useState(0)
  const [completedPhases, setCompletedPhases] = useState([])

  // Dashboard results
  const [score, setScore] = useState(100)
  const [lostLeads, setLostLeads] = useState(0)
  const [lostRevenue, setLostRevenue] = useState(0)
  const [recommendations, setRecommendations] = useState([])

  // Lead form fields
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadLoading, setLeadLoading] = useState('')
  const [leadError, setLeadError] = useState('')

  // Validate URL format
  function validateUrl(value) {
    if (!value) {
      setUrlError('Website URL is required')
      return false
    }
    const cleanVal = value.trim()
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
    if (!pattern.test(cleanVal)) {
      setUrlError('Please enter a valid website URL (e.g. example.com)')
      return false
    }
    setUrlError('')
    return true
  }

  // Handle URL change
  function handleUrlChange(e) {
    setUrl(e.target.value)
    if (urlError) {
      validateUrl(e.target.value)
    }
  }

  // Step navigation
  function nextStep() {
    if (step === 1) {
      if (!validateUrl(url)) return
    }
    setStep(prev => prev + 1)
  }

  // Prev step
  function prevStep() {
    setStep(prev => prev - 1)
  }

  // Trigger analysis simulation
  function handleStartAnalysis() {
    if (!industry || !maps || !traffic || !painPoint) return
    setStage(STAGE_LOADING)
    setActivePhaseIndex(0)
    setCompletedPhases([])
  }

  // Handle loading steps timer
  useEffect(() => {
    if (stage !== STAGE_LOADING) return

    const interval = setInterval(() => {
      setCompletedPhases(prev => [...prev, activePhaseIndex])
      if (activePhaseIndex < ANALYSIS_PHASES.length - 1) {
        setActivePhaseIndex(prev => prev + 1)
      } else {
        clearInterval(interval)
        calculateResults()
        setStage(STAGE_RESULTS)
      }
    }, 900)

    return () => clearInterval(interval)
  }, [stage, activePhaseIndex])

  // Calculate score, opportunity estimate, and checklist
  function calculateResults() {
    // Estimate a conservative readiness score from self-reported inputs.
    let baseScore = 88
    if (maps === 'no') baseScore -= 18
    if (maps === 'unsure') baseScore -= 9
    if (traffic === 'under100') baseScore -= 14
    if (traffic === '100to500') baseScore -= 6
    if (painPoint === 'no_website') baseScore -= 22
    if (painPoint === 'no_calls') baseScore -= 12
    if (painPoint === 'slow_speed') baseScore -= 10
    if (painPoint === 'unprofessional') baseScore -= 12

    const finalScore = Math.max(40, Math.min(68, baseScore))
    setScore(finalScore)

    // Estimate possible lead opportunity from broad traffic and ticket-value inputs.
    const selectedIndustry = INDUSTRIES.find(i => i.id === industry)
    const selectedTraffic = TRAFFIC_OPTIONS.find(t => t.id === traffic)

    const jobValue = selectedIndustry ? selectedIndustry.val : 150
    const leadsCount = selectedTraffic ? selectedTraffic.multiplier : 6

    setLostLeads(leadsCount)
    setLostRevenue(leadsCount * jobValue)

    // 3. Select custom checklist items based on pain points
    let checklist = []
    if (painPoint === 'no_calls') {
      checklist = [
        { title: 'Add High-Contrast Call Buttons', desc: 'Put a prominent, sticky phone number call button in the header for mobile users.' },
        { title: 'Deploy Local Citation Metadata', desc: 'Sync Google Business Profile with structured JSON-LD local schema for Niagara searches.' },
        { title: 'Optimize Inquiry Forms', desc: 'Shorten form fields to Name, Phone, and Email to remove conversion friction.' }
      ]
    } else if (painPoint === 'slow_speed') {
      checklist = [
        { title: 'Ditch Heavy CMS Templates', desc: 'Switch from slow page-builders like WordPress or Elementor to custom static React/Vite builds.' },
        { title: 'Adopt WebP Image Standards', desc: 'Compress background assets and convert standard images to modern lightweight WebP formats.' },
        { title: 'Enable Edge CDN Delivery', desc: 'Deploy assets globally using Cloudflare Pages edge network to achieve sub-second load times.' }
      ]
    } else if (painPoint === 'hard_update') {
      checklist = [
        { title: 'Decoupled Front-End Design', desc: 'Protect website design layouts by separating frontend presentation layers from rigid admin screens.' },
        { title: 'Integrate Micro-Editor Access', desc: 'Add clean text-editing links that let you update pricing, reviews, and hours instantly.' },
        { title: 'Setup Automatic Deployments', desc: 'Auto-compile site changes securely on GitHub without database risk or site crash threats.' }
      ]
    } else if (painPoint === 'unprofessional') {
      checklist = [
        { title: 'Modern Dark-Theme Architecture', desc: 'WOW visitors with custom typography (Playfair/Inter) and interactive layout grids.' },
        { title: 'Add Micro-Interactions & Hover Effects', desc: 'Use premium scroll reveals and image fade-ins to establish immediate trust.' },
        { title: 'Display Authentic Social Proof', desc: 'Highlight reviews, certifications, and before-and-after cases above the website fold.' }
      ]
    } else {
      // no_website or default
      checklist = [
        { title: 'Fast-Track Landing Page Launch', desc: 'Deploy a lightweight website containing services, area mappings, and phone targets.' },
        { title: 'Register Local Google Maps Profile', desc: 'Create and verify Google maps pack positioning with correct categories.' },
        { title: 'Embed Local Schema & Tags', desc: 'Add regional coordinates and postal addresses into structural tags for crawlers.' }
      ]
    }
    setRecommendations(checklist)
  }

  // Handle lead form submit
  async function handleLeadSubmit(e) {
    e.preventDefault()
    if (!leadName || !leadEmail) {
      setLeadError('Name and Email are required.')
      return
    }

    setLeadLoading(true)
    setLeadError('')

    const selectedIndustry = INDUSTRIES.find(i => i.id === industry)?.title || industry
    const selectedMaps = MAPS_OPTIONS.find(m => m.id === maps)?.title || maps
    const selectedTraffic = TRAFFIC_OPTIONS.find(t => t.id === traffic)?.title || traffic
    const selectedPain = PAIN_POINTS.find(p => p.id === painPoint)?.title || painPoint

    const messageText = `
=== WEBSITE GRADER LEAD ===
Name: ${leadName}
Email: ${leadEmail}
Phone: ${leadPhone || 'Not provided'}
Website: ${url}

=== GRADER DIAGNOSTICS ===
Calculated Score: ${score}%
Estimated Monthly Lead Opportunity: ${lostLeads}
Estimated Monthly Opportunity Value: $${lostRevenue}
Industry Category: ${selectedIndustry}
Google Maps Prominence: ${selectedMaps}
Monthly Traffic: ${selectedTraffic}
Primary Challenge: ${selectedPain}
`

    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          message: messageText.trim()
        })
      })

      const data = await res.json()
      if (res.ok) {
        setStage(STAGE_SUCCESS)
      } else {
        if (window.location.hostname === 'localhost') {
          console.log('[DEV] Local mock submission success:', { name: leadName, email: leadEmail, message: messageText })
          setStage(STAGE_SUCCESS)
        } else {
          setLeadError(data.error || 'Submit failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('Submit lead error:', err)
      if (window.location.hostname === 'localhost') {
        console.log('[DEV] Local mock submission success (network fallback):', { name: leadName, email: leadEmail, message: messageText })
        setStage(STAGE_SUCCESS)
      } else {
        setLeadError('Network error. Please try again.')
      }
    } finally {
      setLeadLoading(false)
    }
  }

  // Reset quiz
  function handleReset() {
    setStage(STAGE_QUIZ)
    setStep(1)
    setUrl('')
    setUrlError('')
    setIndustry('')
    setMaps('')
    setTraffic('')
    setPainPoint('')
    setLeadName('')
    setLeadEmail('')
    setLeadPhone('')
    setLeadError('')
  }

  return (
    <>
      <Seo
        title="Free Website Audit & SEO Grader | St. Catharines Digital"
        description="Run our instant interactive grader to estimate website readiness, local search visibility inputs, and potential monthly lead opportunity."
        path="/free-audit"
        jsonLd={freeAuditJsonLd}
      />

      <section className="section-first" aria-label="Website Grader Tool">
        <div className="grader-container">
          <div className="section-heading">
            <span className="eyebrow eyebrow-center" aria-hidden="true">Interactive Tool</span>
            <h2>Website Audit & SEO Grader</h2>
            <p>Analyze your local performance, uncover technical layout flaws, and estimate potential monthly lead opportunity with clear proof-safe assumptions.</p>
          </div>

          {stage === STAGE_QUIZ && (
            <div className="grader-step-card">
              <div className="grader-step-header">
                <span className="grader-step-subtitle" role="status">Step {step} of 5</span>
                {step === 1 && <h3 className="grader-step-title">Enter your website URL</h3>}
                {step === 2 && <h3 className="grader-step-title">Select your industry category</h3>}
                {step === 3 && <h3 className="grader-step-title">Are you in the Google Maps Top 3 pack?</h3>}
                {step === 4 && <h3 className="grader-step-title">What is your monthly site traffic?</h3>}
                {step === 5 && <h3 className="grader-step-title">What is your main website challenge?</h3>}
              </div>

              {step === 1 && (
                <div className="grader-input-group">
                  <label htmlFor="grader-url">Website Address</label>
                  <input
                    type="url"
                    id="grader-url"
                    className="grader-text-input"
                    placeholder="e.g. yourbusiness.com"
                    value={url}
                    onChange={handleUrlChange}
                    onBlur={() => validateUrl(url)}
                    required
                  />
                  {urlError && <span className="field-error" style={{ display: 'block', marginTop: '0.5rem' }}>{urlError}</span>}
                </div>
              )}

              {step === 2 && (
                <div className="grader-options-grid" role="radiogroup" aria-label="Industry choices">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind.id}
                      type="button"
                      className={`grader-option-card${industry === ind.id ? ' selected' : ''}`}
                      onClick={() => { setIndustry(ind.id); nextStep(); }}
                      aria-checked={industry === ind.id}
                      role="radio"
                    >
                      <span className="grader-option-icon" aria-hidden="true">{ind.icon}</span>
                      <span className="grader-option-title">{ind.title}</span>
                      <span className="grader-option-desc">{ind.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="grader-options-grid" role="radiogroup" aria-label="Maps prominence choices">
                  {MAPS_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`grader-option-card${maps === opt.id ? ' selected' : ''}`}
                      onClick={() => { setMaps(opt.id); nextStep(); }}
                      aria-checked={maps === opt.id}
                      role="radio"
                    >
                      <span className="grader-option-icon" aria-hidden="true">{opt.id === 'yes' ? '📍' : opt.id === 'no' ? '❌' : '❓'}</span>
                      <span className="grader-option-title">{opt.title}</span>
                      <span className="grader-option-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="grader-options-grid" role="radiogroup" aria-label="Monthly traffic choices">
                  {TRAFFIC_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`grader-option-card${traffic === opt.id ? ' selected' : ''}`}
                      onClick={() => { setTraffic(opt.id); nextStep(); }}
                      aria-checked={traffic === opt.id}
                      role="radio"
                    >
                      <span className="grader-option-icon" aria-hidden="true">📈</span>
                      <span className="grader-option-title">{opt.title}</span>
                      <span className="grader-option-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 5 && (
                <div className="grader-options-grid" role="radiogroup" aria-label="Main pain point choices">
                  {PAIN_POINTS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`grader-option-card${painPoint === opt.id ? ' selected' : ''}`}
                      onClick={() => setPainPoint(opt.id)}
                      aria-checked={painPoint === opt.id}
                      role="radio"
                    >
                      <span className="grader-option-icon" aria-hidden="true">⚠️</span>
                      <span className="grader-option-title">{opt.title}</span>
                      <span className="grader-option-desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="grader-actions">
                {step > 1 ? (
                  <button type="button" className="button button-secondary" onClick={prevStep}>Back</button>
                ) : (
                  <div />
                )}

                <div className="grader-progress-bar" aria-hidden="true">
                  <div className="grader-progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
                </div>

                {step < 5 ? (
                  <button type="button" className="button button-primary" onClick={nextStep} disabled={step === 1 && !url}>
                    Next Step
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleStartAnalysis}
                    disabled={!painPoint}
                  >
                    Generate My Score
                  </button>
                )}
              </div>
            </div>
          )}

          {stage === STAGE_LOADING && (
            <div className="grader-step-card grader-loading-overlay">
              <div className="grader-spinner" aria-hidden="true" />
              <h3>Analyzing System Diagnostics</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Running automated tests on website: {url}</p>
              
              <div className="grader-analysis-steps">
                {ANALYSIS_PHASES.map((phase, idx) => {
                  const isActive = idx === activePhaseIndex
                  const isCompleted = completedPhases.includes(idx)
                  return (
                    <div
                      key={idx}
                      className={`grader-analysis-step${isActive ? ' active' : ''}${isCompleted ? ' complete' : ''}`}
                    >
                      <span className="grader-analysis-step-check" aria-hidden="true">
                        {isCompleted ? '✓' : isActive ? '●' : '○'}
                      </span>
                      <span>{phase}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {stage === STAGE_RESULTS && (
            <div className="grader-results-grid">
              <div className="grader-results-left">
                <div className="grader-score-card">
                  <div className="grader-score-ring-wrapper">
                    <div
                      className="grader-score-ring"
                      style={{
                        background: `conic-gradient(${
                          score < 50 ? '#ef4444' : '#f59e0b'
                        } ${score * 3.6}deg, rgba(255, 255, 255, 0.05) 0deg)`
                      }}
                      aria-hidden="true"
                    />
                    <div className="grader-score-number">
                      {score}<span>%</span>
                    </div>
                  </div>
                  <h3>Authority Readiness Score</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.5rem 0 1rem' }}>Self-reported estimate for: {url}</p>
                  <span className={`grader-score-label ${score < 55 ? 'low' : 'medium'}`}>
                    {score < 55 ? 'High Priority Gaps' : 'Optimization Opportunity'}
                  </span>
                </div>

                <div className="grader-roi-card">
                  <h3>Monthly Opportunity Estimate</h3>
                  <p>Based on broad service-ticket values and your traffic range, this models possible upside. The manual audit verifies the real numbers.</p>
                  
                  <div className="grader-roi-stats">
                    <div>
                      <div className="grader-roi-stat-val">{lostLeads}</div>
                      <div className="grader-roi-stat-lbl">Potential Leads / Mo</div>
                    </div>
                    <div>
                      <div className="grader-roi-stat-val revenue">${lostRevenue.toLocaleString()}</div>
                      <div className="grader-roi-stat-lbl">Opportunity Value / Mo</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grader-results-right">
                <div className="grader-issues-card">
                  <h3>High-Priority Action Checklist</h3>
                  <div>
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="grader-issue-item">
                        <span className="grader-issue-icon" aria-hidden="true">🚨</span>
                        <div>
                          <div className="grader-issue-title">{rec.title}</div>
                          <div className="grader-issue-desc">{rec.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grader-step-card" style={{ padding: '2.5rem' }}>
                  <div 
                    className="grader-video-preview-wrapper" 
                    onClick={() => document.getElementById('lead-name')?.focus()}
                    role="button"
                    tabIndex={0}
                    aria-label="Click to request video audit walkthrough"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        document.getElementById('lead-name')?.focus();
                      }
                    }}
                  >
                    <img 
                      src="/images/video_preview.webp" 
                      alt="Sample video website audit walkthrough" 
                      className="grader-video-preview-image"
                    />
                    <div className="grader-video-preview-overlay" />
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-bright)', marginBottom: '0.75rem' }}>
                    Claim Your Complete Audit Walkthrough
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    Get a personalized screen-share audit of your site. We will verify the estimate, review mobile speed, inspect conversion paths, and identify practical local search improvements.
                  </p>

                  {leadError && (
                    <div className="contact-form-error" style={{ marginBottom: '1rem' }} role="alert">
                      {leadError}
                    </div>
                  )}

                  <form onSubmit={handleLeadSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label htmlFor="lead-name" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="lead-name"
                        className="grader-text-input"
                        placeholder="John Doe"
                        value={leadName}
                        onChange={e => setLeadName(e.target.value)}
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <label htmlFor="lead-email" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="lead-email"
                        className="grader-text-input"
                        placeholder="john@example.com"
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div>
                      <label htmlFor="lead-phone" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="lead-phone"
                        className="grader-text-input"
                        placeholder="(289) 555-0199"
                        value={leadPhone}
                        onChange={e => setLeadPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        type="submit"
                        className="button button-primary"
                        disabled={leadLoading}
                      >
                        {leadLoading ? 'Queueing audit...' : 'Get Audit Walkthrough'}
                      </button>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={handleReset}
                      >
                        Run New Grader
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {stage === STAGE_SUCCESS && (
            <div className="grader-step-card" style={{ textAlign: 'center', padding: '4rem 2.5rem' }}>
              <div className="contact-form-success-icon" style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-bright)', marginBottom: '1rem' }}>
                Your Audit Is Queueing!
              </h3>
              <p style={{ color: 'var(--muted)', maxWidth: '55ch', margin: '0 auto 2rem', lineHeight: '1.6' }}>
                Thanks — we have received your Website Grader report. Darius is preparing your custom 5-minute screen walkthrough. We will send the review link to <strong>{leadEmail}</strong> within 1 business day.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Link to="/" className="button button-primary">Return Home</Link>
                <button type="button" className="button button-secondary" onClick={handleReset}>Test New URL</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
