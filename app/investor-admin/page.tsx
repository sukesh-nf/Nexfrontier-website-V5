import type { Metadata } from 'next';
import { AdminShell } from '@/components/drm/AdminShell';

export const metadata: Metadata = {
  title: 'Admin — NexFrontier',
  robots: { index: false, follow: false },
};

export default function InvestorAdminPage() {
  return <AdminShell />;
}
