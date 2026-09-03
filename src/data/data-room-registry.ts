// ============================================================
// Data Room Content Registry
//
// SECURITY NOTE: This registry contains only non-confidential
// structural metadata (slug, title, question, status, sort order).
// Substantive diligence content is NOT stored here — it is fetched
// at runtime via the authenticated drm-content edge function.
// This prevents confidential content from being embedded in
// statically generated HTML or client JavaScript bundles.
// ============================================================

export type DataRoomTopicStatus = 'inactive' | 'published' | 'archived';

export type EvidenceState = 'ASSUMPTION' | 'HYPOTHESIS' | 'THESIS' | 'EVIDENCE' | 'CUSTOMER VALIDATION' | 'PAID VALIDATION' | 'REPEATABLE PROOF';

export interface DataRoomTopic {
  slug: string;
  title: string;
  question: string;
  status: DataRoomTopicStatus;
  last_updated: string;
  sort_order: number;
  searchable: boolean;
  printable: boolean;
  security_classification: string;
}

export const dataRoomTopics: DataRoomTopic[] = [
  {
    slug: 'investment-case',
    title: 'Investment Case',
    question: 'What is the full investment thesis behind NexFrontier?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 1,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'market-evidence',
    title: 'Market & Evidence',
    question: 'Is AI changing how markets change, and what evidence supports the thesis?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 2,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'economic-opportunity',
    title: 'Economic Opportunity',
    question: 'Where could economic value move, and how much might NexFrontier address?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 3,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'product',
    title: 'Product / ENI',
    question: 'What is NexFrontier building and what enterprise capability is it intended to create?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 4,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'proof',
    title: 'Proof & Foundation Customers',
    question: 'What has been evidenced, what remains hypothesis and what is being validated next?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 5,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'round',
    title: 'Round & Use of Funds',
    question: 'What capital is required, what proof should it buy and what changes if that proof is earned?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 6,
    searchable: true,
    printable: true,
    security_classification: 'nda_required',
  },
  {
    slug: 'commercial-model',
    title: 'Commercial Model',
    question: 'How does NexFrontier intend to generate revenue?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 7,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'financials',
    title: 'Financials',
    question: 'What are the current financial projections?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 8,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'defensibility-ip',
    title: 'Defensibility & IP',
    question: 'What makes NexFrontier defensible?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 9,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'team-governance',
    title: 'Team & Governance',
    question: 'Who is building NexFrontier and how is it governed?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 10,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'risks-open-questions',
    title: 'Risks & Open Questions',
    question: 'What are the key risks and unresolved questions?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 11,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'legal-corporate',
    title: 'Legal & Corporate',
    question: 'What is the corporate structure and legal status?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 12,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
  {
    slug: 'supporting-evidence',
    title: 'Supporting Evidence',
    question: 'What supporting evidence is available?',
    status: 'inactive',
    last_updated: '2026-09-02',
    sort_order: 13,
    searchable: false,
    printable: false,
    security_classification: 'nda_required',
  },
];

export function getActiveTopics(): DataRoomTopic[] {
  return dataRoomTopics
    .filter((t) => t.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getTopicBySlug(slug: string): DataRoomTopic | undefined {
  return dataRoomTopics.find((t) => t.slug === slug);
}

export function getSearchableTopics(): DataRoomTopic[] {
  return dataRoomTopics.filter((t) => t.searchable && t.status === 'published');
}
