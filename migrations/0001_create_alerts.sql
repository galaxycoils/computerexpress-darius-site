-- Planning Alerts MVP — D1 Schema
-- Run: wrangler d1 execute stcatharinesdigital --local --file=migrations/0001_create_alerts.sql

CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  frequency TEXT DEFAULT 'daily',
  wards TEXT,
  types TEXT,
  statuses TEXT,
  keywords TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_sent_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_alerts_email ON alerts(email);
CREATE INDEX IF NOT EXISTS idx_alerts_verified ON alerts(verified);
CREATE INDEX IF NOT EXISTS idx_alerts_frequency ON alerts(frequency);