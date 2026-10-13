import { useEffect, useRef, useState } from 'react';
import { Maximize2, X, Zap, Shield, Sparkles } from 'lucide-react';

/**
 * SpiderVerseBackgroundWall
 * 
 * Cinematic Dark-Themed Tobey Maguire Spider-Man 3 "The Battle Within" Wall
 * with Center Interstellar Cosmos, Dynamic Thunder/Lightning, and Avengers Allies.
 * 
 * Strictly mounted on the background wall behind all page content (fixed z-[1] pointer-events-none).
 */

const STAR_COUNT_DESKTOP = 220;
const STAR_COUNT_MOBILE = 110;
const PARTICLE_COUNT = 36;
const MAX_WEB_DIST = 115;
const MAX_WEB_DIST_SQ = MAX_WEB_DIST * MAX_WEB_DIST;

export default function SpiderVerseBackgroundWall() {
  const canvasRef = useRef(null);
  const posterRef = useRef(null);
  const ironManRef = useRef(null);
  const shieldRef = useRef(null);
  const [isPosterExpanded, setIsPosterExpanded] = useState(false);
  const [isShieldExpanded, setIsShieldExpanded] = useState(false);

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

    // 1. COSMIC STAR SPRINKLES
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const isCrimson = Math.random() < 0.12;
      const isCyan = Math.random() < 0.16;
      const isGold = Math.random() < 0.08;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.9,
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

    // 2. CENTER INTERSTELLAR GALAXY & WARP STAR LINES
    const warpLines = [];
    const warpCount = isTouch ? 28 : 54;
    for (let i = 0; i < warpCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.min(width, height) * 0.45 + 30;
      warpLines.push({
        angle,
        dist,
        length: Math.random() * 35 + 15,
        speed: Math.random() * 0.4 + 0.2,
        alpha: Math.random() * 0.4 + 0.25,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248, ' : 'rgba(240, 246, 255, ',
      });
    }

    // 3. CLEAN GEOMETRIC CORNER SPIDER-NETS (NO U-SHAPES)
    const cornerWebs = [
      { x: 0, y: 0, radius: 300, spokes: 8, rings: 5 },
      { x: width, y: 0, radius: 320, spokes: 8, rings: 5 },
      { x: 0, y: height, radius: 280, spokes: 7, rings: 5 },
      { x: width, y: height, radius: 320, spokes: 8, rings: 5 },
    ];

    // 4. FLOATING SUBTLE CONSTELLATION NODES
    const webNodes = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const z = Math.random() * 1.2 + 0.6;
      webNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * 0.25 * z,
        vy: (Math.random() - 0.5) * 0.25 * z,
        radius: Math.random() * 1.3 + 0.9,
        isRubyNode: Math.random() < 0.2,
        isArcNode: Math.random() < 0.15,
        alpha: Math.random() * 0.3 + 0.6,
      });
    }

    // 5. DYNAMIC THUNDER / LIGHTNING SIMULATION (बिजली कड़कती हुई)
    let lightningState = {
      active: false,
      flashAlpha: 0,
      boltSegments: [],
      nextStrikeTime: Date.now() + 3000 + Math.random() * 4000,
    };

    // Helper to generate a realistic jagged branching lightning bolt
    const generateLightning = (startX, startY, endX, endY) => {
      const segments = [];
      const generateBranch = (x1, y1, x2, y2, depth) => {
        if (depth <= 0) {
          segments.push({ x1, y1, x2, y2 });
          return;
        }
        const midX = (x1 + x2) * 0.5 + (Math.random() - 0.5) * (depth * 24);
        const midY = (y1 + y2) * 0.5 + (Math.random() - 0.5) * (depth * 14);
        generateBranch(x1, y1, midX, midY, depth - 1);
        generateBranch(midX, midY, x2, y2, depth - 1);

        // Recursive fork branch
        if (Math.random() < 0.35 && depth > 1) {
          const forkEndX = midX + (Math.random() - 0.5) * 60;
          const forkEndY = midY + Math.random() * 70;
          generateBranch(midX, midY, forkEndX, forkEndY, depth - 2);
        }
      };

      generateBranch(startX, startY, endX, endY, 4);
      return segments;
    };

    const triggerLightningStrike = () => {
      const startX = width * (0.2 + Math.random() * 0.6);
      const startY = 0;
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = height * (0.4 + Math.random() * 0.35);

      lightningState.active = true;
      lightningState.flashAlpha = 0.35 + Math.random() * 0.25;
      lightningState.boltSegments = generateLightning(startX, startY, endX, endY);
      lightningState.nextStrikeTime = Date.now() + 5000 + Math.random() * 5000;
    };

    // Listen for custom trigger from Footer Easter Egg or external events
    const handleProtocolTrigger = () => {
      triggerLightningStrike();
    };
    window.addEventListener('avengers-protocol-trigger', handleProtocolTrigger);

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

    let isScrolling = false;
    let scrollTimeout = null;
    const handleScroll = () => {
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
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
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let galaxyAngle = 0;
    let lastRenderTime = 0;

    // Main Render Loop with Adaptive Frame Rate Governor
    const render = (currentTime = 0) => {
      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }

      // Cap at 60fps on desktop, 30fps while scrolling to preserve 120Hz native scroll physics
      const targetInterval = isScrolling ? 32 : 16.6;
      if (currentTime - lastRenderTime < targetInterval) {
        return;
      }
      lastRenderTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Direct DOM update for poster & companion parallax (Zero React state overhead)
      if (mouse.active) {
        const px = ((mouse.x - width / 2) / width) * 16;
        const py = ((mouse.y - height / 2) / height) * 10;
        if (posterRef.current) {
          posterRef.current.style.transform = `translate3d(${-px}px, ${-py}px, 0)`;
        }
        if (ironManRef.current) {
          ironManRef.current.style.transform = `translate3d(${px * 0.7}px, ${-py * 0.7}px, 0)`;
        }
        if (shieldRef.current) {
          shieldRef.current.style.transform = `translate3d(${px * 0.6}px, ${py * 0.6}px, 0)`;
        }
      }

      // Smooth mouse follow
      if (!prefersReducedMotion) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      // -------------------------------------------------------------
      // LAYER 1: CENTER COSMOS / INTERSTELLAR GALAXY & WARP STAR LINES
      // -------------------------------------------------------------
      if (!prefersReducedMotion) {
        galaxyAngle += 0.0012;
      }

      // Celestial Galaxy Glow in Center
      const galaxyGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.min(width, height) * 0.38
      );
      galaxyGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)'); // Indigo galactic core
      galaxyGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.05)'); // Cyan celestial arms
      galaxyGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.02)'); // Crimson fringe
      galaxyGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = galaxyGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // Warp Interstellar Star Lines streaming from Center
      for (let i = 0; i < warpLines.length; i++) {
        const wl = warpLines[i];
        if (!prefersReducedMotion) {
          wl.dist += wl.speed * 1.5;
          if (wl.dist > Math.min(width, height) * 0.5) {
            wl.dist = 25;
            wl.angle = Math.random() * Math.PI * 2;
          }
        }
        const lx1 = centerX + Math.cos(wl.angle + galaxyAngle) * wl.dist;
        const ly1 = centerY + Math.sin(wl.angle + galaxyAngle) * wl.dist;
        const lx2 = centerX + Math.cos(wl.angle + galaxyAngle) * (wl.dist + wl.length);
        const ly2 = centerY + Math.sin(wl.angle + galaxyAngle) * (wl.dist + wl.length);

        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.strokeStyle = `${wl.color}${wl.alpha})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // LAYER 2: TWINKLING COSMIC STARS
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

        if (s.isCrossFlare && currentAlpha > 0.6) {
          const flareLen = s.radius * 3.0;
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
      // LAYER 3: DYNAMIC REALISTIC THUNDER & LIGHTNING (बिजली कड़कती हुई)
      // -------------------------------------------------------------
      if (!prefersReducedMotion && Date.now() > lightningState.nextStrikeTime) {
        triggerLightningStrike();
      }

      if (lightningState.active) {
        // Sky Atmospheric Flash
        if (lightningState.flashAlpha > 0.02) {
          ctx.fillStyle = `rgba(186, 230, 253, ${lightningState.flashAlpha * 0.25})`;
          ctx.fillRect(0, 0, width, height);
          lightningState.flashAlpha *= 0.85;
        }

        // Draw Jagged Electric Bolt Segments
        if (lightningState.boltSegments.length > 0) {
          // Electric Cyan Outer Glow
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.lineWidth = 3.2;
          ctx.beginPath();
          for (let b = 0; b < lightningState.boltSegments.length; b++) {
            const seg = lightningState.boltSegments[b];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.stroke();

          // White Hot Core
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          for (let b = 0; b < lightningState.boltSegments.length; b++) {
            const seg = lightningState.boltSegments[b];
            ctx.moveTo(seg.x1, seg.y1);
            ctx.lineTo(seg.x2, seg.y2);
          }
          ctx.stroke();
        }

        if (lightningState.flashAlpha <= 0.02) {
          lightningState.active = false;
          lightningState.boltSegments = [];
        }
      }

      // -------------------------------------------------------------
      // LAYER 4: CLEAN GEOMETRIC SPIDER-NETS (NO U-SHAPES)
      // -------------------------------------------------------------
      for (let c = 0; c < cornerWebs.length; c++) {
        const web = cornerWebs[c];
        const spokeStep = (Math.PI * 0.5) / (web.spokes - 1);
        const startAngle = c === 0 ? 0 : c === 1 ? Math.PI * 0.5 : c === 2 ? Math.PI * 1.5 : Math.PI;

        ctx.strokeStyle = 'rgba(240, 246, 255, 0.3)';
        ctx.lineWidth = 0.9;

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

        for (let r = 1; r <= web.rings; r++) {
          const ringRadius = (web.radius / web.rings) * r;
          const isOuter = r === web.rings;
          ctx.strokeStyle = isOuter ? 'rgba(255, 60, 75, 0.4)' : 'rgba(226, 232, 240, 0.25)';
          ctx.lineWidth = isOuter ? 1.1 : 0.75;

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
      // LAYER 5: REAL-TIME SUBTLE WEB SHOOTING FROM POSTER TO MOUSE
      // -------------------------------------------------------------
      const posterOriginX = width > 1024 ? width * 0.86 : width * 0.8;
      const posterOriginY = 160;

      if (mouse.active) {
        ctx.beginPath();
        ctx.moveTo(posterOriginX, posterOriginY);
        const midX = (posterOriginX + mouse.x) * 0.5;
        const midY = (posterOriginY + mouse.y) * 0.5 + 20;
        ctx.quadraticCurveTo(midX, midY, mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
      }

      // -------------------------------------------------------------
      // LAYER 6: FLOATING CONSTELLATION WEB NODES
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
          p.x = p.originX - offsetX * 20 * p.z;
          p.y = p.originY - offsetY * 20 * p.z;
        } else {
          p.x = p.originX;
          p.y = p.originY;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isRubyNode
          ? 'rgba(255, 42, 58, 0.8)'
          : p.isArcNode
          ? 'rgba(56, 189, 248, 0.85)'
          : 'rgba(255, 255, 255, 0.75)';
        ctx.fill();

        for (let j = i + 1; j < webNodes.length; j++) {
          const p2 = webNodes[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MAX_WEB_DIST_SQ) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / MAX_WEB_DIST) * 0.45 * Math.min(p.z, p2.z);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(240, 246, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('avengers-protocol-trigger', handleProtocolTrigger);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-[1] select-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Hardware-Accelerated Canvas for Stars, Center Cosmos, Lightning, and Webs */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />

        {/* ========================================================= */}
        {/* SPIDER-MAN 3 "THE BATTLE WITHIN" MINI POSTER ("chota sa") */}
        {/* ========================================================= */}
        <div
          ref={posterRef}
          className="absolute top-20 sm:top-24 right-3 sm:right-6 md:right-10 lg:right-14 xl:right-20 pointer-events-auto transition-transform duration-100 ease-out z-10 select-none will-change-transform"
        >
          {/* Subtle Ambient Red/Blue Dual Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-transparent to-blue-600/20 rounded-2xl blur-xl pointer-events-none" />

          {/* Compact Mini Poster Frame */}
          <div
            onClick={() => setIsPosterExpanded(true)}
            className="relative group w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden border border-white/25 hover:border-red-500/80 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(255,42,58,0.25)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_36px_rgba(255,42,58,0.45)] transition-all duration-300 cursor-pointer active:scale-95"
            title="Click to view full Spider-Man 3 The Battle Within poster"
          >
            {/* The Authentic Split Poster Artwork */}
            <img
              src="/assets/spiderman3_battle_within.svg"
              alt="Spider-Man 3 - The Battle Within"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Specular Glint Shimmer on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {/* Expand Hover Hint */}
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                <Maximize2 className="w-3 h-3 text-cyan-400" />
              </span>
            </div>

            {/* Bottom Tag */}
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-[8px] font-mono text-neutral-300">
              <span className="text-red-400 font-bold">SPIDER-MAN 3</span>
              <span className="text-[7px] text-neutral-400">2007</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* AVENGERS COMPANION: IRON MAN MARK 85 (UPPER-LEFT FLIGHT)  */}
        {/* ========================================================= */}
        <div
          ref={ironManRef}
          className="absolute top-24 sm:top-28 left-4 sm:left-8 md:left-14 w-28 h-28 sm:w-36 sm:h-36 pointer-events-none transition-transform duration-300 ease-out z-10 will-change-transform"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-xl pointer-events-none animate-pulse" />
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_16px_rgba(56,189,248,0.4)]" fill="none">
            {/* Helm & Faceplate */}
            <path d="M80 60 C85 45, 115 45, 120 60 C128 72, 125 92, 118 98 C112 102, 88 102, 82 98 C75 92, 72 72, 80 60 Z" fill="#9f1239" stroke="#4c0519" strokeWidth="1.5" />
            <path d="M85 68 C90 58, 110 58, 115 68 C118 76, 116 88, 112 92 C108 95, 92 95, 88 92 C84 88, 82 76, 85 68 Z" fill="#facc15" />
            {/* Glowing Eyes */}
            <rect x="88" y="74" width="7" height="2.5" rx="0.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
            <rect x="105" y="74" width="7" height="2.5" rx="0.5" fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)" />
            {/* Arc Reactor Unibeam */}
            <circle cx="100" cy="130" r="11" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="100" cy="130" r="7" fill="#ffffff" filter="drop-shadow(0 0 8px #38bdf8)" />
          </svg>
          <div className="absolute -bottom-1 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-cyan-400/40 text-[8px] font-mono text-cyan-200">
            IRON MAN
          </div>
        </div>

        {/* ========================================================= */}
        {/* AVENGERS COMPANION: CAPTAIN AMERICA VIBRANIUM SHIELD      */}
        {/* WITH RED HULK GRIP (BRAVE NEW WORLD TEASER POSTER)        */}
        {/* ========================================================= */}
        <div
          ref={shieldRef}
          className="absolute bottom-16 sm:bottom-20 left-3 sm:left-6 md:left-10 lg:left-14 pointer-events-auto transition-transform duration-300 ease-out z-10 select-none will-change-transform"
        >
          {/* Volcanic Crimson & Vibranium Blue Ambient Flare */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/35 via-rose-900/20 to-cyan-500/25 rounded-2xl blur-xl pointer-events-none" />

          {/* Compact Mini Poster Frame */}
          <div
            onClick={() => setIsShieldExpanded(true)}
            className="relative group w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-xl overflow-hidden border border-white/25 hover:border-red-500/80 bg-black shadow-[0_16px_40px_rgba(0,0,0,0.95),0_0_24px_rgba(255,42,58,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_36px_rgba(255,42,58,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
            title="Click to view full Captain America: Brave New World Red Hulk & Shield poster"
          >
            {/* The Authentic Red Hulk Gripped Shield Poster Artwork */}
            <img
              src="/assets/cap_shield_red_hulk.jpg"
              alt="Captain America: Brave New World - Red Hulk Gripping Vibranium Shield"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Specular Glint Shimmer on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {/* Expand Hover Hint */}
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                <Maximize2 className="w-3 h-3 text-red-400" />
              </span>
            </div>

            {/* Bottom Tag */}
            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black via-black/85 to-transparent flex items-center justify-between text-[8px] font-mono text-neutral-300">
              <span className="text-red-400 font-bold truncate">BRAVE NEW WORLD</span>
              <span className="text-[7px] text-neutral-400 shrink-0 ml-1">2.14.25</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4K FULL POSTER MODAL VIEWER: SPIDER-MAN 3                 */}
      {/* ========================================================= */}
      {isPosterExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spider-Man 3 The Battle Within Poster"
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsPosterExpanded(false)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-white/25 bg-gradient-to-b from-[#141624] to-[#07080e] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_60px_rgba(255,42,58,0.3)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/15 bg-black/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-display font-black text-sm tracking-wider text-white uppercase">
                  SPIDER-MAN 3 &bull; THE BATTLE WITHIN
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPosterExpanded(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                aria-label="Close poster viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Poster Image */}
            <div className="p-4 flex items-center justify-center bg-black/60">
              <div className="max-h-[70vh] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src="/assets/spiderman3_battle_within.svg"
                  alt="Spider-Man 3 The Battle Within Theatrical Poster"
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-black/70 flex items-center justify-between font-mono text-xs text-neutral-400">
              <span>Sam Raimi &bull; Tobey Maguire</span>
              <span className="text-red-400 font-bold">2007 Theatrical Release</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4K FULL POSTER MODAL VIEWER: CAPTAIN AMERICA BRAVE NEW WORLD */}
      {/* ========================================================= */}
      {isShieldExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Captain America: Brave New World Red Hulk Teaser Poster"
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsShieldExpanded(false)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-white/25 bg-gradient-to-b from-[#181216] via-[#0d090d] to-[#050406] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_60px_rgba(255,42,58,0.4)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/15 bg-black/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff2a3a]" />
                <span className="font-display font-black text-sm tracking-wider text-white uppercase">
                  CAPTAIN AMERICA &bull; BRAVE NEW WORLD
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsShieldExpanded(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                aria-label="Close poster viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Poster Image */}
            <div className="p-4 flex items-center justify-center bg-black/70">
              <div className="max-h-[70vh] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src="/assets/cap_shield_red_hulk.jpg"
                  alt="Captain America: Brave New World Teaser Poster featuring Red Hulk gripping the Vibranium Shield"
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-black/80 flex items-center justify-between font-mono text-xs text-neutral-300">
              <span className="text-neutral-400">Anthony Mackie &bull; Harrison Ford as Red Hulk</span>
              <span className="text-red-400 font-bold">2.14.25 In Theaters</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
