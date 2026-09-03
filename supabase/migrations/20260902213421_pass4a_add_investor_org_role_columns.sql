-- Add organisation and role columns to drm_investors
-- These are used by the admin invite flow but were missing from the original schema
ALTER TABLE drm_investors ADD COLUMN IF NOT EXISTS organisation text;
ALTER TABLE drm_investors ADD COLUMN IF NOT EXISTS role text;
