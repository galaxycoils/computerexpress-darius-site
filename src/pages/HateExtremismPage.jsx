import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeading from '../components/journal/PageHeading'
import Seo, { BASE_URL } from '../components/Seo'
import {
  TYPE_LABELS,
  SCOPE_LABELS,
  filterEntries,
  formatSourceDate,
  validateEntries,
  validateSupportResources,
} from '../data/hateExtremism'
import {
  hateExtremismEntries,
  hateExtremismSupport,
  hateReportContacts,
} from '../data/hateExtremismEntries'

const PAGE_PATH = '/hate-extremism'

function checkedProduction() {
  const records = validateEntries(hateExtremismEntries)
  const support = validateSupportResources(hateExtremismSupport)
  if (!records.ok || !support.ok) {
    return {
      status: 'error',
      entries: [],
      support: [],
      error: [...records.errors, ...support.errors].join(' '),
    }
  }
  return {
    status: 'ready',
    entries: hateExtremismEntries,
    support: hateExtremismSupport,
    error: null,
  }
}

function SourceList({ sources }) {
  return (
    <ul>
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            {source.title}
          </a>
          {' '}
          <span>{source.outlet}</span>
          {' '}
          {isTime(source.date) ? (
            <time dateTime={source.date}>{formatSourceDate(source.date)}</time>
          ) : (
            <span>{formatSourceDate(source.date)}</span>
          )}
          {source.updated && (
            <>
              {' '}
              <span>
                Updated <time dateTime={source.updated}>{formatSourceDate(source.updated)}</time>
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

function isTime(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '')
}

function EntryCard({ entry }) {
  return (
    <article className="journal-story" id={entry.id} aria-labelledby={`${entry.id}-title`}>
      <p className="journal-kicker">
        {TYPE_LABELS[entry.type] || entry.type}
        <span> / {entry.location}</span>
      </p>
      <h3 id={`${entry.id}-title`}>{entry.title}</h3>
      <p className="journal-meta">
        <span className="badge badge-status">{entry.status}</span>
        {entry.scope === 'regional-context' && (
          <span className="badge badge-cat" style={{ '--badge-tint': 'var(--signal)' }}>
            Regional context
          </span>
        )}
        {entry.eventDateLabel && <span>Rally date: {entry.eventDateLabel}</span>}
      </p>
      {entry.scope === 'regional-context' && (
        <p className="journal-deck">
          This group is based outside Niagara. It is included because credible reporting connects it to the region.
        </p>
      )}
      <p>{entry.summary}</p>
      {entry.methodologyNote && (
        <p className="journal-deck">Methodology note: {entry.methodologyNote}</p>
      )}
      {entry.namedIndividuals?.length > 0 && (
        <div>
          <p className="journal-kicker">Named in this record</p>
          {entry.namedIndividuals.map((person) => (
            <p key={person.name}>
              <strong>{person.name}</strong>
              {' — '}
              {person.quotedDescription}
            </p>
          ))}
        </div>
      )}
      <p className="journal-kicker">Sources</p>
      <SourceList sources={entry.sources} />
      <p className="journal-meta">
        <span>
          Published <time dateTime={entry.published}>{formatSourceDate(entry.published)}</time>
        </span>
        <span>
          Added <time dateTime={entry.dateAdded}>{formatSourceDate(entry.dateAdded)}</time>
        </span>
        <span>
          Last reviewed <time dateTime={entry.lastReviewed}>{formatSourceDate(entry.lastReviewed)}</time>
        </span>
      </p>
      <p className="journal-kicker">Corrections</p>
      {entry.corrections.length > 0 ? (
        <ul>
          {entry.corrections.map((correction) => (
            <li key={`${correction.date}-${correction.note}`}>
              <time dateTime={correction.date}>{formatSourceDate(correction.date)}</time>
              {' — '}
              {correction.note}
            </li>
          ))}
        </ul>
      ) : (
        <p>No corrections logged on this record.</p>
      )}
      <p>
        <Link to={entry.correctionRequest}>Request a correction / right of reply</Link>
      </p>
    </article>
  )
}

export function HateExtremismView({
  status = 'ready',
  entries = [],
  support = [],
  error = null,
}) {
  const [type, setType] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [scope, setScope] = useState('')
  const records = useMemo(
    () => entries.filter((entry) => entry.type !== 'resource'),
    [entries],
  )
  const municipalities = useMemo(
    () => [...new Set(records.map((entry) => entry.location))].sort((a, b) => a.localeCompare(b)),
    [records],
  )
  const visible = useMemo(
    () => filterEntries(records, { type, municipality, scope }),
    [records, type, municipality, scope],
  )
  const filtersActive = Boolean(type || municipality || scope)

  return (
    <div className="scd-page journal-page">
      <PageHeading kicker="Documented public record" title="Hate & Extremism in Niagara">
        <p>
          Court cases, groups, incidents, official statistics and public responses connected to Niagara.
          Each record quotes its sources, names a person only when the editorial rules allow it, and links to a correction request.
        </p>
        <Link className="journal-link" to="/hate-extremism/methodology">
          How entries are chosen
        </Link>
      </PageHeading>

      <section aria-labelledby="standards-heading">
        <h2 id="standards-heading">Editorial standards</h2>
        <p>
          A court case, group, incident or response needs at least two credible sources. Court records, police statements, the Canadian Anti-Hate Network, GPAHE, Public Safety Canada and established news outlets qualify. An official statistic may cite one official publisher, such as Statistics Canada, and can carry a methodology note. A support resource may cite one verified page or phone number. Social media, forums and rumour do not.
        </p>
        <p>
          Descriptions use the source’s wording, in quotation marks or attributed. A person is named only when charged or convicted, when they are a publicly self-identified leader of a documented group, or when they are a public figure already reported by credible press — and only with two sources. Home addresses, workplaces, family members, photos of private people and anything that identifies a minor stay out.
        </p>
        <p>
          <Link to="/hate-extremism/methodology">Read the full method, including the right of reply.</Link>
        </p>
      </section>

      <section aria-labelledby="records-heading">
        <h2 id="records-heading">Records</h2>
        <div className="journal-filters">
          <label>
            Type
            <select aria-label="Type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="">All types</option>
              {Object.entries(TYPE_LABELS).filter(([value]) => value !== 'resource').map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Municipality
            <select aria-label="Municipality" value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
              <option value="">All municipalities</option>
              {municipalities.map((place) => (
                <option key={place} value={place}>{place}</option>
              ))}
            </select>
          </label>
          <label>
            Scope
            <select aria-label="Scope" value={scope} onChange={(event) => setScope(event.target.value)}>
              <option value="">All scopes</option>
              {Object.entries(SCOPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          {filtersActive && (
            <button
              type="button"
              className="journal-button"
              onClick={() => {
                setType('')
                setMunicipality('')
                setScope('')
              }}
            >
              Show all records
            </button>
          )}
        </div>

        {status === 'loading' && (
          <div className="journal-route-loading" role="status">
            <span className="journal-kicker">One moment</span>
            <p>Loading records…</p>
          </div>
        )}
        {status === 'error' && (
          <div className="journal-empty" role="alert">
            <h2>These records could not be shown</h2>
            <p>The dataset failed the editorial checks. Nothing from the failed check is displayed.</p>
            {error && <p>{error}</p>}
          </div>
        )}
        {status === 'ready' && records.length === 0 && (
          <div className="journal-empty">
            <h2>No records published yet</h2>
            <p>Entries are being verified and will appear after editorial review.</p>
          </div>
        )}
        {status === 'ready' && records.length > 0 && visible.length === 0 && (
          <div className="journal-empty">
            <h2>No records match these filters</h2>
            <p>Choose another type, municipality or scope, or show all records.</p>
          </div>
        )}
        {status === 'ready' && visible.length > 0 && (
          <>
            <p className="journal-results-meta" role="status">
              Showing {visible.length} {visible.length === 1 ? 'record' : 'records'}
            </p>
            <div>
              {visible.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="support-heading">
        <h2 id="support-heading">Report hate / get support</h2>
        <p>
          In an emergency, call 911. For a hate crime or hate incident that is not an emergency, the Niagara Regional Police Service lists these non-emergency numbers on its Report Hate page.
        </p>
        <ul>
          {hateReportContacts.map((contact) => (
            <li key={contact.href}>
              {contact.label}
              {': '}
              <a href={contact.href}>{contact.value}</a>
            </li>
          ))}
        </ul>
        {support.map((resource) => (
          <article key={resource.id} className="journal-story" aria-labelledby={`${resource.id}-title`}>
            <h3 id={`${resource.id}-title`}>{resource.title}</h3>
            <p>{resource.summary}</p>
            <p className="journal-meta">
              <span>
                Last reviewed <time dateTime={resource.lastReviewed}>{formatSourceDate(resource.lastReviewed)}</time>
              </span>
            </p>
            <SourceList sources={resource.sources} />
            {resource.correctionRequest && (
              <p>
                <Link to={resource.correctionRequest}>Request a correction / right of reply</Link>
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}

export default function HateExtremismPage() {
  const production = checkedProduction()
  return (
    <>
      <Seo
        title="Hate & Extremism in Niagara | St. Catharines Digital"
        description="A documented public record of hate-motivated cases, groups, incidents and official statistics connected to Niagara, with sources and a correction link on every record."
        path={PAGE_PATH}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Hate & Extremism in Niagara',
          description: 'Documented public record of hate and extremism connected to Niagara.',
          url: `${BASE_URL}${PAGE_PATH}/`,
          isPartOf: { '@type': 'WebSite', name: 'St. Catharines Digital', url: `${BASE_URL}/` },
        }}
      />
      <HateExtremismView {...production} />
    </>
  )
}
