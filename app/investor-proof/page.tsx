import type { Metadata } from 'next';
import Image from 'next/image';
import { InvestorStickyNav } from '@/components/ui/InvestorStickyNav';
import { InvestorBriefRequestForm } from '@/components/InvestorBriefRequestForm';
import { Button, TextLink } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Investment Case — NexFrontier',
  description: 'An emerging enterprise problem. A potential new category. An early investment opportunity.',
  robots: { index: true, follow: true },
};

export default function InvestorProofPage() {
  return (
    <>
      <InvestorStickyNav />

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section id="investor-hero" className="nf-investor-hero">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">INVESTMENT CASE</span>
          <h1 className="nf-investor-hero-headline">
            An emerging enterprise problem.<br />
            A potential new category.<br />
            An early investment opportunity.
          </h1>
          <p className="nf-investor-hero-support">
            NexFrontier is building Enterprise Navigational Intelligence for AI-mediated markets.
          </p>
          <p className="nf-investor-hero-support-sub">
            Our thesis is that AI may be changing not only markets, but also changing how markets change.
          </p>
          <div className="nf-investor-stage-line">
            Proof stage · MVP build · Foundation Customer pathway · Founder-funded to date
          </div>
          <div className="nf-investor-hero-ctas">
            <Button to="#request-investor-access">REQUEST INVESTOR ACCESS</Button>
            <Button to="/market-enquiry" variant="secondary">TALK TO NEXFRONTIER</Button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 01 — THE SHIFT
      ══════════════════════════════════════════════════════════ */}
      <section id="the-shift" className="nf-investor-section">
        <div className="nf-investor-container">
          <div className="nf-investor-shift-row">
            <div className="nf-investor-shift-text">
              <span className="nf-investor-eyebrow">01 / THE SHIFT</span>
              <h2 className="nf-investor-section-headline">
                The market may no longer be changing along a predictable curve.
              </h2>
              <p className="nf-investor-shift-thesis">
                AI is increasing capability across customers, competitors, suppliers, platforms and enterprises at the same time. As they learn and respond to one another, market direction, speed and state can change too.
              </p>
              <p className="nf-investor-shift-insight">
                AI may be changing the conditions of change itself.
              </p>
              <p className="nf-investor-shift-consequence">
                That may make AI-mediated markets harder for enterprises to see, understand and keep pace with.
              </p>
            </div>
            <div className="nf-investor-shift-image">
              <Image
                src="/ai_mediated_markets_feedback_loop.png"
                alt="AI-mediated market feedback loop: AI capability increases across participants, participants learn and respond, market state changes, new signals emerge and feed back into participant learning"
                width={1448}
                height={1086}
                priority={false}
                className="nf-investor-shift-image-img"
              />
            </div>
          </div>

          {/* Two-column evidence */}
          <div className="nf-investor-evidence-pair">
            <div className="nf-investor-evidence-left">
              <span className="nf-investor-stat-eyebrow">THE WAVE IS ALREADY VISIBLE</span>
              <div className="nf-investor-stat-rows">
                <div className="nf-investor-stat-row">
                  <span className="nf-investor-stat-row-num">76%</span>
                  <p className="nf-investor-stat-row-body">of CEOs expect AI to significantly disrupt their industry.</p>
                </div>
                <div className="nf-investor-stat-row">
                  <span className="nf-investor-stat-row-num">393%</span>
                  <p className="nf-investor-stat-row-body">YoY growth in AI-driven retail traffic.</p>
                </div>
                <div className="nf-investor-stat-row">
                  <span className="nf-investor-stat-row-num">45%</span>
                  <p className="nf-investor-stat-row-body">of middle-market leaders say rising customer expectations are pressuring pricing, margins and profitability.</p>
                </div>
              </div>
            </div>
            <div className="nf-investor-evidence-right">
              <div className="nf-investor-stat-interpretation">
                <p>AI isn&rsquo;t only changing how businesses operate.</p>
                <p>It&rsquo;s changing the markets they operate in, and where economic value is moving.</p>
              </div>
            </div>
          </div>

          <div className="nf-investor-links nf-investor-shift-links">
            <TextLink to="/the-shift">Explore The Shift</TextLink>
            <TextLink to="/hyper-accelerating-markets#market-signals">See the Market Evidence</TextLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 02 — THE BET
      ══════════════════════════════════════════════════════════ */}
      <section id="the-bet" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">02 / THE BET</span>
          <h2 className="nf-investor-section-headline">
            What has to be true for NexFrontier to become a venture-scale opportunity?
          </h2>
          <div className="nf-investor-three-col">
            <div className="nf-investor-col">
              <span className="nf-investor-col-number">PROPOSITION 1</span>
              <h3 className="nf-investor-col-title">Markets become more dynamic.</h3>
              <p className="nf-investor-col-body">
                AI-mediated markets change fast enough, and differently enough, that enterprises increasingly struggle to keep pace.
              </p>
            </div>
            <div className="nf-investor-col">
              <span className="nf-investor-col-number">PROPOSITION 2</span>
              <h3 className="nf-investor-col-title">Alignment becomes economically consequential.</h3>
              <p className="nf-investor-col-body">
                The gap between market opportunity and enterprise reality becomes material enough to create, protect or leave economic value unrealised.
              </p>
            </div>
            <div className="nf-investor-col">
              <span className="nf-investor-col-number">PROPOSITION 3</span>
              <h3 className="nf-investor-col-title">Navigation becomes continuously necessary.</h3>
              <p className="nf-investor-col-body">
                Leadership increasingly needs intelligence to see what is changing, understand what matters economically and decide where to adapt, invest or hold course.
              </p>
            </div>
          </div>
          <div className="nf-investor-impact-block">
            <span className="nf-investor-impact-eyebrow">THE INVESTMENT THESIS</span>
            <p className="nf-investor-impact-statement">
              If all three prove true, Enterprise Navigational Intelligence could emerge as a new enterprise capability.
            </p>
            <p className="nf-investor-impact-cyan">
              NexFrontier is being built to define it.
            </p>
          </div>
          <div className="nf-investor-links">
            <TextLink to="/intelligence">Explore the NexFrontier thesis</TextLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 03 — ASYMMETRIC UPSIDE
      ══════════════════════════════════════════════════════════ */}
      <section id="asymmetric-upside" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">03 / ASYMMETRIC UPSIDE</span>
          <h2 className="nf-investor-section-headline">
            The category may become valuable before it becomes obvious.
          </h2>
          <p className="nf-investor-asym-opening">
            NexFrontier is still a proof-stage company. The category, customer economics and repeatability still have to be earned.
          </p>
          <p className="nf-investor-asym-opening-second">
            That uncertainty is also where the potential asymmetry sits.
          </p>
          <div className="nf-investor-asym-row">
            <div className="nf-investor-asym-side">
              <span className="nf-investor-asym-label">TODAY</span>
              <h3 className="nf-investor-asym-heading">Proof-stage company</h3>
              <div className="nf-investor-asym-lines">
                <span className="nf-investor-asym-line">Emerging thesis</span>
                <span className="nf-investor-asym-line">MVP build</span>
                <span className="nf-investor-asym-line">Foundation Customer pathway</span>
                <span className="nf-investor-asym-line">Category not yet established</span>
              </div>
            </div>
            <div className="nf-investor-asym-side">
              <span className="nf-investor-asym-label">IF PROVED</span>
              <h3 className="nf-investor-asym-heading">Category-scale potential</h3>
              <div className="nf-investor-asym-lines">
                <span className="nf-investor-asym-line">Economically material problem</span>
                <span className="nf-investor-asym-line">Recurring enterprise requirement</span>
                <span className="nf-investor-asym-line">Paid customer value</span>
                <span className="nf-investor-asym-line">Compounding intelligence asset</span>
              </div>
            </div>
          </div>
          <div className="nf-investor-links nf-investor-asym-proof-link">
            <TextLink to="/foundation-customers">Explore the proof pathway</TextLink>
          </div>
          <div className="nf-investor-asym-statement">
            <p>The asymmetry exists in the distance between what NexFrontier is worth while the thesis is being proved and what it could become if the thesis is right.</p>
          </div>
          <p className="nf-investor-asym-final">
            The opportunity is to participate before the category, economics and repeatability are obvious.
          </p>
          <div className="nf-investor-links">
            <TextLink to="#why-invest-now">Why invest now</TextLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 04 — THE ECONOMIC PRIZE
      ══════════════════════════════════════════════════════════ */}
      <section id="economic-prize" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">04 / THE ECONOMIC PRIZE</span>
          <h2 className="nf-investor-section-headline nf-investor-prize-headline">
            The bigger prize may not be the software market.<br />
            It may be the economic value moving underneath it.
          </h2>
          <p className="nf-investor-prize-opening">
            As AI-mediated markets change, economic value can move before enterprises fully see what is changing or understand what matters.
          </p>
          <p className="nf-investor-prize-opening-second">
            The question is who can see that movement early enough to act on it.
          </p>

          {/* Three economic prizes */}
          <span className="nf-investor-eyebrow nf-investor-prize-sub-eyebrow">THREE ECONOMIC PRIZES</span>
          <div className="nf-investor-prizes">
            <div className="nf-investor-prize-col">
              <span className="nf-investor-prize-label">FOR THE CUSTOMER</span>
              <h3 className="nf-investor-prize-heading">Create more value. Lose less of it.</h3>
              <p className="nf-investor-prize-body">
                More revenue captured, less value left unrealised, stronger margins, better capacity use and better allocation of resources.
              </p>
            </div>
            <div className="nf-investor-prize-divider" />
            <div className="nf-investor-prize-col">
              <span className="nf-investor-prize-label">FOR NEXFRONTIER</span>
              <h3 className="nf-investor-prize-heading">Participate in the value it helps identify and realise.</h3>
              <p className="nf-investor-prize-body">
                The intended model is for NexFrontier to capture a share of measurable incremental customer economic value.
              </p>
              <p className="nf-investor-prize-caveat">Subject to paid validation.</p>
            </div>
            <div className="nf-investor-prize-divider" />
            <div className="nf-investor-prize-col nf-investor-prize-col--investor">
              <span className="nf-investor-prize-label nf-investor-prize-label--cyan">FOR THE INVESTOR</span>
              <h3 className="nf-investor-prize-heading nf-investor-prize-heading--strong">
                Own part of a company whose opportunity may grow as continuous alignment becomes more economically important.
              </h3>
              <p className="nf-investor-prize-body">
                NF&rsquo;s upside may be tied less to software spend and more to the economic value moving as markets and enterprises change at different rates and in different directions.
              </p>
            </div>
          </div>

          {/* Core investor statement */}
          <div className="nf-investor-prize-statement">
            <p>The economic prize in the AI era will not belong only to businesses that use AI best.</p>
            <p>It may also belong to businesses that can see where their markets are moving, understand which changes matter economically, and adapt in time to capture the value.</p>
          </div>
          <p className="nf-investor-prize-ambition">
            NexFrontier&rsquo;s ambition is to provide the intelligence that makes that possible.
          </p>

          <div className="nf-investor-links">
            <TextLink to="/enterprise-value">Explore Enterprise Value</TextLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 05 — WHY NEXFRONTIER
      ══════════════════════════════════════════════════════════ */}
      <section id="why-nexfrontier" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">05 / WHY NEXFRONTIER</span>
          <h2 className="nf-investor-section-headline">
            Software may be reproducible.<br />
            Accumulated intelligence may be harder to replicate.
          </h2>
          <p className="nf-investor-support">
            NexFrontier&rsquo;s potential advantage is not simply the software it builds, but the intelligence it may accumulate about which market changes matter, how enterprises respond and what those responses are economically worth.
          </p>

          {/* Core defensibility thesis */}
          <div className="nf-investor-why-statement">
            <p>
              If NexFrontier can progressively learn which market changes matter, what enterprises should do about them and what those responses are economically worth, that accumulated intelligence may become increasingly difficult to replicate.
            </p>
          </div>

          {/* Three linked propositions */}
          <div className="nf-investor-why-props">
            <div className="nf-investor-why-prop">
              <span className="nf-investor-why-prop-label nf-investor-why-prop-label--cyan">THE INTELLIGENCE</span>
              <h3 className="nf-investor-why-prop-heading">What NexFrontier is building</h3>
              <div className="nf-investor-links">
                <TextLink to="/intelligence">Explore Enterprise Navigational Intelligence</TextLink>
              </div>
            </div>
            <div className="nf-investor-why-prop-divider" />
            <div className="nf-investor-why-prop">
              <span className="nf-investor-why-prop-label nf-investor-why-prop-label--cyan">THE WHITESPACE</span>
              <h3 className="nf-investor-why-prop-heading">Why existing systems may not solve the navigation problem</h3>
              <div className="nf-investor-links">
                <TextLink to="/the-shift">Explore the whitespace</TextLink>
              </div>
            </div>
            <div className="nf-investor-why-prop-divider" />
            <div className="nf-investor-why-prop">
              <span className="nf-investor-why-prop-label nf-investor-why-prop-label--cyan">THE COMPANY</span>
              <h3 className="nf-investor-why-prop-heading">Why this team and market position</h3>
              <div className="nf-investor-links">
                <TextLink to="/about">Meet NexFrontier</TextLink>
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 06 — WHAT MUST BE PROVED
      ══════════════════════════════════════════════════════════ */}
      <section id="proof" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">06 / WHAT MUST BE PROVED</span>
          <h2 className="nf-investor-section-headline">
            Capital should buy proof, not activity.
          </h2>
          <p className="nf-investor-support">
            NexFrontier is not asking investors to treat the thesis as proof. The next stage is designed to reduce the specific uncertainties that determine whether this becomes a scalable company.
          </p>

          {/* Proof pathway */}
          <div className="nf-investor-pathway">
            <div className="nf-investor-pathway-track">
              <span className="nf-investor-path-step">Evidence</span>
              <span className="nf-investor-path-today">TODAY</span>
              <ArrowRight size={16} className="nf-investor-path-arrow" />
              <span className="nf-investor-path-step">Customer Validation</span>
              <ArrowRight size={16} className="nf-investor-path-arrow" />
              <span className="nf-investor-path-step">Paid Validation</span>
              <ArrowRight size={16} className="nf-investor-path-arrow" />
              <span className="nf-investor-path-step">Repeatable Proof</span>
            </div>
          </div>

          {/* Four proof questions */}
          <div className="nf-investor-four-col">
            <div className="nf-investor-evidence-col">
              <span className="nf-investor-evidence-label">PRODUCT</span>
              <p className="nf-investor-evidence-body">Can NexFrontier work in real enterprise conditions?</p>
            </div>
            <div className="nf-investor-evidence-col">
              <span className="nf-investor-evidence-label">CUSTOMER</span>
              <p className="nf-investor-evidence-body">Does the problem matter enough for leadership to act?</p>
            </div>
            <div className="nf-investor-evidence-col">
              <span className="nf-investor-evidence-label">ECONOMICS</span>
              <p className="nf-investor-evidence-body">Can NexFrontier identify and help create measurable economic value?</p>
            </div>
            <div className="nf-investor-evidence-col">
              <span className="nf-investor-evidence-label">COMMERCIAL</span>
              <p className="nf-investor-evidence-body">Will customers pay, and can that value repeat?</p>
            </div>
          </div>

          {/* Core close */}
          <p className="nf-investor-proof-close">
            The next capital should reduce product, customer, economic and commercial uncertainty before more capital is used to scale.
          </p>
          <p className="nf-investor-proof-cyan">
            Proof first. Scale second.
          </p>

          <div className="nf-investor-links">
            <TextLink to="/foundation-customers">Explore the Foundation Customer pathway</TextLink>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 07 — WHY INVEST NOW
      ══════════════════════════════════════════════════════════ */}
      <section id="why-invest-now" className="nf-investor-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">07 / WHY INVEST NOW</span>
          <h2 className="nf-investor-section-headline">
            The opportunity is to enter before the category, economics and repeatability are obvious.
          </h2>
          <p className="nf-investor-support">
            The market evidence is emerging. NexFrontier is still early. The next stage is designed to convert uncertainty into proof.
          </p>

          {/* Four linked cards */}
          <div className="nf-investor-why-now-cards">
            <div className="nf-investor-why-now-card">
              <span className="nf-investor-why-now-label">THE MARKET IS MOVING</span>
              <p className="nf-investor-why-now-statement">Evidence of AI-mediated market change is already emerging.</p>
              <div className="nf-investor-links">
                <TextLink to="/hyper-accelerating-markets#market-signals">See the evidence</TextLink>
              </div>
            </div>
            <div className="nf-investor-why-now-card">
              <span className="nf-investor-why-now-label">THE CATEGORY IS EARLY</span>
              <p className="nf-investor-why-now-statement">Enterprise Navigational Intelligence is not yet an established category.</p>
              <div className="nf-investor-links">
                <TextLink to="/intelligence">Explore the category thesis</TextLink>
              </div>
            </div>
            <div className="nf-investor-why-now-card">
              <span className="nf-investor-why-now-label">THE PROOF IS BEGINNING</span>
              <p className="nf-investor-why-now-statement">NexFrontier is moving from evidence toward Foundation Customer validation.</p>
              <div className="nf-investor-links">
                <TextLink to="/foundation-customers">Explore the proof pathway</TextLink>
              </div>
            </div>
            <div className="nf-investor-why-now-card nf-investor-why-now-card--entry">
              <span className="nf-investor-why-now-label">THE ENTRY POINT</span>
              <p className="nf-investor-why-now-statement">Investors can participate while material uncertainty still remains.</p>
              <div className="nf-investor-links">
                <TextLink to="#request-investor-access">Request Investor Access</TextLink>
              </div>
            </div>
          </div>

          {/* Final investment statement */}
          <div className="nf-investor-why-now-close">
            <p className="nf-investor-why-now-primary">Invest before the proof becomes obvious.</p>
            <p className="nf-investor-why-now-support">That is the timing advantage.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          INVESTOR ACCESS
      ══════════════════════════════════════════════════════════ */}
      <section id="request-investor-access" className="nf-investor-access-section">
        <div className="nf-investor-container">
          <span className="nf-investor-eyebrow">INVESTOR ACCESS</span>
          <h2 className="nf-investor-access-headline">Go deeper.</h2>
          <p className="nf-investor-access-support">
            Approved investors can access the private NexFrontier Investor Data Room, including deeper evidence, economic assumptions, proof-stage material and investor diligence content.
          </p>
          <p className="nf-investor-access-process">
            Request &rarr; Admin Approval &rarr; Credentials &rarr; NDA &rarr; Data Room
          </p>
          <div className="nf-investor-access-form">
            <InvestorBriefRequestForm />
          </div>
          <p className="nf-investor-access-trust">
            Access is manually approved. Approved investors receive secure credentials and must accept the current NexFrontier Investor NDA before entering the Data Room.
          </p>
          <div className="nf-investor-returning">
            <span className="nf-investor-returning-eyebrow">RETURNING INVESTOR</span>
            <a href="/investor-data-room" className="nf-investor-returning-link">
              Already approved? <span className="nf-investor-returning-link-action">Investor Login</span> <span className="nf-investor-returning-link-arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
