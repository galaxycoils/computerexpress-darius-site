import "../styles/contact.css";
import { Link } from "react-router-dom";
import Seo, { BASE_URL } from "../components/Seo";
import UiIcon from "../components/journal/UiIcon";
import { siteConfig } from "../data/siteConfig";

export default function MembershipPage() {
  return (
    <>
      <Seo
        title="Reader support | St. Catharines Digital"
        description="Ask about supporting source-linked local information for Niagara. Reader support and sponsorship do not influence editorial decisions."
        path="/membership"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Reader support",
          url: `${BASE_URL}/membership`,
        }}
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">A stronger local connection</p>
          <h1>
            Local information.
            <br />A shared investment.
          </h1>
          <p>
            If you value public records, clear sources and a place to follow
            your community, we’d welcome a conversation about reader support.
          </p>
        </header>
        <div className="journal-support-grid">
          <section className="journal-support-card">
            <UiIcon name="bookmark" size={28} />
            <h2>Start with a conversation.</h2>
            <p>
              Tell us how you would like to support the site. We’ll discuss the
              available arrangements directly before you make a commitment.
            </p>
            <Link
              className="journal-button"
              to="/contact?subject=Reader%20support"
            >
              Ask about reader support <UiIcon />
            </Link>
            <p className="journal-small">
              This is an inquiry. No payment is taken on this website, and no
              membership benefits are currently offered for purchase.
            </p>
          </section>
          <section className="journal-prose">
            <h2>Our commitment to readers.</h2>
            <p>
              Public information should be easy to find and easy to check. Our
              news briefs connect you to original notices and official
              documents.
            </p>
            <p>
              Reader support and sponsorship do not give anyone control over
              coverage or editorial decisions.
            </p>
            <div className="journal-contact-links">
              <Link className="journal-link" to="/editorial-policy">
                Read our editorial policy <UiIcon size={16} />
              </Link>
              <Link className="journal-link" to="/sponsor">
                Explore sponsorship <UiIcon size={16} />
              </Link>
              <a className="journal-link" href={`mailto:${siteConfig.email}`}>
                Email the newsroom <UiIcon name="external" size={16} />
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
