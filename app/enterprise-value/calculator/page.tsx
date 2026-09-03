import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { EnterpriseValueCalculator } from '@/components/EnterpriseValueCalculator';

export const metadata = pageMetadata({
  path: '/enterprise-value/calculator',
  title: 'Enterprise Value Calculator | NexFrontier',
  description: 'Explore an illustrative annual value scenario using your business figures and assumptions you choose.',
});

export default function CalculatorPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/enterprise-value/calculator" />
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <Eyebrow>ENTERPRISE VALUE CALCULATOR</Eyebrow>
          <h1 style={{
            fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
            fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
            margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
          }}>
            Start with what you know.
          </h1>
          <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
            Enter a few annual business figures, then apply assumptions to explore where value may already be going unrealised and what additional value may become possible as your market changes.
          </p>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
            Your numbers establish the baseline. Your assumptions create the scenario.
          </p>
          <div style={{
            marginTop: 'var(--nf-space-5)', padding: '12px 16px',
            background: 'var(--nf-bg-surface-1)', border: '1px solid var(--nf-border)',
            borderRadius: 'var(--nf-radius-control)',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>
              All calculator results are illustrative annual scenarios, not diagnoses, forecasts or company valuations.
            </p>
          </div>
        </Container>
      </Section>

      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <EnterpriseValueCalculator />
        </Container>
      </Section>

      <BottomContextNav path="/enterprise-value/calculator" />
    </>
  );
}
