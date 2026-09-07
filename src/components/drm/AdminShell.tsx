'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BarChart3, Users, FileText, Activity, ShieldCheck,
  Settings, Lock, LogOut, ArrowLeft, X, AlertCircle, Loader2,
  Search, ChevronRight, AlertTriangle,
} from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type AdminTab = 'overview' | 'requests' | 'invitations' | 'investors' | 'activity' | 'content' | 'admins' | 'audit';
type AdminState = 'checking' | 'login' | 'activate' | 'authorised';

interface ContentSection { label: string; body: string; evidence_state?: string }

interface ContentPageRecord {
  id: string; slug: string; title: string; question: string;
  status: string; sort_order: number; security_level: string;
  searchable: boolean; printable: boolean;
  created_at: string; updated_at: string;
  current_published_version_id: string | null;
  current_published_version: { version_number: number; published_at: string; published_by_name: string } | null;
  current_draft: { version_number: number; created_at: string } | null;
}

interface ContentPageDetail {
  page: ContentPageRecord;
  versions: Array<{
    id: string; version_number: number; content_json: Record<string, unknown>;
    change_note: string | null; content_hash: string | null;
    created_at: string; created_by: string | null; created_by_name: string;
    published_at: string | null; published_by: string | null; published_by_name: string;
    is_published: boolean;
  }>;
  materials: Array<{ id: string; title: string; description: string | null; material_type: string; status: string; printable: boolean; created_at: string }>;
}

interface AdminInfo { id: string; name: string; email: string; role: string }

interface InvestorRecord {
  id: string; name: string; email: string; phone?: string;
  source?: string; organisation?: string; role?: string;
  status: string; lifecycle_status?: string;
  nda_signed: boolean; access_level: number;
  request_date?: string; invite_date?: string;
  first_activation?: string; last_access?: string;
  created_at: string;
  relationship_owner_id?: string;
  approved_at?: string; approved_by?: string;
  suspended_at?: string; revoked_at?: string;
  is_test_investor?: boolean;
}

interface RequestRecord {
  id: string; name: string; email: string; phone?: string;
  organisation?: string; role?: string; message?: string;
  source: string; status: string; investor_id?: string;
  created_at: string;
}

interface NoteRecord {
  id: string; investor_id?: string; request_id?: string;
  admin_id: string; note_text: string; created_at: string;
}

interface AuditEvent {
  id: string; event_type: string; investor_id?: string;
  request_id?: string; admin_id?: string;
  event_metadata?: Record<string, unknown>; created_at: string;
  area?: string; investor_name?: string; admin_name?: string;
}

interface AdminRecord {
  id: string; name: string; email: string;
  role: string; admin_status: string;
  created_at: string; created_by?: string;
  activated_at?: string; last_login_at?: string;
  suspended_at?: string; suspended_by?: string;
  removed_at?: string; removed_by?: string;
}

interface MgmtData {
  requests: RequestRecord[];
  investors: InvestorRecord[];
  notes: NoteRecord[];
  auditEvents: AuditEvent[];
  admins: AdminRecord[];
}

const ROLE_PERMISSIONS: Record<string, Set<string>> = {
  super_admin: new Set(['overview', 'requests', 'invitations', 'investors', 'activity', 'content', 'admins', 'audit']),
  investor_admin: new Set(['overview', 'requests', 'invitations', 'investors', 'activity', 'audit']),
  content_admin: new Set(['overview', 'content', 'audit']),
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'SUPER ADMIN',
  investor_admin: 'INVESTOR ADMIN',
  content_admin: 'CONTENT ADMIN',
};

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
  { id: 'requests', label: 'Requests', icon: <FileText size={18} /> },
  { id: 'invitations', label: 'Invitations', icon: <Users size={18} /> },
  { id: 'investors', label: 'Investors', icon: <Users size={18} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={18} /> },
  { id: 'content', label: 'Content', icon: <FileText size={18} /> },
  { id: 'admins', label: 'Admins', icon: <ShieldCheck size={18} /> },
  { id: 'audit', label: 'Audit', icon: <Settings size={18} /> },
];

const LIFECYCLE_LABELS: Record<string, string> = {
  requested: 'Requested',
  approved_awaiting_activation: 'Approved — Awaiting Activation',
  invited_awaiting_activation: 'Invited — Awaiting Activation',
  active: 'Active',
  suspended: 'Suspended',
  revoked: 'Revoked',
  declined: 'Declined',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--nf-positive)',
  suspended: 'var(--nf-warning)',
  revoked: 'var(--nf-negative)',
  invited: 'var(--nf-cyan)',
  pending: 'var(--nf-text-tertiary)',
  declined: 'var(--nf-text-tertiary)',
};

function formatDate(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-NZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function MetricPanel({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{
      padding: 'var(--nf-space-5)',
      background: 'var(--nf-bg-surface-1)',
      border: '1px solid var(--nf-border)',
      borderRadius: 'var(--nf-radius-panel)',
    }}>
      <span style={{
        display: 'block', fontSize: '0.6875rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--nf-text-tertiary)', marginBottom: 'var(--nf-space-3)',
      }}>{label}</span>
      <p style={{
        fontSize: '1.5rem', fontWeight: 700,
        color: color || 'var(--nf-text-primary)',
        margin: 0,
      }}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || 'var(--nf-text-tertiary)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontSize: '0.6875rem', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: '999px',
      background: 'var(--nf-bg-surface-2)',
      color, border: `1px solid ${color}33`,
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
      {status}
    </span>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-5)',
    }} onClick={onCancel}>
      <div style={{
        maxWidth: '420px', width: '100%',
        background: 'var(--nf-bg-secondary)',
        border: '1px solid var(--nf-border)',
        borderRadius: 'var(--nf-radius-panel)',
        padding: 'var(--nf-space-7)',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-4)' }}>
          <AlertTriangle size={20} color="var(--nf-warning)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-primary)', margin: 0 }}>Confirm action</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--nf-space-5)' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 16px', borderRadius: 'var(--nf-radius-button)',
            background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
            color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '8px 16px', borderRadius: 'var(--nf-radius-button)',
            background: 'var(--nf-cyan)', border: 'none',
            color: '#041014', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
          }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>{title}</h2>
      <div style={{
        padding: 'var(--nf-space-7)', background: 'var(--nf-bg-surface-1)',
        border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', textAlign: 'center',
      }}>
        <Lock size={32} color="var(--nf-text-tertiary)" style={{ margin: '0 auto var(--nf-space-4)' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', maxWidth: '400px', margin: '0 auto' }}>
          This capability is scaffolded for future implementation. No data is shown until the backend is connected.
        </p>
      </div>
    </div>
  );
}

function AdminShellInner() {
  const searchParams = useSearchParams();
  const activationToken = searchParams.get('activate');
  const [adminState, setAdminState] = useState<AdminState>('checking');
  const [tab, setTab] = useState<AdminTab>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activationPassphrase, setActivationPassphrase] = useState('');
  const [activationConfirm, setActivationConfirm] = useState('');
  const [activationError, setActivationError] = useState('');
  const [activationLoading, setActivationLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [mgmtData, setMgmtData] = useState<MgmtData | null>(null);
  const [mgmtLoading, setMgmtLoading] = useState(false);
  const [adminMgmtData, setAdminMgmtData] = useState<{ admins: AdminRecord[]; adminNotes: { id: string; admin_id: string; author_id: string; note_text: string; created_at: string }[]; currentAdminId: string; currentAdminRole: string } | null>(null);
  const [auditConsoleData, setAuditConsoleData] = useState<{ events: AuditEvent[]; adminRole: string } | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  const [addAdminForm, setAddAdminForm] = useState({ name: '', email: '', role: 'investor_admin', note: '' });
  const [devActivationUrl, setDevActivationUrl] = useState<string | null>(null);
  const [auditAreaFilter, setAuditAreaFilter] = useState('');
  const [auditEventFilter, setAuditEventFilter] = useState('');
  const [contentPages, setContentPages] = useState<ContentPageRecord[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [selectedContentPage, setSelectedContentPage] = useState<ContentPageDetail | null>(null);
  const [contentSearchQuery, setContentSearchQuery] = useState('');
  const [contentStatusFilter, setContentStatusFilter] = useState('all');
  const [editingDraft, setEditingDraft] = useState<{ draftId: string; versionNumber: number; sections: ContentSection[]; changeNote: string; revisionToken: string } | null>(null);
  const [contentSaving, setContentSaving] = useState(false);
  const [publishForm, setPublishForm] = useState<{ draftId: string; changeNote: string; updateType: string; notifyInvestors: boolean } | null>(null);
  const [overviewData, setOverviewData] = useState<{
    pendingRequests: number; activeInvestors: number; expiringTokens: number;
    awaitingActivation: number; recentActivity: AuditEvent[]; contentUpdates: string;
  } | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; action: () => Promise<void> } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorRecord | null>(null);
  const [noteText, setNoteText] = useState('');
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', organisation: '', role: '', owner: '', note: '', isTest: false });

  const getAdminToken = () => sessionStorage.getItem('drm_admin_token');

  const apiCall = useCallback(async (action: string, body: Record<string, unknown> = {}) => {
    const token = getAdminToken();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-admin?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': ANON_KEY || '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || 'Action failed');
    return data;
  }, []);

  const loadOverview = useCallback(async () => {
    try {
      const data = await apiCall('overview');
      setOverviewData(data.overview);
      if (data.adminRole) setAdminInfo(prev => prev ? { ...prev, role: data.adminRole } : prev);
    } catch { /* ignore */ }
  }, [apiCall]);

  const loadMgmt = useCallback(async () => {
    setMgmtLoading(true);
    try {
      const data = await apiCall('investor-mgmt');
      setMgmtData({
        requests: data.requests || [],
        investors: data.investors || [],
        notes: data.notes || [],
        auditEvents: data.auditEvents || [],
        admins: data.admins || [],
      });
    } catch { /* ignore */ }
    finally { setMgmtLoading(false); }
  }, [apiCall]);

  const loadAdminMgmt = useCallback(async () => {
    try {
      const data = await apiCall('admin-mgmt');
      setAdminMgmtData({ admins: data.admins || [], adminNotes: data.adminNotes || [], currentAdminId: data.currentAdminId, currentAdminRole: data.currentAdminRole });
    } catch { /* ignore */ }
  }, [apiCall]);

  const loadAuditConsole = useCallback(async () => {
    setAuditLoading(true);
    try {
      const data = await apiCall('audit-console', { area: auditAreaFilter, eventType: auditEventFilter });
      setAuditConsoleData({ events: data.events || [], adminRole: data.adminRole });
    } catch { /* ignore */ }
    finally { setAuditLoading(false); }
  }, [apiCall, auditAreaFilter, auditEventFilter]);

  const contentApiCall = useCallback(async (action: string, body: Record<string, unknown> = {}) => {
    const token = getAdminToken();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-content-admin?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY || '' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.message || 'Content action failed');
    return data;
  }, [getAdminToken]);

  const loadContentPages = useCallback(async () => {
    setContentLoading(true);
    try {
      const data = await contentApiCall('list-pages');
      setContentPages(data.pages || []);
    } catch { /* ignore */ }
    finally { setContentLoading(false); }
  }, [contentApiCall]);

  const loadContentPage = useCallback(async (pageId: string) => {
    try {
      const data = await contentApiCall('get-page', { pageId });
      setSelectedContentPage(data);
    } catch { /* ignore */ }
  }, [contentApiCall]);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('drm_admin_token');
    const savedAdmin = sessionStorage.getItem('drm_admin');
    if (savedToken && savedAdmin) {
      setAdminInfo(JSON.parse(savedAdmin));
      setAdminState('authorised');
    } else if (activationToken) {
      setAdminState('activate');
    } else {
      setAdminState('login');
    }
  }, [activationToken]);

  useEffect(() => {
    if (adminState === 'authorised') {
      loadOverview();
      loadMgmt();
    }
  }, [adminState, loadOverview, loadMgmt]);

  useEffect(() => {
    if (adminState === 'authorised' && tab === 'admins') loadAdminMgmt();
    if (adminState === 'authorised' && tab === 'audit') loadAuditConsole();
    if (adminState === 'authorised' && tab === 'content') loadContentPages();
  }, [adminState, tab, loadAdminMgmt, loadAuditConsole, loadContentPages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-admin?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ email: adminEmail, passphrase: adminPass }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.message || 'Admin login failed.');
        return;
      }
      sessionStorage.setItem('drm_admin_token', data.adminToken);
      sessionStorage.setItem('drm_admin', JSON.stringify(data.admin));
      setAdminInfo(data.admin);
      setAdminState('authorised');
    } catch {
      setLoginError('Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivationError('');

    if (!activationToken) {
      setActivationError('Missing activation token. Please use the link from your invitation email.');
      return;
    }
    if (activationPassphrase.length < 12) {
      setActivationError('Passphrase must be at least 12 characters.');
      return;
    }
    if (activationPassphrase !== activationConfirm) {
      setActivationError('Passphrases do not match.');
      return;
    }

    setActivationLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-admin-activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ activationToken, passphrase: activationPassphrase }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setActivationError(data.message || 'Activation failed.');
        return;
      }
      sessionStorage.setItem('drm_admin_token', data.adminToken);
      sessionStorage.setItem('drm_admin', JSON.stringify(data.admin));
      setAdminInfo(data.admin);
      setAdminState('authorised');
    } catch {
      setActivationError('Activation failed. Please try again.');
    } finally {
      setActivationLoading(false);
    }
  };

  const handleLogout = () => {
    const token = getAdminToken();
    if (token) {
      fetch(`${SUPABASE_URL}/functions/v1/drm-admin?action=logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: '{}',
      }).catch(() => {});
    }
    sessionStorage.removeItem('drm_admin_token');
    sessionStorage.removeItem('drm_admin');
    setAdminInfo(null);
    setAdminState('login');
    setAdminEmail('');
    setAdminPass('');
  };

  const doAction = async (message: string, action: () => Promise<void>) => {
    setConfirm({ message, action: async () => { await action(); setConfirm(null); } });
  };

  const executeAction = async (fn: () => Promise<void>) => {
    setActionLoading(true);
    try { await fn(); await loadMgmt(); await loadOverview(); }
    catch (e) { /* show error */ }
    finally { setActionLoading(false); }
  };

  const approveRequest = async (req: RequestRecord) => {
    await apiCall('send-invite', {
      name: req.name, email: req.email, phone: req.phone,
      source: req.source, requestId: req.id,
    });
  };

  const declineRequest = async (req: RequestRecord) => {
    await apiCall('decline-request', { requestId: req.id });
  };

  const sendInvitation = async () => {
    await apiCall('send-invite', {
      name: inviteForm.name, email: inviteForm.email,
      organisation: inviteForm.organisation, role: inviteForm.role,
      source: 'admin-invite',
      relationshipOwnerId: inviteForm.owner || null,
      internalNote: inviteForm.note || null,
      isTestInvestor: inviteForm.isTest,
    });
    setInviteForm({ name: '', email: '', organisation: '', role: '', owner: '', note: '', isTest: false });
  };

  const resendInvite = async (investorId: string) => {
    await apiCall('resend-invite', { investorId });
  };

  const suspendInvestor = async (investorId: string) => {
    await apiCall('suspend', { investorId });
  };

  const reactivateInvestor = async (investorId: string) => {
    await apiCall('reactivate', { investorId });
  };

  const revokeInvestor = async (investorId: string) => {
    await apiCall('revoke', { investorId });
  };

  const addNote = async (investorId?: string, requestId?: string) => {
    if (!noteText.trim()) return;
    await apiCall('add-note', { investorId, requestId, noteText: noteText.trim() });
    setNoteText('');
  };

  const assignOwner = async (investorId: string, ownerId: string | null) => {
    await apiCall('assign-owner', { investorId, ownerId });
  };

  // ---- Loading / Login states ----
  if (adminState === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
          <Loader2 size={18} className="nf-drm-spin" /> Verifying admin access...
          <style>{`.nf-drm-spin{animation:nf-spin 1s linear infinite}@keyframes nf-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (adminState === 'activate') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-6)' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--nf-space-7)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-4)' }}>
              <Lock size={24} color="var(--nf-cyan)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>NexFrontier Admin</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>Set your passphrase to activate your admin account.</p>
          </div>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', textDecoration: 'none', marginBottom: 'var(--nf-space-6)' }}>
            <ArrowLeft size={14} /> Back to NexFrontier
          </a>
          <form onSubmit={handleActivate} style={{
            background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)',
            display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)',
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' }}>Set a passphrase</label>
              <input type="password" value={activationPassphrase} onChange={(e) => setActivationPassphrase(e.target.value)} style={{
                width: '100%', padding: '12px 14px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                color: 'var(--nf-text-primary)', fontSize: '0.9375rem', outline: 'none',
              }} placeholder="At least 12 characters" autoFocus />
              <p style={{ fontSize: '0.75rem', marginTop: '4px', color: activationPassphrase.length >= 12 ? 'var(--nf-positive, #22c55e)' : 'var(--nf-text-tertiary)' }}>
                {activationPassphrase.length}/12 characters minimum{activationPassphrase.length >= 12 ? ' ✓' : ''}
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' }}>Confirm passphrase</label>
              <input type="password" value={activationConfirm} onChange={(e) => setActivationConfirm(e.target.value)} style={{
                width: '100%', padding: '12px 14px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                color: 'var(--nf-text-primary)', fontSize: '0.9375rem', outline: 'none',
              }} placeholder="Re-enter your passphrase" />
              {activationConfirm.length > 0 && (
                <p style={{ fontSize: '0.75rem', marginTop: '4px', color: activationConfirm === activationPassphrase ? 'var(--nf-positive, #22c55e)' : 'var(--nf-negative)' }}>
                  {activationConfirm === activationPassphrase ? 'Passphrases match ✓' : 'Passphrases do not match yet'}
                </p>
              )}
            </div>
            {activationError && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{activationError}</p>}
            <button type="submit" disabled={activationLoading || activationPassphrase.length < 12 || activationConfirm !== activationPassphrase} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 18px', borderRadius: 'var(--nf-radius-button)',
              background: 'var(--nf-cyan)', color: '#041014',
              fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              opacity: activationLoading || activationPassphrase.length < 12 || activationConfirm !== activationPassphrase ? 0.4 : 1,
            }}>{activationLoading ? 'Activating...' : 'Activate account'}</button>
            <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>This passphrase will be used for admin login on future visits. This link can only be used once.</p>
          </form>
        </div>
      </div>
    );
  }

  if (adminState === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-6)' }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--nf-space-7)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-4)' }}>
              <Lock size={24} color="var(--nf-cyan)" />
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>NexFrontier Admin</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>Authorised NexFrontier personnel only.</p>
          </div>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', textDecoration: 'none', marginBottom: 'var(--nf-space-6)' }}>
            <ArrowLeft size={14} /> Back to NexFrontier
          </a>
          <form onSubmit={handleLogin} style={{
            background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)',
            display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)',
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' }}>Admin email</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={{
                width: '100%', padding: '12px 14px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                color: 'var(--nf-text-primary)', fontSize: '0.9375rem', outline: 'none',
              }} placeholder="admin@nexfrontier.my" autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' }}>Passphrase</label>
              <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} style={{
                width: '100%', padding: '12px 14px', background: 'var(--nf-bg-surface-2)',
                border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                color: 'var(--nf-text-primary)', fontSize: '0.9375rem', outline: 'none',
              }} placeholder="Enter passphrase" />
            </div>
            {loginError && <p style={{ fontSize: '0.875rem', color: 'var(--nf-negative)' }}>{loginError}</p>}
            <button type="submit" disabled={loading || !adminEmail || !adminPass} style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '12px 18px', borderRadius: 'var(--nf-radius-button)',
              background: 'var(--nf-cyan)', color: '#041014',
              fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              opacity: loading || !adminEmail || !adminPass ? 0.4 : 1,
            }}>{loading ? 'Verifying...' : 'Admin login'}</button>
          </form>
        </div>
      </div>
    );
  }

  // ---- Authorised: render admin console ----
  const pendingRequests = (mgmtData?.requests || []).filter(r => r.status === 'pending');
  const invitedInvestors = (mgmtData?.investors || []).filter(i =>
    i.lifecycle_status === 'invited_awaiting_activation' || i.lifecycle_status === 'approved_awaiting_activation' || i.status === 'invited'
  );
  const activeInvestors = (mgmtData?.investors || []).filter(i => i.status === 'active');
  const suspendedInvestors = (mgmtData?.investors || []).filter(i => i.status === 'suspended');
  const revokedInvestors = (mgmtData?.investors || []).filter(i => i.status === 'revoked');

  const filteredInvestors = (mgmtData?.investors || []).filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return inv.name.toLowerCase().includes(q) || inv.email.toLowerCase().includes(q) ||
        (inv.organisation || '').toLowerCase().includes(q);
    }
    return true;
  });

  const notesForInvestor = (investorId: string) =>
    (mgmtData?.notes || []).filter(n => n.investor_id === investorId);
  const adminName = (adminId?: string) => {
    const admin = mgmtData?.admins.find(a => a.id === adminId);
    if (!admin) return '—';
    if (admin.admin_status && admin.admin_status !== 'active') return `${admin.name} (${admin.admin_status})`;
    return admin.name;
  };

  const orphanedOwnerIds = (mgmtData?.admins || []).filter(a => a.admin_status && a.admin_status !== 'active').map(a => a.id);
  const investorsWithOrphanedOwners = (mgmtData?.investors || []).filter(inv => inv.relationship_owner_id && orphanedOwnerIds.includes(inv.relationship_owner_id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--nf-bg-secondary)', borderBottom: '1px solid var(--nf-border)',
        padding: '0 var(--nf-space-5)',
      }}>
        <div style={{
          maxWidth: 'var(--nf-container-wide)', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-3)' }}>
            <Lock size={18} color="var(--nf-cyan)" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nf-text-primary)', letterSpacing: '-0.02em' }}>NexFrontier Admin</span>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '2px 8px', borderRadius: '999px',
              background: 'rgba(245, 166, 35, 0.1)', color: 'var(--nf-warning)',
              border: '1px solid rgba(245, 166, 35, 0.25)',
            }}>ADMIN</span>
            {adminInfo && <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>{adminInfo.name}</span>}
            {adminInfo && adminInfo.role && (
              <span style={{
                fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em',
                padding: '2px 8px', borderRadius: '999px',
                background: adminInfo.role === 'super_admin' ? 'rgba(6,182,212,0.1)' : 'var(--nf-bg-surface-2)',
                color: adminInfo.role === 'super_admin' ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
                border: `1px solid ${adminInfo.role === 'super_admin' ? 'rgba(6,182,212,0.25)' : 'var(--nf-border)'}`,
              }}>{ROLE_LABELS[adminInfo.role] || adminInfo.role}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nf-space-4)' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', textDecoration: 'none' }}>
              <ArrowLeft size={14} /> <span className="nf-drm-back-label">Back to NexFrontier</span>
            </a>
            <button onClick={handleLogout} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)',
              background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <LogOut size={14} /> <span className="nf-drm-exit-label">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Placeholder NDA warning */}
      <div style={{
        background: 'rgba(245, 166, 35, 0.08)',
        borderBottom: '1px solid rgba(245, 166, 35, 0.2)',
        padding: '10px var(--nf-space-5)',
        display: 'flex', alignItems: 'center', gap: '8px',
        justifyContent: 'center',
      }}>
        <AlertTriangle size={14} color="var(--nf-warning)" />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--nf-warning)' }}>
          PRODUCTION INVESTOR ACCESS DISABLED — Current Investor NDA is a placeholder and must be replaced before real investor access is issued.
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, maxWidth: 'var(--nf-container-wide)', margin: '0 auto', width: '100%' }}>
        {/* Mobile nav */}
        <nav className="nf-drm-admin-nav-mobile" style={{
          width: '100%', position: 'absolute', top: '100px', left: 0, right: 0,
          background: 'var(--nf-bg-secondary)', zIndex: 40, borderBottom: '1px solid var(--nf-border)',
          display: mobileNavOpen ? 'block' : 'none',
        }}>
          {NAV_ITEMS.filter(item => {
            const perms = adminInfo?.role ? ROLE_PERMISSIONS[adminInfo.role] : null;
            return !perms || perms.has(item.id);
          }).map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setMobileNavOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 20px',
              background: tab === item.id ? 'var(--nf-cyan-dim)' : 'transparent',
              border: 'none', borderLeft: tab === item.id ? '2px solid var(--nf-cyan)' : '2px solid transparent',
              color: tab === item.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
              fontSize: '0.875rem', fontWeight: tab === item.id ? 600 : 500, cursor: 'pointer', textAlign: 'left',
            }}>{item.icon} {item.label}</button>
          ))}
        </nav>

        {/* Desktop nav */}
        <nav className="nf-drm-admin-nav-desktop" style={{
          width: '220px', flexShrink: 0, borderRight: '1px solid var(--nf-border)', padding: 'var(--nf-space-5) 0',
        }}>
          {NAV_ITEMS.filter(item => {
            const perms = adminInfo?.role ? ROLE_PERMISSIONS[adminInfo.role] : null;
            return !perms || perms.has(item.id);
          }).map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 20px',
              background: tab === item.id ? 'var(--nf-cyan-dim)' : 'transparent',
              border: 'none', borderLeft: tab === item.id ? '2px solid var(--nf-cyan)' : '2px solid transparent',
              color: tab === item.id ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)',
              fontSize: '0.875rem', fontWeight: tab === item.id ? 600 : 500, cursor: 'pointer', textAlign: 'left',
              transition: 'all var(--nf-transition-fast)',
            }}
              onMouseEnter={e => { if (tab !== item.id) e.currentTarget.style.background = 'var(--nf-bg-surface-1)'; }}
              onMouseLeave={e => { if (tab !== item.id) e.currentTarget.style.background = 'transparent'; }}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, padding: 'var(--nf-space-7) var(--nf-space-7)', minWidth: 0, overflowX: 'auto' }}>
          {actionLoading && (
            <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
              <Loader2 size={14} className="nf-drm-spin" /> Processing...
            </div>
          )}

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Overview</h2>
              {overviewData ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--nf-space-4)' }}>
                  <MetricPanel label="Pending Requests" value={overviewData.pendingRequests} color={overviewData.pendingRequests > 0 ? 'var(--nf-warning)' : undefined} />
                  <MetricPanel label="Awaiting Activation" value={overviewData.awaitingActivation} />
                  <MetricPanel label="Active Investors" value={overviewData.activeInvestors} color="var(--nf-positive)" />
                  <MetricPanel label="Expiring Tokens (24h)" value={overviewData.expiringTokens} color={overviewData.expiringTokens > 0 ? 'var(--nf-warning)' : undefined} />
                  <MetricPanel label="Recent Activity" value={overviewData.recentActivity.length} />
                  <MetricPanel label="Content Updates" value={overviewData.contentUpdates} />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              )}
              {overviewData && overviewData.recentActivity.length > 0 && (
                <div style={{ marginTop: 'var(--nf-space-7)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Recent Activity</h3>
                  <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Event</th>
                          <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overviewData.recentActivity.map((ev, i) => (
                          <tr key={ev.id || i} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                            <td style={{ padding: '8px 12px', color: 'var(--nf-text-secondary)' }}>{ev.event_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</td>
                            <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDateTime(ev.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* REQUESTS */}
          {tab === 'requests' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Requests</h2>
              {mgmtLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              ) : pendingRequests.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>No pending requests.</p>
              ) : (
                <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                        {['Name', 'Email', 'Organisation', 'Requested', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map(req => (
                        <tr key={req.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>{req.name}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{req.email}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{req.organisation || '—'}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(req.created_at)}</td>
                          <td style={{ padding: '10px 12px' }}><StatusBadge status={req.status} /></td>
                          <td style={{ padding: '10px 12px', display: 'flex', gap: '8px' }}>
                            <button onClick={() => doAction(
                              `Approve ${req.name}'s request and issue a 48-hour activation link?`,
                              () => executeAction(() => approveRequest(req))
                            )} style={{
                              padding: '5px 12px', borderRadius: 'var(--nf-radius-button)',
                              background: 'var(--nf-cyan)', color: '#041014',
                              fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                            }}>Approve</button>
                            <button onClick={() => doAction(
                              `Decline ${req.name}'s access request?`,
                              () => executeAction(() => declineRequest(req))
                            )} style={{
                              padding: '5px 12px', borderRadius: 'var(--nf-radius-button)',
                              background: 'transparent', color: 'var(--nf-negative)',
                              fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer',
                            }}>Decline</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* All requests (non-pending) */}
              {(mgmtData?.requests || []).filter(r => r.status !== 'pending').length > 0 && (
                <div style={{ marginTop: 'var(--nf-space-7)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>Processed Requests</h3>
                  <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          {['Name', 'Email', 'Organisation', 'Requested', 'Status'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(mgmtData?.requests || []).filter(r => r.status !== 'pending').map(req => (
                          <tr key={req.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>{req.name}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{req.email}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{req.organisation || '—'}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(req.created_at)}</td>
                            <td style={{ padding: '10px 12px' }}><StatusBadge status={req.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INVITATIONS */}
          {tab === 'invitations' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Invitations</h2>
              {/* Direct invitation form */}
              <div style={{
                background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
                borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-6)',
                marginBottom: 'var(--nf-space-7)', maxWidth: '560px',
              }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-cyan)', marginBottom: 'var(--nf-space-4)' }}>Send Direct Invitation</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--nf-space-3)' }}>
                  <input placeholder="Full name" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  <input placeholder="Email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  <input placeholder="Organisation" value={inviteForm.organisation} onChange={e => setInviteForm({ ...inviteForm, organisation: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  <input placeholder="Role/title" value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  <select value={inviteForm.owner} onChange={e => setInviteForm({ ...inviteForm, owner: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none', gridColumn: '1 / -1' }}>
                    <option value="">Relationship owner (optional)</option>
                    {(mgmtData?.admins || []).filter(a => !a.admin_status || a.admin_status === 'active').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                  <textarea placeholder="Internal note (optional)" value={inviteForm.note} onChange={e => setInviteForm({ ...inviteForm, note: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none', gridColumn: '1 / -1', minHeight: '60px', resize: 'vertical' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1', fontSize: '0.8125rem', color: 'var(--nf-text-secondary)' }}>
                    <input type="checkbox" checked={inviteForm.isTest} onChange={e => setInviteForm({ ...inviteForm, isTest: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                    Mark as TEST investor (dev only — permits manual activation URL delivery)
                  </label>
                </div>
                <button onClick={() => doAction(
                  `Send invitation to ${inviteForm.name || 'this investor'}? A 48-hour activation link will be issued.`,
                  () => executeAction(sendInvitation)
                )} disabled={!inviteForm.name || !inviteForm.email} style={{
                  marginTop: 'var(--nf-space-4)', padding: '10px 18px', borderRadius: 'var(--nf-radius-button)',
                  background: 'var(--nf-cyan)', color: '#041014',
                  fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                  opacity: !inviteForm.name || !inviteForm.email ? 0.4 : 1,
                }}>Send Investor Invitation</button>
              </div>

              {/* Invitation status table */}
              {invitedInvestors.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>No invitations awaiting activation.</p>
              ) : (
                <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                        {['Name', 'Email', 'Source', 'Invited', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invitedInvestors.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>
                            {inv.name}
                            {inv.is_test_investor && <span style={{ marginLeft: '6px', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,166,35,0.15)', color: 'var(--nf-warning)', border: '1px solid rgba(245,166,35,0.25)' }}>TEST</span>}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{inv.email}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{inv.source === 'admin-invite' ? 'Direct' : 'Request'}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(inv.invite_date)}</td>
                          <td style={{ padding: '10px 12px' }}><StatusBadge status={inv.status} /></td>
                          <td style={{ padding: '10px 12px' }}>
                            <button onClick={() => doAction(
                              'Issue a new activation link? The previous unused activation link will immediately stop working. The new link will expire 48 hours after issue.',
                              () => executeAction(() => resendInvite(inv.id))
                            )} style={{
                              padding: '5px 12px', borderRadius: 'var(--nf-radius-button)',
                              background: 'transparent', color: 'var(--nf-cyan)',
                              fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-cyan-border)', cursor: 'pointer',
                            }}>Fresh Link</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* INVESTORS */}
          {tab === 'investors' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Investors</h2>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 'var(--nf-space-3)', marginBottom: 'var(--nf-space-5)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
                  <Search size={14} color="var(--nf-text-tertiary)" />
                  <input placeholder="Search name, email, org..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', width: '200px' }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                  <option value="all">All statuses</option>
                  <option value="invited">Awaiting Activation</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              {mgmtLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              ) : filteredInvestors.length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>No investors found.</p>
              ) : (
                <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                        {['Name', 'Email', 'Organisation', 'Source', 'Status', 'First Activation', 'NDA', 'Owner', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvestors.map(inv => (
                        <tr key={inv.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>
                            {inv.name}
                            {inv.is_test_investor && <span style={{ marginLeft: '6px', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,166,35,0.15)', color: 'var(--nf-warning)', border: '1px solid rgba(245,166,35,0.25)' }}>TEST</span>}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{inv.email}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{inv.organisation || '—'}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{inv.source === 'admin-invite' ? 'Direct' : 'Request'}</td>
                          <td style={{ padding: '10px 12px' }}><StatusBadge status={inv.status} /></td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(inv.first_activation)}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ fontSize: '0.75rem', color: inv.nda_signed ? 'var(--nf-positive)' : 'var(--nf-text-tertiary)' }}>{inv.nda_signed ? 'Signed' : '—'}</span>
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{adminName(inv.relationship_owner_id)}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <button onClick={() => setSelectedInvestor(inv)} style={{
                              padding: '4px 10px', borderRadius: 'var(--nf-radius-button)',
                              background: 'transparent', color: 'var(--nf-cyan)',
                              fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer',
                            }}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY */}
          {tab === 'activity' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Activity</h2>
              <PlaceholderTab title="Activity" />
            </div>
          )}

          {/* CONTENT */}
          {tab === 'content' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Data Room Content</h2>
              {selectedContentPage ? (
                <div>
                  <button onClick={() => { setSelectedContentPage(null); setEditingDraft(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 'var(--nf-space-4)' }}><ArrowLeft size={14} /> Back to pages</button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-5)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)', margin: 0 }}>{selectedContentPage.page.title}</h3>
                    <StatusBadge status={selectedContentPage.page.status} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', margin: '0 0 var(--nf-space-5)' }}>{selectedContentPage.page.question}</p>
                  <div style={{ display: 'flex', gap: 'var(--nf-space-3)', marginBottom: 'var(--nf-space-6)', flexWrap: 'wrap' }}>
                    {adminInfo?.role && (adminInfo.role === 'super_admin' || adminInfo.role === 'content_admin') && (
                      <button onClick={() => doAction('Create a new draft version for this page?', async () => { const data = await contentApiCall('create-draft', { pageId: selectedContentPage.page.id }); setEditingDraft({ draftId: data.draftId, versionNumber: data.versionNumber, sections: [], changeNote: '', revisionToken: new Date().toISOString() }); })} style={{ padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Create Draft</button>
                    )}
                    {selectedContentPage.page.status === 'published' && (adminInfo?.role === 'super_admin' || adminInfo?.role === 'content_admin') && (
                      <button onClick={() => doAction('Archive this page? It will be removed from investor view. Historical versions are preserved.', () => executeAction(async () => { await contentApiCall('archive', { pageId: selectedContentPage.page.id }); loadContentPages(); setSelectedContentPage(null); }))} style={{ padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-warning)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer' }}>Archive Page</button>
                    )}
                    {selectedContentPage.page.status === 'archived' && (adminInfo?.role === 'super_admin' || adminInfo?.role === 'content_admin') && (
                      <button onClick={() => doAction('Restore this page as draft? It will need to be reviewed and published before investors can see it.', () => executeAction(async () => { await contentApiCall('restore', { pageId: selectedContentPage.page.id }); await loadContentPage(selectedContentPage.page.id); }))} style={{ padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Restore as Draft</button>
                    )}
                  </div>
                  {/* Current published version info */}
                  {selectedContentPage.versions.filter(v => v.is_published).length > 0 && (() => { const pv = selectedContentPage.versions.filter(v => v.is_published).sort((a, b) => b.version_number - a.version_number)[0]; return (
                    <div style={{ padding: '12px 16px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', marginBottom: 'var(--nf-space-5)' }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nf-positive)', marginBottom: '4px', display: 'block' }}>Current Published — v{pv.version_number}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)' }}>Published {formatDate(pv.published_at)} by {pv.published_by_name}{pv.change_note ? ` — ${pv.change_note}` : ''}</span>
                    </div>
                  ); })()}
                  {/* Draft editor */}
                  {editingDraft && (
                    <div style={{ padding: 'var(--nf-space-5)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-cyan-border)', borderRadius: 'var(--nf-radius-panel)', marginBottom: 'var(--nf-space-5)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--nf-space-4)' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--nf-cyan)' }}>Draft v{editingDraft.versionNumber}</span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '999px', background: 'rgba(245,166,35,0.1)', color: 'var(--nf-warning)', border: '1px solid rgba(245,166,35,0.25)' }}>DRAFT PREVIEW — NOT INVESTOR VISIBLE</span>
                      </div>
                      {/* Content sections editor */}
                      {editingDraft.sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: 'var(--nf-space-4)' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <input value={section.label} onChange={e => { const s = [...editingDraft.sections]; s[i] = { ...s[i], label: e.target.value }; setEditingDraft({ ...editingDraft, sections: s }); }} placeholder="Section label" style={{ flex: '0 0 200px', padding: '8px 10px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', outline: 'none' }} />
                            <select value={section.evidence_state || ''} onChange={e => { const s = [...editingDraft.sections]; s[i] = { ...s[i], evidence_state: e.target.value || undefined }; setEditingDraft({ ...editingDraft, sections: s }); }} style={{ padding: '8px 10px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                              <option value="">No evidence state</option>
                              <option value="ASSUMPTION">Assumption</option>
                              <option value="THESIS">Thesis</option>
                              <option value="EVIDENCE">Evidence</option>
                              <option value="CUSTOMER VALIDATION">Customer Validation</option>
                              <option value="PAID VALIDATION">Paid Validation</option>
                              <option value="REPEATABLE PROOF">Repeatable Proof</option>
                            </select>
                            <button onClick={() => { const s = editingDraft.sections.filter((_, j) => j !== i); setEditingDraft({ ...editingDraft, sections: s }); }} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-negative)', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
                          </div>
                          <textarea value={section.body} onChange={e => { const s = [...editingDraft.sections]; s[i] = { ...s[i], body: e.target.value }; setEditingDraft({ ...editingDraft, sections: s }); }} placeholder="Section content" style={{ width: '100%', padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none', minHeight: '80px', resize: 'vertical' }} />
                        </div>
                      ))}
                      <button onClick={() => setEditingDraft({ ...editingDraft, sections: [...editingDraft.sections, { label: '', body: '' }] })} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-tertiary)', fontSize: '0.75rem', cursor: 'pointer', marginBottom: 'var(--nf-space-4)' }}>+ Add Section</button>
                      {/* Change note */}
                      <input value={editingDraft.changeNote} onChange={e => setEditingDraft({ ...editingDraft, changeNote: e.target.value })} placeholder="Change note (optional)" style={{ width: '100%', padding: '8px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', outline: 'none', marginBottom: 'var(--nf-space-4)' }} />
                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={async () => { setContentSaving(true); try { await contentApiCall('save-draft', { draftId: editingDraft.draftId, contentJson: { sections: editingDraft.sections }, changeNote: editingDraft.changeNote, revisionToken: editingDraft.revisionToken }); setEditingDraft({ ...editingDraft, revisionToken: new Date().toISOString() }); } catch (e) { alert(e instanceof Error ? e.message : 'Save failed'); } finally { setContentSaving(false); } }} disabled={contentSaving} style={{ padding: '8px 16px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-bg-surface-2)', color: 'var(--nf-text-primary)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer' }}>{contentSaving ? 'Saving...' : 'Save Draft'}</button>
                        <a href={`/investor-data-room/${selectedContentPage.page.slug}?preview=1`} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-cyan)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-cyan-border)', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Preview</a>
                        {adminInfo?.role && (adminInfo.role === 'super_admin' || adminInfo.role === 'content_admin') && (
                          <button onClick={() => setPublishForm({ draftId: editingDraft.draftId, changeNote: editingDraft.changeNote, updateType: 'minor', notifyInvestors: false })} style={{ padding: '8px 16px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Publish</button>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Publish confirmation */}
                  {publishForm && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-5)' }} onClick={() => setPublishForm(null)}>
                      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--nf-bg-secondary)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--nf-space-4)' }}>
                          <AlertTriangle size={20} color="var(--nf-warning)" />
                          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--nf-text-primary)', margin: 0 }}>Publish version</h3>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--nf-space-4)' }}>{selectedContentPage.page.status === 'inactive' ? 'Publishing the first version will make this page visible to authorised investors.' : 'This will replace the current published version. The previous version remains in history.'}</p>
                        <div style={{ marginBottom: 'var(--nf-space-4)' }}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--nf-text-secondary)', marginBottom: '6px' }}>Update type</label>
                          <select value={publishForm.updateType} onChange={e => setPublishForm({ ...publishForm, updateType: e.target.value, notifyInvestors: e.target.value === 'material' ? publishForm.notifyInvestors : false })} style={{ width: '100%', padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', outline: 'none' }}>
                            <option value="minor">Minor</option>
                            <option value="material">Material</option>
                          </select>
                        </div>
                        {publishForm.updateType === 'material' && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
                            <input type="checkbox" checked={publishForm.notifyInvestors} onChange={e => setPublishForm({ ...publishForm, notifyInvestors: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                            Notify active investors that this page has been materially updated (pending email configuration)
                          </label>
                        )}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button onClick={() => setPublishForm(null)} style={{ padding: '8px 16px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                          <button onClick={async () => { try { await contentApiCall('publish', { draftId: publishForm.draftId, changeNote: publishForm.changeNote, updateType: publishForm.updateType, notifyInvestors: publishForm.notifyInvestors }); setPublishForm(null); setEditingDraft(null); await loadContentPage(selectedContentPage.page.id); await loadContentPages(); } catch (e) { alert(e instanceof Error ? e.message : 'Publish failed'); } }} style={{ padding: '8px 16px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', border: 'none', color: '#041014', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}>Publish</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Version history */}
                  {selectedContentPage.versions.length > 0 && (
                    <div style={{ marginTop: 'var(--nf-space-6)' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)', marginBottom: 'var(--nf-space-3)' }}>Version History</h4>
                      <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                              {['Version', 'Status', 'Created', 'By', 'Published', 'Published By', 'Change Note', 'Actions'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedContentPage.versions.map(v => (
                              <tr key={v.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>v{v.version_number}</td>
                                <td style={{ padding: '8px 12px' }}>{v.is_published ? <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--nf-positive)' }}>PUBLISHED</span> : v.published_at ? <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--nf-text-tertiary)' }}>SUPERSEDED</span> : <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--nf-warning)' }}>DRAFT</span>}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(v.created_at)}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{v.created_by_name}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(v.published_at)}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{v.published_by_name}</td>
                                <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.change_note || '—'}</td>
                                <td style={{ padding: '8px 12px' }}>{adminInfo?.role && (adminInfo.role === 'super_admin' || adminInfo.role === 'content_admin') && !v.published_at && v.id !== editingDraft?.draftId ? (
                                  <button onClick={() => doAction(`Create a new draft from v${v.version_number}?`, async () => { const data = await contentApiCall('create-from-version', { pageId: selectedContentPage.page.id, sourceVersionId: v.id }); setEditingDraft({ draftId: data.draftId, versionNumber: data.versionNumber, sections: [], changeNote: '', revisionToken: new Date().toISOString() }); })} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-cyan)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-cyan-border)', cursor: 'pointer' }}>Create Draft From</button>
                                ) : '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* Supporting materials */}
                  {selectedContentPage.materials && selectedContentPage.materials.length > 0 && (
                    <div style={{ marginTop: 'var(--nf-space-6)' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)', marginBottom: 'var(--nf-space-3)' }}>Supporting Materials</h4>
                      {selectedContentPage.materials.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', marginBottom: '6px' }}>
                          <FileText size={14} color="var(--nf-cyan)" />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 0 }}>{m.title}</p>
                            {m.description && <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-tertiary)', margin: '2px 0 0' }}>{m.description}</p>}
                          </div>
                          {m.status === 'active' && adminInfo?.role && (adminInfo.role === 'super_admin' || adminInfo.role === 'content_admin') && (
                            <button onClick={() => doAction(`Archive material "${m.title}"?`, () => executeAction(async () => { await contentApiCall('material-archive', { materialId: m.id }); await loadContentPage(selectedContentPage.page.id); }))} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-negative)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer' }}>Archive</button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : contentLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              ) : (
                <div>
                  {/* Filters */}
                  <div style={{ display: 'flex', gap: 'var(--nf-space-3)', marginBottom: 'var(--nf-space-5)' }}>
                    <select value={contentStatusFilter} onChange={e => setContentStatusFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                      <option value="all">All statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                    <input value={contentSearchQuery} onChange={e => setContentSearchQuery(e.target.value)} placeholder="Search title or slug..." style={{ flex: 1, maxWidth: '300px', padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', outline: 'none' }} />
                  </div>
                  {/* Page table */}
                  <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          {['Page', 'Status', 'Version', 'Last Updated', 'Updated By', 'Searchable', 'Printable', 'Actions'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {contentPages.filter(p => {
                          if (contentStatusFilter !== 'all' && p.status !== contentStatusFilter) return false;
                          if (contentSearchQuery.trim()) { const q = contentSearchQuery.toLowerCase(); return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q); }
                          return true;
                        }).map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>
                              {p.title}
                              <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)' }}>/{p.slug}</span>
                            </td>
                            <td style={{ padding: '10px 12px' }}><StatusBadge status={p.status} /></td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{p.current_published_version ? `v${p.current_published_version.version_number}` : '—'}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{p.current_published_version ? formatDate(p.current_published_version.published_at) : '—'}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{p.current_published_version?.published_by_name || '—'}</td>
                            <td style={{ padding: '10px 12px' }}>{p.searchable ? 'Yes' : 'No'}</td>
                            <td style={{ padding: '10px 12px' }}>{p.printable ? 'Yes' : 'No'}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <button onClick={() => loadContentPage(p.id)} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Open</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ADMINS */}
          {tab === 'admins' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>NF Administrators</h2>
              {/* Add admin form — only super_admin */}
              {adminInfo?.role === 'super_admin' && (
                <div style={{
                  background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
                  borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-6)',
                  marginBottom: 'var(--nf-space-7)', maxWidth: '560px',
                }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-cyan)', marginBottom: 'var(--nf-space-4)' }}>Add NF Admin</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--nf-space-3)' }}>
                    <input placeholder="Full name" value={addAdminForm.name} onChange={e => setAddAdminForm({ ...addAdminForm, name: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                    <input placeholder="NF email" value={addAdminForm.email} onChange={e => setAddAdminForm({ ...addAdminForm, email: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                    <select value={addAdminForm.role} onChange={e => setAddAdminForm({ ...addAdminForm, role: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }}>
                      <option value="investor_admin">Investor Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="content_admin">Content Admin</option>
                    </select>
                    <input placeholder="Internal note (optional)" value={addAdminForm.note} onChange={e => setAddAdminForm({ ...addAdminForm, note: e.target.value })} style={{ padding: '10px 12px', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.875rem', outline: 'none' }} />
                  </div>
                  <button onClick={() => doAction(
                    addAdminForm.role === 'super_admin'
                      ? `Grant Super Admin access? Super Admin can manage investors, administrators, roles and security-sensitive settings. Grant only where required.`
                      : `You are granting ${ROLE_LABELS[addAdminForm.role] || addAdminForm.role} access to the NexFrontier Investor Administration environment.`,
                    () => executeAction(async () => {
                      const data = await apiCall('invite-admin', { name: addAdminForm.name, email: addAdminForm.email, role: addAdminForm.role, internalNote: addAdminForm.note || null });
                      if (data.devActivationUrl) setDevActivationUrl(data.devActivationUrl);
                      setAddAdminForm({ name: '', email: '', role: 'investor_admin', note: '' });
                    })
                  )} disabled={!addAdminForm.name || !addAdminForm.email} style={{
                    marginTop: 'var(--nf-space-4)', padding: '10px 18px', borderRadius: 'var(--nf-radius-button)',
                    background: 'var(--nf-cyan)', color: '#041014',
                    fontSize: '0.8125rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                    opacity: !addAdminForm.name || !addAdminForm.email ? 0.4 : 1,
                  }}>Invite Admin</button>
                  {devActivationUrl && (
                    <div style={{ marginTop: 'var(--nf-space-4)', padding: '12px 14px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 'var(--nf-radius-control)' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nf-warning)', margin: '0 0 6px' }}>DEV MANUAL DELIVERY</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--nf-text-secondary)', margin: '0 0 8px' }}>This activation URL contains a secret. Share only with the intended admin. It expires 48 hours after issue and will not be shown again.</p>
                      <code style={{ fontSize: '0.6875rem', color: 'var(--nf-cyan)', wordBreak: 'break-all' }}>{devActivationUrl}</code>
                      <button onClick={() => setDevActivationUrl(null)} style={{ marginLeft: '8px', fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
                    </div>
                  )}
                </div>
              )}
              {/* Admin table */}
              {adminMgmtData ? (
                <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                        {['Name', 'Email', 'Role', 'Status', 'Created', 'Last Login', 'Actions'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(adminMgmtData.admins || []).filter(a => {
                        if (adminStatusFilter !== 'all' && a.admin_status !== adminStatusFilter) return false;
                        if (adminSearchQuery.trim()) {
                          const q = adminSearchQuery.toLowerCase();
                          return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
                        }
                        return true;
                      }).map(a => (
                        <tr key={a.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-primary)', fontWeight: 500 }}>
                            {a.name}
                            {a.id === adminMgmtData.currentAdminId && <span style={{ marginLeft: '6px', fontSize: '0.625rem', fontWeight: 700, color: 'var(--nf-cyan)' }}>(You)</span>}
                          </td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-secondary)' }}>{a.email}</td>
                          <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', color: a.role === 'super_admin' ? 'var(--nf-cyan)' : 'var(--nf-text-tertiary)' }}>{ROLE_LABELS[a.role] || a.role}</span></td>
                          <td style={{ padding: '10px 12px' }}><StatusBadge status={a.admin_status} /></td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDate(a.created_at)}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--nf-text-tertiary)' }}>{formatDateTime(a.last_login_at)}</td>
                          <td style={{ padding: '10px 12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {adminInfo?.role === 'super_admin' && a.admin_status === 'active' && a.id !== adminMgmtData.currentAdminId && (
                              <button onClick={() => doAction('Suspend this admin? Their sessions will be immediately invalidated.', () => executeAction(() => apiCall('suspend-admin', { adminId: a.id }).then(() => loadAdminMgmt())))} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'rgba(245,166,35,0.1)', color: 'var(--nf-warning)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(245,166,35,0.25)', cursor: 'pointer' }}>Suspend</button>
                            )}
                            {adminInfo?.role === 'super_admin' && a.admin_status === 'suspended' && (
                              <button onClick={() => doAction('Reactivate this admin?', () => executeAction(() => apiCall('reactivate-admin', { adminId: a.id }).then(() => loadAdminMgmt())))} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Reactivate</button>
                            )}
                            {adminInfo?.role === 'super_admin' && (a.admin_status === 'active' || a.admin_status === 'suspended') && a.id !== adminMgmtData.currentAdminId && (
                              <button onClick={() => doAction('Remove this admin? They will lose all access. Their record is preserved for audit.', () => executeAction(() => apiCall('remove-admin', { adminId: a.id }).then(() => loadAdminMgmt())))} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'rgba(239,68,68,0.1)', color: 'var(--nf-negative)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer' }}>Remove</button>
                            )}
                            {adminInfo?.role === 'super_admin' && a.admin_status === 'active' && a.id !== adminMgmtData.currentAdminId && (
                              <select value={a.role} onChange={e => { if (e.target.value !== a.role) doAction(`Change role to ${ROLE_LABELS[e.target.value] || e.target.value}?`, () => executeAction(() => apiCall('change-role', { adminId: a.id, role: e.target.value }).then(() => loadAdminMgmt()))); }} style={{ padding: '4px 8px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-bg-surface-1)', color: 'var(--nf-text-secondary)', fontSize: '0.75rem', border: '1px solid var(--nf-border)', cursor: 'pointer' }}>
                                <option value={a.role}>{ROLE_LABELS[a.role]}</option>
                                <option value="super_admin">Super Admin</option>
                                <option value="investor_admin">Investor Admin</option>
                                <option value="content_admin">Content Admin</option>
                              </select>
                            )}
                            {adminInfo?.role === 'super_admin' && a.admin_status === 'active' && (
                              <button onClick={() => doAction('Revoke all sessions for this admin? They will need to sign in again.', () => executeAction(() => apiCall('revoke-admin-sessions', { adminId: a.id })))} style={{ padding: '4px 10px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-text-tertiary)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-border)', cursor: 'pointer' }}>Revoke Sessions</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              )}
            </div>
          )}

          {/* AUDIT */}
          {tab === 'audit' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-6)' }}>Audit Trail</h2>
              {/* Filters */}
              <div style={{ display: 'flex', gap: 'var(--nf-space-3)', marginBottom: 'var(--nf-space-5)', flexWrap: 'wrap' }}>
                <select value={auditAreaFilter} onChange={e => setAuditAreaFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                  <option value="">All areas</option>
                  <option value="Requests">Requests</option>
                  <option value="Invitations">Invitations</option>
                  <option value="Investor Access">Investor Access</option>
                  <option value="NDA">NDA</option>
                  <option value="Administrators">Administrators</option>
                  <option value="Authentication">Authentication</option>
                  <option value="Security">Security</option>
                  <option value="Content">Content</option>
                </select>
                <select value={auditEventFilter} onChange={e => setAuditEventFilter(e.target.value)} style={{ padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                  <option value="">All events</option>
                  <option value="REQUEST_SUBMITTED">Request Submitted</option>
                  <option value="REQUEST_APPROVED">Request Approved</option>
                  <option value="REQUEST_DECLINED">Request Declined</option>
                  <option value="INVITATION_CREATED">Invitation Created</option>
                  <option value="ACTIVATION_TOKEN_ISSUED">Token Issued</option>
                  <option value="ACTIVATION_TOKEN_REISSUED">Token Reissued</option>
                  <option value="INVESTOR_ACTIVATED">Investor Activated</option>
                  <option value="INVESTOR_SUSPENDED">Investor Suspended</option>
                  <option value="INVESTOR_REACTIVATED">Investor Reactivated</option>
                  <option value="INVESTOR_REVOKED">Investor Revoked</option>
                  <option value="ADMIN_INVITED">Admin Invited</option>
                  <option value="ADMIN_ACTIVATED">Admin Activated</option>
                  <option value="ADMIN_LOGIN_SUCCESS">Admin Login</option>
                  <option value="ADMIN_ROLE_CHANGED">Role Changed</option>
                  <option value="ADMIN_SUSPENDED">Admin Suspended</option>
                  <option value="ADMIN_REACTIVATED">Admin Reactivated</option>
                  <option value="ADMIN_REMOVED">Admin Removed</option>
                  <option value="ADMIN_SESSION_REVOKED">Session Revoked</option>
                  <option value="CONTENT_DRAFT_CREATED">Draft Created</option>
                  <option value="CONTENT_DRAFT_SAVED">Draft Saved</option>
                  <option value="CONTENT_VERSION_PUBLISHED">Version Published</option>
                  <option value="CONTENT_PAGE_ARCHIVED">Page Archived</option>
                  <option value="CONTENT_PAGE_RESTORED">Page Restored</option>
                  <option value="CONTENT_DRAFT_CREATED_FROM_VERSION">Draft From Version</option>
                  <option value="CONTENT_SUPPORTING_MATERIAL_ADDED">Material Added</option>
                  <option value="CONTENT_SUPPORTING_MATERIAL_ARCHIVED">Material Archived</option>
                  <option value="CONTENT_NOTIFICATION_REQUESTED">Notification Requested</option>
                </select>
                <button onClick={() => loadAuditConsole()} style={{ padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Apply</button>
              </div>
              {auditLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>
                  <Loader2 size={18} className="nf-drm-spin" /> Loading...
                </div>
              ) : (auditConsoleData?.events || []).length === 0 ? (
                <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>No audit events found.</p>
              ) : (
                <div className="nf-drm-table-wrap" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--nf-border)' }}>
                        {['Time', 'Event', 'Actor', 'Target', 'Area', 'Detail'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--nf-text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(auditConsoleData?.events || []).map(ev => (
                        <tr key={ev.id} style={{ borderBottom: '1px solid var(--nf-border)' }}>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)', whiteSpace: 'nowrap' }}>{formatDateTime(ev.created_at)}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-secondary)' }}>{ev.event_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-secondary)' }}>{ev.admin_name || '—'}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-secondary)' }}>{ev.investor_name || '—'}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)' }}>{ev.area || '—'}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--nf-text-tertiary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.event_metadata ? JSON.stringify(ev.event_metadata).slice(0, 80) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Investor detail modal */}
      {selectedInvestor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--nf-space-5)',
        }} onClick={() => setSelectedInvestor(null)}>
          <div style={{
            maxWidth: '560px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
            background: 'var(--nf-bg-secondary)', border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-7)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--nf-space-5)' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)', margin: '0 0 4px' }}>{selectedInvestor.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', margin: 0 }}>{selectedInvestor.email}</p>
              </div>
              <button onClick={() => setSelectedInvestor(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nf-text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--nf-space-3)', marginBottom: 'var(--nf-space-5)' }}>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Organisation</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{selectedInvestor.organisation || '—'}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Role</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{selectedInvestor.role || '—'}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Source</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{selectedInvestor.source === 'admin-invite' ? 'Direct Invitation' : 'Request'}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Status</span><div style={{ marginTop: '2px' }}><StatusBadge status={selectedInvestor.status} /></div></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>First Activation</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{formatDateTime(selectedInvestor.first_activation)}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Last Access</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{formatDateTime(selectedInvestor.last_access)}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>NDA Signed</span><p style={{ fontSize: '0.875rem', color: selectedInvestor.nda_signed ? 'var(--nf-positive)' : 'var(--nf-text-tertiary)', margin: '2px 0 0' }}>{selectedInvestor.nda_signed ? 'Yes' : 'No'}</p></div>
              <div><span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)' }}>Owner</span><p style={{ fontSize: '0.875rem', color: 'var(--nf-text-secondary)', margin: '2px 0 0' }}>{adminName(selectedInvestor.relationship_owner_id)}</p></div>
              {selectedInvestor.is_test_investor && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: '999px', background: 'rgba(245,166,35,0.15)', color: 'var(--nf-warning)', border: '1px solid rgba(245,166,35,0.25)' }}>TEST INVESTOR</span>
                </div>
              )}
              {selectedInvestor.lifecycle_status === 'active' || selectedInvestor.status === 'active' ? (
                <div style={{ gridColumn: '1 / -1', padding: '10px 14px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)', display: 'block', marginBottom: '4px' }}>Access Authorisation</span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--nf-positive)', margin: 0, fontWeight: 600 }}>Active until revoked</p>
                </div>
              ) : null}
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--nf-space-5)' }}>
              {selectedInvestor.status === 'active' && (
                <button onClick={() => doAction('Suspend this investor\'s access? They will immediately lose Data Room access.', () => executeAction(() => suspendInvestor(selectedInvestor.id)))} style={{ padding: '6px 14px', borderRadius: 'var(--nf-radius-button)', background: 'rgba(245,166,35,0.1)', color: 'var(--nf-warning)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(245,166,35,0.25)', cursor: 'pointer' }}>Suspend</button>
              )}
              {selectedInvestor.status === 'suspended' && (
                <button onClick={() => doAction('Reactivate this investor\'s access?', () => executeAction(() => reactivateInvestor(selectedInvestor.id)))} style={{ padding: '6px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Reactivate</button>
              )}
              {(selectedInvestor.status === 'active' || selectedInvestor.status === 'suspended') && (
                <button onClick={() => doAction('Revoke this investor\'s access permanently? This will invalidate all sessions and activation tokens.', () => executeAction(() => revokeInvestor(selectedInvestor.id)))} style={{ padding: '6px 14px', borderRadius: 'var(--nf-radius-button)', background: 'rgba(239,68,68,0.1)', color: 'var(--nf-negative)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.25)', cursor: 'pointer' }}>Revoke</button>
              )}
              {(selectedInvestor.status === 'invited' || selectedInvestor.lifecycle_status === 'invited_awaiting_activation' || selectedInvestor.lifecycle_status === 'approved_awaiting_activation') && (
                <button onClick={() => doAction('Issue a new activation link? The previous unused link will immediately stop working. The new link will expire 48 hours after issue.', () => executeAction(() => resendInvite(selectedInvestor.id)))} style={{ padding: '6px 14px', borderRadius: 'var(--nf-radius-button)', background: 'transparent', color: 'var(--nf-cyan)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--nf-cyan-border)', cursor: 'pointer' }}>Fresh Link</button>
              )}
            </div>
            {/* Owner assignment */}
            <div style={{ marginBottom: 'var(--nf-space-5)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)', display: 'block', marginBottom: '6px' }}>Relationship Owner</span>
              <select value={selectedInvestor.relationship_owner_id || ''} onChange={e => { assignOwner(selectedInvestor.id, e.target.value || null); setSelectedInvestor({ ...selectedInvestor, relationship_owner_id: e.target.value || undefined }); }} style={{ width: '100%', padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-secondary)', fontSize: '0.8125rem', outline: 'none' }}>
                <option value="">Unassigned</option>
                {(mgmtData?.admins || []).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            {/* Internal notes */}
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--nf-text-tertiary)', display: 'block', marginBottom: 'var(--nf-space-3)' }}>Internal Notes</span>
              {notesForInvestor(selectedInvestor.id).map(note => (
                <div key={note.id} style={{ padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', marginBottom: '6px' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-secondary)', margin: '0 0 4px' }}>{note.note_text}</p>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--nf-text-tertiary)' }}>{adminName(note.admin_id)} — {formatDateTime(note.created_at)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input placeholder="Add internal note..." value={noteText} onChange={e => setNoteText(e.target.value)} style={{ flex: 1, padding: '8px 12px', background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)', color: 'var(--nf-text-primary)', fontSize: '0.8125rem', outline: 'none' }} />
                <button onClick={() => executeAction(() => addNote(selectedInvestor.id))} disabled={!noteText.trim()} style={{ padding: '8px 14px', borderRadius: 'var(--nf-radius-button)', background: 'var(--nf-cyan)', color: '#041014', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', opacity: !noteText.trim() ? 0.4 : 1 }}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={() => executeAction(confirm.action)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Mobile nav toggle */}
      <button className="nf-drm-admin-nav-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)} style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 100,
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'var(--nf-cyan)', border: 'none', cursor: 'pointer',
        display: 'none', alignItems: 'center', justifyContent: 'center',
      }}>
        {mobileNavOpen ? <X size={20} color="#041014" /> : <Settings size={20} color="#041014" />}
      </button>

      <style>{`
        @media (max-width: 900px) {
          .nf-drm-admin-nav-desktop { display: none !important; }
          .nf-drm-admin-nav-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nf-drm-admin-nav-mobile { display: none !important; }
        }
        @media (max-width: 768px) {
          .nf-drm-back-label, .nf-drm-exit-label { display: none; }
        }
      `}</style>
    </div>
  );
}

export function AdminShell() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--nf-text-tertiary)', fontSize: '0.875rem' }}>Loading...</div>
      </div>
    }>
      <AdminShellInner />
    </Suspense>
  );
}
