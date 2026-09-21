import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { getPublication } from "../data/publication";
import { useSavedStories } from "../components/journal/SavedStories";
import Story from "../components/journal/Story";
export default function SavedPage() {
  const { ids, clear, error } = useSavedStories();
  const stories = getPublication().filter((x) => ids.includes(x.id));
  return (
    <>
      <Seo
        title="Saved stories | St. Catharines Digital"
        description="Your reading list on this device."
        path="/saved"
        noIndex
      />
      <div className="scd-page journal-page">
        <header className="journal-page-heading">
          <p className="journal-kicker">Your reading list</p>
          <h1>Keep it for later.</h1>
          <p>
            Saved in this browser, on this device. Clearing browser data removes
            this list.
          </p>
        </header>
        {error && <p role="alert">{error}</p>}
        {stories.length ? (
          <>
            <button className="journal-link" onClick={clear}>
              Clear saved stories
            </button>
            <div className="journal-feed">
              {stories.map((s) => (
                <Story story={s} key={s.id} />
              ))}
            </div>
          </>
        ) : (
          <div className="journal-empty">
            <h2>Your next good read belongs here.</h2>
            <p>Choose Save beside any story to start your reading list.</p>
            <Link className="journal-button" to="/news">
              Find a story →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
