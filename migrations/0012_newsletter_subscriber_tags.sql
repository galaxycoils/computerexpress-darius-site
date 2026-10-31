-- Tag on the existing newsletter_subscribers list.
-- Council Record uses "council-record". This does not create another list.
-- Production applies the change through scripts/ensure-newsletter-tags.mjs so a
-- later deploy can see that the column is already present.

ALTER TABLE newsletter_subscribers ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
