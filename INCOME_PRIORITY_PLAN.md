# St. Catharines Digital — Income Priority Plan

**Status**: Active — user directive: "prioritize making income, very important"
**Owner**: @growth-capital-strategist
**Date**: 2026-10-01 · **Revised**: 2026-10-09
**Verified counts (live site)**: 42 police + 35 planning + 52 civic = **129 verified records**
**Revision note (2026-10-09)**: counts now derive from `src/data/metrics.js` and are enforced by `npm run audit:metrics`. Revenue sequencing was re-decided: truth fixes and outreach infrastructure come first, and billing is gated on demonstrated paid intent. The earlier "build Stripe in Week 2–4" instruction is superseded — see §3 Phase 2.

---

## 1. Current Revenue State

### What exists and works today:

| Revenue Stream | Status | Mechanism | Current State |
|---|---|---|---|
| **Planning Alerts (B2C)** | Live | $49/mo via Interac e-Transfer | `functions/api/alerts/payment.js` — admin-only confirmation via `ADMIN_SECRET`, D1 tracks `payment_status` |
| **Newsletter subscriptions** | Live | Free, double opt-in | `functions/api/newsletter.js` — D1 `newsletter_subscribers` table, AgentMail delivery |
| **Sponsorship inquiries** | Live | Form → AgentMail → human follow-up | `functions/api/sponsor.js` — inquiry routed to inbox, no pricing published |
| **Membership / reader support** | Inquiry-only | Form → email | `src/pages/MembershipPage.jsx` — "No payment is taken on this website" |
| **B2B subscriptions (Scout/Track/Command)** | **Not built** | No checkout, no billing, no pricing page | `PITCH_DECK.md` exists as a plan only |

### What does NOT exist:
- No Stripe, PayPal, Paddle, or any payment processor integration
- No subscription billing (recurring charges)
- No B2B pricing page or checkout flow
- No payment gateway of any kind beyond manual Interac e-Transfer
- No revenue dashboard or MRR tracking

---

## 2. Honest Assessment: Where Income Actually Comes From

**Right now, the only thing that can produce a paid commitment is manual outreach + Interac e-Transfer.** The $49 Planning Alerts flow is the only existing paid path, and it's B2C at a low price point.

For B2B ($500–2,500/mo tiers in the pitch deck), there is **no infrastructure to collect money**. The deck's Year 1 $360k ARR target assumes a billing system that does not exist. That's not a criticism — it's a pre-seed reality — but it means the deck's financial model is aspirational until billing is built.

**The fastest path to first dollar is not building Stripe.** It's:
1. Send the 50 outreach emails already drafted in `B2B_OUTREACH_LIST.md`
2. Get a verbal "yes" from one brokerage
3. Send an invoice via email / Wave / QuickBooks
4. Collect via Interac e-Transfer (already supported by `payment.js`)

That path works today with zero code.

---

## 3. Prioritized Income Execution

### Phase 1: Close first paid B2B account (Week 1–2) — NO CODE REQUIRED

**What's ready:**
- `docs/MX_VERIFIED_TARGETS.md` + `docs/outreach-targets.json` — MX-verified accounts only. The original "50 accounts" claim was wrong: 16 of the 50 domains have no MX record, so the real list is at most 32.
- `PITCH_DECK.md` — investor deck with verified numbers (42 police + 35 planning + 52 civic = 129 records)
- Live site at `stcatharinesdigital.pages.dev` — proof of product
- Interac e-Transfer payment confirmation already built (`payment.js`)

**Actions:**
1. Round 1 (Sep 10–11) is closed, not in flight: 27 sent, **15 hard bounces (55.6%)**, 12 delivered, 0 replies. Full analysis in `docs/REVENUE_POSTMORTEM_2026-10-02.md`.
2. Rounds 2–3 (Oct 2) are sent: 21 more, 0 bounces, after MX-verifying every domain. Follow-ups were due Oct 5–9 and are now overdue — that is the live work item.
3. For any prospect that says "yes": send a simple PDF invoice at the **$250/mo monitored pilot** rate, collect via Interac e-Transfer to `cccemt@pm.me`.
4. Use the existing `payment.js` flow to confirm and activate the account.

**Target**: 1 paid B2B pilot. The earlier $500–1,200/mo figure was never tested and was killed by the post-mortem. The standing offer is a free public tracker first, then a $250/mo monitored pilot.

### Phase 2: Billing infrastructure — GATED on demonstrated paid intent

**Gate (do not start before one of these is true):**
- a prospect replies asking how to pay, or
- the first Interac payment is confirmed through `/api/alerts/payment`.

**Why gated:** the post-mortem's conclusion was "no code spend until one account pays". Building Stripe before demand is proven was the original error in this plan.

**What to build when the gate opens:**
- Stripe integration (checkout session → webhook → D1 subscription record)
- B2B tier page (`/pricing`)
- Self-serve subscription management (upgrade/downgrade/cancel)
- MRR dashboard (D1 query on `subscriptions` table)

**Why Stripe over Paddle/LemonSqueezy:** Stripe gives you the full subscription lifecycle (invoices, dunning, usage billing, API access). Paddle is simpler but takes a fee and limits flexibility. For a B2B product where you'll eventually need custom contracts and usage-based pricing, Stripe is the right call.

**Prerequisites before building:**
- Stripe account
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Cloudflare Pages secrets
- D1 migration for `subscriptions` table

**Risks:**
- PCI compliance (Stripe handles this — you never touch card data)
- Webhook verification (must validate `stripe-signature` header)
- Failed payment handling (dunning — Stripe can email customers automatically)

**Already fixed, ahead of billing:** the weekly digest was being delivered to every verified signup regardless of payment, so the $49/mo product was free by accident. `alerts.payment_status` (migration 0004) is now enforced on the delivery path (migration 0011 + `functions/cron/daily-digest.js`), with a 30-day grace window and a one-time notice for readers who were already receiving it.

### Phase 3: Scale the sales motion (Month 2+) — PEOPLE REQUIRED

- Hire 1 AE (account executive) for Toronto/GTA outreach
- Build demo automation (self-serve trial with scoped data access)
- Expand to Hamilton/Burlington/Oakville ingestion

---

## 4. What I'm Not Going to Build (Yet)

| Item | Reason |
|---|---|
| **Paywall / membership site** | B2C subscription at $49/mo is a different product. The B2B play is enterprise sales, not consumer paywall. Don't dilute. |
| **Ad network / programmatic ads** | Low CPMs, high ops burden, conflicts with editorial independence. Sponsorship direct sales is higher margin. |
| **E-commerce / merchandise** | Distraction. The product is data, not swag. |
| **Affiliate links / referral programs** | Low margin, low control. Direct B2B sales is the play. |

---

## 5. Immediate Next Actions

1. **@revenue-monetization-strategist** — Send the overdue round 2–3 follow-ups (due Oct 5–9) through `scripts/outreach/send.mjs`, which refuses any domain that fails an MX check. Log every address and result in `docs/SPONSORSHIP_OUTREACH_TRACKER.md`, bounces included.
2. **@super-engineer---full-stack** — Revenue is not blocked by billing. The delivery leak is fixed (see §3 Phase 2). Stripe stays gated until a prospect asks how to pay.
3. **@official-police-media-release-agent-st-catharines-digital** — Keep the feed clean. 42 of 57 held releases are source-verified; the rest stay quarantined until their links resolve.
4. **@official-municipal-documents-agent-st-catharines-digital** — 35 planning notices are live (15 active, 22 with meeting dates). `src/data/generated/discovery.json` holds 111 raw candidates collected 2026-10-02, of which 18 are already in `planningNotices.js`. Triaging that backlog is the highest-leverage data work — it directly raises the moat number in every outreach email. Do not count raw candidates as ingested records.
5. **@official-council-reporting-agent-st-catharines-digital** — 52 civic records are live. The CivicWeb gap is real. If council agendas become a third ingestion source, that's a pricing tier upgrade, but it is not blocking revenue today.

---

## 6. The Honest Bottom Line

**The product is live and the data is verified.** 42 police + 35 planning + 52 civic = 129 records, all derived from source and enforced against drift by `npm run audit:metrics`.

**What was wrong:** 48 cold emails had produced 15 hard bounces, 0 replies and $0 MRR; the deck claimed traction that had not happened; and the $49/mo digest was being delivered free to every verified signup because nothing checked payment.

**What is fixed:** the delivery gate (the paid product is now actually paid), the numbers (no document states a figure the data does not support), and the contact address (one inbox, `cccemt@pm.me`).

**What remains, and it is not code:** sending the overdue follow-ups to the 21 prospects who received round 2–3 without bouncing, and closing one paid account. Billing stays gated until someone asks to pay.
