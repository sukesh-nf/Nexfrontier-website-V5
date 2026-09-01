import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';

export const metadata = pageMetadata({
  path: '/enterprise-value/value-translation-framework',
  title: 'Value Translation Framework™ | NexFrontier',
  description: 'Translate market, customer and enterprise evidence into defensible commercial meaning and Enterprise Value.',
});

const chain = [
  {
    name: 'Operational / Market Significance',
    question: 'What appears to be happening, and is the signal meaningful rather than noise?',
  },
  {
    name: 'Commercial Significance',
    question: 'Could what is happening materially affect the economics of the business?',
  },
  {
    name: 'Value Identification',
    question: 'Where might value be protected, recovered, increased or exposed?',
  },
  {
    name: 'Value Quantification',
    question: 'What magnitude of value can reasonably be estimated from the available evidence and explicit assumptions?',
  },
  {
    name: 'Value Translation',
    question: 'What does that evidence and estimate mean in commercial and enterprise terms?',
  },
  {
    name: 'Actionable Insight',
    question: 'What appears significant enough to warrant leadership attention, further evidence or a decision?',
  },
];

const lenses = [
  {
    name: 'Defensive Value',
    desc: 'Where existing enterprise value may need to be protected, recovered or prevented from eroding.',
  },
  {
    name: 'Offensive Value',
    desc: 'Where changing conditions may create additional opportunity that the enterprise could potentially capture.',
  },
  {
    name: 'Revenue Health',
    desc: 'What evidence indicates about the quality, progression and sustainability of revenue opportunity.',
  },
  {
    name: 'Customer Lifetime Value',
    desc: 'What evidence may indicate about the economics and value of the customer relationship over time.',
  },
  {
    name: 'Enterprise Capability',
    desc: 'Whether the enterprise can recognise economically meaningful change, decide whether it warrants action, adapt effectively and learn from the outcome.',
  },
];

export default function ValueTranslationFrameworkPage() {
  return (
    <>
      <Section spacing="tight"><Container><TopBreadcrumb path="/enterprise-value/value-translation-framework" /></Container></Section>

      <PageHero
        eyebrow="VALUE TRANSLATION FRAMEWORK™"
        title={<>From evidence<br /><span style={{ color: 'var(--nf-text-secondary)' }}>to commercial meaning.</span></>}
        lead="The Value Translation Framework™ translates market, customer and enterprise evidence into defensible commercial meaning."
        secondary="It is the bridge between evidence, commercial significance and Enterprise Value. Evidence comes before claim; identified value is not the same as realised value."
        variant="thesis"
      />

      {/* ── Founder-approved visual ── */}
      <Section>
        <Container wide>
          <div style={{ maxWidth: 'var(--nf-container-diagram)', margin: '0 auto' }}>
            <img
              src={canonicalVisuals.valueTranslationFramework}
              alt="Value Translation Framework showing the chain from evidence to actionable insight and five value lenses."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── Commercial purpose ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE PROBLEM IT ADDRESSES</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Not every signal has economic consequence.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Businesses can observe large amounts of operational, customer and market activity without knowing which signals have economic consequence. The Value Translation Framework&trade; is intended to help distinguish what may matter commercially and what deserves further evidence or leadership attention.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              It is a disciplined interpretive method, not a claim that every signal reaches the final stage of translation.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Translation chain ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE TRANSLATION CHAIN</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
            One connected progression from signal to decision.
          </h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-7)', maxWidth: '680px' }}>
            Each stage answers a different question. Not every signal necessarily reaches the final stage.
          </p>
          <div className="nf-vtf-chain">
            {chain.map((step, index) => (
              <div key={step.name} className="nf-vtf-chain-step">
                <div className="nf-vtf-chain-marker">{String(index + 1).padStart(2, '0')}</div>
                <div className="nf-vtf-chain-body">
                  <strong className="nf-vtf-chain-name">{step.name}</strong>
                  <span className="nf-vtf-chain-question">{step.question}</span>
                </div>
                {index < chain.length - 1 && <span className="nf-vtf-chain-arrow" aria-hidden="true">&rarr;</span>}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Five lenses ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>FIVE COMMERCIAL LENSES</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
            Different ways to interpret the same evidence.
          </h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-7)', maxWidth: '680px' }}>
            The five Value Translation Framework&trade; lenses are not five separate products or five guaranteed sources of financial value. They are different commercial lenses through which relevant evidence can be interpreted.
          </p>
          <div className="nf-vtf-lenses">
            {lenses.map((lens, index) => (
              <div key={lens.name} className="nf-vtf-lens">
                <span className="nf-vtf-lens-number">{String(index + 1).padStart(2, '0')}</span>
                <strong className="nf-vtf-lens-name">{lens.name}</strong>
                <p className="nf-vtf-lens-desc">{lens.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Relationship with Enterprise Value ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>RELATIONSHIP TO ENTERPRISE VALUE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Enterprise Value is the destination. The framework is the bridge.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Enterprise Value is the economic destination NexFrontier seeks to understand. Value Translation Framework&trade; helps translate relevant evidence into commercially meaningful interpretations of where value may be protected, recovered or increased.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              A translated value hypothesis or estimate is not the same as realised Enterprise Value. Realised value requires evidence of actual outcomes.
            </p>
            <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── Quiet Loss and Adaptive Value context ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>TWO VALUE POSSIBILITIES</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
              The framework can interpret evidence for both directions of value.
            </h2>
            <div className="nf-vtf-context-pair">
              <div className="nf-vtf-context-item">
                <strong className="nf-vtf-context-name">Quiet Loss&trade;</strong>
                <p className="nf-vtf-context-desc">Value that may be difficult to see because the enterprise is capturing less from existing market opportunity than it potentially could.</p>
                <TextLink to="/enterprise-value/quiet-loss">Explore Quiet Loss&trade;</TextLink>
              </div>
              <div className="nf-vtf-context-divider" />
              <div className="nf-vtf-context-item">
                <strong className="nf-vtf-context-name">Adaptive Value&trade;</strong>
                <p className="nf-vtf-context-desc">Additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.</p>
                <TextLink to="/enterprise-value/adaptive-value">Explore Adaptive Value&trade;</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── ORBIT separation ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>ORBIT™ IS SEPARATE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              A customer value journey, not a value translation method.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              ORBIT&trade; describes NexFrontier&rsquo;s customer value journey for gaining, proving and compounding value over time. Value Translation Framework&trade; translates relevant evidence into commercial meaning. They are distinct.
            </p>
            <TextLink to="/intelligence/orbit">Explore ORBIT&trade;</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── End-of-page CTAs ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>FROM METHOD TO APPLICATION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Move from interpretation to economic estimation.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-7)' }}>
              The framework interprets evidence. The Enterprise Value Calculator lets you use annual business figures and assumptions you choose to explore the possible scale of value at stake.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap' }}>
                <TextLink to="/enterprise-value/calculator">Try the Enterprise Value Calculator</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/enterprise-value/value-translation-framework" />
    </>
  );
}
