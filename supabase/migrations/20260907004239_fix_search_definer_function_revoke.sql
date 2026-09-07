-- The previous REVOKE FROM anon, authenticated had no effect: Postgres grants
-- EXECUTE to PUBLIC by default on function creation, and anon/authenticated
-- inherit through PUBLIC, not a direct grant. Revoking from PUBLIC is what's
-- actually required to close this off.
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_super_admin(text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_admin_is_active() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_investor_status_from_lifecycle() FROM PUBLIC;
