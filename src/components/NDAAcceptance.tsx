'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface NDAStatus {
  ok: boolean;
  investor?: { id: string; name: string; email: string };
  nda?: {
    version: string;
    body_text: string;
    has_accepted_current: boolean;
    accepted_at: string | null;
  };
  message?: string;
  nda_required?: boolean;
}

export function NDAAcceptance() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ndaStatus, setNdaStatus] = useState<NDAStatus | null>(null);
  const [fullLegalName, setFullLegalName] = useState('');
  const [company, setCompany] = useState('');
  const [titleRole, setTitleRole] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('drm_session_token');
    if (!sessionToken) {
      router.push('/investor-data-room');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-nda?action=status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
        });
        const data = await res.json() as NDAStatus;
        if (!res.ok) {
          router.push('/investor-data-room');
          return;
        }
        setNdaStatus(data);
        if (data.nda?.has_accepted_current) {
          setAccepted(true);
        }
      } catch {
        router.push('/investor-data-room');
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullLegalName || !company || !titleRole) {
      setError('Full legal name, company and title are required.');
      return;
    }
    if (!confirmed) {
      setError('You must confirm you have read and agree to the NDA.');
      return;
    }

    setSubmitting(true);
    try {
      const sessionToken = sessionStorage.getItem('drm_session_token');
      const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-nda?action=accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          full_legal_name: fullLegalName,
          company: company,
          title_role: titleRole,
          confirmed: confirmed,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAccepted(true);
      } else {
        setError(data.message || 'Unable to submit NDA acceptance.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="nf-nda-page">
        <div className="nf-nda-container">
          <p style={{ color: '#AEB5BA', fontSize: '18px' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="nf-nda-page">
        <div className="nf-nda-container">
          <div className="nf-nda-success">
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: 'var(--nf-cyan)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
            }}>
              <Check size={24} color="#041014" />
            </div>
            <h2>NDA accepted.</h2>
            <p>You may now access the NexFrontier Investor Data Room.</p>
            <button
              onClick={() => router.push('/investor-data-room')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '14px 24px', borderRadius: 'var(--nf-radius-button)',
                background: 'var(--nf-cyan)', color: '#041014',
                fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              ENTER DATA ROOM <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nf-nda-page">
      <div className="nf-nda-container">
        <span className="nf-nda-eyebrow">CONFIDENTIALITY</span>
        <h1 className="nf-nda-headline">Before you enter the Investor Data Room</h1>
        <p className="nf-nda-support">
          Access to NexFrontier private investor information is subject to the NexFrontier Investor NDA. Please review and accept the terms before continuing.
        </p>

        {ndaStatus?.nda?.body_text && (
          <div className="nf-nda-text">
            {ndaStatus.nda.body_text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="nf-nda-form">
          <div className="nf-nda-field">
            <label className="nf-nda-label" htmlFor="nda-name">Full legal name <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
            <input
              id="nda-name"
              type="text"
              className="nf-nda-input"
              value={fullLegalName}
              onChange={(e) => setFullLegalName(e.target.value)}
              placeholder="Your full legal name"
              required
            />
          </div>
          <div className="nf-nda-field">
            <label className="nf-nda-label" htmlFor="nda-company">Company / organisation <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
            <input
              id="nda-company"
              type="text"
              className="nf-nda-input"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or organisation"
              required
            />
          </div>
          <div className="nf-nda-field">
            <label className="nf-nda-label" htmlFor="nda-title">Title / role <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
            <input
              id="nda-title"
              type="text"
              className="nf-nda-input"
              value={titleRole}
              onChange={(e) => setTitleRole(e.target.value)}
              placeholder="Your title or role"
              required
            />
          </div>
          <div className="nf-nda-checkbox-row">
            <input
              type="checkbox"
              id="nda-confirm"
              className="nf-nda-checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              required
            />
            <label className="nf-nda-checkbox-label" htmlFor="nda-confirm">
              I confirm that I have read and agree to the NexFrontier Investor NDA, that the information I have provided is accurate, and that I intend my electronic acceptance to constitute my signature to this agreement.
            </label>
          </div>
          {error && <p className="nf-nda-error">{error}</p>}
          <button
            type="submit"
            className="nf-nda-submit"
            disabled={submitting}
          >
            {submitting ? 'SUBMITTING…' : 'ACCEPT AND SIGN NDA'} <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
