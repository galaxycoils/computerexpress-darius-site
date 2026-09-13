-- Planning Alerts MVP — Notices table for scraped municipal notices
-- Run: wrangler d1 execute stcatharinesdigital_d1 --remote --file=migrations/0002_create_notices.sql

CREATE TABLE IF NOT EXISTS notices (
  id TEXT PRIMARY KEY,
  municipality TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_number TEXT,
  status TEXT,
  meeting_date TEXT,
  meeting_location TEXT,
  submission_deadline TEXT,
  submission_email TEXT,
  published_date TEXT,
  source_url TEXT NOT NULL,
  category TEXT,
  -- Denormalized text fields for alert matching (lowercase, space-separated)
  tags TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notices_municipality ON notices(municipality);
CREATE INDEX IF NOT EXISTS idx_notices_type ON notices(type);
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(published_date);
CREATE INDEX IF NOT EXISTS idx_notices_source ON notices(source_url);
