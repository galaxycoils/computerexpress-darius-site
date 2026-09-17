import Seo, { BASE_URL } from '../components/Seo'

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy | St. Catharines Digital"
        description="How St. Catharines Digital collects, uses, and protects your information."
        path="/privacy"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Privacy Policy', url: BASE_URL }}
      />
      <section className="section section-first" aria-label="Privacy Policy">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
          <div style={{ color: 'var(--text)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>Last updated: May 23, 2026</p>
            <p>At St. Catharines Digital, accessible from stcatharinesdigital.ca, privacy matters. This policy explains what we collect and how we use it.</p>
            <h2>Information we collect</h2>
            <p>If you contact us directly, we may receive your name, email address, phone number, message content, website URL, and other details you choose to provide.</p>
            <h2>How we use your information</h2>
            <ul>
              <li>Provide, operate, and maintain our website</li>
              <li>Respond to inquiries and audit requests</li>
              <li>Improve website content, performance, and conversion paths</li>
              <li>Send requested emails or follow-up information</li>
              <li>Find and prevent fraud or abuse</li>
            </ul>
            <h2>Analytics and conversion events</h2>
            <p>We use Google Analytics to understand page views and conversion actions such as form submissions, phone clicks, booking-link clicks, and chat opens. Analytics events do not include form message content, names, email addresses, phone numbers, or other personal details entered into forms.</p>
            <h2>Log Files</h2>
            <p>Hosting providers may collect standard log data such as IP address, browser type, ISP, date and time stamp, referring or exit pages, and click counts. This information is used for administration, security, and performance analysis.</p>
          </div>
        </div>
      </section>
    </>
  )
}
