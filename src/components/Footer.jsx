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
  Activity,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import { Link, useNavigate } from 'react-router-dom';
import FooterCinematicParticles from './FooterCinematicParticles';

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

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (contactEmail) {
      navigator.clipboard?.writeText(contactEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
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
        <div className="absolute inset-0 bg-transparent" />

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

        {/* High-Tech Cinematic Particle Animation Overlay */}
        <FooterCinematicParticles pointer={pointer} />
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
          <div className="sm:col-span-12 lg:col-span-4 rounded-2xl bg-gradient-to-b from-[#11131e]/70 via-[#0b0c12]/65 to-[#07080b]/75 border border-white/[0.12] p-6 lg:p-7 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-red-500/50 hover:shadow-[0_24px_50px_-10px_rgba(0,0,0,0.8),0_0_35px_rgba(255,42,58,0.25)] transition-all duration-300 relative group overflow-hidden">
            {/* Specular Edge Horizon Reflection */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.25] to-transparent pointer-events-none" />

            {/* Dynamic Card Internal Glint */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(400px circle at ${pointer.x}% ${pointer.y}%, rgba(255,42,58,0.09), transparent 70%)`,
              }}
            />

            {/* Interior Content Container - CSS Selector 1 */}
            <div className="space-y-5 sm:space-y-6 relative z-10 antialiased">
              {/* Identity Header (div 1) */}
              <div className="flex items-center gap-4">
                {/* Precision CNC Hardware 3D Icon Plate */}
                <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#24283e] via-[#161828] to-[#0c0d16] border-2 border-white/25 shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-red-500/70 group-hover:shadow-[0_12px_32px_rgba(255,42,58,0.45)]">
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                  <Cpu className="w-6 h-6 text-red-500 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display font-black text-xl sm:text-2xl tracking-wider text-white uppercase block leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                      {name}
                    </span>
                    <span className="relative flex items-center justify-center w-2.5 h-2.5">
                      <span className="absolute w-4 h-4 rounded-full bg-emerald-400/50 animate-ping" />
                      <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-black tracking-widest text-red-400 uppercase mt-1.5 flex items-center gap-2">
                    <span>AI ARCHITECT &amp; BUILDER</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-bold">FOUNDER</span>
                  </span>
                </div>
              </div>

              {/* Bio Statement */}
              <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-sans max-w-md font-normal">
                AI Generalist, AI Consultant &amp; Digital Systems Creator. Translating frontline sales understanding into resilient agentic architectures, automated web applications, and digital business solutions.
              </p>

              {/* System Metadata Line (div 2) */}
              <div className="flex items-center gap-2.5 font-mono text-xs text-neutral-300 pt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ff2a3a] animate-pulse" />
                <span className="text-white font-bold">{systemName}</span>
                <span className="text-neutral-500">&bull;</span>
                <span className="text-neutral-200 font-medium">{displayDomain}</span>
              </div>

              {/* Public Verified Social Network Links (div 3) */}
              <div className="pt-5 border-t-2 border-white/10 space-y-3 font-mono antialiased">
                {/* Tactical Status Micro-Header (div 1) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/50 animate-ping" />
                      <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    </span>
                    <span className="text-[11px] font-mono font-black uppercase tracking-wider text-neutral-200">
                      VERIFIED DIRECT CHANNELS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest bg-red-500/15 border border-red-500/40 px-2 py-0.5 rounded-md shadow-sm">
                    LIVE RELAY
                  </span>
                </div>

                {/* 3D Tactile Interactive SQUARE Channel Buttons Grid - CSS Selector 2 (div 2) */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-sm pt-1 perspective-container-800">
                  {/* 1. Instagram 3D Tactile SQUARE Cube with Perspective Left-Tilt */}
                  <a
                    href="https://www.instagram.com/neutronverse.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-left relative group/cube aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-[#833ab4]/30 via-[#fd1d1d]/25 to-[#fcb045]/20 bg-[#0f0714] border-2 border-rose-500/60 border-b-[5px] border-b-rose-700 shadow-[0_8px_0_#1a0410,0_16px_28px_rgba(225,48,108,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-rose-400 hover:border-b-rose-500 hover:shadow-[0_14px_0_#1a0410,0_24px_45px_rgba(225,48,108,0.7),0_0_30px_rgba(244,63,94,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#1a0410,0_6px_12px_rgba(225,48,108,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="Instagram @neutronverse.ai"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-400 group-hover/cube:bg-rose-300 shadow-[0_0_8px_#f43f5e]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* Instagram Sunset Gradient Camera Glyph with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-8 h-8 sm:w-9 sm:h-9 group-hover/cube:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id="ig-sunset-cube" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-sunset-cube)" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-sunset-cube)" />
                        <circle cx="17.5" cy="6.5" r="1" fill="#f43f5e" />
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-rose-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        INSTA
                      </span>
                    </div>
                  </a>

                  {/* 2. LinkedIn 3D Tactile SQUARE Cube with Perspective Center-Tilt */}
                  <a
                    href="https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-center relative group/cube aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-[#0077b5]/30 via-[#0288d1]/25 to-[#004182]/30 bg-[#030d17] border-2 border-cyan-500/60 border-b-[5px] border-b-cyan-700 shadow-[0_8px_0_#020c15,0_16px_28px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-cyan-400 hover:border-b-cyan-500 hover:shadow-[0_14px_0_#020c15,0_24px_45px_rgba(6,182,212,0.7),0_0_30px_rgba(14,165,233,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#020c15,0_6px_12px_rgba(6,182,212,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="LinkedIn Profile: Sahil Bhatia"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover/cube:bg-cyan-300 shadow-[0_0_8px_#06b6d4]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* LinkedIn Cyber Cobalt Vector Icon with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-400 group-hover/cube:text-cyan-300 group-hover/cube:scale-110 transition-all duration-200 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.85)] fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-cyan-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        LINKEDIN
                      </span>
                    </div>
                  </a>

                  {/* 3. GitHub 3D Tactile SQUARE Cube with Perspective Right-Tilt */}
                  <a
                    href="https://github.com/sahilbhatia7474-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perspective-tilt-right relative group/cube aspect-square w-full rounded-2xl flex flex-col items-center justify-center p-3 select-none cursor-pointer overflow-hidden bg-gradient-to-br from-red-600/30 via-rose-900/25 to-[#121422] bg-[#090a14] border-2 border-red-500/60 border-b-[5px] border-b-red-700 shadow-[0_8px_0_#140508,0_16px_28px_rgba(255,42,58,0.4),inset_0_1px_1px_rgba(255,255,255,0.45)] hover:border-red-400 hover:border-b-red-500 hover:shadow-[0_14px_0_#140508,0_24px_45px_rgba(255,42,58,0.7),0_0_30px_rgba(255,42,58,0.5),inset_0_1px_1px_rgba(255,255,255,0.6)] active:border-b-2 active:shadow-[0_2px_0_#140508,0_6px_12px_rgba(255,42,58,0.3),inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    title="GitHub Repositories: sahilbhatia7474-tech"
                  >
                    {/* Top Specular Glint Reflection Rim */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                    
                    {/* Live Corner Radar Beacon */}
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-400 group-hover/cube:bg-red-300 shadow-[0_0_8px_#ff2a3a]" />

                    {/* Luminous Diagonal Hover Sheen */}
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/cube:translate-x-full transition-transform duration-700 ease-out" />

                    {/* GitHub Carbon-Crimson Octocat Vector Icon with Z-Depth Elevation */}
                    <div className="relative z-10 flex flex-col items-center justify-center preserve-3d-child">
                      <svg className="w-8 h-8 sm:w-9 sm:h-9 text-neutral-100 group-hover/cube:text-white group-hover/cube:scale-110 transition-all duration-200 filter drop-shadow-[0_0_12px_rgba(255,42,58,0.85)] fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                      <span className="font-mono text-[10px] sm:text-[11px] font-black tracking-wider text-red-200 mt-1.5 uppercase group-hover/cube:text-white transition-colors drop-shadow-sm">
                        GITHUB
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 2: SYSTEM SECTIONS (NAV RECESSED PANEL)          */}
          {/* ------------------------------------------------------- */}
          <div className="sm:col-span-6 lg:col-span-3 rounded-2xl bg-[#090a0f]/80 border border-white/[0.07] p-5 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl relative transition-all duration-300 hover:border-white/[0.14]">
            {/* Top Micro Specular Edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-white font-black flex items-center gap-2 antialiased">
                <Compass className="w-3.5 h-3.5 text-red-400" />
                <span className="tracking-widest">SYSTEM SECTIONS</span>
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/35 text-red-300">
                INDEX
              </span>
            </div>

            <ul className="space-y-1">
              {[
                { id: 'hero', num: '01', label: 'Identity' },
                { id: 'capabilities', num: '02', label: 'Capability Map' },
                { id: 'projects', num: '03', label: 'Curated Projects' },
                { id: 'ai-systems', num: '04', label: 'AI Systems Laboratory' },
                { id: 'journey', num: '05', label: 'Professional Journey' },
                { id: 'proof', num: '06', label: 'Proof Matrix' },
                { id: 'certificates', num: '07', label: 'Certificates' },
                { id: 'vault', num: '08', label: 'Future Vault' },
                { id: 'apps', num: '09', label: 'Apps Hub' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleSectionClick(item.id)}
                    className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center justify-between group antialiased"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-red-400/80 group-hover:text-red-400 tracking-wider transition-colors">
                        {item.num}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-red-500/60 transition-colors" />
                      <span className="font-sans text-[13px] font-semibold text-neutral-200 group-hover:text-white tracking-wide transition-colors">
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-400" />
                  </button>
                </li>
              ))}

              {isFounder && (
                <li className="pt-2 border-t border-white/[0.08]">
                  <Link
                    to="/vault"
                    onMouseEnter={() => {
                      import('./vault/VaultLogin').catch(() => null);
                      import('./vault/VaultLayout').catch(() => null);
                    }}
                    onTouchStart={() => {
                      import('./vault/VaultLogin').catch(() => null);
                      import('./vault/VaultLayout').catch(() => null);
                    }}
                    onClick={() => lockVault && lockVault()}
                    className="py-1.5 px-2.5 rounded-lg bg-red-950/30 border border-red-500/25 hover:border-red-500/50 text-red-300 hover:text-white hover:bg-red-900/40 flex items-center justify-between transition-all group antialiased"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform" />
                      <span className="font-mono text-[11px] font-black uppercase tracking-wider text-red-300 group-hover:text-white transition-colors">
                        Founder Vault Console
                      </span>
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/20 px-1.5 py-0.2 rounded">
                      AUTH
                    </span>
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

            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-white font-black flex items-center gap-2 antialiased">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="tracking-widest">LEGAL &amp; BUSINESS</span>
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300">
                LEGAL
              </span>
            </div>

            <ul className="space-y-1">
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
                    className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:translate-x-1.5 transition-all duration-200 flex items-center justify-between group antialiased"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399] transition-all" />
                      <span className="font-sans text-[13px] font-semibold text-neutral-200 group-hover:text-white tracking-wide transition-colors">
                        {item.label}
                      </span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handleSectionClick('contact')}
                  className="w-full text-left py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05] hover:translate-x-1.5 transition-all duration-200 cursor-pointer flex items-center justify-between group antialiased"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 group-hover:bg-red-400 group-hover:shadow-[0_0_8px_#ff2a3a] transition-all" />
                    <span className="font-sans text-[13px] font-semibold text-neutral-200 group-hover:text-white tracking-wide transition-colors">
                      Contact Direct
                    </span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* ------------------------------------------------------- */}
          {/* COLUMN 4: STANDARDS & 3D INTERACTIVE TACTILE PANEL     */}
          {/* ------------------------------------------------------- */}
          <div
            className="sm:col-span-12 lg:col-span-2 rounded-2xl bg-gradient-to-b from-[#131728] via-[#0b0e1b] to-[#060812] border border-white/[0.14] hover:border-red-500/50 p-5 shadow-[0_22px_55px_-12px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),0_0_28px_rgba(255,42,58,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_28px_65px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,42,58,0.3),0_0_35px_rgba(255,42,58,0.22),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl relative transition-all duration-300 flex flex-col justify-between overflow-hidden group/col4 antialiased"
            style={{
              transform: pointer.active
                ? `perspective(1000px) rotateX(${pointer.tiltY * 0.25}deg) rotateY(${pointer.tiltX * 0.25}deg) translateZ(4px)`
                : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
              transition: pointer.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top Laser Horizon Specular Rim */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/60 via-white/50 to-transparent pointer-events-none" />

            {/* Dynamic Interactive Specular Spot Glint Following Pointer */}
            <div
              className="absolute inset-0 opacity-0 group-hover/col4:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(350px circle at ${pointer.x}% ${pointer.y}%, rgba(255,42,58,0.14), rgba(52,211,153,0.04) 40%, transparent 75%)`,
              }}
            />

            {/* Standards Content Block */}
            <div className="relative z-10 preserve-3d-child">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-white font-black flex items-center gap-2 antialiased">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                  <span className="tracking-widest">STANDARDS</span>
                </div>
                <span className="text-[9px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.25)]">
                  AUDITED
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0c0f1e]/90 to-[#060813]/90 border border-white/10 hover:border-emerald-500/40 relative overflow-hidden group/audit shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.08] rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-black tracking-wider mb-1.5 antialiased">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)] shrink-0" />
                  <span>Zero Fabrication</span>
                </div>

                <p className="text-[12px] font-sans font-medium text-neutral-200 leading-relaxed antialiased">
                  All metrics, credentials, career records, and project deliverables strictly correspond to authentic work.
                </p>
              </div>
            </div>

            {/* 3D Interactive Return to Top Trigger Button - Selector 2 */}
            <button
              onClick={scrollToTop}
              className="relative z-10 w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#22131b] via-[#140b12] to-[#0b0509] hover:from-[#ff2a3a] hover:via-[#dd1c2c] hover:to-[#990f1d] border-2 border-red-500/50 hover:border-red-400 border-b-[4px] border-b-[#3b0b13] hover:border-b-[#1c0408] text-white flex items-center justify-center gap-2.5 shadow-[0_4px_0_#140508,0_12px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(255,42,58,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_0_#140508,0_18px_36px_rgba(255,42,58,0.45),0_0_30px_rgba(255,42,58,0.35),inset_0_1px_1px_rgba(255,255,255,0.5)] active:translate-y-1 active:border-b-2 active:shadow-[0_1px_0_#140508,0_4px_10px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all duration-200 cursor-pointer group/btn overflow-hidden select-none antialiased"
              aria-label="Scroll back to top of page"
            >
              {/* Top Specular Rim */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

              {/* Diagonal Light Sheen Sweep on Hover */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 pointer-events-none group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />

              {/* Kinetic Glowing Up-Arrow Container */}
              <div className="w-6 h-6 rounded-lg bg-red-500/20 group-hover/btn:bg-white/20 border border-red-500/40 group-hover/btn:border-white/50 flex items-center justify-center transition-all shadow-inner">
                <ArrowUp className="w-3.5 h-3.5 text-white group-hover/btn:-translate-y-0.5 transition-transform duration-300 drop-shadow-sm" />
              </div>

              {/* Crisp High-Contrast Bold Label */}
              <span className="font-mono text-xs font-black tracking-[0.16em] uppercase text-white transition-colors drop-shadow-sm">
                RETURN TO TOP
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM COPYRIGHT & METADATA BAR — 3D CINEMATIC HUD        */}
        {/* ========================================================= */}
        <div
          className="relative mt-8 p-4 sm:p-5 rounded-2xl bg-transparent border border-white/[0.12] hover:border-red-500/40 group/hud transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden shadow-none"
          style={{
            transform: pointer.active
              ? `perspective(900px) rotateX(${pointer.tiltY * 0.25}deg) rotateY(${pointer.tiltX * 0.25}deg) translateZ(3px)`
              : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)',
            transition: pointer.active ? 'transform 0.12s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top Laser Horizon Specular Rim Line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/60 via-red-500/50 to-transparent pointer-events-none" />

          {/* Interactive Specular Glint Tracking Pointer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/hud:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(400px circle at ${pointer.x}% ${pointer.y}%, rgba(255,42,58,0.08), rgba(56,189,248,0.04) 40%, transparent 75%)`,
            }}
          />

          {/* Left: Iconic Cinematic Monogram & Operational Telemetry */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 relative z-10">
            {/* Live Operational Beacon */}
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/40 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </div>

            {/* Cinematic Identity String */}
            <div className="font-mono text-[11px] sm:text-xs tracking-wider text-neutral-300 flex items-center gap-2 antialiased">
              <span className="text-red-400 uppercase tracking-widest text-[10px] font-mono font-black">OPERATIONAL //</span>
              <span className="font-display font-black text-white tracking-[0.18em] uppercase text-xs sm:text-sm antialiased subpixel-antialiased">
                {name}
              </span>
              <span className="text-neutral-600 hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline text-neutral-300 uppercase tracking-widest text-[10px] font-bold antialiased">
                &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
              </span>
            </div>
          </div>

          {/* Right: 3D Interactive Telemetry Controls (Email & Domain) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 relative z-10">
            {/* 3D Interactive Tactical Email Badge with Instant Copy Feedback */}
            <button
              type="button"
              onClick={handleCopyEmail}
              title="Click to copy email address"
              className="relative group/email px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/[0.12] hover:border-red-500/60 text-xs font-mono tracking-wider text-white flex items-center gap-2 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_0_22px_rgba(255,42,58,0.35)] hover:-translate-y-0.5 active:scale-95 cursor-pointer antialiased"
            >
              <Mail className="w-3.5 h-3.5 text-red-400 transition-transform group-hover/email:scale-110" />
              <span className="font-bold tracking-wide text-neutral-100 group-hover/email:text-white transition-colors">{contactEmail}</span>
              {copiedEmail ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-black tracking-widest uppercase animate-in zoom-in-75 duration-200">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>COPIED</span>
                </span>
              ) : (
                <Copy className="w-3 h-3 text-neutral-400 group-hover/email:text-neutral-200 transition-colors" />
              )}
            </button>

            {/* High-Precision Live Domain Telemetry Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.09] text-xs font-mono tracking-wider text-neutral-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-cyan-400/40 transition-colors antialiased">
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-black text-white tracking-wider">{displayDomain}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
