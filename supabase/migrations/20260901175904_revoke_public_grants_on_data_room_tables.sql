-- F1: all access to these tables goes through edge functions using the service role.
-- The anon/authenticated roles need no table privileges at all; revoking them removes
-- the reliance on "RLS enabled with no policies" as the only barrier.
REVOKE ALL ON TABLE public.drm_investors FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_admins FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_access_tokens FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_activity_log FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_analytics_events FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_documents FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_folders FROM anon, authenticated;
REVOKE ALL ON TABLE public.drm_investor_requests FROM anon, authenticated;
REVOKE ALL ON TABLE public.market_enquiries FROM anon, authenticated;
REVOKE ALL ON TABLE public.leadership_pulse_responses FROM anon, authenticated;

-- Pin the trigger function's search_path.
ALTER FUNCTION public.drm_sync_access_level() SET search_path = public, pg_temp;
