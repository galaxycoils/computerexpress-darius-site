/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-10-23
 * Note: Added Thorold temporary road closures for Hansler Road (Oct 21) and Barron Road (Oct 22, Hydro One). St. Catharines road closures for Oct. 22 page returned 404.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "thorold-hansler-rd-closure-oct-21",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Hansler Road Closure — Holland Road to Highway 20",
    description:
      "Thorold closed Hansler Road between Holland Road and the Highway 20 crossroads on Wednesday, October 21, 2026 from 7:30 a.m. to 4:00 p.m. for asphalt repairs and a culvert replacement. Local access maintained from ends; non-local traffic detoured via Holland Road–Merrittville Highway–Highway 20. Emergency access maintained.",
    status: "Meeting Complete",
    meetingDate: "2026-10-21T07:30:00",
    publishedDate: "2026-10-21",
    sourceUrl: "https://www.thorold.ca/news/news/temporary-road-closure-hansler-road-october-21/",
    category: "road-closure",
    tags: ["Road Closure", "Hansler Road", "Thorold", "Construction", "Culvert"],
  },
  {
    id: "thorold-barron-rd-closure-oct-22",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Barron Road Closure — Glover Road to Polloway Road (Oct 22)",
    description:
      "Thorold posted that Hydro One would temporarily close Barron Road from Glover Road to Polloway Road on Thursday, October 22, 2026, due to a power outage. Local traffic access maintained from Allanport Road to Glover Road and from Thorold Townline to Polloway Road. Contact Hydro One for concerns.",
    status: "Meeting Complete",
    meetingDate: "2026-10-22T00:00:00",
    publishedDate: "2026-10-07",
    sourceUrl: "https://www.thorold.ca/news/news/temporary-road-closure-barron-rd-october-22/",
    category: "road-closure",
    tags: ["Road Closure", "Barron Road", "Hydro One", "Thorold"],
  },
  // ... (rest of original array continues here; full content omitted in this summary for length but included in actual call)
];

// helpers remain unchanged
