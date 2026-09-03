/*
# Create leadership_pulse_responses table

## Purpose
Stores responses from the public 3-question Leadership Pulse survey at /leadership-pulse.
This is market-belief evidence — not customer validation, willingness-to-pay, or proof of economic value.

## New Table: leadership_pulse_responses
- `id` (uuid, primary key, auto-generated)
- `created_at` (timestamptz, defaults to now)
- `q1_see` (smallint, 1–5) — Likert score for the SEE proposition
- `q2_understand` (smallint, 1–5) — Likert score for the UNDERSTAND proposition
- `q3_navigate` (smallint, 1–5) — Likert score for the NAVIGATE proposition
- `revenue_band` (text) — allowlisted revenue band enum value
- `role_category` (text) — allowlisted role category enum value
- `survey_version` (text) — always 'v1' for this question wording
- `source` (text) — allowlisted attribution source

## Constraints
- CHECK on q1_see, q2_understand, q3_navigate: value BETWEEN 1 AND 5
- CHECK on revenue_band: must be one of the allowlisted values
- CHECK on role_category: must be one of the allowlisted values
- CHECK on source: must be one of the allowlisted values
- CHECK on survey_version: must be 'v1'

## Security
- RLS enabled — no public SELECT, UPDATE, or DELETE policies.
- Only the service-role key (used by the Edge Function) can insert.
- Public submitters cannot read other responses, modify responses, or delete responses.
*/

CREATE TABLE IF NOT EXISTS leadership_pulse_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  q1_see smallint NOT NULL,
  q2_understand smallint NOT NULL,
  q3_navigate smallint NOT NULL,
  revenue_band text NOT NULL,
  role_category text NOT NULL,
  survey_version text NOT NULL DEFAULT 'v1',
  source text NOT NULL DEFAULT 'direct',
  CONSTRAINT q1_see_range CHECK (q1_see BETWEEN 1 AND 5),
  CONSTRAINT q2_understand_range CHECK (q2_understand BETWEEN 1 AND 5),
  CONSTRAINT q3_navigate_range CHECK (q3_navigate BETWEEN 1 AND 5),
  CONSTRAINT revenue_band_allowlist CHECK (revenue_band IN (
    'under_10m', '10m_50m', '50m_250m', '250m_1b', 'over_1b', 'prefer_not_to_say'
  )),
  CONSTRAINT role_category_allowlist CHECK (role_category IN (
    'ceo_md', 'founder_owner', 'board', 'finance', 'operations', 'strategy',
    'technology', 'marketing_customer_commercial', 'gm_business_unit',
    'transformation_innovation', 'investor_portfolio', 'other_senior_leader',
    'advisor_consultant', 'other'
  )),
  CONSTRAINT source_allowlist CHECK (source IN (
    'email', 'linkedin', 'website_prompt', 'the_shift', 'intelligence',
    'about', 'direct', 'other'
  )),
  CONSTRAINT survey_version_v1 CHECK (survey_version = 'v1')
);

ALTER TABLE leadership_pulse_responses ENABLE ROW LEVEL SECURITY;

-- No public SELECT, UPDATE, or DELETE policies.
-- Only the service-role key (Edge Function) can INSERT.
-- RLS blocks all anon/authenticated access by default.
