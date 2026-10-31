import { Link } from 'react-router-dom'
import PageHeading from '../components/journal/PageHeading'
import NewsletterPanel from '../components/news/NewsletterPanel'
import Seo, { BASE_URL } from '../components/Seo'
import {
  correctionPath,
  formatRecordDate,
  validateCouncilRecordEntries,
} from '../data/councilRecord'
import { councilRecordEntries } from '../data/councilRecordEntries'
import './council-record.css'

const PAGE_PATH = '/council-record'
const EMPTY_STATE = 'Entries will be added after the new councils take office (Nov. 15, 2026) once each one has been checked and legally reviewed.'

function checkedProduction() {
  const result = validateCouncilRecordEntries(councilRecordEntries)
  if (!result.ok) return { status: 'error', entries: [] }
  return { status: 'ready', entries: councilRecordEntries }
}

function Dated({ value }) {
  return isExactDate(value) ? <time dateTime={value}>{formatRecordDate(value)}</time> : <span>{formatRecordDate(value)}</span>
}

function isExactDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '')
}

function EntryCard({ entry }) {
  const reply = entry.reply && entry.reply.trim() ? entry.reply : 'no reply'
  return (
    <article className="journal-story" id={entry.id} aria-labelledby={`${entry.id}-title`}>
      <p className="journal-kicker">
        {entry.city}
        <span> / {entry.ward}</span>
      </p>
      <h3 id={`${entry.id}-title`}>{entry.councillor_name}</h3>
      <p className="journal-meta">
        <span className="badge badge-status">{entry.status}</span>
        <span>Published <Dated value={entry.published_date} /></span>
        <span>Last verified <Dated value={entry.last_verified_date} /></span>
      </p>
      <div className="council-record-pair">
        <section aria-label="Statement">
          <p className="journal-kicker">Statement</p>
          <blockquote className="council-record-quote">
            <p>{entry.statement.exact_quote}</p>
          </blockquote>
          <ul>
            {entry.statement.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">{source.publisher}</a>
                {' '}
                <Dated value={source.date} />
              </li>
            ))}
          </ul>
          {entry.statement.archived_copy_url && (
            <p>
              <a href={entry.statement.archived_copy_url} target="_blank" rel="noopener noreferrer">Archived copy</a>
            </p>
          )}
        </section>
        <section aria-label="Vote">
          <p className="journal-kicker">Vote</p>
          <p>{entry.vote.item}</p>
          <p>{entry.vote.position}</p>
          <p>
            <Dated value={entry.vote.date} />
            {' · '}
            <a href={entry.vote.minutes_url} target="_blank" rel="noopener noreferrer">City minutes</a>
          </p>
        </section>
      </div>
      <p>
        Comment requested <Dated value={entry.comment_requested_date} />
        {' — '}
        <span>{reply}</span>
      </p>
      {entry.commentary && (
        <aside className="council-record-commentary" aria-label="Commentary">
          <p className="journal-kicker">Commentary</p>
          <p>{entry.commentary.text}</p>
          <p>Signed by {entry.commentary.signed_by}</p>
        </aside>
      )}
      <p>
        <Link to={correctionPath(entry.id)}>Request a correction / right of reply</Link>
      </p>
    </article>
  )
}

export function CouncilRecordEntries({ entries }) {
  if (!entries?.length) return null
  return (
    <div>
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

export function CouncilRecordView({ status = 'ready', entries = [] }) {
  const visible = status === 'ready' ? entries : []
  return (
    <div className="scd-page journal-page council-record-page">
      <PageHeading kicker="Public record" title="Council Record">
        <p>
          Council Record sets a Welland or St. Catharines councillor&apos;s public statement next to the vote in the city minutes. The quote is exact, the vote links to the city record, and the two sit side by side.
        </p>
        <Link className="journal-link" to="/council-record/how-we-choose-entries">How we choose entries</Link>
      </PageHeading>

      <section aria-labelledby="entries-heading">
        <h2 id="entries-heading">Entries</h2>
        <CouncilRecordEntries entries={visible} />
        {status === 'ready' && visible.length === 0 && (
          <div className="journal-empty">
            <h2>No entries yet</h2>
            <p>{EMPTY_STATE}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="journal-empty" role="alert">
            <h2>These entries could not be shown</h2>
            <p>The dataset failed the editorial checks. Nothing from the failed check is displayed.</p>
          </div>
        )}
      </section>

      <section className="journal-newsletter" aria-labelledby="notify-heading">
        <div>
          <p className="journal-kicker">Same mailing list</p>
          <h2 id="notify-heading">Notify me</h2>
          <p>Leave your email and we will write when checked entries are published. This uses the site newsletter. Unsubscribe anytime.</p>
        </div>
        <NewsletterPanel
          placement="council-record"
          source="council-record"
          heading={null}
          lede="Confirm your email to finish signing up."
          buttonLabel="Notify me"
          pendingLabel="Sending…"
        />
      </section>

      <p className="council-record-byline journal-meta">Darius T</p>
    </div>
  )
}

export default function CouncilRecordPage() {
  const production = checkedProduction()
  return (
    <>
      <Seo
        title="Council Record | St. Catharines Digital"
        description="Public statements from Welland and St. Catharines councillors, shown beside the council vote on the city record."
        path={PAGE_PATH}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Council Record',
          description: 'Public statements from Welland and St. Catharines councillors, shown beside the council vote on the city record.',
          url: `${BASE_URL}${PAGE_PATH}/`,
          isPartOf: { '@type': 'WebSite', name: 'St. Catharines Digital', url: `${BASE_URL}/` },
        }}
      />
      <CouncilRecordView {...production} />
    </>
  )
}
