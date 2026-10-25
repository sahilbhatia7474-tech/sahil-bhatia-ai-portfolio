import { useState, useRef, useCallback, useMemo } from 'react';
import { CAPABILITY_MAP } from '../data/portfolioData';
import {
  Layers,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Activity,
  X,
  Filter,
  Radio,
  Crosshair,
} from 'lucide-react';

/**
 * Subtle tactile sound synthesizer for interactive mechanical clicks & hover
 */
function playTactileFeedback(type = 'tab') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'tab') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.035);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // AudioContext blocked or not supported - silent graceful fallback
  }
}

/**
 * Razor-Sharp 3D Spatial Capability Cluster Console
 * 100% crisp typography, high-contrast text, tactile 3D elevation, dynamic specular glare,
 * and illuminated hardware accents with zero blur.
 */
const SpatialClusterConsole = ({ cluster, clusterIndex, totalClusters, isFiltered }) => {
  const [activeSkillIndex, setActiveSkillIndex] = useState(null);
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setGlare({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setGlare((prev) => ({ ...prev, active: false }));
  }, []);

  // Category thematic accents & icons
  const theme = useMemo(() => {
    switch (clusterIndex) {
      case 0:
        return {
          themeName: 'CRIMSON ARC',
          code: 'SYS_01',
          laserBeam: 'from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(255,42,58,0.9)]',
          borderHover: 'hover:border-red-400 hover:shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(255,42,58,0.45),inset_0_2px_0_rgba(255,255,255,0.4)]',
          badgeBg: 'bg-gradient-to-br from-red-600/30 to-red-950/80 border-red-500/70 text-red-300 shadow-[0_0_16px_rgba(255,42,58,0.5)]',
          dot: 'bg-red-500 shadow-[0_0_14px_#ff2a3a]',
          accent: 'text-red-400',
          beacon: 'bg-red-500',
          watermark: 'text-red-500/10',
          activeSkillBg: 'bg-gradient-to-r from-[#26131c] via-[#1a0e16] to-[#120a10] border-red-500/60 shadow-[0_10px_26px_rgba(255,42,58,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]',
          activeSkillDot: 'bg-red-400 shadow-[0_0_12px_#ff2a3a]',
          icon: Cpu,
        };
      case 1:
        return {
          themeName: 'KINETIC THUNDER',
          code: 'SYS_02',
          laserBeam: 'from-transparent via-amber-400 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.9)]',
          borderHover: 'hover:border-amber-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(245,158,11,0.45),inset_0_2px_0_rgba(255,255,255,0.4)]',
          badgeBg: 'bg-gradient-to-br from-amber-600/30 to-amber-950/80 border-amber-400/70 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.5)]',
          dot: 'bg-amber-400 shadow-[0_0_14px_#f59e0b]',
          accent: 'text-amber-400',
          beacon: 'bg-amber-400',
          watermark: 'text-amber-500/10',
          activeSkillBg: 'bg-gradient-to-r from-[#261c10] via-[#1c140a] to-[#120d06] border-amber-400/60 shadow-[0_10px_26px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]',
          activeSkillDot: 'bg-amber-400 shadow-[0_0_12px_#f59e0b]',
          icon: Zap,
        };
      case 2:
        return {
          themeName: 'QUANTUM ARC',
          code: 'SYS_03',
          laserBeam: 'from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(56,189,248,0.9)]',
          borderHover: 'hover:border-cyan-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(56,189,248,0.45),inset_0_2px_0_rgba(255,255,255,0.4)]',
          badgeBg: 'bg-gradient-to-br from-cyan-600/30 to-cyan-950/80 border-cyan-400/70 text-cyan-300 shadow-[0_0_16px_rgba(56,189,248,0.5)]',
          dot: 'bg-cyan-400 shadow-[0_0_14px_#38bdf8]',
          accent: 'text-cyan-400',
          beacon: 'bg-cyan-400',
          watermark: 'text-cyan-500/10',
          activeSkillBg: 'bg-gradient-to-r from-[#101f2e] via-[#0a1622] to-[#060e16] border-cyan-400/60 shadow-[0_10px_26px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]',
          activeSkillDot: 'bg-cyan-400 shadow-[0_0_12px_#38bdf8]',
          icon: Layers,
        };
      default:
        return {
          themeName: 'VIBRANIUM MATRIX',
          code: 'SYS_04',
          laserBeam: 'from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.9)]',
          borderHover: 'hover:border-emerald-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_40px_rgba(16,185,129,0.45),inset_0_2px_0_rgba(255,255,255,0.4)]',
          badgeBg: 'bg-gradient-to-br from-emerald-600/30 to-emerald-950/80 border-emerald-400/70 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.5)]',
          dot: 'bg-emerald-400 shadow-[0_0_14px_#10b981]',
          accent: 'text-emerald-400',
          beacon: 'bg-emerald-400',
          watermark: 'text-emerald-500/10',
          activeSkillBg: 'bg-gradient-to-r from-[#0d241c] via-[#091a14] to-[#05110d] border-emerald-400/60 shadow-[0_10px_26px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.3)]',
          activeSkillDot: 'bg-emerald-400 shadow-[0_0_12px_#10b981]',
          icon: Activity,
        };
    }
  }, [clusterIndex]);

  const IconComponent = theme.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group/card relative h-full transition-all duration-300 ${
        isFiltered ? 'opacity-100' : 'opacity-100'
      }`}
    >
      {/* 3D Tactile Outer Console Plinth (Razor-sharp typography, zero blur) */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#15182e] via-[#0c0e1a] to-[#060710] p-5 sm:p-6 overflow-hidden border-2 ${
          isFiltered
            ? 'border-red-500 ring-2 ring-red-500/60 shadow-[0_0_40px_rgba(255,42,58,0.5)]'
            : 'border-white/20'
        } ${theme.borderHover} shadow-[0_24px_60px_-10px_rgba(0,0,0,0.98),inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.85)] hover:-translate-y-3 transition-all duration-300`}
      >
        {/* Dynamic Specular Glass Glare that smoothly tracks cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: glare.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.16), transparent 70%)`,
          }}
        />

        {/* Ambient Top Laser Horizon Rail */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${theme.laserBeam}`}
        />

        {/* Massive CAD Blueprint Watermark Number */}
        <span
          aria-hidden="true"
          className={`absolute top-1 right-3 text-7xl sm:text-8xl font-mono font-black select-none pointer-events-none ${theme.watermark} leading-none tracking-tighter`}
        >
          0{clusterIndex + 1}
        </span>

        {/* High-Tech Machined Corner Brackets */}
        <div className={`absolute top-2.5 left-2.5 text-[11px] font-mono ${theme.accent} select-none pointer-events-none font-black`}>
          ┌
        </div>
        <div className={`absolute top-2.5 right-2.5 text-[11px] font-mono ${theme.accent} select-none pointer-events-none font-black`}>
          ┐
        </div>
        <div className={`absolute bottom-2.5 left-2.5 text-[11px] font-mono ${theme.accent} select-none pointer-events-none font-black`}>
          └
        </div>
        <div className={`absolute bottom-2.5 right-2.5 text-[11px] font-mono ${theme.accent} select-none pointer-events-none font-black`}>
          ┘
        </div>

        {/* Console Depth Layer 1: Cluster Header */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 ${theme.badgeBg}`}>
                <IconComponent className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-black">
                    {theme.code} // {theme.themeName}
                  </span>
                  <span className="relative flex items-center justify-center w-2 h-2">
                    <span className={`absolute w-3 h-3 rounded-full ${theme.beacon} animate-tactical-beacon opacity-75`} />
                    <span className={`relative w-1.5 h-1.5 rounded-full ${theme.dot} animate-tactical-blink`} />
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black font-display uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] truncate mt-0.5">
                  {cluster.category}
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-gradient-to-b from-[#1b2138] to-[#0e1220] text-white border-2 border-white/30 shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]">
                {cluster.skills.length} UNITS
              </span>
              <span className="text-[9px] font-mono text-emerald-300 font-bold mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>

          {/* Skill Item Rows - 100% Razor-Sharp High Contrast Typography */}
          <div className="space-y-3">
            {cluster.skills.map((skill, sIdx) => {
              const isSkillActive = activeSkillIndex === sIdx;
              return (
                <div
                  key={skill.name}
                  onMouseEnter={() => {
                    playTactileFeedback('hover');
                    setActiveSkillIndex(sIdx);
                  }}
                  onMouseLeave={() => setActiveSkillIndex(null)}
                  className={`p-3.5 rounded-2xl transition-all duration-200 border-2 cursor-default select-none ${
                    isSkillActive
                      ? `${theme.activeSkillBg} translate-x-1.5`
                      : 'bg-[#0f1220]/90 hover:bg-[#15192c] border-white/15 hover:border-white/40 shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white font-sans tracking-tight flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          isSkillActive
                            ? `${theme.activeSkillDot} scale-125`
                            : 'bg-neutral-300 shadow-[0_0_4px_rgba(255,255,255,0.6)]'
                        }`}
                      />
                      <span className="drop-shadow-sm font-bold">{skill.name}</span>
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2.5 py-0.5 rounded-lg font-black border uppercase tracking-wider transition-colors shadow-sm ${
                        skill.level.toLowerCase().includes('expert')
                          ? 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                          : skill.level.toLowerCase().includes('core')
                          ? 'bg-red-950/90 text-red-200 border-red-500/80 shadow-[0_0_12px_rgba(255,42,58,0.5)]'
                          : skill.level.toLowerCase().includes('high velocity')
                          ? 'bg-sky-950/90 text-sky-200 border-sky-500/80 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                          : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-100 font-sans leading-relaxed font-normal">
                    {skill.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console Depth Layer 2: Telemetry Footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-neutral-300">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
            <span>Deployed Production Unit</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-neutral-300 tracking-wider font-bold">
              SYS 0{clusterIndex + 1}/{totalClusters}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CapabilityMap = () => {
  const sectionRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [_isHovered, setIsHovered] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL');
  const [activeLevelFilter, setActiveLevelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Smooth environmental lighting tracking across the entire section viewport
  const handleSectionMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const corePillars = useMemo(
    () => [
      { label: 'AI & AGENTIC SYSTEMS', status: 'CORE', metric: 'LLMs & Tool Use', code: '01', icon: Cpu },
      { label: 'AUTOMATION', status: 'PROFICIENT', metric: 'n8n & Webhooks', code: '02', icon: Zap },
      { label: 'PRODUCT & UX', status: 'CORE', metric: 'Design & Interaction', code: '03', icon: Layers },
      { label: 'AI BUILDING', status: 'CORE', metric: '0-to-1 Prototypes', code: '04', icon: Terminal },
      { label: 'PROMPT ENGINEERING', status: 'EXPERT', metric: 'JSON & Guardrails', code: '05', icon: Sliders },
      { label: 'VIBE CODING', status: 'HIGH VELOCITY', metric: 'Claude / Cursor / AI Studio', code: '06', icon: Activity },
      { label: 'DATA / AI ANALYSIS', status: 'PROFICIENT', metric: 'Metrics & Funnels', code: '07', icon: ArrowUpRight },
      { label: 'BUSINESS PROBLEM SOLVING', status: 'FIELD-TESTED', metric: 'Commercial Reality', code: '08', icon: CheckCircle2 },
    ],
    []
  );

  // 3D Glowing Blinking Tabs Configuration with distinct lively themes
  const domainTabs = useMemo(() => {
    return [
      {
        id: 'ALL',
        label: 'ALL CAPABILITIES',
        code: 'ALL',
        count: 18,
        beacon: 'red',
        colorClass: 'from-red-600 via-rose-600 to-red-800',
        glowColor: 'rgba(255,42,58,0.7)',
        icon: Crosshair,
      },
      {
        id: 'AI & Agentic Systems',
        label: 'AI & AGENTS',
        code: 'SYS-01',
        count: 6,
        beacon: 'red',
        colorClass: 'from-red-600 via-rose-600 to-red-700',
        glowColor: 'rgba(255,42,58,0.7)',
        icon: Cpu,
      },
      {
        id: 'Automation & Velocity Building',
        label: 'AUTOMATION',
        code: 'SYS-02',
        count: 5,
        beacon: 'amber',
        colorClass: 'from-amber-500 via-amber-600 to-yellow-600',
        glowColor: 'rgba(245,158,11,0.7)',
        icon: Zap,
      },
      {
        id: 'Product & Experience Architecture',
        label: 'PRODUCT & UX',
        code: 'SYS-03',
        count: 4,
        beacon: 'sky',
        colorClass: 'from-cyan-500 via-sky-600 to-blue-700',
        glowColor: 'rgba(56,189,248,0.7)',
        icon: Layers,
      },
      {
        id: 'Commercial Reality & Execution',
        label: 'STRATEGY & SALES',
        code: 'SYS-04',
        count: 3,
        beacon: 'emerald',
        colorClass: 'from-emerald-500 via-teal-600 to-green-700',
        glowColor: 'rgba(16,185,129,0.7)',
        icon: ShieldCheck,
      },
    ];
  }, []);

  const levelFilterOptions = [
    { id: 'ALL', label: 'All Levels' },
    { id: 'Core', label: 'Core' },
    { id: 'Expert', label: 'Expert' },
    { id: 'High Velocity', label: 'High Velocity' },
    { id: 'Field-Tested', label: 'Field-Tested' },
  ];

  const handleTabClick = (tabId) => {
    playTactileFeedback('tab');
    setActiveCategoryTab(tabId);
  };

  const handleLevelClick = (lvlId) => {
    playTactileFeedback('tab');
    setActiveLevelFilter(lvlId);
  };

  // Filter clusters and their skills dynamically
  const displayedClusters = useMemo(() => {
    return CAPABILITY_MAP.map((cluster) => {
      const isCategoryMatch =
        activeCategoryTab === 'ALL' || cluster.category === activeCategoryTab;

      const filteredSkills = cluster.skills.filter((skill) => {
        if (activeLevelFilter !== 'ALL' && !skill.level.toLowerCase().includes(activeLevelFilter.toLowerCase())) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const inName = skill.name.toLowerCase().includes(q);
          const inNotes = skill.notes.toLowerCase().includes(q);
          const inLevel = skill.level.toLowerCase().includes(q);
          if (!inName && !inNotes && !inLevel) return false;
        }
        return true;
      });

      return {
        ...cluster,
        skills: filteredSkills,
        isHighlighted: isCategoryMatch,
        isVisible: isCategoryMatch || (searchQuery.trim().length > 0 && filteredSkills.length > 0),
      };
    });
  }, [activeCategoryTab, activeLevelFilter, searchQuery]);

  const totalVisibleSkills = useMemo(() => {
    return displayedClusters.reduce((acc, c) => acc + (c.isVisible ? c.skills.length : 0), 0);
  }, [displayedClusters]);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-24 sm:py-32 bg-transparent border-b border-white/20 relative overflow-hidden section-spatial-containment"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================= */}
      {/* 5 BACKGROUND LAYERS PRESERVING EXACT DOM TREE INDEXING     */}
      {/* ========================================================= */}

      {/* Layer 1: Dynamic Interactive Laser Spotlight & Cyber Nebulae */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle 850px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 42, 58, 0.28), rgba(56, 189, 248, 0.18) 35%, rgba(139, 92, 246, 0.08) 55%, transparent 75%)`,
          transition: 'background 0.08s ease-out',
        }}
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
      />

      {/* Layer 2: Precision Stark/Avengers Holographic Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-35 sm:opacity-45 bg-[linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:48px_48px]"
      />

      {/* Layer 3: Concentric Tactical Holographic Arc Reactor Radar Rings (Crisp Vector, Luminous Stark HUD) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-[850px] h-[850px] sm:w-[1100px] sm:h-[1100px] opacity-75 sm:opacity-85 filter drop-shadow-[0_0_30px_rgba(255,42,58,0.4)]"
          fill="none"
          stroke="currentColor"
        >
          <defs>
            <filter id="arcGlowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="arcGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="reactorPlasmaCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#ff2a3a" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#06070d" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Reactor Plasma Radial Glow */}
          <circle cx="500" cy="500" r="190" fill="url(#reactorPlasmaCore)" />

          {/* Group 1: Clockwise Outer Radar Ring Array */}
          <g className="animate-rotating-gyro" style={{ transformOrigin: '500px 500px' }}>
            {/* Outermost Perimeter Telemetry Ring */}
            <circle cx="500" cy="500" r="485" stroke="rgba(56,189,248,0.7)" strokeWidth="1.2" strokeDasharray="24 12" />
            <circle cx="500" cy="500" r="460" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="6 8" />
            
            {/* Middle Reactor Segmented Power Rails */}
            <circle cx="500" cy="500" r="380" stroke="rgba(255,42,58,0.85)" strokeWidth="2.5" strokeDasharray="32 16" filter="url(#arcGlowRed)" />
            <circle cx="500" cy="500" r="340" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="8 12" />
            
            {/* Inner Ring with Dashed Metric Marks */}
            <circle cx="500" cy="500" r="280" stroke="rgba(56,189,248,0.85)" strokeWidth="2" strokeDasharray="12 8" filter="url(#arcGlowCyan)" />

            {/* Cardinal Degree Hashes */}
            <line x1="500" y1="20" x2="500" y2="55" stroke="#ff2a3a" strokeWidth="3" />
            <line x1="500" y1="945" x2="500" y2="980" stroke="#ff2a3a" strokeWidth="3" />
            <line x1="20" y1="500" x2="55" y2="500" stroke="#38bdf8" strokeWidth="3" />
            <line x1="945" y1="500" x2="980" y2="500" stroke="#38bdf8" strokeWidth="3" />

            {/* Degree Text Labels */}
            <text x="500" y="80" textAnchor="middle" fill="#ff2a3a" fontSize="13" fontFamily="monospace" fontWeight="bold">000° // NORTH_CORE</text>
            <text x="920" y="505" textAnchor="end" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">090° // EAST_SYS</text>
            <text x="500" y="935" textAnchor="middle" fill="#ff2a3a" fontSize="13" fontFamily="monospace" fontWeight="bold">180° // SOUTH_GRID</text>
            <text x="80" y="505" textAnchor="start" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">270° // WEST_LINK</text>
          </g>

          {/* Group 2: Counter-Clockwise Inner Tactical Gyro */}
          <g className="animate-rotating-gyro-reverse" style={{ transformOrigin: '500px 500px' }}>
            {/* Central Reactor Plasma Core Rings */}
            <circle cx="500" cy="500" r="210" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeDasharray="4 6" />
            <circle cx="500" cy="500" r="140" stroke="rgba(56,189,248,0.95)" strokeWidth="2.5" strokeDasharray="20 10" filter="url(#arcGlowCyan)" />
            <circle cx="500" cy="500" r="90" stroke="rgba(255,42,58,0.95)" strokeWidth="2.5" strokeDasharray="10 8" filter="url(#arcGlowRed)" />

            {/* Central Pinpoint Reticle */}
            <circle cx="500" cy="500" r="8" fill="#38bdf8" />
            <circle cx="500" cy="500" r="25" stroke="#ff2a3a" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Inner Angular Crosshairs */}
            <line x1="420" y1="500" x2="475" y2="500" stroke="#38bdf8" strokeWidth="2" />
            <line x1="525" y1="500" x2="580" y2="500" stroke="#38bdf8" strokeWidth="2" />
            <line x1="500" y1="420" x2="500" y2="475" stroke="#38bdf8" strokeWidth="2" />
            <line x1="500" y1="525" x2="500" y2="580" stroke="#38bdf8" strokeWidth="2" />
          </g>

          {/* Fixed Alignment Crosshairs across entire matrix */}
          <line x1="500" y1="10" x2="500" y2="990" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="16 12" />
          <line x1="10" y1="500" x2="990" y2="500" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="16 12" />

          {/* Diagonal target calipers */}
          <line x1="140" y1="140" x2="860" y2="860" stroke="rgba(255,42,58,0.45)" strokeWidth="0.8" strokeDasharray="8 12" />
          <line x1="140" y1="860" x2="860" y2="140" stroke="rgba(56,189,248,0.45)" strokeWidth="0.8" strokeDasharray="8 12" />
        </svg>
      </div>

      {/* Layer 4: Deep Spatial Vignette (Transparent Core revealing Shield & Reactor) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_35%,transparent_45%,rgba(6,8,16,0.3)_72%,rgba(4,5,10,0.65)_92%,rgba(4,5,10,0.85)_100%)]"
      />

      {/* Layer 5: Laser Horizon Rails with Quantum Beacons & Specular CRT Beam Sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top laser rail */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 via-rose-400 via-cyan-400 to-transparent shadow-[0_0_28px_rgba(255,42,58,0.95)]" />
        {/* Bottom laser rail */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-sky-300 to-transparent shadow-[0_0_24px_rgba(56,189,248,0.9)]" />
        
        {/* Ambient vertical CRT electron sweep */}
        <div className="crt-beam-sweep" />

        {/* Corner alignment crosshairs */}
        <span className="absolute top-4 left-6 text-xs font-mono font-bold text-red-500/75 select-none drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]">[ +02.CAP_MATRIX // SECTOR_ACTIVE ]</span>
        <span className="absolute top-4 right-6 text-xs font-mono font-bold text-cyan-400/75 select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">[ TACTICAL_SYS.ONLINE // RADAR_360° ]</span>
        <span className="absolute bottom-4 left-6 text-[10px] font-mono text-neutral-300 select-none">LAT: 28.6139° N // LON: 77.2090° E // ELEV: 216m</span>
        <span className="absolute bottom-4 right-6 text-[10px] font-mono text-cyan-300 font-bold select-none drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]">● VERIFIED FRONT-LINE CAPABILITY ARCHITECTURE</span>
      </div>

      {/* ========================================================= */}
      {/* FOREGROUND CONTAINER (MATCHES div:nth-of-type(6))         */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Child 1: Section Header & 3D Interactive Glowing Blinking Tabs HUD (Matches Selector 8 / CSS selector 2) */}
        <div className="mb-10 sm:mb-14">
          {/* Child 1 of Child 1: Frosted Cybernetic Command Chassis (Matches Selector 1) */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#13172c]/70 via-[#0a0d1a]/80 to-[#050711]/90 border-2 border-white/20 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(255,42,58,0.18),inset_0_2px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.85)] flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 overflow-hidden">
            {/* Top Specular Laser Horizon Edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500/80 via-cyan-400/80 to-transparent shadow-[0_0_15px_rgba(255,42,58,0.8)]"
            />

            {/* Tactical Machined Corner Brackets */}
            <div className="absolute top-2.5 left-2.5 text-[11px] font-mono text-red-500/80 select-none pointer-events-none font-black">
              ┌
            </div>
            <div className="absolute top-2.5 right-2.5 text-[11px] font-mono text-cyan-400/80 select-none pointer-events-none font-black">
              ┐
            </div>
            <div className="absolute bottom-2.5 left-2.5 text-[11px] font-mono text-cyan-400/80 select-none pointer-events-none font-black">
              └
            </div>
            <div className="absolute bottom-2.5 right-2.5 text-[11px] font-mono text-red-500/80 select-none pointer-events-none font-black">
              ┘
            </div>

            {/* Holographic Watermark Moniker */}
            <span
              aria-hidden="true"
              className="absolute -right-4 -bottom-6 text-7xl sm:text-8xl font-mono font-black select-none pointer-events-none text-white/[0.03] leading-none tracking-tighter"
            >
              RADAR_02
            </span>
            
            {/* Title & Lead Paragraph */}
            <div className="relative z-10">
              {/* Tactical Status Flight-Deck Masthead with Multi-Frequency Blinking Radar Beacon */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/95 via-[#0d1020] to-red-950/95 border-2 border-red-500/80 font-mono text-[11px] text-red-300 uppercase tracking-widest shadow-[0_0_30px_rgba(255,42,58,0.5),inset_0_1.5px_0_rgba(255,255,255,0.4)] select-none">
                  <span className="relative flex items-center justify-center w-2.5 h-2.5">
                    <span className="absolute w-4 h-4 rounded-full bg-red-500 animate-tactical-beacon opacity-80" />
                    <span className="relative w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_14px_#ff2a3a] animate-tactical-blink" />
                  </span>
                  <span className="font-black text-white tracking-wider">PROTOCOL: 02 // CAPABILITY_MATRIX</span>
                  <span className="text-red-400 font-bold">&bull;</span>
                  <span className="text-cyan-300 font-bold">STARK OS HUD</span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a0f1d] border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                  <span>FREQUENCY: 432Hz · LATENCY: 0.2ms · GRID: OPTIMAL</span>
                </div>
              </div>

              {/* Iconic Headline with Specular Laser Sweep */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white font-display uppercase leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                Skills &amp; Systems{' '}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 via-white to-cyan-300 drop-shadow-[0_0_40px_rgba(255,42,58,0.55)]">
                  Competencies
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-gradient-to-r from-red-500 via-rose-400 via-cyan-400 to-transparent shadow-[0_0_16px_rgba(255,42,58,0.9)]" />
                </span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-neutral-100 max-w-2xl font-sans leading-relaxed font-normal drop-shadow-sm">
                Every unit in this matrix reflects shipped code, live automated webhooks, or frontline commercial execution. 100% verifiable reality with zero arbitrary percentages.
              </p>

              {/* Iconic Micro-Telemetry Status Ribbon */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mt-4 text-[11px] font-mono">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1222] border border-cyan-500/40 text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-bold text-white">5 DOMAINS</span>
                  <span className="text-cyan-400/80 font-normal">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#140e1c] border border-purple-500/40 text-purple-300 shadow-[0_0_16px_rgba(168,85,247,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-bold text-white">18 PROTOCOLS</span>
                  <span className="text-purple-400/80 font-normal">SHIPPED</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#081814] border border-emerald-500/40 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-white">AUDIT TRAIL</span>
                  <span className="text-emerald-400/80 font-normal">100% GROUND TRUTH</span>
                </div>
              </div>
            </div>

            {/* Iconic Cryptographic Audit Terminal (Elevated Honesty Instrument) */}
            <div className="group/audit relative z-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#181c35] via-[#101324] to-[#080a13] border-2 border-emerald-500/60 hover:border-emerald-300 text-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(16,185,129,0.3),inset_0_2px_0_rgba(255,255,255,0.4),inset_0_-2px_0_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.98),0_0_50px_rgba(16,185,129,0.5),inset_0_2px_0_rgba(255,255,255,0.5)] transition-all duration-300 self-start lg:self-end overflow-hidden max-w-sm w-full lg:w-auto">
              {/* Top Specular Sheen Beam */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-full group-hover/audit:translate-x-full transition-transform duration-1000 pointer-events-none" />

              <div className="flex items-start gap-3.5 relative z-10">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-600/40 via-emerald-950/90 to-[#04120e] border-2 border-emerald-400/80 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.7),inset_0_1.5px_0_rgba(255,255,255,0.5)] group-hover/audit:scale-110 group-hover/audit:rotate-3 transition-all shrink-0">
                  <ShieldCheck className="w-6 h-6 drop-shadow-[0_0_12px_#34d399]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-white tracking-wider uppercase">
                      HONESTY PROTOCOL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-400/70 text-emerald-300 font-mono text-[9px] font-black uppercase shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                      VERIFIED
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-300 font-bold mt-1 flex items-center gap-1.5">
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <span>ZERO ARBITRARY PERCENTAGES</span>
                  </div>
                  <p className="text-[10px] text-neutral-300 font-sans mt-1 leading-snug">
                    Grounded strictly in verifiable production code &amp; frontline execution.
                  </p>

                  {/* Real-time Oscilloscope Signal Bar */}
                  <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono text-neutral-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      PROD SIGNAL:
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-2.5 bg-emerald-400 rounded-sm animate-pulse" />
                      <span className="w-1 h-4 bg-emerald-400 rounded-sm animate-pulse delay-75" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-sm animate-pulse delay-150" />
                      <span className="w-1 h-5 bg-emerald-400 rounded-sm animate-pulse delay-100" />
                      <span className="w-1 h-3.5 bg-emerald-400 rounded-sm animate-pulse delay-200" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-sm animate-pulse delay-300" />
                      <span className="text-[9px] font-mono text-emerald-300 font-black ml-1.5 tracking-wider">
                        100% VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 3D INTERACTIVE GLOWING BLINKING TABS HUD                 */}
          {/* ======================================================= */}
          <div className="relative p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#181c35] via-[#101324] to-[#080a13] border-2 border-white/30 shadow-[0_35px_80px_rgba(0,0,0,0.98),0_0_50px_rgba(255,42,58,0.25),inset_0_2px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(0,0,0,0.9)] overflow-hidden">
            
            {/* Top Specular Rim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500/80 via-cyan-400/80 to-transparent shadow-[0_0_20px_rgba(255,42,58,0.8)]"
            />

            {/* Tactical Corner Brackets */}
            <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-red-500/70 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-red-500/70 pointer-events-none" />

            {/* High-Tech Tactical Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3.5 mb-5 border-b border-white/15 text-[10px] font-mono text-neutral-300 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-tactical-blink shadow-[0_0_10px_#ff2a3a]" />
                <span className="text-white font-black tracking-wider uppercase">STARK_HUD // TACTICAL DOMAIN FILTER DECK</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                  ACTIVE FILTER: <strong className="text-white uppercase font-black tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50">{activeCategoryTab}</strong>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-neutral-400">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  TELEMETRY: OPTIMAL
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Category Filter Tabs with Vivid Blinking Beacons & 3D Tactile Elevation */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {domainTabs.map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  const isRed = tab.beacon === 'red';
                  const isAmber = tab.beacon === 'amber';
                  const isSky = tab.beacon === 'sky';
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      onMouseEnter={() => playTactileFeedback('hover')}
                      className={`relative px-4 sm:px-5 py-3 rounded-2xl font-mono text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-3 cursor-pointer select-none active:scale-95 ${
                        isActive
                          ? isRed
                            ? 'bg-gradient-to-b from-[#ff3344] via-[#e6192b] to-[#a30b18] text-white border-2 border-white shadow-[0_14px_36px_rgba(255,42,58,0.85),0_0_30px_rgba(255,42,58,0.7),inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : isAmber
                            ? 'bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#92400e] text-white border-2 border-white shadow-[0_14px_36px_rgba(245,158,11,0.85),0_0_30px_rgba(245,158,11,0.7),inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : isSky
                            ? 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#075985] text-white border-2 border-white shadow-[0_14px_36px_rgba(56,189,248,0.85),0_0_30px_rgba(56,189,248,0.7),inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : 'bg-gradient-to-b from-[#10b981] via-[#059669] to-[#065f46] text-white border-2 border-white shadow-[0_14px_36px_rgba(16,185,129,0.85),0_0_30px_rgba(16,185,129,0.7),inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                          : 'bg-gradient-to-b from-[#181c30] via-[#111322] to-[#0b0c16] hover:from-[#222744] hover:to-[#15182c] text-white hover:text-white border-2 border-white/20 hover:border-white/50 shadow-[0_8px_20px_rgba(0,0,0,0.7),inset_0_1.5px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Multi-Tier Tactical Blinking Radar Beacon */}
                      <span className="relative flex items-center justify-center w-3 h-3">
                        <span
                          className={`absolute w-5 h-5 rounded-full animate-tactical-beacon ${
                            isActive
                              ? 'bg-white/80'
                              : isRed
                              ? 'bg-red-500/70'
                              : isAmber
                              ? 'bg-amber-400/70'
                              : isSky
                              ? 'bg-sky-400/70'
                              : 'bg-emerald-400/70'
                          }`}
                        />
                        <span
                          className={`relative w-2.5 h-2.5 rounded-full animate-tactical-blink ${
                            isActive
                              ? 'bg-white shadow-[0_0_16px_#ffffff]'
                              : isRed
                              ? 'bg-red-500 shadow-[0_0_16px_#ff2a3a]'
                              : isAmber
                              ? 'bg-amber-400 shadow-[0_0_16px_#f59e0b]'
                              : isSky
                              ? 'bg-sky-400 shadow-[0_0_16px_#38bdf8]'
                              : 'bg-emerald-400 shadow-[0_0_16px_#10b981]'
                          }`}
                        />
                      </span>

                      <Icon className="w-4 h-4 text-white drop-shadow-sm shrink-0" />

                      <span className="drop-shadow-sm font-black">{tab.label}</span>

                      {/* Tactical Count Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black shadow-inner ${
                          isActive
                            ? 'bg-black/60 text-white border border-white/50'
                            : 'bg-white/15 text-white border border-white/25'
                        }`}
                      >
                        0{tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Competency Controls */}
              <div className="flex items-center gap-3">
                {/* Search Input with Laser Focus Glow */}
                <div className="relative flex-1 sm:w-72">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 font-mono text-[10px] font-bold drop-shadow-[0_0_8px_rgba(255,42,58,0.8)] select-none">
                    &gt;_
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search capabilities (e.g. MCP, n8n)..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-[#090b16] border-2 border-white/25 focus:border-red-400 text-xs font-mono text-white placeholder-neutral-400 outline-none transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.85),0_0_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_30px_rgba(255,42,58,0.6),inset_0_2px_8px_rgba(0,0,0,0.85)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Units Live Counter Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-b from-[#181d33] to-[#0e1120] border-2 border-white/30 text-xs font-mono text-white shrink-0 shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse drop-shadow-[0_0_10px_#34d399]" />
                  <span>
                    UNITS: <strong className="text-emerald-300 font-black text-sm">{totalVisibleSkills}</strong>/18
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-filter Level Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-white/15 text-xs font-mono">
              <span className="text-white text-xs font-bold mr-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-red-400" />
                PROFICIENCY LEVEL:
              </span>
              {levelFilterOptions.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelClick(lvl.id)}
                  onMouseEnter={() => playTactileFeedback('hover')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeLevelFilter === lvl.id
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-2 border-white/70 shadow-[0_0_20px_rgba(255,42,58,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] -translate-y-0.5'
                      : 'bg-white/10 text-neutral-100 hover:text-white hover:bg-white/20 border border-white/20 hover:border-white/40 shadow-sm'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Child 2: Core Capability Architectural Telemetry Strips */}
        <div className="hidden lg:grid grid-cols-4 gap-3.5 mb-10">
          {corePillars.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.label}
                className="group/pill relative p-3.5 rounded-xl bg-gradient-to-b from-[#15182c] to-[#0c0e18] border border-white/20 hover:border-red-500/70 hover:bg-[#1a1e35] transition-all duration-300 flex flex-col justify-between shadow-lg overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/pill:via-red-500/80 transition-colors"
                />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-neutral-300 font-bold">#{cap.code}</span>
                    <span className="font-mono text-[11px] font-black text-white tracking-wide truncate group-hover/pill:text-red-300 transition-colors">
                      {cap.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-md border shrink-0 font-black ${
                      cap.status === 'EXPERT'
                        ? 'bg-amber-950/80 text-amber-200 border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : cap.status === 'CORE'
                        ? 'bg-red-950/80 text-red-200 border-red-500/60 shadow-[0_0_8px_rgba(255,42,58,0.3)]'
                        : cap.status === 'HIGH VELOCITY'
                        ? 'bg-sky-950/80 text-sky-200 border-sky-500/60 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                        : 'bg-emerald-950/80 text-emerald-200 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    }`}
                  >
                    {cap.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-100">
                  <span className="truncate font-semibold">{cap.metric}</span>
                  <Icon className="w-4 h-4 text-neutral-300 group-hover/pill:text-red-400 transition-colors shrink-0 ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Child 3: 4 Category Clusters Grid (Matches Selector 4 / Selector 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-stretch relative">
          {displayedClusters.map((cluster, index) => (
            <SpatialClusterConsole
              key={cluster.category}
              cluster={cluster}
              clusterIndex={index}
              totalClusters={displayedClusters.length}
              isFiltered={activeCategoryTab === cluster.category}
            />
          ))}
        </div>

        {/* Child 4: Bottom Callout: Spatial Synthesizer Console */}
        <div className="relative mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14172a] via-[#1c203a] to-[#14172a] border border-white/25 hover:border-red-500/70 transition-all duration-300 shadow-[0_30px_70px_rgba(0,0,0,0.98)] overflow-hidden group">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-red-600/20 group-hover:bg-red-600/35 transition-all duration-500"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-600/40 to-red-950/70 border border-red-500/60 text-red-300 shadow-xl mt-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-7 h-7 drop-shadow-[0_0_10px_#ff2a3a]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest font-black">
                    UNCONVENTIONAL HYBRID FORGING
                  </span>
                  <span className="text-neutral-400">&bull;</span>
                  <span className="font-mono text-[10px] text-neutral-200 uppercase tracking-wider font-bold">
                    OPERATIONAL ADVANTAGE
                  </span>
                </div>
                <h4 className="text-lg sm:text-2xl font-black text-white font-display uppercase tracking-wide">
                  The Hybrid Advantage: Sales Empathy + Agentic Speed
                </h4>
                <p className="text-xs sm:text-sm text-neutral-100 max-w-3xl leading-relaxed mt-2 font-sans font-normal">
                  Most AI builders only know syntax; most sales operators only know pitches. By combining deep frontline commercial discovery with modern autonomous agent engineering and vibe coding velocity, I eliminate communication silos and deliver high-impact digital tools.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  playTactileFeedback('tab');
                  window.dispatchEvent(new CustomEvent('open-journey-timeline'));
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 border border-red-400/50 text-xs font-mono font-black text-white tracking-wider uppercase transition-all duration-200 shadow-[0_10px_28px_rgba(255,42,58,0.6),inset_0_1.5px_0_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <span>Explore Career Journey</span>
                <span className="group-hover:translate-x-1 transition-transform font-bold">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMap;
