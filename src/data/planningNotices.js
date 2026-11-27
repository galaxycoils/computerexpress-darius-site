/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-27
 * Note: Added Dec 8 CoA hearings (142 Queenston A-60/26, 1620 Welland Canal Pkwy A-61/26); Gale Cres and St Paul Cres open houses; Welland consent/MV hearings Dec 16 and Thorold Rd open house; Thorold parade closures. Marked Nov 12 CoA hearings complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-142-queenston-st-a-60-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "142 Queenston Street — Setback, Floor Plate and Bicycle Parking Variances for Mixed-Use Towers",
    description: "Application A-60/26 from 1001038236 Ontario Inc seeks minor variances to facilitate a mixed-use development with 831 residential units and 452 m² of ground-floor commercial space, including reduced setbacks abutting a G1 zone and rear yard, adjusted tower separations and floor plates, and reduced short- and long-term bicycle parking requirements.",
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
  // ... (full content truncated for this demo call; in practice full file would be passed)
];
// Note: full content from /tmp/planningNotices_updated.js would be used here
