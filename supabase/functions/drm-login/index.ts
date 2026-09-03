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

// Session duration: 8 hours
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
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

    const body = await req.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const passphrase = String(body.passphrase ?? '').trim();

    if (!email || !passphrase) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Email and passphrase are required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch investor by email — include passphrase_hash for verification
    const { data: investor, error: invError } = await supabase
      .from('drm_investors')
      .select('id, name, email, nda_signed, access_level, status, passphrase_hash, failed_login_attempts, locked_until')
      .eq('email', email)
      .maybeSingle();

    // Generic error — do not disclose whether the email exists
    const GENERIC_FAIL = 'Invalid email or passphrase.';

    if (invError || !investor || !investor.passphrase_hash) {
      await pbkdf2Verify(passphrase, DUMMY_HASH);
      return new Response(
        JSON.stringify({ ok: false, message: GENERIC_FAIL }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Check lifecycle status — provide precise denial messages
    if (investor.status === 'suspended') {
      await supabase.from('drm_audit_events').insert({
        event_type: 'LOGIN_DENIED_STATUS',
        investor_id: investor.id,
        event_metadata: { status: 'suspended' },
      });
      return new Response(
        JSON.stringify({ ok: false, code: 'ACCESS_SUSPENDED', message: 'Your access has been suspended. Please contact NexFrontier.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (accessStatus === 'revoked') {
      await supabase.from('drm_audit_events').insert({
        event_type: 'LOGIN_DENIED_STATUS',
        investor_id: investor.id,
        event_metadata: { status: 'revoked' },
      });
      return new Response(
        JSON.stringify({ ok: false, code: 'ACCESS_REVOKED', message: 'Your access has been revoked. Please contact NexFrontier.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (accessStatus !== 'active') {
      await supabase.from('drm_audit_events').insert({
        event_type: 'LOGIN_DENIED_STATUS',
        investor_id: investor.id,
        event_metadata: { status: accessStatus },
      });
      return new Response(
        JSON.stringify({ ok: false, message: GENERIC_FAIL }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Check if account is locked
    if (investor.locked_until && new Date(investor.locked_until) > new Date()) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Too many failed attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // A lock that has already elapsed clears the failure counter, so an attacker
    // cannot keep an account permanently locked with one attempt per window.
    const priorAttempts = investor.locked_until ? 0 : (investor.failed_login_attempts || 0);

    // Verify passphrase using PBKDF2
    const isMatch = await pbkdf2Verify(passphrase, investor.passphrase_hash);

    if (!isMatch) {
      // Increment failed attempts
      const newAttemptCount = priorAttempts + 1;
      const shouldLock = newAttemptCount >= MAX_FAILED_ATTEMPTS;

      await supabase
        .from('drm_investors')
        .update({
          failed_login_attempts: newAttemptCount,
          locked_until: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS).toISOString() : null,
        })
        .eq('id', investor.id);

      return new Response(
        JSON.stringify({ ok: false, message: GENERIC_FAIL }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Reset failed attempts on successful login
    await supabase
      .from('drm_investors')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_access: new Date().toISOString(),
      })
      .eq('id', investor.id);

    // Generate short-lived session token (8 hours)
    const sessionToken = crypto.randomUUID();
    const sessionHash = await sha256(sessionToken);

    await supabase.from('drm_access_tokens').insert({
      investor_id: investor.id,
      token_hash: sessionHash,
      token_type: 'session',
      expires_at: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
      is_valid: true,
    });

    // Log login
    await supabase.from('drm_activity_log').insert({
      investor_id: investor.id,
      event_type: 'login',
      event_detail: { method: 'return_visitor' },
    });
    await supabase.from('drm_audit_events').insert({
      event_type: 'LOGIN_SUCCESS',
      investor_id: investor.id,
      event_metadata: { method: 'return_visitor' },
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
// v5 pbkdf2 600k timing-safe + secure salt + dummy verify
