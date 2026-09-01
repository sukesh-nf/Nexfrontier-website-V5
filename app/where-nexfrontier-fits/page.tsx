import { pageMetadata } from '@/lib/page-metadata';
import { Section, Container, Eyebrow } from '@/components/ui/primitives';
import { Button, TextLink } from '@/components/ui/Button';
import { WhereFitsTerritoryVisual } from '@/components/visual/WhereFitsTerritoryVisual';

export const metadata = pageMetadata({
  path: '/where-nexfrontier-fits',
  title: 'Where NexFrontier Fits | Enterprise Navigation for AI-Mediated Markets',
  description: 'Understand where NexFrontier fits alongside CRM, analytics, AI visibility, market intelligence, automation and strategy, and how Strategic Visibility exposes the value gap between enterprise reality and changing AI-mediated markets.',
});

const adjacentCategories = [
  {
    title: 'Customer engagement and orchestration',
    description: 'Recognise customer intent, personalise engagement, coordinate journeys and respond across channels.',
  },
  {
    title: 'AI discovery, visibility and demand',
    description: 'Improve how the business is discovered, understood, considered and recommended, and support the creation or capture of demand.',
  },
  {
    title: 'CRM, RevOps and operational systems',
    description: 'Manage relationships, commercial activity, workflows and operating execution.',
  },
  {
    title: 'Analytics and BI',
    description: 'Measure, report and analyse what is happening across the enterprise.',
  },
  {
    title: 'Market intelligence and research',
    description: 'Understand markets, competitors, customer behaviour, demand patterns and emerging change.',
  },
  {
    title: 'Internal AI and automation',
    description: 'Improve productivity, speed, capacity and efficiency inside the enterprise.',
  },
  {
    title: 'Strategy and advisory',
    description: 'Shape strategic choices, priorities and major change.',
  },
];

const leadershipQuestions = [
  'Where is enterprise reality no longer keeping pace with market reality?',
  'Which gaps are economically material?',
  'Where are we becoming more efficient without becoming more effective?',
  'Where is enterprise value remaining unrealised?',
  'What market changes deserve leadership attention?',
  'Where could adaptation create additional value?',
];

const tightPad = {
  paddingTop: 'clamp(48px, 5.5vw, 72px)',
  paddingBottom: 'clamp(48px, 5.5vw, 72px)',
};

export default function WhereNexFrontierFitsPage() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 'clamp(56px, 7vw, 96px)', paddingBottom: 'clamp(40px, 5vw, 56px)', borderBottom: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-fits-hero-copy">
            <Eyebrow>WHERE NEXFRONTIER FITS</Eyebrow>
            <h1 style={{ fontSize: 'var(--nf-text-page-h1)', lineHeight: 'var(--nf-leading-hero)', fontWeight: 500, letterSpacing: '-0.035em', color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)', maxWidth: '780px' }}>
              You may already have the tools. That does not mean you have the visibility.
            </h1>
            <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '760px', margin: 0 }}>
              Most established businesses already have systems for customers, operations, analytics, automation, research and strategy.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '760px', marginTop: 'var(--nf-space-4)' }}>
              NexFrontier is not being built to replace them.
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', maxWidth: '760px', marginTop: 'var(--nf-space-4)' }}>
              It is being built to help leadership understand whether the enterprise those systems describe and improve is still aligned to the market it now has to compete in, and what any gap may mean for enterprise value.
            </p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', marginTop: 'var(--nf-space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink to="#where-nexfrontier-leads" style={{ color: 'var(--nf-text-primary)', borderColor: 'var(--nf-border-strong)' }}>Where NexFrontier Leads</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. THE STRATEGIC GAP ── */}
      <Section style={tightPad}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>THE STRATEGIC GAP</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)' }}>
              Inside the enterprise. Outside in the market. What happens between them?
            </h2>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)' }}>
              Most business systems have a clear job. They help manage customers. Run operations. Analyse performance. Automate work. Understand the market. Support strategy. Those capabilities matter.
            </p>
            <p className="nf-fits-emphasis" style={{ marginTop: 'var(--nf-space-4)' }}>
              But AI-mediated markets introduce another leadership question:
            </p>
            <p className="nf-fits-question">
              Is the enterprise adapting and keeping pace with how the market itself is changing, and where is any gap creating or putting enterprise value at risk?
            </p>
            <p style={{ fontSize: 'var(--nf-text-body)', lineHeight: 'var(--nf-leading-body)', color: 'var(--nf-text-secondary)', marginTop: 'var(--nf-space-4)' }}>
              That is the space NexFrontier is being built to address.
            </p>
            <p className="nf-fits-emphasis" style={{ marginTop: 'var(--nf-space-3)' }}>
              It is an enterprise navigation problem.
            </p>
          </div>
        </Container>
      </Section>

      {/* ── 3. WHERE NEXFRONTIER LEADS / STRATEGIC VISIBILITY ── */}
      <Section id="where-nexfrontier-leads" style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container wide>
          <Eyebrow>WHERE NEXFRONTIER LEADS</Eyebrow>
          <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-3)' }}>
            Strategic Visibility
          </h2>
          <p style={{ fontSize: 'var(--nf-text-lead)', lineHeight: 'var(--nf-leading-lead)', color: 'var(--nf-text-secondary)', maxWidth: '880px', margin: 0 }}>
            NexFrontier is being built to make visible the economically material gap between enterprise reality and changing market reality, giving leadership the context to understand what it means and where to steer next.
          </p>
          <WhereFitsTerritoryVisual />
        </Container>
      </Section>

      {/* ── 4. DIFFERENT JOBS ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>DIFFERENT JOBS</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-5)' }}>
              Different capabilities solve different parts of the problem.
            </h2>
          </div>
          <div className="nf-fits-category-grid">
            {adjacentCategories.map((category) => (
              <article key={category.title} className="nf-fits-category-card">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </article>
            ))}
          </div>
          <div className="nf-body-width" style={{ marginTop: 'var(--nf-space-5)' }}>
            <p className="nf-fits-emphasis">These capabilities can all create value. NexFrontier has a different job.</p>
            <p className="nf-fits-question" style={{ marginTop: 'var(--nf-space-3)' }}>It connects enterprise reality to changing market reality and makes the economic gap visible to leadership.</p>
          </div>
        </Container>
      </Section>

      {/* ── 5. EXISTING SYSTEMS BECOME EVIDENCE ── */}
      <Section id="works-with-your-stack" style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-evidence-section">
            <div className="nf-evidence-copy">
              <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.12, color: 'var(--nf-text-primary)', margin: '0 0 var(--nf-space-4)' }}>
                Your existing systems become part of the evidence.
              </h2>
              <p className="nf-fits-body">NexFrontier is not premised on replacing the systems the enterprise already relies on.</p>
              <p className="nf-fits-body">Those systems contain evidence about how the enterprise operates, how customers interact with it, what outcomes occur and where patterns are changing.</p>
              <p className="nf-fits-body">External market evidence provides the other side of the picture.</p>
              <p className="nf-fits-body">NexFrontier brings those realities together to expose the gap and translate it into strategic and economic meaning for leadership.</p>
              <p className="nf-fits-emphasis" style={{ marginTop: 'var(--nf-space-4)' }}>The value is not in collecting more information. It is in understanding what the combined evidence means for the enterprise and where to steer next.</p>
            </div>
            <div className="nf-evidence-visual">
              <div className="nf-evidence-relationship">
                <div className="nf-evidence-rel-item">
                  <span className="nf-evidence-rel-label">Enterprise evidence</span>
                </div>
                <span className="nf-evidence-rel-plus" aria-hidden="true">+</span>
                <div className="nf-evidence-rel-item">
                  <span className="nf-evidence-rel-label">Market evidence</span>
                </div>
                <span className="nf-evidence-rel-arrow" aria-hidden="true">→</span>
                <div className="nf-evidence-rel-result">
                  <span className="nf-evidence-rel-label">Strategic meaning</span>
                </div>
              </div>
              <p className="nf-evidence-rel-caption">Evidence becomes useful when leadership can understand what the combined picture means.</p>
            </div>
          </div>

          <div className="nf-evidence-validation">
            <div className="nf-evidence-validation-rule" />
            <div className="nf-evidence-validation-row">
              <p>NexFrontier is validating this proposition with Foundation Customers now, building the evidence required to move from thesis to repeatable proof.</p>
              <TextLink to="/foundation-customers">Foundation Customer Programme</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── 6. ENTERPRISE VALUE ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <Eyebrow>ENTERPRISE VALUE</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)' }}>
              A gap only matters if it matters economically.
            </h2>
            <p className="nf-fits-body">NexFrontier is not being built to surface differences for their own sake.</p>
            <p className="nf-fits-body">The purpose is to understand where those differences may affect enterprise value.</p>
          </div>
          <div className="nf-fits-value-grid">
            <article className="nf-fits-value-card"><h3>Quiet Loss&trade;</h3><p>Quiet Loss&trade; is enterprise value that remains unrealised because the enterprise is not fully aligned to the market opportunity available to it.</p></article>
            <article className="nf-fits-value-card"><h3>Adaptive Value&trade;</h3><p>Adaptive Value&trade; is additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.</p></article>
          </div>
          <div className="nf-body-width" style={{ marginTop: 'var(--nf-space-5)' }}>
            <p className="nf-fits-body">Quiet Loss&trade; asks what value may already be going unrealised.</p>
            <p className="nf-fits-body">Adaptive Value&trade; asks what additional value may become possible as the market changes.</p>
            <p className="nf-fits-emphasis" style={{ marginTop: 'var(--nf-space-3)' }}>Together, they give leadership an economic reason to care about alignment.</p>
            <div style={{ marginTop: 'var(--nf-space-5)' }}><Button to="/enterprise-value">Explore Enterprise Value</Button></div>
          </div>
        </Container>
      </Section>

      {/* ── 7. WORK YOUR DASHBOARDS HARDER ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-body-width">
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: '0 0 var(--nf-space-4)' }}>
              Work your dashboards harder.
            </h2>
            <p className="nf-fits-body">Your dashboards already tell you a great deal about what is happening inside the business.</p>
            <p className="nf-fits-body">NexFrontier is not another dashboard.</p>
            <p className="nf-fits-body">It is being built to help leadership interpret what evidence across the enterprise means against a market that is changing outside it.</p>
            <div className="nf-dashboard-shift">
              <span>What happened?</span><strong>→</strong><span>Are we keeping pace, what is the gap worth, and where should we steer next?</span>
            </div>
            <ul className="nf-fits-outcomes" style={{ marginTop: 'var(--nf-space-5)' }}>
              {leadershipQuestions.map((question) => <li key={question}>{question}</li>)}
            </ul>
            <p className="nf-fits-emphasis" style={{ marginTop: 'var(--nf-space-5)' }}>Evidence sharpens the decision. Value tells us whether it mattered.</p>
          </div>
        </Container>
      </Section>

      {/* ── 8. THE NEXT QUESTION ── */}
      <Section style={{ ...tightPad, borderTop: '1px solid var(--nf-border)' }}>
        <Container>
          <div className="nf-fits-final-cta">
            <Eyebrow>THE NEXT QUESTION</Eyebrow>
            <h2 style={{ fontSize: 'var(--nf-text-h2)', fontWeight: 500, lineHeight: 1.2, color: 'var(--nf-text-primary)', margin: 'var(--nf-space-5) 0 var(--nf-space-4)' }}>
              You do not need another tool or dashboard.
              <br /><span style={{ color: 'var(--nf-cyan)' }}>You may need a new business lens.</span>
            </h2>
            <p className="nf-fits-body">Your enterprise is becoming more AI-enabled.</p>
            <p className="nf-fits-body">The market around it is becoming more AI-mediated.</p>
            <p className="nf-fits-question" style={{ marginTop: 'var(--nf-space-4)' }}>The value sits in knowing whether those two realities are staying aligned, what the gap means economically, and where to steer next.</p>
            <p className="nf-fits-body" style={{ marginTop: 'var(--nf-space-4)' }}>NexFrontier is being built to provide that lens.</p>
            <div style={{ display: 'flex', gap: 'var(--nf-space-4)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--nf-space-5)' }}>
              <Button to="/enterprise-value">Explore Enterprise Value</Button>
              <TextLink to="/market-enquiry">Talk to NexFrontier</TextLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
