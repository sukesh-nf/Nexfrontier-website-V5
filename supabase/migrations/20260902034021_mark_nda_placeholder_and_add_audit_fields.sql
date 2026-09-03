/*
# Mark NDA v1 as placeholder + add audit fields to nda_acceptances

1. Purpose
- The current v1 NDA body text was generated during implementation and has not been
  legally approved by NexFrontier. It must be visibly marked as a placeholder so no
  investor mistakes it for the operative legal NDA.
- Add three audit columns to nda_acceptances for a defensible acceptance record:
  nda_body_hash (SHA-256 of exact body accepted), investor_email (denormalised
  snapshot), acceptance_statement_version (version of the checkbox wording).

2. Changes to nda_versions
- Update the existing v1 row: set version to 'v1-PLACEHOLDER' and prepend a visible
  placeholder notice to body_text. The notice is prepended (not replacing) so the
  full text remains available for review while being unambiguously marked.
- is_current stays true — this remains the active version until NexFrontier supplies
  the real NDA text.

3. Changes to nda_acceptances (new columns)
- nda_body_hash text NULL — SHA-256 hex of the body_text presented at acceptance time
- investor_email text NULL — snapshot of investor email at acceptance time
- acceptance_statement_version text NULL — e.g. 'investor-nda-acceptance-v1'

4. Security
- No RLS or policy changes. All access remains through edge functions using the
  service role key.

5. Important notes
- This migration does NOT change the access model, gating logic, or any public form.
- The acceptance_statement_version is a single fixed identifier: 'investor-nda-acceptance-v1'.
- No IP address capture is added.
*/

-- Add audit columns to nda_acceptances
ALTER TABLE public.nda_acceptances
  ADD COLUMN IF NOT EXISTS nda_body_hash text,
  ADD COLUMN IF NOT EXISTS investor_email text,
  ADD COLUMN IF NOT EXISTS acceptance_statement_version text;

-- Mark the current v1 NDA as placeholder
UPDATE public.nda_versions
SET
  version = 'v1-PLACEHOLDER',
  body_text = E'PLACEHOLDER — NOT LEGALLY APPROVED\n\nThis agreement is present only to validate the Investor Data Room access and digital acceptance workflow. It must be replaced by the NexFrontier-approved Investor NDA before production investor access is enabled.\n\n' || body_text
WHERE version = 'v1' AND is_current = true;
