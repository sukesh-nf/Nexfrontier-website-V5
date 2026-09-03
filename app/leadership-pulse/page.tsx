import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { TopBreadcrumb } from '@/components/ui/ContextNavigation';
import { LeadershipPulseForm } from '@/components/LeadershipPulseForm';

export const metadata = pageMetadata({
  path: '/leadership-pulse',
  title: 'Leadership Pulse | NexFrontier',
  description: 'Three questions about the market AI is creating. About 60 seconds. No email required.',
});

export default function LeadershipPulsePage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/leadership-pulse" />
        </Container>
      </Section>

      {/* Intro */}
      <section className="nf-pulse-hero">
        <Container>
          <div className="nf-pulse-intro">
            <Eyebrow>LEADERSHIP PULSE</Eyebrow>
            <h1 className="nf-pulse-h1">
              Three questions about the market AI is creating.
            </h1>
            <p className="nf-pulse-intro-body">
              AI is not only changing how businesses operate. It is also changing the markets around them.
            </p>
            <p className="nf-pulse-intro-body">
              NexFrontier is asking business leaders how strongly they agree with three propositions about what that could mean for leadership.
            </p>
            <p className="nf-pulse-utility">
              About 60 seconds. No email required.
            </p>
          </div>
        </Container>
      </section>

      {/* Survey */}
      <Section spacing="tight" style={{ paddingTop: 'var(--nf-space-5)', paddingBottom: 'var(--nf-space-5)' }}>
        <Container wide>
          <div className="nf-pulse-survey">
            <LeadershipPulseForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
