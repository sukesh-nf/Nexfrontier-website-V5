// verify_jwt: false (bootstrap is pre-auth, secret-gated)
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

const DUMMY_HASH = 'pbkdf2:600000:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000';

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
    const bootstrapSecret = String(body.bootstrapSecret ?? '').trim();

    if (!name || !email || !bootstrapSecret) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Name, email and bootstrap secret are required.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Verify bootstrap secret against stored hash
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

    // Check if any active super admin already exists (self-disable)
    const { count: activeSuperCount } = await supabase
      .from('drm_admins')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'super_admin')
      .eq('admin_status', 'active');

    if ((activeSuperCount || 0) > 0) {
      return new Response(
        JSON.stringify({ ok: false, code: 'ADMIN_BOOTSTRAP_ALREADY_COMPLETE', message: 'Bootstrap is already complete. Use the Admin Console to manage administrators.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('drm_admins')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ ok: false, code: 'EMAIL_EXISTS', message: 'An admin with this email already exists.' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Create the first super admin with invited status
    const { data: newAdmin, error: createError } = await supabase
      .from('drm_admins')
      .insert({
        name,
        email,
        role: 'super_admin',
        admin_status: 'invited',
        created_by: null,
        passphrase_hash: DUMMY_HASH,
      })
      .select('id')
      .single();

    if (createError || !newAdmin) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to create admin record.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Generate activation token
    const activationToken = crypto.randomUUID();
    const activationTokenHash = await sha256(activationToken);

    await supabase.from('drm_access_tokens').insert({
      admin_id: newAdmin.id,
      token_hash: activationTokenHash,
      token_type: 'admin_activation',
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      is_valid: true,
      issuance_reason: 'bootstrap',
    });

    // Audit event
    await supabase.from('drm_audit_events').insert({
      event_type: 'ADMIN_BOOTSTRAP_CREATED',
      admin_id: newAdmin.id,
      event_metadata: { mechanism: 'bootstrap_edge_function', email },
    });

    // Build activation URL for DEV manual delivery
    const baseUrl = Deno.env.get('PUBLIC_SITE_URL') || 'https://v5-nexfrontier-green-hz85.bolt.host';
    const activationUrl = `${baseUrl}/investor-admin?activate=${activationToken}`;

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'DEV MANUAL DELIVERY — First Super Admin created. Share the activation URL with the intended admin.',
        devActivationUrl: activationUrl,
        devWarning: 'This activation URL contains a secret. Share only with the intended admin. It expires 48 hours after issue and will not be shown again.',
        adminId: newAdmin.id,
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
