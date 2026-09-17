-- Local News RSS table for auto-scraped news articles
-- Populated by functions/cron/fetch-local-news.js
-- Served to frontend via functions/api/local-news.js

CREATE TABLE IF NOT EXISTS local_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  municipality TEXT,
  region TEXT,
  category TEXT,
  description TEXT,
  pub_date TEXT,
  fetched_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_local_news_pub_date ON local_news(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_local_news_source ON local_news(source_id);
CREATE INDEX IF NOT EXISTS idx_local_news_municipality ON local_news(municipality);
CREATE INDEX IF NOT EXISTS idx_local_news_category ON local_news(category);
