# NexFrontier Website v4 — Visual Register

**Status:** Internal project document. Not public. Not a website page.
**Purpose:** Tracks every visual requirement for v4, from inherited assets through to final approved artwork. Per Blueprint sections 101-136.
**Last updated:** Part 8B — 2026-08-25

---

## Status Key

| Status | Meaning |
|---|---|
| CANONICAL | Approved final version. Use as-is. Do not recreate or alter. |
| APPROVED | Reviewed and approved for v4 use. |
| RESOLVED WITH NATIVE IMPLEMENTATION | No static asset needed. Native CSS/layout treatment serves as the launch visual. |
| PLACEHOLDER | Labelled placeholder region created. Awaiting final asset. |
| NEEDS CREATION | No asset exists yet. Visual brief recorded. |
| NEEDS RECREATION | Concept exists but current visual is no longer suitable. |
| NEEDS CONFIRMATION | One or more candidate assets exist. Human confirmation required. |
| LEGACY | Inherited from v3. Usable but not designated canonical. |
| DO NOT USE | Confirmed unsuitable. Do not use in v4. |

---

## Part 2 Visual Additions

### VISUAL-HOME-SHIFT-01

| Field | Value |
|---|---|
| Page | / |
| Section | Why now (Section 2) |
| Concept | AI inside the enterprise vs AI changing the market outside it |
| Status | RESOLVED WITH NATIVE IMPLEMENTATION |
| Source Asset | None |
| Purpose | Show two simultaneous directions. Keep simple. Not a technology-stack diagram. |
| Native Treatment | VisualPlaceholder removed. Two-column text layout already communicates the distinction. |
| Post-Launch | Optional: a designed visual may be added later to enhance the section. |

### VISUAL-SHIFT-01

| Field | Value |
|---|---|
| Page | /the-shift |
| Section | Two sides of the shift (Section 2) |
| Concept | Internal AI vs external AI distinction |
| Status | RESOLVED WITH NATIVE IMPLEMENTATION |
| Source Asset | None |
| Purpose | Make the internal AI vs external AI distinction understandable in seconds |
| Native Treatment | VisualPlaceholder removed. Two-column layout with bulleted lists already communicates the distinction. |
| Post-Launch | Optional: a designed visual may be added later. |

### VISUAL-SHIFT-CUSTOMER-01

| Field | Value |
|---|---|
| Page | /the-shift |
| Section | The customer may arrive differently (Section 3) |
| Concept | Two apparently similar inbound opportunities with different pre-arrival journeys |
| Status | RESOLVED WITH NATIVE IMPLEMENTATION |
| Source Asset | None |
| Purpose | Show two apparently similar inbound opportunities with different pre-arrival journeys and developed intent. Not a sales-funnel illustration. |
| Native Treatment | VisualPlaceholder removed. Body text describes Customer A vs Customer B in prose. |
| Post-Launch | Optional: a designed visual may be added later. |

### VISUAL-INTELLIGENCE-OVERVIEW-01

| Field | Value |
|---|---|
| Page | /intelligence |
| Section | Hero split |
| Concept | Market change to outcome with learning loop |
| Status | RESOLVED WITH NATIVE IMPLEMENTATION |
| Source Asset | None |
| Purpose | Show the simple public chain with a learning loop, without exposing internal architecture |
| Native Treatment | VisualPlaceholder replaced with a 4-step numbered flow diagram (Market change, Customer intent, Enterprise response, Outcome) with a learning-loop note. Built with native CSS cards and arrows. |
| Post-Launch | Optional: a designed visual may be added later. |

### VISUAL-INTENT-THREADS-01

| Field | Value |
|---|---|
| Page | /intelligence/intent-threads |
| Section | Hero |
| Concept | One underlying need across multiple interactions |
| Status | CANONICAL |
| Source Asset | Intent_Thread_website_Aug26.png |
| Purpose | Show one underlying customer need appearing across multiple interactions that the enterprise otherwise experiences as disconnected moments. Do not expose detailed FOCL data architecture. |
| Approval Status | Founder-approved upload confirmed on 2026-08-26 and wired to /intelligence/intent-threads. Use only as supplied. |

### VISUAL-ORBIT-01

| Field | Value |
|---|---|
| Page | /intelligence/orbit |
| Section | Hero |
| Concept | Five Enterprise Value dimensions / customer capability journey |
| Status | CANONICAL |
| Source Asset | ORBIT_website_Aug26.png |
| Purpose | Show ORBIT as a customer capability journey from enterprise evidence through observation, reveal, build, improve and trust, with a six-step evidence-to-value loop. |
| Approval Status | Founder-approved upload confirmed on 2026-08-26 and wired to /intelligence/orbit. Use only as supplied. |

### VISUAL-AMCT-01

| Field | Value |
|---|---|
| Page | /intelligence/amct |
| Section | Hero |
| Concept | AI-Mediated Choice Triangle |
| Status | CANONICAL |
| Source Asset | AMCT_Website_Aug26.png |
| Purpose | Show the three-way relationship between Customer, AI and Business, and how trust needs to hold across all three |
| Recommended Format | Existing PNG (if confirmed) or recreated WebP |
| Aspect Ratio | 4:3 |
| Desktop Placement | 55-70% content width |
| Mobile Placement | Full-width |
| Required Labels | Customer, AI, Business, Trust |
| Disclosure Risk | Low |
| Approval Status | Founder-approved AMCT visual uploaded and wired to /intelligence/amct on 2026-08-26. Use only as supplied. |

### VISUAL-HUMAN-IN-LEAD-01

| Field | Value |
|---|---|
| Page | /intelligence/human-in-the-lead |
| Section | The principle (Section 4) |
| Concept | Evidence, judgement and value |
| Status | NEEDS CREATION — founder-approved visual pending upload |
| Source Asset | None yet |
| Purpose | Support the idea that evidence informs judgement, intervention may take different forms, not every gap requires action, value determines whether action was worthwhile. Do not illustrate as human versus robot or human approving every AI decision. |
| Native Treatment | Temporary 3 numbered cards (Evidence, Judgement, Value) in a horizontal row. To be replaced by founder-supplied canonical visual once uploaded. |

### VISUAL-ENTERPRISE-CAPABILITY-01

| Field | Value |
|---|---|
| Page | /intelligence/enterprise-capability |
| Section | Hero |
| Concept | Recognise, understand, decide, adapt, learn cycle |
| Status | NEEDS CREATION — founder-approved visual pending upload |
| Source Asset | None yet |
| Purpose | Show changing market conditions and repeated cycles. Do not present as a proprietary technical workflow. Do not expose internal learning system architecture or FOCL logic. |
| Native Treatment | Temporary 5-step cycle grid (Recognise, Understand, Decide, Adapt, Learn) using the existing cycle step data. To be replaced by founder-supplied canonical visual once uploaded. |

### VISUAL-FOUNDATION-CUSTOMER-PATHWAY-01

| Field | Value |
|---|---|
| Page | /foundation-customers |
| Section | Section 6 |
| Concept | Foundation Customer pathway |
| Status | NEEDS CREATION — founder-approved visual pending upload |
| Source Asset | None yet |
| Purpose | Show the Foundation Customer progression pathway. |
| Native Treatment | Temporary native vertical timeline with numbered circles and connecting lines. To be replaced by founder-supplied canonical visual once uploaded. |

### VISUAL-BRAIN-01

| Field | Value |
|---|---|
| Page | /intelligence/the-brain |
| Concept | The Brain strategic intelligence framework |
| Status | CANONICAL |
| Source Asset | The_Brain_website_Aug26.png |
| Purpose | Show external AI and AI-mediated markets feeding strategic interpretation, prioritisation and guidance for enterprise response and Enterprise Value. |
| Approval Status | Founder-approved upload confirmed on 2026-08-26 and wired to /intelligence/the-brain. Use only as supplied. |

### BrainVisual

| Field | Value |
|---|---|
| Page | / |
| Status | REUSE EXISTING |
| Source | Code-based SVG in src/components/visual/BrainVisual.tsx |
| Notes | Retained as the compact homepage treatment. |

---

## Part 3 Visual Additions

### VISUAL-EV-STATUS-01

| Field | Value |
|---|---|
| Page | /enterprise-value/calculator |
| Section | Stage 4: Enterprise Value (Status Quo visual) |
| Concept | Status Quo / Value Erosion / Value Creation indicator |
| Status | BUILT AS UI (native CSS/SVG) |
| Source Asset | None (UI-generated) |
| Purpose | Horizontal conceptual scale showing where the EV Delta falls relative to Status Quo |
| Type | UI-generated, accessible CSS/SVG |
| Approval Status | Built. Not a static marketing image. |

### VISUAL-EV-BRIDGE-01

| Field | Value |
|---|---|
| Page | /enterprise-value/calculator |
| Section | Stage 4: Enterprise Value (Value Bridge) |
| Concept | Simple value bridge from Status Quo to Enterprise Value Delta |
| Status | BUILT AS UI (native CSS) |
| Source Asset | None (UI-generated) |
| Purpose | Show the sequence: Status Quo, +QL, +AV, -Overlap, -Risk, -Cost, = EV Delta |
| Type | UI-generated, accessible CSS |
| Approval Status | Built. Not a static marketing image. Not a complex financial waterfall. |

### VISUAL-VTF-01

| Field | Value |
|---|---|
| Concept | Value Translation Framework™ |
| Status | CANONICAL |
| Source Asset | VAlue_Translation_Fwork_website_Aug26.png |
| Purpose | Show the supplied six-step value translation chain and its relationship to five value lenses. |
| Approval Status | Founder-approved upload confirmed on 2026-08-26. Wired to /enterprise-value, placed after the QL + AV treatment and before the Calculator section. Use only as supplied. |

### Canonical EV/QL/AV Visuals

| Visual ID | Concept | Status | Source Asset | Notes |
|---|---|---|---|---|
| VISUAL-EV-01 | Enterprise Value overview | CANONICAL | Enterprise_Value_Website_Aug26.png | Founder-approved upload confirmed on 2026-08-26 and wired to /enterprise-value. Compared with the previous provisional asset; SHA-256 differs. |
| VISUAL-QL-01 | Quiet Loss | CANONICAL | Quiet_Loss_Website_Aug26.png | Founder-approved upload confirmed on 2026-08-26 and wired to /enterprise-value/quiet-loss. Distinct from the Enterprise Value visual. |
| VISUAL-AV-01 | Adaptive Value | CANONICAL | Adaptive_Value_website_Aug26.png | Founder-confirmed upload received on 2026-08-26 as Adaptive_Value_website_Aug26 copy.png. Visually identical to the retained asset, so the existing filename remains wired to /enterprise-value/adaptive-value. |

---

## Updated Summary

| Category | Count |
|---|---|
| Concept visuals resolved with native implementation | 3 (Home Shift, Shift, Shift Customer) |
| Concept visuals awaiting founder-approved upload | 0 |
| AMCT visual | CANONICAL (AMCT_Website_Aug26.png) |
| BrainVisual | REUSE EXISTING (homepage only) |
| Founder-approved canonical visuals | 11 CANONICAL (EV, QL, AV, VTF, AMCT, Brain, Intent Threads, ORBIT, Human in the Lead, Enterprise Capability, FC→PB Pathway) |
| EV/QL/AV canonical visuals | 3 CANONICAL (EV, QL, AV) |
| VTF canonical visual | 1 CANONICAL (VAlue_Translation_Fwork_website_Aug26.png) |
| AMCT canonical visual | 1 CANONICAL (AMCT_Website_Aug26.png) |
| The Brain canonical visual | 1 CANONICAL (The_Brain_website_Aug26.png) |
| Intent Threads canonical visual | 1 CANONICAL (Intent_Thread_website_Aug26.png) |
| ORBIT canonical visual | 1 CANONICAL (ORBIT_website_Aug26.png) |
| Human in the Lead canonical visual | 1 CANONICAL (Human_In_The_Lead_website_Aug26.png) |
| Enterprise Capability canonical visual | 1 CANONICAL (Enterprise_Capability_website_Aug26.png) |
| Foundation Customer Pathway canonical visual | 1 CANONICAL (FC_to_PB_Pathway_website_Aug26.png) |
| UI-generated visuals built | 2 (STATUS, BRIDGE) |
| Unapproved concept imagery generated | 0 |

All requested proprietary concept visuals are now supplied as founder-approved assets and wired to their intended pages. No unapproved concept imagery was generated.


## Correction pass — 2026-08-26

The 11 canonical visuals remain unchanged. The VTF canonical visual is now also wired to the dedicated `/enterprise-value/value-translation-framework` route. The Foundation Customer pathway now uses the wider diagram canvas, and no approved asset was replaced.
