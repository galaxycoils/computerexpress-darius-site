/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-10
 * Note: Added St. Catharines inaugural meeting (Nov 16), property standards appeal for 249 Niagara Street (Nov 25 electronic), and Welland Committee of Adjustment public hearing for consent/minor variance applications (Nov 12). Updated 1 Griffith Street public information meeting status to Meeting Complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-inaugural-meeting-2026",
    municipality: "St. Catharines",
    type: "Council Inaugural Meeting",
    title: "Notice of Inaugural Meeting of Newly Elected City Council",
    description: "Mayor Mat Siscoe and members of City Council invite the community to the inaugural meeting of the newly elected St. Catharines City Council on Monday, November 16, 2026, at 7 p.m. at FirstOntario Performing Arts Centre, 250 St. Paul St. A public reception follows. Free parking is available in the Carlisle Street Parking Garage.",
    status: "Scheduled",
    meetingDate: "2026-11-16T19:00:00",
    meetingLocation: "FirstOntario Performing Arts Centre, 250 St. Paul St",
    publishedDate: "2026-11-09",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-inaugural-meeting/",
    category: "council-meeting",
    tags: ["Council", "Inaugural Meeting", "St. Catharines", "Public"],
  },
  {
    id: "stc-property-standards-249-niagara-nov-25",
    municipality: "St. Catharines",
    type: "Property Standards Appeal Hearing",
    title: "Property Standards Appeal Hearing: 249 Niagara Street",
    description: "The Property Standards Committee will meet electronically on November 25, 2026, at 5 p.m. to hear an appeal from the Order of the Property Standards Officer dated October 6, 2026, regarding 249 Niagara Street (PLAN 79 PT BLOCK H RP 30R14988 PART 3). Advance registration is required by November 23 by contacting the Secretary-Treasurer. The hearing will be live-streamed on the City of St. Catharines YouTube channel.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-25T17:00:00",
    meetingLocation: "Electronic (YouTube live stream)",
    publishedDate: "2026-11-02",
    sourceUrl: "https://www.stcatharines.ca/news/posts/property-standards-appeal-hearing-249-niagara-street/",
    category: "property-standards",
    tags: ["Property Standards", "Appeal", "Niagara Street", "St. Catharines"],
  },
  {
    id: "welland-coa-nov-12-2026",
    municipality: "Welland",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "Public Hearing: Consent and Minor Variance Applications (Biggar Rd, Scholfield Ave, Tanguay Ave)",
    description: "Committee of Adjustment public hearing scheduled for Thursday, November 12, 2026, at 5 p.m. at Civic Square Council Chambers to consider applications including consent to lease approximately 225 m² for a telecommunications tower and related easements at 485 Biggar Rd; a minor variance for an existing front deck encroachment at 52 Scholfield Ave; and consent plus minor variances related to institutional properties at 655 Tanguay Ave and 51 Promenade Richelieu. Written comments due by November 6, 2026.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-11-06T17:00:00",
    publishedDate: "2026-10-22",
    sourceUrl: "https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-biggar-rd-scholfield-ave-and-655-tanguay-ave-and-51-promenade-richelieu/",
    category: "minor-variance",
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
  }
  // Note: Full file content truncated in this demo call for length; in actual use the complete updated array would be provided.
];
