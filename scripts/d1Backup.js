import { DatabaseSync } from 'node:sqlite'

// Restore into memory before publishing an encrypted export. Encryption alone
// cannot prove that a truncated or invalid SQL dump will restore successfully.
export function verifyD1Export(sql) {
  const database = new DatabaseSync(':memory:', { enableForeignKeyConstraints: false })
  try {
    if (typeof sql !== 'string' || !sql.trim()) throw new Error('Empty export')
    database.exec(sql)
    const tables = database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all()
    if (!tables.length) throw new Error('No exported tables')
    const checks = database.prepare('PRAGMA quick_check').all()
    if (checks.length !== 1 || checks[0].quick_check !== 'ok') throw new Error('Integrity check failed')
    if (database.prepare('PRAGMA foreign_key_check').all().length) throw new Error('Foreign key check failed')
    // A dump that ends inside an uncommitted transaction is incomplete.
    database.exec('BEGIN; ROLLBACK;')
    return { tables: tables.length }
  } catch {
    // SQL and driver errors can contain recipient data; keep them out of logs.
    throw new Error('Database export failed local restore validation; refusing to publish a backup.')
  } finally {
    database.close()
  }
}
