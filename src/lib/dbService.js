import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { isAuthorizedFounderEmail } from './authConstants';
import {
  IDENTITY,
  CURATED_PROJECTS,
  AI_SYSTEMS,
  PROFESSIONAL_JOURNEY,
  PROOF_MATRIX,
  APPS_HUB,
} from '../data/portfolioData';

// Safe activity logger
export const logActivity = async (action, summary, details = {}) => {
  try {
    const activityRef = doc(collection(db, 'activityLog'));
    await setDoc(activityRef, {
      id: activityRef.id,
      action,
      summary,
      details,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Activity logging fallback/warning:', err.message);
  }
};

// Initial Seed data definition
export const SEED_DATA = {
  identity: {
    ...IDENTITY,
    id: 'primary',
    headline: 'AI Generalist, AI Consultant & Systems Builder',
    shortBio: IDENTITY.subStatement,
    longBio: IDENTITY.bio,
    location: 'Delhi NCR, India (Global Remote)',
    availability: 'ACCEPTING HIGH-IMPACT CONSULTATION & ARCHITECTURE PROJECTS',
    updatedAt: new Date().toISOString(),
  },
  featuredPortrait: {
    id: 'primary',
    imageUrl: 'https://i.ibb.co/svvJ3Fnc/793090671-2240593123170371-3167005344409012686-n.jpg',
    focalX: 50,
    focalY: 20,
    altText: 'Sahil Bhatia — AI-Native Builder and Systems Architect',
    visibility: 'PUBLIC',
    featured: true,
    publicationState: 'PUBLISHED',
    header: 'FOUNDER CARD',
    role: 'SYSTEMS ARCHITECT',
    description: 'Designing scalable systems.\nBuilding intelligent solutions.',
    statusLabel: 'SYSTEM STATUS',
    status: 'ACTIVE',
    name: 'SAHIL BHATIA',
    positioning: 'AI-NATIVE BUILDER • SYSTEMS ARCHITECT',
    capabilities: ['AI AGENTS', 'WORKFLOWS', 'AUTOMATION'],
    capabilityVectors: ['AI SYSTEMS ARCHITECTURE', 'AI-NATIVE DEVELOPMENT', 'AUTOMATION & WORKFLOWS'],
    footerLead: 'BUILDING INTELLIGENT SYSTEMS',
    footerSub: 'FOR REAL IMPACT.',
    blendMode: 'cinematic-dark',
    updatedAt: new Date().toISOString(),
  },
  siteSettings: {
    id: 'primary',
    siteTitle: 'SAHIL BHATIA — AI PORTFOLIO & SYSTEMS',
    metaDescription: 'AI-Native Builder, AI Consultant & Systems Architect. Translating frontline sales understanding into resilient agentic architectures.',
    domain: 'sahil-bhatia-ai-portfolio.vercel.app',
    systemName: 'PORTFOLIO OS',
    version: 'v2.6.4',
    accentColor: '#FF2A3A',
    contactEmail: 'sahilbhatia7474@gmail.com',
    announcementBanner: 'PORTFOLIO OS ACTIVE // DIRECT ACCESS ONLINE',
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
  },
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Computer Applications / Technology Studies',
      institution: 'Verified University / Academic Program',
      startYear: '2021',
      endYear: '2024',
      status: 'VERIFIED',
      visibility: 'PUBLIC',
      description: 'Focus on modern computing frameworks, distributed logic, and human-computer interfaces.',
      evidence: 'Academic Transcripts & Credential Portfolio',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'edu-2',
      degree: 'Deep Learning & Agentic Systems Specialization',
      institution: 'Independent Research Practice',
      startYear: '2024',
      endYear: '2026',
      status: 'VERIFIED',
      visibility: 'PUBLIC',
      description: 'Structured self-directed research into Directed Acyclic Graphs, n8n webhook orchestration, and LLM reasoning loops.',
      evidence: 'GitHub Repositories & Execution Graph Codebases',
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      title: 'Generative AI & Agentic Systems Architecture',
      issuer: 'DeepLearning.AI / Leading AI Institutes',
      issueDate: '2025',
      certificateImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=600',
      verificationUrl: 'https://verify.example.org/cert-01',
      description: 'Advanced mastery of multi-model prompting, structured JSON schema validation, and tool-calling execution agents.',
      skillsCovered: ['LLMs', 'Agent Loops', 'Function Calling', 'RAG'],
      visibility: 'PUBLIC',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cert-2',
      title: 'Full-Stack Modern Web Engineering & Systems',
      issuer: 'Advanced Web Certification Consortium',
      issueDate: '2024',
      certificateImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      verificationUrl: 'https://verify.example.org/cert-02',
      description: 'Enterprise React performance, asynchronous state synchronization, and reactive UI architecture.',
      skillsCovered: ['React', 'TypeScript', 'Tailwind', 'REST/GraphQL'],
      visibility: 'PUBLIC',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  navigation: [
    { id: 'nav-1', label: 'Identity', target: '/', sortOrder: 1, visible: true },
    { id: 'nav-2', label: 'Capabilities', target: '/#capabilities', sortOrder: 2, visible: true },
    { id: 'nav-3', label: 'Projects', target: '/projects', sortOrder: 3, visible: true },
    { id: 'nav-4', label: 'AI Systems', target: '/ai-systems', sortOrder: 4, visible: true },
    { id: 'nav-5', label: 'Journey', target: '/journey', sortOrder: 5, visible: true },
    { id: 'nav-6', label: 'Proof', target: '/proof', sortOrder: 6, visible: true },
    { id: 'nav-7', label: 'Future Vault', target: '/future-vault', sortOrder: 7, visible: true },
    { id: 'nav-8', label: 'Apps Hub', target: '/apps', sortOrder: 8, visible: true },
    { id: 'nav-9', label: 'Contact', target: '/contact', sortOrder: 9, visible: true },
  ],
  media: [
    {
      id: 'med-1',
      name: 'Sahil Bhatia Profile Portrait (Primary)',
      type: 'image',
      url: '/sahil-bhatia-portrait.svg',
      thumbnail: '/sahil-bhatia-portrait.svg',
      category: 'profile',
      altText: 'Sahil Bhatia cinematic builder portrait',
      visibility: 'PUBLIC',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'med-2',
      name: 'NeutraCap Spec Viewer Showcase',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=200',
      category: 'project',
      altText: 'Industrial capacitors hardware interface',
      visibility: 'PUBLIC',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'med-3',
      name: 'LYRA V2 DAG Node Execution Diagram',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200',
      category: 'architecture',
      altText: 'Directed Acyclic Graph agentic execution state visualizer',
      visibility: 'PUBLIC',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'med-4',
      name: 'Sahil AI OS Companion Direct APK Package',
      type: 'document',
      url: '#package-sahil-ai-os-apk',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      category: 'app-asset',
      altText: 'Android direct installation package binary',
      visibility: 'PUBLIC',
      createdAt: new Date().toISOString(),
    },
  ],
};

// Auto-seed Firestore on initial boot if empty and authorized as founder
export const seedInitialDatabase = async (force = false) => {
  try {
    const currentUser = auth.currentUser;
    const isFounderAuth = currentUser && isAuthorizedFounderEmail(currentUser.email);

    // If session is unauthenticated and not forced, bypass writing to avoid permission violations.
    // The public portfolio seamlessly defaults to curated offline data.
    if (!isFounderAuth && !force) {
      return { seeded: false, message: 'Unauthenticated visitor session; using default portfolio datasets.' };
    }

    const identityDoc = await getDoc(doc(db, 'identity', 'primary'));
    if (identityDoc.exists() && !force) {
      return { seeded: false, message: 'Database already initialized.' };
    }

    console.log('Seeding initial Founder Vault database collections...');
    // Seed identity
    await setDoc(doc(db, 'identity', 'primary'), SEED_DATA.identity);
    // Seed portrait
    await setDoc(doc(db, 'featuredPortrait', 'primary'), SEED_DATA.featuredPortrait);
    // Seed site settings
    await setDoc(doc(db, 'siteSettings', 'primary'), SEED_DATA.siteSettings);

    // Seed projects
    for (let i = 0; i < CURATED_PROJECTS.length; i++) {
      const p = CURATED_PROJECTS[i];
      await setDoc(doc(db, 'projects', p.id), {
        ...p,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        shortDescription: p.summary,
        longDescription: p.description,
        status: p.status === 'BUILT' ? 'PUBLISHED' : (p.status === 'IN PROGRESS' ? 'PUBLISHED' : 'DRAFT'),
        technologies: p.techStack || [],
        heroImage: p.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        coverImageUrl: p.coverImageUrl || '',
        gallery: p.galleryImages || [],
        liveWebsiteUrl: p.liveWebsiteUrl || '',
        demoUrl: p.demoUrl || '',
        githubUrl: p.githubUrl || '',
        caseStudyUrl: p.caseStudyUrl || '',
        prototypeUrl: p.prototypeUrl || '',
        videoUrl: p.videoUrl || '',
        repositoryUrl: p.repositoryUrl || '',
        links: p.links || [],
        caseStudy: p.description,
        role: p.role || 'Lead Architect & Builder',
        year: p.year,
        featured: i < 3,
        visibility: 'PUBLIC',
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed AI systems
    for (let i = 0; i < AI_SYSTEMS.length; i++) {
      const sys = AI_SYSTEMS[i];
      await setDoc(doc(db, 'aiSystems', sys.code), {
        ...sys,
        id: sys.code,
        title: sys.name,
        description: sys.overview,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        featured: true,
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed journey
    for (let i = 0; i < PROFESSIONAL_JOURNEY.length; i++) {
      const j = PROFESSIONAL_JOURNEY[i];
      await setDoc(doc(db, 'journey', j.id), {
        ...j,
        title: `${j.role} @ ${j.company}`,
        startDate: j.period.split('–')[0]?.trim() || '',
        endDate: j.period.split('–')[1]?.trim() || '',
        responsibilities: j.keyThemes || [],
        skills: j.keyThemes || [],
        evidence: j.takeaways || '',
        status: j.verified ? 'PUBLISHED' : 'VERIFY',
        visibility: j.verified ? 'PUBLIC' : 'PRIVATE',
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed education
    for (const edu of SEED_DATA.education) {
      await setDoc(doc(db, 'education', edu.id), edu);
    }

    // Seed certificates
    for (const cert of SEED_DATA.certificates) {
      await setDoc(doc(db, 'certificates', cert.id), cert);
    }

    // Seed proof matrix
    for (let i = 0; i < PROOF_MATRIX.length; i++) {
      const prf = PROOF_MATRIX[i];
      await setDoc(doc(db, 'proof', prf.id), {
        ...prf,
        verificationState: prf.status,
        status: prf.status === 'VERIFY' ? 'VERIFY' : 'PUBLISHED',
        visibility: prf.status === 'VERIFY' ? 'PRIVATE' : 'PUBLIC',
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed apps
    for (let i = 0; i < APPS_HUB.length; i++) {
      const appItem = APPS_HUB[i];
      await setDoc(doc(db, 'apps', appItem.id), {
        ...appItem,
        appName: appItem.name,
        apkUrl: appItem.downloadUrl,
        pwaUrl: `#pwa-${appItem.id}`,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        featured: true,
        sortOrder: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Seed navigation
    for (const nav of SEED_DATA.navigation) {
      await setDoc(doc(db, 'navigation', nav.id), nav);
    }

    // Seed media
    for (const m of SEED_DATA.media) {
      await setDoc(doc(db, 'media', m.id), m);
    }

    await logActivity('DATABASE_INITIALIZED', 'Initial Founder database seed executed.');
    return { seeded: true, message: 'All collections populated successfully.' };
  } catch (err) {
    console.warn('Seed database warning:', err?.message || err);
    return { seeded: false, error: err?.message || String(err) };
  }
};

// Generic CRUD Operations
export const fetchCollectionDocs = async (collectionName, includeAll = false) => {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (includeAll) {
      return items.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    }

    // Public filtering: only PUBLISHED and PUBLIC
    return items
      .filter((item) => item.status === 'PUBLISHED' && item.visibility === 'PUBLIC')
      .sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  } catch (err) {
    console.warn(`Fetch ${collectionName} error:`, err.message);
    return [];
  }
};

export const saveItem = async (collectionName, docId, data, isNew = false) => {
  try {
    const targetId = docId || doc(collection(db, collectionName)).id;
    const itemRef = doc(db, collectionName, targetId);
    const payload = {
      ...data,
      id: targetId,
      updatedAt: new Date().toISOString(),
    };
    if (isNew) {
      payload.createdAt = new Date().toISOString();
    }
    await setDoc(itemRef, payload, { merge: true });
    await logActivity(
      isNew ? `${collectionName.toUpperCase()}_CREATED` : `${collectionName.toUpperCase()}_UPDATED`,
      `Document ${targetId} saved in ${collectionName}`,
      { targetId, status: data.status || 'DRAFT' }
    );
    return { success: true, id: targetId };
  } catch (err) {
    console.error(`Save ${collectionName} error:`, err);
    return { success: false, error: err.message };
  }
};

export const deleteItem = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    await logActivity(
      `${collectionName.toUpperCase()}_DELETED`,
      `Deleted document ${docId} from ${collectionName}`
    );
    return { success: true };
  } catch (err) {
    console.error(`Delete ${collectionName} error:`, err);
    return { success: false, error: err.message };
  }
};

export const publishItem = async (collectionName, docId, publish = true) => {
  try {
    const itemRef = doc(db, collectionName, docId);
    const newStatus = publish ? 'PUBLISHED' : 'DRAFT';
    const newVisibility = publish ? 'PUBLIC' : 'PRIVATE';
    await updateDoc(itemRef, {
      status: newStatus,
      visibility: newVisibility,
      updatedAt: new Date().toISOString(),
    });
    await logActivity(
      publish ? `${collectionName.toUpperCase()}_PUBLISHED` : `${collectionName.toUpperCase()}_UNPUBLISHED`,
      `Status changed to ${newStatus} for ${docId} in ${collectionName}`
    );
    return { success: true };
  } catch (err) {
    console.error(`Publish ${collectionName} error:`, err);
    return { success: false, error: err.message };
  }
};

export const saveNavigationItems = async (items) => {
  try {
    for (const item of items) {
      const targetId = item.id || `nav-${Date.now()}`;
      await setDoc(doc(db, 'navigation', targetId), {
        ...item,
        id: targetId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    await logActivity('NAVIGATION_UPDATED', 'Navigation hierarchy updated', { count: items.length });
    return { success: true };
  } catch (err) {
    console.error('Save navigation error:', err);
    return { success: false, error: err.message };
  }
};

export const saveSiteSettings = async (settings) => {
  try {
    const docRef = doc(db, 'siteSettings', 'primary');
    await setDoc(docRef, {
      ...settings,
      id: 'primary',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await logActivity('SITE_SETTINGS_UPDATED', 'Global site settings updated', settings);
    return { success: true };
  } catch (err) {
    console.error('Save site settings error:', err);
    return { success: false, error: err.message };
  }
};
