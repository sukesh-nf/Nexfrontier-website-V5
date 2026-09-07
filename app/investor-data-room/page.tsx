import type { Metadata } from 'next';
import { InvestorDataRoomV2 } from '@/components/InvestorDataRoomV2';

export const metadata: Metadata = {
  title: 'Data Room',
  robots: { index: false, follow: false },
};

export default function InvestorDataRoomPage() {
  return <InvestorDataRoomV2 />;
}
