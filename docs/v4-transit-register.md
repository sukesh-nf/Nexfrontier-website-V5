# NexFrontier Website v4 — Transit Register

**Status:** Internal project document. Not public. Not a website page.
**Purpose:** Holding register for content, components, and functionality that cannot be confidently placed in the v4 architecture without human review.

---

## Transit Items

### T001 — ValueStrip dimension labels (old five-part framework)
- **Original ID:** C004, C081, C099
- **Original location:** Home page (`#/`), `valueDimensions` in `src/data/content.ts`
- **Content:** Five labels: Defensive Value, Offensive Value, Revenue Health, Customer Lifetime Value, Enterprise Capability
- **Why unresolved:** These labels conflict with the canonical ORBIT dimensions (Revenue, Cost, Capacity, Customer Value, Enterprise Capability). The old structure is not canonical for v4.
- **Possible future destination:** Parts may be reused within Enterprise Value or Intelligence if reframed, but the five-label structure as-is should not continue publicly.
- **Decision required:** Should any of these labels be preserved in a different form, or should the canonical ORBIT dimensions fully replace them?

### T002 — LegacyCalculator component
- **Original ID:** C070
- **Original location:** `src/App.tsx`, function `LegacyCalculator` (lines 125–154). Not routed.
- **Content:** Standalone Quiet Loss calculator with 5 inputs (Annual revenue, Gross margin, Marketing spend, Sales cycle, Customer acquisition cost) and 5 outputs (Pipeline value, Velocity, CAC ratio, Spend efficiency, Quiet Loss at 12% of revenue).
- **Why unresolved:** Superseded by the Enterprise Value Calculator. Uses obsolete arbitrary 12%-of-revenue formula. Must not be routed publicly in v4. Must not reuse the old formula.
- **Possible future destination:** UI patterns may be independently reusable if they contain no obsolete calculation assumptions. Source preserved temporarily for technical reconciliation.
- **Decision required:** After final technical reconciliation, should this component be removed entirely, or do any UI patterns warrant preservation?

### T003 — calculateQuietLoss adapter (unused)
- **Original ID:** C104
- **Original location:** `src/services/adapters.ts`, function `calculateQuietLoss`
- **Content:** Returns `{ ok: false, message: 'The calculation service is ready to connect to the confirmed Quiet Loss logic.' }`
- **Why unresolved:** Not called from any routed component. Superseded by in-calculator logic and `sendEnterpriseValueReport`. May have been intended for a future backend calculation service.
- **Possible future destination:** Remove, or repurpose for backend QL calculation if a backend service is planned.
- **Decision required:** Is a backend calculation service planned, or is this fully superseded?

### T004 — requestQLReport adapter (unused)
- **Original ID:** C106
- **Original location:** `src/services/adapters.ts`, function `requestQLReport`
- **Content:** Returns `{ ok: true, message: 'Your report request is ready for the existing report workflow.' }`
- **Why unresolved:** Not called. The calculator uses `sendEnterpriseValueReport` instead. May have been intended for a separate QL report workflow.
- **Possible future destination:** Remove, or wire to a report workflow if one is planned.
- **Decision required:** Was this intended for a separate QL report workflow that may still be needed?

### T005 — requestInvestorAccess adapter (unused)
- **Original ID:** C107
- **Original location:** `src/services/adapters.ts`, function `requestInvestorAccess`
- **Content:** Returns `{ ok: true, message: 'Your investor access request is ready for the secure system connection.' }`
- **Why unresolved:** Not called. Investor page links to `#/enquiry` instead. The v4 Blueprint specifies a distinct investor form. This adapter may be relevant if a dedicated investor access flow is created.
- **Possible future destination:** Wire to a dedicated investor access form/route, or remove if the enquiry route remains the mechanism.
- **Decision required:** Will Investor access be a separate form/route, or will it continue to route through Market Enquiry?

### T006 — searchKnowledgeHub adapter (unused)
- **Original ID:** C108
- **Original location:** `src/services/adapters.ts`, function `searchKnowledgeHub`
- **Content:** Returns a preview search message. Not called. Reading The Shift uses local `useMemo` filtering instead.
- **Why unresolved:** v4 Reading The Shift will have a redesigned Hub with free-text search. A local/content-data search is acceptable for launch. This adapter may be unnecessary, or may be useful if backend search is later needed.
- **Possible future destination:** Remove, or wire to backend search if the content universe grows beyond local search capacity.
- **Decision required:** Is backend search planned for the Knowledge Hub, or will local filtering remain sufficient?

### T007 — trackWebsiteEvent (no-op analytics hook)
- **Original ID:** C109
- **Original location:** `src/services/adapters.ts`, function `trackWebsiteEvent`
- **Content:** No-op function. Not called from any component.
- **Why unresolved:** v4 must preserve or replace this with a clean analytics abstraction. No vendor should be hardwired until confirmed. The function itself is a placeholder.
- **Possible future destination:** Preserve as an analytics abstraction interface, or replace with a proper event-tracking module.
- **Decision required:** Which analytics vendor (if any) should be wired, and should the abstraction be preserved as-is until then?

### T008 — "A lens, not a promise" callout (third instance)
- **Original ID:** C070 callout (within LegacyCalculator)
- **Original location:** `src/App.tsx`, LegacyCalculator QL callout
- **Content:** Near-identical "lens, not a promise" wording also appearing in C029 (Quiet Loss NF Perspective) and C069 (Calculator NF Perspective).
- **Why unresolved:** Three near-identical instances exist. The canonical version should live on the Enterprise Value Calculator (C069). The QL page version (C029) may be consolidated. The legacy version (C070) is tied to the superseded calculator.
- **Possible future destination:** Consolidate into one canonical instance on the Enterprise Value Calculator. QL page may reference or link rather than repeat.
- **Decision required:** Should the QL page retain its own "lens, not a promise" section, or link to the calculator's version?

### T009 — Enquiry form "Email me my Quiet Loss Report" option
- **Original ID:** C049 (within MultiSelect options)
- **Original location:** `src/App.tsx`, Enquiry form MultiSelect options
- **Content:** One of the dropdown options reads "Email me my Quiet Loss Report"
- **Why unresolved:** The report product is now "Enterprise Value Report", not "Quiet Loss Report". However, the v4 Blueprint will supply the final form field architecture. Changing this prematurely could conflict with Blueprint decisions.
- **Possible future destination:** Update to "Email me my Enterprise Value Report" or equivalent, pending Blueprint form specification.
- **Decision required:** Confirm the final v4 Market Enquiry form field labels and options.

### T010 — Self-referential CTA on Enquiry page
- **Original ID:** C048
- **Original location:** `src/App.tsx`, Enquiry "Start a conversation" CTA linking to `#/enquiry` (same page)
- **Why unresolved:** This is likely a bug — the CTA links to the same page the user is already on. The v4 Blueprint will determine the correct destination for this CTA.
- **Possible future destination:** Remove, redirect to a different destination, or convert to a scroll-to-form anchor.
- **Decision required:** What should this CTA do on the v4 Market Enquiry page?

### T011 — Footer hidden text
- **Original ID:** C074 (within Footer)
- **Original location:** `src/App.tsx`, Footer `footer-bottom` hidden span
- **Content:** "Building the intelligence layer for a changing market." (display:none)
- **Why unresolved:** Hidden text has unclear purpose. May have been SEO-related, a placeholder, or an abandoned design element.
- **Possible future destination:** Remove, or surface visibly if the tagline is approved for v4.
- **Decision required:** Should this tagline appear visibly in the v4 footer, or be removed?

### T012 — Home page route cards
- **Original ID:** C005
- **Original location:** Home page (`#/`), route cards section
- **Content:** Three cards linking to The Shift, Intelligence, and Reading The Shift
- **Why unresolved:** These are v3 destinations. v4 may restructure the home page entirely. The cards are useful but their destinations and labels may change.
- **Possible future destination:** Retain on Home with updated v4 destinations, or redesign as part of v4 home page Blueprint.
- **Decision required:** Will the v4 home page retain route cards, and which destinations should they feature?
