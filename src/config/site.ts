/**
 * NexFrontier v4 Site Configuration
 *
 * Canonical site URL is environment-driven via NEXT_PUBLIC_SITE_URL.
 * Do NOT hard-code Bolt project URLs, staging URLs, .com/.nz/.my domains,
 * or any guessed production origin.
 *
 * The production canonical domain is PENDING CONFIRMATION.
 * The architecture must allow this to be changed from one config value before launch.
 *
 * Indexing requires TWO explicit conditions (Blueprint section 137):
 *   1. A valid canonical NEXT_PUBLIC_SITE_URL must exist.
 *   2. SITE_INDEXING_ENABLED must be explicitly set to 'true'.
 * A production build alone does NOT make the site indexable.
 * Preview, staging, QA and pre-launch domain testing remain noindex
 * unless both conditions are met.
 */

const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

/**
 * The canonical production origin for absolute URLs.
 * Returns null when not configured, so canonical tags are omitted
 * rather than emitting a guessed domain.
 */
export const SITE_URL: string | null = ENV_SITE_URL ?? null;

export const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';

/**
 * Preview mode for unpublished content.
 * When true, draft/review/archived Spokes and video pages render despite not being published.
 * This is a deliberate preview condition — NOT general authentication.
 * In production, unpublished content returns notFound() unless this flag is set.
 *
 * This variable is server-side only (PREVIEW_MODE, not NEXT_PUBLIC_PREVIEW_MODE)
 * so it is never inlined into client-side JavaScript bundles.
 * Set via PREVIEW_MODE=true in the server environment for QA/preview builds.
 */
export const PREVIEW_MODE: boolean = process.env.PREVIEW_MODE === 'true';

/**
 * Explicit indexing approval flag (Blueprint section 137).
 * Default: false. Must be explicitly set to 'true' in the environment.
 * A production build alone does not enable indexing.
 */
export const SITE_INDEXING_ENABLED: boolean =
  process.env.SITE_INDEXING_ENABLED === 'true';

/**
 * Whether search engines should index this build.
 * Requires BOTH a valid canonical site URL AND explicit indexing approval.
 * Do not allow the website to become indexable merely because
 * Next.js is running a production build.
 */
export const SHOULD_INDEX: boolean =
  !!SITE_URL && SITE_INDEXING_ENABLED;

export interface SiteConfig {
  name: string;
  shortName: string;
  url: string | null;
  description: string;
  positioning: string;
  contact: {
    malaysia: {
      email: string;
      whatsapp: string;
      whatsappDisplay: string;
      address: string[];
      linkedin: string;
    };
    newZealand: {
      email: string;
      whatsapp: string;
      whatsappDisplay: string;
      linkedin: string;
    };
  };
}

export const siteConfig: SiteConfig = {
  name: 'NexFrontier',
  shortName: 'NexFrontier',
  url: SITE_URL,
  description: 'Intelligence for AI-mediated markets.',
  positioning: 'Intelligence for AI-mediated markets.',
  contact: {
    malaysia: {
      email: 'hello@nexfrontier.my',
      whatsapp: 'https://wa.me/60126010888',
      whatsappDisplay: '+60 12 601 0888',
      address: ['L9, Menara Public Gold @TRX', '50400 Kuala Lumpur'],
      linkedin: 'https://www.linkedin.com/company/nexfrontierlogic',
    },
    newZealand: {
      email: 'hello@nexfrontierlogic.nz',
      whatsapp: 'https://wa.me/6421949693',
      whatsappDisplay: '+64 21 94 96 93',
      linkedin: 'https://www.linkedin.com/company/nexfrontierlogic',
    },
  },
};
