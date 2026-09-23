# Editorial operations

## Editorial desk

`/editorial` is a no-index client route. It displays no data until a code is entered and all data requests use a bearer token over HTTPS.

For individual access, set `EDITORIAL_USERS_JSON` as a GitHub repository secret containing an array of `{ "id": "name", "role": "admin", "tokenSha256": "..." }` records. Generate a distinct long random code for each person, compute its SHA-256 hex digest with `printf '%s' 'code' | sha256sum`, and store only the digest in this JSON; share each original code privately with that person. The deployment workflow copies this secret to Pages. Remove an entry and redeploy to revoke an individual code. Reviewers can read; admins can change status. Status changes record the configured ID in `editorial_actions`, and the dashboard loads older submissions in pages of 50.

Legacy shared codes are still supported during migration:

- `EDITORIAL_ADMIN_TOKEN`: a long randomly generated shared administrator token.
- `EDITORIAL_REVIEWER_TOKEN`: optional shared read-only token.

If neither individual nor legacy tokens are configured, every desk request remains locked with `401`. The browser retains the active code only for its tab session. Remove legacy tokens from Pages after individual credentials are in use, and remove the repository secrets so a later deployment cannot restore them.

Reader contacts, event suggestions and accessibility feedback are written to `editorial_submissions` as `pending` before an email notification is attempted. Reviewers use `reviewing`, `accepted`, `rejected` or `closed`; no status publishes a record automatically. The dashboard is a review queue, not a CMS publishing control.

The digest scheduler runs at 6 AM Toronto time on Thursday through GitHub Actions. The build publishes `planning-alert-feed.json` from the same approved records used on the site; the sender reads this file, filters it against verified subscriber choices, and records delivered source IDs in D1 to prevent repeat sends. Configure the same `CRON_SECRET` in GitHub Actions and Pages, plus `ALERT_TOKEN_SECRET` and `AGENTMAIL_API_KEY` for email delivery. A workflow failure indicates that email delivery requires attention; verify the send count and a recipient inbox before describing delivery as operational. A newsletter signup only confirms consent; it does not subscribe anyone to the planning digest.

## Newsletter consent

Only a successful `POST` to `/api/newsletter/confirm` changes a pending subscription to active. The reconciliation cron reports failed and pending confirmations without delivering email or changing consent. A failed reader can submit the signup form again to request a new confirmation email.

## Backups and restore rehearsal

`Encrypted D1 backup` exports the production database weekly and retains an AES-256-CBC encrypted artifact for 30 days. It requires `D1_BACKUP_PASSPHRASE`, Cloudflare API credentials, and access to the repository Actions artifacts. Store the passphrase outside GitHub and away from the artifact download location.

To rehearse restoration, download a backup, decrypt it on an isolated machine, and restore only into a newly created non-production D1 database:

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -in stcatharinesdigital.sql.enc -out restore.sql
npx wrangler d1 execute <non-production-database> --local --file=restore.sql
```

Verify table counts, a sample confirmed subscriber, a token-expiry query, and an editorial submission. Do not restore into the production database during a rehearsal. Record the database name, backup timestamp, operator and results in the incident log.

The export workflow and database access require administrator credentials. Record one successful backup and isolated restore rehearsal before treating recovery as proven; code checks alone do not verify that an encrypted artifact can be decrypted and imported.
