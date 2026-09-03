/*
# NDA versioning and acceptance infrastructure

1. Purpose
- Supports the investor Data Room NDA gate: approved investors must accept the
  current NexFrontier Investor NDA before accessing private materials.
- NDA is versioned. If the current version changes, investors must re-accept
  before private access resumes. Investors who already accepted the current
  version are not prompted again.

2. New Tables
- `nda_versions`
  - `id` (uuid, primary key)
  - `version` (text, unique) — human-readable version identifier, e.g. "v1"
  - `body_text` (text) — full NDA text shown on the acceptance page
  - `is_current` (boolean, default false) — exactly one row should be true
  - `created_at` (timestamptz, default now())
- `nda_acceptances`
  - `id` (uuid, primary key)
  - `investor_id` (uuid, references drm_investors on delete cascade)
  - `nda_version_id` (uuid, references nda_versions on delete restrict)
  - `full_legal_name` (text, not null)
  - `company` (text, not null)
  - `title_role` (text, not null)
  - `nda_version` (text, not null) — denormalised snapshot of the version string
  - `accepted_at` (timestamptz, default now())
  - `acceptance_status` (text, default 'accepted')
  - `user_agent` (text, nullable) — request metadata if available
  - Unique constraint on (investor_id, nda_version_id) so an investor can accept
    each version at most once.

3. Security
- RLS enabled on both tables.
- No policies for anon/authenticated: all access goes through edge functions
  using the service role key, which bypasses RLS. This matches the pattern
  already used for all other data room tables.
- Grants revoked from anon and authenticated roles.

4. Seed Data
- Inserts a single current NDA version "v1" with placeholder body text that
  should be replaced with the real NexFrontier Investor NDA text.
*/

CREATE TABLE IF NOT EXISTS public.nda_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text UNIQUE NOT NULL,
  body_text text NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.nda_versions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.nda_versions FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.nda_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES public.drm_investors(id) ON DELETE CASCADE,
  nda_version_id uuid NOT NULL REFERENCES public.nda_versions(id) ON DELETE RESTRICT,
  full_legal_name text NOT NULL,
  company text NOT NULL,
  title_role text NOT NULL,
  nda_version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  acceptance_status text NOT NULL DEFAULT 'accepted',
  user_agent text,
  CONSTRAINT nda_acceptances_investor_version_unique UNIQUE (investor_id, nda_version_id)
);

ALTER TABLE public.nda_acceptances ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.nda_acceptances FROM anon, authenticated;

-- Seed the initial current NDA version
INSERT INTO public.nda_versions (version, body_text, is_current)
SELECT 'v1', $BODY$
NEXFRONTIER INVESTOR NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between NexFrontier ("Company") and the individual or entity accepting this Agreement ("Recipient").

1. CONFIDENTIAL INFORMATION. The Company may disclose certain confidential and proprietary information, including but not limited to business plans, financial information, product information, technical information, customer information, market analysis, and other materials related to the Company's business ("Confidential Information").

2. OBLIGATIONS. The Recipient agrees to: (a) hold the Confidential Information in strict confidence; (b) not disclose or distribute the Confidential Information to any third party without prior written consent; (c) use the Confidential Information solely for the purpose of evaluating a potential investment in the Company; (d) not copy or reproduce the Confidential Information except as necessary for the evaluation purpose.

3. EXCLUSIONS. The obligations in this Agreement do not apply to information that: (a) is or becomes publicly available through no fault of the Recipient; (b) was known to the Recipient prior to disclosure; (c) is independently developed by the Recipient without use of the Confidential Information; (d) is rightfully received from a third party without a duty of confidentiality.

4. TERM. This Agreement shall remain in effect for a period of three (3) years from the date of acceptance.

5. RETURN OF MATERIALS. Upon request, the Recipient shall return or destroy all Confidential Information received from the Company.

6. GOVERNING LAW. This Agreement shall be governed by the laws of Malaysia.

7. ENTIRE AGREEMENT. This Agreement constitutes the entire agreement between the parties regarding the subject matter herein and supersedes all prior agreements and understandings.

By accepting this Agreement electronically, the Recipient acknowledges that they have read, understood, and agree to be bound by its terms.
$BODY$, true
ON CONFLICT (version) DO NOTHING;

-- Ensure only one current version exists
DO $$
DECLARE
  current_count int;
BEGIN
  SELECT count(*) INTO current_count FROM public.nda_versions WHERE is_current = true;
  IF current_count = 0 THEN
    UPDATE public.nda_versions SET is_current = true WHERE version = 'v1';
  END IF;
END $$;
