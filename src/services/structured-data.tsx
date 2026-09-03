/**
 * NexFrontier v4 Structured Data Utilities
 * Returns JSON-LD objects for use in server components.
 * Per Blueprint section 88: prepare utilities, do not invent final entity facts.
 */

import { SITE_URL, siteConfig } from '@/config/site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    ...(SITE_URL ? { url: SITE_URL } : {}),
    description: siteConfig.description,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(SITE_URL ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };
}

export function articleJsonLd(article: {
  title: string; description: string; path: string; author: string;
  datePublished?: string; dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    ...(SITE_URL ? { url: `${SITE_URL}${article.path}` } : {}),
    author: { '@type': 'Organization', name: article.author },
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
  };
}

export function personJsonLd(person: {
  name: string; role: string; path: string; linkedin?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.role,
    ...(SITE_URL ? { url: `${SITE_URL}${person.path}` } : {}),
    ...(person.linkedin ? { sameAs: [person.linkedin] } : {}),
  };
}

export function videoJsonLd(video: {
  title: string; description: string; youtubeId: string; uploadDate?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    ...(video.uploadDate ? { uploadDate: video.uploadDate } : {}),
  };
}

/**
 * Helper to render JSON-LD as a script tag in a server component.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
