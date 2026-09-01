import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { ContinueExploringIntelligence } from '@/components/ui/ContinueExploringIntelligence';
import { canonicalVisuals } from '@/data/assets';

export const metadata = pageMetadata({
  path: '/intelligence/intent-threads',
  title: 'Intent Threads™ | Connecting customer intent across interactions | NexFrontier',
  description: 'Intent Threads™ is NexFrontier\'s concept for reconnecting available evidence around an underlying customer need or intent across otherwise separate enterprise interactions.',
});

export default function IntentThreadsPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/intent-threads" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '790px' }}>
            <Eyebrow>INTENT THREADS™</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              One need can appear as many separate interactions.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
              A customer may search, ask, compare, enquire, return, switch channel, speak to different people and continue the same underlying decision. The enterprise may experience those as separate events. The customer experiences one need.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
              Intent Threads&trade; is NexFrontier&apos;s way of reconnecting available evidence around that underlying intent.
            </p>
          </div>
          <div style={{ marginTop: 'var(--nf-space-8)' }}>
            <img
              src={canonicalVisuals.intentThreads}
              alt="Intent Threads diagram showing one underlying need connecting signals, context, progression, decisions and outcomes across multiple interactions."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── Section 2: The problem ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE PROBLEM</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Fragmented interactions can hide the real journey.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              A business may know:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {['an enquiry arrived', 'a message was answered', 'a meeting occurred', 'a handoff happened', 'an opportunity progressed or disappeared'].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              But those moments may sit in different systems or different teams. If the intent connecting them is lost, the enterprise can struggle to understand what actually happened.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Section 3: The idea ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE IDEA</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Reconnect evidence around the underlying need.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Intent Threads&trade; does not mean assuming every interaction belongs together. It means preserving enough evidence to investigate whether apparently separate moments are part of the same underlying customer intent.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              That creates a better basis for understanding: intent &rarr; response &rarr; progression &rarr; outcome
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Section 4: Why it may matter ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY IT MAY MATTER</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Context can change the meaning of an event.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              A slow response may mean little in one situation and materially affect another. A handoff may be routine in one journey and break critical context in another. An enquiry that looks ordinary may represent a highly developed buying decision.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              The surrounding intent helps determine what the event means.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Section 5: The discipline ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE DISCIPLINE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Evidence first. Interpretation second.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Intent Threads&trade; should not create a story that the evidence does not support. NexFrontier is building the concept around available evidence, provenance and the ability to distinguish what is observed from what is inferred.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', fontStyle: 'italic', marginBottom: 'var(--nf-space-6)' }}>
              Do not expose detailed evidence architecture.
            </p>
            <TextLink to="/intelligence/the-brain">See how The Brain connects the evidence</TextLink>
            <ContinueExploringIntelligence links={[
              { label: 'The Brain', path: '/intelligence/the-brain' },
              { label: 'AMCT™', path: '/intelligence/amct' },
            ]} />
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/intent-threads" />
    </>
  );
}
