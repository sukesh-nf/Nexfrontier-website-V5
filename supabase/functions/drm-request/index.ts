// verify_jwt: true (platform-level JWT gate enabled)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
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

    const body = await req.json();
    const name = String(body.name ?? '').trim().slice(0, 200);
    const email = String(body.email ?? '').trim().slice(0, 320);
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
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to submit request at this time.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

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
