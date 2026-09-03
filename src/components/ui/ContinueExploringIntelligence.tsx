import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/primitives';
import type { NavChild } from '@/config/navigation';

export function ContinueExploringIntelligence({ links }: { links: NavChild[] }) {
  return (
    <div style={{ marginTop: 'var(--nf-space-8)' }}>
      <Eyebrow>CONTINUE EXPLORING INTELLIGENCE</Eyebrow>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--nf-space-3)',
        marginTop: 'var(--nf-space-4)',
      }}>
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 18px',
              background: 'var(--nf-bg-surface-2)',
              border: '1px solid var(--nf-border)',
              borderRadius: 'var(--nf-radius-control)',
              color: 'var(--nf-text-primary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'border-color var(--nf-transition-fast), background var(--nf-transition-fast)',
            }}
          >
            {link.label}
            <ArrowRight size={15} style={{ color: 'var(--nf-cyan)', flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
