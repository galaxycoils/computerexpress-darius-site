import { startTransition, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Story from "./Story";
import { useSavedStories } from "./SavedStories";

const KEY = "scd-personal-briefing-v1";
const cities = ["All Niagara", "St. Catharines", "Welland", "Thorold"];
const topics = ["All topics", "Development", "City Hall", "Roads & services", "Public safety"];
const defaults = { city: cities[0], topic: topics[0] };

export default function PersonalBriefing({ stories }) {
  const [preferences, setPreferences] = useState(defaults);
  const [notice, setNotice] = useState("");
  const { ids } = useSavedStories();
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "null");
      if (stored) startTransition(() => setPreferences({
        city: cities.includes(stored.city) ? stored.city : defaults.city,
        topic: topics.includes(stored.topic) ? stored.topic : defaults.topic,
      }));
    } catch { /* Keep the briefing usable without browser storage. */ }
  }, []);
  function update(next) {
    setPreferences(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setNotice("Your preferences are saved on this browser.");
    } catch {
      setNotice("Your briefing is updated. Preferences cannot be saved in this browser.");
    }
  }
  const matches = stories.filter(story =>
    (preferences.city === defaults.city || story.cities.includes(preferences.city)) &&
    (preferences.topic === defaults.topic || story.topic === preferences.topic));
  const query = new URLSearchParams();
  if (preferences.topic !== defaults.topic) query.set("topic", preferences.topic);
  const cityPaths = { "St. Catharines": "st-catharines", Welland: "welland", Thorold: "thorold" };
  const href = `/news${cityPaths[preferences.city] ? `/${cityPaths[preferences.city]}` : ""}?${query}`;
  return (
    <section className="personal-briefing" aria-labelledby="personal-briefing-title">
      <div className="personal-briefing-intro">
        <p className="journal-kicker">Selected by you</p>
        <h2 id="personal-briefing-title">Your Niagara.<br /><em>Your briefing.</em></h2>
        <p>A quieter way to catch up. Choose a place and an interest to bring the public record closer to you.</p>
        <Link className="personal-reading-list" to="/saved">Your reading list <span>{ids.length} saved →</span></Link>
      </div>
      <div className="personal-briefing-content">
        <div className="personal-briefing-controls">
          <label>Where you follow<select value={preferences.city} onChange={event => update({ ...preferences, city: event.target.value })}>{cities.map(city => <option key={city}>{city}</option>)}</select></label>
          <label>What matters to you<select value={preferences.topic} onChange={event => update({ ...preferences, topic: event.target.value })}>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></label>
        </div>
        <p className="personal-briefing-status" role="status">{notice || "Personal to this browser. No account needed."}</p>
        <div className="personal-briefing-results" aria-live="polite" aria-atomic="true">
          {matches.length ? matches.slice(0, 2).map(story => <Story key={story.id} story={story} />) : <div className="personal-briefing-empty"><h3>A little quiet here.</h3><p>No coverage matches this combination yet. Try another interest or browse all Niagara.</p><button type="button" className="journal-button" onClick={() => update(defaults)}>Reset preferences</button></div>}
        </div>
        {matches.length > 0 && <Link className="journal-link" to={href}>Explore matching coverage →</Link>}
      </div>
    </section>
  );
}
