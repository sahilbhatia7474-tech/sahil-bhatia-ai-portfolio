import { usePortfolioData } from '../context/PortfolioDataContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import SpatialCard from './SpatialCard';

const Journey = () => {
  const { journey } = usePortfolioData();

  return (
    <section id="journey" className="py-24 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              GROUND-LEVEL COMMERCIAL REALITY TO AI SYSTEMS
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              Professional Journey
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#0e0f14] px-3.5 py-2 rounded border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PRIMARY VERIFIED CHRONOLOGY</span>
          </div>
        </div>

        {/* Narrative Evolution Chain */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0d0e14] border border-white/10 mb-12">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            STRATEGIC EVOLUTION VECTOR
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-white">
            <span className="px-2.5 py-1 rounded bg-white/10 text-neutral-200">FIELD SALES</span>
            <span className="text-red-500">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-neutral-200">CUSTOMER REALITY</span>
            <span className="text-red-500">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-neutral-200">AI LEARNING</span>
            <span className="text-red-500">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-neutral-200">AI BUILDING</span>
            <span className="text-red-500">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-neutral-200">AI SYSTEMS</span>
            <span className="text-red-500">&rarr;</span>
            <span className="px-2.5 py-1 rounded bg-red-600 text-white font-bold">AI CONSULTANCY DIRECTION</span>
          </div>
        </div>

        {/* Timeline Entries — 2-Column Grid on Desktop, Vertical Timeline on Mobile/Tablet */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 relative">
          {/* Vertical indicator line for tablet */}
          <div className="hidden md:block lg:hidden absolute left-8 top-6 bottom-6 w-[1px] bg-gradient-to-b from-red-500 via-white/10 to-transparent" />

          {journey.map((entry, index) => {
            const isUnverified = !entry.verified || entry.status === 'VERIFY';
            const themes = entry.keyThemes || entry.coreThemes || [];
            const elementId = entry.id || `journey-${entry.company?.toLowerCase().replace(/\s+/g, '-')}`;
            const isCulmination = index === journey.length - 1; // Last entry spans both columns on desktop
            return (
              <div
                key={entry.id}
                id={elementId}
                className={`relative md:ml-16 lg:ml-0 transition-all duration-300 ${
                  isCulmination ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                {/* Timeline node icon on tablet */}
                <div className="hidden md:flex lg:hidden absolute -left-[4.75rem] top-8 w-7 h-7 rounded-full bg-[#070708] border border-white/20 items-center justify-center z-20">
                  {isUnverified ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </div>

                <SpatialCard
                  intensity="subtle"
                  className={`rounded-xl border p-6 sm:p-8 transition-all h-full flex flex-col justify-between ${
                    isUnverified
                      ? 'bg-[#121010] border-amber-500/30'
                      : isCulmination
                      ? 'bg-[#0d0e16] border-red-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(255,42,58,0.08)]'
                      : 'bg-[#0c0d12] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                    <div>
                      <span className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                        {entry.phase || 'CAREER PHASE'}
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-tight">
                          {entry.role}
                        </h3>
                        <span className="font-mono text-sm text-red-400 font-semibold">
                          @ {entry.company}
                        </span>
                      </div>
                    </div>

                    {/* Verification Badge */}
                    <div className="shrink-0">
                      {isUnverified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {entry.status || 'VERIFY'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {entry.status || 'VERIFIED'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Period & Location */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 mb-4">
                    <span>PERIOD: <strong className="text-neutral-200">{entry.period}</strong></span>
                    {entry.location && (
                      <>
                        <span>&bull;</span>
                        <span>LOCATION: <strong className="text-neutral-200">{entry.location}</strong></span>
                      </>
                    )}
                  </div>

                  {/* Description or Responsibilities */}
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed mb-5">
                    {entry.description || (entry.responsibilities && entry.responsibilities.join(' • '))}
                  </p>

                  {/* Focus Themes */}
                  {themes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {themes.map((theme) => (
                        <span
                          key={theme}
                          className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/5 text-neutral-300"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Takeaway / Commercial Insight */}
                  {entry.takeaways && (
                    <div className="p-3.5 rounded bg-[#13141c] border border-white/5 text-xs text-neutral-300 font-sans italic">
                      <span className="font-mono not-italic font-bold text-red-400 mr-2 uppercase text-[10px]">
                        COMMERCIAL INSIGHT:
                      </span>
                      &ldquo;{entry.takeaways}&rdquo;
                    </div>
                  )}
                </SpatialCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Journey;
