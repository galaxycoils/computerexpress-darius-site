import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { useSavedStories } from "../components/journal/SavedStories";
import Story from "../components/journal/Story";
import PageHeading from "../components/journal/PageHeading";
import { useState } from "react";
import { getSearchIndex } from "../data/searchIndex";
export default function SavedPage() {
  const { ids, clear, error, notice, undo, canUndo } = useSavedStories();
  const [confirmClear, setConfirmClear] = useState(false);
  const items = getSearchIndex();
  const stories = ids
    .slice()
    .reverse()
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);
  return (
    <>
      <Seo
        title="Saved stories | St. Catharines Digital"
        description="Your reading list on this device."
        path="/saved"
        noIndex
      />
      <div className="scd-page journal-page">
        <PageHeading kicker="Your reading list" title="Keep it for later.">
          <p>
            Saved in this browser, on this device. Clearing browser data removes
            this list.
          </p>
        </PageHeading>
        {error && <p role="alert">{error}</p>}
        {canUndo && (
          <div className="journal-reading-notice">
            <p>{notice}</p>
            <button type="button" className="journal-link" onClick={undo}>
              Undo
            </button>
          </div>
        )}
        {stories.length ? (
          <>
            <div className="journal-results-meta">
              <p>
                {stories.length}{" "}
                {stories.length === 1 ? "saved item" : "saved items"} · Most
                recently saved first
              </p>
              {confirmClear ? (
                <div
                  className="journal-actions"
                  role="group"
                  aria-label="Confirm clearing your reading list"
                >
                  <span>Clear your reading list?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setConfirmClear(false);
                    }}
                  >
                    Yes, clear it
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="journal-link"
                  onClick={() => setConfirmClear(true)}
                >
                  Clear saved stories
                </button>
              )}
            </div>
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
