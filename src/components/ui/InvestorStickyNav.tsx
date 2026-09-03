'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'the-shift', label: 'THE SHIFT' },
  { id: 'the-bet', label: 'THE BET' },
  { id: 'asymmetric-upside', label: 'ASYMMETRIC UPSIDE' },
  { id: 'economic-prize', label: 'ECONOMIC PRIZE' },
  { id: 'why-nexfrontier', label: 'WHY NEXFRONTIER' },
  { id: 'proof', label: 'PROOF' },
  { id: 'why-invest-now', label: 'WHY INVEST NOW' },
];

export function InvestorStickyNav() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('investor-hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        setVisible(rect.bottom < 72);
      }
      let current = '';
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 140) current = s.id;
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="nf-investor-sticky" style={{
      position: 'sticky', top: '72px', zIndex: 99,
      background: 'var(--nf-bg-primary)',
      borderBottom: '1px solid var(--nf-border)',
    }}>
      <div style={{
        maxWidth: 'var(--nf-container-max)', margin: '0 auto',
        paddingInline: 'var(--nf-container-pad-x)',
        display: 'flex', alignItems: 'center', gap: '0',
        height: '44px', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}
            className="nf-investor-sticky-link"
            style={{
              textDecoration: 'none', whiteSpace: 'nowrap',
              padding: '0 16px', height: '100%',
              display: 'flex', alignItems: 'center',
              fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
              color: active === s.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
              borderBottom: active === s.id ? '2px solid var(--nf-cyan)' : '2px solid transparent',
              transition: 'color var(--nf-transition-fast), border-color var(--nf-transition-fast)',
            }}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
