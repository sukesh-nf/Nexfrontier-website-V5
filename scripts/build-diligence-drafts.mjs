#!/usr/bin/env node
// build-diligence-drafts.mjs
// Usage: node scripts/build-diligence-drafts.mjs <ADMIN_TOKEN> <ANON_KEY>
//
// Reads ADMIN_TOKEN from argv[2] and ANON_KEY from argv[3], defines the
// content_json for all 6 investor data-room pages, calls the save-draft API
// for each page's draft ID, and reports success/failure for each.

const ADMIN_TOKEN = process.argv[2];
const ANON_KEY = process.argv[3];

const API_URL =
  "https://sikerdsityctmpqkwqjr.supabase.co/functions/v1/drm-content-admin?action=save-draft";

if (!ADMIN_TOKEN || !ANON_KEY) {
  console.error(
    "Usage: node scripts/build-diligence-drafts.mjs <ADMIN_TOKEN> <ANON_KEY>"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Draft IDs
// ---------------------------------------------------------------------------
const DRAFT_IDS = {
  "investment-case": "62e8e7fa-a88c-4c0b-935e-42befbe6b1a3",
  "market-evidence": "19b05661-a03e-40dc-9a9b-3391213cb4a8",
  "economic-opportunity": "f452b6a3-0399-45bc-893d-a62d0acb4746",
  product: "34fb140e-69b1-4a32-9322-c8afbedef5b1",
  proof: "a2049fa3-f7d9-42d0-bb7b-181436ca8a5f",
  round: "248622bd-a482-41f7-a6b8-b85d523b9425",
};

// ---------------------------------------------------------------------------
// PAGE 01: investment-case
// ---------------------------------------------------------------------------
const investmentCaseContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading:
        "An emerging enterprise problem. A potential new category. A proof-stage investment opportunity.",
      body:
        "NexFrontier is building Enterprise Navigational Intelligence for AI-mediated markets.\n\nBusinesses have always had to understand their markets and adapt as those markets change.\n\nOur thesis is not that this requirement is new.\n\nOur thesis is that AI may make it materially harder.\n\nAI is increasing capability across customers, competitors, suppliers, platforms and enterprises at the same time. As those participants learn, act and respond to one another, the direction, speed and state of the market can change too.\n\nAI may be changing not only markets, but how markets change.\n\nIf that is right, an enterprise can improve internally, perform against plan and still become less aligned with the economic opportunity available in its market.\n\nThat leads to the problem NexFrontier is being built to address:\n\nHow does leadership know whether the enterprise is adapting at the rate and in the direction its market now requires?",
      evidence_state: "HYPOTHESIS",
      order: 1,
    },
    {
      label: "WHAT HAS TO BE TRUE",
      heading:
        "NexFrontier's venture-scale opportunity depends on three propositions becoming true together.",
      display_treatment: "columns",
      order: 2,
      children: [
        {
          heading: "01 — MARKETS BECOME MORE DYNAMIC",
          body:
            "AI-mediated markets change fast enough, and differently enough, that enterprises increasingly struggle to see, interpret and keep pace with economically meaningful market change.",
          evidence_state: "HYPOTHESIS",
        },
        {
          heading: "02 — ALIGNMENT BECOMES ECONOMICALLY CONSEQUENTIAL",
          body:
            "The gap between changing market opportunity and enterprise reality becomes material enough to create, protect or leave enterprise value unrealised.",
          evidence_state: "HYPOTHESIS",
        },
        {
          heading: "03 — NAVIGATION BECOMES CONTINUOUSLY NECESSARY",
          body:
            "Leadership increasingly requires intelligence to understand what is changing, what matters economically and where to adapt, invest or hold course.",
          evidence_state: "HYPOTHESIS",
        },
      ],
    },
    {
      body:
        "If all three propositions prove true:\n\nEnterprise Navigational Intelligence could emerge as a new enterprise capability.\n\nNexFrontier is being built to define it.",
      order: 3,
    },
    {
      label: "WHY THE ENTRY POINT MAY BE ASYMMETRIC",
      heading: "NexFrontier remains early.",
      body:
        "The category is not established.\nThe customer economics are not yet validated.\nCommercial repeatability has not yet been demonstrated.\n\nThat uncertainty matters.\n\nIt is also where the potential asymmetry sits.",
      order: 4,
      display_treatment: "two-side",
      children: [
        {
          heading: "TODAY",
          body:
            "Proof-stage company\n\nthesis established\nexternal market evidence accumulating\nMVP/Beta being built\nFoundation Customer validation next\ncustomer economics under validation\ncategory not established",
        },
        {
          heading: "IF PROVED",
          body:
            "Category-scale potential\n\neconomically material enterprise problem\nrecurring leadership requirement\nmeasurable customer economic value\npaid enterprise relationships\nrepeatable commercial economics\naccumulated intelligence that may become more valuable as evidence compounds",
        },
      ],
    },
    {
      body:
        "The asymmetry exists in the distance between what NexFrontier is worth while the thesis is being proved and what it could become if the thesis is right.",
      order: 5,
    },
    {
      label: "THE FOUR UNCERTAINTIES THAT MATTER",
      heading:
        "These four uncertainties determine whether NexFrontier becomes a scalable company.",
      display_treatment: "grid-2x2",
      order: 6,
      children: [
        {
          heading: "PRODUCT",
          body: "Can NexFrontier work in real enterprise conditions?",
        },
        {
          heading: "CUSTOMER",
          body: "Does the problem matter enough for leadership to act?",
        },
        {
          heading: "ECONOMICS",
          body:
            "Can NexFrontier identify and help create measurable economic value?",
        },
        {
          heading: "COMMERCIAL",
          body: "Will customers pay, and can that value repeat?",
        },
      ],
    },
    {
      label: "NEXT PROOF THRESHOLD",
      heading:
        "Foundation Customer validation is intended to move NexFrontier from market evidence toward customer validation.",
      body:
        "It is intended to test whether the product works in real enterprise conditions, whether the problem matters to leadership and whether market-enterprise misalignment can be translated into an economically meaningful consequence.\n\nPaid validation then asks a different question:\n\nWill customers pay for the value?\n\nRepeatable proof asks another:\n\nCan the result occur again across customers?\n\nThese are different thresholds and NexFrontier will treat them as such.",
      order: 7,
    },
    {
      label: "",
      heading: "Proof first. Scale second.",
      body:
        "The investment opportunity at this stage is to participate while material uncertainty remains and while the next capital can still create significant value by converting that uncertainty into evidence.",
      order: 8,
    },
  ],
  related_links: [
    {
      label: "EXAMINE THE MARKET EVIDENCE →",
      href: "/investor-data-room/market-evidence",
      primary: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGE 02: market-evidence
// ---------------------------------------------------------------------------
const marketEvidenceContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading:
        "The market is not just changing. AI may be changing the conditions of change itself.",
      body:
        "Markets have always changed.\n\nEnterprises have always adapted.\n\nThe NexFrontier thesis therefore cannot rest on the observation that change exists.\n\nThe more consequential possibility is that AI changes the dynamics of market change itself.\n\nAI is increasingly present across:\n\ncustomers\ncompetitors\nsuppliers\nplatforms\nenterprises\n\nEach participant can become more capable of sensing, deciding, acting and responding.\n\nAnd each response can alter the conditions the other participants encounter next.\n\nThe enterprise is therefore not adapting in isolation.\n\nIt is adapting inside a market that may itself be becoming more adaptive.",
      evidence_state: "HYPOTHESIS",
      order: 1,
    },
    {
      label: "WHY THIS MAY BE DIFFERENT",
      heading:
        "Previous technology shifts changed important variables in markets.",
      body:
        "The NexFrontier thesis is that AI may also make the relationships between those variables more dynamic.\n\nMarket change can therefore become more:\n\ninteractive\nnonlinear\npath-dependent\nresponsive\ndifficult to interpret through historical assumptions alone\n\nThe consequence is not necessarily that every market simply moves faster.\n\nThe more important possibility is:\n\nthe rate, direction and significance of market change may themselves become less stable.\n\nThat matters because enterprises typically sense, interpret, decide and allocate resources through structures designed for a more bounded operating environment.",
      order: 2,
    },
    {
      label: "INTERNAL AI IS NOT THE SAME AS MARKET ALIGNMENT",
      heading: "Businesses are investing heavily in AI internally.",
      body:
        "That can improve:\n\nproductivity\nautomation\ndecision support\noperating efficiency\nspeed\n\nThose gains matter.\n\nBut:\n\nInternal AI can improve how the business operates. External AI can change the market the business operates in.\n\nA company can therefore become more AI-enabled internally while still becoming less aligned with the opportunity emerging around it.\n\nThis is the distinction NexFrontier is investigating.",
      display_treatment: "two-side",
      order: 3,
      children: [
        {
          heading: "INTERNAL AI",
          body:
            "Improve how the business operates.\n\nproductivity\nautomation\ndecision support\noperating efficiency\nspeed",
        },
        {
          heading: "EXTERNAL AI",
          body:
            "Change the market the business operates in.\n\nhow customers discover\nhow alternatives are evaluated\nhow platforms mediate access\nhow competitors respond\nhow quickly capability spreads",
        },
      ],
    },
    {
      label: "EVIDENCE / BASIS",
      heading:
        "There is growing external evidence that AI is changing important market behaviours.",
      body:
        "Including:\n\nhow customers discover businesses\nhow alternatives are evaluated\nwhat customers expect from responsiveness and relevance\nhow AI participates in recommendation and choice\nhow competitors can learn and respond\nhow platforms mediate access to customers\nhow quickly new capability can spread",
      order: 4,
    },
    {
      label: "WHAT THE EVIDENCE DOES AND DOES NOT SHOW",
      heading:
        "External evidence can support the proposition that important market behaviours are changing.",
      body:
        "It cannot by itself prove NexFrontier's stronger thesis.\n\nThat requires enterprise evidence.\n\nThe key question is not simply:\n\nIs AI changing the market?\n\nIt is:\n\nIs the market changing in ways that create an economically material consequence for this enterprise?\n\nExternal Market Signals establish why the shift deserves attention.\n\nFoundation Customer evidence must establish whether the shift produces a material enterprise alignment problem.",
      order: 5,
    },
    {
      label: "THE ENTERPRISE VISIBILITY GAP",
      heading:
        "Most enterprises have substantial visibility into themselves.",
      body:
        "Leadership can see:\n\nperformance\nfinancial results\ncustomers\ntransactions\noperations\nforecasts\nplans\n\nThe harder question is relational:\n\nWhat does our current enterprise performance mean against the market opportunity available now?\n\nThat distinction matters because:\n\nA business can perform well against its own plan while becoming less competitive in its market.\n\nAnd:\n\nYou cannot judge the speed of the enterprise without knowing the speed and direction of the market around it.",
      order: 6,
    },
    {
      label: "WHAT REMAINS TO BE PROVED",
      heading: "NexFrontier still needs to establish that:",
      body:
        "economically meaningful market change can be recognised reliably enough to matter\nenterprise reality can be observed against that changing context\nmaterial misalignment can be distinguished from ordinary operating variation\nleadership finds the resulting intelligence decision-useful\nthe consequence can be translated into measurable enterprise value",
      order: 7,
    },
    {
      label: "NEXT PROOF THRESHOLD",
      heading: "Foundation Customer work needs to connect:",
      body:
        "changing market reality → enterprise reality → material alignment gap → economic consequence\n\nThe proof is not that NexFrontier can describe a changing market.\n\nThe proof is that it can help leadership understand:\n\nwhat that changing market means for this enterprise.",
      order: 8,
    },
    {
      label: "",
      heading: "Faster markets do not simply require faster enterprises.",
      body:
        "They require better judgement about what to respond to, how much to adapt and when.",
      order: 9,
    },
  ],
  related_links: [
    {
      label: "SEE THE ECONOMIC CONSEQUENCE →",
      href: "/investor-data-room/economic-opportunity",
      primary: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGE 03: economic-opportunity
// ---------------------------------------------------------------------------
const economicOpportunityContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading:
        "The bigger prize may not be the software market. It may be the economic value moving underneath it.",
      body:
        "NexFrontier is not building intelligence simply to describe change.\n\nThe economic question is:\n\nWhat does this change mean for the value this enterprise could create, protect or leave unrealised?\n\nAs markets change, an enterprise may:\n\ncapture new economic opportunity\nprotect existing value\nleave available opportunity unrealised\nallocate resources to changes that do not justify the response\nfail to respond where the economic consequence is material\n\nNexFrontier seeks to make that relationship visible.\n\nEnterprise value is therefore the destination of the intelligence, not an adjacent metric.",
      evidence_state: "HYPOTHESIS",
      order: 1,
    },
    {
      label: "THE VALUE GAP",
      heading:
        "The central economic hypothesis is that a gap can emerge between the market opportunity now available and the value the enterprise is currently capable of capturing from it.",
      body:
        "NexFrontier refers to the economically material consequence of that relationship as the:\n\nValue Gap\n\nThe purpose is not to measure difference for its own sake.\n\nThe purpose is to determine:\n\nIs the difference worth acting on?",
      order: 2,
    },
    {
      label: "TWO EXPRESSIONS OF ENTERPRISE VALUE",
      display_treatment: "columns",
      order: 3,
      children: [
        {
          heading: "ADAPTIVE VALUE™",
          body:
            "Adaptive Value™ is additional enterprise value that may become possible when economically meaningful market change creates new opportunity and the enterprise adapts effectively to capture it.\n\nAdaptive Value is the upside.\n\nIt asks:\n\nWhat additional value could become possible if the enterprise responds effectively to economically meaningful change?",
        },
        {
          heading: "QUIET LOSS™",
          body:
            "Quiet Loss™ is enterprise value that remains unrealised because the enterprise is not fully aligned to the market opportunity available to it.\n\nQuiet Loss may exist without an obvious operational failure.\n\nRevenue can still rise.\nTargets can still be met.\nCustomers can still buy.\nDashboards can still be green.\n\nThe economic question is relative:\n\nHow much more value might have been available if the enterprise had been better aligned to its market?",
        },
      ],
    },
    {
      label: "FIVE LENSES OF VALUE",
      heading:
        "NexFrontier's Value Translation Framework™ currently examines economic consequence through five lenses.",
      body:
        "These are currently analytical lenses.\n\nThey are not claims of validated customer outcomes.",
      display_treatment: "columns",
      order: 4,
      children: [
        {
          heading: "DEFENSIVE VALUE",
          body: "Value protected from erosion or loss.",
        },
        {
          heading: "OFFENSIVE VALUE",
          body: "Additional value created or captured.",
        },
        {
          heading: "REVENUE HEALTH",
          body:
            "The quality, resilience and conversion of available revenue opportunity.",
        },
        {
          heading: "CUSTOMER LIFETIME VALUE",
          body:
            "Changes in the economic value of customer relationships over time.",
        },
        {
          heading: "ENTERPRISE CAPABILITY",
          body:
            "The economic value associated with becoming better able to recognise material change, decide appropriately, adapt effectively and learn.",
        },
      ],
    },
    {
      label: "WORKING ECONOMIC HYPOTHESIS",
      display_treatment: "hypothesis-block",
      order: 5,
      body:
        "NexFrontier is testing whether market-enterprise misalignment can represent a meaningful percentage of the economic value available to an enterprise.",
      children: [
        {
          heading: "CURRENT WORKING HYPOTHESIS",
          body:
            "The current working hypothesis explores exposure in the order of 10–30% of current revenue.",
        },
        {
          heading: "NOT VALIDATED CUSTOMER EVIDENCE",
          body:
            "The 10–30% range is not a forecast, a guaranteed opportunity, a claim about every enterprise, or a measured customer result.\n\nFoundation Customer validation must establish whether a defensible economic range exists, for which enterprises, under which conditions and through which mechanisms.",
        },
      ],
      evidence_state: "HYPOTHESIS",
    },
    {
      label: "THE ECONOMIC PRIZE",
      heading:
        "If NexFrontier can identify where economic value is moving and help leadership determine where adaptation is justified, there are potentially three aligned economic outcomes.",
      display_treatment: "columns",
      order: 6,
      children: [
        {
          heading: "FOR THE CUSTOMER",
          body:
            "Create more value. Lose less of it.\n\nPotential expressions include:\n\nmore revenue captured\nless value left unrealised\nstronger revenue quality\nbetter use of capacity\nimproved allocation of resources\nstronger customer economics\nimproved competitive position",
        },
        {
          heading: "FOR NEXFRONTIER",
          body:
            "Participate in the value it helps identify and realise.\n\nThe intended commercial model is for NexFrontier economics to become connected to measurable incremental customer economic value.\n\nSUBJECT TO PAID VALIDATION",
        },
        {
          heading: "FOR THE INVESTOR",
          body:
            "NexFrontier's opportunity may become materially larger if its economics are linked not simply to enterprise software spend, but to the economic value moving as markets and enterprises change at different rates and in different directions.\n\nThis is a strategic economic hypothesis.\n\nIt is not yet proven.",
        },
      ],
    },
    {
      label: "WHAT REMAINS TO BE PROVED",
      heading: "NexFrontier must establish:",
      body:
        "which alignment gaps are economically material\nwhich apparent gaps are simply noise\nhow value exposure should be quantified\nwhether value can be attributed credibly\nhow much identified value can realistically be realised\nwhether customers recognise the economic consequence\nwhether customers will pay in relation to that value\nwhether those economics repeat",
      order: 7,
    },
    {
      label: "NEXT PROOF THRESHOLD",
      heading: "The intended progression is:",
      display_treatment: "progression",
      order: 8,
      children: [
        { heading: "possible value" },
        { heading: "evidenced value exposure" },
        { heading: "customer-recognised value" },
        { heading: "realised value" },
        { heading: "paid validation" },
        { heading: "repeatable economics" },
      ],
    },
    {
      body: "Each step requires evidence.",
      order: 9,
    },
    {
      label: "",
      heading:
        "NexFrontier seeks to identify where enterprise value can be protected, recovered or increased as markets change.",
      body: "",
      order: 10,
    },
  ],
  related_links: [
    {
      label: "SEE THE INTELLIGENCE BEING BUILT →",
      href: "/investor-data-room/product",
      primary: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGE 04: product
// ---------------------------------------------------------------------------
const productContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading:
        "See what is changing. Understand what it means. Navigate where to act.",
      body:
        "NexFrontier is developing:\n\nEnterprise Navigational Intelligence\n\nEnterprise Navigational Intelligence is intended to help business leaders:\n\nSEE what is changing across the relationship between their enterprise and its market\n\nUNDERSTAND what that change means and which differences are economically material\n\nNAVIGATE where to adapt, invest or hold course\n\nSEE, UNDERSTAND and NAVIGATE are not intended as a one-way reporting sequence.\n\nThey form a continuous learning loop as both enterprise reality and market reality change.",
      evidence_state: "HYPOTHESIS",
      order: 1,
    },
    {
      label: "THE NAVIGATION PROBLEM",
      heading:
        "Most enterprise systems are designed primarily to help the enterprise operate, record, transact, analyse, plan, automate and optimise.",
      body:
        "Those capabilities remain essential.\n\nNexFrontier's focus is different.\n\nIt is concerned with the relationship between:\n\nenterprise reality\n\nand:\n\nchanging market reality\n\nThe leadership question becomes:\n\nWhat does what we can observe about the enterprise mean against what the market now requires?",
      order: 2,
    },
    {
      label: "THE INTELLIGENCE CHAIN",
      display_treatment: "progression",
      order: 3,
      children: [
        {
          heading: "Operational Observability",
          body:
            "The underlying ability to establish from evidence what is actually occurring across the operating enterprise.",
        },
        {
          heading: "Strategic Visibility",
          body:
            "Leadership visibility into the economically material relationship between enterprise reality and changing market reality.",
        },
        {
          heading: "Enterprise Navigational Intelligence",
          body:
            "The interpretation of what that relationship means and where leadership should adapt, invest or hold course.",
        },
        {
          heading: "Enterprise Value",
          body:
            "The measurable economic consequence NexFrontier ultimately seeks to identify.",
        },
      ],
    },
    {
      label: "READINESS AND CAPABILITY",
      heading: "OPERATIONAL READINESS",
      body:
        "Operational Readiness is the evidenced state of how well the operating enterprise is aligned to what its current market requires.",
      order: 4,
      children: [
        {
          heading: "ENTERPRISE CAPABILITY",
          body:
            "Enterprise Capability is the ability to recognise material market change, understand its economic consequence, decide what deserves a response, adapt in ways that can be shown to create value, and learn.",
        },
      ],
    },
    {
      body:
        "Readiness is the state. Capability is the ability to keep earning it.",
      order: 5,
    },
    {
      label: "ADAPTATION IS NOT SIMPLY SPEED",
      heading:
        "NexFrontier does not assume that an enterprise should respond faster to everything.",
      body:
        "That can create more activity without creating more value.\n\nThe objective is:\n\nadaptive speed with economic judgement.\n\nFaster adaptation means shortening the time between:\n\nmeaningful market change → leadership awareness → economically justified response\n\nThe advantage is not speed alone.\n\nIt is knowing how fast to adapt, and when.",
      order: 6,
    },
    {
      label: "WHAT NEXFRONTIER IS NOT",
      heading: "NexFrontier is not being built as:",
      body:
        "another chatbot\na CRM replacement\na generic dashboard\na workflow automation platform\na generic forecasting tool\na generic AI-readiness assessment\nanother internal productivity assistant\n\nNexFrontier may use evidence from systems that perform some of those functions.\n\nThose systems can be sources.\n\nThe intended NexFrontier value sits above them:\n\nhelping leadership understand what enterprise reality means against changing market reality.",
      order: 7,
    },
    {
      label: "DEFENSIBILITY HYPOTHESIS",
      heading: "Software can be reproduced.",
      body:
        "NexFrontier's potentially more durable asset is the intelligence it may accumulate about:\n\nwhich market changes matter\nwhich do not\nhow enterprises respond\nwhat different responses produce\nwhich changes carry economic consequence\nhow those relationships evolve over time\n\nIf NexFrontier can progressively learn which market changes matter, what enterprises should do about them and what those responses are economically worth, then that accumulated intelligence may become increasingly difficult to replicate.",
      evidence_state: "HYPOTHESIS",
      order: 8,
    },
    {
      label: "WHAT REMAINS TO BE PROVED",
      heading: "The product must demonstrate that it can:",
      body:
        "operate using evidence from real enterprise conditions\ndistinguish meaningful change from noise\nconnect market context with enterprise context\nproduce decision-useful interpretation\ntranslate that interpretation into economic consequence\nimprove through longitudinal evidence\nwork beyond one enterprise context",
      order: 9,
    },
    {
      label: "NEXT PROOF THRESHOLD",
      heading:
        "Foundation Customer environments need to test the progression:",
      body:
        "evidence → visibility → interpretation → leadership usefulness → economic consequence\n\nOnly after that progression is evidenced should NexFrontier make stronger product or category claims.",
      order: 10,
    },
    {
      label: "",
      heading: "The advantage is not speed.",
      body: "It is knowing how fast to adapt, and when.",
      order: 11,
    },
  ],
  related_links: [
    {
      label: "SEE HOW THE THESIS WILL BE PROVED →",
      href: "/investor-data-room/proof",
      primary: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGE 05: proof
// ---------------------------------------------------------------------------
const proofContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading: "The thesis matters only if the evidence progresses.",
      body:
        "NexFrontier deliberately distinguishes:\n\nASSUMPTION → HYPOTHESIS → EVIDENCE → CUSTOMER VALIDATION → PAID VALIDATION → REPEATABLE PROOF\n\nThese states are not interchangeable.\n\nA compelling thesis is not customer validation.\nCustomer interest is not paid validation.\nOne successful outcome is not repeatable proof.\n\nNexFrontier is currently a:\n\nPROOF-STAGE COMPANY\n\nThe company has developed its thesis, accumulated external market evidence, defined the product direction, built the Foundation Customer pathway and is progressing toward real-enterprise validation.",
      order: 1,
    },
    {
      label: "WHAT CAN BE SUPPORTED TODAY",
      heading: "THESIS",
      body:
        "A coherent proposition exists around:\n\nAI-mediated market change\nmarket-enterprise alignment\neconomic consequence\nthe need for Enterprise Navigational Intelligence",
      order: 2,
      children: [
        {
          heading: "EXTERNAL EVIDENCE",
          body:
            "There is external evidence that AI is changing important customer, competitive, platform and enterprise behaviours.\n\nThis supports investigation of the thesis.\n\nIt does not prove NexFrontier's customer economics.",
        },
        {
          heading: "PRODUCT BUILD",
          body:
            "NexFrontier is building the MVP/Beta required to test its hypotheses in real operating conditions.",
        },
        {
          heading: "PROOF ARCHITECTURE",
          body:
            "NexFrontier has defined a progression from market evidence through Foundation Customer validation, paid validation and repeatable proof.",
        },
        {
          heading: "FOUNDER COMMITMENT",
          body:
            "NexFrontier has been founder-funded to date.\n\nThat demonstrates founder commitment.\n\nIt does not substitute for customer validation.",
        },
      ],
    },
    {
      label: "WHAT NEXFRONTIER DOES NOT YET CLAIM",
      heading: "NexFrontier does not yet claim:",
      body:
        "Product-Market Fit\nrepeatable customer demand\nvalidated customer economics\npaid validation\nrepeatable value realisation\nvalidated category leadership\nscalable commercial repeatability\n\nThose claims must be earned through evidence.",
      order: 3,
    },
    {
      label: "THE FOUNDATION CUSTOMER ROLE",
      heading:
        "Foundation Customers are the next major proof environment.",
      body:
        "They are not being positioned as test subjects.\n\nAnd the proposition is not that they exist simply to help NexFrontier build software.\n\nThe intended relationship is reciprocal.\n\nFoundation Customers gain early access to emerging intelligence intended to help leadership understand how effectively the enterprise is keeping pace with a changing market and where economically meaningful opportunity may exist.\n\nNexFrontier gains the operating evidence required to determine whether its thesis is true.\n\nFoundation Customer work is intended to establish:\n\nwhether the problem exists materially inside the enterprise\nwhether NexFrontier can observe the relevant enterprise reality\nwhether changing market context can be meaningfully connected to it\nwhether leadership finds the resulting intelligence useful\nwhether a material Value Gap can be identified\nwhether that gap can be translated economically\nwhat action follows",
      order: 4,
    },
    {
      label: "THE FOUR PROOF QUESTIONS",
      display_treatment: "grid-2x2",
      order: 5,
      children: [
        {
          heading: "PRODUCT",
          body: "Can NexFrontier work in real enterprise conditions?",
        },
        {
          heading: "CUSTOMER",
          body: "Does the problem matter enough for leadership to act?",
        },
        {
          heading: "ECONOMICS",
          body:
            "Can NexFrontier identify and help create measurable economic value?",
        },
        {
          heading: "COMMERCIAL",
          body: "Will customers pay, and can that value repeat?",
        },
      ],
    },
    {
      label: "THE PROOF PATHWAY",
      display_treatment: "progression",
      order: 6,
      children: [
        { heading: "TODAY: EVIDENCE" },
        { heading: "NEXT: CUSTOMER VALIDATION" },
        { heading: "THEN: PAID VALIDATION" },
        { heading: "THEN: REPEATABLE PROOF" },
      ],
    },
    {
      body: "The evidence required at each stage becomes progressively stronger.",
      order: 7,
    },
    {
      label: "WHY THE DISTINCTIONS MATTER",
      heading:
        "One successful enterprise does not establish repeatability.",
      body:
        "Leadership enthusiasm does not establish willingness to pay.\nIdentified economic exposure does not establish realised value.\nRealised value does not automatically establish attribution.\nA paid customer does not automatically establish repeatable economics.\n\nThis is why NexFrontier separates each proof threshold.",
      order: 8,
    },
    {
      label: "NEXT PROOF THRESHOLD",
      heading: "The immediate threshold is: CUSTOMER VALIDATION",
      body:
        "The objective is to obtain enough evidence in real enterprise conditions to support, modify or reject the core product, customer and economic hypotheses.\n\nThe threshold after that is:\n\nPAID VALIDATION\n\nAt that point willingness to pay becomes evidence rather than assumption.\n\nOnly then does the question of repeatability become meaningful.",
      order: 9,
    },
    {
      label: "",
      heading: "Capital should buy proof, not activity.",
      body: "",
      order: 10,
    },
  ],
  related_links: [
    {
      label: "SEE WHAT THE NEXT CAPITAL IS INTENDED TO PROVE →",
      href: "/investor-data-room/round",
      primary: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGE 06: round
// ---------------------------------------------------------------------------
const roundContent = {
  sections: [
    {
      label: "CURRENT POSITION",
      heading: "Fund the proof. Earn the right to scale.",
      body:
        "NexFrontier has been founder-funded to date.\n\nExternal capital should not principally be used to scale an unproven company.\n\nThe next capital should principally be used to reduce the uncertainties that determine whether NexFrontier deserves to scale.\n\nThe governing principle is:\n\nProof first. Scale second.",
      order: 1,
    },
    {
      label: "WHAT THE CAPITAL IS INTENDED TO PROVE",
      display_treatment: "grid-2x2",
      order: 2,
      children: [
        {
          heading: "PRODUCT PROOF",
          body:
            "Demonstrate that Enterprise Navigational Intelligence can operate in real enterprise conditions and generate useful leadership intelligence.",
        },
        {
          heading: "CUSTOMER PROOF",
          body:
            "Demonstrate that the problem is sufficiently material that enterprise leadership acts on it.",
        },
        {
          heading: "ECONOMIC PROOF",
          body:
            "Demonstrate that market-enterprise misalignment can be translated into measurable economic consequence.",
        },
        {
          heading: "COMMERCIAL PROOF",
          body:
            "Demonstrate customer willingness to pay and establish the beginnings of repeatable economics.",
        },
      ],
    },
    {
      body: "Capital should progressively reduce these uncertainties.",
      order: 3,
    },
    {
      label: "WORKING YEAR 1 CAPITAL REQUIREMENT",
      display_treatment: "hypothesis-block",
      order: 4,
      body:
        "The current operating plan assumes approximately NZD 1.0M for the first year of the proof-stage plan.",
      children: [
        {
          heading: "WORKING OPERATING REQUIREMENT",
          body:
            "This is not final round size, final valuation, final financing structure, or a commitment to particular investment terms.\n\nThose remain subject to the final financing plan.",
        },
      ],
      evidence_state: "ASSUMPTION",
    },
    {
      label: "WHAT THE CAPITAL SUPPORTS",
      heading: "PRODUCT & ENGINEERING",
      body:
        "Build and operate the MVP/Beta capability required to test Enterprise Navigational Intelligence in real enterprise environments.",
      order: 5,
      children: [
        {
          heading: "FOUNDATION CUSTOMER DELIVERY",
          body:
            "Support the integration, implementation and evidence work required to run the Foundation Customer pathway properly.",
        },
        {
          heading: "ECONOMIC VALIDATION",
          body:
            "Develop and validate the economic translation required to connect market-enterprise alignment to measurable enterprise value.",
        },
        {
          heading: "LEAN GO-TO-MARKET",
          body:
            "Secure and support Foundation Customers and progression toward paid validation without prematurely constructing a scaled sales organisation.",
        },
        {
          heading: "CORE TEAM & OPERATIONS",
          body:
            "Fund the minimum capability required to execute the proof plan while preserving founder focus on product, customers, evidence and capital.",
        },
        {
          heading: "SECURITY, LEGAL & IP",
          body:
            "Fund the legal, intellectual-property, security and production requirements appropriate to an enterprise intelligence company.",
        },
        {
          heading: "CONTINGENCY",
          body: "Maintain appropriate operating resilience during the proof phase.",
        },
      ],
    },
    {
      label: "WHAT THE NEXT CAPITAL SHOULD BUY",
      heading:
        "At the end of the proof phase, investors should expect NexFrontier to have materially better answers to six questions.",
      display_treatment: "columns",
      order: 6,
      children: [
        { heading: "01", body: "Does the product work?" },
        { heading: "02", body: "Does leadership care?" },
        { heading: "03", body: "Is the economic consequence material?" },
        { heading: "04", body: "Can the value be measured credibly?" },
        { heading: "05", body: "Will customers pay?" },
        { heading: "06", body: "Does the result begin to repeat?" },
      ],
    },
    {
      body:
        "If the capital cannot materially improve those answers, it has not been allocated to the highest-value uncertainty.",
      order: 7,
    },
    {
      label: "CAPITAL AND PROOF PROGRESSION",
      display_treatment: "progression",
      order: 8,
      children: [
        { heading: "MVP" },
        { heading: "FOUNDATION CUSTOMER VALIDATION" },
        { heading: "PAID BETA" },
        { heading: "REPEATABILITY EVIDENCE" },
        { heading: "SCALABLE MARGIN PROOF" },
      ],
    },
    {
      body:
        "Each stage should justify the next level of capital.\n\nDo not imply NexFrontier has already reached later stages.",
      order: 9,
    },
    {
      label: "FOUNDER FUNDING",
      heading: "Founder funding matters because:",
      body:
        "the founding team has carried the thesis and company to the current proof stage before asking external investors to fund the next step.\n\nIt is evidence of commitment.\n\nIt is not evidence of customer demand.\n\nThe investment case must ultimately stand on:\n\nmarket evidence\ncustomer evidence\neconomic evidence\ncommercial evidence",
      order: 10,
    },
    {
      label: "WHAT POSITIVE PROOF CHANGES",
      display_treatment: "two-side",
      order: 11,
      children: [
        {
          heading: "FROM",
          body:
            "an emerging enterprise thesis\na hypothesised economic opportunity\na proof-stage company",
        },
        {
          heading: "TOWARD",
          body:
            "a validated enterprise requirement\nevidenced customer economic value\na company with a credible basis to scale a potentially new enterprise category",
        },
      ],
    },
    {
      body:
        "This progression represents the principal value inflection the next capital is intended to create.",
      order: 12,
    },
    {
      label: "WHAT NEGATIVE PROOF CHANGES",
      heading:
        "Disciplined proof must also be capable of showing that part of the thesis is wrong.",
      body:
        "If customer, economic or commercial evidence does not support the thesis, NexFrontier should learn that before committing substantially more capital to scale.\n\nThe purpose of proof is not to validate the founders.\n\nIt is to determine what is true.\n\nThat is part of the capital discipline.",
      order: 13,
    },
    {
      label: "",
      heading:
        "The current opportunity is to invest before the proof becomes obvious.",
      body: "And to use the next capital to determine whether it should.",
      order: 14,
    },
  ],
  related_links: [
    {
      label: "DISCUSS THE INVESTMENT CASE",
      href: "/market-enquiry?source=investor_data_room",
      primary: true,
    },
    {
      label: "RETURN TO INVESTMENT CASE →",
      href: "/investor-data-room/investment-case",
      primary: false,
    },
  ],
};

// ---------------------------------------------------------------------------
// All pages
// ---------------------------------------------------------------------------
const PAGES = [
  { slug: "investment-case", contentJson: investmentCaseContent },
  { slug: "market-evidence", contentJson: marketEvidenceContent },
  { slug: "economic-opportunity", contentJson: economicOpportunityContent },
  { slug: "product", contentJson: productContent },
  { slug: "proof", contentJson: proofContent },
  { slug: "round", contentJson: roundContent },
];

const CHANGE_NOTE = "Investor diligence content — draft";

// ---------------------------------------------------------------------------
// Save a single draft
// ---------------------------------------------------------------------------
async function saveDraft(slug, draftId, contentJson) {
  const body = {
    draftId,
    contentJson,
    changeNote: CHANGE_NOTE,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        apikey: ANON_KEY,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = responseText;
    }

    if (response.ok) {
      return { slug, success: true, status: response.status, data: parsed };
    } else {
      return { slug, success: false, status: response.status, error: parsed };
    }
  } catch (err) {
    return { slug, success: false, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("=== build-diligence-drafts ===");
  console.log(`Saving ${PAGES.length} drafts...\n`);

  const results = [];

  for (const page of PAGES) {
    const draftId = DRAFT_IDS[page.slug];
    console.log(`[${page.slug}] draftId=${draftId}`);
    console.log(
      `  sections: ${page.contentJson.sections.length}, related_links: ${page.contentJson.related_links.length}`
    );

    const result = await saveDraft(page.slug, draftId, page.contentJson);
    results.push(result);

    if (result.success) {
      console.log(`  ✅ SUCCESS (HTTP ${result.status})`);
    } else {
      console.log(`  ❌ FAILED (HTTP ${result.status || "n/a"})`);
      console.log(`     ${JSON.stringify(result.error)}`);
    }
    console.log();
  }

  // Summary
  console.log("=== SUMMARY ===");
  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  for (const r of results) {
    const status = r.success ? "✅" : "❌";
    const detail = r.success
      ? `HTTP ${r.status}`
      : `HTTP ${r.status || "n/a"} — ${JSON.stringify(r.error)}`;
    console.log(`  ${status} ${r.slug} — ${detail}`);
  }

  console.log(
    `\n${succeeded.length} succeeded, ${failed.length} failed out of ${PAGES.length} total.`
  );

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
