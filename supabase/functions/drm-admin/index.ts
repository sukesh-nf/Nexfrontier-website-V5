// verify_jwt: false (internal admin-session-token auth, not JWT)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendMailgunEmail, emailTemplate } from '../_shared/mailgun.ts';

const SITE_URL = 'https://nexfrontierlogic.nz';

function investorInviteEmailHtml(opts: { name: string; token: string; isResend: boolean }): string {
  return emailTemplate({
    eyebrow: 'NexFrontier · Investor Data Room',
    heading: opts.isResend ? 'Your new access details' : 'Your Investor Data Room access',
    bodyHtml: `
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">Hi ${opts.name},</p>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">
        ${opts.isResend
          ? "Here's a new access token for the NexFrontier Investor Data Room."
          : "You've been granted access to the NexFrontier Investor Data Room."}
        Use the token below to activate your access and set a passphrase.
      </p>
      <div style="background:#0f172a;border:1px solid #1e293b;border-radius:8px;padding:20px;margin:0 0 20px;text-align:center">
        <div style="color:#64748b;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 8px">Your access token</div>
        <div style="color:#22d3ee;font-size:16px;font-weight:700;font-family:monospace;letter-spacing:0.02em;word-break:break-all">${opts.token}</div>
      </div>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px">
        Go to <a href="${SITE_URL}/investor-data-room" style="color:#22d3ee">${SITE_URL}/investor-data-room</a>,
        enter this token, and choose a passphrase. This token expires in <strong style="color:#e2e8f0">48 hours</strong>
        and can only be used once. After activation, your access does not expire — you'll simply log in again
        with your email and passphrase whenever you return.
      </p>
      <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">
        If you weren't expecting this, you can safely ignore this email.
      </p>
    `,
  });
}

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

// Admin session duration: 8 hours
const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
// Brute-force protection
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

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
      if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Too many failed attempts. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Verify passphrase using PBKDF2
      const isMatch = await pbkdf2Verify(passphrase, admin.passphrase_hash);

      if (!isMatch) {
        const newAttemptCount = (admin.failed_login_attempts || 0) + 1;
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
        .update({ failed_login_attempts: 0, locked_until: null })
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

      return new Response(
        JSON.stringify({
          ok: true,
          admin: { id: admin.id, name: admin.name, email: admin.email },
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

    const adminId = adminSession.admin_id;

    // ============================================================
    // GET OVERVIEW (dashboard data)
    // ============================================================
    if (action === 'overview') {
      const [{ data: investors }, { data: documents }, { data: views }, { data: sessions }, { data: folders }] = await Promise.all([
        supabase.from('drm_investors').select('id, status'),
        supabase.from('drm_documents').select('id'),
        supabase.from('drm_analytics_events').select('id, event_type').eq('event_type', 'document_view'),
        supabase.from('drm_analytics_events').select('id, event_type').eq('event_type', 'session_start'),
        supabase.from('drm_folders').select('id, name'),
      ]);

      const activeInvestors = investors?.filter(i => i.status === 'active').length || 0;
      const docViews = views?.length || 0;
      const totalSessions = sessions?.length || 0;

      const { data: mostViewed } = await supabase
        .from('drm_analytics_events')
        .select('document_id, document_id')
        .eq('event_type', 'document_view')
        .not('document_id', 'is', null);

      const viewCounts: Record<string, number> = {};
      (mostViewed || []).forEach(v => {
        if (v.document_id) viewCounts[v.document_id] = (viewCounts[v.document_id] || 0) + 1;
      });

      const sortedDocIds = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const docIds = sortedDocIds.map(([id]) => id);
      const { data: topDocs } = docIds.length > 0
        ? await supabase.from('drm_documents').select('id, name').in('id', docIds)
        : { data: [], error: null };

      const mostViewedDocs = sortedDocIds.map(([id, count]) => ({
        ...topDocs?.find(d => d.id === id),
        views: count,
      })).filter(d => d.id);

      return new Response(
        JSON.stringify({
          ok: true,
          overview: {
            documentsAvailable: documents?.length || 0,
            documentViews: docViews,
            avgTimePerSession: 0,
            investorsEngaged: activeInvestors,
            totalSessions,
            folders: folders || [],
            mostViewed: mostViewedDocs,
          },
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
      const { data: requests } = await supabase
        .from('drm_investor_requests')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: investors } = await supabase
        .from('drm_investors')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: activity } = await supabase
        .from('drm_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      // Strip passphrase_hash from investor records before returning
      const safeInvestors = (investors || []).map(inv => {
        const { passphrase_hash, failed_login_attempts, locked_until, ...rest } = inv;
        return rest;
      });

      return new Response(
        JSON.stringify({
          ok: true,
          requests: requests || [],
          investors: safeInvestors,
          activity: activity || [],
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // SEND INVITE (from request or direct)
    // ============================================================
    if (action === 'send-invite') {
      const name = String(body.name ?? '').trim().slice(0, 200);
      const email = String(body.email ?? '').trim().toLowerCase().slice(0, 320);
      const phone = String(body.phone ?? '').trim().slice(0, 50);
      const source = String(body.source ?? 'admin-invite').trim();
      const requestId = body.requestId || null;

      if (!name || !email) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Name and email are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

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
          .update({ status: 'invited', invite_date: new Date().toISOString(), phone, source })
          .eq('id', investorId);
      } else {
        const { data: newInvestor, error: invError } = await supabase
          .from('drm_investors')
          .insert({
            name,
            email,
            phone,
            source,
            status: 'invited',
            invite_date: new Date().toISOString(),
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

      const inviteToken = crypto.randomUUID();
      const inviteTokenHash = await sha256(inviteToken);

      await supabase.from('drm_access_tokens').insert({
        investor_id: investorId,
        token_hash: inviteTokenHash,
        token_type: 'invitation',
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        is_valid: true,
      });

      if (requestId) {
        await supabase
          .from('drm_investor_requests')
          .update({ status: 'invited', investor_id: investorId })
          .eq('id', requestId);
      }

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 'invitation_sent',
        event_detail: { source, request_id: requestId },
      });

      const emailResult = await sendMailgunEmail({
        to: email,
        subject: 'Your NexFrontier Investor Data Room access',
        html: investorInviteEmailHtml({ name, token: inviteToken, isResend: false }),
      });

      return new Response(
        JSON.stringify({
          ok: true,
          message: emailResult.sent
            ? 'Invitation sent successfully.'
            : 'Invitation created, but the email could not be sent — share the token manually.',
          inviteToken,
          investorId,
          emailSent: emailResult.sent,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // RE-SEND INVITE (after token expiry)
    // ============================================================
    if (action === 'resend-invite') {
      const investorId = String(body.investorId ?? '').trim();

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: investorRecord } = await supabase
        .from('drm_investors')
        .select('name, email')
        .eq('id', investorId)
        .maybeSingle();

      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('investor_id', investorId)
        .eq('token_type', 'invitation');

      const inviteToken = crypto.randomUUID();
      const inviteTokenHash = await sha256(inviteToken);

      await supabase.from('drm_access_tokens').insert({
        investor_id: investorId,
        token_hash: inviteTokenHash,
        token_type: 're-invitation',
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        is_valid: true,
      });

      await supabase
        .from('drm_investors')
        .update({ invite_date: new Date().toISOString() })
        .eq('id', investorId);

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 're_invitation_sent',
        event_detail: {},
      });

      let emailSent = false;
      if (investorRecord?.email) {
        const emailResult = await sendMailgunEmail({
          to: investorRecord.email,
          subject: 'Your new NexFrontier Investor Data Room access token',
          html: investorInviteEmailHtml({
            name: investorRecord.name ?? 'there',
            token: inviteToken,
            isResend: true,
          }),
        });
        emailSent = emailResult.sent;
      }

      return new Response(
        JSON.stringify({
          ok: true,
          message: emailSent
            ? 'New invitation sent.'
            : 'New token created, but the email could not be sent — share the token manually.',
          inviteToken,
          emailSent,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // TOGGLE NDA SIGNED
    // ============================================================
    if (action === 'toggle-nda') {
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
      const investorId = String(body.investorId ?? '').trim();

      if (!investorId) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Investor ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Set status to revoked
      await supabase
        .from('drm_investors')
        .update({ status: 'revoked' })
        .eq('id', investorId);

      // Invalidate ALL tokens for this investor (sessions, invitations, re-invitations)
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('investor_id', investorId)
        .in('token_type', ['session', 'invitation', 're-invitation']);

      await supabase.from('drm_activity_log').insert({
        admin_id: adminId,
        investor_id: investorId,
        event_type: 'access_revoked',
        event_detail: {},
      });

      return new Response(
        JSON.stringify({ ok: true, message: 'Access revoked.' }),
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
    // GET ADMIN ACCESS (admin accounts)
    // ============================================================
    if (action === 'admin-access') {
      const { data: admins } = await supabase
        .from('drm_admins')
        .select('id, name, email, is_active, created_at')
        .order('created_at', { ascending: true });

      return new Response(
        JSON.stringify({
          ok: true,
          admins: (admins || []).map(a => ({ ...a, passphrase_hash: undefined })),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // ADD ADMIN
    // ============================================================
    if (action === 'add-admin') {
      const name = String(body.name ?? '').trim().slice(0, 200);
      const email = String(body.email ?? '').trim().toLowerCase().slice(0, 320);
      const passphrase = String(body.passphrase ?? '').trim();

      if (!name || !email || !passphrase) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Name, email and passphrase are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (passphrase.length < 8) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Passphrase must be at least 8 characters.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Hash passphrase using PBKDF2
      const salt = generateSalt();
      const passphraseHash = await pbkdf2Hash(passphrase, salt);

      const { error } = await supabase
        .from('drm_admins')
        .insert({ name, email, passphrase_hash: passphraseHash });

      if (error) {
        if (error.code === '23505') {
          return new Response(
            JSON.stringify({ ok: false, message: 'An admin with this email already exists.' }),
            { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to add admin.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Admin added.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // REMOVE ADMIN
    // ============================================================
    if (action === 'remove-admin') {
      const adminIdToRemove = String(body.adminId ?? '').trim();

      if (!adminIdToRemove) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Admin ID is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Invalidate all sessions for this admin
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('admin_id', adminIdToRemove)
        .eq('token_type', 'admin_session');

      const { error } = await supabase
        .from('drm_admins')
        .delete()
        .eq('id', adminIdToRemove);

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to remove admin.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({ ok: true, message: 'Admin removed.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // DECLINE REQUEST
    // ============================================================
    if (action === 'decline-request') {
      const requestId = String(body.requestId ?? '').trim();

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
