'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

const enquiryTypes = [
  { value: 'foundation-customer', label: 'Foundation Customer' },
  { value: 'investor', label: 'Investor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'market-customer', label: 'Market / Customer Enquiry' },
  { value: 'other', label: 'Other – please specify' },
];

const revenueRanges = [
  'Under $2m',
  '$2m – $5m',
  '$5m – $20m',
  '$20m – $100m',
  '$100m+',
  'Prefer not to say',
];

function EnquiryForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    organisation: '',
    role: '',
    enquiryType: '',
    revenueRange: '',
    message: '',
    website: '',
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialType && enquiryTypes.some((t) => t.value === initialType)) {
      setForm((prev) => ({ ...prev, enquiryType: initialType }));
    }
  }, [initialType]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.enquiryType) {
      setError('Please complete the required fields.');
      return;
    }

    if (form.enquiryType === 'foundation-customer' && !form.organisation) {
      setError('Organisation is required for Foundation Customer enquiries.');
      return;
    }

    if (!form.consent) {
      setError('Please confirm you understand how NexFrontier will use your information.');
      return;
    }

    setSubmitting(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(`${supabaseUrl}/functions/v1/market-enquiry`, {
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

  const showRevenue = form.enquiryType === 'foundation-customer' || form.enquiryType === 'market-customer';

  return (
    <div style={{ maxWidth: '640px' }}>
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
          }}>Thank you. Your enquiry has been received.</h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
            We will use the context you provided to determine the most useful next conversation. A member of the NexFrontier team will be in touch.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', fontStyle: 'italic', marginTop: 'var(--nf-space-4)' }}>
            Thank you for your interest. We will be in touch shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="nf-form-row">
            <div>
              <label style={labelStyle} htmlFor="name">Name <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
              <input id="name" type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} style={inputStyle} placeholder="Your name" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="email">Work email <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
              <input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} style={inputStyle} placeholder="you@company.com" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="nf-form-row">
            <div>
              <label style={labelStyle} htmlFor="organisation">Organisation {form.enquiryType === 'foundation-customer' && <span style={{ color: 'var(--nf-cyan)' }}>*</span>}</label>
              <input id="organisation" type="text" value={form.organisation} onChange={(e) => handleChange('organisation', e.target.value)} style={inputStyle} placeholder="Company name" />
            </div>
            <div>
              <label style={labelStyle} htmlFor="role">Role</label>
              <input id="role" type="text" value={form.role} onChange={(e) => handleChange('role', e.target.value)} style={inputStyle} placeholder="Your role" />
            </div>
          </div>

          <div>
            <label style={labelStyle} htmlFor="enquiryType">Enquiry type <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
            <select
              id="enquiryType"
              value={form.enquiryType}
              onChange={(e) => handleChange('enquiryType', e.target.value)}
              style={inputStyle}
            >
              <option value="">Select an enquiry type</option>
              {enquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {showRevenue && (
            <div>
              <label style={labelStyle} htmlFor="revenueRange">Annual revenue range</label>
              <select
                id="revenueRange"
                value={form.revenueRange}
                onChange={(e) => handleChange('revenueRange', e.target.value)}
                style={inputStyle}
              >
                <option value="">Select a range (optional)</option>
                {revenueRanges.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle} htmlFor="message">What are you trying to understand?</label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="Tell us about the question you are exploring and why NexFrontier may be relevant."
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="website">Website (optional)</label>
            <input id="website" type="url" value={form.website} onChange={(e) => handleChange('website', e.target.value)} style={inputStyle} placeholder="https://" />
          </div>

          <label style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', cursor: 'pointer',
          }}>
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => handleChange('consent', e.target.checked)}
              style={{ marginTop: '2px', accentColor: 'var(--nf-cyan)' }}
            />
            <span>I understand NexFrontier will use the information I provide to respond to my enquiry, in accordance with its privacy practices.</span>
          </label>

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
            {submitting ? 'Sending...' : 'Send enquiry'} <ArrowRight size={17} />
          </button>
        </form>
      )}
    </div>
  );
}

export function MarketEnquiryForm() {
  return (
    <Suspense fallback={<div style={{ maxWidth: '640px', color: 'var(--nf-text-tertiary)' }}>Loading form...</div>}>
      <EnquiryForm />
    </Suspense>
  );
}
