/**
 * SAHIL BHATIA — AI PORTFOLIO & SYSTEMS
 * Data Architecture & Registry
 * Domain: SAHILBHATIA.COM | System: SAHIL / PORTFOLIO OS
 */

export const DEFAULT_SOCIAL_LINKS = {
  instagram: {
    url: "https://www.instagram.com/neutronverse.ai",
    label: "Instagram",
    handle: "@neutronverse.ai",
    visibility: "PUBLIC",
    sortOrder: 1,
  },
  linkedin: {
    url: "https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2",
    label: "LinkedIn",
    visibility: "PUBLIC",
    sortOrder: 2,
  },
  github: {
    url: "https://github.com/sahilbhatia7474-tech",
    label: "GitHub",
    visibility: "PUBLIC",
    sortOrder: 3,
  },
};

export const IDENTITY = {
  name: "SAHIL BHATIA",
  handle: "sahilbhatia7474",
  domain: "SAHILBHATIA.COM",
  systemName: "SAHIL / PORTFOLIO OS",
  version: "v2.6.4",
  status: "ONLINE // OPERATIONAL",
  heroStatement: "I build AI-powered digital experiences.",
  subStatement:
    "Merging frontline market reality, human psychology, and modern agentic engineering to architect high-impact digital systems.",
  positioning: [
    "AI Generalist",
    "AI Consultant",
    "AI-Native Builder",
    "Digital Systems Creator",
  ],
  coreThemes: [
    "AI + SYSTEMS",
    "VIBE CODING",
    "AUTOMATION",
    "PRODUCT",
    "UX",
    "CREATIVE AI",
    "AGENTIC WORKFLOWS",
    "DIGITAL PRODUCTS",
  ],
  bio: "From frontline ground-level sales to high-velocity AI system architecting. I design, prototype, and build end-to-end intelligent tools, agentic graphs, and digital products tailored for operational scale.",
  contactEmail: "sahilbhatia7474@gmail.com",
  socialLinks: DEFAULT_SOCIAL_LINKS,
};

export const CAPABILITY_MAP = [
  {
    category: "AI & Agentic Systems",
    color: "from-red-500/20 to-red-950/40",
    skills: [
      { name: "AI & Generative AI", level: "Core", notes: "LLM integration, system prompting, multimodal reasoning" },
      { name: "Prompt Engineering", level: "Expert", notes: "Few-shot schemas, structured JSON output, guardrails" },
      { name: "AI Agents & Systems", level: "Core", notes: "Autonomous agent cycles, state loops, tool orchestration" },
      { name: "RAG (Retrieval-Augmented Generation)", level: "Proficient", notes: "Vector context injection, chunking architectures" },
      { name: "MCP (Model Context Protocol)", level: "Active Focus", notes: "Standardized tools & data connectors integration" },
      { name: "AI Productivity", level: "Core", notes: "High-leverage development stacks and synthetic workflow acceleration" },
    ],
  },
  {
    category: "Automation & Velocity Building",
    color: "from-amber-500/20 to-neutral-900/40",
    skills: [
      { name: "Vibe Coding", level: "High Velocity", notes: "Iterative conversational code generation & rapid refactoring" },
      { name: "n8n / Workflow Automation", level: "Proficient", notes: "Event-driven webhook routing, multi-step orchestration" },
      { name: "No-Code / AI-assisted Building", level: "Core", notes: "Cursor, Lovable, Claude Code, AI Studio prototyping" },
      { name: "Automation Pipelines", level: "Core", notes: "Repetitive task elimination & automated data sync" },
      { name: "Data Analysis", level: "Proficient", notes: "Conversion tracking, sales funnel metrics, operational audits" },
    ],
  },
  {
    category: "Product & Experience Architecture",
    color: "from-neutral-600/20 to-neutral-900/40",
    skills: [
      { name: "Product Building", level: "Core", notes: "0-to-1 prototype deployment, product requirement definition" },
      { name: "UX / Digital Experiences", level: "Core", notes: "Spatial clarity, responsive micro-interactions, dark UI design" },
      { name: "Creative AI", level: "Proficient", notes: "Synthetic media, dynamic generative content, UI aesthetic direction" },
      { name: "Digital Products", level: "Core", notes: "Link hubs, booking engines, web portals, app distributions" },
    ],
  },
  {
    category: "Commercial Reality & Execution",
    color: "from-red-900/20 to-neutral-950/40",
    skills: [
      { name: "Business Problem Solving", level: "Field-Tested", notes: "Identifying genuine business bottlenecks before applying code" },
      { name: "Sales / Client Acquisition", level: "Field-Tested", notes: "Direct field pitching, consultative closing, objection handling" },
      { name: "CRM / Relationship Management", level: "Experienced", notes: "Pipeline tracking, client onboarding, long-term retention" },
    ],
  },
];

export const CURATED_PROJECTS = [
  {
    id: "01",
    slug: "neutracap",
    title: "NeutraCap",
    subtitle: "Industrial Capacitors",
    status: "BUILT",
    category: "Industrial Hardware & Digital Showcase",
    year: "2025",
    summary:
      "A high-precision digital product catalog and technical specification showcase designed for heavy-duty industrial capacitor engineering.",
    description:
      "Engineered to replace cumbersome static industrial PDF datasheets with a modern interactive digital spec platform. Features real-time parameter filtering (dielectric rating, capacitance tolerance, temperature class), interactive exploded component views, and automated client quotation dispatch.",
    architecture: [
      "Dynamic spec comparison matrix with multi-parameter filter engine",
      "High-contrast dark industrial aesthetic with zero visual clutter",
      "Instant RFQ (Request For Quote) pipeline with automated email/CRM dispatch",
      "Responsive layout optimized for procurement engineers on tablet and mobile",
    ],
    techStack: ["React", "Tailwind CSS", "Framer Motion", "Vite", "Node.js"],
    highlights: [
      "Direct technical spec navigation",
      "Zero-latency client quote routing",
      "Industrial compliance documentation viewer",
    ],
  },
  {
    id: "02",
    slug: "lyra-v2",
    title: "LYRA V2",
    subtitle: "Strategic Architect / Execution Graph",
    status: "BUILT",
    category: "AI Systems & Directed Acyclic Graphs",
    year: "2025",
    summary:
      "An intelligent execution graph engine that decomposes complex strategic objectives into verifiable, dependency-ordered agent tasks.",
    description:
      "LYRA V2 acts as a strategic co-architect for complex projects. Rather than relying on simple linear prompt chains, LYRA constructs directed acyclic graphs (DAG) where parent nodes validate sub-agent deliverables, track context drift, and dynamically heal failing execution branches.",
    architecture: [
      "Directed Acyclic Graph (DAG) task engine with topological sorting",
      "Stateful context manager preventing hallucination across multi-step flows",
      "Branch failure recovery protocol with automated retry and fallback triggers",
      "Interactive graph visualizer showing real-time agent execution states",
    ],
    techStack: ["React", "TypeScript", "Graph Layout Engines", "LLM Function Calling", "Tailwind CSS"],
    highlights: [
      "Dependency-aware agent task execution",
      "Interactive node inspection & graph replay",
      "Dynamic goal decomposition engine",
    ],
  },
  {
    id: "03",
    slug: "sahil-ai-os",
    title: "Sahil AI OS",
    subtitle: "AI Systems / Agentic Architecture",
    status: "BUILT",
    category: "Personal Operating Framework",
    year: "2026",
    summary:
      "A personalized agentic operating layer unifying knowledge retrieval, daily prioritization, automated research, and multi-model dispatch.",
    description:
      "Sahil AI OS represents the core infrastructure behind my day-to-day building velocity. It bridges local project repositories, real-time web research, prompt libraries, and automated client triage into a unified terminal and web interface.",
    architecture: [
      "Multi-model routing gateway selecting the optimal LLM per task cost/latency",
      "Local vector cache for instantaneous indexing of notes and project artifacts",
      "Keyboard-first command palette with instant action shortcuts",
      "Modular plugin architecture for external tool hooks and webhook listening",
    ],
    techStack: ["React", "Node.js", "Vector DB", "Tailwind CSS", "WebSockets"],
    highlights: [
      "Unified operational cockpit",
      "Model routing layer (Flash vs Pro vs Reasoning)",
      "Instant scratchpad to execution graph exporter",
    ],
  },
  {
    id: "04",
    slug: "dental-care",
    title: "Dental Care",
    subtitle: "Modern Dentistry Experience",
    status: "BUILT",
    category: "Healthcare Digital Experience",
    year: "2025",
    summary:
      "A patient-centric clinical platform combining intelligent appointment scheduling, treatment visualizers, and digital consent flows.",
    description:
      "Designed to overcome high patient anxiety and clunky medical booking. Provides clean visual explanations of orthodontic and dental procedures, friction-free slot booking with calendar sync, and interactive post-op care instructions.",
    architecture: [
      "Interactive treatment roadmaps with visual procedural breakdowns",
      "Real-time slot reservation system with automated reminder triggers",
      "Mobile-first patient intake flow reducing on-site waiting room time",
      "HIPAA-conscious client data handling and secure doctor note storage",
    ],
    techStack: ["React", "Tailwind CSS", "Calendar Integration", "Framer Motion", "Vite"],
    highlights: [
      "Reduced patient booking friction",
      "Interactive procedure guides",
      "Zero clutter healthcare typography",
    ],
  },
  {
    id: "05",
    slug: "linkbio",
    title: "LinkBio",
    subtitle: "Personal Link Hub / Link-in-Bio Builder",
    status: "BUILT",
    category: "Creator Utility & Digital Identity",
    year: "2025",
    summary:
      "A consolidated, ultra-fast link hub and micro-landing page engine for creators, professionals, and brands. (Single consolidated build).",
    description:
      "Built as a lightweight, privacy-focused alternative to generic link-in-bio services. Consolidates multiple experimental iterations into one cohesive builder with zero tracker bloat, custom theming, link telemetry, and dynamic QR generation.",
    architecture: [
      "Single-bundle sub-100ms cold start performance",
      "Live preview theme engine with customizable typography and colorways",
      "Client-side analytics tracking click events without intrusive third-party cookies",
      "VCard and direct contact exchange integration",
    ],
    techStack: ["React", "Tailwind CSS", "Vite", "Web Storage API", "Lucide Icons"],
    highlights: [
      "Consolidated single-build architecture",
      "Instant loading speed (<100ms)",
      "Adaptive dark/light canvas rendering",
    ],
  },
  {
    id: "06",
    slug: "showtime-cinema-booking",
    title: "ShowTime Cinema Booking",
    subtitle: "Cinema Booking Experience",
    status: "BUILT",
    category: "Entertainment & Transaction Flow",
    year: "2025",
    summary:
      "An immersive cinematic ticket reservation system with interactive auditorium seat mapping, concession bundling, and dynamic tier pricing.",
    description:
      "Re-architects the digital cinema booking experience. Provides interactive SVG-based auditorium seat selection with real-time seat locks, movie trailer overlays, and checkout flows.",
    architecture: [
      "Interactive SVG auditorium grid with real-time seat lock state management",
      "Concession combo upsell module with live order total recalculation",
      "Cinematic dark interface inspired by theatrical projection lighting",
      "Mobile-optimized touch selection with haptic feedback simulation",
    ],
    techStack: ["React", "SVG Canvas", "Tailwind CSS", "Framer Motion", "Vite"],
    highlights: [
      "Spatial auditorium seat mapping",
      "Seamless multi-tier ticket selection",
      "Low-friction checkout funnel",
    ],
  },
  {
    id: "07",
    slug: "sahil-ai-consultancy-os",
    title: "Sahil AI Consultancy OS",
    subtitle: "AI Consultancy / Business Systems",
    status: "IN PROGRESS",
    category: "Enterprise Advisory & Operating System",
    year: "2026",
    summary:
      "A complete operational system for scoping, diagnosing, and deploying AI solutions across traditional small-to-medium enterprise workflows.",
    description:
      "Developed to formalize the transition from technical exploration to business consulting. Includes proprietary AI Readiness Assessment questionnaires, workflow automation calculators, and bespoke deployment roadmaps.",
    architecture: [
      "Automated Business Bottleneck Assessment scoring matrix",
      "ROI calculator comparing manual labor hours vs agentic automation cost",
      "Modular client portal with phased milestone tracking and artifact delivery",
      "SLA and prompt governance guideline templates for enterprise compliance",
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Workflow Engine", "Node.js"],
    highlights: [
      "Evidence-based AI readiness scoring",
      "Automated consultation pipeline",
      "Operational playbook repository",
    ],
  },
];

export const AI_SYSTEMS = [
  {
    code: "SYS-01",
    name: "SAHIL AI OS",
    badge: "CORE AGENTIC OS",
    status: "OPERATIONAL",
    tagline: "Autonomous Agentic Layer & Knowledge Synthesis",
    overview:
      "An interconnected personal runtime that coordinates generative models, vector memories, external tool APIs, and local code environments.",
    layers: [
      {
        title: "Perception & Ingestion",
        desc: "Captures web streams, project commits, chat notes, and document inputs through structured parsers.",
      },
      {
        title: "Cognitive Dispatch",
        desc: "Routes queries dynamically between fast reasoning models, multimodal vision parsers, and deep synthesis pipelines.",
      },
      {
        title: "Tool & Execution Engine",
        desc: "Executes code snippets, invokes external webhooks, runs filesystem operations, and commits updates.",
      },
      {
        title: "Memory Persistence",
        desc: "Maintains rolling context windows, persistent project embeddings, and retrieval indexes.",
      },
    ],
    specs: {
      latency: "<180ms routing",
      models: "Gemini 2.5 / Claude 3.7 / Local Embeddings",
      topology: "Decentralized Modular Mesh",
      interface: "Command Terminal + Web Canvas",
    },
  },
  {
    code: "SYS-02",
    name: "LYRA V2",
    badge: "STRATEGIC ARCHITECT",
    status: "OPERATIONAL",
    tagline: "Directed Acyclic Execution Graph Engine",
    overview:
      "Transforms unstructured goals into formal dependency graphs with autonomous node execution, automated peer verification, and self-healing logic.",
    layers: [
      {
        title: "Goal Decomposition",
        desc: "Breaks macro requirements into atomic sub-tasks with well-defined input/output contracts.",
      },
      {
        title: "Topological Scheduler",
        desc: "Parallelizes independent nodes while enforcing strict execution sequences for dependent workflows.",
      },
      {
        title: "Validation Gatekeepers",
        desc: "Automated sanity checks, schema validations, and regression safeguards prior to passing artifacts downstream.",
      },
      {
        title: "Self-Healing Loop",
        desc: "Detects runtime tool exceptions, analyzes failure context, and branches fallback alternatives autonomously.",
      },
    ],
    specs: {
      graphModel: "Directed Acyclic Graph (DAG)",
      stateCheck: "Node-level SHA-256 verification",
      resilience: "Triple-branch fallback arbitration",
      visualization: "Dynamic node-edge canvas layout",
    },
  },
  {
    code: "SYS-03",
    name: "AI CONSULTANCY OS",
    badge: "BUSINESS SYSTEM",
    status: "ACTIVE PILOT",
    tagline: "Commercial Diagnosis & Deployment Architecture",
    overview:
      "A structured methodology and software toolkit designed to audit business workflows, identify high-ROI automation targets, and manage client deployments.",
    layers: [
      {
        title: "Readiness Diagnostic",
        desc: "Evaluates company data hygiene, process repeatability, and technical infrastructure readiness.",
      },
      {
        title: "Automation Matrix",
        desc: "Prioritizes opportunities along the Impact vs Complexity matrix to guarantee quick wins and sustainable ROI.",
      },
      {
        title: "Deployment Framework",
        desc: "Standardized scaffolding for deploying n8n nodes, custom LLM assistants, and CRM automation pipelines.",
      },
      {
        title: "Client Control Cockpit",
        desc: "Transparent client-facing dashboards displaying system uptime, task logs, and operational cost savings.",
      },
    ],
    specs: {
      methodology: "Field Sales Insight + Agent Engineering",
      deliverables: "Architecture Blueprints + Production Flows",
      focusSectors: "SME Operations, Sales Automation, Logistics",
      targetImpact: "50-70% reduction in manual overhead",
    },
  },
];

export const PROFESSIONAL_JOURNEY = [
  {
    id: "j-1",
    phase: "PHASE 01 — FIELD SALES & GROUND TRUTH",
    role: "Field Sales Executive",
    company: "Paytm",
    period: "Jul 2024 – Mar 2025",
    location: "On-Ground / Delhi NCR",
    status: "VERIFIED",
    verified: true,
    keyThemes: ["Direct Merchant Pitching", "QR & Soundbox Adoption", "Field Problem Solving", "Objection Handling"],
    description:
      "Direct on-ground commercial engagement. Onboarded retail merchants, negotiated technology adoption in fast-paced market environments, and understood genuine daily friction points of small business owners.",
    takeaways: "Learned that technology succeeds only when it solves a painful daily problem with zero unnecessary complexity.",
  },
  {
    id: "j-2",
    phase: "PHASE 02 — ENTERPRISE CONNECTIVITY & CONSULTATIVE CLOSING",
    role: "BDE / Xstream Fiber Expert",
    company: "Airtel Broadband",
    period: "Mar 2025 – Dec 2025",
    location: "Delhi NCR",
    status: "VERIFIED",
    verified: true,
    keyThemes: ["High-Speed Fiber Infrastructure", "Consultative Selling", "Customer Retention", "Pipeline Building"],
    description:
      "Drove broadband and high-tier fiber customer acquisition. Handled technical requirement queries, analyzed user bandwidth demands, and structured competitive conversion proposals.",
    takeaways: "Mastered the balance of technical product knowledge and relationship-driven closing.",
  },
  {
    id: "j-3",
    phase: "PHASE 03 — EXPEDITED EXPANSION & COMMERCIAL AGILITY",
    role: "Field Sales Executive",
    company: "Excitel Broadband",
    period: "Jan 2026 – Jun 2026",
    location: "Regional Territories",
    status: "VERIFIED",
    verified: true,
    keyThemes: ["Territory Conquest", "Aggressive Competitor Replacement", "High-Volume Execution", "Client Trust"],
    description:
      "Spearheaded targeted residential and commercial broadband deployments. Optimized route planning, executed door-to-door discovery, and accelerated turnaround from lead to live installation.",
    takeaways: "Refined rapid territory mapping and tactical sales agility in hyper-competitive markets.",
  },
  {
    id: "j-4",
    phase: "PENDING VERIFICATION — RECORD AUDIT",
    role: "Field Operations Associate",
    company: "PhonePe",
    period: "Timeline Under Verification",
    location: "To be confirmed",
    status: "VERIFY BEFORE PUBLISHING",
    verified: false,
    keyThemes: ["Timeline Audit", "Record Re-examination", "Strict Data Honesty"],
    description:
      "Secondary source records mention field operational experience with PhonePe. However, the documented timeline presents conflicts with primary verified records. In strict accordance with our Project Honesty Rule, this entry remains unconfirmed until final audit.",
    takeaways: "Uncompromised transparency: we never publish unverified claims.",
  },
  {
    id: "j-5",
    phase: "PHASE 04 — THE TRANSFORMATION TO AI SYSTEMS",
    role: "AI Generalist & Systems Builder",
    company: "Independent Practice / Sahil Systems",
    period: "2025 – Present",
    location: "Global / Remote",
    status: "ACTIVE PRACTICE",
    verified: true,
    keyThemes: ["Agentic Workflows", "Vibe Coding", "AI Consultancy", "Digital Product Engineering"],
    description:
      "Synthesizing field sales empathy with cutting-edge generative AI, n8n automations, and agentic operating systems. Building production-grade digital tools that actually bridge business problems with autonomous AI execution.",
    takeaways: "The future belongs to builders who know both code and the market's commercial realities.",
  },
];

export const DEFAULT_CERTIFICATES = [
  {
    id: "cert-be10x-01",
    title: "AI Tools Workshop — be10x",
    provider: "be10x",
    credentialType: "Certificate of Completion",
    issueDate: "June 21, 2026",
    recipient: "Sahil Bhatia",
    credentialId: "0270772f-3809-4400-b29b-1e1c61cd09971465833",
    url: "https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd09971465833",
    topics: [
      "AI Tools",
      "ChatGPT",
      "AI Productivity",
      "Presentation creation",
      "AI data analysis",
      "Coding and debugging assistance"
    ],
    verified: true,
    status: "VERIFIED",
  }
];

export const PROOF_MATRIX = [
  {
    id: "prf-cert-01",
    title: "AI Tools Workshop — be10x",
    category: "Certifications",
    date: "June 21, 2026",
    status: "VERIFIED",
    evidence: "Certificate of Completion issued to Sahil Bhatia (Credential ID: 0270772f-3809-4400-b29b-1e1c61cd09971465833). Verified coverage: AI Tools, ChatGPT, AI Productivity, presentation creation, AI data analysis, coding and debugging.",
    linkText: "VERIFY CREDENTIAL →",
    target: "proof",
    url: "https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd09971465833",
    provider: "be10x",
    credentialId: "0270772f-3809-4400-b29b-1e1c61cd09971465833",
    recipient: "Sahil Bhatia",
    topics: [
      "AI Tools",
      "ChatGPT",
      "AI Productivity",
      "Presentation creation",
      "AI data analysis",
      "Coding & Debugging"
    ],
  },
  {
    id: "prf-01",
    title: "NeutraCap Interactive Platform",
    category: "Projects",
    date: "2025",
    status: "BUILT",
    evidence: "Complete interactive production app with spec matrix & RFQ system.",
    linkText: "View Project Specs",
    target: "neutracap",
  },
  {
    id: "prf-02",
    title: "LYRA V2 Execution Graph Engine",
    category: "Projects",
    date: "2025",
    status: "BUILT",
    evidence: "Directed acyclic task orchestrator code & node execution states.",
    linkText: "Inspect Architecture",
    target: "lyra-v2",
  },
  {
    id: "prf-03",
    title: "Sahil AI OS Personal Framework",
    category: "Projects",
    date: "2026",
    status: "BUILT",
    evidence: "Multi-model routing gateway & personal agentic workspace.",
    linkText: "Review Blueprint",
    target: "sahil-ai-os",
  },
  {
    id: "prf-04",
    title: "LinkBio Consolidated Hub",
    category: "Projects",
    date: "2025",
    status: "BUILT",
    evidence: "Unified lightweight profile hub codebase replacing fragmented variants.",
    linkText: "Inspect Build",
    target: "linkbio",
  },
  {
    id: "prf-05",
    title: "Paytm Field Merchant Onboarding Track Record",
    category: "Case-study evidence",
    date: "Jul 2024 – Mar 2025",
    status: "VERIFIED",
    evidence: "Frontline field sales performance, merchant device installations & QR activations.",
    linkText: "Journey Details",
    target: "journey",
  },
  {
    id: "prf-06",
    title: "Airtel Xstream Fiber Deployment Execution",
    category: "Case-study evidence",
    date: "Mar 2025 – Dec 2025",
    status: "VERIFIED",
    evidence: "High-tier fiber customer acquisition metrics & territory penetration.",
    linkText: "Journey Details",
    target: "journey",
  },
  {
    id: "prf-07",
    title: "Excitel Commercial Territory Expansion",
    category: "Case-study evidence",
    date: "Jan 2026 – Jun 2026",
    status: "VERIFIED",
    evidence: "Targeted territory acquisition and competitor displacement campaigns.",
    linkText: "Journey Details",
    target: "journey",
  },
  {
    id: "prf-08",
    title: "n8n Autonomous Webhook Orchestration",
    category: "Experiments",
    date: "2025",
    status: "EXPERIMENT",
    evidence: "Self-hosted event-driven workflows synchronizing CRM and AI summarization.",
    linkText: "Workflow Graph",
    target: "ai-systems",
  },
  {
    id: "prf-09",
    title: "Agentic Model Context Protocol (MCP) Integration",
    category: "Experiments",
    date: "2026",
    status: "IN PROGRESS",
    evidence: "Exploring standardized local tool discovery and client data pipeline connectors.",
    linkText: "Active R&D",
    target: "ai-systems",
  },
  {
    id: "prf-10",
    title: "AI Consultancy OS Diagnostic Toolkit",
    category: "Case-study evidence",
    date: "2026",
    status: "IN PROGRESS",
    evidence: "Standard operating procedures and readiness scoring matrices for SME clients.",
    linkText: "Consultancy OS",
    target: "sahil-ai-consultancy-os",
  },
  {
    id: "prf-11",
    title: "PhonePe Historical Role Verification",
    category: "Repositories",
    date: "Pending",
    status: "VERIFY",
    evidence: "Timeline reconciliation audit underway to ensure exact resume compliance.",
    linkText: "Audit Status",
    target: "journey",
  },
];

export const FUTURE_VAULT = [
  {
    id: "v-01",
    stream: "IN DEVELOPMENT",
    type: "Autonomous Agent",
    title: "Autonomous Lead Enrichment Agent",
    dateAdded: "2026-03",
    status: "IN DEVELOPMENT",
    tags: ["Agentic Script", "Web Extraction", "CRM Pipe"],
    signals: ["Autonomous enrichment", "Deterministic rate limiting", "Schema mapping"],
    description: "An agentic automation script that ingests target enterprise URLs, extracts verified decision-maker coordinates, and generates personalized commercial outreach briefs.",
    evidence: "Early script prototype running in staging n8n worker environment.",
  },
  {
    id: "v-02",
    stream: "RESEARCH",
    type: "Methodology Whitepaper",
    title: "Field Sales to AI Systems: Human Psychology in Autonomous Interfaces",
    dateAdded: "2026-02",
    status: "CONCEPT",
    tags: ["Methodology", "Psychology", "Enterprise UX"],
    signals: ["Frontline merchant trust", "Cognitive load reduction", "High-conversion flows"],
    description: "Codifying how frontline merchant onboarding empathy and territory conquest dynamics transform software interface design, user onboarding retention, and autonomous AI system trust.",
    evidence: "Outlined drafting notes and synthesis of 500+ merchant field conversations.",
  },
  {
    id: "v-03",
    stream: "CURRENT SIGNALS",
    type: "Evaluation Benchmark",
    title: "Structured JSON Reliability Across Long Reasoning Chains",
    dateAdded: "2026-01",
    status: "EXPERIMENT",
    tags: ["Evaluation", "Structured Output", "Prompt Architecture"],
    signals: ["Zod schema compliance", "Hallucination mitigation", "Agentic recovery loops"],
    description: "Systematic evaluation testbeds measuring schema adherence, tool-calling determinism, and multi-turn context degradation across modern reasoning LLMs.",
    evidence: "Automated test harness checking strict schema fidelity across 100+ prompt variations.",
  },
  {
    id: "v-04",
    stream: "EXPERIMENTS",
    type: "Audio Prototype",
    title: "Sub-Second Latency Local Offline Task Dictation",
    dateAdded: "2026-01",
    status: "EXPERIMENT",
    tags: ["Local Whisper", "Edge AI", "Low Latency"],
    signals: ["Sub-200ms transcription", "Offline privacy", "Continuous background buffer"],
    description: "Evaluating quantized local speech-to-text models for instantaneous, zero-cloud private thought capture and instant DAG task dispatch.",
    evidence: "Benchmarked on Apple Silicon and local inference runtimes.",
  },
  {
    id: "v-05",
    stream: "NEXT PRODUCTS",
    type: "AI Developer Tool",
    title: "Lyra Architect Visual Graph Studio",
    dateAdded: "2026-03",
    status: "IN DEVELOPMENT",
    tags: ["Visual DAG", "Multi-Agent Canvas", "Fault-Tolerant"],
    signals: ["Graph validation", "Visual branching", "Export to LangGraph"],
    description: "A specialized visual IDE for architecting, inspecting, and replaying complex multi-agent execution graphs with topological cycle detection and runtime state inspection.",
    evidence: "Core node execution graph engine implemented in LYRA V2.",
  },
  {
    id: "v-06",
    stream: "ARCHIVED",
    type: "Design System",
    title: "Sahil UI Foundation v1 (Spatial HUD Primitives)",
    dateAdded: "2025-11",
    status: "BUILT",
    tags: ["React 18", "Tailwind", "Spatial Primitives"],
    signals: ["Tactile response", "Dark canvas typography", "Micro-interactions"],
    description: "Curated collection of high-contrast, graphite-and-red micro-components and spatial card physics prototypes that formed the foundation of Portfolio OS v2.",
    evidence: "Integrated into current portfolio runtime and component registry.",
  },
];

export const APPS_HUB = [
  {
    id: "app-1",
    name: "Sahil AI OS Companion",
    version: "v1.4.2",
    tagline: "Mobile & Desktop Agentic Cockpit",
    category: "System Utility",
    status: "ACTIVE DOWNLOAD READY",
    platforms: ["Web App", "Android APK (Direct)", "PWA"],
    description:
      "Direct gateway to your personal AI OS. Access quick voice capture, run task graph diagnostics, and trigger remote n8n automations on the go.",
    fileSize: "14.2 MB",
    downloadUrl: "#download-sahil-ai-os",
    changelog: "Added low-latency streaming audio notes and offline queueing.",
    features: [
      "Sub-200ms scratchpad capture",
      "One-tap task graph dispatch",
      "Direct local vector search",
      "End-to-end device encryption",
    ],
  },
  {
    id: "app-2",
    name: "LinkBio Pro Builder",
    version: "v2.1.0",
    tagline: "Instant Micro-Landing & Link Hub",
    category: "Creator App",
    status: "DIRECT DOWNLOAD READY",
    platforms: ["Web Application", "Self-Hosted Package"],
    description:
      "A fast, distraction-free link aggregator and personal profile engine. Create, preview, and deploy customized single-link portfolios in seconds.",
    fileSize: "4.8 MB",
    downloadUrl: "#download-linkbio",
    changelog: "Merged multiple experimental branches into unified high-speed build.",
    features: [
      "Zero tracker analytics",
      "Dynamic QR code generator",
      "Custom dark/light spatial themes",
      "VCard export support",
    ],
  },
  {
    id: "app-3",
    name: "Lyra Architect Engine",
    version: "v0.9.5-beta",
    tagline: "Visual DAG Task Planner",
    category: "AI Developer Tool",
    status: "PRIVATE BETA / REQUEST ACCESS",
    platforms: ["Web Studio", "CLI Runner"],
    description:
      "Developer environment for designing, inspecting, and replaying complex multi-agent execution graphs with topological validation.",
    fileSize: "28.5 MB",
    downloadUrl: "#download-lyra",
    changelog: "Implemented self-healing node error fallback branch editor.",
    features: [
      "Interactive SVG canvas nodes",
      "JSON schema input/output validator",
      "Replay and step debugger",
      "Export to LangChain/LangGraph",
    ],
  },
];
