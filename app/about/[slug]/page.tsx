import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { personJsonLd } from '@/services/structured-data';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { teamMembers } from '@/data/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FounderVideo } from '@/components/ui/FounderVideo';

export function generateStaticParams() {
  return teamMembers.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);
  const path = `/about/${slug}`;
  return pageMetadata({
    path,
    title: member ? `${member.name} | NexFrontier` : 'Team',
    description: member ? `${member.name}, ${member.role} at NexFrontier.` : 'NexFrontier team member.',
  });
}

export default async function TeamProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) notFound();

  const jsonLd = personJsonLd({
    name: member.name,
    role: member.role,
    path: `/about/${member.slug}`,
    linkedin: member.linkedin,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path={`/about/${slug}`} />
        </Container>
      </Section>

      {/* Portrait + intro */}
      <Section spacing="tight">
        <Container>
          <div style={{
            display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '40px',
            alignItems: 'start',
          }} className="nf-profile-header">
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
              <Eyebrow>ABOUT</Eyebrow>
              <h1 style={{
                fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)',
                fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)',
                margin: 'var(--nf-space-5) 0 var(--nf-space-3)',
              }}>{member.name}</h1>
              <p style={{
                fontSize: '1.25rem', color: 'var(--nf-text-secondary)',
                fontWeight: 500, marginBottom: '4px',
              }}>{member.role}</p>
              <p style={{
                fontSize: '0.9375rem', color: 'var(--nf-text-tertiary)',
              }}>{member.location}</p>
              <div style={{ marginTop: 'var(--nf-space-5)' }}>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.8125rem', fontWeight: 600, color: 'var(--nf-cyan)',
                  textDecoration: 'none', borderBottom: '1px solid var(--nf-cyan)', paddingBottom: '3px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.37-2.14 2.94v5.67H9.34V9h3.42v1.48h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.36zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Full bio */}
      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-5)' }}>
              {member.bio.map((para, i) => {
                const isEmphasis = member.slug === 'sukesh-sukumaran' && para === 'NexFrontier is being built for that shift.';
                const isClosing = member.slug === 'sukesh-sukumaran' && i === member.bio.length - 1;
                if (isEmphasis) {
                  return (
                    <p key={i} className="nf-founder-emphasis" style={{
                      fontSize: '1.25rem', lineHeight: 1.4, fontWeight: 500,
                      color: 'var(--nf-cyan)', margin: 0,
                      paddingLeft: 'var(--nf-space-5)',
                      borderLeft: '2px solid var(--nf-cyan)',
                    }}>{para}</p>
                  );
                }
                return (
                  <p key={i} style={{
                    fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                    color: i === 0 ? 'var(--nf-text-primary)' : isClosing ? 'var(--nf-text-primary)' : 'var(--nf-text-secondary)',
                    fontWeight: i === 0 ? 500 : isClosing ? 500 : 400,
                  }}>{para}</p>
                );
              })}
            </div>
          </div>
          {member.hasVideoPlaceholder && <FounderVideo poster={member.image} name={member.name} />}
        </Container>
      </Section>

      {/* Other team members */}
      <Section spacing="tight">
        <Container>
          <div style={{
            borderTop: '1px solid var(--nf-border)', paddingTop: 'var(--nf-space-7)',
          }}>
            <Eyebrow>TEAM</Eyebrow>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px',
              marginTop: 'var(--nf-space-5)',
            }} className="nf-team-other">
              {teamMembers.filter((m) => m.slug !== member.slug).map((m) => (
                <Link key={m.slug} href={`/about/${m.slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: 'var(--nf-space-4)', background: 'var(--nf-bg-surface-2)',
                  border: '1px solid var(--nf-border)', borderRadius: 'var(--nf-radius-control)',
                  textDecoration: 'none',
                }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0, background: 'var(--nf-bg-surface-1)',
                  }}>
                    {m.image && (
                      <img src={m.image} alt={m.name} style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--nf-text-primary)' }}>{m.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--nf-text-tertiary)' }}>{m.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <BottomContextNav path={`/about/${slug}`} />
    </>
  );
}
