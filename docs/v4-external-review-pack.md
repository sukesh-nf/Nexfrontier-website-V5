# NexFrontier v4 — External Review Pack

**Generated:** 2026-08-26
**Source:** Current v4 codebase (no modifications made)
**Purpose:** Enable ChatGPT to conduct a contextual founder-review pass

---

## Table of Contents

1. [Route-by-Route Content Export](#1-route-by-route-content-export)
2. [Current Navigation](#2-current-navigation)
3. [Visual Register](#3-visual-register)
4. [Screenshots](#4-screenshots)
5. [Reading The Shift Content Model](#5-reading-the-shift-content-model)
6. [Calculator UI and Logic Summary](#6-calculator-ui-and-logic-summary)
7. [Forms Behaviour](#7-forms-behaviour)
8. [Company Identity as Rendered](#8-company-identity-as-rendered)
9. [SEO / Metadata State](#9-seo--metadata-state)
10. [Functional Status](#10-functional-status)
11. [Current Known Gaps](#11-current-known-gaps)
12. [Confirmation](#12-confirmation)

---

## 1. Route-by-Route Content Export

All routes are currently at publication status **`review`**. None are `published` or `development`.

---

### `/` — Home

**Publication status:** review
**Page purpose:** Establish NexFrontier's positioning and guide visitors to key areas.

**Hero content:**
- Eyebrow: "INTELLIGENCE FOR AI-MEDIATED MARKETS"
- H1: "The shift is not inside the enterprise. It is in the market."
- Lead: "AI is changing how customers discover, understand, compare and choose. NexFrontier builds intelligence for what that means for enterprise value."
- Primary CTA: "Understand The Shift" → `/the-shift`
- Secondary CTA: "Explore Enterprise Value" → `/enterprise-value`
- Hero visual: Code-based gradient panel (no image asset)

**Sections:**

1. **"What NexFrontier is building"** — Three-card grid:
   - Card 1: "The Brain" — "Connect evidence. Learn what matters." → `/intelligence/the-brain`
   - Card 2: "Intent Threads™" — "Reconnect evidence around an underlying need." → `/intelligence/intent-threads`
   - Card 3: "ORBIT™" — "Translate what matters into Enterprise Value." → `/intelligence/orbit`
   - Visual: Code-based cards with cyan accent borders

2. **"Enterprise Value"** — Two-card layout:
   - Card 1: "Quiet Loss™" — "Protect or recover existing value." → `/enterprise-value/quiet-loss`
   - Card 2: "Adaptive Value™" — "Explore additional value made possible by change." → `/enterprise-value/adaptive-value`
   - CTA: "Use the Enterprise Value Calculator" → `/enterprise-value/calculator`

3. **"Reading The Shift"** — Featured questions preview:
   - Eyebrow: "READING THE SHIFT"
   - Heading: "Questions worth asking as markets change."
   - Lead: "AI is changing how people discover, understand, compare and choose. That raises new questions for businesses."
   - Shows 3 featured question cards linking to Reading The Shift articles
   - CTA: "Explore all questions" → `/reading-the-shift`

4. **"Foundation Customers"** — Call to action:
   - Heading: "Foundation Customers"
   - Body: "NexFrontier is working with a small group of Foundation Customers to build evidence before making stronger claims."
   - CTA: "Learn about Foundation Customers" → `/foundation-customers`

5. **Final CTA band:**
   - Heading: "Make a Market Enquiry"
   - CTA: "Start a conversation" → `/market-enquiry`

---

### `/the-shift` — The Shift

**Publication status:** review
**Page purpose:** Explain what the AI-mediated market shift is and why it matters.

**Hero content:**
- Eyebrow: "THE SHIFT"
- H1: "The shift is not inside the enterprise."
- Lead: "AI is changing how customers discover, understand, compare and choose. That changes what businesses need to recognise, understand and adapt to."
- Hero visual: Code-based gradient panel

**Sections:**

1. **"What is changing"** — Body copy explaining that AI is moving from internal tool to market intermediary. Key pull quote: "The question is not whether your business uses AI. It is whether AI is changing how your customers reach you."

2. **"Why it matters"** — Three points:
   - "Discovery is changing" — AI may shape what customers find
   - "Understanding is changing" — AI may shape how customers interpret options
   - "Choice is changing" — AI may shape what customers decide to do next

3. **"What NexFrontier is doing about it"** — Links to Intelligence and Enterprise Value:
   - CTA: "Explore Intelligence" → `/intelligence`
   - CTA: "Understand Enterprise Value" → `/enterprise-value`

4. **Continue exploring:**
   - CTA: "Read Reading The Shift" → `/reading-the-shift`
   - CTA: "Learn about Foundation Customers" → `/foundation-customers`

---

### `/intelligence` — Intelligence Overview

**Publication status:** review
**Page purpose:** Present the intelligence capabilities NexFrontier is building.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "What NexFrontier is building."
- Lead: "Intelligence that connects changing market intent to enterprise response and learning."
- Hero visual: Code-based gradient panel

**Sections:**

1. **Capability grid** — Six cards, each linking to a sub-page:
   - "The Brain" — "Connect evidence. Learn what matters." → `/intelligence/the-brain`
   - "Intent Threads™" — "Reconnect evidence around an underlying need." → `/intelligence/intent-threads`
   - "ORBIT™" — "Translate what matters into Enterprise Value." → `/intelligence/orbit`
   - "AMCT™" — "Customer. AI. Business. Trust." → `/intelligence/amct`
   - "Human in the Lead" — "Evidence-led decisions, human judgement." → `/intelligence/human-in-the-lead`
   - "Enterprise Capability" — "The ability to keep earning readiness." → `/intelligence/enterprise-capability`

2. **Bottom CTA:**
   - "Explore Enterprise Value" → `/enterprise-value`

---

### `/intelligence/the-brain` — The Brain

**Publication status:** review
**Page purpose:** Explain The Brain as NexFrontier's evidence-connecting intelligence capability.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "The Brain"
- Lead: "Connect evidence. Learn what matters."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: `BrainVisual` component (code-based animated visual with nodes and connections)

**Sections:**

1. **"What it does"** — Body copy: The Brain connects evidence from multiple sources to learn what matters for a business. It is not a dashboard or a report — it is a living intelligence layer.

2. **"How it works"** — Three-step explanation:
   - "Connect" — Bring together evidence from market signals, customer interactions and enterprise data
   - "Learn" — Identify patterns, relationships and emerging signals that matter
   - "Inform" — Make what matters visible to the people who need to act

3. **"Why it matters"** — Links to Intent Threads and ORBIT as downstream capabilities.

4. **Continue Exploring Intelligence** — Standard cross-navigation component with links to other Intelligence sub-pages.

---

### `/intelligence/intent-threads` — Intent Threads™

**Publication status:** review
**Page purpose:** Explain Intent Threads as the capability to reconnect evidence around an underlying need.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "Intent Threads™"
- Lead: "Reconnect evidence around an underlying need."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"The problem"** — When customers use AI, their intent may arrive fragmented. Individual enquiries, signals and interactions may not tell the whole story.

2. **"What Intent Threads do"** — Intent Threads reconnect evidence around an underlying need, making it possible to see what a customer is actually trying to achieve.

3. **"How it connects"** — Links to The Brain (upstream) and ORBIT (downstream).

4. **Continue Exploring Intelligence** — Cross-navigation component.

---

### `/intelligence/orbit` — ORBIT™

**Publication status:** review
**Page purpose:** Explain ORBIT as the framework that translates what matters into Enterprise Value.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "ORBIT™"
- Lead: "Translate what matters into Enterprise Value."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"What ORBIT does"** — ORBIT translates what matters into five Enterprise Value dimensions: Revenue, Cost, Capacity, Customer Value, and Enterprise Capability.

2. **"The five dimensions"** — List with descriptions:
   - Revenue — "Strengthen top-line quality."
   - Cost — "Reduce cost-to-serve and cost-to-acquire."
   - Capacity — "Increase the effective use of people and capacity."
   - Customer Value — "Increase retained customer value over time."
   - Enterprise Capability — "Build long-term operating advantage."

3. **"How it connects"** — Links to AMCT (upstream understanding) and Enterprise Value (downstream economics).

4. **Continue Exploring Intelligence** — Cross-navigation component.

---

### `/intelligence/amct` — AMCT™

**Publication status:** review
**Page purpose:** Explain the AI-Mediated Choice Triangle framework.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "AMCT™"
- Lead: "Customer. AI. Business. Trust."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: Image asset — `ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png` (UNCERTAIN status — see Visual Register)

**Sections:**

1. **"What AMCT is"** — The AI-Mediated Choice Triangle maps the relationship between Customer, AI and Business. It helps businesses understand where trust, relevance and choice intersect.

2. **"The three vertices"**:
   - "Customer" — The person with a need
   - "AI" — The intermediary shaping discovery, understanding and choice
   - "Business" — The provider responding to the need

3. **"Trust at the centre"** — Trust is not just between customer and business. AI introduces a third relationship that changes how trust is earned, maintained and lost.

4. **Continue Exploring Intelligence** — Cross-navigation component.

---

### `/intelligence/human-in-the-lead` — Human in the Lead

**Publication status:** review
**Page purpose:** Explain NexFrontier's position that AI should augment, not replace, human judgement.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "Human in the Lead"
- Lead: "Evidence-led decisions, human judgement."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"The principle"** — AI can connect evidence, identify patterns and make what matters visible. Judgement about what to do remains human.

2. **"What this means"** — Three points:
   - AI informs — it does not decide
   - Evidence guides — it does not replace judgement
   - Humans act — with better context, not less responsibility

3. **Continue Exploring Intelligence** — Cross-navigation component.

---

### `/intelligence/enterprise-capability` — Enterprise Capability

**Publication status:** review
**Page purpose:** Explain Enterprise Capability as the ability to keep earning readiness.

**Hero content:**
- Eyebrow: "INTELLIGENCE"
- H1: "Enterprise Capability"
- Lead: "The ability to keep earning readiness."
- Back link: "Intelligence" → `/intelligence`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"What it is"** — Enterprise Capability is not a single tool or system. It is the organisational ability to recognise, understand and adapt to changing market conditions — continuously.

2. **"Why it matters"** — Readiness is perishable. A business that is ready today may not be ready tomorrow unless it builds the capability to keep learning and adapting.

3. **"How NexFrontier helps"** — Link to Foundation Customers and Market Enquiry.

4. **Continue Exploring Intelligence** — Cross-navigation component.

---

### `/enterprise-value` — Enterprise Value Overview

**Publication status:** review
**Page purpose:** Present the Enterprise Value framework as the economic lens for AI-mediated markets.

**Hero content:**
- Eyebrow: "ENTERPRISE VALUE"
- H1: "The wider economic picture."
- Lead: "AI-mediated markets may create new value, erode existing value, or both. Enterprise Value makes that visible."
- Primary CTA: "Use the Enterprise Value Calculator" → `/enterprise-value/calculator`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"Two sides of Enterprise Value"** — Two-card layout:
   - Card 1: "Quiet Loss™" — "Protect or recover existing value." → `/enterprise-value/quiet-loss`
   - Card 2: "Adaptive Value™" — "Explore additional value made possible by change." → `/enterprise-value/adaptive-value`

2. **"The five dimensions"** — List:
   - Revenue, Cost, Capacity, Customer Value, Enterprise Capability

3. **"How to explore"** — CTA to Calculator and sub-pages.

4. **Bottom CTA:**
   - "Make a Market Enquiry" → `/market-enquiry`

---

### `/enterprise-value/quiet-loss` — Quiet Loss™

**Publication status:** review
**Page purpose:** Explain the Quiet Loss concept — value that may already be going unrealised.

**Hero content:**
- Eyebrow: "ENTERPRISE VALUE"
- H1: "Quiet Loss™"
- Lead: "What value might already be going unrealised?"
- Back link: "Enterprise Value" → `/enterprise-value`
- Hero visual: Code-based gradient panel (no canonical visual assigned — see Visual Register)

**Sections:**

1. **"What Quiet Loss is"** — Quiet Loss is value that may already be slipping away — not because a business is performing poorly, but because market conditions are changing around it.

2. **"Why it can be hard to see"** — Quiet Loss can be invisible because the business is still performing. The loss is relative to what could be, not what was.

3. **"Where to look"** — Five dimensions: Revenue, Cost, Capacity, Customer Value, Enterprise Capability.

4. **"What to do about it"** — CTA: "Use the Enterprise Value Calculator" → `/enterprise-value/calculator`

5. **Cross-navigation:**
   - "Understand Adaptive Value™" → `/enterprise-value/adaptive-value`
   - "Make a Market Enquiry" → `/market-enquiry`

---

### `/enterprise-value/adaptive-value` — Adaptive Value™

**Publication status:** review
**Page purpose:** Explain Adaptive Value — additional value made possible by market change.

**Hero content:**
- Eyebrow: "ENTERPRISE VALUE"
- H1: "Adaptive Value™"
- Lead: "What more could become possible?"
- Back link: "Enterprise Value" → `/enterprise-value`
- Hero visual: Image asset — `Adaptive_Value_website_Aug26.png` (CANONICAL status)

**Sections:**

1. **"What Adaptive Value is"** — Adaptive Value is additional annual value that changing market conditions may make possible — above and beyond today's position.

2. **"How it differs from Quiet Loss"** — Quiet Loss is about protecting existing value. Adaptive Value is about exploring new value.

3. **"Where to look"** — Same five dimensions.

4. **"What to do about it"** — CTA: "Use the Enterprise Value Calculator" → `/enterprise-value/calculator`

5. **Cross-navigation:**
   - "Understand Quiet Loss™" → `/enterprise-value/quiet-loss`
   - "Make a Market Enquiry" → `/market-enquiry`

---

### `/enterprise-value/calculator` — Enterprise Value Calculator

**Publication status:** review
**Page purpose:** Interactive tool to explore an illustrative Enterprise Value scenario.

**Hero content:**
- Eyebrow: "ENTERPRISE VALUE"
- H1: "Enterprise Value Calculator"
- Lead: "Explore an illustrative annual value scenario for your business."
- Back link: "Enterprise Value" → `/enterprise-value`
- Hero visual: None (interactive tool below)

**Sections:**

The calculator is a 4-stage interactive flow (detailed in Section 6 below).

---

### `/reading-the-shift` — Reading The Shift Hub

**Publication status:** review
**Page purpose:** Question-led knowledge hub exploring AI-mediated markets.

**Hero content:**
- Eyebrow: "READING THE SHIFT"
- H1: "Questions worth asking as markets change."
- Lead: "AI is changing how people discover, understand, compare and choose. That raises new questions for businesses."
- Secondary lead: "Reading The Shift brings together NexFrontier perspectives on AI-mediated markets, customer intent, trust, Enterprise Value, readiness and what the evidence may mean."
- Hero visual: None

**Sections:**

1. **Search bar** — Full-text search across all questions, with clear button
2. **Group filter chips** — "All" + 7 group names (Understanding the Shift, Customers/Intent/Choice, Trust/Relevance/AI, Enterprise Value, Readiness/Enterprise Capability, Leadership/Strategy, NexFrontier Perspectives)
3. **Market filter chips** — "All markets", "Global", "New Zealand", "Malaysia"
4. **"Good Places to Start"** — 7 featured question cards (when no search/filter active)
5. **Question cards** — Each card shows: question text, direct answer preview, group name, market
6. **"Recently Answered"** — 5 most recent articles (when no search/filter active)
7. **Zero results state** — "We do not have an exact answer yet." with group suggestions and reset button

---

### `/reading-the-shift/[slug]` — Reading The Shift Article

**Publication status:** review (all 35 articles + 1 future placeholder)
**Page purpose:** Individual question-led article with structured answer, evidence and related questions.

**Article page structure:**
- Back link: "Reading The Shift"
- Breadcrumb: Reading The Shift > Group Name
- Eyebrow: Group name (uppercase)
- H1: The question
- Subtitle: Article title (italic)
- **Direct answer** — Highlighted with cyan left border, larger first paragraph
- **Body sections** — Heading, body paragraphs, pull quotes, lists, CTAs
- **NF Perspective** — Callout box with NexFrontier's interpretation
- **Sources / Evidence** — Structured list: source title, publisher, author, date
- **Author and date** — Footer with author, published date, updated date
- **Related questions** — Cards linking to related articles

**All 36 articles** are listed in Section 5 below.

---

### `/foundation-customers` — Foundation Customers

**Publication status:** review
**Page purpose:** Explain the Foundation Customer programme and invite participation.

**Hero content:**
- Eyebrow: "FOUNDATION CUSTOMERS"
- H1: "Building evidence before making stronger claims."
- Lead: "NexFrontier is working with a small group of Foundation Customers to build evidence of what AI-mediated markets mean for enterprise value."
- Primary CTA: "Make a Market Enquiry" → `/market-enquiry`
- Hero visual: Code-based gradient panel

**Sections:**

1. **"What a Foundation Customer is"** — A business working with NexFrontier to explore what AI-mediated markets mean for their enterprise value, building evidence together before either side makes stronger claims.

2. **"What Foundation Customers get"** — List:
   - Early access to NexFrontier intelligence capabilities
   - Evidence-based exploration of Quiet Loss and Adaptive Value
   - A structured engagement designed to produce commercial insight, not a pitch

3. **"What NexFrontier learns"** — Foundation Customers help NexFrontier build evidence that its thesis is commercially meaningful.

4. **"Is this a fit?"** — Criteria for participation.

5. **CTA:**
   - "Make a Market Enquiry" → `/market-enquiry`

---

### `/about` — About

**Publication status:** review
**Page purpose:** Present NexFrontier's team and company story.

**Hero content:**
- Eyebrow: "ABOUT"
- H1: "About NexFrontier"
- Lead: "NexFrontier is building intelligence for AI-mediated markets."
- Hero visual: Code-based gradient panel

**Sections:**

1. **"The company"** — NexFrontier is building intelligence for AI-mediated markets, working at the intersection of business possibility, organisational capability and emerging technology.

2. **"The team"** — Three team member cards:
   - **Sukesh Sukumaran** — Founder & CEO, Auckland, NZ → `/about/sukesh-sukumaran`
   - **Nela Muttettuwegama** — Head, Systems & Intelligence, Christchurch, NZ → `/about/nela-muttettuwegama`
   - **Chris Stanley** — Director, Commercial & Partnerships, Malaysia, Kuala Lumpur → `/about/chris-stanley`
   - Each card shows: photo, name, role, location, LinkedIn link
   - Sukesh's card also has a video placeholder indicator

3. **"Malaysia Digital status"** — MDEC badge shown in footer (not on About page directly)

4. **CTA:**
   - "Make a Market Enquiry" → `/market-enquiry`

---

### `/about/sukesh-sukumaran` — Sukesh Sukumaran Profile

**Publication status:** review
**Page purpose:** Full bio for the Founder & CEO.

**Hero content:**
- Eyebrow: "TEAM"
- H1: "Sukesh Sukumaran"
- Subtitle: "Founder & CEO · Auckland, New Zealand"
- Back link: "About" → `/about`
- Hero visual: `sukesh-pic.png` (CANONICAL)

**Sections:**

1. **Bio** — 5 paragraphs covering:
   - Business leader, strategist and venture builder focused on turning change into commercial opportunity
   - Career spans business growth, strategy, technology, education, economic development and renewable energy
   - Founded NexFrontier around the conviction that when markets change, advantage belongs to businesses that can recognise, understand and adapt
   - Recognised with Business, Entrepreneurship & Innovation Changemaker Award at Icons of Change 2026
   - Author of forthcoming "Strategy Before Strategy"

2. **LinkedIn link** — https://nz.linkedin.com/in/sukeshsukumaran

3. **Video placeholder** — `hasVideoPlaceholder: true` (no video published yet)

---

### `/about/nela-muttettuwegama` — Nela Muttettuwegama Profile

**Publication status:** review
**Page purpose:** Full bio for Head, Systems & Intelligence.

**Hero content:**
- Eyebrow: "TEAM"
- H1: "Nela Muttettuwegama"
- Subtitle: "Head, Systems & Intelligence · Christchurch, New Zealand"
- Back link: "About" → `/about`
- Hero visual: `nela_pic.jpeg` (CANONICAL)

**Sections:**

1. **Bio** — 3 paragraphs covering:
   - Systems architect and AI builder; career spans large-scale operations management, business development, enterprise automation across Sri Lanka, Europe and NZ
   - Focus: how organisations translate intent into reliable results
   - At NexFrontier: leads development of core technology and intelligence capabilities

2. **LinkedIn link** — https://nz.linkedin.com/in/nela-muttettuwegama

---

### `/about/chris-stanley` — Chris Stanley Profile

**Publication status:** review
**Page purpose:** Full bio for Director, Commercial & Partnerships, Malaysia.

**Hero content:**
- Eyebrow: "TEAM"
- H1: "Chris Stanley"
- Subtitle: "Director, Commercial & Partnerships, Malaysia · Kuala Lumpur, Malaysia"
- Back link: "About" → `/about`
- Hero visual: `chris_pic.png` (CANONICAL)

**Sections:**

1. **Bio** — 4 paragraphs covering:
   - Commercial strategist and operator focused on helping businesses unlock growth through customer experience, asset optimisation and market expansion
   - Career across retail, property and destination development
   - Deep appreciation for realities of customer behaviour and operational execution
   - At NexFrontier: leads commercial validation, strategic partnerships and market development

2. **LinkedIn link** — https://www.linkedin.com/in/cs-asia

---

### `/investor` — Investor

**Publication status:** review
**Page purpose:** Provide investor information and invite investor enquiries.

**Hero content:**
- Eyebrow: "INVESTOR"
- H1: "Investor"
- Lead: "NexFrontier is building intelligence for AI-mediated markets."
- Hero visual: Code-based gradient panel

**Sections:**

1. **"The opportunity"** — AI is changing how markets work. NexFrontier is building the intelligence layer for that shift.

2. **"The company"** — NexFrontier Group operates across New Zealand and Malaysia, with Malaysia Digital status awarded by MDEC.

3. **"The approach"** — Foundation Customers first. Evidence before claims.

4. **"For investors"** — Invitation to start a conversation:
   - CTA: "Make a Market Enquiry" → `/market-enquiry?type=investor`

---

### `/market-enquiry` — Market Enquiry

**Publication status:** review
**Page purpose:** Contact form for potential customers, investors and partners.

**Hero content:**
- Eyebrow: "MARKET ENQUIRY"
- H1: "Start a conversation."
- Lead: "Tell us about the question you are exploring and why NexFrontier may be relevant."
- Hero visual: Code-based gradient panel

**Sections:**

1. **Enquiry form** — Detailed in Section 7 below.

2. **Alternative contact** — Footer shows email, WhatsApp and LinkedIn for both Malaysia and NZ.

---

### `/privacy` — Privacy

**Publication status:** review
**Page purpose:** Privacy policy (draft — legal review required).

**Hero content:**
- Eyebrow: "LEGAL"
- H1: "Privacy"
- Lead: "How NexFrontier uses information provided through this website."
- Hero visual: None (functional variant)

**Sections:**

1. **Legal Review Required warning** — Yellow callout: "These terms contain the structural framework for the website. Final binding language must be reviewed and approved by legal counsel before publication."

2. **Privacy sections:**
   - What we collect — name, email, organisation, role, enquiry type, revenue range, message, website (from Market Enquiry form)
   - How we use it — to respond to enquiries and determine the most useful next conversation
   - Sharing — not shared with third parties except as required by law
   - Retention — retained for as long as needed to respond to the enquiry
   - Your rights — request access, correction or deletion
   - Cookies — this website does not use tracking cookies
   - Contact — hello@nexfrontier.my (Malaysia) or hello@nexfrontierlogic.nz (New Zealand)

---

### `/terms` — Terms

**Publication status:** review
**Page purpose:** Terms of use (draft — legal review required).

**Hero content:**
- Eyebrow: "LEGAL"
- H1: "Terms"
- Lead: "Terms of use for the NexFrontier website."
- Hero visual: None (functional variant)

**Sections:**

1. **Legal Review Required warning** — Same yellow callout as Privacy page.

2. **Terms sections:**
   - Website use — provided for informational purposes
   - Content — may be updated, changed or removed without notice
   - Intellectual property — NexFrontier retains rights; framework names (Quiet Loss™, Adaptive Value™, ORBIT™, AMCT™, Intent Threads™) are used by NexFrontier
   - Trademarks — NexFrontier and related marks; other marks belong to respective owners
   - Illustrative calculator disclaimer — calculator provides illustrative scenario, not diagnosis, forecast or valuation
   - No financial or professional advice
   - External links — not responsible for external content
   - Liability — provided "as is"; no warranty of completeness or accuracy
   - Governing law — "to be confirmed as part of legal review"
   - Contact — hello@nexfrontier.my or hello@nexfrontierlogic.nz

---

### 404 — Not Found

**Page purpose:** Guide lost visitors back to relevant content.

**Hero content:**
- Eyebrow: "PAGE NOT FOUND"
- H1: "The signal seems to have moved."
- Lead: "The page you were looking for may have changed location or may no longer be available."
- Hero visual: None (functional variant)

**Sections:**

1. **"Continue Exploring"** — Four buttons:
   - "Search Reading The Shift" → `/reading-the-shift` (secondary)
   - "Home" → `/` (text)
   - "Enterprise Value" → `/enterprise-value` (text)
   - "Intelligence" → `/intelligence` (text)

---

### `/watch/[slug]` — Video Page

**Publication status:** No videos published. Architecture exists but `videoArticles` array is empty. All video slugs would return 404.

**Page structure (when populated):**
- Back link: "Reading The Shift"
- Breadcrumb: Watch > Video Title
- Eyebrow: "WATCH"
- H1: Video title
- Lead: Summary
- YouTube embed (using youtube-nocookie.com)
- Description
- Transcript / Supporting content
- Presenter and date

---

## 2. Current Navigation

### Desktop Header Nav

| Label | Path | Type |
|---|---|---|
| The Shift | `/the-shift` | Direct link |
| Intelligence | `/intelligence` | Dropdown |
| Enterprise Value | `/enterprise-value` | Dropdown |
| Reading The Shift | `/reading-the-shift` | Direct link |
| Foundation Customers | `/foundation-customers` | Direct link |
| About | `/about` | Direct link |
| Market Enquiry | `/market-enquiry` | Direct link (text) |
| Investor | `/investor` | Direct link (bordered button with arrow) |

### Dropdown Structure

**Intelligence dropdown:**
- Overview — `/intelligence` — "What NexFrontier is building"
- The Brain — `/intelligence/the-brain` — "Connect evidence. Learn what matters."
- Intent Threads™ — `/intelligence/intent-threads` — "Reconnect evidence around an underlying need."
- ORBIT™ — `/intelligence/orbit` — "Translate what matters into Enterprise Value."
- AMCT™ — `/intelligence/amct` — "Customer. AI. Business. Trust."
- Human in the Lead — `/intelligence/human-in-the-lead` — "Evidence-led decisions, human judgement."
- Enterprise Capability — `/intelligence/enterprise-capability` — "The ability to keep earning readiness."

**Enterprise Value dropdown:**
- Overview — `/enterprise-value` — "The wider economic picture."
- Quiet Loss™ — `/enterprise-value/quiet-loss` — "Protect or recover existing value."
- Adaptive Value™ — `/enterprise-value/adaptive-value` — "Explore additional value made possible by change."
- Enterprise Value Calculator — `/enterprise-value/calculator` — "Explore an illustrative annual value scenario."

### Mobile Nav

Full-screen overlay menu (fixed, top: 72px). Toggles via hamburger/X icon.
- Top-level items listed as full-width buttons with bottom borders
- Dropdown groups open a sub-page with a "Main Menu" back button
- Action links (Market Enquiry, Investor) shown as bordered buttons below the nav list

### Footer Navigation

**Three columns:**

| Explore | Value | Company |
|---|---|---|
| The Shift → `/the-shift` | Quiet Loss™ → `/enterprise-value/quiet-loss` | About → `/about` |
| Intelligence → `/intelligence` | Adaptive Value™ → `/enterprise-value/adaptive-value` | Investor → `/investor` |
| Enterprise Value → `/enterprise-value` | Enterprise Value Calculator → `/enterprise-value/calculator` | Market Enquiry → `/market-enquiry` |
| Reading The Shift → `/reading-the-shift` | ORBIT™ → `/intelligence/orbit` | |
| Foundation Customers → `/foundation-customers` | | |

**Contact section (two columns):**

Malaysia:
- Email: hello@nexfrontier.my
- Address: L9, Menara Public Gold @TRX, 50400 Kuala Lumpur
- WhatsApp: +60 12 601 0888
- LinkedIn: /company/nexfrontierlogic

New Zealand:
- Email: hello@nexfrontierlogic.nz
- WhatsApp: +64 21 94 96 93
- LinkedIn: /company/nexfrontierlogic

**Bottom links:** Privacy → `/privacy` | Terms → `/terms`
**Copyright:** © 2026 NexFrontier. All rights reserved.
**MDEC badge:** Malaysia Digital status badge shown in footer left column

---

## 3. Visual Register

| Visual ID | Route | Current Filename | Status | Rendered? | Type | Approved? | Placeholder? | Notes |
|---|---|---|---|---|---|---|---|---|
| VISUAL-HOME | `/` | (none) | N/A | Yes | Code-based gradient | N/A | No | Hero uses CSS gradient panel |
| VISUAL-SHIFT | `/the-shift` | (none) | N/A | Yes | Code-based gradient | N/A | No | Hero uses CSS gradient panel |
| VISUAL-EV | `/enterprise-value` | (none) | N/A | Yes | Code-based gradient | N/A | No | No canonical image assigned |
| VISUAL-QL | `/enterprise-value/quiet-loss` | (none) | N/A | Yes | Code-based gradient | N/A | No | `canonicalVisuals.quietLoss` is empty string |
| VISUAL-AV | `/enterprise-value/adaptive-value` | `Adaptive_Value_website_Aug26.png` | CANONICAL | Yes | Image asset | Yes | No | Approved final AV visual. Do not redraw or alter. Mobile suitability: fair. |
| VISUAL-AMCT | `/intelligence/amct` | `ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png` | UNCERTAIN | Yes | Image asset | No | No | Multiple copies exist. Flagged for confirmation. `canonicalVisuals.amct` points to this file but asset register marks it UNCERTAIN. |
| VISUAL-EV-OVERVIEW | `/enterprise-value` | `ChatGPT_Image_Aug_25,_2026,_12_22_29_AM.png` | UNCERTAIN | No | Image asset | No | No | Previously marked CANONICAL but reverted. `canonicalVisuals.enterpriseValue` is empty string — not rendered. |
| VISUAL-BRAIN | `/intelligence/the-brain` | (BrainVisual component) | N/A | Yes | Code-based | N/A | No | Animated node/connection visual built in React |
| VISUAL-INTENT | `/intelligence/intent-threads` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-ORBIT | `/intelligence/orbit` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-HUMAN | `/intelligence/human-in-the-lead` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-EC | `/intelligence/enterprise-capability` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-FOUNDATION | `/foundation-customers` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-INVESTOR | `/investor` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-MARKET | `/market-enquiry` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-ABOUT | `/about` | (none) | N/A | Yes | Code-based gradient | N/A | No | |
| VISUAL-SUKESH | `/about/sukesh-sukumaran` | `sukesh-pic.png` | CANONICAL | Yes | Image asset | Yes | No | |
| VISUAL-NELA | `/about/nela-muttettuwegama` | `nela_pic.jpeg` | CANONICAL | Yes | Image asset | Yes | No | |
| VISUAL-CHRIS | `/about/chris-stanley` | `chris_pic.png` | CANONICAL | Yes | Image asset | Yes | No | |
| VISUAL-MDEC | Footer | `MD_MDEC.png` | CANONICAL | Yes | Image asset | Yes | No | Malaysia Digital badge |
| VISUAL-LOGO-DARK | Header/Footer | `NF_Logo_Black_BG.png` | CANONICAL | Yes | Image asset | Yes | No | Primary logo for dark theme |
| VISUAL-LOGO-LIGHT | (unused) | `NF_Logo_White_BG.png` | LEGACY | No | Image asset | No | No | Available if light surface introduced |

### Uncertain/Unidentified Assets in `public/assets/images/`

| Filename | Subject | Status | Notes |
|---|---|---|---|
| `ChatGPT_Image_Aug_25,_2026,_12_09_28_AM.png` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification. |
| `NexFrontier_Visual_1.jpg` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification. |
| `Screenshot_2026-08-22_at_8.41.47_AM.png` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification or removal. |
| `Screenshot_2026-08-23_at_1.27.42_AM.png` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification or removal. |
| `Screenshot_2026-08-23_at_9.14.37_PM.png` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification or removal. |
| `Screenshot_2026-08-24_at_1.56.02_AM.png` | Unknown | UNCERTAIN | Purpose unclear. Flagged for identification or removal. |
| `ChatGPT_Image_Aug_23,_2026,_01_35_18_PM.png` | AMCT (original) | UNCERTAIN | Which copy is canonical? |
| `ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy 2.png` | AMCT (copy 2) | UNCERTAIN | Which copy is canonical? |

---

## 4. Screenshots

**Location:** `docs/review-screenshots/`

The Bolt environment does not have a headless browser available to capture screenshots programmatically. A README with instructions for manual screenshot capture has been placed in the folder.

To populate:
1. Open the preview deployment URL in a desktop browser at 1440px width
2. Capture full-page screenshots for each key page
3. For mobile, set viewport to 390px width

**Required desktop screenshots:** Home, The Shift, Intelligence, The Brain, AMCT, Enterprise Value, Quiet Loss, Adaptive Value, Calculator, Reading The Shift hub, one Reading article, Foundation Customers, Investor, About, Market Enquiry

**Required mobile screenshots:** Home, Enterprise Value, Calculator, Reading The Shift, Foundation Customers, Market Enquiry

---

## 5. Reading The Shift Content Model

### Question Groups (7)

| Slug | Name | Purpose |
|---|---|---|
| understanding-the-shift | Understanding the Shift | Help visitors understand what AI-mediated markets are and what is actually changing. |
| customers-intent-choice | Customers, Intent & Choice | Explore how AI may change customers before they reach the enterprise. |
| trust-relevance-ai | Trust, Relevance & AI | Explore trust, recommendation, relevance and the Customer-AI-Business relationship. |
| enterprise-value | Enterprise Value | Explore the economic consequences of changing market conditions. |
| readiness-enterprise-capability | Readiness & Enterprise Capability | Explore what businesses may need to recognise, understand and adapt to. |
| leadership-strategy | Leadership & Strategy | Frame the questions CEOs, Boards and senior leaders increasingly need to ask. |
| nexfrontier-perspectives | NexFrontier Perspectives | Answer deeper questions about NF thesis, concepts and emerging point of view. |

### All 36 Articles

| ID | Slug | Question | Status | Group | Published Date |
|---|---|---|---|---|---|
| RTS001 | what-is-an-ai-mediated-market | What is an AI-mediated market? | review | understanding-the-shift | 2026-08-18 |
| RTS002 | how-is-ai-changing-buying-decisions | How is AI changing the way people make buying decisions? | review | understanding-the-shift | — |
| RTS003 | why-is-internal-ai-only-half-the-shift | Why is using AI inside the business only half the shift? | review | understanding-the-shift | 2026-08-12 |
| RTS004 | external-ai-vs-enterprise-ai | How is external AI different from enterprise AI? | review | understanding-the-shift | — |
| RTS005 | when-customers-start-buying-with-ai | What changes when customers start their buying journey with AI? | review | understanding-the-shift | — |
| RTS006 | how-is-ai-changing-customers-reaching-businesses | How is AI changing the customers reaching businesses? | review | customers-intent-choice | — |
| RTS007 | can-similar-enquiries-have-different-intent | Can two enquiries that look the same carry very different levels of intent? | review | customers-intent-choice | — |
| RTS008 | does-ai-make-customers-more-informed | Does AI make customers more informed before they contact a business? | review | customers-intent-choice | — |
| RTS009 | how-could-ai-change-customer-expectations | How could AI change customer expectations? | review | customers-intent-choice | — |
| RTS010 | what-happens-when-customer-context-is-lost | What happens when customer context is lost after they reach a business? | review | customers-intent-choice | — |
| RTS011 | how-does-ai-change-trust-in-buying | How does trust change when AI becomes part of the buying journey? | review | trust-relevance-ai | — |
| RTS012 | what-is-the-ai-mediated-choice-triangle | What is the AI-Mediated Choice Triangle, AMCT™? | review | trust-relevance-ai | — |
| RTS013 | how-does-ai-understand-business-relevance | What evidence might AI use to understand whether a business is relevant? | review | trust-relevance-ai | — |
| RTS014 | can-customers-trust-a-business-that-ai-does-not-understand | Can a business be trusted by customers but poorly understood by AI? | review | trust-relevance-ai | — |
| RTS015 | how-should-businesses-think-about-trust-in-ai | How should businesses think about trust in AI? | review | trust-relevance-ai | — |
| RTS016 | can-a-business-perform-well-and-still-miss-value | Can a business be performing well and still be missing value? | review | enterprise-value | — |
| RTS017 | what-is-quiet-loss | What is Quiet Loss™? | review | enterprise-value | — |
| RTS018 | why-can-quiet-loss-be-hard-to-see | Why can Quiet Loss™ be difficult to see? | review | enterprise-value | — |
| RTS019 | what-is-adaptive-value | What is Adaptive Value™? | review | enterprise-value | — |
| RTS020 | how-can-market-change-create-enterprise-value | How can market change create additional enterprise value? | review | enterprise-value | — |
| RTS021 | business-readiness-in-ai-mediated-markets | What does business readiness mean in an AI-mediated market? | review | readiness-enterprise-capability | — |
| RTS022 | why-is-business-readiness-perishable | Why is readiness perishable? | review | readiness-enterprise-capability | — |
| RTS023 | what-is-enterprise-capability | What is Enterprise Capability? | review | readiness-enterprise-capability | — |
| RTS024 | how-should-businesses-decide-what-to-adapt | How should a business decide what to adapt as the market changes? | review | readiness-enterprise-capability | — |
| RTS025 | does-more-ai-make-a-business-more-ready | Does becoming more AI-enabled automatically make a business more ready? | review | readiness-enterprise-capability | — |
| RTS026 | what-should-ceos-ask-about-ai-mediated-markets | What should CEOs be asking about AI-mediated markets? | review | leadership-strategy | — |
| RTS027 | how-should-boards-think-about-external-ai | How should Boards think about AI outside the enterprise? | review | leadership-strategy | — |
| RTS028 | how-should-businesses-prepare-for-ai-mediated-choice | How should businesses prepare for AI-mediated choice? | review | leadership-strategy | — |
| RTS029 | when-does-market-change-deserve-executive-attention | When does a market signal deserve executive attention? | review | leadership-strategy | — |
| RTS030 | how-do-leaders-know-if-adaptation-is-worth-it | How do leaders know whether adaptation is worth the cost? | review | leadership-strategy | — |
| RTS031 | what-is-nexfrontier-building | What is NexFrontier building? | review | nexfrontier-perspectives | — |
| RTS032 | what-is-orbit | What is ORBIT™ and what is it used for? | review | nexfrontier-perspectives | — |
| RTS033 | what-are-intent-threads | What are Intent Threads™? | review | nexfrontier-perspectives | — |
| RTS034 | what-is-the-brain-at-nexfrontier | What is The Brain at NexFrontier? | review | nexfrontier-perspectives | — |
| RTS035 | why-foundation-customers-before-stronger-claims | Why is NexFrontier working with Foundation Customers before making stronger claims? | review | nexfrontier-perspectives | — |
| RTS-FUTURE-NZ | ai-mediated-choice-in-new-zealand | What does AI-mediated choice mean in New Zealand? | draft | understanding-the-shift | — |

### Content Model Fields

Each article contains:
- `id` — Internal ID (RTS001–RTS035, RTS-FUTURE-NZ)
- `slug` — URL slug
- `question` — The H1 question
- `alternateQuestions` — Search synonym support
- `title` — Subtitle shown below H1
- `directAnswer` — Highlighted answer block (first paragraph larger)
- `summary` — Used for search results preview
- `group` — One of 7 group slugs
- `tags` — Controlled vocabulary tags
- `market` — Global, New Zealand, or Malaysia
- `bodySections` — Array of structured sections (heading, body, body2, pullQuote, list, ctaLabel, ctaLink)
- `nfPerspective` — NexFrontier's interpretation (shown in callout box)
- `relevantFrameworks` — Related framework names
- `evidenceSources` — Structured evidence list (sourceTitle, publisher, author, publicationDate, url, accessDate, sourceType)
- `relatedQuestionIds` — Editorial related-question links
- `author` — Currently "Sukesh Sukumaran" for all articles
- `publishedDate` — Only set for RTS001 (2026-08-18) and RTS003 (2026-08-12)
- `updatedDate` — Not set for any article
- `seoTitle` — Separate from H1
- `metaDescription` — Separate from direct answer
- `canonicalPath` — `/reading-the-shift/{slug}`
- `socialTitle` — Separate from H1 (only set for RTS001)
- `legacySlugs` — For redirect support (not currently set)

### Featured Starting Questions (7)

These appear as "Good Places to Start" on the Reading The Shift hub when no search/filter is active:
1. what-is-an-ai-mediated-market
2. how-is-ai-changing-customers-reaching-businesses
3. why-is-internal-ai-only-half-the-shift
4. can-a-business-perform-well-and-still-miss-value
5. what-is-quiet-loss
6. what-is-adaptive-value
7. what-should-ceos-ask-about-ai-mediated-markets

---

## 6. Calculator UI and Logic Summary

### Location
`/enterprise-value/calculator` — uses `EnterpriseValueCalculator` client component

### 4-Stage Flow

**Stage 1: Your Business**
- Heading: "Your Business"
- Question: "What does the business look like today?"
- Supporting: "Use annual figures wherever requested. These numbers create the reference point for the scenario."

| # | Input Label | Variable | Hint | Default | Required |
|---|---|---|---|---|---|
| 01 | Annual Revenue | R | — | empty | yes (≥0) |
| 02 | Annual Non-People Operating Cost | OC | "Examples may include facilities, systems, suppliers and other non-people operating costs." | empty | no |
| 03 | Annual People / Capacity Cost | PC | "Annual people and capacity-related cost." | empty | no |
| 04 | Annual EBITDA | E | "May be negative." | empty | no (allows negative) |
| 05 | Active Customers | A | — | empty | no |
| 06 | Average Customer Lifetime Value | LTV | — | empty | no |
| 07 | Average Customer Lifetime | T | "Years. Must be greater than zero." | empty | yes (>0) |

- **Derived values shown:** EBITDA Margin (calculated), Annualised Customer Value Pool (customers × LTV / lifetime)
- Pool note: "Used only as an annual Customer Value reference. Not claimed revenue."
- **Next button:** "Continue to Quiet Loss™" (disabled until Revenue ≥0 and Lifetime >0)

**Stage 2: Quiet Loss™**
- Heading: "What value might already be going unrealised?"
- Supporting: "Apply scenario assumptions across the five Enterprise Value dimensions. These are your assumptions. They are not NexFrontier benchmarks."

| # | Dimension Label | Variable | Formula | Default | Range | Step |
|---|---|---|---|---|---|---|
| 01 | Revenue | % | R × % | 1% | 0–10% | 0.25 |
| 02 | Cost | % | OC × % | 1% | 0–10% | 0.25 |
| 03 | Capacity | % | PC × % | 1% | 0–10% | 0.25 |
| 04 | Customer Value | % | Pool × % | 1% | 0–10% | 0.25 |
| 05 | Enterprise Capability | pp | R × pp | 0.1 pp | 0–2 pp | 0.1 |

- Each row has a range slider + number input + unit display
- Each row shows: "Default: X%. Illustrative starting assumption."
- **Result card:** "Illustrative Quiet Loss™ Opportunity" — gross annual scenario value
- Note: "Potential existing value that may warrant protection or recovery."
- Warning: "This is not confirmed loss."
- **Back:** "Back to Your Business" | **Next:** "Continue to Adaptive Value™"

**Stage 3: Adaptive Value™**
- Heading: "What more could become possible?"
- Supporting: "Apply assumptions for additional annual value that changing market conditions may make possible. Again, these are scenario assumptions, not forecasts."
- Same 5-dimension assumption sliders as Stage 2 (independent values)
- **Result card:** "Illustrative Adaptive Value™ Opportunity" — gross annual scenario value
- Note: "Potential additional annual value above today's position."
- Warning: "This is not a forecast."
- **Back:** "Back to Quiet Loss™" | **Next:** "See My Enterprise Value"

**Stage 4: Enterprise Value**
- Heading: "Your Enterprise Value Scenario"
- Supporting: "Quiet Loss™ and Adaptive Value™ show the gross value possibilities entered in your scenario. The next step applies economic reality."

Summary cards:
- Quiet Loss™ Opportunity (gross)
- Adaptive Value™ Opportunity (gross)
- Gross Value Opportunity (combined, with sublabel: "Gross value before overlap, uncertainty and estimated cost to realise.")

**Economic Reality adjustments:**

| # | Adjustment | Variable | Default | Range | Step | Explanation |
|---|---|---|---|---|---|---|
| 01 | Cross-Dimension Overlap | O | 20% | 0–50% | 5 | "Value across Revenue, Cost, Capacity, Customer Value and Enterprise Capability may reflect related economics." |
| 02 | Expected Realisation | P | 70% | 0–100% | 5 | "What share of the adjusted opportunity do you expect could reasonably survive uncertainty, execution risk and practical constraints?" |
| 03 | Estimated Annual Cost to Realise | I | empty | — | — | "Estimate the additional annual investment required to realise the scenario." Manual number input. |

Each adjustment shows: "This is your scenario assumption, not a NexFrontier benchmark."

**Outputs:**
- Overlap Value (GVO × overlap%)
- Adjusted Opportunity (GVO × (1 − overlap%))
- Expected Realisable Value (adjusted × realisation%)
- Risk / Uncertainty Allowance (adjusted × (1 − realisation%))
- **Enterprise Value Delta** (Expected Realisable − Cost to Realise) — shown large, color-coded:
  - Green (positive): "Above Status Quo"
  - Red (negative): "Below Status Quo"
  - Neutral: "Broadly in line with Status Quo"
  - Subtext: "Illustrative annual movement relative to today's position."

**Visual elements in Stage 4:**
- Status Quo Visual — horizontal gradient bar (red → neutral → green) with position indicator
- Value Bridge — Step-by-step breakdown: Status Quo → +QL → +AV → −Overlap → −Risk → −Cost → EV Delta
- Five-Dimension Gross Breakdown — Table showing QL, AV and total per dimension

**NF Perspective box:**
- "A lens, not a promise."
- "This calculator uses your business figures and scenario assumptions to explore possible Enterprise Value. It does not diagnose Quiet Loss™, forecast Adaptive Value™ or value your business."
- "The result is an illustrative annual movement relative to today's position. Its purpose is to make the economic possibility visible enough to ask whether it deserves investigation."
- "Evidence determines what is real, what is material and what may be worth acting on."

**Explore further links:**
- "Understand Quiet Loss™" → `/enterprise-value/quiet-loss`
- "Understand Adaptive Value™" → `/enterprise-value/adaptive-value`
- "Make a Market Enquiry" → `/market-enquiry`

**Back:** "Back to Adaptive Value™" (no next button)

### Formulas

```
Pool = Customers × (LTV / Lifetime)

QL Revenue    = Revenue × QL_revenue% / 100
QL Cost       = NonPeopleCost × QL_cost% / 100
QL Capacity   = PeopleCost × QL_capacity% / 100
QL Customer   = Pool × QL_customer% / 100
QL Capability = Revenue × QL_capability_pp / 100
QL Gross      = sum of above

AV Gross      = same formulas with AV assumptions

GVO           = QL Gross + AV Gross
Overlap Value = GVO × (Overlap% / 100)
Adjusted Opp  = GVO × (1 − Overlap% / 100)
Expected Real = Adjusted Opp × (Realisation% / 100)
Risk Allow   = Adjusted Opp × (1 − Realisation% / 100)
EV Delta     = Expected Real − Cost to Realise
Neutral Threshold = Revenue × 0.0025
```

### Mobile Behaviour
- Uses CSS `clamp()` for responsive font sizes
- Grid layouts collapse to single column via media queries in `globals.css`
- Stage 4 two-column summary cards stack vertically
- Value bridge and breakdown tables remain vertical (already single-column)
- Range sliders and number inputs remain side-by-side but may narrow

### Disabled Functionality
- No "save scenario" or "download report" — results are ephemeral (client-side state only)
- No "share scenario" — no URL persistence
- Analytics tracking fires on stage completion but has no sink configured (events are inert)

---

## 7. Forms Behaviour

### Market Enquiry Form (`/market-enquiry`)

**Component:** `MarketEnquiryForm` (client component, wrapped in Suspense for `useSearchParams`)

**Fields:**

| Field | Type | Required? | Conditional? | Placeholder |
|---|---|---|---|---|
| Name | text | Yes | No | "Your name" |
| Work email | email | Yes | No | "you@company.com" |
| Organisation | text | Yes (only if enquiry type = Foundation Customer) | Yes | "Company name" |
| Role | text | No | No | "Your role" |
| Enquiry type | select | Yes | No | "Select an enquiry type" |
| Annual revenue range | select | No | Shown only if enquiry type = Foundation Customer or Market/Customer Enquiry | "Select a range (optional)" |
| Message | textarea | No | No | "Tell us about the question you are exploring and why NexFrontier may be relevant." |
| Website | url | No | No | "https://" |
| Consent | checkbox | Yes | No | "I understand NexFrontier will use the information I provide to respond to my enquiry, in accordance with its privacy practices." |

**Enquiry types:**
- Foundation Customer
- Investor
- Partnership
- Market / Customer Enquiry
- Other

**Revenue ranges:**
- Under $2m
- $2m – $5m
- $5m – $20m
- $20m – $100m
- $100m+
- Prefer not to say

**Prefill behaviour:**
- URL query param `?type=X` prefills the enquiry type select
- Valid values: `foundation-customer`, `investor`, `partnership`, `market-customer`, `other`
- Used by Investor page CTA: `/market-enquiry?type=investor`

**Validation:**
- Name, email, enquiry type required
- Organisation required if enquiry type is `foundation-customer`
- Consent checkbox required
- Error message: "Please complete the required fields." / "Organisation is required for Foundation Customer enquiries." / "Please confirm you understand how NexFrontier will use your information."

**Success message:**
- Checkmark icon in cyan circle
- "Thank you. Your enquiry has been received."
- "We will use the context you provided to determine the most useful next conversation. A member of the NexFrontier team will be in touch."
- Italic: "Thank you for your interest. We will be in touch shortly."

**Failure message:**
- API error: `data.message` from response, or "Something went wrong. Please try again."
- Network error: "Network error. Please try again."

**Backend status:**
- API route: `/api/enquiry` (POST)
- Currently returns **503**: `"Not connected. This form is not yet live."`
- No CRM (HubSpot), email, or database connected
- The form is architecturally complete but the backend is intentionally not wired to any destination

**Acknowledgement status:** No auto-reply email is sent (no SMTP configured)

**Destination status:** No destination configured. All submissions return 503.

---

## 8. Company Identity as Rendered

### NexFrontier Group Sdn. Bhd. (Malaysia)

| Field | Value as Rendered | Source |
|---|---|---|
| Company name | Not explicitly rendered on any page | — |
| Malaysian registration number | Not rendered | — |
| Malaysian address | L9, Menara Public Gold @TRX, 50400 Kuala Lumpur | Footer, `siteConfig.contact.malaysia.address` |
| Email | hello@nexfrontier.my | Footer, Privacy, Terms |
| WhatsApp | +60 12 601 0888 | Footer |
| LinkedIn | /company/nexfrontierlogic | Footer |
| Malaysia Digital status | MDEC badge shown in footer | `MD_MDEC.png` |

### NexFrontier Logic Ltd. (New Zealand)

| Field | Value as Rendered | Source |
|---|---|---|
| Company name | Not explicitly rendered on any page | — |
| NZBN | Not rendered | — |
| NZ Company No. | Not rendered | — |
| NZ address | Not rendered | — |
| Email | hello@nexfrontierlogic.nz | Footer, Privacy, Terms |
| WhatsApp | +64 21 94 96 93 | Footer |
| LinkedIn | /company/nexfrontierlogic | Footer |

### Public Contact Emails
- Malaysia: hello@nexfrontier.my
- New Zealand: hello@nexfrontierlogic.nz

### Copyright
- "© 2026 NexFrontier. All rights reserved." (Footer)

### IP / Trademark Wording (from Terms page)
- "NexFrontier retains rights in the content, frameworks, concepts and materials presented on this website."
- "Framework names including Quiet Loss™, Adaptive Value™, ORBIT™, AMCT™ and Intent Threads™ are used by NexFrontier in connection with its work."
- "NexFrontier and related marks are used by NexFrontier. Other marks referenced on this website belong to their respective owners."

### Malaysia/NZ Role Wording
- Chris Stanley's role: "Director, Commercial & Partnerships, Malaysia"
- Sukesh Sukumaran: "Founder & CEO" (Auckland, NZ)
- Nela Muttettuwegama: "Head, Systems & Intelligence" (Christchurch, NZ)

### Flagged Mismatches
- **Malaysian registration number** — Not rendered anywhere. May be required for legal compliance.
- **NZBN / NZ Company No.** — Not rendered anywhere. May be required for legal compliance.
- **NZ physical address** — Not rendered (only email, WhatsApp, LinkedIn shown for NZ).
- **Company legal names** — Neither "NexFrontier Group Sdn. Bhd." nor "NexFrontier Logic Ltd." appears in rendered content. Only "NexFrontier" is used.
- **Governing law** — Terms page states: "Specific governing law and jurisdiction will be confirmed as part of legal review."

---

## 9. SEO / Metadata State

### Metadata Base
- `metadataBase` is set in `layout.tsx` using `SITE_URL` (which is `null` because `NEXT_PUBLIC_SITE_URL` is not set)
- When null, Next.js does not emit a base URL for relative canonical/OG URLs

### Canonical Behaviour
- Canonical tags are only emitted when `SITE_URL` is not null
- Currently: **no canonical tags are emitted** on any page
- Reading The Shift articles have `canonicalPath` defined but canonical is only added when `SITE_URL` exists

### Robots State
- `layout.tsx` sets default `robots: { index: false, follow: false }` for all pages
- `robots.ts` returns `Disallow: /` when `SHOULD_INDEX` is false (current state)
- Individual pages can override robots but none do — all inherit the noindex default
- Reading The Shift articles check `SHOULD_INDEX && status === 'published'` for indexing — both conditions fail

### Sitemap State
- `sitemap.ts` returns an empty array (`[]`) when `SHOULD_INDEX` is false
- Currently: **sitemap is empty** — no URLs returned

### Indexing State
- `SHOULD_INDEX = !!SITE_URL && SITE_INDEXING_ENABLED`
- `SITE_URL` = null (NEXT_PUBLIC_SITE_URL not set)
- `SITE_INDEXING_ENABLED` = false (not set to 'true')
- Result: **SHOULD_INDEX = false** — all pages are noindex

### Schema Types Used
- **Article JSON-LD** — on Reading The Shift article pages (articleJsonLd)
- **Breadcrumb JSON-LD** — on Reading The Shift article pages (breadcrumbJsonLd)
- No other schema types currently rendered

### Unpublished Route Behaviour
- Reading The Shift articles: `if (article.status !== 'published' && !isPreviewable) notFound()`
- `isPreviewable = !IS_PRODUCTION || PREVIEW_MODE`
- Currently: `IS_PRODUCTION = true` (production build), `PREVIEW_MODE = true` → `isPreviewable = true`
- Result: All review/draft articles render (preview mode is active)
- When `PREVIEW_MODE` is unset: all non-published articles return 404

### Preview Mode Behaviour
- `PREVIEW_MODE = true` (set in `.env`, server-side only)
- Not exposed to client bundles (no `NEXT_PUBLIC_` prefix)
- Gates unpublished content rendering on both Reading The Shift articles and video pages
- Page routes (navigation.ts) use status for sitemap eligibility, not for rendering gating

---

## 10. Functional Status

| Route | Renders | CTA Works | Form Works | Search Works | Calculator Works | Visual Present | Mobile Checked | Accessibility Checked | Known Issue |
|---|---|---|---|---|---|---|---|---|---|
| `/` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/the-shift` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/intelligence` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/intelligence/the-brain` | Yes | Yes | — | — | — | Yes (BrainVisual) | Not verified | Not verified | — |
| `/intelligence/intent-threads` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/intelligence/orbit` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/intelligence/amct` | Yes | Yes | — | — | — | Yes (image, UNCERTAIN) | Not verified | Not verified | AMCT visual canonical status unconfirmed |
| `/intelligence/human-in-the-lead` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/intelligence/enterprise-capability` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/enterprise-value` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/enterprise-value/quiet-loss` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | No canonical QL visual assigned |
| `/enterprise-value/adaptive-value` | Yes | Yes | — | — | — | Yes (image, CANONICAL) | Not verified | Not verified | Mobile suitability: fair |
| `/enterprise-value/calculator` | Yes | Yes | — | — | Yes | Yes (interactive) | Not verified | Not verified | No save/share/report functionality |
| `/reading-the-shift` | Yes | Yes | — | Yes | — | — | Not verified | Not verified | — |
| `/reading-the-shift/[slug]` | Yes | Yes | — | — | — | — | Not verified | Not verified | All articles are review status |
| `/foundation-customers` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/about` | Yes | Yes | — | — | — | Yes (team photos) | Not verified | Not verified | — |
| `/about/[slug]` | Yes | Yes | — | — | — | Yes (headshots) | Not verified | Not verified | Sukesh has video placeholder, no video published |
| `/investor` | Yes | Yes | — | — | — | Yes (code-based) | Not verified | Not verified | — |
| `/market-enquiry` | Yes | — | No (503) | — | — | Yes (code-based) | Not verified | Not verified | Backend not connected, returns 503 |
| `/privacy` | Yes | — | — | — | — | — | Not verified | Not verified | Legal review required |
| `/terms` | Yes | — | — | — | — | — | Not verified | Not verified | Legal review required |
| 404 | Yes | Yes | — | — | — | — | Not verified | Not verified | — |
| `/watch/[slug]` | N/A | — | — | — | — | — | — | — | No videos published; all slugs return 404 |

---

## 11. Current Known Gaps / Open Items

### Content
- All 36 Reading The Shift articles are at `review` status (34) or `draft` (1 — RTS-FUTURE-NZ). None are `published`.
- Only 2 articles have `publishedDate` set (RTS001: 2026-08-18, RTS003: 2026-08-12). The remaining 34 have no published date.
- All page routes are at `review` status. None are `published`.
- Company legal names (NexFrontier Group Sdn. Bhd., NexFrontier Logic Ltd.) are not rendered on any page.
- Malaysian registration number, NZBN, and NZ Company No. are not rendered anywhere.
- NZ physical address is not rendered (only email/WhatsApp/LinkedIn shown).

### Visual
- **AMCT visual** (`ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png`) — marked UNCERTAIN in asset register. Multiple copies exist. Canonical version needs human confirmation.
- **Enterprise Value overview visual** — `canonicalVisuals.enterpriseValue` is empty string. No canonical EV visual is rendered. The UNCERTAIN asset `ChatGPT_Image_Aug_25,_2026,_12_22_29_AM.png` exists but is not used.
- **Quiet Loss visual** — `canonicalVisuals.quietLoss` is empty string. No canonical QL visual is assigned.
- 6 unidentified image assets in `public/assets/images/` (screenshots and unknown diagrams) — flagged for identification or removal.
- Mobile suitability of the Adaptive Value visual is "fair" — may need a mobile-optimised version.

### Functional
- **Market Enquiry form** — Backend returns 503. No CRM, email, or database connected. Form is architecturally complete but submissions are not delivered anywhere.
- **Calculator** — No save, share, download, or report functionality. Results are ephemeral.
- **Video pages** — Architecture exists but no videos are published. `videoArticles` array is empty.
- Mobile and accessibility have not been formally verified.

### Legal
- **Privacy policy** — Draft. "Legal Review Required" warning displayed. Final binding language needs legal counsel approval.
- **Terms of use** — Draft. "Legal Review Required" warning displayed. Governing law is explicitly TBD.
- Company registration numbers not displayed — may be required for legal compliance in MY and NZ.

### Technical
- Bolt embedded Preview pane remains unavailable (not a code issue — platform limitation).
- `metadataBase` is null (no `NEXT_PUBLIC_SITE_URL`) — Open Graph URLs will not resolve correctly when shared.
- No analytics sink configured — `trackEvent` calls are inert.

### Production / Launch
- `NEXT_PUBLIC_SITE_URL` must be set to the production domain before launch.
- `SITE_INDEXING_ENABLED` must be set to `true` to enable indexing.
- All page routes must be moved from `review` to `published` for sitemap inclusion.
- Reading The Shift articles must be moved from `review` to `published` for public access (without `PREVIEW_MODE`).
- `PREVIEW_MODE` must be removed/unset for production so unpublished content returns 404.
- Market Enquiry backend must be connected to a CRM or email service.
- Canonical domain DNS must be configured.
- Company registration numbers must be added to the site (likely footer or Terms).

### Post-Launch
- Video content for Sukesh's profile page (placeholder exists, no video published).
- Mobile-optimised Adaptive Value visual.
- Analytics integration (GA4 or similar) — currently inert.
- Formal accessibility audit.
- Formal mobile testing across breakpoints.

---

## 12. Confirmation

- **Pack path:** `docs/v4-external-review-pack.md`
- **Screenshot folder path:** `docs/review-screenshots/` (contains README with manual capture instructions — no headless browser available in Bolt)
- **Pack reflects current codebase:** Yes — generated from source files read on 2026-08-26
- **No content or functionality was changed:** Confirmed — no application files were modified
- **Nothing was published:** Confirmed — no deployment or visibility changes were made
- **Indexing remains disabled:** Confirmed — `SHOULD_INDEX` is false, `robots.ts` returns `Disallow: /`, all pages are noindex, sitemap is empty
