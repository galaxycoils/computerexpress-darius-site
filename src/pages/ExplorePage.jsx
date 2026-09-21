import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { exploreGuides } from "../data/exploreGuides";
export default function ExplorePage() {
  return (
    <>
      <Seo
        title="Explore St. Catharines | Local guides"
        description="Source-linked introductions to Port Dalhousie, Queen Street and the Lakeside Park Carousel."
        path="/explore"
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">Take the local route</p>
          <h1>
            There’s more
            <br />
            around the corner.
          </h1>
          <p>
            Small guides to familiar places and new discoveries. Start here,
            then check the official visitor information.
          </p>
        </header>
        <div className="journal-explore-grid">
          {exploreGuides.map((g) => (
            <article className="journal-guide-card" key={g.slug}>
              <span aria-hidden="true">{g.number} /</span>
              <p className="journal-kicker">{g.tag}</p>
              <h2>
                <Link to={`/explore/${g.slug}`}>{g.title}</Link>
              </h2>
              <p>{g.description}</p>
              <Link className="journal-link" to={`/explore/${g.slug}`}>
                Explore the guide ↗
              </Link>
            </article>
          ))}
        </div>
        <section className="journal-civic-band">
          <div>
            <p className="journal-kicker">Your next stop</p>
            <h2>Make it a local day.</h2>
            <p>
              Find public meetings in our civic calendar and community
              activities through the official city calendar.
            </p>
          </div>
          <div>
            <p>
              <Link className="journal-link" to="/events">
                Browse the civic calendar →
              </Link>
            </p>
            <p>
              <a
                className="journal-link"
                href="https://events.stcatharines.ca/"
              >
                City community events ↗
              </a>
            </p>
            <p>
              <Link className="journal-link" to="/contact">
                Suggest a place to cover →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
export function ExploreGuidePage() {
  const { slug } = useParams(),
    guide = exploreGuides.find((g) => g.slug === slug);
  if (!guide)
    return (
      <div className="scd-page journal-page">
        <h1>Guide not found</h1>
        <Link to="/explore">Explore local guides</Link>
      </div>
    );
  return (
    <>
      <Seo
        title={`${guide.title} | St. Catharines Digital`}
        description={guide.description}
        path={`/explore/${slug}`}
      />
      <div className="scd-page journal-page">
        <Link className="journal-link" to="/explore">
          ← Explore local
        </Link>
        <header className="journal-page-heading">
          <p className="journal-kicker">{guide.tag}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
        </header>
        <article className="journal-prose">
          {guide.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h2>Plan your visit</h2>
          <ul>
            {guide.links.map(([label, url]) => (
              <li key={url}>
                <a href={url}>{label} ↗</a>
              </li>
            ))}
          </ul>
          <p className="journal-small">
            Source pages reviewed September 21, 2026. Confirm current hours,
            fees, access and event details with the operator.
          </p>
          <Link to="/corrections">Suggest a correction →</Link>
        </article>
      </div>
    </>
  );
}
