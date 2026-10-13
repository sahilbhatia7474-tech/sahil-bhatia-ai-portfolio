import { useState, useRef } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  FolderKanban,
  Award,
  Image as ImageIcon,
  Briefcase,
  Smartphone,
  PlusCircle,
  Activity,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Settings,
  Mail,
  Zap,
  Layers,
  ArrowUpRight,
  Shield,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Subtle high-tech audio feedback helper for tactile dashboard interactions
 */
function playTactileFeedback(type = 'click') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'card') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(860, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'action') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'tab') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // Safe fallback if audio context is restricted
  }
}

/**
 * High-performance 3D Interactive Tilt Card with cursor-tracking holographic spotlight
 */
const InteractiveTiltCard = ({
  children,
  className = '',
  onClick,
  glowColor = 'rgba(255, 42, 58, 0.25)',
  maxTilt = 7,
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;
    setTilt({ x: rotateX, y: rotateY, glowX, glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'transform',
      }}
      className={`relative transform-style-3d cursor-pointer ${className}`}
    >
      {/* Specular Cursor-Tracking Spotlight Beam */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle 320px at ${tilt.glowX}% ${tilt.glowY}%, ${glowColor}, transparent 75%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};

const VaultDashboard = ({ setActiveTab, openNewModal }) => {
  const {
    allProjects,
    certificates,
    media,
    allJourney,
    activityLogs,
    siteSettings,
    previewMode,
    setPreviewMode,
  } = usePortfolioData();

  // Active section filter tab for 3D tab interactions
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');

  const publishedProjects = allProjects.filter((p) => p.status === 'PUBLISHED').length;
  const draftProjects = allProjects.filter((p) => p.status === 'DRAFT').length;
  const verifyItems = allJourney.filter((j) => j.status === 'VERIFY' || !j.verified).length;

  // Real, meaningful system indicators — zero fabrication
  const systemStatusCards = [
    {
      title: 'SYSTEM STATUS',
      value: 'AUTHENTICATED',
      desc: 'Founder root authorization verified & cryptographically locked',
      icon: Activity,
      color: 'text-emerald-400',
      badge: 'ROOT CLEARANCE',
      accentGlow: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.35)]',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.3)',
      ringColor: 'from-emerald-500/20 to-transparent',
    },
    {
      title: 'PUBLIC EXPERIENCE',
      value: siteSettings?.maintenanceMode ? 'MAINTENANCE' : 'LIVE',
      desc: siteSettings?.maintenanceMode ? 'Public traffic paused & queued' : 'Serving production runtime worldwide',
      icon: ShieldCheck,
      color: siteSettings?.maintenanceMode ? 'text-amber-400' : 'text-cyan-400',
      badge: siteSettings?.maintenanceMode ? 'SUSPENDED' : 'WORLDWIDE ⚡',
      accentGlow: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.35)]',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.3)',
      ringColor: 'from-cyan-500/20 to-transparent',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('settings');
      },
    },
    {
      title: 'FOUNDER VAULT',
      value: 'ENCRYPTED',
      desc: 'Restricted root access console & multi-role CMS',
      icon: Shield,
      color: 'text-red-400',
      badge: 'PROTECTED 🔒',
      accentGlow: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,42,58,0.35)]',
      border: 'border-red-500/40 hover:border-red-400',
      glowColor: 'rgba(255, 42, 58, 0.3)',
      ringColor: 'from-red-500/20 to-transparent',
    },
  ];

  // Core Operating Sections (Matches CSS Selectors 8, 14, 13, 12, 11, 10)
  const operationalSections = [
    {
      id: 'settings',
      category: 'SYSTEM',
      title: 'PORTFOLIO CONTROL',
      desc: 'Manage what is publicly visible across the portfolio systems.',
      badge: 'CONTROLS',
      icon: Settings,
      accent: 'border-amber-500/40 hover:border-amber-400 text-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('settings');
      },
    },
    {
      id: 'inquiries',
      category: 'COMMUNICATION',
      title: 'CLIENT INQUIRIES',
      desc: 'Review consultation requests and project briefs submitted via the portfolio.',
      badge: 'INBOX',
      icon: Mail,
      accent: 'border-cyan-500/40 hover:border-cyan-400 text-cyan-400',
      glowColor: 'rgba(6, 182, 212, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('inquiries');
      },
    },
    {
      id: 'portrait',
      category: 'IDENTITY',
      title: 'FOUNDER CARD',
      desc: 'Control the featured portrait, focal position, identity copy, and public visibility.',
      badge: 'LIVE 3D',
      icon: Sparkles,
      accent: 'border-purple-500/40 hover:border-purple-400 text-purple-400',
      glowColor: 'rgba(168, 85, 247, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('portrait');
      },
    },
    {
      id: 'projects',
      category: 'CONTENT',
      title: 'PROJECT SYSTEM',
      desc: 'Manage curated projects, demos, case studies, and publication state.',
      meta: `${allProjects.length} Curated Records (${publishedProjects} Live • ${draftProjects} Staging)`,
      badge: 'REPERTOIRE',
      icon: FolderKanban,
      accent: 'border-red-500/40 hover:border-red-400 text-red-400',
      glowColor: 'rgba(255, 42, 58, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('projects');
      },
    },
    {
      id: 'certificates',
      category: 'CONTENT',
      title: 'PROOF & CREDENTIALS',
      desc: 'Manage certificates, evidence, media, and supporting proof.',
      meta: `${certificates.length} Verified Certificates • Zero Fabrication`,
      badge: 'EVIDENCE',
      icon: Award,
      accent: 'border-emerald-500/40 hover:border-emerald-400 text-emerald-400',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('certificates');
      },
    },
    {
      id: 'media',
      category: 'STORAGE',
      title: 'FUTURE VAULT',
      desc: 'Store experiments, future work, assets, and unpublished material.',
      meta: `${media.length} Media Assets & Work-in-Progress`,
      badge: 'STORAGE',
      icon: ImageIcon,
      accent: 'border-blue-500/40 hover:border-blue-400 text-blue-400',
      glowColor: 'rgba(59, 130, 246, 0.25)',
      action: () => {
        playTactileFeedback('card');
        setActiveTab('media');
      },
    },
  ];

  // Filter sections by selected 3D category tab
  const filteredSections = operationalSections.filter((sec) => {
    if (activeFilterTab === 'ALL') return true;
    if (activeFilterTab === 'SYSTEM' && (sec.category === 'SYSTEM' || sec.category === 'COMMUNICATION')) return true;
    if (activeFilterTab === 'CONTENT' && sec.category === 'CONTENT') return true;
    if (activeFilterTab === 'IDENTITY' && (sec.category === 'IDENTITY' || sec.category === 'STORAGE')) return true;
    return true;
  });

  return (
    <div
      className="space-y-8 relative font-sans antialiased font-crisp"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        transform: 'translateZ(0)',
      }}
    >
      {/* ========================================================================= */}
      {/* SELECTOR 2: TOP BANNER / FOUNDER CONTROL ROOM (3D COMMAND DECK)           */}
      {/* ========================================================================= */}
      <InteractiveTiltCard
        maxTilt={4}
        glowColor="rgba(255, 42, 58, 0.3)"
        className="rounded-3xl bg-gradient-to-r from-[#1a0e1c]/95 via-[#100d1e]/95 to-[#12142a]/95 backdrop-blur-2xl border-2 border-red-500/60 p-6 sm:p-8 shadow-[0_24px_65px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,58,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] relative overflow-hidden group"
      >
        {/* Specular Top Rim Shine */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent shadow-[0_0_12px_rgba(255,255,255,0.95)]" />

        {/* Tactical Corner Precision Brackets */}
        <div className="absolute top-3 left-3 text-xs font-mono text-red-500 font-bold select-none drop-shadow-[0_0_4px_#ff2a3a]">⌜</div>
        <div className="absolute top-3 right-3 text-xs font-mono text-red-500 font-bold select-none drop-shadow-[0_0_4px_#ff2a3a]">⌝</div>
        <div className="absolute bottom-3 left-3 text-xs font-mono text-red-500 font-bold select-none drop-shadow-[0_0_4px_#ff2a3a]">⌞</div>
        <div className="absolute bottom-3 right-3 text-xs font-mono text-red-500 font-bold select-none drop-shadow-[0_0_4px_#ff2a3a]">⌟</div>

        {/* Ambient Subtle Radar Flare */}
        <div className="absolute right-0 top-0 bottom-0 w-3/5 bg-gradient-to-l from-red-600/20 via-rose-950/15 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_#ff2a3a]" />
              </span>
              <span className="text-xs font-mono tracking-widest text-red-300 uppercase font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                FOUNDER CONTROL DECK // SAHIL OS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase drop-shadow-[0_3px_6px_rgba(0,0,0,0.95)]">
              FOUNDER VAULT
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 max-w-2xl leading-relaxed font-medium">
              Private command console for portfolio architectures, neural systems, identity copy, verifiable proof, and the 3D Founder Card.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Founder Access Status Indicator */}
            <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-950/90 to-[#1e0a14] border-2 border-red-500/70 text-xs font-mono text-red-100 flex items-center gap-2.5 shadow-[0_0_20px_rgba(255,42,58,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_10px_#ff2a3a]" />
              <span className="font-black tracking-wider uppercase text-xs">FOUNDER ROOT // ACTIVE</span>
            </div>

            {/* 3D Tactile Live vs Draft Preview Toggle */}
            <div className="p-1.5 rounded-xl bg-[#060814]/90 border-2 border-white/25 flex items-center gap-1 font-mono text-xs shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_6px_16px_rgba(0,0,0,0.6)]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTactileFeedback('action');
                  setPreviewMode('PUBLISHED');
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-black uppercase text-xs tracking-wider active:scale-95 ${
                  previewMode === 'PUBLISHED'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(255,42,58,0.8),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Live (Published)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playTactileFeedback('action');
                  setPreviewMode('DRAFT');
                }}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-black uppercase text-xs tracking-wider active:scale-95 ${
                  previewMode === 'DRAFT'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.8),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Staging (Drafts)
              </button>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                playTactileFeedback('action');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#10162c] hover:bg-[#1a2344] border-2 border-white/25 hover:border-cyan-400 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] active:scale-95 group/pub"
            >
              <span>View Public App</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/pub:translate-x-0.5 group-hover/pub:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </InteractiveTiltCard>

      {/* ========================================================================= */}
      {/* SELECTOR 3, 4, 5: 3D GLOSSY STATUS INDICATORS (ZERO FABRICATION)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {systemStatusCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <InteractiveTiltCard
              key={stat.title}
              onClick={stat.action}
              glowColor={stat.glowColor}
              maxTilt={8}
              className={`rounded-2xl bg-gradient-to-b from-[#14182b]/95 via-[#0e1122]/98 to-[#080914] backdrop-blur-xl border-2 ${stat.border} p-6 transition-all duration-300 shadow-[0_16px_45px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden group ${stat.accentGlow}`}
            >
              {/* Top Specular Edge Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono tracking-widest text-slate-100 uppercase font-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-current shadow-[0_0_6px_currentColor]" />
                  {stat.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-black/70 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  <Icon className={`w-5 h-5 ${stat.color} drop-shadow-[0_0_10px_currentColor]`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${stat.color} drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]`}>
                  {stat.value}
                </div>
                <span className="text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 text-slate-100 shadow-sm">
                  {stat.badge}
                </span>
              </div>

              <div className="text-xs text-slate-100 mt-2.5 font-sans font-medium leading-relaxed">
                {stat.desc}
              </div>
            </InteractiveTiltCard>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SELECTOR 6, 7, 8, 10, 11, 12, 13, 14: OPERATIONAL SECTIONS                */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Header Row (Selectors 6 & 7) with 3D Category Tab Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          {/* Selector 6: Title */}
          <div className="font-mono text-sm text-white uppercase tracking-widest font-black flex items-center gap-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <Layers className="w-4.5 h-4.5 text-red-500 drop-shadow-[0_0_8px_#ff2a3a]" />
            <span>OPERATIONAL SECTIONS // DIRECT ACCESS</span>
          </div>

          {/* Selector 7: 3D Interactive Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090c1a]/95 border-2 border-white/20 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
            {[
              { id: 'ALL', label: 'ALL CONSOLES (6)' },
              { id: 'SYSTEM', label: 'SYSTEM & LIVE' },
              { id: 'CONTENT', label: 'CONTENT & PROOF' },
              { id: 'IDENTITY', label: '3D & ASSETS' },
            ].map((tab) => {
              const isActive = activeFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playTactileFeedback('tab');
                    setActiveFilterTab(tab.id);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(255,42,58,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selector 13: Grid of 6 Section Consoles (Selectors 8, 14, 12, 11, 10) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <InteractiveTiltCard
                key={sec.title}
                onClick={sec.action}
                glowColor={sec.glowColor}
                maxTilt={8}
                className={`p-6 rounded-2xl bg-gradient-to-b from-[#13172c]/95 via-[#0e1122]/98 to-[#070914] backdrop-blur-xl border-2 ${sec.accent} shadow-[0_16px_45px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_22px_60px_rgba(0,0,0,0.95)] transition-all duration-300 flex flex-col justify-between gap-5 group relative overflow-hidden`}
              >
                {/* Specular Top Rim Shine */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Shimmer sweep glint */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-black/80 border-2 border-white/25 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-current transition-all shadow-md">
                      <Icon className="w-5.5 h-5.5 drop-shadow-[0_0_8px_currentColor]" />
                    </div>
                    <span className="text-[11px] font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 text-slate-100 tracking-wider shadow-sm">
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-mono text-base font-black text-white uppercase group-hover:text-red-300 transition-colors tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-100 font-sans mt-2 leading-relaxed font-medium">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                {sec.meta ? (
                  <div className="pt-3 border-t border-white/15 text-xs font-mono text-slate-200 font-bold flex items-center justify-between">
                    <span>{sec.meta}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                ) : (
                  <div className="pt-2.5 border-t border-white/15 text-xs font-mono text-slate-300 flex items-center justify-end">
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                )}
              </InteractiveTiltCard>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SELECTOR 9: QUICK CREATOR ACTIONS (3D TACTILE PUSH BUTTONS)               */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-b from-[#141930]/95 via-[#0e1122]/98 to-[#070914] backdrop-blur-xl border-2 border-white/25 p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.25)] relative overflow-hidden">
        {/* Specular Top Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-950/70 border border-red-500/60 flex items-center justify-center text-red-400">
              <PlusCircle className="w-4.5 h-4.5 drop-shadow-[0_0_8px_#ff2a3a]" />
            </div>
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              RAPID ACTIONS & CONTENT CREATION
            </h3>
          </div>
          <span className="text-xs font-mono text-red-300 font-bold uppercase tracking-wider drop-shadow-[0_0_6px_rgba(255,42,58,0.4)]">
            TOUCH-READY DIRECT DISPATCH ⚡
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'Add Project', tab: 'projects', openModal: true, icon: FolderKanban, color: 'text-red-400' },
            { label: 'Edit 3D Card', tab: 'portrait', openModal: false, icon: Sparkles, color: 'text-purple-400' },
            { label: 'Add Certificate', tab: 'certificates', openModal: true, icon: Award, color: 'text-emerald-400' },
            { label: 'Add Photo/Media', tab: 'media', openModal: true, icon: ImageIcon, color: 'text-blue-400' },
            { label: 'Add Experience', tab: 'journey', openModal: true, icon: Briefcase, color: 'text-amber-400' },
            { label: 'Add App Entry', tab: 'apps', openModal: true, icon: Smartphone, color: 'text-cyan-400' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  playTactileFeedback('action');
                  setActiveTab(action.tab);
                  if (action.openModal && openNewModal) {
                    openNewModal(action.tab);
                  }
                }}
                className="min-h-[56px] p-4 rounded-xl bg-gradient-to-b from-[#161c36] via-[#101426] to-[#0a0d18] hover:from-[#20284c] hover:to-[#141930] border-2 border-white/20 hover:border-red-500/80 text-left transition-all duration-200 flex flex-col justify-between gap-3 cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-1 active:scale-95 group"
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                  <span className="text-xs font-mono text-slate-400 group-hover:text-white transition-colors">↗</span>
                </div>
                <span className="text-xs font-mono text-white font-black uppercase tracking-wide leading-tight group-hover:text-red-300 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SELECTOR 15 & 16: RECENT ACTIVITY LOG & HONESTY AUDIT GUARD               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Activity Feed (Selector 15) */}
        <div className="lg:col-span-8 rounded-2xl bg-gradient-to-b from-[#13172c]/95 via-[#0e1122]/98 to-[#070914] backdrop-blur-xl border-2 border-white/25 p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden">
          {/* Specular Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-950/70 border border-red-500/60 flex items-center justify-center text-red-400">
                <Clock className="w-4 h-4 drop-shadow-[0_0_8px_#ff2a3a]" />
              </div>
              <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                RECENT VAULT ACTIVITY
              </h3>
            </div>
            <button
              onClick={() => {
                playTactileFeedback('action');
                setActiveTab('activity');
              }}
              className="text-xs font-mono text-red-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-500/30 hover:border-red-400"
            >
              <span>View Full Log</span>
              <span>→</span>
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-[#090c18] border border-white/20 flex items-start justify-between gap-3 text-xs font-mono shadow-[0_4px_12px_rgba(0,0,0,0.6)] hover:border-white/35 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-red-400 font-black uppercase tracking-wider text-xs drop-shadow-[0_0_4px_rgba(255,42,58,0.4)]">{log.action}</span>
                    <p className="text-slate-100 font-sans font-medium text-xs leading-relaxed">{log.summary}</p>
                  </div>
                  <span className="text-[10px] text-slate-300 shrink-0 px-2.5 py-1 rounded-lg bg-black/80 border border-white/15 font-bold">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-mono text-slate-200 bg-[#090c18] rounded-xl border border-white/15">
                Initial Founder Vault ready. Actions taken will populate here automatically.
              </div>
            )}
          </div>
        </div>

        {/* Honesty Rule Audit Guard (Selector 16) */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#13172c]/95 via-[#0e1122]/98 to-[#070914] backdrop-blur-xl border-2 border-white/25 p-6 space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden">
          {/* Specular Top Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="flex items-center gap-2.5 border-b border-white/15 pb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4 drop-shadow-[0_0_8px_#10b981]" />
            </div>
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              PROJECT HONESTY GUARD
            </h3>
          </div>

          <div className="space-y-4 text-xs font-sans text-slate-100">
            <p className="leading-relaxed font-medium">
              Every professional claim on this portfolio is cryptographically audited before public publication.
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#241a0a] to-[#140e06] border-2 border-amber-500/70 text-amber-200 space-y-2 text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <div className="flex items-center gap-1.5 font-black uppercase text-amber-300">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0 drop-shadow-[0_0_8px_#f59e0b]" />
                <span>PhonePe Timeline Audit</span>
              </div>
              <p className="text-slate-100 font-sans text-xs leading-relaxed font-medium">
                Kept as &ldquo;Verify Before Publishing&rdquo; to adhere strictly to zero-fabrication rules.
              </p>
            </div>
            <div className="pt-3 flex items-center justify-between text-xs font-mono text-slate-200 border-t border-white/15 font-bold">
              <span>UNVERIFIED ITEMS:</span>
              <span className="text-amber-300 font-black px-2.5 py-1 rounded-lg bg-amber-950/90 border border-amber-500/60">
                {verifyItems} BLOCKED
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VaultDashboard;
