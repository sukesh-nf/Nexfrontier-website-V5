import type { ReactNode, CSSProperties } from 'react';
import { Container, Section, Eyebrow } from './primitives';

type HeroVariant = 'thesis' | 'concept' | 'functional';

const variantStyles: Record<HeroVariant, { paddingTop: string; paddingBottom: string; maxWidth: string }> = {
  thesis: { paddingTop: 'clamp(80px, 10vw, 140px)', paddingBottom: 'clamp(80px, 10vw, 140px)', maxWidth: '900px' },
  concept: { paddingTop: 'clamp(64px, 8vw, 100px)', paddingBottom: 'clamp(48px, 6vw, 72px)', maxWidth: '790px' },
  functional: { paddingTop: 'clamp(64px, 8vw, 100px)', paddingBottom: 'clamp(48px, 6vw, 72px)', maxWidth: '790px' },
};

export function PageHero({ eyebrow, title, lead, secondary, variant = 'concept', children }: {
  eyebrow: string; title: ReactNode; lead: ReactNode; secondary?: ReactNode;
  variant?: HeroVariant; children?: ReactNode;
}) {
  const vs = variantStyles[variant];
  return (
    <section style={{ paddingTop: vs.paddingTop, paddingBottom: vs.paddingBottom, borderBottom: '1px solid var(--nf-border)' }}>
      <Container>
        <div style={{ maxWidth: vs.maxWidth }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 style={{
            fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
            fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
            margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
          }}>{title}</h1>
          <p style={{
            fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
            color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0,
          }}>{lead}</p>
          {secondary && <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>{secondary}</p>}
          {children && <div style={{ marginTop: 'var(--nf-space-6)' }}>{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export function Callout({ eyebrow = 'NF PERSPECTIVE', title, children }: {
  eyebrow?: string; title: string; children: ReactNode;
}) {
  return (
    <div style={{ background: 'var(--nf-bg-surface-3)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)' }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 style={{ fontSize: '1.6875rem', fontWeight: 600, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)', maxWidth: '470px' }}>{title}</h3>
      {children}
    </div>
  );
}

export function PagePlaceholder({ eyebrow, title, lead, breadcrumbs, description, children }: {
  eyebrow: string; title: ReactNode; lead: string;
  breadcrumbs?: { label: string; path?: string }[];
  description?: string; children?: ReactNode;
}) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Section spacing="tight"><Container><Breadcrumb items={breadcrumbs} /></Container></Section>
      )}
      <PageHero eyebrow={eyebrow} title={title} lead={lead} variant="concept" />
      <Section>
        <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
          <Eyebrow>CONTENT PENDING</Eyebrow>
          <p style={{ color: 'var(--nf-text-secondary)', fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', marginTop: 'var(--nf-space-4)' }}>
            This page is part of the v4 architecture. Content will be supplied in a later Canonical Blueprint stage.
          </p>
          {children}
        </div>
      </Section>
    </>
  );
}

import { Breadcrumb } from './Button';
