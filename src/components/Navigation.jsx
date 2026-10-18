import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowUpRight, Cpu, Lock, Search, Bot, Compass } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import GlobalSearch from './GlobalSearch';
import VerticalJourneyTimeline from './VerticalJourneyTimeline';
import GitHubContributionHeatmap from './GitHubContributionHeatmap';
import { useBodyScrollLock } from '../lib/scrollLock';

const DEFAULT_NAV = [
  { label: 'Identity', path: '/' },
  { label: 'Capabilities', path: '/#capabilities' },
  { label: 'Projects', path: '/projects' },
  { label: 'AI Systems', path: '/ai-systems' },
  { label: 'Benchmarks', path: '/benchmarks' },
  { label: 'Proof', path: '/proof' },
  { label: 'Certificates', path: '/certificates' },
  { label: 'Future Vault', path: '/future-vault' },
  { label: 'Apps', path: '/apps' },
];

const Navigation = () => {
  const { identity, siteSettings, navigation } = usePortfolioData();
  const { lockVault } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isJourneyTimelineOpen, setIsJourneyTimelineOpen] = useState(false);
  const flareRef = useRef(null);
  const glareRef = useRef(null);

  // Unified body scroll lock management for mobile navigation drawer
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    let ticking = false;
    let cachedDocHeight = typeof document !== 'undefined' ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 4000;

    const handleResize = () => {
      cachedDocHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const isScrolled = currentY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

          if (progressBarRef.current) {
            const progress = cachedDocHeight > 0 ? Math.min(100, Math.max(0, (currentY / cachedDocHeight) * 100)) : 0;
            progressBarRef.current.style.width = `${progress}%`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K & Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setMobileMenuOpen(false);
        setSearchOpen((prev) => !prev);
      }
    };

    const handleCustomOpenSearch = () => {
      setMobileMenuOpen(false);
      setSearchOpen(true);
    };

    const handleCustomCloseSearch = () => {
      setSearchOpen(false);
    };

    const handleCustomToggleSearch = () => {
      setMobileMenuOpen(false);
      setSearchOpen((prev) => !prev);
    };

    const handleCustomOpenJourney = () => {
      setMobileMenuOpen(false);
      setIsJourneyTimelineOpen(true);
    };

    const handleCustomCloseJourney = () => {
      setIsJourneyTimelineOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-global-search', handleCustomOpenSearch);
    window.addEventListener('close-global-search', handleCustomCloseSearch);
    window.addEventListener('toggle-global-search', handleCustomToggleSearch);
    window.addEventListener('open-journey-timeline', handleCustomOpenJourney);
    window.addEventListener('close-journey-timeline', handleCustomCloseJourney);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-global-search', handleCustomOpenSearch);
      window.removeEventListener('close-global-search', handleCustomCloseSearch);
      window.removeEventListener('toggle-global-search', handleCustomToggleSearch);
      window.removeEventListener('open-journey-timeline', handleCustomOpenJourney);
      window.removeEventListener('close-journey-timeline', handleCustomCloseJourney);
    };
  }, []);

  // Escape key closes mobile menu & search modal if open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (searchOpen) setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, searchOpen]);

  const handleHeaderMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round((((e.clientX - rect.left) / rect.width) * 100) * 10) / 10;
    const y = Math.round((((e.clientY - rect.top) / rect.height) * 100) * 10) / 10;
    if (flareRef.current) {
      flareRef.current.style.background = `radial-gradient(420px circle at ${x}%, rgba(255,42,58,0.95), transparent 85%)`;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(550px circle at ${x}% ${y}%, rgba(255,42,58,0.16) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)`;
    }
  };

  const handleHeaderMouseLeave = () => {
    if (flareRef.current) {
      flareRef.current.style.background = 'linear-gradient(90deg, transparent, rgba(255,42,58,0.7) 50%, transparent)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0.35';
    }
  };

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const cleanId = path.replace('/#', '').replace('/', '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = navigation && navigation.length > 0
    ? navigation.filter((n) => n.visible !== false).map((n) => ({ label: n.label, path: n.target }))
    : DEFAULT_NAV;

  return (
    <>
      <header
        onMouseMove={handleHeaderMouseMove}
        onMouseLeave={handleHeaderMouseLeave}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen overflow-y-auto' : 'overflow-hidden'
        } ${
          scrolled
            ? 'bg-[#05060b]/95 backdrop-blur-2xl border-b border-white/[0.18] py-2.5 sm:py-3 shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_35px_rgba(255,42,58,0.2),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.8)]'
            : 'bg-[#05060b]/80 backdrop-blur-xl border-b border-white/[0.12] py-3.5 sm:py-4 shadow-[0_16px_45px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.14)]'
        }`}
      >
        {/* Specular Top Horizon Flare Line with Dynamic Cursor Alignment */}
        <div
          ref={flareRef}
          className="absolute top-0 inset-x-0 h-[1.5px] pointer-events-none transition-all duration-300"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,42,58,0.7) 50%, transparent)',
            boxShadow: '0 0 16px rgba(255,42,58,0.6)',
          }}
        />

        {/* Real-time Dynamic Laser Scroll Progress Horizon Beam */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-red-500 via-rose-400 to-cyan-400 shadow-[0_0_12px_#ff2a3a] transition-all duration-75 pointer-events-none z-20"
          style={{ width: '0%' }}
        />

        {/* Dynamic Interactive Volumetric Glare Layer */}
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
          style={{
            opacity: 0.35,
            background: 'radial-gradient(550px circle at 50% 50%, rgba(255,42,58,0.16) 0%, rgba(255,255,255,0.03) 30%, transparent 70%)',
          }}
        />
        
        {/* Ambient Top Glow Diffuser */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-red-500/12 blur-2xl pointer-events-none" />

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10 transition-all duration-300"
          style={{
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'optimizeLegibility',
          }}
        >
          {/* Brand / OS Identity with 3D Holographic AI Neural Chip (CSS Selector 3) */}
          <Link
            to="/"
            onClick={() => handleNavClick('/')}
            className="group flex items-center gap-3.5 select-none cursor-pointer"
            aria-label="Sahil Bhatia Portfolio OS Home"
          >
            {/* 3D Holographic Micro-Architecture Chip Chassis */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-[#24273d] via-[#121422] to-[#07080e] border border-white/30 group-hover:border-red-500/90 shadow-[0_10px_25px_rgba(0,0,0,0.95),0_0_16px_rgba(255,42,58,0.25),inset_0_1px_0_rgba(255,255,255,0.45)] group-hover:shadow-[0_0_32px_rgba(255,42,58,0.8),0_12px_28px_rgba(0,0,0,0.95)] transition-all duration-300 flex items-center justify-center group-hover:scale-105 active:scale-95 overflow-hidden shrink-0">
              {/* Corner Cybernetic Notches */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-red-400/80 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-400/80 pointer-events-none" />
              
              {/* Specular Diagonal Glint Sweep on Hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* Quantum Core Processor Symbol with Multi-Layer Neural Die (CSS Selector 2: rect) */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,42,58,0.9)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Circuit Traces & Bus Leads */}
                <path d="M9 2V4M15 2V4M9 20V22M15 20V22M2 9H4M2 15H4M20 9H22M20 15H22" stroke="rgba(255,42,58,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                {/* Central Silicon Processor Die (Rect targeted by CSS Selector 2) */}
                <rect
                  x="4.5"
                  y="4.5"
                  width="15"
                  height="15"
                  rx="3"
                  className="fill-[#14080d] stroke-red-500/90 group-hover:stroke-cyan-400 group-hover:fill-[#08121d] transition-all duration-300"
                  strokeWidth="1.5"
                />
                {/* Inner Luminous Logic Grid Core */}
                <rect x="8" y="8" width="8" height="8" rx="1.5" className="fill-red-950/90 stroke-red-400/70 group-hover:stroke-cyan-300 group-hover:fill-cyan-950/80 transition-colors" strokeWidth="1" />
                {/* Pulsing Quantum Center Node */}
                <circle cx="12" cy="12" r="2" className="fill-white group-hover:fill-cyan-200 animate-pulse" />
              </svg>

              {/* Ambient Breathing Plasma Backlight */}
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600/35 to-cyan-500/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm sm:text-base tracking-wider text-white group-hover:text-red-400 transition-colors drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                  {identity?.name || 'SAHIL BHATIA'}
                </span>
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute w-3 h-3 rounded-full bg-red-500/60 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span className="font-mono text-[10px] text-neutral-300 tracking-wider group-hover:text-white transition-colors font-bold">
                  {siteSettings?.systemName || 'PORTFOLIO OS'} // LIVE
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items — Floating Sculpted Glass Matrix Dock */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-2xl bg-[#090b13]/85 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl ring-1 ring-black/40">
            {navItems.map((item) => {
              const isRouteActive = location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/');
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-mono tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isRouteActive
                      ? 'text-white bg-gradient-to-b from-[#1f2235] to-[#121321] border border-red-500/40 shadow-[0_4px_16px_rgba(255,42,58,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] font-bold -translate-y-0.5'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.08] hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 active:scale-95'
                  }`}
                >
                  {isRouteActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Group: Global Search, Founder Vault & Contact — 3D Tactile Instruments */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Global Search Trigger — 3D Tactile Instrument (CSS Selector 4) */}
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#1b1e2f] via-[#121422] to-[#0a0b14] border border-white/25 hover:border-cyan-400 text-white text-xs font-mono transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.7)] hover:shadow-[0_0_24px_rgba(34,211,238,0.35),0_10px_28px_rgba(0,0,0,0.95)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer touch-manipulation group relative overflow-hidden"
              title="Global Intelligent Search (⌘K)"
              aria-label="Global Intelligent Search"
              aria-expanded={searchOpen}
            >
              {/* Specular Glint Sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <div className="relative flex items-center justify-center">
                <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-200" />
                <span className="absolute -inset-1 rounded-full bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <span className="hidden xl:inline text-neutral-200 group-hover:text-white font-bold tracking-wider transition-colors">
                Search
              </span>

              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/[0.14] border border-white/30 rounded-md text-white font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.6)] font-black group-hover:border-cyan-400/60 group-hover:text-cyan-200 group-hover:bg-cyan-950/60 transition-all">
                ⌘K
              </kbd>
            </button>

            {/* Persistent Crazy Glowing Founder Vault Access */}
            <Link
              to="/vault"
              onMouseEnter={() => {
                import('./vault/VaultLogin').catch(() => null);
                import('./vault/VaultLayout').catch(() => null);
              }}
              onTouchStart={() => {
                import('./vault/VaultLogin').catch(() => null);
                import('./vault/VaultLayout').catch(() => null);
              }}
              onClick={() => lockVault && lockVault()}
              className="relative group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2a0e1a] via-[#1a0b16] to-[#0c1222] border border-red-500/60 hover:border-cyan-400 text-white text-xs font-mono transition-all duration-300 shadow-[0_0_24px_rgba(255,42,58,0.35),0_8px_20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(34,211,238,0.5),0_12px_28px_rgba(0,0,0,0.95)] hover:scale-105 active:scale-95 cursor-pointer touch-manipulation overflow-hidden"
              title="Founder Vault Security Gateway (Requires Passcode or Clearance to enter)"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-cyan-500/10 opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-red-500/60 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#ff2a3a]" />
                </span>
                <span className="font-bold tracking-wider text-white group-hover:text-cyan-200 transition-colors">
                  FOUNDER VAULT
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-400/40 transition-colors flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  GATE
                </span>
              </div>
            </Link>

            {/* AI Assistant Direct Access */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#141b34] via-[#0f1528] to-[#090d1c] border border-cyan-400/40 hover:border-cyan-400 text-neutral-100 hover:text-white text-xs font-mono transition-all duration-200 shadow-[0_8px_24px_rgba(6,182,212,0.25),0_2px_8px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 active:translate-y-0.5 cursor-pointer touch-manipulation group"
              title="Ask Sahil AI Assistant"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)] transition-transform" />
              <span className="hidden xl:inline tracking-wider font-bold">AI ASSISTANT</span>
            </button>

            {/* Interactive Terminal Trigger Badge */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-portfolio-terminal'))}
              className="hidden 2xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#12131d] to-[#090a10] hover:bg-[#1a1c2d] border border-white/15 hover:border-red-500/50 font-mono text-[11px] text-neutral-300 shadow-[0_6px_18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer transition-all active:scale-95 group"
              title="Open Interactive Command Terminal (Press `)"
              aria-label="Open Command Terminal"
            >
              <Terminal className="w-3 h-3 text-red-500 drop-shadow-[0_0_6px_rgba(255,42,58,0.8)] group-hover:scale-110 transition-transform" />
              <span className="text-neutral-400">SYS:</span>
              <span className="text-white font-bold">{siteSettings?.systemName || 'SAHIL / OS'}</span>
              <span className="text-[9px] text-red-400 font-bold bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">CLI</span>
            </button>

            {/* Top 3-Lines Cybernetic 3D Matrix Navigation Trigger (CSS Selector 5) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all duration-300 active:scale-95 cursor-pointer touch-manipulation hover:-translate-y-0.5 active:translate-y-0 group relative overflow-hidden select-none ${
                mobileMenuOpen
                  ? 'bg-gradient-to-b from-[#2e1017] via-[#1a080d] to-[#0d0407] border-red-500 text-white shadow-[0_0_32px_rgba(255,42,58,0.55),0_10px_28px_rgba(0,0,0,0.95),inset_0_1.5px_0_rgba(255,255,255,0.4)]'
                  : 'bg-gradient-to-b from-[#22253a] via-[#131525] to-[#090a12] border-white/30 text-white hover:border-red-500/90 shadow-[0_10px_26px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.38),inset_0_-2px_0_rgba(0,0,0,0.65)] hover:shadow-[0_0_28px_rgba(255,42,58,0.4),0_12px_30px_rgba(0,0,0,0.95)]'
              }`}
              title="System Navigation Matrix Menu"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {/* Corner High-Tech Micro-Notches */}
              <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-red-400/80 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-cyan-400/80 pointer-events-none" />

              {/* Specular Glint Sweep on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              {/* 3D Morphing Laser Matrix Mechanism */}
              <div className="relative w-5 h-4.5 flex flex-col justify-between items-center pointer-events-none py-0.5 shrink-0">
                {/* Top 3D Laser Blade */}
                <span
                  className={`h-[2.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center ${
                    mobileMenuOpen
                      ? 'w-5 bg-gradient-to-r from-red-500 via-rose-200 to-red-500 rotate-45 translate-y-[6.5px] shadow-[0_0_12px_#ff2a3a]'
                      : 'w-5 bg-gradient-to-r from-white via-neutral-100 to-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:from-red-400 group-hover:via-white group-hover:to-red-400 group-hover:shadow-[0_0_8px_#ff2a3a]'
                  }`}
                />

                {/* Center Quantum Diode & Dynamic Segmented Rails */}
                <div
                  className={`w-5 flex items-center justify-between transition-all duration-300 ease-out ${
                    mobileMenuOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  <span className="h-[2px] w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a] group-hover:w-2 transition-all" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  <span className="h-[2px] w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a] group-hover:w-2 transition-all" />
                </div>

                {/* Center Nexus Hologram Node (Only visible when open to crown the 'X') */}
                {mobileMenuOpen && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-xs rotate-45 bg-gradient-to-tr from-red-600 via-white to-cyan-300 shadow-[0_0_10px_#ff2a3a] border border-white animate-in zoom-in duration-300" />
                )}

                {/* Bottom 3D Laser Blade */}
                <span
                  className={`h-[2.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center ${
                    mobileMenuOpen
                      ? 'w-5 bg-gradient-to-r from-red-500 via-rose-200 to-red-500 -rotate-45 -translate-y-[6.5px] shadow-[0_0_12px_#ff2a3a]'
                      : 'w-5 bg-gradient-to-r from-white via-neutral-100 to-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.9)] group-hover:from-red-400 group-hover:via-white group-hover:to-red-400 group-hover:shadow-[0_0_8px_#ff2a3a]'
                  }`}
                />
              </div>

              <span className="hidden xl:inline text-white font-mono text-xs font-black tracking-wider uppercase group-hover:text-red-300 transition-colors">
                {mobileMenuOpen ? 'DISENGAGE' : 'SYS MENU'}
              </span>
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className={`absolute w-2.5 h-2.5 rounded-full animate-ping ${mobileMenuOpen ? 'bg-red-400/70' : 'bg-red-500/50'}`} />
                <span className={`relative w-1.5 h-1.5 rounded-full ${mobileMenuOpen ? 'bg-red-400 shadow-[0_0_8px_#ff2a3a]' : 'bg-red-500 shadow-[0_0_6px_#ff2a3a]'}`} />
              </span>
            </button>

            {/* Direct Channel CTA */}
            <Link
              to="/contact"
              onClick={() => handleNavClick('/contact')}
              className="group inline-flex items-center gap-2.5 px-4.5 py-2 rounded-xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 text-black font-mono text-xs font-black uppercase tracking-wider hover:from-white hover:to-neutral-100 transition-all duration-200 shadow-[0_16px_40px_rgba(255,255,255,0.32),0_6px_18px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(0,0,0,0.2)] border border-white/90 hover:shadow-[0_20px_50px_rgba(255,255,255,0.45),0_8px_24px_rgba(0,0,0,0.95)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] cursor-pointer touch-manipulation"
            >
              <span>Direct Channel</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Right Controls: Search + Hamburger Toggle with 44px Touch Targets */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen((prev) => !prev);
              }}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-gradient-to-b from-[#1b1e2f] via-[#121422] to-[#0a0b14] border border-white/25 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.22)] active:scale-95 cursor-pointer touch-manipulation transition-all hover:border-cyan-400 group"
              aria-label={searchOpen ? 'Close Search' : 'Open Search'}
              aria-expanded={searchOpen}
            >
              <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer touch-manipulation active:scale-95 group relative overflow-hidden select-none ${
                mobileMenuOpen
                  ? 'bg-gradient-to-b from-[#2e1017] via-[#1a080d] to-[#0d0407] border-red-500 text-white shadow-[0_0_28px_rgba(255,42,58,0.55),inset_0_1.5px_0_rgba(255,255,255,0.4)]'
                  : 'bg-gradient-to-b from-[#22253a] via-[#131525] to-[#090a12] border-white/30 text-white hover:border-red-500/90 shadow-[0_10px_24px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.65)]'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {/* Corner Notches */}
              <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-red-400/80 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-cyan-400/80 pointer-events-none" />

              {/* 3D Morphing Laser Matrix Bars for Mobile */}
              <div className="relative w-5 h-4.5 flex flex-col justify-between items-center pointer-events-none py-0.5 shrink-0">
                <span
                  className={`h-[2.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center ${
                    mobileMenuOpen
                      ? 'w-5 bg-gradient-to-r from-red-500 via-rose-200 to-red-500 rotate-45 translate-y-[6.5px] shadow-[0_0_12px_#ff2a3a]'
                      : 'w-5 bg-gradient-to-r from-white via-neutral-100 to-white/90 group-hover:from-red-400 group-hover:to-red-400 shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                  }`}
                />
                <div
                  className={`w-5 flex items-center justify-between transition-all duration-300 ease-out ${
                    mobileMenuOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  <span className="h-[2px] w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  <span className="h-[2px] w-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a]" />
                </div>

                {mobileMenuOpen && (
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-xs rotate-45 bg-gradient-to-tr from-red-600 via-white to-cyan-300 shadow-[0_0_10px_#ff2a3a] border border-white animate-in zoom-in duration-300" />
                )}

                <span
                  className={`h-[2.5px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center ${
                    mobileMenuOpen
                      ? 'w-5 bg-gradient-to-r from-red-500 via-rose-200 to-red-500 -rotate-45 -translate-y-[6.5px] shadow-[0_0_12px_#ff2a3a]'
                      : 'w-5 bg-gradient-to-r from-white via-neutral-100 to-white/90 group-hover:from-red-400 group-hover:to-red-400 shadow-[0_1px_3px_rgba(0,0,0,0.9)]'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Universal Menu Drawer Backdrop (Click Outside to Close) */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-[65px] bg-black/60 backdrop-blur-sm z-40 cursor-pointer touch-manipulation animate-in fade-in duration-200"
            aria-hidden="true"
          />
        )}

        {/* Universal Menu Drawer (Accessible via 3-lines hamburger icon on all screen sizes) */}
        {mobileMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#0e1122]/98 via-[#090b16]/98 to-[#04050a]/99 border-b border-white/25 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 shadow-[0_35px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(255,42,58,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.85)] relative max-h-[calc(100vh-80px)] overflow-y-auto z-50 text-neutral-100"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            {/* Specular hairline top divider with glowing pulse */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_rgba(255,42,58,0.8)] pointer-events-none" />
            
            {/* Subtle cybernetic micro grid backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none opacity-30" />

            {/* Main Drawer Container with Rich 3D Architectural Depth (CSS Selector 2) */}
            <div
              className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10 p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#121526]/95 via-[#0b0d18]/95 to-[#06070e]/98 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,58,0.12),inset_0_1.5px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.85)]"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}
            >
              
              {/* Drawer Header with Title & Direct Close Button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ff2a3a] animate-pulse" />
                  <span className="font-sans font-extrabold text-sm sm:text-base tracking-wide text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    SYSTEM CONTROL & ACTIVITY MATRIX
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/25 text-red-200 border border-red-500/40 font-bold hidden sm:inline shadow-inner">
                    ENGINEERING HUB
                  </span>
                </div>

                {/* Direct Close Button — 3D Tactile Control Pod (CSS Selector 4) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group relative px-4 py-2 rounded-xl bg-gradient-to-b from-[#252942] via-[#161828] to-[#0c0d17] border border-white/30 hover:border-red-500 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-2 shadow-[0_8px_22px_rgba(0,0,0,0.85),inset_0_1.5px_0_rgba(255,255,255,0.35),inset_0_-1.5px_0_rgba(0,0,0,0.75)] hover:shadow-[0_12px_28px_rgba(255,42,58,0.4),0_0_20px_rgba(255,42,58,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer overflow-hidden touch-manipulation"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                  title="Close System Menu (ESC)"
                  aria-label="Close navigation menu"
                >
                  {/* Specular Diagonal Sweep on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 pointer-events-none" />

                  <span className="w-5 h-5 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(255,42,58,0.7)] shrink-0">
                    <X className="w-3.5 h-3.5 text-red-300" />
                  </span>
                  <span className="text-white group-hover:text-red-200 font-mono font-bold tracking-wider text-xs">
                    CLOSE (ESC)
                  </span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* D3.JS GITHUB CONTRIBUTION ACTIVITY HEAT-MAP                    */}
              {/* ------------------------------------------------------------- */}
              <div className="w-full">
                <GitHubContributionHeatmap />
              </div>

              {/* Quick Actions Tier: Search & Journey */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Search Knowledge Model — 3D Tactile Workstation Module (CSS Selector 3) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#1b2035] via-[#121424] to-[#0a0b14] border-2 border-white/25 hover:border-cyan-400 text-white shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_20px_rgba(34,211,238,0.12),inset_0_1.5px_0_rgba(255,255,255,0.32),inset_0_-2px_0_rgba(0,0,0,0.8)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.98),0_0_32px_rgba(34,211,238,0.35),inset_0_1.5px_0_rgba(255,255,255,0.45)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-200 touch-manipulation cursor-pointer group relative overflow-hidden text-left"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                  title="Search Knowledge Model (⌘K)"
                >
                  {/* Ambient 3D Glint Sweep on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#242c4b] to-[#101322] border border-cyan-400/60 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover:scale-110 group-hover:border-cyan-300 transition-all duration-300 shrink-0">
                      <Search className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="font-sans font-bold text-sm sm:text-base text-white tracking-tight block group-hover:text-cyan-200 transition-colors">
                        Search Knowledge Model...
                      </span>
                      <span className="font-mono text-xs text-neutral-200 block font-medium mt-0.5 tracking-normal">
                        Projects, verified proofs & systems
                      </span>
                    </div>
                  </div>

                  <span className="relative z-10 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#222842] to-[#121524] border border-white/35 text-xs text-cyan-200 font-mono font-black shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4),0_4px_8px_rgba(0,0,0,0.8)] group-hover:border-cyan-400 group-hover:text-white transition-all shrink-0">
                    ⌘K
                  </span>
                </button>

                {/* Professional Journey Timeline — 3D Tactile Station */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsJourneyTimelineOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#29141f] via-[#1a0e16] to-[#0e070c] border-2 border-red-500/50 hover:border-red-400 text-left transition-all duration-200 shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(255,42,58,0.22),inset_0_1.5px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.8)] hover:shadow-[0_22px_48px_rgba(0,0,0,0.98),0_0_35px_rgba(255,42,58,0.4),inset_0_1.5px_0_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] cursor-pointer group relative overflow-hidden"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  <div className="flex items-center gap-3.5 relative z-10 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#421625] to-[#1c0810] border border-red-500/70 flex items-center justify-center shadow-[0_0_16px_rgba(255,42,58,0.6),inset_0_1px_0_rgba(255,255,255,0.35)] group-hover:scale-110 transition-transform shrink-0">
                      <Compass className="w-5 h-5 text-red-300 drop-shadow-[0_0_8px_rgba(255,42,58,0.9)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm sm:text-base text-white tracking-tight">
                          Professional Journey
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-500/25 text-red-200 border border-red-500/40 shrink-0">
                          TIMELINE
                        </span>
                      </div>
                      <span className="text-xs text-neutral-200 block font-mono font-medium mt-0.5">
                        Paytm &rarr; Airtel &rarr; AI Systems Architect
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center gap-1.5 text-xs text-red-300 font-mono font-bold group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                    <span>EXPLORE &rarr;</span>
                  </div>
                </button>
              </div>

              {/* Navigation Links Grid Section */}
              <div>
                <div className="text-xs font-mono text-neutral-200 uppercase tracking-widest mb-3 px-1 flex justify-between items-center font-bold">
                  <span className="flex items-center gap-2 text-white">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    PORTFOLIO SECTIONS
                  </span>
                  <span className="text-neutral-300 font-mono text-[10px] font-semibold tracking-wider">
                    TAP ANY CARD TO NAVIGATE
                  </span>
                </div>

                {/* 3D Interactive Navigation Switchboard (CSS Selector 1) */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0f111e]/98 via-[#090b14]/98 to-[#05060b]/99 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1.5px_0_rgba(255,255,255,0.18),inset_0_-2px_0_rgba(0,0,0,0.85)] relative overflow-hidden"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  {navItems.map((item, idx) => {
                    const isRouteActive = location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/');
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`group relative flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 touch-manipulation cursor-pointer overflow-hidden ${
                          isRouteActive
                            ? 'bg-gradient-to-b from-[#32131e] via-[#200c14] to-[#12060b] border-2 border-red-500 text-white shadow-[0_0_28px_rgba(255,42,58,0.5),0_12px_26px_rgba(0,0,0,0.95),inset_0_1.5px_0_rgba(255,255,255,0.4)] -translate-y-0.5'
                            : 'bg-gradient-to-b from-[#1b1e32] via-[#111322] to-[#0a0b14] border border-white/25 hover:border-red-500/80 text-white shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1.5px_0_rgba(255,255,255,0.22),inset_0_-1.5px_0_rgba(0,0,0,0.7)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.95),0_0_22px_rgba(255,42,58,0.32),inset_0_1.5px_0_rgba(255,255,255,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-95'
                        }`}
                        style={{
                          WebkitFontSmoothing: 'antialiased',
                          textRendering: 'optimizeLegibility',
                        }}
                      >
                        {/* Specular Diagonal Glint Sweep on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600 pointer-events-none" />

                        <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                          <span
                            className={`font-mono text-xs font-black px-2 py-0.5 rounded-md shrink-0 shadow-inner ${
                              isRouteActive
                                ? 'bg-red-500/30 text-red-200 border border-red-500/60 shadow-[0_0_10px_rgba(255,42,58,0.6)]'
                                : 'bg-white/10 text-white border border-white/25 group-hover:bg-red-500/20 group-hover:text-red-200 group-hover:border-red-500/40 transition-colors'
                            }`}
                          >
                            0{idx + 1}
                          </span>
                          <span className="font-sans font-bold text-xs sm:text-sm tracking-tight text-white group-hover:text-red-300 transition-colors truncate">
                            {item.label}
                          </span>
                        </div>

                        <span
                          className={`font-mono text-xs font-black shrink-0 relative z-10 transition-transform duration-200 ${
                            isRouteActive
                              ? 'text-red-300 scale-110'
                              : 'text-neutral-400 group-hover:text-red-300 group-hover:translate-x-1'
                          }`}
                        >
                          &rarr;
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Console: Founder Vault, AI Assistant & Direct Channel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 border-t border-white/15">
                {/* Founder Vault with Specimen Clearance Guidance — 3D Cyber Bunker Chassis */}
                <Link
                  to="/vault"
                  onMouseEnter={() => {
                    import('./vault/VaultLogin').catch(() => null);
                    import('./vault/VaultLayout').catch(() => null);
                  }}
                  onTouchStart={() => {
                    import('./vault/VaultLogin').catch(() => null);
                    import('./vault/VaultLayout').catch(() => null);
                  }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (lockVault) lockVault();
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-[#2a111c] via-[#1a0a12] to-[#0e0509] border-2 border-red-500/60 hover:border-cyan-400 text-white shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(255,42,58,0.25),inset_0_1.5px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_32px_rgba(34,211,238,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group relative overflow-hidden"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  <div className="flex items-center gap-3 relative z-10 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#441724] to-[#1c0810] border border-red-500/60 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                      <Lock className="w-4.5 h-4.5 text-red-300" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-black text-sm text-white tracking-wide block">
                          FOUNDER VAULT
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 font-bold shrink-0">
                          GATE 🔒
                        </span>
                      </div>
                      <span className="text-xs text-neutral-200 block font-mono font-medium mt-0.5 truncate">
                        Clearance &bull; <span className="text-cyan-300 font-semibold">Live Architecture</span>
                      </span>
                    </div>
                  </div>

                  <span className="relative z-10 text-xs text-red-300 font-mono font-bold px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 shadow-inner group-hover:border-cyan-400 group-hover:text-cyan-200 transition-colors shrink-0">
                    EXPLORE ➔
                  </span>
                </Link>

                {/* AI Assistant Trigger — 3D Cyber Deck */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open-ai-assistant'));
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-[#182348] via-[#0f1730] to-[#080d1e] border-2 border-cyan-400/50 hover:border-cyan-300 text-white shadow-[0_16px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.2),inset_0_1.5px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.7)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.95),0_0_32px_rgba(6,182,212,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group relative overflow-hidden"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                  <div className="flex items-center gap-3 relative z-10 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1f3266] to-[#0a1226] border border-cyan-400/60 flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform">
                      <Bot className="w-4.5 h-4.5 text-cyan-300" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="font-sans font-black text-sm text-white tracking-wide block">
                        ASK SAHIL AI
                      </span>
                      <span className="text-xs text-cyan-200/90 block font-mono font-medium mt-0.5">
                        Neural Assistant
                      </span>
                    </div>
                  </div>

                  <span className="relative z-10 text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 shrink-0">
                    LIVE
                  </span>
                </button>

                {/* Direct Channel CTA — 3D Sculpted Specular Card */}
                <Link
                  to="/contact"
                  onClick={() => handleNavClick('/contact')}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 hover:from-white hover:to-neutral-100 text-black font-sans font-black text-xs uppercase tracking-wider shadow-[0_18px_40px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.9),inset_0_2px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(0,0,0,0.25)] border-2 border-white hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-200 cursor-pointer group"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626] animate-ping" />
                    <span className="text-black font-extrabold text-xs tracking-wider">
                      Direct Channel
                    </span>
                  </div>
                  <ArrowUpRight className="w-4.5 h-4.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 3D TACTILE VERIFIED DIRECT SOCIAL NETWORK CHANNELS           */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-5 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/50 animate-ping" />
                      <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-white">
                      VERIFIED DIRECT CHANNELS
                    </span>
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-500/15 border border-red-500/40 px-2 py-0.5 rounded-md shadow-sm">
                      FOUNDER SOCIALS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans font-medium">
                    Direct architectural advisory &amp; real-time engineering feeds
                  </p>
                </div>

                {/* 3D Tactile Interactive SQUARE Channel Buttons Grid */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-sm perspective-container-800">
                  {/* 1. Instagram 3D Tactile SQUARE Cube with Perspective Left-Tilt */}
                  <a
                    href="https://www.instagram.com/neutronverse.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-left relative group/cube aspect-square w-full sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-[#833ab4]/30 via-[#fd1d1d]/25 to-[#fcb045]/20 bg-[#0f0714] border-2 border-rose-500/60 border-b-[5px] border-b-rose-700 shadow-[0_8px_0_#1a0410,0_16px_28px_rgba(225,48,108,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-rose-400 hover:border-b-rose-500 hover:shadow-[0_14px_0_#1a0410,0_24px_45px_rgba(225,48,108,0.7),0_0_30px_rgba(244,63,94,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#1a0410,0_6px_12px_rgba(225,48,108,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="Instagram @neutronverse.ai"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 group-hover/cube:bg-rose-300 shadow-[0_0_8px_#f43f5e]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* Instagram Sunset Gradient Camera Glyph with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 group-hover/cube:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="ig-sunset-cube-nav" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-sunset-cube-nav)" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-sunset-cube-nav)" />
                        <circle cx="17.5" cy="6.5" r="1" fill="#f43f5e" />
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-rose-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        INSTA
                      </span>
                    </div>
                  </a>

                  {/* 2. LinkedIn 3D Tactile SQUARE Cube with Perspective Center-Tilt */}
                  <a
                    href="https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-center relative group/cube aspect-square w-full sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-[#0077b5]/30 via-[#0288d1]/25 to-[#004182]/30 bg-[#030d17] border-2 border-cyan-500/60 border-b-[5px] border-b-cyan-700 shadow-[0_8px_0_#020c15,0_16px_28px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-cyan-400 hover:border-b-cyan-500 hover:shadow-[0_14px_0_#020c15,0_24px_45px_rgba(6,182,212,0.7),0_0_30px_rgba(14,165,233,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#020c15,0_6px_12px_rgba(6,182,212,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="LinkedIn Profile: Sahil Bhatia"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover/cube:bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* LinkedIn Cyber Cobalt Vector Icon with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 group-hover/cube:text-cyan-300 group-hover/cube:scale-110 transition-all duration-200 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.85)] fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-cyan-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        LINKEDIN
                      </span>
                    </div>
                  </a>

                  {/* 3. GitHub 3D Tactile SQUARE Cube with Perspective Right-Tilt */}
                  <a
                    href="https://github.com/sahilbhatia7474-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-right relative group/cube aspect-square w-full sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-red-600/30 via-rose-900/25 to-[#121422] bg-[#090a14] border-2 border-red-500/60 border-b-[5px] border-b-red-700 shadow-[0_8px_0_#140508,0_16px_28px_rgba(255,42,58,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-red-400 hover:border-b-red-500 hover:shadow-[0_14px_0_#140508,0_24px_45px_rgba(255,42,58,0.7),0_0_30px_rgba(255,42,58,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#140508,0_6px_12px_rgba(255,42,58,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="GitHub Repositories: sahilbhatia7474-tech"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400 group-hover/cube:bg-red-300 shadow-[0_0_8px_#ff2a3a]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* GitHub Carbon-Crimson Octocat Vector Icon with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-100 group-hover/cube:text-white group-hover/cube:scale-110 transition-all duration-200 filter drop-shadow-[0_0_12px_rgba(255,42,58,0.85)] fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-red-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        GITHUB
                      </span>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* Global Intelligent Search Overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Interactive Vertical Journey Timeline Experience Modal */}
      {isJourneyTimelineOpen && (
        <VerticalJourneyTimeline
          isOpen={isJourneyTimelineOpen}
          onClose={() => setIsJourneyTimelineOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
