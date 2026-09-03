/*
# Pass 4: Data Room Content Administration + Versioning + Publishing

## Tables
1. drm_pages — logical pages with stable properties
2. drm_page_versions — immutable version history with structured content
3. drm_supporting_materials — controlled material metadata
4. drm_content_notifications — investor update notification intent

## Security
- All tables RLS enabled, no anon/authenticated policies
- Access only through authorised Edge Functions (service role)
*/

-- 1. drm_pages
CREATE TABLE IF NOT EXISTS drm_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  question text NOT NULL,
  status text NOT NULL DEFAULT 'inactive', -- inactive | draft | published | archived
  sort_order integer NOT NULL DEFAULT 100,
  security_level text NOT NULL DEFAULT 'nda_required',
  searchable boolean NOT NULL DEFAULT true,
  printable boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  current_published_version_id uuid
);
ALTER TABLE drm_pages ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_drm_pages_status ON drm_pages(status);
CREATE INDEX IF NOT EXISTS idx_drm_pages_sort ON drm_pages(sort_order);

-- 2. drm_page_versions
CREATE TABLE IF NOT EXISTS drm_page_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES drm_pages(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}',
  change_note text,
  content_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  published_at timestamptz,
  published_by uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT false,
  UNIQUE(page_id, version_number)
);
ALTER TABLE drm_page_versions ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_drm_page_versions_page ON drm_page_versions(page_id);
CREATE INDEX IF NOT EXISTS idx_drm_page_versions_published ON drm_page_versions(page_id, is_published);

-- 3. drm_supporting_materials
CREATE TABLE IF NOT EXISTS drm_supporting_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES drm_pages(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  material_type text NOT NULL DEFAULT 'file', -- file | link | document
  status text NOT NULL DEFAULT 'active', -- active | archived
  storage_ref text, -- future: storage path or ID
  printable boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_supporting_materials ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_drm_supporting_materials_page ON drm_supporting_materials(page_id);

-- 4. drm_content_notifications
CREATE TABLE IF NOT EXISTS drm_content_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES drm_pages(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES drm_page_versions(id) ON DELETE CASCADE,
  update_type text NOT NULL DEFAULT 'minor', -- minor | material
  status text NOT NULL DEFAULT 'pending_email_configuration',
  selected_by uuid REFERENCES drm_admins(id) ON DELETE SET NULL,
  selected_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE drm_content_notifications ENABLE ROW LEVEL SECURITY;

-- 5. Seed initial pages from existing registry
-- Only if no pages exist yet
INSERT INTO drm_pages (slug, title, question, status, sort_order, security_level, searchable, printable)
SELECT slug, title, question,
  CASE status
    WHEN 'published' THEN 'published'
    WHEN 'inactive' THEN 'inactive'
    WHEN 'archived' THEN 'archived'
    ELSE 'inactive'
  END,
  sort_order, 'nda_required', searchable, printable
FROM (VALUES
  ('investment-case', 'Investment Case', 'What is the full investment thesis behind NexFrontier?', 'published', 1, true, true),
  ('market-evidence', 'Market & Evidence', 'Is AI changing how markets change, and what evidence supports the thesis?', 'published', 2, true, true),
  ('economic-opportunity', 'Economic Opportunity', 'Where could economic value move, and how much might NexFrontier address?', 'published', 3, true, true),
  ('product', 'Product / ENI', 'What is NexFrontier building and what enterprise capability is it intended to create?', 'published', 4, true, true),
  ('proof', 'Proof & Foundation Customers', 'What has been evidenced, what remains hypothesis and what is being validated next?', 'published', 5, true, true),
  ('round', 'Round & Use of Funds', 'What capital is required, what proof should it buy and what changes if that proof is earned?', 'published', 6, true, true),
  ('commercial-model', 'Commercial Model', 'How does NexFrontier intend to generate revenue?', 'inactive', 7, false, false),
  ('financials', 'Financials', 'What are the current financial projections?', 'inactive', 8, false, false),
  ('defensibility-ip', 'Defensibility & IP', 'What makes NexFrontier defensible?', 'inactive', 9, false, false),
  ('team-governance', 'Team & Governance', 'Who is building NexFrontier and how is it governed?', 'inactive', 10, false, false),
  ('risks-open-questions', 'Risks & Open Questions', 'What are the key risks and unresolved questions?', 'inactive', 11, false, false),
  ('legal-corporate', 'Legal & Corporate', 'What is the corporate structure and legal status?', 'inactive', 12, false, false),
  ('supporting-evidence', 'Supporting Evidence', 'What supporting evidence is available?', 'inactive', 13, false, false)
) AS v(slug, title, question, status, sort_order, searchable, printable)
WHERE NOT EXISTS (SELECT 1 FROM drm_pages LIMIT 1);

-- 6. Seed initial published versions for the 6 active topics
-- Content matches the placeholder content from drm-content edge function
INSERT INTO drm_page_versions (page_id, version_number, content_json, is_published, published_at, content_hash)
SELECT p.id, 1,
  jsonb_build_object(
    'sections', jsonb_build_array(
      jsonb_build_object('label', 'CURRENT POSITION', 'body', 'Content for this diligence area is being prepared. This page will be authored with NexFrontier''s current evidence, assumptions and proof pathway material.', 'evidence_state', 'THESIS'),
      jsonb_build_object('label', 'WHAT REMAINS TO BE PROVED', 'body', 'Content for this diligence area is being prepared.'),
      jsonb_build_object('label', 'NEXT PROOF THRESHOLD', 'body', 'Content for this diligence area is being prepared.')
    )
  ),
  true, now(),
  encode(digest(
    p.slug || ':1:Content for this diligence area is being prepared.',
    'sha256'
  ), 'hex')
FROM drm_pages p
WHERE p.status = 'published'
  AND NOT EXISTS (
    SELECT 1 FROM drm_page_versions v WHERE v.page_id = p.id AND v.is_published = true
  );

-- Link current_published_version_id
UPDATE drm_pages p
SET current_published_version_id = (
  SELECT id FROM drm_page_versions v
  WHERE v.page_id = p.id AND v.is_published = true
  ORDER BY v.published_at DESC LIMIT 1
),
  updated_at = now()
WHERE p.status = 'published';
