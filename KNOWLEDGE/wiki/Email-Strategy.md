# Website Health Check Lead Magnet - Email Sequence Strategy

This document outlines the 3-part email sequence for the Website Health Check lead magnet. 
This sequence is triggered via AgentMail when a user submits the `/api/newsletter` form.

## Sequence Overview

**Trigger:** User signs up for the "Website Health Check" lead magnet.
**Goal:** Deliver value, build trust, and ultimately encourage the lead to book a consultation or request a full audit.

### Email 1: The Delivery & Quick Wins (Immediate)
*   **Subject Line:** Your Website Health Check is inside! 🩺 + 3 Quick Wins
*   **Purpose:** Deliver the promised lead magnet and establish immediate value.
*   **Content:**
    *   Warm welcome and thanks for downloading.
    *   Link to the lead magnet (PDF or checklist).
    *   Highlight 3 immediate, easy-to-implement actions they can take today to improve their site (e.g., checking mobile responsiveness, basic speed test, verifying GBP).
    *   **Call to Action (CTA):** Reply to the email with their biggest website challenge.

### Email 2: The Deep Dive / Common Pitfalls (Day 2)
*   **Subject Line:** The #1 mistake local businesses make with their website...
*   **Purpose:** Educate the lead on common issues and position St. Catharines Digital as the expert solution.
*   **Content:**
    *   Discuss a common, critical mistake (e.g., lack of clear CTAs, poor local SEO structure).
    *   Explain *why* it hurts their business (lost leads, lower rankings).
    *   Show a brief case study or example of how fixing this issue led to results.
    *   **Call to Action (CTA):** Soft pitch - "Want us to check if you're making this mistake? Get a free custom audit." Link to the `/free-audit` page.

### Email 3: The Case Study & Invitation (Day 4)
*   **Subject Line:** How [Client Name] doubled their leads in 90 days 📈
*   **Purpose:** Provide social proof and a strong call to action for a consultation.
*   **Content:**
    *   Share a condensed, impactful version of one of the new case studies (e.g., the Plumber case study).
    *   Highlight the challenge, the specific solution provided, and the measurable results.
    *   Explain that this kind of transformation is possible for their business too.
    *   **Call to Action (CTA):** Hard pitch - "Ready to see similar results? Book a free discovery call / request a full website audit." Link to contact or audit page.

## Implementation Notes
*   Ensure the `/api/newsletter` endpoint correctly tags subscribers to enter this specific sequence in AgentMail.
*   Monitor open rates and click-through rates (CTR) to optimize subject lines and CTA placement over time.
