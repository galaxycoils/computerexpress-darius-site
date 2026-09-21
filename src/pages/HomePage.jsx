import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { getPublication, dateLabel } from "../data/publication";
import { localPhotos } from "../data/localPhotos";
import { getUpcomingMeetings } from "../data/planningNotices";
import Story, {
  StoryLink,
  Photo,
  SectionTitle,
  SaveButton,
} from "../components/journal/Story";
import NewsletterPanel from "../components/news/NewsletterPanel";
import "../components/news/news.css";
export default function HomePage() {
  const stories = getPublication(),
    local = stories.filter(
      (s) => s.cities.includes("St. Catharines") && s.topic !== "Public safety",
    ),
    lead =
      local.find(
        (s) => s.slug === "st-catharines-ontario-street-corridor-plan",
      ) ||
      local.find((s) => s.slug) ||
      local[0] ||
      stories[0];
  const latest = stories.filter((s) => s.date && s.id !== lead?.id).slice(0, 4),
    used = new Set([lead?.id, ...latest.map((s) => s.id)]);
  const more = stories.filter((s) => s.date && !used.has(s.id)).slice(0, 4),
    meetings = getUpcomingMeetings(),
    civic = local.filter((s) => s.id !== lead?.id).slice(0, 2);
  return (
    <>
      <Seo
        title="St. Catharines Digital | Close to home"
        description="Local news, civic records and places to explore in St. Catharines and Niagara. Connected to public records and primary sources."
        path="/"
      />
      <div className="scd-page journal-home">
        <div className="journal-frontline">
          <h1>Your city. Your stories.</h1>
          <p>Public records and primary sources. A little closer to home.</p>
        </div>
        <section className="journal-lead-grid" aria-label="The local briefing">
          <article className="journal-lead">
            {lead && (
              <>
                <div className="journal-lead-photo">
                  <Photo photo={localPhotos["St. Catharines"]} eager />
                  <span className="journal-photo-tag">THE LOCAL PICTURE</span>
                </div>
                <p className="journal-kicker">In focus / {lead.topic}</p>
                <h2 id="lead-story-heading">
                  <StoryLink story={lead} />
                </h2>
                <p className="journal-deck">{lead.description}</p>
                <div className="journal-meta">
                  <time dateTime={lead.date}>{dateLabel(lead.date)}</time>
                  <span>Source brief</span>
                  <SaveButton story={lead} />
                </div>
                <a className="journal-source-link" href={lead.sourceUrl}>
                  Read official source <span aria-hidden="true">↗</span>
                </a>
              </>
            )}
          </article>
          <aside className="journal-latest">
            <SectionTitle
              kicker="THE LOCAL PULSE"
              title="Latest updates"
              to="/news"
              action="All news"
            />
            {latest.map((s, i) => (
              <Story key={s.id} story={s} compact index={i} />
            ))}
            <Link to="/news" className="journal-latest-bottom">
              The full local picture <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </section>
        <section className="journal-briefing" aria-label="Your local briefing">
          <div>
            <span className="journal-kicker">A good place to start</span>
            <h2>Know your city.</h2>
          </div>
          <Link to="/council">
            <span className="journal-small">01 / CITY HALL</span>
            <strong>Decisions that shape daily life.</strong>
            <span>Follow council →</span>
          </Link>
          <Link to="/planning-tracker">
            <span className="journal-small">02 / DEVELOPMENT</span>
            <strong>What’s changing around you?</strong>
            <span>Open Planning Tracker →</span>
          </Link>
          <Link to="/votes">
            <span className="journal-small">03 / YOUR VOICE</span>
            <strong>Election guides and civic information</strong>
            <span>Explore the election hub →</span>
          </Link>
        </section>
        <section className="journal-section">
          <SectionTitle
            kicker="Beyond the headlines"
            title="Around Niagara"
            to="/news"
            action="More coverage"
          />
          <div className="journal-story-grid">
            {more.map((s) => (
              <Story key={s.id} story={s} />
            ))}
          </div>
        </section>
        <section className="journal-week">
          <div>
            <p className="journal-kicker">Make room in your week</p>
            <h2>This week locally</h2>
            <p>
              Meetings, hearings, and opportunities to take part. All times are
              local to Niagara.
            </p>
            <Link className="journal-button journal-button-ink" to="/events">
              Open the civic calendar ↗
            </Link>
          </div>
          <div className="journal-week-events">
            {meetings.length ? (
              meetings.slice(0, 3).map((m) => (
                <Link key={m.id} to={`/events/${m.id}`}>
                  <time dateTime={m.meetingDate}>
                    {dateLabel(m.meetingDate.slice(0, 10))}
                  </time>
                  <strong>{m.title}</strong>
                  <span>{m.municipality} →</span>
                </Link>
              ))
            ) : (
              <>
                <span className="journal-calendar-mark" aria-hidden="true">
                  ↗
                </span>
                <h3>A little further ahead?</h3>
                <p>
                  No municipal meetings are listed in the next seven days.
                  Browse the calendar for upcoming dates and past notices.
                </p>
              </>
            )}
          </div>
        </section>
        <section className="journal-section">
          <SectionTitle
            kicker="A sense of place"
            title="Find your own local."
            to="/explore"
            action="Explore Niagara"
          />
          <div className="journal-place-grid">
            {[
              ["St. Catharines", "st-catharines", "The Garden City"],
              ["Welland", "welland", "Along the water"],
              ["Thorold", "thorold", "A canal-side community"],
            ].map(([city, slug, tag]) => (
              <article key={slug}>
                <Photo photo={localPhotos[city]} />
                <div>
                  <p className="journal-kicker">{tag}</p>
                  <h3>
                    <Link to={`/news/${slug}`}>
                      {city} <span aria-hidden="true">↗</span>
                    </Link>
                  </h3>
                  <p>
                    Local notices, public records and the latest from your city.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="journal-civic-band">
          <div>
            <p className="journal-kicker">The public record</p>
            <h2>Your city is a work in progress.</h2>
            <p>
              Follow planning applications and council notices. Read the
              documents, check the dates, and see how to take part.
            </p>
            <Link to="/planning-tracker" className="journal-link">
              Explore development records →
            </Link>
          </div>
          <div>
            {civic.map((s) => (
              <Story story={s} key={s.id} compact />
            ))}
          </div>
        </section>
        <section className="journal-newsletter" aria-label="Newsletter signup">
          <div>
            <p className="journal-kicker">Good neighbours stay informed</p>
            <h2>
              A little local.
              <br />
              <em>In your inbox.</em>
            </h2>
            <p>Choose the subjects that matter to you.</p>
          </div>
          <NewsletterPanel
            placement="home"
            topics={["Council", "Planning", "Police"]}
          />
        </section>
      </div>
    </>
  );
}
