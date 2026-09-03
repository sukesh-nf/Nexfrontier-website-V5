-- F2: enquiries are submitted through the market-enquiry edge function (service role),
-- which validates every field. The direct anon INSERT path bypassed all of it.
DROP POLICY IF EXISTS "anon_insert_market_enquiries" ON public.market_enquiries;
