import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { VisualPlaceholder } from '@/components/visual/VisualPlaceholder';
import { canonicalVisuals } from '@/data/assets';

export const metadata = pageMetadata({
  path: '/enterprise-value/quiet-loss',
  title: 'What is Quiet Loss™? | NexFrontier',
  description: 'Quiet Loss™ is NexFrontier\'s lens for value that may be difficult to see because an enterprise is capturing less from existing market opportunity than it potentially could.',
});

export default function QuietLossPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/enterprise-value/quiet-loss" />
        </Container>
      </Section>

      {/* ── SECTION 1: Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '790px' }}>
            <Eyebrow>QUIET LOSS™</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Value can be there, even when the loss is difficult to see.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
              A business can grow, hit its targets and still capture less from the opportunity already available to it than it potentially could. NexFrontier calls that difficult-to-see value gap Quiet Loss&trade;.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
              It may appear through revenue not realised, unnecessary economic cost, constrained capacity, weakened customer value or reduced enterprise performance. Nothing has to look broken. The question is whether enough value may be going unrealised to matter.
            </p>
            <div style={{ marginTop: 'var(--nf-space-6)' }}>
              <Button to="/enterprise-value/calculator">Calculate My Quiet Loss&trade;</Button>
            </div>
          </div>
          <div style={{ marginTop: 'var(--nf-space-8)' }}>
            {canonicalVisuals.quietLoss ? (
              <img
                src={canonicalVisuals.quietLoss}
                alt="Diagram showing Quiet Loss as value from existing opportunity that may be unrealised, distinct from Adaptive Value which concerns additional opportunity."
                style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
            ) : (
              <VisualPlaceholder
                visualId="VISUAL-QL-01"
                concept="Quiet Loss"
                purpose="Canonical Quiet Loss visual showing value from existing opportunity that may be unrealised. Must be distinct from the Enterprise Value visual. CANONICAL ASSET REQUIRED / NEEDS UPLOAD."
                labels={['Quiet Loss', 'Existing opportunity', 'Unrealised value']}
                mobileTreatment="Full-width"
              />
            )}
          </div>
        </Container>
      </Section>

      {/* ── SECTION 2: The idea ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE IDEA</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Quiet Loss&trade; is one side of Enterprise Value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Quiet Loss&trade; considers value from existing opportunity that may need to be protected or recovered. Adaptive Value&trade; considers additional value that may become possible as the market changes. This page focuses on the first.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              Quiet Loss&trade; is value that may be difficult to see because the enterprise is capturing less from existing market opportunity than it potentially could. It is a lens for investigation, not a claim that every business is losing value.
            </p>
            <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 3: Why it can stay quiet ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY IT CAN STAY QUIET</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Good performance does not always reveal the full opportunity.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Revenue can grow. Targets can be met. Margins can remain healthy. Customers can remain satisfied. All of those measures matter.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              But they tell leadership primarily what the enterprise achieved. They do not always reveal whether more value could reasonably have been created from the same underlying opportunity.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              That is why Quiet Loss&trade; can remain quiet.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 4: AI-mediated effect ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE AI-MEDIATED EFFECT</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              External AI may increase what is at stake.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Quiet Loss&trade; does not depend on AI. Businesses have always had value gaps. But external AI may change the customer before the customer reaches the enterprise.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              AI can increasingly help people:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {['understand needs', 'compare alternatives', 'evaluate providers', 'clarify requirements', 'decide what matters'].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Some customers may therefore arrive with more developed intent, richer context, different expectations or greater readiness to act. If those differences prove economically meaningful, the value of recognising and responding well may increase. So may the consequence of failing to.
            </p>
            <p className="nf-pull" style={{ marginBottom: 'var(--nf-space-6)' }}>
              When opportunity quality changes, the economics of both capturing and losing it may change too.
            </p>
            <Button to="/intelligence/amct" variant="secondary">Explore AMCT&trade;</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 5: Reference point ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE REFERENCE POINT</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              The numbers can be right while the gap remains hidden.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Imagine the dashboard is green. Revenue is growing. Conversion is stable. The business is delivering what leadership expected.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Now ask a different question: Are we creating as much value as the opportunity already available to us should reasonably support?
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              That question does not prove Quiet Loss&trade; exists. It tells leadership whether there may be something worth investigating.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 6: Where it may appear ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>BEYOND THE SALE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Quiet Loss&trade; can appear across the enterprise.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              NexFrontier considers the possibility across five Enterprise Value dimensions:
            </p>
            <p style={{ fontSize: '1.0625rem', color: 'var(--nf-text-primary)', fontWeight: 500, marginBottom: 'var(--nf-space-4)' }}>
              Revenue &middot; Cost &middot; Capacity &middot; Customer Value &middot; Enterprise Capability
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              A value gap does not begin and end with Sales.
            </p>
            <Button to="/enterprise-value/value-translation-framework" variant="secondary">Explore Value Translation Framework&trade;</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 7: Leadership question ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE LEADERSHIP QUESTION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Not every gap deserves action.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Finding a possible value gap does not automatically tell the enterprise what to change. The cause may sit across people, process, capacity, customer experience, technology, product, investment or another part of the business.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Sometimes the evidence may show that intervention is not economically justified.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The first question is: Is this gap material enough to warrant attention?
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              If yes: What value could reasonably be protected or recovered?
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 8: Explore ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>EXPLORE THE POSSIBILITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              What could Quiet Loss&trade; mean for your business?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The NexFrontier Enterprise Value Calculator lets you use annual business figures and assumptions you choose to explore the possible scale of existing value gaps.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              It is a scenario tool. It does not confirm that the loss exists.
            </p>
            <Button to="/enterprise-value/calculator">Calculate My Quiet Loss&trade;</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 9: Evidence ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE EVIDENCE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Claims have to be earned.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Quiet Loss&trade; is an emerging NexFrontier construct. We are working with Foundation Customers to determine:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {['where value gaps can actually be observed', 'whether they are economically consequential', 'what can legitimately be attributed', 'what customers find useful', 'what NexFrontier can legitimately claim'].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              The evidence may confirm the hypothesis. It may narrow it. Or it may change it.
            </p>
            <Button to="/foundation-customers" variant="secondary">Explore Foundation Customers</Button>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 10: Perspective ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>NF PERSPECTIVE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              A lens, not a promise.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Quiet Loss&trade; does not imply that every missed opportunity is recoverable revenue. It does not assume every difference is material. And it does not assume every gap warrants intervention.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              The possibility raises the question. Evidence has to answer it.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 11: Closing question ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE QUESTION TO LEAVE WITH</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              What value might already be available to your enterprise, but difficult to see?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              Quiet Loss&trade; gives that possibility a name. NexFrontier is building the intelligence to determine whether the gap is real, whether it is material and what it could mean economically.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
              <Button to="/enterprise-value/calculator">Calculate My Quiet Loss&trade;</Button>
              <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap' }}>
                <TextLink to="/enterprise-value/adaptive-value">Explore Adaptive Value&trade;</TextLink>
                <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/enterprise-value/quiet-loss" />
    </>
  );
}
