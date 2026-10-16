import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const INTERACTIVE_SELECTOR = 'button, a, [role="button"], input[type="submit"], input[type="button"], nav a, nav button, summary, .magnetic, [data-magnetic]';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);
  const currentTargetRef = useRef(null);
  const isMagneticActiveRef = useRef(false);

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

    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.16, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.16, ease: 'power3.out' });

    // Function to release magnetic attraction on element
    const releaseElement = (el) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.45,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
        onComplete: () => {
          if (el) el.style.transform = '';
        },
      });
    };

    // Reset cursor visual indicators to neutral
    const resetCursorState = () => {
      if (!isMagneticActiveRef.current) return;
      isMagneticActiveRef.current = false;

      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(255, 42, 58, 0.4)',
        backgroundColor: 'transparent',
        boxShadow: '0 0 0px transparent',
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#ff2a3a',
        boxShadow: '0 0 12px #ff2a3a',
        duration: 0.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    // Activate magnetic visuals on ring and dot
    const activateMagneticVisuals = () => {
      if (isMagneticActiveRef.current) return;
      isMagneticActiveRef.current = true;

      gsap.to(ring, {
        scale: 1.35,
        borderColor: 'rgba(255, 42, 58, 0.85)',
        backgroundColor: 'rgba(255, 42, 58, 0.08)',
        boxShadow: '0 0 16px rgba(255, 42, 58, 0.4)',
        duration: 0.22,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(dot, {
        scale: 0.75,
        backgroundColor: '#ffffff',
        boxShadow: '0 0 14px rgba(255, 255, 255, 0.95)',
        duration: 0.18,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const dotSize = 8;
      const ringSize = 36;

      // 1. Proximity & direct target detection without layout thrashing
      let target = e.target ? e.target.closest(INTERACTIVE_SELECTOR) : null;

      // Filter out disabled or opted-out elements
      if (target) {
        if (
          target.disabled ||
          target.getAttribute('aria-disabled') === 'true' ||
          target.hasAttribute('data-no-magnetic') ||
          target.closest('[data-no-magnetic]')
        ) {
          target = null;
        }
      }

      // Handle target switching or departure
      if (currentTargetRef.current && currentTargetRef.current !== target) {
        releaseElement(currentTargetRef.current);
        currentTargetRef.current = null;
      }

      // Default cursor positions
      let dotX = mouseX;
      let dotY = mouseY;
      let ringX = mouseX;
      let ringY = mouseY;

      if (target) {
        currentTargetRef.current = target;
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.hypot(dx, dy);

        // Magnetic influence threshold (element half-size + cushion)
        const radius = Math.max(rect.width, rect.height) * 0.5 + 32;

        if (distance < radius) {
          // Smooth Hermite easing for silky attraction
          const rawRatio = Math.max(0, Math.min(1, 1 - distance / radius));
          const t = rawRatio * rawRatio * (3 - 2 * rawRatio);

          activateMagneticVisuals();

          // Magnetic pull vectors: dot slightly leads cursor, ring locks deeper
          const pullDot = t * 0.28;
          const pullRing = t * 0.54;

          dotX = mouseX - dx * pullDot;
          dotY = mouseY - dy * pullDot;
          ringX = mouseX - dx * pullRing;
          ringY = mouseY - dy * pullRing;

          // Subtle 3D physical attraction on the interactive element
          const maxOffset = 6;
          const pullElX = Math.max(-maxOffset, Math.min(maxOffset, -dx * 0.16 * t));
          const pullElY = Math.max(-maxOffset, Math.min(maxOffset, -dy * 0.16 * t));
          const tiltX = Math.max(-5, Math.min(5, dy * 0.07 * t));
          const tiltY = Math.max(-5, Math.min(5, -dx * 0.07 * t));

          gsap.to(target, {
            x: pullElX,
            y: pullElY,
            rotationX: tiltX,
            rotationY: tiltY,
            transformPerspective: 500,
            duration: 0.15,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        } else {
          // Outside active pull zone
          resetCursorState();
          releaseElement(target);
          currentTargetRef.current = null;
        }
      } else {
        resetCursorState();
      }

      // Update smooth cursor positions
      xToDot(dotX - dotSize / 2);
      yToDot(dotY - dotSize / 2);
      xToRing(ringX - ringSize / 2);
      yToRing(ringY - ringSize / 2);

      // Ambient light backdrop follower
      if (spotlight) {
        spotlight.style.transform = `translate3d(${mouseX - 300}px, ${mouseY - 300}px, 0)`;
      }
    };

    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' });
      if (spotlight) gsap.to(spotlight, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      if (currentTargetRef.current) {
        releaseElement(currentTargetRef.current);
        currentTargetRef.current = null;
      }
      resetCursorState();
      gsap.to([dot, ring], { opacity: 0, scale: 0.5, duration: 0.25, ease: 'power2.inOut' });
      if (spotlight) gsap.to(spotlight, { opacity: 0, duration: 0.3 });
    };

    const handleMouseDown = () => {
      gsap.to([dot, ring], { scale: 0.85, duration: 0.1, overwrite: 'auto' });
    };

    const handleMouseUp = () => {
      const isMag = isMagneticActiveRef.current;
      gsap.to(ring, { scale: isMag ? 1.35 : 1, duration: 0.2, overwrite: 'auto' });
      gsap.to(dot, { scale: isMag ? 0.75 : 1, duration: 0.2, overwrite: 'auto' });
    };

    const handleScroll = () => {
      if (currentTargetRef.current) {
        const el = currentTargetRef.current;
        currentTargetRef.current = null;
        releaseElement(el);
        resetCursorState();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);

      if (currentTargetRef.current) {
        releaseElement(currentTargetRef.current);
      }
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

      {/* Spatial Ring Follower with Tech Micro-Glares */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-9 h-9 border border-[#ff2a3a]/40 rounded-full flex items-center justify-center will-change-transform transition-colors duration-200"
        style={{ willChange: 'transform' }}
      >
        {/* Subtle Tech Micro-Notches on the ring */}
        <span className="absolute -top-1 w-1 h-0.5 bg-[#ff2a3a]/60 rounded-full" />
        <span className="absolute -bottom-1 w-1 h-0.5 bg-[#ff2a3a]/60 rounded-full" />
        <span className="absolute -left-1 w-0.5 h-1 bg-[#ff2a3a]/60 rounded-full" />
        <span className="absolute -right-1 w-0.5 h-1 bg-[#ff2a3a]/60 rounded-full" />
      </div>
    </>
  );
};

export default CustomCursor;
