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

    // Re-check investor status and NDA at request time — do not trust cached access level
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

    // NDA gate: check if investor has accepted the current NDA version
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
          JSON.stringify({ ok: false, message: 'NDA acceptance required before accessing the Data Room.', nda_required: true }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    // Sign out — invalidate the presented session token server-side
    if (new URL(req.url).searchParams.get('action') === 'logout') {
      await supabase
        .from('drm_access_tokens')
        .update({ is_valid: false })
        .eq('id', tokenRow.id);

      return new Response(
        JSON.stringify({ ok: true, message: 'Signed out.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch folders
    const { data: folders, error: folderError } = await supabase
      .from('drm_folders')
      .select('id, name, display_order')
      .order('display_order', { ascending: true });

    if (folderError) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to load folders.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Fetch documents — filter by CURRENT access level (re-checked above)
    // Level 1 (no NDA): only 'public' documents
    // Level 2 (NDA signed): 'public' + 'nda_required' documents
    let documentsQuery = supabase
      .from('drm_documents')
      .select('id, folder_id, name, google_link, security_classification, display_order, is_investor_brief, created_at, updated_at')
      .order('display_order', { ascending: true });

    if (investor.access_level < 2) {
      documentsQuery = documentsQuery.eq('security_classification', 'public');
    }

    const { data: documents, error: docError } = await documentsQuery;

    if (docError) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to load documents.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Log document access if a specific document was requested
    const url = new URL(req.url);
    const docId = url.searchParams.get('documentId');
    if (docId) {
      const doc = documents?.find(d => d.id === docId);
      if (doc) {
        await supabase.from('drm_activity_log').insert({
          investor_id: investor.id,
          event_type: 'document_view',
          event_detail: { document_id: doc.id, document_name: doc.name },
        });
        await supabase.from('drm_analytics_events').insert({
          investor_id: investor.id,
          event_type: 'document_view',
          document_id: doc.id,
          session_id: url.searchParams.get('sessionId') || null,
        });
      }
    }

    // Log folder access
    const folderId = url.searchParams.get('folderId');
    if (folderId) {
      const folder = folders?.find(f => f.id === folderId);
      if (folder) {
        await supabase.from('drm_activity_log').insert({
          investor_id: investor.id,
          event_type: 'folder_access',
          event_detail: { folder_id: folder.id, folder_name: folder.name },
        });
        await supabase.from('drm_analytics_events').insert({
          investor_id: investor.id,
          event_type: 'folder_access',
          folder_id: folder.id,
          session_id: url.searchParams.get('sessionId') || null,
        });
      }
    }

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
        folders: folders || [],
        documents: documents || [],
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
