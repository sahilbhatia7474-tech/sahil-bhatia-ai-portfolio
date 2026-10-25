import { useEffect, useRef, useState } from 'react';

/**
 * DynamicAmbientLightBackdrop
 * 
 * An ultra-premium, dynamic ambient lighting system positioned immediately
 * behind the main content containers (z-[2] to z-[5], behind z-10).
 * 
 * Physically models:
 * 1. Proximity-Driven Color Temperature Shift:
 *    - In close proximity to main content / center column: Warms into radiant
 *      incandescent ember, fiery ruby, and deep amber-rose (~2600K - 3200K).
 *    - In peripheral / edge distances: Cools into cryo-cyan, electric indigo,
 *      and celestial cobalt (~7500K - 9200K).
 * 2. Proximity-Driven Photometric Intensity & Radius:
 *    - Near cursor-container intersection: Radiance increases with focused
 *      subsurface illumination and soft volumetric falloff.
 *    - Far from focus: Diffuses into a gentle, low-intensity background wash.
 * 3. Section Chromatic Harmony:
 *    - Dynamically harmonizes with the active section being scrolled through
 *      (Projects = Ruby, AI Systems = Cyber Violet, Journey = Warm Topaz, Proof = Emerald Sheen).
 * 4. Dual-Lobe Volumetric Depth:
 *    - Primary focal emitter + Counter-balancing secondary rim scatter.
 *    - Non-intrusive pointer-events-none layer, zero scroll interference,
 *      GPU-accelerated and fully prefers-reduced-motion safe.
 */
export default function DynamicAmbientLightBackdrop() {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e) => setPrefersReducedMotion(e.matches);
      if (mq.addEventListener) {
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
      } else if (mq.addListener) {
        mq.addListener(handler);
        return () => mq.removeListener(handler);
      }
    } catch {
      // safe fallback
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let velocity = 0;
    let lastX = targetX;
    let lastY = targetY;
    let scrollY = window.scrollY;
    let animationFrameId;

    let isSleeping = false;
    let idleCounter = 0;

    const requestTick = () => {
      if (isSleeping) {
        isSleeping = false;
        idleCounter = 0;
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.hypot(dx, dy);
      velocity = Math.min(velocity + dist * 0.04, 30);

      lastX = e.clientX;
      lastY = e.clientY;

      requestTick();
    };

    let winWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
    let winHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
    let cachedDocHeight = typeof document !== 'undefined' ? Math.max(1, document.documentElement.scrollHeight - winHeight) : 5000;

    const handleResize = () => {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
      cachedDocHeight = Math.max(1, document.documentElement.scrollHeight - winHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    let scrollThrottleTimer = null;
    let lastProcessedScrollY = scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
      if (Math.abs(scrollY - lastProcessedScrollY) < 50) return;
      lastProcessedScrollY = scrollY;
      if (!scrollThrottleTimer) {
        scrollThrottleTimer = setTimeout(() => {
          scrollThrottleTimer = null;
          requestTick();
        }, 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const primaryLight = container.querySelector('[data-light="primary"]');
    const secondaryLight = container.querySelector('[data-light="secondary"]');
    const deepWashLight = container.querySelector('[data-light="deep-wash"]');

    const tick = () => {
      // Spring inertia & easing
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;
      velocity *= 0.93;

      // 1. Calculate proximity to main container central axis (x = 50%)
      const centerX = winWidth * 0.5;
      const distFromCenter = Math.abs(currentX - centerX);
      const maxDistX = winWidth * 0.5;
      const xProximity = Math.max(0, 1 - (distFromCenter / maxDistX));

      // Vertical relative position [0, 1]
      const normY = Math.max(0, Math.min(1, currentY / winHeight));

      // Scroll depth influence using cached height to avoid forced reflow
      const scrollProgress = Math.max(0, Math.min(1, scrollY / cachedDocHeight));

      // 2. Color Temperature Blending:
      // Warm Incandescent Kelvin range: High xProximity -> Warm ember / scarlet / amber
      // Cool Cryo Kelvin range: Low xProximity -> Cool azure / ice cyan / electric cobalt
      // Intermediate: Twilight magenta / starlight violet
      
      // Warm vector (center proximity)
      const warmR = 255;
      const warmG = Math.round(45 + (1 - normY) * 55); // 45 to 100 (scarlet to amber)
      const warmB = Math.round(55 + normY * 35);        // 55 to 90

      // Cool vector (peripheral / edge proximity)
      const coolR = Math.round(45 + normY * 50);        // 45 to 95
      const coolG = Math.round(140 + (1 - normY) * 60); // 140 to 200 (cyan/emerald tint)
      const coolB = 255;                                // pure blue/cyan

      // Harmonize with scroll context (Ruby -> Indigo -> Amber -> Emerald)
      let scrollBiasR = 0, scrollBiasG = 0, scrollBiasB = 0;
      if (scrollProgress > 0.6) {
        // Lower sections (Proof / Vault): Emerald / mint whisper
        scrollBiasG = 40;
      } else if (scrollProgress > 0.4) {
        // Mid sections (AI / Journey): Topaz / amber warmth
        scrollBiasR = 30;
        scrollBiasG = 20;
      }

      // Blend based on proximity factor (nonlinear curve for natural perception)
      const warmthCurve = Math.pow(xProximity, 1.4);
      const primaryR = Math.min(255, Math.round(warmR * warmthCurve + coolR * (1 - warmthCurve) + scrollBiasR));
      const primaryG = Math.min(255, Math.round(warmG * warmthCurve + coolG * (1 - warmthCurve) + scrollBiasG));
      const primaryB = Math.min(255, Math.round(warmB * warmthCurve + coolB * (1 - warmthCurve) + scrollBiasB));

      // Intensity modulation based on proximity and velocity
      // When close to containers: higher intensity (0.13 - 0.20)
      // When peripheral: subtle ambient glow (0.05 - 0.08)
      const baseIntensity = 0.06 + (warmthCurve * 0.09);
      const velocityBoost = Math.min(velocity * 0.003, 0.06);
      const currentIntensity = Math.min(0.24, baseIntensity + velocityBoost);

      // Light Cone Radius: expands slightly during motion, focuses in rest
      const coneRadius = Math.round(620 + (1 - warmthCurve) * 220 + velocity * 4);

      // Secondary counter-balancer (opposite color temperature for chromatic depth)
      // If primary is warm, secondary is cool; if primary is cool, secondary is warm
      const secondaryR = Math.round(coolR * warmthCurve + warmR * (1 - warmthCurve));
      const secondaryG = Math.round(coolG * warmthCurve + warmG * (1 - warmthCurve));
      const secondaryB = Math.round(coolB * warmthCurve + warmB * (1 - warmthCurve));
      const secondaryIntensity = Math.min(0.12, 0.04 + (1 - warmthCurve) * 0.05 + velocityBoost * 0.4);

      const normXPercent = ((currentX / winWidth) * 100).toFixed(1);
      const normYPercent = (normY * 100).toFixed(1);

      // Inverse harmonic coordinate for the volumetric secondary rim light
      const secondaryXPercent = ((1 - (currentX / winWidth) * 0.8) * 100).toFixed(1);
      const secondaryYPercent = ((normY * 0.5 + 0.25) * 100).toFixed(1);

      if (primaryLight) {
        primaryLight.style.background = `radial-gradient(circle ${coneRadius}px at ${normXPercent}% ${normYPercent}%, rgba(${primaryR}, ${primaryG}, ${primaryB}, ${currentIntensity.toFixed(3)}) 0%, rgba(${primaryR}, ${primaryG}, ${primaryB}, ${(currentIntensity * 0.35).toFixed(3)}) 42%, transparent 72%)`;
      }

      if (secondaryLight) {
        secondaryLight.style.background = `radial-gradient(circle 850px at ${secondaryXPercent}% ${secondaryYPercent}%, rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, ${secondaryIntensity.toFixed(3)}) 0%, rgba(${secondaryR}, ${secondaryG}, ${secondaryB}, 0.015) 50%, transparent 75%)`;
      }

      if (deepWashLight) {
        // Deep background wash that breathes subtly with warmth
        const washOpacity = 0.04 + (warmthCurve * 0.035);
        deepWashLight.style.opacity = washOpacity.toFixed(3);
      }

      // Check if settled (cursor stopped and velocity dissipated)
      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      if (diffX < 0.5 && diffY < 0.5 && velocity < 0.1) {
        idleCounter += 1;
        if (idleCounter > 30) {
          isSleeping = true;
          return;
        }
      } else {
        idleCounter = 0;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[3] overflow-hidden select-none transition-opacity duration-1000"
      aria-hidden="true"
    >
      {/* Deep Omnipresent Atmospheric Diffusion Wash (Layer 0 - Z: -200px) */}
      <div
        data-light="deep-wash"
        className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 65% at 50% 45%, rgba(255, 42, 58, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 80%)',
          opacity: 0.05,
        }}
      />

      {/* Primary Proximity & Color Temperature Luminous Cone (Layer 1 - Directly behind containers) */}
      <div
        data-light="primary"
        className="absolute inset-0 transition-opacity duration-300 will-change-transform"
        style={{
          background: 'radial-gradient(circle 720px at 50% 35%, rgba(255, 42, 58, 0.12) 0%, rgba(255, 42, 58, 0.04) 40%, transparent 72%)',
        }}
      />

      {/* Secondary Complementary Rim & Specular Depth Scatter (Layer 2) */}
      <div
        data-light="secondary"
        className="absolute inset-0 transition-opacity duration-500 will-change-transform"
        style={{
          background: 'radial-gradient(circle 850px at 65% 55%, rgba(56, 189, 248, 0.06) 0%, transparent 75%)',
        }}
      />

      {/* Subsurface Horizon Light Shelf (Anchoring spatial grounding) */}
      <div
        className="absolute bottom-0 inset-x-0 h-[480px] pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: 'linear-gradient(to top, rgba(255, 42, 58, 0.04) 0%, rgba(15, 23, 42, 0) 100%)',
        }}
      />
    </div>
  );
}
