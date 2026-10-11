import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;

    if (!dot || !ring) return;

    gsap.set([dot, ring], { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' });

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.04, ease: 'power2.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.04, ease: 'power2.out' });

    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.14, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.14, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      const dotSize = 8;
      const ringSize = 36;

      xToDot(x - dotSize / 2);
      yToDot(y - dotSize / 2);
      xToRing(x - ringSize / 2);
      yToRing(y - ringSize / 2);

      if (spotlight) {
        spotlight.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      }
    };

    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
      if (spotlight) gsap.to(spotlight, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, scale: 0.5, duration: 0.25, ease: 'power2.inOut' });
      if (spotlight) gsap.to(spotlight, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Precision Ambient Light Follower (Background plane behind text & UI) */}
      <div
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-[2] opacity-0 blur-[90px] transition-opacity duration-300 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(255,42,58,0.08) 0%, rgba(255,42,58,0.02) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Center Target Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 bg-[#ff2a3a] rounded-full shadow-[0_0_12px_#ff2a3a] will-change-transform"
        style={{ willChange: 'transform' }}
      />

      {/* Spatial Ring Follower */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-9 h-9 border border-[#ff2a3a]/40 rounded-full flex items-center justify-center will-change-transform"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;
