-- Permanent status-change trail for private submissions.
CREATE TABLE IF NOT EXISTS editorial_actions (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  old_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (submission_id) REFERENCES editorial_submissions(id)
);
CREATE INDEX IF NOT EXISTS idx_editorial_actions_submission_created ON editorial_actions(submission_id, created_at DESC);
