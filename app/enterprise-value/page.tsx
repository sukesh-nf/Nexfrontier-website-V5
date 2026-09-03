import Image from 'next/image';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';

export const metadata = pageMetadata({
  path: '/enterprise-value',
  title: 'Enterprise Value in AI-mediated markets | NexFrontier',
  description: 'Explore NexFrontier\'s Enterprise Value view through Quiet Loss™, Adaptive Value™ and five value dimensions spanning revenue, cost, capacity, customer value and enterprise capability.',
});

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 80px)',
  paddingBottom: 'clamp(48px, 5.5vw, 80px)',
};

const valueGapConsequences = [
  'Value may already be unrealised.',
  'More effort or cost may be required to achieve the same market outcome.',
  'Competitive position may weaken even while internal performance remains acceptable.',
  'Existing capability may be underused against the opportunity now available.',
  'New opportunity may emerge before the enterprise is positioned to capture it.',
  'Capital may continue to be allocated against assumptions the market has already changed.',
];

const lenses = [
  { label: 'Defensive Value', desc: 'Value protected when the enterprise reduces exposure, avoids deterioration or preserves an economically important position.' },
  { label: 'Offensive Value', desc: 'Value made possible when changing market conditions create a meaningful opportunity the enterprise can pursue.' },
  { label: 'Revenue Health', desc: 'Evidence of how effectively the enterprise is converting available market opportunity into sustainable economic performance.' },
  { label: 'Customer Lifetime Value', desc: 'Evidence of whether changing market conditions are strengthening or weakening the value created across the customer relationship.' },
];

const knowFirstQuestions = [
  'Where is value already being left unrealised?',
  'Where is value becoming exposed?',
  'Where is the market creating new opportunity?',
  'Is the enterprise keeping pace with the market around it?',
];

const thenActQuestions = [
  'What deserves investment?',
  'What should wait?',
  'Where is no action the right action?',
  'Where should leadership steer next?',
];

export default function EnterpriseValuePage() {
  return (
    <>
      {/* ── Top breadcrumb ── */}
      <section style={{ paddingTop: 'var(--nf-space-4)' }}>
        <Container>
          <TopBreadcrumb path="/enterprise-value" />
        </Container>
      </section>

      {/* ── 1. HERO ── */}
      <section style={{
        paddingTop: 'var(--nf-space-6)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        borderBottom: '1px solid var(--nf-border)',
      }}>
        <Container>
          <div style={{ maxWidth: '820px' }}>
            <Eyebrow>ENTERPRISE VALUE</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>
              Market change matters when it changes the economics.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', margin: 0 }}>
              AI-mediated markets can change the opportunity available to the enterprise, the conditions under which it competes, and the value it is capable of capturing.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
              A business can therefore be improving internally while value is becoming harder to capture, remaining unrealised, or becoming newly possible outside it.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
              NexFrontier is building the intelligence to make that economic consequence visible.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="#enterprise-value">EXPLORE ENTERPRISE VALUE</Button>
              <TextLink to="/enterprise-value/value-translation-framework">HOW NEXFRONTIER TRANSLATES VALUE</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. ENTERPRISE VALUE ── */}
      <Section id="enterprise-value" style={tightPad}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>ENTERPRISE VALUE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Where value may already be unrealised. Where new value may become possible.
            </h2>
            <p className="nf-me-body">
              NexFrontier seeks to identify where enterprise value may be protected, left unrealised or made newly possible as markets change.
            </p>
            <p className="nf-me-body">
              The economic question is not simply whether the enterprise is performing. It is whether that performance reflects the opportunity now available to it.
            </p>
          </div>
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <img
              src="/assets/images/Enterprise_Value_Website_Aug26.png"
              alt="Enterprise Value diagram showing where value may be protected, unrealised or newly possible as markets change."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
          <p className="nf-pull" style={{ marginTop: 'var(--nf-space-6)' }}>
            Enterprise Value is the economic consequence of alignment, misalignment and adaptation.
          </p>
        </Container>
      </Section>

      {/* ── 3. QUIET LOSS™ ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-ev-quiet-loss">
            <div className="nf-ev-quiet-loss-copy">
              <Eyebrow>QUIET LOSS&trade;</Eyebrow>
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
                You can hit every target and still leave value unrealised.
              </h2>
              <p className="nf-me-body" style={{ fontWeight: 500, color: 'var(--nf-text-primary)' }}>
                Quiet Loss&trade; is enterprise value that remains unrealised because the enterprise is not fully aligned to the market opportunity available to it.
              </p>
              <p className="nf-me-body">
                It may sit beneath apparently acceptable performance because internal targets describe how the business performed against plan, not necessarily how much of the available market opportunity it captured.
              </p>
              <p className="nf-me-body">
                The question is not simply what was lost. It is what should have been economically possible under the market conditions that actually existed.
              </p>
            </div>
            <div className="nf-ev-quiet-loss-visual">
              <img
                src="/assets/images/Quiet_Loss_Website_Aug26.png"
                alt="Quiet Loss diagram showing enterprise value that remains unrealised beneath acceptable performance."
                style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 4. ADAPTIVE VALUE™ ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-ev-adaptive-value">
            <div className="nf-ev-adaptive-value-copy">
              <Eyebrow>ADAPTIVE VALUE&trade;</Eyebrow>
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
                Market change can create value as well as expose it.
              </h2>
              <p className="nf-me-body" style={{ fontWeight: 500, color: 'var(--nf-text-primary)' }}>
                Adaptive Value&trade; is additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.
              </p>
              <p className="nf-me-body">
                Not every market change deserves a response. Not every response creates value.
              </p>
              <p className="nf-me-body">
                Adaptive Value&trade; begins when leadership can distinguish meaningful change from noise, understand the economic consequence, and decide whether adaptation is worth the investment.
              </p>
            </div>
            <div className="nf-ev-adaptive-value-visual">
              <img
                src="/assets/images/Adaptive_Value_website_Aug26.png"
                alt="Adaptive Value diagram showing additional enterprise value that may become possible through effective adaptation."
                style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 5. VALUE GAP ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE VALUE GAP</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
            A gap only matters when it matters economically.
          </h2>
          <div className="nf-ev-value-gap">
            <div className="nf-ev-value-gap-copy">
              <p className="nf-me-body" style={{ marginTop: 0 }}>
                The Value Gap is the distance between enterprise reality and changing market reality.
              </p>
              <p className="nf-me-body">
                That gap can widen even while the enterprise is improving, because the market may be changing faster, in a different direction, or creating value through mechanisms the enterprise is not yet positioned to capture.
              </p>
              <p className="nf-me-emphasis">
                But difference alone is not enough.
              </p>
              <p className="nf-me-body">
                The leadership question is whether the gap is economically material.
              </p>
            </div>
            <div className="nf-ev-value-gap-visual">
              <Image
                src="/assets/images/neon_market_value_gap_chart.png"
                alt="Chart showing the widening value gap between enterprise reality and changing market reality over time."
                width={1448}
                height={1086}
                sizes="(max-width: 900px) 100vw, 48vw"
                style={{ width: '100%', height: 'auto', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
            </div>
          </div>
          <div className="nf-ev-consequences">
            {valueGapConsequences.map((item, i) => (
              <div key={i} className="nf-ev-consequence">
                <span className="nf-ev-consequence-num">{i + 1}</span>
                <span className="nf-ev-consequence-text">{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── 6. VALUE TRANSLATION FRAMEWORK™ ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>VALUE TRANSLATION FRAMEWORK&trade;</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              From evidence to commercial meaning.
            </h2>
            <p className="nf-me-body">
              Evidence becomes useful when leadership can understand what it means economically.
            </p>
            <p className="nf-me-body">
              The Value Translation Framework&trade; provides the structure for translating evidence into recognised areas of enterprise value without assuming that every signal, gap or change is economically material.
            </p>
          </div>
          <div className="nf-ev-flow">
            <span className="nf-ev-flow-stage nf-ev-flow-stage--left">Evidence</span>
            <span className="nf-ev-flow-arrow">&rarr;</span>
            <span className="nf-ev-flow-stage nf-ev-flow-stage--center">Commercial Meaning</span>
            <span className="nf-ev-flow-arrow">&rarr;</span>
            <span className="nf-ev-flow-stage nf-ev-flow-stage--right">Enterprise Value</span>
          </div>
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <img
              src="/assets/images/VAlue_Translation_Fwork_website_Aug26.png"
              alt="Value Translation Framework diagram showing the flow from evidence through commercial meaning to enterprise value."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
          <p className="nf-pull" style={{ marginTop: 'var(--nf-space-6)' }}>
            The framework does not replace leadership judgement. It sharpens it.
          </p>
          <div style={{ marginTop: 'var(--nf-space-5)' }}>
            <Button to="/enterprise-value/value-translation-framework">VALUE TRANSLATION FRAMEWORK&trade;</Button>
          </div>
        </Container>
      </Section>

      {/* ── 7. FIVE VALUE LENSES ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE FIVE VALUE LENSES</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)' }}>
            Where economic consequence may show up.
          </h2>
          <div className="nf-ev-lenses-grid">
            {lenses.map((lens) => (
              <div key={lens.label} className="nf-ev-lens-card">
                <h3 className="nf-ev-lens-title">{lens.label}</h3>
                <p className="nf-ev-lens-desc">{lens.desc}</p>
              </div>
            ))}
          </div>
          <div className="nf-ev-lens-full">
            <h3 className="nf-ev-lens-title">Enterprise Capability</h3>
            <p className="nf-ev-lens-desc">
              The ability to recognise material market change, understand its economic consequence, decide what deserves a response, adapt in ways that can be shown to create value, and learn.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 8. EVIDENCE BEFORE CLAIM ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>EVIDENCE BEFORE CLAIM</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Possibility is not proof.
            </h2>
            <p className="nf-me-body">A signal is not automatically a loss.</p>
            <p className="nf-me-body">A gap is not automatically economically material.</p>
            <p className="nf-me-body">Insight is not automatically value.</p>
            <p className="nf-me-body">Action is not automatically value creation.</p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              Value exists only when the economic consequence can be evidenced.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-5)' }}>
              Market Signals show why the shift deserves attention. Foundation Customer evidence determines where NexFrontier creates measurable economic value.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <Button to="/foundation-customers" variant="secondary">FOUNDATION CUSTOMERS</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 9. LEADERSHIP ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content">
            <Eyebrow>LEADERSHIP</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Know first. Then act.
            </h2>
            <p className="nf-me-body">
              The advantage is not more activity. It is knowing what deserves attention, what matters economically and when action is justified.
            </p>
            <p className="nf-me-body">
              Enterprise Navigational Intelligence is being built to give leadership a clearer basis for those decisions.
            </p>
          </div>

          <div className="nf-ev-leadership-panels">
            <div className="nf-ev-leadership-panel">
              <span className="nf-ev-leadership-panel-label">KNOW FIRST</span>
              <h3 className="nf-ev-leadership-panel-heading">What is changing, and what does it mean?</h3>
              <ul className="nf-ev-leadership-questions">
                {knowFirstQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="nf-ev-leadership-panel-close">Make the economically material change visible before deciding what to do about it.</p>
            </div>

            <div className="nf-ev-leadership-connector" aria-hidden="true">
              <span className="nf-ev-leadership-connector-text">Know</span>
              <span className="nf-ev-leadership-connector-arrow">&rarr;</span>
              <span className="nf-ev-leadership-connector-text">Act</span>
            </div>

            <div className="nf-ev-leadership-panel">
              <span className="nf-ev-leadership-panel-label">THEN ACT</span>
              <h3 className="nf-ev-leadership-panel-heading">Decide what deserves a response.</h3>
              <ul className="nf-ev-leadership-questions">
                {thenActQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
              <p className="nf-ev-leadership-panel-close">Commit when the evidence and the economics justify it.</p>
            </div>
          </div>

          <div className="nf-ev-leadership-close">
            Evidence sharpens the decision. Value tells us whether it mattered.
          </div>

          <div className="nf-ev-leadership-cta">
            <Eyebrow>FOR LEADERS PREPARED TO MOVE EARLY</Eyebrow>
            <h3 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Seeing change early only matters if you know what to do with it.
            </h3>
            <p className="nf-me-body">
              NexFrontier is looking to work with leaders who recognise that AI-mediated markets may change the economics of their business before the implications are obvious.
            </p>
            <p className="nf-me-body">
              Moving early does not mean acting before the evidence. It means seeking the evidence before the cost of learning late becomes greater.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <Button to="/leadership-pulse?source=enterprise_value">TELL US WHAT YOU SEE</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 10. FINAL CTA ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-ev-final-cta">
            <div className="nf-ev-final-cta-copy">
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 0 }}>
                What is the gap worth?
              </h2>
              <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-4)' }}>
                NexFrontier is being built to help leadership understand where enterprise reality and changing market reality are creating economically material gaps, and whether those gaps represent value to protect, value left unrealised or value newly possible.
              </p>
            </div>
            <div className="nf-ev-final-cta-actions">
              <Button to="/enterprise-value/value-translation-framework">VALUE TRANSLATION FRAMEWORK&trade;</Button>
              <Button to="/foundation-customers" variant="secondary">FOUNDATION CUSTOMERS</Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/enterprise-value" />
    </>
  );
}
