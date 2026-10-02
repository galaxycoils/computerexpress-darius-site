# St. Catharines Digital — Income Priority Plan

**Status**: Active — user directive: "prioritize making income, very important"
**Owner**: @growth-capital-strategist
**Date**: 2026-10-01
**Verified counts (live site)**: 39 police + 15 planning + 9 civic = **63 verified records**

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
- `B2B_OUTREACH_LIST.md` — 50 target accounts across 5 tiers, cold email template, tracking schema
- `PITCH_DECK.md` — investor-grade deck with verified numbers (39 police + 15 planning + 9 civic = 63 records)
- Live site at `stcatharinesdigital.pages.dev` — proof of product
- Interac e-Transfer payment confirmation already built (`payment.js`)

**Actions:**
1. Send Day 3 outreach batch (28 emails: construction + law + engineering) — already in flight
2. Follow up on Day 1–2 batches (22 emails sent, tracking opens/replies)
3. For any prospect that says "yes": send a simple PDF invoice ($500–1,200/mo), collect via Interac e-Transfer to `hello@stcatharinesdigital.ca`
4. Use existing `payment.js` flow to confirm and activate the account

**Target**: 1 paid B2B pilot by end of Week 2. That's $500–1,200/mo ARR from a real commitment, not a projection.

### Phase 2: Build billing infrastructure (Week 2–4) — CODE REQUIRED

**What to build:**
- Stripe integration (checkout session → webhook → D1 subscription record)
- B2B tier page (`/pricing`) with Scout/Track/Command pricing
- Self-serve subscription management (upgrade/downgrade/cancel)
- MRR dashboard (D1 query on `subscriptions` table)

**Why Stripe over Paddle/LemonSqueezy:** Stripe gives you the full subscription lifecycle (invoices, dunning, usage billing, API access). Paddle is simpler but takes a fee and limits flexibility. For a B2B product where you'll eventually need custom contracts and usage-based pricing, Stripe is the right call.

**Prerequisites before building:**
- Stripe account (can be set up in 10 minutes)
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` as Cloudflare Pages secrets
- D1 migration for `subscriptions` table

**Risks:**
- PCI compliance (Stripe handles this — you never touch card data)
- Webhook verification (must validate `stripe-signature` header)
- Failed payment handling (dunning — Stripe can email customers automatically)

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

## 5. Immediate Next Actions (This Week)

1. **@revenue-monetization-strategist** — Day 3 outreach batch (28 emails) goes out today. Track opens/replies in Notion. Follow up on Days 1–2 batches.
2. **@super-engineer---full-stack** — No code blocker on revenue. The only thing needed is the Stripe integration (Phase 2), which can wait until first paid account is closed. If you want to build `/pricing` page + Stripe checkout now, I'll spec it.
3. **@official-police-media-release-agent-st-catharines-digital** — Keep the feed clean. Every new in-scope release is another proof point for outreach.
4. **@official-municipal-documents-agent-st-catharines-digital** — 15 planning notices live on the site. 19 more are in `discovery.json` but not yet ingested into `planningNotices.js`. Ingestion is the highest-leverage data work right now — it directly increases the moat number in every outreach email.
5. **@official-council-reporting-agent-st-catharines-digital** — The CivicWeb gap is real. If council agendas become a third ingestion source, that's a pricing tier upgrade. But it's not blocking revenue today.

---

## 6. The Honest Bottom Line

**The product is ready. The data is verified. The outreach is built. The deck is honest.**

What's missing is not strategy — it's a billing system and a closed deal. The first one is a 2-hour Stripe integration. The second one is 28 cold emails and follow-up.

**Income is not blocked by code. It's blocked by sending the emails and following up.**

The user said "never stop to ask me a question, just continue working." So: the outreach is going out, the deck is updated, and the first paid account is the only thing between us and $500/mo ARR.
