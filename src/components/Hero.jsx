import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Cpu, Play, Pause, Volume2, VolumeX, X, Sparkles, ShieldCheck, ArrowRight, Lock, Zap, Eye } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import FeaturedBuilderCard3D from './FeaturedBuilderCard3D';

const Hero = () => {
  const navigate = useNavigate();
  const { identity, siteSettings } = usePortfolioData();
  const { isFounder, lockVault } = useAuth();
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEnteringVault, setIsEnteringVault] = useState(false);
  const videoRef = useRef(null);

  const handleEnterVaultSpecimen = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (lockVault) lockVault();
    navigate('/vault');
  };

  const intro = identity?.introVideo;
  const isIntroEnabled = Boolean(intro?.enabled && (intro?.videoUrl || '').trim());

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const isExternalEmbedVideo = isIntroEnabled && (
    intro.videoUrl.includes('youtube.com') ||
    intro.videoUrl.includes('youtu.be') ||
    intro.videoUrl.includes('vimeo.com')
  );

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const heroRef = useRef(null);
  const spotlightRef = useRef(null);
  const motesRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleHeroMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;
    if (animFrameRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    animFrameRef.current = requestAnimationFrame(() => {
      animFrameRef.current = null;
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = Math.round((((clientX - rect.left) / rect.width) * 100) * 10) / 10;
      const y = Math.round((((clientY - rect.top) / rect.height) * 100) * 10) / 10;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(circle 850px at ${x}% ${y}%, rgba(255,42,58,0.2) 0%, rgba(255,42,58,0.05) 42%, rgba(99,102,241,0.02) 65%, transparent 75%)`;
      }
      if (motesRef.current) {
        const dx = (x - 50);
        const dy = (y - 50);
        const children = motesRef.current.children;
        if (children[0]) children[0].style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
        if (children[1]) children[1].style.transform = `translate(${dx * -0.2}px, ${dy * -0.2}px)`;
        if (children[2]) children[2].style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
        if (children[3]) children[3].style.transform = `translate(${dx * -0.12}px, ${dy * -0.12}px)`;
      }
    });
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      className="min-h-[95vh] pt-32 pb-24 flex flex-col justify-center bg-transparent overflow-hidden border-b border-white/10 section-spatial-containment antialiased"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* RICH VOLUMETRIC BACKGROUND ENGINE WITH 3D DEPTH */}
      
      {/* 1. Base Precision Spatial Grid (Z-0) */}
      <div className="spatial-grid-plane bg-spatial-grid opacity-75" />

      {/* 1.2 Depth Occlusion Mask Layer (Z-5) - Naturally softens & occludes grid beneath hero editorial decks */}
      <div aria-hidden="true" className="depth-occlusion-mask-layer" />

      {/* 1b. 3D Receding Perspective Floor Plane with Dynamic Grid & Specular Horizon */}
      <div className="absolute -bottom-44 inset-x-0 h-[520px] pointer-events-none overflow-hidden opacity-75">
        <div className="w-[160%] -ml-[30%] h-full perspective-floor-grid bg-spatial-grid-dense [mask-image:linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.95)_40%,transparent_98%)]" />
        {/* Horizon glowing light bar */}
        <div className="absolute top-[28%] inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent shadow-[0_0_20px_#ff2a3a]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-transparent" />
      </div>

      {/* 2. Top-Right Scarlet Photonic Plasma Aura */}
      <div
        className="absolute -top-40 -right-40 w-[850px] sm:w-[1000px] h-[850px] sm:h-[1000px] rounded-full pointer-events-none blur-[140px] opacity-40 mix-blend-screen transition-all duration-700 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, #ff2a3a 0%, #b91c1c 45%, #7f1d1d 70%, transparent 80%)',
        }}
      />

      {/* 2b. Central Cyan-Indigo Cybernetic Beam for Chromatic Contrast */}
      <div
        className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[160px] opacity-20 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #38bdf8 0%, #6366f1 40%, transparent 70%)',
        }}
      />

      {/* 3. Bottom-Left Cybernetic Indigo/Cobalt Ambient Mesh */}
      <div
        className="absolute -bottom-40 -left-40 w-[750px] sm:w-[900px] h-[750px] sm:h-[900px] rounded-full pointer-events-none blur-[150px] opacity-30 mix-blend-screen transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, #4f46e5 0%, #1e1b4b 55%, transparent 75%)',
        }}
      />

      {/* 3b. Interactive 3D Depth Floating Particles / Optical Light Motes */}
      <div ref={motesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-2 h-2 rounded-full bg-red-400/60 shadow-[0_0_12px_#ff2a3a] blur-[0.5px] transition-transform duration-700"
          style={{
            top: '22%',
            left: '18%',
            transform: 'translate(2.25px, -2.25px)',
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/50 shadow-[0_0_10px_#38bdf8] blur-[0.5px] transition-transform duration-700"
          style={{
            top: '68%',
            left: '28%',
            transform: 'translate(-3px, 3px)',
          }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-red-500/50 shadow-[0_0_16px_#ff2a3a] blur-[0.5px] transition-transform duration-700"
          style={{
            top: '35%',
            right: '22%',
            transform: 'translate(3.75px, -3.75px)',
          }}
        />
        <div
          className="absolute w-1 h-1 rounded-full bg-indigo-300/60 shadow-[0_0_8px_#818cf8] blur-[0.5px] transition-transform duration-700"
          style={{
            top: '80%',
            right: '35%',
            transform: 'translate(-1.8px, 1.8px)',
          }}
        />
      </div>

      {/* 4. Interactive 3D Cursor-Tracking Ambient Spotlight & Parallax Glint */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle 850px at 65% 35%, rgba(255,42,58,0.2) 0%, rgba(255,42,58,0.05) 42%, rgba(99,102,241,0.02) 65%, transparent 75%)',
        }}
      />

      {/* 5. Deep Cinematic Optical Vignette (Framing the Viewport with True Depth) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,6,8,0.95)_100%)] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

      {/* 6. Precision Architectural Accent Lines & Axis Stems with Depth Nodes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl xl:max-w-[1480px] 2xl:max-w-[1560px] h-full pointer-events-none">
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/25 via-white/5 to-transparent hidden md:block">
          <div className="absolute top-36 -left-2 text-[8px] font-mono text-neutral-500 tracking-widest uppercase rotate-90 origin-left flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-ping" />
            <span>AXIS // 01_L</span>
          </div>
        </div>
        <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/25 via-white/5 to-transparent hidden md:block">
          <div className="absolute top-36 -right-2 text-[8px] font-mono text-neutral-500 tracking-widest uppercase -rotate-90 origin-right flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            <span>AXIS // 02_R</span>
          </div>
        </div>

        {/* Technical crosshair node markers at intersections */}
        <div className="absolute top-28 left-6 -translate-x-1/2 text-red-500/70 font-mono text-xs hidden md:block drop-shadow-[0_0_6px_#ff2a3a]">+</div>
        <div className="absolute top-28 right-6 translate-x-1/2 text-red-500/70 font-mono text-xs hidden md:block drop-shadow-[0_0_6px_#ff2a3a]">+</div>
        <div className="absolute bottom-16 left-6 -translate-x-1/2 text-red-500/70 font-mono text-xs hidden md:block drop-shadow-[0_0_6px_#ff2a3a]">+</div>
        <div className="absolute bottom-16 right-6 translate-x-1/2 text-red-500/70 font-mono text-xs hidden md:block drop-shadow-[0_0_6px_#ff2a3a]">+</div>
      </div>

      <div
        className="max-w-7xl xl:max-w-[1480px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full"
        style={{
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* System Breadcrumb / OS Banner with Elevated Depth */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d0e14]/95 border border-white/15 text-xs font-mono text-neutral-300 shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff2a3a] shadow-[0_0_10px_#ff2a3a] animate-pulse" />
            <span className="text-white font-medium">{siteSettings?.systemName || identity?.systemName || 'PORTFOLIO OS'}</span>
            <span className="text-neutral-600">//</span>
            <span className="text-neutral-400">AI PORTFOLIO & SYSTEMS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-950/45 border border-red-500/45 text-xs font-mono text-red-300 shadow-[0_6px_20px_rgba(255,42,58,0.22),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_#ff2a3a]" />
            <span>AI-NATIVE RUNTIME &bull; FOUNDER VAULT</span>
          </div>
        </motion.div>

        {/* Main Display Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:flex xl:flex-row xl:items-center xl:justify-between gap-10 xl:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 xl:flex-1 xl:min-w-0 space-y-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-mono tracking-[0.28em] text-neutral-400 uppercase mb-2 flex items-center gap-2">
                <span className="w-2 h-0.5 bg-red-500 rounded-full" />
                <span>PERSONAL OPERATING SPACE // IDENTITY</span>
              </p>
              <h1
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight font-display uppercase leading-[0.94] break-words bg-gradient-to-b from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {identity?.name || 'SAHIL BHATIA'}
              </h1>
            </div>

            {/* Core Hero Statement with Volumetric Depth Box */}
            <div className="relative pl-5 py-3 border-l-2 border-[#ff2a3a] bg-gradient-to-r from-red-950/30 via-[#0c0d15]/85 to-transparent rounded-r-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                &ldquo;{identity?.heroStatement || 'I build AI-powered digital experiences.'}&rdquo;
              </p>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                {identity?.subStatement || identity?.shortBio}
              </p>
            </div>

            {/* Positioning Pills with High-Definition Tactility & Razor-Sharp Contrast */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase mb-2.5 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                <span>PRIMARY ROLES & POSITIONING</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { title: 'AI Generalist', beacon: 'bg-cyan-400', glow: 'shadow-[0_0_10px_#22d3ee]', border: 'hover:border-cyan-400', shadow: 'hover:shadow-[0_12px_30px_rgba(34,211,238,0.35)]' },
                  { title: 'AI Consultant', beacon: 'bg-emerald-400', glow: 'shadow-[0_0_10px_#34d399]', border: 'hover:border-emerald-400', shadow: 'hover:shadow-[0_12px_30px_rgba(16,185,129,0.35)]' },
                  { title: 'AI-Native Builder', beacon: 'bg-red-500', glow: 'shadow-[0_0_10px_#ff2a3a]', border: 'hover:border-red-400', shadow: 'hover:shadow-[0_12px_30px_rgba(255,42,58,0.4)]' },
                  { title: 'Digital Systems Creator', beacon: 'bg-amber-400', glow: 'shadow-[0_0_10px_#fbbf24]', border: 'hover:border-amber-400', shadow: 'hover:shadow-[0_12px_30px_rgba(245,158,11,0.35)]' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`group/pos relative px-4 py-2.5 rounded-xl bg-[#0f111a] hover:bg-[#151824] border border-white/20 ${item.border} text-xs sm:text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] ${item.shadow} hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-2.5`}
                  >
                    {/* Specular hairline top glint */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/pos:via-red-400 transition-colors pointer-events-none" />
                    <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
                      <span className={`absolute w-3 h-3 rounded-full ${item.beacon}/50 animate-ping`} />
                      <span className={`relative w-1.5 h-1.5 rounded-full ${item.beacon} ${item.glow}`} />
                    </span>
                    <span className="tracking-wide text-white font-bold">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capability Themes Cluster with High Contrast */}
            <div className="pt-1">
              <div className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase mb-2 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span>CORE CAPABILITY THEMES</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { tag: 'AI + SYSTEMS', color: 'hover:border-red-400 hover:text-red-300 hover:shadow-[0_8px_22px_rgba(255,42,58,0.3)]' },
                  { tag: 'VIBE CODING', color: 'hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_8px_22px_rgba(34,211,238,0.3)]' },
                  { tag: 'AUTOMATION', color: 'hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_8px_22px_rgba(245,158,11,0.3)]' },
                  { tag: 'PRODUCT', color: 'hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_8px_22px_rgba(192,132,252,0.3)]' },
                  { tag: 'UX', color: 'hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_8px_22px_rgba(16,185,129,0.3)]' },
                ].map((item) => (
                  <span
                    key={item.tag}
                    className={`group/theme px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider bg-[#0d0e17] hover:bg-[#131522] border border-white/20 text-white ${item.color} shadow-[0_4px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-1.5`}
                  >
                    <span className="text-red-400 group-hover/theme:scale-125 transition-transform font-extrabold">#</span>
                    <span className="font-bold text-white tracking-wider">{item.tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Group with High-Contrast Multi-Tier 3D Interactive Instruments */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="group/cta px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ff2a3a] to-[#d61928] hover:from-[#ff3d4c] hover:to-[#e61e2f] text-white font-mono text-xs uppercase tracking-wider font-black transition-all shadow-[0_12px_35px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_18px_45px_rgba(255,42,58,0.7),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center gap-2.5 border border-red-400/50 cursor-pointer"
              >
                <span className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute w-3 h-3 rounded-full bg-white/60 animate-ping" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                </span>
                <span className="font-black tracking-wider text-white">Inspect Curated Projects</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover/cta:translate-y-1" />
              </a>

              <a
                href="#ai-systems"
                className="group/arch px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#161826] via-[#10121c] to-[#0a0b12] border border-white/25 hover:border-red-500/70 text-white font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#1a1c2c] transition-all shadow-[0_10px_25px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.22)] hover:shadow-[0_14px_35px_rgba(255,42,58,0.3)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-red-400 group-hover/arch:scale-110 group-hover/arch:text-red-300 transition-all drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]" />
                <span className="font-extrabold tracking-wider text-white">AI Systems Architecture</span>
              </a>

              {/* CRAZY 3D INTERACTIVE FOUNDER VAULT BUTTON (ICONIC, RAZOR-SHARP & GLOWING) */}
              <button
                type="button"
                onClick={handleEnterVaultSpecimen}
                disabled={isEnteringVault}
                className="group/vault relative px-5 py-3 rounded-xl bg-gradient-to-r from-[#1c0818] via-[#12091f] to-[#0a1224] border-2 border-red-500/70 hover:border-cyan-400 text-white transition-all duration-300 shadow-[0_12px_28px_rgba(0,0,0,0.9),0_0_24px_rgba(255,42,58,0.35)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.95),0_0_35px_rgba(34,211,238,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] flex items-center gap-3 cursor-pointer overflow-hidden"
                title="Explore Sahil's Live Founder Vault (Public Specimen Mode & Architecture)"
              >
                {/* Shimmer sweep glint */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/vault:translate-x-full transition-transform duration-1000 pointer-events-none" />
                
                {/* 3D Holographic Vault Icon */}
                <div className="relative w-7 h-7 rounded-lg bg-red-950 border border-red-500/70 flex items-center justify-center text-red-400 group-hover/vault:border-cyan-400 group-hover/vault:text-cyan-300 group-hover/vault:rotate-12 transition-all shadow-[0_0_14px_rgba(255,42,58,0.7)] shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-wider text-white uppercase group-hover/vault:text-cyan-200 transition-colors">
                      FOUNDER VAULT
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 font-mono text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(34,211,238,0.35)]">
                      SPECIMEN
                    </span>
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3 h-3 rounded-full bg-cyan-400/60 animate-ping" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wider flex items-center gap-1 group-hover/vault:text-white transition-colors">
                    ⚡ EXPLORE LIVE ARCHITECTURE
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover/vault:translate-x-1 transition-transform ml-1" />
              </button>

              {isIntroEnabled && (
                <button
                  type="button"
                  onClick={() => setShowIntroModal(true)}
                  className="px-5 py-3.5 rounded-xl bg-[#121420] hover:bg-[#1a1c2d] border border-red-500/40 text-white font-mono text-xs uppercase tracking-wider font-extrabold transition-all flex items-center gap-2 group shadow-[0_10px_25px_rgba(255,42,58,0.2)] hover:shadow-[0_15px_35px_rgba(255,42,58,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-[0_0_8px_#ff2a3a]">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </div>
                  <span className="font-extrabold text-white">PLAY INTRO VIDEO</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-mono font-bold">
                    {intro.durationBadge || '90 SEC'}
                  </span>
                </button>
              )}
            </div>
          </motion.div>

          {/* 3D FEATURED BUILDER CARD COLUMN (Elevated Viewport Presence) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 xl:flex-none xl:w-[570px] 2xl:w-[580px] flex justify-center items-center lg:-mt-6 xl:-mt-2"
          >
            <FeaturedBuilderCard3D />
          </motion.div>
        </div>
      </div>

      {/* Cinematic Intro Video Modal */}
      {showIntroModal && isIntroEnabled && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setShowIntroModal(false);
            if (videoRef.current) videoRef.current.pause();
          }}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-[#0d0e14] border border-white/20 p-5 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                  {intro.durationBadge || 'FOUNDER PERSPECTIVE'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                  {intro.headline || 'Founder Introduction // Sahil Bhatia'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowIntroModal(false);
                  if (videoRef.current) videoRef.current.pause();
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {intro.subheadline && (
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {intro.subheadline}
              </p>
            )}

            {/* Video Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black">
              {isExternalEmbedVideo ? (
                <iframe
                  src={getEmbedUrl(intro.videoUrl)}
                  title="Founder Introduction Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={intro.videoUrl}
                    poster={intro.videoPosterUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="font-mono text-[10px] text-neutral-300">
                        OFFICIAL FOUNDER DISPATCH
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
