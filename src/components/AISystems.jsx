import { useState, useEffect } from 'react';
import { AI_SYSTEMS } from '../data/portfolioData';
import { Terminal, Activity, ArrowRight, ArrowUpRight, Layers } from 'lucide-react';
import SpatialCard from './SpatialCard';

const AISystems = () => {
  const [activeSystemCode, setActiveSystemCode] = useState('SYS-01');

  // Listen for external selection from Global Search or AI Assistant
  useEffect(() => {
    const handleSelectSystem = (e) => {
      const code = e.detail;
      if (code && AI_SYSTEMS.some((s) => s.code === code)) {
        setActiveSystemCode(code);
      }
    };

    window.addEventListener('select-ai-system', handleSelectSystem);
    return () => window.removeEventListener('select-ai-system', handleSelectSystem);
  }, []);

  const currentSystem = AI_SYSTEMS.find((s) => s.code === activeSystemCode) || AI_SYSTEMS[0];

  return (
    <section id="ai-systems" className="py-24 bg-[#090a0f] border-b border-white/10 relative">
      {/* Background Subtle Spatial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              SYSTEMS ARCHITECTURE & AGENTIC WORKFLOWS
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              AI Systems Laboratory
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-2 max-w-2xl">
              Engineered as verifiable operational layers and execution graphs rather than static marketing websites.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#12131b] px-3.5 py-2 rounded border border-white/10">
            <Activity className="w-4 h-4 text-red-400" />
            <span>DIRECTED ACYCLIC GRAPHS // AUTONOMOUS ROUTING</span>
          </div>
        </div>

        {/* MOBILE/TABLET TABS — Preserved exactly for mobile/tablet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 lg:hidden">
          {AI_SYSTEMS.map((system) => {
            const isSelected = system.code === activeSystemCode;
            return (
              <button
                key={system.code}
                onClick={() => setActiveSystemCode(system.code)}
                className={`text-left p-5 rounded-lg border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#131520] border-red-500/60 shadow-[0_0_25px_rgba(255,42,58,0.12)]'
                    : 'bg-[#0c0d13] border-white/10 hover:border-white/20 hover:bg-[#101118]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-neutral-500 font-bold">
                    {system.code}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold ${
                      isSelected
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {system.status}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">
                  {system.name}
                </h3>
                <p className="font-mono text-xs text-neutral-400 mt-1 line-clamp-1">
                  {system.tagline}
                </p>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* DESKTOP SPATIAL GRID — 2-Column Top for SYS-01 & SYS-02, Full-Width Architectural Card for SYS-03 */}
        <div className="hidden lg:grid grid-cols-2 gap-6 mb-8">
          {AI_SYSTEMS.map((system) => {
            const isSelected = system.code === activeSystemCode;
            const isSys03 = system.code === 'SYS-03';
            return (
              <div
                key={system.code}
                onClick={() => setActiveSystemCode(system.code)}
                className={`cursor-pointer rounded-xl p-6 transition-all duration-300 relative border flex flex-col justify-between ${
                  isSys03 ? 'col-span-2 bg-[#0a0b10]' : 'col-span-1 bg-[#0c0d14]'
                } ${
                  isSelected
                    ? 'border-red-500/60 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,42,58,0.12)] ring-1 ring-red-500/30'
                    : 'border-white/10 hover:border-white/20 hover:bg-[#101119]'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-red-400 font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-500/25">
                        {system.code}
                      </span>
                      <span className="font-mono text-xs text-neutral-400 uppercase">
                        {system.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-[10px] uppercase font-semibold text-emerald-400">
                        {system.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight flex items-center gap-2">
                      <span>{system.name}</span>
                      {isSelected && (
                        <span className="font-mono text-[10px] text-red-400 lowercase tracking-normal font-normal">
                          [active blueprint]
                        </span>
                      )}
                    </h3>
                    <p className="font-mono text-xs text-neutral-400 mt-1">
                      {system.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-5">
                    {system.overview}
                  </p>

                  {/* Layers Overview */}
                  <div className={`grid gap-2.5 mb-5 ${isSys03 ? 'grid-cols-4' : 'grid-cols-1'}`}>
                    {system.layers?.slice(0, isSys03 ? 4 : 3).map((layer, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-[#13141e] border border-white/5 text-xs font-mono"
                      >
                        <div className="text-white font-bold mb-0.5 truncate flex items-center gap-1.5">
                          <span className="text-red-400 text-[10px]">0{idx + 1}</span>
                          <span className="truncate">{layer.title}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-tight">
                          {layer.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action / Specs Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <div className="text-neutral-500">
                    {isSys03 ? 'Method: Field Insight + Autonomous Architecture' : `Target: ${system.specs?.latency || system.specs?.graphModel}`}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSystemCode(system.code);
                    }}
                    className="text-red-400 hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isSelected ? 'VIEWING BLUEPRINT' : 'INSPECT BLUEPRINT'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active System Architecture Blueprint Showcase */}
        <div className="rounded-xl bg-[#0d0e14] border border-white/15 p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Blueprint Title Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-red-950/50 text-red-300 border border-red-500/30">
                  {currentSystem.badge}
                </span>
                <span className="font-mono text-xs text-neutral-500">
                  CODE: {currentSystem.code}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight">
                {currentSystem.name} &mdash; Architectural Blueprint
              </h3>
              <p className="text-sm text-neutral-300 mt-1 font-sans">
                {currentSystem.overview}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="px-4 py-2.5 rounded bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2"
              >
                <span>Request Technical Deep Dive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4 Architectural Execution Layers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                SYSTEM DECOMPOSITION & FUNCTIONAL TIERS
              </h4>
              <span className="font-mono text-[11px] text-neutral-500">
                SEQUENTIAL EXECUTION MATRIX
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSystem.layers.map((layer, index) => (
                <SpatialCard
                  key={layer.title}
                  intensity="subtle"
                  className="p-4 sm:p-5 rounded-lg bg-[#12131b] border border-white/10 hover:border-white/20 flex items-start gap-3.5 h-full"
                >
                  <span className="font-mono text-xs font-bold text-red-500 px-2 py-1 rounded bg-red-500/10 border border-red-500/20 shrink-0">
                    L{index + 1}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-white font-display uppercase tracking-wide mb-1">
                      {layer.title}
                    </h5>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {layer.desc}
                    </p>
                  </div>
                </SpatialCard>
              ))}
            </div>
          </div>

          {/* System Telemetry & Specs Matrix */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-500" />
              SYSTEM RUNTIME METRICS & SPECIFICATIONS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {Object.entries(currentSystem.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3.5 rounded bg-[#111219] border border-white/5 space-y-1"
                >
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-neutral-200 font-semibold text-xs truncate block">
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
