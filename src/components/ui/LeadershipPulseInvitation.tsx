import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/primitives';

const COPY = {
  eyebrow: 'LEADERSHIP PULSE',
  heading: 'Three questions. About 60 seconds.',
  supporting: 'Share your view on how AI-mediated markets may change what leadership needs to see, understand and navigate.',
  cta: 'TAKE THE LEADERSHIP PULSE',
};

export function LeadershipPulseInvitation({ source }: { source: string }) {
  const href = `/leadership-pulse?source=${source}`;
  return (
    <div className="nf-pulse-invite">
      <Eyebrow style={{ marginBottom: 'var(--nf-space-3)' }}>{COPY.eyebrow}</Eyebrow>
      <h3 className="nf-pulse-invite-heading">{COPY.heading}</h3>
      <p className="nf-pulse-invite-body">{COPY.supporting}</p>
      <Link href={href} className="nf-pulse-invite-cta">
        {COPY.cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}

export function LeadershipPulseInlineLink({ source }: { source: string }) {
  const href = `/leadership-pulse?source=${source}`;
  return (
    <Link href={href} className="nf-pulse-invite-inline">
      Have a view on the market shift? Take the Leadership Pulse
      <ArrowRight size={15} />
    </Link>
  );
}
