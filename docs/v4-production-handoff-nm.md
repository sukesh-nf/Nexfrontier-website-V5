# NexFrontier — Production Handoff & Launch Runbook for NM

**Date:** 2026-09-03
**Status:** Founder-reviewed production handoff. Site not yet published.

---

## 1. Accepted System State

| Track | Status |
|---|---|
| Public site (Track A) | PASS |
| Investor product (Track B) | PASS |
| Production readiness | NOT YET COMPLETE |

Remaining production actions:
- Founder personally sets/confirms final Super Admin passphrase
- Production email delivery configuration
- Netlify production environment/deployment
- Hosted regression QA

---

## 2. Deployment Architecture

| Component | Value |
|---|---|
| Framework | Next.js 16.1.7 |
| React | 19.2.8 |
| Build command | `npm run build` |
| Output mode | `output: 'export'` (fully static export) |
| Images | `unoptimized: true` |
| Publish directory | `out` |
| Hosting | Netlify serves static output from `out/` |
| Backend | Supabase (provisioned project) |

**Netlify configuration:** `netlify.toml` defines build command (`npm run build`), publish directory (`out`), and redirect rules. No Netlify Next.js runtime adapter or server-side plugin is required for this static-export architecture.

**ARCHITECTURE DEFECT FOUND:** `package.json` currently lists `@netlify/plugin-nextjs` as a dependency (`^5.15.13`). This plugin is not required for a pure static-export deployment and may introduce unintended server-side runtime behavior. It should be removed from production dependencies before launch. This is a dependency cleanup item, not a product-code change. No code change made in this task.

---

## 3. Public Redirects

| From | To | Status | In sitemap? |
|---|---|---|---|
| `/investor` | `/investor-proof` | 301 (force) | No |
| `/market-evidence` | `/hyper-accelerating-markets` | 301 (force) | No |

Both redirects are configured in `netlify.toml` with `force = true`. Redirect-only routes are excluded from the sitemap.

---

## 4. Production Environment Variables

### STRICT RULE

NO SECRET VALUES ARE TO BE COMMITTED TO THE REPOSITORY OR EXPOSED IN STATIC/CLIENT OUTPUT.

The local `.env` file is for development only. Do not copy it wholesale to production. Production secrets must be configured through the hosting platform's secure environment variable interface.

### NETLIFY / PUBLIC CLIENT ENV (safe for browser bundle)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production domain (e.g., `https://nexfrontierlogic.nz`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for client) |

### NETLIFY SERVER/BUILD ENV

| Variable | Purpose |
|---|---|
| `SITE_INDEXING_ENABLED` | Set to `true` only when ready for search engine indexing. Default: unset/false. |

### SUPABASE EDGE FUNCTION SECRETS (configured in Supabase project, not Netlify)

| Secret | Purpose | Currently configured? |
|---|---|---|
| `SUPABASE_URL` | Auto-configured by Supabase runtime | Yes (auto) |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-configured by Supabase runtime | Yes (auto) |
| `SUPABASE_ANON_KEY` | Auto-configured by Supabase runtime | Yes (auto) |
| `SUPABASE_DB_URL` | Auto-configured by Supabase runtime | Yes (auto) |
| Email provider API key | For production email delivery | NOT YET CONFIGURED |
| Email sender address | For production email delivery | NOT YET CONFIGURED |
| Email sender domain | For production email delivery | NOT YET CONFIGURED |

### SERVER-ONLY VARIABLES NOT REQUIRED IN NETLIFY

| Variable | Status |
|---|---|
| `PREVIEW_MODE` | Used only in `src/config/site.ts` for QA/preview builds of unpublished Spokes/video pages. Not required for production deployment. Do not set in production unless conducting a preview build. |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-configured in Supabase Edge Function runtime. Must NOT be placed in Netlify env or client bundle. |
| `SUPABASE_DB_URL` | Auto-configured in Supabase runtime. Must NOT be placed in Netlify env or client bundle. |

---

## 5. Email Delivery Requirements

### Current state: MANUAL / TEST DELIVERY ONLY

No production email provider is configured. Both investor invitation and admin passphrase reset use a DEV manual delivery path — the activation/reset URL is returned in the API response for the admin to share manually. This path is gated behind `is_test_investor = true` for investor invitations, and behind bootstrap-secret authentication for admin reset.

### Email implementation state per lifecycle event:

| Event | Code status | Configuration status |
|---|---|---|
| Investor approval/activation | IMPLEMENTATION REQUIRED — no email-sending code exists; DEV manual delivery only | Provider config missing |
| Direct invitation | IMPLEMENTATION REQUIRED — same as above | Provider config missing |
| Re-invitation | IMPLEMENTATION REQUIRED — same as above | Provider config missing |
| Admin passphrase reset | IMPLEMENTATION REQUIRED — DEV manual delivery only | Provider config missing |

No email-sending code (SMTP, Resend, SendGrid, or otherwise) exists in any Edge Function. Production email implementation is required for all four events above.

### Production requirements:

1. Select and configure email provider
2. Configure sender identity and domain
3. Set up SPF record for sender domain
4. Set up DKIM signing for sender domain
5. Set up DMARC policy for sender domain
6. Configure Edge Function email secrets in Supabase
7. Implement email sending in `drm-admin` (send-invite/resend-invite) and `drm-admin-reset`
8. Remove or gate DEV manual delivery path behind `is_test_investor` for production

---

## 6. Founder Super Admin Action

**FOUNDER FINAL PASS-PHRASE IS A FOUNDER-CONTROLLED ACTION.**

### Current state:
- Sukesh Sukumaran exists as ACTIVE SUPER ADMIN (`sukesh@nexfrontierlogic.nz`)
- First-admin bootstrap is self-disabled because an active Super Admin already exists
- Bootstrap cannot be reused to create another "first" admin
- No raw bootstrap secret is exposed in static/client output

### Production process:
1. Frontend is deployed and reachable
2. NM/operator verifies the reset flow is operational
3. If needed, an authorised operator initiates a fresh reset request/token through the protected reset mechanism (requires bootstrap secret, stored as hash in `drm_bootstrap_config` table)
4. Founder opens the hosted reset flow at `/investor-admin/reset-passphrase`
5. Founder personally chooses the final passphrase (min 12 chars, weak passphrases rejected)
6. Reset invalidates all existing admin sessions
7. Founder verifies successful login
8. NM never chooses or receives the founder's passphrase

### Distinction:
- **FIRST-ADMIN BOOTSTRAP:** One-time creation of the first Super Admin. Self-disabled after first admin exists. Cannot be reused.
- **ADMIN PASS-PHRASE RESET:** Ongoing operator-initiated flow to reset an existing admin's passphrase. Requires bootstrap secret verification. Separate from bootstrap.

---

## 7. Investor Lifecycle

### Request-level states (`drm_investor_requests.status`)

| State | Meaning |
|---|---|
| `pending` | Public request submitted, awaiting admin review |
| `invited` | Admin approved and issued activation token |
| `declined` | Admin declined the request (no investor record created) |

### Investor lifecycle states (`drm_investors.lifecycle_status`)

| State | Entered by | Exited by |
|---|---|---|
| `approved_awaiting_activation` | Admin approves public request (send-invite with requestId) | Investor activates (drm-activate) |
| `invited_awaiting_activation` | Admin directly invites (send-invite without requestId) | Investor activates (drm-activate) |
| `active` | Investor completes activation | Admin suspends or revokes |
| `suspended` | Admin suspends | Admin reactivates |
| `revoked` | Admin revokes | (terminal — no exit path) |

### Provenance distinction:
- `approved_awaiting_activation` = investor approached NexFrontier via public request pathway
- `invited_awaiting_activation` = NexFrontier/admin initiated the relationship directly
- Both activate identically to `active`
- Fresh-token issuance preserves the origin state (does not convert between the two)

---

## 8. Token & Session Security

| Property | Value |
|---|---|
| Token generation | `crypto.randomUUID()` (cryptographically random) |
| Storage | SHA-256 hash only — raw token never stored in database |
| Activation token expiry | 48 hours from issuance |
| Single-use | Yes — atomic claim via `UPDATE ... WHERE is_valid=true AND used_at IS NULL` |
| Fresh token | Invalidates all prior unused tokens for the same investor |
| Token types | `invitation`, `re-invitation`, `session`, `admin_session`, `admin_activation`, `admin_passphrase_reset` |
| Investor session TTL | 8 hours |
| Admin session TTL | 12 hours |
| Session refresh | No automatic refresh — sessions expire after TTL |
| Logout | Invalidates the presented session token (`is_valid = false`) |
| Suspension override | Invalidates all session tokens for the investor |
| Revocation override | Invalidates all session, invitation, and re-invitation tokens |
| Server-side re-check | Every protected request re-checks investor/admin status at request time |
| Raw token in audit | Never — audit metadata contains only token type and reason |
| Raw token in static output | Never |

---

## 9. NDA

| Property | Value |
|---|---|
| Current version | `v1-PLACEHOLDER` |
| `is_current` | `true` |
| Legally approved | No — clearly marked as placeholder |
| Founder decision | Retained for current launch planning |
| Non-test investor issuance | Blocked while placeholder is current (code gate in send-invite and resend-invite) |
| Test investor path | Allowed via `is_test_investor = true` |
| NDA versioning | Supported — `nda_versions` table with `is_current` flag |
| Acceptance | Per-version — `nda_acceptances` table linked to specific `nda_version_id` |
| Re-acceptance | Required when current NDA version changes (old acceptance doesn't match new version ID) |
| Body hash | SHA-256 of exact NDA body text stored per acceptance |
| Audit fields | `full_legal_name`, `company`, `title_role`, `user_agent`, `nda_body_hash`, `investor_email`, `acceptance_statement_version` |
| Acceptance statement version | `investor-nda-acceptance-v1` |
| IP capture | No — intentionally not captured |

THIS IS A CONTROLLED TECHNICAL GATE AND A FOUNDER-CONTROLLED CONTENT/LEGAL DECISION.

NM must understand the consequence: real investor issuance remains blocked until the current NDA state is intentionally changed by the founder. This is not a technical defect — it is an intentional gate.

---

## 10. Data Room Content

### Private route shells

- 13 Data Room topic route shells (static export generates empty shells for each)
- 1 NDA route shell
- **Total: 14 known private static route shells**

### Current state

| Property | Value |
|---|---|
| All 13 topics | `status = 'inactive'`, `current_published_version_id = null` |
| Six approved core drafts | Stored in database as draft versions (`published_at IS NULL`) — 6 draft versions confirmed |
| Published versions | None — no version has `published_at` set |
| Runtime delivery | `drm-content` Edge Function returns content only for `status = 'published'` AND non-null `current_published_version_id` |
| Inactive topics | Invisible to investors — `list-topics` returns empty array |
| Publication | All six core pages intended to publish together only after explicit founder approval |

ROUTE EXISTENCE DOES NOT IMPLY CONTENT AVAILABILITY.

### 13 Data Room topics:

1. investment-case
2. market-evidence
3. economic-opportunity
4. product
5. proof
6. round
7. commercial-model
8. financials
9. defensibility-ip
10. team-governance
11. risks-open-questions
12. legal-corporate
13. supporting-evidence

---

## 11. Private Content Delivery Architecture

Private Data Room content is NEVER embedded in static HTML/JS.

The exact delivery sequence is:

1. Static private route shell loads in browser (empty page)
2. Browser makes authenticated runtime request to `drm-content` Edge Function
3. Edge Function validates session token (hash match, not expired, not invalidated)
4. Edge Function verifies investor is `active` (not suspended, not revoked)
5. Edge Function verifies investor `access_level >= 2` (NDA-gated)
6. Edge Function verifies current NDA version has been accepted by this investor
7. Edge Function verifies requested page `status = 'published'`
8. Edge Function verifies page has non-null `current_published_version_id`
9. Edge Function fetches the published version's `content_json`
10. Authorised content returned as JSON

Every failure at any step fails closed — no private body content is returned.

---

## 12. Data Room Version & Publication Semantics

### DRAFT VERSION
- `published_at IS NULL`
- Remains editable
- Content hash calculated on publish, not on save

### PUBLISHING AN APPROVED DRAFT
For the exact approved version:
1. Set its `published_at` to current timestamp
2. Set `published_by` to admin ID
3. Calculate and store `content_hash` (SHA-256 of canonical content JSON)
4. Set `is_published = true`
5. Set the page `status = 'published'`
6. Set page `current_published_version_id = <that exact version id>`
7. Previously published version for that page: set `is_published = false` (retains its `published_at` — remains immutable and historical)

### HISTORICAL PUBLISHED VERSION
- Retains `published_at` timestamp
- Is immutable
- Is not the page's current published pointer

### CRITICAL RULE
`is_published` / current-live semantics must not be confused with "was historically published". Do not overwrite or mutate a previously published version's content. The `current_published_version_id` pointer moves to the new version; the old version remains immutable in version history.

### SIX CORE PAGES
All six approved core pages are intended to publish together only after explicit founder approval. Do not publish any in this task.

---

## 13. Edge Function Inventory

### PRODUCTION-REQUIRED EDGE FUNCTIONS (13)

| Slug | verify_jwt | Purpose | Category |
|---|---|---|---|
| `drm-request` | true | Public investor brief request submission | Public form |
| `drm-activate` | true | Investor activation (token + credential creation) | Investor auth/access |
| `drm-login` | true | Investor login (session creation) | Investor auth/access |
| `drm-nda` | false | NDA status check and acceptance (session-token auth) | Investor auth/access |
| `drm-content` | false | Data Room content delivery (session-token auth, NDA gated) | Investor auth/access |
| `drm-documents` | false | Document/folder management (session-token auth) | Investor auth/access |
| `drm-admin` | false | Admin console (session-token auth, RBAC) | Admin |
| `drm-admin-activate` | false | Admin account activation | Admin |
| `drm-admin-bootstrap` | false | First super admin creation (self-disabled after first admin exists) | Admin/bootstrap |
| `drm-admin-reset` | false | Admin passphrase reset flow | Admin/reset |
| `drm-content-admin` | false | Content administration (drafts, versions, publishing) | Content |
| `market-enquiry` | true | Public market enquiry form submission | Public form |
| `leadership-pulse` | true | Public leadership pulse survey submission | Public form |

### TEMPORARY FUNCTIONS TO REMOVE/DISABLE BEFORE PRODUCTION (2)

| Slug | Purpose | Status |
|---|---|---|
| `drm-storage-cleanup` | Storage cleanup utility created during QA/security remediation | Currently deployed and ACTIVE. Not required for normal production operation. Remove or disable before launch. |
| `drm-bucket-delete` | Storage bucket deletion utility created during QA/security remediation | Currently deployed and ACTIVE. Not required for normal production operation. Remove or disable before launch. |

Do not delete these in this task. NM should remove or disable them as part of production configuration.

---

## 14. Storage

| Property | Value |
|---|---|
| Public downloads bucket | Removed — zero public storage buckets exist (verified) |
| Private investor material storage | No public storage URLs used |
| QA ZIP | None |
| Future investor documents | Must use authenticated/controlled delivery |
| Public `/storage/v1/object/public/...` | Must NEVER be used for private Data Room files |
| Old migration `add_downloads_bucket_policies` | Historical migration record, not current production state. The bucket it referenced has been removed. Do not infer the bucket still exists from the migration filename. |

---

## 15. Robots / Sitemap

### Fail-closed logic:

| Condition | robots.txt | sitemap.xml |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` not set | `Disallow: /` | Empty (`[]`) |
| `SITE_INDEXING_ENABLED` not `true` | `Disallow: /` | Empty (`[]`) |
| Both set | `Allow: /` | Full sitemap with published routes only |

**Private routes** (investor-data-room, investor-admin) are always excluded from sitemap regardless of indexing flag.

### Production requirements:
1. Set `NEXT_PUBLIC_SITE_URL` to canonical production domain
2. Set `SITE_INDEXING_ENABLED=true` only when ready for indexing (after launch verification)

Indexing is NOT automatically enabled by deployment. Both conditions must be explicitly met.

---

## 16. Public Forms

### Market Enquiry

| Property | Value |
|---|---|
| Edge Function | `market-enquiry` (verify_jwt: true) |
| Table | `market_enquiries` |
| Validation | Server-side: name, email, organisation, enquiry required |
| Persistence | Supabase table |
| Error handling | Generic errors, no stack traces |
| Email notification | Not configured (no email provider). Form submissions persist to database regardless. |

### Leadership Pulse

| Property | Value |
|---|---|
| Edge Function | `leadership-pulse` (verify_jwt: true) |
| Table | `leadership_pulse_responses` |
| Validation | Server-side: name, email, role, responses required |
| Persistence | Supabase table |
| Error handling | Generic errors, no stack traces |
| Email notification | Not configured. Form submissions persist to database regardless. |

Form operation is independent of investor email infrastructure. Forms persist submissions to the database even without email configured.

---

## 17. Security Controls

| Control | Status |
|---|---|
| Public/private route separation | Static export generates shells; private content only via runtime Edge Function |
| Runtime Data Room gate | `drm-content` checks: session → active (not suspended/revoked) → access_level ≥ 2 → NDA accepted → page published → current published version exists → content returned |
| NDA gate | `drm-content` and `drm-nda` both check acceptance against current NDA version ID |
| Lifecycle status checks | Every protected request re-checks investor `lifecycle_status` at request time |
| Page publication check | `drm-content` only returns pages with `status = 'published'` AND non-null `current_published_version_id` |
| Page permission | Access level checked (`access_level >= 2` required for NDA-gated content) |
| Suspension/revocation check | Session tokens invalidated on suspend/revoke; status re-checked at request time |
| RBAC | Server-side `PERMISSIONS` map with `requirePermission()` gate on every admin action |
| Final Super Admin protection | `activeSuperCount <= 1` guard in suspend-admin, remove-admin, change-role |
| Token hashing | SHA-256 hash only stored; raw token never in database |
| Session invalidation | Logout, suspend, revoke, reset all invalidate relevant tokens |
| No static private body leakage | Verified — grep of static HTML/JS for private content: no matches |
| No secret leakage | Verified — no service-role keys, DB URLs, passphrase hashes, or raw tokens in static output |
| No public private-storage bucket | Verified — zero public storage buckets |
| Passphrase hashing | PBKDF2 600k iterations + random salt |
| Brute-force protection | Account lock after 5 failed attempts, 15-minute lockout |
| Timing-safe comparison | `timingSafeEqual` used for passphrase verification |
| Dummy hash verification | Non-existent accounts verified against dummy hash to equalize timing |

---

## 18. Known Accepted Non-Blockers

These are accepted as not blocking launch:

| Item | Classification |
|---|---|
| No branded og:image | Post-launch enhancement |
| Enhanced social share-card system | Post-launch enhancement |
| Enhanced admin analytics dashboard | Post-launch enhancement |

Email delivery, founder passphrase, and Data Room publication are NOT listed here — they are required production actions.

---

## 19. Launch Runbook

### PHASE 1 — PRODUCTION CONFIGURATION

1. Confirm canonical production domain
2. Set Netlify public/build environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Configure production email provider
4. Configure sender identity/domain
5. Configure SPF
6. Configure DKIM
7. Configure DMARC
8. Configure Supabase Edge Function email secrets
9. Remove/disable temporary QA utility functions (`drm-storage-cleanup`, `drm-bucket-delete`) if still deployed
10. Remove `@netlify/plugin-nextjs` from production dependencies (architecture defect — see Section 2)

### PHASE 2 — DEPLOY FAIL-CLOSED

11. Deploy static site to Netlify
12. Keep `SITE_INDEXING_ENABLED` unset or `false`
13. Verify production redirects (`/investor` → `/investor-proof` 301, `/market-evidence` → `/hyper-accelerating-markets` 301)
14. Verify canonical-domain behavior
15. Verify robots disallow / indexing remains off
16. Verify sitemap contains zero public index entries while disabled

### PHASE 3 — ADMIN ACCESS

17. Verify hosted admin/reset routes are reachable
18. Issue fresh founder reset token if required (operator initiates via protected reset mechanism)
19. Founder personally sets final passphrase
20. Founder logs in successfully
21. Verify admin session/logout/RBAC

### PHASE 4 — PUBLIC FUNCTIONAL QA

22. Verify Market Enquiry production submission
23. Verify Leadership Pulse production submission
24. Verify mobile/desktop public pages
25. Verify no console/runtime errors

### PHASE 5 — INVESTOR FLOW QA (USE TEST INVESTOR ONLY)

26. Use explicit QA/test investor only — do not use a real investor
27. Public request submission
28. Admin approval
29. Verify `approved_awaiting_activation`
30. Activation email delivery (or manual delivery for test investor)
31. Activation
32. Login
33. Placeholder NDA gate (expected: NDA required)
34. Data Room Home should remain empty because all topics are inactive
35. Logout / return login
36. Clean QA data if safe

### PHASE 6 — PRIVATE CONTENT ACTIVATION

37. Founder explicitly approves publication of all six core pages
38. Publish exact approved versions using locked version semantics (Section 12)
39. Verify all six current published pointers are set
40. Verify historical versions remain immutable
41. Re-run QA investor access
42. Verify only authorised published topics appear

### PHASE 7 — FINAL SECURITY QA

43. Verify no static private content leakage
44. Verify no public private-material storage
45. Verify no service-role secrets in client/static output
46. Verify investor/admin routes remain noindex

### PHASE 8 — INDEXING ENABLEMENT

47. Founder explicitly approves enabling public indexing
48. Set `SITE_INDEXING_ENABLED=true`
49. Redeploy
50. Verify robots now allow intended public crawling
51. Verify sitemap includes only approved public indexable routes
52. Verify redirect/private routes excluded
53. Verify production canonicals/OG URLs use the canonical domain

### PHASE 9 — FINAL ACCEPTANCE

54. Founder final hosted QA
55. NM confirms infrastructure health
56. Launch

---

## 20. Rollback / Failure Plan

| Failure scenario | Safe rollback action |
|---|---|
| Public deployment failure | Redeploy previous known-good Netlify build. Leave indexing disabled until stable. |
| Form failure (Market Enquiry / Leadership Pulse) | Diagnose Edge Function/database. Do not delete legitimate submissions. Communicate outage if needed. No destructive workaround. |
| Investor login failure | Halt new investor invitations. Inspect auth/session logs. Do not bypass auth or NDA. |
| Email delivery failure | Stop issuing new real-investor activation/re-invitation emails. Preserve investor lifecycle state. Do NOT flip `is_test_investor` on a real investor. Diagnose provider, sender identity, DNS, Edge Function secret/config. Restore verified production email delivery. Issue fresh activation token after delivery is restored. Allow manual token delivery only for explicitly designated QA/test investors. NEVER USE TEST-INVESTOR STATUS AS A PRODUCTION BYPASS. |
| Data Room publication error | Set affected page `status = 'inactive'`. Clear `current_published_version_id` only using supported admin/version logic. Do not mutate published historical version record. Verify investor access fails closed. |
| Indexing enabled too early | Set `SITE_INDEXING_ENABLED=false`. Redeploy. Verify robots/sitemap fail-closed. |
| Secret exposure | Rotate affected secret immediately. Invalidate related sessions/tokens where applicable. Redeploy. Verify static/client output clean. Document incident. |

---

## 21. Founder Actions

1. Personally set/confirm final Super Admin passphrase via hosted reset flow
2. Explicitly approve publication of six core Data Room pages
3. Explicitly approve enabling public indexing
4. Final launch acceptance/timing

Founder does NOT perform: DNS configuration, email provider setup, Supabase secret configuration, Netlify deployment, NDA/legal decisions (unless founder explicitly chooses to change the placeholder NDA).

---

## 22. NM Actions

1. Configure production domain and Netlify environment variables
2. Configure email provider integration (provider, sender domain, API key)
3. Set up SPF record for sender domain
4. Set up DKIM for sender domain
5. Set up DMARC policy for sender domain
6. Configure Supabase Edge Function email secrets
7. Remove/disable temporary QA utility functions (`drm-storage-cleanup`, `drm-bucket-delete`) if still deployed
8. Remove `@netlify/plugin-nextjs` from production dependencies
9. Deploy Netlify static export
10. Support founder reset-flow (initiate reset token if required; do NOT choose or receive founder's passphrase)
11. Hosted end-to-end regression QA
12. Data Room publication execution after founder approval (using locked version semantics)
13. Security verification
14. Indexing enablement after founder approval
15. Rollback readiness

NM does NOT: choose founder credentials, make NDA/legal decisions, reinterpret product strategy, or relabel real investors as test investors.

---

## 23. Post-Launch Enhancements

1. Branded OG image / social share-card system
2. Enhanced admin analytics dashboard

---

*End of production handoff & launch runbook.*
