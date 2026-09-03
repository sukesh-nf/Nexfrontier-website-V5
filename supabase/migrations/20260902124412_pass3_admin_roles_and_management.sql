/*
# Pass 3: Admin Roles, Permission Model, Admin Management

## Purpose
1. Add role, status, audit columns to drm_admins
2. Add admin activation token type (separate from investor tokens)
3. Add admin_notes table for internal admin notes
4. Bootstrap existing admins to super_admin role

## 1. drm_admins — new columns
- role (text, default 'super_admin'): 'super_admin' | 'investor_admin' | 'content_admin'
- admin_status (text, default 'active'): 'invited' | 'active' | 'suspended' | 'removed'
  (preserves existing is_active column for backward compatibility — trigger syncs)
- created_by (uuid, FK drm_admins): who created this admin
- activated_at (timestamptz): when admin activated their account
- last_login_at (timestamptz): last successful login
- suspended_at (timestamptz): when suspended
- suspended_by (uuid, FK drm_admins): who suspended
- removed_at (timestamptz): when removed (soft delete)
- removed_by (uuid, FK drm_admins): who removed

## 2. DB Trigger: sync is_active from admin_status
- AFTER INSERT or UPDATE on drm_admins
- If admin_status is 'active', set is_active = true; otherwise false
- This preserves backward compatibility with existing session checks

## 3. Admin activation tokens
- Uses existing drm_access_tokens table with token_type = 'admin_activation'
- 48-hour expiry, single-use, SHA-256 hashed
- Completely separate from investor tokens (different token_type, different handler)

## 4. drm_admin_notes table
- Internal notes on admin records
- id, admin_id (target), admin_id_author, note_text, created_at
- RLS enabled, no policies (service role only)

## 5. Bootstrap
- All existing admins get role = 'super_admin', admin_status = 'active'
- is_active remains true for existing admins

## Security
- All new tables have RLS enabled
- No anon/authenticated access
*/

-- 1. Add columns to drm_admins
DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN role text DEFAULT 'super_admin';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN admin_status text DEFAULT 'active';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN created_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN activated_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN last_login_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN suspended_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN suspended_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN removed_at timestamptz;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE drm_admins ADD COLUMN removed_by uuid REFERENCES drm_admins(id);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 2. DB Trigger: sync is_active from admin_status
CREATE OR REPLACE FUNCTION sync_admin_is_active()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admin_status = 'active' THEN
    NEW.is_active := true;
  ELSE
    NEW.is_active := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_admin_is_active ON drm_admins;
CREATE TRIGGER trg_sync_admin_is_active
  BEFORE INSERT OR UPDATE ON drm_admins
  FOR EACH ROW
  EXECUTE FUNCTION sync_admin_is_active();

-- 3. Bootstrap existing admins
UPDATE drm_admins SET role = 'super_admin', admin_status = 'active' WHERE role IS NULL OR admin_status IS NULL;

-- 4. drm_admin_notes table
CREATE TABLE IF NOT EXISTS drm_admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  author_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  note_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE drm_admin_notes ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_admin_notes_admin_id ON drm_admin_notes(admin_id);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_drm_admins_role ON drm_admins(role);
CREATE INDEX IF NOT EXISTS idx_drm_admins_admin_status ON drm_admins(admin_status);
CREATE INDEX IF NOT EXISTS idx_drm_access_tokens_admin_activation ON drm_access_tokens(token_type) WHERE token_type = 'admin_activation';
