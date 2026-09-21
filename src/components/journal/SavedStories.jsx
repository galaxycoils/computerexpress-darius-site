import { createContext, useContext, useEffect, useState } from "react";
const KEY = "scd-saved-stories-v1";
const Context = createContext({
  ids: [],
  toggle: () => {},
  clear: () => {},
  error: "",
});
export function SavedStoriesProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const read = () => {
      try {
        const value = JSON.parse(localStorage.getItem(KEY) || "[]");
        setIds(
          Array.isArray(value)
            ? value.filter((x) => typeof x === "string").slice(0, 500)
            : [],
        );
      } catch {
        setError("Saving is unavailable in this browser.");
      }
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  function write(next) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setIds(next);
      setError("");
    } catch {
      setError("Could not save. Browser storage may be full or disabled.");
    }
  }
  return (
    <Context.Provider
      value={{
        ids,
        error,
        toggle: (id) =>
          write(
            ids.includes(id)
              ? ids.filter((x) => x !== id)
              : [...ids, id].slice(-500),
          ),
        clear: () => write([]),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useSavedStories = () => useContext(Context);
