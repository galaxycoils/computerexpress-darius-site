-- Entitlement gate for the paid Planning Alerts digest.
-- Run: wrangler d1 execute stcatharinesdigital_d1 --remote --file=migrations/0011_add_alert_entitlement.sql
--
-- Before this migration the weekly digest was delivered to every verified alert
-- regardless of payment (functions/cron/daily-digest.js selected on `verified = 1`
-- only), so the $49/mo product was being given away. `payment_status` already
-- existed from migration 0004 but nothing read it on the delivery path.

-- Deadline of the grace window granted to readers who were already receiving the
-- digest for free. NULL means no grace (pay first, then receive).
ALTER TABLE alerts ADD COLUMN grace_until INTEGER;

-- Idempotency marker for the one-time "your free delivery is ending" notice, so a
-- retried cron run cannot send it twice.
ALTER TABLE alerts ADD COLUMN grace_notified_at INTEGER;

-- Backfill a bounded 30-day grace window for already-verified readers.
-- SQLite applies a column DEFAULT to existing rows, so every pre-existing row is
-- 'pending_interac' (migration 0004). Gating on 'confirmed' alone would silence
-- those readers with no explanation; they get 30 days and a payment prompt instead.
UPDATE alerts
   SET grace_until = (strftime('%s', 'now') * 1000) + 2592000000
 WHERE verified = 1
   AND (payment_status IS NULL OR payment_status != 'confirmed');

CREATE INDEX IF NOT EXISTS idx_alerts_entitlement ON alerts(verified, frequency, payment_status);
