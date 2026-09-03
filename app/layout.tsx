import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AppChrome } from '@/components/layout/AppChrome';
import { siteConfig, SHOULD_INDEX, SITE_URL } from '@/config/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.description}`,
    template: '%s',
  },
  description: siteConfig.description,
  // Global default: noindex. Individual pages opt in via pageMetadata()
  // when their publication status is 'published' and SHOULD_INDEX is true.
  robots: { index: false, follow: false },
  ...(SITE_URL
    ? {
        metadataBase: new URL(SITE_URL),
        alternates: { canonical: '/' },
        openGraph: {
          type: 'website',
          siteName: siteConfig.name,
          url: SITE_URL,
        },
        twitter: {
          card: 'summary_large_image',
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#050607',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
