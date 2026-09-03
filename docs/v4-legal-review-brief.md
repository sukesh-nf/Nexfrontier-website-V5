# v4 Legal Review Brief

**Purpose:** Provides legal reviewer with the context needed to review and finalise the Privacy Policy and Terms of Service for the NexFrontier v4 website.

**Status:** Working pack for legal counsel. Not a legal document. Does not constitute legal advice.

---

## 1. Company

**Confirmed:**
- Trading name: NexFrontier
- Malaysia Digital badge awarded by MDEC (displayed in footer)

**Unconfirmed (awaiting NF leadership):**
- Exact Malaysian legal entity name
- Company/registration number (if intended for display)
- Malaysian registered address
- New Zealand presence wording
- New Zealand address (if displayed)
- Public contact email
- Copyright owner
- Trademark ownership basis
- Legal jurisdiction (after counsel input)

---

## 2. Website

The NexFrontier website is a public marketing and thought-leadership site for a B2B intelligence company. It does not sell products directly. It provides:

- Conceptual framework pages explaining NexFrontier's perspectives on AI-mediated markets
- A Reading The Shift section with 35 articles answering questions about AI, customer intent, and enterprise value
- An Enterprise Value Calculator — an interactive scenario tool that illustrates potential value ranges from Quiet Loss and Adaptive Value across five dimensions
- A Foundation Customers page describing the programme
- An Investor page
- A Market Enquiry contact form
- Team profiles on an About page
- Video pages embedding YouTube content

---

## 3. Data Collection

### 3.1 Market Enquiry Form

The enquiry form collects the following fields:

| Field | Required? | Purpose |
|---|---|---|
| Name | Yes | Identify the enquirer |
| Work email | Yes | Respond to the enquiry |
| Organisation | Yes (Foundation Customer type only) | Understand the enquirer's business |
| Role | No | Context for the enquiry |
| Enquiry type | Yes | Route the enquiry (Foundation Customer, Investor, Partnership, Market/Customer, Other) |
| Annual revenue range | No (Foundation Customer and Market/Customer types only) | Qualification context |
| Message | No | Understand the question |
| Website | No | Optional business context |
| Consent checkbox | Yes | Acknowledgement of privacy practices |

**Data destination:** Not yet connected. NF must choose where enquiries arrive (email, CRM, or database). Until connected, the form returns a "not connected" response and no data is transmitted or stored.

**Rate limiting:** 5 requests per minute per IP address.

**Input sanitisation:** All fields are length-capped and trimmed server-side. Email format is validated. Enquiry type and revenue range are checked against allowlists.

### 3.2 No Other Data Collection

- No analytics vendor is currently connected
- No cookies or tracking technologies are currently set
- No account creation or authentication
- No newsletter subscription (adapter exists but not connected)

---

## 4. Foundation Customers

The Foundation Customers page describes a programme where NexFrontier works with selected businesses to test its intelligence hypotheses in real operating environments. The page describes:

- The programme's purpose (testing hypotheses, building evidence, validating value)
- Progression stages (Assumption, Hypothesis, Evidence, Customer Validation, Paid Validation, Repeatable Proof)
- The relationship between Foundation Customers and Paid Beta

No Foundation Customer identities are disclosed publicly. No customer-specific outcomes are claimed.

---

## 5. Analytics

**Current state:** No analytics vendor is connected. No analytics scripts are loaded. No tracking events are transmitted.

An analytics abstraction layer exists in the codebase but is inactive. If analytics is enabled in future, the cookie/tracking register must be updated and the Privacy Policy must reflect the actual implementation.

---

## 6. Cookies / Storage

**Current state:** No cookies or tracking technologies are in use. No cookie banner is displayed.

YouTube video embeds on /watch/[slug] pages use standard iframe embedding. Privacy-enhanced mode should be considered before launch.

---

## 7. Third-Party Services

| Service | Purpose | Status |
|---|---|---|
| YouTube | Video embeds on /watch/[slug] pages | Active |
| (Form backend) | Market Enquiry delivery | Not connected |
| (Analytics) | Usage analytics | Not connected |
| (Error monitoring) | Production error tracking | Not connected |

---

## 8. Video

YouTube videos are embedded on /watch/[slug] pages using standard iframe embedding. No videos are hosted directly. Video pages have per-video metadata (title, description) for SEO purposes.

**Currently planned:** Consider YouTube privacy-enhanced mode before launch to reduce tracking exposure.

---

## 9. Enterprise Value Calculator

The Enterprise Value Calculator is an interactive scenario tool on /enterprise-value/calculator. It allows users to:

- Adjust business inputs (monthly enquiries, average value, response rate)
- Adjust Quiet Loss and Adaptive Value assumptions
- See a calculated Enterprise Value Delta across five dimensions (Revenue, Cost, Capacity, Customer Value, Enterprise Capability)
- View a status indicator (Status Quo / Value Erosion / Value Creation)

**Disclaimers:** The calculator produces illustrative figures based on user-provided assumptions. It does not represent financial advice, guarantees, or proven outcomes. All figures are hypothetical scenarios.

**Report delivery:** Disabled for launch. No email delivery mechanism is connected. The calculator concludes with links to explore further content and make a market enquiry.

---

## 10. Report Delivery

Disabled for initial launch. The adapter architecture is preserved for future activation but no delivery mechanism is connected. The calculator does not collect email addresses or imply that a report will be sent.

---

## 11. Enquiry Data

**Intended collection/delivery architecture:**

1. User completes the Market Enquiry form
2. Form submits to a server-side API route (/api/enquiry)
3. Server-side route validates, sanitises, and rate-limits the input
4. Sanitised payload is forwarded to the chosen destination (email, CRM, or database — pending NF decision)
5. Success response returned only after real delivery is confirmed
6. Failure state shown if delivery fails

**Destination still pending.** No enquiry data is currently transmitted or stored.

---

## 12. Countries / Markets

The website is accessible internationally. Content references:

- Malaysia (MDEC badge displayed, Malaysian entity)
- New Zealand (presence referenced, NZ-specific article planned but not published)
- International access (no geo-restriction)

---

## 13. Legal Questions Requiring Review

1. **Privacy Policy:** Does the current privacy framework adequately cover the data collection described in Section 3? What additions are needed for the eventual form backend connection?

2. **Terms of Service:** Do the current terms adequately cover the interactive Enterprise Value Calculator and its disclaimers? Are additional liability limitations needed?

3. **YouTube embeds:** Does the Privacy Policy need to disclose YouTube iframe embedding and its potential cookie implications? Should privacy-enhanced mode be mandatory?

4. **International access:** Given the site is accessible from Malaysia, New Zealand, and internationally, which jurisdiction's privacy regulations apply? Does the Privacy Policy need to address GDPR, PDPA (Malaysia), or NZ Privacy Act requirements?

5. **Foundation Customers programme:** Does describing the programme publicly require any contractual or compliance language in the Terms?

6. **Trademark notices:** Quiet Loss™, Adaptive Value™, AMCT™, ORBIT™, and Intent Threads™ are used as trademarks. What trademark notices or attributions are required in the Terms or footer?

7. **Enterprise Value Calculator disclaimers:** Are the existing disclaimers sufficient, or should additional financial advice disclaimers be included?

8. **Enquiry data retention:** Once the form backend is connected, what retention period should apply to enquiry submissions? Should this be stated in the Privacy Policy?

9. **Children's privacy:** The website is B2B. Should the Privacy Policy explicitly state it is not directed at children?

10. **Cookie policy:** Given no cookies are currently set, should the Privacy Policy state this explicitly, and should it describe the mechanism for obtaining consent if cookies are added later?

---

## 14. Documents for Review

- `/privacy` page (app/privacy/page.tsx) — Privacy Policy framework
- `/terms` page (app/terms/page.tsx) — Terms of Service framework

Both are structural frameworks marked LEGAL REVIEW REQUIRED. They need legal counsel to review, complete, and approve before publication.
