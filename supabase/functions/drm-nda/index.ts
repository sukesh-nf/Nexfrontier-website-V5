// verify_jwt: false (internal session-token auth, not JWT)
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Validate session token from header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Authentication required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '').trim();
    const sessionHash = await sha256(sessionToken);

    const { data: tokenRow, error: tokenError } = await supabase
      .from('drm_access_tokens')
      .select('id, investor_id, expires_at, is_valid')
      .eq('token_hash', sessionHash)
      .eq('token_type', 'session')
      .maybeSingle();

    if (tokenError || !tokenRow || !tokenRow.is_valid || new Date(tokenRow.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Session expired. Please log in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Re-check investor status
    const { data: investor, error: invError } = await supabase
      .from('drm_investors')
      .select('id, name, email, nda_signed, access_level, status')
      .eq('id', tokenRow.investor_id)
      .maybeSingle();

    if (invError || !investor || investor.status !== 'active') {
      return new Response(
        JSON.stringify({ ok: false, message: 'Access is no longer active.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'status';

    // ── GET NDA STATUS ──
    if (req.method === 'GET' && action === 'status') {
      // Fetch current NDA version
      const { data: currentNda, error: ndaError } = await supabase
        .from('nda_versions')
        .select('id, version, body_text')
        .eq('is_current', true)
        .maybeSingle();

      if (ndaError || !currentNda) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to load NDA.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Check if investor has accepted the current version
      const { data: acceptance } = await supabase
        .from('nda_acceptances')
        .select('id, accepted_at')
        .eq('investor_id', investor.id)
        .eq('nda_version_id', currentNda.id)
        .maybeSingle();

      const hasAcceptedCurrent = !!acceptance;

      return new Response(
        JSON.stringify({
          ok: true,
          investor: {
            id: investor.id,
            name: investor.name,
            email: investor.email,
          },
          nda: {
            version: currentNda.version,
            body_text: currentNda.body_text,
            has_accepted_current: hasAcceptedCurrent,
            accepted_at: acceptance?.accepted_at || null,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── ACCEPT NDA ──
    if (req.method === 'POST' && action === 'accept') {
      const body = await req.json();
      const fullLegalName = String(body.full_legal_name ?? '').trim();
      const company = String(body.company ?? '').trim();
      const titleRole = String(body.title_role ?? '').trim();
      const confirmed = Boolean(body.confirmed);

      if (!fullLegalName || !company || !titleRole) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Full legal name, company and title are required.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      if (!confirmed) {
        return new Response(
          JSON.stringify({ ok: false, message: 'You must confirm you have read and agree to the NDA.' }),
          { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Fetch current NDA version — include body_text for hash computation
      const { data: currentNda, error: ndaError } = await supabase
        .from('nda_versions')
        .select('id, version, body_text')
        .eq('is_current', true)
        .maybeSingle();

      if (ndaError || !currentNda) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to load NDA.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Check if already accepted this version (idempotent)
      const { data: existing } = await supabase
        .from('nda_acceptances')
        .select('id')
        .eq('investor_id', investor.id)
        .eq('nda_version_id', currentNda.id)
        .maybeSingle();

      if (existing) {
        // Already accepted — update investor nda_signed if needed
        if (!investor.nda_signed) {
          await supabase
            .from('drm_investors')
            .update({ nda_signed: true, access_level: 2 })
            .eq('id', investor.id);
        }

        return new Response(
          JSON.stringify({ ok: true, message: 'NDA already accepted.', nda_version: currentNda.version }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Compute SHA-256 hash of the exact NDA body presented
      const bodyHash = await sha256(currentNda.body_text);

      // Insert acceptance record with audit fields
      const userAgent = req.headers.get('User-Agent') || null;

      const { error: insertError } = await supabase
        .from('nda_acceptances')
        .insert({
          investor_id: investor.id,
          nda_version_id: currentNda.id,
          full_legal_name: fullLegalName,
          company: company,
          title_role: titleRole,
          nda_version: currentNda.version,
          acceptance_status: 'accepted',
          user_agent: userAgent,
          nda_body_hash: bodyHash,
          investor_email: investor.email,
          acceptance_statement_version: 'investor-nda-acceptance-v1',
        });

      if (insertError) {
        return new Response(
          JSON.stringify({ ok: false, message: 'Unable to record NDA acceptance.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      // Update investor record: nda_signed = true, access_level = 2
      await supabase
        .from('drm_investors')
        .update({ nda_signed: true, access_level: 2 })
        .eq('id', investor.id);

      // Log NDA acceptance
      await supabase.from('drm_activity_log').insert({
        investor_id: investor.id,
        event_type: 'nda_accepted',
        event_detail: {
          nda_version: currentNda.version,
          full_legal_name: fullLegalName,
          company: company,
          title_role: titleRole,
        },
      });

      return new Response(
        JSON.stringify({
          ok: true,
          message: 'NDA accepted. You may now access the Investor Data Room.',
          nda_version: currentNda.version,
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
