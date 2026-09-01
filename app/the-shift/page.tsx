import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb } from '@/components/ui/ContextNavigation';
import { LeadershipPulseInvitation } from '@/components/ui/LeadershipPulseInvitation';

export const metadata = pageMetadata({
  path: '/the-shift',
  title: 'The Shift | How AI is changing markets and customer choice | NexFrontier',
  description: 'AI may change the magnitude, rate and state of market change. Why that creates the need for Enterprise Navigational Intelligence.',
});

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 80px)',
  paddingBottom: 'clamp(48px, 5.5vw, 80px)',
};

const h2Style: React.CSSProperties = {
  fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15,
  color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
};

export default function ShiftPage() {
  return (
    <>
      <section style={{ paddingTop: 'var(--nf-space-4)' }}>
        <Container>
          <TopBreadcrumb path="/the-shift" />
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
              <Eyebrow>THE SHIFT</Eyebrow>
              <h1 style={{
                fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
                fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}>
                The market is not just changing. It is changing more, and changing faster.
              </h1>
              <p className="nf-me-body" style={{ marginTop: 0 }}>
                Markets have always changed.
              </p>
              <p className="nf-me-body">
                What is different now is the potential magnitude, rate and state of that change.
              </p>
              <p className="nf-me-body">
                AI can increase how much markets change, how quickly they change, and how the mechanisms through which markets operate may themselves evolve.
              </p>
              <p className="nf-me-body">
                As AI increases the capability and responsiveness of customers, competitors, platforms and other market participants, their reactions can create further change.
              </p>
              <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)' }}>
                The strategic issue is no longer simply whether markets move. It is whether the enterprise can keep pace with a market that may become more dynamic, more capable and hyper-accelerated.
              </p>
              <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button to="/hyper-accelerating-markets">HYPER-ACCELERATING MARKETS</Button>
                <TextLink to="/where-nexfrontier-fits">Where NexFrontier Fits</TextLink>
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

      {/* ── 2. WHY THIS SHIFT IS DIFFERENT ── */}
      <Section style={tightPad}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>WHY THIS SHIFT IS DIFFERENT</Eyebrow>
            <h2 style={h2Style}>AI may change the magnitude, rate and state of market change.</h2>
            <p className="nf-me-body" style={{ marginTop: 0 }}>
              Technology has changed markets before.
            </p>
            <p className="nf-me-body">
              What may be different in the AI era is that intelligence is increasing across many participants in the market at the same time.
            </p>
            <p className="nf-me-body">
              Customers can become more capable. Competitors can respond faster. Platforms can adapt. AI systems can increasingly participate directly in discovery, evaluation, choice and transaction.
            </p>
          </div>
          <div className="nf-shift-dimensions">
            <div className="nf-shift-dim">
              <span className="nf-shift-dim-label">MAGNITUDE</span>
              <p className="nf-shift-dim-body">More can change at once as capabilities expand across the market.</p>
            </div>
            <div className="nf-shift-dim">
              <span className="nf-shift-dim-label">RATE</span>
              <p className="nf-shift-dim-body">Market responses can happen faster as participants become more capable and more responsive.</p>
            </div>
            <div className="nf-shift-dim">
              <span className="nf-shift-dim-label">STATE</span>
              <p className="nf-shift-dim-body">The mechanisms through which markets operate can themselves change, including how businesses are presented, evaluated, trusted, chosen and transacted with.</p>
            </div>
          </div>
          <div className="nf-shift-strong-close">
            <p className="nf-shift-strong-line">Change can create more change.</p>
            <p className="nf-shift-strong-sub">Capabilities improve. Reactions accelerate. Markets evolve.</p>
          </div>
          <div style={{ marginTop: 'var(--nf-space-5)' }}>
            <TextLink to="/hyper-accelerating-markets">Understand Hyper-Accelerating Markets</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── 3. INTERNAL AI. EXTERNAL AI. ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>INTERNAL AI. EXTERNAL AI.</Eyebrow>
            <h2 style={h2Style}>AI is increasing intelligence everywhere.</h2>
          </div>
          <div className="nf-shift-ai-split">
            <div className="nf-shift-ai-side">
              <span className="nf-shift-ai-label">INSIDE THE ENTERPRISE</span>
              <h3 className="nf-shift-ai-heading">Internal AI</h3>
              <p className="nf-shift-ai-body">AI can improve speed, productivity, capacity, automation and decision-making.</p>
              <p className="nf-shift-ai-close">The enterprise can direct this.</p>
            </div>
            <div className="nf-shift-ai-divider" />
            <div className="nf-shift-ai-side">
              <span className="nf-shift-ai-label">OUTSIDE THE ENTERPRISE</span>
              <h3 className="nf-shift-ai-heading">External AI</h3>
              <p className="nf-shift-ai-body">AI can change how customers discover, evaluate and choose, how competitors respond, how platforms behave and how market opportunity forms.</p>
              <p className="nf-shift-ai-close">The enterprise does not control this.</p>
            </div>
          </div>
          <p className="nf-shift-full-statement">
            The enterprise is not adapting in isolation. It is adapting inside a market that is becoming more intelligent, more dynamic and potentially much faster at the same time.
          </p>
          <div style={{ marginTop: 'var(--nf-space-5)' }}>
            <TextLink to="/intelligence">Explore Intelligence</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── 4. KEEPING PACE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-shift-keeping-pace">
            <div className="nf-shift-keeping-pace-copy">
              <Eyebrow>KEEPING PACE</Eyebrow>
              <h2 style={h2Style}>The enterprise can be improving and still lose ground.</h2>
              <p className="nf-me-body" style={{ marginTop: 0 }}>
                Improvement inside the enterprise does not automatically mean the business is keeping pace with the market around it.
              </p>
              <p className="nf-me-body">
                If the market is changing faster, moving in a different direction or creating value through new mechanisms, the enterprise can execute well against its own plan while its relative position weakens.
              </p>
              <p className="nf-me-emphasis">
                If the market is changing faster, how do you know whether the enterprise is adapting fast enough?
              </p>
              <p className="nf-me-emphasis" style={{ color: 'var(--nf-cyan)' }}>
                You cannot judge the speed of the enterprise without knowing the speed and direction of the market around it.
              </p>
              <div style={{ marginTop: 'var(--nf-space-5)' }}>
                <TextLink to="/hyper-accelerating-markets">Hyper-Accelerating Markets</TextLink>
              </div>
            </div>
            <div className="nf-shift-keeping-pace-visual">
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
      </Section>

      {/* ── Leadership Pulse invitation ── */}
      <Section style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Container>
          <LeadershipPulseInvitation source="the_shift" />
        </Container>
      </Section>

      {/* ── 5. MARKET ELIGIBILITY ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <div className="nf-shift-eyebrow-row">
              <Eyebrow style={{ marginBottom: 0 }}>MARKET ELIGIBILITY</Eyebrow>
              <span className="nf-shift-badge">UNDER VALIDATION</span>
            </div>
            <h2 style={h2Style}>Being found is not the same as being presented.</h2>
            <p className="nf-me-body" style={{ marginTop: 0 }}>
              As AI increasingly mediates discovery, evaluation and choice, a business may need to remain capable of being presented, considered, trusted and selected.
            </p>
            <p className="nf-me-body">
              That creates a strategic question beyond traditional visibility.
            </p>
            <p className="nf-me-body">
              A business may remain technically discoverable while becoming less eligible for opportunities created through AI-mediated markets.
            </p>
            <p className="nf-me-emphasis">
              Does the enterprise still present enough evidence, capability and confidence to remain eligible for consideration?
            </p>
            <p className="nf-shift-clarification">This is an enterprise capability question.</p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/where-nexfrontier-fits">See Where NexFrontier Fits</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. THE VALUE GAP ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>THE VALUE GAP</Eyebrow>
            <h2 style={h2Style}>The gap only matters when it matters economically.</h2>
            <p className="nf-me-body" style={{ marginTop: 0 }}>
              The Value Gap is the distance between enterprise reality and changing market reality.
            </p>
            <p className="nf-me-body">
              That gap may widen while the enterprise is still improving.
            </p>
            <p className="nf-me-body">
              But not every difference deserves action. The leadership question is whether the gap is economically material.
            </p>
          </div>
          <div className="nf-shift-value-grid">
            <div className="nf-shift-value-item">
              <span className="nf-shift-value-label">VALUE LEFT UNREALISED</span>
              <p className="nf-shift-value-body">Opportunity may exist that the enterprise is not fully positioned to capture.</p>
            </div>
            <div className="nf-shift-value-item">
              <span className="nf-shift-value-label">HIGHER COST TO HOLD POSITION</span>
              <p className="nf-shift-value-body">More effort or capital may be required simply to maintain the same market outcome.</p>
            </div>
            <div className="nf-shift-value-item">
              <span className="nf-shift-value-label">WEAKENING RELATIVE POSITION</span>
              <p className="nf-shift-value-body">Internal performance may remain acceptable while competitiveness deteriorates.</p>
            </div>
            <div className="nf-shift-value-item">
              <span className="nf-shift-value-label">NEW VALUE MADE POSSIBLE</span>
              <p className="nf-shift-value-body">Changing market conditions may create opportunity the enterprise could not previously access.</p>
            </div>
          </div>
          <div style={{ marginTop: 'var(--nf-space-6)' }}>
            <Button to="/enterprise-value" variant="secondary">Explore Enterprise Value</Button>
          </div>
        </Container>
      </Section>

      {/* ── 7. ADAPTATION ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>ADAPTATION</Eyebrow>
            <h2 style={h2Style}>The advantage is not speed. It is knowing how fast to adapt, and when.</h2>
            <p className="nf-me-body" style={{ marginTop: 0 }}>
              Businesses have always adapted.
            </p>
            <p className="nf-me-body">
              What changes in the AI era is the potential rate at which market conditions can change, and the possibility that the enterprise may still be adapting when the market changes again.
            </p>
            <p className="nf-me-body">
              Faster markets do not automatically require faster action. They require leadership to shorten the time between meaningful market change, awareness of its consequence and an economically justified response.
            </p>
          </div>
          <p className="nf-shift-principle">Adaptive speed with economic judgement.</p>
          <div className="nf-shift-responses">
            <div className="nf-shift-response">
              <span className="nf-shift-response-label">MOVE</span>
              <p className="nf-shift-response-body">When the evidence shows the market has changed materially and the economics justify action.</p>
            </div>
            <div className="nf-shift-response">
              <span className="nf-shift-response-label">WAIT</span>
              <p className="nf-shift-response-body">When the direction remains uncertain or the economic consequence has not yet earned commitment.</p>
            </div>
            <div className="nf-shift-response">
              <span className="nf-shift-response-label">HOLD COURSE</span>
              <p className="nf-shift-response-body">When the evidence shows the current direction remains appropriate.</p>
            </div>
          </div>
          <div className="nf-shift-cta-pair">
            <TextLink to="/intelligence">Explore Intelligence</TextLink>
            <TextLink to="/market-enquiry?topic=leadership-conversation">Talk to NexFrontier</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── 8. PERFORMANCE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>PERFORMANCE</Eyebrow>
            <h2 style={h2Style}>You can hit every target and still lose ground.</h2>
            <p className="nf-me-body" style={{ marginTop: 0 }}>
              Performance tells leadership how the enterprise performed against its plan.
            </p>
            <p className="nf-me-body">
              Enterprise Navigational Intelligence asks what that performance means against the market opportunity now available.
            </p>
            <p className="nf-me-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>
              A business can perform well against its own plan while becoming less competitive in its market.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 9. WHERE NEXFRONTIER FITS ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-me-content" style={{ maxWidth: '760px' }}>
            <Eyebrow>WHERE NEXFRONTIER FITS</Eyebrow>
            <h2 style={h2Style}>The enterprise is moving. Is it moving fast enough for the market around it?</h2>
            <p className="nf-me-emphasis" style={{ marginTop: 0 }}>
              That is the navigational problem NexFrontier is being built to help leadership see more clearly.
            </p>
            <p className="nf-me-body" style={{ marginTop: 'var(--nf-space-5)' }}>
              NexFrontier is building Enterprise Navigational Intelligence to help leadership understand where enterprise reality may be falling out of step with changing market reality, what that may mean economically, and where to steer next.
            </p>
          </div>
          <div className="nf-shift-progression nf-shift-progression--lg">
            <div className="nf-shift-prog-step nf-shift-prog-step--lg">
              <h3 className="nf-shift-prog-name nf-shift-prog-name--lg">Operational Observability</h3>
              <p className="nf-shift-prog-desc nf-shift-prog-desc--lg">provides the evidence.</p>
            </div>
            <span className="nf-shift-prog-arrow nf-shift-prog-arrow--lg" aria-hidden="true">&rarr;</span>
            <div className="nf-shift-prog-step nf-shift-prog-step--lg">
              <h3 className="nf-shift-prog-name nf-shift-prog-name--lg">Strategic Visibility</h3>
              <p className="nf-shift-prog-desc nf-shift-prog-desc--lg">makes the material relationship visible.</p>
            </div>
            <span className="nf-shift-prog-arrow nf-shift-prog-arrow--lg" aria-hidden="true">&rarr;</span>
            <div className="nf-shift-prog-step nf-shift-prog-step--lg nf-shift-prog-step--eni">
              <h3 className="nf-shift-prog-name nf-shift-prog-name--lg">Enterprise Navigational Intelligence</h3>
              <p className="nf-shift-prog-desc nf-shift-prog-desc--lg">helps leadership understand what it means and where to steer.</p>
            </div>
            <span className="nf-shift-prog-arrow nf-shift-prog-arrow--lg" aria-hidden="true">&rarr;</span>
            <div className="nf-shift-prog-step nf-shift-prog-step--lg">
              <h3 className="nf-shift-prog-name nf-shift-prog-name--lg">Enterprise Value</h3>
              <p className="nf-shift-prog-desc nf-shift-prog-desc--lg">determines whether the consequence matters economically.</p>
            </div>
          </div>
          <div className="nf-shift-principle-block">
            <p className="nf-shift-principle-line">First know. Then act.</p>
            <p className="nf-shift-principle-sub">Moving early does not mean acting before the evidence. It means seeking the evidence before the cost of learning late becomes greater.</p>
            <p className="nf-shift-principle-sub" style={{ marginTop: 'var(--nf-space-3)', color: 'var(--nf-cyan)' }}>If that question is becoming relevant to your enterprise, start with the evidence.</p>
          </div>
          <div className="nf-shift-final-ctas">
            <Button to="/intelligence">Explore Intelligence</Button>
            <Button to="/foundation-customers" variant="secondary">Foundation Customers</Button>
            <TextLink to="/market-enquiry?topic=leadership-conversation">Talk to NexFrontier</TextLink>
          </div>
        </Container>
      </Section>

      {/* ── Bottom Context Navigation ── */}
      <section style={{ borderTop: '1px solid var(--nf-border)', paddingTop: '20px', paddingBottom: '20px' }}>
        <Container>
          <div className="nf-me-context-nav">
            <Link href="/" className="nf-me-context-nav-link">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link href="/hyper-accelerating-markets" className="nf-me-context-nav-link">
              Next: Hyper-Accelerating Markets <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
