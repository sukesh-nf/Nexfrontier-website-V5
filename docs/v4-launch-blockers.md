# v4 Launch Blocker Register

**Last updated:** Part 8B — 2026-08-25

| ID | Issue | Page/System | Severity | Type | Owner | Required Before Launch? | Status | Resolution | Evidence of Resolution |
|---|---|---|---|---|---|---|---|---|---|
| LB-01 | Canonical production domain not confirmed | Global | BLOCKER | Business | NF Leadership | Yes | OPEN | Awaiting business decision on domain | None |
| LB-02 | Market Enquiry form has no backend destination | /market-enquiry | BLOCKER | Functional | NF Operations | Yes | OPEN | Server-side API route with validation, sanitisation, rate limiting built. Awaiting NF destination decision (email, CRM, or database). | API route at /api/enquiry; adapter preserved |
| LB-03 | EV Calculator report delivery has no backend | /enterprise-value/calculator | BLOCKER | Functional | NF Operations | RESOLVED FOR LAUNCH | DELIVERY DEFERRED | Report delivery CTA removed. Calculator concludes with exploration links. Adapter preserved for future activation. | Report UI removed; exploration links added; no email collection |
| LB-04 | Privacy policy not legally reviewed | /privacy | BLOCKER | Legal | NF Legal | Yes | OPEN | Legal review brief created. Awaiting legal counsel review. | docs/v4-legal-review-brief.md |
| LB-05 | Terms not legally reviewed | /terms | BLOCKER | Legal | NF Legal | Yes | OPEN | Legal review brief created. Awaiting legal counsel review. | docs/v4-legal-review-brief.md |
| LB-06 | NEXT_PUBLIC_PREVIEW_MODE exposed client-side | Global | HIGH | Security | NF Engineering | RESOLVED | Server-side only | Changed from NEXT_PUBLIC_PREVIEW_MODE to server-side PREVIEW_MODE variable. Not inlined into client bundles. | src/config/site.ts; no NEXT_PUBLIC_ prefix |
| LB-07 | EV canonical visual missing | /enterprise-value | HIGH | Visual | NF Design | Yes | OPEN | No approved EV visual asset uploaded. Placeholder remains on page. | None |
| LB-08 | QL canonical visual missing | /enterprise-value/quiet-loss | HIGH | Visual | NF Design | Yes | OPEN | No approved QL visual asset uploaded. Placeholder remains on page. | None |
| LB-09 | AMCT asset not confirmed | /intelligence/amct | HIGH | Visual | NF Design | Yes | OPEN | Three candidate files confirmed identical (same MD5). NF must confirm the image is correct and choose filename. Placeholder remains on page. | MD5: 703614459cc553aff2a6a1fcf34b59bb (all 3 candidates) |
| LB-10 | Concept visuals need creation | Multiple | HIGH | Visual | NF Design | NO LONGER BLOCKING | RESOLVED WITH NATIVE IMPLEMENTATIONS | All 7 non-blocking visual placeholders replaced with native content treatments. FC pathway note removed. | See visual register; no VisualPlaceholder on non-blocked pages |
| LB-11 | External evidence requirements for RTS articles | /reading-the-shift/* | HIGH | Evidence | NF Content | ARTICLE-LEVEL (not site-wide) | RECLASSIFIED | 5 of 6 articles safe to publish as scoped. RTS027 remains review. | Evidence register; Part 8A assessment |
| LB-12 | Hosting/deployment vendor not confirmed | Global | HIGH | Infrastructure | NF Operations | Yes | OPEN | Next.js-capable host required. Minimum requirements documented in NF Launch Action Plan. | None |
| LB-13 | Analytics vendor not selected | Global | MEDIUM | Infrastructure | NF Operations | No | OPEN | Analytics abstraction exists, no vendor. Post-launch or pre-launch optional decision. | None |
| LB-14 | Social OG image system not finalised | Global | MEDIUM | Visual | NF Design | No | OPEN | No OG image set. No template/Bolt/Next branding exposed. Non-optimised but NF-neutral. Post-launch brand-quality action. | layout.tsx has openGraph but no images field |
| LB-15 | Error monitoring not decided | Global | MEDIUM | Infrastructure | NF Operations | No | OPEN | No monitoring vendor. Post-launch/optional day-1 decision. | None |
| LB-16 | Company identity details need human confirmation | About, Footer, Legal | MEDIUM | Business | NF Leadership | No | OPEN | Legal entity name, registration details, addresses, contact email, copyright owner, trademark ownership. | None |
| LB-17 | Cookie/tracking register | Global | MEDIUM | Privacy | NF Operations | No | RESOLVED | Cookie/tracking register exists. No cookies currently in use. Register correctly reports empty state. | docs/v4-cookie-tracking-register.md |

## Blocker Burn-Down (Part 8B)

| Category | Count |
|---|---|
| Original launch blockers | 12 |
| Whole-site launch blockers (still genuine) | 8 |
| Article-level publication blockers | 1 (RTS027) |
| Resolved for launch | 3 (LB-03, LB-06, LB-10) |
| Reclassified (site-wide to article-level) | 1 (LB-11) |
| Resolved non-blocking items | 1 (LB-17) |
| Still open non-blocking | 4 (LB-13, LB-14, LB-15, LB-16) |
