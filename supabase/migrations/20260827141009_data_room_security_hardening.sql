/*
 * Data Room Security Hardening
 *
 * 1. Add passphrase_hash column to drm_investors for Return Visitor Login
 * 2. Add failed_attempt_count and locked_until for basic brute-force protection
 * 3. Add admin_id column to drm_access_tokens for proper admin session tracking
 * 4. Remove old 365-day session tokens (they will be replaced by short-lived sessions)
 */

-- Add passphrase_hash to investors (for Return Visitor Login)
ALTER TABLE drm_investors ADD COLUMN IF NOT EXISTS passphrase_hash text;

-- Add brute-force protection columns to investors
ALTER TABLE drm_investors ADD COLUMN IF NOT EXISTS failed_login_attempts int NOT NULL DEFAULT 0;
ALTER TABLE drm_investors ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Add brute-force protection columns to admins
ALTER TABLE drm_admins ADD COLUMN IF NOT EXISTS failed_login_attempts int NOT NULL DEFAULT 0;
ALTER TABLE drm_admins ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Add admin_id to access_tokens for proper admin session tracking
ALTER TABLE drm_access_tokens ADD COLUMN IF NOT EXISTS admin_id uuid REFERENCES drm_admins(id) ON DELETE SET NULL;

-- Invalidate all existing session tokens (old 365-day model)
UPDATE drm_access_tokens SET is_valid = false WHERE token_type = 'session';
