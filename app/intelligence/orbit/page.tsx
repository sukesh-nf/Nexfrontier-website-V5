import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const metadata = pageMetadata({
  path: '/intelligence/orbit',
  title: 'ORBIT™ | NexFrontier customer value journey',
  description: 'ORBIT™ is NexFrontier\'s customer value journey for gaining, proving and compounding value over time.',
});

const stages = [
  {
    name: 'Observe',
    desc: 'Begin by watching what actually happens in the customer\'s environment — where value may be created, lost or missed.',
    shifts: 'From assumption to observed reality.',
  },
  {
    name: 'Reveal',
    desc: 'Patterns emerge from observation. The goal is to surface where economically meaningful opportunity may exist.',
    shifts: 'From observation to recognised pattern.',
  },
  {
    name: 'Build',
    desc: 'Capability is developed to act on what has been revealed — through process, people, technology or orchestration.',
    shifts: 'From recognised pattern to deliberate capability.',
  },
  {
    name: 'Improve',
    desc: 'Capability is refined as evidence accumulates. Earlier assumptions are tested against what actually happens.',
    shifts: 'From initial capability to stronger, evidence-backed capability.',
  },
  {
    name: 'Trust',
    desc: 'Trust is earned when repeated, evidence-backed outcomes create confidence that value is real and compounding.',
    shifts: 'From evidence-backed outcomes to earned trust.',
  },
];

const vtfLenses = [
  { name: 'Defensive Value', desc: 'Protecting existing revenue and customer relationships from erosion.' },
  { name: 'Offensive Value', desc: 'Capturing new opportunity created by changing market conditions.' },
  { name: 'Revenue Health', desc: 'Whether revenue quality, mix and pipeline are improving or deteriorating.' },
  { name: 'Customer Lifetime Value', desc: 'How changing customer intent and expectations affect long-term value.' },
  { name: 'Enterprise Capability', desc: 'Whether the organisation can adapt fast enough to capture what is possible.' },
];

export default function OrbitPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/orbit" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '820px' }}>
            <Eyebrow>ORBIT™</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              A customer value journey for gaining, proving and compounding value over time.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '740px', margin: 0 }}>
              ORBIT&trade; is NexFrontier&rsquo;s customer value journey. It describes how a customer progressively develops capability, evidence and trust &mdash; not a guaranteed outcome, but a structured path from observation to earned confidence.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── ORBIT visual — dominant explanatory element ── */}
      <Section spacing="tight">
        <Container>
          <div className="nf-orbit-visual-wrap">
            <img
              src={canonicalVisuals.orbit}
              alt="ORBIT customer capability journey diagram showing the progression from Observe to Reveal to Build to Improve to Trust, with evidence and capability compounding over time."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── The five stages ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE JOURNEY</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
            Observe &rarr; Reveal &rarr; Build &rarr; Improve &rarr; Trust
          </h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '680px', marginBottom: 'var(--nf-space-7)' }}>
            Each stage deepens what the customer knows and can do. Evidence becomes stronger, capability improves, and trust is earned &mdash; not assumed. Not every customer reaches Trust, and no stage automatically creates financial value.
          </p>

          <div className="nf-orbit-stages">
            {stages.map((stage, i) => (
              <div key={stage.name} className="nf-orbit-stage">
                <div className="nf-orbit-stage-number">0{i + 1}</div>
                <div className="nf-orbit-stage-body">
                  <h3 className="nf-orbit-stage-name">{stage.name}</h3>
                  <p className="nf-orbit-stage-desc">{stage.desc}</p>
                  <div className="nf-orbit-stage-shift">{stage.shifts}</div>
                </div>
                {i < stages.length - 1 && <ChevronRight className="nf-orbit-stage-arrow" size={20} />}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Why trust must be earned ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY TRUST MUST BE EARNED</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Value compounds only when the evidence supports it.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              A faster workflow is not automatically better. More automation is not automatically better. A new process is not automatically worthwhile.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              ORBIT&trade; keeps the customer capability journey connected to the economic question: what value could this protect, recover or increase, and is that value material enough to warrant attention?
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Secondary context: economic lenses ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-orbit-context-panel">
            <div className="nf-orbit-context-intro">
              <Eyebrow>ECONOMIC CONTEXT</Eyebrow>
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)', maxWidth: '600px' }}>
                Value can be considered through multiple economic lenses as the customer progresses.
              </h2>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
                These lenses help frame where value may appear during the ORBIT&trade; journey. The translation framework itself sits separately under Enterprise Value.
              </p>
              <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', fontStyle: 'italic' }}>
                ORBIT&trade; describes how customer capability and value may develop over time. Value Translation Framework&trade; is used to translate relevant market, customer and enterprise evidence into commercial meaning.
              </p>
              <div style={{ marginTop: 'var(--nf-space-6)' }}>
                <Button to="/enterprise-value/value-translation-framework">Explore Value Translation Framework&trade;</Button>
              </div>
            </div>
            <div className="nf-orbit-context-lenses">
              {vtfLenses.map((lens) => (
                <div key={lens.name} className="nf-orbit-lens-item">
                  <span className="nf-orbit-lens-name">{lens.name}</span>
                  <span className="nf-orbit-lens-desc">{lens.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Closing CTA ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-orbit-cta">
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', maxWidth: '600px', margin: '0 0 var(--nf-space-4)' }}>
              Understand how ORBIT&trade; connects to Enterprise Value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '580px', marginBottom: 'var(--nf-space-6)' }}>
              ORBIT&trade; structures the customer journey. Enterprise Value brings the economic question &mdash; Quiet Loss&trade;, Adaptive Value&trade; and the adjustments that turn gross opportunity into an illustrative estimate.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-3)', flexWrap: 'wrap' }}>
              <Button to="/enterprise-value">
                Explore Enterprise Value <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </Button>
              <Button to="/enterprise-value/value-translation-framework" variant="secondary">
                Explore Value Translation Framework&trade;
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/orbit" />
    </>
  );
}
