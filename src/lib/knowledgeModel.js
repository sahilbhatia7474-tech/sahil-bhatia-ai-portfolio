import {
  IDENTITY as DEFAULT_IDENTITY,
  CAPABILITY_MAP,
  CURATED_PROJECTS as DEFAULT_PROJECTS,
  AI_SYSTEMS as DEFAULT_AI_SYSTEMS,
  PROFESSIONAL_JOURNEY as DEFAULT_JOURNEY,
  PROOF_MATRIX as DEFAULT_PROOF,
  FUTURE_VAULT,
  APPS_HUB as DEFAULT_APPS,
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
  const certificates = data.certificates || [];
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
      categoryLabel: 'Certificate / Credential',
      title: cert.title,
      subtitle: cert.issuer || cert.organization || 'Verified Credential',
      description: cert.description || cert.field || '',
      destination: '#proof',
      targetSection: 'proof',
      tags: ['certificate', 'credential', 'education', cert.title.toLowerCase()],
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

  return items;
}

/**
 * High-performance search function with ranking score
 */
export function searchKnowledgeIndex(index, query) {
  if (!query || !query.trim()) {
    // Return curated recommendations
    return index.filter((item) =>
      ['identity-core', 'project-01', 'project-02', 'project-03', 'system-sys-01', 'system-sys-02', 'contact-channel'].includes(item.id) ||
      item.type === 'PROJECT' ||
      item.type === 'AI SYSTEM'
    ).slice(0, 8);
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

  // 1. "WHO IS SAHIL?" / BIO / ABOUT / IDENTITY
  if (
    prompt.includes('who is') ||
    prompt.includes('about sahil') ||
    prompt.includes('who are you') ||
    prompt.includes('bio') ||
    prompt.includes('background') ||
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

  // 2. "WHAT HAS HE BUILT?" / PROJECTS / WORK
  if (
    prompt.includes('what has he built') ||
    prompt.includes('projects') ||
    prompt.includes('what did he build') ||
    prompt.includes('portfolio') ||
    prompt.includes('work') ||
    prompt === 'what has he built?'
  ) {
    return {
      text: `Sahil has engineered a curated suite of verifiable production applications and AI systems:\n\n• NeutraCap: High-precision industrial capacitor spec platform with instant RFQ dispatch.\n• LYRA V2: Strategic architect and Directed Acyclic Graph (DAG) task engine.\n• Sahil AI OS: Personal agentic operating framework and model routing gateway.\n• Dental Care: Modern clinical booking experience with interactive treatment roadmaps.\n• LinkBio: Consolidated high-speed creator link hub (<100ms load time).\n• ShowTime Cinema: Theatrical seat-selection and concession transaction flow.\n• Sahil AI Consultancy OS: SME AI readiness assessment & diagnostic toolkit.`,
      actions: [
        { label: 'INSPECT CURATED PROJECTS', destination: '#projects', type: 'scroll' },
        { label: 'OPEN LYRA V2', destination: '#projects', projectSlug: 'lyra-v2', type: 'project' },
        { label: 'OPEN NEUTRACAP', destination: '#projects', projectSlug: 'neutracap', type: 'project' },
        { label: 'EXPLORE APPS HUB', destination: '#apps', type: 'scroll' },
      ],
    };
  }

  // 3. "SHOW AI SYSTEMS" / SYSTEMS / LYRA / AGENTS
  if (
    prompt.includes('ai systems') ||
    prompt.includes('systems') ||
    prompt.includes('agent') ||
    prompt.includes('dag') ||
    prompt.includes('execution graph') ||
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

  // 4. "SHOW PROFESSIONAL JOURNEY" / CAREER / SALES / PAYTM / AIRTEL / EXCITEL
  if (
    prompt.includes('journey') ||
    prompt.includes('career') ||
    prompt.includes('sales') ||
    prompt.includes('paytm') ||
    prompt.includes('airtel') ||
    prompt.includes('excitel') ||
    prompt.includes('experience') ||
    prompt === 'show professional journey'
  ) {
    return {
      text: `Sahil's trajectory follows a strict ground-truth evolution:\n\n1. Paytm (Jul 2024 – Mar 2025): On-ground Field Sales Executive driving QR and Soundbox merchant adoption in fast-paced retail markets.\n\n2. Airtel Broadband (Mar 2025 – Dec 2025): Consultative selling and high-tier fiber infrastructure client acquisition.\n\n3. Excitel Broadband (Jan 2026 – Jun 2026): Territory conquest and tactical sales agility in hyper-competitive markets.\n\n4. Independent Practice & AI Systems (2025 – Present): Merging commercial sales psychology with generative AI, agentic DAGs, and full-stack software.`,
      actions: [
        { label: 'VIEW PROFESSIONAL JOURNEY', destination: '#journey', type: 'scroll' },
        { label: 'INSPECT PAYTM PHASE', destination: '#journey-j-1', type: 'scroll' },
        { label: 'INSPECT AIRTEL PHASE', destination: '#journey-j-2', type: 'scroll' },
      ],
    };
  }

  // 5. "SHOW PROOF" / EVIDENCE / AUDIT / REPOSITORIES
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

  // 6. "SHOW CERTIFICATES" / CREDENTIALS / EDUCATION
  if (
    prompt.includes('certificate') ||
    prompt.includes('credential') ||
    prompt.includes('education') ||
    prompt.includes('qualification') ||
    prompt === 'show certificates'
  ) {
    return {
      text: `Verified technical credentials and research benchmarks include:\n\n• Advanced Prompt Architecture & Agent Workflows (Systematic evaluation on structured JSON schemas, multimodal reasoning, and long reasoning chain context preservation).\n• Verified competency across LLM prompt engineering, n8n automations, TypeScript/React systems, and Directed Acyclic Graphs.`,
      actions: [
        { label: 'VIEW CREDENTIALS', destination: '#proof', type: 'scroll' },
        { label: 'INSPECT SKILLS MAP', destination: '#capabilities', type: 'scroll' },
      ],
    };
  }

  // 7. SPECIFIC PROJECT INQUIRIES
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

  // 8. APPS HUB / DOWNLOADS
  if (prompt.includes('app') || prompt.includes('apk') || prompt.includes('download')) {
    const activeDomain = identity?.domain && identity.domain !== 'SAHILBHATIA.COM' ? identity.domain : 'sahil-bhatia-ai-portfolio.vercel.app';
    return {
      text: `The Apps Hub hosts client distribution packages for ${activeDomain}:\n\n• Sahil AI OS Companion (Mobile & Desktop Cockpit, Android APK / PWA)\n• LinkBio Pro Builder (Instant Micro-Landing & Link Hub)\n• Lyra Architect Engine (Visual DAG Task Planner)`,
      actions: [
        { label: 'EXPLORE APPS HUB', destination: '#apps', type: 'scroll' },
      ],
    };
  }

  // 9. CONTACT / HIRE
  if (
    prompt.includes('contact') ||
    prompt.includes('hire') ||
    prompt.includes('email') ||
    prompt.includes('message') ||
    prompt.includes('reach out')
  ) {
    return {
      text: `You can reach Sahil directly for AI consulting, agentic product builds, and technical advisory at ${identity.contactEmail || 'sahilbhatia7474@gmail.com'}.\n\nDirect contact form and verified social channels (LinkedIn, GitHub) are accessible in the Direct Channel section.`,
      actions: [
        { label: 'OPEN DIRECT CHANNEL', destination: '#contact', type: 'scroll' },
      ],
    };
  }

  // 10. SMART FALLBACK VIA KNOWLEDGE SEARCH
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
    text: `I'm Sahil's portfolio AI assistant. I have full knowledge of his published projects (NeutraCap, LYRA V2, Sahil AI OS), AI systems architectures, professional career journey (Paytm, Airtel, Excitel), proof matrix, and technical skills.\n\nTry asking: "Who is Sahil?", "What has he built?", "Show AI systems", or "Show professional journey".`,
    actions: [
      { label: 'EXPLORE IDENTITY', destination: '#hero', type: 'scroll' },
      { label: 'CURATED PROJECTS', destination: '#projects', type: 'scroll' },
      { label: 'AI SYSTEMS LAB', destination: '#ai-systems', type: 'scroll' },
    ],
  };
}
