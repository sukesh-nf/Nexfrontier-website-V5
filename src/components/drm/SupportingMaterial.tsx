import { FileText } from 'lucide-react';

export interface SupportingMaterialItem {
  name: string;
  description?: string;
  href?: string;
}

export function SupportingMaterial({ items }: { items: SupportingMaterialItem[] }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 'var(--nf-space-6)' }}>
      <span style={{
        display: 'block', fontSize: '0.6875rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--nf-text-tertiary)', marginBottom: 'var(--nf-space-4)',
      }}>Supporting Material</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px',
            background: 'var(--nf-bg-surface-1)',
            border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-control)',
          }}>
            <FileText size={16} color="var(--nf-cyan)" />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '0.875rem', fontWeight: 500, color: 'var(--nf-text-primary)',
                margin: 0,
              }}>{item.name}</p>
              {item.description && (
                <p style={{
                  fontSize: '0.75rem', color: 'var(--nf-text-tertiary)',
                  margin: '2px 0 0',
                }}>{item.description}</p>
              )}
            </div>
            {item.href && (
              <a href={item.href} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--nf-cyan)',
                textDecoration: 'none',
              }}>Open &rarr;</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
