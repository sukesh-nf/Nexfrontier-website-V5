'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

export function FounderVideo({ poster, name }: { poster?: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <section aria-labelledby="founder-perspective" style={{ marginTop: 'var(--nf-space-8)', padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
        <span className="nf-eyebrow">FOUNDER PERSPECTIVE</span>
        <h2 id="founder-perspective" style={{ color: 'var(--nf-text-primary)', fontSize: 'var(--nf-text-h3)', margin: 'var(--nf-space-4) 0 var(--nf-space-5)' }}>A perspective from {name}</h2>
        <button type="button" className="nf-video-poster" onClick={() => setOpen(true)} aria-label={`Play founder perspective from ${name}`} style={{ width: '100%', border: 0, padding: 0, background: 'var(--nf-bg-surface-1)' }}>
          {poster ? <img src={poster} alt="Founder perspective video poster" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} /> : <div style={{ aspectRatio: '16 / 9' }} />}
          <span className="nf-video-play-btn"><Play size={24} fill="currentColor" color="#041014" /></span>
        </button>
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', marginTop: 'var(--nf-space-3)' }}>Video placeholder prepared for future hosted or YouTube source.</p>
      </section>
      {open && <div className="nf-video-modal" role="dialog" aria-modal="true" aria-label="Founder perspective video"><div className="nf-video-modal-inner"><button type="button" onClick={() => setOpen(false)} aria-label="Close video" style={{ position: 'absolute', right: 16, top: 16, zIndex: 1, border: 0, borderRadius: '50%', width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'var(--nf-bg-surface-3)', color: 'var(--nf-text-primary)', cursor: 'pointer' }}><X size={18} /></button>{poster ? <img src={poster} alt="Founder perspective video poster" style={{ width: '100%', display: 'block' }} /> : <div style={{ aspectRatio: '16 / 9', background: 'var(--nf-bg-surface-1)' }} />}</div></div>}
    </>
  );
}
