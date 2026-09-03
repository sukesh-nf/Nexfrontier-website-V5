// verify_jwt: false (internal admin-session-token auth, not JWT)
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

type AdminRole = 'super_admin' | 'investor_admin' | 'content_admin';

const CONTENT_PERMISSIONS: Record<AdminRole, Set<string>> = {
  super_admin: new Set(['content.view', 'content.edit', 'content.publish', 'content.archive', 'content.material.manage']),
  investor_admin: new Set(),
  content_admin: new Set(['content.view', 'content.edit', 'content.publish', 'content.archive', 'content.material.manage']),
};

function hasPermission(role: string | null, permission: string): boolean {
  if (!role) return false;
  const perms = CONTENT_PERMISSIONS[role as AdminRole];
  if (!perms) return false;
  return perms.has(permission);
}

const VALID_EVIDENCE_STATES = ['ASSUMPTION', 'HYPOTHESIS', 'THESIS', 'EVIDENCE', 'CUSTOMER VALIDATION', 'PAID VALIDATION', 'REPEATABLE PROOF'];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || '';
    const body = await req.json().catch(() => ({}));

    // ============================================================
    // ADMIN AUTH — shared session validation
    // ============================================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Admin authentication required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const adminToken = authHeader.replace('Bearer ', '').trim();
    const adminTokenHash = await sha256(adminToken);

    const { data: adminSession } = await supabase
      .from('drm_access_tokens')
      .select('id, admin_id, expires_at, is_valid')
      .eq('token_hash', adminTokenHash)
      .eq('token_type', 'admin_session')
      .maybeSingle();

    if (!adminSession || !adminSession.is_valid || new Date(adminSession.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Admin session expired or invalid.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: adminAccount } = await supabase
      .from('drm_admins')
      .select('id, is_active, admin_status, role')
      .eq('id', adminSession.admin_id)
      .maybeSingle();

    if (!adminAccount || adminAccount.admin_status !== 'active') {
      await supabase.from('drm_access_tokens').update({ is_valid: false }).eq('id', adminSession.id);
      return new Response(
        JSON.stringify({ ok: false, message: 'Admin access is no longer active.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const adminId = adminSession.admin_id;
    const adminRole = adminAccount.role as AdminRole;

    const requirePermission = (permission: string): Response | null => {
      if (!hasPermission(adminRole, permission)) {
        return new Response(
          JSON.stringify({ ok: false, code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      return null;
    };

    // ============================================================
    // LIST PAGES
    // ============================================================
    if (action === 'list-pages') {
      const permDenied = requirePermission('content.view');
      if (permDenied) return permDenied;

      const { data: pages } = await supabase
        .from('drm_pages')
        .select(`
          id, slug, title, question, status, sort_order, security_level,
          searchable, printable, created_at, updated_at, current_published_version_id
        `)
        .order('sort_order', { ascending: true });

      // Get last published version info for each page
      const pageIds = (pages || []).map(p => p.id);
      let versionMap: Record<string, { version_number: number; published_at: string; published_by_name: string }> = {};
      if (pageIds.length > 0) {
        const { data: versions } = await supabase
          .from('drm_page_versions')
          .select('page_id, version_number, published_at, published_by, is_published')
          .in('page_id', pageIds)
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        const publisherIds = [...new Set((versions || []).map(v => v.published_by).filter(Boolean))] as string[];
        let publisherMap: Record<string, string> = {};
        if (publisherIds.length > 0) {
          const { data: publishers } = await supabase
            .from('drm_admins')
            .select('id, name')
            .in('id', publisherIds);
          (publishers || []).forEach(p => { publisherMap[p.id] = p.name; });
        }

        (versions || []).forEach(v => {
          if (!versionMap[v.page_id]) {
            versionMap[v.page_id] = {
              version_number: v.version_number,
              published_at: v.published_at,
              published_by_name: publisherMap[v.published_by] || '—',
            };
          }
        });
      }

      // Get draft version info
      let draftMap: Record<string, { version_number: number; created_at: string }> = {};
      if (pageIds.length > 0) {
        const { data: drafts } = await supabase
          .from('drm_page_versions')
          .select('page_id, version_number, created_at, is_published')
          .in('page_id', pageIds)
          .is('published_at', null)
          .order('created_at', { ascending: false });

        (drafts || []).forEach(v => {
          if (!draftMap[v.page_id]) {
            draftMap[v.page_id] = { version_number: v.version_number, created_at: v.created_at };
          }
        });
      }

      return new Response(
        JSON.stringify({
          ok: true,
          pages: (pages || []).map(p => ({
            ...p,
            current_published_version: versionMap[p.id] || null,
            current_draft: draftMap[p.id] || null,
          })),
          adminRole,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // GET PAGE (with current published + draft + version history + materials)
    // ============================================================
    if (action === 'get-page') {
      const permDenied = requirePermission('content.view');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      if (!pageId) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { data: page } = await supabase
        .from('drm_pages')
        .select('id, slug, title, question, status, sort_order, security_level, searchable, printable, created_at, updated_at, current_published_version_id')
        .eq('id', pageId)
        .maybeSingle();

      if (!page) {
        return new Response(JSON.stringify({ ok: false, message: 'Page not found.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const [{ data: versions }, { data: materials }] = await Promise.all([
        supabase.from('drm_page_versions').select('id, version_number, content_json, change_note, content_hash, created_at, created_by, published_at, published_by, is_published').eq('page_id', pageId).order('version_number', { ascending: false }),
        supabase.from('drm_supporting_materials').select('id, title, description, material_type, status, printable, created_at, updated_at').eq('page_id', pageId).order('created_at', { ascending: true }),
      ]);

      // Enrich version creator/publisher names
      const createdByIds = (versions || []).map(v => v.created_by).filter(Boolean) as string[];
      const publishedByIds = (versions || []).map(v => v.published_by).filter(Boolean) as string[];
      const allAdminIds = [...new Set([...createdByIds, ...publishedByIds])];
      let adminNameMap: Record<string, string> = {};
      if (allAdminIds.length > 0) {
        const { data: admins } = await supabase.from('drm_admins').select('id, name').in('id', allAdminIds);
        (admins || []).forEach(a => { adminNameMap[a.id] = a.name; });
      }

      return new Response(
        JSON.stringify({
          ok: true,
          page,
          versions: (versions || []).map(v => ({
            ...v,
            created_by_name: adminNameMap[v.created_by] || '—',
            published_by_name: adminNameMap[v.published_by] || '—',
          })),
          materials: materials || [],
          adminRole,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ============================================================
    // CREATE DRAFT (from current published or as new v1)
    // ============================================================
    if (action === 'create-draft') {
      const permDenied = requirePermission('content.edit');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      if (!pageId) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Check if draft already exists
      const { data: existingDraft } = await supabase
        .from('drm_page_versions')
        .select('id, version_number')
        .eq('page_id', pageId)
        .is('published_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingDraft) {
        return new Response(JSON.stringify({ ok: false, code: 'DRAFT_EXISTS', message: 'A draft already exists for this page. Edit the existing draft.' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Get max version number
      const { data: maxVersion } = await supabase
        .from('drm_page_versions')
        .select('version_number')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersionNumber = (maxVersion?.version_number || 0) + 1;

      // Get current published content to copy as starting point
      const { data: currentPage } = await supabase
        .from('drm_pages')
        .select('current_published_version_id')
        .eq('id', pageId)
        .maybeSingle();

      let contentJson = { sections: [] };
      if (currentPage?.current_published_version_id) {
        const { data: publishedVersion } = await supabase
          .from('drm_page_versions')
          .select('content_json')
          .eq('id', currentPage.current_published_version_id)
          .maybeSingle();
        if (publishedVersion?.content_json) {
          contentJson = publishedVersion.content_json;
        }
      }

      const { data: newDraft, error: draftError } = await supabase
        .from('drm_page_versions')
        .insert({
          page_id: pageId,
          version_number: nextVersionNumber,
          content_json: contentJson,
          is_published: false,
          created_by: adminId,
        })
        .select('id, version_number')
        .single();

      if (draftError || !newDraft) {
        return new Response(JSON.stringify({ ok: false, message: 'Unable to create draft.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Update page status to draft if it was inactive
      await supabase.from('drm_pages').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('id', pageId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_DRAFT_CREATED', admin_id: adminId,
        event_metadata: { page_id: pageId, version_number: nextVersionNumber },
      });

      return new Response(JSON.stringify({ ok: true, draftId: newDraft.id, versionNumber: nextVersionNumber }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // SAVE DRAFT
    // ============================================================
    if (action === 'save-draft') {
      const permDenied = requirePermission('content.edit');
      if (permDenied) return permDenied;

      const draftId = String(body.draftId ?? '').trim();
      const contentJson = body.contentJson;
      const changeNote = String(body.changeNote ?? '').trim() || null;
      const revisionToken = String(body.revisionToken ?? '').trim(); // for optimistic concurrency

      if (!draftId || !contentJson) {
        return new Response(JSON.stringify({ ok: false, message: 'Draft ID and content are required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Validate content structure
      const sections = (contentJson as Record<string, unknown>)?.sections;
      if (sections && Array.isArray(sections)) {
        for (const s of sections as Record<string, unknown>[]) {
          if (s.evidence_state && !VALID_EVIDENCE_STATES.includes(String(s.evidence_state))) {
            return new Response(JSON.stringify({ ok: false, message: `Invalid evidence state: ${s.evidence_state}` }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
          }
        }
      }

      // Optimistic concurrency: check revision token (created_at of draft when editor opened)
      if (revisionToken) {
        const { data: currentDraft } = await supabase
          .from('drm_page_versions')
          .select('created_at')
          .eq('id', draftId)
          .maybeSingle();

        if (currentDraft && currentDraft.created_at !== revisionToken) {
          return new Response(JSON.stringify({ ok: false, code: 'CONTENT_VERSION_CONFLICT', message: 'This draft has changed since you opened it. Reload the latest version before saving.' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }

      const { error: saveError } = await supabase
        .from('drm_page_versions')
        .update({
          content_json: contentJson,
          change_note: changeNote,
        })
        .eq('id', draftId)
        .is('published_at', null);

      if (saveError) {
        return new Response(JSON.stringify({ ok: false, message: 'Unable to save draft.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_DRAFT_SAVED', admin_id: adminId,
        event_metadata: { draft_id: draftId },
      });

      return new Response(JSON.stringify({ ok: true, message: 'Draft saved.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // PUBLISH
    // ============================================================
    if (action === 'publish') {
      const permDenied = requirePermission('content.publish');
      if (permDenied) return permDenied;

      const draftId = String(body.draftId ?? '').trim();
      const changeNote = String(body.changeNote ?? '').trim() || null;
      const updateType = String(body.updateType ?? 'minor').trim();
      const notifyInvestors = Boolean(body.notifyInvestors);

      if (!draftId) {
        return new Response(JSON.stringify({ ok: false, message: 'Draft ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Get draft
      const { data: draft } = await supabase
        .from('drm_page_versions')
        .select('id, page_id, version_number, content_json, is_published, published_at')
        .eq('id', draftId)
        .maybeSingle();

      if (!draft || draft.published_at !== null) {
        return new Response(JSON.stringify({ ok: false, message: 'Draft not found or already published.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Validate content
      const content = draft.content_json as Record<string, unknown>;
      const sections = content?.sections;
      if (!sections || !Array.isArray(sections) || (sections as unknown[]).length === 0) {
        return new Response(JSON.stringify({ ok: false, message: 'Cannot publish: at least one content section is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Check page title/question exist
      const { data: page } = await supabase
        .from('drm_pages')
        .select('id, title, question, status')
        .eq('id', draft.page_id)
        .maybeSingle();

      if (!page || !page.title || !page.question) {
        return new Response(JSON.stringify({ ok: false, message: 'Cannot publish: page title and question are required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Calculate content hash
      const canonicalContent = JSON.stringify(draft.content_json);
      const contentHash = await sha256(canonicalContent);

      // Publish the draft
      const nowIso = new Date().toISOString();
      const { error: pubError } = await supabase
        .from('drm_page_versions')
        .update({
          is_published: true,
          published_at: nowIso,
          published_by: adminId,
          change_note: changeNote,
          content_hash: contentHash,
        })
        .eq('id', draftId);

      if (pubError) {
        return new Response(JSON.stringify({ ok: false, message: 'Unable to publish.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Unpublish previous published version
      await supabase
        .from('drm_page_versions')
        .update({ is_published: false })
        .neq('id', draftId)
        .eq('page_id', draft.page_id)
        .eq('is_published', true);

      // Update page
      const wasFirstPublication = page.status === 'inactive' || page.status === 'draft';
      await supabase
        .from('drm_pages')
        .update({
          status: 'published',
          current_published_version_id: draftId,
          updated_at: nowIso,
        })
        .eq('id', draft.page_id);

      // Notification intent
      if (notifyInvestors && updateType === 'material') {
        await supabase.from('drm_content_notifications').insert({
          page_id: draft.page_id,
          version_id: draftId,
          update_type: 'material',
          status: 'pending_email_configuration',
          selected_by: adminId,
        });

        await supabase.from('drm_audit_events').insert({
          event_type: 'CONTENT_NOTIFICATION_REQUESTED', admin_id: adminId,
          event_metadata: { page_id: draft.page_id, version_id: draftId },
        });
      }

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_VERSION_PUBLISHED', admin_id: adminId,
        event_metadata: { page_id: draft.page_id, version_number: draft.version_number, first_publication: wasFirstPublication },
      });

      return new Response(JSON.stringify({ ok: true, message: wasFirstPublication ? 'Published. This page is now visible to authorised investors.' : 'Published.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // ARCHIVE PAGE
    // ============================================================
    if (action === 'archive') {
      const permDenied = requirePermission('content.archive');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      if (!pageId) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('drm_pages').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('id', pageId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_PAGE_ARCHIVED', admin_id: adminId,
        event_metadata: { page_id: pageId },
      });

      return new Response(JSON.stringify({ ok: true, message: 'Page archived.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // RESTORE (as draft)
    // ============================================================
    if (action === 'restore') {
      const permDenied = requirePermission('content.archive');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      if (!pageId) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Set page to draft status (not published)
      await supabase.from('drm_pages').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('id', pageId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_PAGE_RESTORED', admin_id: adminId,
        event_metadata: { page_id: pageId },
      });

      return new Response(JSON.stringify({ ok: true, message: 'Page restored as draft. Review and publish when ready.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // CREATE DRAFT FROM VERSION (rollback)
    // ============================================================
    if (action === 'create-from-version') {
      const permDenied = requirePermission('content.edit');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      const sourceVersionId = String(body.sourceVersionId ?? '').trim();

      if (!pageId || !sourceVersionId) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID and source version ID are required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Check if draft already exists
      const { data: existingDraft } = await supabase
        .from('drm_page_versions')
        .select('id')
        .eq('page_id', pageId)
        .is('published_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingDraft) {
        return new Response(JSON.stringify({ ok: false, code: 'DRAFT_EXISTS', message: 'A draft already exists. Edit or delete it before creating another.' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Get source version content
      const { data: sourceVersion } = await supabase
        .from('drm_page_versions')
        .select('content_json, version_number')
        .eq('id', sourceVersionId)
        .maybeSingle();

      if (!sourceVersion) {
        return new Response(JSON.stringify({ ok: false, message: 'Source version not found.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Get max version number
      const { data: maxVersion } = await supabase
        .from('drm_page_versions')
        .select('version_number')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersionNumber = (maxVersion?.version_number || 0) + 1;

      const { data: newDraft } = await supabase
        .from('drm_page_versions')
        .insert({
          page_id: pageId,
          version_number: nextVersionNumber,
          content_json: sourceVersion.content_json,
          is_published: false,
          created_by: adminId,
          change_note: `Draft created from version ${sourceVersion.version_number}`,
        })
        .select('id, version_number')
        .single();

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_DRAFT_CREATED_FROM_VERSION', admin_id: adminId,
        event_metadata: { page_id: pageId, new_version_number: nextVersionNumber, source_version_id: sourceVersionId, source_version_number: sourceVersion.version_number },
      });

      return new Response(JSON.stringify({ ok: true, draftId: newDraft.id, versionNumber: nextVersionNumber, message: `Draft v${nextVersionNumber} created from v${sourceVersion.version_number}.` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // GET DRAFT — preview current draft through investor template
    // ============================================================
    if (action === 'get-draft') {
      const permDenied = requirePermission('content.view');
      if (permDenied) return permDenied;

      const slug = String(url.searchParams.get('slug') ?? body.slug ?? '').trim();
      if (!slug) {
        return new Response(JSON.stringify({ ok: false, message: 'Slug is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { data: page } = await supabase
        .from('drm_pages')
        .select('id, slug, title, question')
        .eq('slug', slug)
        .maybeSingle();

      if (!page) {
        return new Response(JSON.stringify({ ok: false, message: 'Page not found.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Find the current draft (published_at IS NULL)
      const { data: draft } = await supabase
        .from('drm_page_versions')
        .select('id, version_number, content_json, change_note, created_at')
        .eq('page_id', page.id)
        .is('published_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!draft) {
        return new Response(JSON.stringify({ ok: false, message: 'No draft exists for this page.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const sections = (draft.content_json as Record<string, unknown>)?.sections as Array<Record<string, unknown>> | undefined;

      return new Response(JSON.stringify({
        ok: true,
        slug: page.slug,
        sections: sections || [],
        related_links: (draft.content_json as Record<string, unknown>)?.related_links || [],
        supporting_materials: [],
        last_updated: draft.created_at,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // MATERIAL ADD
    // ============================================================
    if (action === 'material-add') {
      const permDenied = requirePermission('content.material.manage');
      if (permDenied) return permDenied;

      const pageId = String(body.pageId ?? '').trim();
      const title = String(body.title ?? '').trim().slice(0, 200);
      const description = String(body.description ?? '').trim() || null;
      const materialType = String(body.materialType ?? 'file').trim();
      const printable = Boolean(body.printable);

      if (!pageId || !title) {
        return new Response(JSON.stringify({ ok: false, message: 'Page ID and title are required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { data: material } = await supabase
        .from('drm_supporting_materials')
        .insert({ page_id: pageId, title, description, material_type: materialType, printable, created_by: adminId })
        .select('id')
        .single();

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_SUPPORTING_MATERIAL_ADDED', admin_id: adminId,
        event_metadata: { page_id: pageId, material_id: material.id },
      });

      return new Response(JSON.stringify({ ok: true, materialId: material.id, message: 'Material added.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // ============================================================
    // MATERIAL ARCHIVE
    // ============================================================
    if (action === 'material-archive') {
      const permDenied = requirePermission('content.material.manage');
      if (permDenied) return permDenied;

      const materialId = String(body.materialId ?? '').trim();
      if (!materialId) {
        return new Response(JSON.stringify({ ok: false, message: 'Material ID is required.' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      await supabase.from('drm_supporting_materials').update({ status: 'archived', updated_at: new Date().toISOString() }).eq('id', materialId);

      await supabase.from('drm_audit_events').insert({
        event_type: 'CONTENT_SUPPORTING_MATERIAL_ARCHIVED', admin_id: adminId,
        event_metadata: { material_id: materialId },
      });

      return new Response(JSON.stringify({ ok: true, message: 'Material archived.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
