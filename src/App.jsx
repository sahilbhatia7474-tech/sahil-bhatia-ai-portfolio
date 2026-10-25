import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext';
import { ThemeProvider } from './context/ThemeContext';
import SystemBootLoader from './components/SystemBootLoader';
import CustomCursor from './components/CustomCursor';
import CaptainAmericaShieldBackground from './components/CaptainAmericaShieldBackground';
import DynamicAmbientLightBackdrop from './components/DynamicAmbientLightBackdrop';
import Navigation from './components/Navigation';
import CRTScanlineOverlay from './components/CRTScanlineOverlay';
// Lazy-load floating AI assistant
const AIAssistant = lazy(() => import('./components/AIAssistant'));
import Hero from './components/Hero';
import CapabilityMap from './components/CapabilityMap';
import Projects from './components/Projects';

// Eagerly imported portfolio sections to eliminate scrolling rendering lag and late appearances
import AISystems from './components/AISystems';
import AICaseStudyMetrics from './components/AICaseStudyMetrics';
import Proof from './components/Proof';
import Certificates from './components/Certificates';
import FutureVault from './components/FutureVault';
import AppsHub from './components/AppsHub';
import Contact from './components/Contact';
import Footer from './components/Footer';
const PortfolioTerminal = lazy(() => import('./components/PortfolioTerminal'));

import ScrollJumpInstrument from './components/ScrollJumpInstrument';
import SpatialSectionDivider from './components/SpatialSectionDivider';
import { ShieldAlert, Lock } from 'lucide-react';

// Lazy-load secondary pages to keep the initial landing bundle fast and lightweight
const JourneyPage = lazy(() => import('./pages/JourneyPage'));
const BusinessInfoPage = lazy(() => import('./pages/BusinessInfoPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));

// Lazy-load private Founder Vault CMS to isolate bundle size from public portfolio
const VaultLayout = lazy(() => import('./components/vault/VaultLayout'));
import ProtectedRoute from './components/vault/ProtectedRoute';
import VaultPageTransitionOverlay from './components/vault/VaultPageTransitionOverlay';

// Route Section Smooth Scroller
function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;

    if (hash) {
      try {
        const cleanId = hash.replace(/^#/, '');
        const el = document.getElementById(cleanId) || (hash.length > 1 ? document.querySelector(hash) : null);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
        }
      } catch {
        // Safe fallback for non-selector hashes
      }
      return;
    }

    const routeSectionMap = {
      '/projects': 'projects',
      '/ai-systems': 'ai-systems',
      '/benchmarks': 'benchmarks',
      '/case-studies': 'benchmarks',
      '/proof': 'proof',
      '/certificates': 'certificates',
      '/future-vault': 'vault',
      '/apps': 'apps',
      '/contact': 'contact',
    };

    const sectionId = routeSectionMap[path];
    if (sectionId) {
      try {
        const el = document.getElementById(sectionId);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120);
        }
      } catch {
        // Safe fallback
      }
    } else if (path === '/' || path.startsWith('/vault') || path === '/resume') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        // Safe fallback
      }
    }
  }, [location.pathname, location.hash]);

  return null;
}

// Public Experience Shell
function PublicExperience() {
  const [booting, setBooting] = useState(false);
  const { siteSettings, previewMode, setPreviewMode } = usePortfolioData();
  const { isFounderSession, lockVault } = useAuth();

  useEffect(() => {
    document.title = 'SAHIL BHATIA — AI Portfolio & Systems';
    // Ensure vault is locked when viewing the public experience so that clicking Founder Vault opens the lock page first
    if (lockVault) {
      lockVault();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBootComplete = () => {
    try {
      sessionStorage.setItem('sahil_os_booted', 'true');
    } catch {
      // safe fallback
    }
    setBooting(false);
  };

  // If maintenance mode is enabled and user is not verified founder
  if (siteSettings?.maintenanceMode && !isFounderSession) {
    return (
      <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <div className="max-w-md w-full bg-[#0d0e14] border border-red-500/30 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-xl bg-red-600/10 border border-red-500/40 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="font-mono text-xs text-red-400 uppercase tracking-widest mb-1">
              SYSTEM STATUS // CALIBRATION
            </div>
            <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-white">
              {siteSettings?.systemName || 'PORTFOLIO OS'}
            </h1>
            <p className="text-xs text-neutral-400 mt-2 font-sans leading-relaxed">
              Public services are momentarily suspended for scheduled database replication and systems calibration.
            </p>
          </div>

          <div className="p-3.5 rounded bg-black/40 border border-white/5 font-mono text-[11px] text-neutral-500 text-left space-y-1">
            <div>SYSTEM: {siteSettings?.systemName || 'PORTFOLIO OS'}</div>
            <div>STATUS: MAINTENANCE_ACTIVE</div>
            <div>CALIBRATION: PORTFOLIO REPLICATION ACTIVE</div>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono">
            <span className="text-neutral-500">Authorized Personnel:</span>
            <Link
              to="/vault"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Founder Vault</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#070708] min-h-screen text-neutral-100 relative selection:bg-red-600 selection:text-white font-sans antialiased">
      {/* System Initialization Boot Sequence */}
      {booting && <SystemBootLoader onComplete={handleBootComplete} />}

      {/* CMS Preview Mode Banner — Deep Dark HUD Treatment (Visible ONLY to Authenticated Founder in DRAFT Mode) */}
      {isFounderSession && previewMode === 'DRAFT' && (
        <div
          id="founder-preview-hud"
          className="bg-[#090a0f]/95 backdrop-blur-md text-white px-4 h-9 min-h-[36px] text-xs font-mono border-b border-red-500/30 flex items-center justify-between z-[100] sticky top-0 shadow-2xl"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2a3a]" />
            <span className="tracking-wide text-neutral-200">
              <span className="text-red-400 font-bold">FOUNDER PREVIEW</span>
              <span className="text-neutral-500 mx-1.5">|</span>
              <span className="text-neutral-300">DRAFT MODE &middot; UNPUBLISHED CONTENT</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/vault"
              className="px-2.5 py-0.5 bg-white/10 hover:bg-white/20 text-white rounded border border-white/15 text-[11px] uppercase tracking-wider transition-colors"
            >
              Return to Vault
            </Link>
            <button
              onClick={() => setPreviewMode('PUBLISHED')}
              className="px-2.5 py-0.5 bg-red-950/50 hover:bg-red-900/60 text-red-300 rounded border border-red-500/30 text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Bar */}
      {siteSettings?.showAnnouncement && siteSettings?.announcementBanner && (
        <div className="bg-[#12080a] text-neutral-200 px-4 py-2 text-xs font-mono border-b border-red-500/20 flex items-center justify-center gap-2 text-center relative z-40">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>{siteSettings.announcementBanner}</span>
        </div>
      )}

      {/* Precision Ambient Light Follower & Custom Cursor */}
      <CustomCursor />

      {/* Global Fixed Captain America Vibranium Shield - Centered in Viewport across Entire Website */}
      <CaptainAmericaShieldBackground />

      {/* Dynamic Ambient Light Layer behind Main Content Containers (Color Temp & Intensity Responsive) */}
      <DynamicAmbientLightBackdrop />

      {/* Fixed Sticky Header Navigation */}
      <Navigation />

      {/* Floating AI Portfolio Assistant & Navigation Engine */}
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>

      {/* Floating Navigation Instrument (Jump to Mid / Back to Top) */}
      <ScrollJumpInstrument />

      {/* Floating Interactive Command Terminal Component (Query the Portfolio) */}
      <Suspense fallback={null}>
        <PortfolioTerminal />
      </Suspense>

      {/* Main Structural Portfolio Content */}
      <main className="relative z-10">
        {/* 1. IDENTITY & STATEMENT */}
        <Hero />

        <SpatialSectionDivider index="01" label="CAPABILITIES MATRIX" accent="crimson" />

        {/* 2. CAPABILITY MAP / SKILLS */}
        <CapabilityMap />

        <SpatialSectionDivider index="02" label="VERIFIED SYSTEMS" accent="ruby" />

        {/* 3. CURATED PROJECTS (7 Verified Projects) */}
        <Projects />

        <SpatialSectionDivider index="03" label="AGENTIC ARCHITECTURE" accent="violet" />
        {/* 4. AI SYSTEMS ARCHITECTURE */}
        <AISystems />

        <SpatialSectionDivider index="04" label="EMPIRICAL BENCHMARKS & METRICS" accent="ruby" />
        {/* 4.5 AI ENGINEERING CASE STUDIES & COMPARATIVE BENCHMARKS */}
        <AICaseStudyMetrics />

        <SpatialSectionDivider index="05" label="AUDIT & PROOF MATRIX" accent="emerald" />
        {/* 5. PROOF & EVIDENCE MATRIX */}
        <Proof />

        <SpatialSectionDivider index="06" label="CREDENTIALS & HONORS" accent="teal" />
        {/* 6. CERTIFICATES & CREDENTIALS */}
        <Certificates />

        <SpatialSectionDivider index="07" label="ARCHIVAL VAULT" accent="amber" />
        {/* 7. FUTURE VAULT */}
        <FutureVault />

        <SpatialSectionDivider index="08" label="DISTRIBUTION HUB" accent="cyan" />
        {/* 8. APPS DISTRIBUTION HUB */}
        <AppsHub />

        <SpatialSectionDivider index="09" label="DIRECT INTERFACE" accent="crimson" />
        {/* 9. DIRECT CHANNEL & CONTACT */}
        <Contact />
      </main>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}

// Master Application Component with Providers & Routing
function App() {
  const [vaultTransition, setVaultTransition] = useState({
    isOpen: false,
    direction: 'gateway',
    role: 'FOUNDER_OWNER',
    customTitle: '',
    customSubtitle: '',
  });

  useEffect(() => {
    const handleVaultTransition = (e) => {
      if (!e || !e.detail) return;
      setVaultTransition((prev) => ({
        ...prev,
        ...e.detail,
      }));
    };
    window.addEventListener('vault-transition', handleVaultTransition);
    return () => window.removeEventListener('vault-transition', handleVaultTransition);
  }, []);

  // Pre-warm Founder Vault layout in background so entering is instantaneous
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      import('./components/vault/VaultLogin').catch(() => null);
      import('./components/vault/VaultLayout').catch(() => null);
    }, 1500);
    return () => clearTimeout(idleTimer);
  }, []);

  return (
    <BrowserRouter>
      {/* Route Section & Top Scroll Orchestrator */}
      <ScrollManager />

      {/* Hardware-Accelerated Cyber Page Transition Overlay across all routes */}
      <VaultPageTransitionOverlay
        isOpen={vaultTransition.isOpen}
        direction={vaultTransition.direction}
        role={vaultTransition.role}
        customTitle={vaultTransition.customTitle}
        customSubtitle={vaultTransition.customSubtitle}
      />

      {/* Cinematic CRT Monitor Horizontal Scanline Overlay */}
      <CRTScanlineOverlay />

      <ThemeProvider>
        <AuthProvider>
          <PortfolioDataProvider>
            <Routes>
              {/* Private Founder Vault Route */}
              <Route
                path="/vault/*"
                element={
                  <ProtectedRoute>
                    <Suspense
                      fallback={
                        <div className="w-full min-h-screen bg-[#040509]" />
                      }
                    >
                      <VaultLayout />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Public Portfolio Experience with Sub-Routes */}
              <Route path="/" element={<PublicExperience />} />
              <Route path="/projects" element={<PublicExperience />} />
              <Route path="/ai-systems" element={<PublicExperience />} />
              <Route
                path="/journey"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708] flex items-center justify-center font-mono text-xs text-neutral-400">Loading Professional Journey Timeline...</div>}>
                    <JourneyPage />
                  </Suspense>
                }
              />
              <Route
                path="/resume"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708] flex items-center justify-center font-mono text-xs text-neutral-400">Loading Resume & Curriculum Vitae...</div>}>
                    <ResumePage />
                  </Suspense>
                }
              />
              <Route
                path="/cv"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708] flex items-center justify-center font-mono text-xs text-neutral-400">Loading Resume & Curriculum Vitae...</div>}>
                    <ResumePage />
                  </Suspense>
                }
              />
              <Route path="/proof" element={<PublicExperience />} />
              <Route path="/future-vault" element={<PublicExperience />} />
              <Route path="/apps" element={<PublicExperience />} />
              <Route path="/contact" element={<PublicExperience />} />

              {/* Real Working Legal & Business Routes */}
              <Route
                path="/business-info"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <BusinessInfoPage />
                  </Suspense>
                }
              />
              <Route
                path="/business"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <BusinessInfoPage />
                  </Suspense>
                }
              />
              <Route
                path="/services"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <ServicesPage />
                  </Suspense>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <PrivacyPolicyPage />
                  </Suspense>
                }
              />
              <Route
                path="/privacy"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <PrivacyPolicyPage />
                  </Suspense>
                }
              />
              <Route
                path="/terms-and-conditions"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <TermsPage />
                  </Suspense>
                }
              />
              <Route
                path="/terms"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <TermsPage />
                  </Suspense>
                }
              />
              <Route
                path="/refund-policy"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <RefundPolicyPage />
                  </Suspense>
                }
              />
              <Route
                path="/refund-and-cancellation"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <RefundPolicyPage />
                  </Suspense>
                }
              />
              <Route
                path="/refund"
                element={
                  <Suspense fallback={<div className="min-h-screen bg-[#070708]" />}>
                    <RefundPolicyPage />
                  </Suspense>
                }
              />

              <Route path="*" element={<PublicExperience />} />
            </Routes>
          </PortfolioDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
