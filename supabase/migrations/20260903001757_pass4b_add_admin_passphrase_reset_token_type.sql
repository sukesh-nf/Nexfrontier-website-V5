-- Allow admin_passphrase_reset token type in the check constraint
ALTER TABLE drm_access_tokens DROP CONSTRAINT IF EXISTS chk_token_ownership;

ALTER TABLE drm_access_tokens ADD CONSTRAINT chk_token_ownership
CHECK (
  (
    (token_type IN ('admin_session', 'admin_activation', 'admin_passphrase_reset'))
    AND admin_id IS NOT NULL
    AND investor_id IS NULL
  )
  OR
  (
    (token_type IN ('session', 'invitation', 're-invitation'))
    AND investor_id IS NOT NULL
    AND admin_id IS NULL
  )
);
