-- Private reader submissions. Public pages never query this table.
CREATE TABLE IF NOT EXISTS editorial_submissions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('contact','event','correction','accessibility')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','reviewing','accepted','rejected','closed')),
  reviewer_note TEXT,
  reviewed_by TEXT,
  reviewed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_editorial_submissions_status_created ON editorial_submissions(status, created_at DESC);
