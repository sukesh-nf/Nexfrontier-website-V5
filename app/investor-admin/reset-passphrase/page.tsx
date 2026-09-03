import type { Metadata } from 'next';
import ResetPassphraseClient from './reset-passphrase-client';

export const metadata: Metadata = {
  title: 'Reset Admin Passphrase — NexFrontier',
  robots: { index: false, follow: false },
};

export default function ResetPassphrasePage() {
  return <ResetPassphraseClient />;
}
