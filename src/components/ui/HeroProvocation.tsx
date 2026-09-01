'use client';

import { useState, useEffect, useLayoutEffect } from 'react';

const PROVOCATIONS = [
  'Is your business winning today\u2019s market by design, or are you just surviving while AI-mediated markets change the rules around you?',
  'You\u2019re optimising today\u2019s performance. But is your operating model already falling behind AI-mediated markets changing faster than your strategy cycle?',
  'Are you running a company built for the market you know, or becoming a constraint on the AI-mediated market forming around you?',
  'While you fine-tune efficiency inside the enterprise, are you structurally aware of how AI-mediated markets are changing discovery, trust, choice and transaction outside it?',
  'What if the signals your leadership team trusts are already lagging the market?',
];

const STORAGE_KEY = 'nf-provocation-last';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function HeroProvocation() {
  const [provocation, setProvocation] = useState<string | null>(null);

  useIsoLayoutEffect(() => {
    let lastIndex: number | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const idx = parseInt(stored, 10);
        if (idx >= 0 && idx < PROVOCATIONS.length) lastIndex = idx;
      }
    } catch {
      // storage not available
    }

    let newIndex: number;
    if (lastIndex === null) {
      newIndex = Math.floor(Math.random() * PROVOCATIONS.length);
    } else {
      const candidates = PROVOCATIONS.map((_, i) => i).filter(i => i !== lastIndex);
      newIndex = candidates[Math.floor(Math.random() * candidates.length)];
    }

    setProvocation(PROVOCATIONS[newIndex]);

    try {
      localStorage.setItem(STORAGE_KEY, String(newIndex));
    } catch {
      // ignore
    }
  }, []);

  return (
    <p style={{
      fontSize: '1.0625rem',
      lineHeight: '1.6',
      color: 'var(--nf-text-secondary)',
      maxWidth: '520px',
      marginTop: 'var(--nf-space-5)',
      fontStyle: 'italic',
      borderLeft: '2px solid var(--nf-cyan)',
      paddingLeft: 'var(--nf-space-4)',
    }}>
      {provocation}
    </p>
  );
}
