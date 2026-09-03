# NF Launch Decision Pack

**Status:** For NF leadership. Not a technical document.
**Last updated:** Part 8C — 2026-08-25
**Purpose:** Make the remaining launch decisions extremely easy to execute.

---

## Executive Checklist

The website is built, tested, and ready. Eight decisions stand between the current state and launch. None require technical work from NF — they require decisions, assets, or external approval.

| # | NF action | Owner | Blocks launch? | Status |
|---|---|---|---|---|
| 1 | Confirm the canonical production domain | NF Leadership | Yes | OPEN |
| 2 | Confirm production hosting | NF Operations | Yes | OPEN |
| 3 | Choose where website enquiries should go | NF Operations | Yes | OPEN |
| 4 | Provide the Enterprise Value visual | NF Design | Yes | OPEN |
| 5 | Provide the Quiet Loss visual | NF Design | Yes | OPEN |
| 6 | Confirm the AMCT visual | NF Design | Yes | OPEN |
| 7 | Send Privacy material to legal counsel | NF Legal | Yes | OPEN |
| 8 | Send Terms material to legal counsel | NF Legal | Yes | OPEN |

Legal review (decisions 7 and 8) can begin immediately in parallel with all other decisions. They do not need to wait.

---

## Decision 1: Canonical Domain

### Decision

NF needs to choose the single primary website domain.

### What NF needs to decide or provide

The one domain that will serve as the public website address. All other domains (if any) should redirect to this one.

### Why this is needed

The domain drives:
- Canonical URLs (tells search engines which address is the real one)
- Sitemap generation (the list of pages submitted to search engines)
- Search indexing (allowing the site to appear in Google results)
- Social sharing (how links appear when shared on LinkedIn, etc.)
- Redirects (sending visitors from old or alternate addresses to the right place)
- Structured data (the organisation information embedded in the site for search engines)

### Recommended minimum viable launch approach

Choose one domain. Bolt will configure everything else automatically.

Two domain references already exist in the website configuration:
- `nexfrontier.my` (used for the Malaysia contact email)
- `nexfrontierlogic.nz` (used for the New Zealand contact email)

NF should confirm which of these (or another domain entirely) is the primary public website address.

### Alternatives

- Use `nexfrontier.my` as primary, redirect `nexfrontierlogic.nz` to it
- Use `nexfrontierlogic.nz` as primary, redirect `nexfrontier.my` to it
- Use a different domain entirely (e.g., `nexfrontier.com` if available)

### What Bolt will do after NF decides

Set the canonical domain in the site configuration. Generate canonical URLs for every page. Generate the sitemap with correct domain. Configure redirects from non-canonical domains. Verify robots.txt. Update structured data with the correct organisation URL. Test www/non-www behaviour.

### Information or asset NF needs to provide

```
Canonical domain: ____________________
```

### Does this block launch?

Yes

### Original blocker

LB-01

---

## Decision 2: Production Hosting

### Decision

NF needs to confirm where the website will be hosted in production.

### What NF needs to decide or provide

Confirm a production environment capable of running the website on the canonical domain.

### Why this is needed

The website is built with Next.js (App Router). It needs a host that supports:
- Next.js App Router (the framework the site is built on)
- Server-side enquiry API (the form submission endpoint)
- Environment variables and secrets (for configuration and security)
- Custom domain (your canonical domain from Decision 1)
- HTTPS (secure connections)
- Redirects (forwarding old or alternate URLs)
- Server logs (visibility into traffic and errors)
- Rollback and redeployment (ability to undo a bad release)

### Recommended minimum viable launch approach

The current Bolt hosting environment already supports Next.js App Router, server-side API routes, environment variables, HTTPS, custom domains, redirects, logs, and redeployment. If NF confirms this environment satisfies production requirements, no migration is needed.

### Alternatives

- Confirm the current Bolt environment as production
- Migrate to a different host (e.g., Vercel, AWS, other) — only if NF has a specific reason to move

### What Bolt will do after NF decides

Configure deployment for the chosen environment. Set all environment variables. Verify the build runs correctly. Connect the canonical domain. Test HTTPS and redirects.

### Information or asset NF needs to provide

```
Production hosting: ____________________
```

(If confirming the current environment: "Current Bolt environment confirmed as production.")

### Does this block launch?

Yes

### Original blocker

LB-12

---

## Decision 3: Where Website Enquiries Should Go

### Decision

NF needs to choose where submitted enquiry forms should arrive.

### What NF needs to decide or provide

The real destination for form submissions. The technical architecture is already built — server-side validation, input sanitisation, rate limiting, and anti-spam are all in place. The form currently returns a "not connected" response because no destination has been chosen.

### Why this is needed

Every commercial call-to-action on the website routes to the enquiry form. Without a real destination, every enquiry is a dead end. The form supports five enquiry types through the same backend: Foundation Customer, Investor, Market/Customer, Partnership, and Other.

### Recommended minimum viable launch approach

**Option A: Dedicated NF email** (recommended for fastest launch)

The simplest path. Enquiries arrive in a dedicated NF email inbox. Best when initial enquiry volume is modest. No new software to manage.

**Option B: Existing CRM**

Only if NF already has a CRM it wants to use as the system of record. Adds complexity but gives permanent storage and pipeline management from Day 1.

**Option C: Database + email notification**

Useful if NF wants a durable enquiry record stored in a database from Day 1, with email notifications as a backup. More setup but more permanent.

### Alternatives

Options A, B, and C above. Do not introduce new SaaS products merely because they exist.

### What Bolt will do after NF decides

Connect the existing enquiry API route to the chosen destination. Test end-to-end delivery. Confirm success state only fires after real delivery. Handle failure states gracefully.

### Information or asset NF needs to provide

```
Enquiry destination choice: A / B / C
```

Depending on choice:
- **If A:** Receiving email address: ____________________
- **If B:** CRM/system name: ____________________ (credentials/configuration to follow)
- **If C:** Confirm — Bolt will set up database storage and email notification

### Does this block launch?

Yes

### Original blocker

LB-02

---

## Decision 4: Enterprise Value Visual

### Decision

NF needs to supply or confirm the final approved Enterprise Value canonical visual.

### What NF needs to decide or provide

The visual asset that will appear in the hero position of the Enterprise Value page. This is one of the core concept pages on the website.

### Why this is needed

The Enterprise Value page currently shows a labelled placeholder where the visual should be. The page is visibly unfinished without it.

### Recommended minimum viable launch approach

Provide the final approved visual as an image file.

### Current placeholder location

`/enterprise-value` page, hero section. Currently displays a dashed-border placeholder box labelled "VISUAL-EV-01".

### Requirements

| Field | Value |
|---|---|
| Required page | /enterprise-value |
| Current placeholder | VISUAL-EV-01 in hero section |
| Concept | Enterprise Value overview — Quiet Loss and Adaptive Value as two lenses across five dimensions |
| Preferred dimensions | At least 1600px wide |
| Aspect ratio | 16:9 or 4:3 |
| Accepted file types | PNG or WebP |
| Asset filename | To be confirmed by NF |
| Must NOT | Reuse the Adaptive Value visual, Quiet Loss visual, or any draft |

### Alternatives

- Upload a new final approved visual
- Identify an existing asset in the project that should be used

### What Bolt will do after NF decides

Place the approved asset in the public assets directory. Replace the placeholder on the Enterprise Value page with the real visual. Verify it renders correctly on desktop and mobile.

### Information or asset NF needs to provide

```
Enterprise Value visual: UPLOAD / IDENTIFY EXISTING ASSET
```

If uploading: provide the image file.
If identifying an existing asset: provide the filename from the project assets.

### Does this block launch?

Yes

### Original blocker

LB-07

---

## Decision 5: Quiet Loss Visual

### Decision

NF needs to supply or confirm the final approved Quiet Loss canonical visual.

### What NF needs to decide or provide

The visual asset that will appear in the hero position of the Quiet Loss page. This must be a distinct visual — it cannot share or closely resemble the Enterprise Value visual.

### Why this is needed

The Quiet Loss page currently shows a labelled placeholder where the visual should be. The page is visibly unfinished without it.

### Recommended minimum viable launch approach

Provide the final approved visual as an image file.

### Current placeholder location

`/enterprise-value/quiet-loss` page, hero section. Currently displays a dashed-border placeholder box labelled "VISUAL-QL-01".

### Requirements

| Field | Value |
|---|---|
| Required page | /enterprise-value/quiet-loss |
| Current placeholder | VISUAL-QL-01 in hero section |
| Concept | Quiet Loss — value from existing opportunity that may be unrealised |
| Preferred dimensions | At least 1600px wide |
| Aspect ratio | 16:9 or 4:3 |
| Accepted file types | PNG or WebP |
| Asset filename | To be confirmed by NF |
| Must be | Visually distinct from the Enterprise Value visual |
| Must NOT | Share or resemble the Enterprise Value visual |

### Alternatives

- Upload a new final approved visual
- Identify an existing asset in the project that should be used

### What Bolt will do after NF decides

Place the approved asset in the public assets directory. Replace the placeholder on the Quiet Loss page with the real visual. Verify it renders correctly on desktop and mobile.

### Information or asset NF needs to provide

```
Quiet Loss visual: UPLOAD / IDENTIFY EXISTING ASSET
```

If uploading: provide the image file.
If identifying an existing asset: provide the filename from the project assets.

### Does this block launch?

Yes

### Original blocker

LB-08

---

## Decision 6: AMCT Visual

### Decision

NF needs to confirm which of three existing candidate assets is the canonical AMCT visual, or provide a replacement.

### What NF needs to decide or provide

Look at the three candidate images below. Confirm which one is correct, or provide a replacement.

### Why this is needed

The AMCT page currently shows a labelled placeholder where the visual should be. Three candidate files already exist in the project, but none have been confirmed as the final approved visual.

### Recommended minimum viable launch approach

Confirm one of the existing candidates. All three are byte-for-byte identical (same image, different filenames), so the decision is simply: is this image correct, or should it be replaced?

### Candidate comparison

| | Candidate A | Candidate B | Candidate C |
|---|---|---|---|
| Filename | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM.png | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy.png | ChatGPT_Image_Aug_23,_2026,_01_35_18_PM copy 2.png |
| Dimensions | 1536 x 1024 | 1536 x 1024 | 1536 x 1024 |
| File size | 1.48598 MiB | 1.48598 MiB | 1.48598 MiB |
| MD5 hash | 703614459cc553aff2a6a1fcf34b59bb | 703614459cc553aff2a6a1fcf34b59bb | 703614459cc553aff2a6a1fcf34b59bb |
| Identical? | — | Yes (identical to A) | Yes (identical to A) |

All three candidates are the same image. NF needs to:
1. Confirm the image content is the correct AMCT visual, OR
2. Provide a replacement.

If confirmed, Bolt will use Candidate A (the original, non-copy filename) as the canonical file.

### Requirements (if replacing)

| Field | Value |
|---|---|
| Required page | /intelligence/amct |
| Current placeholder | VISUAL-AMCT-01 in hero section |
| Concept | AI-Mediated Choice Triangle — three-way relationship between Customer, AI and Business, and how trust holds across all three |
| Preferred dimensions | At least 1600px wide |
| Aspect ratio | 4:3 |
| Accepted file types | PNG or WebP |
| Required labels | Customer, AI, Business, Trust |

### Alternatives

- Confirm Candidate A (use existing image)
- Provide a replacement image

### What Bolt will do after NF decides

If confirming: replace the placeholder with the confirmed image on the AMCT page. If replacing: place the new asset and replace the placeholder. Verify rendering on desktop and mobile.

### Information or asset NF needs to provide

```
AMCT canonical visual: A / B / C / REPLACE
```

If REPLACE: provide the replacement image file.

### Does this block launch?

Yes

### Original blocker

LB-09

---

## Decision 7: Privacy Legal Review

### Decision

NF needs to send the prepared Privacy material to legal counsel for review and approval.

### What NF needs to decide or provide

Engage legal counsel. Send them the prepared legal review brief and the current Privacy Policy draft. Obtain their approved wording or amendments.

### Why this is needed

The Privacy Policy is a structural framework. It needs professional legal review before it can be published on a live website. Publishing unreviewed privacy material creates legal risk.

### Recommended minimum viable launch approach

1. Send `docs/v4-legal-review-brief.md` and the current Privacy page content to your legal reviewer
2. Ask them to review, amend, and approve
3. Return the approved wording to Bolt

The legal review brief already covers: company identity, website description, exact data collection fields, Foundation Customers programme, analytics, cookies, third-party services, video embeds, calculator disclaimers, enquiry data architecture, international access, and 10 specific legal questions.

### Alternatives

None. Legal review is required before publication.

### What Bolt will do after NF decides

Apply legal counsel's approved content to the Privacy page. No legal determinations will be made by Bolt.

### Information or asset NF needs to provide

**NF action:** Send `docs/v4-legal-review-brief.md` + current Privacy draft to legal reviewer.

**Bolt needs back:**
- Approved Privacy wording
- Confirmed jurisdiction-related statements
- Any required disclosure changes

### Does this block launch?

Yes

### Original blocker

LB-04

---

## Decision 8: Terms Legal Review

### Decision

NF needs to send the prepared Terms material to legal counsel for review and approval.

### What NF needs to decide or provide

Engage legal counsel. Send them the prepared legal review brief, the current Terms draft, and the Enterprise Value Calculator disclaimer context. Obtain their approved wording or amendments.

### Why this is needed

The Terms of Service is a structural framework. It needs professional legal review before it can be published on a live website. Publishing unreviewed terms creates legal risk.

### Recommended minimum viable launch approach

1. Send `docs/v4-legal-review-brief.md`, the current Terms page content, and the calculator disclaimer context to your legal reviewer
2. Ask them to review, amend, and approve
3. Return the approved wording to Bolt

### Alternatives

None. Legal review is required before publication.

### What Bolt will do after NF decides

Apply legal counsel's approved content to the Terms page. No legal determinations will be made by Bolt.

### Information or asset NF needs to provide

**NF action:** Send current Terms draft + `docs/v4-legal-review-brief.md` + Calculator disclaimer context to legal counsel.

**Bolt needs back:**
- Approved Terms wording
- Governing law / jurisdiction
- Any IP / trademark wording changes
- Any liability / disclaimer changes

### Does this block launch?

Yes

### Original blocker

LB-05

---

## Not Blocking Launch, But Still Tracked

These items remain in the NF Launch Action Plan. They do not block publication but are tracked for completion after launch or as optional enhancements.

| Item | Description | Original blocker |
|---|---|---|
| EV report delivery | Disabled for launch. Adapter preserved. Future activation optional. | LB-03 (resolved) |
| RTS027 evidence | Article deliberately held in review. Needs external Board/governance evidence or rescoping before publication. | LB-11 (article-level) |
| FC-dependent article evidence strengthening | 6 articles (RTS005/007/010/031/033/034) safe to publish as thesis. FC evidence will strengthen them later. | Evidence register |
| Beneficial concept visuals | 8 concept pages now use native content treatments. Optional designed visuals may enhance them post-launch. | LB-10 (resolved) |
| Human in the Lead visual | Native 3-card treatment in place. Optional designed visual may be added later. | LB-10 (resolved) |
| Analytics | No vendor connected. Post-launch or pre-launch optional decision. | LB-13 |
| Error monitoring | No vendor connected. Post-launch or optional Day-1 decision. | LB-15 |
| Enhanced social OG system | No OG image set. No template branding exposed. Non-optimised but NF-neutral. Post-launch brand-quality action. | LB-14 |
| Future Data Room | Investor page works without it. Access mechanism deferred. | Part 7 |
| Future cookie/consent review | No cookies currently set. Must revisit if analytics or tracking is added. | LB-17 (resolved) |
| Post-launch evidence additions | External evidence can be added to articles over time to strengthen claims. | Evidence register |
| Post-launch 72-hour QA | Quality assurance checklist to execute after publication. | Part 7 |
| Company identity confirmation | Legal entity name, registration, addresses, contact email, copyright owner, trademark ownership. Needed before final sign-off and indexing. | LB-16 |

---

## FASTEST PATH TO LAUNCH

### Step 1: Start legal review immediately (parallel)

Send `docs/v4-legal-review-brief.md` plus the current Privacy and Terms drafts to legal counsel today. Legal review is the longest-lead-time item and should begin immediately. It runs in parallel with everything else.

**NF action:** Engage legal counsel. Send the brief and drafts.

### Step 2: Confirm domain and hosting (parallel, same day)

These two decisions are quick and independent. Confirm the canonical domain and confirm the hosting environment. Bolt needs both before deploying.

**NF action:**
```
Canonical domain: ____________________
Production hosting: ____________________
```

### Step 3: Choose enquiry destination (same day)

Tell Bolt where enquiries should go. The simplest option is a dedicated NF email address.

**NF action:**
```
Enquiry destination choice: A / B / C
```

### Step 4: Provide or confirm the three visuals (parallel)

The AMCT decision is the fastest — just confirm the existing image is correct. The EV and QL visuals need final approved assets uploaded.

**NF action:**
```
AMCT canonical visual: A / B / C / REPLACE
Enterprise Value visual: UPLOAD / IDENTIFY EXISTING ASSET
Quiet Loss visual: UPLOAD / IDENTIFY EXISTING ASSET
```

### Step 5: Receive legal approval

When legal counsel returns approved Privacy and Terms wording, Bolt applies it to the site.

**NF action:** Return approved wording to Bolt.

### Step 6: Bolt deploys

Once all eight decisions are made, Bolt:
1. Configures the canonical domain
2. Configures hosting
3. Connects the enquiry form to the chosen destination
4. Replaces the three visual placeholders with confirmed assets
5. Applies approved Privacy and Terms content
6. Deploys the site
7. Executes the post-launch 72-hour QA checklist

### What can happen in parallel

| Track | Items | Can start |
|---|---|---|
| Legal track | Privacy review + Terms review | Immediately |
| Domain and hosting track | Decisions 1 and 2 | Immediately |
| Enquiry track | Decision 3 | Immediately |
| Visual track | Decisions 4, 5, and 6 | Immediately |

All four tracks can proceed simultaneously. The only sequential dependency is: Bolt deploys after all eight are returned.
