-- bootstrap_first_super_admin is dead code: the real bootstrap flow goes through
-- the drm-admin-bootstrap Edge Function directly, never this RPC. Currently it is
-- callable by ANYONE with just the public anon key via /rest/v1/rpc/bootstrap_first_super_admin,
-- and since no super admin has activated yet, it could currently be used to create
-- a second, unauthorized pending super-admin record with only the bootstrap secret.
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_super_admin(text, text, text) FROM anon, authenticated;

-- These are BEFORE-trigger functions, never meant to be called directly.
-- Calling them via RPC would likely just error (no NEW/OLD context), but there's
-- no legitimate reason for anon/authenticated to reach them at all.
REVOKE EXECUTE ON FUNCTION public.sync_admin_is_active() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_investor_status_from_lifecycle() FROM anon, authenticated;

-- Pin search_path on all SECURITY DEFINER functions we own, closing the
-- search_path-hijacking class of attack.
ALTER FUNCTION public.bootstrap_first_super_admin(text, text, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_admin_is_active() SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_investor_status_from_lifecycle() SET search_path = public, pg_temp;
