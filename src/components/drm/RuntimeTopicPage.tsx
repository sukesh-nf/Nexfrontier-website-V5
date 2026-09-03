'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, AlertCircle, Loader2, ArrowRight, Home, LogOut } from 'lucide-react';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import { SupportingMaterial, type SupportingMaterialItem } from './SupportingMaterial';
import type { EvidenceState } from '@/data/data-room-registry';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface ChildItem {
  heading?: string;
  body?: string;
  evidence_state?: string;
}

interface ContentSection {
  label?: string;
  heading?: string;
  body?: string;
  evidence_state?: string;
  display_treatment?: string;
  order?: number;
  children?: ChildItem[];
}

interface RelatedLink {
  label: string;
  href: string;
  primary?: boolean;
}

interface RuntimeContent {
  ok: boolean;
  slug: string;
  sections: ContentSection[];
  related_links?: RelatedLink[];
  supporting_materials?: SupportingMaterialItem[];
  last_updated: string;
  code?: string;
  message?: string;
  nda_required?: boolean;
}

type LoadState = 'loading' | 'auth-required' | 'nda-required' | 'access-revoked' | 'page-unavailable' | 'error' | 'ready';

const READING_MEASURE = '720px';
const WIDE_MEASURE = '1080px';
const SHELL_MAX = '1220px';

// Exact multi-line page titles per spec
const PAGE_TITLES: Record<string, string[]> = {
  'investment-case': ['An emerging enterprise problem.', 'A potential new category.', 'A proof-stage investment opportunity.'],
  'market-evidence': ['The market is not just changing.', 'AI may be changing the conditions of change itself.'],
  'economic-opportunity': ['The bigger prize may not be the software market.', 'It may be the economic value moving underneath it.'],
  'product': ['See what is changing.', 'Understand what it means.', 'Navigate where to act.'],
  'proof': ['The thesis matters only if the evidence progresses.'],
  'round': ['Fund the proof.', 'Earn the right to scale.'],
};

export function RuntimeTopicPage({
  slug,
  title,
  question,
  investorName,
  onLogout,
}: {
  slug: string;
  title: string;
  question: string;
  adminPreview?: boolean;
  investorName?: string;
  onLogout?: () => void;
}) {
  const [state, setState] = useState<LoadState>('loading');
  const [content, setContent] = useState<RuntimeContent | null>(null);
  const [adminPreview, setAdminPreview] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setAdminPreview(params.get('preview') === '1');
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!adminPreview) {
          const sessionToken = sessionStorage.getItem('drm_session_token');
          if (!sessionToken) {
            if (!cancelled) setState('auth-required');
            return;
          }
          const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-content?slug=${slug}`, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'apikey': ANON_KEY || '',
            },
          });
          const data: RuntimeContent = await res.json();
          if (cancelled) return;
          if (!data.ok) {
            if (data.code === 'AUTH_REQUIRED' || data.code === 'AUTH_EXPIRED') setState('auth-required');
            else if (data.code === 'NDA_REQUIRED' || data.nda_required) setState('nda-required');
            else if (data.code === 'ACCESS_REVOKED') setState('access-revoked');
            else if (data.code === 'PAGE_UNAVAILABLE') setState('page-unavailable');
            else setState('error');
            return;
          }
          setContent(data);
          setState('ready');
        } else {
          const adminToken = sessionStorage.getItem('drm_admin_token');
          const res = await fetch(`${SUPABASE_URL}/functions/v1/drm-content-admin?action=get-draft&slug=${slug}`, {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'apikey': ANON_KEY || '',
            },
          });
          const data: RuntimeContent = await res.json();
          if (cancelled) return;
          if (!data.ok) { setState('error'); return; }
          setContent(data);
          setState('ready');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => { cancelled = true; };
  }, [slug, adminPreview]);

  const sortedSections = content?.sections
    ? [...content.sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const heroLines = PAGE_TITLES[slug] || [title];

  return (
    <div className="nf-drm-page" style={{ minHeight: '100vh', background: 'var(--nf-bg-primary)' }}>
      <header className="nf-drm-header">
        <div className="nf-drm-header-inner">
          <div className="nf-drm-header-left">
            <Lock size={16} color="var(--nf-cyan)" />
            <span className="nf-drm-header-brand">NexFrontier</span>
            <span className="nf-drm-header-tag">Investor Data Room</span>
          </div>
          <div className="nf-drm-header-right">
            <a href="/investor-data-room" className="nf-drm-header-link">
              <Home size={14} /> <span className="nf-drm-home-label">Data Room Home</span>
            </a>
            {investorName && <span className="nf-drm-investor-name">{investorName}</span>}
            {onLogout && (
              <button onClick={onLogout} className="nf-drm-header-link nf-drm-logout-btn">
                <LogOut size={14} /> <span className="nf-drm-signout-label">Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {adminPreview && state === 'ready' && (
        <div className="nf-drm-draft-indicator">
          <span className="nf-drm-draft-dot" />
          DRAFT PREVIEW · NOT INVESTOR VISIBLE
        </div>
      )}

      <main className="nf-drm-main" style={{ maxWidth: SHELL_MAX }}>
        <a href="/investor-data-room" className="nf-drm-back-link">
          <ArrowLeft size={14} /> Data Room Home
        </a>

        {/* Hero: H1 = page title (multi-line), question = subordinate */}
        <div className="nf-drm-hero">
          <span className="nf-drm-hero-eyebrow">{title}</span>
          <h1 className="nf-drm-hero-title">
            {heroLines.map((line, i) => (
              <span key={i} className="nf-drm-hero-line">{line}</span>
            ))}
          </h1>
          <p className="nf-drm-hero-question">{question}</p>
          <div className="nf-drm-hero-divider" />
        </div>

        {state === 'loading' && (
          <div className="nf-drm-loading">
            <Loader2 size={18} className="nf-drm-spin" /> Loading...
          </div>
        )}

        {state === 'auth-required' && (
          <AccessDenied icon={<Lock size={28} />} title="Authentication required" message="Please sign in to access this page." actionHref="/investor-data-room" actionLabel="Go to Data Room" />
        )}
        {state === 'nda-required' && (
          <AccessDenied icon={<Lock size={28} />} title="NDA acceptance required" message="You must accept the current NDA before accessing Data Room content." actionHref="/investor-data-room/nda" actionLabel="Accept NDA" />
        )}
        {state === 'access-revoked' && (
          <AccessDenied icon={<AlertCircle size={28} />} title="Access revoked" message="Your Data Room access is no longer active." actionHref="/investor-data-room" actionLabel="Return to Data Room" />
        )}
        {state === 'page-unavailable' && (
          <AccessDenied icon={<AlertCircle size={28} />} title="Page unavailable" message="This page is not currently available." actionHref="/investor-data-room" actionLabel="Back to Data Room" />
        )}
        {state === 'error' && (
          <AccessDenied icon={<AlertCircle size={28} />} title="Unable to load" message="An error occurred while loading this page. Please try again." actionHref="/investor-data-room" actionLabel="Back to Data Room" />
        )}

        {state === 'ready' && content && (
          <>
            {sortedSections.map((section, i) => (
              <SectionRenderer key={i} section={section} slug={slug} isLast={i === sortedSections.length - 1} />
            ))}

            {content.supporting_materials && content.supporting_materials.length > 0 && (
              <SupportingMaterial items={content.supporting_materials} />
            )}

            {content.related_links && content.related_links.length > 0 && (
              <div className="nf-drm-cta-area">
                {content.related_links.map((link, j) => (
                  <a key={j} href={link.href} className={link.primary ? 'nf-drm-cta nf-drm-cta-primary' : 'nf-drm-cta-continuation'}>
                    {link.label} {!link.label.includes('→') && <ArrowRight size={16} />}
                  </a>
                ))}
              </div>
            )}

            <div className="nf-drm-footer-row">
              <span className="nf-drm-last-updated">Last updated: {content.last_updated}</span>
              <a href="/investor-data-room" className="nf-drm-back-link">
                <ArrowLeft size={14} /> Back to Data Room
              </a>
            </div>
          </>
        )}
      </main>

      <style>{drmStyles}</style>
    </div>
  );
}

// ============================================================
// Section Renderer
// ============================================================
function SectionRenderer({ section, slug, isLast }: { section: ContentSection; slug: string; isLast: boolean }) {
  const treatment = section.display_treatment || 'default';

  if (treatment === 'columns' && section.children) return <ColumnsSection section={section} isLast={isLast} />;
  if (treatment === 'grid-2x2' && section.children) return <Grid2x2Section section={section} isLast={isLast} />;
  if (treatment === 'capital-grid' && section.children) return <CapitalGridSection section={section} isLast={isLast} />;
  if (treatment === 'hypothesis-block') return <HypothesisBlockSection section={section} isLast={isLast} />;
  if (treatment === 'progression' && section.children) return <ProgressionSection section={section} isLast={isLast} />;
  if (treatment === 'two-side' && section.children) return <TwoSideSection section={section} isLast={isLast} />;
  if (treatment === 'concept-row' && section.body) return <ConceptRowSection section={section} isLast={isLast} />;
  if (treatment === 'callout') return <CalloutSection section={section} isLast={isLast} />;
  if (treatment === 'value-gap') return <ValueGapSection section={section} isLast={isLast} />;
  if (treatment === 'lens-grid' && section.children) return <LensGridSection section={section} isLast={isLast} />;
  if (treatment === 'triad' && section.body) return <TriadSection section={section} isLast={isLast} />;
  if (treatment === 'numbered-list' && section.children) return <NumberedListSection section={section} isLast={isLast} />;
  if (treatment === 'peer-pair' && section.children) return <PeerPairSection section={section} isLast={isLast} />;
  if (treatment === 'evidence-progression' && section.children) return <EvidenceProgressionSection section={section} isLast={isLast} />;

  return <DefaultSection section={section} isLast={isLast} />;
}

// ============================================================
// Default — narrative
// ============================================================
function DefaultSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && (
        <div className="nf-drm-section-label-row">
          <span className="nf-drm-section-label">{section.label}</span>
          {section.evidence_state && <EvidenceStateBadge state={section.evidence_state as EvidenceState} />}
        </div>
      )}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} />}
      {section.children && section.children.map((child, j) => (
        <div key={j} className="nf-drm-child-block">
          {child.heading && <h3 className="nf-drm-child-heading">{child.heading}</h3>}
          {child.body && <BodyText text={child.body} maxWidth={READING_MEASURE} />}
          {child.evidence_state && <div className="nf-drm-child-badge"><EvidenceStateBadge state={child.evidence_state as EvidenceState} /></div>}
        </div>
      ))}
    </section>
  );
}

// ============================================================
// Columns — equal proposition columns
// ============================================================
function ColumnsSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  const childCount = section.children?.length ?? 1;
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-prop-columns" data-count={Math.min(childCount, 3)}>
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-prop-col">
            {child.heading && <span className="nf-drm-prop-num">{String(j + 1).padStart(2, '0')}</span>}
            {child.heading && <h3 className="nf-drm-prop-heading">{child.heading}</h3>}
            {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
            {child.evidence_state && <div className="nf-drm-prop-badge"><EvidenceStateBadge state={child.evidence_state as EvidenceState} /></div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Grid 2x2
// ============================================================
function Grid2x2Section({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-grid-2x2">
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-grid-cell">
            {child.heading && <span className="nf-drm-grid-cell-label">{child.heading}</span>}
            {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Capital Grid — 7-item responsive grid (3+2+2)
// ============================================================
function CapitalGridSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  const items: { heading?: string; body?: string }[] = [];
  if (section.heading) items.push({ heading: section.heading, body: section.body });
  if (section.children) items.push(...section.children);

  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      <div className="nf-drm-capital-grid">
        {items.map((item, j) => (
          <div key={j} className="nf-drm-capital-cell">
            {item.heading && <span className="nf-drm-capital-cell-label">{item.heading}</span>}
            {item.body && <p className="nf-drm-body-sm">{item.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Hypothesis Block
// ============================================================
function HypothesisBlockSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      <div className="nf-drm-hypothesis-block">
        {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} className="nf-drm-hypothesis-body" />}
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-hypothesis-child">
            {child.heading && <span className="nf-drm-hypothesis-child-label">{child.heading}</span>}
            {child.body && <p className="nf-drm-body-sm" style={{ maxWidth: READING_MEASURE }}>{child.body}</p>}
          </div>
        ))}
        {section.evidence_state && <div className="nf-drm-hypothesis-badge"><EvidenceStateBadge state={section.evidence_state as EvidenceState} /></div>}
      </div>
    </section>
  );
}

// ============================================================
// Progression — vertical sequence with arrows
// ============================================================
function ProgressionSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-5)" />}
      <div className="nf-drm-progression">
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-progression-step">
            <div className="nf-drm-progression-step-inner">
              {child.heading && <span className="nf-drm-progression-heading">{child.heading}</span>}
              {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
            </div>
            {j < (section.children?.length ?? 0) - 1 && <div className="nf-drm-progression-arrow" aria-hidden="true">↓</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Two-Side — contrasting comparison
// ============================================================
function TwoSideSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-two-side">
        {section.children?.map((child, j) => (
          <div key={j} className={j === 0 ? 'nf-drm-two-side-col nf-drm-two-side-today' : 'nf-drm-two-side-col nf-drm-two-side-proved'}>
            {child.heading && <span className="nf-drm-two-side-label">{child.heading}</span>}
            {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Concept Row — restrained inline wrap (market characteristics)
// ============================================================
function ConceptRowSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-5)" />}
      <div className="nf-drm-concept-row">
        {extractConcepts(section.body).map((concept, j) => (
          <span key={j} className="nf-drm-concept-chip">{concept}</span>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Callout — conspicuous editorial callout
// ============================================================
function CalloutSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      <div className="nf-drm-callout">
        {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} className="nf-drm-callout-body" />}
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-callout-child">
            {child.heading && <span className="nf-drm-callout-child-label">{child.heading}</span>}
            {child.body && <p className="nf-drm-body-sm" style={{ maxWidth: READING_MEASURE }}>{child.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Value Gap — conceptual non-quantitative relationship
// ============================================================
function ValueGapSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-value-gap">
        <div className="nf-drm-value-gap-bar">
          <div className="nf-drm-value-gap-segment nf-drm-value-gap-captured">
            <span className="nf-drm-value-gap-label">ENTERPRISE VALUE CURRENTLY CAPTURED</span>
          </div>
          <div className="nf-drm-value-gap-segment nf-drm-value-gap-gap">
            <span className="nf-drm-value-gap-label">VALUE GAP</span>
          </div>
          <div className="nf-drm-value-gap-segment nf-drm-value-gap-available">
            <span className="nf-drm-value-gap-label">MARKET OPPORTUNITY AVAILABLE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Lens Grid — five value lenses
// ============================================================
function LensGridSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-lens-grid">
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-lens">
            <span className="nf-drm-lens-num">{String(j + 1).padStart(2, '0')}</span>
            {child.heading && <h3 className="nf-drm-lens-name">{child.heading}</h3>}
            {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Triad — three large peer concepts (SEE/UNDERSTAND/NAVIGATE)
// ============================================================
function TriadSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-triad">
        {extractTriad(section.body).map((item, j) => (
          <div key={j} className="nf-drm-triad-item">
            <span className="nf-drm-triad-verb">{item.verb}</span>
            <span className="nf-drm-triad-desc">{item.description}</span>
            {j < 2 && <span className="nf-drm-triad-link" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Numbered List — six questions capital must answer
// ============================================================
function NumberedListSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-5)" />}
      <div className="nf-drm-numbered-list">
        {section.children?.map((child, j) => (
          <div key={j} className="nf-drm-numbered-item">
            <span className="nf-drm-numbered-num">{child.heading || String(j + 1).padStart(2, '0')}</span>
            <span className="nf-drm-numbered-text">{child.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Peer Pair — two equal peer concepts (Adaptive Value / Quiet Loss)
// ============================================================
function PeerPairSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-peer-pair">
        {section.children?.length === 1 && section.heading && (
          <div className="nf-drm-peer-card nf-drm-peer-upside">
            <h3 className="nf-drm-peer-heading">{section.heading}</h3>
            {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} />}
          </div>
        )}
        {section.children?.map((child, j) => (
          <div key={j} className={(section.children?.length === 1 || j === 0) ? 'nf-drm-peer-card nf-drm-peer-loss' : 'nf-drm-peer-card nf-drm-peer-loss'}>
            {child.heading && <h3 className="nf-drm-peer-heading">{child.heading}</h3>}
            {child.body && <p className="nf-drm-body-sm">{child.body}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Evidence Progression — six stages with current/next markers
// ============================================================
function EvidenceProgressionSection({ section, isLast }: { section: ContentSection; isLast: boolean }) {
  const stages = [
    'ASSUMPTION',
    'HYPOTHESIS',
    'EVIDENCE',
    'CUSTOMER VALIDATION',
    'PAID VALIDATION',
    'REPEATABLE PROOF',
  ];
  const currentIndex = 2; // EVIDENCE is current, CUSTOMER VALIDATION is next
  return (
    <section className="nf-drm-section nf-drm-section-wide" style={{ borderBottom: isLast ? 'none' : undefined }}>
      {section.label && <span className="nf-drm-section-label">{section.label}</span>}
      {section.heading && <h2 className="nf-drm-section-heading">{section.heading}</h2>}
      {section.body && <BodyText text={section.body} maxWidth={READING_MEASURE} marginBottom="var(--nf-space-6)" />}
      <div className="nf-drm-evidence-progression">
        {stages.map((stageName, j) => {
          const isCurrent = j === currentIndex;
          const isNext = j === currentIndex + 1;
          const isPast = j < currentIndex;
          const isFuture = j > currentIndex + 1;
          return (
            <div key={j} className={[
              'nf-drm-evidence-stage',
              isCurrent ? 'nf-drm-evidence-current' : '',
              isNext ? 'nf-drm-evidence-next' : '',
              isPast ? 'nf-drm-evidence-past' : '',
              isFuture ? 'nf-drm-evidence-future' : '',
            ].filter(Boolean).join(' ')}>
              {isCurrent && <span className="nf-drm-evidence-marker">CURRENT</span>}
              {isNext && <span className="nf-drm-evidence-marker nf-drm-evidence-marker-next">NEXT</span>}
              <span className="nf-drm-evidence-name">{stageName}</span>
              {j < stages.length - 1 && <span className="nf-drm-evidence-arrow" aria-hidden="true">→</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================
// Body Text — renders \n\n as paragraphs
// ============================================================
function extractConcepts(body?: string): string[] {
  if (!body) return [];
  const concepts = ['interactive', 'nonlinear', 'path-dependent', 'responsive', 'difficult to interpret through historical assumptions alone'];
  return concepts.filter(concept => body.toLowerCase().includes(concept));
}

function extractTriad(body?: string): { verb: string; description: string }[] {
  if (!body) return [];
  return body
    .split('\n')
    .map(line => line.trim())
    .map(line => line.match(/^(SEE|UNDERSTAND|NAVIGATE)\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .slice(0, 3)
    .map(match => ({ verb: match[1], description: match[2].trim() }));
}

function BodyText({ text, maxWidth, marginBottom, className }: { text: string; maxWidth?: string; marginBottom?: string; className?: string }) {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  return (
    <>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`nf-drm-body${className ? ' ' + className : ''}`}
          style={{ maxWidth: maxWidth || READING_MEASURE, marginBottom: marginBottom || (i < paragraphs.length - 1 ? 'var(--nf-space-4)' : undefined) }}
        >
          {para}
        </p>
      ))}
    </>
  );
}

// ============================================================
// Access Denied
// ============================================================
function AccessDenied({ icon, title, message, actionHref, actionLabel }: { icon: React.ReactNode; title: string; message: string; actionHref: string; actionLabel: string }) {
  return (
    <div className="nf-drm-access-denied">
      <div className="nf-drm-access-icon">{icon}</div>
      <h2 className="nf-drm-access-title">{title}</h2>
      <p className="nf-drm-access-message">{message}</p>
      <a href={actionHref} className="nf-drm-cta nf-drm-cta-primary">{actionLabel}</a>
    </div>
  );
}

// ============================================================
// Styles
// ============================================================
const drmStyles = `
.nf-drm-page { display: flex; flex-direction: column; min-height: 100vh; }

/* Header */
.nf-drm-header { position: sticky; top: 0; z-index: 50; background: var(--nf-bg-secondary); border-bottom: 1px solid var(--nf-border); padding: 0 var(--nf-space-5); }
.nf-drm-header-inner { max-width: var(--nf-container-wide); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 56px; }
.nf-drm-header-left { display: flex; align-items: center; gap: var(--nf-space-3); }
.nf-drm-header-brand { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); letter-spacing: -0.02em; }
.nf-drm-header-tag { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: var(--nf-cyan-dim); color: var(--nf-cyan); border: 1px solid var(--nf-cyan-border); }
.nf-drm-header-right { display: flex; align-items: center; gap: var(--nf-space-4); }
.nf-drm-header-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--nf-text-tertiary); text-decoration: none; background: none; border: none; cursor: pointer; transition: color var(--nf-transition-fast); }
.nf-drm-header-link:hover { color: var(--nf-cyan); }
.nf-drm-logout-btn:hover { color: var(--nf-negative) !important; }
.nf-drm-investor-name { font-size: 0.75rem; color: var(--nf-text-tertiary); }

/* Draft indicator */
.nf-drm-draft-indicator { position: sticky; top: 56px; z-index: 49; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px var(--nf-space-5); background: rgba(245, 166, 35, 0.06); border-bottom: 1px solid rgba(245, 166, 35, 0.15); font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-warning); }
.nf-drm-draft-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--nf-warning); flex-shrink: 0; }

/* Main shell */
.nf-drm-main { margin: 0 auto; width: 100%; padding: var(--nf-space-9) var(--nf-space-5) var(--nf-space-10); }

/* Back link */
.nf-drm-back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--nf-text-tertiary); text-decoration: none; margin-bottom: var(--nf-space-7); transition: color var(--nf-transition-fast); }
.nf-drm-back-link:hover { color: var(--nf-cyan); }

/* Hero */
.nf-drm-hero { margin-bottom: var(--nf-space-8); }
.nf-drm-hero-eyebrow { display: block; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-cyan); margin-bottom: var(--nf-space-4); }
.nf-drm-hero-title { font-size: clamp(1.9375rem, 3.5vw, 3rem); font-weight: 500; color: var(--nf-text-primary); letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 var(--nf-space-5); max-width: 900px; }
.nf-drm-hero-line { display: block; }
.nf-drm-hero-question { font-size: clamp(1.0625rem, 1.2vw, 1.25rem); line-height: 1.5; color: var(--nf-text-secondary); max-width: 680px; margin: 0 0 var(--nf-space-5); padding-left: var(--nf-space-4); border-left: 2px solid var(--nf-cyan-border); }
.nf-drm-hero-divider { width: 48px; height: 1px; background: var(--nf-cyan); margin-top: var(--nf-space-6); opacity: 0.5; }

/* Section base */
.nf-drm-section { padding-top: var(--nf-space-7); padding-bottom: var(--nf-space-7); border-bottom: 1px solid var(--nf-border-soft); max-width: ${READING_MEASURE}; }
.nf-drm-section-wide { max-width: ${WIDE_MEASURE}; }

/* Section labels & headings */
.nf-drm-section-label-row { display: flex; align-items: center; gap: var(--nf-space-3); margin-bottom: var(--nf-space-3); }
.nf-drm-section-label { display: inline-block; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-cyan); margin-bottom: var(--nf-space-3); }
.nf-drm-section-heading { font-size: clamp(1.5rem, 2.2vw, 2rem); font-weight: 500; color: var(--nf-text-primary); letter-spacing: -0.025em; line-height: 1.2; margin: 0 0 var(--nf-space-5); max-width: 900px; }

/* Body */
.nf-drm-body { font-size: 1.0625rem; line-height: 1.65; color: var(--nf-text-secondary); margin: 0; }
.nf-drm-body-sm { font-size: 0.9375rem; line-height: 1.6; color: var(--nf-text-secondary); margin: 0; }

/* Child blocks */
.nf-drm-child-block { margin-top: var(--nf-space-5); }
.nf-drm-child-heading { font-size: 1.0625rem; font-weight: 600; color: var(--nf-text-primary); margin: 0 0 var(--nf-space-2); }
.nf-drm-child-badge { margin-top: var(--nf-space-2); }

/* Proposition columns */
.nf-drm-prop-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--nf-space-5); }
.nf-drm-prop-columns[data-count="2"] { grid-template-columns: repeat(2, 1fr); }
.nf-drm-prop-columns[data-count="1"] { grid-template-columns: 1fr; }
.nf-drm-prop-col { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-prop-num { font-size: 0.75rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.1em; }
.nf-drm-prop-heading { font-size: 1.0625rem; font-weight: 600; color: var(--nf-text-primary); line-height: 1.3; margin: 0; }
.nf-drm-prop-badge { margin-top: auto; padding-top: var(--nf-space-3); }

/* Grid 2x2 */
.nf-drm-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-4); }
.nf-drm-grid-cell { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-grid-cell-label { font-size: 0.75rem; font-weight: 700; color: var(--nf-text-secondary); letter-spacing: 0.08em; text-transform: uppercase; }

/* Capital grid */
.nf-drm-capital-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--nf-space-4); }
.nf-drm-capital-cell { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-capital-cell-label { font-size: 0.75rem; font-weight: 700; color: var(--nf-text-secondary); letter-spacing: 0.08em; text-transform: uppercase; }
@media (max-width: 1024px) { .nf-drm-capital-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .nf-drm-capital-grid { grid-template-columns: 1fr; } }

/* Hypothesis block */
.nf-drm-hypothesis-block { padding: var(--nf-space-7) var(--nf-space-6); background: rgba(12, 192, 223, 0.025); border: 1px solid rgba(12, 192, 223, 0.12); border-radius: var(--nf-radius-panel); }
.nf-drm-hypothesis-body { font-size: 1.125rem !important; font-weight: 500; color: var(--nf-text-primary) !important; line-height: 1.5; }
.nf-drm-hypothesis-child { margin-top: var(--nf-space-4); }
.nf-drm-hypothesis-child-label { display: block; font-size: 0.6875rem; font-weight: 700; color: var(--nf-text-tertiary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
.nf-drm-hypothesis-badge { margin-top: var(--nf-space-5); }

/* Progression */
.nf-drm-progression { display: flex; flex-direction: column; gap: 0; }
.nf-drm-progression-step { display: flex; flex-direction: column; }
.nf-drm-progression-step-inner { padding: var(--nf-space-5) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-left: 2px solid var(--nf-cyan-border); }
.nf-drm-progression-heading { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); display: block; margin: 0; }
.nf-drm-progression-arrow { display: flex; justify-content: center; padding: var(--nf-space-2) 0; color: var(--nf-text-tertiary); font-size: 1.125rem; opacity: 0.5; }

/* Two-side */
.nf-drm-two-side { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-5); }
.nf-drm-two-side-col { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-6); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-two-side-today { background: var(--nf-bg-surface-1); }
.nf-drm-two-side-proved { background: rgba(12, 192, 223, 0.025); border-color: rgba(12, 192, 223, 0.15); }
.nf-drm-two-side-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.nf-drm-two-side-today .nf-drm-two-side-label { color: var(--nf-text-secondary); }
.nf-drm-two-side-proved .nf-drm-two-side-label { color: var(--nf-cyan); }

/* Concept row */
.nf-drm-concept-row { display: flex; flex-wrap: wrap; gap: var(--nf-space-2); }
.nf-drm-concept-chip { display: inline-flex; align-items: center; padding: 8px 16px; background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: 999px; font-size: 0.875rem; font-weight: 500; color: var(--nf-text-secondary); }

/* Callout */
.nf-drm-callout { padding: var(--nf-space-7) var(--nf-space-6); max-width: ${WIDE_MEASURE}; background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-strong); border-left: 3px solid var(--nf-cyan); border-radius: var(--nf-radius-panel); }
.nf-drm-callout-body { font-size: 1.0625rem !important; color: var(--nf-text-primary) !important; line-height: 1.55; }
.nf-drm-callout-child { margin-top: var(--nf-space-4); }
.nf-drm-callout-child-label { display: block; font-size: 0.6875rem; font-weight: 700; color: var(--nf-text-tertiary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }

/* Value gap */
.nf-drm-value-gap { max-width: ${WIDE_MEASURE}; }
.nf-drm-value-gap-bar { display: flex; height: 64px; border-radius: var(--nf-radius-panel); overflow: hidden; border: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-segment { display: flex; align-items: center; justify-content: center; padding: 0 var(--nf-space-4); }
.nf-drm-value-gap-captured { flex: 0 0 35%; background: var(--nf-bg-surface-1); border-right: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-gap { flex: 1; background: rgba(12, 192, 223, 0.06); border-right: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-available { flex: 0 0 30%; background: var(--nf-bg-surface-2); }
.nf-drm-value-gap-label { font-size: 0.625rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--nf-text-tertiary); text-align: center; line-height: 1.3; }

/* Lens grid */
.nf-drm-lens-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--nf-space-3); }
.nf-drm-lens { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-5) var(--nf-space-4); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-lens-num { font-size: 0.6875rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.14em; }
.nf-drm-lens-name { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); line-height: 1.3; margin: 0; }
@media (max-width: 1100px) { .nf-drm-lens-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .nf-drm-lens-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .nf-drm-lens-grid { grid-template-columns: 1fr; } }

/* Triad */
.nf-drm-triad { display: flex; align-items: stretch; gap: 0; }
.nf-drm-triad-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-5); position: relative; }
.nf-drm-triad-item:not(:last-child) { border-right: 1px solid var(--nf-border-soft); }
.nf-drm-triad-verb { font-size: clamp(1.5rem, 2vw, 2rem); font-weight: 500; color: var(--nf-cyan); letter-spacing: -0.02em; }
.nf-drm-triad-desc { font-size: 1rem; color: var(--nf-text-secondary); text-align: center; }
.nf-drm-triad-link { display: none; }
@media (max-width: 768px) { .nf-drm-triad { flex-direction: column; } .nf-drm-triad-item:not(:last-child) { border-right: none; border-bottom: 1px solid var(--nf-border-soft); } }

/* Numbered list */
.nf-drm-numbered-list { display: flex; flex-direction: column; gap: 0; }
.nf-drm-numbered-item { display: flex; align-items: baseline; gap: var(--nf-space-4); padding: var(--nf-space-4) 0; border-bottom: 1px solid var(--nf-border-soft); }
.nf-drm-numbered-item:last-child { border-bottom: none; }
.nf-drm-numbered-num { font-size: 0.875rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.08em; min-width: 28px; flex-shrink: 0; }
.nf-drm-numbered-text { font-size: 1.0625rem; color: var(--nf-text-primary); line-height: 1.5; }

/* Peer pair */
.nf-drm-peer-pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-5); }
.nf-drm-peer-card { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-6); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-peer-upside { background: rgba(12, 192, 223, 0.025); border-color: rgba(12, 192, 223, 0.15); }
.nf-drm-peer-loss { background: var(--nf-bg-surface-1); }
.nf-drm-peer-heading { font-size: 1.125rem; font-weight: 600; color: var(--nf-text-primary); margin: 0; }
.nf-drm-peer-upside .nf-drm-peer-heading { color: var(--nf-cyan); }
@media (max-width: 768px) { .nf-drm-peer-pair { grid-template-columns: 1fr; } }

/* Evidence progression */
.nf-drm-evidence-progression { display: flex; align-items: stretch; gap: 0; flex-wrap: wrap; }
.nf-drm-evidence-stage { display: flex; align-items: center; gap: var(--nf-space-2); padding: var(--nf-space-4) var(--nf-space-4); position: relative; border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-control); background: var(--nf-bg-surface-1); margin-bottom: var(--nf-space-2); }
.nf-drm-evidence-stage:not(:last-child) { margin-right: var(--nf-space-2); }
.nf-drm-evidence-name { font-size: 0.75rem; font-weight: 600; color: var(--nf-text-tertiary); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
.nf-drm-evidence-arrow { color: var(--nf-text-tertiary); opacity: 0.4; }
.nf-drm-evidence-marker { font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nf-cyan); padding: 2px 6px; border-radius: 4px; background: rgba(12, 192, 223, 0.08); border: 1px solid rgba(12, 192, 223, 0.2); }
.nf-drm-evidence-marker-next { color: var(--nf-warning); background: rgba(245, 166, 35, 0.06); border-color: rgba(245, 166, 35, 0.2); }
.nf-drm-evidence-current .nf-drm-evidence-name { color: var(--nf-cyan); }
.nf-drm-evidence-next .nf-drm-evidence-name { color: var(--nf-warning); }
.nf-drm-evidence-past { opacity: 0.5; }
.nf-drm-evidence-future { opacity: 0.3; }
@media (max-width: 768px) { .nf-drm-evidence-progression { flex-direction: column; } .nf-drm-evidence-stage:not(:last-child) { margin-right: 0; } .nf-drm-evidence-arrow { display: none; } }

/* CTA */
.nf-drm-cta-area { margin-top: var(--nf-space-9); padding-top: var(--nf-space-7); border-top: 1px solid var(--nf-border); display: flex; flex-direction: column; gap: var(--nf-space-3); max-width: 400px; }
.nf-drm-cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: var(--nf-radius-button); font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: background var(--nf-transition-fast), border-color var(--nf-transition-fast), color var(--nf-transition-fast); justify-content: center; }
.nf-drm-cta-primary { background: var(--nf-cyan); color: #041014; border: 1px solid var(--nf-cyan); }
.nf-drm-cta-primary:hover { background: var(--nf-cyan-hover); border-color: var(--nf-cyan-hover); }
.nf-drm-cta-secondary { background: transparent; color: var(--nf-text-secondary); border: 1px solid var(--nf-border); }
.nf-drm-cta-secondary:hover { border-color: var(--nf-cyan-border); color: var(--nf-cyan); }
.nf-drm-cta-continuation { display: inline-flex; align-items: center; gap: 8px; padding: 14px 0; font-size: 1.0625rem; font-weight: 500; color: var(--nf-cyan); text-decoration: none; transition: color var(--nf-transition-fast); border: none; background: none; }
.nf-drm-cta-continuation:hover { color: var(--nf-cyan-hover); }
.nf-drm-cta:focus-visible { outline: 2px solid var(--nf-focus-border); outline-offset: 2px; }

/* Footer */
.nf-drm-footer-row { margin-top: var(--nf-space-8); padding-top: var(--nf-space-5); border-top: 1px solid var(--nf-border-soft); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--nf-space-3); }
.nf-drm-last-updated { font-size: 0.75rem; color: var(--nf-text-tertiary); }

/* Access denied */
.nf-drm-access-denied { padding: var(--nf-space-8); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border); border-radius: var(--nf-radius-panel); text-align: center; max-width: 420px; margin: var(--nf-space-8) auto 0; }
.nf-drm-access-icon { color: var(--nf-text-tertiary); margin-bottom: var(--nf-space-4); }
.nf-drm-access-title { font-size: 1.125rem; font-weight: 600; color: var(--nf-text-primary); margin: 0 0 var(--nf-space-3); }
.nf-drm-access-message { font-size: 0.875rem; color: var(--nf-text-tertiary); margin: 0 0 var(--nf-space-5); }

/* Loading */
.nf-drm-loading { display: flex; align-items: center; gap: 10px; color: var(--nf-text-tertiary); font-size: 0.875rem; padding: var(--nf-space-8) 0; }

/* Spin */
@keyframes nf-drm-spin { to { transform: rotate(360deg); } }
.nf-drm-spin { animation: nf-drm-spin 1s linear infinite; }

/* Responsive */
@media (max-width: 1024px) { .nf-drm-prop-columns { grid-template-columns: 1fr 1fr; } .nf-drm-prop-columns[data-count="1"] { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .nf-drm-main { padding: var(--nf-space-8) var(--nf-space-4) var(--nf-space-9); }
  .nf-drm-hero-title { font-size: clamp(1.75rem, 5vw, 2.25rem); }
  .nf-drm-hero-question { font-size: 1.0625rem; }
  .nf-drm-section-heading { font-size: 1.375rem; }
  .nf-drm-prop-columns, .nf-drm-prop-columns[data-count="2"], .nf-drm-prop-columns[data-count="3"] { grid-template-columns: 1fr; }
  .nf-drm-grid-2x2 { grid-template-columns: 1fr; }
  .nf-drm-two-side { grid-template-columns: 1fr; }
  .nf-drm-home-label, .nf-drm-investor-name { display: none; }
  .nf-drm-section, .nf-drm-section-wide { max-width: 100%; }
  .nf-drm-value-gap-bar { flex-direction: column; height: auto; }
  .nf-drm-value-gap-segment { padding: var(--nf-space-4); border-right: none; border-bottom: 1px solid var(--nf-border-soft); }
}
@media (max-width: 480px) {
  .nf-drm-signout-label { display: none; }
  .nf-drm-body { font-size: 1rem; }
  .nf-drm-hero-title { font-size: clamp(1.5rem, 6vw, 1.9375rem); }
  .nf-drm-hero-question { font-size: 0.9375rem; }
}
@media (prefers-reduced-motion: reduce) { .nf-drm-spin { animation: none; } }
`;
