-- F3: investor access requests are submitted through the drm-request edge function
-- (service role), which validates input and fixes source/status. The direct anon
-- INSERT path allowed attacker-chosen status and investor_id values.
DROP POLICY IF EXISTS "anon_insert_investor_requests" ON public.drm_investor_requests;
