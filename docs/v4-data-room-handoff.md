# NexFrontier Investor Data Room — NM Production Handoff

## Canonical Route

- **Canonical Data Room route:** `/investor-data-room`
- **No public navigation link** to the Data Room. Access is via:
  - The `/investor` page "Request Investor Brief" CTA (enters the request queue)
  - Direct URL for returning/invited investors
  - Admin direct invitation

## Database / Schema

The Data Room uses 8 Supabase tables (all prefixed `drm_`):

| Table | Purpose |
|---|---|
| `drm_admins` | Admin accounts (name, email, passphrase_hash, is_active, failed_login_attempts, locked_until) |
| `drm_investors` | Approved investors (name, email, phone, nda_signed, access_level, status, passphrase_hash, failed_login_attempts, locked_until, dates) |
| `drm_access_tokens` | Invitation and session tokens (token_hash, token_type, expires_at, used_at, is_valid, admin_id) |
| `drm_investor_requests` | Public request queue from the Investor Brief request form |
| `drm_folders` | Document folder structure (7 seeded folders) |
| `drm_documents` | Linked Google Drive/Docs/Sheets document metadata |
| `drm_activity_log` | Audit trail of all Data Room events |
| `drm_analytics_events` | Analytics tracking (sessions, document views, downloads) |

All tables have RLS enabled. Only `drm_investor_requests` allows public INSERT (for request submission). All other operations go through edge functions using the service role key.

## Edge Functions Deployed

| Function | Purpose | verify_jwt |
|---|---|---|
| `drm-request` | Public: submit investor brief request | false |
| `drm-activate` | Public: activate access with invitation token + set passphrase | false |
| `drm-login` | Public: return visitor login (email + passphrase) | false |
| `drm-documents` | Authenticated: fetch documents filtered by access level (re-checked at request time) | false (uses Bearer session token) |
| `drm-admin` | Admin: all admin operations (login, manage investors, documents, folders, analytics, activity, admin accounts) | false (uses Bearer admin token) |

## Password Hashing Mechanism

**bcrypt** (via `npm:bcryptjs@2.4.3`) is used for all passphrase hashing — both admin and investor passphrases.

- Admin passphrases: hashed with bcrypt (work factor 10) when an admin is created
- Investor passphrases: hashed with bcrypt (work factor 10) during initial activation
- Return visitor login: passphrase verified using `bcryptCompare` against stored hash
- Admin login: passphrase verified using `bcryptCompare` against stored hash

**No raw SHA-256 is used for passphrase storage.** SHA-256 is only used for token hashing (invitation/session/admin tokens), which are random UUIDs and not human-chosen passwords.

## Environment Variables

All Supabase env vars are pre-populated (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). No additional env vars are required for the Data Room to function.

## Token Generation / Expiry

- **Invitation tokens:** Generated server-side using `crypto.randomUUID()`, stored as SHA-256 hashes. Valid for **48 hours** from issue. Single-use — consumed upon activation. After expiry, the token is invalidated and the investor must request access again or admin must re-send.
- **Investor session tokens:** Generated after activation or return login. Valid for **8 hours**. Short-lived. When expired, the investor must log in again via Return Visitor Login — they do NOT need a new invitation.
- **Admin session tokens:** Valid for **8 hours**.
- Token expiry is enforced server-side in the edge functions.

## Investor Activation Model

1. Admin sends invitation → 48-hour token generated
2. Investor enters token + chooses a passphrase on the Secure Access screen
3. Token is consumed (single-use), investor status becomes `active`
4. Investor's passphrase is hashed with bcrypt and stored
5. Short-lived session token (8 hours) issued
6. Investor becomes an **Active Investor** — eligibility persists until Admin revokes

**Active Investor eligibility is not time-limited.** The investor remains active until explicitly revoked by Admin. Session expiry does NOT remove Active Investor status.

## Return Visitor Login Model

- After initial activation, the investor uses **email + passphrase** to log in
- On successful login, a new short-lived session token (8 hours) is issued
- The passphrase is verified using bcrypt comparison against the stored hash
- Session expiry simply requires another login — no new invitation needed

## Session Duration

- **Investor sessions:** 8 hours
- **Admin sessions:** 8 hours
- Sessions are stored as SHA-256 hashed tokens in `drm_access_tokens`
- Session validity is checked on every request to `drm-documents`

## Revocation Behaviour

When Admin revokes an investor:
1. Investor `status` becomes `revoked`
2. ALL tokens for that investor (sessions, invitations, re-invitations) are invalidated
3. Return Visitor Login fails (status check)
4. Protected document access fails (status check in `drm-documents`)
5. Investor must be explicitly re-approved/re-invited before regaining access

All enforced server-side. The frontend does not rely on hiding — the edge functions reject requests from revoked investors.

## NDA / Access Level Revalidation

- **Level 1** (no NDA): Public documents only
- **Level 2** (NDA signed): Public + NDA-required documents
- A database trigger automatically sets `access_level` based on `nda_signed`
- **Document access checks current NDA status at request time** — the `drm-documents` edge function re-queries the investor's current `nda_signed` and `access_level` on every request, not the value cached at login
- If Admin removes NDA Signed, NDA-required documents immediately disappear from the investor's document list — even during an active session

## Admin Authentication

- Admin accounts stored in `drm_admins` with bcrypt-hashed passphrases
- Admin login uses `bcryptCompare` — no plaintext passphrases stored or logged
- Admin session tokens stored in `drm_access_tokens` with `admin_id` reference
- **URL query parameters cannot grant Admin Mode.** The `?admin=true` parameter (if used) only reveals the Admin Login screen — authentication is always required and is server-side
- Admin session expiry: 8 hours

## Abuse Protections

### Implemented in preview:
- **Generic failure responses:** Login failures return "Invalid email or passphrase" — does not disclose whether the email exists
- **Brute-force lockout:** After 5 failed login attempts, the account is locked for 15 minutes (applies to both investor and admin login)
- **No plaintext logging:** Passphrases and tokens are never logged in error messages or activity logs
- **No token hash exposure:** Token hashes are never returned in API responses — only the plaintext token is returned once at generation/activation time
- **Service-role secrets remain server-only:** The service role key is only used in edge functions, never in client-side code

### Requires NM production configuration:
- **Rate limiting:** The current implementation includes basic brute-force lockout (5 attempts / 15 min lock), but does not implement IP-based rate limiting. For production, NM should configure Supabase's built-in rate limiting or an external rate-limiting layer (e.g., Cloudflare, API gateway) to prevent distributed brute-force attacks.

## Google Drive / Docs / Sheets Linking

- Documents are stored as **linked metadata only** — the `google_link` column holds the URL to a Google Drive/Docs/Sheets resource
- No document content is stored in the website
- Admin can add, edit, and remove document links through the Documents tab
- The Investor Brief is marked with `is_investor_brief = true` and placed as the first document in the "START HERE: INVESTOR LENS" folder
- **To add the live Investor Brief Google Doc:** Admin logs in, goes to Documents tab, finds the "Investor Brief" placeholder document, clicks edit, and replaces the placeholder URL with the live Google Doc link

## Analytics / Event Logging

- Analytics events are logged in `drm_analytics_events`:
  - `session_start` — logged on investor login
  - `document_view` — logged when an investor opens a document
  - `folder_access` — logged when an investor opens a folder
  - `download` — (future: when download tracking is added)
- Activity log in `drm_activity_log` records:
  - `invitation_sent`, `invitation_activated`, `re_invitation_sent`
  - `login`, `document_view`, `folder_access`
  - `nda_status_change`, `access_revoked`
- All metrics come from real data. Empty states show 0 or "N/A" honestly. No fabricated numbers.

## Production Security Checks

Before launch, NM should verify:

1. **Noindex:** The `/investor-data-room` page has `robots: { index: false, follow: false }` in its metadata
2. **Sitemap exclusion:** The Data Room route is NOT in `pageRoutes` in `src/config/navigation.ts`
3. **Protected links:** NDA-required document links are NOT delivered to Level 1 investors — filtered server-side by `drm-documents`
4. **Admin secrets:** Admin passphrases are bcrypt-hashed server-side. No admin secrets in client-side code
5. **Token security:** Tokens are generated with `crypto.randomUUID()` and stored as SHA-256 hashes
6. **Access revocation:** Revocation invalidates all tokens and sets status to `revoked` — enforced server-side
7. **NDA revalidation:** Document access re-checks current NDA status on every request
8. **Cross-investor data isolation:** One investor cannot see another investor's data

## Production Smoke Tests

1. Submit an Investor Brief request from `/investor` → verify it appears in admin Request Queue
2. Admin sends invite → verify token is generated → activate with token + passphrase → verify Level 1 access
3. Admin marks NDA signed → verify investor elevated to Level 2 → verify NDA documents visible
4. Admin removes NDA → verify investor returns to Level 1 → verify NDA documents hidden immediately
5. Admin revokes investor → verify investor can no longer log in
6. Return visitor login with email + passphrase → verify session token works
7. Wait for session to expire (or clear sessionStorage) → verify return login works without new invitation
8. Admin toggles document classification Public → NDA required → verify Level 1 investors can no longer see it
9. Admin adds a new Google-linked document → verify it appears for investors
10. Verify `/investor-data-room` is not in sitemap.xml
11. Verify `/investor-data-room` returns noindex in HTTP headers
12. Attempt admin login with wrong passphrase 5 times → verify account locks for 15 minutes
13. Attempt investor login with wrong passphrase 5 times → verify account locks for 15 minutes

## Folder Structure (seeded)

1. START HERE: INVESTOR LENS (contains the Investor Brief placeholder)
2. INVESTOR OVERVIEW
3. MARKET & COMPETITIVE POSITION
4. PRODUCT & PROOF PATHWAY
5. FINANCIAL & INVESTMENT CASE
6. TEAM & EXECUTION
7. CLOSING INVESTMENT CASE

## What Works in Preview

- Full Secure Access screen (token entry + passphrase setup, request access, return visitor login with email + passphrase, admin login)
- Investor Data Room: Overview and Documents views with access-level filtering (re-checked at request time)
- Admin Data Room: Overview dashboard, Documents management, Analytics, Investor Management, Admin Access
- All database operations via edge functions
- bcrypt password hashing for admin and investor passphrases
- NDA toggle with automatic access level elevation (re-validated on every document request)
- Document classification toggle
- Invitation token generation with 48-hour expiry (single-use)
- Short-lived session tokens (8 hours) for both investor and admin
- Return visitor login with email + passphrase
- Access revocation (invalidates all tokens, blocks login and document access)
- Brute-force lockout (5 attempts / 15 min lock)
- Generic error responses (no account existence disclosure)
- Activity logging and analytics (real data, no fabrication)

## What Requires NM Production Configuration

1. **Email sending:** Invitation emails and request acknowledgements are not sent. NM must configure an email provider and add email sending to the `drm-admin` edge function.
2. **First admin account:** NM must insert the first admin record into `drm_admins`. The passphrase will be bcrypt-hashed by the `add-admin` edge function action, or NM can hash it directly:
   ```sql
   -- Option A: Use the edge function (recommended)
   -- Call drm-admin with action=add-admin and provide name, email, passphrase

   -- Option B: Insert directly (NM must hash the passphrase first)
   -- Use bcrypt with work factor 10 to hash the passphrase, then:
   INSERT INTO drm_admins (name, email, passphrase_hash)
   VALUES ('Admin Name', 'admin@nexfrontier.my', '<bcrypt_hash>');
   ```
3. **Rate limiting:** Basic brute-force lockout is implemented, but IP-based rate limiting requires production infrastructure (Supabase rate limits, Cloudflare, or API gateway).
4. **Live Investor Brief Google Doc:** NM must replace the placeholder URL with the live Google Doc link via the admin Documents tab.
5. **Production domain:** The Data Room URL will use the production canonical domain once configured.
6. **Google Drive sharing permissions:** NM must ensure Google Drive/Docs/Sheets links are shared with appropriate access.
