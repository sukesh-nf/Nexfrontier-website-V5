import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button } from '@/components/ui/Button';
import { TopBreadcrumb } from '@/components/ui/ContextNavigation';
import { LeadershipPulseInvitation } from '@/components/ui/LeadershipPulseInvitation';

export const metadata = pageMetadata({
  path: '/intelligence',
  title: 'NexFrontier Intelligence | Enterprise Navigational Intelligence for AI-mediated markets',
  description: 'Enterprise Navigational Intelligence is the leadership intelligence NexFrontier is building for AI-mediated markets, grounded in Operational Observability and Strategic Visibility.',
});

const chainStages = [
  { name: 'Operational Observability', desc: 'Evidence of how the operating enterprise is actually behaving.' },
  { name: 'Strategic Visibility', desc: 'Visibility into the material relationship between enterprise reality and changing market reality.' },
  { name: 'Enterprise Navigational Intelligence', desc: 'Leadership interpretation of what matters, what it means and where to steer.' },
  { name: 'Enterprise Value', desc: 'Whether the consequence matters economically.' },
];

const eniOutcomes = [
  { label: 'SEE', heading: 'What has materially changed?', desc: 'Surface where enterprise reality and changing market reality may be diverging.' },
  { label: 'UNDERSTAND', heading: 'What does it mean for the enterprise?', desc: 'Interpret whether the change is material, what it may mean economically and what deserves a response.' },
  { label: 'NAVIGATE', heading: 'Where does leadership need to steer, wait or hold course?', desc: 'Determine where attention should go and what kind of response the evidence justifies.' },
];

const capabilityCycle = ['Recognise', 'Understand', 'Decide', 'Adapt', 'Learn'];

const calmContrasts = [
  { primary: 'Material change', secondary: 'not noise' },
  { primary: 'Structural change', secondary: 'not temporary movement' },
  { primary: 'Economic consequence', secondary: 'not immaterial signal' },
  { primary: 'Justified action', secondary: 'not unnecessary activity' },
];

const benefits = [
  { num: '1', label: 'EARLIER VISIBILITY', heading: 'See meaningful change sooner.', desc: 'Gain earlier visibility into where enterprise reality may be falling out of step with changing market reality.' },
  { num: '2', label: 'BETTER PRIORITISATION', heading: 'Know what deserves attention.', desc: 'Distinguish potentially material change from noise so leadership can focus time, capital and attention more deliberately.' },
  { num: '3', label: 'STRONGER ECONOMIC JUDGEMENT', heading: 'Understand what may matter economically.', desc: 'See where value may be exposed, left unrealised or becoming newly possible before assuming that every change requires a response.' },
  { num: '4', label: 'MORE CONFIDENT NAVIGATION', heading: 'Choose when to move, wait or hold course.', desc: 'Use evidence to support more deliberate decisions about where to act, where to investigate further and where no action may be justified.' },
];

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 80px)',
  paddingBottom: 'clamp(48px, 5.5vw, 80px)',
};

export default function IntelligencePage() {
  return (
    <>
      {/* ── Top breadcrumb ── */}
      <section style={{ paddingTop: 'var(--nf-space-4)' }}>
        <Container>
          <TopBreadcrumb path="/intelligence" />
        </Container>
      </section>

      {/* ── 1. HERO ── */}
      <section style={{
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        borderBottom: '1px solid var(--nf-border)',
      }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>INTELLIGENCE</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>
              Know what changed. Know what it means. Know where to steer.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              NexFrontier is building Enterprise Navigational Intelligence for leadership operating in AI-mediated markets.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
              The purpose is not to create more information. It is to help leadership understand where enterprise reality may be falling out of step with changing market reality, whether that gap matters economically, and where attention should go next.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="#intelligence-chain">SEE THE INTELLIGENCE CHAIN</Button>
              <Button to="/enterprise-value" variant="secondary">EXPLORE ENTERPRISE VALUE</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. THE INTELLIGENCE CHAIN ── */}
      <Section id="intelligence-chain" style={tightPad}>
        <Container wide>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>THE INTELLIGENCE CHAIN</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)' }}>
              Evidence becomes useful when it changes judgement.
            </h2>
          </div>
          <div className="nf-intel-chain">
            {chainStages.map((stage, i) => (
              <div key={stage.name} className={`nf-intel-chain-stage${i === 2 ? ' nf-intel-chain-stage--eni' : ''}${i === 3 ? ' nf-intel-chain-stage--ev' : ''}`}>
                <span className="nf-intel-chain-stage-num">0{i + 1}</span>
                <h3 className="nf-intel-chain-stage-name">{stage.name}</h3>
                <p className="nf-intel-chain-stage-desc">{stage.desc}</p>
                {i === 3 && (
                  <div className="nf-intel-chain-ev-tags">
                    <span className="nf-intel-chain-ev-tag">Quiet Loss&trade;</span>
                    <span className="nf-intel-chain-ev-tag">Adaptive Value&trade;</span>
                  </div>
                )}
                {i < 3 && <span className="nf-intel-chain-arrow" aria-hidden="true">&rarr;</span>}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 3. ENTERPRISE NAVIGATIONAL INTELLIGENCE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>ENTERPRISE NAVIGATIONAL INTELLIGENCE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Understand what changed, why it matters and where to steer.
            </h2>
            <p className="nf-me-body">
              Enterprise Navigational Intelligence helps leadership interpret the relationship between what is happening inside the enterprise and what is changing in the market around it.
            </p>
            <p className="nf-me-body">
              The purpose is to understand whether the enterprise is keeping pace, whether the direction of adaptation remains appropriate, and where any resulting gap may have economic consequence.
            </p>
          </div>
          <div className="nf-intel-eni-outcomes">
            {eniOutcomes.map((outcome) => (
              <div key={outcome.label} className="nf-intel-eni-outcome">
                <span className="nf-intel-eni-outcome-label">{outcome.label}</span>
                <h3 className="nf-intel-eni-outcome-heading">{outcome.heading}</h3>
                <p className="nf-intel-eni-outcome-desc">{outcome.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Leadership Pulse invitation ── */}
      <Section style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Container>
          <LeadershipPulseInvitation source="intelligence" />
        </Container>
      </Section>

      {/* ── 4. READINESS AND CAPABILITY ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>READINESS AND CAPABILITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Readiness is the state. Capability is the ability to keep earning it.
            </h2>
          </div>
          <div className="nf-intel-readiness-panels">
            <div className="nf-intel-readiness-panel">
              <h3 className="nf-intel-readiness-label">Operational Readiness</h3>
              <p className="nf-intel-readiness-desc">
                Operational Readiness is the evidenced state of how well the operating enterprise is aligned to what its current market requires.
              </p>
            </div>
            <div className="nf-intel-readiness-panel nf-intel-readiness-panel--capability">
              <h3 className="nf-intel-readiness-label">Enterprise Capability</h3>
              <p className="nf-intel-readiness-desc">
                Enterprise Capability is the ability to recognise material market change, understand its economic consequence, decide what deserves a response, adapt in ways that can be shown to create value, and learn.
              </p>
              <div className="nf-intel-capability-flow">
                {capabilityCycle.map((step, i) => (
                  <span key={step} className="nf-intel-capability-flow-wrap">
                    <span className="nf-intel-capability-flow-step">{step}</span>
                    {i < capabilityCycle.length - 1 && <span className="nf-intel-capability-flow-arrow" aria-hidden="true">&rarr;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5. KNOW FIRST. THEN ACT. ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>LEADERSHIP</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Know first. Then act.
            </h2>
            <p className="nf-me-body">
              Faster adaptation does not mean more activity. It means shortening the time between meaningful market change, leadership awareness and an economically justified response.
            </p>
          </div>
          <div className="nf-intel-leadership-panels">
            <div className="nf-intel-leadership-panel">
              <span className="nf-intel-leadership-panel-label">KNOW FIRST</span>
              <h3 className="nf-intel-leadership-panel-heading">Understand before committing.</h3>
              <p className="nf-intel-leadership-panel-body">What changed? Does it matter? Are we keeping pace? What is the economic consequence?</p>
            </div>
            <div className="nf-intel-leadership-panel">
              <span className="nf-intel-leadership-panel-label">THEN ACT</span>
              <h3 className="nf-intel-leadership-panel-heading">Respond when the evidence earns it.</h3>
              <p className="nf-intel-leadership-panel-body">Invest, wait, hold course or change direction according to what the evidence and economics justify.</p>
            </div>
          </div>
          <p className="nf-intel-leadership-close">
            Evidence sharpens the decision. Value tells us whether it mattered.
          </p>
        </Container>
      </Section>

      {/* ── 6. ENTERPRISE VALUE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>ENTERPRISE VALUE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              The final test is economic.
            </h2>
            <p className="nf-me-body">
              NexFrontier seeks to identify where enterprise value may be protected, left unrealised or made newly possible as markets change.
            </p>
          </div>
          <div className="nf-intel-ev-panels">
            <div className="nf-intel-ev-panel">
              <h3 className="nf-intel-ev-panel-title">Quiet Loss&trade;</h3>
              <p className="nf-intel-ev-panel-desc">
                Value that remains unrealised because the enterprise is not fully aligned to the market opportunity available to it.
              </p>
            </div>
            <div className="nf-intel-ev-panel">
              <h3 className="nf-intel-ev-panel-title">Adaptive Value&trade;</h3>
              <p className="nf-intel-ev-panel-desc">
                Additional value that may become possible when meaningful market change creates new opportunity and the enterprise adapts effectively.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <Button to="/enterprise-value">EXPLORE ENTERPRISE VALUE</Button>
          </div>
        </Container>
      </Section>

      {/* ── 7. BUILD CALM. EARN TRUST. ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>BUILD CALM. EARN TRUST.</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Faster markets need calmer leadership.
            </h2>
            <p className="nf-me-body">
              Enterprise Navigational Intelligence should reduce noise, not add to it.
            </p>
          </div>
          <div className="nf-intel-calm-contrasts">
            {calmContrasts.map((item) => (
              <div key={item.primary} className="nf-intel-calm-contrast">
                <span className="nf-intel-calm-contrast-primary">{item.primary}</span>
                <span className="nf-intel-calm-contrast-secondary">{item.secondary}</span>
              </div>
            ))}
          </div>
          <p className="nf-intel-calm-line">
            The advantage is not speed. It is knowing how fast to adapt.
          </p>
          <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
            Build Calm. Earn Trust.
          </p>
        </Container>
      </Section>

      {/* ── 8. WHAT LEADERSHIP MAY GAIN ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>WHAT LEADERSHIP MAY GAIN</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Earlier clarity. Better judgement. More deliberate action.
            </h2>
            <p className="nf-me-body">
              The value of Enterprise Navigational Intelligence is not simply knowing more. It is giving leadership a better basis for deciding what deserves attention, where economic consequence may be emerging, and when action is justified.
            </p>
          </div>
          <div className="nf-intel-benefits">
            {benefits.map((benefit) => (
              <div key={benefit.num} className="nf-intel-benefit">
                <span className="nf-intel-benefit-num">{benefit.num}</span>
                <span className="nf-intel-benefit-label">{benefit.label}</span>
                <h3 className="nf-intel-benefit-heading">{benefit.heading}</h3>
                <p className="nf-intel-benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 9. FOUNDATION CUSTOMER CTA ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-intel-fc-cta">
            <div className="nf-intel-fc-cta-copy">
              <Eyebrow>FOR LEADERS PREPARED TO MOVE EARLY</Eyebrow>
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
                See whether the value is real before committing further.
              </h2>
              <p className="nf-me-body">
                Foundation Customers gain early access to NexFrontier intelligence, early influence on what develops next, and a contained way to examine whether changing market conditions are creating an economically meaningful gap for their enterprise.
              </p>
              <p className="nf-me-body">
                The first step is deliberately limited. Evidence determines what happens next.
              </p>
              <p className="nf-intel-fc-cta-support">
                Move early. Commit when the evidence earns it.
              </p>
            </div>
            <div className="nf-intel-fc-cta-actions">
              <Button to="/foundation-customers">EXPLORE FOUNDATION CUSTOMERS</Button>
              <Button to="/market-enquiry?topic=leadership-conversation" variant="secondary">TALK TO NEXFRONTIER</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Bottom Context Navigation ── */}
      <section style={{ borderTop: '1px solid var(--nf-border)', paddingTop: '20px', paddingBottom: '20px' }}>
        <Container>
          <div className="nf-me-context-nav">
            <Link href="/the-shift" className="nf-me-context-nav-link">
              <ArrowLeft size={16} /> Back to The Shift
            </Link>
            <Link href="/intelligence/the-brain" className="nf-me-context-nav-link">
              Next: The Brain <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
