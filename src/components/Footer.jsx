import { useState, useRef, useCallback } from 'react';
import {
  Cpu,
  ArrowUp,
  ShieldCheck,
  Lock,
  Sparkles,
  Compass,
  Shield,
  Terminal,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const { identity } = usePortfolioData();
  const { isFounder, lockVault } = useAuth();
  const navigate = useNavigate();
  const footerRef = useRef(null);

  // Controlled spatial lighting and subtle card 3D tilt
  const [pointer, setPointer] = useState({
    x: 50,
    y: 50,
    tiltX: 0,
    tiltY: 0,
    active: false,
  });

  const handleMouseMove = useCallback((e) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

    // Controlled, restrained tilt angles (-3 to +3 deg max for ultra-refined physical presence)
    const tiltX = (px - 0.5) * 6;
    const tiltY = (py - 0.5) * -6;

    setPointer({
      x: px * 100,
      y: py * 100,
      tiltX,
      tiltY,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPointer((prev) => ({
      ...prev,
      tiltX: 0,
      tiltY: 0,
      active: false,
    }));
  }, []);

  const handleSectionClick = (id) => {
    if (id === 'journey') {
      window.dispatchEvent(new CustomEvent('open-journey-timeline'));
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = identity?.name || 'SAHIL BHATIA';
  const displayDomain =
    identity?.domain && identity.domain !== 'SAHILBHATIA.COM'
      ? identity.domain
      : 'sahil-bhatia-ai-portfolio.vercel.app';
  const systemName = identity?.systemName || 'PORTFOLIO OS';
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-t border-white/[0.1] z-10 overflow-hidden bg-transparent"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================= */}
      {/* 3D ATMOSPHERIC DEPTH RIG & ARCHITECTURAL LIGHTING         */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Recessed Ambient Void Depth Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#06060a]/30 to-transparent" />

        {/* Spatial Horizon Line with Micro Center Specular Glint */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[2px] bg-gradient-to-r from-transparent via-red-500/70 to-transparent shadow-[0_0_18px_rgba(255,42,58,0.5)]" />

        {/* Controlled Multi-Octave Atmospheric Backlight */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[340px] bg-gradient-to-b from-red-600/[0.08] to-transparent rounded-full blur-[140px] transition-opacity duration-700"
          style={{ opacity: pointer.active ? 0.95 : 0.65 }}
        />
        <div className="absolute top-1/3 right-[-100px] w-[500px] h-[350px] bg-red-950/[0.07] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-[-80px] w-[600px] h-[300px] bg-neutral-900/[0.25] rounded-full blur-[140px]" />

        {/* Dynamic Specular Tracking Spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: pointer.active ? 1 : 0,
            background: `radial-gradient(900px circle at ${pointer.x}% ${pointer.y}%, rgba(255, 42, 58, 0.07), rgba(255, 255, 255, 0.02) 28%, transparent 65%)`,
          }}
        />

        {/* Spatial Perspective Floor Grid receding into the horizon */}
        <div
          className="absolute -bottom-20 inset-x-0 h-96 opacity-[0.14] bg-spatial-grid pointer-events-none perspective-floor-grid"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 80%)',
          }}
        />

        {/* ========================================================= */}
        {/* CAPTAIN AMERICA VIBRANIUM SHIELD - COSMIC BACKGROUND INTEGRATION */}
        {/* ========================================================= */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[680px] md:w-[800px] lg:w-[920px] aspect-square flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          {/* Multi-octave atmospheric backlighting: crimson red & cosmic vibranium blue */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-red-600/[0.14] via-rose-950/[0.08] to-blue-600/[0.12] blur-[100px] transform scale-90" />
          <div className="absolute w-[55%] h-[55%] rounded-full bg-cyan-500/[0.06] blur-[75px]" />
          <div className="absolute w-[40%] h-[40%] rounded-full bg-red-500/[0.1] blur-[60px]" />

          {/* Shield Artwork with Soft Feathered Radial Mask & Vignette */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              maskImage: 'radial-gradient(circle at 50% 38%, black 15%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.2) 55%, transparent 68%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 38%, black 15%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.2) 55%, transparent 68%)',
            }}
          >
            <img
              src="/assets/cap_shield_red_hulk.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-[center_34%] opacity-[0.25] sm:opacity-[0.28] mix-blend-screen filter contrast-125 brightness-95 saturate-110"
              style={{
                transform: `perspective(1000px) rotateX(${pointer.tiltY * 0.35}deg) rotateY(${pointer.tiltX * 0.35}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
            />

            {/* Deep Cosmic Vignettes completely eliminating all text, logos, and watermarks */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/40 via-transparent to-[#06060a]/90 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#06060a] via-[#06060a]/80 to-transparent pointer-events-none" />
          </div>

          {/* Vibranium Star Specular Glint & Atmospheric Flare */}
          <div className="absolute w-36 h-36 rounded-full bg-blue-400/[0.08] blur-xl pointer-events-none" />
          <div className="absolute -top-6 w-60 h-28 bg-red-600/[0.12] blur-3xl pointer-events-none" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ========================================================= */}
        {/* TOP STATUS BAR: SYSTEM INTEGRITY & TELEMETRY             */}
        {/* ========================================================= */}
        <div className="mb-14 pb-6 border-b border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
          {/* Left: Core Status with Authentic Telemetry Pulse */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/40 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </div>
            <div className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase flex items-center gap-2.5">
              <span className="text-white font-medium">CORE SYSTEM STATUS</span>
              <span className="text-neutral-600">&bull;</span>
              <span className="text-emerald-400 font-semibold tracking-widest flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                ONLINE / VERIFIED
              </span>
            </div>
          </div>

          {/* Right: Engineered Telemetry Pills */}
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-[11px] text-neutral-300">
              <Terminal className="w-3 h-3 text-red-400" />
              <span>PORTFOLIO OS v3.4</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] text-[11px]">
              <Globe className="w-3 h-3 text-neutral-400" />
              <span className="text-neutral-300 font-medium">{displayDomain}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN 4-COLUMN SPATIAL COMPOSITION                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 lg:gap-10 pb-16 border-b border-white/[0.07]">
          {/* ------------------------------------------------------- */}
          {/* COLUMN 1 (FOCAL POINT): BRAND & ARCHITECT CARD          */}
          {/* ------------------------------------------------------- */}
          <div className="sm:col-span-12 lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#11131e]/95 via-[#0b0c12]/95 to-[#07080b]/98 border border-white/[0.12] p-6 lg:p-7 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-red-500/50 hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.9),0_0_35px_rgba(255,42,58,0.25)] transition-all duration-300 relative group overflow-hidden">
            {/* Specular Edge Horizon Reflection */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.25] to-transparent pointer-events-none" />

            {/* Dynamic Card Internal Glint */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(400px circle at ${pointer.x}% ${pointer.y}%, rgba(255,42,58,0.09), transparent 70%)`,
              }}
            />

            <div className="space-y-5 relative z-10">
              {/* Identity Header */}
              <div className="flex items-center gap-3.5">
                {/* Precision CNC Hardware Icon Plate */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e202d] to-[#0c0d13] border border-white/[0.2] shadow-[0_10px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-red-500/60 group-hover:shadow-[0_10px_28px_rgba(255,42,58,0.35)]">
                  <Cpu className="w-5 h-5 text-red-500 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-red-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-xl tracking-wider text-white uppercase block leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {name}
                    </span>
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3 h-3 rounded-full bg-emerald-400/50 animate-ping" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase mt-1.5 block">
                    AI ARCHITECT &amp; BUILDER
                  </span>
                </div>
              </div>

              {/* Bio Statement */}
              <p className="text-xs text-neutral-300 leading-relaxed font-sans max-w-md">
                AI Generalist, AI Consultant &amp; Digital Systems Creator. Translating frontline sales understanding into resilient agentic architectures, automated web applications, and digital business solutions.
              </p>

              {/* System Metadata Line */}
              <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-white font-semibold">{systemName}</span>
                <span className="text-neutral-600">&bull;</span>
                <span className="text-neutral-300">{displayDomain}</span>
              </div>

              {/* Public Verified Social Network Links */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center gap-2.5 font-mono text-[11px]">
                <a
                  href="https://www.instagram.com/neutronverse.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] hover:border-red-500/50 text-neutral-200 hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_4px_16px_rgba(255,42,58,0.2)] group/link"
                  title="Instagram @neutronverse.ai"
                >
                  <span className="font-semibold">Instagram</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover/link:text-red-400 transition-colors" />
                </a>

                <a
                  href="https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] hover:border-red-500/50 text-neutral-200 hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_4px_16px_rgba(255,42,58,0.2)] group/link"
                  title="LinkedIn Profile"
                >
                  <span className="font-semibold">LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover/link:text-red-400 transition-colors" />
                </a>

                <a
                  href="https://github.com/sahilbhatia7474-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] hover:border-red-500/50 text-neutral-200 hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_4px_16px_rgba(255,42,58,0.2)] group/link"
                  title="GitHub Repositories"
                >
                  <span className="font-semibold">GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover/link:text-red-400 transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 2: SYSTEM SECTIONS (NAV RECESSED PANEL)          */}
          {/* ------------------------------------------------------- */}
          <div className="sm:col-span-6 lg:col-span-3 rounded-2xl bg-[#090a0f]/80 border border-white/[0.07] p-5 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl relative transition-all duration-300 hover:border-white/[0.14]">
            {/* Top Micro Specular Edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

            <div className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-semibold mb-3.5 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-red-400" />
              <span>SYSTEM SECTIONS</span>
            </div>

            <ul className="space-y-1 font-mono text-xs text-neutral-400">
              {[
                { id: 'hero', label: '01 • Identity' },
                { id: 'capabilities', label: '02 • Capability Map' },
                { id: 'projects', label: '03 • Curated Projects' },
                { id: 'ai-systems', label: '04 • AI Systems Laboratory' },
                { id: 'journey', label: '05 • Professional Journey' },
                { id: 'proof', label: '06 • Proof Matrix' },
                { id: 'certificates', label: '07 • Certificates' },
                { id: 'vault', label: '08 • Future Vault' },
                { id: 'apps', label: '09 • Apps Hub' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionClick(item.id)}
                    className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white text-neutral-400 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                  >
                    <span className="group-hover:text-neutral-200 transition-colors">{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-400" />
                  </button>
                </li>
              ))}

              {isFounder && (
                <li className="pt-2 border-t border-white/[0.08]">
                  <Link
                    to="/vault"
                    onClick={() => lockVault && lockVault()}
                    className="py-1.5 px-2.5 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-900/40 flex items-center gap-2 transition-all text-[11px] font-medium"
                  >
                    <Lock className="w-3 h-3 text-red-400" />
                    <span>Founder Vault Console</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 3: LEGAL & BUSINESS COMPLIANCE PANEL             */}
          {/* ------------------------------------------------------- */}
          <div className="sm:col-span-6 lg:col-span-3 rounded-2xl bg-[#090a0f]/80 border border-white/[0.07] p-5 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl relative transition-all duration-300 hover:border-white/[0.14]">
            {/* Top Micro Specular Edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

            <div className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-semibold mb-3.5 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>LEGAL &amp; BUSINESS</span>
            </div>

            <ul className="space-y-1 font-mono text-xs text-neutral-400">
              {[
                { to: '/business-info', label: 'About / Business Info' },
                { to: '/services', label: 'Services' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-and-conditions', label: 'Terms & Conditions' },
                { to: '/refund-policy', label: 'Refund & Cancellation' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white text-neutral-400 hover:translate-x-1 transition-all duration-200 flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-red-400 transition-colors" />
                      <span className="group-hover:text-neutral-200 transition-colors">{item.label}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-400" />
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handleSectionClick('contact')}
                  className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white text-neutral-400 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-red-400 transition-colors" />
                    <span className="group-hover:text-neutral-200 transition-colors">Contact</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 4: STANDARDS & TACTILE RETURN-TO-TOP TRIGGER    */}
          {/* ------------------------------------------------------- */}
          <div className="sm:col-span-12 lg:col-span-2 flex flex-col justify-between space-y-4">
            {/* Standards Card */}
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>STANDARDS</span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e0f15] to-[#07080c] border border-white/[0.09] shadow-[0_12px_28px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] text-xs text-neutral-400 space-y-2 font-sans relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.05] rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero Fabrication</span>
                </div>

                <p className="text-[11px] leading-relaxed text-neutral-400">
                  All metrics, credentials, career records, and project deliverables strictly correspond to authentic work.
                </p>
              </div>
            </div>

            {/* Tactile Engineered Return to Top Action */}
            <button
              onClick={scrollToTop}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#222433] via-[#151622] to-[#0c0d14] hover:from-[#ff2a3a] hover:to-[#d61928] border border-white/[0.18] hover:border-red-400/50 text-xs font-mono font-bold text-white flex items-center justify-center gap-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_12px_32px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer group"
              aria-label="Scroll back to top of page"
            >
              {/* Animated Blinking Radar Beacon */}
              <span className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute w-3 h-3 rounded-full bg-red-400/50 group-hover:bg-white/60 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-red-400 group-hover:bg-white shadow-[0_0_8px_#ff2a3a]" />
              </span>
              <span className="tracking-wider uppercase">Return to Top</span>
              <ArrowUp className="w-4 h-4 text-neutral-300 group-hover:text-white group-hover:-translate-y-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM COPYRIGHT & METADATA BAR                          */}
        {/* ========================================================= */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {name}.</span>
            <span className="hidden sm:inline text-neutral-600">&bull;</span>
            <span className="text-neutral-400">All systems operational.</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${contactEmail}`}
              className="text-neutral-400 hover:text-white transition-colors duration-200 px-2.5 py-1 rounded-md hover:bg-white/[0.04]"
            >
              {contactEmail}
            </a>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-neutral-300 font-medium px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              {displayDomain}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
