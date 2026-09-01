import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { ContinueExploringIntelligence } from '@/components/ui/ContinueExploringIntelligence';
import { canonicalVisuals } from '@/data/assets';

export const metadata = pageMetadata({
  path: '/intelligence/the-brain',
  title: 'The Brain | NexFrontier Intelligence',
  description: 'The Brain is NexFrontier\'s emerging intelligence capability for connecting evidence across customer intent, enterprise response and outcome to learn what may matter.',
});

export default function TheBrainPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/the-brain" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div className="nf-hero-split">
            <div>
              <Eyebrow>THE BRAIN</Eyebrow>
              <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
                Connect the evidence. Learn what matters.
              </h1>
              <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '540px', margin: 0 }}>
                The Brain is NexFrontier&apos;s emerging intelligence capability.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '540px', marginTop: 'var(--nf-space-4)' }}>
                Its role is to bring relevant evidence together across customer intent, enterprise response and outcome so patterns can be understood in context rather than as isolated events.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '540px', marginTop: 'var(--nf-space-4)' }}>
                The objective is not more data. It is better understanding of what may be changing, what matters economically and what deserves attention.
              </p>
            </div>
            <div>
              <img
                src={canonicalVisuals.brain}
                alt="The Brain strategic intelligence framework connecting external AI and AI-mediated markets with internal enterprise response to translate market change into Enterprise Value."
                style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Section 2: Why it exists ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY IT EXISTS</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Businesses already have data. The problem is often the connection.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Signals can sit across:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {['enquiries', 'conversations', 'systems', 'teams', 'handoffs', 'actions', 'outcomes'].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Each may be visible independently. The underlying customer intent and economic story may not be.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              The Brain is being designed to help reconnect that context.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Section 3: What it seeks to learn ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHAT IT SEEKS TO LEARN</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Patterns become useful when they change a decision.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              The Brain is intended to help surface questions such as:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--nf-space-4) 0' }}>
              {[
                'Is the opportunity reaching the business changing?',
                'Where is context being preserved or lost?',
                'Which patterns are associated with meaningful progression?',
                'Where may value be weakened or unrealised?',
                'Which differences appear economically material?',
                'What deserves human attention?',
              ].map((item) => (
                <li key={item} style={{ padding: '5px 0', fontSize: 'var(--nf-text-body)', color: 'var(--nf-text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nf-cyan)', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', fontStyle: 'italic' }}>
              These are not guaranteed current capabilities. The Brain is intended to, is being designed to, and NexFrontier is testing whether these questions can be answered with real business evidence.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Section 4: Human judgement ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>HUMAN JUDGEMENT</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Intelligence informs the decision. It does not make every decision.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              A finding is not automatically an intervention. The cause may sit in people, process, capacity, experience, product, technology or somewhere else.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              Sometimes the evidence may show that no intervention is economically justified. That is why Human in the Lead is part of the design.
            </p>
            <Button to="/intelligence/human-in-the-lead">Explore Human in the Lead</Button>
          </div>
        </Container>
      </Section>

      {/* ── Section 5: The value connection ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE VALUE CONNECTION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
              What matters must ultimately translate into Enterprise Value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-6)' }}>
              The Value Translation Framework&trade; provides the value translation lens.
            </p>
            <Button to="/enterprise-value/value-translation-framework">Explore Value Translation Framework&trade;</Button>
            <ContinueExploringIntelligence links={[
              { label: 'Intent Threads™', path: '/intelligence/intent-threads' },
              { label: 'ORBIT™', path: '/intelligence/orbit' },
              { label: 'Human in the Lead', path: '/intelligence/human-in-the-lead' },
            ]} />
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/the-brain" />
    </>
  );
}
