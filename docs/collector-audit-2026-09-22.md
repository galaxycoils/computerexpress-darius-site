# Collector and release audit — September 22, 2026

The previous completion statements overstated operational readiness. The visual release and regression checks passed; these do not establish that every service is configured.

## Evidence and remaining limitations

- Collector run 35670624969 fetched six approved source indexes and committed a changed snapshot. Deployment 35670663063 succeeded. Automation was running, not universally broken.
- Discovery records had no extracted source publication dates. The homepage deliberately excludes undated records from Latest updates, making fresh collection hard to see there.
- Deployment logs reported missing `ALERT_TOKEN_SECRET` and `EDITORIAL_ADMIN_TOKEN`. Planning alerts and editorial access remain unavailable until configured. A protected 401 response proves rejection of anonymous requests, not successful editor access.
- The editorial desk is a submissions queue, not a publishing CMS. It lacks individual user accounts and a full revision audit trail.
- An encrypted backup workflow and a restore procedure exist. No successful backup/restore rehearsal or recipient inbox receipt has been demonstrated in this work.

## Corrections in this release

- Collect explicit article datelines and publication metadata from approved same-origin article pages. Do not use crawl times, meeting dates, site copyright dates or modification dates. Niagara Region's generic DATE metadata was observed as a 2018 template date and is deliberately ignored.
- Preserve unknown dates, rejected/review states, editorial overrides and previously verified dates. Metadata fetch failures retain source links and are counted in health reports.
- Save health reports even if every source fails. Show failures in Actions summaries while retaining the last-known-good snapshot.
- Rebase clean concurrent updates before committing; stop on conflicts without force pushing.
- Repair missing publication on no-change runs by comparing the live revision with main and dispatching the current main revision when necessary.
- Run collection when collector code/config changes on main. Generated snapshot commits do not match that trigger, avoiding a loop.
- Verify current story titles in both live news and RSS, in addition to revision/hash and route checks.

Publication here means posting source-linked news to the website and RSS. No social-media posts or subscriber messages are sent by this workflow.
