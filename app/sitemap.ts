import type { MetadataRoute } from 'next';
import { SITE_URL, SHOULD_INDEX } from '@/config/site';
import { getPublishedRoutes, isRoutePublished } from '@/config/navigation';
import { getPublishedArticles } from '@/data/spokes';
import { teamSlugs } from '@/config/navigation';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SHOULD_INDEX || !SITE_URL) {
    return [];
  }

  // Only routes with publication status 'published' are eligible
  // for sitemap inclusion and indexation (Blueprint section 138).
  const staticRoutes: MetadataRoute.Sitemap = getPublishedRoutes().map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1.0 : path.includes('/reading-the-shift/') ? 0.7 : 0.8,
  }));

  // Spoke routes: only published articles AND the reading-the-shift hub must be published
  const spokeRoutes: MetadataRoute.Sitemap = isRoutePublished('/reading-the-shift')
    ? getPublishedArticles().map((article) => ({
        url: `${SITE_URL}/reading-the-shift/${article.slug}`,
        lastModified: new Date(article.updatedDate ?? article.publishedDate ?? Date.now()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    : [];

  // Team routes: only if /about is published
  const teamRoutes: MetadataRoute.Sitemap = isRoutePublished('/about')
    ? teamSlugs
        .filter((slug) => isRoutePublished(`/about/${slug}`))
        .map((slug) => ({
          url: `${SITE_URL}/about/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
        }))
    : [];

  return [...staticRoutes, ...spokeRoutes, ...teamRoutes];
}
