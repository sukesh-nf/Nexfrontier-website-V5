import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { BrainVisual } from '@/components/visual/BrainVisual';
import { HeroProvocation } from '@/components/ui/HeroProvocation';

export const metadata = pageMetadata({
  path: '/',
  title: 'NexFrontier | Enterprise Navigation for AI-mediated markets',
  description: 'NexFrontier is building the intelligence to expose the gap between enterprise reality and what increasingly AI-mediated markets require, translating that gap into enterprise value.',
});

const PROOF_PATHWAY = ['Assumption', 'Customer validation', 'Evidence', 'Paid validation', 'Repeatable proof'];

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 80px)',
  paddingBottom: 'clamp(48px, 5.5vw, 80px)',
};

export default function HomePage() {
  return (
    <>
      {/* ── SECTION 1: Hero ── */}
      <section style={{
        paddingTop: 'clamp(56px, 7vw, 104px)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        borderBottom: '1px solid var(--nf-border)',
      }}>
        <Container>
          <div className="nf-hero-split">
            <div>
              <Eyebrow>THE MARKET IS CHANGING</Eyebrow>
              <h1 style={{
                fontSize: 'var(--nf-text-hero-h1)', lineHeight: 'var(--nf-leading-hero)',
                fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
              }}>
                <span style={{ color: 'var(--nf-cyan)' }}>Intelligence for</span><br />AI-mediated<br />markets.
              </h1>
              <HeroProvocation />
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '540px', marginTop: 'var(--nf-space-5)' }}>
                NexFrontier is building the intelligence to expose the gap between enterprise reality and what increasingly AI-mediated markets require, translating that gap into enterprise value.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', maxWidth: '540px', marginTop: 'var(--nf-space-4)' }}>
                Understand where enterprise value remains unrealised, where market change may create new opportunity, and where leadership needs to steer next.
              </p>
              <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button to="/enterprise-value">Explore Enterprise Value</Button>
                <TextLink to="/where-nexfrontier-fits" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>Where NexFrontier Fits</TextLink>
              </div>
            </div>
            <div>
              <BrainVisual />
            </div>
          </div>
        </Container>
      </section>

      {/* ── SECTION 2: Strategic Disconnect ── */}
      <Section style={tightPad}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>STRATEGIC DISCONNECT</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              The rules are changing faster.
            </h2>
            <p className="nf-pull" style={{ marginTop: 0 }}>
              A business can be performing well against its plan while becoming less aligned to the market forming around it.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 3: Why Now ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY NOW</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              AI is changing the enterprise and the market at the same time.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Internal AI can improve efficiency, productivity, speed and capacity. External AI can change the market conditions the enterprise competes within.
            </p>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-primary)', fontWeight: 500, marginBottom: 'var(--nf-space-5)' }}>
              Internal AI can improve how the business operates. External AI can change the market the business operates in.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              Those two rates and directions of change are not necessarily aligned.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              The enterprise is moving faster. The market may be accelerating faster still.
            </p>
          </div>

          {/* Research evidence block */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--nf-space-5)', marginBottom: 'var(--nf-space-5)' }} className="nf-evidence-grid">
            <div style={{
              padding: 'var(--nf-space-5) var(--nf-space-6)', background: 'var(--nf-bg-surface-3)',
              border: '1px solid var(--nf-border-strong)', borderRadius: 'var(--nf-radius-panel)',
              borderLeft: '2px solid var(--nf-cyan)',
            }}>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-3)' }}>
                McKinsey&rsquo;s research points to a market where AI is moving beyond assistance and increasingly shaping which options customers consider, which businesses remain in contention, and how buying decisions progress. Its estimate that agentic commerce could mediate $3 trillion to $5 trillion of global consumer commerce by 2030 gives a sense of the scale of that shift.
              </p>
              <span style={{ fontSize: '0.8125rem', color: 'var(--nf-text-secondary)', fontWeight: 600 }}>
                Source: McKinsey, 2026
              </span>
            </div>
            <div style={{
              padding: 'var(--nf-space-5) var(--nf-space-6)', background: 'var(--nf-bg-surface-3)',
              border: '1px solid var(--nf-border-strong)', borderRadius: 'var(--nf-radius-panel)',
              borderLeft: '2px solid var(--nf-cyan)',
            }}>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-3)' }}>
                Deloitte is seeing the same direction of travel. Discovery, decision-making and transaction are beginning to move through AI intermediaries, while 68% of retailers expect to adopt agentic AI for key activities within the next 12 to 24 months.
              </p>
              <span style={{ fontSize: '0.8125rem', color: 'var(--nf-text-secondary)', fontWeight: 600 }}>
                Source: Deloitte, 2026
              </span>
            </div>
          </div>

          <div className="nf-body-width">
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/hyper-accelerating-markets" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>HYPER-ACCELERATING MARKETS</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 4: Enterprise Navigation ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>ENTERPRISE NAVIGATION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              New game. New navigational intelligence.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              AI-mediated markets can change who or what participates in a decision, whether a business is found, what evidence is trusted, how alternatives are compared and increasingly how transactions are completed.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              NexFrontier is building Enterprise Navigation for AI-mediated markets.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 5: Enterprise Navigational Intelligence ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>ENTERPRISE NAVIGATIONAL INTELLIGENCE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Know whether the enterprise is keeping pace with the market around it.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              NexFrontier is building Enterprise Navigational Intelligence for leadership, grounded in Operational Observability across the business and its changing market.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              It helps expose where enterprise reality and market reality are diverging, what that gap may mean economically, and where leadership attention is required.
            </p>
            <p className="nf-pull" style={{ marginTop: 0 }}>
              The purpose is not more visibility. It is better strategic judgement as the market continues to move.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-5)' }}>
              Operational Observability makes the changing relationship between enterprise reality and market reality visible. Enterprise Navigational Intelligence turns that evidence into strategic and economic meaning.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 6: Economic Alignment ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container wide>
          <Eyebrow>ECONOMIC ALIGNMENT</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
            The gap only matters when it matters economically.
          </h2>
          <div className="nf-body-width">
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              NexFrontier is being built to identify where gaps between enterprise reality and market reality are creating, protecting or quietly losing value.
            </p>
          </div>
          <div className="nf-premium-pair" style={{ marginBottom: 'var(--nf-space-5)' }}>
            <div className="nf-premium-card">
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>Quiet Loss&trade;</h3>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
                Quiet Loss&trade; is enterprise value that remains unrealised because the enterprise is not fully aligned to the market opportunity available to it.
              </p>
            </div>
            <div className="nf-premium-card">
              <h3 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>Adaptive Value&trade;</h3>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
                Adaptive Value&trade; is additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.
              </p>
            </div>
          </div>
          <div className="nf-body-width">
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink to="/enterprise-value/calculator">Try the Enterprise Value Calculator</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 7: Readiness and Capability ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>READINESS AND CAPABILITY</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Being ready once is not enough.
            </h2>
            <div className="nf-ec-distinction" style={{ marginTop: 'var(--nf-space-5)' }}>
              <div className="nf-ec-distinction-item">
                <p className="nf-ec-distinction-label">Operational Readiness</p>
                <p className="nf-ec-distinction-desc">
                  The evidenced state of how well the operating enterprise is aligned to what its current market requires.
                </p>
              </div>
              <div className="nf-ec-distinction-divider" />
              <div className="nf-ec-distinction-item">
                <p className="nf-ec-distinction-label">Enterprise Capability</p>
                <p className="nf-ec-distinction-desc">
                  The ability to recognise material market change, understand its economic consequence, decide what deserves a response, adapt in ways that can be shown to create value, and learn.
                </p>
              </div>
            </div>
            <p className="nf-pull" style={{ marginTop: 'var(--nf-space-5)' }}>
              Readiness is the state. Capability is the ability to keep earning it.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 8: Where NexFrontier Fits ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHERE NEXFRONTIER FITS</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              You may already have the tools. That does not mean you have the visibility.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              Existing systems tell you what happened inside the business. NexFrontier is being built to help leadership understand what that means against a market that is still moving.
            </p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <TextLink to="/where-nexfrontier-fits" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>Where NexFrontier Fits</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 9: Who NexFrontier Is For ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHO NEXFRONTIER IS FOR</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Where small gaps become material.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              NexFrontier is initially designed for established operating businesses where even small differences between enterprise reality and market reality can carry meaningful economic consequence.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              That will often mean businesses generating around $10 million or more in annual revenue, although revenue is not the only determinant.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              We also work selectively with growth companies where founders, Boards or portfolio investors want market alignment built into the business before complexity compounds.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 10: Evidence Before Claim ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>EVIDENCE BEFORE CLAIM</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Evidence before claim.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              We are validating where the gap is economically material, what leadership can act on, and where repeatable value can be proven.
            </p>

            {/* Proof pathway */}
            <div className="nf-fc-progression" style={{ marginBottom: 'var(--nf-space-5)' }}>
              {PROOF_PATHWAY.map((step, i) => (
                <span key={i} style={{ display: 'contents' }}>
                  <div className="nf-fc-progression-item">
                    <p className="nf-fc-progression-label">{step}</p>
                  </div>
                  {i < PROOF_PATHWAY.length - 1 && <div className="nf-fc-progression-arrow" />}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <Button to="/foundation-customers" variant="secondary">Foundation Customer Programme</Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── SECTION 11: Final CTA ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.15, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)' }}>
              The enterprise is moving. Is it moving fast enough for the market around it?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-primary)', fontWeight: 500, marginBottom: 'var(--nf-space-5)' }}>
              That is the case for Enterprise Navigational Intelligence.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink to="/market-enquiry">Talk to NexFrontier</TextLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
