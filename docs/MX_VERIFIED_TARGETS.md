# MX-Verified B2B Targets — St. Catharines Digital

**Date**: 2026-10-02 · **Method**: `host -t mx <domain>` against live DNS.
**Rule**: no address goes on a send list unless its domain returns an MX record. Generic `info@` is a last resort, never a first choice.

---

## TIER A — Local firms with verified mail infrastructure (highest intent, smallest sales cycle)

| Firm | Domain | MX | Pitch angle |
|---|---|---|---|
| Rankin Construction | `rankin.ca` | outlook | Active watermain/roadwork in Thorold + Welland |
| Rankin Construction (alt) | `rankinconstruction.com` | outlook | same |
| Bermingham Construction | `bermingham.ca` | self-hosted | Site prep, grading |
| GM BluePlan | `gmblueplan.ca` | mimecast | Local civil — public consultation dates |
| Concreate USL | `concreate.ca` | outlook | Underground services — watermain schedule |
| Linsey Enterprises | `linseyenterprises.com` | outlook | Paving — closure coordination |
| Miller Paving | `millerpaving.ca` | present | Municipal contract timing |
| Paradise Transportation | `paradigm.ca` | **NO MX — do not use** | — |
| Upper Canada Consultants | `ucc.ca` | outlook | Traffic/parking apps |
| Coco Paving | `cocopaving.com` | **NO MX — do not use** | — |

## TIER B — Chambers / associations / BIAs (they already pay for local intel)

| Org | Domain | MX |
|---|---|---|
| Greater Niagara Chamber of Commerce | `gncc.ca` | ✅ mtaroutes |
| Thorold BIA | `thoroldbia.com` | ✅ emailsrvr |
| Niagara-on-the-Lake BIA | `niagaraonthelake.com` | ✅ outlook |
| Port Colborne BIA | `portcolborne.ca` | ✅ outlook |
| Fort Erie BIA | `forterie.ca` | ✅ outlook |
| Niagara Construction Association | `niagaraconstruction.org` | ✅ outlook |
| Niagara Region (municipal) | `niagararegion.ca` | ✅ pphosted |
| St. Catharines Chamber | `stcatharineschamber.ca` | ❌ **NO MX — do not use** |
| Welland Chamber | `wellandchamber.ca` | ❌ NXDOMAIN |
| Downtown StC BIA | `downtownstc.ca` | ❌ NXDOMAIN |
| Niagara BIA | `niagarabia.com` | ❌ NXDOMAIN |
| Pelham BIA | `pelhambia.com` | ❌ NXDOMAIN |

## TIER C — Law firms (planning/land-use; long sales cycle, high ACV)

| Firm | Domain | MX |
|---|---|---|
| Aird & Berlis | `airdberlis.com` | ✅ mimecast |
| WeirFoulds | `weirfoulds.com` | ✅ spamtitan |
| Gowling WLG | `gowlingwlg.com` | ✅ mimecast |
| Ross & McBride | `rossmcbride.com` | ✅ outlook |
| Pallett Valo | `pallettvalo.com` | ✅ iphmx |
| Dentons | `dentons.com` | ✅ mimecast |
| Miller Thomson | `millerthomson.com` | ✅ mimecast |
| DWW | `dww.com` | ✅ outlook |
| Sullivan Mahoney | `sullivanmahoney.com` | ✅ self-hosted |
| Suk Law | `suklawpc.com` | ✅ outlook |
| Lancaster Brooks & Welch | `lancasterbrooksandwelch.ca` | ❌ NXDOMAIN |
| Cheadles | `cheadles.ca` | ❌ NXDOMAIN |
| Mellor Law | `mellorlaw.ca` | ❌ NXDOMAIN |

## TIER D — Engineering / planning consultancies

| Firm | Domain | MX |
|---|---|---|
| WSP | `wsp.com` | ✅ outlook |
| Stantec | `stantec.com` | ✅ outlook |
| GHD | `ghd.com` | ✅ outlook |
| MHBC Planning | `mhbcplan.com` | ✅ outlook |
| UrbanSolutions | `urbansolutions.ca` | ✅ self-hosted |
| SGL Planning | `sglplanning.ca` | ✅ outlook |
| Paradigm Transportation | `paradigmtrans.com` | ✅ outlook |
| Upper Canada Consultants | `uppercanadaconsultants.com` | ❌ NXDOMAIN |
| Planworks | `planworks.ca` | ✅ outlook |

## TIER E — Developers / builders (MX-clean)

| Firm | Domain | MX |
|---|---|---|
| Mattamy Homes | `mattamycorp.com` | ✅ outlook |
| Minto Group | `minto.com` | ✅ pphosted |
| Empire Communities | `empirecommunities.com` | ✅ outlook |
| Losani Homes | `losani.com` | ✅ mx.losani.com |
| Branthaven Homes | `branthaven.com` | ✅ outlook |
| Fieldgate Homes | `fieldgatehomes.com` | ✅ mx25 |
| Tribute Communities | `tributehomes.com` | ✅ outlook |
| CountryWide Homes | `countrywidehomes.ca` | ✅ outlook |
| Great Gulf | `greatgulf.com` | ⚠️ `sales@` hard-bounced Sep 10 — find named contact |
| Impression Homes | `impressionhomes.net` | ✅ outlook |
| Orchard Park Homes | `orchardparkhomes.com` | ❌ **NO MX — remove** |
| eXp Realty | `exprealty.net` | ✅ googlemail |
| Royal LePage | `royallepage.ca` | ✅ googlemail |
| Century 21 | `century21.ca` | ✅ googlemail |
| Coldwell Banker | `coldwellbanker.ca` | ✅ outlook |
| RE/MAX | `remax.ca` | ✅ googlemail |
| Avison Young | `avisonyoung.com` | ✅ mimecast |
| Colliers | `colliers.com` | ✅ pphosted |
| NAI Commercial | `naicommercial.ca` | ✅ outlook |
| Aecon | `aecon.com` | ✅ outlook |
| Cushman & Wakefield | `cushmanwakefield.com` | ❌ **NO MX — remove** |
| SVN | `svn.ca` | ❌ **NO MX — remove** |
| Engel & Völkers | `engelvolkers.ca` | ❌ SERVFAIL — remove |
| Greenpark/Concord | `concordliving.ca` | ❌ NXDOMAIN — remove |
| Ashton Woods | `ashtonwoodsusa.com` | ❌ NXDOMAIN — remove |
| Primont | `primont.ca` | ❌ NO MX — remove |
| Bosley/McGarr | `bosleyrealestate.ca` | ❌ NXDOMAIN — **remove, still in tracker as "delivered"** |

## Send-gate checklist (run before every batch)

1. `host -t mx <domain>` returns a record → pass
2. Named individual found (LinkedIn / firm site / press) → use it, not `info@`
3. Opening line cites a **specific planning decision, closure, or deadline** from our own data
4. One ask. One CTA. Price stated as **free tracker first, $250/mo pilot after**
5. Batch size ≤ 15, spaced over ≥3 days — protects the sending domain
6. Log every address + result in `docs/SPONSORSHIP_OUTREACH_TRACKER.md` immediately, including bounces