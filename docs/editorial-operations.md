# Editorial operations

## Editorial desk

`/editorial` is a no-index client route. It displays no data until a code is entered and all data requests use a bearer token over HTTPS.

Set these GitHub repository secrets before deploying:

- `EDITORIAL_ADMIN_TOKEN`: a long randomly generated token. It can read and change submission status.
- `EDITORIAL_REVIEWER_TOKEN`: optional. It can read the desk but cannot change status.

The deployment workflow copies configured values to Cloudflare Pages secrets. If the admin token is absent, every desk request remains locked with `401`.

Reader contacts, event suggestions and accessibility feedback are written to `editorial_submissions` as `pending` before an email notification is attempted. Reviewers use `reviewing`, `accepted`, `rejected` or `closed`; no status publishes a record automatically. The dashboard is a review queue, not a CMS publishing control.

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
