/*
# Market Enquiries Table

## Purpose
Stores enquiries submitted through the public Market Enquiry form.
This replaces the removed /api/enquiry Route Handler, which was incompatible
 with static export (output: 'export'). The form now submits to a Supabase
 Edge Function that inserts into this table.

## New Tables
1. `market_enquiries`
   - `id` uuid PK
   - `name` text NOT NULL
   - `email` text NOT NULL
   - `organisation` text (optional, required for foundation-customer type)
   - `role` text (optional)
   - `enquiry_type` text NOT NULL (foundation-customer, investor, partnership, market-customer, other)
   - `revenue_range` text (optional)
   - `message` text (optional)
   - `website` text (optional)
   - `consent` boolean NOT NULL default false
   - `status` text NOT NULL default 'pending' (pending, contacted, closed)
   - `created_at` timestamptz default now()

## Security
- RLS enabled on `market_enquiries`.
- INSERT allowed for anon + authenticated (public form submission).
- No SELECT/UPDATE/DELETE for anon — all reads/management through edge functions using service role key.

## Important Notes
1. The frontend never reads from this table directly. All writes go through
   the `market-enquiry` edge function using the service role key.
2. The anon INSERT policy exists as a fallback; the edge function is the
   primary submission path and uses the service role key (bypasses RLS).
*/

CREATE TABLE IF NOT EXISTS market_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organisation text,
  role text,
  enquiry_type text NOT NULL,
  revenue_range text,
  message text,
  website text,
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE market_enquiries ENABLE ROW LEVEL SECURITY;

-- Public can submit enquiries (INSERT only)
DROP POLICY IF EXISTS "anon_insert_market_enquiries" ON market_enquiries;
CREATE POLICY "anon_insert_market_enquiries"
  ON market_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — management through edge functions.

CREATE INDEX IF NOT EXISTS idx_market_enquiries_status ON market_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_market_enquiries_type ON market_enquiries(enquiry_type);
CREATE INDEX IF NOT EXISTS idx_market_enquiries_created ON market_enquiries(created_at);
