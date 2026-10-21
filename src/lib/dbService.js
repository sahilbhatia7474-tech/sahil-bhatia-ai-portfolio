import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';
import { isAuthorizedFounderEmail } from './authConstants';
import {
  IDENTITY,
  CURATED_PROJECTS,
  AI_SYSTEMS,
  PROFESSIONAL_JOURNEY,
  PROOF_MATRIX,
  APPS_HUB,
} from '../data/portfolioData';

// Safe activity logger (only authenticated founder sessions can write to the private activityLog)
export const logActivity = async (action, summary, details = {}) => {
  try {
    if (!auth?.currentUser || !isAuthorizedFounderEmail(auth.currentUser.email)) {
      return;
    }
    const activityRef = doc(collection(db, 'activityLog'));
    await setDoc(activityRef, {
      id: activityRef.id,
      action,
      summary,
      details,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch {
    // Non-blocking fallback for activity log
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
      degree: 'B.Sc. Mathematics (Honours) — studies commenced; degree not completed.',
      institution: 'University Studies',
      status: 'VERIFIED',
      visibility: 'PUBLIC',
      description: 'Undergraduate academic study in Mathematics (Honours). Studies commenced; degree not completed.',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  certificates: [
    {
      id: 'cert-outskill-01',
      title: 'Generative AI Mastermind',
      issuer: 'Outskill',
      provider: 'Outskill',
      recipient: 'Sahil Bhatia',
      category: 'Certification',
      issueDate: '2026',
      date: '2026',
      certificateImage: 'https://plain-apac-prod-public.komododecks.com/202609/14/0A0suE8RRdgDrQXPyc2f/image.jpg',
      imageUrl: 'https://plain-apac-prod-public.komododecks.com/202609/14/0A0suE8RRdgDrQXPyc2f/image.jpg',
      verificationUrl: 'https://kommodo.ai/i/0A0suE8RRdgDrQXPyc2f',
      url: 'https://kommodo.ai/i/0A0suE8RRdgDrQXPyc2f',
      description: 'Certificate of Completion awarded to Sahil Bhatia for completing the Generative AI Mastermind with Outskill.',
      skills: ['Generative AI', 'LLMs & System Prompting', 'Agent Orchestration', 'Autonomous AI Systems'],
      skillsCovered: ['Generative AI', 'LLMs & System Prompting', 'Agent Orchestration', 'Autonomous AI Systems'],
      topics: ['Generative AI', 'LLMs & System Prompting', 'Agent Orchestration', 'Autonomous AI Systems'],
      visibility: 'PUBLIC',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cert-be10x-01',
      title: 'AI Tools & ChatGPT Workshop',
      issuer: 'be10x',
      provider: 'be10x',
      recipient: 'Sahil Bhatia',
      category: 'Workshop Certification',
      issueDate: 'June 21, 2026',
      date: 'June 21, 2026',
      credentialId: '0270772f-3809-4400-b29b-1e1c61cd09971465833',
      verificationUrl: 'https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd09971465833',
      url: 'https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd09971465833',
      description: 'Verified completion of AI Tools & ChatGPT Workshop covering AI Productivity, Workplace Automation, AI Business Applications, and AI Workflow Optimization.',
      skills: ['AI Tools', 'ChatGPT Workflows', 'AI Productivity', 'Workplace Automation', 'AI Data Analysis', 'Coding & Debugging'],
      skillsCovered: ['AI Tools', 'ChatGPT Workflows', 'AI Productivity', 'Workplace Automation', 'AI Data Analysis', 'Coding & Debugging'],
      topics: ['AI Tools', 'ChatGPT Workflows', 'AI Productivity', 'Workplace Automation', 'AI Data Analysis', 'Coding & Debugging'],
      visibility: 'PUBLIC',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cert-freedom-ai-01',
      title: 'Freedom with AI Masterclass',
      issuer: 'Freedom with AI',
      provider: 'Freedom with AI',
      recipient: 'Sahil Bhatia',
      category: 'Masterclass Certification',
      issueDate: '12/09/2026',
      date: '12/09/2026',
      certificateImage: 'https://plain-apac-prod-public.komododecks.com/202609/14/VNSmjNTSGk0xw9tDx5ct/image.jpg',
      imageUrl: 'https://plain-apac-prod-public.komododecks.com/202609/14/VNSmjNTSGk0xw9tDx5ct/image.jpg',
      verificationUrl: 'https://kommodo.ai/i/VNSmjNTSGk0xw9tDx5ct',
      url: 'https://kommodo.ai/i/VNSmjNTSGk0xw9tDx5ct',
      description: 'Certificate of Completion awarded to Sahil Bhatia for completing the Freedom with AI Masterclass on autonomous productivity pipelines.',
      skills: ['AI Workflows', 'Agentic Automation', 'No-Code AI Leverage', 'AI Productivity Pipelines'],
      skillsCovered: ['AI Workflows', 'Agentic Automation', 'No-Code AI Leverage', 'AI Productivity Pipelines'],
      topics: ['AI Workflows', 'Agentic Automation', 'No-Code AI Leverage', 'AI Productivity Pipelines'],
      visibility: 'PUBLIC',
      featured: true,
      status: 'PUBLISHED',
      sortOrder: 3,
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
    { id: 'nav-6b', label: 'Certificates', target: '/certificates', sortOrder: 7, visible: true },
    { id: 'nav-7', label: 'Future Vault', target: '/future-vault', sortOrder: 8, visible: true },
    { id: 'nav-8', label: 'Apps Hub', target: '/apps', sortOrder: 9, visible: true },
    { id: 'nav-9', label: 'Contact', target: '/contact', sortOrder: 10, visible: true },
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
    // Clean up legacy template mock certs if present
    try {
      await deleteDoc(doc(db, 'certificates', 'cert-1'));
      await deleteDoc(doc(db, 'certificates', 'cert-2'));
    } catch {
      // ignore
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
    let q;
    if (includeAll) {
      q = collection(db, collectionName);
    } else {
      if (collectionName === 'media') {
        q = query(collection(db, collectionName), where('visibility', '==', 'PUBLIC'));
      } else if (['projects', 'journey', 'apps', 'certificates', 'education', 'proof', 'aiSystems'].includes(collectionName)) {
        q = query(
          collection(db, collectionName),
          where('visibility', '==', 'PUBLIC'),
          where('status', '==', 'PUBLISHED')
        );
      } else {
        q = collection(db, collectionName);
      }
    }
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return items.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionName);
    return [];
  }
};

// Check whether the active session has Founder edit authorization
export const assertFounderEditor = () => {
  const currentUser = auth.currentUser;
  const isAnonymous = currentUser?.isAnonymous;
  const email = currentUser?.email?.toLowerCase().trim();

  // If session explicitly flagged as public viewer, reject write immediately
  if (typeof window !== 'undefined') {
    const role = sessionStorage.getItem('sahil_vault_role');
    if (role === 'PUBLIC_VIEWER') {
      throw new Error('ACCESS DENIED: Vault is in Read-Only Specimen Mode. Only Sahil Bhatia (sahilbhatia7474@gmail.com) is authorized to edit or modify portfolio systems.');
    }
  }

  // If authenticated via Firebase Auth
  if (currentUser) {
    if (isAnonymous) {
      throw new Error('ACCESS DENIED: Anonymous visitors have read-only clearance. All write and edit operations are restricted to Sahil Bhatia (sahilbhatia7474@gmail.com).');
    }
    if (!isAuthorizedFounderEmail(email)) {
      throw new Error(`ACCESS DENIED: Account (${email || 'guest'}) is not authorized to edit. Only Sahil Bhatia (sahilbhatia7474@gmail.com) has edit privileges.`);
    }
    return true;
  }

  // Fallback to verified local founder session
  if (typeof window !== 'undefined') {
    const isFounderSession = sessionStorage.getItem('sahil_founder_authorized') === 'true' && sessionStorage.getItem('sahil_vault_role') === 'FOUNDER_OWNER';
    if (isFounderSession) {
      return true;
    }
  }

  throw new Error('ACCESS DENIED: Founder authentication required. Only Sahil Bhatia (sahilbhatia7474@gmail.com) can modify vault data.');
};

export const saveItem = async (collectionName, docId, data, isNew = false) => {
  try {
    assertFounderEditor();
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
    assertFounderEditor();
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
    assertFounderEditor();
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
    assertFounderEditor();
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
    assertFounderEditor();
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

/**
 * SECURE CLIENT INQUIRY & CONTACT FORM SUBMISSION
 * 
 * Public visitors can create documents into the 'messages' collection.
 * Enforces sanitization, length boundaries, honeypot protection, and security metadata.
 */
export const submitInquiry = async (inquiryData) => {
  try {
    const { 
      name, 
      email, 
      message, 
      subject, 
      category, 
      timeline, 
      budget, 
      confidentialityRequested,
      honeypot 
    } = inquiryData;

    // Honeypot anti-bot defense: bots auto-fill hidden honeypots
    if (honeypot && String(honeypot).trim().length > 0) {
      // Silently return success to waste bot compute without writing to Firestore
      return { success: true, id: 'discarded-bot-trap' };
    }

    // Strict input trimming & length validation (aligned with firestore.rules)
    const trimmedName = (name || '').trim().slice(0, 200);
    const trimmedEmail = (email || '').trim().toLowerCase().slice(0, 254);
    const trimmedMessage = (message || '').trim().slice(0, 5000);

    if (!trimmedName || trimmedName.length < 2) {
      return { success: false, error: 'Please provide a valid name or organization (minimum 2 characters).' };
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length < 4 || !EMAIL_REGEX.test(trimmedEmail)) {
      return { success: false, error: 'Please provide a valid direct email address.' };
    }

    if (!trimmedMessage || trimmedMessage.length < 5) {
      return { success: false, error: 'Please outline your project scope or system challenge (minimum 5 characters).' };
    }

    // Generate unique message document reference in messages collection
    const targetRef = doc(collection(db, 'messages'));
    const nowIso = new Date().toISOString();

    const payload = {
      id: targetRef.id,
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      subject: (subject || `Consultation: ${category || 'General'}`).trim().slice(0, 200),
      category: (category || 'AI Systems').trim().slice(0, 100),
      problem: trimmedMessage,
      timeline: (timeline || 'STANDARD').trim().slice(0, 100),
      budget: (budget || 'MVP / Production Build ($5k - $20k)').trim().slice(0, 100),
      confidentialityRequested: Boolean(confidentialityRequested),
      status: 'UNREAD',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // setDoc creates the document in Firestore
    await setDoc(targetRef, payload);

    return { 
      success: true, 
      id: targetRef.id,
      receiptTimestamp: nowIso 
    };
  } catch (err) {
    console.error('Submit inquiry error:', err);
    return { 
      success: false, 
      error: err.message || 'Transmission failed. Please check network connectivity and try again.' 
    };
  }
};

/**
 * FETCH ALL INQUIRIES (Founder Protected)
 */
export const getInquiries = async () => {
  try {
    if (!auth?.currentUser || !isAuthorizedFounderEmail(auth.currentUser.email)) {
      return [];
    }
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (err) {
    console.error('Get inquiries error:', err);
    handleFirestoreError(err, OperationType.LIST, 'messages');
    return [];
  }
};

/**
 * UPDATE INQUIRY STATUS (Founder Protected)
 */
export const updateInquiryStatus = async (inquiryId, status) => {
  try {
    if (!auth?.currentUser || !isAuthorizedFounderEmail(auth.currentUser.email)) {
      return { success: false, error: 'Unauthorized founder session' };
    }
    const docRef = doc(db, 'messages', inquiryId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    await logActivity('INQUIRY_STATUS_UPDATED', `Inquiry ${inquiryId} marked as ${status}`, { inquiryId, status });
    return { success: true };
  } catch (err) {
    console.error('Update inquiry status error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * DELETE INQUIRY (Founder Protected)
 */
export const deleteInquiry = async (inquiryId) => {
  try {
    if (!auth?.currentUser || !isAuthorizedFounderEmail(auth.currentUser.email)) {
      return { success: false, error: 'Unauthorized founder session' };
    }
    await deleteDoc(doc(db, 'messages', inquiryId));
    await logActivity('INQUIRY_DELETED', `Inquiry ${inquiryId} deleted`, { inquiryId });
    return { success: true };
  } catch (err) {
    console.error('Delete inquiry error:', err);
    return { success: false, error: err.message };
  }
};

