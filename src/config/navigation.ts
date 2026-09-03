/**
 * NexFrontier v4 Navigation Configuration
 * Canonical sitemap and navigation structure per Blueprint sections 5, 9-12.
 */

export interface NavChild {
  label: string;
  path: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  path: string;
  children: NavChild[];
}

/**
 * Page publication state (Blueprint section 138).
 * A route existing in the application does not mean the page is
 * approved for public indexing.
 *
 *   development  - placeholder or incomplete content, not for indexing
 *   review       - content complete, awaiting approval
 *   published    - approved for public indexing and sitemap inclusion
 *
 * This is separate from the Reading The Shift draft/review/published/archived
 * content model, although both follow the same underlying principle.
 * Do not expose placeholder pages to search engines at launch.
 */
export type PagePublicationStatus = 'development' | 'review' | 'published';

export interface PageRoute {
  path: string;
  status: PagePublicationStatus;
}

/**
 * All canonical routes with their current publication status.
 * During v4 build, routes temporarily contain development placeholders
 * while later Canonical Blueprint Parts supply their final content.
 * Only 'published' routes are eligible for sitemap inclusion and indexation.
 */
export const pageRoutes: PageRoute[] = [
  { path: '/', status: 'published' },
  { path: '/the-shift', status: 'published' },
  { path: '/intelligence', status: 'published' },
  { path: '/intelligence/the-brain', status: 'published' },
  { path: '/intelligence/intent-threads', status: 'published' },
  { path: '/intelligence/orbit', status: 'published' },
  { path: '/intelligence/amct', status: 'published' },
  { path: '/intelligence/human-in-the-lead', status: 'published' },
  { path: '/intelligence/enterprise-capability', status: 'published' },
  { path: '/enterprise-value', status: 'published' },
  { path: '/enterprise-value/quiet-loss', status: 'published' },
  { path: '/enterprise-value/adaptive-value', status: 'published' },
  { path: '/enterprise-value/value-translation-framework', status: 'published' },
  { path: '/enterprise-value/calculator', status: 'published' },
  { path: '/where-nexfrontier-fits', status: 'published' },
  { path: '/hyper-accelerating-markets', status: 'published' },
  { path: '/reading-the-shift', status: 'published' },
  { path: '/foundation-customers', status: 'published' },
  { path: '/about', status: 'published' },
  { path: '/about/sukesh-sukumaran', status: 'published' },
  { path: '/about/nela-muttettuwegama', status: 'published' },
  { path: '/about/chris-stanley', status: 'published' },
  { path: '/investor-proof', status: 'published' },
  { path: '/investor', status: 'development' },
  { path: '/market-enquiry', status: 'published' },
  { path: '/leadership-pulse', status: 'published' },
  { path: '/privacy', status: 'published' },
  { path: '/terms', status: 'published' },
];

/**
 * Returns only routes approved for public indexing (status === 'published').
 */
export function getPublishedRoutes(): string[] {
  return pageRoutes.filter((r) => r.status === 'published').map((r) => r.path);
}

/**
 * Returns the publication status for a given route path.
 */
export function getRouteStatus(path: string): PagePublicationStatus {
  const route = pageRoutes.find((r) => r.path === path);
  return route ? route.status : 'development';
}

/**
 * Whether a given route is approved for public indexing.
 */
export function isRoutePublished(path: string): boolean {
  return getRouteStatus(path) === 'published';
}

export const intelligenceChildren: NavChild[] = [
  { label: 'Overview', path: '/intelligence', description: 'What NexFrontier is building' },
  { label: 'The Brain', path: '/intelligence/the-brain', description: 'Connect evidence. Learn what matters.' },
  { label: 'Intent Threads™', path: '/intelligence/intent-threads', description: 'Reconnect evidence around an underlying need.' },
  { label: 'ORBIT™', path: '/intelligence/orbit', description: 'Customer value journey for gaining, proving and compounding value.' },
  { label: 'AMCT™', path: '/intelligence/amct', description: 'Customer. AI. Business. Trust.' },
  { label: 'Human in the Lead', path: '/intelligence/human-in-the-lead', description: 'Evidence-led decisions, human judgement.' },
  { label: 'Enterprise Capability', path: '/intelligence/enterprise-capability', description: 'The ability to keep earning readiness.' },
];

export const enterpriseValueChildren: NavChild[] = [
  { label: 'Overview', path: '/enterprise-value', description: 'The wider economic picture.' },
  { label: 'Quiet Loss™', path: '/enterprise-value/quiet-loss', description: 'Protect or recover existing value.' },
  { label: 'Adaptive Value™', path: '/enterprise-value/adaptive-value', description: 'Explore additional value made possible by change.' },
  { label: 'Value Translation Framework™', path: '/enterprise-value/value-translation-framework', description: 'Translate evidence into defensible commercial meaning.' },
  { label: 'Enterprise Value Calculator', path: '/enterprise-value/calculator', description: 'Explore an illustrative annual value scenario.' },
];

export const navGroups: NavGroup[] = [
  { label: 'Intelligence', path: '/intelligence', children: intelligenceChildren },
  { label: 'Enterprise Value', path: '/enterprise-value', children: enterpriseValueChildren },
];

export const topNavLinks: { label: string; path: string }[] = [
  { label: 'The Shift', path: '/the-shift' },
  { label: 'Intelligence', path: '/intelligence' },
  { label: 'Enterprise Value', path: '/enterprise-value' },
  { label: 'Reading The Shift', path: '/reading-the-shift' },
  { label: 'Foundation Customers', path: '/foundation-customers' },
  { label: 'About', path: '/about' },
];

export const actionLinks: { label: string; path: string }[] = [
  { label: 'Investor', path: '/investor-proof' },
];

export const allRoutes: string[] = pageRoutes.map((r) => r.path);

export const teamSlugs = ['sukesh-sukumaran', 'nela-muttettuwegama', 'chris-stanley'];
