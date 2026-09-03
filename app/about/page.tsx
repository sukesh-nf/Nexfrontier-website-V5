import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { TopBreadcrumb } from '@/components/ui/ContextNavigation';
import { LeadershipPulseInlineLink } from '@/components/ui/LeadershipPulseInvitation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { teamMembers } from '@/data/content';

export const metadata = pageMetadata({
  path: '/about',
  title: 'About NexFrontier | Intelligence for AI-mediated markets',
  description: 'NexFrontier was formed around a question: how do you know whether your business is keeping pace with the market around it?',
});

export default function AboutPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/about" />
        </Container>
      </Section>

      {/* Hero */}
      <section className="nf-about-hero" style={{ borderBottom: '1px solid var(--nf-border)' }}>
        <Container>
          <div style={{ maxWidth: '900px' }}>
            <Eyebrow>ABOUT NEXFRONTIER</Eyebrow>
            <h1 style={{
              fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
              fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
              margin: 'var(--nf-space-5) 0 var(--nf-space-5)',
            }}>How do you know whether your business is keeping pace with the market around it?</h1>
            <p style={{
              fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
              color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 0,
            }}>
              NexFrontier was formed around that question.
            </p>
            <p style={{
              fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)',
              color: 'var(--nf-text-secondary)', maxWidth: '700px', margin: 'var(--nf-space-4) 0 0',
            }}>
              Because in the AI era, leadership may increasingly need to understand not only how the business is performing, but whether it is adapting at the rate and in the direction its market now requires.
            </p>
            <p style={{
              fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
              color: 'var(--nf-text-tertiary)', maxWidth: '700px', margin: 'var(--nf-space-4) 0 0',
            }}>
              Ultimately, that becomes an economic question: where value is being protected, left unrealised or made newly possible, and where leadership should steer next.
            </p>
          </div>
        </Container>
      </section>

      {/* Why we exist */}
      <Section spacing="tight">
        <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
          <Eyebrow>WHY WE EXIST</Eyebrow>
          <h2 style={{
            fontSize: 'var(--nf-text-h2)', fontWeight: 500, letterSpacing: '-0.025em',
            color: 'var(--nf-text-primary)', margin: 'var(--nf-space-4) 0 var(--nf-space-4)',
          }}>AI is changing the enterprise and the market at the same time.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              Most AI investment focuses on improving how businesses operate internally. That matters.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              But AI is also changing the market around them: how customers discover, evaluate and choose, how competitors respond, and how opportunity forms.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              The enterprise can improve internally while becoming less aligned with the market outside it.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              NexFrontier is being built to help leadership understand where that gap may be economically material, what it means, and where attention may be required next.
            </p>
          </div>
        </div>
      </Section>

      {/* Where we are now */}
      <Section spacing="tight">
        <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
          <div className="nf-about-venture-stage">
            <Eyebrow>WHERE WE ARE NOW</Eyebrow>
            <h2 style={{
              fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em',
              color: 'var(--nf-text-primary)', margin: 'var(--nf-space-4) 0 var(--nf-space-3)',
            }}>Beyond the idea stage. Building the MVP. Earning the proof.</h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              NexFrontier is building its MVP and preparing for Foundation Customer validation in real operating environments.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-3)' }}>
              That evidence will determine what deserves to become repeatable product capability and whether progression to paid validation is earned.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-primary)', fontWeight: 500, marginTop: 'var(--nf-space-3)' }}>
              The ambition is significant. The proof still has to be earned.
            </p>
          </div>
        </div>
      </Section>

      {/* Startup footprint */}
      <Section spacing="tight">
        <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
          <Eyebrow>STARTUP FOOTPRINT</Eyebrow>
          <h2 style={{
            fontSize: '1.375rem', fontWeight: 500, letterSpacing: '-0.02em',
            color: 'var(--nf-text-primary)', margin: 'var(--nf-space-4) 0 var(--nf-space-4)',
          }}>Malaysia hub. New Zealand satellite. Two starting points.</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              NexFrontier Group Sdn. Bhd. is the principal Malaysian operating hub.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              NexFrontier Logic Ltd is the separate New Zealand entity supporting that market and commercial operation.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-tertiary)' }}>
              These are starting points for a business intended to expand market by market as evidence, customers and opportunity justify it.
            </p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px',
            marginTop: 'var(--nf-space-4)',
          }} className="nf-about-contact">
            <div>
              <span className="nf-eyebrow" style={{ display: 'block', marginBottom: '8px' }}>Malaysia</span>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--nf-text-tertiary)', whiteSpace: 'pre-line' }}>
                L9, Menara Public Gold @TRX{'\n'}50400 Kuala Lumpur
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', marginTop: '8px' }}>hello@nexfrontier.my</p>
            </div>
            <div>
              <span className="nf-eyebrow" style={{ display: 'block', marginBottom: '8px' }}>New Zealand</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)' }}>hello@nexfrontierlogic.nz</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Founding team */}
      <Section spacing="tight">
        <Container>
          <Eyebrow>FOUNDING TEAM</Eyebrow>
          <h2 style={{
            fontSize: 'var(--nf-text-h2)', fontWeight: 500, letterSpacing: '-0.025em',
            color: 'var(--nf-text-primary)', margin: 'var(--nf-space-4) 0 var(--nf-space-5)',
          }}>The people building NexFrontier.</h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
          }} className="nf-team-grid">
            {teamMembers.map((member) => (
              <Link key={member.slug} href={`/about/${member.slug}`} style={{
                display: 'flex', flexDirection: 'column', gap: '16px',
                textDecoration: 'none',
              }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 'var(--nf-radius-panel)',
                  overflow: 'hidden', background: 'var(--nf-bg-surface-2)',
                  border: '1px solid var(--nf-border)',
                }}>
                  {member.image && (
                    <img src={member.image} alt={member.name} style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    }} />
                  )}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem', fontWeight: 600, color: 'var(--nf-text-primary)',
                    marginBottom: '4px',
                  }}>{member.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--nf-text-tertiary)', marginBottom: '8px' }}>{member.role}</p>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-cyan)',
                  }}>Read profile <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Where Next — commercial close */}
      <Section spacing="tight">
        <Container>
          <div className="nf-about-where-next">
            <Eyebrow>WHERE NEXT</Eyebrow>
            <h2 style={{
              fontSize: 'var(--nf-text-h2)', fontWeight: 500, letterSpacing: '-0.025em',
              color: 'var(--nf-text-primary)', margin: 'var(--nf-space-4) 0 var(--nf-space-4)',
            }}>Understand the shift. Decide whether it matters to your enterprise.</h2>
            <div className="nf-about-close-ctas">
              <Button to="/the-shift">The Shift</Button>
              <Button to="/foundation-customers" variant="secondary">Foundation Customers</Button>
              <TextLink to="/market-enquiry?topic=leadership-conversation">Talk to NexFrontier</TextLink>
            </div>
            <div style={{ marginTop: 'var(--nf-space-5)' }}>
              <LeadershipPulseInlineLink source="about" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
