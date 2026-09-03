/*
# Create public_stat_source_provenance table

1. Purpose
   Stores source provenance for public investor-facing statistics displayed on the website.
   Each row documents the original source, verification status, and production wording for a single statistic.

2. New Tables
- `public_stat_source_provenance`
  - `id` (uuid, primary key)
  - `stat_id` (text, unique identifier e.g. 'stat-76pct-ceos-ai')
  - `displayed_value` (text, e.g. '76%')
  - `production_wording` (text, the exact sentence shown on the public page)
  - `source_organisation` (text, e.g. 'Gartner')
  - `source_title` (text, report/article title)
  - `publication_date` (date)
  - `source_url` (text, URL to original source)
  - `date_verified` (date, when we verified this)
  - `verification_status` (text: 'EXACTLY_SUPPORTED' | 'FAIR_PARAPHRASE' | 'TOO_STRONG' | 'UNSUPPORTED')
  - `source_type` (text: 'PRIMARY' | 'SECONDARY')
  - `contextual_note` (text, short note about survey scope, geography, sample size, caveats)
  - `created_at` (timestamptz)

3. Security
- RLS enabled. This is an internal provenance record, not public-facing.
- Only authenticated (admin) users can read. No anon access, no inserts/updates/deletes via API.
*/

CREATE TABLE IF NOT EXISTS public_stat_source_provenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_id text UNIQUE NOT NULL,
  displayed_value text NOT NULL,
  production_wording text NOT NULL,
  source_organisation text NOT NULL,
  source_title text NOT NULL,
  publication_date date,
  source_url text,
  date_verified date DEFAULT CURRENT_DATE,
  verification_status text NOT NULL CHECK (verification_status IN ('EXACTLY_SUPPORTED', 'FAIR_PARAPHRASE', 'TOO_STRONG', 'UNSUPPORTED')),
  source_type text NOT NULL CHECK (source_type IN ('PRIMARY', 'SECONDARY')),
  contextual_note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public_stat_source_provenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_provenance_authenticated" ON public_stat_source_provenance;
CREATE POLICY "select_provenance_authenticated" ON public_stat_source_provenance
  FOR SELECT TO authenticated USING (true);
