-- Newsletter subscriber persistence
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  topics TEXT NOT NULL DEFAULT '[]',
  placement TEXT NOT NULL DEFAULT 'site_rail',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  confirmed_at INTEGER,
  last_error TEXT
);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
