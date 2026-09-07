'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, LogIn, Mail, UserPlus } from 'lucide-react';
import { DataRoomHome } from '@/components/drm/DataRoomHome';

interface Investor {
  id: string;
  name: string;
  email: string;
  nda_signed: boolean;
  access_level: number;
}

type Mode = 'menu' | 'activate' | 'login' | 'otp' | 'request';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function apiUrl(path: string): string {
  return `${SUPABASE_URL}/functions/v1/${path}`;
}

async function publicApi(path: string, body: Record<string, unknown>) {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY || '',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

async function sessionApi(path: string, sessionToken: string, method: 'GET' | 'POST' = 'GET', body?: Record<string, unknown>) {
  const res = await fetch(apiUrl(path), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

function InvestorDataRoomV2Inner() {
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token')?.trim() || '';
  const [mode, setMode] = useState<Mode>(invitationToken ? 'activate' : 'menu');
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestForm, setRequestForm] = useState({ name: '', email: '', phone: '', organisation: '', role: '', message: '' });

  const completeSession = useCallback(async (token: string, fallbackInvestor?: Investor) => {
    sessionStorage.setItem('drm_session_token', token);
    setSessionToken(token);
    try {
      const data = await sessionApi('drm-nda?action=status', token);
      const restored: Investor = fallbackInvestor || {
        id: data.investor.id,
        name: data.investor.name,
        email: data.investor.email,
        nda_signed: Boolean(data.nda?.has_accepted_current),
        access_level: data.nda?.has_accepted_current ? 2 : 1,
      };
      setInvestor(restored);
      if (!data.nda?.has_accepted_current) {
        window.location.href = '/investor-data-room/nda';
      }
    } catch {
      sessionStorage.removeItem('drm_session_token');
      setSessionToken(null);
      setInvestor(null);
      throw new Error('Your session could not be verified. Please sign in again.');
    }
  }, []);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('drm_session_token');
    if (!savedToken) {
      setCheckingSession(false);
      return;
    }
    completeSession(savedToken)
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, [completeSession]);

  const activateInvitation = async () => {
    if (!invitationToken) return;
    setError('');
    setLoading(true);
    try {
      const data = await publicApi('drm-activate', { token: invitationToken });
      await completeSession(data.sessionToken, data.investor as Investor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to activate access.');
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await publicApi('drm-login', { email });
      setNotice(data.message || 'If this email has approved access, a sign-in code has been sent.');
      setMode('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start sign-in.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await publicApi('drm-login?action=verify-otp', { email, otp: otpCode });
      await completeSession(data.sessionToken, data.investor as Investor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await publicApi('drm-request', requestForm);
      setRequestSuccess(data.message);
      setRequestForm({ name: '', email: '', phone: '', organisation: '', role: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const token = sessionStorage.getItem('drm_session_token');
    if (token) {
      sessionApi('drm-documents?action=logout', token).catch(() => {});
    }
    sessionStorage.removeItem('drm_session_token');
    setSessionToken(null);
    setInvestor(null);
    setMode('menu');
  };

  if (checkingSession) {
    return <CenteredCard><p style={mutedText}>Checking secure access...</p></CenteredCard>;
  }

  if (investor && sessionToken) {
    return <DataRoomHome investor={investor} onLogout={logout} />;
  }

  return (
    <CenteredCard>
      <div style={{ textAlign: 'center', marginBottom: 'var(--nf-space-7)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-4)' }}>
          <Lock size={26} color="var(--nf-cyan)" />
          <span style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>NexFrontier Investor Data Room</span>
        </div>
        <p style={mutedText}>Secure access for approved investors and strategic partners.</p>
      </div>

      <a href="/" style={{ ...secondaryAction, marginBottom: 'var(--nf-space-5)' }}><ArrowLeft size={14} /> Back to NexFrontier</a>

      <div style={panelStyle}>
        {mode === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-4)' }}>
            <MenuButton icon={<LogIn size={20} />} label="Log in with email" onClick={() => { setError(''); setMode('login'); }} />
            <MenuButton icon={<UserPlus size={20} />} label="Request investor access" onClick={() => { setError(''); setMode('request'); }} />
          </div>
        )}

        {mode === 'activate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
            <div>
              <h2 style={headingStyle}>Activate your investor access</h2>
              <p style={mutedText}>Your invitation link has been detected. Continue to activate your secure investor access.</p>
            </div>
            {error && <ErrorText text={error} />}
            <button type="button" onClick={activateInvitation} disabled={loading || !invitationToken} style={primaryButton(loading || !invitationToken)}>
              {loading ? 'Activating...' : 'Activate access'} <ArrowRight size={16} />
            </button>
            <button type="button" style={textButton} onClick={() => { setMode('menu'); setError(''); }}>Use a different sign-in option</button>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={requestOtp} style={formStyle}>
            <div>
              <h2 style={headingStyle}>Investor login</h2>
              <p style={mutedText}>Enter the email address registered for your investor access. We will send a one-time sign-in code.</p>
            </div>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@company.com" autoFocus required />
            </div>
            {error && <ErrorText text={error} />}
            <button type="submit" disabled={loading || !email.trim()} style={primaryButton(loading || !email.trim())}>
              {loading ? 'Sending code...' : 'Email me a sign-in code'} <Mail size={16} />
            </button>
            <button type="button" style={textButton} onClick={() => { setMode('menu'); setError(''); }}>Back</button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={verifyOtp} style={formStyle}>
            <div>
              <h2 style={headingStyle}>Enter your sign-in code</h2>
              <p style={mutedText}>{notice}</p>
            </div>
            <div>
              <label style={labelStyle}>6-digit code</label>
              <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} style={{ ...inputStyle, textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.28em' }} placeholder="000000" autoFocus />
              <p style={{ ...mutedText, fontSize: '0.75rem', marginTop: '6px' }}>The code expires in 10 minutes and can be used once.</p>
            </div>
            {error && <ErrorText text={error} />}
            <button type="submit" disabled={loading || otpCode.length !== 6} style={primaryButton(loading || otpCode.length !== 6)}>
              {loading ? 'Verifying...' : 'Verify and enter Data Room'} <ArrowRight size={16} />
            </button>
            <button type="button" style={textButton} onClick={() => { setOtpCode(''); setError(''); setMode('login'); }}>Use a different email</button>
            <button type="button" style={textButton} onClick={() => { setError(''); setMode('request'); }}>Don't have approved access? Request investor access</button>
          </form>
        )}

        {mode === 'request' && (
          requestSuccess ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 size={38} color="var(--nf-positive)" style={{ margin: '0 auto var(--nf-space-4)' }} />
              <p style={{ color: 'var(--nf-text-primary)', lineHeight: 1.6 }}>{requestSuccess}</p>
              <button type="button" style={{ ...primaryButton(false), marginTop: 'var(--nf-space-4)' }} onClick={() => { setRequestSuccess(''); setMode('menu'); }}>Done</button>
            </div>
          ) : (
            <form onSubmit={submitRequest} style={formStyle}>
              <div>
                <h2 style={headingStyle}>Request investor access</h2>
                <p style={mutedText}>Submit your details for review by the NexFrontier team.</p>
              </div>
              <Field label="Name" required value={requestForm.name} onChange={(value) => setRequestForm({ ...requestForm, name: value })} />
              <Field label="Work email" type="email" required value={requestForm.email} onChange={(value) => setRequestForm({ ...requestForm, email: value })} />
              <Field label="Phone" value={requestForm.phone} onChange={(value) => setRequestForm({ ...requestForm, phone: value })} />
              <Field label="Organisation" value={requestForm.organisation} onChange={(value) => setRequestForm({ ...requestForm, organisation: value })} />
              <Field label="Role" value={requestForm.role} onChange={(value) => setRequestForm({ ...requestForm, role: value })} />
              <div>
                <label style={labelStyle}>Message (optional)</label>
                <textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} style={{ ...inputStyle, minHeight: '88px', resize: 'vertical' }} />
              </div>
              {error && <ErrorText text={error} />}
              <button type="submit" disabled={loading || !requestForm.name.trim() || !requestForm.email.trim()} style={primaryButton(loading || !requestForm.name.trim() || !requestForm.email.trim())}>
                {loading ? 'Submitting...' : 'Request access'} <ArrowRight size={16} />
              </button>
              <button type="button" style={textButton} onClick={() => { setMode('menu'); setError(''); }}>Back</button>
            </form>
          )
        )}
      </div>
    </CenteredCard>
  );
}

export function InvestorDataRoomV2() {
  return <Suspense fallback={<CenteredCard><p style={mutedText}>Loading...</p></CenteredCard>}><InvestorDataRoomV2Inner /></Suspense>;
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-6)' }}><div style={{ width: '100%', maxWidth: '500px' }}>{children}</div></div>;
}

function MenuButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '17px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 600, textAlign: 'left' }}><span style={{ color: 'var(--nf-cyan)', display: 'flex' }}>{icon}</span><span>{label}</span><ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--nf-text-tertiary)' }} /></button>;
}

function Field({ label, value, onChange, required = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string }) {
  return <div><label style={labelStyle}>{label}{required ? ' *' : ' (optional)'}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} required={required} /></div>;
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--nf-negative)', lineHeight: 1.5 }}>{text}</p>;
}

const panelStyle: React.CSSProperties = { background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)' };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' };
const headingStyle: React.CSSProperties = { margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 600, color: 'var(--nf-text-primary)' };
const mutedText: React.CSSProperties = { margin: 0, fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', lineHeight: 1.55 };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.9375rem', outline: 'none' };
const textButton: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' };
const secondaryAction: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', textDecoration: 'none' };
function primaryButton(disabled: boolean): React.CSSProperties { return { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 18px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 }; }
