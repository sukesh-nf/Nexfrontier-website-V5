/*
# Investor Data Room — Schema Migration

## Purpose
Creates the complete database schema for the NexFrontier Investor Data Room.
This is a confidential, access-controlled area for qualified investors and strategic partners.

## New Tables

1. `drm_admins` — Admin accounts who manage the Data Room (approve investors, manage documents, view analytics)
   - `id` uuid PK
   - `name` text NOT NULL
   - `email` text UNIQUE NOT NULL
   - `passphrase_hash` text NOT NULL (bcrypt/argon2 hash, never stored in plaintext)
   - `is_active` boolean default true
   - `created_at` timestamptz default now()

2. `drm_investors` — Approved investors with Data Room access
   - `id` uuid PK
   - `name` text NOT NULL
   - `email` text UNIQUE NOT NULL
   - `phone` text (optional, captured during request)
   - `source` text (where the request originated: investor-brief-request, admin-invite)
   - `nda_signed` boolean default false (admin-controlled)
   - `access_level` int default 1 (1=Public only, 2=Public+NDA required; auto-derived from nda_signed)
   - `status` text default 'pending' (pending, invited, active, revoked)
   - `request_date` timestamptz (when they submitted a request)
   - `invite_date` timestamptz (when admin sent invitation)
   - `first_activation` timestamptz (when they first activated access)
   - `last_access` timestamptz (most recent login)
   - `created_at` timestamptz default now()

3. `drm_access_tokens` — Invitation/activation tokens
   - `id` uuid PK
   - `investor_id` uuid FK to drm_investors
   - `token_hash` text UNIQUE NOT NULL (SHA-256 hash of token; plaintext never stored)
   - `token_type` text default 'invitation' (invitation, re-invitation)
   - `expires_at` timestamptz NOT NULL (48 hours from issue)
   - `used_at` timestamptz (null until activated)
   - `is_valid` boolean default true (false after use or manual invalidation)
   - `created_at` timestamptz default now()

4. `drm_investor_requests` — Public request queue (Investor Brief requests)
   - `id` uuid PK
   - `name` text NOT NULL
   - `email` text NOT NULL
   - `phone` text (optional)
   - `organisation` text (optional)
   - `role` text (optional)
   - `message` text (optional)
   - `source` text default 'investor-brief-request'
   - `status` text default 'pending' (pending, invited, activated, declined)
   - `investor_id` uuid (FK to drm_investors, set when an investor record is created from this request)
   - `created_at` timestamptz default now()

5. `drm_folders` — Document folder structure
   - `id` uuid PK
   - `name` text NOT NULL
   - `display_order` int default 0
   - `created_at` timestamptz default now()

6. `drm_documents` — Linked Google Drive/Docs/Sheets document metadata
   - `id` uuid PK
   - `folder_id` uuid FK to drm_folders (nullable for root-level)
   - `name` text NOT NULL
   - `google_link` text NOT NULL (URL to Google Drive/Docs/Sheets)
   - `security_classification` text default 'public' (public, nda_required)
   - `display_order` int default 0
   - `is_investor_brief` boolean default false (marks the canonical Investor Brief)
   - `created_at` timestamptz default now()
   - `updated_at` timestamptz default now()

7. `drm_activity_log` — Audit trail of all Data Room activity
   - `id` uuid PK
   - `investor_id` uuid (FK to drm_investors, nullable for admin actions)
   - `admin_id` uuid (FK to drm_admins, nullable for investor actions)
   - `event_type` text NOT NULL (login, document_view, folder_access, download, nda_status_change, access_revoked, invitation_sent, invitation_activated, re_invitation_sent)
   - `event_detail` jsonb (flexible detail: document name, folder name, IP, etc.)
   - `created_at` timestamptz default now()

8. `drm_analytics_events` — Analytics tracking (document views, sessions, downloads)
   - `id` uuid PK
   - `investor_id` uuid FK to drm_investors
   - `event_type` text NOT NULL (session_start, document_view, download, folder_access)
   - `document_id` uuid (FK to drm_documents, nullable)
   - `folder_id` uuid (FK to drm_folders, nullable)
   - `session_id` text (groups events into a session)
   - `duration_seconds` int (for session duration tracking)
   - `created_at` timestamptz default now()

## Security
- RLS enabled on ALL tables.
- `drm_investor_requests`: INSERT allowed for anon (public request submission). SELECT/UPDATE/DELETE admin-only via service role (edge functions).
- `drm_investors`, `drm_access_tokens`, `drm_activity_log`, `drm_analytics_events`: No direct anon access — all operations through edge functions using service role.
- `drm_admins`: No direct anon access — admin auth through edge functions.
- `drm_folders`, `drm_documents`: No direct anon access — document links delivered only through authenticated edge function responses that check access level.

## Important Notes
1. The frontend never queries protected tables directly. All secure operations go through edge functions that use the service role key (server-side only).
2. Investor Brief requests are the only public write (INSERT on drm_investor_requests).
3. Token hashes are stored, not plaintext tokens. Tokens are generated server-side using crypto.randomUUID() + hashed with SHA-256.
4. The access_level is auto-maintained: nda_signed=true → level 2, nda_signed=false → level 1. A trigger enforces this.
5. Seven folders are seeded in the migration.
*/

-- ============================================================
-- 1. drm_admins
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  passphrase_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_admins ENABLE ROW LEVEL SECURITY;
-- No policies: admin access is exclusively through edge functions with service role key.

-- ============================================================
-- 2. drm_investors
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  source text,
  nda_signed boolean NOT NULL DEFAULT false,
  access_level int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  request_date timestamptz,
  invite_date timestamptz,
  first_activation timestamptz,
  last_access timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_investors ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions with service role key.

-- Trigger: auto-set access_level based on nda_signed
CREATE OR REPLACE FUNCTION drm_sync_access_level()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.nda_signed = true THEN
    NEW.access_level := 2;
  ELSE
    NEW.access_level := 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_drm_sync_access_level ON drm_investors;
CREATE TRIGGER trg_drm_sync_access_level
  BEFORE INSERT OR UPDATE OF nda_signed ON drm_investors
  FOR EACH ROW EXECUTE FUNCTION drm_sync_access_level();

-- ============================================================
-- 3. drm_access_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_access_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES drm_investors(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  token_type text NOT NULL DEFAULT 'invitation',
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  is_valid boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_access_tokens ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions.

-- ============================================================
-- 4. drm_investor_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_investor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organisation text,
  role text,
  message text,
  source text NOT NULL DEFAULT 'investor-brief-request',
  status text NOT NULL DEFAULT 'pending',
  investor_id uuid REFERENCES drm_investors(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_investor_requests ENABLE ROW LEVEL SECURITY;

-- Public can submit investor brief requests (INSERT only)
DROP POLICY IF EXISTS "anon_insert_investor_requests" ON drm_investor_requests;
CREATE POLICY "anon_insert_investor_requests"
  ON drm_investor_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — admin reads/manages through edge functions.

-- ============================================================
-- 5. drm_folders
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_folders ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions.

-- ============================================================
-- 6. drm_documents
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES drm_folders(id) ON DELETE SET NULL,
  name text NOT NULL,
  google_link text NOT NULL,
  security_classification text NOT NULL DEFAULT 'public',
  display_order int NOT NULL DEFAULT 0,
  is_investor_brief boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_documents ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions.

-- ============================================================
-- 7. drm_activity_log
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES drm_investors(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_activity_log ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions.

-- ============================================================
-- 8. drm_analytics_events
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES drm_investors(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  document_id uuid REFERENCES drm_documents(id) ON DELETE SET NULL,
  folder_id uuid REFERENCES drm_folders(id) ON DELETE SET NULL,
  session_id text,
  duration_seconds int,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_analytics_events ENABLE ROW LEVEL SECURITY;
-- No policies: all operations through edge functions.

-- ============================================================
-- Seed: Seven canonical folders
-- ============================================================
INSERT INTO drm_folders (name, display_order) VALUES
  ('START HERE: INVESTOR LENS', 1),
  ('INVESTOR OVERVIEW', 2),
  ('MARKET & COMPETITIVE POSITION', 3),
  ('PRODUCT & PROOF PATHWAY', 4),
  ('FINANCIAL & INVESTMENT CASE', 5),
  ('TEAM & EXECUTION', 6),
  ('CLOSING INVESTMENT CASE', 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Investor Brief placeholder document in first folder
-- ============================================================
INSERT INTO drm_documents (folder_id, name, google_link, security_classification, display_order, is_investor_brief)
SELECT f.id, 'Investor Brief', 'https://docs.google.com/document/d/PLACEHOLDER_INVESTOR_BRIEF', 'public', 1, true
FROM drm_folders f
WHERE f.name = 'START HERE: INVESTOR LENS'
  AND NOT EXISTS (SELECT 1 FROM drm_documents WHERE is_investor_brief = true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_drm_investors_email ON drm_investors(email);
CREATE INDEX IF NOT EXISTS idx_drm_investors_status ON drm_investors(status);
CREATE INDEX IF NOT EXISTS idx_drm_tokens_hash ON drm_access_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_drm_tokens_investor ON drm_access_tokens(investor_id);
CREATE INDEX IF NOT EXISTS idx_drm_requests_status ON drm_investor_requests(status);
CREATE INDEX IF NOT EXISTS idx_drm_docs_folder ON drm_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_drm_docs_classification ON drm_documents(security_classification);
CREATE INDEX IF NOT EXISTS idx_drm_activity_investor ON drm_activity_log(investor_id);
CREATE INDEX IF NOT EXISTS idx_drm_analytics_investor ON drm_analytics_events(investor_id);
CREATE INDEX IF NOT EXISTS idx_drm_analytics_type ON drm_analytics_events(event_type);
