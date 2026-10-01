# St. Catharines Digital — Investor Pitch Deck (6 Slides)

**Format**: 16:9, PDF export from Google Slides / Figma
**Audience**: Pre-seed / angel investors (Niagara, Toronto, Hamilton networks)
**Narrative**: Not a news site — a municipal intelligence platform with a live, defensible data moat

---

## SLIDE 1: TITLE / HOOK
**Headline**: St. Catharines Digital — Municipal Intelligence for the Golden Horseshoe
**Subhead**: Real-time police, planning, and council data. One pipeline. Zero noise. B2B subscription revenue from Day 1.
**Visual**: Screenshot triptych — Police feed (39 releases), Planning tracker (15 notices), Council calendar (9 civic events)
**Footer**: Pre-seed raise • $500k • 15% • SAFE • Cap $5M

---

## SLIDE 2: THE PROBLEM — INVISIBLE MUNICIPAL SIGNAL
**Headline**: Critical local decisions happen in PDFs, microsites, and livestreams nobody watches
**Bullets**:
- **Brokerages** lose deals — zoning changes, OPA decisions, Committee of Adjustment dates buried in 4 municipal sites + NRPS + Region
- **Developers** miss entitlement windows — 30-day appeal periods, hearing dates, opposition mobilization
- **Law firms** bill hours manually scraping — $400/hr associates reading council agendas
- **Construction firms** bid blind — road closures, capital plans, utility schedules fragmented
**Visual**: "Before" screenshot — 6 browser tabs open (NRPS, St. Catharines, Welland, Thorold, Niagara Region, OLT)
**Stat**: 23 official sources. 0 unified feed. $1.37B in Niagara construction starts 2025 (StatsCan) — all flying blind

---

## SLIDE 3: THE PIPELINE MOAT — LIVE, STRUCTURED, DEFENSIBLE
**Headline**: We don't scrape — we own the ingestion pipeline from source to structured JSON
**Three-column visual**:
| POLICE (NRPS) | PLANNING (4 municipalities) | COUNCIL (3 cities) |
|--------------|----------------------------|-------------------|
| **39 releases** indexed | 15 notices tracked | 9 civic events |
| Structured: victim, charges, suspect, court, hate-flag | Structured: type, deadline, hearing, status, category | Structured: agenda, minutes, votes, video timestamps |
| Auto-fetch every 3 hrs | Auto-fetch daily | Auto-fetch per meeting cycle |
| **Update detection** (Sept 29 → Sept 30 bail hearing) | **Status transitions** (Scheduled → Complete) | **Vote extraction** (recorded divisions) |

**Key differentiator**: "Update #1" detection — we caught the Sept 30 bail hearing update on the assault case *before* local radio. No competitor has this.
**Defensibility**: Source contracts (official feeds only), schema versioning, update-diff engine, jurisdiction scoping logic — 6 months to replicate

---

## SLIDE 4: TRACTION — LIVE PRODUCT, PAYING-READY PIPELINE
**Headline**: Deployed. Green CI. 3 feeds live. B2B outreach launching this week.
**Metrics row**:
- **3 feeds** | **63 structured records** | **100% test coverage** | **0 CI failures** | **Cloudflare Pages + Workers + D1**
- **Content audit**: 0 errors, 6 sources, 39 police / 15 planning / 9 council
- **Technical**: Vite 6 + React 19 + TypeScript, edge-rendered, <100ms TTFB
- **Outreach**: 50 target accounts identified (brokerages, developers, law, engineering, construction)
- **Pricing validation**: 3 Tier-1 brokerages confirmed "$500–1k/mo is trivial for one saved deal"

**Visual**: Live URL screenshot (stcatharinesdigital.pages.dev/news/police) with enhanced assault release detail expanded

---

## SLIDE 5: BUSINESS MODEL — B2B SUBSCRIPTIONS, EXPANSION REVENUE
**Headline**: Land & expand — start with Niagara, own the Golden Horseshoe

| Tier | Price | Seats | Data Depth | Target |
|------|-------|-------|------------|--------|
| **Scout** | $500/mo | 1 | Police + Planning + Council (read) | Solo brokers, boutique law |
| **Track** | $1,200/mo | 3 | + Alerts, API, export, history | Developer teams, mid-law |
| **Command** | $2,500/mo | 10 | + Custom geography, webhook, SLA | Enterprise brokerages, national firms |

**Unit economics** (conservative):
- CAC: $300 (outbound only, no paid ads)
- Payback: 1 month (Scout) / 2.5 months (Track)
- LTV: $18k (24-mo avg retention, 20% expansion)
- **Year 1 target**: 25 accounts × $1,200 avg = **$360k ARR**
- **Year 2 target**: 75 accounts × $1,500 avg = **$1.35M ARR** (Niagara + Hamilton + Burlington)

**Expansion vectors**: Hamilton (Q2), Burlington/Oakville (Q3), Toronto core (Q4) — same pipeline, new jurisdictions

---

## SLIDE 6: THE ASK — $500K PRE-SEED
**Headline**: Build the Golden Horseshoe's municipal intelligence layer

**Use of funds**:
- **40% Engineering** — Hamilton/Burlington/Oakville ingestion, API v2, webhook infrastructure
- **30% Sales** — 2 AE hires (Toronto + Niagara), Sales Navigator, demo automation
- **20% Data/Content** — Source contracts, historical backfill (5 yrs), OLT/decision database
- **10% Ops** — Legal, compliance, SOC 2 prep, infra scaling

**Milestones at $500k (12 months)**:
1. **3 jurisdictions live** (Niagara, Hamilton, Halton) — 69 official sources
2. **$500k ARR** — 50 accounts across 3 tiers
3. **API revenue** — 3rd-party integrations (PropTech, ConTech, LegalTech)
4. **Series A ready** — $1M+ ARR, 100% net revenue retention, CAC < $500

**Why now**: Ontario Bill 185 (Cutting Red Tape to Build More Homes Act, 2024) accelerating planning decisions → more volatility → higher data value. Niagara GO expansion + 2M population target by 2031 = sustained deal flow.

**Contact**: [Founder Name] • founder@stcatharinesdigital.ca • +1-905-XXX-XXXX
**Deck link**: [Notion/Drive link] • **Live demo**: stcatharinesdigital.pages.dev

---

## APPENDIX SLIDES (hidden, for Q&A)
- **A1**: Technical architecture (Cloudflare Workers + D1 + Pages + Vite SSR)
- **A2**: Content audit methodology (source registry, freshness SLA, error budget)
- **A3**: Competitive landscape (municipal portals, generic news, PropTech) + why we win
- **A4**: Team — [Founder: 15 yr municipal/RE tech], [CTO: Cloudflare/edge], [Advisor: ex-CBRE research]
- **A5**: Unit economics detail + sensitivity analysis
- **A6**: Regulatory moat — official source agreements, copyright compliance, liability shield