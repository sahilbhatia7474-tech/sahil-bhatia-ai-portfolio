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
  Workflow,
  Code2,
  Globe,
} from 'lucide-react';

/**
 * Subtle tactile sound synthesizer for interactive mechanical clicks
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
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // AudioContext blocked or not supported - silent graceful fallback
  }
}

/**
 * Razor-Sharp 3D Spatial Capability Cluster Console
 * Completely eliminates GPU raster matrix transforms (preserve-3d / translateZ / perspective)
 * to deliver 100% crisp typography, tactile 3D elevation, dynamic specular glare,
 * and illuminated hardware accents.
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
          glow: 'rgba(239, 68, 68, 0.25)',
          glowSubtle: 'rgba(239, 68, 68, 0.08)',
          borderHover: 'group-hover/card:border-red-500/60',
          tagBg: 'bg-red-950/40 text-red-300 border-red-500/30',
          dot: 'bg-red-500 shadow-[0_0_10px_#ef4444]',
          accent: 'text-red-400',
          beacon: 'bg-red-500/40',
          icon: Cpu,
        };
      case 1:
        return {
          glow: 'rgba(245, 158, 11, 0.25)',
          glowSubtle: 'rgba(245, 158, 11, 0.08)',
          borderHover: 'group-hover/card:border-amber-500/60',
          tagBg: 'bg-amber-950/40 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
          accent: 'text-amber-400',
          beacon: 'bg-amber-400/40',
          icon: Zap,
        };
      case 2:
        return {
          glow: 'rgba(56, 189, 248, 0.25)',
          glowSubtle: 'rgba(56, 189, 248, 0.08)',
          borderHover: 'group-hover/card:border-sky-500/60',
          tagBg: 'bg-sky-950/40 text-sky-300 border-sky-500/30',
          dot: 'bg-sky-400 shadow-[0_0_10px_#38bdf8]',
          accent: 'text-sky-400',
          beacon: 'bg-sky-400/40',
          icon: Sparkles,
        };
      case 3:
      default:
        return {
          glow: 'rgba(16, 185, 129, 0.25)',
          glowSubtle: 'rgba(16, 185, 129, 0.08)',
          borderHover: 'group-hover/card:border-emerald-500/60',
          tagBg: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400 shadow-[0_0_10px_#10b981]',
          accent: 'text-emerald-400',
          beacon: 'bg-emerald-400/40',
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
        isFiltered ? 'opacity-100 ring-2 ring-red-500/40' : 'opacity-100'
      }`}
    >
      {/* 3D Tactile Outer Console Plinth (Razor-sharp 2D transforms, zero blur) */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#11131e]/95 via-[#0c0d15]/98 to-[#07080d] p-5 sm:p-6 overflow-hidden border border-white/[0.1] ${theme.borderHover} shadow-[0_16px_36px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.95),0_0_35px_${theme.glow},inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-2 transition-all duration-300`}
      >
        {/* Dynamic Specular Glass Glare that smoothly tracks cursor */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: glare.active ? 1 : 0,
            background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
          }}
        />

        {/* Ambient Top Specular Rim Reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* Architectural Machined Corner Chamfers */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-neutral-600 select-none pointer-events-none">
          ┌
        </div>
        <div className="absolute top-2 right-2 text-[9px] font-mono text-neutral-600 select-none pointer-events-none">
          ┐
        </div>
        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-neutral-600 select-none pointer-events-none">
          └
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-neutral-600 select-none pointer-events-none">
          ┘
        </div>

        {/* Console Depth Layer 1: Cluster Header */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className={`absolute w-3.5 h-3.5 rounded-full ${theme.beacon} animate-ping`} />
                <span className={`relative w-2 h-2 rounded-full ${theme.dot}`} />
              </span>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-semibold">
                  CLUSTER 0{clusterIndex + 1} // DOMAIN
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center gap-2">
                  {cluster.category}
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/[0.1] shadow-inner">
                {cluster.skills.length} UNITS
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ACTIVE
              </span>
            </div>
          </div>

          {/* Skill Item Rows - Razor-sharp typography and high contrast */}
          <div className="space-y-2.5">
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
                  className={`p-3 rounded-xl transition-all duration-200 border cursor-default ${
                    isSkillActive
                      ? 'bg-[#181a28] border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.5)] translate-x-1'
                      : 'bg-[#0f1018]/90 hover:bg-[#141624] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs sm:text-[13px] font-bold text-white font-sans tracking-tight flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isSkillActive ? 'bg-red-400 shadow-[0_0_6px_#ff2a3a]' : 'bg-neutral-500'
                        }`}
                      />
                      {skill.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border uppercase tracking-wider transition-colors ${
                        skill.level.toLowerCase().includes('expert')
                          ? 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                          : skill.level.toLowerCase().includes('core')
                          ? 'bg-red-950/50 text-red-300 border-red-500/35 shadow-[0_0_8px_rgba(255,42,58,0.2)]'
                          : skill.level.toLowerCase().includes('high velocity')
                          ? 'bg-sky-950/50 text-sky-300 border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                          : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/35 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {skill.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console Depth Layer 2: Telemetry Footer */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calibrated &amp; Deployed</span>
          </span>
          <span className="text-[10px] text-neutral-400 tracking-wider font-semibold">
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

  // Tab definitions for 3D glowing blinking category navigation
  const domainTabs = useMemo(() => {
    return [
      { id: 'ALL', label: 'ALL CAPABILITIES', count: 18, beacon: 'red' },
      { id: 'AI & Agentic Systems', label: 'AI & AGENTS', count: 6, beacon: 'red' },
      { id: 'Automation & Velocity Building', label: 'AUTOMATION', count: 5, beacon: 'amber' },
      { id: 'Product & Experience Architecture', label: 'PRODUCT & UX', count: 4, beacon: 'sky' },
      { id: 'Commercial Reality & Execution', label: 'STRATEGY & SALES', count: 3, beacon: 'emerald' },
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
      // Check if cluster category is selected
      const isCategoryMatch =
        activeCategoryTab === 'ALL' || cluster.category === activeCategoryTab;

      // Filter skills inside cluster based on level & search query
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
      className="py-24 sm:py-32 bg-transparent border-b border-white/[0.08] relative overflow-hidden"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================= */}
      {/* 5 BACKGROUND LAYERS PRESERVING EXACT DOM TREE INDEXING     */}
      {/* ========================================================= */}

      {/* Layer 1: Deep Volumetric Atmospheric Lighting Cone */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 950px 600px at ${mousePos.x}% ${mousePos.y}%, rgba(220, 38, 38, 0.1), transparent 75%)`,
          transition: 'background 0.2s ease-out',
        }}
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
      />

      {/* Layer 2: Perspective Coordinate Mesh Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_35%,#000_60%,transparent_100%)]"
      />

      {/* Layer 3: Depth Occlusion Mask */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-radial-vignette opacity-50" />

      {/* Layer 4: Vignette & Atmospheric Falloff */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#06070a] via-transparent to-[#06070a]"
      />

      {/* Layer 5: Laser Horizon Rail with Central Ruby Beacon & Floating Particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent shadow-[0_0_18px_rgba(255,42,58,0.5)]" />
        <span className="absolute top-[18%] left-[12%] w-1.5 h-1.5 rounded-full bg-red-500/30 blur-[1px] animate-pulse" />
        <span className="absolute top-[35%] right-[15%] w-1 h-1 rounded-full bg-amber-400/30 blur-[1px]" />
        <span className="absolute bottom-[28%] left-[24%] w-1 h-1 rounded-full bg-red-400/20" />
        <span className="absolute bottom-[15%] right-[28%] w-1.5 h-1.5 rounded-full bg-emerald-400/20 blur-[0.5px]" />
      </div>

      {/* ========================================================= */}
      {/* FOREGROUND CONTAINER (MATCHES div:nth-of-type(6))         */}
      {/* ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Child 1: Section Header & 3D Interactive Glowing Blinking Tabs HUD */}
        <div className="mb-10 sm:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              {/* Tactical Status Pill with Blinking Radar Beacon */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 font-mono text-[11px] text-red-400 uppercase tracking-widest mb-3.5 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)]">
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute w-3 h-3 rounded-full bg-red-500/40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                </span>
                <span className="font-bold">EVIDENCE-BASED CAPABILITY MAP</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-300 font-semibold">PRECISION HUD</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                Skills &amp; Systems <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">Competencies</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl font-sans leading-relaxed">
                Every item in this matrix reflects shipped code, live automated webhooks, or frontline commercial execution.
              </p>
            </div>

            {/* Verification Instrument Badge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-b from-[#12141f] via-[#0d0e16] to-[#08090e] border border-white/[0.12] text-xs font-mono text-neutral-300 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] self-start md:self-end">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white tracking-wide text-[11px]">ZERO ARBITRARY PERCENTAGE BARS</div>
                <div className="text-[10px] text-neutral-400 font-semibold">Grounded in verifiable production practice</div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 3D INTERACTIVE GLOWING BLINKING TABS HUD                 */}
          {/* ======================================================= */}
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-[#11131e]/90 via-[#0c0d15]/95 to-[#07080d] border border-white/[0.12] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Category Filter Tabs with Blinking Beacons & 3D Tactile Elevation */}
              <div className="flex flex-wrap items-center gap-2">
                {domainTabs.map((tab) => {
                  const isActive = activeCategoryTab === tab.id;
                  const isRed = tab.beacon === 'red';
                  const isAmber = tab.beacon === 'amber';
                  const isSky = tab.beacon === 'sky';
                  const isEmerald = tab.beacon === 'emerald';

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`relative px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95 select-none ${
                        isActive
                          ? isRed
                            ? 'bg-gradient-to-r from-[#ff2a3a] to-[#d61928] text-white border border-red-400/40 shadow-[0_4px_20px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                            : isAmber
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border border-amber-400/40 shadow-[0_4px_20px_rgba(245,158,11,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                            : isSky
                            ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border border-sky-400/40 shadow-[0_4px_20px_rgba(56,189,248,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/40 shadow-[0_4px_20px_rgba(16,185,129,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] hover:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                      }`}
                    >
                      {/* Animated Blinking Radar Beacon */}
                      <span className="relative flex items-center justify-center w-2 h-2">
                        <span
                          className={`absolute w-3 h-3 rounded-full animate-ping ${
                            isActive
                              ? 'bg-white/60'
                              : isRed
                              ? 'bg-red-500/40'
                              : isAmber
                              ? 'bg-amber-400/40'
                              : isSky
                              ? 'bg-sky-400/40'
                              : 'bg-emerald-400/40'
                          }`}
                        />
                        <span
                          className={`relative w-1.5 h-1.5 rounded-full ${
                            isActive
                              ? 'bg-white shadow-[0_0_8px_#ffffff]'
                              : isRed
                              ? 'bg-red-500 shadow-[0_0_8px_#ff2a3a]'
                              : isAmber
                              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                              : isSky
                              ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                              : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                          }`}
                        />
                      </span>

                      <span>{tab.label}</span>

                      {/* Count Badge */}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          isActive ? 'bg-black/30 text-white' : 'bg-white/[0.08] text-neutral-400'
                        }`}
                      >
                        [0{tab.count}]
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Competency Filter Controls */}
              <div className="flex items-center gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skill (e.g. MCP, n8n)..."
                    className="w-full pl-9 pr-7 py-2 rounded-xl bg-[#090a10] border border-white/[0.1] focus:border-red-500/50 text-xs font-mono text-white placeholder-neutral-500 outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Live Match Counter */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-neutral-300 shrink-0">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    UNITS: <span className="text-white font-bold">{totalVisibleSkills}</span>/18
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-filter Level Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-white/[0.06] text-xs font-mono">
              <span className="text-neutral-500 text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-neutral-500" />
                LEVEL:
              </span>
              {levelFilterOptions.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelClick(lvl.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    activeLevelFilter === lvl.id
                      ? 'bg-white/[0.12] text-white border border-white/[0.2] font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
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
                className="group/pill relative p-3.5 rounded-xl bg-[#0d0e14]/90 border border-white/[0.1] hover:border-red-500/40 hover:bg-[#12131b] transition-all duration-300 flex flex-col justify-between shadow-lg overflow-hidden"
              >
                {/* Subtle top edge specular highlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/pill:via-red-500/40 transition-colors"
                />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-neutral-500">#{cap.code}</span>
                    <span className="font-mono text-[11px] font-bold text-white tracking-wide truncate group-hover/pill:text-red-200 transition-colors">
                      {cap.label}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-1.5 py-0.5 rounded border shrink-0 font-bold ${
                      cap.status === 'EXPERT'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                        : cap.status === 'CORE'
                        ? 'bg-red-950/40 text-red-300 border-red-500/30'
                        : cap.status === 'HIGH VELOCITY'
                        ? 'bg-sky-950/40 text-sky-300 border-sky-500/30'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {cap.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300">
                  <span className="truncate">{cap.metric}</span>
                  <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover/pill:text-red-400 transition-colors shrink-0 ml-1.5" />
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
        <div className="relative mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0e0f17] via-[#141522] to-[#0e0f17] border border-white/[0.12] hover:border-red-500/35 transition-all duration-300 shadow-2xl overflow-hidden group">
          {/* Subtle background glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl group-hover:bg-red-600/20 transition-all duration-500"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-red-600/20 to-red-950/40 border border-red-500/30 text-red-400 shadow-lg mt-0.5 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest font-bold">
                    UNCONVENTIONAL HYBRID FORGING
                  </span>
                  <span className="text-neutral-500">&bull;</span>
                  <span className="font-mono text-[10px] text-neutral-300 uppercase tracking-wider font-semibold">
                    OPERATIONAL ADVANTAGE
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-wide">
                  The Hybrid Advantage: Sales Empathy + Agentic Speed
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed mt-2 font-sans">
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 border border-red-400/30 text-xs font-mono font-bold text-white tracking-wider uppercase transition-all duration-200 shadow-[0_4px_20px_rgba(255,42,58,0.35)] cursor-pointer"
              >
                <span>Explore Career Journey</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMap;
