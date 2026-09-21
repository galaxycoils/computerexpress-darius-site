import { Link } from "react-router-dom";
import { dateLabel } from "../../data/publication";
import { useSavedStories } from "./SavedStories";

export function StoryLink({ story, children, ...props }) {
  return story.href.startsWith("/") ? (
    <Link to={story.href} {...props}>
      {children || story.title}
    </Link>
  ) : (
    <a href={story.href} {...props}>
      {children || story.title}
    </a>
  );
}
export function Photo({ photo, eager = false }) {
  if (!photo) return null;
  return (
    <figure className="journal-photo">
      <img
        src={photo.src}
        alt={photo.alt}
        width="1200"
        height="800"
        loading={eager ? "eager" : "lazy"}
        fetchpriority={eager ? "high" : "auto"}
        style={{ objectPosition: photo.position || "center" }}
      />
      <figcaption>
        {photo.caption} · <a href={photo.source}>{photo.credit}</a> ·{" "}
        <a
          href={`https://creativecommons.org/licenses/by-sa/${photo.license}/`}
        >
          CC BY-SA {photo.license}
        </a>
      </figcaption>
    </figure>
  );
}
export function SaveButton({ story }) {
  const { ids, toggle, error } = useSavedStories();
  const saved = ids.includes(story.id);
  return (
    <>
      <button
        type="button"
        className="journal-save"
        aria-label={`${saved ? "Unsave" : "Save"} ${story.title}`}
        aria-pressed={saved}
        onClick={() => toggle(story.id)}
      >
        <span aria-hidden="true">{saved ? "▣" : "＋"}</span>{" "}
        {saved ? "Saved" : "Save"}
      </button>
      {error && <small role="alert">{error}</small>}
    </>
  );
}
export default function Story({ story, compact = false, index }) {
  return (
    <article className={`journal-story ${compact ? "is-compact" : ""}`}>
      {index !== undefined && (
        <span className="journal-story-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      )}
      <div>
        <p className="journal-kicker">
          {story.city} <span> / {story.topic}</span>
        </p>
        <h3>
          <StoryLink story={story} />
        </h3>
        {!compact && story.description && (
          <p className="journal-deck">{story.description}</p>
        )}
        <div className="journal-meta">
          <span>{story.kind}</span>
          <time dateTime={story.date || undefined}>
            {dateLabel(story.date)}
          </time>
          {!compact && <SaveButton story={story} />}
        </div>
      </div>
    </article>
  );
}
export function SectionTitle({ kicker, title, to, action = "Explore all" }) {
  return (
    <header className="journal-section-title">
      <div>
        {kicker && <p className="journal-kicker">{kicker}</p>}
        <h2>{title}</h2>
      </div>
      {to && (
        <Link to={to}>
          {action} <span aria-hidden="true">↗</span>
        </Link>
      )}
    </header>
  );
}
