# NF Launch Action Plan

**Status:** Authoritative checklist for NF leadership.
**Last updated:** Part 8B — 2026-08-25
**Purpose:** Preserves every action originating from a pre-launch prerequisite, including items later resolved, deferred, disabled, reclassified, made article-level, or moved post-launch. Nothing disappears because it is no longer a blocker.

---

## Timing Categories

Every item is classified by when it must be completed:

- **BEFORE PUBLICATION** — must be done before the public site exists
- **BEFORE INDEXING** — must be done before search engines are deliberately allowed to index
- **SAFE POST-LAUNCH** — can be done after the site is public

---

## Action Items

### LB-01: Canonical Production Domain

| Field | Value |
|---|---|
| Original ID | LB-01 |
| Item | Canonical production domain not confirmed |
| Original reason | No domain confirmed. Canonical URLs, sitemap, and indexing all depend on it. |
| Current launch status | Blocking |
| NF action | Confirm the single primary canonical website domain |
| Bolt action | Set NEXT_PUBLIC_SITE_URL; update metadata base; generate canonical URLs; generate sitemap URLs; verify robots; verify Organization URL; verify social URLs; configure non-canonical redirect strategy; test www/non-www behaviour |
| Owner | NF Leadership |
| Dependency | None |
| Before publication? | Yes |
| Before indexing? | Yes |
| Post-launch allowed? | No |
| Evidence to close | Domain confirmed and DNS pointing to host |
| Current status | Open |

---

### LB-02: Market Enquiry Form Backend

| Field | Value |
|---|---|
| Original ID | LB-02 |
| Item | Market Enquiry form has no backend destination |
| Original reason | Every commercial CTA routes here. A public launch with a non-functional enquiry form makes the commercial path a dead end. |
| Current launch status | Blocking |
| NF action | Choose where enquiries arrive. Recommended options in order of simplicity: (1) Dedicated NF email — best for fastest launch with modest volume. (2) Existing CRM — only if NF already has one it wants as system of record. (3) Database + notification — if NF wants permanent submission storage from day one. Do not add CRM complexity just because this is a business website. |
| Bolt action | Connect the /api/enquiry route to the chosen destination. Server-side validation, sanitisation, rate limiting, and anti-spam are already built. Add delivery adapter. Return success only after real delivery. Add failure state handling. |
| Owner | NF Operations / Bolt |
| Dependency | NF destination decision |
| Before publication? | Yes |
| Before indexing? | No |
| Post-launch allowed? | No |
| Evidence to close | Form submission reaches real destination; success state confirmed after delivery |
| Current status | Open — architecture built, awaiting NF destination decision |

---

### LB-03: EV Calculator Report Delivery

| Field | Value |
|---|---|
| Original ID | LB-03 |
| Item | EV Calculator report delivery has no backend |
| Original reason | Report button was enabled but no delivery mechanism existed. |
| Current launch status | Resolved for launch / Delivery deferred |
| NF action | None required for launch. Future: decide if/when to activate report delivery. |
| Bolt action | Already completed. Report CTA removed. Calculator concludes with exploration links (Quiet Loss, Adaptive Value, Market Enquiry). Adapter preserved for future activation. |
| Owner | Bolt |
| Dependency | None |
| Before publication? | N/A (resolved) |
| Before indexing? | N/A (resolved) |
| Post-launch allowed? | Yes (future activation is optional) |
| Evidence to close | Report UI removed; no email collection; no fake success state |
| Current status | Resolved |

---

### LB-04: Privacy Policy Legal Review

| Field | Value |
|---|---|
| Original ID | LB-04 |
| Item | Privacy policy not legally reviewed |
| Original reason | Structural framework only. Publishing unreviewed privacy creates legal risk. |
| Current launch status | Blocking |
| NF action | Engage legal counsel. Provide them with docs/v4-legal-review-brief.md. Review and approve the Privacy Policy. |
| Bolt action | Apply legal counsel's approved content to the /privacy page. |
| Owner | NF Legal / Bolt |
| Dependency | Legal counsel engaged |
| Before publication? | Yes |
| Before indexing? | Yes |
| Post-launch allowed? | No |
| Evidence to close | Legal counsel written approval of Privacy Policy |
| Current status | Open — legal review brief created |

---

### LB-05: Terms Legal Review

| Field | Value |
|---|---|
| Original ID | LB-05 |
| Item | Terms not legally reviewed |
| Original reason | Structural framework only. Publishing unreviewed terms creates legal risk. |
| Current launch status | Blocking |
| NF action | Engage legal counsel. Provide them with docs/v4-legal-review-brief.md. Review and approve the Terms of Service. |
| Bolt action | Apply legal counsel's approved content to the /terms page. |
| Owner | NF Legal / Bolt |
| Dependency | Legal counsel engaged |
| Before publication? | Yes |
| Before indexing? | Yes |
| Post-launch allowed? | No |
| Evidence to close | Legal counsel written approval of Terms |
| Current status | Open — legal review brief created |

---

### LB-06: Preview Security

| Field | Value |
|---|---|
| Original ID | LB-06 |
| Item | NEXT_PUBLIC_PREVIEW_MODE exposed client-side |
| Original reason | NEXT_PUBLIC_ variable inlined into client bundles. Unpublished content could be discovered by inspecting the build. |
| Current launch status | Resolved |
| NF action | None required. For preview/QA deployment: set PREVIEW_MODE=true in the server environment (not NEXT_PUBLIC_). |
| Bolt action | Already completed. Changed from NEXT_PUBLIC_PREVIEW_MODE to server-side PREVIEW_MODE. Not inlined into client bundles. Production default: preview disabled, unpublished content returns 404. |
| Owner | Bolt |
| Dependency | None |
| Before publication? | N/A (resolved) |
| Before indexing? | N/A (resolved) |
| Post-launch allowed? | N/A (resolved) |
| Evidence to close | No NEXT_PUBLIC_ prefix on preview variable; unpublished routes return 404 in production |
| Current status | Resolved |

---

### LB-07: Enterprise Value Visual

| Field | Value |
|---|---|
| Original ID | LB-07 |
| Item | EV canonical visual missing |
| Original reason | Hero position of a core page shows a dashed development placeholder. Visibly unfinished. |
| Current launch status | Blocking |
| NF action | Provide/upload the final approved canonical Enterprise Value visual. Do not substitute the Adaptive Value visual, Quiet Loss visual, an old draft, or an autogenerated replacement. |
| Bolt action | Place the approved asset in public/assets/images/. Update the EV page to render the image instead of VisualPlaceholder. |
| Owner | NF Design / Bolt |
| Dependency | NF provides approved asset |
| Before publication? | Yes |
| Before indexing? | No |
| Post-launch allowed? | No |
| Evidence to close | EV page renders approved visual in hero position |
| Current status | Open |

**File requirements:**
- Format: PNG or WebP
- Aspect ratio: 16:9 or 4:3
- Recommended dimensions: at least 1600px wide
- File path: public/assets/images/ (filename to be confirmed)
- Must show: Quiet Loss and Adaptive Value as two lenses across five dimensions
- Must NOT: reuse the AV visual, QL visual, or any draft

---

### LB-08: Quiet Loss Visual

| Field | Value |
|---|---|
| Original ID | LB-08 |
| Item | QL canonical visual missing |
| Original reason | Hero position of a core concept page shows a dashed development placeholder. Visibly unfinished. |
| Current launch status | Blocking |
| NF action | Provide/upload the final approved canonical Quiet Loss visual. It must remain distinct from the Enterprise Value visual. |
| Bolt action | Place the approved asset in public/assets/images/. Update the QL page to render the image instead of VisualPlaceholder. |
| Owner | NF Design / Bolt |
| Dependency | NF provides approved asset |
| Before publication? | Yes |
| Before indexing? | No |
| Post-launch allowed? | No |
| Evidence to close | QL page renders approved visual in hero position; visually distinct from EV |
| Current status | Open |

**File requirements:**
- Format: PNG or WebP
- Aspect ratio: 16:9 or 4:3
- Recommended dimensions: at least 1600px wide
- File path: public/assets/images/ (filename to be confirmed)
- Must show: value from existing opportunity that may be unrealised
- Must NOT: share or resemble the Enterprise Value visual

---

### LB-09: AMCT Visual Decision

| Field | Value |
|---|---|
| Original ID | LB-09 |
| Item | AMCT asset not confirmed |
| Original reason | Hero position shows a dashed development placeholder. Three candidates exist but none confirmed. |
| Current launch status | Blocking |
| NF action | Choose canonical AMCT asset. All three candidate files are confirmed identical (same MD5 hash: 703614459cc553aff2a6a1fcf34b59bb). Decision is simply: confirm this image is correct, or provide a replacement. |
| Bolt action | Once confirmed, update the AMCT page to render the confirmed image instead of VisualPlaceholder. If replacement is provided, place it in public/assets/images/. |
| Owner | NF Design / Bolt |
| Dependency | NF confirmation |
| Before publication? | Yes |
| Before indexing? | No |
| Post-launch allowed? | No |
| Evidence to close | AMCT page renders confirmed visual in hero position |
| Current status | Open — 3 identical candidates confirmed, awaiting NF confirmation |

**AMCT Candidate Comparison:**

| Candidate | Filename | Dimensions | File Size | MD5 | Text Contained | Visual Register Status |
|---|---|---|---|---|---|---|
| A | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM.png | 1536x1024 | 1.48598 MiB | 703614459cc553aff2a6a1fcf34b59bb | (requires visual inspection) | UNCERTAIN |
| B | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png | 1536x1024 | 1.48598 MiB | 703614459cc553aff2a6a1fcf34b59bb | Identical to A | UNCERTAIN |
| C | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy 2.png | 1536x1024 | 1.48598 MiB | 703614459cc553aff2a6a1fcf34b59bb | Identical to A | UNCERTAIN |

All three candidates are byte-for-byte identical. NF needs to:
1. Confirm the image content is the correct AMCT visual, OR
2. Provide a replacement asset.

If confirmed, Bolt will use Candidate A (original, non-copy filename) as the canonical file.

---

### LB-10: Concept Visuals

| Field | Value |
|---|---|
| Original ID | LB-10 |
| Item | 8 concept visuals needed creation |
| Original reason | All used VisualPlaceholder development boxes. |
| Current launch status | Resolved with native implementations |
| NF action | None required for launch. Optional: provide designed visuals post-launch to enhance any of the 8 pages. |
| Bolt action | Already completed. All 7 non-blocking placeholders replaced with native content treatments (grids, flow diagrams, card rows, timelines). FC pathway development note removed. |
| Owner | Bolt |
| Dependency | None |
| Before publication? | N/A (resolved) |
| Before indexing? | N/A (resolved) |
| Post-launch allowed? | Yes (optional visual enhancement) |
| Evidence to close | No VisualPlaceholder on any non-blocked page |
| Current status | Resolved |

---

### LB-11: External Evidence for RTS Articles

| Field | Value |
|---|---|
| Original ID | LB-11 |
| Item | External evidence requirements for 6 RTS articles |
| Original reason | 6 articles had unresolved external evidence needs. |
| Current launch status | Reclassified to article-level |
| NF action | For RTS001, RTS002, RTS008, RTS009, RTS013: confirm they are safe to publish as currently scoped (language is hedged; external evidence beneficial but not required). For RTS027: provide external Board/governance evidence before publication. |
| Bolt action | Once NF confirms, set the 5 safe articles to published. Keep RTS027 at review. Ensure RTS027 does not enter sitemap, search, or Article schema. |
| Owner | NF Content / Bolt |
| Dependency | NF confirmation |
| Before publication? | No (article-level control) |
| Before indexing? | Yes (for any article set to published) |
| Post-launch allowed? | Yes (evidence can be added later to strengthen) |
| Evidence to close | NF written confirmation for each article |
| Current status | Open — 5 assessed as safe, 1 remains review |

---

### LB-12: Hosting Vendor

| Field | Value |
|---|---|
| Original ID | LB-12 |
| Item | Hosting/deployment vendor not confirmed |
| Original reason | Cannot deploy without a host. No vendor confirmed. |
| Current launch status | Blocking |
| NF action | Select a Next.js-capable hosting vendor. Minimum requirements: Next.js App Router support; server-side endpoints/actions (for enquiry API); environment secrets; HTTPS; custom domain; redirects; logs; deployment rollback; image support; suitable geographic availability/performance; straightforward DNS. |
| Bolt action | Configure deployment for the chosen host. Set environment variables. Verify build and runtime. |
| Owner | NF Operations / Bolt |
| Dependency | NF vendor selection |
| Before publication? | Yes |
| Before indexing? | Yes |
| Post-launch allowed? | No |
| Evidence to close | Site deployed and accessible on canonical domain |
| Current status | Open |

**Note:** The current Bolt deployment environment may itself satisfy production requirements. NF should confirm whether migration is required.

---

### LB-13: Analytics

| Field | Value |
|---|---|
| Original ID | LB-13 |
| Item | Analytics vendor not selected |
| Original reason | Analytics abstraction exists, no vendor connected. |
| Current launch status | Post-launch / pre-launch optional |
| NF action | Decide whether analytics is wanted from Day 1 or post-launch. If yes, select vendor and confirm privacy implications. |
| Bolt action | Connect chosen analytics vendor to the existing abstraction layer. Update cookie/tracking register and Privacy Policy. |
| Owner | NF Operations / Bolt |
| Dependency | NF decision; privacy review if tracking is invasive |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | Analytics vendor connected or explicitly deferred |
| Current status | Open — no analytics is preferable to rushed invasive analytics |

---

### LB-14: Social OG Image

| Field | Value |
|---|---|
| Original ID | LB-14 |
| Item | Social OG image system not finalised |
| Original reason | Default OG image may be template default. |
| Current launch status | Post-launch |
| NF action | Optional: provide an NF-branded social share image (1200x630px). If not provided, the site will share without a preview image (no template/Bolt/Next branding is exposed). |
| Bolt action | Add OG image to metadata configuration once provided. |
| Owner | NF Design / Bolt |
| Dependency | NF provides image (optional) |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | OG image set or explicitly deferred |
| Current status | Open — no template branding exposed; non-optimised but NF-neutral |

---

### LB-15: Error Monitoring

| Field | Value |
|---|---|
| Original ID | LB-15 |
| Item | Error monitoring not decided |
| Original reason | No production error monitoring. |
| Current launch status | Post-launch / optional Day-1 |
| NF action | Decide whether error monitoring is wanted from Day 1 or post-launch. If yes, select vendor. |
| Bolt action | Integrate chosen monitoring vendor. |
| Owner | NF Operations / Bolt |
| Dependency | NF vendor selection |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | Monitoring connected or explicitly deferred |
| Current status | Open |

---

### LB-16: Company Identity

| Field | Value |
|---|---|
| Original ID | LB-16 |
| Item | Company identity details need human confirmation |
| Original reason | Legal entity name, registration details, addresses, contact email, copyright owner, trademark ownership not confirmed. |
| Current launch status | Human confirmation required |
| NF action | Confirm: exact Malaysian legal entity; company/registration number if displayed; Malaysian address; NZ presence wording; NZ address if displayed; public email; copyright owner; trademark ownership basis; legal jurisdiction after counsel input. |
| Bolt action | Apply confirmed values to About, Footer, Privacy, Terms, and structured data. |
| Owner | NF Leadership / Bolt |
| Dependency | NF confirmation; legal counsel input on jurisdiction |
| Before publication? | No (but must be confirmed before final legal/schema/publication sign-off) |
| Before indexing? | Yes (Organization schema needs correct legal entity) |
| Post-launch allowed? | No (for schema); partial (for display content) |
| Evidence to close | All company identity fields confirmed in writing |
| Current status | Open |

---

### LB-17: Cookie/Tracking Register

| Field | Value |
|---|---|
| Original ID | LB-17 |
| Item | Cookie/tracking register |
| Original reason | Originally reported as missing. |
| Current launch status | Resolved |
| NF action | None required. If analytics or other tracking is added later, revisit consent architecture before enabling. |
| Bolt action | Already completed. Register exists and correctly reports no cookies in use. No cookie banner needed. |
| Owner | Bolt |
| Dependency | None |
| Before publication? | N/A (resolved) |
| Before indexing? | N/A (resolved) |
| Post-launch allowed? | N/A (resolved) |
| Evidence to close | Register exists; correctly reports empty state |
| Current status | Resolved |

---

### RTS027: Article-Level Publication Blocker

| Field | Value |
|---|---|
| Original ID | LB-11 (article-level) |
| Item | RTS027 — Board/governance evidence required |
| Original reason | Mixed classification: contains external market claims AND NF interpretation, plus secondary FC need. Board governance guidance should be externally grounded. |
| Current launch status | Deliberately held in review |
| NF action | Provide external Board/governance evidence before publication, or rescope wording to remove claims requiring evidence. |
| Bolt action | Keep RTS027 at review status. Ensure it does not enter sitemap, search results, or Article schema. |
| Owner | NF Content / Bolt |
| Dependency | External evidence or rescoping |
| Before publication? | No (does not block other routes) |
| Before indexing? | Yes (must not be indexed while in review) |
| Post-launch allowed? | Yes (can be published later when evidence is ready) |
| Evidence to close | External evidence added or wording rescoped; NF approval |
| Current status | Open — deliberately held |

---

### RTS001/RTS002/RTS008/RTS009/RTS013: Publication-Ready Articles

| Field | Value |
|---|---|
| Original ID | LB-11 (article-level) |
| Item | 5 externally supportable articles assessed as safe to publish |
| Original reason | External evidence was recommended but not required by current scoped wording. |
| Current launch status | Publication-ready subject to final human launch approval |
| NF action | Confirm these 5 articles are approved for publication. External evidence remains beneficial but not required by current hedged wording. |
| Bolt action | Set to published once NF confirms. |
| Owner | NF Content / Bolt |
| Dependency | NF final approval |
| Before publication? | No (article-level) |
| Before indexing? | Yes (for any article set to published) |
| Post-launch allowed? | Yes (evidence can strengthen later) |
| Evidence to close | NF written approval for each article |
| Current status | Open — assessed as safe, awaiting NF approval |

---

### FC-Evidence Articles (RTS005/RTS007/RTS010/RTS031/RTS033/RTS034)

| Field | Value |
|---|---|
| Original ID | Evidence register |
| Item | 6 FC-evidence dependent articles |
| Original reason | Classified as FC Evidence Dependent in the evidence register. |
| Current launch status | Publication-ready subject to final human launch approval |
| NF action | Confirm these 6 articles are approved for publication. All use carefully hedged language ("may", "potentially", "needs to be tested", "still proving", "emerging", "being built"). None claim proven outcomes requiring existing Foundation Customer proof. They discuss what NF intends to test, not that the test has already succeeded. |
| Bolt action | Set to published once NF confirms. |
| Owner | NF Content / Bolt |
| Dependency | NF final approval |
| Before publication? | No (article-level) |
| Before indexing? | Yes (for any article set to published) |
| Post-launch allowed? | Yes (FC evidence will strengthen later) |
| Evidence to close | NF written approval for each article |
| Current status | Open — all 6 classified SAFE AS THESIS / HYPOTHESIS |

**Per-article assessment:**

| RTS ID | Question | Claims proven outcome? | Classification |
|---|---|---|---|
| RTS005 | What changes when customers start their buying journey with AI? | No — uses "potentially", "may", "needs to be proven" | SAFE AS THESIS |
| RTS007 | Can two enquiries that look the same carry different levels of intent? | No — uses "may", "needs to be tested against outcomes" | SAFE AS THESIS |
| RTS010 | What happens when customer context is lost? | No — uses "may", "depends on whether", "requires linking" | SAFE AS THESIS |
| RTS031 | What is NexFrontier building? | No — uses "building toward", "still proving", "that is what Foundation Customer programme is for" | SAFE AS THESIS |
| RTS033 | What are Intent Threads? | No — uses "is intended to", "asks whether", "if reconnecting context helps" | SAFE AS THESIS |
| RTS034 | What is The Brain at NexFrontier? | No — uses "emerging", "being built", "should not be described as if fully proven" | SAFE AS THESIS |

---

### EV Report Deferred Capability

| Field | Value |
|---|---|
| Original ID | LB-03 (future) |
| Item | Enterprise Value Calculator report delivery |
| Original reason | Disabled for launch. |
| Current launch status | Deferred |
| NF action | Decide if/when to activate report delivery in future. Choose delivery mechanism (email, download, etc.). |
| Bolt action | Re-enable report CTA, connect delivery adapter, implement success/failure states. |
| Owner | NF Operations / Bolt |
| Dependency | NF decision on future activation |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | Report delivery working end-to-end |
| Current status | Deferred |

---

### Post-Launch 72hr QA

| Field | Value |
|---|---|
| Original ID | Part 7 prerequisite |
| Item | Post-launch 72-hour QA checklist |
| Original reason | Verify site health after publication. |
| Current launch status | Post-launch |
| NF action | Execute the 72hr QA checklist after publication. |
| Bolt action | Support QA execution; fix any issues found. |
| Owner | NF Operations / Bolt |
| Dependency | Site published |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | 72hr QA checklist completed |
| Current status | Open — checklist documented in docs/v4-post-launch-72hr-qa.md |

---

### Data Room (Investor)

| Field | Value |
|---|---|
| Original ID | Part 7 prerequisite |
| Item | Investor Data Room access |
| Original reason | Investor page references a Data Room but no access backend exists. |
| Current launch status | Deferred |
| NF action | Decide if Data Room access is needed for launch or post-launch. If needed, define access mechanism. |
| Bolt action | Implement Data Room access if requested. |
| Owner | NF Operations / Bolt |
| Dependency | NF decision on Data Room requirements |
| Before publication? | No |
| Before indexing? | No |
| Post-launch allowed? | Yes |
| Evidence to close | Data Room access working or explicitly deferred |
| Current status | Open — investor page works without it; form routes to shared enquiry backend |

---

## Summary by Timing

### BEFORE PUBLICATION (must be done before the public site exists)

| ID | Item | Owner |
|---|---|---|
| LB-01 | Confirm canonical domain | NF Leadership |
| LB-02 | Choose enquiry destination | NF Operations |
| LB-04 | Legal review of Privacy Policy | NF Legal |
| LB-05 | Legal review of Terms | NF Legal |
| LB-07 | Provide EV visual | NF Design |
| LB-08 | Provide QL visual | NF Design |
| LB-09 | Confirm AMCT visual | NF Design |
| LB-12 | Select hosting vendor | NF Operations |

### BEFORE INDEXING (must be done before search engines are allowed to index)

| ID | Item | Owner |
|---|---|---|
| LB-01 | Domain configured | NF / Bolt |
| LB-04 | Privacy approved | NF Legal |
| LB-05 | Terms approved | NF Legal |
| LB-12 | Host deployed | NF / Bolt |
| LB-16 | Company identity confirmed (for schema) | NF Leadership |
| RTS articles | NF approval for each article to publish | NF Content |
| RTS027 | Must NOT be indexed while in review | Bolt |

### SAFE POST-LAUNCH

| ID | Item | Owner |
|---|---|---|
| LB-13 | Analytics vendor | NF Operations |
| LB-14 | Social OG image | NF Design |
| LB-15 | Error monitoring | NF Operations |
| LB-16 (partial) | Display content updates | NF / Bolt |
| EV Report | Future report delivery activation | NF / Bolt |
| Concept visuals | Optional designed visual enhancements | NF Design |
| Data Room | Investor Data Room access | NF Operations |
| 72hr QA | Post-launch quality assurance | NF / Bolt |


## Correction pass — 2026-08-26

Completed: global navigation and CTA treatment, Unicode repair, VTF route, conditional Shift gap visual, Foundation pathway canvas, About footprint correction, Investor CTA wording, Market Enquiry presentation, Sukesh founder-video placeholder, calculator session persistence and report download.

Founder re-review required: global header/footer, Enterprise Value/VTF, The Shift, ORBIT, AMCT, calculator, Reading The Shift, and any remaining visual hierarchy items.
