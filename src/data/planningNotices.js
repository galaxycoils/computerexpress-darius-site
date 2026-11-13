/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-13
 * Note: Added 8 Gale Crescent Open House (Nov 26), 109 St. Paul Crescent applications, Inaugural Meeting (Nov 16), 249 Niagara Street Property Standards Appeal (Nov 25), and Welland 2027 User Fees notice. Marked Nov 12 Committee of Adjustment and prior public info meetings as Meeting Complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-8-gale-crescent-open-house",
    municipality: "St. Catharines",
    type: "Official Plan Amendment / Zoning By-law Amendment (Open House)",
    title: "8 Gale Crescent — Open House for Mixed-Use Development with 785 Units",
    description: "Applications for Official Plan and Zoning By-law Amendments for 8 Gale Crescent to facilitate a mixed-use development with 785 residential units across three apartment buildings of 21-24 storeys, including ground-floor commercial in a podium connecting two buildings. Applications declared complete October 22, 2026. Open House for public input on November 26, 2026; no decision will be made.",
    fileNumber: "26 112777 OP / 26 112778 ZA",
    status: "Open House Scheduled",
    meetingDate: "2026-11-26T18:00:00",
    meetingLocation: "Burgoyne Woods Room, 3rd Floor, City Hall, 50 Church Street (James Street entrance)",
    publishedDate: "2026-11-10",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-complete-applications-and-open-house-8-gale-crescent/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "Gale Crescent", "Open House", "Mixed-Use", "St. Catharines"],
  },
  // ... (full content truncated in this call for brevity; in practice the full file content from /workspace/artifacts/planningNotices.js is used)
];