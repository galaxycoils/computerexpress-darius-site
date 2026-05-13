import { useState } from 'react'

// Formspree form endpoint — free tier, 50 submissions/mo
const FORMSPREE_URL = 'https://formspree.io/f/xpwzgkby'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
      if (res.ok) {
        setSubmitted(true)
        form.reset()
      }
    } catch (err) {
      console.error('Form submit failed:', err)
    }
  }

  if (submitted) {
    return (
      <div className="success-panel narrow center-panel">
        <h1>Audit request received</h1>
        <p>Thanks for reaching out. We'll review your site and get back to you within 1–2 business days.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="audit-request" />
      <label>
        Business name
        <input type="text" name="businessName" placeholder="ComputerExpress" required />
      </label>
      <label>
        Email
        <input type="email" name="email" placeholder="you@example.com" required />
      </label>
      <label>
        Website
        <input type="url" name="website" placeholder="https://your-site.com" />
      </label>
      <label>
        Primary service needed
        <input type="text" name="serviceInterest" placeholder="Website redesign, SEO, local SEO, GBP" />
      </label>
      <label>
        What outcome are you trying to create?
        <textarea name="goals" rows="5" placeholder="More leads, better rankings, clearer positioning, stronger local visibility..." required />
      </label>
      <button type="submit" className="button button-primary">Request Free Audit</button>
    </form>
  )
}
