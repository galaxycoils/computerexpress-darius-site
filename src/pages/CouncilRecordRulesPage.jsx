import { Link } from 'react-router-dom'
import PageHeading from '../components/journal/PageHeading'
import Seo, { BASE_URL } from '../components/Seo'
import './council-record.css'

const PAGE_PATH = '/council-record/how-we-choose-entries'

export default function CouncilRecordRulesPage() {
  return (
    <>
      <Seo
        title="How we choose entries | Council Record"
        description="Sourcing, vote, comment and correction rules for Council Record at St. Catharines Digital."
        path={PAGE_PATH}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'How we choose entries',
          url: `${BASE_URL}${PAGE_PATH}/`,
          isPartOf: { '@type': 'WebSite', name: 'St. Catharines Digital', url: `${BASE_URL}/` },
        }}
      />
      <article className="scd-page journal-page">
        <PageHeading kicker="Method" title="How we choose entries">
          <p>Rules for Council Record, the side-by-side public record of councillor statements and council votes.</p>
          <Link className="journal-link" to="/council-record">Back to Council Record</Link>
        </PageHeading>

        <div className="journal-prose">
          <h2>Exact quotes</h2>
          <p>A statement is the councillor&apos;s words, quoted exactly. The entry does not paraphrase the quote.</p>

          <h2>Sources</h2>
          <p>
            Each quote needs two credible sources, or one credible source plus an archived copy. Every source shows the publisher, the link and the date. Social media is never the only source. A social post, a forum or a rumour does not qualify on its own, and an archive of a social post does not replace a credible source.
          </p>

          <h2>The vote</h2>
          <p>
            The vote is the council decision that sits beside the statement. It names the item, the position and the date. The position is one of: Voted for, Voted against, Abstained, Absent, or No vote yet. The minutes link is the primary city record.
          </p>

          <h2>Presentation</h2>
          <p>
            The statement and the vote are shown side by side, in neutral language. Any opinion appears only in a separate commentary field, and that commentary is signed by the person who wrote it.
          </p>

          <h2>Dates, status and corrections</h2>
          <p>
            Every entry shows the date it was published, the date it was last verified, and a status. The status is a neutral label for the record. Each entry links to a correction and right-of-reply form.
          </p>
          <p>
            <Link to="/corrections">Request a correction / right of reply</Link>
            {' '}
            or use the link on the entry itself. The entry link includes the record id, as in /corrections?entry= followed by that id.
          </p>

          <h2>Comment before publication</h2>
          <p>
            The newsroom asks the councillor for comment before an entry is published. The entry shows the date the comment was requested, and the reply, or &quot;no reply&quot;.
          </p>

          <h2>Public conduct only</h2>
          <p>
            Entries cover public conduct. They include nothing about family, home or private business, unless that information comes from a conflict-of-interest filing or an integrity commissioner report.
          </p>

          <h2>Legal review</h2>
          <p>A lawyer reviews the format and the first batch before entries go live.</p>

          <p>
            <Link to="/editorial-policy">Newsroom editorial policy</Link>
          </p>
          <p className="council-record-byline">Darius T</p>
        </div>
      </article>
    </>
  )
}
