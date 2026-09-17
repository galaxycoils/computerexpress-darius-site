-- Auditable, retryable delivery attempts. Recipient references are SHA-256
-- fingerprints, not duplicate raw email addresses.
CREATE TABLE IF NOT EXISTS email_delivery_log (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  recipient_ref TEXT NOT NULL,
  template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  provider_status INTEGER,
  error_code TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  next_retry_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_delivery_retry ON email_delivery_log(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_delivery_recipient ON email_delivery_log(recipient_ref, created_at);
