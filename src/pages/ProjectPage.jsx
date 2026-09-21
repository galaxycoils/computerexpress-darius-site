import { Link, useParams } from "react-router-dom";
import Seo from "../components/Seo";
import { planningNotices } from "../data/planningNotices";
import { dateLabel } from "../data/publication";
import { eventTime } from "../data/events";
export default function ProjectPage() {
  const { id } = useParams(),
    record = planningNotices.find((n) => n.id === id);
  if (!record)
    return (
      <div className="scd-page journal-page">
        <h1>Record not found</h1>
        <Link to="/planning-tracker">Open the planning tracker</Link>
      </div>
    );
  return (
    <>
      <Seo
        title={`${record.title} | Development record`}
        description={record.description}
        path={`/development/${id}`}
      />
      <div className="scd-page journal-page">
        <Link className="journal-link" to="/planning-tracker">
          ← Development tracker
        </Link>
        <header className="journal-page-heading">
          <p className="journal-kicker">
            {record.municipality} / Public record
          </p>
          <h1>{record.title}</h1>
          <p>{record.description}</p>
        </header>
        <div className="journal-prose">
          <dl>
            <dt>Record type</dt>
            <dd>{record.type}</dd>
            <dt>Municipality</dt>
            <dd>{record.municipality}</dd>
            {record.fileNumber && (
              <>
                <dt>File reference</dt>
                <dd>{record.fileNumber}</dd>
              </>
            )}
            <dt>Source published</dt>
            <dd>{dateLabel(record.publishedDate)}</dd>
          </dl>
          <h2>Dates in the record</h2>
          <ul>
            <li>Notice published: {dateLabel(record.publishedDate)}</li>
            {record.meetingDate && (
              <li>
                Scheduled meeting: {dateLabel(record.meetingDate.slice(0, 10))},{" "}
                {eventTime(record.meetingDate)} (Niagara local time).{" "}
                <Link to={`/events/${id}`}>Calendar details</Link>
              </li>
            )}
            {record.submissionDeadline && (
              <li>
                Listed submission deadline:{" "}
                {dateLabel(record.submissionDeadline.slice(0, 10))},{" "}
                {eventTime(record.submissionDeadline)} (Niagara local time).
              </li>
            )}
          </ul>
          <p>
            These dates describe the notice. A passed date does not establish
            approval, a completed hearing, or the outcome of an application.
            Check the municipality’s latest documents for subsequent decisions
            or changes.
          </p>
          <div className="journal-actions">
            <a className="journal-button" href={record.sourceUrl}>
              Read the official record ↗
            </a>
            {record.engageUrl && (
              <a href={record.engageUrl}>Project engagement page ↗</a>
            )}
          </div>
          <Link to="/corrections">Report an update or correction →</Link>
        </div>
      </div>
    </>
  );
}
