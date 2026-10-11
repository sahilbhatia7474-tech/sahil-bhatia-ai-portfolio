import { useEffect, useRef } from 'react';

/**
 * Spatial3DParticleField
 * 
 * An interactive, lightweight, ultra-smooth 3D particle constellation field that
 * floats in the background and responds to pointer movement using gravitational
 * parallax and spring physics.
 * 
 * Features:
 * - Projected 3D perspective space (X, Y, Z coordinates with depth-based scale, opacity & velocity)
 * - Subtle gravitational attraction toward cursor with gentle spring damping and inertia
 * - Soft luminous glowing points (crimson, electric ruby, and crisp starlight white)
 * - Ephemeral distance-based constellation web lines connecting nearest neighbors
 * - Fully non-intrusive pointer-events-none canvas with zero scroll interference
 * - Automatically respects prefers-reduced-motion and high-DPI retina display scaling
 */

const PARTICLE_COUNT_DESKTOP = 45;
const PARTICLE_COUNT_MOBILE = 22;
const MAX_CONNECTION_DISTANCE = 85;
const MAX_DIST_SQ = MAX_CONNECTION_DISTANCE * MAX_CONNECTION_DISTANCE;
const STAR_SPRINKLE_COUNT_DESKTOP = 130;
const STAR_SPRINKLE_COUNT_MOBILE = 65;

export default function Spatial3DParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Visibility change pauses requestAnimationFrame
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Mouse coordinates with spring physics
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
      radius: 180,
    };

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = isTouch ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    const starCount = isTouch ? STAR_SPRINKLE_COUNT_MOBILE : STAR_SPRINKLE_COUNT_DESKTOP;

    // 1. Create Delicate Background Star Sprinkles (Strictly Background Layer)
    const starSprinkles = [];
    for (let i = 0; i < starCount; i++) {
      const isRedStar = Math.random() < 0.12;
      const isCyanStar = Math.random() < 0.12;
      starSprinkles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.9 + 0.45, // micro speck 0.45px - 1.35px
        baseAlpha: Math.random() * 0.45 + 0.18,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        isCrossFlare: Math.random() < 0.06, // rare micro four-point sparkle
        color: isRedStar
          ? 'rgba(255, 60, 75, ' // soft crimson starlight
          : isCyanStar
          ? 'rgba(56, 189, 248, ' // soft diamond starlight
          : 'rgba(255, 255, 255, ', // pure crystalline starlight
      });
    }

    // 2. Create 3D particles in a volume: z ranges from 0.2 (deep) to 1.8 (foreground)
    const particles = [];

    const createParticle = () => {
      const z = Math.random() * 1.5 + 0.3; // depth multiplier
      const isRed = Math.random() < 0.28;
      const isTeal = Math.random() < 0.08;

      return {
        // Base rest coordinates
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        z,
        // Drift velocities scaled by depth
        vx: (Math.random() - 0.5) * 0.35 * z,
        vy: (Math.random() - 0.5) * 0.35 * z,
        // Particle radius & color
        baseRadius: Math.random() * 1.6 + 0.8,
        color: isRed
          ? 'rgba(255, 42, 58, ' // Electric Crimson
          : isTeal
          ? 'rgba(52, 211, 153, ' // Emerald / Mint
          : 'rgba(240, 240, 248, ', // Starlight crisp neutral
        baseAlpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      starSprinkles.forEach((s) => {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      });
    };

    handleResize();

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // A. Render Background Star Sprinkles (Delicate cosmic twinkling specks strictly in background)
      for (let i = 0; i < starSprinkles.length; i++) {
        const s = starSprinkles[i];
        if (!prefersReducedMotion) {
          s.twinklePhase += s.twinkleSpeed;
        }
        const currentAlpha = Math.max(
          0.06,
          Math.min(0.9, s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase)))
        );

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();

        // Delicate micro star flare for occasional gleaming stars
        if (s.isCrossFlare && currentAlpha > 0.38) {
          const flareLen = s.radius * 2.6;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.strokeStyle = `${s.color}${currentAlpha * 0.65})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Smooth lerp mouse toward target for silky gravitational inertia
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const mouseOffsetX = (mouse.x - centerX) / width; // -0.5 to 0.5
      const mouseOffsetY = (mouse.y - centerY) / height;

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Autonomous slow orbital drift
          p.originX += p.vx;
          p.originY += p.vy;

          // Wrap edges smoothly
          if (p.originX < -30) p.originX = width + 30;
          if (p.originX > width + 30) p.originX = -30;
          if (p.originY < -30) p.originY = height + 30;
          if (p.originY > height + 30) p.originY = -30;

          // Subtle pulse in brightness
          p.pulseAngle += p.pulseSpeed;

          // Parallax displacement based on depth (Z axis)
          // Closer particles (higher Z) move more, producing true optical parallax depth
          const parallaxDistX = -mouseOffsetX * 45 * p.z;
          const parallaxDistY = -mouseOffsetY * 45 * p.z;

          // Gravitational attraction toward mouse
          let gravityX = 0;
          let gravityY = 0;

          if (mouse.active) {
            const dx = mouse.x - (p.originX + parallaxDistX);
            const dy = mouse.y - (p.originY + parallaxDistY);
            const dist = Math.hypot(dx, dy);

            if (dist < mouse.radius && dist > 1) {
              // Gentle pull toward cursor with soft elastic falloff
              const force = (1 - dist / mouse.radius) * 16 * (p.z * 0.8);
              gravityX = (dx / dist) * force;
              gravityY = (dy / dist) * force;
            }
          }

          p.x = p.originX + parallaxDistX + gravityX;
          p.y = p.originY + parallaxDistY + gravityY;
        } else {
          p.x = p.originX;
          p.y = p.originY;
        }

        // Render particle point
        const radius = p.baseRadius * (0.8 + p.z * 0.4);
        const dynamicAlpha = Math.max(
          0.05,
          Math.min(
            0.8,
            p.baseAlpha * p.z * (0.85 + Math.sin(p.pulseAngle) * 0.15)
          )
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${dynamicAlpha})`;
        ctx.fill();

        // Render subtle interactive constellation lines between nearest neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / MAX_CONNECTION_DISTANCE) * 0.12 * Math.min(p.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
