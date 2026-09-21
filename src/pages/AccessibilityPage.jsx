import { Link } from "react-router-dom";
import Seo from "../components/Seo";
export default function AccessibilityPage() {
  return (
    <>
      <Seo
        title="Accessibility | St. Catharines Digital"
        description="Reading options and how to report an accessibility barrier."
        path="/accessibility"
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">For every reader</p>
          <h1>Make yourself at home.</h1>
          <p>Reading options and accessibility feedback.</p>
        </header>
        <div className="journal-prose">
          <h2>Reading options</h2>
          <p>
            Use the theme selector for light, dark or your system preference.
            You can enlarge text with your browser’s zoom controls and navigate
            with a keyboard. A skip link appears when focused at the top of each
            page.
          </p>
          <p>
            The civic calendar includes a list view. Stories can be printed, and
            local coverage is available through the RSS feed.
          </p>
          <h2>Tell us about a barrier</h2>
          <p>
            If something is difficult to read or use, send the page URL and a
            description of the problem. Include your browser or assistive
            technology if you are comfortable sharing it.
          </p>
          <Link to="/contact?subject=Accessibility%20feedback">
            Contact us about accessibility →
          </Link>
          <p>
            Accessibility is an ongoing part of development. We do not claim
            that every third-party source or embedded service meets the same
            accessibility target.
          </p>
        </div>
      </div>
    </>
  );
}
