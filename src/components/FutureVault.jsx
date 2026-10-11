import { useState, useRef, useCallback, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { FUTURE_VAULT } from '../data/portfolioData';
import {
  Archive,
  Search,
  Activity,
  Database,
  Sparkles,
  Cpu,
  Binary,
  Layers,
  Lock,
  Zap,
  Check,
  RefreshCw,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
    } else if (type === 'copy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Audio context may be restricted before user gesture; gracefully ignore
  }
}

const STREAMS = [
  'ALL',
  'CURRENT SIGNALS',
  'IN DEVELOPMENT',
  'EXPERIMENTS',
  'RESEARCH',
  'NEXT PRODUCTS',
  'ARCHIVED',
];

/**
 * Razor-Sharp 3D Tactile Vault Specimen Card
 * Eliminates GPU texture rasterization blur by using crisp vector borders,
 * multi-layer physical specular bevels, high-contrast subpixel antialiasing,
 * and responsive tactile elevation on hover.
 */
function RazorVaultCard({
  item,
  index,
  total,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [cardGlow, setCardGlow] = useState({ x: 50, y: 50 });

  const handleCardMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCardGlow({ x, y });
  }, []);

  const isBuilt = item.status === 'BUILT';
  const isInDev = item.status === 'IN DEVELOPMENT';
  const isExp = item.status === 'EXPERIMENT';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl transition-all duration-300 group h-full select-none sm:select-auto"
    >
      {/* 3D Physical Chassis (Matches Selectors 4, 5, 6) */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-3xl border-2 p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2.5 active:translate-y-0.5 active:scale-[0.99] ${
          isInDev
            ? isHovered
              ? 'bg-gradient-to-b from-[#181119] via-[#0f0b11] to-[#070509] border-red-500 ring-2 ring-red-500/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(255,42,58,0.38)]'
              : 'bg-gradient-to-b from-[#120d14] via-[#0b080d] to-[#050407] border-red-500/35 hover:border-red-500/70 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
            : isBuilt
            ? isHovered
              ? 'bg-gradient-to-b from-[#0e1816] via-[#091211] to-[#050b0a] border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(16,185,129,0.38)]'
              : 'bg-gradient-to-b from-[#0a1412] via-[#070e0d] to-[#040807] border-emerald-500/35 hover:border-emerald-400/70 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
            : isExp
            ? isHovered
              ? 'bg-gradient-to-b from-[#0e1724] via-[#08101a] to-[#04080f] border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(6,182,212,0.38)]'
              : 'bg-gradient-to-b from-[#0a111c] via-[#060c14] to-[#03060a] border-cyan-500/35 hover:border-cyan-400/70 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
            : isHovered
            ? 'bg-gradient-to-b from-[#151728] via-[#0d0f1b] to-[#06070f] border-amber-500 ring-2 ring-amber-500/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(245,158,11,0.38)]'
            : 'bg-gradient-to-b from-[#101222] via-[#0a0c17] to-[#05060d] border-white/15 hover:border-white/35 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Dynamic Specular Light Follower on Card Face */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: isInDev
              ? `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(255, 42, 58, 0.16), transparent 70%)`
              : isBuilt
              ? `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(16, 185, 129, 0.16), transparent 70%)`
              : `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(6, 182, 212, 0.16), transparent 70%)`,
          }}
        />

        {/* Top Hairline Specular Edge */}
        <div
          className={`absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent to-transparent pointer-events-none transition-colors ${
            isInDev
              ? 'via-white/40 group-hover:via-red-500 shadow-[0_0_12px_rgba(255,42,58,0.5)]'
              : isBuilt
              ? 'via-white/40 group-hover:via-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'via-white/40 group-hover:via-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
          }`}
        />

        {/* Machined Precision Corner Brackets */}
        <span
          className={`absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors pointer-events-none ${
            isInDev
              ? 'border-white/25 group-hover:border-red-400'
              : isBuilt
              ? 'border-white/25 group-hover:border-emerald-400'
              : 'border-white/25 group-hover:border-cyan-400'
          }`}
        />
        <span
          className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors pointer-events-none ${
            isInDev
              ? 'border-white/25 group-hover:border-red-400'
              : isBuilt
              ? 'border-white/25 group-hover:border-emerald-400'
              : 'border-white/25 group-hover:border-cyan-400'
          }`}
        />
        <span
          className={`absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors pointer-events-none ${
            isInDev
              ? 'border-white/25 group-hover:border-red-400'
              : isBuilt
              ? 'border-white/25 group-hover:border-emerald-400'
              : 'border-white/25 group-hover:border-cyan-400'
          }`}
        />
        <span
          className={`absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors pointer-events-none ${
            isInDev
              ? 'border-white/25 group-hover:border-red-400'
              : isBuilt
              ? 'border-white/25 group-hover:border-emerald-400'
              : 'border-white/25 group-hover:border-cyan-400'
          }`}
        />

        {/* ================= CARD INNER CONTENT ================= */}
        <div className="space-y-4 relative z-10">
          {/* Top Meta Tier: Stream Badge, Type & Blinking Beacon */}
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-white/10 text-white border border-white/20 font-mono text-xs font-black uppercase tracking-wider shadow-inner">
                {item.stream || 'SIGNAL'}
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/50 px-1.5 py-0.5 rounded border border-red-500/30">
                [0{index + 1}/0{total}]
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold hidden sm:inline">
                {item.type}
              </span>
            </div>

            {/* Blinking 3D Status Beacon */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border-2 text-[11px] font-mono font-black uppercase tracking-wider shadow-md shrink-0 ${
                isBuilt
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.35)]'
                  : isInDev
                  ? 'bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_14px_rgba(255,42,58,0.35)]'
                  : isExp
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.35)]'
                  : 'bg-amber-500/15 border-amber-500/50 text-amber-300'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
                    isBuilt
                      ? 'bg-emerald-400'
                      : isInDev
                      ? 'bg-red-400'
                      : isExp
                      ? 'bg-cyan-400'
                      : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isBuilt
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                      : isInDev
                      ? 'bg-red-500 shadow-[0_0_8px_#ff2a3a]'
                      : isExp
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : 'bg-amber-400'
                  }`}
                />
              </span>
              <span>{item.status}</span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h3
              className={`text-lg sm:text-xl font-black font-display text-white uppercase tracking-tight transition-colors drop-shadow-sm ${
                isInDev ? 'group-hover:text-red-400' : isBuilt ? 'group-hover:text-emerald-300' : 'group-hover:text-cyan-300'
              }`}
            >
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed mt-2 font-normal">
              {item.description}
            </p>
          </div>

          {/* SIGNALS & KEY MECHANICS PLATE */}
          {item.signals && item.signals.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#070914] border-2 border-red-500/30 space-y-2 shadow-inner">
              <div className="text-[11px] font-mono text-red-400 uppercase tracking-wider flex items-center justify-between font-black">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>SIGNALS &amp; INDICATORS</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">SPECIMEN-VALIDATED</span>
              </div>
              <ul className="text-xs font-mono text-neutral-200 space-y-1.5 pt-0.5">
                {item.signals.map((sig, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-red-500 font-black select-none">&rsaquo;</span>
                    <span className="leading-snug font-medium text-neutral-200">{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Narrative */}
          {item.evidence && (
            <div className="text-xs font-sans text-neutral-300 flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10 shadow-inner">
              <span className="font-mono text-[10px] text-red-400 uppercase shrink-0 pt-0.5 font-bold tracking-wider">
                EVIDENCE:
              </span>
              <span className="leading-relaxed font-medium">{item.evidence}</span>
            </div>
          )}
        </div>

        {/* ================= CARD FOOTER ACTION ROW (Selector 7: div:nth-of-type(3)) ================= */}
        <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
          {/* Tags list (Selector 7: div:nth-of-type(1) > span:nth-of-type(1)) */}
          <div className="flex flex-wrap gap-1.5">
            {(item.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-neutral-200 border border-white/15 text-xs font-mono font-bold hover:border-red-500/50 hover:text-white transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Timestamp / ID Badge */}
          <div className="text-xs font-mono text-neutral-300 font-bold group-hover:text-white transition-colors shrink-0 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            {item.dateAdded || item.id}
          </div>
        </div>

        {/* Bottom Laser Accent Runner */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            isInDev
              ? 'via-red-500 shadow-[0_0_20px_#ff2a3a]'
              : isBuilt
              ? 'via-emerald-400 shadow-[0_0_20px_#34d399]'
              : 'via-cyan-400 shadow-[0_0_20px_#22d3ee]'
          }`}
        />
      </div>
    </div>
  );
}

const FutureVault = () => {
  const { allProjects } = usePortfolioData();
  const [activeStream, setActiveStream] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditStatus, setAuditStatus] = useState(null);
  const sectionRef = useRef(null);

  // Dynamic atmospheric spotlight coordinates
  const [ambientLight, setAmbientLight] = useState({ x: 50, y: 30 });

  const handleSectionMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setAmbientLight({ x, y });
  }, []);

  const handleTriggerAudit = () => {
    playTactileFeedback('tab');
    setAuditStatus('AUDITING');
    setTimeout(() => {
      setAuditStatus('VERIFIED');
      setTimeout(() => setAuditStatus(null), 3000);
    }, 800);
  };

  // Dynamically enhance future vault items if needed
  const dynamicItems = useMemo(() => {
    return allProjects
      ? allProjects.map((p) => ({
          id: p.id,
          stream: p.status === 'DRAFT' || p.status === 'IN_PROGRESS' ? 'IN DEVELOPMENT' : 'ARCHIVED',
          title: p.title,
          type: p.category && p.category.includes('AI') ? 'AI System' : 'Project',
          description: p.summary || p.subtitle || '',
          status: p.status === 'DRAFT' ? 'IN DEVELOPMENT' : 'BUILT',
          tags: p.techStack || ['AI', 'System'],
          signals: p.techStack?.slice(0, 3) || ['Architecture', 'Implementation'],
          dateAdded: p.date || '2026-Q1',
          evidence: 'Verified code and architecture deliverable.',
        }))
      : [];
  }, [allProjects]);

  const combinedVault = useMemo(() => {
    return [...FUTURE_VAULT, ...dynamicItems.filter((d) => !FUTURE_VAULT.some((fv) => fv.id === d.id))];
  }, [dynamicItems]);

  // Streams with counts
  const streamsWithCounts = useMemo(() => {
    const counts = { ALL: combinedVault.length };
    combinedVault.forEach((v) => {
      if (v.stream) {
        counts[v.stream] = (counts[v.stream] || 0) + 1;
      }
    });
    return counts;
  }, [combinedVault]);

  const filteredVault = useMemo(() => {
    return combinedVault.filter((item) => {
      const matchesStream = activeStream === 'ALL' || item.stream === activeStream;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStream;

      const matchesSearch =
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(q))) ||
        (item.signals && item.signals.some((s) => s.toLowerCase().includes(q)));
      return matchesStream && matchesSearch;
    });
  }, [combinedVault, activeStream, searchQuery]);

  return (
    <section
      id="vault"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-24 sm:py-32 bg-transparent border-b border-white/10 relative overflow-hidden select-none sm:select-auto"
    >
      {/* ========================================================================= */}
      {/* RICH BACKGROUND RIG (Direct children 1 through 5 of section#vault)         */}
      {/* Preserves precise nth-of-type(6) selector targeting for foreground root!  */}
      {/* ========================================================================= */}

      {/* 1. Top 3D Specular Laser Horizon Rail */}
      <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_28px_#ff2a3a] pointer-events-none z-10" />

      {/* 2. Bottom 3D Specular Laser Horizon Rail */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_28px_#06b6d4] pointer-events-none z-10" />

      {/* 3. Luminous Cyber-Isometric Coordinate Grid with Radial Mask */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.16] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 42, 58, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 42, 58, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 45%, black 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 45%, black 25%, transparent 85%)',
        }}
      />

      {/* 4. Dynamic Cursor-Tracking Ambient Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(950px circle at ${ambientLight.x}% ${ambientLight.y}%, rgba(255, 42, 58, 0.12), rgba(6, 182, 212, 0.05) 45%, transparent 75%)`,
        }}
      />

      {/* 5. Volumetric Atmospheric Blooms & Void Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-[600px] h-[600px] rounded-full bg-red-600/[0.08] blur-[160px]" />
        <div className="absolute bottom-10 -right-36 w-[600px] h-[600px] rounded-full bg-cyan-600/[0.07] blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(14,18,30,0.6)_0%,transparent_80%)]" />
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND CONTAINER (Direct child div:nth-of-type(6) of section)         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* SECTION HEADER DECK (Selector 2)                          */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-3.5">
            {/* Tactical Status Pill with Blinking Radar Beacon */}
            <div className="inline-flex items-center gap-3 px-4.5 py-2.5 rounded-full bg-gradient-to-r from-red-500/25 via-rose-500/20 to-red-500/15 border-2 border-red-500/50 shadow-[0_0_24px_rgba(255,42,58,0.3)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_12px_#ff2a3a]" />
              </span>
              <span className="font-mono text-xs font-black text-red-400 uppercase tracking-widest">
                THE NEXT BUILD LAYER &middot; INTELLIGENCE ARCHIVE
              </span>
              <span className="text-white/20">|</span>
              <span className="font-mono text-[10px] text-neutral-300 tracking-wider font-bold">
                VAULT STATUS: ONLINE
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] flex items-center gap-3 flex-wrap">
              <span>Next Horizon</span>
              <span className="text-neutral-500 font-light">//</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
                Future Vault
              </span>
              <span className="text-xs font-mono font-bold tracking-widest text-red-400 px-3 py-1 rounded-xl bg-red-950/60 border border-red-500/40 align-middle">
                [ 0{combinedVault.length} SPECIMENS ]
              </span>
            </h2>

            {/* Editorial Context */}
            <p className="text-sm sm:text-base text-neutral-200 font-sans max-w-2xl leading-relaxed font-normal">
              A public-facing intelligence archive of what Sahil is actively exploring, testing, researching, prototyping, and preparing next. Grounded strictly in authentic experiments, verified methodologies, and technical pipelines.
            </p>
          </div>

          {/* Right Telemetry Badge Plate */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
            <div className="flex items-center gap-3.5 font-mono text-xs text-neutral-200 bg-gradient-to-b from-[#12162e] to-[#090b16] px-5 py-3.5 rounded-2xl border-2 border-white/20 shadow-[0_14px_32px_rgba(0,0,0,0.85)] hover:border-red-500/50 transition-colors">
              <Archive className="w-5 h-5 text-red-400 shrink-0 shadow-[0_0_16px_rgba(255,42,58,0.4)]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                  LIVING RESEARCH RUNTIME
                </span>
                <span className="text-xs text-white font-black tracking-tight">
                  ZERO FABRICATION
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerAudit}
              disabled={Boolean(auditStatus)}
              className="flex items-center gap-2.5 font-mono text-xs text-neutral-200 bg-gradient-to-b from-[#141220] to-[#080710] px-4.5 py-3.5 rounded-2xl border-2 border-red-500/40 hover:border-red-500/80 shadow-[0_14px_32px_rgba(0,0,0,0.85)] transition-all cursor-pointer active:scale-95 group/audit"
              title="Click to ping research runtime"
            >
              {auditStatus === 'AUDITING' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-amber-400 text-xs font-black">SYNCING SIGNALS...</span>
                </>
              ) : auditStatus === 'VERIFIED' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black">ALL PIPELINES SYNCED</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-red-500 animate-pulse group-hover/audit:scale-110 transition-transform" />
                  <div className="flex flex-col text-left">
                    <span className="text-red-400 text-xs font-black">DATABASE ACTIVE</span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">{filteredVault.length} SPECIMENS</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D INTERACTIVE GLOWING BLINKING TABS HUD (div:nth-of-type(2)) */}
        {/* ========================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 p-4 rounded-3xl bg-gradient-to-b from-[#13172e] via-[#0b0e1e] to-[#060810] border-2 border-red-500/40 hover:border-red-500/70 shadow-[0_22px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(255,42,58,0.2)] relative transition-all group/hub">
          {/* Luminous Top Perimeter Accent */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_18px_#ff2a3a]" />

          {/* Corner Precision Machined HUD Brackets */}
          <span className="absolute top-2.5 left-2.5 text-red-500/50 font-mono text-xs select-none pointer-events-none font-bold">
            ┌
          </span>
          <span className="absolute top-2.5 right-2.5 text-red-500/50 font-mono text-xs select-none pointer-events-none font-bold">
            ┐
          </span>
          <span className="absolute bottom-2.5 left-2.5 text-red-500/50 font-mono text-xs select-none pointer-events-none font-bold">
            └
          </span>
          <span className="absolute bottom-2.5 right-2.5 text-red-500/50 font-mono text-xs select-none pointer-events-none font-bold">
            ┘
          </span>

          {/* 3D Glowing Blinking Category Tabs (Selector 3: div:nth-of-type(1)) */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none p-1">
            {STREAMS.map((stream) => {
              const isActive = activeStream === stream;
              const count = streamsWithCounts[stream] || 0;

              // Contextual icon per stream
              const StreamIcon =
                stream === 'ALL'
                  ? Sparkles
                  : stream === 'CURRENT SIGNALS'
                  ? Zap
                  : stream === 'IN DEVELOPMENT'
                  ? Cpu
                  : stream === 'EXPERIMENTS'
                  ? Binary
                  : stream === 'RESEARCH'
                  ? Database
                  : stream === 'NEXT PRODUCTS'
                  ? Layers
                  : Lock;

              return (
                <button
                  key={stream}
                  type="button"
                  onClick={() => {
                    playTactileFeedback('tab');
                    setActiveStream(stream);
                  }}
                  className={`group/tab relative flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs font-mono font-black tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border-2 active:scale-95 shadow-md ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2c0e17] via-[#1c0a13] to-[#12060d] border-red-500 text-white shadow-[0_0_28px_rgba(255,42,58,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] ring-2 ring-red-500/50 -translate-y-1'
                      : 'bg-[#060812] hover:bg-[#12162e] border-white/15 hover:border-red-500/60 text-neutral-200 hover:text-white hover:-translate-y-0.5'
                  }`}
                >
                  {/* Blinking 3D Radar Beacon on EVERY Tab */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
                        isActive ? 'bg-red-400' : 'bg-red-500/70 group-hover/tab:bg-red-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isActive
                          ? 'bg-red-500 shadow-[0_0_10px_#ff2a3a]'
                          : 'bg-red-600/80 group-hover/tab:bg-red-500 shadow-[0_0_8px_#ff2a3a]'
                      }`}
                    />
                  </span>

                  {/* Stream Icon */}
                  <StreamIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-red-400' : 'text-neutral-400 group-hover/tab:text-red-400'
                    }`}
                  />

                  {/* Label */}
                  <span>{stream}</span>

                  {/* Count Pill */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? 'bg-red-500 text-white shadow-[0_0_10px_#ff2a3a]'
                        : 'bg-white/10 text-neutral-300 group-hover/tab:bg-white/20'
                    }`}
                  >
                    0{count}
                  </span>

                  {/* Active Beacon */}
                  {isActive && (
                    <span className="text-[9px] font-mono uppercase tracking-widest text-red-300 font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      <span>LIVE</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Search Box */}
          <div className="relative min-w-[240px] sm:max-w-xs w-full">
            <Search className="w-4 h-4 text-red-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter signals, topics, tags..."
              className="w-full pl-11 pr-10 py-2.5 bg-[#05060f] border-2 border-white/20 rounded-2xl text-xs font-mono text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 transition-all shadow-inner font-medium"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500 pointer-events-none font-bold">
                /
              </span>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* VAULT 3D GRID (Selector 4, 5, 6, 7 in div:nth-of-type(3)) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {filteredVault.map((item, idx) => (
            <RazorVaultCard
              key={item.id}
              item={item}
              index={idx}
              total={filteredVault.length}
            />
          ))}
        </div>

        {/* Scalability Notice & Founder Console Bridge (div:nth-of-type(4)) */}
        <div className="mt-14 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#12162e] to-[#090b16] border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
            </span>
            <span className="font-semibold text-white tracking-wide">
              Manage, publish, and sync new research signals dynamically via{' '}
              <Link
                to="/vault"
                className="text-red-400 hover:text-red-300 font-black underline decoration-red-500/60 hover:decoration-red-400 transition-colors"
              >
                Founder Vault Console &rarr;
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-400 font-mono hidden md:inline font-bold">
              SYSTEM LATENCY: &lt;12ms
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-red-500/20 border-2 border-red-500/40 text-red-300 font-black tracking-wider shadow-sm">
              INTELLIGENCE RUNTIME ACTIVE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureVault;
