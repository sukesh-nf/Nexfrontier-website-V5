import Image from 'next/image';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { ArrowRight } from 'lucide-react';

export const metadata = pageMetadata({
  path: '/foundation-customers',
  title: 'Foundation Customers | NexFrontier',
  description: 'Foundation Customers are established businesses prepared to move early as markets change, without committing ahead of the evidence.',
});

const profileCards = [
  {
    headline: 'We make the first step contained.',
    supporting: 'A defined investigation before a larger commitment.',
  },
  {
    headline: 'You gain intelligence and influence.',
    supporting: 'See the emerging picture earlier and help shape what NexFrontier builds around real leadership needs.',
  },
  {
    headline: 'Evidence tells us whether it matters.',
    supporting: 'Not every gap is economically material and not every change deserves a response.',
  },
  {
    headline: 'Only then do you commit further.',
    supporting: 'Paid validation follows only when the evidence earns the next decision.',
  },
];

const gainCards = [
  {
    label: 'SEE THE GAP EARLIER',
    desc: 'See where enterprise reality may be falling out of step with changing market reality before the consequence becomes more expensive, more visible or harder to reverse.',
  },
  {
    label: 'KNOW WHAT IS WORTH ATTENTION',
    desc: 'Distinguish an interesting change from an economically material one, so leadership can decide what deserves action, what can wait and what should be ignored.',
  },
  {
    label: 'SEE WHERE VALUE MAY MOVE',
    desc: 'Identify where enterprise value may already be unrealised, and where changing market conditions may create new opportunity worth investigating.',
  },
  {
    label: 'SHAPE WHAT COMES NEXT',
    desc: 'Gain early influence on NexFrontier capability development, priority access to future intelligence, and preferential Foundation Customer commercial terms as the platform develops.',
  },
];

const progressionStages = [
  {
    title: 'Foundation Customer Validation',
    desc: 'Establish whether the problem, interpretation and potential economic significance resonate with a real business and are supported by real operating evidence.',
  },
  {
    title: 'Paid Beta Validation',
    desc: 'Establish whether the evidence is strong enough for the customer to pay to continue solving the problem.',
  },
  {
    title: 'Repeatable Proof',
    desc: 'Establish whether measurable value can be demonstrated consistently across customers, rather than only within one engagement.',
  },
];

const partnershipStages = [
  {
    num: '01',
    label: 'START CONTAINED',
    desc: 'Structured discovery with leadership and agreed business stakeholders.',
    desc2: 'Access is limited to agreed operating evidence and relevant data sources.',
  },
  {
    num: '02',
    label: 'EXAMINE TOGETHER',
    desc: 'Jointly examine where enterprise reality and changing market reality may be diverging.',
    desc2: 'Review findings, interpretation and potential economic consequence together.',
  },
  {
    num: '03',
    label: 'DECIDE ON EVIDENCE',
    desc: 'Determine whether the evidence supports further investigation, a paid validation step, or no further action.',
    desc2: 'No automatic progression. No obligation to continue.',
  },
];

const proofStages = [
  { num: '01', label: 'Assumption', desc: 'What we currently believe.' },
  { num: '02', label: 'Hypothesis', desc: 'A specific proposition that can be tested.' },
  { num: '03', label: 'Evidence', desc: 'What real operating and market evidence supports, weakens or contradicts.' },
  { num: '04', label: 'Customer Validation', desc: 'Whether the problem, interpretation and potential value resonate with real businesses.' },
  { num: '05', label: 'Paid Validation', desc: 'Whether a customer will pay to continue solving a problem already supported by evidence.' },
  { num: '06', label: 'Repeatable Proof', desc: 'Whether measurable value can be demonstrated consistently across customers.' },
];

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 80px)',
  paddingBottom: 'clamp(48px, 5.5vw, 80px)',
};

export default function FoundationCustomersPage() {
  return (
    <>
      {/* ── Top breadcrumb ── */}
      <section style={{ paddingTop: 'var(--nf-space-4)' }}>
        <Container>
          <TopBreadcrumb path="/foundation-customers" />
        </Container>
      </section>

      {/* ── 1. HERO ── */}
      <section style={{
        paddingTop: 'var(--nf-space-6)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        borderBottom: '1px solid var(--nf-border)',
      }}>
        <Container>
          <div className="nf-hero-split nf-hero-split--shift">
            <div className="nf-me-content nf-hero-split-copy">
              <Eyebrow>FOUNDATION CUSTOMERS</Eyebrow>
              <h1 style={{
                fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
                fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}>
                Lead the shift. Shape what comes next.
              </h1>
              <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: 0 }}>
                Foundation Customers are established businesses prepared to move early as markets change, without committing ahead of the evidence.
              </p>
              <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
                The opportunity is to understand sooner where enterprise reality may be falling out of step with changing market reality, what that could mean economically, and whether there is a reason to act before the gap becomes more consequential.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
                Foundation Customers gain early intelligence, early influence, priority access and preferential commercial terms as NexFrontier develops.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', marginTop: 'var(--nf-space-4)' }}>
                In this partnership, real operating context and evidence help shape the intelligence businesses may increasingly need to compete, adapt and create value in AI-mediated markets.
              </p>
            </div>
            <div className="nf-hero-split-visual">
              <Image
                src="/assets/images/neon_market_value_gap_chart.png"
                alt="Chart showing the market changing faster than the enterprise, creating a widening value gap over time."
                width={1448}
                height={1086}
                sizes="(max-width: 900px) 100vw, 48vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. YOUR ASYMMETRIC OPPORTUNITY ── */}
      <Section style={tightPad}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>YOUR ASYMMETRIC OPPORTUNITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Know earlier. Commit later.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-cyan)', fontWeight: 500, margin: '0 0 var(--nf-space-5)' }}>
              The asymmetry is simple: the first commitment is contained, but what leadership may learn could be materially more valuable.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              A Foundation Customer can establish earlier whether the enterprise is falling out of step with a changing market, where that gap may be economically material, and whether changing conditions are creating value the business is not yet positioned to capture.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-3)' }}>
              That can create a stronger basis for deciding whether to move, wait, hold course, reallocate or investigate further.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-3)' }}>
              If the evidence does not justify further action, the engagement stops there. If it does, the business has learned earlier and can decide what that advantage is worth.
            </p>
            <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)' }}>
              The cost of learning early is contained. The cost of learning late may not be.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/enterprise-value/value-translation-framework" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>
                YOUR ASYMMETRIC OPPORTUNITY <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. WHAT FOUNDATION CUSTOMERS GAIN ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>WHAT FOUNDATION CUSTOMERS GAIN</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)' }}>
              Earlier intelligence. Better choices. Preferential access.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: '0 0 var(--nf-space-3)' }}>
              Moving early should create an advantage, not simply create more work.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              The Foundation Customer partnership is designed to give leadership earlier evidence of where the enterprise may be falling out of step with its market, what may matter economically, and whether acting earlier could create or protect value.
            </p>
          </div>
          <div className="nf-fc-gain-cards">
            {gainCards.map((card) => (
              <div key={card.label} className="nf-fc-gain-card">
                <h3 className="nf-fc-gain-card-label">{card.label}</h3>
                <p className="nf-fc-gain-card-desc">{card.desc}</p>
              </div>
            ))}
          </div>
          <p className="nf-pull" style={{ marginTop: 'var(--nf-space-6)', maxWidth: '820px' }}>
            The advantage is not simply knowing more. It is having better evidence, earlier, when there is still time to choose what to do with it.
          </p>
          <div className="nf-fc-gain-cta-row">
            <Button to="/enterprise-value/value-translation-framework">
              YOUR ASYMMETRIC OPPORTUNITY <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
            </Button>
            <TextLink to="/hyper-accelerating-markets#market-signals" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>
              SEE THE MARKET EVIDENCE <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
            </TextLink>
          </div>
        </Container>
      </Section>

      {/* ── 4. FOUNDATION CUSTOMER PROFILE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>FOUNDATION CUSTOMER PROFILE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)' }}>
              Early because that is how you lead.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: '0 0 var(--nf-space-5)' }}>
              You are prepared to move before the market has fully settled, but not without discipline.
            </p>
          </div>
          <div className="nf-fc-profile-cards">
            {profileCards.map((card) => (
              <div key={card.headline} className="nf-fc-profile-card">
                <h3 className="nf-fc-profile-card-headline">{card.headline}</h3>
                <p className="nf-fc-profile-card-supporting">{card.supporting}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 5. THE PROGRESSION ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>THE PROGRESSION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Discovery &rarr; Foundation Customer &rarr; Evidence &rarr; Paid Beta decision
            </h2>
          </div>
          <div className="nf-fc-pathway-wrap">
            <Image
              src="/assets/images/FC_to_PB_Pathway_website_Aug26.png"
              alt="Foundation Customer to Paid Beta Proof Pathway showing Qualify, Observe, Reveal, Paid Beta Decision and Paid Beta stages as confidence increases."
              width={1448}
              height={1086}
              sizes="100vw"
              style={{ width: '100%', height: 'auto', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
          <div className="nf-fc-progression-h">
            {progressionStages.map((stage, i) => (
              <div key={stage.title} className="nf-fc-progression-h-item">
                <h3 className="nf-fc-progression-h-label">{stage.title}</h3>
                <p className="nf-fc-progression-h-desc">{stage.desc}</p>
                {i < progressionStages.length - 1 && <ArrowRight size={20} className="nf-fc-progression-h-arrow" />}
              </div>
            ))}
          </div>
          <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)', maxWidth: '760px' }}>
            The objective is not progression for its own sake. Every stage has to earn the next.
          </p>
        </Container>
      </Section>

      {/* ── 6. THE PARTNERSHIP ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>THE PARTNERSHIP</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)' }}>
              Contained first. Evidence next. Commitment only when it earns it.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              A Foundation Customer partnership is structured to learn quickly without asking either side to make a large commitment before the evidence exists.
            </p>
          </div>
          <div className="nf-fc-partnership-stages">
            {partnershipStages.map((stage) => (
              <div key={stage.num} className="nf-fc-partnership-stage">
                <span className="nf-fc-partnership-num">{stage.num}</span>
                <h3 className="nf-fc-partnership-label">{stage.label}</h3>
                <p className="nf-fc-partnership-desc">{stage.desc}</p>
                <p className="nf-fc-partnership-desc">{stage.desc2}</p>
              </div>
            ))}
          </div>
          <div className="nf-fc-guardrail-strip">
            <span className="nf-fc-guardrail-label">Guardrail</span>
            <span className="nf-fc-guardrail-text">Participation is structured, time-bound and agreed in advance. It is not open-ended consulting or unlimited access to the enterprise.</span>
          </div>
        </Container>
      </Section>

      {/* ── 7. HOW CONFIDENCE IS EARNED ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>HOW CONFIDENCE IS EARNED</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)' }}>
              From belief to repeatable proof.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: '0 0 var(--nf-space-5)' }}>
              NexFrontier does not ask leadership to believe the whole thesis in advance. Each stage earns the confidence required for the next.
            </p>
          </div>
          <div className="nf-fc-proof">
            {proofStages.map((stage, i) => (
              <div key={stage.num} className="nf-fc-proof-cell">
                <span className="nf-fc-proof-num">{stage.num}</span>
                <h3 className="nf-fc-proof-label">{stage.label}</h3>
                <p className="nf-fc-proof-desc">{stage.desc}</p>
                {i < proofStages.length - 1 && <ArrowRight size={16} className="nf-fc-proof-arrow" />}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 8. EVIDENCE DISCIPLINE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>EVIDENCE DISCIPLINE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)' }}>
              The evidence can disagree with us.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              NexFrontier begins with hypotheses. Real operating evidence may confirm them, narrow them, reveal different priorities, or show that something we expected to matter does not.
            </p>
            <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)' }}>
              We would rather learn that part of the thesis is wrong now than build the wrong product around it later.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
              The same discipline applies to the market thesis. External research can establish that the environment is changing. Foundation Customer evidence determines where that change becomes economically meaningful for a real enterprise.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/hyper-accelerating-markets#market-signals" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>
                SEE THE MARKET EVIDENCE <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 9. APPLY TO BECOME A FOUNDATION CUSTOMER ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-fc-apply">
            <div className="nf-fc-apply-copy">
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: '0 0 var(--nf-space-4)' }}>
                Apply to become a Foundation Customer.
              </h2>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', margin: 0 }}>
                Foundation Customer places are deliberately limited. We are looking for established businesses where the market shift is economically relevant, leadership is engaged and there is enough operating evidence to investigate whether a meaningful value gap exists.
              </p>
            </div>
            <div className="nf-fc-apply-cta">
              <Button to="/market-enquiry?type=foundation-customer">
                APPLY TO BECOME A FOUNDATION CUSTOMER <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/foundation-customers" />
    </>
  );
}
