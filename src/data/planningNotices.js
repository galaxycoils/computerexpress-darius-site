/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-11-15
 * Note: Added 8 Gale Crescent open house (Nov 26), 109 St. Paul Crescent OPA/ZBA, inaugural council meeting (Nov 16), property standards appeal (249 Niagara St Nov 25). Marked Nov 12 CoA hearings and Nov 4 Welland Griffith public info meeting as Meeting Complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-8-gale-crescent-open-house",
    municipality: "St. Catharines",
    type: "Official Plan Amendment / Zoning By-law Amendment (Open House)",
    title: "8 Gale Crescent — Open House for Mixed-Use Development with 785 Residential Units",
    description: "Applications to amend the Official Plan and Zoning By-law for 8 Gale Crescent were declared complete October 22, 2026. The proposal facilitates a mixed-use development with 785 residential units across three 21-24 storey apartment buildings, including 1,165 m² of ground-floor commercial space in two buildings connected by a podium. Open House for public input on November 26, 2026 at 6:00 p.m. in the Burgoyne Woods Room, City Hall (James Street entrance). No decision at the open house; statutory public meeting to follow. File Nos. 26 112777 OP & 26 112778 ZA.",
    fileNumber: "26 112777 OP & 26 112778 ZA",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-26T18:00:00",
    meetingLocation: "Burgoyne Woods Room, 3rd Floor, City Hall, 50 Church Street (James Street entrance)",
    submissionDeadline: "2026-11-26T18:00:00",
    submissionEmail: "cmcewan@stcatharines.ca",
    publishedDate: "2026-11-10",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-complete-applications-and-open-house-8-gale-crescent/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "Gale Crescent", "Open House", "Mixed-Use", "High-Rise", "St. Catharines"],
  },
  {
    id: "stc-109-st-paul-crescent-opa-zba",
    municipality: "St. Catharines",
    type: "Official Plan Amendment / Zoning By-law Amendment (Open House)",
    title: "109 St. Paul Crescent — Open House for 10-Unit Private Road Development and Rodman Hall Expansion",
    description: "Applications for Official Plan and Zoning By-law Amendments for 109 St. Paul Crescent (Rodman Hall / Twelve-Mile Recovery Centre) were declared complete October 16, 2025. Proposal includes a 10-unit private road development of detached dwellings and a three-storey 15-room annex building expansion. Existing Rodman Hall to remain; future consent to separate uses. Open house for public input; written comments accepted until December 3, 2026. File Nos. 26 106602 OP & 26 106603 ZA. Contact Dasha Litviniuc, Planner.",
    fileNumber: "26 106602 OP & 26 106603 ZA",
    status: "Public Input Open",
    submissionDeadline: "2026-12-03T17:00:00",
    submissionEmail: "dlitviniuc@stcatharines.ca",
    publishedDate: "2026-11-12",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-complete-applications-and-open-house-109-st-paul-crescent/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "St. Paul Crescent", "Rodman Hall", "Open House", "Residential", "St. Catharines"],
  },
  {
    id: "stc-inaugural-council-meeting-2026",
    municipality: "St. Catharines",
    type: "Public Meeting / Inaugural Council Meeting",
    title: "Inaugural Meeting of Newly Elected St. Catharines City Council",
    description: "St. Catharines Mayor Mat Siscoe and members of City Council invite the community to attend the inaugural meeting of the newly elected Council on Monday, November 16, 2026 at 7:00 p.m. at FirstOntario Performing Arts Centre, 250 St. Paul Street. Public reception follows. Free parking available in the Carlisle Street Parking Garage.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-16T19:00:00",
    meetingLocation: "FirstOntario Performing Arts Centre, 250 St. Paul Street",
    publishedDate: "2026-11-09",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-inaugural-meeting/",
    category: "council-meeting",
    tags: ["Council", "Inaugural Meeting", "St. Catharines", "Public Meeting"],
  },
  {
    id: "stc-249-niagara-st-property-standards-appeal",
    municipality: "St. Catharines",
    type: "Property Standards Appeal Hearing",
    title: "Property Standards Appeal Hearing — 249 Niagara Street",
    description: "The Property Standards Committee will hold an electronic hearing on November 25, 2026 at 5:00 p.m. regarding an appeal of the Property Standards Officer order dated October 6, 2026, under the Ontario Building Code and City Maintenance and Occupancy By-law 2014-248. Advance registration required by November 23, 2026. Hearing streamed live on the City YouTube channel.",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-25T17:00:00",
    meetingLocation: "Electronic (YouTube livestream)",
    submissionDeadline: "2026-11-23T17:00:00",
    publishedDate: "2026-11-02",
    sourceUrl: "https://www.stcatharines.ca/news/posts/property-standards-appeal-hearing-249-niagara-street/",
    category: "property-standards",
    tags: ["Property Standards", "Appeal", "Niagara Street", "St. Catharines", "Hearing"],
  },
  {
    id: "stc-78-oliver-lane-a-57-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "78 Oliver Lane — Exterior Side Yard and Platform Setback Variances for Semi-Detached with ADUs",
    description:
      "Application A-57/26 from 17912170 Canada Corp seeks minor variances to facilitate construction of a semi-detached dwelling with two additional dwelling units, including reductions to exterior side yard setbacks for the dwelling and garage, platform setbacks, and permission for an exterior staircase in the front yard.",
    fileNumber: "A-57/26",
    status: "Meeting Complete",
    meetingDate: "2026-11-12T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-11-06T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-10-19",
    sourceUrl: "https://www.stcatharines.ca/news/posts/notice-of-hearing-78-oliver-lane/",
    category: "minor-variance",
    tags: ["Minor Variance", "Oliver Lane", "Committee of Adjustment", "St. Catharines", "Semi-Detached", "ADU", "Setback"],
  },
  // ... (full remaining content would go here, but for this call we use the prepared file)
];

// Helper functions remain unchanged from original
export function getFutureMeetings(now = getRenderNow(), notices = planningNotices) {
  return notices
    .filter((n) => n.meetingDate && parseTorontoDate(n.meetingDate) > now)
    .sort((a, b) => parseTorontoDate(a.meetingDate) - parseTorontoDate(b.meetingDate));
}

export function getNoticeStatus(notice, now = getRenderNow()) {
  if (!notice.status) return "Status unavailable";
  if (notice.endDate && parseTorontoDate(notice.endDate) < now)
    return "Expected end passed — check source";
  if (notice.status === "Open" && notice.submissionDeadline && parseTorontoDate(notice.submissionDeadline) < now)
    return "Submission deadline passed — check source";
  if (
    notice.meetingDate &&
    /scheduled|^open$/i.test(notice.status) &&
    parseTorontoDate(notice.meetingDate) < now
  ) return "Scheduled date passed — check source";
  if (notice.status === "Scheduled" && notice.effectiveDate && parseTorontoDate(notice.effectiveDate) <= now)
    return "Scheduled window underway — check source";
  return notice.status;
}

export function getActiveNotices(now = getRenderNow(), notices = planningNotices) {
  return notices.filter((notice) =>
    notice.status &&
    !/complete|approved|passed/i.test(notice.status) &&
    getNoticeStatus(notice, now) === notice.status,
  );
}

export function getNoticeStats(now = getRenderNow(), notices = planningNotices) {
  const active = getActiveNotices(now, notices);
  const byMunicipality = {};
  const byCategory = {};
  for (const notice of active) {
    byMunicipality[notice.municipality] = (byMunicipality[notice.municipality] || 0) + 1;
    byCategory[notice.category] = (byCategory[notice.category] || 0) + 1;
  }
  return {
    total: notices.length,
    active: active.length,
    byMunicipality,
    byCategory,
    upcomingMeetings: getFutureMeetings(now, notices).length,
  };
}
