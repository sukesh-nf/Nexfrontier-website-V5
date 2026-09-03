import type { CSSProperties, ReactNode } from 'react';

export function Container({ children, wide = false, diagram = false, style }: {
  children: ReactNode; wide?: boolean; diagram?: boolean; style?: CSSProperties;
}) {
  const maxWidth = diagram ? 'var(--nf-container-diagram)' : wide ? 'var(--nf-container-wide)' : 'var(--nf-container-max)';
  return <div className="nf-container" style={{ maxWidth, margin: '0 auto', paddingInline: 'var(--nf-container-pad-x)', ...style }}>{children}</div>;
}

export function Section({ children, wide = false, diagram = false, spacing = 'default', style, id }: {
  children: ReactNode; wide?: boolean; diagram?: boolean;
  spacing?: 'default' | 'tight' | 'hero' | 'none'; style?: CSSProperties; id?: string;
}) {
  const padY = spacing === 'hero' ? 'clamp(80px, 10vw, 150px)' : spacing === 'tight' ? 'var(--nf-space-7)' : spacing === 'none' ? 0 : 'var(--nf-section-pad-y)';
  return <section id={id} className="nf-section" style={{ paddingTop: padY, paddingBottom: padY, ...style }}><Container wide={wide} diagram={diagram}>{children}</Container></section>;
}

export function Eyebrow({ children, style }: { children: string; style?: CSSProperties }) {
  return <span className="nf-eyebrow" style={style}>{children}</span>;
}
