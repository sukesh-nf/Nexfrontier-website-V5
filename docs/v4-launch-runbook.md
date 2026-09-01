# v4 Launch Runbook

## Pre-Launch Checklist

### Domain and Hosting
- [ ] Confirm canonical production domain (.com/.nz/.my)
- [ ] Set NEXT_PUBLIC_SITE_URL to canonical domain
- [ ] Confirm hosting vendor (Next.js-capable)
- [ ] Configure DNS
- [ ] Configure SSL/TLS

### Indexing
- [ ] Confirm SITE_INDEXING_ENABLED remains false until launch
- [ ] Set SITE_INDEXING_ENABLED=true only at launch
- [ ] Verify robots.txt returns noindex before launch
- [ ] Verify sitemap.xml is empty before launch
- [ ] Enable indexing only after explicit go/no-go

### Preview Mode
- [ ] Review NEXT_PUBLIC_PREVIEW_MODE security (currently exposed client-side)
- [ ] Prefer server-side preview mechanism
- [ ] Verify unpublished content returns notFound() without preview

### Forms and Backends
- [ ] Connect Market Enquiry form to real destination (email/CRM/database)
- [ ] Test form submission end-to-end
- [ ] Verify success state
- [ ] Verify failure state
- [ ] Connect EV Calculator report delivery or disable report button
- [ ] Connect Investor Access to shared Market Enquiry backend
- [ ] Test all enquiry types (FC, Investor, Partnership, Market, Other)

### Legal
- [ ] Privacy policy reviewed and approved by legal counsel
- [ ] Terms reviewed and approved by legal counsel
- [ ] Calculator disclaimer language confirmed
- [ ] Cookie register updated if services added
- [ ] Privacy policy matches actual implementation

### Visual Assets
- [ ] EV canonical visual uploaded
- [ ] QL canonical visual uploaded
- [ ] AMCT asset confirmed from 3 candidates
- [ ] Concept visuals created (Shift, ORBIT, Intent Threads, Enterprise Capability, FC Pathway)
- [ ] Social OG image system finalised
- [ ] Favicon verified

### Evidence
- [ ] External evidence sources for RTS001, RTS002, RTS008, RTS009, RTS013, RTS027
- [ ] FC-dependent articles reviewed for thesis-only launch readiness

### Content
- [ ] All routes reviewed by NF leadership
- [ ] Company identity details confirmed (legal name, registration, addresses)
- [ | Contact details verified

### Analytics
- [ ] Analytics vendor selected (or explicitly deferred)
- [ ] Analytics events defined (if vendor selected)
- [ ] Privacy-preserving configuration confirmed

## Build and Deploy
- [ ] Run `npm run build` — must pass with zero errors
- [ ] Deploy to hosting
- [ ] Verify production build

## Smoke Tests (Post-Deploy)
- [ ] Home loads
- [ ] All canonical routes load
- [ ] 404 returns correct HTTP behaviour
- [ ] Mobile navigation works
- [ ] Desktop navigation works
- [ ] Reading The Shift search works
- [ ] Calculator functions
- [ ] Form submission (if backend connected)
- [ ] Redirects work
- [ ] Canonical tags present
- [ ] robots.txt correct
- [ ] sitemap.xml correct (only published routes)
- [ ] Social share cards render correctly

## Rollback
- [ ] Confirm rollback procedure with hosting vendor
- [ ] Confirm go/no-go owner
