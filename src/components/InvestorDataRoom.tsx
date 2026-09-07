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
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('drm_session_token');
    const savedAdminToken = sessionStorage.getItem('drm_admin_token');
    if (savedToken) {
      setSessionToken(savedToken);
      loginWithSession(savedToken);
    } else if (savedAdminToken) {
      setAdminToken(savedAdminToken);
      // Validate admin session
      adminCall('overview', {}, savedAdminToken).then(() => {
        const savedAdmin = sessionStorage.getItem('drm_admin');
        if (savedAdmin) {
          setAdmin(JSON.parse(savedAdmin));
          setView('admin');
        }
      }).catch(() => {
        sessionStorage.removeItem('drm_admin_token');
        sessionStorage.removeItem('drm_admin');
      });
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

  const handleAdminLogin = (adm: AdminUser, token: string) => {
    setAdmin(adm);
    setAdminToken(token);
    sessionStorage.setItem('drm_admin_token', token);
    sessionStorage.setItem('drm_admin', JSON.stringify(adm));
    setView('admin');
  };

  const handleLogout = () => {
    // Invalidate the token server-side; best-effort, local state is cleared regardless.
    if (sessionToken) {
      apiCall('drm-documents?action=logout', { method: 'GET', sessionToken }).catch(() => {});
    }
    if (adminToken) {
      adminCall('logout', {}, adminToken).catch(() => {});
    }
    setInvestor(null);
    setAdmin(null);
    setSessionToken(null);
    setAdminToken(null);
    sessionStorage.removeItem('drm_session_token');
    sessionStorage.removeItem('drm_admin_token');
    sessionStorage.removeItem('drm_admin');
    setView('secure-access');
  };

  if (view === 'secure-access') {
    return <SecureAccessScreen onInvestorActivated={handleInvestorActivated} onAdminLogin={handleAdminLogin} onReturnLogin={loginWithSession} />;
  }

  if (view === 'investor' && investor && sessionToken) {
    return <InvestorDataRoomView investor={investor} sessionToken={sessionToken} onLogout={handleLogout} />;
  }

  if (view === 'admin' && adminToken) {
    return <AdminDataRoomView admin={admin} adminToken={adminToken} onLogout={handleLogout} />;
  }

  return <SecureAccessScreen onInvestorActivated={handleInvestorActivated} onAdminLogin={handleAdminLogin} onReturnLogin={loginWithSession} />;
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
type AccessMode = 'menu' | 'token' | 'request' | 'return-login' | 'return-login-otp' | 'admin-login';

function SecureAccessScreen({
  onInvestorActivated,
  onAdminLogin,
  onReturnLogin,
}: {
  onInvestorActivated: (inv: Investor, token: string, sessionId?: string) => void;
  onAdminLogin: (adm: AdminUser, token: string) => void;
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
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminCall('login', { email: adminEmail, passphrase: adminPass }) as { ok: boolean; admin: AdminUser; adminToken: string };
      onAdminLogin(data.admin, data.adminToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin login failed.');
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
              <div style={{ height: '1px', background: 'var(--nf-border)', margin: 'var(--nf-space-2) 0' }} />
              <button onClick={() => setMode('admin-login')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'transparent', border: '1px solid var(--nf-border-soft)', borderRadius: 'var(--nf-radius-control)', cursor: 'pointer', transition: 'border-color var(--nf-transition-fast)', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem', fontWeight: 500, textAlign: 'left', width: '100%' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--nf-border-strong)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--nf-border-soft)')}>
                <Settings size={18} color="var(--nf-text-tertiary)" />
                <span>Admin Login</span>
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

          {mode === 'admin-login' && (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              <div>
                <label style={labelStyle}>Admin email</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={inputStyle} placeholder="admin@nexfrontier.my" autoFocus />
              </div>
              <div>
                <label style={labelStyle}>Passphrase</label>
                <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} style={inputStyle} placeholder="Enter passphrase" />
              </div>
              {error && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>}
              <button type="submit" disabled={loading || !adminEmail || !adminPass} style={{ ...btnStyle, opacity: loading || !adminEmail || !adminPass ? 0.4 : 1, cursor: loading || !adminEmail || !adminPass ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Logging in...' : 'Admin login'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={() => { setMode('menu'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--nf-text-tertiary)', fontSize: '0.8125rem', cursor: 'pointer', padding: '4px' }}>Back</button>
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

function InvestorOverview({ investor, folders, documents, loading, error }: { investor: Investor; folders: Folder[]; documents: Document[]; loading: boolean; error: string }) {
  const accessibleCount = documents.length;
  const folderCount = folders.length;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Overview</h2>

      {error && <div style={{ padding: '12px 16px', background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 'var(--nf-radius-control)', marginBottom: 'var(--nf-space-5)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>
      </div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--nf-space-4)', marginBottom: 'var(--nf-space-8)' }}>
        <MetricCard icon={<FileText size={20} />} label="Documents Available" value={loading ? '...' : String(accessibleCount)} />
        <MetricCard icon={<FolderKanban size={20} />} label="Folders" value={loading ? '...' : String(folderCount)} />
        <MetricCard icon={<ShieldCheck size={20} />} label="Access Level" value={`Level ${investor.access_level}`} />
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Document Folders</h3>
      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading folders...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
          {folders.map((folder) => {
            const folderDocs = documents.filter((d) => d.folder_id === folder.id);
            return (
              <div key={folder.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
                <FolderKanban size={18} color="var(--nf-cyan)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--nf-text-primary)' }}>{folder.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{folderDocs.length} document{folderDocs.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InvestorDocuments({ investor, folders, documents, loading, error, sessionToken }: { investor: Investor; folders: Folder[]; documents: Document[]; loading: boolean; error: string; sessionToken: string }) {
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const handleDocClick = async (doc: Document) => {
    try {
      await fetch(`${apiUrl('drm-documents')}?documentId=${doc.id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });
    } catch { /* logging is best-effort */ }
    window.open(doc.google_link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Documents</h2>

      {error && <div style={{ padding: '12px 16px', background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 'var(--nf-radius-control)', marginBottom: 'var(--nf-space-5)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{error}</p>
      </div>}

      {!investor.nda_signed && (
        <div style={{ padding: '12px 16px', background: 'rgba(245, 166, 35, 0.06)', border: '1px solid rgba(245, 166, 35, 0.2)', borderRadius: 'var(--nf-radius-control)', marginBottom: 'var(--nf-space-5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={16} color="var(--nf-warning)" />
          <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-secondary)' }}>You have Level 1 access (Public documents only). NDA-required documents are not visible until your NDA is signed and approved.</p>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading documents...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
          {folders.map((folder) => {
            const folderDocs = documents.filter((d) => d.folder_id === folder.id);
            const isOpen = openFolder === folder.id;
            return (
              <div key={folder.id} style={{ background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFolder(isOpen ? null : folder.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--nf-text-primary)', fontSize: '0.9375rem', fontWeight: 500 }}>
                  <FolderKanban size={18} color="var(--nf-cyan)" />
                  <span style={{ flex: 1 }}>{folder.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{folderDocs.length} doc{folderDocs.length !== 1 ? 's' : ''}</span>
                  <ChevronRight size={16} color="var(--nf-text-tertiary)" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform var(--nf-transition-fast)' }} />
                </button>
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--nf-border)', padding: 'var(--nf-space-3) var(--nf-space-5)' }}>
                    {folderDocs.length === 0 ? (
                      <p style={{ padding: 'var(--nf-space-3)', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>No documents in this folder yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {folderDocs.map((doc) => (
                          <button key={doc.id} onClick={() => handleDocClick(doc)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'transparent', border: 'none', borderRadius: 'var(--nf-radius-small)', cursor: 'pointer', textAlign: 'left', color: 'var(--nf-text-secondary)', fontSize: '0.875rem', transition: 'background var(--nf-transition-fast)', width: '100%' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--nf-bg-surface-2)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                            {doc.is_investor_brief ? <FileText size={16} color="var(--nf-cyan)" /> : <FileSpreadsheet size={16} color="var(--nf-text-tertiary)" />}
                            <span style={{ flex: 1 }}>{doc.name}</span>
                            {doc.is_investor_brief && <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nf-cyan)', padding: '2px 6px', borderRadius: '4px', background: 'var(--nf-cyan-dim)' }}>Brief</span>}
                            <ExternalLink size={14} color="var(--nf-text-tertiary)" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin Data Room View
// ============================================================
function AdminDataRoomView({ admin, adminToken, onLogout }: { admin: AdminUser | null; adminToken: string; onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'documents', label: 'Documents', icon: <FolderKanban size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    { id: 'investor-mgmt', label: 'Investor Mgmt', icon: <Users size={18} /> },
    { id: 'admin-access', label: 'Admin Access', icon: <Settings size={18} /> },
  ];

  return (
    <DataRoomShell navItems={navItems} activeTab={tab} onTabChange={(t) => setTab(t as AdminTab)} onLogout={onLogout} mode="admin">
      {tab === 'overview' && <AdminOverview adminToken={adminToken} />}
      {tab === 'documents' && <AdminDocuments adminToken={adminToken} />}
      {tab === 'analytics' && <AdminAnalytics adminToken={adminToken} />}
      {tab === 'investor-mgmt' && <AdminInvestorMgmt adminToken={adminToken} />}
      {tab === 'admin-access' && <AdminAccess adminToken={adminToken} />}
    </DataRoomShell>
  );
}

// ============================================================
// Shared UI
// ============================================================
function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-3)' }}>
        <div style={{ color: 'var(--nf-cyan)' }}>{icon}</div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>{label}</span>
      </div>
      <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--nf-text-primary)' }}>{value}</p>
    </div>
  );
}

function ExternalLink(props: { size?: number; color?: string }) {
  return <ArrowRight {...props} />;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ============================================================
// Admin Overview
// ============================================================
function AdminOverview({ adminToken }: { adminToken: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminCall('overview', {}, adminToken)
      .then((d) => setData((d as { overview: Record<string, unknown> }).overview))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [adminToken]);

  const overview = data || {};
  const mostViewed = (overview.mostViewed as Array<{ id: string; name: string; views: number }>) || [];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Overview</h2>
      {error && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--nf-space-4)', marginBottom: 'var(--nf-space-8)' }}>
        <MetricCard icon={<FileText size={20} />} label="Documents Available" value={loading ? '...' : String(overview.documentsAvailable ?? 0)} />
        <MetricCard icon={<Eye size={20} />} label="Document Views" value={loading ? '...' : String(overview.documentViews ?? 0)} />
        <MetricCard icon={<Clock size={20} />} label="Avg. Time / Session" value={loading ? '...' : 'N/A'} />
        <MetricCard icon={<Users size={20} />} label="Investors Engaged" value={loading ? '...' : String(overview.investorsEngaged ?? 0)} />
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Most Viewed</h3>
      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : mostViewed.length === 0 ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No document views yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-2)' }}>
          {mostViewed.map((doc) => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
              <FileText size={16} color="var(--nf-cyan)" />
              <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--nf-text-secondary)' }}>{doc.name}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-cyan)' }}>{doc.views} views</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin Documents
// ============================================================
function AdminDocuments({ adminToken }: { adminToken: string }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: '', googleLink: '', folderId: '', classification: 'public' });
  const [newFolderName, setNewFolderName] = useState('');
  const [actionError, setActionError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminCall('documents', {}, adminToken) as { ok: boolean; folders: Folder[]; documents: Document[] };
      setFolders(d.folders);
      setDocuments(d.documents);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    try {
      await adminCall('add-document', {
        name: newDoc.name,
        googleLink: newDoc.googleLink,
        folderId: newDoc.folderId || null,
        securityClassification: newDoc.classification,
      }, adminToken);
      setNewDoc({ name: '', googleLink: '', folderId: '', classification: 'public' });
      setShowAddDoc(false);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add document.');
    }
  };

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    try {
      await adminCall('add-folder', { name: newFolderName }, adminToken);
      setNewFolderName('');
      setShowAddFolder(false);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add folder.');
    }
  };

  const handleToggleClassification = async (doc: Document) => {
    const newClass = doc.security_classification === 'public' ? 'nda_required' : 'public';
    try {
      await adminCall('toggle-classification', { documentId: doc.id, classification: newClass }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to toggle classification.');
    }
  };

  const handleRemoveDoc = async (docId: string) => {
    try {
      await adminCall('remove-document', { documentId: docId }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to remove document.');
    }
  };

  const handleRenameFolder = async (folderId: string, currentName: string) => {
    const newName = window.prompt('Rename folder:', currentName);
    if (newName && newName !== currentName) {
      try {
        await adminCall('rename-folder', { folderId, name: newName }, adminToken);
        loadData();
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Failed to rename folder.');
      }
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' };
  const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--nf-space-6)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>Documents</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowAddFolder(!showAddFolder)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-secondary)', border: '1px solid var(--nf-border-strong)' }}><Plus size={14} /> Add Folder</button>
          <button onClick={() => setShowAddDoc(!showAddDoc)} style={btnStyle}><Plus size={14} /> Add Document</button>
        </div>
      </div>

      {actionError && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{actionError}</p>}
      {error && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{error}</p>}

      {showAddFolder && (
        <form onSubmit={handleAddFolder} style={{ display: 'flex', gap: '10px', marginBottom: 'var(--nf-space-5)' }}>
          <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} style={inputStyle} placeholder="Folder name" autoFocus />
          <button type="submit" style={btnStyle}>Create</button>
          <button type="button" onClick={() => setShowAddFolder(false)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>Cancel</button>
        </form>
      )}

      {showAddDoc && (
        <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--nf-space-5)', padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
          <input type="text" value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} style={inputStyle} placeholder="Document name" />
          <input type="url" value={newDoc.googleLink} onChange={(e) => setNewDoc({ ...newDoc, googleLink: e.target.value })} style={inputStyle} placeholder="Google Drive / Docs / Sheets link" />
          <select value={newDoc.folderId} onChange={(e) => setNewDoc({ ...newDoc, folderId: e.target.value })} style={inputStyle}>
            <option value="">Select folder (optional)</option>
            {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
          <select value={newDoc.classification} onChange={(e) => setNewDoc({ ...newDoc, classification: e.target.value })} style={inputStyle}>
            <option value="public">Public</option>
            <option value="nda_required">NDA required</option>
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={btnStyle}>Add Document</button>
            <button type="button" onClick={() => setShowAddDoc(false)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
          {folders.map((folder) => {
            const folderDocs = documents.filter((d) => d.folder_id === folder.id);
            return (
              <div key={folder.id} style={{ background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderBottom: folderDocs.length ? '1px solid var(--nf-border)' : 'none' }}>
                  <FolderKanban size={18} color="var(--nf-cyan)" />
                  <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 500, color: 'var(--nf-text-primary)' }}>{folder.name}</span>
                  <button onClick={() => handleRenameFolder(folder.id, folder.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)' }}><Edit3 size={14} /></button>
                </div>
                {folderDocs.length > 0 && (
                  <div style={{ padding: 'var(--nf-space-2) var(--nf-space-5) var(--nf-space-3)' }}>
                    {folderDocs.map((doc) => (
                      <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: 'var(--nf-radius-small)' }}>
                        {doc.is_investor_brief ? <FileText size={16} color="var(--nf-cyan)" /> : <FileSpreadsheet size={16} color="var(--nf-text-tertiary)" />}
                        <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--nf-text-secondary)' }}>{doc.name}</span>
                        {doc.is_investor_brief && <span style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nf-cyan)', padding: '2px 6px', borderRadius: '4px', background: 'var(--nf-cyan-dim)' }}>Brief</span>}
                        <button onClick={() => handleToggleClassification(doc)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', background: doc.security_classification === 'nda_required' ? 'rgba(248, 113, 113, 0.08)' : 'rgba(52, 211, 153, 0.08)', borderColor: doc.security_classification === 'nda_required' ? 'rgba(248, 113, 113, 0.25)' : 'rgba(52, 211, 153, 0.25)', color: doc.security_classification === 'nda_required' ? 'var(--nf-negative)' : 'var(--nf-positive)' }}>
                          {doc.security_classification === 'nda_required' ? <><Lock size={10} /> NDA</> : <><ShieldCheck size={10} /> Public</>}
                        </button>
                        <button onClick={() => handleRemoveDoc(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)', padding: '4px' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin Analytics
// ============================================================
function AdminAnalytics({ adminToken }: { adminToken: string }) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminCall('analytics', {}, adminToken)
      .then((d) => setData((d as { analytics: Record<string, unknown> }).analytics))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [adminToken]);

  const analytics = data || {};
  const leaderboard = (analytics.investorLeaderboard as Array<{ id: string; name: string; email: string; sessions: number; views: number; downloads: number; totalActivity: number }>) || [];
  const docIntel = (analytics.documentIntelligence as Array<{ id: string; name: string; views: number; security_classification: string }>) || [];
  const funnel = (analytics.dueDiligenceFunnel as { totalRequests: number; invited: number; activated: number; viewedDocuments: number; downloadedDocuments: number }) || { totalRequests: 0, invited: 0, activated: 0, viewedDocuments: 0, downloadedDocuments: 0 };
  const viewsOverTime = (analytics.viewsOverTime as Array<{ date: string; count: number }>) || [];

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Analytics</h2>
      {error && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--nf-space-4)', marginBottom: 'var(--nf-space-8)' }}>
        <MetricCard icon={<Users size={20} />} label="Active Investors" value={loading ? '...' : String(analytics.activeInvestors ?? 0)} />
        <MetricCard icon={<Activity size={20} />} label="Total Sessions" value={loading ? '...' : String(analytics.totalSessions ?? 0)} />
        <MetricCard icon={<Eye size={20} />} label="Document Views" value={loading ? '...' : String(analytics.documentViews ?? 0)} />
        <MetricCard icon={<Download size={20} />} label="Downloads" value={loading ? '...' : String(analytics.downloads ?? 0)} />
        <MetricCard icon={<Clock size={20} />} label="Avg. Session" value={loading ? '...' : 'N/A'} />
      </div>

      {/* Due Diligence Funnel */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Due Diligence Funnel</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-2)', marginBottom: 'var(--nf-space-8)' }}>
        {[
          { label: 'Total Requests', value: funnel.totalRequests },
          { label: 'Invited', value: funnel.invited },
          { label: 'Activated', value: funnel.activated },
          { label: 'Viewed Documents', value: funnel.viewedDocuments },
          { label: 'Downloaded Documents', value: funnel.downloadedDocuments },
        ].map((step, i) => {
          const maxVal = Math.max(funnel.totalRequests, 1);
          const pct = (step.value / maxVal) * 100;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', minWidth: '160px' }}>{step.label}</span>
              <div style={{ flex: 1, height: '24px', background: 'var(--nf-bg-surface-1)', borderRadius: 'var(--nf-radius-small)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--nf-cyan)', borderRadius: 'var(--nf-radius-small)', transition: 'width var(--nf-transition-slow)', opacity: 0.6 + (i * 0.1) }} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-primary)', minWidth: '32px', textAlign: 'right' }}>{step.value}</span>
            </div>
          );
        })}
      </div>

      {/* Investor Leaderboard */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Investor Leaderboard</h3>
      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No investor activity yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: 'var(--nf-space-8)' }}>
          {leaderboard.map((inv, i) => (
            <div key={inv.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'var(--nf-bg-surface-1)', borderRadius: 'var(--nf-radius-small)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nf-cyan)', minWidth: '24px' }}>#{i + 1}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--nf-text-primary)' }}>{inv.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{inv.email}</p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{inv.sessions} sessions</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{inv.views} views</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{inv.downloads} downloads</span>
            </div>
          ))}
        </div>
      )}

      {/* Document Intelligence */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Document Intelligence</h3>
      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : docIntel.length === 0 ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No document views yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {docIntel.map((doc) => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'var(--nf-bg-surface-1)', borderRadius: 'var(--nf-radius-small)' }}>
              <FileText size={16} color="var(--nf-cyan)" />
              <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--nf-text-secondary)' }}>{doc.name}</span>
              <span style={{ fontSize: '0.75rem', color: doc.security_classification === 'nda_required' ? 'var(--nf-negative)' : 'var(--nf-positive)' }}>{doc.security_classification === 'nda_required' ? 'NDA' : 'Public'}</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-cyan)' }}>{doc.views} views</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin Investor Management
// ============================================================
function AdminInvestorMgmt({ adminToken }: { adminToken: string }) {
  const [requests, setRequests] = useState<InvestorRequest[]>([]);
  const [investors, setInvestors] = useState<InvestorRecord[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subTab, setSubTab] = useState<'queue' | 'active' | 'all' | 'history'>('queue');
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', phone: '' });
  const [actionError, setActionError] = useState('');
  const [inviteResult, setInviteResult] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminCall('investor-mgmt', {}, adminToken) as { ok: boolean; requests: InvestorRequest[]; investors: InvestorRecord[]; activity: ActivityLogEntry[] };
      setRequests(d.requests);
      setInvestors(d.investors);
      setActivity(d.activity);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSendInvite = async (req: InvestorRequest) => {
    setActionError('');
    try {
      const d = await adminCall('send-invite', {
        name: req.name,
        email: req.email,
        phone: req.phone,
        source: req.source,
        requestId: req.id,
      }, adminToken) as { ok: boolean; inviteToken: string };
      setInviteResult(`Invitation sent. Token: ${d.inviteToken}`);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to send invite.');
    }
  };

  const handleDirectInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    try {
      const d = await adminCall('send-invite', {
        name: inviteForm.name,
        email: inviteForm.email,
        phone: inviteForm.phone,
        source: 'admin-invite',
      }, adminToken) as { ok: boolean; inviteToken: string };
      setInviteResult(`Invitation sent. Token: ${d.inviteToken}`);
      setInviteForm({ name: '', email: '', phone: '' });
      setShowInvite(false);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to send invite.');
    }
  };

  const handleToggleNDA = async (inv: InvestorRecord) => {
    try {
      await adminCall('toggle-nda', { investorId: inv.id, ndaSigned: !inv.nda_signed }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to toggle NDA.');
    }
  };

  const handleRevoke = async (inv: InvestorRecord) => {
    if (!window.confirm(`Revoke access for ${inv.name}?`)) return;
    try {
      await adminCall('revoke', { investorId: inv.id }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to revoke.');
    }
  };

  const handleResendInvite = async (inv: InvestorRecord) => {
    try {
      const d = await adminCall('resend-invite', { investorId: inv.id }, adminToken) as { ok: boolean; inviteToken: string };
      setInviteResult(`New invitation sent. Token: ${d.inviteToken}`);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to resend.');
    }
  };

  const handleDecline = async (reqId: string) => {
    try {
      await adminCall('decline-request', { requestId: reqId }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to decline.');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' };
  const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeInvestors = investors.filter((i) => i.status === 'active');
  const allRequestors = requests;

  const subTabs = [
    { id: 'queue' as const, label: `Request Queue${pendingRequests.length ? ` (${pendingRequests.length})` : ''}` },
    { id: 'active' as const, label: `Active Investors${activeInvestors.length ? ` (${activeInvestors.length})` : ''}` },
    { id: 'all' as const, label: `All Requestors${allRequestors.length ? ` (${allRequestors.length})` : ''}` },
    { id: 'history' as const, label: 'History' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--nf-space-6)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>Investor Management</h2>
        <button onClick={() => setShowInvite(!showInvite)} style={btnStyle}><UserPlus size={14} /> Invite Investor</button>
      </div>

      {inviteResult && (
        <div style={{ padding: '12px 16px', background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: 'var(--nf-radius-control)', marginBottom: 'var(--nf-space-4)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--nf-positive)' }}>{inviteResult}</p>
        </div>
      )}
      {actionError && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{actionError}</p>}
      {error && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{error}</p>}

      {showInvite && (
        <form onSubmit={handleDirectInvite} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--nf-space-5)', padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
          <input type="text" value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} style={inputStyle} placeholder="Investor name" />
          <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} style={inputStyle} placeholder="Email address" />
          <input type="tel" value={inviteForm.phone} onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })} style={inputStyle} placeholder="Phone (optional)" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={btnStyle}><Send size={14} /> Send Invitation</button>
            <button type="button" onClick={() => setShowInvite(false)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--nf-space-5)', borderBottom: '1px solid var(--nf-border)' }}>
        {subTabs.map((st) => (
          <button key={st.id} onClick={() => setSubTab(st.id)}
            style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: subTab === st.id ? '2px solid var(--nf-cyan)' : '2px solid transparent', color: subTab === st.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'color var(--nf-transition-fast)' }}>
            {st.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : subTab === 'queue' ? (
        pendingRequests.length === 0 ? (
          <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No pending requests.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
            {pendingRequests.map((req) => (
              <div key={req.id} style={{ padding: 'var(--nf-space-4) var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 'var(--nf-space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: '4px' }}>{req.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', marginBottom: '2px' }}>{req.email}</p>
                    {req.phone && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>{req.phone}</p>}
                    {req.organisation && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>{req.organisation}{req.role ? ` - ${req.role}` : ''}</p>}
                    {req.message && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>{req.message}</p>}
                    <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', marginTop: '6px' }}>Requested: {formatDate(req.created_at)}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => handleSendInvite(req)} style={btnStyle}><Send size={14} /> Send Invite</button>
                    <button onClick={() => handleDecline(req.id)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-negative)', border: '1px solid rgba(248, 113, 113, 0.25)' }}><XCircle size={14} /> Decline</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : subTab === 'active' ? (
        activeInvestors.length === 0 ? (
          <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No active investors.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
            {activeInvestors.map((inv) => (
              <div key={inv.id} style={{ padding: 'var(--nf-space-4) var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 'var(--nf-space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: '4px' }}>{inv.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>{inv.email}</p>
                    {inv.phone && <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>{inv.phone}</p>}
                    <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>Source: {inv.source || '-'}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>Invited: {formatDate(inv.invite_date)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>Activated: {formatDate(inv.first_activation)}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>Last access: {formatDate(inv.last_access)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                    <button onClick={() => handleToggleNDA(inv)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', background: inv.nda_signed ? 'rgba(52, 211, 153, 0.08)' : 'rgba(245, 166, 35, 0.08)', borderColor: inv.nda_signed ? 'rgba(52, 211, 153, 0.25)' : 'rgba(245, 166, 35, 0.25)', color: inv.nda_signed ? 'var(--nf-positive)' : 'var(--nf-warning)' }}>
                      {inv.nda_signed ? <><CheckCircle2 size={10} /> NDA Signed</> : <><XCircle size={10} /> NDA Not Signed</>}
                    </button>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleResendInvite(inv)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-secondary)', border: '1px solid var(--nf-border-strong)' }}><RefreshCw size={12} /> Re-send</button>
                      <button onClick={() => handleRevoke(inv)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-negative)', border: '1px solid rgba(248, 113, 113, 0.25)' }}><XCircle size={12} /> Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : subTab === 'all' ? (
        allRequestors.length === 0 ? (
          <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No requests yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-2)' }}>
            {allRequestors.map((req) => (
              <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: 'var(--nf-bg-surface-1)', borderRadius: 'var(--nf-radius-small)' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--nf-text-primary)' }}>{req.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{req.email}</p>
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '999px', background: req.status === 'pending' ? 'rgba(245, 166, 35, 0.08)' : req.status === 'invited' ? 'var(--nf-cyan-dim)' : req.status === 'activated' ? 'rgba(52, 211, 153, 0.08)' : 'transparent', color: req.status === 'pending' ? 'var(--nf-warning)' : req.status === 'invited' ? 'var(--nf-cyan)' : req.status === 'activated' ? 'var(--nf-positive)' : 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>{req.status}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{formatDate(req.created_at)}</span>
              </div>
            ))}
          </div>
        )
      ) : (
        /* History */
        activity.length === 0 ? (
          <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No activity logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {activity.map((entry) => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: 'var(--nf-bg-surface-1)', borderRadius: 'var(--nf-radius-small)' }}>
                <Activity size={14} color="var(--nf-cyan)" />
                <span style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--nf-text-secondary)' }}>{entry.event_type.replace(/_/g, ' ')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{formatDate(entry.created_at)}</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// ============================================================
// Admin Access
// ============================================================
function AdminAccess({ adminToken }: { adminToken: string }) {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', passphrase: '' });
  const [actionError, setActionError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const d = await adminCall('admin-access', {}, adminToken) as { ok: boolean; admins: AdminAccount[] };
      setAdmins(d.admins);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load.');
    } finally {
      setLoading(false);
    }
  }, [adminToken]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    try {
      await adminCall('add-admin', newAdmin, adminToken);
      setNewAdmin({ name: '', email: '', passphrase: '' });
      setShowAdd(false);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add admin.');
    }
  };

  const handleRemove = async (adminId: string) => {
    if (!window.confirm('Remove this admin?')) return;
    try {
      await adminCall('remove-admin', { adminId }, adminToken);
      loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to remove admin.');
    }
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' };
  const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--nf-space-6)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>Admin Access</h2>
        <button onClick={() => setShowAdd(!showAdd)} style={btnStyle}><UserCog size={14} /> Add Admin</button>
      </div>

      {actionError && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{actionError}</p>}
      {error && <p style={{ color: 'var(--nf-negative)', fontSize: '0.875rem', marginBottom: 'var(--nf-space-4)' }}>{error}</p>}

      {showAdd && (
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--nf-space-5)', padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
          <input type="text" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} style={inputStyle} placeholder="Admin name" />
          <input type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} style={inputStyle} placeholder="Admin email" />
          <input type="password" value={newAdmin.passphrase} onChange={(e) => setNewAdmin({ ...newAdmin, passphrase: e.target.value })} style={inputStyle} placeholder="Passphrase (min 12 characters)" />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" style={btnStyle}>Add Admin</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ ...btnStyle, background: 'transparent', color: 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</p>
      ) : admins.length === 0 ? (
        <p style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>No admin accounts. Add one to get started.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-2)' }}>
          {admins.map((adm) => (
            <div key={adm.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
              <UserCog size={18} color="var(--nf-cyan)" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--nf-text-primary)' }}>{adm.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{adm.email}</p>
              </div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '999px', background: adm.is_active ? 'rgba(52, 211, 153, 0.08)' : 'transparent', color: adm.is_active ? 'var(--nf-positive)' : 'var(--nf-text-tertiary)', border: '1px solid var(--nf-border)' }}>{adm.is_active ? 'Active' : 'Inactive'}</span>
              <button onClick={() => handleRemove(adm.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)', padding: '4px' }}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Security note */}
      <div style={{ marginTop: 'var(--nf-space-8)', padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--nf-space-3)' }}>
          <ShieldCheck size={16} color="var(--nf-warning)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)' }}>Security Note</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', lineHeight: 1.55 }}>
          Admin passphrases are hashed server-side and never stored in plaintext. In preview, SHA-256 hashing is used. For production, NM should configure bcrypt or argon2 hashing via an edge function dependency for stronger security.
        </p>
      </div>
    </div>
  );
}
