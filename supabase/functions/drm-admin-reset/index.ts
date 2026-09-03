// verify_jwt: false (admin reset token auth, not JWT)
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

const WEAK_PASSPHRASES = [
  'password', 'passphrase', 'admin', 'administrator', '123456789012',
  'nf-admin-qa-passphrase-2026!',
];

function isWeakPassphrase(p: string): boolean {
  const lower = p.toLowerCase();
  if (WEAK_PASSPHRASES.some(w => lower === w)) return true;
  if (lower.includes('test') && lower.includes('pass')) return true;
  if (/^(.)\1{11,}$/.test(p)) return true;
  // Reject short words repeated (e.g. "passwordpassword", "adminadminadmin")
  const half = lower.slice(0, Math.floor(lower.length / 2));
  if (lower.length >= 12 && half.length >= 4 && lower === half + half) return true;
  // Reject common dictionary words used alone or repeated
  const dictWords = ['password', 'passphrase', 'admin', 'letmein', 'welcome', 'changeme', 'qwerty'];
  for (const w of dictWords) {
    if (lower === w || lower === w + w || lower === w + w + w) return true;
  }
  // Reject sequential numbers
  if (/^0123456789|^123456789012|^9876543210/.test(lower)) return true;
  return false;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json();
    const action = String(body.action ?? '').trim();

    // ============================================================
    // REQUEST RESET — controlled operator flow (bootstrap secret gated)
    // ============================================================
    if (action === 'request-reset') {
      const bootstrapSecret = String(body.bootstrapSecret ?? '').trim();
      const email = String(body.email ?? '').trim().toLowerCase();

      if (!bootstrapSecret || !email) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Bootstrap secret and admin email are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Verify bootstrap secret (same secret used for initial bootstrap)
      const { data: config } = await supabase
        .from('drm_bootstrap_config')
        .select('bootstrap_secret_hash')
        .eq('id', 1)
        .maybeSingle();

      if (!config || !config.bootstrap_secret_hash) {
        return new Response(
          JSON.stringify({ ok: false, code: 'BOOTSTRAP_NOT_CONFIGURED', message: 'Bootstrap secret is not configured.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const providedHash = await sha256(bootstrapSecret);
      if (providedHash !== config.bootstrap_secret_hash) {
        return new Response(
          JSON.stringify({ ok: false, code: 'BOOTSTRAP_SECRET_INVALID', message: 'Invalid bootstrap secret.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Find the admin
      const { data: admin } = await supabase
        .from('drm_admins')
        .select('id, name, email, role, admin_status')
        .eq('email', email)
        .maybeSingle();

      if (!admin) {
        return new Response(
          JSON.stringify({ ok: false, message: 'No admin account found with this email.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Only active admins can reset
      if (admin.admin_status !== 'active') {
        return new Response(
          JSON.stringify({ ok: false, code: 'ADMIN_NOT_ACTIVE', message: `Admin account status is '${admin.admin_status}'. Only active admins can reset their passphrase.` }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Invalidate previous unused reset tokens
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: new Date().toISOString() })
        .eq('admin_id', admin.id)
        .eq('token_type', 'admin_passphrase_reset')
        .eq('is_valid', true)
        .is('used_at', null);

      // Generate new reset token
      const resetToken = crypto.randomUUID();
      const resetTokenHash = await sha256(resetToken);
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

      await supabase.from('drm_access_tokens').insert({
        admin_id: admin.id,
        token_hash: resetTokenHash,
        token_type: 'admin_passphrase_reset',
        expires_at: expiresAt,
        is_valid: true,
        issuance_reason: 'operator_initiated_reset',
      });

      // Audit event
      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_PASSPHRASE_RESET_REQUESTED',
        admin_id: admin.id,
        event_metadata: { mechanism: 'operator_bootstrap_secret', email: admin.email, expires_in_hours: 48 },
      });

      // DEV manual delivery URL
      const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') || '';
      const resetUrl = `${baseUrl}/investor-admin/reset-passphrase?token=${resetToken}`;

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'DEV MANUAL DELIVERY — ADMIN PASSPHRASE RESET',
          devResetUrl: resetUrl,
          devWarning: 'This URL contains a secret. It may be used once and expires 48 hours after issue. Do not store or forward it unnecessarily.',
          admin: { name: admin.name, email: admin.email },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // VERIFY TOKEN — check token validity and return admin identity
    // ============================================================
    if (action === 'verify-token') {
      const resetToken = String(body.token ?? '').trim();

      if (!resetToken) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Reset token is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const tokenHash = await sha256(resetToken);

      const { data: tokenRow } = await supabase
        .from('drm_access_tokens')
        .select('id, admin_id, expires_at, is_valid, used_at')
        .eq('token_hash', tokenHash)
        .eq('token_type', 'admin_passphrase_reset')
        .maybeSingle();

      if (!tokenRow) {
        return new Response(
          JSON.stringify({ ok: false, code: 'INVALID_TOKEN', message: 'Invalid reset token.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (!tokenRow.is_valid || tokenRow.used_at) {
        return new Response(
          JSON.stringify({ ok: false, code: 'TOKEN_USED', message: 'This reset link has already been used.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (new Date(tokenRow.expires_at) < new Date()) {
        await supabase.from('drm_access_tokens').update({ is_valid: false }).eq('id', tokenRow.id);
        return new Response(
          JSON.stringify({ ok: false, code: 'TOKEN_EXPIRED', message: 'This reset link has expired. Please request a new reset link.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: admin } = await supabase
        .from('drm_admins')
        .select('name, email, role, admin_status')
        .eq('id', tokenRow.admin_id)
        .maybeSingle();

      if (!admin || admin.admin_status !== 'active') {
        return new Response(
          JSON.stringify({ ok: false, code: 'ADMIN_NOT_ACTIVE', message: 'This admin account is not active. Reset is not permitted.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          admin: { name: admin.name, email: admin.email, role: admin.role },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // PERFORM RESET — set new passphrase, invalidate sessions
    // ============================================================
    if (action === 'perform-reset') {
      const resetToken = String(body.token ?? '').trim();
      const newPassphrase = String(body.newPassphrase ?? '').trim();
      const confirmPassphrase = String(body.confirmPassphrase ?? '').trim();

      if (!resetToken || !newPassphrase || !confirmPassphrase) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Reset token, new passphrase and confirmation are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (newPassphrase.length < 12) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Passphrase must be at least 12 characters.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (isWeakPassphrase(newPassphrase)) {
        return new Response(
          JSON.stringify({ ok: false, message: 'This passphrase is too weak. Please choose a stronger passphrase.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (newPassphrase !== confirmPassphrase) {
        return new Response(
          JSON.stringify({ ok: false, code: 'PASSPHRASE_MISMATCH', message: 'Passphrases do not match.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const tokenHash = await sha256(resetToken);

      const { data: tokenRow } = await supabase
        .from('drm_access_tokens')
        .select('id, admin_id, expires_at, is_valid, used_at')
        .eq('token_hash', tokenHash)
        .eq('token_type', 'admin_passphrase_reset')
        .maybeSingle();

      if (!tokenRow) {
        return new Response(
          JSON.stringify({ ok: false, code: 'INVALID_TOKEN', message: 'Invalid reset token.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (!tokenRow.is_valid || tokenRow.used_at) {
        return new Response(
          JSON.stringify({ ok: false, code: 'TOKEN_USED', message: 'This reset link has already been used.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (new Date(tokenRow.expires_at) < new Date()) {
        await supabase.from('drm_access_tokens').update({ is_valid: false }).eq('id', tokenRow.id);
        return new Response(
          JSON.stringify({ ok: false, code: 'TOKEN_EXPIRED', message: 'This reset link has expired. Please request a new reset link.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Verify admin is still active
      const { data: admin } = await supabase
        .from('drm_admins')
        .select('id, name, email, role, admin_status')
        .eq('id', tokenRow.admin_id)
        .maybeSingle();

      if (!admin || admin.admin_status !== 'active') {
        return new Response(
          JSON.stringify({ ok: false, code: 'ADMIN_NOT_ACTIVE', message: 'This admin account is not active. Reset is not permitted.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Atomic token consumption
      const { data: consumed, error: consumeError } = await supabase
        .from('drm_access_tokens')
        .update({ used_at: new Date().toISOString(), is_valid: false })
        .eq('id', tokenRow.id)
        .eq('is_valid', true)
        .is('used_at', null)
        .select('id')
        .single();

      if (consumeError || !consumed) {
        return new Response(
          JSON.stringify({ ok: false, code: 'TOKEN_USED', message: 'This reset link has already been used.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Hash new passphrase
      const salt = generateSalt();
      const passphraseHash = await pbkdf2Hash(newPassphrase, salt);

      // Update admin passphrase
      await supabase
        .from('drm_admins')
        .update({ passphrase_hash: passphraseHash })
        .eq('id', admin.id);

      // Invalidate ALL existing admin_session tokens for this admin
      const { count: revokedCount } = await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: new Date().toISOString() })
        .eq('admin_id', admin.id)
        .eq('token_type', 'admin_session')
        .eq('is_valid', true);

      // Invalidate any other unused reset tokens
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false, invalidated_at: new Date().toISOString() })
        .eq('admin_id', admin.id)
        .eq('token_type', 'admin_passphrase_reset')
        .eq('is_valid', true)
        .is('used_at', null);

      // Audit events
      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_SESSION_REVOKED',
        admin_id: admin.id,
        event_metadata: { reason: 'passphrase_reset', sessions_revoked: revokedCount || 0 },
      });

      await supabase.from('drm_audit_events').insert({
        event_type: 'ADMIN_PASSPHRASE_RESET_COMPLETED',
        admin_id: admin.id,
        event_metadata: { mechanism: 'operator_initiated_reset', role: admin.role },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'Passphrase updated. Your administrator passphrase has been reset. Please sign in again.',
          admin: { name: admin.name, email: admin.email, role: admin.role },
        }),
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
