import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFramer3DTilt } from '../hooks/useFramer3DTilt';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Compass, Award, ChevronRight, Activity, MapPin, Calendar } from 'lucide-react';

/**
 * CINEMATIC 3D JOURNEY EXPERIENCE
 * 
 * Transforms the Professional Journey section into a world-class spatial timeline:
 * - Real 3D perspective viewport with multi-layer depth & raycasted atmospheric lighting
 * - Physical tactile obsidian-milled career milestone slabs with individual 3D cursor tracking
 * - 3-tier Z-axis internal parallax (Elevation slabs, typography, metallic badges & insights)
 * - Dynamic specular ray-traced glare that shifts with viewer perspective
 * - Interactive phase-navigator filter with smooth spatial camera transitions
 * - Interactive expanded inspection drawer for deep career metrics & commercial takeaways
 * - High-craft typography with balanced contrast, hairline borders, and zero-pill discipline
 * - Full reduced-motion accessibility & zero layout jumps
 */

// Phase classification filters for spatial navigation
const JOURNEY_FILTERS = [
  { id: 'ALL', label: 'All Chapters', count: 5 },
  { id: 'VERIFIED', label: 'Verified Chronology', count: 4 },
  { id: 'FRONTLINE', label: 'Frontline Commercial', count: 3 },
  { id: 'AI_SYSTEMS', label: 'AI Practice', count: 1 },
];

/**
 * Cinematic 3D Spatial Milestone Card
 * Features real perspective, translateZ internal stratification,
 * specular dynamic glare, and tactile spring physics.
 */
function CinematicJourneyCard({
  entry,
  index,
  prefersReducedMotion,
  isCulmination,
  isUnverified,
}) {
  const {
    cardRef,
    isHovered,
    rotateX,
    rotateY,
    translateX,
    translateY,
    translateZ,
    scale,
    glareX,
    glareY,
    glareOpacity,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useFramer3DTilt({
    maxRotateX: isCulmination ? 6 : 7.5,
    maxRotateY: isCulmination ? 7.5 : 9,
    maxTranslateX: 6,
    maxTranslateY: 5,
    liftZ: isCulmination ? 24 : 18,
    scale: 1.015,
  });

  const themes = entry.keyThemes || entry.coreThemes || [];
  const elementId = entry.id || `journey-${entry.company?.toLowerCase().replace(/\s+/g, '-')}`;

  // Chapter index badge: 01, 02, etc.
  const chapterNumber = `0${index + 1}`.slice(-2);

  return (
    <div
      ref={cardRef}
      id={elementId}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-2xl transition-all duration-300 ease-out ${
        isCulmination ? 'lg:col-span-2' : 'lg:col-span-1'
      }`}
      style={{
        perspective: '1200px',
        transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
      }}
    >
      {/* Dynamic 3D Projected Contact Shadow Layer */}
      <div
        className="absolute -inset-1 rounded-2xl pointer-events-none transition-all duration-300 -z-10"
        style={{
          opacity: isHovered ? (isCulmination ? 0.9 : 0.65) : 0.25,
          background: isCulmination
            ? 'radial-gradient(ellipse at 50% 50%, rgba(255, 42, 58, 0.35) 0%, rgba(13, 14, 22, 0.95) 70%, transparent 100%)'
            : isUnverified
            ? 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.2) 0%, rgba(18, 16, 16, 0.8) 70%, transparent 100%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(12, 13, 18, 0.9) 70%, transparent 100%)',
          filter: 'blur(22px)',
        }}
      />

      {/* Main Tactical Obsidian Slab Container */}
      <motion.div
        className={`relative h-full flex flex-col justify-between rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all duration-200 overflow-hidden depth-occlude-grid ${
          isUnverified
            ? 'bg-[#100e0e]/95 border-amber-500/25 hover:border-amber-500/50'
            : isCulmination
            ? 'bg-[#0d0e18]/95 border-red-500/40 hover:border-red-500/70 shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(255,42,58,0.12)]'
            : 'bg-[#0b0c12]/90 border-white/[0.09] hover:border-white/25 shadow-[0_12px_36px_rgba(0,0,0,0.6)]'
        }`}
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          z: translateZ,
          scale,
          transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
        }}
      >
        {/* Dynamic Specular Acrylic Glare Mesh */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-30"
            style={{
              background: 'radial-gradient(circle 420px at center, rgba(255, 255, 255, 0.85) 0%, rgba(255, 42, 58, 0.3) 40%, transparent 80%)',
              left: glareX,
              top: glareY,
              opacity: glareOpacity,
              transform: 'translate(-50%, -50%)',
              width: '180%',
              height: '180%',
            }}
          />
        )}

        {/* Ambient Top Rim Highlight */}
        <div
          className={`absolute top-0 inset-x-0 h-[1px] pointer-events-none transition-opacity duration-300 ${
            isCulmination
              ? 'bg-gradient-to-r from-transparent via-red-500/80 to-transparent opacity-90'
              : isUnverified
              ? 'bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-75'
              : 'bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50 group-hover:opacity-100'
          }`}
        />

        {/* Subtle Watermark Index for Spatial Depth (Occluded under content) */}
        <div
          className="absolute -right-3 -bottom-6 font-display font-black text-8xl sm:text-9xl text-white/[0.02] select-none pointer-events-none transition-transform duration-300"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(-10px)',
          }}
        >
          {chapterNumber}
        </div>

        {/* =========================================================================
            LAYER 1: Header Deck (Elevated Z: 24px)
            ========================================================================= */}
        <div
          className="relative z-10 transition-transform duration-200"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(24px)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 mb-5 border-b border-white/[0.08]">
            <div className="space-y-1.5 max-w-xl">
              {/* Milestone Phase Tag + Chapter Number */}
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-semibold tracking-wider text-red-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  CHAPTER {chapterNumber}
                </span>
                <span className="text-neutral-600">&bull;</span>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest truncate">
                  {entry.phase || 'CAREER PHASE'}
                </span>
              </div>

              {/* Role Title & Organization Lockup */}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-white uppercase tracking-tight leading-tight">
                  {entry.role}
                </h3>
                <span
                  className={`font-mono text-sm sm:text-base font-semibold transition-colors ${
                    isCulmination
                      ? 'text-red-400 group-hover:text-red-300 drop-shadow-[0_0_12px_rgba(255,42,58,0.3)]'
                      : 'text-neutral-300 group-hover:text-white'
                  }`}
                >
                  @ {entry.company}
                </span>
              </div>
            </div>

            {/* Verification Status Instrument (Tactile Glass Pill) */}
            <div className="shrink-0 self-start">
              {isUnverified ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[11px] font-bold shadow-[0_2px_8px_rgba(245,158,11,0.15)] backdrop-blur-md">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{entry.status || 'VERIFY'}</span>
                </div>
              ) : isCulmination ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 font-mono text-[11px] font-bold shadow-[0_0_16px_rgba(255,42,58,0.25)] backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
                  <span>{entry.status || 'ACTIVE PRACTICE'}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono text-[11px] font-semibold backdrop-blur-md">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{entry.status || 'VERIFIED'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Temporal & Spatial Coordinates Bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-neutral-400 mb-5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>TIMELINE:</span>
              <strong className="text-neutral-200 font-medium tracking-wide">
                {entry.period}
              </strong>
            </div>

            {entry.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>DEPLOYMENT:</span>
                <strong className="text-neutral-200 font-medium tracking-wide">
                  {entry.location}
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            LAYER 2: Editorial Narrative & Tactical Themes (Elevated Z: 18px)
            ========================================================================= */}
        <div
          className="relative z-10 space-y-4 my-2 transition-transform duration-200"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(18px)',
          }}
        >
          {/* Descriptive Prose */}
          <p className="text-sm sm:text-[15px] text-neutral-300 font-sans leading-relaxed">
            {entry.description ||
              (entry.responsibilities && entry.responsibilities.join(' • '))}
          </p>

          {/* Tactical Competency Matrix Badges */}
          {themes.length > 0 && (
            <div className="pt-1">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-red-500" />
                CORE COMPETENCY DOMAINS
              </div>
              <div className="flex flex-wrap gap-2">
                {themes.map((theme) => (
                  <span
                    key={theme}
                    className="text-xs font-mono px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-neutral-200 hover:border-red-500/30 hover:bg-white/[0.07] transition-all"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            LAYER 3: Commercial Insight Glass Plate (Elevated Z: 28px)
            ========================================================================= */}
        {entry.takeaways && (
          <div
            className="relative z-20 mt-6 pt-2 transition-transform duration-200"
            style={{
              transform: prefersReducedMotion ? 'none' : 'translateZ(28px)',
            }}
          >
            <div
              className={`p-4 rounded-xl border relative overflow-hidden backdrop-blur-md transition-all ${
                isCulmination
                  ? 'bg-gradient-to-br from-red-950/30 to-black/60 border-red-500/30 shadow-[0_4px_20px_rgba(255,42,58,0.08)]'
                  : 'bg-[#11121a]/85 border-white/[0.07] hover:border-white/15'
              }`}
            >
              {/* Left Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isCulmination ? 'bg-red-500' : 'bg-red-500/70'
                }`}
              />

              <div className="pl-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-red-400 tracking-wider mb-1.5">
                  <Compass className="w-3.5 h-3.5 text-red-500" />
                  <span>COMMERCIAL TRUTH & STRATEGIC INSIGHT</span>
                </div>
                <p className="text-xs sm:text-[13px] text-neutral-200 font-sans italic leading-relaxed">
                  &ldquo;{entry.takeaways}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Card Footer Indicator */}
        <div
          className="pt-4 mt-4 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-neutral-400"
          style={{
            transform: prefersReducedMotion ? 'none' : 'translateZ(14px)',
          }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            RECORD ID: {entry.id || `JRN-${index + 1}`}
          </span>
          <span className="text-neutral-400 group-hover:text-red-400 transition-colors flex items-center gap-1">
            <span>{isCulmination ? 'CURRENT SYNTHESIS' : 'VERIFIED STAGE'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Main Journey Component
 */
const Journey = () => {
  const { journey } = usePortfolioData();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const sectionRef = useRef(null);

  // Environmental raycasting light coordinates
  const [ambientLight, setAmbientLight] = useState({ x: 50, y: 30 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSectionMouseMove = useCallback(
    (e) => {
      if (prefersReducedMotion || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setAmbientLight({ x, y });
    },
    [prefersReducedMotion]
  );

  // Filter logic
  const filteredJourney = (journey || []).filter((entry) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'VERIFIED') return entry.verified && entry.status !== 'VERIFY';
    if (activeFilter === 'FRONTLINE') return entry.id === 'j-1' || entry.id === 'j-2' || entry.id === 'j-3';
    if (activeFilter === 'AI_SYSTEMS') return entry.id === 'j-5';
    return true;
  });

  return (
    <section
      id="journey"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-28 bg-[#06070a] border-b border-white/10 section-spatial-containment overflow-hidden select-none sm:select-auto"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* =========================================================================
          SPATIAL ATMOSPHERIC DEPTH LAYERS & VOLUMETRIC LIGHT
          ========================================================================= */}
      {/* Spatial Layer 1: Ambient raycast spotlight following pointer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-0"
        style={{
          background: `radial-gradient(circle 900px at ${ambientLight.x}% ${ambientLight.y}%, rgba(255, 42, 58, 0.08), transparent 70%)`,
        }}
      />

      {/* Spatial Layer 2: Deep perspective obsidian coordinate grid (Z-0) */}
      <div
        className="spatial-grid-plane opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 65% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 65% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      {/* Spatial Layer 2.5: Depth Occlusion Mask (Z-5) - Naturally softens & hides grid beneath career milestone chassis */}
      <div aria-hidden="true" className="depth-occlusion-mask-layer" />

      {/* Spatial Layer 3: Floating Volumetric Horizon Blooms */}
      <div className="absolute top-1/4 -left-36 w-96 h-96 rounded-full bg-red-600/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-96 h-96 rounded-full bg-red-600/[0.03] blur-3xl pointer-events-none" />

      {/* =========================================================================
          FOREGROUND CONTAINER (Z: 10)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Deck */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs text-red-500 uppercase tracking-widest mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>GROUND-LEVEL COMMERCIAL REALITY TO AI SYSTEMS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Professional Journey
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-sans mt-3 max-w-2xl leading-relaxed">
              From high-frequency on-ground field execution across Delhi NCR to designing autonomous agent systems and AI consultancy engines. The synthesis of commercial street truth with software architecture.
            </p>
          </div>

          {/* Chronology Verification Instrument */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2.5 font-mono text-xs text-neutral-300 bg-[#0d0e16]/90 px-4 py-2.5 rounded-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PRIMARY VERIFIED CHRONOLOGY</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#0d0e16]/70 px-3 py-2.5 rounded-xl border border-white/5">
              <Award className="w-3.5 h-3.5 text-red-400" />
              <span>STRICT DATA HONESTY</span>
            </div>
          </div>
        </div>

        {/* Tactical Narrative Evolution Vector (Cinematic Glass Instrument) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d0f18]/95 via-[#0b0c12]/95 to-[#0e0f18]/95 border border-white/[0.09] shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl mb-12 depth-occlude-grid">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-2 font-semibold">
                <TrendingUp className="w-4 h-4 text-red-500" />
                STRATEGIC EVOLUTION VECTOR &middot; FIELD EMBEDDED
              </div>
              <p className="text-xs text-neutral-400 font-sans max-w-xl">
                Every software system built is informed by hundreds of direct commercial conversations, eliminating disconnected theoretical assumptions.
              </p>
            </div>

            {/* Step-by-Step Flow Nodes */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-white pt-2 lg:pt-0">
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-neutral-200">
                FIELD SALES
              </span>
              <span className="text-red-500 font-bold">&rarr;</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-neutral-200">
                CUSTOMER REALITY
              </span>
              <span className="text-red-500 font-bold">&rarr;</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-neutral-200">
                AI LEARNING
              </span>
              <span className="text-red-500 font-bold">&rarr;</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-neutral-200">
                AI BUILDING
              </span>
              <span className="text-red-500 font-bold">&rarr;</span>
              <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-neutral-200">
                AI SYSTEMS
              </span>
              <span className="text-red-500 font-bold">&rarr;</span>
              <span className="px-3 py-1.5 rounded-lg bg-red-600/90 border border-red-500 text-white font-bold shadow-[0_0_16px_rgba(255,42,58,0.3)]">
                AI CONSULTANCY DIRECTION
              </span>
            </div>
          </div>
        </div>

        {/* Phase Navigation Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {JOURNEY_FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(255,42,58,0.35)] border border-red-500'
                    : 'bg-[#0f1017]/80 text-neutral-400 hover:text-white border border-white/[0.06] hover:border-white/20'
                }`}
              >
                <span>{f.label}</span>
                {f.id === 'ALL' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {journey.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Timeline Entries — 2-Column Grid on Desktop, Vertical Spatial Chain on Mobile/Tablet */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 relative">
          {/* Vertical Spatial Laser Spine for Tablet / Mobile */}
          <div className="hidden md:block lg:hidden absolute left-8 top-8 bottom-8 w-[2px] bg-gradient-to-b from-red-500 via-white/10 to-red-500/20" />

          {filteredJourney.map((entry, index) => {
            const isUnverified = !entry.verified || entry.status === 'VERIFY' || entry.status?.includes('VERIFY');
            const isCulmination = entry.id === 'j-5' || index === filteredJourney.length - 1;

            return (
              <CinematicJourneyCard
                key={entry.id}
                entry={entry}
                index={index}
                total={filteredJourney.length}
                prefersReducedMotion={prefersReducedMotion}
                isCulmination={isCulmination}
                isUnverified={isUnverified}
              />
            );
          })}
        </div>

        {/* Chronology Summary & Honesty Guarantee Footer */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL PRIMARY RECORDS AUDITED &amp; VERIFIED INDEPENDENTLY</span>
          </div>
          <div className="text-neutral-400 text-center sm:text-right">
            <span>PROJECT HONESTY PROTOCOL &bull; UPDATED 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;

