import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  Play,
  Pause,
  ArrowLeft,
  Terminal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioData } from '../context/PortfolioDataContext';

const TIMELINE_FILTERS = [
  { id: 'ALL', label: 'All Chapters', badge: '5' },
  { id: 'VERIFIED', label: 'Verified Chronology', badge: '4' },
  { id: 'FRONTLINE', label: 'Frontline Commercial', badge: '3' },
  { id: 'AI_SYSTEMS', label: 'AI Practice', badge: '1' },
];

/**
 * Single Vertical Timeline Milestone Node
 * Features scroll-triggered entrance, progressive glow trigger,
 * expandable audit proofs, tactical metrics, and commercial takeaways.
 */
function TimelineMilestoneNode({ 
  entry, 
  index, 
  prefersReducedMotion,
  isActiveNode 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCulmination = entry.id === 'j-5' || entry.role?.toLowerCase().includes('ai generalist');
  const isUnverified = entry.status === 'VERIFY BEFORE PUBLISHING' || entry.verified === false;

  const themes = entry.keyThemes || entry.coreThemes || [];
  const chapterNumber = `0${index + 1}`.slice(-2);
  const nodeId = `milestone-${entry.id || index + 1}`;

  return (
    <motion.div
      id={nodeId}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-8 sm:pl-14 pb-12 group/node"
    >
      {/* Node Anchor Beacon on the Vertical Spine */}
      <div className="absolute left-0 top-3 -translate-x-1/2 z-20 flex items-center justify-center">
        {/* Pulsing Aura Halo */}
        <div 
          className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
            isActiveNode
              ? 'opacity-100 scale-125'
              : 'opacity-40 group-hover/node:opacity-80 scale-100'
          } ${
            isCulmination 
              ? 'bg-red-500/35 animate-ping' 
              : isUnverified 
              ? 'bg-amber-500/25' 
              : 'bg-emerald-500/25'
          }`} 
        />
        
        {/* Outer Beveled Node Ring */}
        <div 
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-xl ${
            isActiveNode ? 'scale-125' : 'group-hover/node:scale-115'
          } ${
            isCulmination
              ? 'bg-[#18090b] border-red-500 shadow-[0_0_20px_#ff2a3a]'
              : isUnverified
              ? 'bg-[#141008] border-amber-500 shadow-[0_0_14px_#f59e0b]'
              : 'bg-[#091410] border-emerald-500 shadow-[0_0_14px_#10b981]'
          }`}
        >
          {/* Inner Core Dot */}
          <div 
            className={`w-2.5 h-2.5 rounded-full ${
              isCulmination 
                ? 'bg-red-400' 
                : isUnverified 
                ? 'bg-amber-400' 
                : 'bg-emerald-400'
            }`} 
          />
        </div>
      </div>

      {/* Milestone Card Body */}
      <div 
        className={`rounded-2xl border p-5 sm:p-7 transition-all duration-300 relative overflow-hidden select-none sm:select-auto ${
          isCulmination
            ? 'bg-gradient-to-b from-[#180a0e] via-[#10080b] to-[#0a0608] border-red-500/50 shadow-[0_20px_50px_rgba(255,42,58,0.18),inset_0_1px_0_rgba(255,255,255,0.2)] ring-1 ring-red-500/30'
            : isUnverified
            ? 'bg-gradient-to-b from-[#14100a] via-[#0d0a06] to-[#070605] border-amber-500/40 hover:border-amber-500/60 shadow-[0_16px_40px_rgba(0,0,0,0.7)]'
            : 'bg-gradient-to-b from-[#0e111a] via-[#090b12] to-[#05060a] border-white/12 hover:border-white/25 hover:bg-[#111420] shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]'
        }`}
      >
        {/* Ambient Top Glint Line */}
        <div className={`absolute top-0 inset-x-0 h-[1.5px] pointer-events-none ${
          isCulmination 
            ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_#ff2a3a]' 
            : isUnverified
            ? 'bg-gradient-to-r from-transparent via-amber-500/60 to-transparent shadow-[0_0_10px_#f59e0b]'
            : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
        }`} />

        {/* Phase Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 mb-4 border-b border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${
              isCulmination
                ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                : isUnverified
                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
                : 'bg-white/10 text-neutral-200 border border-white/15'
            }`}>
              CH {chapterNumber} &bull; {entry.phase || 'CAREER MILESTONE'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCulmination ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_12px_rgba(255,42,58,0.3)]">
                <Sparkles className="w-3 h-3 text-red-400" />
                ACTIVE CULMINATION
              </span>
            ) : isUnverified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                RECORD REVIEW
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                GROUND VERIFIED
              </span>
            )}
          </div>
        </div>

        {/* Role & Company Header */}
        <div className="space-y-1.5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
              {entry.role}
            </h3>
            <span className="font-mono text-xs text-red-400 font-bold flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{entry.period}</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-300">
            <span className="text-white font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-red-400" />
              <span>{entry.company}</span>
            </span>
            <span className="text-neutral-600">&bull;</span>
            <span className="flex items-center gap-1 text-neutral-400">
              <MapPin className="w-3 h-3 text-neutral-500" />
              <span>{entry.location}</span>
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
          {entry.description}
        </p>

        {/* Battle-Tested Themes & Competencies */}
        {themes.length > 0 && (
          <div className="mb-5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2 font-bold flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-red-400" />
              BATTLE-TESTED COMPETENCIES:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {themes.map((theme, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-lg bg-[#07080d] border border-white/10 font-mono text-[11px] text-neutral-300 hover:text-white hover:border-red-500/40 transition-colors shadow-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Core Commercial Takeaway Box */}
        {entry.takeaways && (
          <div className={`p-4.5 rounded-xl border font-sans text-xs sm:text-sm leading-relaxed space-y-2 ${
            isCulmination
              ? 'bg-[#220d13]/90 border-red-500/40 text-red-100 shadow-[0_8px_20px_rgba(255,42,58,0.15)]'
              : 'bg-[#080910] border-white/10 text-neutral-200 shadow-inner'
          }`}>
            <span className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              COMMERCIAL TAKEAWAY & OPERATIONAL GROUND TRUTH:
            </span>
            <p className="italic font-medium">
              &ldquo;{entry.takeaways}&rdquo;
            </p>
          </div>
        )}

        {/* Expandable Deep Inspection Drawer Toggle */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-[10px] text-neutral-500">
            RECORD ID: {entry.id || `JOURNEY-${index + 1}`}
          </span>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10"
          >
            <span>{isExpanded ? 'COLLAPSE AUDIT' : 'INSPECT AUDIT PROOF'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expanded Audit Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-white/10 space-y-3 font-mono text-xs text-neutral-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase block font-bold">AUDIT RIGOR:</span>
                  <span className="text-white font-semibold">
                    {isUnverified ? 'UNDER INDEPENDENT REVIEW' : '100% GROUND TRUTH VERIFIED'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase block font-bold">SYSTEM IMPACT:</span>
                  <span className="text-white font-semibold">
                    {isCulmination ? 'AUTONOMOUS OPERATING LEVERAGE' : 'COMMERCIAL CLIENT ACQUISITION'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/**
 * Vertical Journey Timeline Component
 * Can be rendered as an interactive full-page experience or as a modal dialog.
 */
export default function VerticalJourneyTimeline({ 
  isOpen = true, 
  onClose,
  standalone = false 
}) {
  const { allJourney } = usePortfolioData();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  // Scroll Progress Physics using motion value to prevent hydration invariant errors
  const scrollYProgress = useMotionValue(0);

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Container scroll handler for modal mode
  const handleContainerScroll = useCallback((e) => {
    const el = e.currentTarget;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const progress = maxScroll > 0 ? el.scrollTop / maxScroll : 0;
    scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
  }, [scrollYProgress]);

  // Window scroll handler for standalone page mode
  useEffect(() => {
    if (!standalone) return;
    const handleWindowScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      scrollYProgress.set(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [standalone, scrollYProgress]);

  // Close on Escape Key (when in modal mode)
  useEffect(() => {
    if (standalone) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, standalone]);

  // Lock body scroll when open as modal
  useEffect(() => {
    if (standalone) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, standalone]);

  const filteredEntries = useMemo(() => {
    const list = allJourney && allJourney.length > 0 ? allJourney : [];
    if (activeFilter === 'VERIFIED') {
      return list.filter((j) => j.status === 'VERIFIED' || j.verified);
    }
    if (activeFilter === 'FRONTLINE') {
      return list.filter((j) => 
        j.company?.toLowerCase().includes('paytm') || 
        j.company?.toLowerCase().includes('airtel') || 
        j.company?.toLowerCase().includes('excitel')
      );
    }
    if (activeFilter === 'AI_SYSTEMS') {
      return list.filter((j) => 
        j.id === 'j-5' || 
        j.role?.toLowerCase().includes('ai generalist')
      );
    }
    return list;
  }, [allJourney, activeFilter]);

  // Jump to specific milestone node
  const handleJumpToNode = useCallback((index) => {
    setActiveNodeIndex(index);
    const targetEntry = filteredEntries[index];
    if (!targetEntry) return;

    const el = document.getElementById(`milestone-${targetEntry.id || index + 1}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filteredEntries]);

  // Auto-Tour Walking Effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveNodeIndex((prev) => {
        const next = (prev + 1) % filteredEntries.length;
        const targetEntry = filteredEntries[next];
        if (targetEntry) {
          const el = document.getElementById(`milestone-${targetEntry.id || next + 1}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return next;
      });
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, filteredEntries]);

  if (!standalone && !isOpen) return null;

  const content = (
    <div className={`relative w-full ${standalone ? 'min-h-screen py-10 px-4 sm:px-6 lg:px-8' : 'h-[92vh] max-w-5xl mx-3 sm:mx-6 rounded-3xl bg-gradient-to-b from-[#0c0e18]/98 via-[#070810]/98 to-[#04050a]/99 border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(255,42,58,0.15),inset_0_1px_0_rgba(255,255,255,0.25)] flex flex-col overflow-hidden'}`}>
      {/* Top Horizon Red Flare */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_16px_#ff2a3a] pointer-events-none z-30" />

      {/* Header Bar */}
      <div className={`p-6 sm:px-8 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-[#080912]/90 backdrop-blur-md relative z-20 ${standalone ? 'rounded-2xl max-w-5xl mx-auto mb-6' : ''}`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2a3a]" />
            <span>CAREER VECTOR &bull; VERTICAL TIMELINE ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-white flex items-center gap-2.5">
            <span>Professional Journey</span>
            <span className="text-xs font-mono font-normal text-red-300 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 hidden sm:inline-block">
              Interactive Scroll-Triggered
            </span>
          </h1>
          <p className="font-sans text-xs text-neutral-400 max-w-xl">
            Chronological progression from frontline merchant sales to enterprise connectivity and autonomous AI systems architecture.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {/* Auto-Tour Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
              isAutoPlaying 
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_16px_rgba(255,42,58,0.4)]'
                : 'bg-white/10 text-neutral-200 border-white/15 hover:bg-white/15'
            }`}
            title="Auto-Tour Milestones Walkthrough"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-red-400" />}
            <span>{isAutoPlaying ? 'PAUSE TOUR' : 'AUTO-TOUR'}</span>
          </button>

          {standalone ? (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN HOME</span>
            </Link>
          ) : (
            onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                aria-label="Close timeline view"
              >
                <X className="w-5 h-5" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter Toolbar & Chapter Scrubber */}
      <div className={`px-6 sm:px-8 py-3.5 border-b border-white/10 bg-[#090b14]/85 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono shrink-0 z-20 ${standalone ? 'rounded-2xl max-w-5xl mx-auto mb-8' : ''}`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-500 mr-1 text-[11px] uppercase tracking-wider hidden sm:inline">
            Phase Filter:
          </span>
          {TIMELINE_FILTERS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-red-600 text-white border-red-500 font-bold shadow-[0_0_12px_rgba(255,42,58,0.3)]'
                  : 'bg-[#121422] text-neutral-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Milestone Fast-Jumper Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-neutral-500 text-[10px] mr-1 uppercase">Jump:</span>
          {filteredEntries.map((e, idx) => (
            <button
              key={e.id || idx}
              type="button"
              onClick={() => handleJumpToNode(idx)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                activeNodeIndex === idx
                  ? 'bg-red-500/25 text-red-300 border border-red-500/50 font-bold'
                  : 'bg-white/5 text-neutral-400 border border-white/5 hover:text-white'
              }`}
            >
              0{idx + 1} {e.company?.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Strategic Evolution Vector Narrative Banner */}
      <div className={`mx-6 sm:mx-8 mt-5 p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-[#0d0f18]/80 to-transparent border border-red-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${standalone ? 'max-w-5xl mx-auto' : ''}`}>
        <div className="flex items-center gap-2.5 text-neutral-200">
          <TrendingUp className="w-4 h-4 text-red-400 shrink-0" />
          <span>TRANSFORMATION VECTOR: Ground Sales &rarr; High-Bandwidth B2B &rarr; Autonomous AI Agent Practice</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          ALL RECORDS AUDITED
        </span>
      </div>

      {/* Scrollable Timeline Viewport with Interactive Spine */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        className={`flex-1 overflow-y-auto px-6 sm:px-12 py-10 relative scroll-smooth selection:bg-red-600 selection:text-white ${standalone ? 'max-w-5xl mx-auto' : ''}`}
      >
        <div className="relative max-w-3xl mx-auto">
          {/* Background Static Vertical Track */}
          <div 
            aria-hidden="true"
            className="absolute left-0 top-3 bottom-8 w-[2px] -translate-x-1/2 bg-white/10 rounded-full"
          />

          {/* Scroll-Triggered Dynamic Glowing Laser Spine */}
          <motion.div 
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute left-0 top-3 bottom-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-red-500 via-rose-500 to-amber-500 origin-top rounded-full shadow-[0_0_14px_#ff2a3a]"
          />

          {/* Milestone Nodes */}
          <div className="space-y-2">
            {filteredEntries.map((entry, idx) => (
              <TimelineMilestoneNode
                key={entry.id || idx}
                entry={entry}
                index={idx}
                isLast={idx === filteredEntries.length - 1}
                prefersReducedMotion={false}
                isActiveNode={activeNodeIndex === idx}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Bottom Controls */}
      <div className={`p-4 sm:px-8 border-t border-white/10 bg-[#080912]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-400 shrink-0 z-20 ${standalone ? 'rounded-2xl max-w-5xl mx-auto mt-8' : ''}`}>
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive scroll animation tracks milestone progress along the laser spine</span>
        </div>

        {standalone ? (
          <Link
            to="/"
            className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors cursor-pointer self-end sm:self-auto"
          >
            Return to Portfolio OS
          </Link>
        ) : (
          onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-bold hover:bg-neutral-200 transition-colors cursor-pointer self-end sm:self-auto"
            >
              Close Timeline
            </button>
          )
        )}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div className="bg-[#05060a] min-h-screen text-neutral-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
        {content}
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 select-none sm:select-auto"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {content}
    </div>
  );
}
