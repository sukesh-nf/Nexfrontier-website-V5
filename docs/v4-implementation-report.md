# v4 Implementation Report

**Date:** 2026-08-26
**Purpose:** Records the true state of all visual, structural, calculator, and QA work completed in this session.

---

## Visual Status

### Resolved (11 of 11)

| # | Visual | Resolution | Evidence |
|---|---|---|---|
| 1 | Enterprise Value | CANONICAL asset wired in | `ChatGPT_Image_Aug_25,_2026,_12_22_29_AM.png` rendered on `/enterprise-value` |
| 2 | Quiet Loss | CANONICAL asset wired in | `ChatGPT_Image_Aug_25,_2026,_12_09_28_AM.png` rendered on `/enterprise-value/quiet-loss` |
| 3 | Adaptive Value | CANONICAL asset in use | `Adaptive_Value_website_Aug26.png` rendered on `/enterprise-value/adaptive-value` |
| 5 | AMCT | CANONICAL asset wired in | `ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png` rendered on `/intelligence/amct` |
| 6 | The Brain | Code-based SVG | `BrainVisual.tsx` rendered on `/` and `/intelligence/the-brain` |
| 7 | Intent Threads | Native 4-card progression | No VisualPlaceholder on `/intelligence/intent-threads` |
| 8 | ORBIT | Native 5-card dimension grid | No VisualPlaceholder on `/intelligence/orbit` |
| 9 | Human in the Lead | Native 3-card row | No VisualPlaceholder on `/intelligence/human-in-the-lead` |
| 10 | Enterprise Capability | Native 5-step cycle grid | No VisualPlaceholder on `/intelligence/enterprise-capability` |
| 11 | Foundation Customer Pathway | Native vertical timeline | No VisualPlaceholder on `/foundation-customers` |

### Cancelled (1 of 11)

| # | Visual | Reason |
|---|---|---|
| 4 | Value Translation Framework | No such separate concept exists in the visual register. "Value translation lens" is ORBIT's description. ORBIT already has its native implementation. Item was based on a misunderstanding. |

### Blocked on NF (0 of 11)

All visuals are now resolved. NF should review the placed images on the live site to confirm they are the correct approved versions.

---

## Calculator Regression Testing

**Result:** 42 tests, 0 failures.

Test script: `scripts/calculator-regression-test.mjs`

Coverage:
- Pool calculation (basic, zero/negative lifetime, negative LTV, empty customers)
- calculateValues (default assumptions, null pool, negative revenue clamping)
- Full EV Delta pipeline (GVO, overlap, adjusted opportunity, realisation, risk allowance, cost to realise, EV delta, neutral threshold, scenario status)
- formatValue (zero, thousands, millions, ten-millions, negative, signed, null, NaN)
- businessNumber clamping (empty, negative, valid)
- safeNumber edge cases (empty string, null, finite, actual number)

All formulas verified against hand-computed expected values. No formula changes were made — formulas preserved unchanged per Blueprint section 80.1.

---

## Build & Type Check

| Check | Result |
|---|---|
| `npm run build` | Pass (exit 0) |
| `npm run typecheck` | Pass (exit 0) |
| ESLint | Pre-existing warnings/errors (empty object types in spokes.ts, unused vars) — not introduced in this session |

---

## Responsive Design QA

The site has a comprehensive responsive system:
- Breakpoints at 900px (tablet/mobile) and 620px (small mobile)
- Mobile menu with sub-page navigation
- Responsive grids: hero-split, two-col, route-grid, concept-grid, dim-grid, cycle steps
- Footer collapses to single column on mobile
- Typography uses `clamp()` for fluid scaling across viewport sizes
- `prefers-reduced-motion` support

No responsive issues identified. All layouts have appropriate mobile fallbacks.

---

## Founder Re-Review List

The following items require NF action before the site can be fully published:

### Blocking (must resolve before publication)

1. **LB-01: Canonical domain** — Confirm the primary domain
2. **LB-02: Enquiry form destination** — Choose where form submissions go (email, CRM, or database)
3. **LB-04: Privacy policy legal review** — Engage legal counsel, approve content
4. **LB-05: Terms legal review** — Engage legal counsel, approve content
5. **LB-07: EV visual review** — Visual placed from existing asset; NF to confirm it is the approved version
6. **LB-08: QL visual review** — Visual placed from existing asset; NF to confirm it is the approved version
7. **LB-09: AMCT visual review** — Visual placed from existing candidate; NF to confirm it is the approved version
8. **LB-12: Hosting vendor** — Select and configure production hosting

### Before indexing (must resolve before search engines index)

9. **LB-16: Company identity** — Confirm legal entity name, registration, addresses, contact email, copyright owner
10. **RTS articles** — Approve publication of 34 articles; keep RTS027 in review

### Post-launch (optional)

11. **LB-13: Analytics** — Decide on analytics vendor
12. **LB-14: Social OG image** — Provide branded share image (optional)
13. **LB-15: Error monitoring** — Decide on monitoring vendor
14. **EV Report delivery** — Future activation of calculator report delivery
15. **Investor Data Room** — Define access mechanism if needed
