import { useEffect, useRef } from 'react';

/**
 * CaptainAmericaShieldBackground
 * 
 * Global Viewport-Fixed Captain America Vibranium Shield with Cosmic Vibranium & Crimson Backlight.
 * Stays precisely centered in the viewport throughout the entire website scroll as a rich,
 * atmospheric 3D background element.
 */
export default function CaptainAmericaShieldBackground() {
  const shieldRef = useRef(null);
  const animRef = useRef(null);
  const targetTilt = useRef({ rotX: 0, rotY: 0 });
  const currentTilt = useRef({ rotX: 0, rotY: 0 });
  const isLoopRunning = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let running = true;
    const lerp = (a, b, t) => a + (b - a) * t;

    const updatePhysics = () => {
      if (!running) return;

      const cur = currentTilt.current;
      const target = targetTilt.current;

      cur.rotX = lerp(cur.rotX, target.rotX, 0.08);
      cur.rotY = lerp(cur.rotY, target.rotY, 0.08);

      if (shieldRef.current) {
        shieldRef.current.style.transform = `perspective(1100px) rotateX(${cur.rotX.toFixed(2)}deg) rotateY(${cur.rotY.toFixed(2)}deg) scale3d(1, 1, 1)`;
      }

      // Check if settled to idle loop and save CPU/GPU cycles
      const diffX = Math.abs(cur.rotX - target.rotX);
      const diffY = Math.abs(cur.rotY - target.rotY);

      if (diffX < 0.01 && diffY < 0.01) {
        isLoopRunning.current = false;
        return;
      }

      animRef.current = requestAnimationFrame(updatePhysics);
    };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX - innerWidth / 2;
      const y = e.clientY - innerHeight / 2;
      // Gentle 3D perspective tilt (max ~7 degrees)
      targetTilt.current = {
        rotX: Number((- (y / (innerHeight / 2)) * 7).toFixed(2)),
        rotY: Number(((x / (innerWidth / 2)) * 7).toFixed(2)),
      };

      if (!isLoopRunning.current) {
        isLoopRunning.current = true;
        animRef.current = requestAnimationFrame(updatePhysics);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      running = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* CAPTAIN AMERICA VIBRANIUM SHIELD - FIXED CENTER VIEWPORT */}
      {/* ========================================================= */}
      <div
        ref={shieldRef}
        className="relative w-[480px] sm:w-[620px] md:w-[740px] lg:w-[860px] xl:w-[940px] aspect-square flex items-center justify-center pointer-events-none select-none will-change-transform"
        style={{
          transform: 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Multi-octave atmospheric backlighting: crimson red & cosmic vibranium blue */}
        <div className="absolute inset-2 sm:inset-4 rounded-full bg-gradient-to-tr from-red-600/[0.18] via-rose-950/[0.12] to-blue-600/[0.16] blur-[100px] transform scale-90 pointer-events-none" />
        <div className="absolute w-[60%] h-[60%] rounded-full bg-cyan-500/[0.08] blur-[80px] pointer-events-none" />
        <div className="absolute w-[45%] h-[45%] rounded-full bg-red-500/[0.12] blur-[65px] pointer-events-none" />

        {/* Circular Shield Artwork with Soft Feathering into Background */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            maskImage: 'radial-gradient(circle at 50% 44%, black 46%, rgba(0,0,0,0.8) 68%, transparent 92%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 44%, black 46%, rgba(0,0,0,0.8) 68%, transparent 92%)',
          }}
        >
          <img
            src="/assets/cap_shield_red_hulk.jpg"
            alt="Captain America Vibranium Shield"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            aria-hidden="true"
            className="w-full h-full object-cover object-[center_34%] opacity-[0.48] sm:opacity-[0.58] filter contrast-125 brightness-105 saturate-110 pointer-events-none select-none"
          />
        </div>

        {/* Vibranium Star Specular Glint & Atmospheric Flare */}
        <div className="absolute w-44 h-44 rounded-full bg-blue-400/[0.14] blur-2xl pointer-events-none" />
        <div className="absolute -top-8 w-72 h-36 bg-red-600/[0.16] blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}
