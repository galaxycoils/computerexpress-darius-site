/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-03
 * Note: Added Property Standards Appeal Hearing for 249 Niagara Street (Nov 25 electronic). Added Welland CoA public hearing for Biggar Rd / Scholfield Ave / Tanguay Ave consent and minor variance applications (Nov 12).
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-249-niagara-st-property-standards-appeal",
    municipality: "St. Catharines",
    type: "Property Standards Appeal Hearing",
    title: "249 Niagara Street — Property Standards Appeal Hearing",
    description: "The Property Standards Committee will meet electronically on November 25, 2026 at 5 p.m. to hear an appeal from the Order of the Property Standards Officer dated October 6, 2026, regarding the Ontario Building Code and the City of St. Catharines Maintenance and Occupancy By-law 2014-248 for 249 Niagara Street (PLAN 79 PT BLOCK H RP 30R14988 PART 3). Advance registration required by November 23, 2026. Hearing streamed live on the City YouTube channel.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-25T17:00:00",
    meetingLocation: "Electronic (YouTube livestream)",
    submissionDeadline: "2026-11-23T23:59:59",
    publishedDate: "2026-11-02",
    sourceUrl: "https://www.stcatharines.ca/news/posts/property-standards-appeal-hearing-249-niagara-street/",
    category: "property-standards",
    tags: ["Property Standards", "Appeal Hearing", "Niagara Street", "St. Catharines", "Electronic Meeting"],
  },
  {
    id: "welland-biggar-scholfield-tanguay-coa-nov12",
    municipality: "Welland",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "Biggar Rd, Scholfield Ave, Tanguay Ave and Promenade Richelieu — Consent and Minor Variance Public Hearing",
    description: "Committee of Adjustment public hearing on November 12, 2026 at 5 p.m. at Civic Square Council Chambers for multiple applications: PLCON202600233 (TowerCo Vintage 2 Inc., 485 Biggar Rd — consent to lease telecom tower parcel and easements); PLMV202600245 (Gratton and Witteveen, 52 Scholfield Ave — minor variance for existing front deck encroachment); and PLCON202600240 / PLMV202600249 / PLMV202600241 (Foyer Richelieu Welland, 655 Tanguay Ave and 51 Promenade Richelieu — consent to convey institutional lands and related minor variances for setbacks, parking and planting strips). Written comments due November 6, 2026.",
    fileNumber: "PLCON202600233 / PLMV202600245 / PLCON202600240 / PLMV202600249 / PLMV202600241",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-11-06T23:59:59",
    publishedDate: "2026-10-22",
    sourceUrl: "https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-biggar-rd-scholfield-ave-and-655-tanguay-ave-and-51-promenade-richelieu/",
    category: "consent-minor-variance",
    tags: ["Consent", "Minor Variance", "Committee of Adjustment", "Welland", "Biggar Road", "Scholfield Avenue", "Tanguay Avenue"],
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
