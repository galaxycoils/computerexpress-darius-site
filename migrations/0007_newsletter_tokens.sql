-- Store only hashes of bearer tokens; subscriber addresses stay private in D1.
CREATE TABLE IF NOT EXISTS newsletter_tokens (
 token_hash TEXT PRIMARY KEY,
 email TEXT NOT NULL,
 purpose TEXT NOT NULL CHECK(purpose IN ('confirm','manage')),
 expires_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_newsletter_token_email ON newsletter_tokens(email, purpose);
CREATE INDEX IF NOT EXISTS idx_newsletter_token_expiry ON newsletter_tokens(expires_at);
