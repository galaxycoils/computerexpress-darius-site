import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'

export default function MembershipPage() {
  return (
    <>
      <Seo
        title="Founding Supporters — St. Catharines Digital"
        description="Support independent local news. Founding Supporter memberships keep municipal reporting accountable and free for everyone."
        path="/membership"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Founding Supporters', url: BASE_URL }}
      />
      <div className="scd-page scd-paper">
        <div className="scd-intro">
          <p className="scd-eyebrow">Support local journalism</p>
          <h1 className="scd-intro-title">Become a Founding Supporter</h1>
        </div>
        <div className="scd-membership-grid">
          <div className="scd-membership-tier">
            <h2>Monthly Supporter</h2>
            <p className="scd-tier-price">$10/mo</p>
            <ul>
              <li>Independent local news, free for all</li>
              <li>Weekly digest of planning notices</li>
              <li>Quarterly impact report</li>
            </ul>
            <a href="mailto:cccemt@pm.me?subject=Monthly%20Supporter" className="scd-cta-primary">
              Support Monthly
            </a>
          </div>
          <div className="scd-membership-tier scd-tier-featured">
            <h2>Annual Supporter</h2>
            <p className="scd-tier-price">$100/yr</p>
            <ul>
              <li>Everything in Monthly</li>
              <li>Save 2 months</li>
              <li>Founding Supporter badge on comments</li>
              <li>Early access to new features</li>
            </ul>
            <a href="mailto:cccemt@pm.me?subject=Annual%20Supporter" className="scd-cta-primary">
              Support Annually
            </a>
          </div>
          <div className="scd-membership-tier">
            <h2>Newsroom Champion</h2>
            <p className="scd-tier-price">One-time</p>
            <ul>
              <li>Any amount, any time</li>
              <li>One-off gift to local journalism</li>
            </ul>
            <a href="mailto:cccemt@pm.me?subject=Newsroom%20Champion" className="scd-cta-primary">
              Give Once
            </a>
          </div>
        </div>
        <p className="scd-membership-note">
          St. Catharines Digital is independently owned and operated.
          Reader support keeps our reporting free and accessible to everyone in Niagara.
        </p>
      </div>
    </>
  )
}
