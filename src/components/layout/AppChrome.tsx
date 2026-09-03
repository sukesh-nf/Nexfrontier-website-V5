'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const PRIVATE_PREFIXES = ['/investor-data-room', '/investor-admin'];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPrivate = PRIVATE_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isPrivate) {
    return <>{children}</>;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
