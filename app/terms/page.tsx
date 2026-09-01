import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Button';

export const metadata = pageMetadata({
  path: '/terms',
  title: 'Terms | NexFrontier',
  description: 'NexFrontier terms of use for this website.',
});

const sections = [
  {
    heading: 'Website use',
    body: [
      'This website is provided by NexFrontier for informational purposes. By accessing this website, you agree to use it in accordance with these terms and applicable law.',
    ],
  },
  {
    heading: 'Content',
    body: [
      'Content on this website, including text, frameworks, concepts and visual materials, is provided for general information. It may be updated, changed or removed without notice.',
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      'NexFrontier retains rights in the content, frameworks, concepts and materials presented on this website. Framework names including Quiet Loss™, Adaptive Value™, ORBIT™, AMCT™ and Intent Threads™ are used by NexFrontier in connection with its work.',
    ],
  },
  {
    heading: 'Trademarks',
    body: [
      'NexFrontier and related marks are used by NexFrontier. Other marks referenced on this website belong to their respective owners.',
    ],
  },
  {
    heading: 'Illustrative calculator disclaimer',
    body: [
      'The Enterprise Value Calculator provides an illustrative scenario, not a diagnosis, forecast or company valuation. Outputs depend on assumptions entered by the user and do not represent professional, financial or commercial advice.',
    ],
  },
  {
    heading: 'No financial or professional advice',
    body: [
      'Nothing on this website constitutes financial, legal, investment, accounting or professional advice. You should obtain independent advice appropriate to your circumstances before making decisions based on any information presented here.',
    ],
  },
  {
    heading: 'External links',
    body: [
      'This website may contain links to external websites. NexFrontier is not responsible for the content, accuracy or practices of those external sites.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'To the extent permitted by applicable law, NexFrontier provides this website on an "as is" basis and does not warrant that the information is complete, accurate or up to date. NexFrontier does not accept liability for losses arising from reliance on information presented on this website.',
    ],
  },
  {
    heading: 'Governing law',
    body: [
      'These terms are intended to be governed by the laws applicable to NexFrontier\u2019s operating jurisdictions. Specific governing law and jurisdiction will be confirmed as part of legal review.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'For questions about these terms, contact us at hello@nexfrontier.my (Malaysia) or hello@nexfrontierlogic.nz (New Zealand).',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Terms' }]} />
        </Container>
      </Section>

      <PageHero
        eyebrow="LEGAL"
        title="Terms"
        lead="Terms of use for the NexFrontier website."
        variant="functional"
      />

      <Section spacing="tight">
        <Container>
          <div style={{ maxWidth: 'var(--nf-reading-width)' }}>
            <div style={{
              padding: 'var(--nf-space-5) var(--nf-space-6)',
              background: 'var(--nf-bg-surface-3)', border: '1px solid var(--nf-border)',
              borderRadius: 'var(--nf-radius-panel)', marginBottom: 'var(--nf-space-7)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '0.8125rem', fontWeight: 700, color: 'var(--nf-warning, #e2a955)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: 'var(--nf-warning, #e2a955)',
                }} />
                Legal Review Required
              </div>
              <p style={{
                fontSize: '0.875rem', lineHeight: 'var(--nf-leading-body)',
                color: 'var(--nf-text-tertiary)', marginTop: 'var(--nf-space-3)',
              }}>
                These terms contain the structural framework for the website. Final binding language must be reviewed and approved by legal counsel before publication. Do not treat this as a final terms of use.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-7)' }}>
              {sections.map((section, i) => (
                <div key={i}>
                  <h2 style={{
                    fontSize: 'var(--nf-text-h3)', fontWeight: 600,
                    color: 'var(--nf-text-primary)', marginBottom: 'var(--nf-space-4)',
                  }}>{section.heading}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nf-space-3)' }}>
                    {section.body.map((para, j) => (
                      <p key={j} style={{
                        fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)',
                        color: 'var(--nf-text-secondary)',
                      }}>{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
