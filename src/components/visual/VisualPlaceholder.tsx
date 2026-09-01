import type { CSSProperties } from 'react';

export interface VisualPlaceholderProps {
  visualId: string;
  concept: string;
  purpose: string;
  aspectRatio?: string;
  desktopWidth?: string;
  mobileTreatment?: string;
  separateMobileVisual?: boolean;
  labels?: string[];
  style?: CSSProperties;
}

export function VisualPlaceholder({
  visualId, concept, purpose, aspectRatio = '16 / 9', desktopWidth = '100%',
  mobileTreatment = 'Full-width, stacked', separateMobileVisual = false, labels, style,
}: VisualPlaceholderProps) {
  return (
    <div role="img" aria-label={`Placeholder for ${concept}. ${purpose}`} style={{
      width: desktopWidth, aspectRatio, background: 'var(--nf-bg-surface-1)',
      border: '1px dashed var(--nf-border-accent)', borderRadius: 'var(--nf-radius-panel)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--nf-space-7)', textAlign: 'center', ...style,
    }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--nf-cyan)', marginBottom: 'var(--nf-space-3)' }}>{visualId}</div>
      <div style={{ fontSize: '1.0625rem', fontWeight: 500, color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-2)' }}>{concept}</div>
      <div style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', maxWidth: '420px', lineHeight: 1.5 }}>{purpose}</div>
      {labels && labels.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--nf-space-2)', justifyContent: 'center', marginTop: 'var(--nf-space-4)' }}>
          {labels.map((label) => <span key={label} style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)', borderRadius: '999px', padding: '4px 10px' }}>{label}</span>)}
        </div>
      )}
      <div style={{ marginTop: 'var(--nf-space-4)', fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)', opacity: 0.6 }}>
        Mobile: {mobileTreatment}{separateMobileVisual && ' (separate mobile visual may be required)'}
      </div>
    </div>
  );
}
