/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-10-20
 * Note: Added Committee of Adjustment hearings for 2 and 4 Forestwood Drive (A-54/26 and A-55/26, Nov 12, 2026). Marked the 1262-1290 Fourth Avenue appeal deadline (Oct 19) as closed.
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
  {
    id: "stc-lakehurst-dr-closure-oct-15",
    municipality: "St. Catharines",
    type: "Temporary Road Closure",
    title: "Lakehurst Drive Closure — Bedford Court to Arden Court",
    description:
      "The City’s October 15, 2026 traffic notice says Lakehurst Drive is closed from Bedford Court to Arden Court for sewer work. The notice is for that date only.",
    status: "Meeting Complete",
    meetingDate: "2026-10-15T00:00:00",
    publishedDate: "2026-10-15",
    sourceUrl: "https://www.stcatharines.ca/news/posts/traffic-disruptions-for-oct-15-2026/",
    category: "road-closure",
    tags: ["Road Closure", "Lakehurst Drive", "St. Catharines", "Traffic Notice", "Sewer Work"],
  },
  {
    id: "thorold-crompton-bolton-closures-oct-15",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Crompton Boulevard and Bolton Avenue — Ongoing Construction Closures",
    description:
      "Thorold updated that temporary road closures will alternate on Crompton Boulevard (from Richmond Street to the south end) and Bolton Avenue (from Crompton Boulevard to Queen Street) as construction progresses. Local access maintained where possible; short-term driveway restrictions may occur. Emergency access maintained. Project page: Let's Talk Thorold.",
    status: "Active",
    publishedDate: "2026-10-15",
    sourceUrl: "https://www.thorold.ca/news/news/temporary-road-closures-crompton-boulevard-and-bolton-avenue/",
    category: "road-closure",
    tags: ["Road Closure", "Crompton Boulevard", "Bolton Avenue", "Thorold", "Construction"],
  },
  {
    id: "welland-1-griffith-st-public-info",
    municipality: "Welland",
    type: "Official Plan Amendment / Zoning By-law Amendment (Public Information)",
    title: "1 Griffith Street — Public Information Meeting for 12-Storey Residential",
    description:
      "Upper Canada Consultants on behalf of 1435587 Ontario Inc. proposes to rezone and redesignate 1 Griffith Street to permit a 12-storey residential building with 144 dwelling units. Site-specific requests include no ground-floor commercial, reduced setbacks, and parking adjustments. Virtual/in-person public information meeting Nov. 4, 2026 at 6 p.m. at Civic Square Council Chambers. Statutory public hearing to follow at a later date.",
    fileNumber: "PLZBLA202600235 / PLOPA202600236",
    status: "Hearing Scheduled",
    meetingDate: "2026-11-04T18:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland (virtual/in-person)",
    publishedDate: "2026-10-14",
    sourceUrl: "https://www.welland.ca/news/posts/notice-of-public-information-process-concerning-proposed-planning-applications-1-griffith-st/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "Griffith Street", "Public Information", "Welland", "Residential"],
  },
  {
    id: "stc-outdoor-ice-rinks-2026",
    municipality: "St. Catharines",
    type: "Community Program Application",
    title: "2026 Community Outdoor Ice Rinks Applications Now Open",
    description:
      "The City is accepting applications from volunteer groups to host outdoor ice rinks in City parks this winter. Up to six locations supported with grants up to $1,000. Applications due Friday, Nov. 6, 2026 at 4:30 p.m. Season runs Dec. 1, 2026 to March 31, 2027.",
    status: "Open",
    submissionDeadline: "2026-11-06T16:30:00",
    publishedDate: "2026-10-13",
    sourceUrl: "https://www.stcatharines.ca/news/posts/2026-community-outdoor-ice-rinks-applications-now-open/",
    category: "community-program",
    tags: ["Ice Rinks", "Community Program", "Applications", "St. Catharines", "Winter"],
  },
  {
    id: "thorold-short-hills-deer-harvest-2026",
    municipality: "Thorold",
    type: "Park Closure Notice",
    title: "Short Hills Provincial Park Closed for Deer Harvest",
    description:
      "Short Hills Provincial Park will be closed to the public on specified dates for a Haudenosaunee deer harvest: Oct. 28, Nov. 14–15, Nov. 28–29, and Dec. 12, 2026. Park reopens at 8 a.m. the following day. Archery only within designated zone; public access prohibited on harvest days.",
    status: "Active",
    publishedDate: "2026-10-06",
    sourceUrl: "https://www.thorold.ca/news/news/short-hills-provincial-park-will-be-closed-to-the-public-for-a-deer-harvest/",
    category: "park-closure",
    tags: ["Park Closure", "Short Hills", "Deer Harvest", "Thorold", "Public Safety"],
  },
  {
    id: "stc-gibson-place-closure-oct-8",
    municipality: "St. Catharines",
    type: "Temporary Road Closure",
    title: "Gibson Place Closure — Niagara Street to Fitzgerald Street",
    description:
      "The City’s October 8, 2026 traffic notice says Gibson Place is closed from Niagara Street to Fitzgerald Street for a sinkhole repair. The notice is for that date only.",
    status: "Meeting Complete",
    meetingDate: "2026-10-08T00:00:00",
    publishedDate: "2026-10-08",
    sourceUrl: "https://www.stcatharines.ca/news/posts/road-closures-for-oct-8/",
    category: "road-closure",
    tags: ["Road Closure", "Gibson Place", "St. Catharines", "Traffic Notice"],
  },
  {
    id: "thorold-barron-rd-closure-oct-7",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Barron Road Closure — Glover Road to Polloway Road",
    description:
      "Thorold posted that Hydro One temporarily closed Barron Road from Glover Road to Polloway Road on Wednesday, October 7, 2026, for Hydro maintenance. Local traffic was to keep access from Allanport Road to Glover Road and from Thorold Townline Road to Polloway Road. The notice is for that date only.",
    status: "Meeting Complete",
    meetingDate: "2026-10-07T00:00:00",
    publishedDate: "2026-10-07",
    sourceUrl:
      "https://www.thorold.ca/news/news/temporary-road-closure-barron-rd-october-7/",
    category: "road-closure",
    tags: ["Road Closure", "Barron Road", "Hydro One", "Thorold"],
  },
  {
    id: "stc-service-request-portal-oct-5",
    municipality: "St. Catharines",
    type: "Municipal Service Notice",
    title: "Service Request Portal Replaces Report an Issue Form",
    description:
      "On October 5, 2026, the City launched a Service Request Portal at stcatharines.ca/reportanissue for non-urgent requests about roads, parks, trees, signs, property standards, and other City services. Residents can track submissions. Urgent road, water, or sewer issues should still be reported by phone to Citizens First at 905-688-5600.",
    status: "Active",
    publishedDate: "2026-10-05",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/city-launches-new-service-request-portal-to-help-residents-report-and-track-issues-online/",
    category: "municipal-service",
    tags: ["Service Request", "Report an Issue", "Cityworks", "St. Catharines"],
  },
  {
    id: "stc-1262-1290-fourth-ave-opa-zba-decision",
    municipality: "St. Catharines",
    type: "Notice of Decision (OPA / Zoning By-law Amendment)",
    title: "1262 and 1290 Fourth Avenue — Official Plan and Zoning Decision",
    description:
      "On September 14, 2026, City Council adopted Official Plan Amendment No. 56 and passed Zoning By-law 2026-120 for 1262-1290 Fourth Avenue to permit 8-storey mixed-use blocks. The appeal deadline of October 19, 2026 has passed.",
    fileNumber: "25 113482 OP / 25 113484 ZA",
    status: "Appeal Period Closed",
    submissionDeadline: "2026-10-19T17:00:00",
    publishedDate: "2026-09-30",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/notice-of-decision-1262-and-1290-fourth-avenue/",
    category: "official-plan-amendment",
    tags: ["Official Plan", "Zoning", "Fourth Avenue", "Notice of Decision"],
  },
  {
    id: "thorold-sullivan-towpath-front-oct-2",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Sullivan Avenue Closure — Towpath Street to Front Street",
    description:
      "Thorold closed Sullivan Avenue from Towpath Street to Front Street on Friday, October 2, 2026, for about three weeks while the contractor continues downtown underground replacement and road reconstruction. The closure affects on-street parking and one entrance to Parking Lot 1 and the Thorold Community Credit Union lot; both lots stay open from alternate entrances, with detour signs in place.",
    status: "Active",
    meetingDate: "2026-10-02T00:00:00",
    endDate: "2026-10-23T23:59:59",
    publishedDate: "2026-10-02",
    sourceUrl:
      "https://www.thorold.ca/news/news/temporary-road-closure-sullivan-ave-towpath-st-to-front-st-oct-2/",
    category: "road-closure",
    tags: ["Road Closure", "Sullivan Avenue", "Towpath Street", "Front Street", "Thorold"],
  },
  {
    id: "stc-clement-place-closure-oct-2",
    municipality: "St. Catharines",
    type: "Temporary Road Closure",
    title: "Clement Place Closure — Crestcombe Road to Ridley Heights Drive",
    description:
      "The City’s October 2, 2026 traffic notice says Clement Place is closed from Crestcombe Road to Ridley Heights Drive for contractor work. The notice does not give a reopening time.",
    status: "Active",
    publishedDate: "2026-10-02",
    sourceUrl: "https://www.stcatharines.ca/news/posts/road-closures-for-oct-2/",
    category: "road-closure",
    tags: ["Road Closure", "Clement Place", "St. Catharines", "Traffic Notice"],
  },
  {
    id: "stc-henley-drive-closure-oct-1",
    municipality: "St. Catharines",
    type: "Temporary Road Closure",
    title: "Henley Drive Closure — Linhaven Court to Gladman Avenue",
    description:
      "The City’s October 1, 2026 traffic notice listed Henley Drive closed from Linhaven Court to Gladman Avenue. The notice was for that date only.",
    status: "Meeting Complete",
    meetingDate: "2026-10-01T00:00:00",
    publishedDate: "2026-10-01",
    sourceUrl: "https://www.stcatharines.ca/news/posts/road-closures-for-oct-1/",
    category: "road-closure",
    tags: ["Road Closure", "Henley Drive", "St. Catharines", "Traffic Notice"],
  },
  {
    id: "stc-39-41-thomas-st-consent",
    municipality: "St. Catharines",
    type: "Consent (Committee of Adjustment)",
    title: "39 & 41 Thomas Street — Mutual Driveway Easements",
    description:
      "Consents B-21/26SC and B-22/26SC to establish reciprocal perpetual easements for vehicular and pedestrian access, creating a mutual driveway between 39 and 41 Thomas Street.",
    fileNumber: "B-21/26SC / B-22/26SC",
    status: "Meeting Complete",
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
    status: "Meeting Complete",
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
    status: "Meeting Complete",
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
    status: "Meeting Complete",
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
    status: "Applications Closed",
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
    id: "welland-2026-pavement-rejuvenation",
    municipality: "Welland",
    type: "Municipal Construction Notice",
    title: "2026 Pavement Rejuvenation Program",
    description:
      "Welland is resurfacing and sealing listed local streets, including sections of Golden Boulevard, Scholfield Avenue, Crowland Avenue, Welland Street, McAlpine Avenue, White Avenue, Price Avenue, Ross Street, and Parkway. Walker Construction Limited is the contractor. Work was tentatively scheduled to start the week of September 28, 2026, with temporary road and intersection closures signed on site.",
    status: "Active",
    publishedDate: "2026-09-28",
    sourceUrl:
      "https://www.welland.ca/news/posts/2026-pavement-rejuvenation-program/",
    category: "construction",
    tags: ["Construction", "Pavement", "Road Closure", "Welland"],
  },
  {
    id: "welland-777-803-niagara-st-signs",
    municipality: "Welland",
    type: "Minor Variance (Committee of Adjustment)",
    title: "777-803 Niagara Street — Ground Sign Height and Area",
    description:
      "File PLMV202600222 requests two ground signs, each 10.5 metres high and 34.6 square metres in area, instead of the Sign By-law maxima of 7.5 metres and 10 square metres.",
    fileNumber: "PLMV202600222",
    status: "Meeting Complete",
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
    id: "thorold-sullivan-towpath-closure",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Sullivan Avenue and Towpath Street Intersection Closure",
    description:
      "The Sullivan Avenue and Towpath Street intersection was scheduled to close Monday, September 21 at 6:00 a.m. for about two weeks while a contractor replaces aging underground infrastructure and reconstructs the roadway in downtown Thorold. A separate October 2 notice continues the closure along Sullivan Avenue from Towpath Street to Front Street for about three weeks.",
    status: "Active",
    meetingDate: "2026-09-21T06:00:00",
    publishedDate: "2026-09-17",
    sourceUrl:
      "https://www.thorold.ca/news/news/temporary-road-closures-at-sullivan-ave-and-towpath-st-starting-september-21/",
    category: "road-closure",
    tags: ["Road Closure", "Sullivan Avenue", "Towpath Street", "Thorold"],
  },
  {
    id: "thorold-alexandria-drive-closure-sep-22",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Alexandria Drive Closure — Kottmeier Road to Legacy Lane",
    description:
      "Thorold closed Alexandria Drive between Kottmeier Road and Legacy Lane from September 22 to September 23, 2026, 7:00 a.m. to 5:00 p.m. The notice title refers to September 23 and 24; the body gives September 22 and 23.",
    status: "Meeting Complete",
    meetingDate: "2026-09-22T07:00:00",
    endDate: "2026-09-23T17:00:00",
    publishedDate: "2026-09-18",
    sourceUrl:
      "https://www.thorold.ca/news/news/temporary-road-closure-alexandria-drive-september-23-24/",
    category: "road-closure",
    tags: ["Road Closure", "Alexandria Drive", "Thorold"],
  },
  {
    id: "thorold-bridge-11-hwy20-sep-23",
    municipality: "Thorold",
    type: "Temporary Road Closure",
    title: "Bridge 11 (Highway 20) Closure",
    description:
      "Bridge 11 on Highway 20 was closed September 23 and September 24, 2026, from 9:00 a.m. to 4:00 p.m. for bridge and road maintenance. Vehicle and pedestrian traffic were prohibited.",
    status: "Meeting Complete",
    meetingDate: "2026-09-23T09:00:00",
    endDate: "2026-09-24T16:00:00",
    publishedDate: "2026-09-18",
    sourceUrl:
      "https://www.thorold.ca/news/news/bridge-11-hwy-20-closure-september-23-to-24/",
    category: "road-closure",
    tags: ["Road Closure", "Highway 20", "Bridge 11", "Thorold"],
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
      "Niagara Region is rehabilitating the Sixteen Mile Creek Bridge on North Service Road (Regional Road 39) in Lincoln. The posted road-closure notice covers Oct. 5 to Nov. 27, 2026, and that window is now in effect.",
    status: "Active",
    effectiveDate: "2026-10-05T00:00:00",
    endDate: "2026-11-27T23:59:59",
    publishedDate: "2026-09-24",
    sourceUrl:
      "https://www.niagararegion.ca/projects/sixteen-mile-bridge-rehabilitation/default.aspx",
    category: "road-closure",
    tags: ["Road Closure", "Sixteen Mile Creek", "Lincoln", "Niagara Region"],
  },
  // --- New additions from 2026-10-01 sweep ---
  {
    id: "stc-8-graham-ave-b-17-26sc",
    municipality: "St. Catharines",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "8 Graham Avenue — Consent and Minor Variance Applications",
    description:
      "Applications for Minor Variance and Consent (B-17/26SC) for 8 Graham Avenue. Hearing by Committee of Adjustment on August 19, 2026 at 5:00 p.m. Consent to convey land and minor variance relief.",
    fileNumber: "B-17/26SC",
    status: "Meeting Complete",
    meetingDate: "2026-08-19T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-08-14T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-07-28",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/notice-of-hearing-8-graham-avenue/",
    category: "consent-application",
    tags: ["Consent", "Minor Variance", "Graham Avenue", "Committee of Adjustment"],
  },
  {
    id: "stc-90-92-st-paul-west-a-44-26",
    municipality: "St. Catharines",
    type: "Minor Variance (Committee of Adjustment)",
    title: "90–92 St. Paul Street West — 6-Storey 34-Unit Apartment Variance",
    description:
      "Application A-44/26 seeks relief from Zoning By-law 2013-283 to permit a 6-storey, 34-unit apartment building: reduction in minimum lot area from 100 m² to 66.6 m² per dwelling unit. Hearing: August 19, 2026.",
    fileNumber: "A-44/26",
    status: "Meeting Complete",
    meetingDate: "2026-08-19T17:00:00",
    meetingLocation: "Council Chambers, 50 Church St",
    submissionDeadline: "2026-08-14T12:00:00",
    submissionEmail: "cofa@stcatharines.ca",
    publishedDate: "2026-07-28",
    sourceUrl:
      "https://www.stcatharines.ca/news/posts/notice-of-hearing-90-92-st-paul-street-west/",
    category: "minor-variance",
    tags: ["Minor Variance", "St. Paul Street West", "Apartment", "Committee of Adjustment"],
  },
  {
    id: "stc-merritt-chestnut-mountain-reconstruction",
    municipality: "St. Catharines",
    type: "Municipal Construction Notice",
    title: "Merritt / Chestnut / Mountain Streets — Road Reconstruction and Underground Improvements",
    description:
      "Road improvements along Merritt Street (Walnut to Glendale), Chestnut Street extension (Hastings to Mountain), portion of Mountain Street (Glendale to Chestnut), and new pedestrian multi-use path. Construction anticipated mid-to-late July 2026 to December 2026, final restorations potentially spring 2027. Contractor: Peters Excavating Inc. Temporary lane restrictions; road closures avoided where possible.",
    status: "Active",
    publishedDate: "2026-06-22",
    sourceUrl:
      "https://www.engagestc.ca/merritt-chestnut-mountain",
    category: "construction",
    tags: ["Construction", "Road Reconstruction", "Merritt Street", "Chestnut Street", "Mountain Street", "St. Catharines"],
  },
  {
    id: "welland-coa-first-st-aug20-hearing",
    municipality: "Welland",
    type: "Consent and Minor Variance (Committee of Adjustment)",
    title: "Consent and Minor Variance Applications — Public Hearing (Aug 20 Notice)",
    description:
      "Public hearing for consent and minor variance applications. Hearing: September 16, 2026, 5:00 p.m., Civic Square Council Chambers, 60 East Main Street, Welland. Posted August 20, 2026.",
    fileNumber: "PLCON202600193 / PLCON202600195",
    status: "Meeting Complete",
    meetingDate: "2026-09-16T17:00:00",
    meetingLocation: "Civic Square Council Chambers, 60 East Main Street, Welland",
    submissionDeadline: "2026-09-10T17:00:00",
    submissionEmail: "cofa@welland.ca",
    publishedDate: "2026-08-20",
    sourceUrl:
      "https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance/",
    category: "consent-application",
    tags: ["Consent", "Minor Variance", "Welland", "Committee of Adjustment"],
  },
  {
    id: "welland-694-698-niagara-st-zba",
    municipality: "Welland",
    type: "Zoning By-law Amendment (Public Information Process)",
    title: "694 & 698 Niagara Street — Proposed Zoning By-law Amendment (7-Storey, 217-Unit Apartment)",
    description:
      "File PLZBLA202500064: Rezone from Single-Detached Dwelling (R1) to Residential High Density (RH) to permit a 7-storey, 217-unit apartment building with at-grade parking. Public Information Meeting: January 28, 2026, 6:00–7:30 p.m., Civic Square Community Room. Statutory Public Hearing: February 24, 2026, 6:00 p.m., Civic Square Council Chambers.",
    fileNumber: "PLZBLA202500064",
    status: "Meeting Complete",
    meetingDate: "2026-01-28T18:00:00",
    meetingLocation: "Civic Square Community Room, 60 East Main Street, Welland",
    submissionDeadline: "2026-02-13T12:00:00",
    submissionEmail: "devserv@welland.ca",
    publishedDate: "2026-01-08",
    sourceUrl:
      "https://www.welland.ca/news/posts/notice-of-public-information-process-concerning-proposed-zoning-by-law-amendment-694-niagara-street-and-698-niagara-street/",
    category: "zoning-by-law-amendment",
    tags: ["Zoning By-law Amendment", "Niagara Street", "Apartment", "Welland"],
  },
  {
    id: "welland-water-wastewater-budget-2026",
    municipality: "Welland",
    type: "Budget Public Input Notice",
    title: "2026 Water and Wastewater Budgets — Public Input Meeting",
    description:
      "Open meeting to obtain public input regarding the 2026 Water and Wastewater Budgets. Posted November 3, 2025.",
    status: "Meeting Complete",
    publishedDate: "2025-11-03",
    sourceUrl:
      "https://www.welland.ca/media/Notices.asp",
    category: "budget",
    tags: ["Budget", "Water", "Wastewater", "Welland", "Public Input"],
  },
  {
    id: "thorold-clairmont-st-zba",
    municipality: "Thorold",
    type: "Zoning By-law Amendment (Public Meeting)",
    title: "24–26 Clairmont Street — Zoning By-law Amendment (I2 to R1C)",
    description:
      "File D14-07-2026: Rezone from Minor Institutional (I2) to Residential One (R1C) to facilitate severance of manse building from church. Public Meeting: August 11, 2026, 6:30 p.m., Hybrid (City Hall Council Chamber or YouTube). Owner: Thorold Presbyterian Church.",
    fileNumber: "D14-07-2026",
    status: "Meeting Complete",
    meetingDate: "2026-08-11T18:30:00",
    meetingLocation: "Hybrid: City Hall Council Chamber / YouTube",
    submissionDeadline: "2026-08-06T16:30:00",
    publishedDate: "2026-07-16",
    sourceUrl:
      "https://www.thorold.ca/news/news/notice-of-public-meeting-for-a-zoning-by-law-amendment-24-26-clairmont-st/",
    category: "zoning-by-law-amendment",
    tags: ["Zoning By-law Amendment", "Clairmont Street", "Thorold"],
  },
  {
    id: "thorold-confederation-heights-zba",
    municipality: "Thorold",
    type: "Zoning By-law Amendment (Public Meeting)",
    title: "Confederation Heights Phase 10 (Blocks 232–234, 236 & 235, 237–239) — Zoning By-law Amendment",
    description:
      "File D12-02-2022: Zoning by-law amendment for lands owned by Mountainview Homes (Niagara) Ltd and LH (Thorold) Ltd within Confederation Heights Phase 10 (Plan 59M-537). Public Meeting posted August 17, 2026.",
    fileNumber: "D12-02-2022",
    status: "Hearing Scheduled",
    meetingDate: "2026-09-08T18:30:00",
    meetingLocation: "Hybrid: City Hall Council Chamber / YouTube",
    submissionDeadline: "2026-09-01T16:30:00",
    publishedDate: "2026-08-17",
    sourceUrl:
      "https://www.thorold.ca/news/notices-and-announcements/",
    category: "zoning-by-law-amendment",
    tags: ["Zoning By-law Amendment", "Confederation Heights", "Thorold"],
  },
  {
    id: "thorold-1201-egerter-rd-zba",
    municipality: "Thorold",
    type: "Zoning By-law Amendment (Public Meeting)",
    title: "1201 Egerter Road — Zoning By-law Amendment",
    description:
      "Proposed zoning by-law amendment for 1201 Egerter Road. Public Meeting posted August 17, 2026.",
    fileNumber: "D14-08-2026",
    status: "Hearing Scheduled",
    meetingDate: "2026-09-08T18:30:00",
    meetingLocation: "Hybrid: City Hall Council Chamber / YouTube",
    submissionDeadline: "2026-09-01T16:30:00",
    publishedDate: "2026-08-17",
    sourceUrl:
      "https://www.thorold.ca/news/notices-and-announcements/",
    category: "zoning-by-law-amendment",
    tags: ["Zoning By-law Amendment", "Egerter Road", "Thorold"],
  },
  {
    id: "thorold-2026-final-tax-bill",
    municipality: "Thorold",
    type: "Tax Bill Notice",
    title: "2026 Final Tax Bill — Mailing and Due Dates",
    description:
      "2026 Final Tax Bills mailed on or before June 9, 2026. Instalment 1 due: June 30, 2026 by 4:30 p.m. Instalment 2 due: August 31, 2026 by 4:30 p.m. Contact Tax Clerk at 905-227-6613 ext. 235 or Taxes@thorold.ca if not received by June 17, 2026.",
    status: "Published",
    publishedDate: "2026-05-27",
    sourceUrl:
      "https://www.thorold.ca/news/news/public-notice-the-2026-final-tax-bill-will-be-mailed-on-or-before-june-9-2026/",
    category: "budget",
    tags: ["Tax Bill", "2026", "Thorold", "Due Dates"],
  },
  {
    id: "niagara-2026-budget-approved",
    municipality: "Niagara Region",
    type: "Budget Approval",
    title: "2026 Budget Approved — $579M General Tax Levy, 6.30% Increase",
    description:
      "Council approved the 2026 General Tax Levy Budget: $579.0 million (increase of $42.3M, 6.30% property tax increase on Regional portion). For average property assessed at $298,000: Regional tax increase of $137, totaling $2,307 in 2026. Water/Wastewater budget increase: 7.42% ($12.9M). Capital Budget: $192.8M (131 projects). Approved February 2026.",
    status: "Approved",
    publishedDate: "2026-02-13",
    sourceUrl:
      "https://www.niagararegion.ca/government/budget/2026/default.aspx",
    category: "budget",
    tags: ["Budget", "2026", "Tax Levy", "Niagara Region", "Water", "Wastewater", "Capital"],
  },
  {
    id: "niagara-casablanca-blvd-pic",
    municipality: "Niagara Region",
    type: "Public Information Centre (Pre-construction)",
    title: "Casablanca Boulevard (Regional Road 10) Reconstruction — Pre-construction PIC (Grimsby)",
    description:
      "Contract 2026-T-70: Reconstruction of Casablanca Boulevard from North Service Road (Regional Road 39) to Livingston Avenue (Regional Road 512) in Grimsby. Public Information Centre: two-week period starting Monday, September 7, 2026 (online). Completed Schedule C Municipal Class EA in 2019.",
    status: "Scheduled",
    meetingDate: "2026-09-07T00:00:00",
    meetingLocation: "Online (two-week period)",
    publishedDate: "2026-09-17",
    sourceUrl:
      "https://www.niagararegion.ca/news/notices/notice.aspx?q=1018",
    category: "public-information-centre",
    tags: ["PIC", "Casablanca Boulevard", "Grimsby", "Road Reconstruction", "Niagara Region"],
  },
  {
    id: "niagara-regional-road-20-west-lincoln",
    municipality: "Niagara Region",
    type: "Road Construction Notice",
    title: "Regional Road 20 Reconstruction — West Lincoln",
    description:
      "Contract 2025-T-45: Reconstruction of Regional Road 20 from South Grimsby Road 5 to Wade Road with infrastructure improvements on Wade Road. Construction tentatively beginning soon, anticipated completion by July 3, 2026. Contractor: Baiocco Construction Corp. Single lane closures may be required.",
    status: "Active",
    publishedDate: "2026-07-15",
    sourceUrl:
      "https://niagararegion.ca/news/notices/notice.aspx?q=944",
    category: "construction",
    tags: ["Road Reconstruction", "Regional Road 20", "West Lincoln", "Niagara Region"],
  },
  {
    id: "niagara-mcleod-rd-pic",
    municipality: "Niagara Region",
    type: "Public Information Centre (Pre-construction)",
    title: "McLeod Road (Regional Road 49) Reconstruction — Pre-construction PIC (Niagara Falls)",
    description:
      "Contract 2025-T-189: Reconstruction of McLeod Road from Oakwood Drive to Wilson Crescent in Niagara Falls. Public Information Centre: Wednesday, July 22, 2026, 6:00–8:00 p.m., MacBain Community Centre, 7150 Montrose Rd. New sidewalks, multi-use paths, traffic signals, storm/sanitary sewers, watermain.",
    status: "Meeting Complete",
    meetingDate: "2026-07-22T18:00:00",
    meetingLocation: "MacBain Community Centre, 7150 Montrose Rd, Niagara Falls",
    publishedDate: "2026-07-08",
    sourceUrl:
      "https://www.niagararegion.ca/news/notices/notice.aspx?q=1009",
    category: "public-information-centre",
    tags: ["PIC", "McLeod Road", "Niagara Falls", "Road Reconstruction", "Niagara Region"],
  },
  {
    id: "niagara-king-st-lincoln-closure",
    municipality: "Niagara Region",
    type: "Road Construction Notice",
    title: "King Street (Regional Road 81) Reconstruction — Lincoln",
    description:
      "Contract 2024-T-100: Reconstruction of King Street (Regional Road 81) from Greenlane to Lincoln Avenue in Lincoln. Sanitary sewer and laterals also replaced. Construction spring 2026 to spring 2027. Contractor: Walker Construction Ltd. Single lane closures expected.",
    status: "Active",
    publishedDate: "2026-04-01",
    sourceUrl:
      "https://www.niagararegion.ca/news/notices/notice.aspx?q=966",
    category: "construction",
    tags: ["Road Reconstruction", "King Street", "Lincoln", "Niagara Region"],
  },
  {
    id: "niagara-north-service-rd-ea-pic",
    municipality: "Niagara Region",
    type: "Environmental Assessment — Public Information Centre",
    title: "North Service Road (Regional Road 39) Environmental Assessment — PIC #1 (Lincoln)",
    description:
      "Municipal Class Environmental Assessment for North Service Road (Regional Road 39) between QEW interchanges at Victoria Avenue North and Jordan Road (~2.8 km). Public Information Centre #1: July 7, 2026. Study assesses current/future transportation needs for Prudhommes Secondary Plan Area.",
    status: "Meeting Complete",
    meetingDate: "2026-07-07T00:00:00",
    meetingLocation: "Lincoln (details at project page)",
    publishedDate: "2026-06-01",
    sourceUrl:
      "https://www.niagararegion.ca/projects/regional-road-39/default.aspx",
    category: "public-information-centre",
    tags: ["Environmental Assessment", "North Service Road", "Lincoln", "Niagara Region", "PIC"],
  },
  {
    id: "niagara-carlton-st-closure",
    municipality: "Niagara Region",
    type: "Road Closure",
    title: "Carlton Street (Regional Road 83) Closure — St. Catharines",
    description:
      "Full closure of Carlton Street (Regional Road 83) between Welland Canals Parkway and Read Road in St. Catharines. January 26, 2026, 7:00 a.m. to February 24, 2026, 7:00 p.m. Purpose: Bridge maintenance by Seaway Authority. Emergency services no access during full closure.",
    status: "Meeting Complete",
    effectiveDate: "2026-01-26T07:00:00",
    endDate: "2026-02-24T19:00:00",
    publishedDate: "2026-01-15",
    sourceUrl:
      "https://www.niagararegion.ca/news/notices/notice.aspx?q=962",
    category: "road-closure",
    tags: ["Road Closure", "Carlton Street", "St. Catharines", "Niagara Region"],
  },
  {
    id: "niagara-transit-budget-amendment-2026",
    municipality: "Niagara Region",
    type: "Budget Amendment (Transit)",
    title: "Niagara Transit Commission 2026 Operating Budget Amendment — Fuel Pressure",
    description:
      "One-time transfer of $1,700,000 from Transit Stabilization Reserve to Fleet Maintenance Operating Budget for incremental fuel pressures. Regional Council meeting: July 30, 2026. Public notice provided per Policy C-RC-005. Diesel cost increase ~21% above budget ($1.43/L budgeted vs $1.73/L actual).",
    status: "Approved",
    meetingDate: "2026-07-30T00:00:00",
    publishedDate: "2026-07-15",
    sourceUrl:
      "https://pub-niagararegion.escribemeetings.com/FileStream.ashx?DocumentId=49902",
    category: "budget",
    tags: ["Budget Amendment", "Transit", "Fuel", "Niagara Region", "Reserve Transfer"],
  },
  {
    id: "thorold-436-quaker-rd-opa",
    municipality: "Thorold",
    type: "Notice of Public Meeting — Official Plan Amendment",
    title: "436 Quaker Road — Official Plan Amendment (Port Robinson West Secondary Plan)",
    description:
      "Notice of public meeting held July 14, 2026 at 6:30 p.m. (hybrid, Council Chamber / YouTube) for Official Plan Amendment File D09-01-2026. Purpose: amend the Port Robinson West Secondary Plan to allow development to proceed before completion of the Phase 2 Subwatershed Study. Application to rezone 436 Quaker Road.",
    status: "Meeting Complete",
    meetingDate: "2026-07-14T18:30:00",
    publishedDate: "2026-10-09",
    sourceUrl:
      "https://www.thorold.ca/news/news/notice-of-public-meeting-for-official-plan-amendment-436-quaker-rd/",
    category: "official-plan-amendment",
    tags: ["Official Plan Amendment", "Quaker Road", "Port Robinson West", "Thorold", "D09-01-2026"],
  },
  {
    id: "niagara-fourth-ave-lincoln-closure",
    municipality: "Niagara Region",
    type: "Temporary Road Closure",
    title: "Fourth Avenue (Regional Road 77) Closure — Lincoln (Sixteen Mile Creek Bridge)",
    description:
      "Full road closure on Fourth Avenue at Sixteen Mile Creek in Lincoln, initially May 19 – September 19, 2026, extended to the end of October 2026. Detour required.",
    status: "Active",
    publishedDate: "2026-10-09",
    sourceUrl: "https://www.niagararegion.ca/news/notices/notice.aspx?q=988",
    category: "road-closure",
    tags: ["Road Closure", "Fourth Avenue", "Regional Road 77", "Lincoln", "Niagara Region"],
  },
  {
    id: "niagara-victoria-ave-sewage-pump-station",
    municipality: "Niagara Region",
    type: "Notice of Construction",
    title: "Victoria Avenue Sewage Pumping Station & Forcemain Upgrades — Lincoln",
    description:
      "Heavy construction July 2026 – winter 2026: 3.8 km Victoria Avenue forcemain replacement (Maple Grove Road to Cherry Avenue to Bartlett Road) in Lincoln, with associated sewage pumping station upgrades. Moving lane closures expected.",
    status: "Active",
    publishedDate: "2026-10-09",
    sourceUrl: "https://www.niagararegion.ca/news/notices/notice.aspx?q=1008",
    category: "construction",
    tags: ["Construction", "Sewage Pumping Station", "Forcemain", "Victoria Avenue", "Lincoln", "Niagara Region"],
  },
  {
    id: "niagara-wilhelm-rd-bridge-pc-closure",
    municipality: "Niagara Region",
    type: "Temporary Road Closure",
    title: "Wilhelm Road Bridge Repairs — Port Colborne",
    description:
      "Single-lane closures on the Wilhelm Road railway bridge (Regional Road 98, ~400 m south of Forks Road East, Port Colborne) August 4 – October 13, 2026 for bridge repairs.",
    status: "Active",
    publishedDate: "2026-10-09",
    sourceUrl: "https://niagararegion.ca/news/notices/notice.aspx?q=1010",
    category: "road-closure",
    tags: ["Road Closure", "Wilhelm Road", "Bridge", "Port Colborne", "Niagara Region"],
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

export function getUpcomingMeetings(days = 7, now = getRenderNow(), notices = planningNotices) {
  const start = now.getTime();
  const end = start + days * 24 * 60 * 60 * 1000;
  return notices.filter((notice) => {
    if (!notice.meetingDate) return false;
    const t = parseTorontoDate(notice.meetingDate).getTime();
    return t >= start && t <= end;
  });
}

// Same predicate as the civic calendar's Upcoming filter: a meeting is upcoming
// until its Toronto start instant passes, with no rolling day cap.
export function isFutureMeeting(meetingDate, now = getRenderNow()) {
  return parseTorontoDate(meetingDate) > now;
}

export function getFutureMeetings(now = getRenderNow(), notices = planningNotices) {
  return notices
    .filter((notice) => notice.meetingDate && isFutureMeeting(notice.meetingDate, now))
    .sort((a, b) => a.meetingDate.localeCompare(b.meetingDate));
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
