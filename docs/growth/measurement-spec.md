# Growth Measurement Specification

| Event | Trigger | Required fields | Business decision |
|---|---|---|---|
| `content_view` | A reader loads a `/guides/:slug` page | `slug`, `city`, `type` | Which topics earn more coverage |
| `newsletter_submit` | Newsletter form returns `{ success: true }` | `placement`, `path` | Which CTA placement converts |
| `sponsor_submit` | Sponsor form returns `{ success: true }` | `tier`, `path` | Which sponsor package earns demand |
| `planning_beta_waitlist_submit` | Waitlist API returns `{ success: true }` | `role`, `firm_type` | Whether $49 beta demand is qualified |

Weekly scorecard: Search Console clicks/impressions/queries; indexed URLs; page sessions by guide; newsletter conversion rate; sponsor conversations/proposals/commitments; beta waitlist count. Never record email addresses in client-side analytics.