import type { Metadata } from 'next';
import { NDAAcceptance } from '@/components/NDAAcceptance';

export const metadata: Metadata = {
  title: 'NDA — Investor Data Room',
  robots: { index: false, follow: false },
};

export default function NDAPage() {
  return <NDAAcceptance />;
}
