-- Second-factor OTP codes for investor return-visitor login.
-- Admin login is explicitly out of scope — passphrase only, unchanged.

CREATE TABLE IF NOT EXISTS drm_login_otp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES drm_investors(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drm_login_otp_investor_id ON drm_login_otp (investor_id);

ALTER TABLE drm_login_otp ENABLE ROW LEVEL SECURITY;

-- Deliberately zero policies. This table is only ever read or written from
-- inside the drm-login Edge Function using the service-role key, which
-- bypasses RLS entirely. With RLS enabled and no policies defined, PostgREST
-- denies every request from the anon and authenticated roles outright — the
-- codes are never reachable via the public API, unlike the equivalent table
-- on the legacy site where an open SELECT policy made OTP codes readable
-- with just the public anon key.
