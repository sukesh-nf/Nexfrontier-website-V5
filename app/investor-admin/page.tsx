import type { Metadata } from 'next';
import { AdminHub } from '@/components/drm/AdminHub';

export const metadata: Metadata = {
  title: 'Admin — NexFrontier',
  robots: { index: false, follow: false },
};

export default function InvestorAdminPage() {
  return <AdminHub />;
}
