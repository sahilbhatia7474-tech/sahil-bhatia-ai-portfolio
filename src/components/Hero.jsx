import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Cpu, Play, Pause, Volume2, VolumeX, X, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import FeaturedBuilderCard3D from './FeaturedBuilderCard3D';

const Hero = () => {
  const navigate = useNavigate();
  const { identity, siteSettings } = usePortfolioData();
  const { lockVault } = useAuth();
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const videoRef = useRef(null);

  const handleOpenResume = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsNavigating(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('vault-transition', {
          detail: {
            isOpen: true,
            direction: 'resume',
            title: 'INITIALIZING VERIFIED DOSSIER',
            subtitle: 'Decrypting Sahil Bhatia’s official curriculum vitae, verified engineering credentials & system telemetry...',
          },
        })
      );
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setTimeout(() => {
      navigate('/resume');
    }, 420);
    setTimeout(() => {
      setIsNavigating(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('vault-transition', {
            detail: { isOpen: false, direction: 'resume' },
          })
        );
      }
    }, 800);
  };

  const handleEnterVaultSpecimen = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (lockVault) lockVault();
    setIsNavigating(true);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('vault-transition', {
          detail: {
            isOpen: true,
            direction: 'gateway',
            title: 'INITIALIZING SECURITY GATEWAY',
            subtitle: 'Establishing zero-trust encrypted handshake with Founder Vault security terminal...',
          },
        })
      );
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setTimeout(() => {
      navigate('/vault');
    }, 420);
    setTimeout(() => {
      setIsNavigating(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('vault-transition', {
            detail: { isOpen: false, direction: 'gateway' },
          })
        );
      }
    }, 800);
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
        {/* System Breadcrumb / OS Banner with Elevated Depth (CSS Selector 5) */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#12162a]/95 via-[#0b0e1e]/98 to-[#060812] border-2 border-white/25 text-xs font-mono text-neutral-200 shadow-[0_10px_28px_rgba(0,0,0,0.85),0_0_20px_rgba(255,42,58,0.15),inset_0_1.5px_0_rgba(255,255,255,0.3)] backdrop-blur-md">
            <span className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="absolute w-4 h-4 rounded-full bg-red-500 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-[#ff2a3a] shadow-[0_0_10px_#ff2a3a]" />
            </span>
            <span className="text-white font-black tracking-wider uppercase">{siteSettings?.systemName || identity?.systemName || 'PORTFOLIO OS'}</span>
            <span className="text-red-500 font-bold">//</span>
            <span className="text-neutral-300 font-semibold tracking-wide">AI PORTFOLIO &amp; SYSTEMS ARCHITECTURE</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#2a0e16]/95 via-[#18090f]/95 to-[#0e0509] border-2 border-red-500/60 text-xs font-mono text-red-200 shadow-[0_10px_28px_rgba(255,42,58,0.25),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_#ff2a3a] animate-pulse" />
            <span className="font-bold tracking-wider">AI-NATIVE RUNTIME</span>
            <span className="text-red-400 font-bold">&bull;</span>
            <span className="text-white font-black">FOUNDER VAULT ONLINE</span>
          </div>
        </motion.div>

        {/* Main Display Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:flex xl:flex-row xl:items-center xl:justify-between gap-10 xl:gap-14 items-center">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
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
            <div className="relative pl-6 py-4 border-l-4 border-[#ff2a3a] bg-gradient-to-r from-red-950/40 via-[#0e101c]/90 to-[#070810]/80 rounded-r-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.95),0_0_30px_rgba(255,42,58,0.18),inset_0_1.5px_0_rgba(255,255,255,0.15)] backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-red-500 via-white/30 to-transparent pointer-events-none" />
              <p
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal tracking-tight text-white font-display leading-[1.18] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                &ldquo;{identity?.heroStatement || 'I build AI-powered digital experiences.'}&rdquo;
              </p>
              <p className="mt-3.5 text-sm sm:text-base text-neutral-200 max-w-2xl leading-relaxed font-sans drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-normal">
                {identity?.subStatement || identity?.shortBio}
              </p>
            </div>

            {/* Positioning Pills with High-Definition Tactility & Razor-Sharp Contrast (CSS Selector 1) */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase mb-3 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                <span>PRIMARY ROLES &amp; POSITIONING</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                {[
                  {
                    title: 'AI Generalist',
                    roleCode: 'ROLE_01',
                    beacon: 'bg-cyan-400',
                    dot: 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]',
                    cardBg: 'bg-gradient-to-b from-[#111c30] to-[#090f1c]',
                    border: 'border-2 border-cyan-500/50 hover:border-cyan-300',
                    shadow: 'hover:shadow-[0_16px_36px_rgba(34,211,238,0.4),inset_0_1.5px_0_rgba(255,255,255,0.35)]',
                    accentText: 'text-cyan-300',
                    tag: 'ORCHESTRATION',
                  },
                  {
                    title: 'AI Consultant',
                    roleCode: 'ROLE_02',
                    beacon: 'bg-emerald-400',
                    dot: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
                    cardBg: 'bg-gradient-to-b from-[#0f241c] to-[#081510]',
                    border: 'border-2 border-emerald-500/50 hover:border-emerald-300',
                    shadow: 'hover:shadow-[0_16px_36px_rgba(16,185,129,0.4),inset_0_1.5px_0_rgba(255,255,255,0.35)]',
                    accentText: 'text-emerald-300',
                    tag: 'SOLUTIONS',
                  },
                  {
                    title: 'AI-Native Builder',
                    roleCode: 'ROLE_03',
                    beacon: 'bg-red-500',
                    dot: 'bg-red-500 shadow-[0_0_10px_#ff2a3a]',
                    cardBg: 'bg-gradient-to-b from-[#281119] to-[#15080d]',
                    border: 'border-2 border-red-500/60 hover:border-red-400',
                    shadow: 'hover:shadow-[0_16px_36px_rgba(255,42,58,0.5),inset_0_1.5px_0_rgba(255,255,255,0.35)]',
                    accentText: 'text-red-300',
                    tag: '0-TO-1 SHIP',
                  },
                  {
                    title: 'Digital Systems Creator',
                    roleCode: 'ROLE_04',
                    beacon: 'bg-amber-400',
                    dot: 'bg-amber-400 shadow-[0_0_10px_#fbbf24]',
                    cardBg: 'bg-gradient-to-b from-[#24190c] to-[#140d06]',
                    border: 'border-2 border-amber-500/50 hover:border-amber-300',
                    shadow: 'hover:shadow-[0_16px_36px_rgba(245,158,11,0.4),inset_0_1.5px_0_rgba(255,255,255,0.35)]',
                    accentText: 'text-amber-300',
                    tag: 'FULL STACK',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`group/pos relative px-4 py-3 rounded-2xl ${item.cardBg} ${item.border} ${item.shadow} shadow-[0_10px_25px_rgba(0,0,0,0.85),inset_0_1.5px_0_rgba(255,255,255,0.22)] hover:-translate-y-1.5 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between select-none min-w-[140px]`}
                  >
                    {/* Top specular hairline glint */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[9px] text-neutral-400 font-black tracking-widest uppercase">
                        {item.roleCode}
                      </span>
                      <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
                        <span className={`absolute w-3.5 h-3.5 rounded-full ${item.beacon}/60 animate-ping`} />
                        <span className={`relative w-1.5 h-1.5 rounded-full ${item.dot}`} />
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <span className="tracking-wide text-white font-bold font-sans text-xs sm:text-sm">
                        {item.title}
                      </span>
                    </div>

                    <span className={`text-[9px] font-mono font-black tracking-wider uppercase mt-1 ${item.accentText}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Capability Themes Cluster with High Contrast (CSS Selector 2) */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase mb-2.5 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span>CORE CAPABILITY THEMES</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { tag: 'AI + SYSTEMS', color: 'hover:border-red-400 hover:text-red-300 hover:shadow-[0_10px_26px_rgba(255,42,58,0.4)]', bg: 'hover:bg-red-950/40' },
                  { tag: 'VIBE CODING', color: 'hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_10px_26px_rgba(34,211,238,0.4)]', bg: 'hover:bg-cyan-950/40' },
                  { tag: 'AUTOMATION', color: 'hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_10px_26px_rgba(245,158,11,0.4)]', bg: 'hover:bg-amber-950/40' },
                  { tag: 'PRODUCT', color: 'hover:border-purple-400 hover:text-purple-300 hover:shadow-[0_10px_26px_rgba(192,132,252,0.4)]', bg: 'hover:bg-purple-950/40' },
                  { tag: 'UX', color: 'hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_10px_26px_rgba(16,185,129,0.4)]', bg: 'hover:bg-emerald-950/40' },
                ].map((item) => (
                  <span
                    key={item.tag}
                    className={`group/theme px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider bg-gradient-to-b from-[#131728] to-[#0a0d18] border-2 border-white/20 text-white ${item.color} ${item.bg} shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-1 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2 select-none`}
                  >
                    <span className="text-red-400 group-hover/theme:scale-125 transition-transform font-extrabold text-sm">#</span>
                    <span className="font-extrabold text-white tracking-wider">{item.tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Group with High-Contrast Multi-Tier 3D Interactive Instruments (CSS Selector 1) */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4.5">
              {/* Primary Action 1: Inspect Curated Projects */}
              <a
                href="#projects"
                className="group/cta relative px-6 py-4 rounded-2xl bg-gradient-to-r from-[#ff2a3a] via-[#e51d30] to-[#b91522] text-white font-mono text-xs uppercase tracking-wider font-black transition-all duration-300 shadow-[0_14px_38px_rgba(255,42,58,0.55),0_4px_14px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_20px_52px_rgba(255,42,58,0.8),0_6px_20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.65)] hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] flex items-center gap-3.5 border border-red-300/40 cursor-pointer overflow-hidden select-none"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {/* Diagonal Specular Sheen Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 pointer-events-none" />
                {/* Top Specular Horizon Edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
                {/* Bottom Bevel Shadow Edge */}
                <div className="absolute bottom-0 inset-x-0 h-[1px] bg-black/40 pointer-events-none" />

                {/* 3D Pulsing Dual-Radar Beacon */}
                <span className="relative flex items-center justify-center w-3 h-3 shrink-0">
                  <span className="absolute w-5 h-5 rounded-full bg-white/50 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                </span>

                <div className="flex flex-col text-left">
                  <span className="font-black tracking-wider text-white font-display text-xs sm:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    Inspect Curated Projects
                  </span>
                  <span className="text-[9px] font-mono text-red-100 font-bold tracking-widest uppercase">
                    PRODUCTION WORK // CASE STUDIES
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-black/25 border border-white/25 flex items-center justify-center shrink-0 group-hover/cta:bg-black/40 transition-colors ml-0.5">
                  <ArrowDown className="w-4 h-4 transition-transform group-hover/cta:translate-y-1 text-white shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                </div>
              </a>

              {/* Primary Action 2: AI Systems Architecture */}
              <a
                href="#ai-systems"
                className="group/arch relative px-5.5 py-3.5 rounded-2xl bg-gradient-to-b from-[#181c30] via-[#101322] to-[#090b16] border border-white/25 hover:border-cyan-400 text-white font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#1f243c] transition-all duration-300 shadow-[0_14px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_20px_48px_rgba(6,182,212,0.42),0_0_32px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] flex items-center gap-3.5 cursor-pointer overflow-hidden select-none"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {/* Diagonal Specular Sheen Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent -translate-x-full group-hover/arch:translate-x-full transition-transform duration-1000 pointer-events-none" />
                {/* Top Specular Edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />
                
                {/* 3D Silicon Processor Node */}
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-cyan-900/90 via-cyan-950/95 to-[#061218] border border-cyan-400/70 flex items-center justify-center text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] group-hover/arch:scale-110 group-hover/arch:rotate-6 transition-all shrink-0">
                  <Cpu className="w-4.5 h-4.5 text-cyan-300 drop-shadow-[0_0_10px_#22d3ee]" />
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-extrabold tracking-wider text-white group-hover:text-cyan-200 transition-colors font-display text-xs sm:text-[13px]">
                    AI Systems Architecture
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                    <span className="text-[10px] text-neutral-300 font-mono font-medium tracking-tight">
                      8 Live Deployed Systems
                    </span>
                  </div>
                </div>
              </a>

              {/* Primary Action 3: FOUNDER VAULT SPECIMEN (With Full Cyber Transition) */}
              <button
                type="button"
                onClick={handleEnterVaultSpecimen}
                disabled={isNavigating}
                className="group/vault relative px-5.5 py-3.5 rounded-2xl bg-gradient-to-r from-[#22091c] via-[#140a22] to-[#0a1226] border-2 border-red-500/75 hover:border-cyan-400 text-white transition-all duration-300 shadow-[0_14px_38px_rgba(0,0,0,0.95),0_0_30px_rgba(255,42,58,0.4)] hover:shadow-[0_20px_52px_rgba(0,0,0,0.98),0_0_45px_rgba(34,211,238,0.65)] hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] flex items-center gap-3.5 cursor-pointer overflow-hidden select-none"
                title="Explore Sahil's Live Founder Vault (Public Specimen Mode & Architecture)"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {/* Shimmer sweep glint */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/vault:translate-x-full transition-transform duration-1000 pointer-events-none" />
                {/* Top Specular Edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400/90 to-transparent pointer-events-none" />
                
                {/* 3D Holographic Vault Icon Cube */}
                <div className="relative w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-red-900/95 via-red-950/95 to-[#1c080d] border border-red-500/80 flex items-center justify-center text-red-400 group-hover/vault:border-cyan-400 group-hover/vault:text-cyan-300 group-hover/vault:rotate-12 transition-all shadow-[0_0_18px_rgba(255,42,58,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] shrink-0">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-wider text-white uppercase group-hover/vault:text-cyan-200 transition-colors">
                      FOUNDER VAULT
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 font-mono text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(34,211,238,0.45)]">
                      SPECIMEN
                    </span>
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400/60 animate-ping" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wider flex items-center gap-1 group-hover/vault:text-white transition-colors mt-0.5">
                    ⚡ EXPLORE LIVE ARCHITECTURE
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover/vault:translate-x-1.5 transition-transform ml-1 shrink-0 drop-shadow-[0_0_8px_#22d3ee]" />
              </button>

              {/* Primary Action 4: DEDICATED VERIFIED RESUME & CV CTA (With Full Vault-Style Cyber Page Transition) */}
              <button
                type="button"
                onClick={handleOpenResume}
                disabled={isNavigating}
                className="group/resume relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#0d2825] via-[#091e1d] to-[#051415] border-2 border-emerald-500/80 hover:border-emerald-300 text-white font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-[#12332f] transition-all duration-300 shadow-[0_14px_38px_rgba(0,0,0,0.95),0_0_32px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_52px_rgba(0,0,0,0.98),0_0_48px_rgba(16,185,129,0.75)] hover:-translate-y-1.5 active:translate-y-0.5 active:scale-[0.98] flex items-center gap-3.5 cursor-pointer overflow-hidden select-none"
                title="Open Sahil Bhatia's Verified Curriculum Vitae (with Full Vault-Style Cyber Transition)"
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  textRendering: 'optimizeLegibility',
                }}
              >
                {/* Diagonal Specular Sheen Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent -translate-x-full group-hover/resume:translate-x-full transition-transform duration-1000 pointer-events-none" />
                {/* Top Specular Edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/90 to-transparent pointer-events-none" />

                {/* 3D Holographic Document Cube */}
                <div className="relative w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-800/95 via-emerald-950/95 to-[#061812] border border-emerald-400/85 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.75),inset_0_1px_0_rgba(255,255,255,0.45)] group-hover/resume:scale-110 group-hover/resume:rotate-6 transition-all shrink-0">
                  <FileText className="w-4.5 h-4.5 drop-shadow-[0_0_10px_#34d399]" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-wider text-white uppercase group-hover/resume:text-emerald-200 transition-colors">
                      VIEW RESUME
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/95 border border-emerald-400/70 text-emerald-300 font-mono text-[9px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.45)]">
                      CV
                    </span>
                    <span className="relative flex items-center justify-center w-2 h-2">
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/60 animate-ping" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono font-bold tracking-wider flex items-center gap-1 group-hover/resume:text-white transition-colors mt-0.5">
                    ⚡ VERIFIED DOSSIER · PRINT / PDF
                  </span>
                </div>

                <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-400/60 flex items-center justify-center ml-0.5 shrink-0 group-hover/resume:bg-emerald-900 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 group-hover/resume:translate-x-0.5 transition-transform shrink-0 drop-shadow-[0_0_8px_#34d399]" />
                </div>
              </button>

              {/* Primary Action 5: Play Intro Video (if enabled) */}
              {isIntroEnabled && (
                <button
                  type="button"
                  onClick={() => setShowIntroModal(true)}
                  className="px-5.5 py-3.5 rounded-2xl bg-gradient-to-b from-[#181a28] via-[#10121d] to-[#090a12] hover:bg-[#1d2035] border border-red-500/50 hover:border-red-400 text-white font-mono text-xs uppercase tracking-wider font-extrabold transition-all duration-300 flex items-center gap-3 group/intro shadow-[0_14px_32px_rgba(255,42,58,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_18px_40px_rgba(255,42,58,0.45)] hover:-translate-y-1.5 active:translate-y-0.5 cursor-pointer select-none"
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility',
                  }}
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white group-hover/intro:scale-110 transition-transform shadow-[0_0_14px_#ff2a3a]">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-white group-hover/intro:text-red-300 transition-colors font-display text-xs">PLAY INTRO VIDEO</span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      {intro.durationBadge || '90 SEC'} &middot; EXECUTIVE BRIEF
                    </span>
                  </div>
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
