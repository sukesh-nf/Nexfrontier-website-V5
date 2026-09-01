export type Market = 'Global' | 'New Zealand' | 'Malaysia';
export type ArticleStatus = 'PUBLISHED' | 'PLANNED';

export interface Article {
  status: ArticleStatus;
  primaryQuestion: string;
  title: string;
  slug: string;
  author: string;
  publishedDate?: string;
  market: Market;
  topic: string;
  directAnswer: string;
  body: string[];
  nfInterpretation: string;
}

export const articles: Article[] = [
  {
    status: 'PUBLISHED',
    primaryQuestion: 'What is an AI-mediated market?',
    title: 'When the path to purchase starts somewhere else',
    slug: 'what-is-an-ai-mediated-market',
    author: 'NexFrontier',
    publishedDate: '18 Aug 2026',
    market: 'Global',
    topic: 'AI-Mediated Markets',
    directAnswer: 'An AI-mediated market is one where AI increasingly shapes how people discover needs, compare options, choose providers and decide what to do next.',
    body: ['The change is not simply that businesses are adding AI to internal workflows. It is that customer intent may arrive at the business through a new kind of intermediary.', 'That changes the questions a business must ask: what is being asked, what evidence is being used, and how does a response become a useful outcome?'],
    nfInterpretation: 'NexFrontier sees this as an emerging shift in how opportunity reaches the enterprise, not a settled category, but a market dynamic worth understanding early.',
  },
  {
    status: 'PUBLISHED',
    primaryQuestion: 'Why is internal AI adoption not enough?',
    title: 'AI inside the enterprise is only half the shift',
    slug: 'ai-inside-the-enterprise-is-only-half-the-shift',
    author: 'NexFrontier',
    publishedDate: '12 Aug 2026',
    market: 'Global',
    topic: 'AI Inside the Enterprise',
    directAnswer: 'Internal AI can make a business faster, but market-facing readiness asks whether the business can recognise and respond to intent as customer decisions change.',
    body: ['Productivity, automation and analysis matter. They are not the same as being discoverable, understandable and useful when an AI system is helping a customer decide.', 'The gap between those two conditions may become a source of opportunity, or a quiet source of value loss.'],
    nfInterpretation: 'Our thesis is that businesses need intelligence that connects changing market intent to enterprise response and learning.',
  },
  {
    status: 'PLANNED',
    primaryQuestion: 'How should businesses prepare for AI-mediated choice?',
    title: 'A practical question for leaders',
    slug: 'how-should-businesses-prepare',
    author: 'NexFrontier',
    market: 'Global',
    topic: 'Operational Readiness',
    directAnswer: 'Planned answer. NexFrontier is developing a clear, evidence-aware perspective on the organisational capabilities that may matter most.',
    body: [],
    nfInterpretation: '',
  },
  {
    status: 'PLANNED',
    primaryQuestion: 'What does AI-mediated choice mean in New Zealand?',
    title: 'A market perspective to come',
    slug: 'ai-mediated-choice-new-zealand',
    author: 'NexFrontier',
    market: 'New Zealand',
    topic: 'AI & Buying Behaviour',
    directAnswer: 'Planned answer. This question will bring a New Zealand market perspective to the wider shift.',
    body: [],
    nfInterpretation: '',
  },
];

export const topics = ['All topics', 'AI-Mediated Markets', 'AI & Buying Behaviour', 'Operational Readiness', 'Enterprise Value', 'Governance'];

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  location: string;
  linkedin: string;
  image?: string;
  hasVideoPlaceholder?: boolean;
  bio: string[];
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'sukesh-sukumaran',
    name: 'Sukesh Sukumaran',
    role: 'Founder & CEO',
    location: 'Auckland, New Zealand',
    linkedin: 'https://nz.linkedin.com/in/sukeshsukumaran',
    image: '/assets/images/sukesh-pic.png',
    hasVideoPlaceholder: true,
    bio: [
      'Sukesh Sukumaran is a business leader, strategist and venture builder whose career has centred on recognising change early and turning it into commercial opportunity.',
      'Across business growth, strategy, technology, education and economic development, he has worked with businesses and leaders navigating changing markets, building new capability and pursuing opportunities that did not yet have an obvious playbook.',
      'That experience led him to found NexFrontier around an emerging shift he believes will materially change how businesses compete: AI is no longer only changing how organisations work. It is increasingly changing the markets around them, including how customers discover, evaluate and choose, how competitors respond, and how opportunity forms.',
      'NexFrontier is being built for that shift.',
      'Sukesh brings to it experience growing and transforming businesses, developing new markets, building entrepreneurial ecosystems and connecting strategy with execution. His work has repeatedly involved bringing together people, commercial opportunity and emerging capability to create something that did not previously exist.',
      'He was recognised with the Business, Entrepreneurship & Innovation Changemaker Award at the Icons of Change Awards 2026 and is the author of the forthcoming Strategy Before Strategy, which explores a question increasingly relevant in the AI era: before deciding what to do, how do we make sense of what is changing and where value might emerge?',
      'For Sukesh, NexFrontier brings much of that experience together around a new market reality: helping enterprises understand change earlier, judge what matters economically, and navigate where value may move next.',
    ],
  },
  {
    slug: 'nela-muttettuwegama',
    name: 'Nela Muttettuwegama',
    role: 'Head, Systems & Intelligence',
    location: 'Christchurch, New Zealand',
    linkedin: 'https://nz.linkedin.com/in/nela-muttettuwegama',
    image: '/assets/images/nela_pic.jpeg',
    bio: [
      'Nela Muttettuwegama is a systems architect and AI builder whose career has spanned large-scale operations management, business development, and enterprise automation across Sri Lanka, Europe and New Zealand.',
      'Having directed complex operations, built multi-agent AI systems, and worked at the intersection of human decision-making and commercial outcomes, his work has consistently focused on one question: how do organisations translate intent into reliable results.',
      "At NexFrontier, he leads the development of the company's core technology and intelligence capabilities. His focus is on translating complex operational challenges into practical, scalable solutions that help organisations make better decisions, execute with greater confidence, and realise measurable business value.",
    ],
  },
  {
    slug: 'chris-stanley',
    name: 'Chris Stanley',
    role: 'Director, Commercial & Partnerships, Malaysia',
    location: 'Kuala Lumpur, Malaysia',
    linkedin: 'https://www.linkedin.com/in/cs-asia',
    image: '/assets/images/chris_pic.png',
    bio: [
      'Chris Stanley is a commercial strategist and operator whose career has focused on helping businesses unlock growth through customer experience, asset optimisation, and market expansion.',
      'Across retail, property, and destination development, he has worked at the intersection of commercial performance and customer engagement, helping organisations translate opportunity into sustainable business outcomes.',
      'Throughout that journey, he developed a deep appreciation for the realities of customer behaviour, operational execution, and the factors that determine whether growth initiatives succeed in practice.',
      'At NexFrontier, Chris leads commercial validation, strategic partnerships, and market development, helping organisations strengthen the operational foundations required to earn trust, capture demand, and grow in an increasingly AI-mediated economy.',
    ],
  },
];

export const valueDimensions = [
  { label: 'Defensive Value', detail: 'Protect what can be lost.' },
  { label: 'Offensive Value', detail: 'Create new value opportunities.' },
  { label: 'Revenue Health', detail: 'Strengthen top-line quality.' },
  { label: 'Customer Lifetime Value', detail: 'Increase retained value over time.' },
  { label: 'Enterprise Capability', detail: 'Build long-term operating advantage.' },
];
