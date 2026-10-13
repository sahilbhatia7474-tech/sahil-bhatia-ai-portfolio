import { useState, useRef, useCallback, useMemo } from 'react';
import { CAPABILITY_MAP } from '../data/portfolioData';
import {
  Layers,
  ShieldCheck,
  Zap,
  Sparkles,
  Terminal,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Activity,
  Search,
  X,
  Filter,
  Shield,
  Radio,
  Flame,
  Crosshair,
  Compass,
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
          glow: 'rgba(239, 68, 68, 0.5)',
          glowSubtle: 'rgba(239, 68, 68, 0.2)',
          borderHover: 'hover:border-red-500',
          activeRing: 'ring-2 ring-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)]',
          dot: 'bg-red-500 shadow-[0_0_14px_#ef4444]',
          accent: 'text-red-400',
          beacon: 'bg-red-500',
          cardGlow:
            'hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(239,68,68,0.4),inset_0_1.5px_0_rgba(255,255,255,0.4)]',
          icon: Cpu,
        };
      case 1:
        return {
          themeName: 'THOR THUNDER',
          glow: 'rgba(245, 158, 11, 0.5)',
          glowSubtle: 'rgba(245, 158, 11, 0.2)',
          borderHover: 'hover:border-amber-400',
          activeRing: 'ring-2 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
          dot: 'bg-amber-400 shadow-[0_0_14px_#f59e0b]',
          accent: 'text-amber-400',
          beacon: 'bg-amber-400',
          cardGlow:
            'hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(245,158,11,0.4),inset_0_1.5px_0_rgba(255,255,255,0.4)]',
          icon: Zap,
        };
      case 2:
        return {
          themeName: 'QUANTUM ARC',
          glow: 'rgba(56, 189, 248, 0.5)',
          glowSubtle: 'rgba(56, 189, 248, 0.2)',
          borderHover: 'hover:border-cyan-400',
          activeRing: 'ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.5)]',
          dot: 'bg-cyan-400 shadow-[0_0_14px_#38bdf8]',
          accent: 'text-cyan-400',
          beacon: 'bg-cyan-400',
          cardGlow:
            'hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(56,189,248,0.4),inset_0_1.5px_0_rgba(255,255,255,0.4)]',
          icon: Layers,
        };
      default:
        return {
          themeName: 'VIBRANIUM MATRIX',
          glow: 'rgba(16, 185, 129, 0.5)',
          glowSubtle: 'rgba(16, 185, 129, 0.2)',
          borderHover: 'hover:border-emerald-400',
          activeRing: 'ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]',
          dot: 'bg-emerald-400 shadow-[0_0_14px_#10b981]',
          accent: 'text-emerald-400',
          beacon: 'bg-emerald-400',
          cardGlow:
            'hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.98),0_0_35px_rgba(16,185,129,0.4),inset_0_1.5px_0_rgba(255,255,255,0.4)]',
          icon: Activity,
        };
    }
  }, [clusterIndex]);

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
        className={`relative h-full flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#121528] via-[#0b0d1a] to-[#060710] p-5 sm:p-6 overflow-hidden border ${
          isFiltered
            ? 'border-red-500 ring-2 ring-red-500/60 shadow-[0_0_35px_rgba(255,42,58,0.45)]'
            : 'border-white/20'
        } ${theme.borderHover} ${theme.cardGlow} shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),inset_0_1.5px_0_rgba(255,255,255,0.25)] hover:-translate-y-2.5 transition-all duration-300`}
      >
        {/* Dynamic Specular Glass Glare that smoothly tracks cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: glare.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.15), transparent 70%)`,
          }}
        />

        {/* Ambient Top Specular Rim Reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />

        {/* High-Tech Machined Corner Brackets */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-neutral-300 select-none pointer-events-none font-black">
          ┌
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-neutral-300 select-none pointer-events-none font-black">
          ┐
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-neutral-300 select-none pointer-events-none font-black">
          └
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-300 select-none pointer-events-none font-black">
          ┘
        </div>

        {/* Console Depth Layer 1: Cluster Header */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <span className="relative flex items-center justify-center w-3 h-3">
                <span
                  className={`absolute w-4 h-4 rounded-full ${theme.beacon} animate-tactical-beacon opacity-75`}
                />
                <span className={`relative w-2.5 h-2.5 rounded-full ${theme.dot} animate-tactical-blink`} />
              </span>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-black">
                  CLUSTER 0{clusterIndex + 1} // {theme.themeName}
                </span>
                <h3 className="text-base sm:text-lg font-black font-display uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex items-center gap-2">
                  {cluster.category}
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-lg bg-white/10 text-white border border-white/25 shadow-inner">
                {cluster.skills.length} UNITS
              </span>
              <span className="text-[9px] font-mono text-emerald-300 font-bold mt-1 flex items-center gap-1.5">
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
                  className={`p-3.5 rounded-xl transition-all duration-200 border cursor-default select-none ${
                    isSkillActive
                      ? 'bg-gradient-to-r from-[#1d2238] to-[#14182a] border-white/45 shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)] translate-x-1'
                      : 'bg-[#0f1220] hover:bg-[#15192c] border-white/15 hover:border-white/35 shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white font-sans tracking-tight flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full transition-all ${
                          isSkillActive
                            ? 'bg-red-400 shadow-[0_0_10px_#ff2a3a] scale-125'
                            : 'bg-neutral-300 shadow-[0_0_4px_rgba(255,255,255,0.6)]'
                        }`}
                      />
                      <span className="drop-shadow-sm font-semibold">{skill.name}</span>
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-lg font-black border uppercase tracking-wider transition-colors shadow-sm ${
                        skill.level.toLowerCase().includes('expert')
                          ? 'bg-amber-950/80 text-amber-200 border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                          : skill.level.toLowerCase().includes('core')
                          ? 'bg-red-950/80 text-red-200 border-red-500/70 shadow-[0_0_12px_rgba(255,42,58,0.4)]'
                          : skill.level.toLowerCase().includes('high velocity')
                          ? 'bg-sky-950/80 text-sky-200 border-sky-500/70 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                          : 'bg-emerald-950/80 text-emerald-200 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
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
            <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_#34d399]" />
            <span>Deployed Production Unit</span>
          </span>
          <span className="text-[10px] text-neutral-300 tracking-wider font-bold">
            SYSTEM 0{clusterIndex + 1}/{totalClusters}
          </span>
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
      className="py-24 sm:py-32 bg-[#06070c]/85 border-b border-white/[0.15] relative overflow-hidden"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================= */}
      {/* 5 BACKGROUND LAYERS PRESERVING EXACT DOM TREE INDEXING     */}
      {/* ========================================================= */}

      {/* Layer 1: Dynamic Interactive Laser Spotlight (Crystal-Clear Lighting, Zero Blur) */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle 750px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 42, 58, 0.16), rgba(56, 189, 248, 0.08) 45%, transparent 75%)`,
          transition: 'background 0.1s ease-out',
        }}
        className="pointer-events-none absolute inset-0 z-0 opacity-100"
      />

      {/* Layer 2: Precision Stark/Avengers Holographic Coordinate Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.14] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      {/* Layer 3: Concentric Tactical Holographic Arc Reactor Radar Rings (Crisp Vector, Zero Blur) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        <svg
          viewBox="0 0 1000 1000"
          className="w-[900px] h-[900px] opacity-20 animate-rotating-gyro"
          fill="none"
          stroke="currentColor"
        >
          {/* Inner ring with dashed tick marks */}
          <circle cx="500" cy="500" r="280" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="6 6" />
          {/* Middle reactor circle */}
          <circle cx="500" cy="500" r="380" stroke="rgba(255,42,58,0.5)" strokeWidth="1.5" strokeDasharray="18 12" />
          {/* Outer coordinate ring */}
          <circle cx="500" cy="500" r="460" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 8" />
          {/* Crosshair alignment axes */}
          <line x1="500" y1="20" x2="500" y2="980" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="10 10" />
          <line x1="20" y1="500" x2="980" y2="500" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="10 10" />
        </svg>
      </div>

      {/* Layer 4: Deep Carbon Weave & High-Contrast Horizon Shading */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#090b14]/90 via-[#06070d]/80 to-[#040408]/95"
      />

      {/* Layer 5: Laser Horizon Rails with Quantum Beacons & Specular Beam Sweep */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top laser rail */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_24px_rgba(255,42,58,0.9)]" />
        {/* Bottom laser rail */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(56,189,248,0.8)]" />
        
        {/* Corner alignment crosshairs */}
        <span className="absolute top-4 left-6 text-xs font-mono font-bold text-red-500/60 select-none">[ +02.CAP_MATRIX ]</span>
        <span className="absolute top-4 right-6 text-xs font-mono font-bold text-cyan-400/60 select-none">[ STARK_SYS.ONLINE ]</span>
        <span className="absolute bottom-4 left-6 text-[10px] font-mono text-neutral-400 select-none">LAT: 28.6139° N // LON: 77.2090° E</span>
        <span className="absolute bottom-4 right-6 text-[10px] font-mono text-neutral-400 select-none">VERIFIED FRONT-LINE CAPABILITY</span>
      </div>

      {/* ========================================================= */}
      {/* FOREGROUND CONTAINER (MATCHES div:nth-of-type(6))         */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Child 1: Section Header & 3D Interactive Glowing Blinking Tabs HUD (Matches Selector 8) */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            
            {/* Child 1 of Child 1: Title & Lead Paragraph (Matches Selector 1) */}
            <div>
              {/* Tactical Status Pill with Multi-Frequency Blinking Radar Beacon */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-black to-red-950/90 border border-red-500/70 font-mono text-[11px] text-red-300 uppercase tracking-widest mb-3.5 shadow-[0_0_25px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]">
                <span className="relative flex items-center justify-center w-2.5 h-2.5">
                  <span className="absolute w-4 h-4 rounded-full bg-red-500 animate-tactical-beacon opacity-75" />
                  <span className="relative w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ff2a3a] animate-tactical-blink" />
                </span>
                <span className="font-black text-white">AVENGERS-GRADE COMPETENCY SUITE</span>
                <span className="text-red-400 font-bold">&bull;</span>
                <span className="text-red-300 font-bold">VERIFIED LIVE MATRIX</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                Skills &amp; Systems <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-white drop-shadow-[0_0_30px_rgba(255,42,58,0.4)]">Competencies</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-100 max-w-2xl font-sans leading-relaxed font-normal drop-shadow-sm">
                Every unit in this matrix reflects shipped code, live automated webhooks, or frontline commercial execution. 100% verifiable reality.
              </p>
            </div>

            {/* Verification Instrument Badge */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-b from-[#181b30] via-[#101222] to-[#0a0c16] border border-white/25 text-xs font-mono text-neutral-100 shadow-[0_16px_40px_rgba(0,0,0,0.95),inset_0_1.5px_0_rgba(255,255,255,0.3)] self-start md:self-end">
              <div className="p-2.5 rounded-xl bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.4)]">
                <ShieldCheck className="w-5 h-5 drop-shadow-[0_0_10px_#34d399]" />
              </div>
              <div>
                <div className="font-black text-white tracking-wider text-xs">ZERO ARBITRARY PERCENTAGES</div>
                <div className="text-[10px] text-neutral-300 font-medium">Grounded in verifiable production practice</div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 3D INTERACTIVE GLOWING BLINKING TABS HUD                 */}
          {/* ======================================================= */}
          <div className="relative p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-[#15182d] via-[#0f1120] to-[#090b14] border border-white/25 shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_45px_rgba(255,42,58,0.2),inset_0_2px_0_rgba(255,255,255,0.25)] overflow-hidden">
            
            {/* Top Specular Rim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent"
            />

            {/* High-Tech Tactical Telemetry Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/15 text-[10px] font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-tactical-blink shadow-[0_0_8px_#ff2a3a]" />
                <span className="text-white font-bold tracking-wider uppercase">STARK_HUD // TACTICAL DOMAIN FILTER</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                  ACTIVE FILTER: <strong className="text-white uppercase">{activeCategoryTab}</strong>
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
                            ? 'bg-gradient-to-b from-[#ff3344] via-[#e6192b] to-[#a30b18] text-white border-2 border-white/70 shadow-[0_12px_32px_rgba(255,42,58,0.75),0_0_25px_rgba(255,42,58,0.6),inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : isAmber
                            ? 'bg-gradient-to-b from-[#f59e0b] via-[#d97706] to-[#92400e] text-white border-2 border-white/70 shadow-[0_12px_32px_rgba(245,158,11,0.75),0_0_25px_rgba(245,158,11,0.6),inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : isSky
                            ? 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#075985] text-white border-2 border-white/70 shadow-[0_12px_32px_rgba(56,189,248,0.75),0_0_25px_rgba(56,189,248,0.6),inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                            : 'bg-gradient-to-b from-[#10b981] via-[#059669] to-[#065f46] text-white border-2 border-white/70 shadow-[0_12px_32px_rgba(16,185,129,0.75),0_0_25px_rgba(16,185,129,0.6),inset_0_2px_0_rgba(255,255,255,0.6),inset_0_-2px_0_rgba(0,0,0,0.5)] -translate-y-1'
                          : 'bg-gradient-to-b from-[#181c30] via-[#111322] to-[#0b0c16] hover:from-[#222744] hover:to-[#15182c] text-white hover:text-white border border-white/20 hover:border-white/45 shadow-[0_8px_20px_rgba(0,0,0,0.7),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5'
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
                              ? 'bg-white shadow-[0_0_14px_#ffffff]'
                              : isRed
                              ? 'bg-red-500 shadow-[0_0_14px_#ff2a3a]'
                              : isAmber
                              ? 'bg-amber-400 shadow-[0_0_14px_#f59e0b]'
                              : isSky
                              ? 'bg-sky-400 shadow-[0_0_14px_#38bdf8]'
                              : 'bg-emerald-400 shadow-[0_0_14px_#10b981]'
                          }`}
                        />
                      </span>

                      <Icon className="w-4 h-4 text-white drop-shadow-sm shrink-0" />

                      <span className="drop-shadow-sm font-black">{tab.label}</span>

                      {/* Tactical Count Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black shadow-inner ${
                          isActive
                            ? 'bg-black/50 text-white border border-white/40'
                            : 'bg-white/15 text-white border border-white/20'
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
                  <Search className="w-4 h-4 text-red-400 absolute left-3.5 top-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search capabilities (e.g. MCP, n8n)..."
                    className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#0a0d18] border border-white/25 focus:border-red-500 text-xs font-mono text-white placeholder-neutral-400 outline-none transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_0_15px_rgba(0,0,0,0.5)] focus:shadow-[0_0_25px_rgba(255,42,58,0.5),inset_0_2px_6px_rgba(0,0,0,0.8)]"
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
                <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/15 border border-white/25 text-xs font-mono text-white shrink-0 shadow-inner">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse drop-shadow-[0_0_8px_#34d399]" />
                  <span>
                    UNITS: <strong className="text-white font-black">{totalVisibleSkills}</strong>/18
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-filter Level Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-3.5 mt-3.5 border-t border-white/15 text-xs font-mono">
              <span className="text-white text-xs font-bold mr-1 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-red-400" />
                PROFICIENCY LEVEL:
              </span>
              {levelFilterOptions.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelClick(lvl.id)}
                  onMouseEnter={() => playTactileFeedback('hover')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeLevelFilter === lvl.id
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border border-red-300 shadow-[0_0_16px_rgba(255,42,58,0.6)] -translate-y-0.5'
                      : 'bg-white/10 text-neutral-100 hover:text-white hover:bg-white/20 border border-white/20'
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

        {/* Child 3: 4 Category Clusters Grid (Matches Selector 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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
