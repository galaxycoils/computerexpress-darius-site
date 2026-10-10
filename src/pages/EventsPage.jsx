import PageHeading from "../components/journal/PageHeading";
import UiIcon from "../components/journal/UiIcon";
import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import {
  civicEvents,
  filterEvents,
  eventTime,
  createCalendarEvent,
} from "../data/events";
import { dateLabel, todayToronto } from "../data/publication";
import { useLiveNow } from "../hooks/useLiveNow.js";
import { parseTorontoDate } from "../utils/renderClock.js";
function EventRow({ event }) {
  return (
    <article className="journal-event-row">
      <div className="journal-event-date">
        <span>
          {new Date(
            event.startsAt.slice(0, 10) + "T12:00:00Z",
          ).toLocaleDateString("en-CA", { month: "short", timeZone: "UTC" })}
        </span>
        <strong>{event.startsAt.slice(8, 10)}</strong>
      </div>
      <div>
        <p className="journal-kicker">{event.municipality} / Civic calendar</p>
        <h2>
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h2>
        <p>
          {dateLabel(event.startsAt.slice(0, 10))} · {eventTime(event.startsAt)}{" "}
          · Niagara local time
        </p>
        <p>
          {event.meetingLocation ||
            "Check the official notice for the location."}
        </p>
      </div>
      <Link to={`/events/${event.id}`}>Details <UiIcon name="external" size={16} /></Link>
    </article>
  );
}
export default function EventsPage() {
  const now = useLiveNow();
  const [params, setParams] = useSearchParams(),
    [selectedMonth, setSelectedMonth] = useState(null);
  const month = selectedMonth || todayToronto(now).slice(0, 7);
  const options = Object.fromEntries(params),
    events = filterEvents(options, now),
    view = params.get("view") || "list";
  const [year, m] = month.split("-").map(Number),
    offset = new Date(Date.UTC(year, m - 1, 1)).getUTCDay(),
    days = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const monthly = events.filter((e) => e.startsAt.startsWith(month));
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  }
  function step(value) {
    setSelectedMonth(
      new Date(Date.UTC(year, m - 1 + value, 1)).toISOString().slice(0, 7),
    );
  }
  return (
    <>
      <Seo
        title="What’s on: civic calendar | St. Catharines Digital"
        description="Upcoming municipal meetings and hearings across Niagara, with official sources and calendar downloads."
        path="/events"
      />
      <div className="scd-page journal-page">
        <PageHeading
          kicker="Show up. Have a say."
          title={<>Make a little room<br />for local.</>}
        >
          <p>
            Municipal meetings and hearings, in one place. Confirm details with
            the organizer before attending.
          </p>
          <a className="journal-link" href="https://events.stcatharines.ca/">
            Looking for community events? Visit the city calendar <UiIcon name="external" size={16} />
          </a>
        </PageHeading>
        <div className="journal-filters">
          <label>
            City
            <select
              aria-label="City" value={options.city || ""}
              onChange={(e) => update("city", e.target.value)}
            >
              <option value="">All cities</option>
              {[...new Set(civicEvents.map((e) => e.municipality))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            When
            <select
              aria-label="When" value={options.period || "upcoming"}
              onChange={(e) => update("period", e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past notices</option>
              <option value="all">All dates</option>
            </select>
          </label>
          <label>
            Specific date
            <input
              type="date"
              value={options.date || ""}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label>
            View
            <select
              aria-label="View" value={view}
              onChange={(e) => update("view", e.target.value)}
            >
              <option value="list">List</option>
              <option value="calendar">Month calendar</option>
            </select>
          </label>
        </div>
        {view === "calendar" && (
          <>
            <div className="journal-calendar-toolbar">
              <button onClick={() => step(-1)} aria-label="Previous month">
                ←
              </button>
              <h2>
                {new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString(
                  "en-CA",
                  { month: "long", year: "numeric", timeZone: "UTC" },
                )}
              </h2>
              <button onClick={() => step(1)} aria-label="Next month">
                →
              </button>
            </div>
            <div className="journal-calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  className="journal-calendar-cell journal-calendar-day"
                  key={d}
                >
                  {d}
                </div>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <div
                  className="journal-calendar-cell"
                  aria-hidden="true"
                  key={`empty${i}`}
                />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const day = `${month}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <div className="journal-calendar-cell" key={day}>
                    <time dateTime={day}>{i + 1}</time>
                    {monthly
                      .filter((e) => e.startsAt.startsWith(day))
                      .map((e) => (
                        <Link to={`/events/${e.id}`} key={e.id}>
                          {e.title}
                        </Link>
                      ))}
                  </div>
                );
              })}
            </div>
            <p className="journal-calendar-mobile-note">
              The selected month’s events are listed below for easier reading on
              a small screen.
            </p>
          </>
        )}
        <div className="journal-events">
          {(view === "calendar" ? monthly : events).map((e) => (
            <EventRow event={e} key={e.id} />
          ))}
        </div>
        {!(view === "calendar" ? monthly : events).length && (
          <div className="journal-empty">
            <h2>No dates listed for this selection.</h2>
            <p>
              Try another month or choose All dates. This calendar is a
              selection of public records, not a complete community-event
              listing.
            </p>
          </div>
        )}
        <p className="journal-small">
          All meeting times are shown in America/Toronto. A past date does not
          establish that a meeting occurred or a decision was made.
        </p>
        <Link className="journal-link" to="/contact?subject=Event%20submission">
          Suggest an event for review →
        </Link>
      </div>
    </>
  );
}
export function EventPage() {
  const now = useLiveNow();
  const { id } = useParams(),
    event = civicEvents.find((e) => e.id === id);
  if (!event)
    return (
      <div className="scd-page journal-page">
        <Seo title="Event not found | St. Catharines Digital" path={`/events/${id}`} noIndex />
        <h1>Event not found</h1>
        <Link to="/events">Open the calendar</Link>
      </div>
    );
  const past = parseTorontoDate(event.startsAt) <= now;
  function download() {
    const url = URL.createObjectURL(
      new Blob([createCalendarEvent(event)], {
        type: "text/calendar;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <>
      <Seo
        title={`${event.title} | Civic calendar`}
        description={event.description}
        path={`/events/${id}`}
      />
      <div className="scd-page journal-page">
        <Link className="journal-link" to="/events">
          ← Civic calendar
        </Link>
        <PageHeading
          kicker={`${event.municipality} / ${past ? "Past scheduled date" : "Upcoming scheduled date"}`}
          title={event.title}
        />
        <div className="journal-prose">
          <dl>
            <dt>Date</dt>
            <dd>{dateLabel(event.startsAt.slice(0, 10))}</dd>
            <dt>Time</dt>
            <dd>{eventTime(event.startsAt)} · America/Toronto</dd>
            <dt>Location</dt>
            <dd>{event.meetingLocation || "Check the official notice"}</dd>
            <dt>Organizer/source</dt>
            <dd>{event.municipality}</dd>
            <dt>Accessibility</dt>
            <dd>
              Confirm accommodation and participation options with the
              municipality.
            </dd>
          </dl>
          <p>{event.description}</p>
          <p>
            {past
              ? "The listed date has passed. Check the official record for minutes, decisions or rescheduling."
              : "Check the official notice for rescheduling, cancellation or participation requirements before attending."}
          </p>
          <div className="journal-actions">
            {!past && <button onClick={download}>Add to calendar ↓</button>}
            <a className="journal-button" href={event.sourceUrl}>
              Read official notice <UiIcon name="external" size={16} />
            </a>
          </div>
          <Link to={`/development/${id}`}>
            View the related public record →
          </Link>
        </div>
      </div>
    </>
  );
}
