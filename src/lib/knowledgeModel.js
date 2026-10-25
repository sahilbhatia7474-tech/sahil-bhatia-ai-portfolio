import {
  IDENTITY as DEFAULT_IDENTITY,
  CAPABILITY_MAP,
  CURATED_PROJECTS as DEFAULT_PROJECTS,
  AI_SYSTEMS as DEFAULT_AI_SYSTEMS,
  PROFESSIONAL_JOURNEY as DEFAULT_JOURNEY,
  PROOF_MATRIX as DEFAULT_PROOF,
  FUTURE_VAULT,
  APPS_HUB as DEFAULT_APPS,
  DEFAULT_CERTIFICATES,
} from '../data/portfolioData';
import { getProjectPublicLinks } from './projectLinks';

/**
 * Builds a unified, searchable Knowledge Model from live or fallback portfolio data.
 * Purely grounded in published portfolio facts; zero hallucination.
 */
export function buildKnowledgeIndex(data = {}) {
  const identity = data.identity || DEFAULT_IDENTITY;
  const projects = data.projects && data.projects.length > 0 ? data.projects : DEFAULT_PROJECTS;
  const aiSystems = data.aiSystems && data.aiSystems.length > 0 ? data.aiSystems : DEFAULT_AI_SYSTEMS;
  const journey = data.journey && data.journey.length > 0 ? data.journey : DEFAULT_JOURNEY;
  const proofItems = data.proofItems && data.proofItems.length > 0 ? data.proofItems : DEFAULT_PROOF;
  const certificates = data.certificates && data.certificates.length > 0 ? data.certificates : DEFAULT_CERTIFICATES;
  const apps = data.apps && data.apps.length > 0 ? data.apps : DEFAULT_APPS;

  const items = [];

  // 1. Identity & Core Positioning
  items.push({
    id: 'identity-core',
    type: 'IDENTITY',
    categoryLabel: 'Identity & Vision',
    title: identity.name || 'SAHIL BHATIA',
    subtitle: (identity.positioning || []).join(' • ') || 'AI Generalist & Systems Builder',
    description: identity.heroStatement || identity.bio || 'AI Generalist, AI Consultant & Digital Systems Creator.',
    destination: '#hero',
    targetSection: 'hero',
    tags: ['sahil', 'bhatia', 'founder', 'about', 'bio', 'identity', 'vision', ...(identity.coreThemes || [])],
    badge: 'OPERATIONAL',
  });

  // 2. Capabilities & Skills
  CAPABILITY_MAP.forEach((cluster) => {
    items.push({
      id: `cluster-${cluster.category.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'SKILL CLUSTER',
      categoryLabel: 'Capability Cluster',
      title: cluster.category,
      subtitle: `${cluster.skills.length} Verifiable Competencies`,
      description: cluster.skills.map((s) => s.name).join(', '),
      destination: '#capabilities',
      targetSection: 'capabilities',
      tags: ['skills', 'capabilities', cluster.category.toLowerCase(), ...cluster.skills.map((s) => s.name.toLowerCase())],
      badge: 'GROUNDED',
    });

    cluster.skills.forEach((skill) => {
      items.push({
        id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        type: 'SKILL',
        categoryLabel: 'Skill / Competency',
        title: skill.name,
        subtitle: `${cluster.category} — ${skill.level}`,
        description: skill.notes || `${skill.level} competency in ${skill.name}`,
        destination: '#capabilities',
        targetSection: 'capabilities',
        tags: [skill.name.toLowerCase(), skill.level.toLowerCase(), 'skill', cluster.category.toLowerCase()],
        badge: skill.level.toUpperCase(),
      });
    });
  });

  // 3. Curated Projects
  projects.forEach((proj) => {
    const publicLinks = getProjectPublicLinks(proj);
    items.push({
      id: `project-${proj.id || proj.slug}`,
      type: 'PROJECT',
      categoryLabel: 'Curated Project',
      title: proj.title,
      subtitle: proj.subtitle || proj.category || 'Production Project',
      description: proj.summary || proj.description || '',
      destination: '#projects',
      targetSection: 'projects',
      projectData: proj,
      publicLinks,
      tags: [
        'project',
        proj.title.toLowerCase(),
        (proj.slug || '').toLowerCase(),
        ...(proj.techStack || []).map((t) => t.toLowerCase()),
        (proj.category || '').toLowerCase(),
      ],
      badge: (proj.status || 'BUILT').toUpperCase(),
      year: proj.year || '2025',
    });
  });

  // 4. AI Systems Architecture
  aiSystems.forEach((sys) => {
    items.push({
      id: `system-${sys.code.toLowerCase()}`,
      type: 'AI SYSTEM',
      categoryLabel: 'AI Systems Architecture',
      title: `${sys.code}: ${sys.name}`,
      subtitle: sys.badge || 'Agentic Architecture',
      description: sys.tagline || sys.overview || '',
      destination: '#ai-systems',
      targetSection: 'ai-systems',
      systemCode: sys.code,
      tags: [
        'ai system',
        'system',
        sys.code.toLowerCase(),
        sys.name.toLowerCase(),
        'agentic',
        'dag',
        'execution graph',
        ...(sys.layers || []).map((l) => l.title.toLowerCase()),
      ],
      badge: sys.status || 'OPERATIONAL',
    });
  });

  // 4.5 AI Engineering Benchmarks & Case Studies
  items.push({
    id: 'benchmarks-overview',
    type: 'BENCHMARK',
    categoryLabel: 'Empirical Metrics & Benchmarks',
    title: 'AI Engineering Case Studies & Benchmarks',
    subtitle: 'Latency Reduction & Throughput Comparison Bar Charts',
    description: 'Empirical comparison visualizer displaying measured latency reduction (-80% to -87%), throughput scaling (+420% to +1,180%), and token efficiency across production AI systems.',
    destination: '#benchmarks',
    targetSection: 'benchmarks',
    tags: ['benchmark', 'metrics', 'latency', 'throughput', 'case study', 'bar chart', 'comparison', 'speedup', 'performance', 'optimization'],
    badge: 'VERIFIED',
  });

  // 5. Professional Journey
  journey.forEach((entry) => {
    items.push({
      id: entry.id || `journey-${entry.company?.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'JOURNEY',
      categoryLabel: 'Professional Journey',
      title: `${entry.company || 'Experience'} — ${entry.role}`,
      subtitle: `${entry.period || ''} | ${entry.location || ''}`,
      description: entry.description || entry.takeaways || '',
      destination: `#${entry.id || 'journey'}`,
      targetSection: 'journey',
      elementId: entry.id,
      tags: [
        'journey',
        'experience',
        'career',
        (entry.company || '').toLowerCase(),
        (entry.role || '').toLowerCase(),
        ...(entry.keyThemes || entry.coreThemes || []).map((t) => t.toLowerCase()),
      ],
      badge: (entry.status || (entry.verified ? 'VERIFIED' : 'ACTIVE')).toUpperCase(),
    });
  });

  // 6. Proof & Evidence Matrix
  proofItems.forEach((p) => {
    items.push({
      id: `proof-${p.id || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      type: 'PROOF',
      categoryLabel: 'Proof & Evidence',
      title: p.title,
      subtitle: `${p.category || 'Evidence'} — ${p.date || 'Active'}`,
      description: p.evidence || p.description || '',
      destination: '#proof',
      targetSection: 'proof',
      tags: ['proof', 'evidence', 'verification', p.title.toLowerCase(), (p.category || '').toLowerCase()],
      badge: (p.status || 'VERIFIED').toUpperCase(),
    });
  });

  // 7. Certificates & Credentials
  certificates.forEach((cert) => {
    items.push({
      id: `cert-${cert.id || cert.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      type: 'CERTIFICATE',
      categoryLabel: 'Certificates & Credentials',
      title: cert.title,
      subtitle: `${cert.issuer || cert.provider || 'Credential'} • ${cert.date || cert.issueDate || 'Verified'}`,
      description: cert.description || (cert.topics || cert.skills || []).join(', ') || '',
      destination: '#certificates',
      targetSection: 'certificates',
      tags: [
        'certificate',
        'credential',
        'education',
        'workshop',
        'mastermind',
        'masterclass',
        cert.title.toLowerCase(),
        (cert.issuer || cert.provider || '').toLowerCase(),
        ...(cert.skills || cert.skillsCovered || cert.topics || []).map((t) => t.toLowerCase()),
      ],
      badge: 'VERIFIED',
    });
  });

  // 8. Future Vault
  FUTURE_VAULT.forEach((fv) => {
    items.push({
      id: `fv-${fv.id}`,
      type: 'VAULT ITEM',
      categoryLabel: 'Future Vault',
      title: fv.title,
      subtitle: `${fv.type} — ${fv.dateAdded}`,
      description: fv.description,
      destination: '#vault',
      targetSection: 'vault',
      tags: ['vault', 'future vault', fv.title.toLowerCase(), ...(fv.tags || []).map((t) => t.toLowerCase())],
      badge: fv.status,
    });
  });

  // 9. Apps & Executables
  apps.forEach((app) => {
    items.push({
      id: `app-${app.id}`,
      type: 'APP',
      categoryLabel: 'Apps & Executables',
      title: app.name,
      subtitle: `${app.version || 'v1.0.0'} — ${(app.platforms || []).join(', ') || app.category || 'Universal'}`,
      description: app.tagline || app.description || '',
      destination: '#apps',
      targetSection: 'apps',
      tags: ['app', 'apk', 'executable', 'download', app.name.toLowerCase(), ...(app.features || []).map((f) => f.toLowerCase())],
      badge: 'DOWNLOAD READY',
    });
  });

  // 10. Direct Contact
  items.push({
    id: 'contact-channel',
    type: 'CONTACT',
    categoryLabel: 'Direct Channel',
    title: 'Initiate Direct Contact',
    subtitle: identity.contactEmail || 'sahilbhatia7474@gmail.com',
    description: 'Reach out for AI Systems consulting, agentic product builds, and technical advisory.',
    destination: '#contact',
    targetSection: 'contact',
    tags: ['contact', 'email', 'hire', 'message', 'reach out', 'inquiry', 'consulting'],
    badge: 'DIRECT CHANNEL',
  });

  // 11. Founder Vault (Admin)
  items.push({
    id: 'founder-vault-access',
    type: 'VAULT',
    categoryLabel: 'Founder Vault',
    title: 'Founder Vault CMS 🔒',
    subtitle: 'Protected Administrative Operating System',
    description: 'Secure authentication gateway for content synchronization, live previews, and CMS settings.',
    destination: '/vault',
    targetSection: 'vault-route',
    tags: ['founder', 'vault', 'admin', 'cms', 'login', 'lock', 'settings'],
    badge: 'PROTECTED',
  });

  // 12. Legal & Business Disclosures
  items.push({
    id: 'legal-business-info',
    type: 'LEGAL',
    categoryLabel: 'Legal & Business',
    title: 'Business Information & Merchant Profile',
    subtitle: 'Legal Entity, Role & Operating Disclosures',
    description: 'Official commercial disclosures, verified contact channels, and digital services capabilities for Sahil Bhatia.',
    destination: '/business-info',
    targetSection: 'legal-route',
    tags: ['business', 'legal', 'company', 'merchant', 'address', 'profile', 'payu', 'verification', 'sahil bhatia'],
    badge: 'VERIFIED',
  });

  items.push({
    id: 'legal-services',
    type: 'LEGAL',
    categoryLabel: 'Legal & Business',
    title: 'Services & Digital Solutions',
    subtitle: 'Portfolio, Business Web, AI & Automations',
    description: 'Bespoke web development, landing pages, custom AI-powered digital solutions, and business workflow automation.',
    destination: '/services',
    targetSection: 'legal-route',
    tags: ['services', 'offerings', 'web development', 'portfolio', 'landing page', 'ai solutions', 'automation', 'n8n'],
    badge: 'AVAILABLE',
  });

  items.push({
    id: 'legal-privacy',
    type: 'LEGAL',
    categoryLabel: 'Legal & Business',
    title: 'Privacy Policy',
    subtitle: 'Data Governance & Protection Standard',
    description: 'Transparent overview of minimal data collection, security measures, inquiry processing, and user privacy rights.',
    destination: '/privacy-policy',
    targetSection: 'legal-route',
    tags: ['privacy', 'policy', 'data', 'gdpr', 'security', 'cookies', 'encryption'],
    badge: 'STANDARD',
  });

  items.push({
    id: 'legal-terms',
    type: 'LEGAL',
    categoryLabel: 'Legal & Business',
    title: 'Terms & Conditions',
    subtitle: 'Commercial Service Engagement Framework',
    description: 'Client engagement terms, project deliverables, payment milestones, IP ownership, and revision guidelines.',
    destination: '/terms-and-conditions',
    targetSection: 'legal-route',
    tags: ['terms', 'conditions', 'contract', 'agreement', 'milestones', 'ip', 'delivery'],
    badge: 'STANDARD',
  });

  items.push({
    id: 'legal-refund',
    type: 'LEGAL',
    categoryLabel: 'Legal & Business',
    title: 'Refund & Cancellation Policy',
    subtitle: 'Milestone Invoicing & Cancellation Guidelines',
    description: 'Clear guidelines regarding digital services cancellations, deposit eligibility, warranty defect resolution, and refund processing.',
    destination: '/refund-policy',
    targetSection: 'legal-route',
    tags: ['refund', 'cancellation', 'return', 'billing', 'deposit', 'warranty'],
    badge: 'STANDARD',
  });

  // 13. Official Resume & Curriculum Vitae (CV) Center
  items.push({
    id: 'resume-cv-center',
    type: 'RESUME',
    categoryLabel: 'Curriculum Vitae',
    title: 'Sahil Bhatia — Verified Resume & CV',
    subtitle: 'AI Generalist | AI-Assisted Digital Solutions | Workflow Design',
    description: 'Official verified curriculum vitae: summary, core skills, projects (Dental Care, NeutraCap, LinkBio, ShowTime Cinema, SafeShield, LYRA V2, Sahil AI OS), commercial sales experience (Excitel, Airtel, Paytm), and certifications.',
    destination: '/resume',
    targetSection: 'resume',
    tags: [
      'resume',
      'view resume',
      'cv',
      'curriculum vitae',
      'sahil bhatia resume',
      'sahil resume',
      'bhatia resume',
      'dossier',
      'verified dossier',
      'verified resume',
      'experience',
      'skills',
      'education',
      'certifications',
      'projects',
      'download resume',
      'pdf resume',
      'print resume',
      'hire sahil',
      'bio',
      'biodata',
      'profile',
      'resume / cv',
    ],
    badge: 'VERIFIED 2026',
    year: '2026',
  });

  // 14. Get Your Own Portfolio — Done-for-You Career Portfolio Service
  items.push({
    id: 'portfolio-service-offer',
    type: 'SERVICE',
    categoryLabel: 'Portfolio Service',
    title: 'Get Your Own Portfolio — Professional Career Portfolio',
    subtitle: 'Done-For-You · 4-Day Turnaround · ₹1,499 One-Time',
    description: 'Turn your resume, projects and certificates into a premium, mobile-first portfolio built to be shared. Includes review, submission form, and secure checkout.',
    destination: 'https://2m0y1o.flexi-funnels.com/portfolio-offer-d',
    external: true,
    tags: [
      'get your own portfolio',
      'portfolio service',
      'portfolio offer',
      'portfolio package',
      'buy portfolio',
      'build my portfolio',
      'order portfolio',
      'portfolio funnel',
      'portfolio creation',
      'career portfolio',
      'portfolio',
      'services',
      'hire',
    ],
    badge: '₹1,499 SERVICE',
    year: '2026',
  });

  return items;
}

/**
 * High-performance search function with ranking score
 */
export function searchKnowledgeIndex(index, query) {
  if (!query || !query.trim()) {
    // Return curated recommendations across core dimensions with Resume prioritized
    return index.filter((item) =>
      ['resume-cv-center', 'identity-core', 'project-01', 'project-02', 'project-03', 'system-sys-01', 'system-sys-02', 'contact-channel'].includes(item.id) ||
      item.type === 'RESUME' ||
      item.type === 'PROJECT' ||
      item.type === 'AI SYSTEM' ||
      item.type === 'JOURNEY' ||
      item.type === 'CERTIFICATE' ||
      item.type === 'APP'
    ).slice(0, 12);
  }

  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = index.map((item) => {
    let score = 0;
    const title = (item.title || '').toLowerCase();
    const subtitle = (item.subtitle || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const type = (item.type || '').toLowerCase();
    const tags = item.tags || [];

    // Exact full phrase match
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 60;
    else if (title.includes(q)) score += 40;

    if (subtitle.includes(q)) score += 20;
    if (desc.includes(q)) score += 15;
    if (type.includes(q)) score += 25;

    // Token matching
    tokens.forEach((token) => {
      if (title.includes(token)) score += 15;
      if (subtitle.includes(token)) score += 8;
      if (desc.includes(token)) score += 5;
      if (tags.some((t) => t.includes(token))) score += 10;
    });

    return { item, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, 15);
}

/**
 * Portfolio-aware AI Assistant Engine.
 * Formulates fact-checked answers directly from published portfolio records,
 * and generates precise interactive navigation buttons.
 */
export function queryAIAssistant(userPrompt, portfolioData = {}) {
  const prompt = (userPrompt || '').trim().toLowerCase();
  const projects = portfolioData.projects && portfolioData.projects.length > 0 ? portfolioData.projects : DEFAULT_PROJECTS;
  const identity = portfolioData.identity || DEFAULT_IDENTITY;

  // 0. GREETINGS & CASUAL INTRODUCTIONS (English & Hindi / Hinglish)
  if (
    prompt === 'hi' ||
    prompt === 'hello' ||
    prompt === 'hey' ||
    prompt.startsWith('hi ') ||
    prompt.startsWith('hello ') ||
    prompt.startsWith('hey ') ||
    prompt.includes('namaste') ||
    prompt.includes('kaise ho') ||
    prompt.includes('kya haal') ||
    prompt.includes('kya haal hai') ||
    prompt.includes('kya chal raha') ||
    prompt.includes('help') ||
    prompt.includes('madad') ||
    prompt.includes('kya kar sakte ho') ||
    prompt.includes('what can you do')
  ) {
    return {
      text: `Namaste & Hello! I am the Sahil Portfolio OS Intelligence Engine.\n\nI can assist you with:\n1. Sahil's verified production projects (NeutraCap, LYRA V2, Sahil AI OS)\n2. AI Systems Architecture & DAG workflows (SYS-01, SYS-02, SYS-03)\n3. Professional Journey (Paytm, Airtel Broadband, Excitel)\n4. Technical Skills & Capability Vectors\n5. Proof Matrix, Verified Certificates, or Direct Consultation\n\nHow can I help you navigate?`,
      actions: [
        { label: 'WHO IS SAHIL?', prompt: 'WHO IS SAHIL?' },
        { label: 'WHAT HAS HE BUILT?', prompt: 'WHAT HAS HE BUILT?' },
        { label: 'SHOW AI SYSTEMS', prompt: 'SHOW AI SYSTEMS' },
        { label: 'SHOW PROFESSIONAL JOURNEY', prompt: 'SHOW PROFESSIONAL JOURNEY' },
      ],
    };
  }

  // 1. "AI VERSION" / VERSION / SYSTEM RELEASES
  if (
    prompt.includes('version') ||
    prompt.includes('ai version') ||
    prompt.includes('system version') ||
    prompt.includes('v2.6.4') ||
    prompt.includes('release') ||
    prompt.includes('kya version') ||
    prompt.includes('kaunsa version')
  ) {
    return {
      text: `Portfolio OS & AI Architecture Version Registry:\n\n• Core OS Runtime: v2.6.4 (Production Stack: React 19, Vite, Tailwind CSS v4, Motion)\n• SYS-01: SAHIL AI OS Companion: v1.4.2 (Personal Agentic Operating Framework, Android APK & PWA)\n• SYS-02: LYRA V2: v0.9.5-beta (Directed Acyclic Graph DAG Execution Planner)\n• SYS-03: AI Consultancy OS: v1.0.0 (Diagnostic & SME Business Automation Playbook)\n• LinkBio Pro Builder: v2.1.0 (High-Speed Creator Gateway, <100ms load time)\n\nAll systems run active operational runtime checks and directed routing.`,
      actions: [
        { label: 'VIEW AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
        { label: 'SELECT SYS-01 (SAHIL AI OS)', destination: '#ai-systems', systemCode: 'SYS-01', type: 'ai-system' },
        { label: 'SELECT SYS-02 (LYRA V2)', destination: '#ai-systems', systemCode: 'SYS-02', type: 'ai-system' },
        { label: 'EXPLORE APPS HUB', destination: '#apps', type: 'scroll' },
      ],
    };
  }

  // 2. "WHO IS SAHIL?" / BIO / ABOUT / IDENTITY (English & Hindi)
  if (
    prompt.includes('who is') ||
    prompt.includes('about sahil') ||
    prompt.includes('who are you') ||
    prompt.includes('bio') ||
    prompt.includes('background') ||
    prompt.includes('kaun hai') ||
    prompt.includes('sahil kaun') ||
    prompt.includes('sahil ke bare') ||
    prompt.includes('koun hai') ||
    prompt.includes('introduce') ||
    prompt.includes('tell me about yourself') ||
    prompt === 'who is sahil?' ||
    prompt === 'who is sahil'
  ) {
    return {
      text: `${identity.name || 'Sahil Bhatia'} is an AI Generalist, AI Consultant, and Digital Systems Creator. His unique engineering vector bridges frontline commercial reality (proven through direct on-ground field sales at Paytm, Airtel Broadband, and Excitel) with high-velocity agentic software engineering and vibe coding.\n\nHe designs and deploys end-to-end intelligent tools, Directed Acyclic Graph (DAG) task execution engines, and modern digital platforms.`,
      actions: [
        { label: 'EXPLORE IDENTITY', destination: '#hero', type: 'scroll' },
        { label: 'VIEW CAPABILITIES', destination: '#capabilities', type: 'scroll' },
        { label: 'VIEW PROFESSIONAL JOURNEY', destination: '#journey', type: 'scroll' },
      ],
    };
  }

  // 3. "WHAT HAS HE BUILT?" / PROJECTS / WORK / HINDI
  if (
    prompt.includes('what has he built') ||
    prompt.includes('projects') ||
    prompt.includes('what did he build') ||
    prompt.includes('portfolio') ||
    prompt.includes('work') ||
    prompt.includes('built') ||
    prompt.includes('kya banaya') ||
    prompt.includes('kya banaye') ||
    prompt.includes('projects dikhao') ||
    prompt.includes('kaam dikhao') ||
    prompt.includes('work dikhao') ||
    prompt === 'what has he built?'
  ) {
    const lyraProj = (projects || []).find((p) => p.slug === 'lyra-v2');
    const neutraProj = (projects || []).find((p) => p.slug === 'neutracap');

    return {
      text: `Sahil has engineered a curated suite of verifiable production applications and AI systems:\n\n• NeutraCap: High-precision industrial capacitor spec platform with instant RFQ dispatch.\n• LYRA V2: Strategic architect and Directed Acyclic Graph (DAG) task engine.\n• Sahil AI OS: Personal agentic operating framework and model routing gateway.\n• Dental Care: Modern clinical booking experience with interactive treatment roadmaps.\n• LinkBio: Consolidated high-speed creator link hub (<100ms load time).\n• ShowTime Cinema: Theatrical seat-selection and concession transaction flow.\n• Sahil AI Consultancy OS: SME AI readiness assessment & diagnostic toolkit.`,
      actions: [
        { label: 'INSPECT CURATED PROJECTS', destination: '#projects', type: 'scroll' },
        { label: 'OPEN LYRA V2', destination: '#projects', projectSlug: 'lyra-v2', projectData: lyraProj, type: 'project' },
        { label: 'OPEN NEUTRACAP', destination: '#projects', projectSlug: 'neutracap', projectData: neutraProj, type: 'project' },
        { label: 'EXPLORE APPS HUB', destination: '#apps', type: 'scroll' },
      ],
    };
  }

  // 4. "SHOW AI SYSTEMS" / SYSTEMS / LYRA / AGENTS
  if (
    prompt.includes('ai systems') ||
    prompt.includes('systems') ||
    prompt.includes('agent') ||
    prompt.includes('agents') ||
    prompt.includes('dag') ||
    prompt.includes('execution graph') ||
    prompt.includes('ai architecture') ||
    prompt.includes('sys-01') ||
    prompt.includes('sys-02') ||
    prompt.includes('sys-03') ||
    prompt.includes('workflow') ||
    prompt === 'show ai systems'
  ) {
    return {
      text: `The AI Systems Laboratory features three core operational architectures:\n\n1. SYS-01: SAHIL AI OS — Autonomous agentic layer coordinating model routing (Gemini / Claude / local embeddings), structured perception, tool execution, and vector memory.\n\n2. SYS-02: LYRA V2 — Strategic execution graph engine decomposing complex goals into topologically sorted tasks with automated validation and self-healing loops.\n\n3. SYS-03: AI CONSULTANCY OS — Commercial diagnostic toolkit for scoping high-ROI automation across SME business workflows.`,
      actions: [
        { label: 'VIEW AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
        { label: 'SELECT SYS-01 (SAHIL AI OS)', destination: '#ai-systems', systemCode: 'SYS-01', type: 'ai-system' },
        { label: 'SELECT SYS-02 (LYRA V2)', destination: '#ai-systems', systemCode: 'SYS-02', type: 'ai-system' },
        { label: 'SELECT SYS-03 (CONSULTANCY)', destination: '#ai-systems', systemCode: 'SYS-03', type: 'ai-system' },
      ],
    };
  }

  // 4.5. EMPIRICAL BENCHMARKS & AI CASE STUDIES (Latency, Throughput, Efficiency)
  if (
    prompt.includes('benchmark') ||
    prompt.includes('metrics') ||
    prompt.includes('latency') ||
    prompt.includes('throughput') ||
    prompt.includes('case stud') ||
    prompt.includes('bar chart') ||
    prompt.includes('speedup') ||
    prompt.includes('reduction') ||
    prompt.includes('gains') ||
    prompt === 'show benchmarks' ||
    prompt === 'show metrics'
  ) {
    return {
      text: `AI Engineering Empirical Benchmarks & Case Studies:\n\n1. LYRA V2 (DAG Scheduler): Latency down from 3,420ms to 680ms (-80.1%), Throughput up from 14 ops/s to 88 ops/s (+528%), Token waste reduced by -79.3%.\n\n2. Sahil AI OS (Model Router & Cache): p95 Latency reduced from 1,850ms to 240ms (-87.0%), Request capacity up from 22 to 145 req/s (+559%), Cost cut by -88.7%.\n\n3. Neutracap (Hybrid RAG): Retrieval time down from 2,100ms to 410ms (-80.5%), Search throughput up +422%, Precision up to 96.2%.\n\n4. Consultancy OS (Async Pipeline): Turnaround down from 14.2s to 1.8s (-87.3%), Processing throughput surged +1,180%.\n\nExplore interactive comparison bar charts in the Benchmarks section.`,
      actions: [
        { label: 'VIEW BENCHMARKS & BAR CHARTS', destination: '#benchmarks', type: 'scroll' },
        { label: 'VIEW AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
      ],
    };
  }

  // 5. CAPABILITIES & TECHNICAL SKILLS
  if (
    prompt.includes('skill') ||
    prompt.includes('skills') ||
    prompt.includes('capabilities') ||
    prompt.includes('tech stack') ||
    prompt.includes('technologies') ||
    prompt.includes('tools') ||
    prompt.includes('coding') ||
    prompt.includes('competenc') ||
    prompt.includes('kya skills')
  ) {
    return {
      text: `Sahil's technical & architectural capabilities are grouped across 5 verified clusters:\n\n1. AI & LLM Systems: Prompt Engineering, Agentic Workflows, DAG Scheduling, Multimodal Vision, Structured JSON Extraction\n2. Modern Software Development: React 19, TypeScript, Tailwind CSS, Vite, Next.js, Node.js, WebSockets\n3. Automation & Orchestration: n8n pipelines, Webhook integrations, Firebase, REST/GraphQL\n4. Commercial & Ground Sales: Frontline Merchant Onboarding (Paytm), Technical Solution Selling (Airtel Broadband), Territory Acquisition (Excitel)\n5. Systems Architecture: High-throughput micro-tools, state machines, self-healing runtime systems.`,
      actions: [
        { label: 'EXPLORE CAPABILITY MAP', destination: '#capabilities', type: 'scroll' },
        { label: 'VIEW AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
        { label: 'INSPECT CURATED PROJECTS', destination: '#projects', type: 'scroll' },
      ],
    };
  }

  // 5.5. RESUME & CURRICULUM VITAE (CV)
  if (
    prompt.includes('resume') ||
    prompt.includes('cv') ||
    prompt.includes('curriculum vitae') ||
    prompt.includes('sahil resume') ||
    prompt.includes('bhatia resume') ||
    prompt.includes('download resume') ||
    prompt.includes('view resume') ||
    prompt.includes('see resume') ||
    prompt.includes('resume dikhao') ||
    prompt.includes('cv dikhao') ||
    prompt.includes('biodata') ||
    prompt.includes('bio data') ||
    prompt.includes('resume dekhna') ||
    prompt.includes('cv dekhna') ||
    prompt.includes('resume link') ||
    prompt.includes('cv link') ||
    prompt.includes('dossier') ||
    prompt === 'show resume' ||
    prompt === 'show cv'
  ) {
    return {
      text: `Sahil Bhatia's official verified Resume & Curriculum Vitae is available at /resume:\n\n• Professional Focus: AI Generalist | AI-Assisted Digital Solutions | Workflow Design\n• Core Competencies: Generative AI tools, prompt engineering, digital prototyping, workflow mapping, and ~2 years customer-facing field sales & BD across telecom and fintech.\n• Key Projects: Dental Care, NeutraCap Industrial Catalogue, LinkBio, ShowTime Cinema, Neutronverse Funnels, SafeShield, LYRA V2, and Sahil AI OS.\n• Experience: Excitel Broadband, Airtel Broadband, and Paytm.\n\nYou can review the complete resume or save/print a clean PDF directly from the Resume page.`,
      actions: [
        { label: 'VIEW VERIFIED RESUME', destination: '/resume', type: 'resume' },
        { label: 'SAVE AS PDF / PRINT', destination: '/resume', type: 'resume' },
        { label: 'OPEN PROFESSIONAL JOURNEY', destination: '/journey', type: 'journey-timeline' },
        { label: 'INSPECT CURATED PROJECTS', destination: '#projects', type: 'scroll' },
      ],
    };
  }

  // 6. "SHOW PROFESSIONAL JOURNEY" / CAREER / SALES / PAYTM / AIRTEL / EXCITEL
  if (
    prompt.includes('journey') ||
    prompt.includes('career') ||
    prompt.includes('sales') ||
    prompt.includes('paytm') ||
    prompt.includes('airtel') ||
    prompt.includes('excitel') ||
    prompt.includes('experience') ||
    prompt.includes('kaam kiya') ||
    prompt.includes('kaha kaam') ||
    prompt.includes('history') ||
    prompt === 'show professional journey'
  ) {
    return {
      text: `Sahil's trajectory follows a strict ground-truth evolution:\n\n1. Paytm (Jul 2024 – Mar 2025): On-ground Field Sales Executive driving QR and Soundbox merchant adoption in fast-paced retail markets.\n\n2. Airtel Broadband (Mar 2025 – Dec 2025): Consultative selling and high-tier fiber infrastructure client acquisition.\n\n3. Excitel Broadband (Jan 2026 – Jun 2026): Territory conquest and tactical sales agility in hyper-competitive markets.\n\n4. Independent Practice & AI Systems (2025 – Present): Merging commercial sales psychology with generative AI, agentic DAGs, and full-stack software.`,
      actions: [
        { label: 'OPEN VERTICAL TIMELINE', destination: '/journey', type: 'journey-timeline' },
        { label: 'DISPATCH CONSULTATION', destination: '#contact', type: 'scroll' },
      ],
    };
  }

  // 7. SERVICES, PRICING & HIRE
  if (
    prompt.includes('service') ||
    prompt.includes('services') ||
    prompt.includes('pricing') ||
    prompt.includes('cost') ||
    prompt.includes('rate') ||
    prompt.includes('hire') ||
    prompt.includes('consult') ||
    prompt.includes('consulting') ||
    prompt.includes('freelance') ||
    prompt.includes('fees')
  ) {
    return {
      text: `Sahil provides tailored engineering & consulting engagements:\n\n• High-Conversion Narrative Pages & Portfolios: Cinematic 3D interactive web experiences.\n• AI-Powered Web Applications: Custom intelligent interfaces, DAG task systems, and model routing.\n• Workflow Automations: End-to-end n8n, API, and webhook pipelines saving 15+ hours/week.\n• Advisory & Diagnostic Sprints: Practical roadmap for SME business automation.\n\nDirect milestone pricing, transparent deliverables, and inquiry dispatch available via Direct Channel.`,
      actions: [
        { label: 'VIEW SERVICES PAGE', destination: '/services', type: 'scroll' },
        { label: 'OPEN DIRECT CHANNEL', destination: '#contact', type: 'scroll' },
      ],
    };
  }

  // 7.5. GET YOUR OWN PORTFOLIO / PORTFOLIO SERVICE FUNNEL
  if (
    prompt.includes('get your own portfolio') ||
    prompt.includes('portfolio service') ||
    prompt.includes('portfolio offer') ||
    prompt.includes('buy portfolio') ||
    prompt.includes('portfolio banwana') ||
    prompt.includes('build my portfolio') ||
    prompt.includes('portfolio funnel') ||
    prompt.includes('order portfolio')
  ) {
    return {
      text: `Get Your Own Portfolio is Sahil's verified done-for-you career portfolio service (₹1,499 one-time, 4-day delivery):\n\n• Turn your resume, projects, and certificates into an editorial, mobile-first portfolio built to be shared.\n• Complete done-for-you delivery in 4 days, custom structure, and seamless shareability.\n• Review the verified offer details and checkout securely.`,
      actions: [
        { label: 'VIEW PORTFOLIO OFFER & FUNNEL', url: 'https://2m0y1o.flexi-funnels.com/portfolio-offer-d', type: 'external' },
        { label: 'VIEW VERIFIED RESUME', destination: '/resume', type: 'resume' },
      ],
    };
  }

  // 8. "SHOW PROOF" / EVIDENCE / AUDIT / REPOSITORIES
  if (
    prompt.includes('proof') ||
    prompt.includes('evidence') ||
    prompt.includes('claim') ||
    prompt.includes('verify') ||
    prompt.includes('audit') ||
    prompt === 'show proof'
  ) {
    return {
      text: `The Proof & Evidence Matrix enforces a strict Honesty Standard with zero fabrication:\n\n• Verifiable software repositories for all production projects.\n• Real-world case study evidence documenting merchant activations at Paytm and fiber rollouts at Airtel.\n• Transparent audit markers: entries under timeline verification (such as historical PhonePe records) are marked with explicit audit disclaimers rather than claimed prematurely.`,
      actions: [
        { label: 'OPEN PROOF MATRIX', destination: '#proof', type: 'scroll' },
        { label: 'INSPECT VERIFIED EVIDENCE', destination: '#proof', type: 'scroll' },
      ],
    };
  }

  // 9. "SHOW CERTIFICATES" / CREDENTIALS
  if (
    prompt.includes('certificate') ||
    prompt.includes('credential') ||
    prompt.includes('certification') ||
    prompt === 'show certificates'
  ) {
    return {
      text: `Verified technical credentials & certifications include:\n\n• Generative AI Mastermind — Outskill (Certificate ID: 0A0suE8RRdgDrQXPyc2f)\n• AI Tools & ChatGPT Workshop — be10x (Credential ID: 0270772f-3809-4400-b29b-1e1c61cd09971465833)\n\nAll credentials feature authentic verification links and verifiable skills.`,
      actions: [
        { label: 'VIEW CERTIFICATES & CREDENTIALS', destination: '#certificates', type: 'scroll' },
        { label: 'VIEW PROOF MATRIX', destination: '#proof', type: 'scroll' },
        { label: 'INSPECT SKILLS MAP', destination: '#capabilities', type: 'scroll' },
      ],
    };
  }

  // 9.5. EDUCATION / DEGREE / ACADEMIC QUALIFICATIONS
  if (
    prompt.includes('education') ||
    prompt.includes('degree') ||
    prompt.includes('college') ||
    prompt.includes('university') ||
    prompt.includes('padhai') ||
    prompt.includes('qualification')
  ) {
    return {
      text: `Academic Qualifications:\n\n• B.Sc. Mathematics (Honours) — studies commenced; degree not completed.\n\nAll specialized computing, autonomous agents, and AI architecture proficiencies have been developed through intensive self-directed research, verified open-source builds, and frontline commercial deployments.`,
      actions: [
        { label: 'VIEW VERIFIED RESUME', destination: '/resume', type: 'resume' },
        { label: 'VIEW CERTIFICATES', destination: '#certificates', type: 'scroll' },
        { label: 'EXPLORE CAPABILITIES', destination: '#capabilities', type: 'scroll' },
      ],
    };
  }

  // 10. SPECIFIC PROJECT INQUIRIES
  const matchedProject = projects.find(
    (p) =>
      prompt.includes(p.title.toLowerCase()) ||
      (p.slug && prompt.includes(p.slug.toLowerCase()))
  );

  if (matchedProject) {
    const publicLinks = getProjectPublicLinks(matchedProject);
    const actions = [
      {
        label: `OPEN ${matchedProject.title.toUpperCase()} SPECS`,
        destination: '#projects',
        projectData: matchedProject,
        projectSlug: matchedProject.slug,
        type: 'project',
      },
    ];

    publicLinks.forEach((link) => {
      actions.push({
        label: link.actionLabel || link.label?.toUpperCase() || 'VISIT LINK',
        url: link.url,
        type: 'external',
      });
    });

    return {
      text: `${matchedProject.title} (${matchedProject.subtitle || matchedProject.category}):\n\n${matchedProject.summary || matchedProject.description}\n\nTech Stack: ${(matchedProject.techStack || []).join(', ')}\nStatus: ${matchedProject.status || 'BUILT'}`,
      actions,
    };
  }

  // 11. APPS HUB / DOWNLOADS
  if (prompt.includes('app') || prompt.includes('apk') || prompt.includes('download')) {
    const activeDomain = identity?.domain && identity.domain !== 'SAHILBHATIA.COM' ? identity.domain : 'sahil-bhatia-ai-portfolio.vercel.app';
    return {
      text: `The Apps Hub hosts client distribution packages for ${activeDomain}:\n\n• Sahil AI OS Companion (Mobile & Desktop Cockpit, Android APK / PWA)\n• LinkBio Pro Builder (Instant Micro-Landing & Link Hub)\n• Lyra Architect Engine (Visual DAG Task Planner)`,
      actions: [
        { label: 'EXPLORE APPS HUB', destination: '#apps', type: 'scroll' },
      ],
    };
  }

  // 12. CONTACT / HIRE (English & Hindi)
  if (
    prompt.includes('contact') ||
    prompt.includes('email') ||
    prompt.includes('phone') ||
    prompt.includes('number') ||
    prompt.includes('message') ||
    prompt.includes('reach out') ||
    prompt.includes('kaise contact') ||
    prompt.includes('baat kaise') ||
    prompt.includes('linkedin') ||
    prompt.includes('github') ||
    prompt.includes('instagram')
  ) {
    return {
      text: `You can reach Sahil directly for AI consulting, agentic product builds, and technical advisory at ${identity.contactEmail || 'sahilbhatia7474@gmail.com'}.\n\nDirect contact form and verified social channels (LinkedIn, GitHub) are accessible in the Direct Channel section.`,
      actions: [
        { label: 'OPEN DIRECT CHANNEL', destination: '#contact', type: 'scroll' },
      ],
    };
  }

  // 13. SMART FALLBACK VIA KNOWLEDGE SEARCH
  const searchIndex = buildKnowledgeIndex(portfolioData);
  const searchHits = searchKnowledgeIndex(searchIndex, prompt);

  if (searchHits.length > 0) {
    const topHit = searchHits[0];
    return {
      text: `Found relevant portfolio records for "${userPrompt}":\n\n${topHit.title} (${topHit.categoryLabel}) — ${topHit.description}`,
      actions: [
        {
          label: `NAVIGATE TO ${topHit.title.toUpperCase()}`,
          destination: topHit.destination,
          projectData: topHit.projectData,
          systemCode: topHit.systemCode,
          type: topHit.type === 'PROJECT' ? 'project' : topHit.type === 'AI SYSTEM' ? 'ai-system' : 'scroll',
        },
        { label: 'EXPLORE OVERVIEW', destination: '#hero', type: 'scroll' },
      ],
    };
  }

  return {
    text: `I'm Sahil's portfolio AI assistant. I have full knowledge of his published projects (NeutraCap, LYRA V2, Sahil AI OS), AI systems architectures, professional career journey (Paytm, Airtel, Excitel), proof matrix, and technical skills.\n\nTry asking: "Who is Sahil?", "What has he built?", "Show AI systems", or "What is the AI version?".`,
    actions: [
      { label: 'EXPLORE IDENTITY', destination: '#hero', type: 'scroll' },
      { label: 'CURATED PROJECTS', destination: '#projects', type: 'scroll' },
      { label: 'AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
    ],
  };
}
