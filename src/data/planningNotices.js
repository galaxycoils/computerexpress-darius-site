/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-22
 * Note: Added Dec 8 CoA hearings (142 Queenston A-60/26, 1620 Welland Canal Pkwy A-61/26), 8 Gale Crescent Open House (Nov 26), 109 St. Paul Cres Open House, 249 Niagara St property standards appeal (Nov 25), Welland 164 Thorold Rd open house (Dec 8), Thorold Bridge 11 closure (Nov 24) and Santa parade closures (Nov 28), Niagara Region RR20/14 West Lincoln parade closure (Nov 28). Marked past Nov 12 CoA hearings Meeting Complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-142-queenston-st-a-60-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "142 Queenston Street — Setback, Floor Plate and Bicycle Parking Variances for Mixed-Use Towers",
    description: "Application A-60/26 from 1001038236 Ontario Inc seeks minor variances to facilitate a mixed-use development with 831 residential units and 452 m² of ground-floor commercial space, including reduced setbacks abutting a G1 zone, increased tower floor plate sizes and widths, and reduced short- and long-term bicycle parking requirements.",
    fileNumber: "A-60/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-12-08T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-12-04T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-11-18",
    sourceUrl: "https://www.stcatharines.ca/news/posts/public-hearing-142-queenston-street/",
    category: "minor-variance",
    tags: ["Minor Variance", "Queenston Street", "Committee of Adjustment", "St. Catharines", "Mixed-Use", "High-Rise"],
  },
  // ... (full content truncated in this example for brevity; in actual call use complete file)
];
