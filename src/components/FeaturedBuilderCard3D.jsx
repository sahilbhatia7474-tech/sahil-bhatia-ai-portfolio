import { useRef, useState, useEffect, useCallback } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Terminal } from 'lucide-react';

const DEFAULT_PORTRAIT = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';

const FeaturedBuilderCard3D = ({ identity: propIdentity, featuredPortrait: propPortrait, inVault = false } = {}) => {
  const contextData = usePortfolioData() || {};
  const identity = propIdentity || contextData.identity;
  const featuredPortrait = propPortrait || contextData.featuredPortrait;
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [imgLoadFailed, setImgLoadFailed] = useState(false);

  const touchStartRef = useRef({ x: 0, y: 0, initialRotX: 0, initialRotY: 0 });
  const animFrameRef = useRef(null);

  // Strictly clamped tilt limits: X ~ ±8 deg, Y ~ ±12 deg
  const MAX_ROT_X = 8;
  const MAX_ROT_Y = 12;

  // Spring back to rest smoothly
  const springBack = useCallback(() => {
    setIsInteracting(false);
    setIsHovered(false);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));

    let currentX = rotX;
    let currentY = rotY;
    const animateSpring = () => {
      currentX *= 0.82;
      currentY *= 0.82;
      if (Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05) {
        setRotX(0);
        setRotY(0);
        cancelAnimationFrame(animFrameRef.current);
      } else {
        setRotX(currentX);
        setRotY(currentY);
        animFrameRef.current = requestAnimationFrame(animateSpring);
      }
    };
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animateSpring);
  }, [rotX, rotY]);

  // Desktop mouse tilt
  const handleMouseMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normalizedX = (x - centerX) / centerX; // -1 to 1
    const normalizedY = (y - centerY) / centerY; // -1 to 1

    const targetRotX = -normalizedY * MAX_ROT_X;
    const targetRotY = normalizedX * MAX_ROT_Y;

    setRotX(targetRotX);
    setRotY(targetRotY);
    setIsHovered(true);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    cancelAnimationFrame(animFrameRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    springBack();
  };

  // Mobile Touch Handling (Drag + Tap)
  const handleTouchStart = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(animFrameRef.current);
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialRotX: rotX,
      initialRotY: rotY,
    };
    setIsInteracting(true);

    setRotX(-3);
    setRotY(4);
    setGlarePos({ x: 45, y: 35, opacity: 0.3 });
  };

  const handleTouchMove = (e) => {
    if (!isInteracting) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaY > 12 && absDeltaY > absDeltaX * 1.4) {
      springBack();
      return;
    }

    const targetY = Math.min(Math.max(deltaX * 0.1, -MAX_ROT_Y), MAX_ROT_Y);
    const targetX = Math.min(Math.max(-deltaY * 0.08, -MAX_ROT_X), MAX_ROT_X);

    setRotX(targetX);
    setRotY(targetY);

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const gX = ((touch.clientX - rect.left) / rect.width) * 100;
      const gY = ((touch.clientY - rect.top) / rect.height) * 100;
      setGlarePos({ x: Math.max(0, Math.min(100, gX)), y: Math.max(0, Math.min(100, gY)), opacity: 0.4 });
    }
  };

  const handleTouchEnd = () => {
    springBack();
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Strict Source Priority: 1. Custom image in Firestore/Storage, 2. Direct URL, 3. High-quality default
  const portraitUrl = featuredPortrait?.imageUrl?.trim() || DEFAULT_PORTRAIT;
  const focalX = featuredPortrait?.focalX ?? 50;
  const focalY = featuredPortrait?.focalY ?? 20;
  const altText = featuredPortrait?.altText || 'Sahil Bhatia — AI-Native Builder and Systems Architect';

  // Configurable Copy with strict defaults required by design spec
  const cardHeader = featuredPortrait?.header || 'FOUNDER CARD';
  const cardRole = featuredPortrait?.role || 'SYSTEMS ARCHITECT';
  const cardDescription = featuredPortrait?.description || 'Designing scalable systems.\nBuilding intelligent solutions.';
  const cardStatusLabel = featuredPortrait?.statusLabel || 'SYSTEM STATUS';
  const cardStatus = featuredPortrait?.status || 'ACTIVE';
  const cardName = featuredPortrait?.name || identity?.name || 'SAHIL BHATIA';
  const cardPositioning = featuredPortrait?.positioning || 'AI-NATIVE BUILDER • SYSTEMS ARCHITECT';
  const cardCapabilities = featuredPortrait?.capabilities || ['AI AGENTS', 'WORKFLOWS', 'AUTOMATION'];
  const cardCapabilityVectors = featuredPortrait?.capabilityVectors || [
    'AI SYSTEMS ARCHITECTURE',
    'AI-NATIVE DEVELOPMENT',
    'AUTOMATION & WORKFLOWS',
  ];
  const footerLead = featuredPortrait?.footerLead || 'BUILDING INTELLIGENT SYSTEMS';
  const footerSub = featuredPortrait?.footerSub || 'FOR REAL IMPACT.';

  return (
    <div
      ref={containerRef}
      className="perspective-1000 py-2 sm:py-4 w-full xl:w-auto flex justify-center items-center select-none"
      style={{ perspective: '1200px' }}
    >
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
            : 'max-w-[295px] xs:max-w-[330px] sm:max-w-[380px] md:max-w-[380px] lg:max-w-[380px] xl:w-[646px] xl:max-w-[646px] h-[520px] sm:h-[600px] md:h-[600px] lg:h-[600px] xl:h-[1020px]'
        } rounded-2xl bg-[#090a0f] border border-red-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(255,42,58,0.12)] cursor-grab active:cursor-grabbing transition-shadow duration-300`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) ${isPressed ? 'scale(1.03) translateZ(8px)' : isHovered || isInteracting ? 'scale(1.015)' : 'scale(1)'}`,
          transition: isInteracting ? 'none' : 'transform 0.2s ease-out, box-shadow 0.3s ease',
        }}
      >
        {/* PHYSICAL CARD RIM: Thin Laser Red Accent & Metallic Bezel */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10 ring-1 ring-[#ff2a3a]/30"
          style={{ transform: 'translateZ(1px)' }}
        />

        {/* METALLIC CORNER GUARDS & HUD MICRO MARKERS */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t-2 border-l-2 border-[#ff2a3a]/80" style={{ transform: 'translateZ(4px)' }} />
        <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff2a3a]/80" style={{ transform: 'translateZ(4px)' }} />
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff2a3a]/80" style={{ transform: 'translateZ(4px)' }} />
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b-2 border-r-2 border-[#ff2a3a]/80" style={{ transform: 'translateZ(4px)' }} />

        {/* SPECULAR METALLIC GLARE / LIGHT SHEEN OVERLAY */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200"
          style={{
            transform: 'translateZ(10px)',
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.16) 0%, rgba(255,42,58,0.08) 40%, transparent 80%)`,
            opacity: glarePos.opacity,
          }}
        />

        {/* CARD INTERNAL CONTAINER WITH LAYERED DEPTH */}
        <div className={`relative w-full h-full p-4 sm:p-5 lg:p-6 ${inVault ? '' : 'xl:p-8'} flex flex-col justify-between overflow-hidden rounded-2xl`}>
          
          {/* LAYER 1: CARD TOP HUD & SYSTEM METRICS */}
          <div
            className={`z-20 pb-2.5 lg:pb-3 ${inVault ? '' : 'xl:pb-4 space-y-2 xl:space-y-3'} border-b border-white/10 bg-[#090a0f]/90 backdrop-blur-md rounded-t-xl -mx-1 px-2 pt-1`}
            style={{ transform: 'translateZ(18px)' }}
          >
            {/* Header Line: FOUNDER CARD & ROLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[10px] lg:text-xs xl:text-sm tracking-wider text-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3a] animate-pulse" />
                <span className="text-white font-bold tracking-widest uppercase">{cardHeader}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 xl:px-2.5 xl:py-1 rounded bg-red-950/40 border border-red-500/40 text-[9px] lg:text-[10px] xl:text-xs font-mono text-red-300 uppercase tracking-widest font-semibold">
                <span className="text-neutral-400">ROLE:</span>
                <span className="text-white font-bold">{cardRole}</span>
              </div>
            </div>

            {/* Sub-Header HUD: DESCRIPTION & SYSTEM STATUS */}
            <div className="flex items-start justify-between gap-2 pt-1 border-t border-white/5 font-mono text-[9px] lg:text-[10px] xl:text-xs">
              <div className={`space-y-0.5 text-left ${inVault ? 'max-w-[190px]' : 'max-w-[190px] lg:max-w-[240px] xl:max-w-[340px]'}`}>
                <div className="text-[7.5px] lg:text-[8.5px] xl:text-[9.5px] text-neutral-400 uppercase tracking-wider font-semibold">DESCRIPTION</div>
                <p className="text-neutral-200 text-[8.5px] sm:text-[9px] lg:text-[10.5px] xl:text-[12px] leading-tight xl:leading-relaxed font-medium font-sans whitespace-pre-line">
                  {cardDescription}
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <span className="text-[7.5px] lg:text-[8.5px] xl:text-[9.5px] text-neutral-400 uppercase tracking-wider font-semibold">{cardStatusLabel}</span>
                <div className="flex items-center gap-1 text-[9px] lg:text-[10px] xl:text-xs font-bold text-emerald-400 uppercase tracking-wider mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>{cardStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 2: EMBEDDED CINEMATIC MERGED PORTRAIT (UNOBSTRUCTED MIDDLE STAGE) */}
          <div
            className={`absolute inset-x-0 ${inVault ? 'top-20 bottom-36' : 'top-20 lg:top-24 xl:top-32 bottom-36 lg:bottom-44 xl:bottom-64'} z-10 overflow-hidden pointer-events-none`}
            style={{ transform: 'translateZ(10px)' }}
          >
            {/* Dark background integration canvas */}
            <div className="absolute inset-0 bg-[#07080c]" />

            {/* Portrait Image with Focal Point & Soft Masking OR Fallback Card */}
            {!imgLoadFailed ? (
              <img
                src={portraitUrl}
                alt={altText}
                className="w-full h-full object-cover grayscale contrast-110 brightness-95 opacity-90 transition-all duration-300"
                style={{
                  objectPosition: `${focalX}% ${focalY}%`,
                }}
                onError={() => {
                  setImgLoadFailed(true);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d0e14] p-6 text-center space-y-3">
                <div className="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 font-display font-black text-2xl tracking-widest shadow-[0_0_20px_rgba(255,42,58,0.2)]">
                  SB
                </div>
                <div className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
                  FOUNDER PORTFOLIO // SAHIL BHATIA
                </div>
                <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                  AI-NATIVE BUILDER &bull; SYSTEMS ARCHITECT
                </div>
              </div>
            )}

            {/* ARTISTIC EDGE INTEGRATION: Soft Edge Falloff & Dark Gradients */}
            <div className={`absolute inset-x-0 top-0 ${inVault ? 'h-16' : 'h-16 lg:h-20 xl:h-28'} bg-gradient-to-b from-[#090a0f] via-[#090a0f]/80 to-transparent`} />
            <div className={`absolute inset-x-0 bottom-0 ${inVault ? 'h-32' : 'h-32 lg:h-40 xl:h-52'} bg-gradient-to-t from-[#090a0f] via-[#090a0f]/90 to-transparent`} />
            <div className={`absolute inset-y-0 left-0 ${inVault ? 'w-8' : 'w-8 lg:w-10 xl:w-14'} bg-gradient-to-r from-[#090a0f] to-transparent`} />
            <div className={`absolute inset-y-0 right-0 ${inVault ? 'w-8' : 'w-8 lg:w-10 xl:w-14'} bg-gradient-to-l from-[#090a0f] to-transparent`} />

            {/* Laser Red Ambient Lighting Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35"
              style={{
                background: 'radial-gradient(ellipse at 85% 15%, rgba(255,42,58,0.45) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255,42,58,0.25) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* LAYER 3: LOWER CARD IDENTITY & CAPABILITY VECTORS */}
          <div
            className={`z-20 mt-auto ${inVault ? 'space-y-2.5 pt-3' : 'space-y-2.5 sm:space-y-3 lg:space-y-3.5 xl:space-y-4 pt-3 xl:pt-4'} pointer-events-none bg-gradient-to-t from-[#090a0f] via-[#090a0f]/90 to-transparent -mx-1 px-1 pb-1`}
            style={{ transform: 'translateZ(26px)' }}
          >
            {/* Name and Designation */}
            <div>
              <h3 className={`font-black font-display text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${inVault ? 'text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl'}`}>
                {cardName}
              </h3>
              <p className={`font-mono text-neutral-300 mt-1 font-semibold tracking-wide ${inVault ? 'text-[10.5px]' : 'text-[10.5px] sm:text-xs lg:text-sm xl:text-base'}`}>
                {cardPositioning}
              </p>
            </div>

            {/* Capability Vectors */}
            <div className="space-y-1.5">
              <div className={`font-mono uppercase tracking-widest text-neutral-400 font-semibold ${inVault ? 'text-[8px]' : 'text-[8px] sm:text-[8.5px] lg:text-[9.5px] xl:text-[11px]'}`}>
                CAPABILITY VECTORS
              </div>
              <div className="flex flex-wrap gap-1">
                {cardCapabilityVectors.map((cap) => (
                  <span
                    key={cap}
                    className={`font-mono px-2 py-0.5 xl:px-2.5 xl:py-1 rounded bg-black/85 border border-white/10 text-neutral-200 ${inVault ? 'text-[8px]' : 'text-[8px] sm:text-[8.5px] lg:text-[9.5px] xl:text-[11px]'}`}
                  >
                    {cap}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {cardCapabilities.map((cap) => (
                  <span
                    key={cap}
                    className={`font-mono px-1.5 py-0.5 xl:px-2 xl:py-1 rounded bg-red-950/40 border border-red-500/30 text-red-200 font-medium ${inVault ? 'text-[8px]' : 'text-[8px] sm:text-[8.5px] lg:text-[9.5px] xl:text-[11px]'}`}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Statement & Platform Identifier */}
            <div className={`pt-2 xl:pt-3 border-t border-white/10 flex items-center justify-between font-mono text-neutral-400 ${inVault ? 'text-[8px]' : 'text-[8px] sm:text-[9px] lg:text-[10px] xl:text-xs'}`}>
              <div className="flex flex-col text-left">
                <span className="text-neutral-200 font-bold tracking-wider">
                  {footerLead}
                </span>
                <span className="text-neutral-400">{footerSub}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-400 shrink-0">
                <Terminal className={`text-[#ff2a3a] ${inVault ? 'w-2.5 h-2.5' : 'w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5'}`} />
                <span className="tracking-wide">SAHIL / PORTFOLIO OS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBuilderCard3D;

