import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you were looking for may have changed location or may no longer be available.',
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="PAGE NOT FOUND"
        title={<>The signal seems<br /><span style={{ color: 'var(--nf-text-secondary)' }}>to have moved.</span></>}
        lead="The page you were looking for may have changed location or may no longer be available."
        variant="functional"
      />
      <Section>
        <Container>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)', alignItems: 'flex-start' }}>
            <Eyebrow>CONTINUE EXPLORING</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-3)' }}>
              <Button to="/reading-the-shift" variant="secondary">Search Reading The Shift</Button>
              <Button to="/" variant="text">Home</Button>
              <Button to="/enterprise-value" variant="text">Enterprise Value</Button>
              <Button to="/intelligence" variant="text">Intelligence</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
