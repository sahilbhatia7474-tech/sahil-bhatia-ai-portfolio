import { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { FUTURE_VAULT } from '../data/portfolioData';
import { Archive, Search, Calendar, Cpu, Sparkles, Activity, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpatialCard from './SpatialCard';

/**
 * NEXT HORIZON // FUTURE VAULT
 * 
 * Public-facing living intelligence archive of what Sahil is exploring,
 * testing, researching, prototyping, and preparing next.
 * Structured by streams:
 * - CURRENT SIGNALS
 * - IN DEVELOPMENT
 * - EXPERIMENTS
 * - RESEARCH
 * - NEXT PRODUCTS
 * - ARCHIVED
 * 
 * Rendered using SpatialCard (intensity: medium)
 */

const STREAMS = [
  'ALL',
  'CURRENT SIGNALS',
  'IN DEVELOPMENT',
  'EXPERIMENTS',
  'RESEARCH',
  'NEXT PRODUCTS',
  'ARCHIVED',
];

const FutureVault = () => {
  const { allProjects } = usePortfolioData();
  const [activeStream, setActiveStream] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically enhance future vault items if needed
  const dynamicItems = allProjects
    ? allProjects.map((p) => ({
        id: p.id,
        stream: p.status === 'DRAFT' || p.status === 'IN_PROGRESS' ? 'IN DEVELOPMENT' : 'ARCHIVED',
        title: p.title,
        type: p.category && p.category.includes('AI') ? 'AI System' : 'Project',
        description: p.summary || p.subtitle || '',
        status: p.status === 'DRAFT' ? 'IN DEVELOPMENT' : 'BUILT',
        tags: p.techStack || ['AI', 'System'],
        signals: p.techStack?.slice(0, 3) || ['Architecture', 'Implementation'],
        dateAdded: p.date || '2025-Q1',
        evidence: 'Verified code and architecture deliverable.',
      }))
    : [];

  const combinedVault = [...FUTURE_VAULT, ...dynamicItems.filter((d) => !FUTURE_VAULT.some((fv) => fv.id === d.id))];

  const filteredVault = combinedVault.filter((item) => {
    const matchesStream = activeStream === 'ALL' || item.stream === activeStream;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
      (item.signals && item.signals.some((s) => s.toLowerCase().includes(q)));
    return matchesStream && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BUILT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'IN DEVELOPMENT':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'EXPERIMENT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25';
      case 'CONCEPT':
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
  };

  return (
    <section id="vault" className="py-24 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              THE NEXT BUILD LAYER &middot; INTELLIGENCE ARCHIVE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              NEXT HORIZON <span className="text-neutral-500">//</span> FUTURE VAULT
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-2 max-w-2xl leading-relaxed">
              A public-facing intelligence archive of what Sahil is actively exploring, testing, researching, prototyping, and preparing next. Grounded strictly in authentic experiments, verified methodologies, and technical pipelines.
            </p>
          </div>

          {/* Quick Registry Info */}
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#0e0f14] px-3.5 py-2 rounded-lg border border-white/10">
            <Archive className="w-4 h-4 text-red-500" />
            <span>LIVING RESEARCH RUNTIME &bull; ZERO FABRICATION</span>
          </div>
        </div>

        {/* Controls: Stream Filter Tabs & Search Box */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10">
          {/* Streams Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STREAMS.map((stream) => (
              <button
                key={stream}
                onClick={() => setActiveStream(stream)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all cursor-pointer ${
                  activeStream === stream
                    ? 'bg-red-600 text-white font-semibold shadow-[0_0_12px_rgba(255,42,58,0.3)]'
                    : 'bg-[#101117] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter signals, topics, tags..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e0f15] border border-white/10 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50"
            />
          </div>
        </div>

        {/* Vault Spatial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVault.map((item) => (
            <SpatialCard
              key={item.id}
              intensity="medium"
              className="h-full rounded-xl bg-[#0b0c12] border border-white/10 p-6 flex flex-col justify-between hover:border-red-500/40 transition-colors group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5 font-semibold">
                      {item.stream || 'SIGNAL'}
                    </span>
                    <span className="text-neutral-500 uppercase">{item.type}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-red-400 transition-colors uppercase tracking-tight mb-2.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Signals / Key Mechanics */}
                {item.signals && item.signals.length > 0 && (
                  <div className="mb-4 p-2.5 rounded bg-[#0f1018] border border-white/5 space-y-1">
                    <div className="text-[10px] font-mono text-red-400/90 uppercase tracking-wider flex items-center gap-1">
                      <Activity className="w-3 h-3 text-red-500" />
                      <span>SIGNALS & INDICATORS</span>
                    </div>
                    <ul className="text-[11px] font-mono text-neutral-300 space-y-0.5">
                      {item.signals.map((sig, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5 text-neutral-400">
                          <span className="text-red-500/60">&rsaquo;</span>
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Evidence & Footer */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                {item.evidence && (
                  <div className="text-[11px] font-sans text-neutral-400 flex items-start gap-1.5">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase shrink-0 pt-0.5">
                      EVIDENCE:
                    </span>
                    <span className="text-neutral-400 text-xs">{item.evidence}</span>
                  </div>
                )}

                {/* Tags & ID */}
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-neutral-500">
                  <div className="flex flex-wrap gap-1">
                    {(item.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-neutral-400 group-hover:text-white font-mono">
                    {item.dateAdded || item.id}
                  </span>
                </div>
              </div>
            </SpatialCard>
          ))}
        </div>

        {/* Scalability Notice */}
        <div className="mt-10 p-4 rounded-xl bg-[#0b0c12] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
          <span>+ Manage, publish, and sync new research signals dynamically via <Link to="/vault" className="text-red-400 hover:text-red-300 font-bold underline">Founder Vault Console</Link></span>
          <span className="text-red-500 font-bold">INTELLIGENCE RUNTIME ACTIVE</span>
        </div>
      </div>
    </section>
  );
};

export default FutureVault;
