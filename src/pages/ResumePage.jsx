import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Share2,
  Check,
  Sparkles,
  Briefcase,
  Cpu,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  Globe,
  Copy,
  ArrowUpRight,
} from 'lucide-react';
import PageSEO from '../components/PageSEO';
import VaultPageTransitionOverlay from '../components/vault/VaultPageTransitionOverlay';

export default function ResumePage() {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [returnTransition, setReturnTransition] = useState(false);
  const navigate = useNavigate();

  const handleReturnToPortfolio = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setReturnTransition(true);
    setTimeout(() => {
      navigate('/');
    }, 450);
    setTimeout(() => {
      setReturnTransition(false);
    }, 850);
  };

  // 3D Tilt & Cursor Spotlight Coordinates for Interactive Depth
  const [spotlight, setSpotlight] = useState({ x: 50, y: 25 });
  const [_tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const articleRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (animFrameRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    animFrameRef.current = requestAnimationFrame(() => {
      animFrameRef.current = null;
      if (!articleRef.current) return;
      const rect = articleRef.current.getBoundingClientRect();
      const x = Math.round((((clientX - rect.left) / rect.width) * 100) * 10) / 10;
      const y = Math.round((((clientY - rect.top) / rect.height) * 100) * 10) / 10;
      setSpotlight({ x, y });

      // Subtle 3D card tilt (-1.8deg to +1.8deg for ultra-refined luxury feel)
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = (((clientY - rect.top) - cy) / cy) * -1.8;
      const ry = (((clientX - rect.left) - cx) / cx) * 1.8;
      setTilt({ rx: Math.round(rx * 10) / 10, ry: Math.round(ry * 10) / 10 });
    });
  }, []);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // safe fallback
    }
  };

  const handleCopyText = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // safe fallback
    }
  };

  return (
    <>
      <PageSEO
        title="Sahil Bhatia — Resume & Curriculum Vitae | AI Generalist"
        description="Official verified curriculum vitae of Sahil Bhatia: AI Generalist, AI-Assisted Digital Solutions & Workflow Design. Review core skills, verified projects, commercial sales experience, and certifications."
        canonicalUrl="/resume"
      />

      {/* Dedicated Print Stylesheet: Clean white background, dark readable text, zero decoration */}
      <style>{`
        @media print {
          @page {
            margin: 12mm 15mm 15mm 15mm;
            size: portrait;
          }
          *, *::before, *::after {
            background: transparent !important;
            color: #0f172a !important;
            box-shadow: none !important;
            text-shadow: none !important;
            filter: none !important;
            transform: none !important;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 10pt !important;
            line-height: 1.42 !important;
            overflow: visible !important;
            height: auto !important;
          }
          .no-print,
          header.no-print,
          div.no-print,
          button,
          .interactive-glare,
          #ai-assistant-trigger,
          #ai-assistant-panel,
          #ai-assistant-backdrop,
          .spider-background,
          .custom-cursor,
          .crt-overlay,
          .ambient-backdrop {
            display: none !important;
          }
          #printable-resume-shell {
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          #printable-resume {
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            transform: none !important;
          }
          .print-card {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            padding: 10px 14px !important;
            margin-bottom: 8px !important;
            border-radius: 6px !important;
            box-shadow: none !important;
          }
          .print-break-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          .print-heading {
            color: #0f172a !important;
            border-bottom: 1.5px solid #0f172a !important;
            padding-bottom: 4px !important;
            margin-bottom: 10px !important;
            font-size: 11pt !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
          }
          a {
            color: #0369a1 !important;
            text-decoration: underline !important;
          }
          .print-badge {
            background: #f1f5f9 !important;
            color: #1e293b !important;
            border: 1px solid #cbd5e1 !important;
            font-size: 8pt !important;
            padding: 1px 6px !important;
            border-radius: 3px !important;
          }
        }
      `}</style>

      <div
        id="printable-resume-shell"
        className="min-h-screen bg-[#050608] text-neutral-100 font-sans antialiased selection:bg-red-600 selection:text-white relative overflow-x-hidden"
      >
        {/* ========================================================================= */}
        {/* RICH VOLUMETRIC CYBERNETIC 3D BACKGROUND LAYERS                          */}
        {/* ========================================================================= */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print select-none">
          {/* Layer 1: Multi-Chromatic Volumetric Nebulas */}
          <div className="absolute -top-40 -left-40 w-[48rem] h-[48rem] rounded-full bg-red-600/20 blur-[150px] animate-pulse" />
          <div className="absolute top-1/5 -right-40 w-[44rem] h-[44rem] rounded-full bg-indigo-600/22 blur-[170px]" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 w-[38rem] h-[38rem] rounded-full bg-cyan-500/15 blur-[140px]" />
          <div className="absolute -bottom-32 right-1/6 w-[45rem] h-[45rem] rounded-full bg-rose-600/18 blur-[160px]" />
          <div className="absolute top-3/4 -left-20 w-[36rem] h-[36rem] rounded-full bg-purple-600/14 blur-[130px]" />

          {/* Layer 2: Floating 3D Geometric Depth Lenses */}
          <div className="absolute top-24 right-1/4 w-72 h-72 rounded-full border border-white/10 bg-gradient-to-tr from-cyan-500/5 to-transparent blur-sm rotate-12 opacity-60 pointer-events-none" />
          <div className="absolute top-2/3 -left-12 w-96 h-96 rounded-full border border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent blur-md -rotate-45 opacity-50 pointer-events-none" />

          {/* Layer 3: High-Precision Spatial Cyber Grid Floor with Horizon Fade */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-60 mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:72px_72px] opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/30 via-transparent to-[#050608]/95" />

          {/* Layer 4: Shimmer Laser Horizon Beam */}
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-red-600/15 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* TOP COMMAND STRIP (On-Screen Only — Hidden in Print)                     */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 bg-[#070914]/85 backdrop-blur-2xl border-b border-red-500/30 px-4 sm:px-8 py-3 shadow-[0_16px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.18)] no-print relative select-none">
          {/* Specular Top Rim Shine */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
          {/* Bottom Horizon Laser Edge */}
          <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-85 shadow-[0_0_8px_#ff2a3a]" />

          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReturnToPortfolio}
                disabled={returnTransition}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#181c32]/90 to-[#0e1122]/95 hover:from-[#242b4d] hover:to-[#161a35] border border-white/20 hover:border-cyan-400 text-neutral-200 hover:text-white text-xs font-mono font-bold transition-all shadow-[0_6px_18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer"
                title="Return to Public Operating Space (with Cyber Transition)"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Portfolio</span>
              </button>
              <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-white/15 text-[11px] font-mono text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-white font-extrabold tracking-wider font-['Outfit',sans-serif]">RESUME / CV</span>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-300 font-bold font-['Outfit',sans-serif]">SAHIL BHATIA</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://2m0y1o.flexi-funnels.com/portfolio-offer-d"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600/25 via-amber-900/35 to-amber-950/50 hover:from-amber-600/40 hover:to-amber-900/50 border border-amber-400/60 hover:border-amber-300 text-amber-200 hover:text-white text-xs font-mono font-bold transition-all shadow-[0_4px_16px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer no-print group"
                title="Open Portfolio Offer Funnel"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse group-hover:rotate-12 transition-transform" />
                <span>Portfolio Offer</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12162a]/90 hover:bg-[#1b213f] border border-white/20 hover:border-cyan-400 text-neutral-200 hover:text-white text-xs font-mono font-bold transition-all shadow-[0_6px_18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
                title="Copy shareable link to this resume"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Share Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,58,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95 hover:scale-[1.02]"
                title="Save as clean PDF or print using system print dialog"
              >
                <Printer className="w-4 h-4 text-white drop-shadow-[0_0_6px_#ffffff]" />
                <span>Save as PDF / Print</span>
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* CSS SELECTOR 1: MAIN CONTAINER (Spatial Viewport with Razor-Sharp Fonts)  */}
        {/* ========================================================================= */}
        <main
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          {/* Ambient Monolith Cast Shadow Projection */}
          <div
            className="absolute inset-x-8 -bottom-10 h-32 bg-black/90 blur-[60px] rounded-full pointer-events-none -z-10 no-print"
            aria-hidden="true"
          />

          {/* ========================================================================= */}
          {/* CSS SELECTOR 2: ARTICLE#PRINTABLE-RESUME (3D Interactive Monolith Card)   */}
          {/* ========================================================================= */}
          <article
            id="printable-resume"
            ref={articleRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-300 ease-out border-2 border-red-500/40 hover:border-red-500/75 group font-kerning-normal font-sans"
            style={{
              background: 'radial-gradient(140% 120% at 50% 0%, rgba(18, 22, 40, 0.98) 0%, rgba(11, 13, 25, 0.99) 45%, rgba(6, 7, 14, 1) 100%)',
              boxShadow: isHovered
                ? '0 45px 120px -20px rgba(0,0,0,0.98), 0 0 75px -10px rgba(255,42,58,0.28), 0 25px 55px -15px rgba(6,182,212,0.18), inset 0 1.5px 0 0 rgba(255,255,255,0.45), inset 0 -2px 0 0 rgba(0,0,0,0.95)'
                : '0 30px 90px -20px rgba(0,0,0,0.96), 0 0 45px -10px rgba(255,42,58,0.18), 0 15px 35px -15px rgba(6,182,212,0.1), inset 0 1.5px 0 0 rgba(255,255,255,0.32), inset 0 -2px 0 0 rgba(0,0,0,0.9)',
              transform: isHovered ? 'translateY(-3px)' : 'none',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              fontKerning: 'normal',
            }}
          >
            {/* Specular Top Rim Shine */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_16px_rgba(255,255,255,1)] pointer-events-none no-print" />
            
            {/* Bottom Crimson Horizon Rail */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-90 shadow-[0_0_12px_#ff2a3a] pointer-events-none no-print" />

            {/* Tactical Cybernetic Glowing Corner Brackets */}
            <div className="absolute top-3.5 left-3.5 text-sm font-mono text-red-500 font-black select-none pointer-events-none drop-shadow-[0_0_8px_#ff2a3a] no-print">⌜</div>
            <div className="absolute top-3.5 right-3.5 text-sm font-mono text-red-500 font-black select-none pointer-events-none drop-shadow-[0_0_8px_#ff2a3a] no-print">⌝</div>
            <div className="absolute bottom-3.5 left-3.5 text-sm font-mono text-red-500 font-black select-none pointer-events-none drop-shadow-[0_0_8px_#ff2a3a] no-print">⌞</div>
            <div className="absolute bottom-3.5 right-3.5 text-sm font-mono text-red-500 font-black select-none pointer-events-none drop-shadow-[0_0_8px_#ff2a3a] no-print">⌟</div>

            {/* Dynamic Cursor Spotlight Reflection */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen opacity-70 no-print"
              style={{
                background: `radial-gradient(circle 850px at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.18) 0%, rgba(255,42,58,0.12) 28%, rgba(6,182,212,0.06) 52%, transparent 80%)`,
              }}
            />

            <div
              className="space-y-10 sm:space-y-12 relative z-10"
              style={{
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'geometricPrecision',
              }}
            >
              {/* ============================================================== */}
              {/* CSS SELECTOR 3: HEADER DIV (Identity, Headline & 3D Contacts)   */}
              {/* ============================================================== */}
              <header className="border-b border-white/15 pb-8 sm:pb-10 print-break-avoid">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                  {/* Left Identity Column */}
                  <div className="space-y-4 max-w-2xl">
                    {/* Status Pill Kicker */}
                    <div className="flex items-center gap-2.5">
                      <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-950/80 via-[#260c14] to-[#12070c] border border-red-500/60 shadow-[0_0_20px_rgba(255,42,58,0.4)] flex items-center gap-2 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_#ff2a3a]" />
                        </span>
                        <span className="font-['Outfit',sans-serif] text-[11px] sm:text-xs tracking-[0.16em] uppercase text-red-200 font-extrabold">
                          VERIFIED CURRICULUM VITAE
                        </span>
                      </div>
                    </div>

                    {/* Master Name with Ultra-Modern Outfit Display Typography - Crisp & Sharp */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-['Outfit',sans-serif] tracking-[-0.03em] text-white uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
                      Sahil Bhatia
                    </h1>

                    {/* Headline with High-Impact Gradient Sub-heading - Crisp & Sharp */}
                    <p className="text-base sm:text-lg lg:text-xl font-['Outfit',sans-serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-rose-200 to-amber-200 tracking-wide leading-relaxed">
                      AI Generalist | AI-Assisted Digital Solutions | Workflow Design
                    </p>

                    {/* Operational Telemetry Strip (On-Screen Only) */}
                    <div className="pt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] no-print">
                      <span className="px-3 py-1 rounded-lg bg-purple-950/70 border border-purple-400/40 text-purple-300 font-bold flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        <Briefcase className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_6px_#c084fc]" />
                        <span>FIELD OPERATIONS &amp; BD: ~2 YEARS</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Coordinates Grid (3D Tactile Interactive Floating Contact Cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 font-mono text-xs shrink-0 w-full lg:w-[380px] select-none">
                    {/* Location (CSS Selector 1) */}
                    <div className="group/loc relative overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#181d38]/95 via-[#101328]/98 to-[#090b18]/100 border border-white/20 hover:border-red-500/80 shadow-[0_12px_36px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_22px_50px_rgba(255,42,58,0.38),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-3">
                      {/* Top Specular Holographic Edge */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400/80 to-transparent pointer-events-none" />
                      {/* Ambient Corner Plasma Glow */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-red-600/20 blur-xl group-hover/loc:bg-red-600/35 transition-all pointer-events-none" />
                      {/* Cybernetic Corner Accents */}
                      <div className="absolute top-1.5 left-2 text-[9px] font-mono text-red-500/40 select-none pointer-events-none group-hover/loc:text-red-400 transition-colors">⌜</div>
                      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-red-500/40 select-none pointer-events-none group-hover/loc:text-red-400 transition-colors">⌟</div>

                      <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                        {/* 3D Tactile Icon Cube */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-800/90 via-red-950/95 to-[#1c080d] border border-red-500/70 flex items-center justify-center text-red-400 shrink-0 shadow-[0_0_20px_rgba(255,42,58,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover/loc:rotate-6 group-hover/loc:scale-110 transition-all duration-300">
                          <MapPin className="w-5 h-5 drop-shadow-[0_0_8px_#ff2a3a]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ff2a3a]" />
                            <span className="text-[10px] text-red-300/90 uppercase tracking-[0.16em] block font-extrabold font-['Outfit',sans-serif]">Location</span>
                          </div>
                          <div className="text-white font-black tracking-tight text-sm font-['Outfit',sans-serif]">Delhi NCR, India</div>
                          <div className="text-[10px] font-mono text-neutral-400 font-medium">India · Open to Remote / Hybrid</div>
                        </div>
                      </div>
                      <div className="relative z-10 hidden sm:flex flex-col items-end gap-1 shrink-0 no-print">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Available</span>
                      </div>
                    </div>

                    {/* Phone (CSS Selector 2) */}
                    <a
                      href="tel:+919953239674"
                      className="group/phone relative overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#142628]/95 via-[#0d1c1e]/98 to-[#081214]/100 border border-white/20 hover:border-emerald-400/90 shadow-[0_12px_36px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_22px_50px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer"
                      title="Call Sahil Bhatia (+91 9953239674)"
                    >
                      {/* Top Specular Holographic Edge */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none" />
                      {/* Ambient Corner Plasma Glow */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-600/20 blur-xl group-hover/phone:bg-emerald-600/35 transition-all pointer-events-none" />
                      {/* Cybernetic Corner Accents */}
                      <div className="absolute top-1.5 left-2 text-[9px] font-mono text-emerald-500/40 select-none pointer-events-none group-hover/phone:text-emerald-400 transition-colors">⌜</div>
                      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-emerald-500/40 select-none pointer-events-none group-hover/phone:text-emerald-400 transition-colors">⌟</div>

                      <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                        {/* 3D Tactile Icon Cube */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800/90 via-emerald-950/95 to-[#081a14] border border-emerald-500/70 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover/phone:rotate-[-6deg] group-hover/phone:scale-110 transition-all duration-300">
                          <Phone className="w-5 h-5 drop-shadow-[0_0_8px_#34d399]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                            <span className="text-[10px] text-emerald-300/90 uppercase tracking-[0.16em] block font-extrabold font-['Outfit',sans-serif]">Phone</span>
                          </div>
                          <div className="text-emerald-300 font-black tracking-tight text-sm group-hover/phone:text-white transition-colors font-['Outfit',sans-serif]">+91 9953239674</div>
                          <div className="text-[10px] font-mono text-neutral-400 font-medium">Direct Voice · WhatsApp Available</div>
                        </div>
                      </div>
                      <div className="relative z-10 shrink-0 no-print">
                        <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-['Outfit',sans-serif] font-black text-[11px] tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_16px_rgba(16,185,129,0.5)] group-hover/phone:shadow-[0_0_24px_rgba(16,185,129,0.85)] group-hover/phone:scale-105 transition-all">
                          <span>CALL</span>
                          <span className="text-xs">&rarr;</span>
                        </span>
                      </div>
                    </a>

                    {/* Email (CSS Selector 3) */}
                    <div
                      onClick={() => handleCopyText('sahilbhatia7474@gmail.com', 'email')}
                      className="group/mail relative overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#12243e]/95 via-[#0c1a2e]/98 to-[#081220]/100 border border-white/20 hover:border-cyan-400/90 shadow-[0_12px_36px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_22px_50px_rgba(6,182,212,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer"
                      title="Click to copy email address"
                    >
                      {/* Top Specular Holographic Edge */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />
                      {/* Ambient Corner Plasma Glow */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-cyan-600/20 blur-xl group-hover/mail:bg-cyan-600/35 transition-all pointer-events-none" />
                      {/* Cybernetic Corner Accents */}
                      <div className="absolute top-1.5 left-2 text-[9px] font-mono text-cyan-500/40 select-none pointer-events-none group-hover/mail:text-cyan-400 transition-colors">⌜</div>
                      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-cyan-500/40 select-none pointer-events-none group-hover/mail:text-cyan-400 transition-colors">⌟</div>

                      <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                        {/* 3D Tactile Icon Cube */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-800/90 via-cyan-950/95 to-[#081720] border border-cyan-400/70 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover/mail:rotate-6 group-hover/mail:scale-110 transition-all duration-300">
                          <Mail className="w-5 h-5 drop-shadow-[0_0_8px_#22d3ee]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                            <span className="text-[10px] text-cyan-300/90 uppercase tracking-[0.16em] block font-extrabold font-['Outfit',sans-serif]">Email</span>
                          </div>
                          <div className="text-cyan-300 font-bold tracking-tight text-xs truncate block group-hover/mail:text-white transition-colors font-mono">sahilbhatia7474@gmail.com</div>
                          <div className="text-[10px] font-mono text-neutral-400 font-medium">Click to Copy Address</div>
                        </div>
                      </div>
                      <div className="relative z-10 shrink-0 no-print">
                        <span className={`px-3 py-1.5 rounded-xl font-['Outfit',sans-serif] font-black text-[11px] tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-md ${
                          copiedField === 'email'
                            ? 'bg-emerald-500 text-black border border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.9)] scale-105'
                            : 'bg-cyan-950/90 border border-cyan-400/60 text-cyan-200 group-hover/mail:bg-cyan-500 group-hover/mail:text-black group-hover/mail:border-cyan-300 group-hover/mail:shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                        }`}>
                          {copiedField === 'email' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>COPY</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Portfolio (CSS Selector 4) */}
                    <a
                      href="https://sahil-bhatia-ai-portfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/web relative overflow-hidden p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-[#221840]/95 via-[#18112e]/98 to-[#0f0b1e]/100 border border-white/20 hover:border-purple-400/90 shadow-[0_12px_36px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.28)] hover:shadow-[0_22px_50px_rgba(168,85,247,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer"
                      title="Open live verified portfolio"
                    >
                      {/* Top Specular Holographic Edge */}
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent pointer-events-none" />
                      {/* Ambient Corner Plasma Glow */}
                      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-purple-600/20 blur-xl group-hover/web:bg-purple-600/35 transition-all pointer-events-none" />
                      {/* Cybernetic Corner Accents */}
                      <div className="absolute top-1.5 left-2 text-[9px] font-mono text-purple-500/40 select-none pointer-events-none group-hover/web:text-purple-400 transition-colors">⌜</div>
                      <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-purple-500/40 select-none pointer-events-none group-hover/web:text-purple-400 transition-colors">⌟</div>

                      <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                        {/* 3D Tactile Icon Cube */}
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-800/90 via-purple-950/95 to-[#160a22] border border-purple-400/70 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] group-hover/web:rotate-[-8deg] group-hover/web:scale-110 transition-all duration-300">
                          <Globe className="w-5 h-5 drop-shadow-[0_0_8px_#c084fc]" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                            <span className="text-[10px] text-purple-300/90 uppercase tracking-[0.16em] block font-extrabold font-['Outfit',sans-serif]">Portfolio</span>
                          </div>
                          <div className="text-purple-200 font-bold tracking-tight text-xs truncate block group-hover/web:text-white transition-colors font-mono">sahil-bhatia-ai-portfolio</div>
                          <div className="text-[10px] font-mono text-neutral-400 font-medium">Verified Projects &amp; Systems</div>
                        </div>
                      </div>
                      <div className="relative z-10 shrink-0 no-print">
                        <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-['Outfit',sans-serif] font-black text-[11px] tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_18px_rgba(168,85,247,0.6)] group-hover/web:shadow-[0_0_26px_rgba(217,70,239,0.9)] group-hover/web:scale-105 transition-all">
                          <span>OPEN</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </header>

              {/* ============================================================== */}
              {/* 2. PROFESSIONAL SUMMARY                                       */}
              {/* ============================================================== */}
              <section className="space-y-4 print-break-avoid">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400 shadow-[0_0_10px_rgba(255,42,58,0.4)] no-print">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Professional Summary
                  </h2>
                </div>
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/80 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] print-card">
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans text-justify font-medium">
                    AI-focused project builder applying generative AI tools, structured prompting and AI-assisted development to create practical digital experiences and workflow concepts. Project work spans AI-enabled websites, product catalogues, booking flows, conversion-focused funnels, and AI system/agent architecture prototypes. Brings approximately two years of customer-facing field sales and business development experience across telecom and fintech, including lead generation, needs discovery, customer acquisition, merchant onboarding/KYC process support and relationship management. Targeting entry-level AI Generalist, AI Solutions, AI Automation or AI Operations opportunities.
                  </p>
                </div>
              </section>

              {/* ============================================================== */}
              {/* 3. CORE SKILLS                                                */}
              {/* ============================================================== */}
              <section className="space-y-4 print-break-avoid">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] no-print">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Core Skills
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Skill Cluster 1 */}
                  <div className="group/sk p-5 rounded-2xl bg-gradient-to-b from-[#14182e]/85 via-[#0e1122]/90 to-[#080a16]/95 border border-white/15 hover:border-cyan-400/60 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_16px_36px_rgba(6,182,212,0.25)] hover:-translate-y-1 space-y-2 print-card">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                        <span>AI & Prompting</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold no-print">
                        MODELS & ARCH
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      Generative AI tools, prompt engineering, AI-assisted content and product prototyping, AI assistants and agent concepts, LLM workflow concepts, RAG concepts (learning exposure).
                    </p>
                  </div>

                  {/* Skill Cluster 2 */}
                  <div className="group/sk p-5 rounded-2xl bg-gradient-to-b from-[#14182e]/85 via-[#0e1122]/90 to-[#080a16]/95 border border-white/15 hover:border-emerald-400/60 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_16px_36px_rgba(16,185,129,0.25)] hover:-translate-y-1 space-y-2 print-card">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                        <span>Digital Products</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold no-print">
                        UX & BUILDS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      AI-assisted website/application prototyping, responsive website concepts, UX iteration, user-journey mapping, landing-page structure, content organization, manual QA and troubleshooting.
                    </p>
                  </div>

                  {/* Skill Cluster 3 */}
                  <div className="group/sk p-5 rounded-2xl bg-gradient-to-b from-[#14182e]/85 via-[#0e1122]/90 to-[#080a16]/95 border border-white/15 hover:border-amber-400/60 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_16px_36px_rgba(245,158,11,0.25)] hover:-translate-y-1 space-y-2 print-card">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                        <span>Workflow & Tools</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold no-print">
                        STACK & AUTOMATION
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      Workflow mapping, automation design concepts, n8n/Make exposure, Google AI Studio, GitHub workflow, Vercel, FlexiFunnels, Firebase project exposure; React, Vite and Tailwind CSS project-stack familiarity.
                    </p>
                  </div>

                  {/* Skill Cluster 4 */}
                  <div className="group/sk p-5 rounded-2xl bg-gradient-to-b from-[#14182e]/85 via-[#0e1122]/90 to-[#080a16]/95 border border-white/15 hover:border-rose-400/60 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_16px_36px_rgba(244,63,94,0.25)] hover:-translate-y-1 space-y-2 print-card">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#fb7185]" />
                        <span>Business & Sales</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold no-print">
                        FRONTLINE BD
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      Requirements discovery, customer acquisition, lead qualification, field sales, consultative product explanation, follow-up, relationship management, merchant onboarding, KYC process support and territory activities.
                    </p>
                  </div>
                </div>
              </section>

              {/* ============================================================== */}
              {/* 4. SELECTED AI & DIGITAL PROJECTS                             */}
              {/* ============================================================== */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)] no-print">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Selected AI & Digital Projects
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Project 1 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-cyan-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-cyan-200 transition-colors">
                        1. Dental Care — Modern Dentistry
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold print-badge">
                        Category: AI-enabled website
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Built a clinic-focused website experience with service information, an AI-assisted triage concept, appointment booking form, AI chat, WhatsApp CTA and cost calculator. <span className="text-neutral-400 italic">(Note: Does not claim clinical diagnosis or medical decision-making.)</span>
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Live demo:</span>
                      <a
                        href="https://dental-care-modern-dentistry.ai.studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://dental-care-modern-dentistry.ai.studio</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-emerald-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-emerald-200 transition-colors">
                        2. NeutraCap — Industrial Capacitor Catalogue
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 font-bold print-badge">
                        Category: Product catalogue / business system
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Developed a digital catalogue experience designed to organize four capacitor categories and approximately 490+ product variants, supporting structured product discovery and catalogue presentation.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Live demo:</span>
                      <a
                        href="https://neutracap-industrial-capacitor-cata.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://neutracap-industrial-capacitor-cata.vercel.app/</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 3 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-purple-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(168,85,247,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-purple-200 transition-colors">
                        3. LinkBio
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-purple-950/80 border border-purple-400/40 text-purple-300 font-bold print-badge">
                        Category: Link-in-bio web product
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Created a dedicated link-in-bio page to consolidate professional/profile links into a single shareable web experience.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Live demo:</span>
                      <a
                        href="https://linkvault-henna.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://linkvault-henna.vercel.app/</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 4 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-amber-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(245,158,11,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-amber-200 transition-colors">
                        4. ShowTime Cinema Booking
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-400/40 text-amber-300 font-bold print-badge">
                        Category: Web / booking-flow prototype
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Built a cinema booking web project to explore a structured customer journey for browsing and booking.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Demo:</span>
                      <a
                        href="https://showtime-cinema-booking.ai.studio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://showtime-cinema-booking.ai.studio</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 5 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-rose-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(244,63,94,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-rose-200 transition-colors">
                        5. Neutronverse Portfolio Offer Funnels
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-400/40 text-rose-300 font-bold print-badge">
                        Category: Funnel / conversion experience
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Created and iterated high-converting portfolio-offer landing-page funnels in FlexiFunnels, refining offer presentation, funnel sequencing and conversion architecture.
                    </p>
                    <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs font-mono">
                      <a
                        href="https://2m0y1o.flexi-funnels.com/portfolio-offer-d"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-700/35 via-amber-900/45 to-amber-950/60 hover:from-amber-600/50 hover:to-amber-900/60 border border-amber-400/70 hover:border-amber-300 text-amber-200 hover:text-white font-bold transition-all shadow-[0_4px_14px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer no-underline print-badge group"
                        title="Open Live Portfolio Offer Funnel"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-12 transition-transform" />
                        <span>Live Offer Funnel</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                      <span className="text-[11px] font-mono text-neutral-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        Conversion &amp; Offer Architecture
                      </span>
                    </div>
                  </div>

                  {/* Project 6 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-blue-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(59,130,246,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-blue-200 transition-colors">
                        6. SafeShield Insurance Qualification Funnel
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-400/40 text-blue-300 font-bold print-badge">
                        Category: Business workflow / funnel prototype
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Configured prototype qualification flows for health, motor, life/term, travel and business insurance, with supporting legal and compliance-oriented pages.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Project overview:</span>
                      <a
                        href="https://sahil-bhatia-ai-portfolio.vercel.app/#projects"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://sahil-bhatia-ai-portfolio.vercel.app/#projects</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 7 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-indigo-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-indigo-200 transition-colors">
                        7. Sahil AI OS, LYRA V2 & AI Consultancy OS
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 font-bold print-badge">
                        Category: AI systems / agent architecture concepts
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Developed AI system architecture concepts for portfolio operations, strategic task decomposition and an AI consultancy delivery flow. Focus areas include agent roles, requirements, dependencies, task ownership, workflow steps and defined outputs. <span className="text-neutral-400 italic">(Presented as rigorous architectural prototypes.)</span>
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Project overview:</span>
                      <a
                        href="https://sahil-bhatia-ai-portfolio.vercel.app/#projects"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://sahil-bhatia-ai-portfolio.vercel.app/#projects</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Project 8 */}
                  <div className="group/proj p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-cyan-400/70 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(6,182,212,0.25)] hover:-translate-y-0.5 space-y-2.5 print-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-display text-white tracking-wide group-hover/proj:text-cyan-200 transition-colors">
                        8. AURA Ultimate Edition / Hermes-JARVIS Blueprint
                      </h3>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-bold print-badge">
                        Category: Creative AI / agent-system exploration
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                      Explored AI-agent concepts, creative direction and tool-integration planning as early-stage system prototypes.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs font-mono">
                      <span className="text-neutral-400 font-bold">Project overview:</span>
                      <a
                        href="https://sahil-bhatia-ai-portfolio.vercel.app/#projects"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1.5 underline break-all group-hover/proj:translate-x-0.5 transition-transform"
                      >
                        <span>https://sahil-bhatia-ai-portfolio.vercel.app/#projects</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* ============================================================== */}
              {/* 5. PROFESSIONAL EXPERIENCE                                    */}
              {/* ============================================================== */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)] no-print">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Professional Experience
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Excitel Broadband */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-amber-400/60 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(245,158,11,0.2)] space-y-3 print-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-white/10 pb-2.5">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold font-display text-white">
                          Field Sales Executive
                        </h3>
                        <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">
                          Excitel Broadband
                        </div>
                      </div>
                      <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                        Jan 2026 – Jun 2026 | Delhi NCR, India
                      </div>
                    </div>
                    <ul className="text-xs sm:text-sm text-neutral-200 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                      <li>Conducted territory-based customer acquisition, residential and commercial broadband sales, and field lead generation.</li>
                      <li>Engaged prospective subscribers through direct consultations, explaining plans, bandwidth suitability, and installation processes.</li>
                      <li>Handled customer objections, coordinated onboarding pipelines, and ensured smooth handover for active line provisioning.</li>
                    </ul>
                  </div>

                  {/* Bharti Airtel */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-red-400/60 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(255,42,58,0.2)] space-y-3 print-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-white/10 pb-2.5">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold font-display text-white">
                          Business Development Executive / Fiber Specialist
                        </h3>
                        <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">
                          Bharti Airtel (Airtel Broadband / Xstream Fiber)
                        </div>
                      </div>
                      <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                        Mar 2025 – Dec 2025 | Delhi NCR, India
                      </div>
                    </div>
                    <ul className="text-xs sm:text-sm text-neutral-200 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                      <li>Managed end-to-end customer acquisition for high-speed fiber broadband and digital connectivity solutions.</li>
                      <li>Conducted customer needs discovery, evaluated data usage requirements, and recommended optimal connectivity tiers.</li>
                      <li>Built territory pipeline through consultative follow-ups, field outreach, and relationship management.</li>
                    </ul>
                  </div>

                  {/* Paytm */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-cyan-400/60 transition-all shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_18px_40px_rgba(6,182,212,0.2)] space-y-3 print-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-white/10 pb-2.5">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold font-display text-white">
                          Field Sales Executive
                        </h3>
                        <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5">
                          Paytm
                        </div>
                      </div>
                      <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                        Jul 2024 – Mar 2025 | Delhi NCR, India
                      </div>
                    </div>
                    <ul className="text-xs sm:text-sm text-neutral-200 space-y-1.5 list-disc list-inside leading-relaxed font-sans">
                      <li>Led merchant acquisition and onboarding for digital payment solutions including Paytm QR, Soundbox, and EDC terminals.</li>
                      <li>Verified merchant KYC documentation, guided business owners through digital setup, and resolved onboarding blockers.</li>
                      <li>Managed territory merchant relationships, supported daily transaction adoption, and delivered hands-on product demonstrations.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ============================================================== */}
              {/* 6. EDUCATION                                                  */}
              {/* ============================================================== */}
              <section className="space-y-4 print-break-avoid">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-400/60 flex items-center justify-center text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.4)] no-print">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Education
                  </h2>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] space-y-2 print-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold font-display text-white">
                      B.Sc. Mathematics (Honours) — studies commenced; degree not completed.
                    </h3>
                  </div>
                </div>
              </section>

              {/* ============================================================== */}
              {/* 7. CERTIFICATIONS & WORKSHOPS                                 */}
              {/* ============================================================== */}
              <section className="space-y-4 print-break-avoid">
                <div className="flex items-center gap-3 border-b border-white/10 pb-2.5 print-heading">
                  <div className="w-7 h-7 rounded-lg bg-teal-950/80 border border-teal-400/60 flex items-center justify-center text-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.4)] no-print">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-sm sm:text-base font-black font-display tracking-wider uppercase text-white">
                    Certifications & Workshops
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Outskill */}
                  <div className="group/cert p-5 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-teal-400/70 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(20,184,166,0.25)] hover:-translate-y-1 print-card flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 border border-teal-400/40 text-teal-300 font-bold print-badge">
                          2026
                        </span>
                        <span className="text-xs font-mono text-neutral-400 font-bold">Outskill</span>
                      </div>
                      <h3 className="text-sm font-bold font-display text-white group-hover/cert:text-teal-200 transition-colors">
                        Generative AI Mastermind
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        Verified coverage: Generative AI tools, LLMs & system prompting, agent orchestration, and autonomous AI systems.
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-white/10">
                      <a
                        href="https://kommodo.ai/i/0A0suE8RRdgDrQXPyc2f"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5 underline break-all group-hover/cert:translate-x-0.5 transition-transform"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* be10x */}
                  <div className="group/cert p-5 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-teal-400/70 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(20,184,166,0.25)] hover:-translate-y-1 print-card flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 border border-teal-400/40 text-teal-300 font-bold print-badge">
                          June 2026
                        </span>
                        <span className="text-xs font-mono text-neutral-400 font-bold">be10x</span>
                      </div>
                      <h3 className="text-sm font-bold font-display text-white group-hover/cert:text-teal-200 transition-colors">
                        AI Tools & ChatGPT Workshop
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        Verified coverage: AI tools, ChatGPT workflows, workplace productivity automation, presentation creation, and data analysis.
                      </p>
                      <div className="text-[10px] font-mono text-neutral-400">
                        Credential ID: 0270772f-3809...
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-white/10">
                      <a
                        href="https://certx.in/certificate/0270772f-3809-4400-b29b-1e1c61cd09971465833"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5 underline break-all group-hover/cert:translate-x-0.5 transition-transform"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>

                  {/* Freedom with AI */}
                  <div className="group/cert p-5 rounded-2xl bg-gradient-to-b from-[#13172b]/85 via-[#0d1020]/90 to-[#070914]/95 border border-white/15 hover:border-teal-400/70 transition-all shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_16px_36px_rgba(20,184,166,0.25)] hover:-translate-y-1 print-card flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 border border-teal-400/40 text-teal-300 font-bold print-badge">
                          2026
                        </span>
                        <span className="text-xs font-mono text-neutral-400 font-bold">Freedom with AI</span>
                      </div>
                      <h3 className="text-sm font-bold font-display text-white group-hover/cert:text-teal-200 transition-colors">
                        Freedom with AI Masterclass
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                        Verified coverage: AI workflows, agentic automation principles, no-code AI leverage, and productivity pipelines.
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-white/10">
                      <a
                        href="https://kommodo.ai/i/VNSmjNTSGk0xw9tDx5ct"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5 underline break-all group-hover/cert:translate-x-0.5 transition-transform"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3.5 h-3.5 no-print" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* ============================================================== */}
              {/* DOCUMENT FOOTER VERIFICATION                                  */}
              {/* ============================================================== */}
              <footer className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 font-mono text-xs print-break-avoid">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_8px_#34d399]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-neutral-300 font-bold">
                    Verified Curriculum Vitae &bull; Professional Portfolio Document
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Published at:</span>
                  <a
                    href="https://sahil-bhatia-ai-portfolio.vercel.app/resume"
                    className="text-cyan-300 hover:text-white underline font-semibold transition-colors"
                  >
                    sahil-bhatia-ai-portfolio.vercel.app/resume
                  </a>
                </div>
              </footer>
            </div>
          </article>
        </main>
      </div>

      {/* Cyber Page Transition Overlay for Returning to Portfolio */}
      <VaultPageTransitionOverlay
        isOpen={returnTransition}
        direction="gateway"
        customTitle="RETURNING TO OPERATING SPACE"
        customSubtitle="Restoring primary portfolio viewport, 3D spatial canvas & executive command dashboard..."
      />
    </>
  );
}
