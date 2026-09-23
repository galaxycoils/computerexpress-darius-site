-- Prevent a weekly alert from sending the same source twice.
CREATE TABLE IF NOT EXISTS alert_sent_items (
  alert_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  sent_at INTEGER NOT NULL,
  PRIMARY KEY (alert_id, source_id)
);
