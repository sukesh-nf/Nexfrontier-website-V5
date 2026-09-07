'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Lock, FileText, FolderKanban, BarChart3,
  Users, ShieldCheck, Settings, LogOut, Eye, Download, Clock,
  CheckCircle2, XCircle, AlertCircle, UserPlus, Send, Trash2,
  Plus, Edit3, ChevronRight, Activity, TrendingUp, FileSpreadsheet,
  KeyRound, UserCog, X, RefreshCw,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================
interface Investor {
  id: string;
  name: string;
  email: string;
  nda_signed: boolean;
  access_level: number;
}
interface AdminUser {
  id: string;
  name: string;
  email: string;
}
interface Folder {
  id: string;
  name: string;
  display_order: number;
}
interface Document {
  id: string;
  folder_id: string | null;
  name: string;
  google_link: string;
  security_classification: string;
  display_order: number;
  is_investor_brief: boolean;
  created_at: string;
  updated_at: string;
}
interface InvestorRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  nda_signed: boolean;
  access_level: number;
  status: string;
  request_date: string | null;
  invite_date: string | null;
  first_activation: string | null;
  last_access: string | null;
  created_at: string;
}
interface InvestorRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  role: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
}
interface ActivityLogEntry {
  id: string;
  investor_id: string | null;
  admin_id: string | null;
  event_type: string;
  event_detail: unknown;
  created_at: string;
}
interface AdminAccount {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

type View = 'secure-access' | 'investor' | 'admin';
type InvestorTab = 'overview' | 'documents';
type AdminTab = 'overview' | 'documents' | 'analytics' | 'investor-mgmt' | 'admin-access';

// ============================================================
// API helpers
// ============================================================
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function apiUrl(path: string): string {
  return `${SUPABASE_URL}/functions/v1/${path}`;
}

function apiHeaders(sessionToken?: string): Record<string, string> {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  };
  if (sessionToken) {
    h['Authorization'] = `Bearer ${sessionToken}`;
  }
  return h;
}

async function apiCall(path: string, opts: RequestInit & { sessionToken?: string } = {}): Promise<unknown> {
  const { sessionToken, ...rest } = opts;
  const res = await fetch(apiUrl(path), {
    ...rest,
    headers: { ...apiHeaders(sessionToken), ...(rest.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error((data as { message?: string }).message || 'Request failed') as Error & { nda_required?: boolean };
    if ((data as { nda_required?: boolean }).nda_required) err.nda_required = true;
    throw err;
  }
  return data;
}

async function adminCall(action: string, body: Record<string, unknown> = {}, adminToken?: string): Promise<unknown> {
  const res = await fetch(`${apiUrl('drm-admin')}?action=${action}`, {
    method: 'POST',
    headers: adminToken ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` } : { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || 'Admin request failed');
  }
  return data;
}

// ============================================================
// Main Component
// ============================================================
function InvestorDataRoomInner() {
  const [view, setView] = useState<View>('secure-access');
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('drm_session_token');
    if (savedToken) {
      setSessionToken(savedToken);
      loginWithSession(savedToken);
    }
  }, []);

  const loginWithSession = useCallback(async (token: string) => {
    try {
      const data = await apiCall('drm-documents', { method: 'GET', sessionToken: token }) as { ok: boolean; investor: Investor; nda_required?: boolean };
      setInvestor(data.investor);
      setSessionToken(token);
      sessionStorage.setItem('drm_session_token', token);
      setView('investor');
    } catch (err) {
      // Check if NDA acceptance is required
      const errData = err as Error & { nda_required?: boolean };
      if (errData.nda_required) {
        setSessionToken(token);
        sessionStorage.setItem('drm_session_token', token);
        window.location.href = '/investor-data-room/nda';
        return;
      }
      sessionStorage.removeItem('drm_session_token');
    }
  }, []);

  const handleInvestorActivated = async (inv: Investor, token: string, sessionId?: string) => {
    setInvestor(inv);
    setSessionToken(token);
    sessionStorage.setItem('drm_session_token', token);
    // Check NDA status before granting data room access
    try {
      const ndaData = await apiCall('drm-nda?action=status', { method: 'GET', sessionToken: token }) as { ok: boolean; nda?: { has_accepted_current: boolean } };
      if (ndaData.ok && !ndaData.nda?.has_accepted_current) {
        window.location.href = '/investor-data-room/nda';
        return;
      }
      setView('investor');
    } catch {
      // If NDA check fails, still allow access (existing behavior)
      setView('investor');
    }
  };

  const handleLogout = () => {
    // Invalidate the token server-side; best-effort, local state is cleared regardless.
    if (sessionToken) {
      apiCall('drm-documents?action=logout', { method: 'GET', sessionToken }).catch(() => {});
    }
    setInvestor(null);
    setSessionToken(null);
    sessionStorage.removeItem('drm_session_token');
    setView('secure-access');
  };

  if (view === 'secure-access') {
    return <SecureAccessScreen onInvestorActivated={handleInvestorActivated} onReturnLogin={loginWithSession} />;
  }

  if (view === 'investor' && investor && sessionToken) {
    return <InvestorDataRoomView investor={investor} sessionToken={sessionToken} onLogout={handleLogout} />;
  }

  return <SecureAccessScreen onInvestorActivated={handleInvestorActivated} onReturnLogin={loginWithSession} />;
}

export function InvestorDataRoom() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</div>
      </div>
    }>
      <InvestorDataRoomInner />
    </Suspense>
  );
}

// ============================================================
// Secure Access Screen
// ============================================================
type AccessMode = 'menu' | 'token' | 'request' | 'return-login' | 'return-login-otp';

function SecureAccessScreen({
  onInvestorActivated,
  onReturnLogin,
}: {
  onInvestorActivated: (inv: Investor, token: string, sessionId?: string) => void;
  onReturnLogin: (token: string) => void;
}) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AccessMode>('menu');
  const [token, setToken] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [email, setEmail] = useState('');
  const [returnPassphrase, setReturnPassphrase] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [reqForm, setReqForm] = useState({ name: '', email: '', phone: '', organisation: '', role: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-detect ?token= from an invitation link — without this, the recipient
  // lands on a generic menu with no indication a token exists at all, and has
  // to manually click "Enter access token" then copy-paste it from the email
  // themselves. This jumps straight to that screen with the token pre-filled.
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      setMode('token');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTokenActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiCall('drm-activate', {
        method: 'POST',
        body: JSON.stringify({ token, passphrase }),
      }) as { ok: boolean; investor: Investor; sessionToken: string; sessionId: string };
      onInvestorActivated(data.investor, data.sessionToken, data.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiCall('drm-login', {
        method: 'POST',
        body: JSON.stringify({ email, passphrase: returnPassphrase }),
      }) as { ok: boolean; otpRequired?: boolean; message?: string; devOtpCode?: string };
      if (data.otpRequired) {
        setOtpNotice(data.devOtpCode ? `DEV MODE — your code is ${data.devOtpCode}` : (data.message || 'A sign-in code has been sent to your email.'));
        setMode('return-login-otp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiCall('drm-login?action=verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode }),
      }) as { ok: boolean; investor: Investor; sessionToken: string; sessionId: string };
      onReturnLogin(data.sessionToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiCall('drm-request', {
        method: 'POST',
        body: JSON.stringify(reqForm),
      }) as { ok: boolean; message: string };
      setSuccess(data.message);
      setReqForm({ name: '', email: '', phone: '', organisation: '', role: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setLoading(false);
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
  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
    padding: '14px 19px', borderRadius: 'var(--nf-radius-button)',
    background: 'var(--nf-cyan)', color: '#041014',
    fontSize: '0.8125rem', fontWeight: 700, border: 'none',
    cursor: 'pointer', transition: 'transform var(--nf-transition-base)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-6)' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--nf-space-8)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-5)' }}>
            <Lock size={28} color="var(--nf-cyan)" />
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>NexFrontier Data Room</span>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--nf-text-tertiary)', lineHeight: 1.5 }}>
            Secure access for qualified investors and strategic partners.
          </p>
        </div>

        {/* Back to NexFrontier */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--nf-space-6)' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', transition: 'color var(--nf-transition-fast)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
            <ArrowLeft size={14} /> Back to NexFrontier
          </a>
        </div>

        <div style={{ background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)' }}>
          {mode === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-4)' }}>
              <button onClick={() => setMode('token')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', cursor: 'pointer', transition: 'border-color var(--nf-transition-fast)', color: 'var(--nf-text-primary)', fontSize: '0.9375rem', fontWeight: 500, textAlign: 'left', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--nf-cyan-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--nf-border)')}>
                <KeyRound size={20} color="var(--nf-cyan)" />
                <span>Enter access token</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto' }} color="var(--nf-text-tertiary)" />
              </button>
              <button onClick={() => setMode('return-login')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', cursor: 'pointer', transition: 'border-color var(--nf-transition-fast)', color: 'var(--nf-text-primary)', fontSize: '0.9375rem', fontWeight: 500, textAlign: 'left', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--nf-cyan-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--nf-border)')}>
                <LogOut size={20} color="var(--nf-cyan)" />
                <span>Return visitor login</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto' }} color="var(--nf-text-tertiary)" />
              </button>
              <button onClick={() => setMode('request')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', cursor: 'pointer', transition: 'border-color var(--nf-transition-fast)', color: 'var(--nf-text-primary)', fontSize: '0.9375rem', fontWeight: 500, textAlign: 'left', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--nf-cyan-border)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--nf-border)')}>
                <UserPlus size={20} color="var(--nf-cyan)" />
                <span>Request investor access</span>
                <ChevronRight size={16} style={{ marginLeft: 'auto' }} color="var(--nf-text-tertiary)" />
              </button>
            </div>
          )}

          {mode === 'token' && (
            <form onSubmit={handleTokenActivate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              <div>
                <label style={labelStyle}>Access token</label>
                <input type="text" value={token} onChange={(e) => setToken(e.target.value)} style={inputStyle} placeholder="Enter your invitation token" autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Set a passphrase <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
                <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} style={inputStyle} placeholder="At least 12 characters" />
                <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', marginTop: '4px' }}>This passphrase will be used for Return Visitor Login on future visits.</p>
              </div>
              {error && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>}
              <button type="submit" disabled={loading || !token || passphrase.length < 12} style={{ ...btnStyle, opacity: loading || !token || passphrase.length < 12 ? 0.4 : 1, cursor: loading || !token || passphrase.length < 12 ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Activating...' : 'Activate access'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => { setMode('menu'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' }}>Back</button>
            </form>
          )}

          {mode === 'return-login' && (
            <form onSubmit={handleReturnLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              <div>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@company.com" autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Passphrase</label>
                <input type="password" value={returnPassphrase} onChange={(e) => setReturnPassphrase(e.target.value)} style={inputStyle} placeholder="Enter your passphrase" />
              </div>
              {error && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>}
              <button type="submit" disabled={loading || !email || !returnPassphrase} style={{ ...btnStyle, opacity: loading || !email || !returnPassphrase ? 0.4 : 1, cursor: loading || !email || !returnPassphrase ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Logging in...' : 'Log in'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => { setMode('menu'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' }}>Back</button>
            </form>
          )}

          {mode === 'return-login-otp' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              <div>
                <label style={labelStyle}>Sign-in code</label>
                <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', marginBottom: '10px' }}>{otpNotice}</p>
                <input type="text" inputMode="numeric" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} style={{ ...inputStyle, letterSpacing: '0.3em', fontSize: '1.25rem', textAlign: 'center' }} placeholder="000000" autoFocus />
                <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', marginTop: '4px' }}>This code expires in 10 minutes.</p>
              </div>
              {error && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>}
              <button type="submit" disabled={loading || otpCode.length !== 6} style={{ ...btnStyle, opacity: loading || otpCode.length !== 6 ? 0.4 : 1, cursor: loading || otpCode.length !== 6 ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying...' : 'Verify and log in'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => { setMode('return-login'); setOtpCode(''); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' }}>Back</button>
            </form>
          )}

          {mode === 'request' && (
            <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: 'var(--nf-space-5)' }}>
                  <CheckCircle2 size={40} color="var(--nf-positive)" style={{ margin: '0 auto var(--nf-space-4)' }} />
                  <p style={{ fontSize: '0.9375rem', color: 'var(--nf-text-primary)', fontWeight: 500, marginBottom: 'var(--nf-space-3)' }}>{success}</p>
                  <button type="button" onClick={() => { setMode('menu'); setSuccess(''); }} style={{ ...btnStyle, marginTop: 'var(--nf-space-3)' }}>Done</button>
                </div>
              ) : (
                <>
                  <div>
                    <label style={labelStyle}>Name <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
                    <input type="text" value={reqForm.name} onChange={(e) => setReqForm({ ...reqForm, name: e.target.value })} style={inputStyle} placeholder="Your name" autoFocus />
                  </div>
                  <div>
                    <label style={labelStyle}>Work email <span style={{ color: 'var(--nf-cyan)' }}>*</span></label>
                    <input type="email" value={reqForm.email} onChange={(e) => setReqForm({ ...reqForm, email: e.target.value })} style={inputStyle} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input type="tel" value={reqForm.phone} onChange={(e) => setReqForm({ ...reqForm, phone: e.target.value })} style={inputStyle} placeholder="+60 12 345 6789" />
                  </div>
                  <div>
                    <label style={labelStyle}>Organisation (optional)</label>
                    <input type="text" value={reqForm.organisation} onChange={(e) => setReqForm({ ...reqForm, organisation: e.target.value })} style={inputStyle} placeholder="Company / fund" />
                  </div>
                  <div>
                    <label style={labelStyle}>Role (optional)</label>
                    <input type="text" value={reqForm.role} onChange={(e) => setReqForm({ ...reqForm, role: e.target.value })} style={inputStyle} placeholder="Partner, Director, Analyst..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Message (optional)</label>
                    <textarea value={reqForm.message} onChange={(e) => setReqForm({ ...reqForm, message: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Tell us about your interest in NexFrontier." />
                  </div>
                  {error && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>}
                  <button type="submit" disabled={loading || !reqForm.name || !reqForm.email} style={{ ...btnStyle, opacity: loading || !reqForm.name || !reqForm.email ? 0.4 : 1, cursor: loading || !reqForm.name || !reqForm.email ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Sending...' : 'Request access'} <ArrowRight size={16} />
                  </button>
                  <button type="button" onClick={() => { setMode('menu'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' }}>Back</button>
                </>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// ============================================================
// Shared Layout
// ============================================================
function DataRoomShell({
  navItems, activeTab, onTabChange, onLogout, children, mode,
}: {
  navItems: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  mode: 'investor' | 'admin';
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nf-bg-secondary)', borderBottom: '1px solid var(--nf-border)', padding: '0 var(--nf-container-pad-x)' }}>
        <div style={{ maxWidth: 'var(--nf-container-wide)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
            <Lock size={20} color="var(--nf-cyan)" />
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>Data Room</span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: mode === 'admin' ? 'rgba(245, 166, 35, 0.1)' : 'var(--nf-cyan-dim)', color: mode === 'admin' ? 'var(--nf-warning)' : 'var(--nf-cyan)', border: `1px solid ${mode === 'admin' ? 'rgba(245, 166, 35, 0.25)' : 'var(--nf-cyan-border)'}` }}>
              {mode === 'admin' ? 'ADMIN' : 'INVESTOR'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', transition: 'color var(--nf-transition-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
              <ArrowLeft size={14} /> Back to NexFrontier
            </a>
            <button onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color var(--nf-transition-fast)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--nf-negative)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--nf-text-tertiary)')}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, maxWidth: 'var(--nf-container-wide)', margin: '0 auto', width: '100%' }}>
        {/* Sidebar nav */}
        <nav style={{ width: '220px', flexShrink: 0, borderRight: '1px solid var(--nf-border)', padding: 'var(--nf-space-5) 0', display: mobileNavOpen ? 'block' : 'none' }} className="nf-drm-nav-mobile">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { onTabChange(item.id); setMobileNavOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 20px',
                background: activeTab === item.id ? 'var(--nf-cyan-dim)' : 'transparent',
                border: 'none', borderLeft: activeTab === item.id ? '2px solid var(--nf-cyan)' : '2px solid transparent',
                color: activeTab === item.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
                fontSize: '0.875rem', fontWeight: activeTab === item.id ? 600 : 500,
                cursor: 'pointer', transition: 'all var(--nf-transition-fast)',
                textAlign: 'left',
              }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop nav */}
        <nav style={{ width: '220px', flexShrink: 0, borderRight: '1px solid var(--nf-border)', padding: 'var(--nf-space-5) 0' }} className="nf-drm-nav-desktop">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '10px 20px',
                background: activeTab === item.id ? 'var(--nf-cyan-dim)' : 'transparent',
                border: 'none', borderLeft: activeTab === item.id ? '2px solid var(--nf-cyan)' : '2px solid transparent',
                color: activeTab === item.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
                fontSize: '0.875rem', fontWeight: activeTab === item.id ? 600 : 500,
                cursor: 'pointer', transition: 'all var(--nf-transition-fast)',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = 'var(--nf-bg-surface-1)'; }}
              onMouseLeave={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: 'var(--nf-space-7) var(--nf-space-7)', minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* Mobile nav toggle */}
      <button className="nf-drm-nav-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, width: '48px', height: '48px', borderRadius: '50%', background: 'var(--nf-cyan)', border: 'none', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
        {mobileNavOpen ? <X size={20} color="#041014" /> : <Settings size={20} color="#041014" />}
      </button>

      <style>{`
        @media (max-width: 900px) {
          .nf-drm-nav-desktop { display: none !important; }
          .nf-drm-nav-mobile { display: ${mobileNavOpen ? 'block' : 'none'} !important; position: absolute; top: 64px; left: 0; right: 0; background: var(--nf-bg-secondary); z-index: 40; border-bottom: 1px solid var(--nf-border); width: 100% !important; }
          .nf-drm-nav-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nf-drm-nav-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Investor Data Room View
// ============================================================
import { DataRoomHome } from '@/components/drm/DataRoomHome';

export function InvestorDataRoomView({ investor, sessionToken, onLogout }: { investor: Investor; sessionToken: string; onLogout: () => void }) {
  return <DataRoomHome investor={investor} onLogout={onLogout} />;
}

