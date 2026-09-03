/*
# Investor Lifecycle, Notes, Audit, and Token Issuance

## Purpose
Extends the existing investor access management system to support:
- Full lifecycle states (requested, approved_awaiting_activation, invited_awaiting_activation, active, suspended, revoked, declined)
- Suspension and reactivation
- Relationship owner assignment
- Internal notes (append-only, never investor-visible)
- Structured audit trail
- Activation token issuance metadata (issued_by, issuance_reason, invalidated_at)

## 1. drm_investors — new columns
- `lifecycle_status` (text): replaces the overloaded `status` for lifecycle tracking. Values: requested, approved_awaiting_activation, invited_awaiting_activation, active, suspended, revoked, declined. The existing `status` column is preserved for backward compatibility.
- `approved_at` (timestamptz): when admin approved the request
- `approved_by` (uuid, FK drm_admins): which admin approved
- `suspended_at` (timestamptz): when access was suspended
- `suspended_by` (uuid, FK drm_admins): which admin suspended
- `revoked_at` (timestamptz): when access was revoked
- `revoked_by` (uuid, FK drm_admins): which admin revoked
- `relationship_owner_id` (uuid, FK drm_admins): NF team member who owns this relationship

## 2. drm_access_tokens — new columns
- `issued_by` (uuid, FK drm_admins): admin who issued this token
- `issuance_reason` (text): why the token was issued (e.g. approval, direct_invitation, fresh_link)
- `invalidated_at` (timestamptz): when this token was explicitly invalidated (distinct from used_at)

## 3. New table: drm_internal_notes
- Append-only notes on investor/request records
- `id` (uuid PK)
- `investor_id` (uuid, FK drm_investors, nullable): linked investor
- `request_id` (uuid, FK drm_investor_requests, nullable): linked request
- `admin_id` (uuid, FK drm_admins): author
- `note_text` (text): the note content
- `created_at` (timestamptz): timestamp
- Notes are never returned in investor-facing APIs

## 4. New table: drm_audit_events
- Structured audit trail for all significant lifecycle and admin events
- `id` (uuid PK)
- `event_type` (text): e.g. REQUEST_SUBMITTED, REQUEST_APPROVED, REQUEST_DECLINED, INVITATION_CREATED, INVITATION_SENT, ACTIVATION_TOKEN_ISSUED, ACTIVATION_TOKEN_REISSUED, ACTIVATION_TOKEN_EXPIRED_ATTEMPT, INVESTOR_ACTIVATED, INVESTOR_SUSPENDED, INVESTOR_REACTIVATED, INVESTOR_REVOKED, LOGIN_SUCCESS, LOGIN_DENIED_STATUS, NDA_ACCEPTED
- `investor_id` (uuid, nullable): related investor
- `request_id` (uuid, nullable): related request
- `admin_id` (uuid, nullable): acting admin
- `event_metadata` (jsonb): non-secret contextual data
- `created_at` (timestamptz): timestamp

## 5. Security
- RLS enabled on new tables (deny by default — only service role accesses them via edge functions)
- No policies added — all access is through edge functions using service role key
- No anon/authenticated direct access to these tables

## Notes
- The existing `status` column on drm_investors is preserved. The new `lifecycle_status` column is the canonical lifecycle field going forward.
- Existing activation token logic (48-hour expiry, single-use) is preserved.
- No data migration of existing rows is performed — existing rows get NULL for new nullable columns, which is acceptable.
*/

-- ============================================================
-- 1. drm_investors: add lifecycle columns
-- ============================================================
DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN lifecycle_status text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN approved_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN approved_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN suspended_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN suspended_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN revoked_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN revoked_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN relationship_owner_id uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ============================================================
-- 2. drm_access_tokens: add issuance metadata
-- ============================================================
DO $$ BEGIN
  ALTER TABLE drm_access_tokens ADD COLUMN issued_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_access_tokens ADD COLUMN issuance_reason text;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_access_tokens ADD COLUMN invalidated_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ============================================================
-- 3. drm_internal_notes table
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_internal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES drm_investors(id) ON DELETE SET NULL,
  request_id uuid REFERENCES drm_investor_requests(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  note_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drm_internal_notes ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. drm_audit_events table
-- ============================================================
CREATE TABLE IF NOT EXISTS drm_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  investor_id uuid REFERENCES drm_investors(id) ON DELETE SET NULL,
  request_id uuid REFERENCES drm_investor_requests(id) ON DELETE SET NULL,
  admin_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  event_metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drm_audit_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_drm_investors_lifecycle_status ON drm_investors(lifecycle_status);
CREATE INDEX IF NOT EXISTS idx_drm_audit_events_event_type ON drm_audit_events(event_type);
CREATE INDEX IF NOT EXISTS idx_drm_audit_events_investor_id ON drm_audit_events(investor_id);
CREATE INDEX IF NOT EXISTS idx_drm_audit_events_created_at ON drm_audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drm_internal_notes_investor_id ON drm_internal_notes(investor_id);
CREATE INDEX IF NOT EXISTS idx_drm_access_tokens_investor_type ON drm_access_tokens(investor_id, token_type);
