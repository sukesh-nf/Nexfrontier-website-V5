// verify_jwt: false (internal admin-session-token auth, not JWT)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

async function sha256(msg: string): Promise<string> {
  const data = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  if (aBytes.length !== bBytes.length) return false;
  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }
  return result === 0;
}

function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
}

async function pbkdf2Hash(passphrase: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:600000:${saltHex}:${hashHex}`;
}

async function pbkdf2Verify(passphrase: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  const saltHex = parts[2];
  const expectedHash = parts[3];
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const derivedHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(derivedHex, expectedHash);
}

// Fixed dummy hash to equalize timing on non-existent / inactive accounts
const DUMMY_HASH = 'pbkdf2:600000:e8a6c002e2a402b09d2cc7378ab819ed:8b5440fa2318f1a1d4a28c4b040f04feb762c16cc15b6dc373e27c889fa8aa3e';

// Admin session duration: 12 hours
const ADMIN_SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
// Brute-force protection
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

// ============================================================
// PERMISSION MODEL
// ============================================================
type AdminRole = 'super_admin' | 'investor_admin' | 'content_admin';

const PERMISSIONS: Record<AdminRole, Set<string>> = {
  super_admin: new Set([
    'investor.request.view', 'investor.request.approve', 'investor.request.decline',
    'investor.invite', 'investor.access.suspend', 'investor.access.revoke', 'investor.access.reactivate',
    'investor.notes.view', 'investor.notes.write', 'investor.owner.assign',
    'admin.view', 'admin.create', 'admin.role.change', 'admin.suspend', 'admin.reactivate', 'admin.remove',
    'admin.session.revoke',
    'audit.view.full', 'content.view',
  ]),
  investor_admin: new Set([
    'investor.request.view', 'investor.request.approve', 'investor.request.decline',
    'investor.invite', 'investor.access.suspend', 'investor.access.revoke', 'investor.access.reactivate',
    'investor.notes.view', 'investor.notes.write', 'investor.owner.assign',
    'audit.view.investor',
  ]),
  content_admin: new Set([
    'content.view',
    'audit.view.content',
  ]),
};

function hasPermission(role: string | null, permission: string): boolean {
  if (!role) return false;
  const perms = PERMISSIONS[role as AdminRole];
  if (!perms) return false;
  // super_admin has audit.view.full which covers audit.view.investor and audit.view.content
  if (perms.has('audit.view.full') && (permission === 'audit.view.investor' || permission === 'audit.view.content')) return true;
  return perms.has(permission);
}

// Audit event area mapping for filtering
const EVENT_AREA: Record<string, string> = {
  REQUEST_SUBMITTED: 'Requests', REQUEST_APPROVED: 'Requests', REQUEST_DECLINED: 'Requests',
  INVITATION_CREATED: 'Invitations', ACTIVATION_TOKEN_ISSUED: 'Invitations',
  ACTIVATION_TOKEN_REISSUED: 'Invitations', ACTIVATION_TOKEN_EXPIRED_ATTEMPT: 'Invitations',
  INVESTOR_ACTIVATED: 'Investor Access', INVESTOR_SUSPENDED: 'Investor Access',
  INVESTOR_REACTIVATED: 'Investor Access', INVESTOR_REVOKED: 'Investor Access',
  LOGIN_SUCCESS: 'Authentication', LOGIN_DENIED_STATUS: 'Authentication',
  NDA_ACCEPTED: 'NDA',
  ADMIN_INVITED: 'Administrators', ADMIN_ACTIVATED: 'Administrators',
  ADMIN_LOGIN_SUCCESS: 'Authentication', ADMIN_LOGIN_FAILED: 'Authentication',
  ADMIN_ROLE_CHANGED: 'Administrators', ADMIN_SUSPENDED: 'Administrators',
  ADMIN_REACTIVATED: 'Administrators', ADMIN_REMOVED: 'Administrators',
  ADMIN_SESSION_REVOKED: 'Security',
  CONTENT_PAGE_CREATED: 'Content', CONTENT_DRAFT_CREATED: 'Content',
  CONTENT_DRAFT_SAVED: 'Content', CONTENT_VERSION_PUBLISHED: 'Content',
  CONTENT_PAGE_ARCHIVED: 'Content', CONTENT_PAGE_RESTORED: 'Content',
  CONTENT_DRAFT_CREATED_FROM_VERSION: 'Content',
  CONTENT_SUPPORTING_MATERIAL_ADDED: 'Content',
  CONTENT_SUPPORTING_MATERIAL_ARCHIVED: 'Content',
  CONTENT_NOTIFICATION_REQUESTED: 'Content',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || '';
    const body = await req.json().catch(() => ({}));

    // ============================================================
    // ADMIN LOGIN
    // ============================================================
    if (action === 'login') {
      const email = String(body.email ?? '').trim().toLowerCase();
      const passphrase = String(body.passphrase ?? '').trim();

      if (!email || !passphrase) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Email and passphrase are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const GENERIC_FAIL = 'Invalid email or passphrase.';

      const { data: admin, error: adminError } = await supabase
        .from('drm_admins')
        .select('id, name, email, is_active, passphrase_hash, failed_login_attempts, locked_until')
        .eq('email', email)
        .maybeSingle();

      if (adminError || !admin || !admin.is_active) {
        await pbkdf2Verify(passphrase, DUMMY_HASH);
        return new Response(
          JSON.stringify({ ok: false, message: GENERIC_FAIL }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Check if account is locked
      const adminLockActive = Boolean(admin.locked_until) && new Date(admin.locked_until) > new Date();
      if (adminLockActive) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Too many failed attempts. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // A lock that has already elapsed clears the failure counter, so an attacker
      // cannot keep an account permanently locked with one attempt per window.
      const adminPriorAttempts = admin.locked_until ? 0 : (admin.failed_login_attempts || 0);

      // Verify passphrase using PBKDF2
      const isMatch = await pbkdf2Verify(passphrase, admin.passphrase_hash);

      if (!isMatch) {
        const newAttemptCount = adminPriorAttempts + 1;
        const shouldLock = newAttemptCount >= MAX_FAILED_ATTEMPTS;

        await supabase
          .from('drm_admins')
          .update({
            failed_login_attempts: newAttemptCount,
            locked_until: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS).toISOString() : null,
          })
          .eq('id', admin.id);

        return new Response(
          JSON.stringify({ ok: false, message: GENERIC_FAIL }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Reset failed attempts on successful login
      await supabase
        .from('drm_admins')
        .update({ failed_login_attempts: 0, locked_until: null, last_login_at: new Date().toISOString() })
        .eq('id', admin.id);

      // Generate admin session token
      const adminToken = crypto.randomUUID();
      const adminTokenHash = await sha256(adminToken);

      await supabase.from('drm_access_tokens').insert({
        investor_id: null,
        admin_id: admin.id,
        token_hash: adminTokenHash,
        token_type: 'admin_session',
        expires_at: new Date(Date.now() + ADMIN_SESSION_DURATION_MS).toISOString(),
        is_valid: true,
      });

      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_LOGIN_SUCCESS', admin_id: admin.id,
        event_metadata: { role: admin.role },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
          adminToken,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // All other actions require admin authentication
    // ============================================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Admin authentication required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const adminToken = authHeader.replace('Bearer ', '').trim();
    const adminTokenHash = await sha256(adminToken);

    const { data: adminSession, error: sessionError } = await supabase
      .from('drm_access_tokens')
      .select('id, admin_id, expires_at, is_valid')
      .eq('token_hash', adminTokenHash)
      .eq('token_type', 'admin_session')
      .maybeSingle();

    if (sessionError || !adminSession || !adminSession.is_valid || new Date(adminSession.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Admin session expired or invalid.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Re-check the admin account at request time — do not trust the cached session
    const { data: adminAccount, error: adminAccountError } = await supabase
      .from('drm_admins')
      .select('id, is_active, admin_status, role')
      .eq('id', adminSession.admin_id)
      .maybeSingle();

    if (adminAccountError || !adminAccount || adminAccount.admin_status !== 'active') {
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('id', adminSession.id);

      return new Response(
        JSON.stringify({ ok: false, message: 'Admin access is no longer active.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const adminId = adminSession.admin_id;
    const adminRole = adminAccount.role as AdminRole;

    // Permission gate helper
    const requirePermission = (permission: string): Response | null => {
      if (!hasPermission(adminRole, permission)) {
        return new Response(
          JSON.stringify({ ok: false, code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      return null;
    };

    // ============================================================
    // ADMIN LOGOUT — invalidate the presented session token
    // ============================================================
    if (action === 'logout') {
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('id', adminSession.id);

      return new Response(
        JSON.stringify({ ok: true, message: 'Signed out.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET OVERVIEW (dashboard data)
    // ============================================================
    if (action === 'overview') {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const [
        { count: pendingRequests },
        { count: activeInvestors },
        { count: expiringTokens },
        { data: recentAudit },
        { count: awaitingActivation },
        { count: activeAdmins },
        { count: invitedAdmins },
        { count: suspendedAdmins },
      ] = await Promise.all([
        supabase.from('drm_investor_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('drm_investors').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('drm_access_tokens').select('*', { count: 'exact', head: true }).eq('is_valid', true).in('token_type', ['invitation', 're-invitation']).is('used_at', null).lt('expires_at', in24h.toISOString()).gt('expires_at', now.toISOString()),
        supabase.from('drm_audit_events').select('id, event_type, investor_id, admin_id, event_metadata, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('drm_investors').select('*', { count: 'exact', head: true }).in('lifecycle_status', ['approved_awaiting_activation', 'invited_awaiting_activation']),
        supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('admin_status', 'active'),
        supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('admin_status', 'invited'),
        supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('admin_status', 'suspended'),
      ]);

      return new Response(
        JSON.stringify({
          ok: true,
          overview: {
            pendingRequests: pendingRequests || 0,
            activeInvestors: activeInvestors || 0,
            expiringTokens: expiringTokens || 0,
            awaitingActivation: awaitingActivation || 0,
            recentActivity: recentAudit || [],
            contentUpdates: 'Not yet enabled',
            adminSummary: hasPermission(adminRole, 'admin.view') ? {
              active: activeAdmins || 0,
              invited: invitedAdmins || 0,
              suspended: suspendedAdmins || 0,
            } : null,
          },
          adminRole,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET ANALYTICS
    // ============================================================
    if (action === 'analytics') {
      const [{ data: investors }, { data: sessions }, { data: docViews }, { data: downloads }, { data: allEvents }] = await Promise.all([
        supabase.from('drm_investors').select('id, name, email, status, last_access, nda_signed').eq('status', 'active'),
        supabase.from('drm_analytics_events').select('id, investor_id, created_at').eq('event_type', 'session_start'),
        supabase.from('drm_analytics_events').select('id, investor_id, document_id, created_at').eq('event_type', 'document_view'),
        supabase.from('drm_analytics_events').select('id, investor_id, document_id, created_at').eq('event_type', 'download'),
        supabase.from('drm_analytics_events').select('id, investor_id, event_type, document_id, folder_id, session_id, created_at, duration_seconds').order('created_at', { ascending: false }).limit(500),
      ]);

      const investorActivity: Record<string, { name: string; email: string; sessions: number; views: number; downloads: number; lastAccess: string | null }> = {};
      (investors || []).forEach(inv => {
        investorActivity[inv.id] = { name: inv.name, email: inv.email, sessions: 0, views: 0, downloads: 0, lastAccess: inv.last_access };
      });
      (sessions || []).forEach(s => { if (investorActivity[s.investor_id]) investorActivity[s.investor_id].sessions++; });
      (docViews || []).forEach(v => { if (investorActivity[v.investor_id]) investorActivity[v.investor_id].views++; });
      (downloads || []).forEach(d => { if (investorActivity[d.investor_id]) investorActivity[d.investor_id].downloads++; });

      const leaderboard = Object.entries(investorActivity).map(([id, a]) => ({
        id, ...a,
        totalActivity: a.sessions + a.views + a.downloads,
      })).sort((a, b) => b.totalActivity - a.totalActivity);

      const docViewCounts: Record<string, number> = {};
      (docViews || []).forEach(v => { if (v.document_id) docViewCounts[v.document_id] = (docViewCounts[v.document_id] || 0) + 1; });

      const docIds = Object.keys(docViewCounts);
      const { data: docNames } = docIds.length > 0
        ? await supabase.from('drm_documents').select('id, name, security_classification').in('id', docIds)
        : { data: [], error: null };

      const documentIntelligence = (docNames || []).map(d => ({
        ...d,
        views: docViewCounts[d.id] || 0,
      })).sort((a, b) => b.views - a.views);

      const funnel = {
        totalRequests: 0,
        invited: 0,
        activated: 0,
        viewedDocuments: 0,
        downloadedDocuments: 0,
      };

      const { count: reqCount } = await supabase.from('drm_investor_requests').select('*', { count: 'exact', head: true });
      funnel.totalRequests = reqCount || 0;

      const { count: invitedCount } = await supabase.from('drm_investors').select('*', { count: 'exact', head: true }).in('status', ['invited', 'active']);
      funnel.invited = invitedCount || 0;

      const { count: activatedCount } = await supabase.from('drm_investors').select('*', { count: 'exact', head: true }).eq('status', 'active');
      funnel.activated = activatedCount || 0;

      const investorsWhoViewed = new Set((docViews || []).map(v => v.investor_id));
      funnel.viewedDocuments = investorsWhoViewed.size;

      const investorsWhoDownloaded = new Set((downloads || []).map(d => d.investor_id));
      funnel.downloadedDocuments = investorsWhoDownloaded.size;

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentViews = (docViews || []).filter(v => new Date(v.created_at) >= thirtyDaysAgo);
      const viewsByDay: Record<string, number> = {};
      recentViews.forEach(v => {
        const day = new Date(v.created_at).toISOString().split('T')[0];
        viewsByDay[day] = (viewsByDay[day] || 0) + 1;
      });

      return new Response(
        JSON.stringify({
          ok: true,
          analytics: {
            activeInvestors: investors?.length || 0,
            totalSessions: sessions?.length || 0,
            documentViews: docViews?.length || 0,
            downloads: downloads?.length || 0,
            avgSession: 0,
            viewsOverTime: Object.entries(viewsByDay).map(([date, count]) => ({ date, count })),
            investorLeaderboard: leaderboard,
            documentIntelligence: documentIntelligence,
            dueDiligenceFunnel: funnel,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET INVESTOR MANAGEMENT DATA
    // ============================================================
    if (action === 'investor-mgmt') {
      const permDenied = requirePermission('investor.request.view');
      if (permDenied) return permDenied;

      const [{ data: requests }, { data: investors }, { data: activity }, { data: notes }, { data: auditEvents }, { data: admins }] = await Promise.all([
        supabase.from('drm_investor_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('drm_investors').select('*').order('created_at', { ascending: false }),
        supabase.from('drm_activity_log').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('drm_internal_notes').select('id, investor_id, request_id, admin_id, note_text, created_at').order('created_at', { ascending: false }),
        supabase.from('drm_audit_events').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('drm_admins').select('id, name, email, role, admin_status').order('name', { ascending: true }),
      ]);

      const safeInvestors = (investors || []).map(inv => {
        const { passphrase_hash, failed_login_attempts, locked_until, ...rest } = inv;
        return rest;
      });
      // Also include is_test_investor in the response (it's already in rest)

      return new Response(
        JSON.stringify({
          ok: true,
          requests: requests || [],
          investors: safeInvestors,
          activity: activity || [],
          notes: notes || [],
          auditEvents: auditEvents || [],
          admins: admins || [],
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // SEND INVITE (from request or direct)
    // ============================================================
    if (action === 'send-invite') {
      const permDenied = requirePermission('investor.invite');
      if (permDenied) return permDenied;

      const name = String(body.name ?? '').trim().slice(0, 200);
      const email = String(body.email ?? '').trim().toLowerCase().slice(0, 320);
      const phone = String(body.phone ?? '').trim().slice(0, 50);
      const organisation = String(body.organisation ?? '').trim().slice(0, 200) || null;
      const role = String(body.role ?? '').trim().slice(0, 200) || null;
      const source = String(body.source ?? 'admin-invite').trim();
      const requestId = body.requestId || null;
      const relationshipOwnerId = body.relationshipOwnerId || null;
      const internalNote = String(body.internalNote ?? '').trim() || null;
      const isTestInvestor = Boolean(body.isTestInvestor);

      if (!name || !email) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Name and email are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Placeholder NDA gate: block production issuance unless test investor
      if (!isTestInvestor) {
        const { data: currentNda } = await supabase
          .from('nda_versions')
          .select('version')
          .eq('is_current', true)
          .maybeSingle();

        if (currentNda && currentNda.version === 'v1-PLACEHOLDER') {
          return new Response(
            JSON.stringify({
              ok: false,
              code: 'PRODUCTION_NDA_NOT_APPROVED',
              message: 'Production investor access cannot be issued while the current Investor NDA is a placeholder. Replace the current NDA with the NexFrontier-approved version before inviting real investors.',
            }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }

        // Non-test + no email provider = no secret returned, block issuance
        return new Response(
          JSON.stringify({
            ok: false,
            code: 'EMAIL_DELIVERY_NOT_CONFIGURED',
            message: 'Email delivery is not configured. Production invitations cannot be completed without an email provider.',
          }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // --- Test investor path: DEV manual delivery permitted ---
      const { data: existing } = await supabase
        .from('drm_investors')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      let investorId: string;

      if (existing) {
        investorId = existing.id;
        await supabase
          .from('drm_investors')
          .update({
            lifecycle_status: 'invited_awaiting_activation',
            invite_date: new Date().toISOString(),
            phone, source, organisation, role,
            relationship_owner_id: relationshipOwnerId,
            is_test_investor: true,
            suspended_at: null, suspended_by: null,
            revoked_at: null, revoked_by: null,
          })
          .eq('id', investorId);
      } else {
        const { data: newInvestor, error: invError } = await supabase
          .from('drm_investors')
          .insert({
            name, email, phone, source, organisation, role,
            lifecycle_status: 'invited_awaiting_activation',
            invite_date: new Date().toISOString(),
            relationship_owner_id: relationshipOwnerId,
            is_test_investor: true,
          })
          .select('id')
          .single();

        if (invError || !newInvestor) {
          return new Response(
            JSON.stringify({ ok: false, message: 'Unable to create investor record.' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        investorId = newInvestor.id;
      }

      // Invalidate previous unused activation tokens
      const previousTokensInvalidated = await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: new Date().toISOString() })
        .eq('investor_id', investorId)
        .in('token_type', ['invitation', 're-invitation'])
        .eq('is_valid', true)
        .is('used_at', null);

      const inviteToken = crypto.randomUUID();
      const inviteTokenHash = await sha256(inviteToken);
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      await supabase.from('drm_access_tokens').insert({
        investor_id: investorId,
        token_hash: inviteTokenHash,
        token_type: 'invitation',
        expires_at: expiresAt,
        is_valid: true,
        issued_by: adminId,
        issuance_reason: requestId ? 'approval' : 'direct_invitation',
      });

      if (requestId) {
        await supabase
          .from('drm_investor_requests')
          .update({ status: 'invited', investor_id: investorId })
          .eq('id', requestId);
      }

      if (internalNote) {
        await supabase.from('drm_internal_notes').insert({
          investor_id: investorId,
          request_id: requestId,
          admin_id: adminId,
          note_text: internalNote,
        });
      }

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 'invitation_sent',
        event_detail: { source, request_id: requestId, is_test: true },
      });

      await supabase.from('drm_audit_events').insert({
        event_type: requestId ? 'REQUEST_APPROVED' : 'INVITATION_CREATED',
        investor_id: investorId,
        request_id: requestId,
        admin_id: adminId,
        event_metadata: { source, is_test: true },
      });
      await supabase.from('drm_audit_events').insert({
        event_type: 'ACTIVATION_TOKEN_ISSUED',
        investor_id: investorId,
        admin_id: adminId,
        event_metadata: {
          reason: requestId ? 'approval' : 'direct_invitation',
          expires_in_hours: 48,
          previous_token_invalidated: previousTokensInvalidated.count !== null,
          is_test: true,
        },
      });

      // DEV manual delivery: one-time activation URL for test investors
      const activationUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/investor-data-room?token=${inviteToken}`;

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'DEV MANUAL DELIVERY — Test investor invitation issued.',
          devActivationUrl: activationUrl,
          devWarning: 'This activation URL contains a secret. Share only with the intended test recipient. It expires 48 hours after issue and will not be shown again.',
          investorId,
          isTestInvestor: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // RE-SEND INVITE (after token expiry)
    // ============================================================
    if (action === 'resend-invite') {
      const permDenied = requirePermission('investor.invite');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Check if this is a test investor
      const { data: investor } = await supabase
        .from('drm_investors')
        .select('is_test_investor')
        .eq('id', investorId)
        .maybeSingle();

      if (!investor) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor not found.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Placeholder NDA gate for non-test investors
      if (!investor.is_test_investor) {
        const { data: currentNda } = await supabase
          .from('nda_versions')
          .select('version')
          .eq('is_current', true)
          .maybeSingle();

        if (currentNda && currentNda.version === 'v1-PLACEHOLDER') {
          return new Response(
            JSON.stringify({
              ok: false,
              code: 'PRODUCTION_NDA_NOT_APPROVED',
              message: 'Production investor access cannot be issued while the current Investor NDA is a placeholder.',
            }),
            { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }

        return new Response(
          JSON.stringify({
            ok: false,
            code: 'EMAIL_DELIVERY_NOT_CONFIGURED',
            message: 'Email delivery is not configured. Fresh links for non-test investors cannot be issued.',
          }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // --- Test investor path ---
      const previousTokensInvalidated = await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: new Date().toISOString() })
        .eq('investor_id', investorId)
        .in('token_type', ['invitation', 're-invitation'])
        .eq('is_valid', true)
        .is('used_at', null);

      const inviteToken = crypto.randomUUID();
      const inviteTokenHash = await sha256(inviteToken);
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      await supabase.from('drm_access_tokens').insert({
        investor_id: investorId,
        token_hash: inviteTokenHash,
        token_type: 're-invitation',
        expires_at: expiresAt,
        is_valid: true,
        issued_by: adminId,
        issuance_reason: 'fresh_link',
      });

      await supabase
        .from('drm_investors')
        .update({
          invite_date: new Date().toISOString(),
          lifecycle_status: 'invited_awaiting_activation',
        })
        .eq('id', investorId);

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 're_invitation_sent',
        event_detail: { is_test: true },
      });

      await supabase.from('drm_audit_events').insert({
        event_type: 'ACTIVATION_TOKEN_REISSUED',
        investor_id: investorId,
        admin_id: adminId,
        event_metadata: {
          reason: 'fresh_link',
          expires_in_hours: 48,
          previous_token_invalidated: previousTokensInvalidated.count !== null,
          is_test: true,
        },
      });

      const activationUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/investor-data-room?token=${inviteToken}`;

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'DEV MANUAL DELIVERY — Fresh activation link issued for test investor.',
          devActivationUrl: activationUrl,
          devWarning: 'This activation URL contains a secret. Share only with the intended test recipient. It expires 48 hours after issue and will not be shown again.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // TOGGLE NDA SIGNED
    // ============================================================
    if (action === 'toggle-nda') {
      const permDenied = requirePermission('investor.access.suspend');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();
      const ndaSigned = Boolean(body.ndaSigned);

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from('drm_investors')
        .update({ nda_signed: ndaSigned })
        .eq('id', investorId)
        .select('id, nda_signed, access_level')
        .single();

      if (updateError || !updated) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to update NDA status.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 'nda_status_change',
        event_detail: { nda_signed: ndaSigned, new_access_level: updated.access_level },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          investor: { id: updated.id, nda_signed: updated.nda_signed, access_level: updated.access_level },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // REVOKE INVESTOR ACCESS
    // ============================================================
    if (action === 'revoke') {
      const permDenied = requirePermission('investor.access.revoke');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();
      const reason = String(body.reason ?? '').trim() || null;

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const nowIso = new Date().toISOString();
      await supabase
        .from('drm_investors')
        .update({ status: 'revoked', lifecycle_status: 'revoked', revoked_at: nowIso, revoked_by: adminId })
        .eq('id', investorId);

      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: nowIso })
        .eq('investor_id', investorId)
        .in('token_type', ['session', 'invitation', 're-invitation']);

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId, investor_id: investorId, event_type: 'access_revoked', event_detail: { reason },
      });
      await supabase.from('drm_audit_events').insert({
        event_type: 'INVESTOR_REVOKED', investor_id: investorId, admin_id: adminId, event_metadata: { reason },
      });

      return new Response(
        JSON.stringify({ ok: true, message: 'Access revoked.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // SUSPEND INVESTOR ACCESS
    // ============================================================
    if (action === 'suspend') {
      const permDenied = requirePermission('investor.access.suspend');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();
      const reason = String(body.reason ?? '').trim() || null;

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const nowIso = new Date().toISOString();
      await supabase
        .from('drm_investors')
        .update({ status: 'suspended', lifecycle_status: 'suspended', suspended_at: nowIso, suspended_by: adminId })
        .eq('id', investorId);

      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: nowIso })
        .eq('investor_id', investorId)
        .eq('token_type', 'session');

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId, investor_id: investorId, event_type: 'access_suspended', event_detail: { reason },
      });
      await supabase.from('drm_audit_events').insert({
        event_type: 'INVESTOR_SUSPENDED', investor_id: investorId, admin_id: adminId, event_metadata: { reason },
      });

      return new Response(
        JSON.stringify({ ok: true, message: 'Access suspended.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // REACTIVATE INVESTOR ACCESS
    // ============================================================
    if (action === 'reactivate') {
      const permDenied = requirePermission('investor.access.reactivate');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      await supabase
        .from('drm_investors')
        .update({ status: 'active', lifecycle_status: 'active', suspended_at: null, suspended_by: null })
        .eq('id', investorId);

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId, investor_id: investorId, event_type: 'access_reactivated', event_detail: {},
      });
      await supabase.from('drm_audit_events').insert({
        event_type: 'INVESTOR_REACTIVATED', investor_id: investorId, admin_id: adminId, event_metadata: {},
      });

      return new Response(
        JSON.stringify({ ok: true, message: 'Access reactivated.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // ADD INTERNAL NOTE
    // ============================================================
    if (action === 'add-note') {
      const permDenied = requirePermission('investor.notes.write');
      if (permDenied) return permDenied;

      const investorId = body.investorId || null;
      const requestId = body.requestId || null;
      const noteText = String(body.noteText ?? '').trim();

      if (!noteText || (!investorId && !requestId)) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Note text and investor or request ID are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data, error } = await supabase.from('drm_internal_notes').insert({
        investor_id: investorId,
        request_id: requestId,
        admin_id: adminId,
        note_text: noteText,
      }).select('id, created_at').single();

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to add note.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, noteId: data.id, createdAt: data.created_at }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // ASSIGN RELATIONSHIP OWNER
    // ============================================================
    if (action === 'assign-owner') {
      const permDenied = requirePermission('investor.owner.assign');
      if (permDenied) return permDenied;

      const investorId = String(body.investorId ?? '').trim();
      const ownerId = body.ownerId || null;

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      await supabase
        .from('drm_investors')
        .update({ relationship_owner_id: ownerId })
        .eq('id', investorId);

      return new Response(
        JSON.stringify({ ok: true, message: 'Relationship owner updated.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET DOCUMENTS & FOLDERS (admin view — all documents)
    // ============================================================
    if (action === 'documents') {
      const [{ data: folders }, { data: documents }] = await Promise.all([
        supabase.from('drm_folders').select('*').order('display_order', { ascending: true }),
        supabase.from('drm_documents').select('*').order('display_order', { ascending: true }),
      ]);

      return new Response(
        JSON.stringify({
          ok: true,
          folders: folders || [],
          documents: documents || [],
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // ADD DOCUMENT
    // ============================================================
    if (action === 'add-document') {
      const folderId = body.folderId || null;
      const name = String(body.name ?? '').trim().slice(0, 300);
      const googleLink = String(body.googleLink ?? '').trim().slice(0, 2000);
      const securityClassification = body.securityClassification === 'nda_required' ? 'nda_required' : 'public';

      if (!name || !googleLink) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Document name and Google link are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data, error } = await supabase
        .from('drm_documents')
        .insert({
          folder_id: folderId,
          name,
          google_link: googleLink,
          security_classification: securityClassification,
          display_order: 0,
        })
        .select('id')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to add document.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, documentId: data.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // TOGGLE DOCUMENT CLASSIFICATION
    // ============================================================
    if (action === 'toggle-classification') {
      const documentId = String(body.documentId ?? '').trim();
      const classification = body.classification === 'nda_required' ? 'nda_required' : 'public';

      if (!documentId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Document ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data, error } = await supabase
        .from('drm_documents')
        .update({ security_classification: classification, updated_at: new Date().toISOString() })
        .eq('id', documentId)
        .select('id, security_classification')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to update classification.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, document: { id: data.id, security_classification: data.security_classification } }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // REMOVE DOCUMENT
    // ============================================================
    if (action === 'remove-document') {
      const documentId = String(body.documentId ?? '').trim();

      if (!documentId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Document ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { error } = await supabase
        .from('drm_documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to remove document.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Document removed.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // EDIT DOCUMENT LINK
    // ============================================================
    if (action === 'edit-document') {
      const documentId = String(body.documentId ?? '').trim();
      const name = body.name ? String(body.name).trim().slice(0, 300) : undefined;
      const googleLink = body.googleLink ? String(body.googleLink).trim().slice(0, 2000) : undefined;
      const folderId = body.folderId !== undefined ? body.folderId : undefined;

      if (!documentId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Document ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (googleLink !== undefined) updates.google_link = googleLink;
      if (folderId !== undefined) updates.folder_id = folderId;

      const { error } = await supabase
        .from('drm_documents')
        .update(updates)
        .eq('id', documentId);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to update document.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Document updated.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // ADD FOLDER
    // ============================================================
    if (action === 'add-folder') {
      const name = String(body.name ?? '').trim().slice(0, 200);

      if (!name) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Folder name is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: maxOrder } = await supabase
        .from('drm_folders')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data, error } = await supabase
        .from('drm_folders')
        .insert({
          name,
          display_order: (maxOrder?.display_order || 0) + 1,
        })
        .select('id')
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to add folder.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, folderId: data.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // RENAME FOLDER
    // ============================================================
    if (action === 'rename-folder') {
      const folderId = String(body.folderId ?? '').trim();
      const name = String(body.name ?? '').trim().slice(0, 200);

      if (!folderId || !name) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Folder ID and name are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { error } = await supabase
        .from('drm_folders')
        .update({ name })
        .eq('id', folderId);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to rename folder.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Folder renamed.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET ADMIN MANAGEMENT DATA (admin accounts)
    // ============================================================
    if (action === 'admin-mgmt') {
      const permDenied = requirePermission('admin.view');
      if (permDenied) return permDenied;

      const [{ data: admins }, { data: adminNotes }] = await Promise.all([
        supabase.from('drm_admins').select('id, name, email, role, admin_status, created_at, created_by, activated_at, last_login_at, suspended_at, suspended_by, removed_at, removed_by').order('created_at', { ascending: true }),
        supabase.from('drm_admin_notes').select('id, admin_id, author_id, note_text, created_at').order('created_at', { ascending: false }),
      ]);

      return new Response(
        JSON.stringify({
          ok: true,
          admins: (admins || []).map(a => ({ ...a, passphrase_hash: undefined })),
          adminNotes: adminNotes || [],
          currentAdminId: adminId,
          currentAdminRole: adminRole,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // INVITE ADMIN (create + issue activation token)
    // ============================================================
    if (action === 'invite-admin') {
      const permDenied = requirePermission('admin.create');
      if (permDenied) return permDenied;

      const name = String(body.name ?? '').trim().slice(0, 200);
      const email = String(body.email ?? '').trim().toLowerCase().slice(0, 320);
      const role = String(body.role ?? '').trim();
      const internalNote = String(body.internalNote ?? '').trim() || null;

      if (!name || !email || !role) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Name, email and role are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (!['super_admin', 'investor_admin', 'content_admin'].includes(role)) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Invalid role.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: existing } = await supabase.from('drm_admins').select('id').eq('email', email).maybeSingle();
      if (existing) {
        return new Response(
          JSON.stringify({ ok: false, message: 'An admin with this email already exists.' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: newAdmin, error: invError } = await supabase
        .from('drm_admins')
        .insert({ name, email, role, admin_status: 'invited', created_by: adminId, passphrase_hash: DUMMY_HASH })
        .select('id')
        .single();

      if (invError || !newAdmin) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to create admin record.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (internalNote) {
        await supabase.from('drm_admin_notes').insert({ admin_id: newAdmin.id, author_id: adminId, note_text: internalNote });
      }

      const activationToken = crypto.randomUUID();
      const activationTokenHash = await sha256(activationToken);
      await supabase.from('drm_access_tokens').insert({
        admin_id: newAdmin.id,
        token_hash: activationTokenHash,
        token_type: 'admin_activation',
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        is_valid: true,
        issued_by: adminId,
        issuance_reason: 'admin_invitation',
      });

      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_INVITED', admin_id: adminId,
        event_metadata: { target_admin_id: newAdmin.id, target_email: email, role },
      });

      const activationUrl = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}/investor-admin?activate=${activationToken}`;

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'DEV MANUAL DELIVERY — Admin invitation created.',
          devActivationUrl: activationUrl,
          devWarning: 'This activation URL contains a secret. Share only with the intended admin. It expires 48 hours after issue and will not be shown again.',
          adminId: newAdmin.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // SUSPEND ADMIN
    // ============================================================
    if (action === 'suspend-admin') {
      const permDenied = requirePermission('admin.suspend');
      if (permDenied) return permDenied;

      const targetAdminId = String(body.adminId ?? '').trim();
      if (!targetAdminId) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Self-protection: cannot suspend self
      if (targetAdminId === adminId) {
        return new Response(JSON.stringify({ ok: false, message: 'You cannot suspend your own account.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Final super-admin protection
      const { data: target } = await supabase.from('drm_admins').select('role, admin_status').eq('id', targetAdminId).maybeSingle();
      if (!target || target.admin_status !== 'active') {
        return new Response(JSON.stringify({ ok: false, message: 'Admin not found or not active.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (target.role === 'super_admin') {
        const { count: activeSuperCount } = await supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('role', 'super_admin').eq('admin_status', 'active');
        if ((activeSuperCount || 0) <= 1) {
          return new Response(JSON.stringify({ ok: false, message: 'Cannot suspend the last active Super Admin.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }

      const nowIso = new Date().toISOString();
      await supabase.from('drm_admins').update({ admin_status: 'suspended', suspended_at: nowIso, suspended_by: adminId }).eq('id', targetAdminId);
      await supabase.from('drm_access_tokens').update({ is_valid: false, invalidated_at: nowIso }).eq('admin_id', targetAdminId).eq('token_type', 'admin_session');

      await supabase.from('drm_audit_events').insert({ event_type: 'ADMIN_SUSPENDED', admin_id: adminId, event_metadata: { target_admin_id: targetAdminId } });

      return new Response(JSON.stringify({ ok: true, message: 'Admin suspended.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // REACTIVATE ADMIN
    // ============================================================
    if (action === 'reactivate-admin') {
      const permDenied = requirePermission('admin.reactivate');
      if (permDenied) return permDenied;

      const targetAdminId = String(body.adminId ?? '').trim();
      if (!targetAdminId) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('drm_admins').update({ admin_status: 'active', suspended_at: null, suspended_by: null }).eq('id', targetAdminId);

      await supabase.from('drm_audit_events').insert({ event_type: 'ADMIN_REACTIVATED', admin_id: adminId, event_metadata: { target_admin_id: targetAdminId } });

      return new Response(JSON.stringify({ ok: true, message: 'Admin reactivated.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // REMOVE ADMIN (soft delete)
    // ============================================================
    if (action === 'remove-admin') {
      const permDenied = requirePermission('admin.remove');
      if (permDenied) return permDenied;

      const targetAdminId = String(body.adminId ?? '').trim();
      if (!targetAdminId) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Self-protection
      if (targetAdminId === adminId) {
        return new Response(JSON.stringify({ ok: false, message: 'You cannot remove your own account.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Final super-admin protection
      const { data: target } = await supabase.from('drm_admins').select('role, admin_status').eq('id', targetAdminId).maybeSingle();
      if (!target) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin not found.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (target.role === 'super_admin' && target.admin_status === 'active') {
        const { count: activeSuperCount } = await supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('role', 'super_admin').eq('admin_status', 'active');
        if ((activeSuperCount || 0) <= 1) {
          return new Response(JSON.stringify({ ok: false, message: 'Cannot remove the last active Super Admin.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }

      const nowIso = new Date().toISOString();
      await supabase.from('drm_admins').update({ admin_status: 'removed', removed_at: nowIso, removed_by: adminId }).eq('id', targetAdminId);
      await supabase.from('drm_access_tokens').update({ is_valid: false, invalidated_at: nowIso }).eq('admin_id', targetAdminId).in('token_type', ['admin_session', 'admin_activation']);

      await supabase.from('drm_audit_events').insert({ event_type: 'ADMIN_REMOVED', admin_id: adminId, event_metadata: { target_admin_id: targetAdminId } });

      return new Response(JSON.stringify({ ok: true, message: 'Admin access removed.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // CHANGE ADMIN ROLE
    // ============================================================
    if (action === 'change-role') {
      const permDenied = requirePermission('admin.role.change');
      if (permDenied) return permDenied;

      const targetAdminId = String(body.adminId ?? '').trim();
      const newRole = String(body.role ?? '').trim();

      if (!targetAdminId || !newRole) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin ID and role are required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (!['super_admin', 'investor_admin', 'content_admin'].includes(newRole)) {
        return new Response(JSON.stringify({ ok: false, message: 'Invalid role.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Self-protection: cannot promote self
      if (targetAdminId === adminId) {
        return new Response(JSON.stringify({ ok: false, message: 'You cannot change your own role.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { data: target } = await supabase.from('drm_admins').select('role, admin_status').eq('id', targetAdminId).maybeSingle();
      if (!target) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin not found.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Final super-admin protection: cannot demote the last active super admin
      if (target.role === 'super_admin' && newRole !== 'super_admin' && target.admin_status === 'active') {
        const { count: activeSuperCount } = await supabase.from('drm_admins').select('*', { count: 'exact', head: true }).eq('role', 'super_admin').eq('admin_status', 'active');
        if ((activeSuperCount || 0) <= 1) {
          return new Response(JSON.stringify({ ok: false, message: 'Cannot demote the last active Super Admin.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }

      const previousRole = target.role;
      await supabase.from('drm_admins').update({ role: newRole }).eq('id', targetAdminId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_ROLE_CHANGED', admin_id: adminId,
        event_metadata: { target_admin_id: targetAdminId, previous_role: previousRole, new_role: newRole },
      });

      return new Response(JSON.stringify({ ok: true, message: 'Role updated.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // REVOKE ADMIN SESSIONS (sign out all sessions for an admin)
    // ============================================================
    if (action === 'revoke-admin-sessions') {
      const permDenied = requirePermission('admin.session.revoke');
      if (permDenied) return permDenied;

      const targetAdminId = String(body.adminId ?? '').trim();
      if (!targetAdminId) {
        return new Response(JSON.stringify({ ok: false, message: 'Admin ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const nowIso = new Date().toISOString();
      await supabase.from('drm_access_tokens').update({ is_valid: false, invalidated_at: nowIso }).eq('admin_id', targetAdminId).eq('token_type', 'admin_session');

      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_SESSION_REVOKED', admin_id: adminId,
        event_metadata: { target_admin_id: targetAdminId },
      });

      return new Response(JSON.stringify({ ok: true, message: 'All sessions revoked for this admin.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // AUDIT CONSOLE (filtered audit events)
    // ============================================================
    if (action === 'audit-console') {
      const permDenied = requirePermission(hasPermission(adminRole, 'audit.view.full') ? 'audit.view.full' : 'audit.view.investor');
      if (permDenied) return permDenied;

      const areaFilter = String(body.area ?? '').trim() || null;
      const eventTypeFilter = String(body.eventType ?? '').trim() || null;
      const actorFilter = body.actorId || null;
      const targetFilter = body.targetId || null;
      const dateFrom = body.dateFrom || null;
      const dateTo = body.dateTo || null;

      let query = supabase.from('drm_audit_events').select('*').order('created_at', { ascending: false }).limit(500);

      if (eventTypeFilter) query = query.eq('event_type', eventTypeFilter);
      if (actorFilter) query = query.eq('admin_id', actorFilter);
      if (targetFilter) query = query.eq('investor_id', targetFilter);
      if (dateFrom) query = query.gte('created_at', dateFrom);
      if (dateTo) query = query.lte('created_at', dateTo);

      const { data: events } = await query;

      // Filter by area if specified
      let filteredEvents = (events || []);
      if (areaFilter) {
        filteredEvents = filteredEvents.filter(e => EVENT_AREA[e.event_type] === areaFilter);
      }

      // Role-based filtering: investor_admin sees only investor/request/invitation/access events
      if (!hasPermission(adminRole, 'audit.view.full')) {
        const allowedAreas = ['Requests', 'Invitations', 'Investor Access', 'NDA'];
        filteredEvents = filteredEvents.filter(e => allowedAreas.includes(EVENT_AREA[e.event_type] || ''));
      } else if (adminRole === 'content_admin') {
        const allowedAreas = ['Content'];
        filteredEvents = filteredEvents.filter(e => allowedAreas.includes(EVENT_AREA[e.event_type] || ''));
      }

      // Enrich with investor and admin names
      const investorIds = [...new Set(filteredEvents.map(e => e.investor_id).filter(Boolean))] as string[];
      const adminIds = [...new Set(filteredEvents.map(e => e.admin_id).filter(Boolean))] as string[];

      const [{ data: investors }, { data: admins }] = await Promise.all([
        investorIds.length > 0 ? supabase.from('drm_investors').select('id, name, email').in('id', investorIds) : { data: [], error: null },
        adminIds.length > 0 ? supabase.from('drm_admins').select('id, name, email').in('id', adminIds) : { data: [], error: null },
      ]);

      const investorMap = new Map((investors || []).map(i => [i.id, i]));
      const adminMap = new Map((admins || []).map(a => [a.id, a]));

      const enriched = filteredEvents.map(e => ({
        ...e,
        area: EVENT_AREA[e.event_type] || 'Other',
        investor_name: e.investor_id ? investorMap.get(e.investor_id)?.name || null : null,
        admin_name: e.admin_id ? adminMap.get(e.admin_id)?.name || null : null,
      }));

      return new Response(
        JSON.stringify({ ok: true, events: enriched, adminRole }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // DECLINE REQUEST
    // ============================================================
    if (action === 'decline-request') {
      const permDenied = requirePermission('investor.request.decline');
      if (permDenied) return permDenied;

      const requestId = String(body.requestId ?? '').trim();
      const reason = String(body.reason ?? '').trim() || null;

      if (!requestId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Request ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      await supabase
        .from('drm_investor_requests')
        .update({ status: 'declined' })
        .eq('id', requestId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'REQUEST_DECLINED',
        request_id: requestId,
        admin_id: adminId,
        event_metadata: { reason },
      });

      return new Response(
        JSON.stringify({ ok: true, message: 'Request declined.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: false, message: 'Unknown action.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, message: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
// v5 pbkdf2 600k timing-safe + secure salt + dummy verify
