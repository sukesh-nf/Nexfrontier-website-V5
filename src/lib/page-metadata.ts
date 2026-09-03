/**
 * NexFrontier v4 Page Metadata Helper
 *
 * Provides per-page metadata that respects the page publication gate
 * (Blueprint section 138) and the production indexing gate
 * (Blueprint section 137).
 *
 * Usage in a page file:
 *
 *   import { pageMetadata } from '@/lib/page-metadata';
 *
 *   export const metadata: Metadata = {
 *     ...pageMetadata({
 *       path: '/the-shift',
 *       title: 'The Shift',
 *       description: '...',
 *     }),
 *   };
 *
 * When the page's publication status is 'published' AND SHOULD_INDEX is true,
 * the page returns { index: true, follow: true }. Otherwise, it inherits
 * the global default of { index: false, follow: false }.
 */

import type { Metadata } from 'next';
import { SHOULD_INDEX, SITE_URL } from '@/config/site';
import { getRouteStatus } from '@/config/navigation';

export interface PageMetadataInput {
  path: string;
  title: string;
  description: string;
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const status = getRouteStatus(input.path);
  const isIndexable = SHOULD_INDEX && status === 'published';

  const metadata: Metadata = {
    title: input.title,
    description: input.description,
    robots: isIndexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };

  if (SITE_URL) {
    metadata.alternates = { canonical: input.path };
    metadata.openGraph = {
      type: 'website',
      title: input.title,
      description: input.description,
      url: input.path,
    };
    metadata.twitter = {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    };
  }

  return metadata;
}
