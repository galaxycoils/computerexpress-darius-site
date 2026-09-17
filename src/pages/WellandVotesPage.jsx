import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import { getLocalBusinessSchema } from '../data/schema'
import {
  CITY_ELECTIONS,
  CITY_CANDIDATES,
  CITY_VOTERS,
  CITY_WARDS,
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
  description: 'Welland residents elect 1 mayor, 12 ward councillors, and school board trustees. Paper ballot, 10 a.m. to 8 p.m.',
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
      name: 'When is the Welland municipal election?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Voting Day is Monday, October 26, 2026, 10 a.m. to 8 p.m. Advance voting runs October 5–9 at Civic Square and October 17–25 at Seaway Mall and the Welland Public Library.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who is running for mayor of Welland?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Eight certified candidates: Natashia Bergen, Pat Chiocchio, David Clow, Gary Graziani, April Jeffs, David McLeod, Brandon Simon, and Graham Speck. One mayor is elected at large.'
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
      name: 'Is there a Welland mayoral debate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The South Niagara Chambers of Commerce hosts a Municipal Debate in Welland on Tuesday, October 6, 2026, 6:30–8:30 p.m. at Royal Canadian Legion Rose City Branch 4. No organizer has published a confirmed participant list.'
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
        title="Welland Votes 2026: Mayor's Race, Dates, How to Vote | St. Catharines Digital"
        description="Welland elects a mayor October 26, 2026. Eight certified candidates, key dates, advance voting locations, eligibility, and down-ballot races — from official City of Welland sources."
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
            <p className="scd-eyebrow">Welland votes · October 26, 2026</p>
            <h1 className="scd-intro-title">Eight candidates. One mayor. Your ballot.</h1>
            <p className="scd-intro-note">Everything a Welland voter needs: the certified mayoral field, key dates, advance voting locations, eligibility, and the rest of the ballot — drawn exclusively from official City of Welland sources.</p>
            <ul className="scd-votes-facts" aria-label="Election at a glance">
              <li><span className="badge badge-status">Voting Day Oct 26</span></li>
              <li><span className="badge badge-status">8 certified for mayor</span></li>
              <li><span className="badge badge-default">Paper ballot</span></li>
            </ul>
          </div>
          <aside className="scd-rail-block scd-votes-rail" aria-label="Vote first">
            <p className="scd-rail-label">Voting Day</p>
            <p className="scd-votes-railprice">Oct 26<span> · 10 a.m. – 8 p.m.</span></p>
            <p>Advance voting opens Oct 5 at Civic Square. Check you are on the voter list before you go.</p>
            <a className="button button-primary" href="https://registertovoteon.ca" target="_blank" rel="noopener noreferrer">Check registration</a>
            <p className="scd-sponsor-fineprint scd-votes-fineprint">Questions: 905-735-1700 · election@welland.ca</p>
          </aside>
        </header>

        <section className="scd-votes-section" aria-labelledby="mayor-race">
          <h2 id="mayor-race" className="scd-section-rule">The mayoral race</h2>
          <p className="scd-votes-standfirst">One mayor, elected at large by every Welland voter. The field below is the Clerk's certified list — names in the city's order, websites exactly as candidates filed them.</p>
          <div className="scd-votes-grid">
            {MAYORAL_CANDIDATES.map((c) => (
              <article key={c.name} className="card meeting-card scd-votes-card">
                <p className="scd-cat">Certified · Mayor</p>
                <h3>{c.name}</h3>
                <p className="scd-votes-office">{c.office}</p>
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
                    {c.label} ↗
                  </a>
                ) : (
                  <p className="scd-votes-nosite">No campaign site on the city registry.</p>
                )}
              </article>
            ))}
          </div>
          <p className="scd-votes-firewall">Platforms above are the candidates' own words, condensed from their campaign sites and linked for verification. Office histories come from city, regional, and police-board records plus on-record reporting. This list mirrors the registry and endorses no one.</p>
        </section>

        <section className="scd-votes-section" aria-labelledby="debates">
          <h2 id="debates" className="scd-section-rule">Debates</h2>
          <p className="scd-votes-standfirst">One confirmed all-candidates event so far. No organizer has published a confirmed participant list — appearances below will update once organizers confirm them.</p>
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
              <h3>How we list appearances</h3>
              <ul>
                <li>Only organizer-confirmed events appear here</li>
                <li>Self-organized social-media sessions are not listed as debates</li>
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
          <h2 id="how-to-vote" className="scd-section-rule">How to vote</h2>
          <div className="scd-votes-howto">
            <div className="card">
              <h3>Are you eligible?</h3>
              <ul>
                <li>Canadian citizen, at least 18 years old</li>
                <li>Resident, owner, or tenant of land in Welland — or spouse of one</li>
                <li>Not prohibited from voting under any law</li>
                <li>Confirm you are on the list at <a href="https://registertovoteon.ca" target="_blank" rel="noopener noreferrer">registertovoteon.ca</a></li>
              </ul>
            </div>
            <div className="card">
              <h3>Where and how</h3>
              <ul>
                <li>Paper ballot — Welland's method since 1968</li>
                <li>Oct 5–9, 10–6: Civic Square, 60 East Main Street</li>
                <li>Oct 17–25, 10–5: Seaway Mall + Public Library, 800 Niagara Street</li>
                <li>Voting Day Oct 26, 10 a.m.–8 p.m.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="scd-votes-section" aria-labelledby="rest-of-ballot">
          <h2 id="rest-of-ballot" className="scd-section-rule">Rest of the ballot</h2>
          <p className="scd-votes-standfirst">Two councillors per ward across six wards under the new boundaries, plus school board trustees. Full names on the <a href={CITY_CANDIDATES} target="_blank" rel="noopener noreferrer">city's certified list</a>.</p>
          <ul className="scd-votes-downballot">
            {DOWN_BALLOT.map((d) => (
              <li key={d.office}>
                <h3>{d.office}</h3>
                <p>{d.detail}</p>
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
              <h3>When do I vote?</h3>
              <p>Monday, October 26, 2026, 10 a.m. to 8 p.m. Advance polls run October 5–9 at Civic Square and October 17–25 at Seaway Mall and the library.</p>
            </li>
            <li>
              <h3>How do I know I am registered?</h3>
              <p>Check at registertovoteon.ca. Also confirm your property taxes support the school board whose trustee you want to elect.</p>
            </li>
            <li>
              <h3>Is it true there are new ward boundaries?</h3>
              <p>Yes. Welland redrew its ward boundaries ahead of this election. Read the <a href={CITY_WARDS} target="_blank" rel="noopener noreferrer">city's ward boundary page</a> to find your ward.</p>
            </li>
            <li>
              <h3>Is there a debate?</h3>
              <p>Yes — the Chambers of Commerce debate is October 6 at the Rose City Legion. Organizers have not confirmed which candidates attend; this page updates when they do.</p>
            </li>
            <li>
              <h3>Where does this information come from?</h3>
              <p>Every date, name, and location on this page comes from official City of Welland election pages. Candidate websites are linked as filed and speak for the candidates.</p>
            </li>
          </ul>
        </section>

        <section className="scd-votes-section" aria-labelledby="votes-sources">
          <h2 id="votes-sources" className="scd-section-rule">Official sources</h2>
          <p className="scd-votes-sources">
            <a href={CITY_ELECTIONS} target="_blank" rel="noopener noreferrer">Municipal Elections — City of Welland</a>
            {' · '}<a href={CITY_CANDIDATES} target="_blank" rel="noopener noreferrer">Registered Candidates</a>
            {' · '}<a href={CITY_VOTERS} target="_blank" rel="noopener noreferrer">Information for Voters</a>
            {' · '}<a href={CITY_WARDS} target="_blank" rel="noopener noreferrer">Ward Boundary Changes</a>
          </p>
        </section>
      </div>
    </>
  )
}
