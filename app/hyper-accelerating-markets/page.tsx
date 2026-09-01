import Image from 'next/image';
import Link from 'next/link';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const metadata = pageMetadata({
  path: '/hyper-accelerating-markets',
  title: 'The Market Will Not Wait | Enterprise Navigational Intelligence for Hyper-Accelerating Markets',
  description:
    'How AI is increasing the rate and consequence of market change, why enterprise adaptation must be judged against market velocity, and the case for Enterprise Navigational Intelligence.',
});

const marketMechanisms = [
  'what enters consideration',
  'which alternatives are presented',
  'what evidence is evaluated',
  'how options are compared',
  'what appears credible',
  'how decisions progress',
  'how interactions occur',
  'how transactions are initiated and completed',
];

const adaptiveSpeedPoints = [
  'what has materially changed',
  'whether the enterprise is keeping pace',
  'whether adaptation is moving in the right direction',
  'whether the gap is widening or closing',
  'whether the economic consequence justifies further change',
];

const strategyChoices = ['act', 'wait', 'accelerate', 'hold course', 'reallocate', 'change direction'];

const performanceRisks = [
  'the available opportunity expanded faster',
  'competitors captured more emerging value',
  'the basis of choice changed',
  'relative market position weakened',
  'internal efficiency improved while market effectiveness fell',
];

const firstKnowQuestions = [
  'What changed?',
  'Does it matter?',
  'Are we keeping pace?',
  'Are we adapting in the right direction?',
  'What is the economic consequence?',
  'What happens if we do nothing?',
];

const signalItems = [
  {
    signal:
      'Agentic commerce could mediate $3 trillion to $5 trillion of global consumer commerce by 2030, with AI increasingly shaping which options customers consider and how buying decisions progress.',
    source: 'McKinsey, 2026',
    supports: 'AI-mediated market mechanisms; acceleration through existing digital infrastructure',
    href: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/agentic-commerce',
  },
  {
    signal:
      'AI agents are beginning to participate in evaluation, comparison and transaction, narrowing the field before a person explores it directly.',
    source: 'McKinsey Europe, 2026',
    supports: 'AI-mediated market mechanisms; changing conditions of competition',
    href: 'https://www.mckinsey.com/industries/retail/our-insights/the-state-of-agentic-commerce-in-europe',
  },
  {
    signal:
      'B2B buyers increasingly use AI to compare, filter and evaluate suppliers, changing how B2B purchasing decisions progress and what evidence matters.',
    source: 'McKinsey B2B Sales, 2026',
    supports: 'B2B relevance; intelligence increasing on both sides of the market',
    href: 'https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/the-state-of-ai-in-b2B-sales',
  },
  {
    signal:
      'AI is increasingly participating in sourcing, supplier evaluation and allocation decisions, changing procurement conditions.',
    source: 'McKinsey Procurement, 2026',
    supports: 'Procurement relevance; AI participating in market mechanisms beyond consumer commerce',
    href: 'https://www.mckinsey.com/capabilities/operations/our-insights/ai-in-procurement',
  },
  {
    signal:
      'Companies reallocating resources in response to changing market conditions outperform peers, but most organisations struggle to adapt quickly enough.',
    source: 'McKinsey Strategy, 2026',
    supports: 'Strategy pressure; the economic value of faster, evidence-led adaptation',
    href: 'https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/strategy-resource-allocation',
  },
  {
    signal:
      '68% of retailers expect to adopt agentic AI for key activities within 12 to 24 months, with discovery, decision-making and transaction increasingly moving through AI intermediaries.',
    source: 'Deloitte, 2026',
    supports: 'Internal enterprise AI acceleration; AI-mediated market mechanisms',
    href: 'https://www2.deloitte.com/us/en/insights/industries/retail-distribution/retail-outlook.html',
  },
  {
    signal:
      'Strategy leaders face increasing pressure from accelerating market change, with formal planning cycles struggling to keep pace with the rate of external disruption.',
    source: 'Deloitte CSO, 2026',
    supports: 'Strategy pressure; the case for intelligence between planning cycles',
    href: 'https://www2.deloitte.com/us/en/insights/topics/strategy/chief-strategy-officer-survey.html',
  },
  {
    signal:
      'Consumers are increasingly using AI to compare, challenge, interpret and narrow options before direct engagement with a business.',
    source: 'Accenture, 2026',
    supports: 'Changing customer use of AI; intelligence increasing on both sides of the market',
    href: 'https://www.accenture.com/us-en/insights/consumer-products-services/ai-agents-consumer-research',
  },
];

const sectionPad = {
  paddingTop: 'clamp(48px, 5vw, 68px)',
  paddingBottom: 'clamp(48px, 5vw, 68px)',
  borderTop: '1px solid var(--nf-border)',
};

export default function HyperAcceleratingMarketsPage() {
  return (
    <>
      {/* ── Breadcrumb ── */}
      <section
        className="nf-me-breadcrumb"
        style={{
          paddingTop: '14px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--nf-border-soft)',
        }}
      >
        <Container>
          <nav aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li className="nf-me-breadcrumb-sep">/</li>
              <li>
                <Link href="/the-shift">The Shift</Link>
              </li>
              <li className="nf-me-breadcrumb-sep">/</li>
              <li className="nf-me-breadcrumb-current">Hyper-Accelerating Markets</li>
            </ol>
          </nav>
        </Container>
      </section>

      {/* ── 1. HERO ── */}
      <section
        style={{
          paddingTop: 'var(--nf-space-6)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
          borderBottom: '1px solid var(--nf-border)',
        }}
      >
        <Container>
          <div className="nf-hero-split nf-hero-split--dominant-visual">
            <div className="nf-me-content nf-hero-split-copy" style={{ maxWidth: '820px' }}>
            <Eyebrow>HYPER-ACCELERATING MARKETS</Eyebrow>
            <h1
              style={{
                fontSize: 'var(--nf-text-page-h1)',
                lineHeight: 'var(--nf-leading-hero)',
                fontWeight: 500,
                letterSpacing: '-0.035em',
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-6)',
              }}
            >
              The market will not wait.
            </h1>
            <p
              style={{
                fontSize: 'var(--nf-text-lead)',
                lineHeight: 'var(--nf-leading-lead)',
                color: 'var(--nf-text-secondary)',
                margin: 0,
              }}
            >
              Hyper-accelerating markets are markets in which the rate and consequence of change can themselves accelerate as AI increases the capability, responsiveness and interaction of participants and systems.
            </p>
            <p
              style={{
                fontSize: 'var(--nf-text-body)',
                lineHeight: 'var(--nf-leading-body)',
                color: 'var(--nf-text-secondary)',
                marginTop: 'var(--nf-space-4)',
              }}
            >
              Inside the enterprise, AI can make the business faster, more efficient and more productive.
            </p>
            <p
              style={{
                fontSize: 'var(--nf-text-body)',
                lineHeight: 'var(--nf-leading-body)',
                color: 'var(--nf-text-secondary)',
                marginTop: 'var(--nf-space-3)',
              }}
            >
              Outside the enterprise, AI can change the market itself: its pace, mechanics, how choices are shaped, which businesses are presented for consideration, what evidence matters and where value becomes available.
            </p>
            <p
              style={{
                fontSize: 'var(--nf-text-body)',
                lineHeight: 'var(--nf-leading-body)',
                color: 'var(--nf-text-primary)',
                fontWeight: 500,
                marginTop: 'var(--nf-space-4)',
              }}
            >
              The enterprise can direct the first. It does not control the second.
            </p>
            <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)' }}>
              The strategic risk is the gap between the rate at which the market changes and the rate at which the
              enterprise can recognise what changed, understand what it means economically, and adapt.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--nf-space-4)',
                marginTop: 'var(--nf-space-6)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink
                to="/where-nexfrontier-fits"
                style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}
              >
                Where NexFrontier Fits
              </TextLink>
            </div>
            </div>
            <div className="nf-hero-split-visual">
              <Image
                src="/assets/images/neon_market_value_gap_chart.png"
                alt="Chart showing the market changing faster than the enterprise, creating a widening value gap over time."
                width={1448}
                height={1086}
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. TWO RATES OF CHANGE ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>THE GAP</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              The enterprise is accelerating. So is the market.
            </h2>
            <p className="nf-me-body">
              Inside the enterprise, AI can improve productivity, speed, capacity, automation and efficiency.
            </p>
            <p className="nf-me-body">Outside it, AI can change the conditions under which the enterprise competes.</p>
            <p className="nf-me-body">Those are two different rates of change.</p>
            <p className="nf-me-body">
              A business can get significantly better internally and still lose alignment externally.
            </p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              Internal AI can improve how the business operates. External AI can change the market the business
              operates in.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              AI can accelerate not only its own capabilities, but the systems and participants around it. As those systems interact, the net effect can be compounding market acceleration.
            </p>
            <div className="nf-me-interpretation" style={{ marginTop: 'var(--nf-space-5)' }}>
              <span className="nf-me-interpretation-label">NexFrontier interpretation</span>
              <p>
                Going faster inside the enterprise creates value. Enterprise Navigational Intelligence asks whether it
                is fast enough, and heading in the right direction, for the market outside it.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 3. AI-MEDIATED MARKETS ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>AI-MEDIATED MARKETS</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              AI can change the conditions of competition while the enterprise is still competing.
            </h2>
            <p className="nf-me-body">Markets have always moved.</p>
            <p className="nf-me-body">That alone does not justify NexFrontier.</p>
            <p className="nf-me-body">
              What matters now is that AI can increasingly participate in the market mechanism itself.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              It can influence:
            </p>
            <ul className="nf-me-list-2col">
              {marketMechanisms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              That means the assumptions under which the enterprise is operating can become less valid while the
              business is still performing against them.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Enterprise Navigational Intelligence is not about predicting the future. It is about recognising when the
              present has changed enough to alter what the enterprise needs to be capable of.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-3)' }}>
              AI changes participants. Changed participants change the market. The changed market then changes what participants need to become. As those effects interact, the rate and consequence of market change can compound.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 4. MARKET ELIGIBILITY ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>MARKET ELIGIBILITY</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              Being found is not the same as being presented.
            </h2>
            <p className="nf-me-body">
              Traditional digital markets taught businesses to care about discoverability.
            </p>
            <p className="nf-me-body">AI-mediated markets introduce another layer.</p>
            <p className="nf-me-body">
              AI can increasingly narrow the field before a person explores it directly.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              The question therefore becomes less:
            </p>
            <p className="nf-me-question-shift">Can the market find us?</p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-3)' }}>and more:</p>
            <p className="nf-me-emphasis">
              Does the enterprise still present enough evidence, capability and confidence to remain eligible for
              consideration?
            </p>
            <div className="nf-me-interpretation" style={{ marginTop: 'var(--nf-space-5)' }}>
              <span className="nf-me-interpretation-label">Important distinction</span>
              <p>
                This is not a GEO proposition. NexFrontier is not being built to optimise how an enterprise ranks inside
                an AI answer.
              </p>
            </div>
            <div className="nf-me-interpretation" style={{ marginTop: 'var(--nf-space-3)' }}>
              <span className="nf-me-interpretation-label">Leadership question</span>
              <p>
                Is the enterprise becoming more or less capable of competing as AI changes the conditions under which
                market choices are made?
              </p>
            </div>
            <div className="nf-me-interpretation" style={{ marginTop: 'var(--nf-space-3)' }}>
              <span className="nf-me-interpretation-label">Commercial implication</span>
              <p>
                One value hypothesis is that, as the gap between enterprise reality and market reality widens, the
                business may need to spend more simply to achieve the same market outcome, increasing the effective
                cost of customer acquisition.
              </p>
              <p style={{ marginTop: 'var(--nf-space-3)' }}>
                Market eligibility matters because the enterprise cannot capture value from opportunity it never enters
                the field to compete for.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5. INTELLIGENCE ON BOTH SIDES ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>A NEW MARKET CONDITION</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              Intelligence is now increasing on both sides of the market.
            </h2>
            <p className="nf-me-body">
              Customers can increasingly use AI to compare, challenge, interpret, filter, evaluate, narrow and decide.
            </p>
            <p className="nf-me-body">The enterprise is simultaneously adding AI internally.</p>
            <p className="nf-me-body">So both sides of the market are becoming more capable.</p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              When intelligence increases on both sides of the market, yesterday&rsquo;s definition of a capable
              enterprise may not remain sufficient for long.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              The market can raise the bar faster than the enterprise realises the bar has moved.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-3)' }}>
              AI is not the only source of change. It can amplify the speed and consequence of other disruption already moving through the market, potentially accelerating how information, decisions and market reactions propagate through interconnected systems.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 6. ADAPTIVE SPEED ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>ADAPTIVE SPEED</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              The advantage is not speed. It is knowing how fast to adapt.
            </h2>
            <p className="nf-me-body">Businesses have always adapted.</p>
            <p className="nf-me-body">
              The AI-era difference is that the market may now be able to change faster because new behaviours,
              interfaces and market mechanisms can increasingly operate over infrastructure that already exists.
            </p>
            <p className="nf-me-body">
              That reduces some of the friction that historically slowed market change.
            </p>
            <div className="nf-me-interpretation" style={{ marginTop: 'var(--nf-space-5)' }}>
              <span className="nf-me-interpretation-label">Leadership problem</span>
              <p>
                Can this enterprise adapt at the rate its market now requires, and how would leadership know?
              </p>
            </div>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Enterprise Navigational Intelligence should help leadership understand:
            </p>
            <ul className="nf-me-list-2col">
              {adaptiveSpeedPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              This is not adapt faster at all costs. It is adaptive speed with economic judgement.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 7. STRATEGY ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>STRATEGY</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-3)',
              }}
            >
              Faster markets need calmer leadership.
            </h2>
            <p
              style={{
                fontSize: 'var(--nf-text-lead)',
                lineHeight: 'var(--nf-leading-lead)',
                color: 'var(--nf-cyan)',
                fontWeight: 500,
                margin: '0 0 var(--nf-space-5)',
              }}
            >
              Build Calm. Earn Trust.
            </p>
            <p className="nf-me-body">
              AI-mediated markets do not require leadership to change strategy every time a new signal appears.
            </p>
            <p className="nf-me-body">They require leadership to know which changes actually matter.</p>
            <p className="nf-me-body">Formal planning cycles can remain exactly as they are.</p>
            <p className="nf-me-body">
              Enterprise Navigational Intelligence sits between those moments, giving leadership evidence of whether the
              assumptions beneath the strategy remain valid.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>Leadership can then choose to:</p>
            <div className="nf-me-choices">
              {strategyChoices.map((choice) => (
                <span key={choice} className="nf-me-choice">
                  {choice}
                </span>
              ))}
            </div>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              Faster adaptation does not mean more activity. It means shortening the time between meaningful market
              change, leadership awareness and an economically justified response.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Enterprise Navigational Intelligence should create calm, not noise.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 8. PERFORMANCE ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>PERFORMANCE</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              You can hit every target and still lose ground.
            </h2>
            <p className="nf-me-body">
              Performance tells leadership whether the enterprise achieved the targets it set.
            </p>
            <p className="nf-me-body">The issue is not that the target magically moved.</p>
            <p className="nf-me-body">
              The issue is that the market opportunity against which that target should be judged may have changed.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>A business can hit its target while:</p>
            <ul className="nf-me-list-2col">
              {performanceRisks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Or the reverse:
            </p>
            <p className="nf-me-body">
              A shrinking or less accessible market may also change what good performance should mean.
            </p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              Performance tells leadership how the enterprise performed against its plan. Enterprise Navigational
              Intelligence asks what that performance means against the market opportunity now available.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              A business can be performing well and becoming less competitive at the same time.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 9. HOW THE PIECES CONNECT ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>HOW THE PIECES CONNECT</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-6)',
              }}
            >
              From market change to enterprise value.
            </h2>
          </div>
          <div className="nf-me-connect-h">
            <div className="nf-me-connect-step">
              <h3>Operational Observability</h3>
              <p>Provides the evidence.</p>
            </div>
            <ArrowRight size={24} className="nf-me-connect-arrow-h" />
            <div className="nf-me-connect-step">
              <h3>Strategic Visibility</h3>
              <p>Makes the economically material relationship between enterprise reality and changing market reality visible.</p>
            </div>
            <ArrowRight size={24} className="nf-me-connect-arrow-h" />
            <div className="nf-me-connect-step">
              <h3>Enterprise Navigational Intelligence</h3>
              <p>Helps leadership understand what that relationship means and where to steer.</p>
            </div>
            <ArrowRight size={24} className="nf-me-connect-arrow-h" />
            <div className="nf-me-connect-ev">
              <div className="nf-me-connect-ev-header">
                <h3>Enterprise Value</h3>
                <p>Establishes the economic consequence.</p>
              </div>
              <div className="nf-me-connect-ev-cards">
                <div className="nf-me-connect-ev-card">
                  <h4>Quiet Loss&trade;</h4>
                </div>
                <div className="nf-me-connect-ev-card">
                  <h4>Adaptive Value&trade;</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="nf-me-content" style={{ marginTop: 'var(--nf-space-5)' }}>
            <p className="nf-me-emphasis">
              Operational Observability provides the evidence. Strategic Visibility makes the material relationship visible. Enterprise Navigational Intelligence helps leadership understand what it means. Enterprise Value establishes the economic consequence.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 10. ENTERPRISE VALUE ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-ev-section">
            <div className="nf-me-ev-copy">
              <Eyebrow>ENTERPRISE VALUE</Eyebrow>
              <h2
                style={{
                  fontSize: 'var(--nf-text-h2)',
                  fontWeight: 500,
                  lineHeight: 1.15,
                  color: 'var(--nf-text-primary)',
                  margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
                }}
              >
                Strategic Visibility only earns its place when it reaches economic consequence.
              </h2>
              <p className="nf-me-body">More information is not the outcome.</p>
              <p className="nf-me-body">Another dashboard is not the outcome.</p>
              <p className="nf-me-body">Knowing the market changed is not the outcome.</p>
              <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
                Strategic Visibility becomes useful when leadership can identify:
              </p>
              <ul className="nf-me-list-2col">
                <li>which gaps are economically material</li>
                <li>where value is already unrealised</li>
                <li>what value is at risk</li>
                <li>where changing conditions create additional opportunity</li>
                <li>where investment deserves priority</li>
                <li>where no action is justified</li>
              </ul>
              <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
                The gap becomes strategically useful when leadership can value it.
              </p>
              <div style={{ marginTop: 'var(--nf-space-5)' }}>
                <Button to="/enterprise-value">Explore Enterprise Value</Button>
              </div>
            </div>
            <div className="nf-me-ev-cards">
              <div className="nf-premium-card nf-me-ev-card">
                <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>
                  Quiet Loss&trade;
                </h3>
                <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
                  Quiet Loss&trade; is enterprise value that remains unrealised because the enterprise is not fully
                  aligned to the market opportunity available to it.
                </p>
              </div>
              <div className="nf-premium-card nf-me-ev-card">
                <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>
                  Adaptive Value&trade;
                </h3>
                <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
                  Adaptive Value&trade; is additional enterprise value that may become possible when economically
                  meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 11. FIRST KNOW. THEN ACT. ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>ENTERPRISE NAVIGATIONAL INTELLIGENCE</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              First know. Then act.
            </h2>
            <p className="nf-me-body">Before leadership changes direction:</p>
            <ul className="nf-me-questions-2col">
              {firstKnowQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Then:
            </p>
            <p className="nf-me-emphasis">Where should we steer?</p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-5)' }}>
              NexFrontier is building Enterprise Navigational Intelligence to keep those questions current as
              AI-mediated markets continue to move.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink
                to="/where-nexfrontier-fits"
                style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}
              >
                Where NexFrontier Fits
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 12. EVIDENCE BEFORE CLAIM + MARKET SIGNALS ── */}
      <Section style={sectionPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>DISCIPLINE</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              Evidence before claim.
            </h2>
            <p className="nf-me-body">
              External research can show that market conditions are changing. It does not, on its own, establish where NexFrontier creates measurable economic value.
            </p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-4)' }}>
              Market Signals show why the shift deserves attention. Foundation Customer evidence determines where NexFrontier creates measurable economic value.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <Button to="/foundation-customers" variant="secondary">
                Foundation Customer Programme
              </Button>
            </div>
          </div>

          {/* Market Signals */}
          <div id="market-signals" style={{ marginTop: 'var(--nf-space-6)', scrollMarginTop: '100px' }}>
            <Eyebrow>MARKET SIGNALS</Eyebrow>
            <h3
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-4) 0 var(--nf-space-3)',
              }}
            >
              What independent research is signalling.
            </h3>
            <p className="nf-me-body" style={{ marginBottom: 'var(--nf-space-5)' }}>
              Across commerce, B2B, procurement, strategy and consumer behaviour, independent research points to AI increasingly participating in how markets evaluate, compare, decide, allocate and transact.
            </p>
            <div className="nf-me-signals">
              <div className="nf-me-signal-header">
                <span>Source</span>
                <span>Signal</span>
                <span>What it supports</span>
                <span aria-hidden="true" />
              </div>
              {signalItems.map((item) => (
                <div key={item.source} className="nf-me-signal-row">
                  <span className="nf-me-signal-source">{item.source}</span>
                  <span className="nf-me-signal-text">{item.signal}</span>
                  <span className="nf-me-signal-supports">{item.supports}</span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nf-me-signal-link"
                  >
                    View source <ArrowRight size={12} style={{ display: 'inline' }} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 13. FINAL CLOSE ── */}
      <Section
        style={{
          paddingTop: 'clamp(48px, 5vw, 68px)',
          paddingBottom: 'clamp(48px, 5vw, 80px)',
          borderTop: '1px solid var(--nf-border)',
        }}
      >
        <Container>
          <div className="nf-me-content">
            <Eyebrow>THE QUESTION NOW</Eyebrow>
            <h2
              style={{
                fontSize: 'var(--nf-text-h2)',
                fontWeight: 500,
                lineHeight: 1.15,
                color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}
            >
              Your KPIs tell you how fast the enterprise is moving. What tells you whether the market is moving faster?
            </h2>
            <p className="nf-me-body">
              AI-mediated markets matter because the speed and direction of the market itself can change faster than
              established enterprise signals reveal.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
              Leadership therefore needs to know not only:
            </p>
            <p className="nf-me-body" style={{ fontWeight: 500, color: 'var(--nf-text-primary)' }}>
              Are we adapting?
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-3)' }}>but:</p>
            <p className="nf-me-emphasis">
              Are we adapting at the rate and in the direction the market now requires?
            </p>
            <p className="nf-pull" style={{ marginTop: 'var(--nf-space-6)' }}>
              You cannot judge the speed of the enterprise without knowing the speed and direction of the market around
              it.
            </p>
            <p
              style={{
                fontSize: 'var(--nf-text-body)',
                lineHeight: 'var(--nf-leading-body)',
                color: 'var(--nf-text-primary)',
                fontWeight: 500,
                marginTop: 'var(--nf-space-4)',
              }}
            >
              That is the case for Enterprise Navigational Intelligence.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--nf-space-4)',
                marginTop: 'var(--nf-space-6)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink to="/market-enquiry">Talk to NexFrontier</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Bottom Context Navigation ── */}
      <section
        style={{
          borderTop: '1px solid var(--nf-border)',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Container>
          <div className="nf-me-context-nav">
            <Link href="/the-shift" className="nf-me-context-nav-link">
              <ArrowLeft size={16} /> Back to The Shift
            </Link>
            <Link href="/where-nexfrontier-fits" className="nf-me-context-nav-link">
              Next: Where NexFrontier Fits <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
