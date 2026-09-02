import { CAPABILITY_MAP } from '../data/portfolioData';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

const CapabilityMap = () => {
  return (
    <section id="capabilities" className="py-24 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              EVIDENCE-BASED CAPABILITY MAP
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              Skills & Systems Competencies
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#111217] border border-white/10 text-xs font-mono text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NO ARBITRARY PERCENTAGE BARS // GROUNDED IN PRACTICE</span>
          </div>
        </div>

        {/* Core Capability Badges Grid — Responsive Desktop Presentation */}
        <div className="hidden lg:grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'AI & AGENTIC SYSTEMS', status: 'CORE', metric: 'LLMs & Tool Use' },
            { label: 'AUTOMATION', status: 'PROFICIENT', metric: 'n8n & Webhooks' },
            { label: 'PRODUCT & UX', status: 'CORE', metric: 'Design & Interaction' },
            { label: 'AI BUILDING', status: 'CORE', metric: '0-to-1 Prototypes' },
            { label: 'PROMPT ENGINEERING', status: 'EXPERT', metric: 'JSON & Guardrails' },
            { label: 'VIBE CODING', status: 'HIGH VELOCITY', metric: 'Claude / Cursor / AI Studio' },
            { label: 'DATA / AI ANALYSIS', status: 'PROFICIENT', metric: 'Metrics & Funnels' },
            { label: 'BUSINESS PROBLEM SOLVING', status: 'FIELD-TESTED', metric: 'Commercial Reality' },
          ].map((cap) => (
            <div
              key={cap.label}
              className="p-3.5 rounded-lg bg-[#0e0f15] border border-white/10 hover:border-red-500/40 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-[11px] font-bold text-white tracking-wide truncate">
                  {cap.label}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/20 shrink-0">
                  {cap.status}
                </span>
              </div>
              <span className="font-mono text-[11px] text-neutral-400">
                {cap.metric}
              </span>
            </div>
          ))}
        </div>

        {/* 4 Architectural Category Clusters — 4-Column on Desktop, 2 on Tablet, 1 on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAPABILITY_MAP.map((cluster) => (
            <div
              key={cluster.category}
              className="rounded-lg bg-[#0c0d12] border border-white/10 p-5 sm:p-6 hover:border-white/20 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                    <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-white">
                      {cluster.category}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                    {cluster.skills.length} COMPETENCIES
                  </span>
                </div>

                {/* Skill Item Rows */}
                <div className="space-y-3.5">
                  {cluster.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-md bg-[#121319] border border-white/5 hover:border-white/15 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-neutral-100 font-sans">
                          {skill.name}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-500/20 font-medium">
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        {skill.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-neutral-400" />
                  Execution Standard: Verified
                </span>
                <span>SAHIL / CAPABILITY</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout: Vibe Coding & Systems Synthesis */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-[#101117] via-[#14151e] to-[#101117] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-md bg-red-600/10 border border-red-500/30 text-red-400 mt-1">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-display uppercase tracking-wide">
                The Hybrid Advantage: Sales Empathy + Agentic Speed
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed mt-1 font-sans">
                Most AI builders only know syntax; most sales operators only know pitches. By combining deep frontline commercial discovery with modern autonomous agent engineering and vibe coding velocity, I eliminate communication silos and deliver high-impact digital tools.
              </p>
            </div>
          </div>
          <a
            href="#journey"
            className="shrink-0 px-4 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white tracking-wide transition-colors"
          >
            Explore Career Journey →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CapabilityMap;
