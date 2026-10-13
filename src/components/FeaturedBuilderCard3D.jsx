import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import {
  Terminal,
  Compass,
  ShieldCheck,
  Cpu,
  Zap,
  Sparkles,
  Copy,
  Check,
  Activity,
  Layers,
  Shield,
} from 'lucide-react';

const DEFAULT_PORTRAIT = 'https://i.ibb.co/svvJ3Fnc/793090671-2240593123170371-3167005344409012686-n.jpg';

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
    }
  } catch {
    // AudioContext blocked or not supported - silent graceful fallback
  }
}

const FeaturedBuilderCard3D = ({ identity: propIdentity, featuredPortrait: propPortrait, inVault = false } = {}) => {
  const contextData = usePortfolioData() || {};
  const identity = propIdentity || contextData.identity;
  const featuredPortrait = propPortrait || contextData.featuredPortrait;
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [magX, setMagX] = useState(0);
  const [magY, setMagY] = useState(0);
  const [normX, setNormX] = useState(0);
  const [normY, setNormY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0.15 });
  const [imgLoadFailed, setImgLoadFailed] = useState(false);
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'VECTORS' | 'TELEMETRY'
  const [isCopiedHash, setIsCopiedHash] = useState(false);

  const touchStartRef = useRef({ x: 0, y: 0, initialRotX: 0, initialRotY: 0, initialMagX: 0, initialMagY: 0 });
  const animFrameRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);

  // Responsive tilt and magnetic limits (controlled angles prevent texture blur while preserving 3D presence)
  const MAX_ROT_X = 10;
  const MAX_ROT_Y = 12;
  const MAX_MAG_X = 14;
  const MAX_MAG_Y = 10;

  // Keep refs in sync for the ambient animation loop
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isInteractingRef.current = isInteracting;
  }, [isInteracting]);

  // Ambient gentle floating animation when idle (gives persistent living depth)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let startTime = performance.now();
    let lastRenderTime = 0;
    let ambientFrameId;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !ambientFrameId) {
          startTime = performance.now();
          ambientFrameId = requestAnimationFrame(runAmbientLoop);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const runAmbientLoop = (time) => {
      if (!isVisible) {
        ambientFrameId = null;
        return;
      }

      if (!isHoveredRef.current && !isInteractingRef.current) {
        if (time - lastRenderTime >= 46) {
          lastRenderTime = time;
          const elapsed = (time - startTime) * 0.001;
          const floatRotX = Math.sin(elapsed * 1.05) * 2.5;
          const floatRotY = Math.cos(elapsed * 0.8) * 3.2;
          const floatMagX = Math.cos(elapsed * 0.8) * 2.4;
          const floatMagY = Math.sin(elapsed * 1.05) * 1.8;
          const glareX = 50 + Math.cos(elapsed * 0.85) * 24;
          const glareY = 45 + Math.sin(elapsed * 1.05) * 24;

          setRotX(floatRotX);
          setRotY(floatRotY);
          setMagX(floatMagX);
          setMagY(floatMagY);
          setNormX(floatMagX / MAX_MAG_X);
          setNormY(floatMagY / MAX_MAG_Y);
          setGlarePos({ x: glareX, y: glareY, opacity: 0.2 });
        }
      }
      ambientFrameId = requestAnimationFrame(runAmbientLoop);
    };

    ambientFrameId = requestAnimationFrame(runAmbientLoop);

    return () => {
      observer.disconnect();
      if (ambientFrameId) cancelAnimationFrame(ambientFrameId);
    };
  }, []);

  // Spring back to rest smoothly when leaving interaction
  const springBack = useCallback(() => {
    setIsInteracting(false);
    setIsHovered(false);
    isHoveredRef.current = false;
    isInteractingRef.current = false;

    let currentRotX = rotX;
    let currentRotY = rotY;
    let currentMagX = magX;
    let currentMagY = magY;
    let currentNormX = normX;
    let currentNormY = normY;

    const animateSpring = () => {
      currentRotX *= 0.84;
      currentRotY *= 0.84;
      currentMagX *= 0.84;
      currentMagY *= 0.84;
      currentNormX *= 0.84;
      currentNormY *= 0.84;

      if (
        Math.abs(currentRotX) < 0.05 &&
        Math.abs(currentRotY) < 0.05 &&
        Math.abs(currentMagX) < 0.05 &&
        Math.abs(currentMagY) < 0.05
      ) {
        setRotX(0);
        setRotY(0);
        setMagX(0);
        setMagY(0);
        setNormX(0);
        setNormY(0);
        cancelAnimationFrame(animFrameRef.current);
      } else {
        setRotX(currentRotX);
        setRotY(currentRotY);
        setMagX(currentMagX);
        setMagY(currentMagY);
        setNormX(currentNormX);
        setNormY(currentNormY);
        animFrameRef.current = requestAnimationFrame(animateSpring);
      }
    };
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animateSpring);
  }, [rotX, rotY, magX, magY, normX, normY]);

  const mouseAnimRef = useRef(null);

  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (mouseAnimRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    mouseAnimRef.current = requestAnimationFrame(() => {
      mouseAnimRef.current = null;
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const nX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
      const nY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

      setRotX(-nY * MAX_ROT_X);
      setRotY(nX * MAX_ROT_Y);
      setMagX(nX * MAX_MAG_X);
      setMagY(nY * MAX_MAG_Y);
      setNormX(nX);
      setNormY(nY);
      setIsHovered(true);

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlarePos({ x: glareX, y: glareY, opacity: 0.45 });
    });
  };

  const handleMouseEnter = () => {
    cancelAnimationFrame(animFrameRef.current);
    setIsHovered(true);
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    springBack();
  };

  // Mobile Touch Handling
  const handleTouchStart = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(animFrameRef.current);
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialRotX: rotX,
      initialRotY: rotY,
      initialMagX: magX,
      initialMagY: magY,
    };
    setIsInteracting(true);
    isInteractingRef.current = true;

    setRotX(-3);
    setRotY(4);
    setMagX(3);
    setMagY(2);
    setNormX(0.2);
    setNormY(0.15);
    setGlarePos({ x: 45, y: 35, opacity: 0.35 });
  };

  const handleTouchMove = (e) => {
    if (!isInteracting) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaY > 16 && absDeltaY > absDeltaX * 1.5) {
      springBack();
      return;
    }

    const targetY = Math.min(Math.max(deltaX * 0.1, -MAX_ROT_Y), MAX_ROT_Y);
    const targetX = Math.min(Math.max(-deltaY * 0.08, -MAX_ROT_X), MAX_ROT_X);
    const targetMagX = Math.min(Math.max(deltaX * 0.06, -MAX_MAG_X), MAX_MAG_X);
    const targetMagY = Math.min(Math.max(deltaY * 0.05, -MAX_MAG_Y), MAX_MAG_Y);

    setRotX(targetX);
    setRotY(targetY);
    setMagX(targetMagX);
    setMagY(targetMagY);
    setNormX(targetMagX / MAX_MAG_X);
    setNormY(targetMagY / MAX_MAG_Y);

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const gX = ((touch.clientX - rect.left) / rect.width) * 100;
      const gY = ((touch.clientY - rect.top) / rect.height) * 100;
      setGlarePos({ x: Math.max(0, Math.min(100, gX)), y: Math.max(0, Math.min(100, gY)), opacity: 0.45 });
    }
  };

  const handleTouchEnd = () => {
    springBack();
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Strict Source Priority
  let rawUrl = featuredPortrait?.imageUrl?.trim();
  if (
    !rawUrl ||
    rawUrl === '/sahil-bhatia-portrait.svg' ||
    rawUrl === '/assets/sahil-bhatia-portrait.svg' ||
    rawUrl.includes('photo-1534528741775-53994a69daeb') ||
    rawUrl.includes('images.unsplash.com') ||
    rawUrl.includes('6b11af4b15e4af08250249f3e7843105207218b7d28134efe4d9b12deb0ae097') ||
    rawUrl.includes('SDv65zB3')
  ) {
    rawUrl = DEFAULT_PORTRAIT;
  }
  const portraitUrl = rawUrl;
  const altText = featuredPortrait?.altText || 'Sahil Bhatia — AI-Native Builder and Systems Architect';

  // Configurable Copy
  const cardHeader = featuredPortrait?.header || 'FOUNDER CARD';
  const cardRole = featuredPortrait?.role || 'SYSTEMS ARCHITECT';
  const cardDescription = featuredPortrait?.description || 'Designing scalable systems.\nBuilding intelligent solutions.';
  const cardStatusLabel = featuredPortrait?.statusLabel || 'SYSTEM STATUS';
  const cardStatus = featuredPortrait?.status || 'ACTIVE';
  const cardName = featuredPortrait?.name || identity?.name || 'SAHIL BHATIA';
  const cardPositioning = featuredPortrait?.positioning || 'AI-NATIVE BUILDER • SYSTEMS ARCHITECT';
  const cardCapabilities = featuredPortrait?.capabilities || ['AI AGENTS', 'WORKFLOWS', 'AUTOMATION', 'MCP'];
  const cardCapabilityVectors = featuredPortrait?.capabilityVectors || [
    'AI SYSTEMS ARCHITECTURE',
    'AI-NATIVE DEVELOPMENT',
    'AUTOMATION & WORKFLOWS',
  ];
  const footerLead = featuredPortrait?.footerLead || 'BUILDING INTELLIGENT SYSTEMS';
  const footerSub = featuredPortrait?.footerSub || 'FOR REAL IMPACT.';

  // Hash signature for verification
  const identityHash = useMemo(() => 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f4d9b12deb0ae097f5', []);

  const handleCopyHash = () => {
    playTactileFeedback('copy');
    navigator.clipboard?.writeText(identityHash);
    setIsCopiedHash(true);
    setTimeout(() => setIsCopiedHash(false), 2200);
  };

  const handleTabChange = (t) => {
    playTactileFeedback('tab');
    setActiveTab(t);
  };

  // Real-time Dynamic Cast Shadows
  const dynamicShadowX = -rotY * 2.2 - magX * 1.2;
  const dynamicShadowY = rotX * 2.0 + magY * 0.8 + 28;
  const dynamicShadowBlur = 55 + Math.abs(rotX) * 1.5 + Math.abs(rotY) * 1.5;
  const dynamicGlowX = -rotY * 1.1 - magX;
  const dynamicGlowY = rotX * 1.1 + magY * 0.5;

  return (
    <div
      ref={containerRef}
      className="py-3 sm:py-6 w-full xl:w-auto flex flex-col justify-center items-center relative"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* 1. 3D GROUND AMBIENT OCCLUSION SHADOW (Child 1) */}
      <div
        className="absolute -bottom-10 sm:-bottom-16 left-1/2 -translate-x-1/2 w-[90%] sm:w-[96%] h-16 sm:h-24 bg-black/98 blur-3xl rounded-[100%] pointer-events-none transition-all duration-300"
        style={{
          transform: `translateX(${(-rotY * 2.2 - magX * 1.2).toFixed(1)}px) translateY(${(-magY * 0.5).toFixed(1)}px) scale(${
            isPressed ? 0.94 : isHovered || isInteracting ? 1.08 : 1
          })`,
          opacity: isPressed ? 0.99 : isHovered ? 0.95 : 0.8,
        }}
      />

      {/* 2. Laser Red & Ember Backlight Corona (Child 2) */}
      <div
        className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 w-[78%] h-12 sm:h-16 bg-gradient-to-r from-red-600/35 via-rose-500/25 to-red-600/35 blur-2xl rounded-[100%] pointer-events-none transition-all duration-300"
        style={{
          transform: `translateX(${(-rotY * 1.8 - magX * 1.0).toFixed(1)}px)`,
          opacity: isHovered || isInteracting ? 0.75 : 0.4,
        }}
      />

      {/* 3. Mid-Depth Ambient Aura behind card (Child 3) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[85%] bg-red-600/10 blur-[90px] rounded-full pointer-events-none transition-opacity duration-500"
        style={{
          transform: `translate(${dynamicGlowX.toFixed(1)}px, ${dynamicGlowY.toFixed(1)}px)`,
          opacity: isHovered || isInteracting ? 0.8 : 0.45,
        }}
      />

      {/* 4. FLOATING 3D SPATIAL TELEMETRY HUD CHIP (Child 4) */}
      <div
        className="mb-2.5 flex items-center justify-between w-full max-w-[295px] xs:max-w-[330px] sm:max-w-[380px] xl:max-w-[570px] px-1 pointer-events-none transition-transform duration-150"
        style={{ transform: `translate(${(magX * 0.35).toFixed(1)}px, ${(magY * 0.35).toFixed(1)}px)` }}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-neutral-200 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <Compass className="w-3.5 h-3.5 text-[#ff2a3a] animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-white font-bold">MAGNETIC 3D CHASSIS</span>
          <span className="text-neutral-500">//</span>
          <span className="text-red-400 font-bold">
            X:{rotX.toFixed(1)}° Y:{rotY.toFixed(1)}°
          </span>
          <span className="hidden xs:inline text-neutral-500">|</span>
          <span className="hidden xs:inline text-emerald-400 font-mono text-[9px] font-semibold">
            LIVE PARALLAX
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-300 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <span className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute w-3 h-3 rounded-full bg-emerald-400/50 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </span>
          <span className="font-semibold text-emerald-400">
            {isHovered || isInteracting ? 'ACTIVE TRACKING' : 'MAGNETIC READY'}
          </span>
        </div>
      </div>

      {/* 5. THE 3D CARD BODY (Child 5: cardRef) */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full ${
          inVault
            ? 'max-w-[380px] h-[600px]'
            : 'max-w-[295px] xs:max-w-[330px] sm:max-w-[380px] md:max-w-[380px] lg:max-w-[380px] xl:w-[570px] xl:max-w-[570px] 2xl:w-[580px] 2xl:max-w-[580px] h-[540px] sm:h-[620px] md:h-[620px] lg:h-[620px] xl:h-[915px] 2xl:h-[930px]'
        } rounded-3xl bg-[#08090e] border border-red-500/40 cursor-grab active:cursor-grabbing transition-all duration-200 select-none`}
        style={{
          transform: `translate(${magX.toFixed(2)}px, ${magY.toFixed(2)}px) ${
            isPressed ? 'scale(1.02)' : isHovered || isInteracting ? 'scale(1.015)' : 'scale(1)'
          }`,
          boxShadow: `
            ${dynamicShadowX}px ${dynamicShadowY}px ${dynamicShadowBlur}px -15px rgba(0, 0, 0, 0.98),
            0 25px 45px -10px rgba(0, 0, 0, 0.9),
            ${dynamicGlowX}px ${dynamicGlowY}px 65px -6px rgba(255, 42, 58, ${
            isHovered || isInteracting ? 0.38 : 0.2
          }),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.28),
            inset 0 -2px 4px rgba(0, 0, 0, 0.9)
          `,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}
      >
        {/* Child 1 of cardRef: PHYSICAL CARD RIM */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/15 ring-1 ring-[#ff2a3a]/40 shadow-[inset_0_0_20px_rgba(255,42,58,0.1)]" />

        {/* Child 2 of cardRef: Corner Guard Top-Left */}
        <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ff2a3a] drop-shadow-[0_0_6px_rgba(255,42,58,0.9)]" />

        {/* Child 3 of cardRef: Corner Guard Top-Right */}
        <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ff2a3a] drop-shadow-[0_0_6px_rgba(255,42,58,0.9)]" />

        {/* Child 4 of cardRef: Corner Guard Bottom-Left */}
        <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ff2a3a] drop-shadow-[0_0_6px_rgba(255,42,58,0.9)]" />

        {/* Child 5 of cardRef: Corner Guard Bottom-Right */}
        <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ff2a3a] drop-shadow-[0_0_6px_rgba(255,42,58,0.9)]" />

        {/* Child 6 of cardRef: SPECULAR METALLIC OVERLAY */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-150 mix-blend-screen"
          style={{
            background: `radial-gradient(circle 420px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 42, 58, 0.16) 35%, rgba(99, 102, 241, 0.08) 65%, transparent 85%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* Child 7 of cardRef: CARD INTERNAL CONTAINER (Targeted by CSS Selector 1) */}
        <div
          className={`relative w-full h-full p-4 sm:p-5 lg:p-6 ${
            inVault ? '' : 'xl:p-8'
          } flex flex-col justify-between overflow-hidden rounded-3xl`}
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          {/* LAYER 1: TOP HUD & 3D INTERACTIVE GLOWING BLINKING TABS */}
          <div className="z-20 pb-3 border-b border-white/15 bg-[#08090e] rounded-2xl -mx-1 px-3.5 pt-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.95)] space-y-2.5">
            {/* Header Line: FOUNDER CARD & ROLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] lg:text-xs xl:text-sm tracking-wider text-white">
                <span className="relative flex items-center justify-center w-2.5 h-2.5">
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-red-500/60 animate-ping" />
                  <span className="relative w-2 h-2 rounded-full bg-[#ff2a3a] shadow-[0_0_10px_#ff2a3a]" />
                </span>
                <span className="text-white font-black tracking-widest uppercase">{cardHeader}</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.1] border border-white/20 text-[9px] xl:text-[10px] font-extrabold text-red-300">
                  VERIFIED BUILDER
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-950/90 to-black border border-red-500/60 text-[10px] lg:text-[11px] xl:text-xs font-mono text-red-300 uppercase tracking-widest font-bold shadow-[0_4px_12px_rgba(255,42,58,0.3)]">
                <span className="text-neutral-300">ROLE:</span>
                <span className="text-white font-extrabold">{cardRole}</span>
              </div>
            </div>

            {/* 3D INTERACTIVE GLOWING BLINKING TABS BAR */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/80 border border-white/15">
              {[
                { id: 'OVERVIEW', label: 'OVERVIEW', beacon: 'red' },
                { id: 'VECTORS', label: 'CAPABILITIES', beacon: 'cyan' },
                { id: 'TELEMETRY', label: 'TELEMETRY', beacon: 'emerald' },
              ].map((t) => {
                const isActive = activeTab === t.id;
                const isRed = t.beacon === 'red';
                const isCyan = t.beacon === 'cyan';
                const isEmerald = t.beacon === 'emerald';

                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg font-mono text-[10px] sm:text-xs xl:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      isActive
                        ? isRed
                          ? 'bg-gradient-to-r from-[#ff2a3a] to-[#d61928] text-white border border-red-400/60 shadow-[0_2px_14px_rgba(255,42,58,0.6)]'
                          : isCyan
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/60 shadow-[0_2px_14px_rgba(34,211,238,0.6)]'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/60 shadow-[0_2px_14px_rgba(16,185,129,0.6)]'
                        : 'text-neutral-200 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {/* Blinking Beacon */}
                    <span className="relative flex items-center justify-center w-1.5 h-1.5">
                      <span
                        className={`absolute w-2.5 h-2.5 rounded-full animate-ping ${
                          isActive
                            ? 'bg-white/70'
                            : isRed
                            ? 'bg-red-500/50'
                            : isCyan
                            ? 'bg-cyan-400/50'
                            : 'bg-emerald-400/50'
                        }`}
                      />
                      <span
                        className={`relative w-1.5 h-1.5 rounded-full ${
                          isActive
                            ? 'bg-white shadow-[0_0_6px_#ffffff]'
                            : isRed
                            ? 'bg-red-500 shadow-[0_0_4px_#ff2a3a]'
                            : isCyan
                            ? 'bg-cyan-400 shadow-[0_0_4px_#22d3ee]'
                            : 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                        }`}
                      />
                    </span>
                    <span className="font-extrabold tracking-wider">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Header HUD: Description / Directive */}
            <div className="flex items-start justify-between gap-2 pt-1 border-t border-white/10 font-mono text-[10px] lg:text-[11px] xl:text-xs">
              <div
                className={`space-y-0.5 text-left ${
                  inVault ? 'max-w-[190px]' : 'max-w-[190px] lg:max-w-[240px] xl:max-w-[340px]'
                }`}
              >
                <div className="text-[9px] lg:text-[10px] xl:text-[11px] text-neutral-300 uppercase tracking-wider font-extrabold">
                  CORE DIRECTIVE
                </div>
                <p className="text-white text-[10px] sm:text-[11px] lg:text-xs xl:text-[13px] leading-tight xl:leading-relaxed font-bold font-sans whitespace-pre-line drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                  {cardDescription}
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[9px] lg:text-[10px] xl:text-[11px] text-neutral-300 uppercase tracking-wider font-extrabold">
                  {cardStatusLabel}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] lg:text-[11px] xl:text-xs font-black text-emerald-400 uppercase tracking-wider mt-0.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>{cardStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 2: EMBEDDED CINEMATIC PORTRAIT & DYNAMIC CARD VIEWPORT */}
          <div
            className={`absolute inset-x-0 ${
              inVault ? 'top-28 bottom-40' : 'top-28 lg:top-32 xl:top-40 bottom-40 lg:bottom-48 xl:bottom-64'
            } z-10 overflow-hidden rounded-2xl pointer-events-none`}
            style={{
              transform: `translate(${(-normX * 10).toFixed(1)}px, ${(-normY * 8).toFixed(1)}px)`,
              transition: isInteracting ? 'none' : 'transform 0.22s ease-out',
            }}
          >
            {/* Deep canvas backdrop */}
            <div className="absolute inset-0 bg-[#06070a]" />

            {/* Razor-sharp image rendering */}
            {!imgLoadFailed ? (
              <img
                src={portraitUrl}
                alt={altText}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                  filter: 'contrast(108%) brightness(102%) saturate(102%)',
                  opacity: 0.98,
                }}
                referrerPolicy="no-referrer"
                onError={() => {
                  setImgLoadFailed(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0e14] p-6 text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 font-display font-black text-2xl tracking-widest shadow-[0_0_25px_rgba(255,42,58,0.4)]">
                  SB
                </div>
                <div className="font-mono text-xs text-white font-bold uppercase tracking-wider">
                  FOUNDER PORTFOLIO // SAHIL BHATIA
                </div>
                <div className="font-mono text-[10px] text-red-400 font-semibold uppercase tracking-widest">
                  AI-NATIVE BUILDER &bull; SYSTEMS ARCHITECT
                </div>
              </div>
            )}

            {/* ARTISTIC EDGE FALLOFF VIGNETTES */}
            <div
              className={`absolute inset-x-0 top-0 ${
                inVault ? 'h-16' : 'h-16 lg:h-20 xl:h-28'
              } bg-gradient-to-b from-[#08090e] via-[#08090e]/85 to-transparent`}
            />
            <div
              className={`absolute inset-x-0 bottom-0 ${
                inVault ? 'h-32' : 'h-32 lg:h-40 xl:h-52'
              } bg-gradient-to-t from-[#08090e] via-[#08090e]/95 to-transparent`}
            />
            <div
              className={`absolute inset-y-0 left-0 ${
                inVault ? 'w-8' : 'w-8 lg:w-10 xl:w-14'
              } bg-gradient-to-r from-[#08090e] to-transparent`}
            />
            <div
              className={`absolute inset-y-0 right-0 ${
                inVault ? 'w-8' : 'w-8 lg:w-10 xl:w-14'
              } bg-gradient-to-l from-[#08090e] to-transparent`}
            />

            {/* Volumetric Holographic Plasma Glow */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse at 85% 15%, rgba(255,42,58,0.55) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255,42,58,0.3) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* LAYER 3: LOWER CARD IDENTITY & DYNAMIC CONTENT BASED ON ACTIVE TAB */}
          <div
            className={`z-20 mt-auto ${
              inVault
                ? 'space-y-2.5 pt-3'
                : 'space-y-2.5 sm:space-y-3 lg:space-y-3.5 xl:space-y-4 pt-3 xl:pt-4'
            } bg-gradient-to-t from-[#08090e] via-[#08090e]/98 to-transparent -mx-1 px-3 pb-2 rounded-b-2xl`}
            style={{
              transform: `translate(${(normX * 8).toFixed(1)}px, ${(normY * 6).toFixed(1)}px)`,
              transition: isInteracting ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {/* TAB CONTENT: 1. OVERVIEW */}
            {activeTab === 'OVERVIEW' && (
              <>
                {/* Name and Designation */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-0.5 w-6 bg-red-500 rounded-full shadow-[0_0_8px_#ff2a3a]" />
                    <span className="font-mono text-[9px] xl:text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      IDENTITY REPOSITORY
                    </span>
                  </div>
                  <h3
                    className={`font-black font-display text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] ${
                      inVault ? 'text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl'
                    }`}
                  >
                    {cardName}
                  </h3>
                  <p
                    className={`font-mono text-neutral-200 mt-1.5 font-bold tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] ${
                      inVault ? 'text-[10.5px]' : 'text-[10.5px] sm:text-xs lg:text-sm xl:text-base'
                    }`}
                  >
                    {cardPositioning}
                  </p>
                </div>

                {/* Capability Vectors and Chips */}
                <div className="space-y-1.5">
                  <div
                    className={`font-mono uppercase tracking-widest text-neutral-300 font-extrabold flex items-center justify-between ${
                      inVault ? 'text-[8.5px]' : 'text-[8.5px] sm:text-[9px] lg:text-[10px] xl:text-[11.5px]'
                    }`}
                  >
                    <span>CAPABILITY VECTORS</span>
                    <span className="text-red-400 font-extrabold text-[8.5px] xl:text-[10px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      LIVE ARCHITECTURE
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cardCapabilityVectors.map((cap) => (
                      <span
                        key={cap}
                        className={`font-mono px-2 py-0.5 xl:px-2.5 xl:py-1 rounded-md bg-black border border-white/25 text-white font-black shadow-[0_3px_8px_rgba(0,0,0,0.85)] ${
                          inVault ? 'text-[8.5px]' : 'text-[8.5px] sm:text-[9px] lg:text-[10px] xl:text-[11px]'
                        }`}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {cardCapabilities.map((cap) => (
                      <span
                        key={cap}
                        className={`font-mono px-2 py-0.5 xl:px-2 xl:py-1 rounded-md bg-red-950/80 border border-red-500/60 text-red-200 font-extrabold shadow-[0_2px_6px_rgba(255,42,58,0.35)] ${
                          inVault ? 'text-[8.5px]' : 'text-[8.5px] sm:text-[9px] lg:text-[10px] xl:text-[11px]'
                        }`}
                      >
                        #{cap}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: 2. VECTORS (Detailed interactive capabilities) */}
            {activeTab === 'VECTORS' && (
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    CORE COMPETENCIES & STACK
                  </span>
                  <span className="text-neutral-400">[4 UNITS]</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-left font-mono">
                  {[
                    { title: 'AI AGENTS', desc: 'LangChain, state loops, tools', color: 'border-red-500/40 text-red-300' },
                    { title: 'AUTOMATION', desc: 'n8n, webhook architectures', color: 'border-amber-500/40 text-amber-300' },
                    { title: 'VIBE CODING', desc: 'Cursor, Claude Code, rapid 0-to-1', color: 'border-cyan-500/40 text-cyan-300' },
                    { title: 'FULLSTACK', desc: 'React, Vite, Node, Tailwind', color: 'border-emerald-500/40 text-emerald-300' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`p-2 rounded-xl bg-black/80 border ${item.color} shadow-[0_4px_12px_rgba(0,0,0,0.6)]`}
                    >
                      <div className="text-[10px] xl:text-[11px] font-bold text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.title}
                      </div>
                      <div className="text-[8.5px] xl:text-[9.5px] text-neutral-300 mt-0.5 leading-tight font-sans">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. TELEMETRY (Cryptographic build hash & verification) */}
            {activeTab === 'TELEMETRY' && (
              <div className="space-y-2 py-1 text-left font-mono">
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    CRYPTOGRAPHIC IDENTITY STAMP
                  </span>
                  <span className="text-emerald-400 text-[9px] font-bold">VERIFIED</span>
                </div>

                <div className="p-2.5 rounded-xl bg-black/90 border border-emerald-500/30 flex items-center justify-between gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <div className="min-w-0">
                    <div className="text-[9px] text-neutral-300 uppercase font-bold">
                      SHA-256 LEDGER HASH
                    </div>
                    <div className="text-[10px] xl:text-[11px] text-white font-black truncate">
                      {identityHash.slice(0, 24)}...
                    </div>
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[9px] font-extrabold border border-emerald-500/40 flex items-center gap-1 cursor-pointer transition-all shrink-0"
                  >
                    {isCopiedHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[9px] xl:text-[10px] text-neutral-300 px-1 font-bold">
                  <span>DEPLOYED RUNTIME: PORTFOLIO OS</span>
                  <span className="text-white font-extrabold">ZERO TELEMETRY</span>
                </div>
              </div>
            )}

            {/* Footer Statement & Platform Identifier */}
            <div
              className={`pt-2 xl:pt-3 border-t border-white/15 flex items-center justify-between font-mono ${
                inVault ? 'text-[8.5px]' : 'text-[8.5px] sm:text-[9.5px] lg:text-[10.5px] xl:text-xs'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-white font-extrabold tracking-wider">
                  {footerLead}
                </span>
                <span className="text-neutral-200 font-semibold">{footerSub}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white shrink-0 px-2.5 py-1 rounded-lg bg-black border border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <Terminal
                  className={`text-[#ff2a3a] ${
                    inVault ? 'w-2.5 h-2.5' : 'w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5'
                  }`}
                />
                <span className="tracking-wide font-black">PORTFOLIO OS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBuilderCard3D;
