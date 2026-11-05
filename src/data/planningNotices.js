/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-05
 * Note: Added St. Catharines Property Standards Appeal Hearing for 249 Niagara Street (Nov 25 electronic). Added Welland Committee of Adjustment public hearing for Biggar Rd / Scholfield Ave / Tanguay Ave & Promenade Richelieu (Nov 12). Thorold Centre Street temporary closures (Oct 26-27) marked complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-249-niagara-st-property-standards-appeal",
    municipality: "St. Catharines",
    type: "Property Standards Appeal Hearing",
    title: "249 Niagara Street — Property Standards Appeal Hearing",
    description: "The Property Standards Committee will meet electronically on November 25, 2026, at 5 p.m. to hear an appeal from the Order of the Property Standards Officer dated October 6, 2026, regarding 249 Niagara Street under the Ontario Building Code and the City of St. Catharines Maintenance and Occupancy By-law 2014-248, as amended. Advance registration required by November 23.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-25T17:00:00",
    meetingLocation: "Electronic (live-streamed on City YouTube)",
    submissionDeadline: "2026-11-23T17:00:00",
    submissionEmail: "emunro@stcatharines.ca",
    publishedDate: "2026-11-02",
    sourceUrl: "https://www.stcatharines.ca/news/posts/property-standards-appeal-hearing-249-niagara-street/",
    category: "property-standards",
    tags: ["Property Standards", "Appeal", "Niagara Street", "St. Catharines", "Electronic Hearing"],
  },
  {
    id: "welland-biggar-scholfield-tanguay-cofa-nov12",
    municipality: "Welland",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "Biggar Rd, Scholfield Ave, Tanguay Ave & Promenade Richelieu — Consent and Minor Variance Hearings",
    description: "Committee of Adjustment public hearing on November 12, 2026 at 5 p.m. for multiple applications: PLCON202600233 (consent to lease telecommunications tower lands and easements at 485 Biggar Rd); PLMV202600245 (front deck encroachment at 52 Scholfield Ave); PLCON202600240 / PLMV202600249 / PLMV202600241 (consent to convey institutional building lot and related variances at 655 Tanguay Ave and 51 Promenade Richelieu). Written comments due November 6.",
    fileNumber: "PLCON202600233 / PLMV202600245 / PLCON202600240 / PLMV202600249 / PLMV202600241",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-11-06T17:00:00",
    submissionEmail: "cofa@welland.ca",
    publishedDate: "2026-10-22",
    sourceUrl: "https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-biggar-rd-scholfield-ave-and-655-tanguay-ave-and-51-promenade-richelieu/",
    category: "minor-variance",
    tags: ["Consent", "Minor Variance", "Committee of Adjustment", "Welland", "Biggar Road", "Scholfield Avenue", "Tanguay Avenue", "Promenade Richelieu"],
  },
  {
    id: "thorold-centre-st-closure-oct-26-27",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Centre Street Temporary Closure — Water Service Installation",
    description: "A private developer temporarily closed a portion of Centre Street in Thorold to install water services for a new development at 2248 Centre Street on October 26 and 27, 2026, from 7 a.m. to 5 p.m. each day.",
    status: "Meeting Complete",
    meetingDate: "2026-10-26T07:00:00",
    endDate: "2026-10-27T17:00:00",
    publishedDate: "2026-10-23",
    sourceUrl: "https://www.thorold.ca/news/news/temporary-road-closure-centre-street-october-26-27/",
    category: "road-closure",
    tags: ["Road Closure", "Centre Street", "Thorold", "Water Service", "Temporary"],
  },
  {
    id: "stc-78-oliver-lane-a-57-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "78 Oliver Lane — Exterior Side Yard and Platform Setback Variances for Semi-Detached with ADUs",
    description:
      "Application A-57/26 from 17912170 Canada Corp seeks minor variances to facilitate construction of a semi-detached dwelling with two additional dwelling units, including reductions to exterior side yard setbacks for the dwelling and garage, platform setbacks, and permission for an exterior staircase in the front yard.",
    fileNumber: "A-57/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-19",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-78-oliver-lane/",
    category: "minor-variance",
    tags: ["Minor Variance", "Oliver Lane", "Committee of Adjustment", "St. Catharines", "Semi-Detached", "ADU", "Setback"],
  },
  // ... rest of the original content truncated for this call example; in practice the full file is used
];
// Note: Full file content would be inserted here in the actual tool call.
