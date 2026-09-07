// verify_jwt: true (platform JWT plus one-time admin activation token)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const ALLOWED_ORIGINS = new Set(['https://nexfrontierlogic.nz', 'https://www.nexfrontierlogic.nz']);
function cors(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://nexfrontierlogic.nz';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
    'Vary': 'Origin',
  };
}
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
  return new Uint8Array((hex.match(/.{2}/g) || []).map(h => parseInt(h, 16)));
}
async function pbkdf2Hash(passphrase: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: hexToBytes(saltHex), iterations: 600000, hash: 'SHA-256' }, keyMaterial, 256);
  const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:600000:${saltHex}:${hashHex}`;
}
const WEAK_PASSPHRASES = ['password', 'passphrase', 'admin', 'administrator', '123456789012', 'nf-admin-qa-passphrase-2026!'];
function isWeakPassphrase(p: string): boolean {
  const lower = p.toLowerCase();
  if (WEAK_PASSPHRASES.some(w => lower === w)) return true;
  if (lower.includes('test') && lower.includes('pass')) return true;
  if (/^(.)\1{11,}$/.test(p)) return true;
  const half = lower.slice(0, Math.floor(lower.length / 2));
  if (lower.length >= 12 && half.length >= 4 && lower === half + half) return true;
  for (const w of ['password', 'passphrase', 'admin', 'letmein', 'welcome', 'changeme', 'qwerty']) {
    if (lower === w || lower === w + w || lower === w + w + w) return true;
  }
  if (/^(0123456789|123456789012|9876543210)/.test(lower)) return true;
  return false;
}

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  const origin = req.headers.get('Origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) return new Response(JSON.stringify({ ok: false, message: 'Origin not allowed.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok: false, message: 'Method not allowed.' }), { status: 405, headers: { ...headers, 'Content-Type': 'application/json' } });
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json();
    const activationToken = String(body.activationToken ?? '').trim();
    const passphrase = String(body.passphrase ?? '').trim();
    if (!activationToken || !passphrase) return new Response(JSON.stringify({ ok: false, message: 'Activation token and passphrase are required.' }), { status: 422, headers: { ...headers, 'Content-Type': 'application/json' } });
    if (passphrase.length < 12) return new Response(JSON.stringify({ ok: false, message: 'Passphrase must be at least 12 characters.' }), { status: 422, headers: { ...headers, 'Content-Type': 'application/json' } });
    if (isWeakPassphrase(passphrase)) return new Response(JSON.stringify({ ok: false, message: 'This passphrase is too weak. Please choose a stronger passphrase.' }), { status: 422, headers: { ...headers, 'Content-Type': 'application/json' } });

    const tokenHash = await sha256(activationToken);
    const { data: tokenRow, error: tokenError } = await supabase.from('drm_access_tokens').select('id, admin_id, expires_at, is_valid, used_at').eq('token_hash', tokenHash).eq('token_type', 'admin_activation').maybeSingle();
    if (tokenError || !tokenRow) return new Response(JSON.stringify({ ok: false, message: 'Invalid activation token.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
    if (!tokenRow.is_valid || tokenRow.used_at) return new Response(JSON.stringify({ ok: false, message: 'This activation token has already been used.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
    if (new Date(tokenRow.expires_at) < new Date()) {
      await supabase.from('drm_access_tokens').update({ is_valid: false, invalidated_at: new Date().toISOString() }).eq('id', tokenRow.id);
      return new Response(JSON.stringify({ ok: false, message: 'This activation link has expired. Please ask a Super Admin to issue a new activation link.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
    }
    const { data: targetAdmin } = await supabase.from('drm_admins').select('id, admin_status').eq('id', tokenRow.admin_id).maybeSingle();
    if (!targetAdmin || targetAdmin.admin_status !== 'invited') return new Response(JSON.stringify({ ok: false, message: 'This administrator account is not eligible for activation.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });

    const { data: consumed, error: consumeError } = await supabase.from('drm_access_tokens').update({ used_at: new Date().toISOString(), is_valid: false }).eq('id', tokenRow.id).eq('is_valid', true).is('used_at', null).select('id').single();
    if (consumeError || !consumed) return new Response(JSON.stringify({ ok: false, message: 'This activation token has already been used.' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });

    const passphraseHash = await pbkdf2Hash(passphrase, generateSalt());
    const { data: admin, error: adminError } = await supabase.from('drm_admins').update({ passphrase_hash: passphraseHash, admin_status: 'active', is_active: true, activated_at: new Date().toISOString(), failed_login_attempts: 0, locked_until: null }).eq('id', tokenRow.admin_id).eq('admin_status', 'invited').select('id, name, email, role').single();
    if (adminError || !admin) return new Response(JSON.stringify({ ok: false, message: 'Unable to activate admin account. Please contact a Super Admin.' }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });

    const adminSessionToken = crypto.randomUUID();
    await supabase.from('drm_access_tokens').insert({ admin_id: admin.id, token_hash: await sha256(adminSessionToken), token_type: 'admin_session', expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), is_valid: true });
    await supabase.from('drm_audit_events').insert({ event_type: 'ADMIN_ACTIVATED', admin_id: admin.id, event_metadata: { role: admin.role } });
    return new Response(JSON.stringify({ ok: true, message: 'Admin account activated successfully.', admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }, adminToken: adminSessionToken }), { status: 200, headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch {
    return new Response(JSON.stringify({ ok: false, message: 'An unexpected error occurred.' }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
});
