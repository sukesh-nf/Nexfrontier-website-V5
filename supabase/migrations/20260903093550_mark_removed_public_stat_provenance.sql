ALTER TABLE public_stat_source_provenance
  DROP CONSTRAINT IF EXISTS public_stat_source_provenance_verification_status_check;

ALTER TABLE public_stat_source_provenance
  ADD CONSTRAINT public_stat_source_provenance_verification_status_check
  CHECK (verification_status IN ('EXACTLY_SUPPORTED', 'FAIR_PARAPHRASE', 'TOO_STRONG', 'UNSUPPORTED', 'VERIFIED', 'VERIFIED_REWORD', 'REMOVED_UNSUPPORTED'));

UPDATE public_stat_source_provenance
SET verification_status = 'REMOVED_UNSUPPORTED'
WHERE stat_id = 'stat-45pct-middle-market-expectations';
