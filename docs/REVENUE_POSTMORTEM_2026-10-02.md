# Revenue Post-Mortem — B2B Outreach v1

**Date**: 2026-10-02
**Owner**: @revenue-monetization-strategist
**Verdict**: **KILL the v1 motion. Rebuild the list. Do not send batch 2 as written.**

---

## 1. Hypothesis

B2B "Municipal Intelligence Platform" sold to Niagara brokerages / developers / construction / law firms at **$500–2,000/mo per seat**, acquired via cold email from a scratch AgentMail inbox, paid via manual Interac e-Transfer.

## 2. What was actually built/tested

- `B2B_OUTREACH_LIST.md` — 50 named target accounts across 5 tiers
- `PITCH_DECK.md` — investor deck with a $360k Year-1 ARR model
- `scripts/send-outreach.sh` — curl loop against AgentMail API, generic `info@` addresses
- `docs/SPONSORSHIP_OUTREACH_TRACKER.md` — claimed "Day 3 batch (28 emails) already in flight"

## 3. What the mail server says (ground truth, not the tracker)

Pulled directly from the AgentMail inbox API, `stcatharines-digital@agentmail.to`:

| Metric | Claimed | Actual |
|---|---|---|
| Emails sent | 28 (Day 1–3) | **27** |
| Hard bounces | 1 known (RE/MAX) | **15** |
| **Bounce rate** | ~4% | **55.6%** |
| Delivered | 26 | **12** |
| Replies | ≥10 target | **0** |
| Demos booked | 8 target | **0** |
| MRR | — | **$0** |
| First outreach | Sep 10 | Sep 10 — **then nothing for 22 days** |

### The 15 hard bounces
```
remaxniagara@remaxniagara.ca        sales@greatgulf.com
contact@kwcomplete.com               info@bondfield.ca
info@soldierrealestate.ca           info@chownlaw.com
niagara@cbre.com                     info@reidsheritage.com
niagara@jll.com                      info@simcoemountainhomes.com
info@dufferinconstruction.com       info@redmanconstruction.ca
info@norcar.ca                      info@stcatharinesengineering.ca
                                    info@stcatharineschamber.ca
```

### Root cause
Three compounding failures, all diagnosable:

1. **Guessed `info@` addresses.** 15 of 27 dead. Nobody verified a single address before sending. `niagara@cbre.com` and `niagara@jll.com` are plausible-looking inventions — those offices are `cbre.com`/`jll.com` national inboxes with a different structure.
2. **Wrong hook for the buyer.** The template opened with *"Saw the Sept 30 NRPS assault update on St. Paul & Bond — bail hearing at Welch Courthouse."* That is a **police** story pitched to **real-estate and construction** buyers. A land acquisition director has no reason to care about a bar assault. We led with the one dataset (police releases, 39 records) that matters least to the buyer and buried the one that matters most (planning + road closures, 33 records with hard deadlines).
3. **No proof, no follow-up.** 22 days of silence. Zero follow-ups. Cold B2B needs 4–6 touches.

## 4. Also wrong: the target list itself

MX-verified all 50 domains from `B2B_OUTREACH_LIST.md` with `host -t mx`. **16 of 50 do not exist** — NXDOMAIN or no MX record:

```
cushmanwakefield.com          svn.ca                      engelvolkers.ca
concordliving.ca              ashtonwoodsusa.com           primont.ca
cocopaving.ca                 walkerind.ca                gippaving.com
norjohn.ca                    lancasterbrooksandwelch.ca  cheadles.ca
mellorlaw.ca                  uppercanadaconsultants.com  bosleyrealestate.ca
orchardparkhomes.com          planworks.ca
```

Several of these are well-known real firms — we simply guessed the wrong domain, which means **the v1 list is not 50 accounts, it is at most 32.** Nobody MX-checked before writing it.

## 5. What we learned

1. **Unverified lists are not a pipeline.** 55.6% bounce will get the sending domain throttled or blocked by Gmail/Yahoo. This motion doesn't just fail to earn, it actively damages the asset.
2. **Police news is not a B2B product.** It builds the news brand. It does not sell to a land acquisition team.
3. **The product we haven't sold yet is the one that works.** 33 planning/construction/closure records across 4 municipalities with **appeal deadlines and active project dates** — that is genuine, hard-to-replicate local intelligence, and it is 100% free and public right now.
4. **$500/mo was never tested.** It was guessed. Kill the guess.

## 6. Decision

| Decision | Item |
|---|---|
| **KILL** | Generic `info@` guessing. Never again. |
| **KILL** | Police-release hook for B2B. Wrong buyer, wrong signal. |
| **KILL** | $500–2,000/mo anchor. Untested. Replaced with a free-then-$250 pilot. |
| **PIVOT** | Lead every email with a **specific planning decision or closure deadline**. |
| **PIVOT** | Free public tracker as the trial. Payment only after the buyer has seen their own data. |
| **DOUBLE DOWN** | MX-verification gate before any send. List in `docs/MX_VERIFIED_TARGETS.md`. |
| **DOUBLE DOWN** | The $49/mo Planning Alerts B2C product — already built, still unmonetised. |

## 7. What we are doing about it

1. Follow-up email sent to the **12 delivered** prospects with the corrected pitch.
2. `docs/MX_VERIFIED_TARGETS.md` written — real MX-verified targets only.
3. A **new**, closer segment identified: **BIAs and chambers with verified inboxes** (Thorold BIA, GNCC, Niagara-on-the-Lake, Port Colborne, Fort Erie, Niagara Construction Association). These are the businesses that *buy community intelligence*, and they are reachable.
4. No code spend until one account pays.