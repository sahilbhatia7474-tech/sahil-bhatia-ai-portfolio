import { useEffect, useRef } from 'react';

/**
 * FooterCinematicParticles
 * 
 * High-tech cinematic particle animation overlay for the footer background.
 * Creates an atmospheric field of floating quantum embers, vibranium sparks,
 * and holographic constellation threads that seamlessly blend with the cosmic shield.
 */
export default function FooterCinematicParticles({ pointer = { x: 50, y: 50, active: false } }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pointerRef = useRef(pointer);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId;
    let isVisible = false;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 24 : 48;
    const CONNECT_DISTANCE = isMobile ? 50 : 75;
    const CONNECT_DIST_SQ = CONNECT_DISTANCE * CONNECT_DISTANCE;

    // Resize handler optimized for smooth scrolling
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 600;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();

    // Particle pool setup
    const particles = [];
    const colors = [
      { r: 255, g: 60, b: 75 },   // Crimson / Red Ember
      { r: 56, g: 189, b: 248 },  // Vibranium Cyan
      { r: 168, g: 85, b: 247 },  // Cosmic Indigo
      { r: 255, g: 255, b: 255 }, // Optical Silver/White
      { r: 251, g: 191, b: 36 },  // Warm Gold Micro-Spark
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorType = colors[Math.floor(Math.random() * colors.length)];
      const z = Math.random() * 0.9 + 0.4; // Depth scale: 0.4 to 1.3
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * z,
        vy: -(Math.random() * 0.45 + 0.2) * z, // gentle upward drift
        radius: (Math.random() * 1.4 + 0.8) * z,
        baseAlpha: Math.random() * 0.45 + 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulsePhase: Math.random() * Math.PI * 2,
        color: colorType,
        hasCrossFlare: Math.random() < 0.15 && z > 0.8,
        z,
      });
    }

    let lastTime = 0;

    // Physics & render tick
    const render = (time) => {
      if (!isVisible) return;
      animId = requestAnimationFrame(render);

      // Frame throttle to 60fps
      if (time - lastTime < 16) return;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Convert pointer percent into pixel coordinates from ref
      const currentPointer = pointerRef.current || { x: 50, y: 50, active: false };
      const mouseX = (currentPointer.x / 100) * width;
      const mouseY = (currentPointer.y / 100) * height;
      const mouseActive = currentPointer.active;

      // 1. Render subtle connection web between nearby particles (tactical telemetry grid)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECT_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / CONNECT_DISTANCE) * 0.18 * Math.min(p1.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Blended cyan-crimson telemetry gradient
            ctx.strokeStyle = `rgba(147, 197, 253, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // 2. Render and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Upward drift and subtle lateral oscillation
          p.pulsePhase += p.pulseSpeed;
          p.x += p.vx + Math.sin(p.pulsePhase * 0.8) * 0.2;
          p.y += p.vy;

          // Interactive subtle repel / attraction near pointer
          if (mouseActive) {
            const mdx = p.x - mouseX;
            const mdy = p.y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 140 && mdist > 5) {
              const force = (1 - mdist / 140) * 0.8;
              p.x += (mdx / mdist) * force * 1.5;
              p.y += (mdy / mdist) * force * 1.5;
            }
          }

          // Screen wrap-around
          if (p.y < -20) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 15;
          if (p.x > width + 20) p.x = -15;
        }

        const alpha = Math.max(
          0.1,
          Math.min(0.9, p.baseAlpha * (0.75 + 0.25 * Math.sin(p.pulsePhase)))
        );

        // Particle Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fill();

        // Particle Diffused Specular Aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.22})`;
        ctx.fill();

        // High-tech anamorphic cross flare for hero sparks
        if (p.hasCrossFlare && alpha > 0.5) {
          const flareLen = p.radius * 4.5;
          ctx.beginPath();
          ctx.moveTo(p.x - flareLen, p.y);
          ctx.lineTo(p.x + flareLen, p.y);
          ctx.moveTo(p.x, p.y - flareLen);
          ctx.lineTo(p.x, p.y + flareLen);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.45})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    };

    // IntersectionObserver: Only animate when footer is on screen!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animId = requestAnimationFrame(render);
            }
          } else {
            isVisible = false;
            if (animId) cancelAnimationFrame(animId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    const onResize = () => {
      handleResize();
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-[2]"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none select-none w-full h-full mix-blend-screen"
      />
    </div>
  );
}
