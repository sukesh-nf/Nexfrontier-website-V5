import type { MetadataRoute } from 'next';
import { SHOULD_INDEX, SITE_URL } from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: SHOULD_INDEX ? '/' : '',
      disallow: SHOULD_INDEX ? '' : '/',
    },
    ...(SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
