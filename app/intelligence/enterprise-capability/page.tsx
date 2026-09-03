import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const metadata = pageMetadata({
  path: '/intelligence/enterprise-capability',
  title: 'Enterprise Capability | Staying ready as AI-mediated markets change',
  description: 'Enterprise Capability is the ability to recognise material market change, understand its economic consequence, decide what deserves a response and adapt where value justifies it.',
});

const cycleSteps = [
  { name: 'Recognise', desc: 'Detect material change, not noise.' },
  { name: 'Understand', desc: 'Determine whether the change has economic consequence.' },
  { name: 'Decide', desc: 'Determine whether action is warranted.' },
  { name: 'Adapt', desc: 'Intervene proportionately where evidence supports it.' },
  { name: 'Learn', desc: 'Determine what changed, what value resulted, and what should inform the next cycle.' },
];

export default function EnterpriseCapabilityPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/enterprise-capability" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '820px' }}>
            <Eyebrow>ENTERPRISE CAPABILITY</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Readiness is a state. Capability is the ability to keep earning it.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '740px', margin: 0 }}>
              Enterprise Capability is the ability to recognise material market change, understand its economic consequence, decide what deserves a response, and adapt in ways that can be shown to create value.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Approved visual — dominant ── */}
      <Section spacing="tight">
        <Container>
          <div className="nf-ec-visual-wrap">
            <img
              src={canonicalVisuals.enterpriseCapability}
              alt="Enterprise Capability cycle diagram showing Recognise, Understand, Decide, Adapt and Learn around a central capability cycle."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── The capability cycle ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE CAPABILITY CYCLE</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)', maxWidth: '680px' }}>
            Recognise &rarr; Understand &rarr; Decide &rarr; Adapt &rarr; Learn
          </h2>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '680px', marginBottom: 'var(--nf-space-7)' }}>
            This is an enterprise capability model, not a software workflow. Each stage deepens judgement about whether change matters and whether action is justified. Learning feeds back into recognition &mdash; the cycle is continuous.
          </p>

          <div className="nf-ec-cycle">
            {cycleSteps.map((step, i) => (
              <div key={step.name} className="nf-ec-cycle-step">
                <div className="nf-ec-cycle-marker">
                  <span className="nf-ec-cycle-num">0{i + 1}</span>
                </div>
                <div className="nf-ec-cycle-content">
                  <h3 className="nf-ec-cycle-name">{step.name}</h3>
                  <p className="nf-ec-cycle-desc">{step.desc}</p>
                </div>
                {i < cycleSteps.length - 1 && <span className="nf-ec-cycle-connector" />}
              </div>
            ))}
            <div className="nf-ec-cycle-feedback">
              <RotateCcw size={16} style={{ color: 'var(--nf-cyan)', flexShrink: 0 }} />
              <span>Learn informs the next cycle of recognition</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Why this matters in AI-mediated markets ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY THIS MATTERS</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              The advantage is not being &ldquo;AI ready&rdquo;. It is better judgement about when change matters.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              As market conditions change faster, the advantage is not simply being &ldquo;AI ready&rdquo;. It is being able to recognise economically meaningful change, decide whether it warrants action, and learn whether the response actually created value.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Readiness vs Capability ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>READINESS VS CAPABILITY</Eyebrow>
          <div className="nf-ec-distinction">
            <div className="nf-ec-distinction-item">
              <h3 className="nf-ec-distinction-label">Readiness</h3>
              <p className="nf-ec-distinction-desc">A point-in-time condition.</p>
            </div>
            <div className="nf-ec-distinction-divider" />
            <div className="nf-ec-distinction-item">
              <h3 className="nf-ec-distinction-label">Capability</h3>
              <p className="nf-ec-distinction-desc">The continuing ability to recognise, decide, adapt and learn as conditions change.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Evidence discipline ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>EVIDENCE DISCIPLINE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Adaptation has no inherent value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Change alone does not justify intervention. Adaptation alone does not prove value. Activity is not evidence of improvement. Learning requires evidence of what happened economically.
            </p>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-primary)', fontWeight: 500, borderLeft: '3px solid var(--nf-cyan)', paddingLeft: 'var(--nf-space-6)', maxWidth: '680px', margin: 0 }}>
              The objective is not continuous change. It is better judgement about when change matters.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Closing CTA ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-ec-cta">
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', maxWidth: '600px', margin: '0 0 var(--nf-space-4)' }}>
              Translate capability into economic meaning.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '580px', marginBottom: 'var(--nf-space-6)' }}>
              Enterprise Capability describes the ability to recognise, decide, adapt and learn. Value Translation Framework&trade; is used to translate that capability and the evidence it produces into commercial meaning.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-3)', flexWrap: 'wrap' }}>
              <Button to="/enterprise-value/value-translation-framework">
                Translate capability into economic meaning <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </Button>
              <Button to="/enterprise-value" variant="secondary">
                Explore Enterprise Value
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/enterprise-capability" />
    </>
  );
}
