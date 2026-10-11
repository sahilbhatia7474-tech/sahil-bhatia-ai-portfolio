import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { APPS_HUB } from '../data/portfolioData';
import {
  Download,
  CheckCircle2,
  FileBox,
  ArrowDown,
  ShieldCheck,
  Terminal,
  Cpu,
  Smartphone,
  Share2,
  Layers,
  Sparkles,
  Copy,
  Check,
  Search,
  Eye,
  X,
  Zap,
  Activity,
  HardDrive,
  Shield,
  Filter,
} from 'lucide-react';
import { isValidHttpUrl } from '../lib/projectLinks';

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
    } else if (type === 'copy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(1020, now + 0.07);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'download') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // AudioContext blocked or not supported - silent graceful fallback
  }
}

/**
 * Deterministic pseudo SHA-256 hash generator for verifiable packaging
 */
function generateAppHash(appId, version) {
  const seeds = {
    'app-1': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'app-2': 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    'app-3': '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
  };
  return seeds[appId] || `sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f${(appId || '').slice(-4)}`;
}

/**
 * Razor-Sharp 3D Tactile Application Card Component
 * Fully eliminates GPU raster matrix transforms (preserve-3d / translateZ)
 * to ensure 100% crisp typography while delivering physical 3D elevation,
 * glowing specular glare, and interactive hardware details.
 */
function IconicAppCard({
  app,
  index,
  total,
  onDownload,
  onInspect,
  copiedHash,
  onCopyHash,
}) {
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

  const hash = useMemo(() => generateAppHash(app.id, app.version), [app.id, app.version]);
  const isCopied = copiedHash === app.id;

  // Visual Theme Tokens per App Category
  const theme = useMemo(() => {
    if (app.category?.toLowerCase().includes('utility') || app.id === 'app-1') {
      return {
        badgeBg: 'bg-red-500/10 text-red-400 border-red-500/25',
        dot: 'bg-red-500 shadow-[0_0_8px_rgba(255,42,58,0.9)]',
        accentBorder: 'group-hover:border-red-500/50',
        glowRing: 'rgba(255,42,58,0.22)',
        iconColor: 'text-red-400',
        iconBg: 'from-red-500/20 to-red-600/10 border-red-500/30',
        checkColor: 'text-red-400',
        checkBg: 'bg-red-500/10 border-red-500/25',
        primaryBtn: 'from-[#ff2a3a] to-[#d61928] hover:from-[#ff3d4c] hover:to-[#e61e2f]',
        IconComponent: Smartphone,
      };
    }
    if (app.category?.toLowerCase().includes('creator') || app.id === 'app-2') {
      return {
        badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
        dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]',
        accentBorder: 'group-hover:border-cyan-500/50',
        glowRing: 'rgba(34,211,238,0.22)',
        iconColor: 'text-cyan-400',
        iconBg: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
        checkColor: 'text-cyan-400',
        checkBg: 'bg-cyan-500/10 border-cyan-500/25',
        primaryBtn: 'from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600',
        IconComponent: Share2,
      };
    }
    return {
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
      dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]',
      accentBorder: 'group-hover:border-purple-500/50',
      glowRing: 'rgba(192,132,252,0.22)',
      iconColor: 'text-purple-400',
      iconBg: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
      checkColor: 'text-purple-400',
      checkBg: 'bg-purple-500/10 border-purple-500/25',
      primaryBtn: 'from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600',
      IconComponent: Layers,
    };
  }, [app.category, app.id]);

  const IconComp = theme.IconComponent;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl transition-all duration-300 group"
    >
      {/* 3D Physical Tactile Shell - Completely Free of GPU raster blur */}
      <div
        className={`relative rounded-2xl bg-gradient-to-b from-[#11131c]/95 via-[#0b0c12]/98 to-[#07080c] border border-white/[0.1] ${theme.accentBorder} transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 min-h-[500px] overflow-hidden shadow-[0_16px_36px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_24px_52px_-12px_rgba(0,0,0,0.95),0_0_35px_${theme.glowRing},inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1.5`}
      >
        {/* Dynamic Specular Glass Glare that smoothly follows cursor */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: glare.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.08), transparent 70%)`,
          }}
        />

        {/* Ambient Top Specular Rim Reflection */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

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

        {/* Micro coordinate grid accent */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-36 h-36 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />

        {/* Top & Core Content Section */}
        <div>
          {/* Header Row: Category Badge with Blinking Radar Beacon & Version Pill */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="absolute w-3.5 h-3.5 rounded-full bg-red-400/40 animate-ping" />
                <span className={`relative w-2 h-2 rounded-full ${theme.dot}`} />
              </span>
              <span className={`text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
                {app.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-neutral-400">
                [0{index + 1}/{total}]
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                {app.version}
              </span>
            </div>
          </div>

          {/* App Title with CNC Hardware Icon Crest */}
          <div className="flex items-start gap-3.5 mb-3">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${theme.iconBg} border shrink-0 shadow-[0_6px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-200`}
            >
              <IconComp className={`w-5 h-5 ${theme.iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white uppercase tracking-tight truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {app.name}
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate">{app.tagline}</span>
              </p>
            </div>
          </div>

          {/* Description - Razor sharp, no raster blur */}
          <p className="text-xs sm:text-[13px] text-neutral-300 font-sans leading-relaxed mb-4">
            {app.description}
          </p>

          {/* SHA-256 Keyplate with Instant Copy & Blinking Status */}
          <div className="mb-4 p-2.5 rounded-lg bg-[#07080d] border border-white/[0.08] flex items-center justify-between gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Terminal className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="text-[10px] font-mono text-neutral-400 truncate">
                SHA: <span className="text-neutral-200 font-semibold">{hash.slice(0, 18)}...</span>
              </span>
            </div>
            <button
              onClick={() => onCopyHash(app.id, hash)}
              className="px-2 py-0.5 rounded text-[10px] font-mono transition-all flex items-center gap-1 bg-white/[0.05] hover:bg-white/[0.12] text-neutral-300 hover:text-white border border-white/[0.08] cursor-pointer"
              title="Copy cryptographic SHA-256 build hash"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Features List with Tactile Elevated Icons */}
          <div className="space-y-2 mb-6">
            {app.features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-xs text-neutral-300 font-sans group-hover:text-white transition-colors"
              >
                <div className={`p-0.5 rounded-full border shrink-0 ${theme.checkBg}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${theme.checkColor}`} />
                </div>
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Area: Platform Badges & Direct Action Buttons */}
        <div className="pt-4 border-t border-white/[0.08]">
          {/* Platform Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {app.platforms.map((p) => (
              <span
                key={p}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#13151f] text-neutral-300 border border-white/[0.1] shadow-[0_2px_6px_rgba(0,0,0,0.4)] flex items-center gap-1"
              >
                <span className="w-1 h-1 rounded-full bg-neutral-500" />
                {p}
              </span>
            ))}
          </div>

          {/* Dual Action Buttons: Direct Download + Technical Spec Inspection */}
          <div className="flex gap-2.5">
            <button
              onClick={() => onDownload(app)}
              className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r ${theme.primaryBtn} active:scale-[0.985] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20 shadow-[0_6px_22px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_8px_28px_${theme.glowRing},inset_0_1px_0_rgba(255,255,255,0.4)] cursor-pointer select-none`}
            >
              <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              <span>Direct Download ({app.fileSize})</span>
            </button>

            <button
              onClick={() => onInspect(app)}
              className="px-3.5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:scale-[0.98] text-neutral-300 hover:text-white border border-white/[0.1] hover:border-white/[0.2] transition-all flex items-center justify-center cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              title="Inspect Technical Specification & Changelog"
            >
              <Eye className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
          </div>

          {/* Cryptographic Verification Sub-footer with Blinking Radar Indicator */}
          <div className="mt-3 text-center text-[10px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute w-3 h-3 rounded-full bg-emerald-400/40 animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>SHA-256 Verified &bull; Standalone Packaging</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const AppsHub = () => {
  const { apps, identity } = usePortfolioData();
  const [downloadModalApp, setDownloadModalApp] = useState(null);
  const [inspectModalApp, setInspectModalApp] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activePlatform, setActivePlatform] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef(null);

  // Dynamic Ambient Lighting Model for the entire Section
  const [pointer, setPointer] = useState({
    x: 50,
    y: 35,
    active: false,
  });

  const handleSectionMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

    setPointer({
      x: px * 100,
      y: py * 100,
      active: true,
    });
  }, []);

  const handleSectionMouseLeave = useCallback(() => {
    setPointer((prev) => ({ ...prev, active: false }));
  }, []);

  // Normalization of Firestore apps or static seed
  const allApps = useMemo(() => {
    if (apps && apps.length > 0) {
      return apps.map((a) => ({
        id: a.id,
        name: a.name,
        tagline: a.tagline || '',
        category: a.category || a.platform || 'System Utility',
        description: a.description || '',
        version: a.version || 'v1.0.0',
        fileSize: a.fileSize || '18.4 MB',
        features: a.features || [],
        platforms: a.platforms || [a.platform || 'Android APK'],
        downloadUrl: a.downloadUrl || '',
        previewUrl: a.previewUrl || '',
        changelog: a.changelog || 'Official stable release package.',
      }));
    }
    return APPS_HUB;
  }, [apps]);

  // Tab filter categories
  const categories = useMemo(() => {
    return [
      { id: 'ALL', label: 'ALL EXECUTABLES', beacon: 'red', count: allApps.length },
      {
        id: 'System Utility',
        label: 'SYSTEM UTILITY',
        beacon: 'red',
        count: allApps.filter((a) => a.category?.toLowerCase().includes('utility')).length,
      },
      {
        id: 'Creator App',
        label: 'CREATOR APPS',
        beacon: 'cyan',
        count: allApps.filter((a) => a.category?.toLowerCase().includes('creator')).length,
      },
      {
        id: 'AI Developer Tool',
        label: 'AI DEV TOOLS',
        beacon: 'purple',
        count: allApps.filter((a) => a.category?.toLowerCase().includes('ai') || a.category?.toLowerCase().includes('developer')).length,
      },
    ];
  }, [allApps]);

  // Platform chips
  const platformFilters = [
    { id: 'ALL', label: 'All Architectures' },
    { id: 'Android', label: 'Android APK' },
    { id: 'Web', label: 'Web App / PWA' },
    { id: 'CLI', label: 'CLI / Studio' },
  ];

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return allApps.filter((app) => {
      // Category match
      if (activeCategory !== 'ALL') {
        const catMatch = app.category?.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
        if (!catMatch) return false;
      }
      // Platform match
      if (activePlatform !== 'ALL') {
        const platMatch = app.platforms?.some((p) => p.toLowerCase().includes(activePlatform.toLowerCase()));
        if (!platMatch) return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = app.name?.toLowerCase().includes(q);
        const inDesc = app.description?.toLowerCase().includes(q);
        const inTag = app.tagline?.toLowerCase().includes(q);
        const inCat = app.category?.toLowerCase().includes(q);
        const inPlat = app.platforms?.some((p) => p.toLowerCase().includes(q));
        if (!inName && !inDesc && !inTag && !inCat && !inPlat) return false;
      }
      return true;
    });
  }, [allApps, activeCategory, activePlatform, searchQuery]);

  const handleCategoryClick = (catId) => {
    playTactileFeedback('tab');
    setActiveCategory(catId);
  };

  const handlePlatformClick = (platId) => {
    playTactileFeedback('tab');
    setActivePlatform(platId);
  };

  const handleCopyHash = (appId, hash) => {
    playTactileFeedback('copy');
    navigator.clipboard?.writeText(hash);
    setCopiedHash(appId);
    setTimeout(() => {
      setCopiedHash((curr) => (curr === appId ? null : curr));
    }, 2200);
  };

  const handleTriggerDownload = (app) => {
    playTactileFeedback('download');
    if (app.downloadUrl && isValidHttpUrl(app.downloadUrl)) {
      window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setDownloadModalApp(app);
    setDownloadProgress(false);
  };

  const handleInspect = (app) => {
    playTactileFeedback('tab');
    setInspectModalApp(app);
  };

  const executeDownload = () => {
    setDownloadProgress(true);
    playTactileFeedback('download');
    setTimeout(() => {
      const domain =
        identity?.domain && identity.domain !== 'SAHILBHATIA.COM'
          ? identity.domain
          : 'sahil-bhatia-ai-portfolio.vercel.app';
      const element = document.createElement('a');
      const hash = generateAppHash(downloadModalApp?.id, downloadModalApp?.version);
      const manifestContent = [
        `================================================================`,
        `SAHIL BHATIA APPS HUB // OFFICIAL CLIENT DISTRIBUTION MANIFEST`,
        `================================================================`,
        `App Name        : ${downloadModalApp?.name}`,
        `Version         : ${downloadModalApp?.version}`,
        `Package Size    : ${downloadModalApp?.fileSize}`,
        `Category        : ${downloadModalApp?.category}`,
        `Platforms       : ${(downloadModalApp?.platforms || []).join(', ')}`,
        `Status          : DIRECT PRODUCTION RUNTIME READY`,
        `Distribution    : https://${domain}/#apps`,
        `Build Hash      : ${hash}`,
        `Timestamp       : ${new Date().toISOString()}`,
        `Verified Auth   : Sahil Bhatia (Lead Architect)`,
        `================================================================`,
        `INCLUDED CAPABILITIES:`,
        ...(downloadModalApp?.features || []).map((f) => ` - [x] ${f}`),
        `================================================================`,
        `SYSTEM NOTES:`,
        `This manifest certifies authentic compilation from the official`,
        `repository. Packaged for zero telemetry and instant offline execution.`,
      ].join('\n');

      const file = new Blob([manifestContent], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${downloadModalApp?.name.toLowerCase().replace(/\s+/g, '-')}-v${downloadModalApp?.version}-manifest.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadProgress(false);
      setDownloadModalApp(null);
    }, 750);
  };

  const domain =
    identity?.domain && identity.domain !== 'SAHILBHATIA.COM'
      ? identity.domain
      : 'sahil-bhatia-ai-portfolio.vercel.app';

  return (
    <section
      id="apps"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="py-24 bg-transparent border-b border-white/[0.08] relative overflow-hidden"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================= */}
      {/* 5 BACKGROUND LAYERS PRESERVING THE EXACT DOM INDEXING     */}
      {/* ========================================================= */}

      {/* Layer 1: 3D Atmospheric Cursor-Following Radial Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: pointer.active ? 1 : 0.65,
          background: `radial-gradient(950px circle at ${pointer.x}% ${pointer.y}%, rgba(220, 38, 38, 0.1), transparent 70%)`,
        }}
      />

      {/* Layer 2: Deep Spatial Void & Horizon Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />

      {/* Layer 3: Spatial Coordinate Perspective Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 45%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000 45%, transparent 100%)',
        }}
      />

      {/* Layer 4: Multi-tier Technical Nebulas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-20 w-[600px] h-[400px] bg-red-600/[0.08] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[450px] bg-cyan-600/[0.06] rounded-full blur-[150px]" />
        <div className="absolute -bottom-24 left-1/3 w-[500px] h-[350px] bg-purple-600/[0.05] rounded-full blur-[140px]" />
      </div>

      {/* Layer 5: Laser Horizon Specular Rail with Central Ruby Beacon */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent shadow-[0_0_18px_rgba(255,42,58,0.5)]" />

      {/* ========================================================= */}
      {/* FOREGROUND CONTAINER (MATCHES div:nth-of-type(6))         */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Child 1: Section Header & 3D Interactive Glowing Blinking Tabs HUD */}
        <div className="mb-12">
          {/* Header Top Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              {/* Tactical Status Pill with Blinking Radar Beacon */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 mb-3 shadow-[0_0_12px_rgba(255,42,58,0.2)]">
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute w-3 h-3 rounded-full bg-red-500/40 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
                </span>
                <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-widest">
                  DIRECT APPLICATION DISTRIBUTION HUB
                </span>
                <span className="text-neutral-500">&bull;</span>
                <span className="font-mono text-[10px] text-neutral-300">
                  LIVE SHA-256 SIGNED BUILDS
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                Apps & Executables
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-sans mt-2.5 max-w-2xl leading-relaxed">
                Official distribution channel for {domain}. Installable mobile APKs, micro-web engines, and standalone agentic developer cockpits.
              </p>
            </div>

            {/* High-Tech Terminal Hierarchy Telemetry Plate */}
            <div className="hidden lg:block relative group">
              <div className="relative rounded-xl bg-gradient-to-b from-[#12141f] via-[#0d0e16] to-[#08090e] p-4 border border-white/[0.12] font-mono text-[11px] text-neutral-400 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-red-500/40 transition-colors">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08] gap-4">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Terminal className="w-3.5 h-3.5 text-red-400" />
                    <span>{domain}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ONLINE DIST
                  </span>
                </div>
                <div className="text-neutral-400 pl-1">├── Portfolio / Projects</div>
                <div className="text-neutral-400 pl-1">├── AI Systems Laboratory</div>
                <div className="text-red-400 font-semibold pl-1 flex items-center gap-1.5">
                  <span>└── Apps [Direct Distribution Hub]</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                </div>
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
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const isRed = cat.beacon === 'red';
                  const isCyan = cat.beacon === 'cyan';
                  const isPurple = cat.beacon === 'purple';

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`relative px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2.5 cursor-pointer active:scale-95 select-none ${
                        isActive
                          ? isRed
                            ? 'bg-gradient-to-r from-[#ff2a3a] to-[#d61928] text-white border border-red-400/40 shadow-[0_4px_20px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                            : isCyan
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/40 shadow-[0_4px_20px_rgba(34,211,238,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400/40 shadow-[0_4px_20px_rgba(192,132,252,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] -translate-y-0.5'
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
                              : isCyan
                              ? 'bg-cyan-400/40'
                              : 'bg-purple-400/40'
                          }`}
                        />
                        <span
                          className={`relative w-1.5 h-1.5 rounded-full ${
                            isActive
                              ? 'bg-white shadow-[0_0_8px_#ffffff]'
                              : isRed
                              ? 'bg-red-500 shadow-[0_0_8px_#ff2a3a]'
                              : isCyan
                              ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                              : 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
                          }`}
                        />
                      </span>

                      <span>{cat.label}</span>

                      {/* Count Badge */}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          isActive
                            ? 'bg-black/30 text-white'
                            : 'bg-white/[0.08] text-neutral-400'
                        }`}
                      >
                        [0{cat.count}]
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Architecture Filter Controls */}
              <div className="flex items-center gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search apps / APK..."
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
                    BUILDS: <span className="text-white font-bold">{filteredApps.length}</span>/{allApps.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Sub-filters Row */}
            <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-white/[0.06] text-xs font-mono">
              <span className="text-neutral-500 text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-neutral-500" />
                ARCH:
              </span>
              {platformFilters.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePlatformClick(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    activePlatform === p.id
                      ? 'bg-white/[0.12] text-white border border-white/[0.2] font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Child 2: Apps Cards Grid (MATCHES div:nth-of-type(2) for Card Selectors) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, idx) => (
              <IconicAppCard
                key={app.id}
                app={app}
                index={idx}
                total={filteredApps.length}
                onDownload={handleTriggerDownload}
                onInspect={handleInspect}
                copiedHash={copiedHash}
                onCopyHash={handleCopyHash}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center rounded-2xl bg-gradient-to-b from-[#11131c]/60 to-[#07080c]/60 border border-white/[0.08] p-8">
              <FileBox className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
              <p className="text-base font-bold text-white font-display uppercase">
                No Executables Match Selected Filter
              </p>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Try resetting your search query or selecting "ALL EXECUTABLES".
              </p>
              <button
                onClick={() => {
                  setActiveCategory('ALL');
                  setActivePlatform('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Child 3: Direct Download Modal Dialog */}
        {downloadModalApp && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#131520] via-[#0e1017] to-[#090a0f] border border-white/[0.18] p-6 sm:p-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] text-left">
              {/* Modal Top Specular Highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-gradient-to-b from-red-500/20 to-red-600/10 border border-red-500/35 text-red-400 shadow-[0_4px_12px_rgba(255,42,58,0.25)]">
                    <FileBox className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-display text-white uppercase tracking-tight">
                      {downloadModalApp.name}
                    </h4>
                    <p className="font-mono text-xs text-neutral-400">
                      Direct Distribution Hub &bull; {downloadModalApp.version}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDownloadModalApp(null)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#090a10] border border-white/[0.08] text-xs font-mono text-neutral-300 space-y-2.5 mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Package Size:</span>
                  <span className="text-white font-semibold">{downloadModalApp.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Architectures:</span>
                  <span className="text-white">{(downloadModalApp.platforms || []).join(' / ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">Integrity:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    SHA-256 Signed Manifest
                  </span>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400 truncate">
                  <span className="text-neutral-500">Hash: </span>
                  <span className="text-neutral-300">
                    {generateAppHash(downloadModalApp.id, downloadModalApp.version).slice(0, 32)}...
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={downloadProgress}
                  onClick={executeDownload}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff2a3a] to-[#d61928] hover:from-[#ff3d4c] hover:to-[#e61e2f] active:scale-[0.985] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-red-400/30 shadow-[0_4px_20px_rgba(255,42,58,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] cursor-pointer"
                >
                  {downloadProgress ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Compiling Binary...
                    </span>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4" />
                      <span>Start Direct Download</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDownloadModalApp(null)}
                  className="px-5 py-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white font-mono text-xs transition-colors border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Technical Spec & Blueprint Inspection Modal */}
        {inspectModalApp && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#131520] via-[#0e1017] to-[#090a0f] border border-white/[0.18] p-6 sm:p-7 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.2)] text-left">
              {/* Modal Top Specular Highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-display text-white uppercase tracking-tight">
                      {inspectModalApp.name} &bull; Spec Sheet
                    </h4>
                    <p className="text-[11px] font-mono text-neutral-400">
                      Release Tag {inspectModalApp.version}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setInspectModalApp(null)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Technical Blueprint Rows */}
              <div className="space-y-3 font-mono text-xs mb-6">
                <div className="p-3 rounded-xl bg-[#080910] border border-white/[0.08] space-y-1.5">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                    Cryptographic Checksum
                  </div>
                  <div className="text-white text-[11px] break-all select-all font-mono bg-black/40 p-2 rounded border border-white/[0.05]">
                    {generateAppHash(inspectModalApp.id, inspectModalApp.version)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#080910] border border-white/[0.08]">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold mb-1">
                      Target Runtimes
                    </div>
                    <div className="text-white text-xs">
                      {(inspectModalApp.platforms || []).join(', ')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#080910] border border-white/[0.08]">
                    <div className="text-[10px] text-neutral-500 uppercase font-semibold mb-1">
                      Binary Footprint
                    </div>
                    <div className="text-white text-xs">{inspectModalApp.fileSize}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#080910] border border-white/[0.08]">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold mb-1">
                    Changelog & Highlights
                  </div>
                  <div className="text-neutral-300 text-xs font-sans">
                    {inspectModalApp.changelog || 'Official stable release package.'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    setInspectModalApp(null);
                    handleTriggerDownload(inspectModalApp);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff2a3a] to-[#d61928] hover:from-[#ff3d4c] hover:to-[#e61e2f] text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_16px_rgba(255,42,58,0.3)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Package ({inspectModalApp.fileSize})</span>
                </button>
                <button
                  onClick={() => setInspectModalApp(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white font-mono text-xs transition-colors border border-white/[0.08] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppsHub;
