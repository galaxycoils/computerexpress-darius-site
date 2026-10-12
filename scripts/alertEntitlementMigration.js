export function entitlementMigration(columns) {
  const names = new Set(columns)
  for (const required of ['id', 'verified', 'payment_status']) {
    if (!names.has(required)) throw new Error(`Alerts schema is missing ${required}; apply the initial alerts/payment schema before deployment`)
  }
  const statements = []
  for (const column of ['grace_until', 'grace_notified_at']) {
    if (!names.has(column)) statements.push(`ALTER TABLE alerts ADD COLUMN ${column} INTEGER;`)
  }
  if (!names.has('grace_until')) {
    statements.push("UPDATE alerts SET grace_until = (strftime('%s', 'now') * 1000) + 2592000000 WHERE verified = 1 AND (payment_status IS NULL OR payment_status != 'confirmed') AND grace_until IS NULL;")
  }
  statements.push('CREATE INDEX IF NOT EXISTS idx_alerts_entitlement ON alerts(verified, frequency, payment_status);')
  return statements.join('\n') + '\n'
}
