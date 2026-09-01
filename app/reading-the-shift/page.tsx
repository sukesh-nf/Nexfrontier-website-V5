import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { ReadingTheShiftHub } from '@/components/ReadingTheShiftHub';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { Button, TextLink } from '@/components/ui/Button';

export const metadata = pageMetadata({
  path: '/reading-the-shift',
  title: 'Reading The Shift | Questions about AI-mediated markets | NexFrontier',
  description: 'Questions, evidence and perspectives for understanding how AI-mediated markets are changing customer behaviour, intent, trust, enterprise value and human judgement.',
});

export default function ReadingTheShiftPage() {
  return (
    <>
      <section style={{ paddingTop: 'var(--nf-space-4)' }}>
        <Container>
          <TopBreadcrumb path="/reading-the-shift" />
        </Container>
      </section>

      {/* ── Opening proposition ── */}
      <section style={{ paddingBottom: 'clamp(32px, 4vw, 48px)' }}>
        <Container>
          <Eyebrow>READING THE SHIFT</Eyebrow>
          <h1 style={{
            fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
            fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
            margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
          }}>
            Questions, evidence and perspectives for understanding how AI-mediated markets are changing.
          </h1>
          <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0 }}>
            AI is changing both what happens inside organisations and how customers discover, evaluate, choose and interact with businesses.
          </p>
          <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '700px', marginTop: 'var(--nf-space-4)' }}>
            NexFrontier is examining what those changes may mean commercially.
          </p>
        </Container>
      </section>

      {/* ── Thesis context ── */}
      <Section spacing="tight" style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width-lead)' }}>
            <Eyebrow>WHY THESE QUESTIONS</Eyebrow>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-5)' }}>
              NexFrontier is examining how AI-mediated markets are changing and what those changes may mean for enterprise value. Reading The Shift surfaces the questions, evidence and perspectives behind that thesis.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)', marginTop: 'var(--nf-space-3)' }}>
              A question is not evidence. An observation is not proof. A hypothesis is not proof. A published article is not automatically validation. The purpose is to examine, not to claim.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Question hub ── */}
      <Section spacing="tight" style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <ReadingTheShiftHub />
        </Container>
      </Section>

      {/* ── End-of-page journey ── */}
      <Section style={{ borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width-lead)' }}>
            <Eyebrow>CONTINUE</Eyebrow>
            <h2 style={{
              fontSize: 'var(--nf-text-h2)', fontWeight: 500,
              color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-6)',
            }}>
              Move from questions into the wider thesis.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-4)' }}>
              <Button to="/the-shift">Understand the market shift</Button>
              <TextLink to="/intelligence">Explore NexFrontier Intelligence</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/reading-the-shift" />
    </>
  );
}
