import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';

export const metadata = pageMetadata({
  path: '/enterprise-value/adaptive-value',
  title: 'What is Adaptive Value™? | NexFrontier',
  description: 'Adaptive Value™ is NexFrontier\'s lens for additional enterprise value that may become possible when economically meaningful market change creates new opportunity.',
});

const dimExamples = [
  { label: 'Revenue', desc: 'Additional demand, conversion or value creation made possible by changing opportunity.' },
  { label: 'Cost', desc: 'New ways of reducing or redeploying economic cost where changing conditions support it.' },
  { label: 'Capacity', desc: 'Additional productive value from people, time or resources.' },
  { label: 'Customer Value', desc: 'Stronger value creation across the customer relationship.' },
  { label: 'Enterprise Capability', desc: 'Greater ability to keep recognising and responding to economically meaningful market change.' },
];

export default function AdaptiveValuePage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/enterprise-value/adaptive-value" />
        </Container>
      </Section>

      {/* ── SECTION 1: Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '790px' }}>
            <Eyebrow>ADAPTIVE VALUE™</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              More value may become possible as the market changes.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
              A business can perform well today while the opportunity around it continues to evolve. Customers may arrive differently. Demand may shift. Expectations may rise. New interactions may emerge.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
              If those changes prove economically meaningful, the enterprise may have access to value that was not available, visible or practical under yesterday&apos;s conditions. NexFrontier calls that possibility Adaptive Value&trade;.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
              Adaptive Value&trade; is additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.
            </p>
            <div style={{ marginTop: 'var(--nf-space-6)' }}>
              <Button to="/enterprise-value/calculator">Explore My Adaptive Value&trade;</Button>
            </div>
          </div>
          <div style={{ marginTop: 'var(--nf-space-8)' }}>
            <img
              src={canonicalVisuals.adaptiveValue}
              alt="Diagram showing Adaptive Value as additional enterprise value that may become possible when economically meaningful market change creates new opportunity."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── SECTION 2: The idea ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE IDEA</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Today&apos;s performance may not define tomorrow&apos;s potential.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Adaptive Value&trade; considers the gap between what the enterprise creates today and what changing market conditions may make economically possible.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              This is an opportunity lens. It is not a promise that every change creates growth.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              Evidence determines whether the opportunity is real, it is material, the enterprise can respond and the economics justify doing so.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 3: Why now ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY NOW</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Internal AI can improve the business. External AI can change the opportunity.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              AI inside the enterprise may improve productivity, analysis, automation, service, efficiency and operating capability. That matters.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              But Adaptive Value&trade; is particularly concerned with what happens when AI changes the market outside the enterprise. That may affect how customers discover needs, how they compare, what they expect, how ready they are, which channels matter and how opportunity forms.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              Internal capability can help the enterprise respond. External market change can alter what there is to respond to.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 4: Opportunity gap ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE OPPORTUNITY GAP</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              More may simply become possible.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              A strong business does not have to be underperforming for Adaptive Value&trade; to exist. The market itself may create a higher potential baseline.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The question becomes: What could become economically possible if the market reaching us is changing?
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              That possibility still needs evidence. But it is different from recovering value the enterprise could already have captured.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 5: Adaptation ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>ADAPTATION, NOT ACTIVITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              More change does not automatically create more value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Adaptive Value&trade; does not mean more AI, more systems, more transformation, more automation or constant organisational change.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The appropriate response may involve people, process, capacity, customer experience, product, technology, AI, investment or no action at all.
            </p>
            <p className="nf-pull" style={{ marginBottom: 'var(--nf-space-4)' }}>
              Adaptation is a means. Value is the test.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              Leadership therefore has to ask: Is enough additional Enterprise Value becoming possible to justify adapting?
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 6: Where value may appear ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>WHERE VALUE MAY APPEAR</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)' }}>
            Adaptive Value&trade; can extend across the enterprise.
          </h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
            Use the same five canonical dimensions. Examples should remain conceptual, not promises.
          </p>
          <div className="nf-dim-grid" style={{ marginBottom: 'var(--nf-space-6)' }}>
            {dimExamples.map((dim) => (
              <div key={dim.label} style={{ background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-panel)', padding: 'var(--nf-space-5)' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-3)' }}>{dim.label}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--nf-text-tertiary)' }}>{dim.desc}</p>
              </div>
            ))}
          </div>
          <Button to="/enterprise-value/value-translation-framework" variant="secondary">Explore Value Translation Framework&trade;</Button>
        </Container>
      </Section>

      {/* ── SECTION 7: Readiness is perishable ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE LONGER VIEW</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Opportunity can move again.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              An enterprise may adapt successfully to today&apos;s change and still face a different market tomorrow. That is why Adaptive Value&trade; connects to Enterprise Capability.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The larger capability is not simply adapting once. It is becoming better at recognising when the economics have changed, what deserves a response, what does not and whether the response actually created value.
            </p>
            <p className="nf-pull" style={{ marginBottom: 'var(--nf-space-6)' }}>
              Adaptation has no inherent value. Its value is in the better economic outcomes it enables.
            </p>
            <Button to="/intelligence/enterprise-capability" variant="secondary">Explore Enterprise Capability</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 8: Explore ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>EXPLORE THE POSSIBILITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              What could changing market opportunity mean for your enterprise?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The NexFrontier Enterprise Value Calculator lets you apply your own Adaptive Value&trade; assumptions across five value dimensions.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              It does not forecast future growth. Its purpose is to make the economic possibility visible enough to ask whether it deserves investigation.
            </p>
            <Button to="/enterprise-value/calculator">Explore My Adaptive Value&trade;</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 9: NF Perspective ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>NF PERSPECTIVE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              An opportunity lens, not a growth promise.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Adaptive Value&trade; does not imply that every market shift creates attractive new value. An opportunity may be too small, too uncertain, too expensive, too difficult, too short-lived or poorly aligned to the enterprise.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              The economic case still has to be made.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 10: Closing question ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE QUESTION TO LEAVE WITH</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              What additional value could become possible if the opportunity around your enterprise is changing?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The question is not simply how to perform today&apos;s business better. It is whether the market is making more possible, and whether the additional value is worth pursuing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
              <Button to="/enterprise-value/calculator">Explore My Adaptive Value&trade;</Button>
              <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap' }}>
                <TextLink to="/enterprise-value/quiet-loss">Explore Quiet Loss&trade;</TextLink>
                <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/enterprise-value/adaptive-value" />
    </>
  );
}
