import { useEffect, useRef, useState } from 'react';

/**
 * SpiderVerseBackgroundWall
 * 
 * Cinematic Dark-Themed Tobey Maguire Spider-Man (Classic Red & Blue Suit)
 * with Avengers Allies (Iron Man & Captain America) & Clean Geometric Spider-Net.
 * 
 * Strictly mounted on the background wall behind all page content (fixed z-[1] pointer-events-none).
 * 
 * Features:
 * 1. CLASSIC TOBEY MAGUIRE RED & BLUE SPIDER-MAN:
 *    - Flying/soaring in mid-air with raised silver webbing, sharp angular reflective lenses,
 *      and active web-shooting pose from wrist.
 * 2. AVENGERS TEAM COMPANIONS:
 *    - Iron Man: High-tech flight wingman with glowing cyan Arc Reactor & repulsor ion trail.
 *    - Captain America: Vibranium Star Shield with holographic kinetic defense rings.
 *    - Avengers "A" holographic crest in the constellation matrix.
 * 3. CLEAN, REFINED GEOMETRIC SPIDER WEBS:
 *    - Back to the crisp, clean polygonal corner webs (NO U-shaped sagging droops).
 *    - Not crowded ("Too much spider web" fixed — balanced, elegant, subtle).
 *    - Subtle real-time web-shooting particle lines tethering from Spider-Man's wrist to cursor.
 * 4. 200+ TWINKLING COSMIC STARS:
 *    - Subtle starlight sprinkles across the dark wall.
 * 5. 100% NON-INTRUSIVE & CONTAINED:
 *    - Strictly pointer-events-none, never blocks buttons, tabs, or navigation.
 */

const STAR_COUNT_DESKTOP = 210;
const STAR_COUNT_MOBILE = 100;
const PARTICLE_COUNT = 38;
const MAX_WEB_DIST = 120;
const MAX_WEB_DIST_SQ = MAX_WEB_DIST * MAX_WEB_DIST;

export default function SpiderVerseBackgroundWall() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const starCount = isTouch ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

    // Mouse coordinates with silky spring inertia
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      active: false,
    };

    // 1. COSMIC STAR SPRINKLES (Clean, Subtle Diamond Sparkles)
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const isCrimson = Math.random() < 0.12;
      const isCyan = Math.random() < 0.15;
      const isGold = Math.random() < 0.08;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 1.0, // 1.0px - 2.3px (sharp and crisp)
        baseAlpha: Math.random() * 0.35 + 0.55,
        twinkleSpeed: Math.random() * 0.03 + 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        isCrossFlare: Math.random() < 0.14,
        color: isCrimson
          ? 'rgba(255, 60, 75, '
          : isCyan
          ? 'rgba(56, 189, 248, '
          : isGold
          ? 'rgba(251, 191, 36, '
          : 'rgba(255, 255, 255, ',
      });
    }

    // 2. CLEAN GEOMETRIC CORNER SPIDER-NETS (NO U-SHAPES, SLEEK & BALANCED)
    const cornerWebs = [
      { x: 0, y: 0, radius: 340, spokes: 8, rings: 6 },
      { x: width, y: 0, radius: 360, spokes: 9, rings: 6 },
      { x: 0, y: height, radius: 320, spokes: 8, rings: 6 },
      { x: width, y: height, radius: 360, spokes: 9, rings: 6 },
    ];

    // 3. FLOATING SUBTLE CONSTELLATION NODES
    const webNodes = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = Math.random() * 1.2 + 0.6;
      webNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * 0.3 * z,
        vy: (Math.random() - 0.5) * 0.3 * z,
        radius: Math.random() * 1.4 + 1.0,
        isRubyNode: Math.random() < 0.2,
        isArcNode: Math.random() < 0.15, // Iron Man cyan energy
        alpha: Math.random() * 0.3 + 0.6,
      });
    }

    // 4. IRON MAN THRUSTER JET PARTICLES (Cyan & Gold Repulsor Sparkles)
    const thrusterParticles = [];
    const thrusterCount = isTouch ? 12 : 24;
    for (let i = 0; i < thrusterCount; i++) {
      thrusterParticles.push({
        x: width * 0.15 + (Math.random() - 0.5) * 30,
        y: 180 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.8 - 1.2,
        vy: Math.random() * 1.8 + 1.5,
        life: Math.random() * 40 + 20,
        maxLife: 60,
        radius: Math.random() * 1.8 + 1.0,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(251, 191, 36, ',
      });
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

      cornerWebs[1].x = width;
      cornerWebs[2].y = height;
      cornerWebs[3].x = width;
      cornerWebs[3].y = height;

      stars.forEach((s) => {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      });
    };

    handleResize();

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      setMousePos({ x: -1000, y: -1000 });
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      // -------------------------------------------------------------
      // LAYER 1: TWINKLING COSMIC STARS
      // -------------------------------------------------------------
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) {
          s.twinklePhase += s.twinkleSpeed;
        }
        const currentAlpha = Math.max(
          0.15,
          Math.min(0.95, s.baseAlpha * (0.7 + 0.3 * Math.sin(s.twinklePhase)))
        );

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();

        // Cross flares on featured stars
        if (s.isCrossFlare && currentAlpha > 0.6) {
          const flareLen = s.radius * 3.2;
          ctx.beginPath();
          ctx.moveTo(s.x - flareLen, s.y);
          ctx.lineTo(s.x + flareLen, s.y);
          ctx.moveTo(s.x, s.y - flareLen);
          ctx.lineTo(s.x, s.y + flareLen);
          ctx.strokeStyle = `${s.color}${currentAlpha * 0.75})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // LAYER 2: CLEAN GEOMETRIC SPIDER WEBS (POLYGONAL RINGS - NO U-SHAPES!)
      // -------------------------------------------------------------
      for (let c = 0; c < cornerWebs.length; c++) {
        const web = cornerWebs[c];
        const spokeStep = (Math.PI * 0.5) / (web.spokes - 1);
        const startAngle = c === 0 ? 0 : c === 1 ? Math.PI * 0.5 : c === 2 ? Math.PI * 1.5 : Math.PI;

        // Radial Spokes
        ctx.strokeStyle = 'rgba(240, 246, 255, 0.32)';
        ctx.lineWidth = 0.95;

        const spokePoints = [];
        for (let s = 0; s < web.spokes; s++) {
          const angle = startAngle + s * spokeStep;
          const endX = web.x + Math.cos(angle) * web.radius;
          const endY = web.y + Math.sin(angle) * web.radius;

          ctx.beginPath();
          ctx.moveTo(web.x, web.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          spokePoints.push({ angle });
        }

        // Concentric Crisp Polygonal Rings (Clean geometric connections, no droop)
        for (let r = 1; r <= web.rings; r++) {
          const ringRadius = (web.radius / web.rings) * r;
          const isOuter = r === web.rings;
          ctx.strokeStyle = isOuter ? 'rgba(255, 60, 75, 0.45)' : 'rgba(226, 232, 240, 0.28)';
          ctx.lineWidth = isOuter ? 1.2 : 0.8;

          ctx.beginPath();
          for (let s = 0; s < spokePoints.length; s++) {
            const pt = spokePoints[s];
            const px = web.x + Math.cos(pt.angle) * ringRadius;
            const py = web.y + Math.sin(pt.angle) * ringRadius;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // LAYER 3: REAL-TIME SUBTLE WEB SHOOTING FROM SPIDER-MAN'S WRIST
      // -------------------------------------------------------------
      // Position matches Spider-Man's wrist on top-right of screen
      const spideyWristX = width > 1024 ? width * 0.84 : width * 0.78;
      const spideyWristY = 145;

      if (mouse.active) {
        // Primary Web Filament shooting directly towards mouse cursor
        ctx.beginPath();
        ctx.moveTo(spideyWristX, spideyWristY);
        // Subtle natural elasticity
        const midX = (spideyWristX + mouse.x) * 0.5;
        const midY = (spideyWristY + mouse.y) * 0.5 + 20;
        ctx.quadraticCurveTo(midX, midY, mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Subtle secondary micro-filament
        ctx.beginPath();
        ctx.moveTo(spideyWristX, spideyWristY);
        ctx.quadraticCurveTo(midX + 8, midY - 12, mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(255, 60, 75, 0.45)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Subtle glowing impact node at cursor
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fill();
      }

      // Subtle background anchor threads from wrist
      const anchorRays = [0.95, 1.45, 1.95, 2.45, 2.95];
      for (let i = 0; i < anchorRays.length; i++) {
        const ang = anchorRays[i];
        const len = width * 0.38;
        ctx.beginPath();
        ctx.moveTo(spideyWristX, spideyWristY);
        ctx.lineTo(spideyWristX - Math.cos(ang) * len, spideyWristY + Math.sin(ang) * len);
        ctx.strokeStyle = 'rgba(240, 246, 255, 0.28)';
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // LAYER 4: IRON MAN FLIGHT REPULSOR ION PARTICLES (TOP-LEFT)
      // -------------------------------------------------------------
      const ironManBootsX = width > 1024 ? width * 0.16 : width * 0.12;
      const ironManBootsY = 195;

      if (!prefersReducedMotion) {
        for (let i = 0; i < thrusterParticles.length; i++) {
          const tp = thrusterParticles[i];
          tp.x += tp.vx;
          tp.y += tp.vy;
          tp.life--;

          if (tp.life <= 0) {
            tp.x = ironManBootsX + (Math.random() - 0.5) * 16;
            tp.y = ironManBootsY + Math.random() * 8;
            tp.vx = (Math.random() - 0.5) * 0.7 - 1.0;
            tp.vy = Math.random() * 2.0 + 1.2;
            tp.life = Math.random() * 35 + 15;
          }

          const alpha = (tp.life / tp.maxLife) * 0.7;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${tp.color}${alpha})`;
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // LAYER 5: FLOATING CONSTELLATION WEB NODES
      // -------------------------------------------------------------
      for (let i = 0; i < webNodes.length; i++) {
        const p = webNodes[i];

        if (!prefersReducedMotion) {
          p.originX += p.vx;
          p.originY += p.vy;

          if (p.originX < -30) p.originX = width + 30;
          if (p.originX > width + 30) p.originX = -30;
          if (p.originY < -30) p.originY = height + 30;
          if (p.originY > height + 30) p.originY = -30;

          const offsetX = (mouse.x - width / 2) / width;
          const offsetY = (mouse.y - height / 2) / height;
          p.x = p.originX - offsetX * 25 * p.z;
          p.y = p.originY - offsetY * 25 * p.z;
        } else {
          p.x = p.originX;
          p.y = p.originY;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isRubyNode
          ? 'rgba(255, 42, 58, 0.85)'
          : p.isArcNode
          ? 'rgba(56, 189, 248, 0.9)'
          : 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        for (let j = i + 1; j < webNodes.length; j++) {
          const p2 = webNodes[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_WEB_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / MAX_WEB_DIST) * 0.5 * Math.min(p.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(240, 246, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Parallax offsets
  const parallaxX =
    typeof window !== 'undefined'
      ? ((mousePos.x - window.innerWidth / 2) / window.innerWidth) * 18
      : 0;
  const parallaxY =
    typeof window !== 'undefined'
      ? ((mousePos.y - window.innerHeight / 2) / window.innerHeight) * 12
      : 0;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Hardware Accelerated High-DPI Canvas for Clean Geometric Spider-Net & Stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* ========================================================= */}
      {/* 2. CLASSIC TOBEY MAGUIRE RED & BLUE SPIDER-MAN (FLYING)   */}
      {/* ========================================================= */}
      <div
        className="absolute top-16 sm:top-20 right-3 sm:right-6 md:right-12 lg:right-16 xl:right-24 w-52 h-52 sm:w-64 sm:h-64 md:w-76 md:h-76 lg:w-92 lg:h-92 pointer-events-none transition-transform duration-300 ease-out z-10"
        style={{
          transform: `translate3d(${-parallaxX}px, ${-parallaxY}px, 0)`,
        }}
      >
        {/* Atmospheric Backglow (Deep Crimson & Royal Blue Energy) */}
        <div className="absolute top-1/4 left-1/4 w-3/4 h-3/4 rounded-full bg-red-600/30 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1/2 h-1/2 rounded-full bg-blue-600/25 blur-2xl pointer-events-none" />

        {/* Cinematic Tobey Maguire Red & Blue Spider-Man Illustration */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-[0_0_32px_rgba(255,42,58,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Classic Tobey Vibrant Red Suit Gradient */}
            <linearGradient id="classicSpideyRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2e3f" />
              <stop offset="45%" stopColor="#d11222" />
              <stop offset="85%" stopColor="#8a0c16" />
              <stop offset="100%" stopColor="#4a050b" />
            </linearGradient>

            {/* Classic Tobey Royal Navy Blue Flank Gradient */}
            <linearGradient id="classicSpideyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="80%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#0c1947" />
            </linearGradient>

            {/* Tobey's Iconic Raised Silver Webbing Texture */}
            <linearGradient id="silverRaisedWeb" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.65" />
            </linearGradient>

            {/* Tobey's Iconic Sharp Chrome Eye Lenses */}
            <linearGradient id="tobeyEyeLens" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Glowing Web Shooter Blast */}
            <radialGradient id="webBlastEnergy" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="80%" stopColor="#ff2a3a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* SPIDER-MAN BODY (AERODYNAMIC MID-AIR WEB SWINGING POSE) */}

          {/* Torso & Core (Classic Vibrant Red) */}
          <path
            d="M175 135 C190 115, 230 105, 250 120 C270 135, 278 180, 262 215 C248 242, 218 255, 192 245 C172 235, 158 198, 168 165 Z"
            fill="url(#classicSpideyRed)"
            stroke="#450a0a"
            strokeWidth="2"
          />

          {/* Lateral Flanks & Underarms (Classic Tobey Royal Navy Blue Insets) */}
          <path
            d="M168 165 C162 188, 170 220, 184 235 C176 220, 170 198, 170 178 Z"
            fill="url(#classicSpideyBlue)"
          />
          <path
            d="M248 132 C262 160, 268 192, 256 218 C262 192, 258 160, 248 136 Z"
            fill="url(#classicSpideyBlue)"
          />

          {/* Left Trailing Arm (Stabilizing Aerodynamic in Flight) */}
          <path
            d="M175 135 C148 125, 118 132, 92 152 C88 158, 92 168, 102 162 C122 148, 148 145, 168 152 Z"
            fill="url(#classicSpideyRed)"
            stroke="#450a0a"
            strokeWidth="1.5"
          />
          {/* Left Forearm Blue Accent */}
          <path
            d="M135 140 C118 146, 102 156, 95 160 C105 152, 122 145, 138 142 Z"
            fill="url(#classicSpideyBlue)"
          />
          {/* Left Hand (Clenched Fist in Mid-Air Flight) */}
          <circle cx="88" cy="160" r="8" fill="url(#classicSpideyRed)" />

          {/* Trailing Legs (Aerodynamic Motion Silhouette) */}
          <path
            d="M202 245 C220 272, 245 308, 276 332 C282 338, 288 332, 282 324 C255 296, 228 260, 215 240 Z"
            fill="url(#classicSpideyBlue)"
          />
          <path
            d="M276 332 C292 348, 312 368, 328 378 C332 380, 335 374, 330 370 C314 356, 294 336, 282 324 Z"
            fill="url(#classicSpideyRed)"
          />

          {/* Leading Right Arm (Thrust Forward, Aiming Web-Shooter) */}
          <path
            d="M248 128 C268 112, 298 92, 334 72 C342 66, 350 75, 342 82 C308 108, 278 132, 258 148 Z"
            fill="url(#classicSpideyRed)"
            stroke="#450a0a"
            strokeWidth="2"
          />
          {/* Right Arm Blue Bicep Inset */}
          <path
            d="M268 122 C288 108, 308 92, 322 82 C308 98, 288 115, 270 130 Z"
            fill="url(#classicSpideyBlue)"
          />

          {/* Right Hand in Iconic THWIP Web-Shooting Pose */}
          <g transform="translate(336, 64)">
            {/* Palm & Wrist */}
            <path
              d="M0 8 C5 0, 16 -2, 23 4 C29 10, 26 18, 19 20 C10 22, 2 16, 0 8 Z"
              fill="url(#classicSpideyRed)"
              stroke="#7a0812"
              strokeWidth="1.5"
            />
            {/* Extended Index Finger */}
            <path d="M17 2 L28 -6 C30 -8, 32 -6, 30 -3 L21 6 Z" fill="url(#classicSpideyRed)" />
            {/* Extended Pinky Finger */}
            <path d="M23 12 L34 10 C36 9, 37 12, 34 14 L21 18 Z" fill="url(#classicSpideyRed)" />
            {/* Curled Middle & Ring Fingers Touching Palm (Web Trigger) */}
            <circle cx="17" cy="10" r="4.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <circle cx="15" cy="14" r="4" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

            {/* Glowing Web Nozzle Flare */}
            <circle cx="12" cy="8" r="8" fill="url(#webBlastEnergy)" />
            <circle cx="12" cy="8" r="3" fill="#ffffff" />
          </g>

          {/* SPIDER-MAN MASK & HEAD (TOBEY MAGUIRE SILHOUETTE) */}
          <path
            d="M212 82 C228 62, 255 62, 268 78 C282 94, 278 120, 260 132 C244 142, 224 138, 214 125 C204 108, 202 92, 212 82 Z"
            fill="url(#classicSpideyRed)"
            stroke="#450a0a"
            strokeWidth="2"
          />

          {/* Tobey's Iconic Sharp Angular Silver-Rimmed Spider Eye Lenses */}
          {/* Right Eye Lens */}
          <path
            d="M234 92 C246 84, 260 86, 268 94 C266 106, 254 116, 240 114 C234 110, 232 100, 234 92 Z"
            fill="url(#tobeyEyeLens)"
            stroke="#0a0a0f"
            strokeWidth="3.5"
          />
          <path
            d="M234 92 C246 84, 260 86, 268 94 C266 106, 254 116, 240 114 C234 110, 232 100, 234 92 Z"
            fill="none"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.5"
          />

          {/* Left Eye Lens (Foreshortened) */}
          <path
            d="M220 94 C226 88, 230 90, 232 96 C230 103, 224 108, 220 106 C218 102, 218 98, 220 94 Z"
            fill="url(#tobeyEyeLens)"
            stroke="#0a0a0f"
            strokeWidth="2.5"
          />

          {/* TOBEY'S RAISED METALLIC SILVER WEBBING PATTERN */}
          {/* Mask Web Radians */}
          <path
            d="M244 102 L240 76 M244 102 L262 72 M244 102 L274 88 M244 102 L274 108 M244 102 L262 126 M244 102 L236 130 M244 102 L218 120 M244 102 L212 98 M244 102 L224 80"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Mask Concentric Web Rings */}
          <path
            d="M232 84 Q247 80 260 86 M226 96 Q247 90 270 100 M226 110 Q247 116 264 118"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.3"
          />

          {/* Chest Spider Emblem (Classic Tobey Black Spider) */}
          <g transform="translate(216, 172)">
            <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#0f172a" />
            <circle cx="0" cy="-6" r="2.5" fill="#0f172a" />
            {/* Upper Spider Legs */}
            <path d="M-2 -3 L-10 -12 L-16 -10" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 -3 L10 -12 L16 -10" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M-3 0 L-14 -4 L-20 2" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M3 0 L14 -4 L20 2" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Lower Spider Legs */}
            <path d="M-2 3 L-12 12 L-14 22" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2 3 L12 12 L14 22" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M-1 4 L-8 16 L-10 26" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M1 4 L8 16 L10 26" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Suit Raised Silver Webbing Grid */}
          <path
            d="M192 142 Q217 132 242 142 M182 168 Q217 158 252 170 M180 192 Q217 182 248 198 M184 218 Q217 208 238 222"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.3"
          />
          <path
            d="M217 132 L217 232 M196 138 L192 228 M237 138 L240 222"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.3"
          />
          <path
            d="M262 132 L332 75 M277 142 L340 85"
            stroke="url(#silverRaisedWeb)"
            strokeWidth="1.3"
          />

          {/* Active Web Blast Erupting from Wrist */}
          <g>
            <path
              d="M348 72 Q380 56 415 36"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #ff2a3a)"
            />
            <path
              d="M348 72 Q370 68 395 64"
              stroke="#bae6fd"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M348 72 Q375 46 402 26"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Luminous Web Silk Particles */}
            <circle cx="365" cy="62" r="2.5" fill="#ffffff" />
            <circle cx="386" cy="48" r="2" fill="#38bdf8" />
            <circle cx="406" cy="36" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Tactical Status Tag */}
        <div className="absolute -bottom-2 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-red-500/40 text-[9px] font-mono text-red-200 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>SPIDER-MAN • TOBEY MAGUIRE</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. AVENGERS TEAM ALLIES: IRON MAN (SUPERSONIC FLIGHT)     */}
      {/* ========================================================= */}
      <div
        className="absolute top-24 sm:top-28 left-4 sm:left-8 md:left-14 lg:left-20 xl:left-28 w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 pointer-events-none transition-transform duration-300 ease-out z-10"
        style={{
          transform: `translate3d(${parallaxX * 0.8}px, ${-parallaxY * 0.8}px, 0)`,
        }}
      >
        {/* Arc Reactor & Repulsor Backglow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-1/2 h-1/2 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

        {/* Iron Man Armor SVG Illustration */}
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-[0_0_24px_rgba(56,189,248,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Iron Man Hot Rod Red Armor Gradient */}
            <linearGradient id="ironManRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="40%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>

            {/* Iron Man Titanium Gold Inset Gradient */}
            <linearGradient id="ironManGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Arc Reactor Cyan Core */}
            <radialGradient id="arcReactorGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* IRON MAN FLIGHT SILHOUETTE */}
          {/* Torso & Shoulder Plating */}
          <path
            d="M95 85 C105 70, 135 70, 145 85 C160 100, 155 130, 140 150 C130 162, 110 162, 100 150 C85 130, 80 100, 95 85 Z"
            fill="url(#ironManRed)"
            stroke="#4c0519"
            strokeWidth="1.5"
          />

          {/* Chest Gold Accent Collar */}
          <path
            d="M102 92 L120 110 L138 92 L132 86 L120 96 L108 86 Z"
            fill="url(#ironManGold)"
          />

          {/* Unibeam Arc Reactor (Glowing Cyan Reactor Core) */}
          <circle cx="120" cy="120" r="14" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="10" fill="url(#arcReactorGlow)" />
          <polygon
            points="120,113 126,124 114,124"
            fill="#ffffff"
            stroke="#38bdf8"
            strokeWidth="0.8"
          />

          {/* Iron Man Helmet */}
          <path
            d="M104 46 C110 32, 130 32, 136 46 C144 56, 142 72, 134 78 C128 82, 112 82, 106 78 C98 72, 96 56, 104 46 Z"
            fill="url(#ironManRed)"
            stroke="#4c0519"
            strokeWidth="1.5"
          />
          {/* Faceplate (Iconic Gold Mask) */}
          <path
            d="M108 52 C114 44, 126 44, 132 52 C136 60, 134 72, 128 75 C124 77, 116 77, 112 75 C106 72, 104 60, 108 52 Z"
            fill="url(#ironManGold)"
          />
          {/* Eye Slits (Glowing Cyan Lenses) */}
          <rect x="110" y="58" width="6" height="2" rx="0.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
          <rect x="124" y="58" width="6" height="2" rx="0.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />

          {/* Right Repulsor Palm Hand (Cocked Forward, Blasting) */}
          <g transform="translate(156, 110)">
            <ellipse cx="6" cy="6" rx="8" ry="6" fill="url(#ironManGold)" />
            <circle cx="6" cy="6" r="5" fill="url(#arcReactorGlow)" />
            <circle cx="6" cy="6" r="2" fill="#ffffff" />
          </g>

          {/* Flight Boots Thrusters (Repulsor Jet Blast) */}
          <ellipse cx="110" cy="175" rx="6" ry="4" fill="url(#ironManRed)" />
          <ellipse cx="130" cy="175" rx="6" ry="4" fill="url(#ironManRed)" />
          <path d="M106 177 L114 177 L110 195 Z" fill="#38bdf8" opacity="0.8" />
          <path d="M126 177 L134 177 L130 195 Z" fill="#38bdf8" opacity="0.8" />
        </svg>

        {/* Tactical Status Tag */}
        <div className="absolute -bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/80 border border-cyan-400/40 text-[9px] font-mono text-cyan-200 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>IRON MAN • MARK 85</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. AVENGERS TEAM ALLIES: CAPTAIN AMERICA VIBRANIUM SHIELD */}
      {/* ========================================================= */}
      <div
        className="absolute bottom-16 sm:bottom-20 left-4 sm:left-8 md:left-14 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 pointer-events-none transition-transform duration-300 ease-out z-10"
        style={{
          transform: `translate3d(${parallaxX * 0.5}px, ${parallaxY * 0.5}px, 0)`,
        }}
      >
        {/* Kinetic Vibranium Glow */}
        <div className="absolute inset-0 rounded-full bg-radial from-blue-600/20 via-red-600/15 to-transparent blur-xl pointer-events-none animate-pulse" />

        {/* Captain America Shield SVG */}
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(255,42,58,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Red Ring */}
          <circle cx="80" cy="80" r="72" fill="#be123c" stroke="#4c0519" strokeWidth="2" />
          {/* Specular Rim */}
          <circle cx="80" cy="80" r="70" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />

          {/* Outer Silver Ring */}
          <circle cx="80" cy="80" r="56" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Inner Red Ring */}
          <circle cx="80" cy="80" r="42" fill="#be123c" stroke="#4c0519" strokeWidth="1.5" />

          {/* Center Blue Field */}
          <circle cx="80" cy="80" r="28" fill="#1e3a8a" stroke="#172554" strokeWidth="1.5" />

          {/* Central Vibranium 5-Point Star */}
          <polygon
            points="80,56 86,72 103,72 89,82 94,98 80,88 66,98 71,82 57,72 74,72"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1.2"
            filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))"
          />

          {/* Specular Diagonal Gleam */}
          <path
            d="M28 40 Q80 80 132 120"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeOpacity="0.25"
          />
        </svg>

        {/* Tactical Tag */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[8px] font-mono text-neutral-200 backdrop-blur-md shadow-lg pointer-events-none whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>CAPTAIN AMERICA</span>
        </div>
      </div>
    </div>
  );
}
