'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode, CSSProperties } from 'react';
import { ArrowRight, ChevronRight, Home, ArrowLeft } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'default' | 'small';

const baseStyles: Record<Variant, CSSProperties> = {
  primary: { background: 'var(--nf-cyan)', color: '#041014', border: '1px solid var(--nf-cyan)', fontWeight: 700 },
  secondary: { background: 'transparent', color: 'var(--nf-text-primary)', border: '1px solid var(--nf-border-strong)', fontWeight: 600 },
  text: { background: 'transparent', color: 'var(--nf-text-primary)', border: 'none', borderBottom: '1px solid var(--nf-border-strong)', borderRadius: 0, padding: '0 0 5px 0', fontWeight: 600 },
};

const sizeStyles: Record<Size, { padding: string; fontSize: string; gap: string }> = {
  default: { padding: '12px 24px', fontSize: '0.9375rem', gap: '8px' },
  small: { padding: '10px 16px', fontSize: '0.8125rem', gap: '6px' },
};

export function Button({ children, to, variant = 'primary', size = 'default', external = false, style }: {
  children: ReactNode; to: string; variant?: Variant; size?: Size; external?: boolean; style?: CSSProperties;
}) {
  const combined: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: sizeStyles[size].gap, borderRadius: 'var(--nf-radius-button)',
    fontSize: sizeStyles[size].fontSize,
    padding: variant === 'text' ? sizeStyles.default.padding : sizeStyles[size].padding,
    transition: 'background var(--nf-transition-fast), color var(--nf-transition-fast), border-color var(--nf-transition-fast), opacity var(--nf-transition-fast)',
    cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', ...baseStyles[variant], ...style,
  };
  if (external || to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) {
    return <a href={to} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} style={combined}>{children}{variant !== 'text' && <ArrowRight size={size === 'small' ? 14 : 17} />}</a>;
  }
  return <Link href={to} style={combined}>{children}{variant !== 'text' && <ArrowRight size={size === 'small' ? 14 : 17} />}</Link>;
}

export function TextLink({ children, to, external = false, style }: {
  children: ReactNode; to: string; external?: boolean; style?: CSSProperties;
}) {
  const linkStyle: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    color: 'var(--nf-text-primary)', fontSize: '0.8125rem', fontWeight: 600,
    borderBottom: '1px solid var(--nf-border-strong)', paddingBottom: '5px',
    transition: 'color var(--nf-transition-base), border-color var(--nf-transition-base)', textDecoration: 'none', ...style,
  };
  if (external || to.startsWith('http')) {
    return <a href={to} target="_blank" rel="noopener noreferrer" style={linkStyle}>{children}<ArrowRight size={16} /></a>;
  }
  return <Link href={to} style={linkStyle}>{children}<ArrowRight size={16} /></Link>;
}

export interface BreadcrumbItem { label: string; path?: string; }

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--nf-space-5)' }}>
      <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {item.path && !isLast ? (
                <Link href={item.path} style={{ color: 'var(--nf-text-tertiary)', textDecoration: 'none' }}>{item.label}</Link>
              ) : (
                <span style={{ color: isLast ? 'var(--nf-text-secondary)' : 'var(--nf-text-tertiary)' }}>{item.label}</span>
              )}
              {!isLast && <ChevronRight size={14} style={{ color: 'var(--nf-text-tertiary)', opacity: 0.6 }} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link href={to} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', marginBottom: 'var(--nf-space-5)', textDecoration: 'none' }}>
      <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} />
      {children}
    </Link>
  );
}

export function BackHomeNav() {
  const router = useRouter();
  return (
    <div className="nf-back-home">
      <button
        onClick={() => router.back()}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', transition: 'color var(--nf-transition-fast)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--nf-cyan)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--nf-text-tertiary)'; }}
      >
        <ArrowLeft size={15} /> Back
      </button>
      <span className="nf-back-home-sep">|</span>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', textDecoration: 'none', transition: 'color var(--nf-transition-fast)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--nf-cyan)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--nf-text-tertiary)'; }}
      >
        <Home size={15} /> Home
      </Link>
    </div>
  );
}

export interface ContextNavItem { label: string; path: string; current?: boolean }

export function ContextNav({ items }: { items: ContextNavItem[] }) {
  return (
    <nav className="nf-context-nav" aria-label="Context">
      {items.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--nf-space-2)' }}>
          {item.current ? (
            <span className="nf-context-current">{item.label}</span>
          ) : (
            <Link href={item.path} style={{ textDecoration: 'none' }}>{item.label}</Link>
          )}
          {i < items.length - 1 && <ChevronRight size={13} className="nf-context-sep" style={{ color: 'var(--nf-border-strong)' }} />}
        </span>
      ))}
    </nav>
  );
}
