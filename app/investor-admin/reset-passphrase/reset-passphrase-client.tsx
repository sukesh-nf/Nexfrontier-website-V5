'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type ResetState =
  | { status: 'verifying' }
  | { status: 'ready'; adminName: string; adminEmail: string }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export default function ResetPassphraseClient() {
  const [resetState, setResetState] = useState<ResetState>({ status: 'verifying' });
  const [token, setToken] = useState<string | null>(null);
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      setResetState({ status: 'error', message: 'No reset token provided. Please use the reset link from your administrator.' });
      return;
    }
    setToken(t);

    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-admin-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY || '' },
          body: JSON.stringify({ action: 'verify-token', token: t }),
        });
        const data = await res.json();
        if (data.ok) {
          setResetState({ status: 'ready', adminName: data.admin.name, adminEmail: data.admin.email });
        } else {
          setResetState({ status: 'error', message: data.message || 'Invalid reset token.' });
        }
      } catch {
        setResetState({ status: 'error', message: 'Unable to verify reset token. Please try again.' });
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setResetState({ status: 'submitting' });

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-admin-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY || '' },
        body: JSON.stringify({
          action: 'perform-reset',
          token,
          newPassphrase,
          confirmPassphrase,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResetState({ status: 'success' });
      } else {
        setResetState({ status: 'error', message: data.message || 'Reset failed.' });
      }
    } catch {
      setResetState({ status: 'error', message: 'Unable to complete reset. Please try again.' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-5)' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--nf-space-7)', justifyContent: 'center' }}>
          <Lock size={20} color="var(--nf-cyan)" />
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>NexFrontier</span>
          <span style={{
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: '999px',
            background: 'var(--nf-cyan-dim)', color: 'var(--nf-cyan)',
            border: '1px solid var(--nf-cyan-border)',
          }}>Admin</span>
        </div>

        {resetState.status === 'verifying' && (
          <div style={{ textAlign: 'center', padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
            <Loader2 size={28} color="var(--nf-cyan)" style={{ margin: '0 auto var(--nf-space-4)', animation: 'nf-spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', margin: 0 }}>Verifying reset token...</p>
          </div>
        )}

        {resetState.status === 'ready' && (
          <>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em', margin: '0 0 var(--nf-space-2)' }}>Reset Admin Passphrase</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '0 0 var(--nf-space-5)' }}>
              Set a new passphrase for <strong style={{ color: 'var(--nf-text-primary)' }}>{resetState.adminName}</strong> ({resetState.adminEmail}).
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--nf-text-tertiary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>New passphrase</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassphrase}
                    onChange={(e) => setNewPassphrase(e.target.value)}
                    required
                    minLength={12}
                    placeholder="At least 12 characters"
                    style={{
                      width: '100%', padding: '10px 40px 10px 14px',
                      background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
                      borderRadius: 'var(--nf-radius-control)',
                      color: 'var(--nf-text-primary)', fontSize: '0.875rem',
                      outline: 'none', transition: 'border-color var(--nf-transition-fast)',
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--nf-text-tertiary)', marginBottom: '6px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Confirm new passphrase</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    required
                    minLength={12}
                    placeholder="Re-enter new passphrase"
                    style={{
                      width: '100%', padding: '10px 40px 10px 14px',
                      background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
                      borderRadius: 'var(--nf-radius-control)',
                      color: 'var(--nf-text-primary)', fontSize: '0.875rem',
                      outline: 'none', transition: 'border-color var(--nf-transition-fast)',
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)' }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" style={{
                padding: '12px 20px', borderRadius: 'var(--nf-radius-button)',
                background: 'var(--nf-cyan)', color: '#041014',
                fontSize: '0.8125rem', fontWeight: 700, border: 'none',
                cursor: 'pointer', transition: 'transform var(--nf-transition-base)',
              }}>SET NEW PASSPHRASE</button>
            </form>
          </>
        )}

        {resetState.status === 'submitting' && (
          <div style={{ textAlign: 'center', padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)' }}>
            <Loader2 size={28} color="var(--nf-cyan)" style={{ margin: '0 auto var(--nf-space-4)', animation: 'nf-spin 0.8s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', margin: 0 }}>Updating passphrase...</p>
          </div>
        )}

        {resetState.status === 'success' && (
          <div style={{ padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.2)', marginBottom: 'var(--nf-space-5)' }}>
              <CheckCircle2 size={24} color="var(--nf-positive)" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--nf-space-3)' }}>Passphrase updated</h1>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>Your administrator passphrase has been reset. Please sign in again.</p>
            <a href="/investor-admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: 'var(--nf-radius-button)',
              background: 'var(--nf-cyan)', color: '#041014',
              fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none',
            }}>GO TO ADMIN LOGIN</a>
          </div>
        )}

        {resetState.status === 'error' && (
          <div style={{ padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.2)', marginBottom: 'var(--nf-space-5)' }}>
              <AlertCircle size={24} color="var(--nf-negative)" />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--nf-space-3)' }}>Reset failed</h1>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>{resetState.message}</p>
            <a href="/investor-admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', borderRadius: 'var(--nf-radius-button)',
              background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)',
              color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none',
            }}>
              <ArrowLeft size={14} /> Back to Admin Login
            </a>
          </div>
        )}

        <style>{`@keyframes nf-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
