/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-10-20
 * Note: Added two new Committee of Adjustment minor variance hearings for 2 and 4 Forestwood Drive (A-54/26 and A-55/26, hearing Nov 12, 2026). Updated status of 1262-1290 Fourth Avenue OPA/ZBA decision to Appeal Period Closed (deadline Oct 19 passed).
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-4-forestwood-dr-a-55-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "4 Forestwood Drive — Platform Setback Variance for Semi-Detached with ADU",
    description:
      "Application A-55/26 seeks a minor variance to reduce the minimum setback from the front lot line to a platform structure with a height above 1.2 metres from 3.0 metres to 1.5 metres, to facilitate construction of a semi-detached dwelling with one additional dwelling unit.",
    fileNumber: "A-55/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-19",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-4-forestwood-drive/",
    category: "minor-variance",
    tags: ["Minor Variance", "Forestwood Drive", "Committee of Adjustment", "St. Catharines", "Semi-Detached", "ADU"],
  },
  {
    id: "stc-2-forestwood-dr-a-54-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "2 Forestwood Drive — Front and Exterior Side Yard Setback Variances",
    description:
      "Application A-54/26 from 17912170 Canada Corp seeks minor variances to reduce the minimum front yard setback to the dwelling from 3.0 m to 1.9 m, exterior side yard setback from 3.0 m to 2.4 m, and platform structure setbacks from the front and exterior lot lines from 3.0 m to 1.5 m.",
    fileNumber: "A-54/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-19",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-2-forestwood-drive/",
    category: "minor-variance",
    tags: ["Minor Variance", "Forestwood Drive", "Committee of Adjustment", "St. Catharines", "Setback"],
  },
  // ... rest of the original file content would be here, but truncated for this example
];
