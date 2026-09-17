import Seo, { BASE_URL } from '../components/Seo'

export default function TermsPage() {
  return (
    <>
      <Seo
        title="Terms of Service | St. Catharines Digital"
        description="Terms of Service for St. Catharines Digital."
        path="/terms"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Terms of Service', url: BASE_URL }}
      />
      <section className="section section-first" aria-label="Terms of Service">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>Terms of Service</h1>
          <div style={{ color: 'var(--text)', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>Last updated: May 22, 2026</p>
            <p>Welcome to St. Catharines Digital!</p>
            <p>These terms and conditions outline the rules and regulations for the use of St. Catharines Digital's Website, located at stcatharines.digital.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use St. Catharines Digital if you do not agree to take all of the terms and conditions stated on this page.</p>
            <h2>Cookies</h2>
            <p>We employ the use of cookies. By accessing St. Catharines Digital, you agreed to use cookies in agreement with the St. Catharines Digital's Privacy Policy.</p>
            <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>
            <h2>License</h2>
            <p>Unless otherwise stated, St. Catharines Digital and/or its licensors own the intellectual property rights for all material on St. Catharines Digital. All intellectual property rights are reserved. You may access this from St. Catharines Digital for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul>
              <li>Republish material from St. Catharines Digital</li>
              <li>Sell, rent or sub-license material from St. Catharines Digital</li>
              <li>Reproduce, duplicate or copy material from St. Catharines Digital</li>
              <li>Redistribute content from St. Catharines Digital</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
