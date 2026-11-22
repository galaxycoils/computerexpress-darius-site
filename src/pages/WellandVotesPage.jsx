import UiIcon from "../components/journal/UiIcon";
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { getLocalBusinessSchema } from '../data/schema'
import {
  CITY_ELECTIONS,
  CITY_CANDIDATES,
  CITY_VOTERS,
  CITY_WARDS,
  CITY_RESULTS,
  CITY_RESULTS_RETRIEVED,
  CHAMBER_DEBATE,
  MAYORAL_CANDIDATES,
  KEY_DATES,
  DOWN_BALLOT,
  RELATED_COVERAGE as RELATED,
} from '../data/wellandVotes'
import '../components/news/news.css'
import '../components/news/election.css'

const votingDayJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Welland Municipal Election — Voting Day',
  startDate: '2026-10-26T10:00:00-04:00',
  endDate: '2026-10-26T20:00:00-04:00',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'City',
    name: 'Welland, Ontario',
  },
  description: 'Welland residents elected 1 mayor, 12 ward councillors, and school board trustees. Paper ballot, 10 a.m. to 8 p.m.',
  organizer: {
    '@type': 'Organization',
    name: 'City of Welland — Office of the City Clerk',
    url: CITY_ELECTIONS,
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'When was the 2026 Welland municipal election?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Voting Day was Monday, October 26, 2026, 10 a.m. to 8 p.m. Advance voting ran October 5–9 at Civic Square and October 17–25 at Seaway Mall and the Welland Public Library. The City Clerk certified the results on October 27, 2026.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who won the 2026 Welland mayoral election?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pat Chiocchio, with 4,271 votes in the results certified by the City Clerk. Graham Speck placed second with 4,216. One mayor was elected at large.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who can vote in Welland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Canadian citizens 18 or older who are residents, owners, or tenants of land in Welland (or spouses of such owners/tenants), and not prohibited by law. Check registration at registertovoteon.ca.'
      }
    },
    {
      '@type': 'Question',
      name: 'Was there a Welland mayoral debate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The South Niagara Chambers of Commerce hosted a Municipal Debate in Welland on Tuesday, October 6, 2026, 6:30–8:30 p.m. at Royal Canadian Legion Rose City Branch 4.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does voting work in Welland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Welland votes by paper ballot, a method used since 1968. Contact the City Clerk at 905-735-1700 or election@welland.ca with questions.'
      }
    }
  ]
}

export default function WellandVotesPage() {
  return (
    <>
      <Seo
        title="Welland Votes 2026: Certified Election Results | St. Catharines Digital"
        description="Certified 2026 Welland election results: Pat Chiocchio elected mayor, two councillors per ward across six wards, and school board trustees — full vote counts from official City of Welland sources."
        path="/welland-votes"
        jsonLd={[votingDayJsonLd, faqJsonLd, getLocalBusinessSchema()]}
      />
      <div className="scd-page">
        <nav className="scd-article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Welland Votes 2026</span>
        </nav>
        <header className="scd-intro scd-votes-intro">
          <div>
            <p className="scd-eyebrow">Welland votes · Certified results</p>
            <p className="scd-votes-banner">
              <strong>Voting closed Oct. 26.</strong>{' '}
              <a href={CITY_RESULTS} target="_blank" rel="noopener noreferrer">City of Welland results</a>
            </p>
            <h1 className="scd-intro-title">Pat Chiocchio is Welland's next mayor.</h1>
            <p className="scd-intro-note">The City Clerk has certified the results of Welland's 2026 municipal election: Pat Chiocchio elected mayor, two councillors per ward across six wards, and school board trustees. Full vote counts below, drawn exclusively from official City of Welland sources.</p>
            <ul className="scd-votes-facts" aria-label="Election at a glance">
              <li><span className="badge badge-status">Results certified Oct 27</span></li>
              <li><span className="badge badge-status">Chiocchio elected mayor</span></li>
              <li><span className="badge badge-default">Paper ballot</span></li>
            </ul>
          </div>
          <aside className="scd-rail-block scd-votes-rail" aria-label="Certified results">
            <p className="scd-rail-label">Mayor-elect</p>
            <p className="scd-votes-railprice">Chiocchio<span> · 4,271 votes</span></p>
            <p>Certified by the City Clerk on October 27, 2026. Graham Speck finished second with 4,216.</p>
            <a className="button button-primary" href={CITY_RESULTS} target="_blank" rel="noopener noreferrer">Official results</a>
            <p className="scd-sponsor-fineprint scd-votes-fineprint">Questions: 905-735-1700 · election@welland.ca</p>
          </aside>
        </header>

        <section className="scd-votes-section" aria-labelledby="mayor-race">
          <h2 id="mayor-race" className="scd-section-rule">Mayoral results</h2>
          <p className="scd-votes-standfirst">One mayor, elected at large by every Welland voter. Certified vote counts below, names in the city's order, websites exactly as candidates filed them during the campaign.</p>
          <div className="scd-votes-grid">
            {MAYORAL_CANDIDATES.map((c) => (
              <article key={c.name} className="card meeting-card scd-votes-card">
                <p className="scd-cat">{c.elected ? 'Elected · Mayor' : 'Mayor'}</p>
                <h3>{c.name}</h3>
                {c.office && c.officeSource ? (
                  <p className="scd-votes-office">
                    {c.office}{' '}
                    <a href={c.officeSource} target="_blank" rel="noopener noreferrer">City of Welland source</a>
                  </p>
                ) : null}
                <p className="scd-votes-office"><strong>{c.votes.toLocaleString('en-CA')}</strong> votes{c.elected ? ' · elected' : ''}</p>
                {c.points.length > 0 ? (
                  <ul className="scd-votes-points">
                    {c.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="scd-votes-nosite">No platform published — <a href={CITY_CANDIDATES} target="_blank" rel="noopener noreferrer">registry contact list</a>.</p>
                )}
                {c.site ? (
                  <a className="scd-votes-link" href={c.site} target="_blank" rel="noopener noreferrer">
                    {c.label} <UiIcon name="external" size={16} />
                  </a>
                ) : (
                  <p className="scd-votes-nosite">No campaign site on the city registry.</p>
                )}
              </article>
            ))}
          </div>
          <p className="scd-votes-firewall">Platforms above are the candidates' own words from the campaign, condensed from their campaign sites and linked for verification. An office line appears only when a City of Welland page states it, and that page is linked. Vote counts are the Clerk's certified results.</p>
        </section>

        <section className="scd-votes-section" aria-labelledby="debates">
          <h2 id="debates" className="scd-section-rule">Debates</h2>
          <p className="scd-votes-standfirst">One confirmed all-candidates event took place during the campaign.</p>
          <div className="scd-votes-howto">
            <div className="card">
              <h3>Municipal Debate — Welland</h3>
              <ul>
                <li>Tuesday, October 6, 2026, 6:30–8:30 p.m.</li>
                <li>Royal Canadian Legion Rose City Branch 4, 383 Morningstar Ave</li>
                <li>Organizer: South Niagara Chambers of Commerce — open attendance, no sign-up</li>
                <li><a href={CHAMBER_DEBATE} target="_blank" rel="noopener noreferrer">Event details</a></li>
              </ul>
            </div>
            <div className="card">
              <h3>How we listed appearances</h3>
              <ul>
                <li>Only organizer-confirmed events appeared here</li>
                <li>Self-organized social-media sessions were not listed as debates</li>
                <li>Equal rule for all eight candidates, no exceptions</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="scd-votes-section" aria-labelledby="key-dates">
          <h2 id="key-dates" className="scd-section-rule">Key dates</h2>
          <ol className="scd-votes-dates">
            {KEY_DATES.map((d) => (
              <li key={d.date}>
                <span className="scd-votes-date">{d.date}</span>
                <p>{d.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="scd-votes-section" aria-labelledby="how-to-vote">
          <h2 id="how-to-vote" className="scd-section-rule">How voting worked</h2>
          <div className="scd-votes-howto">
            <div className="card">
              <h3>Who was eligible?</h3>
              <ul>
                <li>Canadian citizen, at least 18 years old</li>
                <li>Resident, owner, or tenant of land in Welland — or spouse of one</li>
                <li>Not prohibited from voting under any law</li>
                <li>Registration ran through <a href="https://registertovoteon.ca" target="_blank" rel="noopener noreferrer">registertovoteon.ca</a></li>
              </ul>
            </div>
            <div className="card">
              <h3>Where and how</h3>
              <ul>
                <li>Paper ballot — Welland's method since 1968</li>
                <li>Advance polls ran Oct 5–9, 10–6: Civic Square, 60 East Main Street</li>
                <li>Oct 17–25, 10–5: Seaway Mall + Public Library, 800 Niagara Street</li>
                <li>Voting Day was Oct 26, 10 a.m.–8 p.m.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="scd-votes-section" aria-labelledby="rest-of-ballot">
          <h2 id="rest-of-ballot" className="scd-section-rule">Rest of the ballot</h2>
          <p className="scd-votes-standfirst">Two councillors elected per ward across six wards, plus school board trustees. Full certified vote counts on each ward page and the <a href={CITY_RESULTS} target="_blank" rel="noopener noreferrer">city's results page</a>.</p>
          <ul className="scd-votes-downballot">
            {DOWN_BALLOT.map((d) => (
              <li key={d.office}>
                <h3>{d.slug ? <Link to={`/elections/welland/${d.slug}`}>{d.office}</Link> : d.office}</h3>
                <p>
                  {d.detail}
                  {d.source ? (
                    <>
                      {' '}
                      <a href={d.source} target="_blank" rel="noopener noreferrer">City of Welland results</a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="scd-votes-section" aria-labelledby="welland-context">
          <h2 id="welland-context" className="scd-section-rule">What the next mayor inherits</h2>
          <p className="scd-votes-standfirst">Live Welland files from our Planning Tracker — the agenda waiting on the new council's desk.</p>
          <ul className="scd-votes-related">
            {RELATED.map((r) => (
              <li key={r.id}>
                <p className="scd-cat">Planning Tracker</p>
                <h3><Link to="/planning-tracker">{r.title}</Link></h3>
                <p>{r.dek}</p>
              </li>
            ))}
          </ul>
          <Link to="/news/welland" className="scd-more">All Welland coverage →</Link>
        </section>

        <section className="scd-votes-section" aria-labelledby="votes-faq">
          <h2 id="votes-faq" className="scd-section-rule">Questions, answered</h2>
          <ul className="scd-votes-faq">
            <li>
              <h3>When was the election?</h3>
              <p>Monday, October 26, 2026, 10 a.m. to 8 p.m. Advance polls ran October 5–9 at Civic Square and October 17–25 at Seaway Mall and the library. The City Clerk certified the results on October 27.</p>
            </li>
            <li>
              <h3>Who won?</h3>
              <p>Pat Chiocchio won the mayoral race with 4,271 certified votes; Graham Speck was second with 4,216. Ward and trustee results are above and on the <a href={CITY_RESULTS} target="_blank" rel="noopener noreferrer">city's certified results page</a>.</p>
            </li>
            <li>
              <h3>Is it true there are new ward boundaries?</h3>
              <p>Yes. Welland redrew its ward boundaries ahead of this election. Read the <a href={CITY_WARDS} target="_blank" rel="noopener noreferrer">city's ward boundary page</a> to find your ward.</p>
            </li>
            <li>
              <h3>Was there a debate?</h3>
              <p>Yes — the Chambers of Commerce debate took place October 6 at the Rose City Legion.</p>
            </li>
            <li>
              <h3>Where does this information come from?</h3>
              <p>Results come from the City of Welland's certified 2026 election results (retrieved {CITY_RESULTS_RETRIEVED}). Campaign-era details came from official City of Welland election pages and candidate websites as filed.</p>
            </li>
          </ul>
        </section>

        <section className="scd-votes-section" aria-labelledby="votes-sources">
          <h2 id="votes-sources" className="scd-section-rule">Official sources</h2>
          <p className="scd-votes-sources">
            <a href={CITY_RESULTS} target="_blank" rel="noopener noreferrer">2026 Election Results</a>
            {' · '}<a href={CITY_ELECTIONS} target="_blank" rel="noopener noreferrer">Municipal Elections — City of Welland</a>
            {' · '}<a href={CITY_CANDIDATES} target="_blank" rel="noopener noreferrer">Registered Candidates</a>
            {' · '}<a href={CITY_VOTERS} target="_blank" rel="noopener noreferrer">Information for Voters</a>
            {' · '}<a href={CITY_WARDS} target="_blank" rel="noopener noreferrer">Ward Boundary Changes</a>
          </p>
        </section>
      </div>
    </>
  )
}
