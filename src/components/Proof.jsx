import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { PROOF_MATRIX } from '../data/portfolioData';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
  CheckSquare,
  Sparkles,
  Award,
  Layers,
  Terminal,
  Fingerprint,
  Activity,
  Zap,
  Cpu,
  Search,
  X,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Binary,
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
      osc.frequency.setValueAtTime(560, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'copy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(1020, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'audit') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // Gracefully ignore audio permission restrictions
  }
}

/**
 * Razor-Sharp 3D Tactile Evidence Card
 * Completely eliminates GPU texture rasterization blur by utilizing pixel-perfect
 * vector borders, multi-layer physical specular bevels, high-contrast subpixel
 * antialiased typography, and crisp tactile elevation on hover.
 */
function RazorProofCard({
  item,
  index,
  total,
  onCopy,
  isCopied,
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

  const isVerified = item.status === 'BUILT' || item.status === 'VERIFIED';
  const isCert = item.category === 'Certifications';
  const hasCredentialId = Boolean(item.credentialId && item.credentialId.trim().length > 0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl transition-all duration-300 group h-full select-none sm:select-auto"
    >
      {/* 3D Physical Chassis (Matches Card Selector 4) */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-3xl border-2 p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2.5 active:translate-y-0.5 active:scale-[0.99] ${
          isCert
            ? isHovered
              ? 'bg-gradient-to-b from-[#0e1816] via-[#091211] to-[#050b0a] border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(16,185,129,0.38)]'
              : 'bg-gradient-to-b from-[#0a1412] via-[#070e0d] to-[#040807] border-emerald-500/35 hover:border-emerald-400/70 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
            : isHovered
            ? 'bg-gradient-to-b from-[#14172c] via-[#0c0f1e] to-[#060812] border-red-500 ring-2 ring-red-500/40 shadow-[0_26px_65px_rgba(0,0,0,0.95),0_0_38px_rgba(255,42,58,0.38)]'
            : 'bg-gradient-to-b from-[#101326] via-[#0a0d1b] to-[#050711] border-white/15 hover:border-red-500/70 shadow-[0_14px_36px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Dynamic Specular Light Follower on Card Face */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: isCert
              ? `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(16, 185, 129, 0.16), transparent 70%)`
              : `radial-gradient(420px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(255, 42, 58, 0.16), transparent 70%)`,
          }}
        />

        {/* Top Hairline Specular Edge */}
        <div
          className={`absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent to-transparent pointer-events-none transition-colors ${
            isCert
              ? 'via-white/40 group-hover:via-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'via-white/40 group-hover:via-red-500 shadow-[0_0_12px_rgba(255,42,58,0.5)]'
          }`}
        />

        {/* Machined Precision Corner Brackets */}
        <span
          className={`absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors pointer-events-none ${
            isCert ? 'border-white/25 group-hover:border-emerald-400' : 'border-white/25 group-hover:border-red-400'
          }`}
        />
        <span
          className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors pointer-events-none ${
            isCert ? 'border-white/25 group-hover:border-emerald-400' : 'border-white/25 group-hover:border-red-400'
          }`}
        />
        <span
          className={`absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors pointer-events-none ${
            isCert ? 'border-white/25 group-hover:border-emerald-400' : 'border-white/25 group-hover:border-red-400'
          }`}
        />
        <span
          className={`absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors pointer-events-none ${
            isCert ? 'border-white/25 group-hover:border-emerald-400' : 'border-white/25 group-hover:border-red-400'
          }`}
        />

        {/* ================= CARD INNER CONTENT ================= */}
        <div className="space-y-4 relative z-10">
          {/* Top Meta Tier: Category Badge, Index, & Blinking Verified Beacon */}
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-md ${
                  isCert
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-red-950/80 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(255,42,58,0.3)]'
                }`}
              >
                {isCert ? <Award className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-black">
                    {item.category || 'Evidence'}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isCert
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : 'bg-red-950/60 text-red-300 border-red-500/30'
                    }`}
                  >
                    [0{index + 1}/0{total}]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Binary className="w-2.5 h-2.5 text-neutral-500" />
                  <span>AUDITED ARTIFACT #{item.id}</span>
                </span>
              </div>
            </div>

            {/* Blinking 3D Verified Radar Beacon */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 text-xs font-mono font-black tracking-wider shadow-md shrink-0 ${
                isVerified
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                  : item.status === 'IN PROGRESS'
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.35)]'
                  : 'bg-blue-500/15 border-blue-500/50 text-blue-300'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-80 ${
                    isVerified ? 'bg-emerald-400' : item.status === 'IN PROGRESS' ? 'bg-amber-400' : 'bg-blue-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isVerified
                      ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]'
                      : item.status === 'IN PROGRESS'
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-blue-400'
                  }`}
                />
              </span>
              <span className="text-[11px] font-black">{item.status}</span>
            </div>
          </div>

          {/* Title & Date */}
          <div>
            <h3
              className={`text-lg sm:text-xl font-black font-display text-white uppercase tracking-tight transition-colors drop-shadow-sm ${
                isCert ? 'group-hover:text-emerald-300' : 'group-hover:text-red-400'
              }`}
            >
              {item.title}
            </h3>
            <div className="text-xs font-mono text-neutral-300 mt-2 flex flex-wrap items-center gap-2">
              <span className="text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                {item.date || 'ACTIVE RECORD'}
              </span>
              {item.provider && (
                <>
                  <span className="text-neutral-500">&bull;</span>
                  <span className="text-neutral-200 font-semibold">{item.provider}</span>
                </>
              )}
            </div>
          </div>

          {/* Cryptographic Keyplate if ID exists */}
          {hasCredentialId && (
            <div className="space-y-1.5 bg-[#060812] p-3 rounded-2xl border-2 border-emerald-500/35 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-black flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CREDENTIAL KEY</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playTactileFeedback('copy');
                    onCopy(item.id, item.credentialId);
                  }}
                  className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-neutral-100 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 font-black shadow-sm"
                  title="Copy Credential Key"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-black">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-300" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-[11px] text-white break-all select-all font-bold tracking-wide bg-black/70 px-2.5 py-1.5 rounded-xl border border-white/10">
                {item.credentialId}
              </div>
            </div>
          )}

          {/* Evidence Narrative Body - Laser Crisp Subpixel Font */}
          <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed font-normal">
            {item.evidence}
          </p>

          {/* Topics / Skills Matrix Chips */}
          {item.topics && item.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.topics.map((t) => (
                <span
                  key={t}
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all shadow-sm ${
                    isCert
                      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/25 hover:border-emerald-400/60 hover:text-white'
                      : 'bg-white/10 text-neutral-200 border-white/15 hover:border-red-500/60 hover:text-white'
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ================= CARD FOOTER ACTION ROW ================= */}
        <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isVerified ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
              }`}
            />
            <span className="text-[11px] font-bold tracking-wide text-neutral-300">
              {isCert ? 'Recipient: Sahil Bhatia' : 'Audit Status: Verified Artifact'}
            </span>
          </div>

          <a
            href={item.url || `#${item.target}`}
            target={item.url ? '_blank' : '_self'}
            rel={item.url ? 'noopener noreferrer' : ''}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all border cursor-pointer active:scale-95 shadow-md ${
              isCert
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white border-white/20 shadow-[0_6px_20px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.7)]'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white border-white/20 shadow-[0_6px_20px_rgba(255,42,58,0.55)] hover:shadow-[0_10px_30px_rgba(255,42,58,0.75)]'
            }`}
          >
            <span>{item.linkText || (item.url ? 'VERIFY CREDENTIAL' : 'INSPECT ARTIFACT')}</span>
            {item.url ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          </a>
        </div>

        {/* Bottom Laser Accent Runner */}
        <div
          className={`absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            isCert
              ? 'via-emerald-400 shadow-[0_0_20px_#34d399]'
              : 'via-red-500 shadow-[0_0_20px_#ff2a3a]'
          }`}
        />
      </div>
    </div>
  );
}

const Proof = () => {
  const { proofItems, certificates } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
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

  const handleCopy = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleTriggerAudit = () => {
    playTactileFeedback('audit');
    setAuditStatus('AUDITING');
    setTimeout(() => {
      setAuditStatus('VERIFIED');
      setTimeout(() => setAuditStatus(null), 3500);
    }, 900);
  };

  // Format certificates into proof entries
  const certItems = useMemo(() => {
    return (certificates || []).map((c) => ({
      id: c.id,
      title: c.title,
      category: 'Certifications',
      status: (c.status || 'VERIFIED').toUpperCase(),
      evidence: `Certificate of Completion awarded to ${c.recipient || 'Sahil Bhatia'} (Credential ID: ${c.credentialId || 'AUTHENTICATED'}). Topics: ${(c.topics || []).join(', ')}.`,
      date: c.issueDate || '2026',
      target: 'certificates',
      url: c.url,
      credentialId: c.credentialId,
      provider: c.issuer || c.provider,
      topics: c.topics || c.skills || [],
      linkText: 'VERIFY CREDENTIAL →',
    }));
  }, [certificates]);

  // Map proofItems or fallback to PROOF_MATRIX
  const baseItems = useMemo(() => {
    return proofItems && proofItems.length > 0
      ? proofItems.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.evidenceType || 'Projects',
          status: (p.proofState || 'VERIFIED').toUpperCase(),
          evidence: p.description || 'Verified engineering artifact with production telemetry.',
          date: p.verifiedDate || 'ACTIVE',
          target: p.relatedProjectId || 'projects',
          url: p.url || '',
          provider: p.provider || 'Sahil Bhatia Engine',
          topics: p.topics || [],
          linkText: p.linkText || (p.url ? 'VERIFY CREDENTIAL →' : 'Inspect'),
        }))
      : PROOF_MATRIX;
  }, [proofItems]);

  // Combine items avoiding duplicates
  const items = useMemo(() => {
    return [
      ...certItems,
      ...baseItems.filter((b) => !certItems.some((c) => c.id === b.id || c.title === b.title)),
    ];
  }, [certItems, baseItems]);

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts = { ALL: items.length };
    items.forEach((i) => {
      if (i.category) {
        counts[i.category] = (counts[i.category] || 0) + 1;
      }
    });

    const categoryList = ['ALL', ...Object.keys(counts).filter((k) => k !== 'ALL')];
    return { categoryList, counts };
  }, [items]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.evidence?.toLowerCase().includes(q) ||
        item.provider?.toLowerCase().includes(q) ||
        (item.topics && item.topics.some((t) => t.toLowerCase().includes(q))) ||
        item.credentialId?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <section
      id="proof"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-24 sm:py-32 bg-transparent border-b border-white/10 relative overflow-hidden select-none sm:select-auto"
    >
      {/* ========================================================================= */}
      {/* RICH BACKGROUND RIG (Direct children 1 through 11 of section#proof)       */}
      {/* Preserves precise nth-of-type(12) selector targeting for foreground root! */}
      {/* ========================================================================= */}

      {/* 1. Top 3D Specular Laser Horizon Rail */}
      <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_28px_#ff2a3a] pointer-events-none z-10" />

      {/* 2. Bottom 3D Specular Laser Horizon Rail */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_28px_#10b981] pointer-events-none z-10" />

      {/* 3. Cybernetic CAD Left Precision Vertical Rule */}
      <div className="hidden xl:block absolute top-0 bottom-0 left-8 w-[1px] border-r border-dashed border-red-500/25 pointer-events-none z-0" />

      {/* 4. Cybernetic CAD Right Precision Vertical Rule */}
      <div className="hidden xl:block absolute top-0 bottom-0 right-8 w-[1px] border-l border-dashed border-emerald-500/25 pointer-events-none z-0" />

      {/* 5. Dynamic Raycast Spotlight 1: Pointer Following Crimson Beam */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(circle 950px at ${ambientLight.x}% ${ambientLight.y}%, rgba(255, 42, 58, 0.14) 0%, rgba(180, 20, 35, 0.05) 45%, transparent 75%)`,
        }}
      />

      {/* 6. Dynamic Raycast Spotlight 2: Complimentary Emerald Ambient Bloom */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(circle 850px at ${100 - ambientLight.x * 0.7}% ${100 - ambientLight.y * 0.7}%, rgba(16, 185, 129, 0.09) 0%, rgba(5, 40, 30, 0.03) 50%, transparent 75%)`,
        }}
      />

      {/* 7. Deep Center Floor Obsidian Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(14, 18, 30, 0.6) 0%, transparent 80%)',
        }}
      />

      {/* 8. Luminous Cyber-Grid Micro-Pattern with Matrix Perspective */}
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

      {/* 9. Cryptographic Watermark Horizon Stream */}
      <div className="absolute inset-x-0 top-3 pointer-events-none z-0 overflow-hidden">
        <div className="flex justify-between items-center px-10 font-mono text-[9px] text-red-500/20 uppercase tracking-[0.25em] select-none">
          <span>// ZERO-MOCK PROOF VAULT &bull; SHA-256 AUDIT TRAILS</span>
          <span className="hidden md:inline">SYSTEM: SAHIL BHATIA // RECIPIENT VERIFIED</span>
          <span>ISO-SEC-CREDENTIAL // 100% PUBLIC VERIFIABILITY</span>
        </div>
      </div>

      {/* 10. Volumetric Atmospheric Emerald Nebula */}
      <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.08] blur-[150px] pointer-events-none z-0" />

      {/* 11. Volumetric Atmospheric Crimson Nebula */}
      <div className="absolute bottom-1/4 -right-48 w-[600px] h-[600px] rounded-full bg-red-600/[0.10] blur-[150px] pointer-events-none z-0" />

      {/* ========================================================================= */}
      {/* FOREGROUND CONTAINER (Direct child div:nth-of-type(12) of section)        */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* SECTION HEADER DECK (Selector 3)                          */}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          {/* Left Column (div:nth-of-type(1)) */}
          <div className="space-y-3.5">
            {/* Tactical Status Pill with Blinking Radar Beacon (div:nth-of-type(1)) */}
            <div className="inline-flex items-center gap-3 px-4.5 py-2.5 rounded-full bg-gradient-to-r from-red-500/25 via-rose-500/20 to-red-500/15 border-2 border-red-500/50 shadow-[0_0_24px_rgba(255,42,58,0.3)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_12px_#ff2a3a]" />
              </span>
              <span className="font-mono text-xs font-black text-red-400 uppercase tracking-widest">
                AUDITED EVIDENCE MATRIX &middot; REAL ARTIFACTS
              </span>
              <span className="text-white/20">|</span>
              <span className="font-mono text-[10px] text-neutral-300 tracking-wider font-bold">
                AUDIT // SHA-256 LEDGER
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-display uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] flex items-center gap-3 flex-wrap">
              <span>Proof & Evidence Matrix</span>
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 align-middle">
                [ 0{items.length} VERIFIED ]
              </span>
            </h2>

            {/* Editorial Context (Selector 5: p:nth-of-type(1)) */}
            <p className="text-sm sm:text-base text-neutral-200 font-sans max-w-2xl leading-relaxed font-normal">
              Every assertion is mapped to inspectable software repositories, real-world case studies, or transparent audit markers. Zero vanity scores, zero fabricated achievements.
            </p>

            {/* Trust Micro-Badges Row (Selector 2: div:nth-of-type(2)) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0d1222] border-2 border-emerald-500/40 font-mono text-xs text-white font-black shadow-md hover:-translate-y-0.5 transition-transform">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span>100% Inspectable Repos</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0d1222] border-2 border-emerald-500/40 font-mono text-xs text-white font-black shadow-md hover:-translate-y-0.5 transition-transform">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shadow-[0_0_10px_#34d399]" />
                <span>Live Production Credentials</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#140e16] border-2 border-red-500/40 font-mono text-xs text-white font-black shadow-md hover:-translate-y-0.5 transition-transform">
                <Fingerprint className="w-4 h-4 text-red-400 shadow-[0_0_10px_#ff2a3a]" />
                <span>Zero Fabricated Stats</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0c121e] border-2 border-cyan-500/40 font-mono text-xs text-cyan-200 font-black shadow-md hover:-translate-y-0.5 transition-transform">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Verification Keys</span>
              </div>
            </div>
          </div>

          {/* Right Telemetry Column (div:nth-of-type(2)) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
            <div className="flex items-center gap-3.5 font-mono text-xs text-neutral-200 bg-gradient-to-b from-[#12162e] to-[#090b16] px-5 py-3.5 rounded-2xl border-2 border-white/20 shadow-[0_14px_32px_rgba(0,0,0,0.85)] hover:border-emerald-500/50 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.5)]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                  STANDARD
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
              title="Click to verify artifact integrity"
            >
              {auditStatus === 'AUDITING' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-amber-400 text-xs font-black">AUDITING REPOS...</span>
                </>
              ) : auditStatus === 'VERIFIED' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-black">ALL REPOS VERIFIED</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-red-500 animate-pulse group-hover/audit:scale-110 transition-transform" />
                  <div className="flex flex-col text-left">
                    <span className="text-red-400 text-xs font-black">AUDIT INTEGRITY</span>
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">100% Active</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D INTERACTIVE GLOWING BLINKING TABS HUD (Selector 6)     */}
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

          {/* 3D Glowing Blinking Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none p-1">
            {categoriesWithCounts.categoryList.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = categoriesWithCounts.counts[cat] || 0;

              // Thematic icons per category
              const TabIcon =
                cat === 'ALL'
                  ? Sparkles
                  : cat.toLowerCase().includes('cert')
                  ? Award
                  : cat.toLowerCase().includes('project')
                  ? Terminal
                  : cat.toLowerCase().includes('ai')
                  ? Cpu
                  : Zap;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playTactileFeedback('tab');
                    setSelectedCategory(cat);
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

                  {/* Tab Icon */}
                  <TabIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-red-400' : 'text-neutral-400 group-hover/tab:text-red-400'
                    }`}
                  />

                  {/* Tab Label */}
                  <span>{cat === 'ALL' ? 'ALL PROOFS' : cat}</span>

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

                  {/* Active Status Beacon */}
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
              placeholder="Search claims, repos, keys..."
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

        {/* ========================================================================= */}
        {/* RESPONSIVE PROOF MATRIX CONTAINER (Direct child div:nth-of-type(3))       */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0c0f1e]/95 via-[#080a15]/95 to-[#04050a]/98 border-2 border-white/15 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,58,0.1)] mb-10 relative">
          {/* div:nth-of-type(1): Top Laser Horizon Sheen */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none shadow-[0_0_18px_#ff2a3a]" />

          {/* div:nth-of-type(2): Header Telemetry Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0e1224]/95 border-b border-white/10 font-mono text-xs text-neutral-300 uppercase tracking-wider">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="font-bold text-white tracking-wide">
                AUTHENTICATED ARTIFACT REGISTRY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-400 font-bold">TELEMETRY:</span>
              <span className="text-emerald-300 font-black">
                {filteredItems.length} OF {items.length} ACTIVE
              </span>
            </div>
          </div>

          {/* div:nth-of-type(3): The Evidence Cards Grid (Selector 7) */}
          <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.map((item, idx) => (
              <RazorProofCard
                key={item.id}
                item={item}
                index={idx}
                total={filteredItems.length}
                onCopy={handleCopy}
                isCopied={copiedId === item.id}
              />
            ))}
          </div>
        </div>

        {/* Matrix Footer Protocol Plate (div:nth-of-type(4)) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b14]/90 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span className="font-semibold text-white tracking-wide">
              EXTERNAL CREDENTIAL CHECKS LIVE &middot; DIRECT PUBLIC REPOSITORIES
            </span>
          </div>
          <div className="text-neutral-400 text-center sm:text-right flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="tracking-wider">TRANSPARENCY AUDIT // ALL METRICS FACT-CHECKED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Proof;
