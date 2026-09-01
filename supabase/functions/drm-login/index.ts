// verify_jwt: true (platform-level JWT gate enabled)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { sendMailgunEmail, otpEmailHtml } from '../_shared/mailgun.ts';

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
// Brute-force protection (passphrase step)
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
// Second factor: email OTP, investor return-login only. Admin login is
// unaffected and keeps passphrase-only auth.
const OTP_DURATION_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function generateOtpCode(): string {
  // crypto.getRandomValues, not Math.random() — this gates real account access.
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (100000 + (buf[0] % 900000)).toString();
}

async function issueSession(supabase: any, investor: {
  id: string; name: string; email: string; nda_signed: boolean; access_level: number;
}) {
  const sessionToken = crypto.randomUUID();
  const sessionHash = await sha256(sessionToken);

  await supabase.from('drm_access_tokens').insert({
    investor_id: investor.id,
    token_hash: sessionHash,
    token_type: 'session',
    expires_at: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    is_valid: true,
  });

  await supabase.from('drm_activity_log').insert({
    investor_id: investor.id,
    event_type: 'login',
    event_detail: { method: 'return_visitor' },
  });

  const sessionId = crypto.randomUUID();
  await supabase.from('drm_analytics_events').insert({
    investor_id: investor.id,
    event_type: 'session_start',
    session_id: sessionId,
  });

  return {
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
  };
}

async function issueAndSendOtp(supabase: any, investor: { id: string; name: string; email: string }) {
  // Invalidate any prior outstanding codes for this investor first.
  await supabase.from('drm_login_otp').delete().eq('investor_id', investor.id).is('used_at', null);

  const code = generateOtpCode();
  const codeHash = await sha256(code);

  await supabase.from('drm_login_otp').insert({
    investor_id: investor.id,
    code_hash: codeHash,
    expires_at: new Date(Date.now() + OTP_DURATION_MS).toISOString(),
  });

  const emailResult = await sendMailgunEmail({
    to: investor.email,
    subject: 'Your NexFrontier sign-in code',
    html: otpEmailHtml({ name: investor.name, code }),
  });

  return emailResult.sent;
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
    const action = String(body.action ?? 'password');

    // ============================================================
    // STEP 2: VERIFY OTP CODE (issues the actual session token)
    // ============================================================
    if (action === 'verify-otp') {
      const investorId = String(body.investorId ?? '').trim();
      const code = String(body.code ?? '').trim();

      if (!investorId || !code) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Code is required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: investor } = await supabase
        .from('drm_investors')
        .select('id, name, email, nda_signed, access_level, status')
        .eq('id', investorId)
        .maybeSingle();

      const GENERIC_OTP_FAIL = 'That code is incorrect or has expired.';

      if (!investor || investor.status !== 'active') {
        return new Response(
          JSON.stringify({ ok: false, message: GENERIC_OTP_FAIL }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const { data: otpRow } = await supabase
        .from('drm_login_otp')
        .select('id, code_hash, attempts, expires_at, used_at')
        .eq('investor_id', investorId)
        .is('used_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!otpRow || new Date(otpRow.expires_at) < new Date() || otpRow.attempts >= MAX_OTP_ATTEMPTS) {
        return new Response(
          JSON.stringify({ ok: false, message: GENERIC_OTP_FAIL }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const codeHash = await sha256(code);
      const isMatch = timingSafeEqual(codeHash, otpRow.code_hash);

      if (!isMatch) {
        await supabase.from('drm_login_otp').update({ attempts: otpRow.attempts + 1 }).eq('id', otpRow.id);
        return new Response(
          JSON.stringify({ ok: false, message: GENERIC_OTP_FAIL }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      await supabase.from('drm_login_otp').update({ used_at: new Date().toISOString() }).eq('id', otpRow.id);

      const result = await issueSession(supabase, investor as any);
      return new Response(JSON.stringify(result), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ============================================================
    // RESEND OTP CODE
    // ============================================================
    if (action === 'resend-otp') {
      const investorId = String(body.investorId ?? '').trim();
      const { data: investor } = await supabase
        .from('drm_investors')
        .select('id, name, email, status')
        .eq('id', investorId)
        .maybeSingle();

      if (!investor || investor.status !== 'active') {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to resend code.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      const emailSent = await issueAndSendOtp(supabase, investor as any);
      return new Response(
        JSON.stringify({ ok: true, emailSent }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // STEP 1: VERIFY PASSPHRASE (triggers OTP instead of a session)
    // ============================================================
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

    if (invError || !investor || investor.status !== 'active' || !investor.passphrase_hash) {
      await pbkdf2Verify(passphrase, DUMMY_HASH);
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

    // Verify passphrase using PBKDF2
    const isMatch = await pbkdf2Verify(passphrase, investor.passphrase_hash);

    if (!isMatch) {
      // Increment failed attempts
      const newAttemptCount = (investor.failed_login_attempts || 0) + 1;
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

    // Reset failed attempts on successful passphrase check
    await supabase
      .from('drm_investors')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_access: new Date().toISOString(),
      })
      .eq('id', investor.id);

    // Passphrase correct — do not issue a session yet. Second factor required.
    const emailSent = await issueAndSendOtp(supabase, investor as any);

    return new Response(
      JSON.stringify({
        ok: true,
        otpRequired: true,
        emailSent,
        investorId: investor.id,
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
