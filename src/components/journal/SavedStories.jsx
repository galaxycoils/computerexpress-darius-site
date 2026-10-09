import { startTransition, createContext, useContext, useEffect, useRef, useState } from "react";
const KEY = "scd-saved-stories-v1";
const Context = createContext({
  ids: [],
  toggle: () => {},
  clear: () => {},
  error: "",
  notice: "",
  undo: () => {},
  canUndo: false,
});
export function SavedStoriesProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [previous, setPrevious] = useState(null);
  const current = useRef([]);
  useEffect(() => {
    const read = (event) => {
      if (event && event.key !== KEY && event.key !== null) return;
      try {
        const value = JSON.parse(localStorage.getItem(KEY) || "[]");
        const next = Array.isArray(value)
          ? [...new Set(value.filter((x) => typeof x === "string"))].slice(-500)
          : [];
        current.current = next;
        startTransition(() => {
          setIds(next);
          setError("");
          setPrevious(null);
        });
      } catch {
        startTransition(() => setError("Saving is unavailable in this browser."));
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  function write(next, message, allowUndo = false) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setPrevious(allowUndo ? current.current : null);
      current.current = next;
      setIds(next);
      setError("");
      setNotice(message);
    } catch {
      setError("Could not save. Browser storage may be full or disabled.");
    }
  }
  return (
    <Context.Provider
      value={{
        ids,
        error,
        notice,
        canUndo: previous !== null,
        undo: () =>
          previous !== null &&
          write(previous, "Your reading list was restored."),
        toggle: (id) => {
          const saved = current.current.includes(id);
          write(
            saved
              ? current.current.filter((x) => x !== id)
              : [...current.current, id].slice(-500),
            saved
              ? "Removed from your reading list."
              : "Added to your reading list.",
            saved,
          );
        },
        clear: () => write([], "Your reading list was cleared.", true),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useSavedStories = () => useContext(Context);
export function SavedStoriesAnnouncement() {
  const { notice } = useSavedStories();
  return (
    <span className="visually-hidden" role="status" aria-live="polite">
      {notice}
    </span>
  );
}
