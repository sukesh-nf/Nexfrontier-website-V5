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

    // 1. Validate session token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ ok: false, code: 'AUTH_REQUIRED', message: 'Authentication required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '').trim();
    const sessionHash = await sha256(sessionToken);

    const { data: tokenRow } = await supabase
      .from('drm_access_tokens')
      .select('id, investor_id, expires_at, is_valid')
      .eq('token_hash', sessionHash)
      .eq('token_type', 'session')
      .maybeSingle();

    if (!tokenRow || !tokenRow.is_valid || new Date(tokenRow.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ ok: false, code: 'AUTH_EXPIRED', message: 'Session expired. Please log in again.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 2. Re-check investor status
    const { data: investor } = await supabase
      .from('drm_investors')
      .select('id, name, email, nda_signed, access_level, lifecycle_status, status')
      .eq('id', tokenRow.investor_id)
      .maybeSingle();

    if (!investor) {
      return new Response(
        JSON.stringify({ ok: false, code: 'AUTH_REQUIRED', message: 'Authentication required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const accessStatus = investor.lifecycle_status || investor.status;

    if (accessStatus !== 'active') {
      const code = accessStatus === 'suspended' ? 'ACCESS_SUSPENDED' : 'ACCESS_REVOKED';
      return new Response(
        JSON.stringify({ ok: false, code, message: 'Access is no longer active.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (investor.access_level < 2) {
      return new Response(
        JSON.stringify({ ok: false, code: 'NDA_REQUIRED', message: 'NDA acceptance required before accessing the Data Room.', nda_required: true }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 3. NDA gate
    const { data: currentNda } = await supabase
      .from('nda_versions')
      .select('id')
      .eq('is_current', true)
      .maybeSingle();

    if (currentNda) {
      const { data: ndaAcceptance } = await supabase
        .from('nda_acceptances')
        .select('id')
        .eq('investor_id', investor.id)
        .eq('nda_version_id', currentNda.id)
        .maybeSingle();

      if (!ndaAcceptance) {
        return new Response(
          JSON.stringify({ ok: false, code: 'NDA_REQUIRED', message: 'NDA acceptance required before accessing the Data Room.', nda_required: true }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    // 4. Parse request
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || '';
    const slug = url.searchParams.get('slug');

    // List published topics for Data Room Home
    if (action === 'list-topics') {
      const { data: pages } = await supabase
        .from('drm_pages')
        .select('id, slug, title, question, sort_order, searchable')
        .eq('status', 'published')
        .not('current_published_version_id', 'is', null)
        .order('sort_order', { ascending: true });

      return new Response(
        JSON.stringify({
          ok: true,
          topics: (pages || []).map(p => ({ slug: p.slug, title: p.title, question: p.question, searchable: p.searchable })),
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!slug) {
      return new Response(
        JSON.stringify({ ok: false, code: 'BAD_REQUEST', message: 'Missing page slug.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 5. Fetch page from database — only published pages
    const { data: page } = await supabase
      .from('drm_pages')
      .select('id, slug, title, question, status, current_published_version_id')
      .eq('slug', slug)
      .maybeSingle();

    if (!page || page.status !== 'published') {
      return new Response(
        JSON.stringify({ ok: false, code: 'PAGE_UNAVAILABLE', message: 'This page is not available.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 6. Fetch current published version content
    if (!page.current_published_version_id) {
      return new Response(
        JSON.stringify({ ok: false, code: 'PAGE_UNAVAILABLE', message: 'This page is not available.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: publishedVersion } = await supabase
      .from('drm_page_versions')
      .select('content_json, published_at')
      .eq('id', page.current_published_version_id)
      .maybeSingle();

    if (!publishedVersion) {
      return new Response(
        JSON.stringify({ ok: false, code: 'PAGE_UNAVAILABLE', message: 'This page is not available.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 7. Fetch active supporting materials (only if page is published)
    const { data: materials } = await supabase
      .from('drm_supporting_materials')
      .select('title, description, material_type, printable')
      .eq('page_id', page.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    // 8. Format last updated from published_at
    const lastUpdated = publishedVersion.published_at
      ? new Date(publishedVersion.published_at).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    // 9. Log page access
    await supabase.from('drm_activity_log').insert({
      investor_id: investor.id,
      event_type: 'page_view',
      event_detail: { slug, page_title: page.title },
    });

    // 10. Return authorised content
    const content = publishedVersion.content_json as Record<string, unknown>;
    const sections = (content?.sections as Record<string, unknown>[]) || [];
    const relatedLinks = (content?.related_links as Record<string, unknown>[]) || [];

    return new Response(
      JSON.stringify({
        ok: true,
        slug,
        title: page.title,
        question: page.question,
        sections,
        related_links: relatedLinks,
        supporting_materials: (materials || []).map(m => ({
          name: m.title,
          description: m.description || undefined,
          material_type: m.material_type,
        })),
        last_updated: lastUpdated,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, code: 'SERVER_ERROR', message: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
