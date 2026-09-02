import { useRef, useState, useEffect, useCallback } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ShieldCheck, Cpu, Terminal, Sparkles, Activity, Layers } from 'lucide-react';

const FeaturedBuilderCard3D = () => {
  const { identity, featuredPortrait } = usePortfolioData();
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const touchStartRef = useRef({ x: 0, y: 0, initialRotX: 0, initialRotY: 0 });
  const animFrameRef = useRef(null);

  // Rotation limits strictly adhering to specification: X ~ ±8 deg, Y ~ ±12 deg
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

    // Invert Y for standard natural physical tilt
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

    // Subtle 3D response on initial tap
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

    // Yield to vertical page scrolling
    if (absDeltaY > 12 && absDeltaY > absDeltaX * 1.4) {
      springBack();
      return;
    }

    // Controlled sensitivity mapped strictly within ±8 and ±12 deg limits
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

  const portraitUrl = featuredPortrait?.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
  const focalX = featuredPortrait?.focalX ?? 50;
  const focalY = featuredPortrait?.focalY ?? 35;

  return (
    <div
      ref={containerRef}
      className="perspective-1000 py-4 w-full flex justify-center items-center select-none"
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
        className="relative w-full max-w-[360px] sm:max-w-[390px] lg:max-w-[420px] xl:max-w-[430px] h-[580px] sm:h-[620px] lg:h-[650px] xl:h-[660px] rounded-2xl bg-[#090a0f] border border-red-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(255,42,58,0.12)] cursor-grab active:cursor-grabbing transition-shadow duration-300"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) ${isPressed ? 'scale(1.035) translateZ(8px)' : isHovered || isInteracting ? 'scale(1.02)' : 'scale(1)'}`,
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
        <div className="relative w-full h-full p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          
          {/* LAYER 1: CARD TOP HUD & RARITY SPECIFICATION */}
          <div
            className="flex items-center justify-between z-20 pb-2 border-b border-white/10"
            style={{ transform: 'translateZ(18px)' }}
          >
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3a] animate-pulse" />
              <span className="text-white font-bold">COLLECTIBLE // FOUNDER CARD</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/40 border border-red-500/40 text-[9px] font-mono text-red-300 uppercase tracking-widest font-semibold">
              <Sparkles className="w-2.5 h-2.5 text-red-400" />
              <span>SERIES 01 &bull; 001</span>
            </div>
          </div>

          {/* LAYER 2: EMBEDDED CINEMATIC MERGED PORTRAIT (NOT A PASTED BOX) */}
          <div
            className="absolute inset-x-0 top-12 bottom-24 z-10 overflow-hidden pointer-events-none"
            style={{ transform: 'translateZ(12px)' }}
          >
            {/* Dark background integration canvas */}
            <div className="absolute inset-0 bg-[#07080c]" />

            {/* Portrait Image with Focal Point & Soft Masking */}
            <img
              src={portraitUrl}
              alt={featuredPortrait?.altText || 'Sahil Bhatia'}
              className="w-full h-full object-cover grayscale contrast-110 brightness-95 opacity-90 transition-transform duration-700 hover:scale-105"
              style={{
                objectPosition: `${focalX}% ${focalY}%`,
              }}
              onError={(e) => {
                // Safe fallback to unsplash portrait if custom fails
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
              }}
            />

            {/* ARTISTIC EDGE INTEGRATION: Soft Edge Falloff, Deep Vignette & Dark Gradients */}
            {/* Top dark falloff */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#090a0f] via-[#090a0f]/80 to-transparent" />
            {/* Bottom dark falloff merging into card base */}
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/90 to-transparent" />
            {/* Lateral soft fades */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#090a0f] to-transparent" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#090a0f] to-transparent" />

            {/* Laser Red Rim Lighting Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40"
              style={{
                background: 'radial-gradient(ellipse at 85% 15%, rgba(255,42,58,0.5) 0%, transparent 60%), radial-gradient(ellipse at 15% 85%, rgba(255,42,58,0.3) 0%, transparent 60%)',
              }}
            />
          </div>

          {/* LAYER 3: FLOATING CRYPTOGRAPHIC CHIP / SYSTEM BADGE */}
          <div
            className="z-20 pt-4 flex justify-between items-start pointer-events-none"
            style={{ transform: 'translateZ(26px)' }}
          >
            <div className="p-2 rounded bg-black/60 backdrop-blur-md border border-white/10 shadow-lg text-[10px] font-mono text-neutral-400 space-y-0.5">
              <div className="flex items-center gap-1 text-white font-bold">
                <Cpu className="w-3 h-3 text-[#ff2a3a]" />
                <span>SAHIL / OS</span>
              </div>
              <div className="text-[9px] text-neutral-500">ID: 7474-SN50X</div>
            </div>

            <div className="px-2.5 py-1 rounded bg-[#ff2a3a]/15 border border-[#ff2a3a]/40 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 shadow-[0_0_12px_rgba(255,42,58,0.25)] font-bold">
              <Activity className="w-3 h-3 text-[#ff2a3a]" />
              <span>VERIFIED BUILDER</span>
            </div>
          </div>

          {/* LAYER 4: LOWER CARD IDENTITY & CAPABILITY METRICS */}
          <div
            className="z-20 mt-auto space-y-3 pt-4 pointer-events-none"
            style={{ transform: 'translateZ(28px)' }}
          >
            {/* Name and Designation */}
            <div>
              <span className="font-mono text-[9px] text-[#ff2a3a] uppercase tracking-[0.25em] font-bold block mb-0.5">
                FEATURED DEV // OPERATOR
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {identity?.name || 'SAHIL BHATIA'}
              </h3>
              <p className="text-xs font-mono text-neutral-300 mt-1 font-semibold">
                AI-NATIVE BUILDER &bull; SYSTEMS ARCHITECT
              </p>
            </div>

            {/* Capability Indicators Matrix (Real, Non-Fabricated) */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
                <span>VERIFIED CAPABILITY VECTORS</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[8px]">
                  <ShieldCheck className="w-2.5 h-2.5" /> AUDITED
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {['AI SYSTEMS', 'AUTOMATION', 'WORKFLOWS', 'PRODUCT', 'UX', 'VIBE CODING'].map((cap) => (
                  <span
                    key={cap}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/70 border border-white/10 text-neutral-200"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Telemetry Strip */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-neutral-400">
              <div className="flex items-center gap-1 text-neutral-300">
                <Terminal className="w-2.5 h-2.5 text-[#ff2a3a]" />
                <span>SAHILBHATIA.COM</span>
              </div>
              <span className="text-neutral-500">TOUCH / HOVER TILT ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBuilderCard3D;
