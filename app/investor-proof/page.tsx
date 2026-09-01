import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { ArrowRight, Lock } from 'lucide-react';
import Image from 'next/image';
import { InvestorBriefRequestForm } from '@/components/InvestorBriefRequestForm';
import { PreDDNav } from '@/components/ui/PreDDNav';

export const metadata = pageMetadata({
  path: '/investor-proof',
  title: 'Investors | NexFrontier',
  description: 'Explore NexFrontier\'s thesis, current validation stage and emerging opportunity to build intelligence connecting AI-mediated market change with enterprise value.',
});

const tightPad = {
  paddingTop: 'clamp(36px, 4vw, 60px)',
  paddingBottom: 'clamp(36px, 4vw, 60px)',
};

const h2Style: React.CSSProperties = {
  fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15,
  color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)',
  letterSpacing: '-0.025em',
};

const bodyStyle: React.CSSProperties = {
  fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
  color: 'var(--nf-text-secondary)', margin: 0,
};

const preddNavItems = [
  { num: '01', label: 'WHY NOW?', sub: 'AI may be changing how markets change', anchor: 'why-now' },
  { num: '02', label: 'WHAT ARE WE BUILDING?', sub: 'Enterprise Navigational Intelligence', anchor: 'building' },
  { num: '03', label: 'WHERE IS THE VALUE?', sub: 'Alignment + Enterprise Value + whitespace', anchor: 'value' },
  { num: '04', label: 'HOW WILL WE PROVE IT?', sub: 'Evidence → paid validation → repeatability', anchor: 'proof' },
  { num: '05', label: 'CAN THIS BECOME VENTURE-SCALE?', sub: 'Market + economics + defensibility + capital', anchor: 'scale' },
];

const marketParticipants = [
  { label: 'CUSTOMER AI', desc: 'changes discovery, evaluation, expectations and choice' },
  { label: 'COMPETITOR AI', desc: 'changes speed, capability and competitive response' },
  { label: 'SUPPLIER AI', desc: 'changes cost, capacity and what becomes possible upstream' },
  { label: 'PLATFORM AI', desc: 'changes how markets are mediated' },
  { label: 'ENTERPRISE AI', desc: 'changes how quickly organisations themselves can act' },
];

const dimensions = [
  { label: 'MAGNITUDE', desc: 'How consequential market shifts can become' },
  { label: 'RATE', desc: 'How quickly market participants react' },
  { label: 'STATE', desc: 'How rapidly the market moves from one condition to another' },
];

const valueLenses = ['Defensive Value', 'Offensive Value', 'Revenue Health', 'Customer Lifetime Value', 'Enterprise Capability'];

const adjacencies = [
  { label: 'CRM', desc: 'Customer and revenue activity' },
  { label: 'BI', desc: 'Enterprise performance' },
  { label: 'Market intelligence', desc: 'External market information' },
  { label: 'AI transformation', desc: 'Internal capability' },
];

const proofStages = [
  { label: 'Market Thesis', value: 'External evidence accumulating' },
  { label: 'Leadership Problem', value: 'Being tested through leadership conversations and Leadership Pulse' },
  { label: 'Product', value: 'MVP in development' },
  { label: 'Customer Validation', value: 'Preparing for Foundation Customer validation' },
  { label: 'Paid Validation', value: 'Next evidence threshold' },
  { label: 'Repeatability', value: 'Not yet claimed' },
];

const defensibilityClusters = [
  { label: 'EVIDENCE', items: ['Accumulated enterprise evidence', 'Enterprise context'] },
  { label: 'LEARNING', items: ['Longitudinal market-enterprise understanding', 'Repeated decisions and outcomes', 'Learning across customers and markets'] },
  { label: 'REPEATABILITY', items: ['Economic interpretation', 'Repeatable intelligence models'] },
];

const capitalItems = [
  { label: 'PRODUCT', desc: 'Complete + harden MVP', outcome: 'Evidence-ready product' },
  { label: 'CUSTOMER PROOF', desc: 'Activate Foundation Customers + paid Beta', outcome: 'Customer + paid validation' },
  { label: 'COMMERCIAL CAPABILITY', desc: 'Build repeatable customer acquisition', outcome: 'GTM evidence' },
  { label: 'OPERATING READINESS', desc: 'People + security + legal + data', outcome: 'Enterprise readiness' },
  { label: 'MARKET DEVELOPMENT', desc: 'Establish APAC market entry', outcome: 'Scaling evidence' },
];

const teamLines = [
  { label: 'FOUNDER', value: 'Sukesh Sukumaran, Founder & CEO' },
  { label: 'TECHNICAL LEADERSHIP', value: 'Nela Muttettuwegama, Head of Systems & Intelligence' },
  { label: 'STARTING FOOTPRINT', value: 'Malaysia hub + New Zealand satellite' },
  { label: 'FOUNDER COMMITMENT', value: 'Founder-funded through early development' },
];

function Implication({ children }: { children: React.ReactNode }) {
  return (
    <div className="nf-inv-implication">
      <div className="nf-inv-implication-eyebrow">INVESTOR IMPLICATION</div>
      <p className="nf-inv-implication-statement">{children}</p>
    </div>
  );
}

export default function InvestorPage() {
  return (
    <>
      {/* Breadcrumb */}
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/investor-proof" />
        </Container>
      </Section>

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 'var(--nf-space-6)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        borderBottom: '1px solid var(--nf-border)',
      }}>
        <Container>
          <div style={{ maxWidth: '820px' }}>
            <Eyebrow>INVESTORS</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>
              Enterprise Navigational Intelligence for AI-mediated markets.
            </h1>
            <p style={{
              fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
              color: 'var(--nf-text-secondary)', margin: 0,
            }}>
              NexFrontier is developing Enterprise Navigational Intelligence to help business leaders keep pace with rapidly changing AI-mediated markets.
            </p>
            <p style={{
              fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
              color: 'var(--nf-cyan)', fontWeight: 500, marginTop: 'var(--nf-space-4)',
            }}>
              The market is not just changing. AI may be changing how the market is changing.
            </p>
            <p style={{
              fontSize: '0.9375rem', lineHeight: 1.5, fontWeight: 500,
              color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)',
              maxWidth: '760px',
            }}>
              The investment opportunity is to test that thesis while the market requirement and category are still taking shape.
            </p>
            <p style={{
              fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-text-tertiary)',
              letterSpacing: '0.04em', marginTop: 'var(--nf-space-3)',
            }}>
              Pre-revenue | MVP build | Foundation Customer pathway
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="/investor-proof#request-investor-brief">REQUEST INVESTOR BRIEF <ArrowRight size={16} /></Button>
              <TextLink to="/market-enquiry?topic=investor-conversation">TALK TO NEXFRONTIER</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── PRE-DD NAVIGATION INDEX ── */}
      <Section style={{ paddingTop: 'clamp(36px, 4vw, 60px)', paddingBottom: 'clamp(28px, 3vw, 40px)' }}>
        <Container>
          <div style={{ maxWidth: '760px', marginBottom: 'var(--nf-space-4)' }}>
            <Eyebrow>PRE-DD</Eyebrow>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', margin: 'var(--nf-space-3) 0 0' }}>
              Five questions to understand the NexFrontier investment thesis.
            </p>
          </div>
          <div id="predd-dashboard" className="nf-predd-dashboard">
            {preddNavItems.map((item) => (
              <a key={item.anchor} href={`#${item.anchor}`} className="nf-predd-dashboard-item">
                <span className="nf-predd-dashboard-num">{item.num}</span>
                <span className="nf-predd-dashboard-label">{item.label}</span>
                <span className="nf-predd-dashboard-sub">{item.sub}</span>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      <PreDDNav />

      {/* ── PRE-DD 01: WHY NOW? ── */}
      <Section id="why-now" style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
         <div className="nf-predd01" style={{ paddingTop: 'clamp(48px, 5vw, 64px)' }}>
          {/* BLOCK 1 — Section intro */}
          <div className="nf-predd01-intro">
            <div className="nf-predd01-eyebrow">
              <span className="nf-predd01-eyebrow-cyan">PRE-DD 01 /</span>{' '}
              <span className="nf-predd01-eyebrow-mute">WHY NOW?</span>
            </div>
            <h2 className="nf-predd01-headline">AI may be changing how markets change.</h2>
            <p className="nf-predd01-support">
              AI is increasing capability across multiple participants in the market at the same time.
            </p>
            <div className="nf-predd01-participant-strip">
              {marketParticipants.map((p, i) => (
                <span key={p.label} className="nf-predd01-chip">
                  {p.label}
                  {i < marketParticipants.length - 1 && <span className="nf-predd01-chip-dot" aria-hidden="true"> &middot; </span>}
                </span>
              ))}
            </div>
            <p className="nf-predd01-participant-note">
              All are increasing speed, capability, expectations and responsiveness across the market.
            </p>
          </div>

          {/* BLOCK 2 — Main argument row */}
          <div className="nf-predd01-argument">
            <div className="nf-predd01-argument-visual">
              <Image
                src="/assets/images/neon_market_value_gap_chart.png"
                alt="Chart showing the widening value gap between enterprise reality and changing market reality over time."
                width={1448}
                height={1086}
                sizes="(max-width: 900px) 100vw, 58vw"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
              <p className="nf-predd01-caption">
                As market reality changes, the gap between market opportunity and enterprise reality can widen.
              </p>
            </div>
            <div className="nf-predd01-argument-messages">
              <div className="nf-predd01-msg">
                <div className="nf-predd01-msg-label">WHAT THIS MEANS</div>
                <p className="nf-predd01-msg-body">The issue is not only that markets are changing. It is that AI may be increasing the pace, pressure and pattern of change across the market itself.</p>
              </div>
              <div className="nf-predd01-msg">
                <div className="nf-predd01-msg-label">WHY THE GAP MATTERS</div>
                <p className="nf-predd01-msg-body">If the enterprise adapts more slowly than the market around it, value can remain unrealised even while normal performance indicators still look healthy.</p>
              </div>
              <div className="nf-predd01-msg nf-predd01-msg--emphasis">
                <div className="nf-predd01-msg-label">THE PERFORMANCE PARADOX</div>
                <p className="nf-predd01-msg-body-strong">A business can hit revenue targets, maintain margin, improve productivity and still become less aligned with the market opportunity available to it.</p>
              </div>
            </div>
          </div>

          {/* BLOCK 3 — Impact statement */}
          <div className="nf-predd01-impact">
            <div className="nf-predd01-impact-eyebrow">IMPACT</div>
            <p className="nf-predd01-impact-statement">
              Keeping pace is becoming a leadership problem.
            </p>
          </div>

          {/* BLOCK 4 — Leadership explanation + question */}
          <div className="nf-predd01-leadership">
            <div className="nf-predd01-leadership-col">
              <div className="nf-predd01-msg-label">LEADERSHIP CONSEQUENCE</div>
              <p className="nf-predd01-leadership-body">
                The concern is not simply whether the enterprise is adopting AI quickly enough. It is whether the market around the enterprise may be changing faster than leadership can recognise, understand and adapt to it.
              </p>
            </div>
            <div className="nf-predd01-leadership-col">
              <div className="nf-predd01-msg-label">THE QUESTION</div>
              <p className="nf-predd01-question">
                How does leadership know whether the enterprise is adapting at the rate and in the direction its market now requires?
              </p>
            </div>
          </div>

          {/* BLOCK 5 — Investor implication + CTA */}
          <div className="nf-predd01-implication">
            <div className="nf-predd01-implication-eyebrow">INVESTOR IMPLICATION</div>
            <p className="nf-predd01-implication-statement">
              If AI changes how markets change, enterprise navigation becomes a persistent leadership requirement rather than an occasional strategy exercise.
            </p>
          </div>

          <div style={{ marginTop: '28px' }}>
            <Button to="/the-shift">EXPLORE THE SHIFT</Button>
          </div>
         </div>
        </Container>
      </Section>

      {/* ── PRE-DD 02: WHAT ARE WE BUILDING? ── */}
      <Section id="building" style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
         <div className="nf-predd02">
          {/* BLOCK 1 — Section intro */}
          <div className="nf-predd02-intro">
            <div className="nf-predd02-eyebrow">
              <span className="nf-predd02-eyebrow-cyan">PRE-DD 02 /</span>{' '}
              <span className="nf-predd02-eyebrow-mute">WHAT ARE WE BUILDING?</span>
            </div>
            <h2 className="nf-predd02-headline">Enterprise Navigational Intelligence for AI-mediated markets.</h2>
            <p className="nf-predd02-support">
              NexFrontier is developing Enterprise Navigational Intelligence that helps business leaders see what is changing, understand what it means, and navigate where to adapt, invest or hold course.
            </p>
          </div>

          {/* BLOCK 2 — Main argument row */}
          <div className="nf-predd02-argument">
            <div className="nf-predd02-argument-visual">
              <Image
                src="/enterprise_navigational_intelligence_cycle.webp"
                alt="Enterprise Navigational Intelligence cycle: a continuous loop of seeing, understanding and navigating."
                width={1200}
                height={1200}
                sizes="(max-width: 900px) 100vw, 58vw"
                style={{ width: '100%', height: 'auto', borderRadius: '16px', display: 'block', border: '1px solid rgba(255,255,255,0.06)' }}
              />
              <p className="nf-predd02-caption">
                Enterprise Navigational Intelligence is a continuous cycle of seeing, understanding and navigating as markets and enterprises keep changing.
              </p>
            </div>
            <div className="nf-predd02-argument-messages">
              <div className="nf-predd02-msg">
                <div className="nf-predd02-msg-label">WHAT IT IS</div>
                <p className="nf-predd02-msg-body">Enterprise Navigational Intelligence is not static reporting. It is a decision-support layer that helps leadership continuously interpret changing market reality in relation to enterprise reality.</p>
              </div>
              <div className="nf-predd02-msg">
                <div className="nf-predd02-msg-label">HOW IT WORKS</div>
                <p className="nf-predd02-msg-body">The cycle is simple: see what is changing, understand what that change means, and navigate where to adapt, invest or hold course. Once action is taken, the cycle begins again.</p>
              </div>
              <div className="nf-predd02-msg">
                <div className="nf-predd02-msg-label">WHY IT MATTERS</div>
                <p className="nf-predd02-msg-body">If markets are changing continuously, navigation cannot be episodic. The intelligence requirement becomes ongoing, not occasional.</p>
              </div>
            </div>
          </div>

          {/* BLOCK 3 — Impact statement */}
          <div className="nf-predd02-impact">
            <div className="nf-predd02-impact-eyebrow">IMPACT</div>
            <p className="nf-predd02-impact-statement">
              Continuous navigation is becoming a leadership requirement.
            </p>
          </div>

          {/* BLOCK 4 — Lower supporting row */}
          <div className="nf-predd02-support-row">
            <div className="nf-predd02-support-col">
              <div className="nf-predd02-msg-label">CURRENT STAGE</div>
              <p className="nf-predd02-support-body">MVP build &rarr; Foundation Customer validation &rarr; Paid Beta</p>
              <p className="nf-predd02-support-note">The current stage is about turning the intelligence model into operating evidence.</p>
            </div>
            <div className="nf-predd02-support-col">
              <div className="nf-predd02-msg-label">WHY THE LOOP MATTERS</div>
              <p className="nf-predd02-support-body nf-predd02-support-body--secondary">Each cycle can create new evidence. Leadership can see what changed, understand the consequence, navigate a response, and learn from what happened next.</p>
            </div>
          </div>

          {/* BLOCK 5 — Investor implication + CTA */}
          <div className="nf-predd02-implication">
            <div className="nf-predd02-implication-eyebrow">INVESTOR IMPLICATION</div>
            <p className="nf-predd02-implication-statement">
              If leadership needs continuous navigation, Enterprise Navigational Intelligence has the potential to become a recurring intelligence requirement rather than a one-off advisory intervention.
            </p>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button to="/intelligence">EXPLORE INTELLIGENCE</Button>
          </div>
         </div>
        </Container>
      </Section>

      {/* ── PRE-DD 03: WHERE IS THE VALUE? ── */}
      <Section id="value" style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
         <div className="nf-predd03">
          {/* BLOCK 1 — Section intro */}
          <div className="nf-predd03-intro">
            <div className="nf-predd03-eyebrow">
              <span className="nf-predd03-eyebrow-cyan">PRE-DD 03 /</span>{' '}
              <span className="nf-predd03-eyebrow-mute">WHERE IS THE VALUE?</span>
            </div>
            <h2 className="nf-predd03-headline">The opportunity is economically meaningful alignment, not more insight.</h2>
            <p className="nf-predd03-support">
              NexFrontier&rsquo;s value thesis is that the relationship between changing market reality and enterprise reality can have measurable economic consequences.
            </p>
            <p className="nf-predd03-support-sub">
              The question is whether leadership can see that relationship early enough to act on it.
            </p>
          </div>

          {/* BLOCK 2 — Main argument row */}
          <div className="nf-predd03-argument">
            <div className="nf-predd03-argument-visual">
              {/* Two equal inputs */}
              <div className="nf-predd03-av-top">
                <div className="nf-predd03-av-input">
                  <span className="nf-predd03-av-input-label">MARKET REALITY</span>
                  <span className="nf-predd03-av-input-desc">Changing opportunity</span>
                  <span className="nf-predd03-av-input-rule" />
                </div>
                <div className="nf-predd03-av-input">
                  <span className="nf-predd03-av-input-label">ENTERPRISE REALITY</span>
                  <span className="nf-predd03-av-input-desc">Operating reality</span>
                  <span className="nf-predd03-av-input-rule" />
                </div>
              </div>
              {/* Convergence lines */}
              <div className="nf-predd03-av-converge" aria-hidden="true">
                <svg viewBox="0 0 300 50" width="100%" height="50" preserveAspectRatio="none">
                  <line x1="75" y1="0" x2="150" y2="46" stroke="rgba(0,200,255,0.18)" strokeWidth="1" />
                  <line x1="225" y1="0" x2="150" y2="46" stroke="rgba(0,200,255,0.18)" strokeWidth="1" />
                </svg>
              </div>
              {/* Economic Alignment focal zone */}
              <div className="nf-predd03-av-focus">
                <span className="nf-predd03-av-focus-label">ECONOMIC ALIGNMENT</span>
                <span className="nf-predd03-av-focus-desc">Where market opportunity and enterprise reality meet</span>
                <span className="nf-predd03-av-focus-sub">Alignment / Value Gap</span>
              </div>
              {/* Downward progression */}
              <div className="nf-predd03-av-down" aria-hidden="true">
                <svg viewBox="0 0 20 36" width="20" height="36"><line x1="10" y1="0" x2="10" y2="26" stroke="rgba(0,200,255,0.3)" strokeWidth="1.5" /><path d="M 4 24 L 10 32 L 16 24" fill="none" stroke="rgba(0,200,255,0.3)" strokeWidth="1.5" /></svg>
              </div>
              {/* Enterprise Value destination */}
              <div className="nf-predd03-av-result">
                <span className="nf-predd03-av-result-label">ENTERPRISE VALUE</span>
                <span className="nf-predd03-av-result-desc">Created &middot; Protected &middot; Left Unrealised &middot; Newly Possible</span>
              </div>
            </div>
            <div className="nf-predd03-argument-messages">
              <div className="nf-predd03-msg">
                <div className="nf-predd03-msg-label">WHAT WE ARE COMPARING</div>
                <p className="nf-predd03-msg-body">What the market now makes possible against how the enterprise is currently positioned to respond.</p>
              </div>
              <div className="nf-predd03-msg">
                <div className="nf-predd03-msg-label">WHERE VALUE EMERGES</div>
                <p className="nf-predd03-msg-body">When enterprise reality remains aligned with economically meaningful market change, leadership can be better positioned to create, protect and compound value.</p>
              </div>
              <div className="nf-predd03-msg">
                <div className="nf-predd03-msg-label">WHERE VALUE CAN BE MISSED</div>
                <p className="nf-predd03-msg-body-strong">When alignment weakens, economically available value can remain unrealised even while conventional business performance still appears healthy.</p>
              </div>
            </div>
          </div>

          {/* BLOCK 3 — Impact statement */}
          <div className="nf-predd03-impact">
            <div className="nf-predd03-impact-eyebrow">IMPACT</div>
            <p className="nf-predd03-impact-statement">
              Misalignment can have an economic consequence: a Value Gap.
            </p>
          </div>

          {/* BLOCK 4 — Enterprise Value expression */}
          <div className="nf-predd03-ev">
            <div className="nf-predd03-ev-eyebrow">ENTERPRISE VALUE</div>
            <h3 className="nf-predd03-ev-headline">Alignment can create value. Misalignment can leave value unrealised.</h3>
            <div className="nf-predd03-ev-pair">
              <div className="nf-predd03-ev-side nf-predd03-ev-side--left">
                <h4 className="nf-predd03-ev-title nf-predd03-ev-title--cyan">Adaptive Value&trade;</h4>
                <p className="nf-predd03-ev-subhead">Value made newly possible</p>
                <p className="nf-predd03-ev-body">Additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.</p>
              </div>
              <div className="nf-predd03-ev-divider" aria-hidden="true" />
              <div className="nf-predd03-ev-side">
                <h4 className="nf-predd03-ev-title">Quiet Loss&trade;</h4>
                <p className="nf-predd03-ev-subhead">Value available but unrealised</p>
                <p className="nf-predd03-ev-body">Enterprise value that remains unrealised because the enterprise is not fully aligned with the market opportunity available to it.</p>
              </div>
            </div>
            <div className="nf-predd03-ev-equation">
              <span>Enterprise Value =</span> <span className="nf-predd03-ev-cyan">Adaptive Value&trade;</span> <span className="nf-predd03-ev-plus">+</span> <span className="nf-predd03-ev-cyan">Quiet Loss&trade;</span>
            </div>
          </div>

          {/* BLOCK 4b — Five value lenses */}
          <div className="nf-predd03-lenses-section">
            <div className="nf-predd03-lenses-eyebrow">VALUE IS INTERPRETED THROUGH FIVE LENSES</div>
            <div className="nf-predd03-lenses">
              <div className="nf-predd03-lens">
                <span className="nf-predd03-lens-label">DEFENSIVE VALUE</span>
                <span className="nf-predd03-lens-desc">Protect what already exists</span>
              </div>
              <div className="nf-predd03-lens">
                <span className="nf-predd03-lens-label">OFFENSIVE VALUE</span>
                <span className="nf-predd03-lens-desc">Capture new opportunity</span>
              </div>
              <div className="nf-predd03-lens">
                <span className="nf-predd03-lens-label">REVENUE HEALTH</span>
                <span className="nf-predd03-lens-desc">Strengthen economic performance</span>
              </div>
              <div className="nf-predd03-lens">
                <span className="nf-predd03-lens-label">CUSTOMER LIFETIME VALUE</span>
                <span className="nf-predd03-lens-desc">Improve value across the relationship</span>
              </div>
              <div className="nf-predd03-lens">
                <span className="nf-predd03-lens-label">ENTERPRISE CAPABILITY</span>
                <span className="nf-predd03-lens-desc">Increase the ability to keep adapting</span>
              </div>
            </div>
          </div>

          {/* BLOCK 5 — Whitespace */}
          <div className="nf-predd03-ws">
            <div className="nf-predd03-ws-eyebrow">THE WHITESPACE NEXFRONTIER SEEKS TO CLAIM</div>
            <h3 className="nf-predd03-ws-headline">Businesses have signals. The missing layer may be navigation.</h3>
            <p className="nf-predd03-ws-intro">
              Businesses already have systems that describe customers, performance, markets and internal capability. NexFrontier seeks to turn those signals into intelligence about market-enterprise alignment and economic value.
            </p>

            {/* Layer 1 — What already exists */}
            <div className="nf-predd03-ws-layer1">
              <div className="nf-predd03-ws-layer-label">WHAT ALREADY EXISTS</div>
              <div className="nf-predd03-ws-inputs">
                {adjacencies.map((adj) => (
                  <div key={adj.label} className="nf-predd03-ws-input">
                    <span className="nf-predd03-ws-input-label">{adj.label}</span>
                    <span className="nf-predd03-ws-input-desc">{adj.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 2 — NexFrontier intelligence layer */}
            <div className="nf-predd03-ws-layer2">
              <div className="nf-predd03-ws-layer2-eyebrow">NEXFRONTIER</div>
              <div className="nf-predd03-ws-progression">
                <span className="nf-predd03-ws-stage">Operational Observability</span>
                <span className="nf-predd03-ws-arrow" aria-hidden="true">&rarr;</span>
                <span className="nf-predd03-ws-stage">Strategic Visibility</span>
                <span className="nf-predd03-ws-arrow" aria-hidden="true">&rarr;</span>
                <span className="nf-predd03-ws-stage nf-predd03-ws-stage--eni">Enterprise Navigational Intelligence</span>
              </div>
            </div>

            {/* Layer 3 — What it enables */}
            <div className="nf-predd03-ws-layer3">
              <div className="nf-predd03-ws-layer-label">WHAT IT ENABLES</div>
              <div className="nf-predd03-ws-layer3-value">ENTERPRISE VALUE</div>
              <p className="nf-predd03-ws-layer3-desc">See what is changing. Understand the economic consequence. Navigate where to adapt, invest or hold course.</p>
            </div>

            <p className="nf-predd03-ws-impact">
              The whitespace NexFrontier seeks to claim is the intelligence layer connecting enterprise reality with changing market reality and translating that relationship into economic meaning.
            </p>
            <p className="nf-predd03-ws-impact-sub">
              It is not another system of record or another source of data.
            </p>
          </div>

          {/* BLOCK 6 — Investor implication + CTA */}
          <div className="nf-predd03-implication">
            <div className="nf-predd03-implication-eyebrow">INVESTOR IMPLICATION</div>
            <p className="nf-predd03-implication-statement">
              If market-enterprise alignment can be linked reliably to measurable value, NexFrontier has a path from navigational intelligence to economically meaningful recurring enterprise value.
            </p>
          </div>

          <div style={{ marginTop: '26px' }}>
            <Button to="/enterprise-value">EXPLORE ENTERPRISE VALUE</Button>
          </div>
         </div>
        </Container>
      </Section>

      {/* ── PRE-DD 04: HOW WILL WE PROVE IT? ── */}
      <Section id="proof" style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-inv-section-open">
            <Eyebrow>PRE-DD 04 / HOW WILL WE PROVE IT?</Eyebrow>
            <h2 style={h2Style}>The ambition is significant. The proof has to be earned.</h2>
          </div>

          {/* Evidence ladder */}
          <div className="nf-inv-evidence-ladder" style={{ marginTop: 'var(--nf-space-5)' }}>
            <div className="nf-inv-evidence-line" />
            <div className="nf-inv-evidence-points">
              <div className="nf-inv-evidence-point nf-inv-evidence-point--1">
                <span className="nf-inv-evidence-dot" />
                <span className="nf-inv-evidence-label">Assumption</span>
              </div>
              <div className="nf-inv-evidence-point nf-inv-evidence-point--2">
                <span className="nf-inv-evidence-dot" />
                <span className="nf-inv-evidence-label">Hypothesis</span>
              </div>
              <div className="nf-inv-evidence-point nf-inv-evidence-point--3">
                <span className="nf-inv-evidence-dot" />
                <span className="nf-inv-evidence-label">Evidence</span>
              </div>
              <div className="nf-inv-evidence-today">
                <span className="nf-inv-evidence-today-marker">TODAY</span>
              </div>
              <div className="nf-inv-evidence-point nf-inv-evidence-point--4">
                <span className="nf-inv-evidence-dot" />
                <span className="nf-inv-evidence-label">Customer Validation</span>
              </div>
              <div className="nf-inv-evidence-point nf-inv-evidence-point--5">
                <span className="nf-inv-evidence-dot" />
                <span className="nf-inv-evidence-label">Paid Validation</span>
              </div>
              <div className="nf-inv-evidence-point nf-inv-evidence-point--6">
                <span className="nf-inv-evidence-dot nf-inv-evidence-dot--final" />
                <span className="nf-inv-evidence-label nf-inv-evidence-label--final">Repeatable Proof</span>
              </div>
            </div>
          </div>

          {/* Foundation Customer role */}
          <div className="nf-inv-section-open" style={{ marginTop: 'var(--nf-space-6)' }}>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>
              Foundation Customers convert thesis into operating evidence.
            </h3>
            <div className="nf-inv-proof-questions">
              <div className="nf-inv-proof-question">
                <div className="nf-inv-proof-question-label">CAN WE SEE IT?</div>
                <p className="nf-inv-proof-question-body">Can material Value Gaps be evidenced?</p>
              </div>
              <div className="nf-inv-proof-question">
                <div className="nf-inv-proof-question-label">DOES IT MATTER?</div>
                <p className="nf-inv-proof-question-body">Are those gaps economically meaningful and useful to leadership?</p>
              </div>
              <div className="nf-inv-proof-question">
                <div className="nf-inv-proof-question-label">WILL THE MARKET PAY?</div>
                <p className="nf-inv-proof-question-body">Does the value earn paid validation and ultimately repeatability?</p>
              </div>
            </div>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-4)', fontWeight: 500, color: 'var(--nf-text-primary)' }}>
              Foundation Customer &rarr; Paid Validation &rarr; Repeatable Product
            </p>
          </div>

          {/* Proof-stage position today */}
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <div className="nf-inv-sub-band">Proof-stage position today</div>
            <div className="nf-inv-proof-status">
              {proofStages.map((stage, i) => (
                <div key={stage.label} className="nf-inv-proof-item">
                  <div className="nf-inv-proof-label">{stage.label}</div>
                  <div className="nf-inv-proof-value">{stage.value}</div>
                </div>
              ))}
            </div>
          </div>

          <Implication>
            Each proof stage is designed to remove a specific layer of venture risk before NexFrontier commits more capital to scale.
          </Implication>

          <div style={{ marginTop: 'var(--nf-space-5)' }}>
            <Button to="/foundation-customers">EXPLORE FOUNDATION CUSTOMERS</Button>
          </div>
        </Container>
      </Section>

      {/* ── PRE-DD 05: CAN THIS BECOME VENTURE-SCALE? ── */}
      <Section id="scale" style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-inv-section-open">
            <Eyebrow>PRE-DD 05 / CAN THIS BECOME VENTURE-SCALE?</Eyebrow>
          </div>

          {/* 05A. Market */}
          <div style={{ marginTop: 'var(--nf-space-5)' }}>
            <div className="nf-inv-sub-band">A. Is the market large enough?</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>
              A focused starting point. A globally relevant enterprise problem.
            </h3>
            <div className="nf-inv-tam-som-wrap">
              <div className="nf-inv-tam-som">
                <div className="nf-inv-circle nf-inv-circle--tam">TAM</div>
                <div className="nf-inv-circle nf-inv-circle--sam">SAM</div>
                <div className="nf-inv-circle nf-inv-circle--som">SOM</div>
              </div>
              <div className="nf-inv-tam-legend">
                <div className="nf-inv-tam-legend-item">
                  <div className="nf-inv-tam-legend-dot nf-inv-tam-legend-dot--tam" />
                  <div>
                    <div className="nf-inv-tam-legend-label">TAM</div>
                    <div className="nf-inv-tam-legend-desc">Global enterprise market ultimately addressable by Enterprise Navigational Intelligence</div>
                  </div>
                </div>
                <div className="nf-inv-tam-legend-item">
                  <div className="nf-inv-tam-legend-dot nf-inv-tam-legend-dot--sam" />
                  <div>
                    <div className="nf-inv-tam-legend-label">SAM</div>
                    <div className="nf-inv-tam-legend-desc">Initial enterprise segments and geographies NexFrontier can realistically serve</div>
                  </div>
                </div>
                <div className="nf-inv-tam-legend-item">
                  <div className="nf-inv-tam-legend-dot nf-inv-tam-legend-dot--som" />
                  <div>
                    <div className="nf-inv-tam-legend-label">SOM</div>
                    <div className="nf-inv-tam-legend-desc">Credible early capture through the Malaysia + New Zealand &rarr; APAC entry strategy</div>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ ...bodyStyle, fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', fontStyle: 'italic', marginTop: 'var(--nf-space-3)' }}>
              Detailed market sizing is available in the Investor Brief.
            </p>

            {/* Geographic scale path */}
            <div className="nf-inv-geo" style={{ marginTop: 'var(--nf-space-5)' }}>
              <div className="nf-inv-geo-stage nf-inv-geo-stage--primary">MALAYSIA</div>
              <span className="nf-inv-geo-arrow" aria-hidden="true">+</span>
              <div className="nf-inv-geo-stage nf-inv-geo-stage--secondary">NEW ZEALAND</div>
              <span className="nf-inv-geo-arrow" aria-hidden="true">&rarr;</span>
              <div className="nf-inv-geo-stage">APAC</div>
              <span className="nf-inv-geo-arrow" aria-hidden="true">&rarr;</span>
              <div className="nf-inv-geo-stage" style={{ color: 'var(--nf-cyan)' }}>GLOBAL</div>
            </div>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-3)' }}>
              The starting footprint is regional. The enterprise problem is global.
            </p>
          </div>

          {/* 05B. Economics */}
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <div className="nf-inv-sub-band">B. Can the economics work?</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>
              Pre-revenue today. Built around enterprise economics.
            </h3>
            <div className="nf-inv-econ-blocks">
              <div className="nf-inv-econ-block">
                <div className="nf-inv-econ-label">Revenue model</div>
                <div className="nf-inv-econ-value">Recurring enterprise intelligence</div>
              </div>
              <div className="nf-inv-econ-block">
                <div className="nf-inv-econ-label">Commercial pathway</div>
                <div className="nf-inv-econ-value">Foundation Customer &rarr; Paid Beta &rarr; Commercial Customer</div>
              </div>
              <div className="nf-inv-econ-block">
                <div className="nf-inv-econ-label">Economic model</div>
                <div className="nf-inv-econ-value">Enterprise ACV, CAC, LTV and margin assumptions will be validated through paid customer evidence</div>
              </div>
              <div className="nf-inv-econ-block">
                <div className="nf-inv-econ-label">Next proof threshold</div>
                <div className="nf-inv-econ-value">Paid validation</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)', fontStyle: 'italic', marginTop: 'var(--nf-space-3)' }}>
              Pre-revenue economics are being validated through Foundation Customers and paid Beta.
            </p>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-4)', fontWeight: 500, color: 'var(--nf-text-primary)', maxWidth: '720px' }}>
              The commercial question is not whether NexFrontier can generate insight. It is whether measurable enterprise value can support recurring enterprise economics.
            </p>
          </div>

          {/* 05C. Defensibility */}
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <div className="nf-inv-sub-band">C. Can the advantage compound?</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>
              Defensibility has to compound from evidence.
            </h3>
            <div className="nf-inv-def-clusters">
              {defensibilityClusters.map((cluster) => (
                <div key={cluster.label} className="nf-inv-def-cluster">
                  <div className="nf-inv-def-cluster-rule" />
                  <div className="nf-inv-def-cluster-label">{cluster.label}</div>
                  <div className="nf-inv-def-list">
                    {cluster.items.map((item) => (
                      <div key={item} className="nf-inv-def-item">{item}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="nf-inv-def-strong">
              The idea is not the moat. The accumulated evidence, interpretation and repeatability may become one.
            </p>
          </div>

          {/* 05D. Team */}
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <div className="nf-inv-sub-band">D. Can the team turn capital into proof?</div>
            <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)' }}>
              Founder-led. Proof-stage disciplined.
            </h3>
            <div className="nf-inv-team-lines">
              {teamLines.map((line) => (
                <div key={line.label} className="nf-inv-team-line">
                  <span className="nf-inv-team-line-label">{line.label}</span>
                  <span className="nf-inv-team-line-value">{line.value}</span>
                </div>
              ))}
            </div>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-4)', fontStyle: 'italic', color: 'var(--nf-text-tertiary)' }}>
              External capital is intended to accelerate proof, not substitute for it.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <Button to="/about">MEET THE TEAM</Button>
            </div>
          </div>

          {/* Capital */}
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <div className="nf-inv-sub-band">Capital should buy proof, not activity</div>
            <div className="nf-inv-capital-flow">
              {capitalItems.map((item) => (
                <div key={item.label} className="nf-inv-capital-flow-item">
                  <div className="nf-inv-capital-label">{item.label}</div>
                  <div className="nf-inv-capital-desc">{item.desc}</div>
                  <div className="nf-inv-capital-down" aria-hidden="true">&darr;</div>
                  <div className="nf-inv-capital-outcome">{item.outcome}</div>
                </div>
              ))}
            </div>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-5)', fontWeight: 500, color: 'var(--nf-text-primary)', maxWidth: '720px' }}>
              The objective of the next capital is to materially reduce product, customer, economic and commercial risk before the next financing stage.
            </p>
            <div className="nf-inv-round">
              <div className="nf-inv-round-row">
                <span className="nf-inv-round-key">Round:</span>
                <span className="nf-inv-round-val">Proof-stage capital</span>
              </div>
              <div className="nf-inv-round-row">
                <span className="nf-inv-round-key">Purpose:</span>
                <span className="nf-inv-round-val">Paid validation + repeatability</span>
              </div>
              <div className="nf-inv-round-row">
                <span className="nf-inv-round-key">Investor Brief:</span>
                <span className="nf-inv-round-val">Full round details available on request</span>
              </div>
            </div>
          </div>

          <Implication>
            If the problem, value and economics prove repeatable across enterprises and markets, NexFrontier has the potential to scale from an APAC entry point into a new global enterprise intelligence category.
          </Implication>
        </Container>
      </Section>

      {/* ── FINAL INVESTOR CLOSE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-inv-final-close">
            <h2 style={{
              fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15,
              color: 'var(--nf-text-primary)', letterSpacing: '-0.025em',
              marginBottom: 'var(--nf-space-5)',
            }}>
              The market requirement may be emerging before the category has a name.
            </h2>
            <p style={bodyStyle}>
              NexFrontier is being built on the thesis that leadership will increasingly need a new form of intelligence to keep pace with AI-mediated markets.
            </p>
            <p style={{ ...bodyStyle, marginTop: 'var(--nf-space-3)' }}>
              If that thesis is right, the opportunity is to establish the category while the market need is still taking shape.
            </p>
            <p style={{
              fontSize: '1.5rem', fontWeight: 600, color: 'var(--nf-cyan)',
              lineHeight: 1.3, marginTop: 'var(--nf-space-5)', letterSpacing: '-0.01em',
            }}>
              Move early, before the proof becomes obvious.
            </p>
            <div className="nf-inv-final-cta-row">
              <Button to="/investor-proof#request-investor-brief">REQUEST INVESTOR BRIEF <ArrowRight size={16} /></Button>
              <TextLink to="/market-enquiry?topic=investor-conversation">TALK TO NEXFRONTIER</TextLink>
              <TextLink to="/foundation-customers">INTRODUCE A FOUNDATION CUSTOMER</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── INVESTOR BRIEF REQUEST ── */}
      <Section spacing="tight">
        <Container>
          <div id="request-investor-brief" style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <div style={{ borderTop: '1px solid var(--nf-border)', paddingTop: 'var(--nf-space-7)' }}>
              <Eyebrow>INVESTOR BRIEF</Eyebrow>
              <h2 style={{
                fontSize: 'var(--nf-text-h2)', fontWeight: 500, letterSpacing: '-0.025em',
                color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)',
              }}>Go deeper.</h2>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)', maxWidth: '620px' }}>
                Request the Investor Brief for the current investment thesis, proof-stage position, market model and round context. Submit your details below. A member of the NexFrontier team will review your request and contact you with next steps.
              </p>
              <InvestorBriefRequestForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── DATA ROOM ACCESS ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <div style={{
              padding: 'var(--nf-space-6) var(--nf-space-7)',
              background: 'var(--nf-bg-surface-1)',
              border: '1px solid var(--nf-border)',
              borderRadius: 'var(--nf-radius-panel)',
              display: 'flex', alignItems: 'center', gap: 'var(--nf-space-5)', flexWrap: 'wrap',
            }}>
              <Lock size={24} color="var(--nf-cyan)" />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--nf-text-primary)', marginBottom: '4px' }}>Already have access?</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', lineHeight: 1.5 }}>If you have been invited or have previously activated access, enter the Data Room directly.</p>
              </div>
              <Button to="/investor-data-room" variant="secondary"><Lock size={15} /> Enter Data Room <ArrowRight size={15} /></Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/investor-proof" />
    </>
  );
}
