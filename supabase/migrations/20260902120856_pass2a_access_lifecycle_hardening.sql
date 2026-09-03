/*
# Pass 2A: Access Lifecycle Hardening

## Purpose
1. Add `is_test_investor` flag to drm_investors for dev/test records
2. Add DB trigger to synchronise legacy `status` from `lifecycle_status` so both fields cannot drift
3. Add `drm_request_rate_limit` table for server-side public request abuse protection
4. Add `drm_activation_log` table for atomic activation recovery tracking

## 1. drm_investors — new column
- `is_test_investor` (boolean, default false): explicitly marks a record as test/development.
  Only admin can set this. Public request form cannot set it.

## 2. DB Trigger: sync_status_from_lifecycle
- AFTER INSERT or UPDATE on drm_investors
- If lifecycle_status is not null and differs from status, set status = lifecycle_status
- This ensures the legacy `status` field always mirrors `lifecycle_status`
- Application code can use either field; the trigger prevents drift

## 3. drm_request_rate_limit table
- Tracks public request submissions by email hash for rate limiting
- `id` (uuid PK)
- `email_hash` (text): SHA-256 hash of email (not the raw email)
- `created_at` (timestamptz)
- RLS enabled, no policies (service role only)

## 4. drm_activation_log table
- Tracks activation attempts for recovery if session creation fails after token consumption
- `id` (uuid PK)
- `investor_id` (uuid FK)
- `token_id` (uuid): the token that was consumed
- `activation_started_at` (timestamptz)
- `activation_completed_at` (timestamptz, nullable)
- `status` (text): 'started', 'completed', 'failed'
- RLS enabled, no policies (service role only)

## Security
- All new tables have RLS enabled, no anon access
- The trigger runs with SECURITY DEFINER to update the row regardless of caller
*/

-- 1. Add is_test_investor column
DO $$ BEGIN
  ALTER TABLE drm_investors ADD COLUMN is_test_investor boolean DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 2. DB Trigger: sync legacy status from lifecycle_status
CREATE OR REPLACE FUNCTION sync_investor_status_from_lifecycle()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lifecycle_status IS NOT NULL AND NEW.lifecycle_status IS DISTINCT FROM NEW.status THEN
    NEW.status := NEW.lifecycle_status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_investor_status ON drm_investors;
CREATE TRIGGER trg_sync_investor_status
  BEFORE INSERT OR UPDATE ON drm_investors
  FOR EACH ROW
  EXECUTE FUNCTION sync_investor_status_from_lifecycle();

-- 3. drm_request_rate_limit table
CREATE TABLE IF NOT EXISTS drm_request_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE drm_request_rate_limit ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_request_rate_email_hash ON drm_request_rate_limit(email_hash);
CREATE INDEX IF NOT EXISTS idx_request_rate_created_at ON drm_request_rate_limit(created_at);

-- 4. drm_activation_log table
CREATE TABLE IF NOT EXISTS drm_activation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES drm_investors(id) ON DELETE SET NULL,
  token_id uuid,
  activation_started_at timestamptz DEFAULT now(),
  activation_completed_at timestamptz,
  status text DEFAULT 'started'
);
ALTER TABLE drm_activation_log ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_activation_log_investor ON drm_activation_log(investor_id);
CREATE INDEX IF NOT EXISTS idx_activation_log_status ON drm_activation_log(status);
