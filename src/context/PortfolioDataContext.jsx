import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { seedInitialDatabase } from '../lib/dbService';
import {
  IDENTITY as DEFAULT_IDENTITY,
  DEFAULT_SOCIAL_LINKS,
  CURATED_PROJECTS as DEFAULT_PROJECTS,
  AI_SYSTEMS as DEFAULT_AI_SYSTEMS,
  PROFESSIONAL_JOURNEY as DEFAULT_JOURNEY,
  PROOF_MATRIX as DEFAULT_PROOF,
  APPS_HUB as DEFAULT_APPS,
  DEFAULT_CERTIFICATES,
} from '../data/portfolioData';

const PortfolioDataContext = createContext(null);

const normalizeIdentity = (data) => {
  if (!data) return DEFAULT_IDENTITY;
  const rawLinks = data.socialLinks || {};
  return {
    ...data,
    socialLinks: {
      instagram: {
        url: (rawLinks.instagram?.url && rawLinks.instagram.url.trim().length > 0)
          ? rawLinks.instagram.url
          : DEFAULT_SOCIAL_LINKS.instagram.url,
        label: rawLinks.instagram?.label || 'Instagram',
        visibility: rawLinks.instagram?.visibility || 'PUBLIC',
        sortOrder: rawLinks.instagram?.sortOrder ?? 1,
      },
      linkedin: {
        url: (rawLinks.linkedin?.url && rawLinks.linkedin.url.includes('sahil-bhatia-b3bb3a3a2'))
          ? rawLinks.linkedin.url
          : (typeof rawLinks.linkedin === 'string' && rawLinks.linkedin.includes('sahil-bhatia-b3bb3a3a2')
            ? rawLinks.linkedin
            : DEFAULT_SOCIAL_LINKS.linkedin.url),
        label: rawLinks.linkedin?.label || 'LinkedIn',
        visibility: rawLinks.linkedin?.visibility || 'PUBLIC',
        sortOrder: rawLinks.linkedin?.sortOrder ?? 2,
      },
      github: {
        url: (rawLinks.github?.url && rawLinks.github.url.includes('github.com'))
          ? rawLinks.github.url
          : (typeof rawLinks.github === 'string' && rawLinks.github.includes('github.com')
            ? rawLinks.github
            : DEFAULT_SOCIAL_LINKS.github.url),
        label: rawLinks.github?.label || 'GitHub',
        visibility: rawLinks.github?.visibility || 'PUBLIC',
        sortOrder: rawLinks.github?.sortOrder ?? 3,
      },
    },
  };
};

export const PortfolioDataProvider = ({ children }) => {
  const [identity, setIdentity] = useState(() => normalizeIdentity(DEFAULT_IDENTITY));
  const [featuredPortrait, setFeaturedPortrait] = useState({
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 35,
    altText: 'Sahil Bhatia — AI Systems Architect',
    visibility: 'PUBLIC',
    featured: true,
  });
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'SAHIL BHATIA — AI PORTFOLIO & SYSTEMS',
    metaDescription: 'AI Generalist, AI Consultant & Digital Systems Creator.',
    domain: 'SAHILBHATIA.COM',
    systemName: 'SAHIL / PORTFOLIO OS',
    version: 'v2.6.4',
    accentColor: '#FF2A3A',
    contactEmail: 'sahilbhatia7474@gmail.com',
    announcementBanner: 'FOUNDER VAULT CMS v2.6 ACTIVE // DIRECT DISTRIBUTION ONLINE',
    maintenanceMode: false,
  });

  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // Includes drafts for founder
  const [aiSystems] = useState(DEFAULT_AI_SYSTEMS);
  const [journey, setJourney] = useState(DEFAULT_JOURNEY);
  const [allJourney, setAllJourney] = useState([]);
  const [education, setEducation] = useState([]);
  const [certificates, setCertificates] = useState(DEFAULT_CERTIFICATES);
  const [proof, setProof] = useState(DEFAULT_PROOF);
  const [apps, setApps] = useState(DEFAULT_APPS);
  const [allApps, setAllApps] = useState([]);
  const [media, setMedia] = useState([]);
  const [navigation, setNavigation] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState('PUBLISHED'); // 'PUBLISHED' or 'DRAFT'
  const [syncKey, setSyncKey] = useState(0);

  const refreshAllData = useCallback(() => {
    setSyncKey((k) => k + 1);
  }, []);

  useEffect(() => {
    // Attempt automatic seed on first run
    seedInitialDatabase().catch((e) => console.warn('Auto-seed check note:', e.message));

    const unsubs = [];

    try {
      // Identity
      const idDoc = doc(db, 'identity', 'primary');
      unsubs.push(
        onSnapshot(idDoc, (snap) => {
          if (snap.exists()) setIdentity((prev) => normalizeIdentity({ ...prev, ...snap.data() }));
        }, (err) => console.warn('Identity snap warning:', err.message))
      );

      // Featured Portrait
      const portDoc = doc(db, 'featuredPortrait', 'primary');
      unsubs.push(
        onSnapshot(portDoc, (snap) => {
          if (snap.exists()) setFeaturedPortrait((prev) => ({ ...prev, ...snap.data() }));
        }, (err) => console.warn('Portrait snap warning:', err.message))
      );

      // Site Settings
      const settingsDoc = doc(db, 'siteSettings', 'primary');
      unsubs.push(
        onSnapshot(settingsDoc, (snap) => {
          if (snap.exists()) setSiteSettings((prev) => ({ ...prev, ...snap.data() }));
        }, (err) => console.warn('Settings snap warning:', err.message))
      );

      // Projects
      const projCol = collection(db, 'projects');
      unsubs.push(
        onSnapshot(projCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setAllProjects(list);
            setProjects(list.filter((p) => p.status === 'PUBLISHED' && p.visibility === 'PUBLIC'));
          } else {
            setProjects(DEFAULT_PROJECTS);
            setAllProjects(DEFAULT_PROJECTS);
          }
        }, () => {
          setProjects(DEFAULT_PROJECTS);
          setAllProjects(DEFAULT_PROJECTS);
        })
      );

      // Journey
      const journeyCol = collection(db, 'journey');
      unsubs.push(
        onSnapshot(journeyCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setAllJourney(list);
            setJourney(list.filter((j) => j.status === 'PUBLISHED' && j.visibility === 'PUBLIC'));
          } else {
            setJourney(DEFAULT_JOURNEY.filter((j) => j.verified));
            setAllJourney(DEFAULT_JOURNEY);
          }
        }, () => {
          setJourney(DEFAULT_JOURNEY.filter((j) => j.verified));
          setAllJourney(DEFAULT_JOURNEY);
        })
      );

      // Certificates
      const certCol = collection(db, 'certificates');
      unsubs.push(
        onSnapshot(certCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setCertificates(list);
          }
        }, () => {})
      );

      // Education
      const eduCol = collection(db, 'education');
      unsubs.push(
        onSnapshot(eduCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setEducation(list);
          }
        }, () => {})
      );

      // Proof
      const proofCol = collection(db, 'proof');
      unsubs.push(
        onSnapshot(proofCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setProof(list);
          } else {
            setProof(DEFAULT_PROOF);
          }
        }, () => setProof(DEFAULT_PROOF))
      );

      // Apps
      const appsCol = collection(db, 'apps');
      unsubs.push(
        onSnapshot(appsCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
            setAllApps(list);
            setApps(list.filter((a) => a.status === 'PUBLISHED' && a.visibility === 'PUBLIC'));
          } else {
            setApps(DEFAULT_APPS);
            setAllApps(DEFAULT_APPS);
          }
        }, () => {
          setApps(DEFAULT_APPS);
          setAllApps(DEFAULT_APPS);
        })
      );

      // Media
      const mediaCol = collection(db, 'media');
      unsubs.push(
        onSnapshot(mediaCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setMedia(list);
          }
        }, () => {})
      );

      // Navigation
      const navCol = collection(db, 'navigation');
      unsubs.push(
        onSnapshot(navCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => (a.order || a.sortOrder || 99) - (b.order || b.sortOrder || 99));
            setNavigation(list);
          }
        }, () => {})
      );

      // Activity Log
      const actCol = collection(db, 'activityLog');
      unsubs.push(
        onSnapshot(actCol, (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
            setActivityLogs(list);
          }
          setLoading(false);
        }, () => setLoading(false))
      );
    } catch (err) {
      console.warn('Portfolio data setup warning:', err);
      setLoading(false);
    }

    return () => {
      unsubs.forEach((unsub) => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, [syncKey]);

  // Determine active displayed projects based on previewMode
  const displayedProjects = previewMode === 'DRAFT' ? allProjects : projects;
  const displayedJourney = previewMode === 'DRAFT' ? allJourney : journey;
  const displayedApps = previewMode === 'DRAFT' ? allApps : apps;

  return (
    <PortfolioDataContext.Provider
      value={{
        identity,
        featuredPortrait,
        siteSettings,
        projects: displayedProjects,
        allProjects,
        aiSystems,
        journey: displayedJourney,
        allJourney,
        education,
        certificates,
        proof,
        proofItems: proof,
        allProof: proof,
        apps: displayedApps,
        allApps,
        media,
        navigation,
        activityLogs,
        loading,
        previewMode,
        setPreviewMode,
        refreshAllData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};
