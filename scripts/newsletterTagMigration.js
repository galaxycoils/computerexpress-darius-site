export function newsletterTagMigration(columns) {
  const names = new Set(columns)
  for (const required of ['email', 'topics', 'placement', 'status']) {
    if (!names.has(required)) {
      throw new Error(`Newsletter schema is missing ${required}; apply the newsletter subscriber migration before deployment`)
    }
  }
  if (names.has('tags')) return 'SELECT 1;\n'
  return "ALTER TABLE newsletter_subscribers ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';\n"
}
