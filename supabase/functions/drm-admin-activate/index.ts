// verify_jwt: false (admin activation token auth, not JWT)
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
  for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ bBytes[i];
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
    const activationToken = String(body.activationToken ?? '').trim();
    const passphrase = String(body.passphrase ?? '').trim();

    if (!activationToken || !passphrase) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Activation token and passphrase are required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (passphrase.length < 12) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Passphrase must be at least 12 characters.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const tokenHash = await sha256(activationToken);

    // Find admin activation token — completely separate from investor tokens
    const { data: tokenRow, error: tokenError } = await supabase
      .from('drm_access_tokens')
      .select('id, admin_id, expires_at, is_valid, used_at')
      .eq('token_hash', tokenHash)
      .eq('token_type', 'admin_activation')
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid activation token.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!tokenRow.is_valid || tokenRow.used_at) {
      return new Response(
        JSON.stringify({ ok: false, message: 'This activation token has already been used.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      await supabase.from('drm_access_tokens').update({ is_valid: false }).eq('id', tokenRow.id);
      return new Response(
        JSON.stringify({ ok: false, message: 'This activation link has expired. Admin activation links are valid for 48 hours. Please ask a Super Admin to issue a new activation link.' }),
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
        JSON.stringify({ ok: false, message: 'This activation token has already been used.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Hash passphrase and activate admin
    const salt = generateSalt();
    const passphraseHash = await pbkdf2Hash(passphrase, salt);

    const { data: admin, error: adminError } = await supabase
      .from('drm_admins')
      .update({
        passphrase_hash: passphraseHash,
        admin_status: 'active',
        activated_at: new Date().toISOString(),
      })
      .eq('id', tokenRow.admin_id)
      .select('id, name, email, role')
      .single();

    if (adminError || !admin) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to activate admin account. Please contact a Super Admin.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Generate admin session token
    const adminSessionToken = crypto.randomUUID();
    const adminSessionTokenHash = await sha256(adminSessionToken);

    await supabase.from('drm_access_tokens').insert({
      admin_id: admin.id,
      token_hash: adminSessionTokenHash,
      token_type: 'admin_session',
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      is_valid: true,
    });

    await supabase.from('drm_audit_events').insert({
      event_type: 'ADMIN_ACTIVATED',
      admin_id: admin.id,
      event_metadata: { role: admin.role },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Admin account activated successfully.',
        admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
        adminToken: adminSessionToken,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, message: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
