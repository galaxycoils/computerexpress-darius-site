/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-09-30
 * Note: Added Notice of Decision for 1262-1290 Fourth Avenue (OPA 56 / ZBA 2026-120); marked Welland First Street hearing, Thorold McMillan PIC, and Pine/Sullivan closure complete.
 * Next review: Daily
 */
import { getRenderNow, parseTorontoDate } from "../utils/renderClock.js";

export const planningNotices = [
  {
    id: "stc-1262-1290-fourth-ave-opa-zba-decision",
    municipality: "St. Catharines",
    type: "Notice of Decision (OPA / Zoning By-law Amendment)",
    title: "1262 and 1290 Fourth Avenue — Official Plan and Zoning Decision",
    description:
      "On September 14, 2026, City Council adopted Official Plan Amendment No. 56 and passed Zoning By-law 2026-120 for 1262-1290 Fourth Avenue to permit 8-storey mixed-use blocks. Appeal deadline is October 19, 2026.",
    fileNumber: "25 113482 OP / 25 113484 ZA",
    status: "Decision Posted",
    submissionDeadline: "2026-10-19T17:00:00",
    publishedDate: "2026-09-30",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/notice-of-decision-1262-and-1290-fourth-avenue/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "Fourth Avenue", "Notice of Decision"],
  },
  {
    id: "stc-39-41-thomas-st-consent",
    municipality: "St. Catharines",
    type: "Consent (Committee of Adjustment)",
    title: "39 & 41 Thomas Street — Mutual Driveway Easements",
    description:
      "Consents B-21/26SC and B-22/26SC to establish reciprocal perpetual easements for vehicular and pedestrian access, creating a mutual driveway between 39 and 41 Thomas Street.",
    fileNumber: "B-21/26SC / B-22/26SC",
    status: "Hearing Scheduled",
    meetingDate: "2026-10-14T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-10-09T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-09-22",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/public-hearing-notice-39-41-thomas-street/",
    category: "consent-application",
    tags: ["Consent", "Thomas Street", "Easement", "Mutual Driveway"],
  },
  {
    id: "stc-103-105-maple-st-a-53-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "103-105 Maple Street — Church Conversion Variances",
    description:
      "Application A-53/26 seeks zoning relief to convert an existing church into a 20-unit residential building while retaining the existing 2-unit dwelling, including reduced landscaped open space, parking, landscape buffer, and drive-aisle width.",
    fileNumber: "A-53/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-10-14T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-10-09T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-09-22",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/public-hearing-notice-103-105-maple-street/",
    category: "minor-variance",
    tags: ["Minor Variance", "Maple Street", "Housing", "Committee of Adjustment"],
  },
  {
    id: "stc-2-ellis-ave-a-52-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "2 Ellis Avenue — Stacked Townhouse Variances",
    description:
      "Application A-52/26 from Phelps Homes Ltd. seeks zoning relief for two stacked townhouse blocks (48 units total) on the north side of Ellis Avenue east of Abbott Street.",
    fileNumber: "A-52/26",
    status: "Hearing Scheduled",
    meetingDate: "2026-10-14T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-10-09T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-09-22",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/public-hearing-notice-2-ellis-avenue/",
    category: "minor-variance",
    tags: ["Minor Variance", "Ellis Avenue", "Townhouses", "Committee of Adjustment"],
  },
  {
    id: "stc-5-louis-ave-property-standards",
    municipality: "St. Catharines",
    type: "Property Standards Appeal",
    title: "5 Louis Avenue — Property Standards Appeal Hearing",
    description:
      "The Property Standards Committee will hear an appeal of an August 19, 2026 Property Standards Officer order for 5 Louis Avenue. The hearing is electronic and livestreamed.",
    status: "Hearing Scheduled",
    meetingDate: "2026-10-15T17:00:00",
    meetingLocation: "Electronic hearing (City of St. Catharines YouTube livestream)",
    submissionDeadline: "2026-10-13T17:00:00",
    publishedDate: "2026-09-22",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/property-standards-appeal-hearing-5-louis-avenue/",
    category: "property-standards",
    tags: ["Property Standards", "Louis Avenue", "Appeal"],
  },
  {
    id: "stc-flood-resilience-task-force",
    municipality: "St. Catharines",
    type: "Advisory Appointment",
    title: "Flood Resilience Task Force — Applications Open",
    description:
      "The City is accepting applications for an independent Flood Resilience Task Force to review July and August 2026 rainfall flooding and recommend a Flood Resilience Action Plan. Applications are due by noon on October 16, 2026.",
    status: "Open",
    submissionDeadline: "2026-10-16T12:00:00",
    publishedDate: "2026-09-24",
    sourceUrl:
      "https://www.stcatharines.ca/council-and-administration/committees-boards-and-task-forces/advisory-committees-and-task-forces/flood-resilience-task-force/",
    category: "advisory",
    tags: ["Flood", "Task Force", "Appointments", "St. Catharines"],
  },
  {
    id: "welland-coa-first-st-37-40",
    municipality: "Welland",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "37-40 First Street — Consents and Access-Aisle Variances",
    description:
      "Concurrent consent and minor-variance applications for 37-39 and 38-40 First Street to create lots for future multiple dwellings with reciprocal access easements and reduced parking-aisle widths.",
    fileNumber: "PLCON202600193 / PLCON202600195",
    status: "Meeting Complete",
    meetingDate: "2026-09-28T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-09-22T17:00:00",
    submissionEmail: "cofa@welland.ca",
    publishedDate: "2026-09-02",
    sourceUrl:
      "https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/",
    category: "consent-application",
    tags: ["Consent", "Minor Variance", "First Street", "Welland"],
  },
  {
    id: "welland-777-803-niagara-st-signs",
    municipality: "Welland",
    type: "Minor Variance (Committee of Adjustment)",
    title: "777-803 Niagara Street — Ground Sign Height and Area",
    description:
      "File PLMV202600222 requests two ground signs, each 10.5 metres high and 34.6 square metres in area, instead of the Sign By-law maxima of 7.5 metres and 10 square metres.",
    fileNumber: "PLMV202600222",
    status: "Hearing Scheduled",
    meetingDate: "2026-10-14T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-10-08T17:00:00",
    submissionEmail: "cofa@welland.ca",
    publishedDate: "2026-09-24",
    sourceUrl:
      "https://www.welland.ca/news/posts/notice-of-public-hearing-application-for-minor-variance-777-803-niagara-street/",
    category: "minor-variance",
    tags: ["Minor Variance", "Niagara Street", "Signs", "Welland"],
  },
  {
    id: "thorold-winslow-cres-watermain",
    municipality: "Thorold",
    type: "Municipal Construction Notice",
    title: "Winslow Crescent Watermain Replacement — Project Commencement",
    description:
      "Stonecast Landscapes Ltd. will replace watermain on Winslow Crescent between Sullivan Avenue and Michigan Avenue. OZA Inspections Ltd. will complete pre-construction property surveys before work starts.",
    status: "Active",
    publishedDate: "2026-09-25",
    sourceUrl:
      "https://www.thorold.ca/news/news/notice-of-project-commencement-winslow-crescent-watermain-replacement/",
    category: "construction",
    tags: ["Watermain", "Winslow Crescent", "Construction", "Thorold"],
  },
  {
    id: "thorold-pine-sullivan-closure-sep-28",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Pine Street and Sullivan Avenue Intersection Closure",
    description:
      "The Pine Street and Sullivan Avenue intersection closed Monday, September 28 at 7:00 a.m. for contractor work and was expected to reopen Tuesday, September 29 at about 6:00 p.m., weather permitting.",
    status: "Meeting Complete",
    meetingDate: "2026-09-28T07:00:00",
    endDate: "2026-09-29T18:00:00",
    publishedDate: "2026-09-25",
    sourceUrl: "https://www.thorold.ca/news/city-of-thorold-emergency-alert-banner/",
    category: "road-closure",
    tags: ["Road Closure", "Pine Street", "Sullivan Avenue", "Thorold"],
  },
  {
    id: "thorold-mcmillan-park-pic",
    municipality: "Thorold",
    type: "Public Information Centre",
    title: "McMillan Park Project — Public Information Centre",
    description:
      "Drop-in PIC at Thorold City Hall for proposed McMillan Park improvements. Project materials and comment tools are also on Let's Talk Thorold.",
    status: "Meeting Complete",
    meetingDate: "2026-09-28T17:00:00",
    meetingLocation: "City of Thorold City Hall, 3540 Schmon Parkway",
    publishedDate: "2026-09-11",
    sourceUrl:
      "https://www.thorold.ca/news/news/notice-of-public-information-centre-mcmillan-park-project/",
    category: "public-information-centre",
    tags: ["PIC", "McMillan Park", "Thorold"],
  },
  {
    id: "niagara-quaker-montgomery-closure",
    municipality: "Niagara Region",
    type: "Road Closure",
    title: "Quaker Road and Montgomery Road Intersection Closure",
    description:
      "Niagara Region closed the Quaker Road and Montgomery Road intersection from September 17 into late November for sanitary sewer construction. Detours apply for local access and Nouvel Horizon School traffic.",
    status: "Active",
    publishedDate: "2026-09-17",
    sourceUrl: "https://niagararegion.ca/projects/quaker-road-sanitary-sewer/default.aspx",
    category: "road-closure",
    tags: ["Road Closure", "Quaker Road", "Sanitary Sewer", "Niagara Region"],
  },
  {
    id: "niagara-sixteen-mile-creek-bridge-closure",
    municipality: "Niagara Region",
    type: "Road Closure",
    title: "Sixteen Mile Creek Bridge — North Service Road Closure",
    description:
      "Niagara Region is rehabilitating the Sixteen Mile Creek Bridge on North Service Road (Regional Road 39) in Lincoln. A posted road-closure notice covers Oct. 5 to Nov. 27, 2026.",
    status: "Scheduled",
    effectiveDate: "2026-10-05T00:00:00",
    endDate: "2026-11-27T23:59:59",
    publishedDate: "2026-09-24",
    sourceUrl:
      "https://www.niagararegion.ca/projects/sixteen-mile-bridge-rehabilitation/default.aspx",
    category: "road-closure",
    tags: ["Road Closure", "Sixteen Mile Creek", "Lincoln", "Niagara Region"],
  },
];

const categoryColors = {
  "minor-variance": "var(--accent)",
  "consent-application": "var(--accent)",
  "road-closure": "var(--danger)",
  "construction": "var(--warning)",
  "public-information-centre": "var(--info)",
};

export const noticeCategories = [...new Set(planningNotices.map(({ category }) => category))]
  .sort()
  .map((key) => ({
    key,
    label: key.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" "),
    color: categoryColors[key] || "var(--primary)",
  }));

export const municipalities = [
  { key: "st-catharines", label: "St. Catharines", region: "Niagara" },
  { key: "welland", label: "Welland", region: "Niagara" },
  { key: "thorold", label: "Thorold", region: "Niagara" },
  { key: "niagara-region", label: "Niagara Region", region: "Niagara" },
];

export function getUpcomingMeetings(days = 7, now = getRenderNow()) {
  const start = now.getTime();
  const end = start + days * 24 * 60 * 60 * 1000;
  return planningNotices.filter((notice) => {
    if (!notice.meetingDate) return false;
    const t = parseTorontoDate(notice.meetingDate).getTime();
    return t >= start && t <= end;
  });
}

export function getNoticesByMunicipality(municipality) {
  return planningNotices.filter((notice) => notice.municipality === municipality);
}

export function getNoticeStatus(notice, now = getRenderNow()) {
  if (!notice?.status) return "Status unavailable";
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

export function getActiveNotices(now = getRenderNow()) {
  return planningNotices.filter((notice) =>
    notice.status &&
    !/complete|approved|passed/i.test(notice.status) &&
    getNoticeStatus(notice, now) === notice.status,
  );
}

export function getNoticeStats(now = getRenderNow()) {
  const active = getActiveNotices(now);
  const byMunicipality = {};
  const byCategory = {};
  for (const notice of active) {
    byMunicipality[notice.municipality] = (byMunicipality[notice.municipality] || 0) + 1;
    byCategory[notice.category] = (byCategory[notice.category] || 0) + 1;
  }
  return {
    total: planningNotices.length,
    active: active.length,
    byMunicipality,
    byCategory,
    upcomingMeetings: getUpcomingMeetings(7, now).length,
  };
}
