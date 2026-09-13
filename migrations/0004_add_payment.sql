-- Add payment tracking to alerts for Interac e-Transfer
-- Run: wrangler d1 execute stcatharinesdigital_d1 --remote --file=migrations/0004_add_payment.sql

ALTER TABLE alerts ADD COLUMN payment_status TEXT DEFAULT 'pending_interac';
ALTER TABLE alerts ADD COLUMN payment_reminded_at INTEGER;
ALTER TABLE alerts ADD COLUMN payment_confirmed_at INTEGER;
ALTER TABLE alerts ADD COLUMN payment_note TEXT;

CREATE INDEX IF NOT EXISTS idx_alerts_payment ON alerts(payment_status);
