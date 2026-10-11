import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowUpRight, Cpu, Lock, Search, Bot, Compass } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';
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
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isJourneyTimelineOpen, setIsJourneyTimelineOpen] = useState(false);
  const flareRef = useRef(null);
  const glareRef = useRef(null);

  // Unified body scroll lock management for mobile navigation drawer
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const isScrolled = currentY > 20;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(100, Math.max(0, (currentY / docHeight) * 100)) : 0;
          setScrollProgress(progress);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-red-500 via-rose-400 to-cyan-400 shadow-[0_0_12px_#ff2a3a] transition-all duration-100 pointer-events-none z-20"
          style={{ width: `${scrollProgress}%` }}
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
              className="relative group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#2a0e1a] via-[#1a0b16] to-[#0c1222] border border-red-500/60 hover:border-cyan-400 text-white text-xs font-mono transition-all duration-300 shadow-[0_0_24px_rgba(255,42,58,0.35),0_8px_20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_0_32px_rgba(34,211,238,0.5),0_12px_28px_rgba(0,0,0,0.95)] hover:scale-105 active:scale-95 cursor-pointer touch-manipulation overflow-hidden"
              title="Explore Live Founder Vault (Public Specimen Mode & Architecture)"
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
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold group-hover:bg-cyan-500/20 group-hover:text-cyan-300 group-hover:border-cyan-400/40 transition-colors">
                  LIVE ⚡
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

            {/* Theme Toggle Button */}
            <ThemeToggle />

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

          {/* Mobile Right Controls: Search + Theme + Hamburger Toggle with 44px Touch Targets */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
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
            className="fixed inset-0 top-[65px] bg-black/85 backdrop-blur-md z-40 cursor-pointer touch-manipulation animate-in fade-in duration-200"
            aria-hidden="true"
          />
        )}

        {/* Universal Menu Drawer (Accessible via 3-lines hamburger icon on all screen sizes) */}
        {mobileMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#0c0e18]/99 via-[#070811]/99 to-[#030408]/99 border-b border-white/20 px-4 sm:px-6 lg:px-8 py-6 shadow-[0_35px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(255,42,58,0.18),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.8)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-200 relative max-h-[calc(100vh-80px)] overflow-y-auto z-50 select-none"
          >
            {/* Specular hairline top divider with glowing pulse */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_rgba(255,42,58,0.8)] pointer-events-none" />
            
            {/* Subtle cybernetic micro grid backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

            <div className="max-w-7xl mx-auto flex flex-col gap-5 relative z-10">
              
              {/* Drawer Header with Title & Direct Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                  <span className="font-display font-black text-sm sm:text-base tracking-wider text-white uppercase">
                    SYSTEM CONTROL & ACTIVITY MATRIX
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold hidden sm:inline">
                    ENGINEERING HUB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-400" />
                  <span>CLOSE (ESC)</span>
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* D3.JS GITHUB CONTRIBUTION ACTIVITY HEAT-MAP (USER REQUEST)     */}
              {/* ------------------------------------------------------------- */}
              <div className="w-full">
                <GitHubContributionHeatmap />
              </div>

              {/* Quick Actions Tier: Search & Journey */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Search Knowledge Model */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#161828]/95 via-[#111322]/95 to-[#0b0c16]/95 border border-white/20 hover:border-red-500/70 text-neutral-200 hover:text-white text-xs font-mono shadow-[0_10px_28px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.6)] active:scale-[0.98] transition-all touch-manipulation cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <Search className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(255,42,58,0.7)]" />
                    </div>
                    <div className="text-left">
                      <span className="font-semibold text-white block">Search Knowledge Model...</span>
                      <span className="text-[10px] text-neutral-400 block font-mono">Projects, verified proofs & systems</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-[10px] text-white font-mono font-bold shadow-inner">
                    ⌘K
                  </span>
                </button>

                {/* Professional Journey Timeline */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsJourneyTimelineOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#221018] via-[#160c14] to-[#0c0810] border border-red-500/50 hover:border-red-400 text-left transition-all duration-200 shadow-[0_10px_28px_rgba(255,42,58,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center shadow-[0_0_14px_rgba(255,42,58,0.5)] group-hover:scale-110 transition-transform">
                      <Compass className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white tracking-wide text-sm">Professional Journey</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                          VERTICAL TIMELINE
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-300 block font-sans">
                        Paytm &rarr; Airtel &rarr; AI Systems Architect
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>EXPLORE &rarr;</span>
                  </div>
                </button>
              </div>

              {/* Navigation Links Grid */}
              <div>
                <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-2 px-1 flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    PORTFOLIO SECTIONS
                  </span>
                  <span className="text-neutral-500 font-mono text-[9px]">TAP ANY REGION TO NAVIGATE</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {navItems.map((item, idx) => {
                    const isRouteActive = location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/');
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center justify-between p-3 rounded-xl text-xs font-mono transition-all duration-200 touch-manipulation cursor-pointer active:scale-[0.98] ${
                          isRouteActive
                            ? 'bg-gradient-to-r from-[#221828] via-[#161222] to-[#0e0c18] border border-red-500/60 text-white shadow-[0_6px_22px_rgba(255,42,58,0.3),inset_0_1px_0_rgba(255,255,255,0.22)] font-bold'
                            : 'bg-[#0e101c]/80 hover:bg-[#151829] border border-white/12 hover:border-white/25 text-neutral-300 hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded shrink-0 ${isRouteActive ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-white/5 text-neutral-500'}`}>
                            0{idx + 1}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className={`text-xs shrink-0 ${isRouteActive ? 'text-red-400 font-bold' : 'text-neutral-500'}`}>
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Console: Founder Vault (With Passcode Info) & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/15">
                {/* Founder Vault with Specimen Clearance Guidance */}
                <Link
                  to="/vault"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl text-xs font-mono text-red-300 bg-gradient-to-r from-[#201018] via-[#140b10] to-[#0d070b] border border-red-500/50 hover:border-cyan-400 shadow-[0_8px_24px_rgba(255,42,58,0.3),inset_0_1px_0_rgba(255,255,255,0.16)] active:scale-[0.99] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,42,58,0.4)]">
                      <Lock className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black tracking-wider text-white block">FOUNDER VAULT</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                          OPEN ⚡
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-300 block font-mono">
                        Public Specimen Clearance &bull; <span className="text-cyan-300 font-semibold">Inspect Live Architecture</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-red-300 font-mono font-bold px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 shadow-inner group-hover:border-cyan-400 group-hover:text-cyan-300 transition-colors">
                    EXPLORE ➔
                  </span>
                </Link>

                {/* AI Assistant Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent('open-ai-assistant'));
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl text-xs font-mono text-neutral-100 bg-gradient-to-r from-[#101934] via-[#0d1428] to-[#080d1c] border border-cyan-400/45 hover:border-cyan-300 shadow-[0_8px_24px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold tracking-wide text-white block">ASK SAHIL AI</span>
                      <span className="text-[10px] text-cyan-300/80 block font-mono">Neural Assistant</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-400/40">
                    LIVE
                  </span>
                </button>

                {/* Direct Channel CTA */}
                <Link
                  to="/contact"
                  onClick={() => handleNavClick('/contact')}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 hover:from-white hover:to-neutral-100 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_16px_35px_rgba(255,255,255,0.25)] border border-white/90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span>Direct Channel</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                </Link>
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
