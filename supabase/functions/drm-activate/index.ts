// verify_jwt: true (platform-level JWT gate enabled)
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

async function pbkdf2Hash(passphrase: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const saltBytes = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes, iterations: 600000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:600000:${saltHex}:${hashHex}`;
}

// Session duration: 8 hours for investor sessions
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

// Brute-force protection: lock after 5 failed attempts for 15 minutes
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

    const body = await req.json();
    const token = String(body.token ?? '').trim();
    const passphrase = String(body.passphrase ?? '').trim();

    if (!token) {
      return new Response(
        JSON.stringify({ ok: false, message: 'A token is required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!passphrase || passphrase.length < 12) {
      return new Response(
        JSON.stringify({ ok: false, message: 'A passphrase of at least 12 characters is required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const tokenHash = await sha256(token);

    const { data: tokenRow, error: tokenError } = await supabase
      .from('drm_access_tokens')
      .select('id, investor_id, expires_at, used_at, is_valid')
      .eq('token_hash', tokenHash)
      .in('token_type', ['invitation', 're-invitation'])
      .maybeSingle();

    if (tokenError || !tokenRow) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid or expired token.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!tokenRow.is_valid || tokenRow.used_at) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid or expired token.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (new Date(tokenRow.expires_at) < new Date()) {
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('id', tokenRow.id);

      await supabase.from('drm_audit_events').insert({
        event_type: 'ACTIVATION_TOKEN_EXPIRED_ATTEMPT',
        investor_id: tokenRow.investor_id,
        event_metadata: { token_type: tokenRow.token_type },
      });

      return new Response(
        JSON.stringify({ ok: false, code: 'TOKEN_EXPIRED', message: 'This activation link has expired. Investor activation links are valid for 48 hours. Please request a fresh link from NexFrontier.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Atomically claim the invitation token (single-use). If no row comes back,
    // another request claimed it first.
    const { data: claimedToken } = await supabase
      .from('drm_access_tokens')
      .update({ used_at: new Date().toISOString(), is_valid: false })
      .eq('id', tokenRow.id)
      .eq('is_valid', true)
      .is('used_at', null)
      .select('id')
      .maybeSingle();

    if (!claimedToken) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid or expired token.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Hash the investor's chosen passphrase using PBKDF2
    const salt = generateSalt();
    const passphraseHash = await pbkdf2Hash(passphrase, salt);

    // Activate investor and store passphrase hash
    // Use lifecycle_status as canonical; DB trigger syncs legacy status
    const { data: investor, error: invError } = await supabase
      .from('drm_investors')
      .update({
        lifecycle_status: 'active',
        first_activation: new Date().toISOString(),
        last_access: new Date().toISOString(),
        passphrase_hash: passphraseHash,
        failed_login_attempts: 0,
        locked_until: null,
      })
      .eq('id', tokenRow.investor_id)
      .select('id, name, email, nda_signed, access_level')
      .single();

    if (invError || !investor) {
      // Half-activation recovery: token was consumed but investor update failed.
      // Admin can issue a fresh token. Log the failure.
      await supabase.from('drm_activation_log').insert({
        investor_id: tokenRow.investor_id,
        token_id: tokenRow.id,
        status: 'failed',
      });
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to activate access. Please contact NexFrontier for a new activation link.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Log activation
    await supabase.from('drm_activity_log').insert({
      investor_id: investor.id,
      event_type: 'invitation_activated',
      event_detail: { token_type: 'invitation' },
    });
    await supabase.from('drm_audit_events').insert({
      event_type: 'INVESTOR_ACTIVATED',
      investor_id: investor.id,
      event_metadata: { token_type: 'invitation' },
    });
    // Mark activation as completed in recovery log
    await supabase.from('drm_activation_log').insert({
      investor_id: investor.id,
      token_id: tokenRow.id,
      status: 'completed',
      activation_completed_at: new Date().toISOString(),
    });

    // Generate a short-lived session token (8 hours)
    const sessionToken = crypto.randomUUID();
    const sessionHash = await sha256(sessionToken);

    await supabase.from('drm_access_tokens').insert({
      investor_id: investor.id,
      token_hash: sessionHash,
      token_type: 'session',
      expires_at: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
      is_valid: true,
    });

    // Log analytics session start
    const sessionId = crypto.randomUUID();
    await supabase.from('drm_analytics_events').insert({
      investor_id: investor.id,
      event_type: 'session_start',
      session_id: sessionId,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        investor: {
          id: investor.id,
          name: investor.name,
          email: investor.email,
          nda_signed: investor.nda_signed,
          access_level: investor.access_level,
        },
        sessionToken,
        sessionId,
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
// v5 pbkdf2 600k timing-safe + secure salt
