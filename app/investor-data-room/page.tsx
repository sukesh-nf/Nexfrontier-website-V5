import type { Metadata } from 'next';
import { InvestorDataRoom } from '@/components/InvestorDataRoom';

export const metadata: Metadata = {
  title: 'Data Room',
  robots: { index: false, follow: false },
};

export default function InvestorDataRoomPage() {
  return <InvestorDataRoom />;
}
