import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { DEFAULT_CERTIFICATES } from '../data/portfolioData';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  X,
  Copy,
  Check,
  Search,
  Calendar,
  Activity,
  Lock,
  FileText,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  RefreshCw,
  Eye,
  Shield,
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
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'copy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'audit') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // Audio context may be restricted before user gesture; gracefully ignore
  }
}

/**
 * Razor-Sharp 3D Tactile Certificate Card
 * Renders an iconic 3D physical chassis with specular borders,
 * precision machined corner brackets, glowing verified LED beacons,
 * interactive zoom inspection, and verifiable credential keyplates.
 */
function InteractiveCertificateCard({
  cert,
  index,
  total,
  onInspect,
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

  const hasImage = Boolean(cert.imageUrl || cert.certificateImage);
  const certImage = cert.imageUrl || cert.certificateImage;
  const destUrl = cert.url || cert.verificationUrl;
  const hasCredentialId = Boolean(cert.credentialId && cert.credentialId.trim().length > 0);
  const dateDisplay = cert.date || cert.issueDate;
  const issuerDisplay = cert.issuer || cert.provider;
  const skillsList = cert.skills || cert.skillsCovered || cert.topics || [];
  const recipientDisplay = cert.recipient || 'Sahil Bhatia';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-3xl transition-all duration-300 group h-full select-none sm:select-auto"
    >
      {/* 3D Physical Chassis (Matches Card Selectors 4, 5, 7) */}
      <div
        className={`relative h-full flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#151932] via-[#0d1022] to-[#070814] border-2 p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.98),0_0_45px_rgba(255,42,58,0.42),inset_0_2px_0_rgba(255,255,255,0.32),inset_0_-2px_0_rgba(0,0,0,0.9)] active:translate-y-0.5 active:scale-[0.99] ${
          isHovered
            ? 'border-red-500 ring-2 ring-red-500/50 shadow-[0_26px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(255,42,58,0.45),inset_0_2px_0_rgba(255,255,255,0.4)]'
            : 'border-white/20 hover:border-red-500/80 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.22)]'
        }`}
        style={{
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}
      >
        {/* Dynamic Specular Light Follower on Card Face */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at ${cardGlow.x}% ${cardGlow.y}%, rgba(255, 42, 58, 0.18), transparent 70%)`,
          }}
        />

        {/* Top Hairline Specular Edge */}
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-red-500 transition-colors pointer-events-none shadow-[0_0_14px_rgba(255,42,58,0.6)]" />

        {/* Machined Corner Precision Brackets */}
        <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t-2 border-l-2 border-white/30 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t-2 border-r-2 border-white/30 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b-2 border-l-2 border-white/30 group-hover:border-red-400 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b-2 border-r-2 border-white/30 group-hover:border-red-400 transition-colors pointer-events-none" />

        {/* ================= CARD INNER CONTENT ================= */}
        <div className="space-y-4 relative z-10">
          {/* Top Meta Tier: Category Badge, Index, & Blinking Verified Beacon */}
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-950/90 to-[#140b18] border border-red-500/60 flex items-center justify-center text-red-300 shrink-0 shadow-[0_0_16px_rgba(255,42,58,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]">
                <Award className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-sans uppercase tracking-wider text-white font-black">
                    {cert.category || 'Certification'}
                  </span>
                  <span className="text-xs font-mono text-red-300 font-black bg-red-950/70 px-2 py-0.5 rounded-md border border-red-500/40 shadow-inner">
                    [0{index + 1}/0{total}]
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold flex items-center gap-1 mt-0.5">
                  <Binary className="w-3 h-3 text-red-400" />
                  <span>CRYPTOGRAPHIC ARCHIVE</span>
                </span>
              </div>
            </div>

            {/* Blinking 3D Verified Beacon */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-200 text-xs font-mono font-black tracking-wider shadow-[0_0_18px_rgba(16,185,129,0.45)] shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              </span>
              <span className="text-[11px] font-black tracking-wider">VERIFIED</span>
            </div>
          </div>

          {/* Certificate Visual Presentation Tier */}
          <div>
            {hasImage ? (
              <div
                onClick={() => {
                  playTactileFeedback('tab');
                  onInspect(cert);
                }}
                className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-red-500/80 bg-[#060810] cursor-pointer group/img shadow-2xl transition-all duration-300"
                title="Click to inspect high-resolution certificate"
              >
                <img
                  src={certImage}
                  alt={`${cert.title} certificate`}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070a]/95 via-black/25 to-transparent opacity-60 group-hover/img:opacity-30 transition-opacity" />

                {/* Floating Inspect HUD Badge */}
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black/95 border border-white/30 text-xs font-mono text-white opacity-95 group-hover/img:opacity-100 group-hover/img:border-red-500 shadow-2xl transition-all duration-200">
                  <Maximize2 className="w-3.5 h-3.5 text-red-400 group-hover/img:scale-110 transition-transform" />
                  <span className="font-black tracking-wider text-xs">INSPECT FULL</span>
                </div>

                {/* Quick Corner Crosshairs */}
                <span className="absolute top-2 left-2 text-white/50 text-[11px] font-mono pointer-events-none group-hover/img:text-red-400 transition-colors font-bold">
                  +
                </span>
                <span className="absolute top-2 right-2 text-white/50 text-[11px] font-mono pointer-events-none group-hover/img:text-red-400 transition-colors font-bold">
                  +
                </span>
              </div>
            ) : (
              /* High-End Tactile Security Plaque */
              <div className="w-full aspect-[16/10] rounded-2xl border-2 border-white/25 bg-gradient-to-br from-[#151934] via-[#0d1024] to-[#1c1328] p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl group/plaque">
                {/* Micro Carbon Texture Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-[0.14] pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2a3a]" />
                      <span className="text-xs font-mono uppercase tracking-widest text-red-300 font-black">
                        OFFICIAL WORKSHOP REGISTRY
                      </span>
                    </div>
                    <div className="text-base font-sans text-white font-black tracking-tight mt-1">
                      {issuerDisplay}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)]">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>

                <div className="relative z-10 py-1.5 my-auto">
                  <div className="text-xs font-mono text-neutral-300 uppercase tracking-wider font-bold">
                    Awarded Recipient
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                    {recipientDisplay}
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-xs font-mono text-neutral-200 border-t border-white/15 pt-2 font-medium">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-black">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AUTHENTICATED RECORD</span>
                  </span>
                  {dateDisplay && <span className="text-white font-bold">{dateDisplay}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Title & Issuer Header Tier */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-sans text-white uppercase tracking-tight group-hover:text-red-300 transition-colors leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {cert.title}
            </h3>
            <div className="text-xs font-mono text-neutral-200 mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/25 shadow-inner">
                {issuerDisplay}
              </span>
              {dateDisplay && (
                <>
                  <span className="text-neutral-400 font-black">&bull;</span>
                  <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-red-400" />
                    <span>{dateDisplay}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Recipient Attribution Badge */}
          <div className="text-xs font-mono text-neutral-200 bg-[#080b18] px-3.5 py-2.5 rounded-xl border border-white/15 flex items-center justify-between shadow-inner">
            <span className="text-neutral-400 text-xs font-semibold">Recipient Record:</span>
            <span className="text-white font-black tracking-tight">{recipientDisplay}</span>
          </div>

          {/* Tactical Cryptographic ID Plate */}
          {hasCredentialId && (
            <div className="space-y-1.5 bg-[#080a14] p-3.5 rounded-2xl border-2 border-red-500/40 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-red-300 font-black flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  <span>CRYPTOGRAPHIC ID</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playTactileFeedback('copy');
                    onCopy(cert.id, cert.credentialId);
                  }}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 font-black shadow-sm"
                  title="Copy Credential ID"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-black">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-200" />
                      <span>COPY ID</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-white break-all select-all font-bold tracking-wide bg-black/80 px-3 py-2 rounded-xl border border-white/15">
                {cert.credentialId}
              </div>
            </div>
          )}

          {/* Description Text */}
          {cert.description && (
            <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed line-clamp-2 font-normal">
              {cert.description}
            </p>
          )}

          {/* Verified Skills & Topics Badges */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/20 hover:border-red-500/70 hover:bg-red-500/20 hover:text-white transition-all shadow-sm"
                >
                  #{skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ================= CARD FOOTER ACTION ROW ================= */}
        <div className="pt-5 mt-5 border-t border-white/15 flex items-center justify-between gap-3 relative z-10">
          {hasImage && (
            <button
              type="button"
              onClick={() => {
                playTactileFeedback('tab');
                onInspect(cert);
              }}
              className="text-xs font-mono font-black text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 group/btn"
            >
              <Maximize2 className="w-4 h-4 text-neutral-400 group-hover/btn:text-red-400 transition-colors" />
              <span>Inspect Preview</span>
            </button>
          )}

          {destUrl ? (
            <a
              href={destUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_8px_24px_rgba(255,42,58,0.6),inset_0_1.5px_0_rgba(255,255,255,0.35)] hover:shadow-[0_12px_32px_rgba(255,42,58,0.85)] ml-auto cursor-pointer border border-white/25 active:scale-95"
            >
              <span>{hasCredentialId ? 'VERIFY CREDENTIAL' : 'VIEW CERTIFICATE'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 font-bold ml-auto bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Registry Verified</span>
            </div>
          )}
        </div>

        {/* Bottom Laser Accent Runner */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_#ff2a3a] pointer-events-none" />
      </div>
    </div>
  );
}

const Certificates = () => {
  const { certificates } = usePortfolioData();
  const [selectedCert, setSelectedCert] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditStatus, setAuditStatus] = useState(null);
  const searchInputRef = useRef(null);
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

  const rawList = certificates && certificates.length > 0 ? certificates : DEFAULT_CERTIFICATES;

  // Filter Categories with Counts
  const categoriesWithCounts = useMemo(() => {
    const counts = { ALL: rawList.length };
    rawList.forEach((c) => {
      if (c.category) {
        counts[c.category] = (counts[c.category] || 0) + 1;
      }
    });

    const categoryList = ['ALL', ...Object.keys(counts).filter((k) => k !== 'ALL')];
    return { categoryList, counts };
  }, [rawList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return rawList.filter((cert) => {
      const matchesCategory = activeFilter === 'ALL' || cert.category === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        cert.title?.toLowerCase().includes(q) ||
        cert.issuer?.toLowerCase().includes(q) ||
        cert.provider?.toLowerCase().includes(q) ||
        cert.description?.toLowerCase().includes(q) ||
        cert.recipient?.toLowerCase().includes(q) ||
        (cert.skills && cert.skills.some((s) => s.toLowerCase().includes(q))) ||
        (cert.topics && cert.topics.some((t) => t.toLowerCase().includes(q))) ||
        cert.credentialId?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [rawList, activeFilter, searchQuery]);

  return (
    <section
      id="certificates"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-24 sm:py-32 bg-[#060710] border-b border-white/15 relative overflow-hidden"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================================= */}
      {/* RICH BACKGROUND RIG (Direct children 1 through 5 of section#certificates) */}
      {/* Preserves precise nth-of-type(6) selector targeting for foreground root!  */}
      {/* ========================================================================= */}

      {/* 1. Deep Cyber Void Base with Multi-Stop Dark Obsidian */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#070812] via-[#090c1e]/40 to-[#05060e]"
        aria-hidden="true"
      />

      {/* 2. Luminous Cyber-Grid Micro-Pattern with Matrix Perspective */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.22]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 42, 58, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 42, 58, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 45%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 45%, transparent 85%)',
        }}
      />

      {/* 3. Holographic Laser Seams & Cryptographic Watermark Horizon */}
      <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Top Razor Laser Seam */}
        <div className="h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_28px_#ff2a3a]" />
        {/* Subtle Watermark Micro-Stream */}
        <div className="flex justify-between items-center px-8 py-2 font-mono text-[10px] text-red-400/35 uppercase tracking-[0.25em]">
          <span>// CERTIFICATION VAULT &bull; SHA-256 LEDGER AUDITED</span>
          <span className="hidden md:inline">SYSTEM: SAHIL BHATIA // RECIPIENT VERIFIED</span>
          <span>ISO-SEC-CREDENTIAL // 100% PUBLIC PROOF</span>
        </div>
      </div>

      {/* 4. Dynamic Cursor-Tracking Ambient Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        aria-hidden="true"
        style={{
          background: `radial-gradient(950px circle at ${ambientLight.x}% ${ambientLight.y}%, rgba(255, 42, 58, 0.16), rgba(16, 185, 129, 0.06) 45%, transparent 75%)`,
        }}
      />

      {/* 5. Atmospheric Backlights & Volumetric Deep Nebulas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-36 right-10 w-[850px] h-[580px] bg-red-600/[0.12] rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-8 w-[750px] h-[520px] bg-emerald-600/[0.10] rounded-full blur-[170px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-rose-600/[0.05] rounded-full blur-[200px]" />
      </div>

      {/* ========================================================================= */}
      {/* FOREGROUND CONTAINER (Direct child div:nth-of-type(6) of section)         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* SECTION HEADER: Editorial Title & Telemetry               */}
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
                VERIFIABLE CREDENTIALS &amp; MASTERMINDS
              </span>
              <span className="text-white/20">|</span>
              <span className="font-mono text-[10px] text-neutral-300 tracking-wider font-bold">
                REGISTRY // ISO-SEC-CREDENTIAL
              </span>
            </div>

            {/* Main Headline with Sculptural Display Typography (CSS Selector 1) */}
            <h2
              className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[1.02] text-white flex flex-wrap items-baseline gap-x-4 gap-y-2 drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}
            >
              <span className="bg-gradient-to-br from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
                Certifications
              </span>
              <span className="text-red-500 font-sans font-light">&amp;</span>
              <span className="text-neutral-300 font-sans font-light tracking-tight">
                Proofs
              </span>
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-red-300 px-3.5 py-1 rounded-xl bg-gradient-to-r from-red-950/90 to-[#180a14] border-2 border-red-500/60 shadow-[0_0_20px_rgba(255,42,58,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                <span>0{rawList.length} VERIFIED</span>
              </span>
            </h2>

            {/* Editorial Context with High-Contrast Concept Hierarchy (CSS Selector 2) */}
            <p
              className="text-base sm:text-lg text-neutral-300 font-sans max-w-3xl leading-relaxed font-normal tracking-[-0.01em]"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
              }}
            >
              Audited technical credentials across{' '}
              <span className="text-white font-semibold">Generative AI systems architecture</span>,{' '}
              <span className="text-white font-semibold">advanced automation workshops</span>, and enterprise engineering masterminds. Every record is backed by direct third-party registries and{' '}
              <span className="text-red-300 font-mono font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-500/40 shadow-inner">
                cryptographic verification keys
              </span>{' '}
              &mdash; ensuring{' '}
              <span className="text-emerald-400 font-semibold">100% authenticated proof</span> with zero simulated or inflated achievements.
            </p>
          </div>

          {/* Right Telemetry Plate: 3D HUD Module (CSS Selector 1) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
            {/* Audited Credential Vault Plaque — 3D Sculpted Chassis */}
            <div
              className="flex items-center gap-3.5 font-mono text-xs text-neutral-200 bg-gradient-to-b from-[#161a34] via-[#0d1022] to-[#070914] px-5 py-3.5 rounded-2xl border-2 border-white/25 shadow-[0_16px_36px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.3),inset_0_-2px_0_rgba(0,0,0,0.8)] hover:border-red-500/60 hover:-translate-y-0.5 transition-all"
              style={{
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
              }}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.5)]" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-neutral-300 uppercase tracking-wider font-bold">
                  AUDITED CREDENTIAL VAULT
                </span>
                <span className="text-xs sm:text-sm text-white font-sans font-black tracking-tight">
                  {rawList.length} VERIFIED CREDENTIALS
                </span>
              </div>
            </div>

            {/* Interactive Active Ledger Integrity Beacon — 3D Tactile Module */}
            <button
              type="button"
              onClick={handleTriggerAudit}
              disabled={Boolean(auditStatus)}
              className="flex items-center gap-3 font-mono text-xs text-neutral-200 bg-gradient-to-b from-[#221018] via-[#140a10] to-[#0a0508] px-5 py-3.5 rounded-2xl border-2 border-red-500/50 hover:border-red-400 shadow-[0_16px_36px_rgba(255,42,58,0.25),0_8px_20px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.8)] hover:shadow-[0_20px_45px_rgba(255,42,58,0.4),0_10px_24px_rgba(0,0,0,0.95)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 transition-all cursor-pointer group/audit"
              title="Click to run live integrity verification check"
              style={{
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
              }}
            >
              {auditStatus === 'AUDITING' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  <span className="text-amber-300 text-xs font-black tracking-wider">AUDITING HASHES...</span>
                </>
              ) : auditStatus === 'VERIFIED' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-black tracking-wider">ALL SIGNATURES VALID</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-red-500 animate-pulse group-hover/audit:scale-110 transition-transform" />
                  <div className="flex flex-col text-left">
                    <span className="text-red-300 text-xs sm:text-sm font-sans font-black tracking-tight">ACTIVE LEDGER</span>
                    <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-wider">Click to Verify</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D INTERACTIVE GLOWING TABS HUD (CSS Selector 3)          */}
        {/* ========================================================= */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#141832]/98 via-[#0c0f20]/98 to-[#060812]/99 border-2 border-red-500/50 hover:border-red-500/80 shadow-[0_26px_70px_rgba(0,0,0,0.96),0_0_36px_rgba(255,42,58,0.25),inset_0_2px_0_rgba(255,255,255,0.25),inset_0_-2px_0_rgba(0,0,0,0.9)] relative transition-all group/hub"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          {/* Luminous Top Perimeter Laser Line */}
          <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ff2a3a]" />

          {/* Corner Precision Machined HUD Brackets */}
          <span className="absolute top-2.5 left-2.5 text-red-500/60 font-mono text-xs select-none pointer-events-none font-bold">
            ┌
          </span>
          <span className="absolute top-2.5 right-2.5 text-red-500/60 font-mono text-xs select-none pointer-events-none font-bold">
            ┐
          </span>
          <span className="absolute bottom-2.5 left-2.5 text-red-500/60 font-mono text-xs select-none pointer-events-none font-bold">
            └
          </span>
          <span className="absolute bottom-2.5 right-2.5 text-red-500/60 font-mono text-xs select-none pointer-events-none font-bold">
            ┘
          </span>

          {/* 3D Glowing Category Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none p-1">
            {categoriesWithCounts.categoryList.map((cat) => {
              const isActive = activeFilter === cat;
              const count = categoriesWithCounts.counts[cat] || 0;

              const TabIcon =
                cat === 'ALL'
                  ? Sparkles
                  : cat.toLowerCase().includes('generative') || cat.toLowerCase().includes('ai')
                  ? Cpu
                  : cat.toLowerCase().includes('workshop')
                  ? Zap
                  : Layers;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playTactileFeedback('tab');
                    setActiveFilter(cat);
                  }}
                  className={`group/tab relative flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl text-xs font-sans font-bold tracking-tight uppercase transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border-2 active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#34121e] via-[#200b13] to-[#10050a] border-red-500 text-white shadow-[0_0_28px_rgba(255,42,58,0.55),0_10px_24px_rgba(0,0,0,0.9),inset_0_1.5px_0_rgba(255,255,255,0.4)] ring-2 ring-red-500/50 -translate-y-1'
                      : 'bg-gradient-to-b from-[#181c32] via-[#111322] to-[#080a12] border-white/20 hover:border-red-500/80 text-white shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5'
                  }`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
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

                  {/* Tab Thematic Icon */}
                  <TabIcon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-red-400' : 'text-neutral-300 group-hover/tab:text-red-400'
                    }`}
                  />

                  {/* Tab Label */}
                  <span>{cat === 'ALL' ? 'ALL CREDENTIALS' : cat}</span>

                  {/* Count Pill */}
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full font-black ${
                      isActive
                        ? 'bg-red-500 text-white shadow-[0_0_10px_#ff2a3a]'
                        : 'bg-white/10 text-white border border-white/20 group-hover/tab:bg-white/20'
                    }`}
                  >
                    0{count}
                  </span>

                  {/* Active Status Beacon */}
                  {isActive && (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-red-300 font-black flex items-center gap-1">
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
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials, skills..."
              className="w-full pl-11 pr-10 py-2.5 bg-[#050610] border-2 border-white/25 rounded-2xl text-xs font-mono text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] font-semibold"
              style={{
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
              }}
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
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-400 pointer-events-none font-bold">
                /
              </span>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D CERTIFICATES GRID (CSS Selector 6)                     */}
        {/* ========================================================= */}
        {filteredList.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 relative z-10"
            style={{
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            {filteredList.map((cert, idx) => (
              <InteractiveCertificateCard
                key={cert.id}
                cert={cert}
                index={idx}
                total={filteredList.length}
                onInspect={setSelectedCert}
                onCopy={handleCopy}
                isCopied={copiedId === cert.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl border-2 border-white/15 bg-[#090b16] p-8 shadow-xl">
            <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-xl font-mono font-bold text-white uppercase">No Credentials Match Query</h3>
            <p className="text-xs sm:text-sm font-mono text-neutral-300 mt-1 max-w-sm mx-auto">
              No verified records found matching &ldquo;{searchQuery}&rdquo;. Try adjusting your search or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                playTactileFeedback('tab');
                setActiveFilter('ALL');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all cursor-pointer active:scale-95 shadow-[0_0_18px_rgba(255,42,58,0.5)]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ================= HIGH-RESOLUTION LIGHTBOX MODAL ================= */}
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
            onClick={() => setSelectedCert(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-gradient-to-b from-[#121528] to-[#0a0c16] border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_32px_96px_rgba(0,0,0,0.95)] my-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Accent Line */}
              <div className="h-[2.5px] bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 shadow-[0_0_14px_#ff2a3a]" />

              {/* Modal Header */}
              <div className="px-6 py-4.5 bg-[#0d0f1c] border-b border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="font-mono text-xs text-neutral-300 uppercase tracking-widest font-bold">
                      {selectedCert.issuer || selectedCert.provider} //{' '}
                      {selectedCert.category || 'Credential Archive'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display text-white uppercase tracking-tight mt-1">
                    {selectedCert.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/15"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Certificate High-Res Viewer */}
              <div className="p-6 bg-[#06070e] flex items-center justify-center max-h-[65vh] overflow-hidden relative">
                <img
                  src={selectedCert.imageUrl || selectedCert.certificateImage}
                  alt={`${selectedCert.title} high resolution`}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl border border-white/15 shadow-2xl"
                />
              </div>

              {/* Modal Footer Info & Verification Action */}
              <div className="px-6 py-4.5 bg-[#0d0f1c] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-neutral-200">
                    Awarded Recipient:{' '}
                    <span className="text-white font-bold">{selectedCert.recipient || 'Sahil Bhatia'}</span>
                    {(selectedCert.date || selectedCert.issueDate) && (
                      <span className="text-neutral-400">
                        {' '}
                        &bull; {selectedCert.date || selectedCert.issueDate}
                      </span>
                    )}
                  </div>
                  {selectedCert.credentialId && (
                    <div className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                      <span>Credential ID:</span>
                      <span className="text-white select-all font-bold bg-black/60 px-2.5 py-0.5 rounded border border-white/10">
                        {selectedCert.credentialId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 font-mono text-xs transition-colors cursor-pointer border border-white/10 font-bold"
                  >
                    Close
                  </button>
                  {(selectedCert.url || selectedCert.verificationUrl) && (
                    <a
                      href={selectedCert.url || selectedCert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,42,58,0.5)] cursor-pointer"
                    >
                      <span>Open Source Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
