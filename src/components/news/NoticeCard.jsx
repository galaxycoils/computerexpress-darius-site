/** Shared official-notice row — river item on Home and city desks. */
function formatNoticeDate(value) {
  if (!value) return null
  if (/^\\d{4}-\\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-CA', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Toronto',
  })
}

export default function NoticeCard({ notice }) {
  if (!notice) return null

  const dateLabel = formatNoticeDate(notice.publishedDate)

  const summary =
    notice.description && notice.description.length > 160
      ? notice.description.slice(0, 160) + '…'
      : notice.description

  return (
    <article className="scd-notice">
      <div className="scd-notice-meta">
        <span className="scd-notice-chip">{notice.municipality || 'Municipal'}</span>
        {notice.type && <span className="scd-notice-type">{notice.type}</span>}
        {dateLabel && <span className="scd-notice-date">· {dateLabel}</span>}
      </div>
      <h3 className="scd-notice-title">
        {notice.sourceUrl ? (
          <a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer">
            {notice.title}
          </a>
        ) : (
          notice.title
        )}
      </h3>
      {summary && <p className="scd-notice-summary">{summary}</p>}
      {notice.sourceUrl && (
        <a
          className="scd-notice-source"
          href={notice.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Official source →
        </a>
      )}
    </article>
  )
}
