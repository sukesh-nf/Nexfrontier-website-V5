'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function InvestorBriefRequestForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    role: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email) {
      setError('Please complete the required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/drm-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)',
    borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)',
    fontSize: '0.9375rem', outline: 'none',
    transition: 'border-color var(--nf-transition-fast)',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8125rem', fontWeight: 600,
    color: 'var(--nf-text-secondary)', marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      {submitted ? (
        <div style={{
          padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-3)',
          border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'var(--nf-cyan)', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--nf-space-4)',
          }}>
            <Check size={24} color="#041014" />
          </div>
          <h2 style={{
            fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)',
            marginBottom: 'var(--nf-space-3)',
          }}>Your request has been received.</h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
            A member of the NexFrontier team will review your request and contact you with next steps regarding Investor Brief and Data Room access.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="nf-form-row">
            <div>
              <label style={labelStyle} htmlFor="ibr-name">Name <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
              <input id="ibr-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="ibr-email">Work email <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
              <input id="ibr-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="you@company.com" />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="ibr-phone">Phone (optional)</label>
            <input id="ibr-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} placeholder="+60 12 345 6789" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="nf-form-row">
            <div>
              <label style={labelStyle} htmlFor="ibr-org">Organisation (optional)</label>
              <input id="ibr-org" type="text" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} style={inputStyle} placeholder="Company / fund" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="ibr-role">Role (optional)</label>
              <input id="ibr-role" type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={inputStyle} placeholder="Partner, Director, Analyst..." />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="ibr-message">Message (optional)</label>
            <textarea
              id="ibr-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
              placeholder="Tell us about your interest in NexFrontier."
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-error, #e25555)' }}>{error}</p>
          )}

          <button type="submit" disabled={submitting} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
            padding: '14px 19px', borderRadius: 'var(--nf-radius-button)',
            background: submitting ? 'var(--nf-bg-surface-3)' : 'var(--nf-cyan)',
            color: submitting ? 'var(--nf-text-tertiary)' : '#041014',
            fontSize: '0.8125rem', fontWeight: 700, border: 'none',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'transform var(--nf-transition-base)',
            alignSelf: 'flex-start',
          }}>
            {submitting ? 'Sending...' : 'Request Investor Brief'} <ArrowRight size={17} />
          </button>
        </form>
      )}
    </div>
  );
}
