import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button } from '@/components/ui/Button';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { canonicalVisuals } from '@/data/assets';
import { ArrowRight } from 'lucide-react';

export const metadata = pageMetadata({
  path: '/intelligence/human-in-the-lead',
  title: 'Human in the Lead | Evidence-led decisions at NexFrontier',
  description: 'Human in the Lead is NexFrontier\'s principle that intelligence should inform judgement, while evidence and enterprise value determine whether intervention is warranted.',
});

export default function HumanInTheLeadPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/intelligence/human-in-the-lead" />
        </Container>
      </Section>

      {/* ── Hero ── */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: '820px' }}>
            <Eyebrow>HUMAN IN THE LEAD</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Where human judgement becomes more important as AI takes on more of the work.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '740px', margin: 0 }}>
              Human in the Lead is not a governance framework or a slogan about keeping humans &ldquo;in the loop&rdquo;. It is a NexFrontier perspective on where human judgement matters most &mdash; as strategist, relationship builder and decision-maker where context, consequence and judgement count.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Approved visual — prominent ── */}
      <Section spacing="tight">
        <Container>
          <div className="nf-hitl-visual-wrap">
            <img
              src={canonicalVisuals.humanInTheLead}
              alt="Human in the Lead diagram showing AI-mediated market signals flowing through NexFrontier intelligence and leadership judgement to enterprise outcomes."
              style={{ width: '100%', borderRadius: 'var(--nf-radius-panel)', display: 'block' }}
            />
          </div>
        </Container>
      </Section>

      {/* ── The principle — visually dominant ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <Eyebrow>THE PRINCIPLE</Eyebrow>
          <div className="nf-hitl-principle-block">
            <p className="nf-hitl-principle-statement">
              Evidence determines the intervention. Value determines whether it was worth doing.
            </p>
            <div className="nf-hitl-principle-flow">
              <div className="nf-hitl-principle-step">
                <span className="nf-hitl-principle-label">Evidence</span>
                <span className="nf-hitl-principle-desc">tells us what is actually happening</span>
              </div>
              <span className="nf-hitl-principle-arrow" />
              <div className="nf-hitl-principle-step">
                <span className="nf-hitl-principle-label">Judgement</span>
                <span className="nf-hitl-principle-desc">determines whether intervention is warranted</span>
              </div>
              <span className="nf-hitl-principle-arrow" />
              <div className="nf-hitl-principle-step">
                <span className="nf-hitl-principle-label">Value</span>
                <span className="nf-hitl-principle-desc">determines whether the response created meaningful economic benefit</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Why the human matters more, not less ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>WHY THE HUMAN MATTERS MORE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              As AI takes on more execution, analysis and interaction, the human role shifts toward judgement.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-5)' }}>
              The uniquely human role is not manual approval of every AI action. It is:
            </p>
            <ul className="nf-hitl-role-list">
              {[
                'interpreting context',
                'exercising judgement',
                'making trade-offs',
                'building trust and relationships',
                'deciding when intervention is justified',
                'taking responsibility for economically meaningful outcomes',
              ].map((item) => (
                <li key={item} className="nf-hitl-role-item">
                  <span className="nf-hitl-role-marker" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ── AI-mediated markets ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>AI-MEDIATED MARKETS</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Judgement matters more when signals arrive faster and carry more context.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              In AI-mediated markets, customer intent may arrive with more context. AI may act faster than traditional operating processes. Operational weaknesses may become more consequential. Human judgement is required to distinguish meaningful signals from noise.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Evidence discipline ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>EVIDENCE DISCIPLINE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '680px' }}>
              Action is not the same as progress.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginBottom: 'var(--nf-space-4)' }}>
              Intervention is not the same as value. Automation is not evidence of improvement. Value must ultimately be demonstrated through outcomes.
            </p>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-primary)', fontWeight: 500, borderLeft: '3px solid var(--nf-cyan)', paddingLeft: 'var(--nf-space-6)', maxWidth: '680px', margin: 0 }}>
              Evidence before claim.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Closing CTA ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-hitl-cta">
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, color: 'var(--nf-text-primary)', maxWidth: '600px', margin: '0 0 var(--nf-space-4)' }}>
              Human judgement connects capability to economic value.
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '580px', marginBottom: 'var(--nf-space-6)' }}>
              Human in the Lead is the perspective that runs through Enterprise Capability and Enterprise Value &mdash; ensuring judgement, not automation, determines what deserves action.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-3)', flexWrap: 'wrap' }}>
              <Button to="/intelligence/enterprise-capability">
                Explore Enterprise Capability <ArrowRight size={16} style={{ marginLeft: '6px', verticalAlign: 'middle' }} />
              </Button>
              <Button to="/enterprise-value" variant="secondary">
                Explore Enterprise Value
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/intelligence/human-in-the-lead" />
    </>
  );
}
