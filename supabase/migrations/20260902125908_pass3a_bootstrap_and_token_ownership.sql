/*
# Pass 3A: First Super Admin Bootstrap + Token Ownership Hardening

## 1. Token ownership constraint
Add a CHECK constraint ensuring admin tokens use admin_id (not investor_id)
and investor tokens use investor_id (not admin_id).

## 2. Bootstrap RPC function
A SECURITY DEFINER function that creates the first super_admin if none exists.
Self-disables once an active super_admin exists.
Uses a bootstrap secret passed as parameter (verified against env var by the edge function).

## 3. Relationship owner orphan flagging
No schema change needed — the admin UI will flag investors whose relationship_owner_id
points to a suspended/removed admin.
*/

-- 1. Token ownership constraint
DO $$ BEGIN
  ALTER TABLE drm_access_tokens ADD CONSTRAINT chk_token_ownership
    CHECK (
      (token_type IN ('admin_session', 'admin_activation') AND admin_id IS NOT NULL AND investor_id IS NULL)
      OR
      (token_type IN ('session', 'invitation', 're-invitation') AND investor_id IS NOT NULL AND admin_id IS NULL)
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Bootstrap RPC function
CREATE OR REPLACE FUNCTION bootstrap_first_super_admin(
  p_name text,
  p_email text,
  p_bootstrap_secret text
) RETURNS jsonb AS $$
DECLARE
  v_active_super_count int;
  v_new_admin_id uuid;
  v_activation_token uuid;
  v_expected_secret text;
BEGIN
  -- Verify bootstrap secret against environment variable
  v_expected_secret := current_setting('app.bootstrap_secret', true);
  IF v_expected_secret IS NULL OR p_bootstrap_secret IS NULL OR p_bootstrap_secret != v_expected_secret THEN
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

-- Grant execute to service role only (no anon/authenticated)
REVOKE EXECUTE ON FUNCTION bootstrap_first_super_admin(text, text, text) FROM anon, authenticated;
