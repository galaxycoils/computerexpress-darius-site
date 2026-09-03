NB: ST CATHARINES DIGITAL
Planning Alert — Media Kit & Sponsor One-Pager (Pilot)
============================================================================
Version: v1.1 — Production Launch
Last updated: 2026-09-03
Status: LIVE — https://stcatharinesdigital.ca/planning-tracker/

LIVE METRICS (Day 0)
--------------------
- Planning Tracker: https://stcatharinesdigital.ca/planning-tracker/
- Newsletter capture: https://stcatharinesdigital.ca/api/newsletter (returns {"success":true})
- Sitemap: https://stcatharinesdigital.ca/sitemap.xml (43 routes, includes /planning-tracker/)
- Email platform: Beehiiv Free (to be connected server-side via API)
- Baseline subscribers: 0 (launch day)
- Baseline pageviews: 0 (launch day)

WHAT WE DELIVER
----------------
Weekly Email Digest — "Planning Alert" (free tier):
- Curated municipal notices from St. Catharines, Welland, Thorold, Niagara Region
- NRPS media releases relevant to our coverage area
- Road closures, hearings, OPAs, variances, CIP meetings
- Direct links to every official source
- "Upcoming this week" preview section
- ~15–25 notices/week across municipalities

Website — Planning Tracker Page:
- Searchable, filterable database of all active planning applications
- Filter by municipality, category (OPA, variance, zoning, CIP, road closure), status
- Table view + card view
- Upcoming meetings highlighted with submission deadlines
- Print-friendly layout
- Built from official documents only — links to every source

AUDIENCE
---------
- Local developers and builders (passive guests — they need to know every hearing date)
- Realtors and real estate investors (every variance/permit changes property outlook)
- Property owners adjacent to development (active opposition/advocacy)
- Municipal staff and councillors (comparison read of what's happening across municipalities)
- Students, researchers, journalists (source of record)

INVENTORY (PROOFS FROM LAUNCH SCAN — 2026-09-03)
--------------------------------------------------
Total active pipeline: 27 notices + 2 NRPS releases

St. Catharines — 7 planning notices:
  - Ontario Street Corridor Secondary Plan (public meeting Sep 14, 2026)
  - 455 Welland Avenue — parking variance, 248 units, hearing Sep 16
  - 12 Stepney Street — minor variance, hearing Sep 16
  - 60 Thomas Street — minor variance
  - 75 Corporate Park Drive — minor variance
  - 90-92 St. Paul Street West — minor variance
  - Community Improvement Plan for Strategic Sites

Welland — 3 planning notices:
  - OPA No. 55 — land redesignation applicants
  - Draft Plan of Subdivision (PN-05-22-2025)
  - Official Plan Update — statutory public meeting Dec 9, 2025

Thorold — 8 planning notices:
  - 436 Quaker Rd — OPA (Primont Inc., Biglieri Group)
  - Rolling Meadows Phases 17 & 19-22 — zoning amendment
  - 24-26 Clairmont St — zoning amendment
  - 1674 Kottmeier Rd — zoning amendment (meeting Sep 23, 2025)
  - 13030 Lundy's Lane — zoning amendment
  - 95 Queen St S — bylaw passed (85-2025)
  - Rolling Meadows Phase 11 — consent application hearing

Niagara Region — 8 public notices:
  - Ontario St, Geneva St, Welland Ave, Westchester Cres — Grape & Wine parade Sep 2
  - King St, Lincoln — Sep 2
  - Queenston St, St. Catharines — Sep 1
  - Oswego Creek Bridge Replacement — PIC Aug 24
  - Wilhelm Road Bridge Repairs, Port Colborne — Jul 10
  - Victoria Ave Sewage Pumping Station — Jul 2
  - Martindale Rd — Jun 1
  - Fourth Ave, Lincoln — May 7

NRPS — 2 media releases (St. Catharines/Thorold/Welland):
  - Sep 2, 2026 — Mississauga male arrested, Thorold & Welland warrants
  - Aug 6, 2026 — Bunting Road shooting update (3 suspects arrested)

DIFFERENTIATION VS. SECONDARY SOURCES
--------------------------------------
- Official sources only — every notice links to original document
- No social media noise, no unverified rumors
- No maps, no lists of individuals, no speculation
- Trust as the moat — sources badge on every entry
- Editorial independence: sponsors have zero influence on coverage

SPONSOR PACKAGES (PILOT PRICING — 90 DAYS)
--------------------------------------------
These are **founding pilot prices**, not a published rate card. Industry newsletter benchmarks are ~$10–30 CPM; $300/mo is CPM-defensible only at 10k–30k deliverable impressions. We are pre-scale.

| Tier | Monthly | Placement | Deliverables |
|------|---------|-----------|--------------|
| **Digest Only** | **$300/mo** | Email header (above "Upcoming Meetings") | 1 logo + 1 line copy + UTM link per send; monthly performance email |
| **Website Only** | **$250/mo** | Planning Tracker sidebar card | Branded card + link; visible on all filter views |
| **Full Suite** | **$500/mo** | Email header + website sidebar + "Presented by" callout | Both above + "Presented by [Sponsor]" in Upcoming Meetings section; monthly metrics |

**What sponsors do NOT get:**
- No placement next to specific applications (no "Sponsored by X on this variance")
- No influence on notice selection or framing
- No editing of official notices
- No bundling sponsor messages into NRPS crime coverage

EDITORIAL FIREWALL POLICY
--------------------------
- Sponsors have no say in which notices we cover
- Sponsors are not listed next to specific applications
- Sponsor placement is structural (header, sidebar card), not editorial
- Every notice page includes "Sourced from [municipality].ca" with direct link
- NRPS releases covered under the same no-interference rule
- "Sponsors" page on site lists current sponsors + this policy
- If a sponsor is involved in an active planning application: relationship disclosed; their ad not placed on that specific notice page

SALES SEQUENCE & GATE
----------------------
Week 1:
  - Media kit finalized (this document)
  - List 10 target prospects
  - Send one-pager + Calendly link

Target prospects (qualifying list):
  - Niagara real estate brokerages (St. Catharines, Welland, Thorold offices)
  - Local planning / development consultants
  - Builders with active projects in the pipeline
  - Commercial real estate firms
  - Law firms doing municipal / planning work
  - Home builder associations (Niagara Home Builders' Association)
  - Chambers of commerce (St. Catharines, Welland, Thorold)
  - Engineering firms (civil, environmental — subwatershed study work)

14-DAY POST-MORTEM GATE (kill criteria):
- ≥10 qualified local outreach conversations initiated
- ≥3 proposal requests / discovery calls booked
- ≥1 paid commitment at pilot price
- **If gate missed: kill or reprice the offer before building more inventory**

WEBSITE PACKAGES (UNCHANGED — MARKET-ALIGNED)
----------------------------------------------
- **Launch** — $1,500: 1–5 page custom, mobile-first, core SEO, GBP setup
- **Growth** — $3,500: Launch + technical SEO foundation, schema, service-area pages, 3mo support
- **Local Authority** — $5,500: Growth + GBP optimization, review workflow, monthly reporting, priority support

Competitive anchors: CheckSite Niagara $600 (one-pager), Elevate Web Design $599 (starter), Marvel Marketing $3k–5k (typical custom). Our $1,500 Launch is defensible custom work.

TECHNICAL NOTES
----------------
- Stack: React 18 + Vite 6, Cloudflare Pages (static), Cloudflare Functions (API)
- Newsletter endpoint: `/api/newsletter` → AgentMail (live); Beehiiv sync via server-side API (pending account auth)
- No client-side secrets; all API keys in Cloudflare Pages environment
- Planning Tracker data: `src/data/planningNotices.js` (27 notices, weekly refresh)

NEXT STEPS
----------
1. Beehiiv account creation + API key → server-side subscriber sync
2. Outreach to 10 prospects with this media kit
3. Day-14 post-mortem: review conversations, proposals, commits
4. Iterate or scale

CONTACT
-------
Dariush — St. Catharines Digital
hello@stcatharinesdigital.ca | (365) 359-5973
https://calendly.com/tahamtandariush/30min

---
NB: END OF MEDIA KIT v1.1