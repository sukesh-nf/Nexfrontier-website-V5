import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';
import { ContinueExploringIntelligence } from '@/components/ui/ContinueExploringIntelligence';

export const metadata = pageMetadata({
  path: '/intelligence/amct',
  title: 'AMCT™ | AI-Mediated Choice Triangle | NexFrontier',
  description: 'AMCT™ is NexFrontier\'s framework for understanding trust across the Customer, AI and Business relationships emerging in AI-mediated choice.',
});

export default function AmctPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/amct" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '790px' }}>
            <Eyebrow>AMCT™</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Customer. AI. Business. Trust has to travel across all three.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
              As customers increasingly use AI to understand needs, compare choices and decide what to do next, buying can become a relationship between three parties: Customer, AI and Business.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
              The AI-Mediated Choice Triangle, AMCT&trade;, is NexFrontier&apos;s framework for thinking about trust across those relationships.
            </p>
          </div>
          <div style={{ marginTop: 'var(--nf-space-8)' }}>
            <img
              src={canonicalVisuals.amct}
              alt="AI-Mediated Choice Triangle showing the three-way relationship between Customer, AI and Business, with trust needing to hold across all three."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── Section 2: Three relationships ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-three-col">
            <div className="nf-premium-card"><Eyebrow>CUSTOMER ↔ AI</Eyebrow><h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>The customer has to trust AI enough to use it.</h2><p style={{ color: 'var(--nf-text-secondary)', lineHeight: 'var(--nf-leading-body)' }}>Customers increasingly ask AI what they need, which option fits and what they should do next. Trust shapes how much AI can mediate the journey.</p></div>
            <div className="nf-premium-card"><Eyebrow>AI ↔ BUSINESS</Eyebrow><h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>AI needs enough evidence to understand and represent the business.</h2><p style={{ color: 'var(--nf-text-secondary)', lineHeight: 'var(--nf-leading-body)' }}>AI systems can only work with the evidence available to them. That may influence whether a business is surfaced, described and included in consideration.</p></div>
            <div className="nf-premium-card"><Eyebrow>BUSINESS ↔ CUSTOMER</Eyebrow><h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>The business and customer relationship still has to earn trust.</h2><p style={{ color: 'var(--nf-text-secondary)', lineHeight: 'var(--nf-leading-body)' }}>Leaders must decide where AI can be trusted, where people should step in and whether the resulting interaction creates value for the customer.</p></div>
          </div>
        </Container>
      </Section>

      {/* ── Section 5: The enterprise question ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE ENTERPRISE QUESTION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Trust is not just reputational. It can become economic.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              If AI increasingly mediates discovery, choice and interaction, weaknesses in trust may affect:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {['whether the business enters consideration', 'how the customer arrives', 'what context survives the journey', 'how confidently the enterprise responds', 'whether value is ultimately created'].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              The economic effect still requires evidence.
            </p>
            <Button to="/reading-the-shift" variant="secondary">Read more questions about trust and AI-mediated choice</Button>
            <ContinueExploringIntelligence links={[
              { label: 'Intent Threads™', path: '/intelligence/intent-threads' },
              { label: 'The Brain', path: '/intelligence/the-brain' },
            ]} />
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/amct" />
    </>
  );
}
