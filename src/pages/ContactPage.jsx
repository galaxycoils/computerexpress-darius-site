import "../styles/contact.css";
import { Link, useSearchParams } from "react-router-dom";
import Seo, { BASE_URL } from "../components/Seo";
import ContactForm from "../components/ContactForm";
import { siteConfig } from "../data/siteConfig";
import UiIcon from "../components/journal/UiIcon";
import { getNewsMediaSchema } from "../data/schema";

export default function ContactPage() {
  const [params] = useSearchParams();
  return (
    <>
      <Seo
        title="Contact the newsroom | St. Catharines Digital"
        description="Send a news tip, suggest an event, report a correction or ask about local sponsorship. Get in touch with St. Catharines Digital."
        path="/contact"
        jsonLd={[
          getNewsMediaSchema(),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact the newsroom",
            url: `${BASE_URL}/contact`,
          },
        ]}
      />
      <div className="scd-page journal-page journal-contact-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">A conversation starts here</p>
          <h1>
            Good neighbours.
            <br />
            Open lines.
          </h1>
          <p>
            A news tip, a question, or something we should put right. Help us
            keep Niagara informed and connected.
          </p>
        </header>
        <div className="journal-contact-grid">
          <aside className="journal-contact-aside" aria-label="Contact options">
            <section>
              <p className="journal-kicker">Close to the source</p>
              <h2>What should we know?</h2>
              <p>
                Share a local story or a public record worth a closer look. A
                link to the original source helps us review your tip.
              </p>
              <a
                className="journal-link journal-contact-email"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
                <UiIcon name="external" size={16} />
              </a>
            </section>
            <section>
              <h2>Something to correct?</h2>
              <p>
                Include the page address, the claim to review and a supporting
                source.
              </p>
              <Link className="journal-link" to="/contact?subject=Correction">
                Report a correction <UiIcon name="arrow" size={16} />
              </Link>
            </section>
            <section>
              <h2>A place in the community.</h2>
              <p>
                Suggest an event or discuss supporting local information.
                Sponsorship terms and availability are agreed directly.
              </p>
              <div className="journal-contact-links">
                <Link
                  className="journal-link"
                  to="/contact?subject=Event%20submission"
                >
                  Suggest an event <UiIcon size={16} />
                </Link>
                <Link className="journal-link" to="/sponsor">
                  Sponsorship inquiries <UiIcon size={16} />
                </Link>
              </div>
            </section>
            <p className="journal-small">
              For urgent assistance or an emergency, contact the appropriate
              emergency service. This form is for newsroom inquiries.
            </p>
          </aside>
          <ContactForm
            key={`${params.get("subject") || ""}:${params.get("source") || ""}`}
          />
        </div>
      </div>
    </>
  );
}
