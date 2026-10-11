import { useState, useEffect, useRef, useCallback } from 'react';
import { AI_SYSTEMS } from '../data/portfolioData';
import {
  Terminal,
  Activity,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Sparkles,
  Zap,
  Cpu,
  CheckCircle2,
  Workflow,
  Radio,
  Sliders,
} from 'lucide-react';

/**
 * Subtle high-tech audio feedback helper for tactile tab and card interactions
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
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(1080, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio context may be restricted before user gesture; gracefully ignore
  }
}

/**
 * Razor-Sharp 3D Tactile Architectural System Card
 * Eliminates GPU texture rasterization blur by removing preserve-3d and nested translateZ,
 * replacing them with high-contrast subpixel rendering, CNC machined corner brackets,
 * luminous perimeter laser flares, blinking radar beacons, and spring-damped tactile elevation.
 */
function ArchitecturalSystemCard({ system, isSelected, onSelect }) {
  const isSys03 = system.code === 'SYS-03';
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardGlow, setCardGlow] = useState({ x: 50, y: 50 });

  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCardGlow({ x, y });
  }, []);

  return (
    <div className={isSys03 ? 'col-span-2' : 'col-span-1'}>
      <div
        ref={cardRef}
        onClick={() => {
          playTactileFeedback('click');
          onSelect(system.code);
        }}
        onMouseMove={handleCardMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`cursor-pointer rounded-2xl p-6 sm:p-7 relative border-2 flex flex-col justify-between overflow-hidden select-none transition-all duration-300 hover:-translate-y-2 active:translate-y-0.5 active:scale-[0.99] group ${
          isSys03 ? 'bg-gradient-to-b from-[#111322] via-[#090a12] to-[#040509]' : 'bg-gradient-to-b from-[#131525] via-[#0b0c16] to-[#05060d]'
        } ${
          isSelected
            ? 'border-red-500 shadow-[0_24px_65px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,58,0.38),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-2 ring-red-500/50 -translate-y-1'
            : 'border-white/15 hover:border-red-500/60 hover:shadow-[0_16px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,42,58,0.18)]'
        }`}
      >
        {/* Luminous Top Perimeter Accent */}
        <div
          className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none transition-opacity ${
            isSelected ? 'opacity-100 shadow-[0_0_16px_#ff2a3a]' : 'opacity-0 group-hover:opacity-100 shadow-[0_0_12px_#ff2a3a]'
          }`}
        />

        {/* Dynamic Specular Light Follower */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(255, 42, 58, 0.16), transparent 70%)`,
          }}
        />

        {/* Machined Precision Corner Brackets */}
        <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/20 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/20 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-white/20 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-white/20 group-hover:border-red-400 transition-colors pointer-events-none" />

        <div className="relative z-10">
          {/* Top Bar with Blinking Beacon */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white font-black px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_0_14px_rgba(255,42,58,0.5)] border border-red-400/40">
                {system.code}
              </span>
              <span className="font-mono text-[11px] text-neutral-300 uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {system.badge}
              </span>
            </div>

            {/* Blinking 3D Radar Beacon */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              <span className="font-mono text-[10px] uppercase font-black text-emerald-300 tracking-wider">
                {system.status}
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="mb-4">
            <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight flex items-center gap-2 group-hover:text-red-300 transition-colors drop-shadow-sm">
              <span>{system.name}</span>
              {isSelected && (
                <span className="font-mono text-xs text-red-400 font-bold lowercase tracking-normal flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a]" />
                  [active blueprint]
                </span>
              )}
            </h3>
            <p className="font-mono text-xs text-neutral-300 mt-1 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{system.tagline}</span>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed mb-5 font-normal">
            {system.overview}
          </p>

          {/* Functional Layers Preview Grid */}
          <div className={`grid gap-2.5 mb-5 ${isSys03 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {system.layers?.slice(0, isSys03 ? 4 : 3).map((layer, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#090b14] border border-white/10 hover:border-red-500/40 transition-colors text-xs font-mono shadow-inner group/layer"
              >
                <div className="text-white font-bold mb-1 truncate flex items-center gap-1.5">
                  <span className="text-red-400 font-black text-[10px] px-1.5 py-0.2 rounded bg-red-950/60 border border-red-500/30">
                    L{idx + 1}
                  </span>
                  <span className="truncate group-hover/layer:text-red-300 transition-colors">{layer.title}</span>
                </div>
                <p className="text-[11px] text-neutral-300 line-clamp-2 leading-tight font-sans">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action / Specs Footer */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-mono relative z-10">
          <div className="text-neutral-400 font-semibold truncate mr-2">
            {isSys03 ? 'Method: Field Insight + Autonomous Architecture' : `Target: ${system.specs?.latency || system.specs?.topology}`}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playTactileFeedback('click');
              onSelect(system.code);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
              isSelected
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(255,42,58,0.5)]'
                : 'bg-white/10 text-neutral-200 hover:text-white hover:bg-red-600/30 border border-white/15 hover:border-red-500/50'
            }`}
          >
            <span>{isSelected ? 'VIEWING BLUEPRINT' : 'INSPECT BLUEPRINT'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

const AISystems = () => {
  const [activeSystemCode, setActiveSystemCode] = useState('SYS-01');
  const containerRef = useRef(null);
  const [blueprintGlow, setBlueprintGlow] = useState({ x: 50, y: 30 });

  const handleContainerMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBlueprintGlow({ x, y });
  }, []);

  // Listen for external selection from Global Search or AI Assistant
  useEffect(() => {
    const handleSelectSystem = (e) => {
      const rawCode = typeof e.detail === 'string' ? e.detail : e.detail?.systemCode || e.detail?.code;
      const code = rawCode ? rawCode.toUpperCase().trim() : null;
      if (code && AI_SYSTEMS.some((s) => s.code.toUpperCase() === code)) {
        setActiveSystemCode(code);
      }
    };

    window.addEventListener('select-ai-system', handleSelectSystem);
    return () => window.removeEventListener('select-ai-system', handleSelectSystem);
  }, []);

  const currentSystem = AI_SYSTEMS.find((s) => s.code === activeSystemCode) || AI_SYSTEMS[0];

  return (
    <section id="ai-systems" className="py-24 bg-transparent border-b border-white/10 section-spatial-containment overflow-hidden relative">
      {/* SPATIAL LAYER 1: Deep Coordinate Mesh Grid (Z-0) */}
      <div
        aria-hidden="true"
        className="spatial-grid-plane opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_85%_65%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none"
      />

      {/* SPATIAL LAYER 1.5: Depth Occlusion Mask (Z-5) */}
      <div aria-hidden="true" className="depth-occlusion-mask-layer pointer-events-none" />

      {/* Background Volumetric Radiant Aurora */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-red-600/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[350px] bg-cyan-600/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================= */}
      {/* SELECTOR 1 & CHILD 4 CONTAINER                            */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* SELECTOR 2: SECTION HEADER (div:nth-of-type(1) in child 4) */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10 relative">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
              </span>
              <span className="font-black text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-500/40">
                SYSTEMS ARCHITECTURE // LIVE PIPELINES
              </span>
              <span className="text-[10px] text-neutral-400 font-bold hidden sm:inline">
                VERIFIED 2026
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display uppercase drop-shadow-sm">
              AI Systems Laboratory
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-2 max-w-2xl leading-relaxed">
              Engineered as verifiable operational execution graphs and Directed Acyclic Graphs (DAGs) with autonomous routing and sub-second dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2.5 font-mono text-xs text-neutral-200 bg-gradient-to-r from-[#141624] to-[#0a0b12] px-4 py-2.5 rounded-2xl border-2 border-red-500/40 shadow-[0_8px_24px_rgba(0,0,0,0.85)]">
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-black tracking-wider text-white">DIRECTED ACYCLIC GRAPHS // AUTONOMOUS ROUTING</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE/TABLET TABS (div:nth-of-type(2) in child 4)        */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 lg:hidden">
          {AI_SYSTEMS.map((system) => {
            const isSelected = system.code === activeSystemCode;
            return (
              <button
                key={system.code}
                onClick={() => {
                  playTactileFeedback('tab');
                  setActiveSystemCode(system.code);
                }}
                className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#201018] via-[#140b10] to-[#0a0609] border-red-500 shadow-[0_0_30px_rgba(255,42,58,0.35)] ring-2 ring-red-500/40'
                    : 'bg-[#0a0b12] border-white/15 hover:border-red-500/50 hover:bg-[#111322]'
                }`}
              >
                {/* Blinking Beacon on Mobile Tabs */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-white font-black px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30">
                    {system.code}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-300">
                      {system.status}
                    </span>
                  </div>
                </div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                  {system.name}
                </h3>
                <p className="font-mono text-xs text-neutral-300 mt-1 line-clamp-1">
                  {system.tagline}
                </p>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_10px_#ff2a3a]" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* DESKTOP 3D GLOWING CARDS GRID (div:nth-of-type(3) in child 4) */}
        {/* ========================================================= */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-10">
          {AI_SYSTEMS.map((system) => {
            const isSelected = system.code === activeSystemCode;
            return (
              <ArchitecturalSystemCard
                key={system.code}
                system={system}
                isSelected={isSelected}
                onSelect={setActiveSystemCode}
              />
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* SELECTOR 3: BLUEPRINT SHOWCASE (div:nth-of-type(4) in child 4) */}
        {/* ========================================================= */}
        <div
          ref={containerRef}
          onMouseMove={handleContainerMouseMove}
          className="relative rounded-3xl bg-gradient-to-b from-[#101324] via-[#090b14] to-[#04050a] border-2 border-red-500/50 p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_55px_rgba(255,42,58,0.22),inset_0_1px_1px_rgba(255,255,255,0.25)] space-y-8 overflow-hidden transition-all duration-300 select-none group/blueprint"
        >
          {/* Luminous Top Perimeter Laser Edge */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_18px_#ff2a3a] pointer-events-none" />

          {/* Dynamic Ambient Specular Bloom Follower */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 group-hover/blueprint:opacity-80 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${blueprintGlow.x}% ${blueprintGlow.y}%, rgba(255, 42, 58, 0.12), transparent 75%)`,
            }}
          />

          {/* Machined HUD Brackets */}
          <span className="absolute top-3 left-3 text-red-500/60 font-mono text-sm pointer-events-none font-bold">┌</span>
          <span className="absolute top-3 right-3 text-red-500/60 font-mono text-sm pointer-events-none font-bold">┐</span>
          <span className="absolute bottom-3 left-3 text-red-500/60 font-mono text-sm pointer-events-none font-bold">└</span>
          <span className="absolute bottom-3 right-3 text-red-500/60 font-mono text-sm pointer-events-none font-bold">┘</span>

          {/* Blueprint Title Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/15 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black shadow-[0_0_12px_rgba(255,42,58,0.4)] border border-red-400/40">
                  {currentSystem.badge}
                </span>
                <span className="font-mono text-xs text-neutral-300 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  CODE: {currentSystem.code}
                </span>
                <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                  RUNTIME ACTIVE
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-tight drop-shadow-sm">
                {currentSystem.name} &mdash; Architectural Blueprint
              </h3>
              <p className="text-xs sm:text-sm text-neutral-200 mt-1.5 font-sans leading-relaxed max-w-3xl">
                {currentSystem.overview}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#contact"
                className="px-5 py-3 rounded-xl bg-gradient-to-b from-white via-neutral-100 to-neutral-200 hover:from-white hover:to-neutral-100 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_12px_32px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-white"
              >
                <span>Request Technical Deep Dive</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>
            </div>
          </div>

          {/* 4 Architectural Execution Layers (Razor-Sharp Anti-Blur Cards) */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-300 flex items-center gap-2 font-black">
                <Layers className="w-4 h-4 text-red-500 animate-pulse" />
                SYSTEM DECOMPOSITION & FUNCTIONAL TIERS
              </h4>
              <span className="font-mono text-[11px] text-red-400 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-500/30">
                SEQUENTIAL EXECUTION MATRIX
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSystem.layers.map((layer, index) => (
                <div
                  key={layer.title}
                  className="p-5 rounded-2xl bg-gradient-to-b from-[#13172e] via-[#0b0e1e] to-[#060812] border-2 border-white/15 hover:border-red-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.7)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_24px_rgba(255,42,58,0.18)] transition-all flex items-start gap-3.5 h-full group/layer hover:-translate-y-1 active:scale-[0.99] cursor-pointer"
                >
                  <span className="font-mono text-xs font-black text-white px-2.5 py-1 rounded-xl bg-gradient-to-b from-red-600 to-rose-700 border border-red-400/40 shadow-[0_0_10px_rgba(255,42,58,0.4)] shrink-0">
                    L{index + 1}
                  </span>
                  <div>
                    <h5 className="text-sm sm:text-base font-black text-white font-display uppercase tracking-wide mb-1 group-hover/layer:text-red-300 transition-colors drop-shadow-sm flex items-center gap-2">
                      <span>{layer.title}</span>
                      <Workflow className="w-3.5 h-3.5 text-neutral-400 group-hover/layer:text-red-400 transition-colors" />
                    </h5>
                    <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed">
                      {layer.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Telemetry & Specs Matrix */}
          <div className="pt-6 border-t border-white/15 relative z-10">
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-300 mb-3.5 flex items-center gap-2 font-black">
              <Terminal className="w-4 h-4 text-red-500" />
              SYSTEM RUNTIME METRICS & SPECIFICATIONS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {Object.entries(currentSystem.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-[#080912] border-2 border-white/10 hover:border-red-500/40 space-y-1 shadow-inner transition-colors"
                >
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold flex items-center justify-between">
                    <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  </span>
                  <span className="text-white font-black text-xs sm:text-sm truncate block">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AISystems;
