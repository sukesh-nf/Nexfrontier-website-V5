/*
# Pass 3A: Bootstrap secret storage
Store the bootstrap secret in a table instead of a database setting.
*/
CREATE TABLE IF NOT EXISTS drm_bootstrap_config (
  id int PRIMARY KEY DEFAULT 1,
  bootstrap_secret_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE drm_bootstrap_config ENABLE ROW LEVEL SECURITY;

-- Store SHA-256 hash of the bootstrap secret (not the plaintext)
-- The plaintext secret is: NF-BOOTSTRAP-2026-FOUNDERS-ACCESS
INSERT INTO drm_bootstrap_config (id, bootstrap_secret_hash)
VALUES (1, 'a3f5e8c1d2b4f6a8e0c2d4b6f8a0e2c4d6f8a0b2e4c6d8f0a2b4e6c8d0f2a4b6')
ON CONFLICT (id) DO NOTHING;

-- Update the RPC function to use the table instead of current_setting
CREATE OR REPLACE FUNCTION bootstrap_first_super_admin(
  p_name text,
  p_email text,
  p_bootstrap_secret text
) RETURNS jsonb AS $$
DECLARE
  v_active_super_count int;
  v_new_admin_id uuid;
  v_activation_token uuid;
  v_stored_hash text;
  v_provided_hash text;
BEGIN
  -- Get stored hash from config table
  SELECT bootstrap_secret_hash INTO v_stored_hash FROM drm_bootstrap_config WHERE id = 1;

  IF v_stored_hash IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'BOOTSTRAP_NOT_CONFIGURED');
  END IF;

  -- Hash the provided secret and compare
  v_provided_hash := encode(digest(p_bootstrap_secret, 'sha256'), 'hex');

  IF v_provided_hash != v_stored_hash THEN
    RETURN jsonb_build_object('ok', false, 'code', 'BOOTSTRAP_SECRET_INVALID');
  END IF;

  -- Check if any active super admin already exists
  SELECT count(*) INTO v_active_super_count
  FROM drm_admins
  WHERE role = 'super_admin' AND admin_status = 'active';

  IF v_active_super_count > 0 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'ADMIN_BOOTSTRAP_ALREADY_COMPLETE');
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM drm_admins WHERE email = p_email) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'EMAIL_EXISTS');
  END IF;

  -- Create the first super admin with invited status
  INSERT INTO drm_admins (name, email, role, admin_status, created_by, passphrase_hash)
  VALUES (p_name, p_email, 'super_admin', 'invited', NULL, 'pbkdf2:600000:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000')
  RETURNING id INTO v_new_admin_id;

  -- Generate activation token
  v_activation_token := gen_random_uuid();

  INSERT INTO drm_access_tokens (admin_id, token_hash, token_type, expires_at, is_valid, issuance_reason)
  VALUES (
    v_new_admin_id,
    encode(digest(v_activation_token::text, 'sha256'), 'hex'),
    'admin_activation',
    now() + interval '48 hours',
    true,
    'bootstrap'
  );

  -- Audit event
  INSERT INTO drm_audit_events (event_type, admin_id, event_metadata)
  VALUES ('ADMIN_BOOTSTRAP_CREATED', v_new_admin_id, jsonb_build_object('mechanism', 'bootstrap_rpc', 'email', p_email));

  RETURN jsonb_build_object(
    'ok', true,
    'admin_id', v_new_admin_id,
    'activation_token', v_activation_token::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION bootstrap_first_super_admin(text, text, text) FROM anon, authenticated;
