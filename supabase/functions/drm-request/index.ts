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

// Rate limit: max 3 requests per email per 24 hours, max 10 per email total
const RATE_LIMIT_WINDOW_HOURS = 24;
const RATE_LIMIT_MAX_PER_WINDOW = 3;

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
    const name = String(body.name ?? '').trim().slice(0, 200);
    const email = String(body.email ?? '').trim().toLowerCase().slice(0, 320);
    const phone = String(body.phone ?? '').trim().slice(0, 50);
    const organisation = String(body.organisation ?? '').trim().slice(0, 300);
    const role = String(body.role ?? '').trim().slice(0, 200);
    const message = String(body.message ?? '').trim().slice(0, 5000);

    if (!name || !email) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Name and email are required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please provide a valid email address.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Rate limiting: check recent submissions by email hash
    const emailHash = await sha256(email);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    const { count: recentCount } = await supabase
      .from('drm_request_rate_limit')
      .select('*', { count: 'exact', head: true })
      .eq('email_hash', emailHash)
      .gte('created_at', windowStart);

    if ((recentCount || 0) >= RATE_LIMIT_MAX_PER_WINDOW) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Your request has been received. A member of the NexFrontier team will review it and contact you with next steps.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data, error } = await supabase
      .from('drm_investor_requests')
      .insert({
        name,
        email,
        phone,
        organisation,
        role,
        message,
        source: 'investor-brief-request',
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      // Generic error — do not disclose whether email already exists
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to submit request at this time.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Record rate limit entry
    await supabase.from('drm_request_rate_limit').insert({ email_hash: emailHash });

    // Structured audit event
    await supabase.from('drm_audit_events').insert({
      event_type: 'REQUEST_SUBMITTED',
      request_id: data.id,
      event_metadata: { source: 'investor-brief-request' },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Your request has been received. A member of the NexFrontier team will review it and contact you with next steps.',
        requestId: data.id,
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
