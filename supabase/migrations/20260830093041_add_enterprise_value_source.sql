-- Add 'enterprise_value' to the source allowlist CHECK constraint
-- This is additive only — no existing data is affected.

ALTER TABLE leadership_pulse_responses
  DROP CONSTRAINT source_allowlist;

ALTER TABLE leadership_pulse_responses
  ADD CONSTRAINT source_allowlist CHECK (source IN (
    'email', 'linkedin', 'website_prompt', 'the_shift', 'intelligence',
    'about', 'direct', 'footer', 'market_signals', 'enterprise_value', 'other'
  ));
