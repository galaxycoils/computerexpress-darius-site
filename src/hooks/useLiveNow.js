import { useEffect, useState } from "react";
import { getRenderNow } from "../utils/renderClock.js";

// Keep the first browser render identical to prerendered HTML, then use the
// visitor's clock for time-sensitive labels and filters.
export function useLiveNow() {
  const [now, setNow] = useState(getRenderNow);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return now;
}
