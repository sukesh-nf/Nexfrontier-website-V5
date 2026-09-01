import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { PageHero } from '@/components/ui/PageHero';
import { TopBreadcrumb, BottomContextNav } from '@/components/ui/ContextNavigation';
import { MarketEnquiryForm } from '@/components/MarketEnquiryForm';

export const metadata = pageMetadata({
  path: '/market-enquiry',
  title: 'Market Enquiry | NexFrontier',
  description: 'Tell us a little about your business, the question you are exploring and why NexFrontier may be relevant. We will use that context to determine the most useful next conversation.',
});

export default function MarketEnquiryPage() {
  return (
    <>
      <Section spacing="tight">
        <Container>
          <TopBreadcrumb path="/market-enquiry" />
        </Container>
      </Section>

      <PageHero
        eyebrow="MARKET ENQUIRY"
        title={<>Start with what you are<br /><span style={{ color: 'var(--nf-text-secondary)' }}>trying to understand.</span></>}
        lead="Tell us a little about your business, the question you are exploring and why NexFrontier may be relevant. We will use that context to determine the most useful next conversation."
        variant="functional"
      />

      <Section spacing="tight">
        <Container wide>
          <div style={{ maxWidth: '920px', margin: '0 auto', padding: 'var(--nf-space-4)', background: 'var(--nf-bg-surface-2)', border: '1px solid var(--nf-border-strong)', borderRadius: 'var(--nf-radius-panel)' }}>
            <MarketEnquiryForm />
          </div>
        </Container>
      </Section>

      <BottomContextNav path="/market-enquiry" />
    </>
  );
}
