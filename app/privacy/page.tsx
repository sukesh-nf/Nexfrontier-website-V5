import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { Breadcrumb } from '@/components/ui/Button';

export const metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy | NexFrontier',
  description: 'NexFrontier privacy notice: how we collect, use and protect information.',
});

const sections = [
  {
    heading: 'What information we collect',
    body: [
      'NexFrontier may collect information through this website, through direct enquiries, and through Foundation Customer participation.',
      'This may include contact details you provide (such as name, email address, organisation and role), information you include in an enquiry or form submission, and standard website analytics data such as pages visited and approximate location.',
    ],
  },
  {
    heading: 'Why we collect it',
    body: [
      'We use the information you provide to respond to enquiries, to assess Foundation Customer fit, to understand which content or capabilities are of interest, and to improve the website and our services.',
      'We do not sell personal information to third parties.',
    ],
  },
  {
    heading: 'Website analytics',
    body: [
      'This website may use analytics to understand how visitors interact with content. Analytics data is generally aggregated and does not identify individual visitors unless combined with information you have separately provided.',
    ],
  },
  {
    heading: 'Enquiries and forms',
    body: [
      'When you submit an enquiry through this website, the information you provide is used to determine the most useful next conversation. It is not used for unsolicited marketing.',
    ],
  },
  {
    heading: 'Foundation Customer and customer data',
    body: [
      'Foundation Customer participation may involve access to operational data within the customer\'s own environment. Any such data is handled under separate arrangements specific to that engagement and is not covered by this website privacy notice.',
    ],
  },
  {
    heading: 'Cookies',
    body: [
      'This website may use essential cookies necessary for basic functionality. Any additional cookies, analytics tools or tracking technologies will be described here once confirmed.',
    ],
  },
  {
    heading: 'Data storage and retention',
    body: [
      'Information collected through this website may be stored and processed in locations outside the country in which it was provided. We retain information only for as long as is necessary for the purpose for which it was collected or as required by applicable law.',
    ],
  },
  {
    heading: 'Third parties',
    body: [
      'We may use third-party services for hosting, analytics, email or form processing. These providers may process data in accordance with their own privacy practices. We do not knowingly share your personal information with third parties for their own marketing purposes.',
    ],
  },
  {
    heading: 'Cross-border processing',
    body: [
      'NexFrontier operates across Malaysia and New Zealand. Information collected through this website may be processed in either country or in other locations where our service providers operate.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'Depending on your location, you may have rights to access, correct, or request deletion of your personal information. To exercise any of these rights, contact us using the details below.',
    ],
  },
  {
    heading: 'Contact',
    body: [
      'For privacy questions or requests, contact us at hello@nexfrontier.my (Malaysia) or hello@nexfrontierlogic.nz (New Zealand).',
    ],
  },
  {
    heading: 'Updates',
    body: [
      'This privacy notice may be updated as our practices evolve or as required by applicable law. Material changes will be reflected on this page.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Privacy' }]} />
        </Container>
      </Section>

      <PageHero
        eyebrow="LEGAL"
        title="Privacy"
        lead="How NexFrontier collects, uses and protects information through this website and related interactions."
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
                This privacy notice contains the structural framework and operational information. Final legal wording must be reviewed and approved before publication. Do not treat this as a final privacy policy.
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
