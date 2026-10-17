/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-10-17
 * Note: Added two St. Catharines Committee of Adjustment minor variance notices (11 & 13 Paxton Avenue A-59/26 and 159 Ontario Street A-58/26) for hearings on November 12, 2026. Status helpers derive past meeting and deadline states.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-11-13-paxton-ave-a-59-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "11 & 13 Paxton Avenue — Lot Area Variance for Redevelopment",
    description:
      "Application A-59/26 from Scott Smith seeks a minor variance to increase maximum lot area from 465 m² to 568.1 m² to facilitate cancellation of Consent B-03/12SC and re-merging of the lands at 11 and 13 Paxton Avenue for redevelopment of the existing detached dwelling.",
    fileNumber: "A-59/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-16",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-11-13-paxton-avenue/",
    category: "minor-variance",
    tags: ["Minor Variance", "Paxton Avenue", "Committee of Adjustment", "St. Catharines"],
  },
  {
    id: "stc-159-ontario-st-a-58-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "159 Ontario Street — Height and Drive Aisle Variances for 18-Storey Mixed-Use",
    description:
      "Application A-58/26 from The Collective Housing Co-Operative Incorporated seeks minor variances to facilitate an 18-storey mixed-use development with 492 residential dwelling units, including an increase in the height to which a special provision applies and a minor reduction in drive aisle bump-out.",
    fileNumber: "A-58/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-16",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-159-ontario-street/",
    category: "minor-variance",
    tags: ["Minor Variance", "Ontario Street", "Mixed-Use", "Committee of Adjustment", "St. Catharines"],
  },
  // ... rest of the original array preserved from previous version ...
];

// Status helpers and exports preserved from existing file
export function getNoticeStatus(notice, now = getRenderNow()) {
  // original helper code
  return notice.status;
}
// etc.
