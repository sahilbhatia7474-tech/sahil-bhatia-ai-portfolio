import { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { PROOF_MATRIX } from '../data/portfolioData';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ExternalLink } from 'lucide-react';

const Proof = () => {
  const { proofItems, certificates } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Format certificates into proof entries
  const certItems = (certificates || []).map((c) => ({
    id: c.id,
    title: c.title,
    category: 'Certifications',
    status: (c.status || 'VERIFIED').toUpperCase(),
    evidence: `Certificate of Completion issued to ${c.recipient || 'Sahil Bhatia'} (Credential ID: ${c.credentialId}). Topics: ${(c.topics || []).join(', ')}.`,
    date: c.issueDate || 'June 21, 2026',
    target: 'proof',
    url: c.url,
    linkText: 'VERIFY CREDENTIAL →',
  }));

  // Map proofItems or fallback to PROOF_MATRIX
  const baseItems = proofItems && proofItems.length > 0
    ? proofItems.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.evidenceType || 'Projects',
        status: (p.proofState || 'VERIFIED').toUpperCase(),
        evidence: p.description || 'Verified engineering artifact with production telemetry.',
        date: p.verifiedDate || 'ACTIVE',
        target: p.relatedProjectId || 'projects',
        url: p.url || '',
        linkText: p.linkText || (p.url ? 'VERIFY CREDENTIAL →' : 'Inspect'),
      }))
    : PROOF_MATRIX;

  // Combine items avoiding duplicates
  const items = [
    ...certItems,
    ...baseItems.filter((b) => !certItems.some((c) => c.id === b.id || c.title === b.title)),
  ];

  const categories = [
    'ALL',
    ...Array.from(new Set(items.map((i) => i.category))).filter(Boolean),
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="proof" className="py-24 bg-[#090a0f] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              VERIFIABLE CLAIMS & REAL ARTIFACTS
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              Proof & Evidence Matrix
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-2 max-w-xl">
              Every assertion is mapped to inspectable software repositories, real-world case studies, or transparent audit markers.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400 bg-[#12131b] px-3.5 py-2 rounded border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>HONESTY STANDARD: ZERO FABRICATION</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono tracking-wide transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-lg'
                  : 'bg-[#101117] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MOBILE/TABLET PROOF TABLE (Preserved exactly for mobile/tablet) */}
        <div className="lg:hidden rounded-xl bg-[#0c0d12] border border-white/10 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#121319] border-b border-white/10 font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
            <span className="col-span-4">Claim / Artifact</span>
            <span className="col-span-2">Category</span>
            <span className="col-span-2">Verification Status</span>
            <span className="col-span-3">Evidence Basis</span>
            <span className="col-span-1 text-right">Action</span>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 hover:bg-[#12131a] transition-colors items-center"
              >
                {/* Title */}
                <div className="md:col-span-4">
                  <span className="font-mono text-[10px] text-neutral-500 block md:hidden mb-1">
                    ITEM {item.id} &bull; {item.date}
                  </span>
                  <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <span className="hidden md:inline font-mono text-[10px] text-neutral-500">
                    {item.date}
                  </span>
                </div>

                {/* Category */}
                <div className="md:col-span-2">
                  <span className="text-xs font-mono text-neutral-300 px-2.5 py-1 rounded bg-white/5 border border-white/5 inline-block">
                    {item.category}
                  </span>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-xs font-semibold border ${
                      item.status === 'BUILT' || item.status === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : item.status === 'IN PROGRESS'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : item.status === 'EXPERIMENT'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}
                  >
                    {item.status === 'BUILT' || item.status === 'VERIFIED' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : item.status === 'IN PROGRESS' ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {item.status}
                  </span>
                </div>

                {/* Evidence Basis */}
                <div className="md:col-span-3 text-xs text-neutral-400 font-sans leading-relaxed">
                  {item.evidence}
                </div>

                {/* Action Link */}
                <div className="md:col-span-1 md:text-right pt-2 md:pt-0">
                  <a
                    href={item.url || `#${item.target}`}
                    target={item.url ? '_blank' : '_self'}
                    rel={item.url ? 'noopener noreferrer' : ''}
                    className="inline-flex items-center gap-1 font-mono text-xs text-red-400 hover:text-white transition-colors"
                  >
                    <span>{item.linkText || (item.url ? 'VERIFY' : 'Inspect')}</span>
                    {item.url ? <ExternalLink className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP 2-COLUMN SPATIAL PROOF MATRIX */}
        <div className="hidden lg:grid grid-cols-2 gap-6">
          {/* Column 1: Credentials & Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs text-neutral-400 uppercase tracking-wider">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                VERIFIED CREDENTIALS & CERTIFICATIONS
              </span>
              <span>CERTIFICATION RECORD</span>
            </div>

            <div className="space-y-4">
              {(selectedCategory === 'ALL' || selectedCategory === 'Certifications'
                ? certItems
                : filteredItems.filter((i) => i.category === 'Certifications')
              ).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#0c0d14] border border-emerald-500/30 p-6 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-semibold">
                        {item.status}
                      </span>
                      <span className="font-mono text-xs text-neutral-500">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4">
                      {item.evidence}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-neutral-500">
                      Issuer: be10x &bull; Sahil Bhatia
                    </span>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold border border-emerald-500/30 transition-colors"
                      >
                        <span>VERIFY CREDENTIAL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* In case no certs match filter, display general items */}
              {selectedCategory !== 'ALL' && selectedCategory !== 'Certifications' && (
                <div className="space-y-4">
                  {filteredItems.slice(0, Math.ceil(filteredItems.length / 2)).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl bg-[#0c0d13] border border-white/10 p-5 shadow-lg flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                        <span className="font-mono text-xs text-neutral-400">{item.category}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-white text-base mb-1">{item.title}</h4>
                      <p className="text-xs text-neutral-400 font-sans mb-3">{item.evidence}</p>
                      <div className="pt-2 border-t border-white/5 flex justify-end">
                        <a
                          href={item.url || `#${item.target}`}
                          className="font-mono text-xs text-red-400 hover:text-white flex items-center gap-1"
                        >
                          <span>{item.linkText || 'Inspect'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Software & Systems Evidence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono text-xs text-neutral-400 uppercase tracking-wider">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                SYSTEM & PROJECT DELIVERABLES
              </span>
              <span>PRODUCTION ARTIFACTS</span>
            </div>

            <div className="space-y-4">
              {(selectedCategory === 'ALL'
                ? baseItems.slice(0, 4)
                : selectedCategory === 'Certifications'
                ? baseItems.slice(0, 4)
                : filteredItems.slice(Math.ceil(filteredItems.length / 2))
              ).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-[#0c0d14] border border-white/10 hover:border-red-500/40 p-5 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-red-400 font-semibold px-2 py-0.5 rounded bg-red-950/40 border border-red-500/25">
                          {item.category}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500">
                          {item.date}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold">
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-white text-base uppercase tracking-tight mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-3">
                      {item.evidence}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-neutral-500">
                      Audit Status: Verified Artifact
                    </span>
                    <a
                      href={item.url || `#${item.target}`}
                      target={item.url ? '_blank' : '_self'}
                      rel={item.url ? 'noopener noreferrer' : ''}
                      className="font-mono text-xs text-red-400 hover:text-white flex items-center gap-1 font-semibold transition-colors"
                    >
                      <span>{item.linkText || (item.url ? 'VERIFY' : 'Inspect')}</span>
                      {item.url ? <ExternalLink className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
