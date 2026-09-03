import type { EvidenceState } from '@/data/data-room-registry';

const STATE_COLORS: Record<EvidenceState, { bg: string; color: string; border: string }> = {
  ASSUMPTION: { bg: 'rgba(148, 163, 184, 0.06)', color: 'var(--nf-text-tertiary)', border: 'rgba(148, 163, 184, 0.2)' },
  HYPOTHESIS: { bg: 'rgba(12, 192, 223, 0.04)', color: 'var(--nf-cyan)', border: 'rgba(12, 192, 223, 0.15)' },
  THESIS: { bg: 'rgba(12, 192, 223, 0.06)', color: 'var(--nf-cyan)', border: 'rgba(12, 192, 223, 0.2)' },
  EVIDENCE: { bg: 'rgba(12, 192, 223, 0.10)', color: 'var(--nf-cyan)', border: 'rgba(12, 192, 223, 0.3)' },
  'CUSTOMER VALIDATION': { bg: 'rgba(52, 211, 153, 0.06)', color: 'var(--nf-positive)', border: 'rgba(52, 211, 153, 0.2)' },
  'PAID VALIDATION': { bg: 'rgba(52, 211, 153, 0.10)', color: 'var(--nf-positive)', border: 'rgba(52, 211, 153, 0.3)' },
  'REPEATABLE PROOF': { bg: 'rgba(52, 211, 153, 0.14)', color: 'var(--nf-positive)', border: 'rgba(52, 211, 153, 0.4)' },
};

export function EvidenceStateBadge({ state }: { state: EvidenceState }) {
  const c = STATE_COLORS[state];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '5px 12px', borderRadius: '999px',
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {state}
    </span>
  );
}
