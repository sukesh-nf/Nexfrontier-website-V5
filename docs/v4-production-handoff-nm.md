# NexFrontier v4 — Production Handoff Package for NM

**Date:** 2026-09-03
**Status:** Production-ready handoff. Site NOT published.

---

## 1. Accepted System State

| Track | Status |
|---|---|
| Track A — Public site | PASS |
| Track B — Investor product | PASS |
| Production readiness | NOT YET COMPLETE |

Remaining blockers:
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
| Hosting | Netlify (via `@netlify/plugin-nextjs`) |
| Backend | Supabase (provisioned, credentials in `.env`) |

**Static/private runtime split:**

PRIVATE DATA ROOM CONTENT IS NEVER EMBEDDED IN STATIC HTML/JS.

The private content architecture is:
1. Static export generates route shells (empty pages) for all 13 Data Room topics + NDA page
2. At runtime, the browser makes an authenticated request to the `drm-content` Edge Function
3. The Edge Function verifies: valid session → investor active → current NDA accepted → page published → page permission
4. Only then does the backend return authorised content as JSON
5. If any check fails, the response is a denial — no private body content is returned

---

## 3. Public Redirects

| From | To | Status | In sitemap? |
|---|---|---|---|
| `/investor` | `/investor-proof` | 301 | No |
| `/market-evidence` | `/hyper-accelerating-markets` | 301 | No |

Both redirects are configured in `netlify.toml` with `force = true`. Redirect-only routes are excluded from the sitemap.

---

## 4. Production Environment Variables

### PUBLIC CLIENT ENV (safe for client bundle)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical production domain (e.g., `https://nexfrontierlogic.nz`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

### SERVER ONLY (must NOT be in client bundle)

| Variable | Purpose |
|---|---|
| `SITE_INDEXING_ENABLED` | Set to `true` only when ready for search engine indexing |
| `PREVIEW_MODE` | Set to `true` only for QA/preview builds |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for Edge Functions (auto-configured by Supabase) |
| `SUPABASE_DB_URL` | Database connection string (auto-configured) |

### EDGE FUNCTION SECRET (configured in Supabase, not Netlify)

| Secret | Purpose |
|---|---|
| `SUPABASE_URL` | Auto-configured by Supabase runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-configured by Supabase runtime |
| Email provider API key | To be configured when email provider is selected |
| Email sender address | To be configured |
| Email sender domain | To be configured |

---

## 5. Email Delivery Requirements

### Current state: MANUAL / TEST DELIVERY ONLY

No production email provider is configured. Test investor invitations use a DEV manual delivery path (one-time activation URL returned in the API response for admin to share manually).

### Lifecycle events requiring production email:

| Event | Recipient | Content |
|---|---|---|
| Investor approval/activation | Investor | Activation link (48h expiry) |
| Direct invitation | Investor | Activation link (48h expiry) |
| Re-invitation | Investor | Fresh activation link (48h expiry) |
| Admin passphrase reset | Admin | Reset link (48h expiry) |

### Production requirements:

1. Select and configure email provider (e.g., Resend, SendGrid, AWS SES)
2. Configure sender identity and domain
3. Set up SPF record for sender domain
4. Set up DKIM signing for sender domain
5. Set up DMARC policy for sender domain
6. Configure Edge Function email secrets in Supabase
7. Implement email sending in `drm-admin` send-invite/resend-invite and `drm-admin-reset`
8. Remove DEV manual delivery path for production (or gate behind `is_test_investor`)

---

## 6. Founder Super Admin Action

**Required:** Founder must personally set/confirm final Super Admin passphrase via the hosted reset flow after the frontend is published and reachable.

**Process:**
1. After deployment, navigate to `/investor-admin/reset-passphrase`
2. Enter bootstrap secret (known to founder) and admin email (`sukesh@nexfrontierlogic.nz`)
3. Receive reset link (48h expiry)
4. Set a strong passphrase (min 12 chars, weak passphrases rejected)
5. All existing admin sessions are invalidated on reset

**If reset token expires before use:** Re-issue via the same flow. The bootstrap secret is still configured and the `drm-admin-reset` Edge Function remains operational.

**Do NOT set the passphrase on behalf of the founder.**

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

**Provenance distinction:**
- `approved_awaiting_activation` = investor approached NexFrontier via public request
- `invited_awaiting_activation` = NexFrontier/admin initiated the relationship directly
- Both activate identically to `active`
- Fresh-token issuance preserves the origin state (does not convert between the two)

---

## 8. Token Security

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
| Legally approved | No — clearly marked "PLACEHOLDER — NOT LEGALLY APPROVED" |
| Founder decision | Keep placeholder for current launch planning |
| Non-test investor issuance | Blocked while placeholder is current (code gate in send-invite and resend-invite) |
| Test investor path | Allowed via `is_test_investor = true` |
| NDA versioning | Supported — `nda_versions` table with `is_current` flag |
| Acceptance | Per-version — `nda_acceptances` table linked to specific `nda_version_id` |
| Re-acceptance | Required when current NDA version changes (old acceptance doesn't match new version ID) |
| Body hash | SHA-256 of exact NDA body text stored per acceptance |
| Audit fields | `full_legal_name`, `company`, `title_role`, `user_agent`, `nda_body_hash`, `investor_email`, `acceptance_statement_version` |
| Acceptance statement version | `investor-nda-acceptance-v1` |
| IP capture | No — intentionally not captured |

---

## 10. Data Room Content

| Property | Value |
|---|---|
| Total topic route shells | 13 (static export generates empty shells for each) |
| Current status | All 13 topics `inactive` with `current_published_version_id = null` |
| Six approved core drafts | Stored in database as draft versions — NOT published |
| Runtime delivery | `drm-content` Edge Function returns content only for `status = 'published'` AND non-null `current_published_version_id` |
| Inactive topics | Invisible to investors — `list-topics` returns empty array |
| Publication | Requires explicit founder approval; six core pages intended to publish together |

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

## 11. Edge Function Inventory

15 Edge Functions currently deployed:

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
| `drm-storage-cleanup` | false | Storage cleanup utility | Admin/utility |
| `drm-bucket-delete` | false | Storage bucket deletion utility | Admin/utility |

---

## 12. Storage

| Property | Value |
|---|---|
| Public downloads bucket | Removed — no public buckets exist |
| Private investor material storage | No public storage URLs used |
| QA ZIP | None |
| Future investor documents | Must use authenticated/controlled delivery, never public storage URLs |
| Storage policies | `add_downloads_bucket_policies` migration exists but bucket was removed |

---

## 13. Robots / Sitemap

### Fail-closed logic:

| Condition | robots.txt | sitemap.xml |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` not set | `Disallow: /` | Empty (`[]`) |
| `SITE_INDEXING_ENABLED` not `true` | `Disallow: /` | Empty (`[]`) |
| Both set | `Allow: /` | Full sitemap with published routes only |

**Private routes** (investor-data-room, investor-admin) are always excluded from sitemap regardless of indexing flag.

### Production requirements:
1. Set `NEXT_PUBLIC_SITE_URL` to canonical production domain
2. Set `SITE_INDEXING_ENABLED=true` only when ready for indexing (typically after launch verification)

---

## 14. Public Forms

### Market Enquiry

| Property | Value |
|---|---|
| Edge Function | `market-enquiry` (verify_jwt: true) |
| Table | `market_enquiries` |
| Validation | Server-side: name, email, organisation, enquiry required |
| Error handling | Generic errors, no stack traces |
| Email notification | Not configured (no email provider) |

### Leadership Pulse

| Property | Value |
|---|---|
| Edge Function | `leadership-pulse` (verify_jwt: true) |
| Table | `leadership_pulse_responses` |
| Validation | Server-side: name, email, role, responses required |
| Persistence | Supabase table |
| Error handling | Generic errors, no stack traces |
| Email notification | Not configured |

---

## 15. Security Controls

| Control | Status |
|---|---|
| Public/private route separation | Static export generates shells; private content only via runtime Edge Function |
| Runtime Data Room gate | `drm-content` checks: session → active → NDA → published → permission |
| NDA gate | `drm-content` and `drm-nda` both check acceptance against current NDA version ID |
| Lifecycle status checks | Every protected request re-checks investor `status` at request time |
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

## 16. Known Accepted Non-Blockers

These are accepted as not blocking launch:

| Item | Classification |
|---|---|
| No branded og:image | Post-launch enhancement |
| Enhanced social share-card system | Post-launch enhancement |
| Enhanced admin analytics dashboard | Post-launch enhancement |

---

## 17. Final Production Runbook

### Ordered launch sequence:

1. **Confirm production domain** — ensure `NEXT_PUBLIC_SITE_URL` value is agreed
2. **Set Netlify production env vars** — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_INDEXING_ENABLED` (leave unset or `false` initially)
3. **Configure email provider** — select provider, set API key as Edge Function secret in Supabase
4. **Configure SPF** — DNS TXT record for sender domain
5. **Configure DKIM** — DNS TXT/CNAME record for provider's signing key
6. **Configure DMARC** — DNS TXT record with policy (start with `p=none`, escalate to `p=quarantine` after verification)
7. **Configure Edge Function email secrets** — set in Supabase project settings
8. **Deploy site** — push to Netlify production branch
9. **Verify redirects** — `/investor` → `/investor-proof` (301), `/market-evidence` → `/hyper-accelerating-markets` (301)
10. **Verify robots/sitemap** — should be `Disallow: /` and empty sitemap (indexing not yet enabled)
11. **Founder sets final Super Admin passphrase** — via `/investor-admin/reset-passphrase` using bootstrap secret
12. **Run hosted admin login/reset QA** — verify admin can log in, view dashboard, manage investors
13. **Run hosted investor lifecycle QA** — request → approve → activate → login → NDA → Data Room gate
14. **Verify forms** — Market Enquiry and Leadership Pulse submit and persist correctly
15. **Verify mobile/desktop public pages** — responsive layout, no broken images
16. **Verify no static private leakage** — check page source for Data Room content
17. **Verify storage privacy** — no public buckets, no public storage URLs
18. **Founder explicitly approves publication of six core Data Room pages**
19. **Publish six core pages together** — via `drm-content-admin` Edge Function, set `status = 'published'` and publish draft versions
20. **Re-run investor Data Room QA** — verify published topics visible to authenticated investors with NDA accepted
21. **Enable `SITE_INDEXING_ENABLED=true`** — in Netlify env vars, trigger redeploy
22. **Verify final sitemap/robots/canonicals** — on production domain, confirm correct URLs
23. **Final founder acceptance** — founder confirms site is ready
24. **Launch** — announce, share, monitor

---

## 18. Rollback / Failure Plan

| Failure scenario | Safe rollback action |
|---|---|
| Public deployment issue | Redeploy previous build via Netlify; static export is stateless |
| Form failure (Market Enquiry / Leadership Pulse) | Check Supabase Edge Function logs; form submissions are non-critical and can be temporarily disabled |
| Investor login failure | Check `drm-login` Edge Function logs; verify Supabase is reachable; check for expired sessions |
| Edge Function failure | Check Supabase function logs; redeploy functions via `deploy_edge_functions`; Edge Functions are independent of static site |
| Email delivery failure | Revert to manual/test delivery path (set `isTestInvestor = true` for affected investors); do not send production emails until provider is verified |
| Data Room publication error | Unpublish affected pages via `drm-content-admin` (set `status = 'inactive'`); published versions remain in version history |
| Indexing accidentally enabled too early | Set `SITE_INDEXING_ENABLED=false` in Netlify env vars, trigger redeploy; search engines will re-crawl and respect updated robots.txt |

---

## 19. Founder Actions

1. Personally set/confirm final Super Admin passphrase via hosted reset flow (`/investor-admin/reset-passphrase`)
2. Explicitly approve publication of six core Data Room pages (when ready)
3. Confirm final launch timing

---

## 20. NM Actions

1. Configure production email provider (provider, sender domain, API key)
2. Set up SPF record for sender domain
3. Set up DKIM for sender domain
4. Set up DMARC policy for sender domain
5. Configure Supabase Edge Function email secrets
6. Set Netlify production environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
7. Production deployment via Netlify
8. Hosted end-to-end regression QA
9. Document placeholder NDA technical gating/versioning behavior in operations runbook (non-test investor issuance blocked while `v1-PLACEHOLDER` is current; test investors use QA/manual path)
10. Set `SITE_INDEXING_ENABLED=true` only after launch verification is complete

---

## 21. Post-Launch Enhancements

1. Branded OG image / social share-card system
2. Enhanced admin analytics dashboard

---

*End of production handoff package.*
