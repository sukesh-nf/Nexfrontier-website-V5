# NexFrontier Website v4 — Redirect Register

**Status:** Internal project document. Not public.
**Purpose:** Tracks URL redirects for content that has moved between v3 and v4.
Per Blueprint Part 4 section 16.

---

## Active Redirects

| Content ID | Content Type | Old URL | New URL | Reason | Effective Date | Redirect Type | Status |
|---|---|---|---|---|---|---|---|
| RTS001 | Reading The Shift article | `/#/article/what-is-an-ai-mediated-market` | `/reading-the-shift/what-is-an-ai-mediated-market` | v3 to v4 migration | 2026-08-25 | 301 | Active |
| RTS003 | Reading The Shift article | `/#/article/ai-inside-the-enterprise-is-only-half-the-shift` | `/reading-the-shift/why-is-internal-ai-only-half-the-shift` | v3 to v4 migration, slug changed materially | 2026-08-25 | 301 | Active |
| RTS028 | Reading The Shift article | `/#/article/how-should-businesses-prepare` | `/reading-the-shift/how-should-businesses-prepare-for-ai-mediated-choice` | v3 to v4 migration, slug changed | 2026-08-25 | 301 | Active |

## Legacy Slug Records

These are stored in the spoke article data model as `legacySlugs` for internal lookup.

| Article ID | Current Slug | Legacy Slugs | Notes |
|---|---|---|---|
| RTS003 | `why-is-internal-ai-only-half-the-shift` | `ai-inside-the-enterprise-is-only-half-the-shift` | Slug changed materially in v4 |
| RTS028 | `how-should-businesses-prepare-for-ai-mediated-choice` | `how-should-businesses-prepare` | Slug expanded for clarity in v4 |

## Future Redirects

No additional redirects required at this time. When slugs are changed after publication, add entries here and create permanent redirects.
