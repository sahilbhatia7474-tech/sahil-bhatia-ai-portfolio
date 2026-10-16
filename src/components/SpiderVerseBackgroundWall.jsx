import { useEffect, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

/**
 * SpiderVerseBackgroundWall
 * 
 * Cinematic Dark-Themed Tobey Maguire Spider-Man 3 Symbiote Poster Wall
 * with Center Interstellar Cosmos, Dynamic Thunder/Lightning, and 3D Interactive Lightbox.
 * 
 * Strictly mounted on the background wall behind all page content (fixed z-[1] pointer-events-none).
 */

const STAR_COUNT_DESKTOP = 120;
const STAR_COUNT_MOBILE = 60;
const PARTICLE_COUNT = 18;
const MAX_WEB_DIST = 110;
const MAX_WEB_DIST_SQ = MAX_WEB_DIST * MAX_WEB_DIST;

export default function SpiderVerseBackgroundWall() {
  const canvasRef = useRef(null);
  const posterRef = useRef(null);
  const shieldRef = useRef(null);
  const [isPosterExpanded, setIsPosterExpanded] = useState(false);
  const [isShieldExpanded, setIsShieldExpanded] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, active: false });

  // Escape key listener to close poster lightbox modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPosterExpanded(false);
        setIsShieldExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = Number((((y - centerY) / centerY) * -16).toFixed(2));
    const rotY = Number((((x - centerX) / centerX) * 16).toFixed(2));
    const glareX = Number(((x / rect.width) * 100).toFixed(1));
    const glareY = Number(((y / rect.height) * 100).toFixed(1));
    setCardTilt({ rotX, rotY, glareX, glareY, active: true });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, active: false });
  };

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
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cornerWebs[1].x = width;
      cornerWebs[2].y = height;
      cornerWebs[3].x = width;
      cornerWebs[3].y = height;

      stars.forEach((s) => {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      });

      // Pre-render static geometric spider-webs to an offscreen buffer (Zero frame recalculation overhead)
      cornerWebsCanvas = document.createElement('canvas');
      cornerWebsCanvas.width = width;
      cornerWebsCanvas.height = height;
      const webCtx = cornerWebsCanvas.getContext('2d');
      if (webCtx) {
        for (let c = 0; c < cornerWebs.length; c++) {
          const web = cornerWebs[c];
          const spokeStep = (Math.PI * 0.5) / (web.spokes - 1);
          const startAngle = c === 0 ? 0 : c === 1 ? Math.PI * 0.5 : c === 2 ? Math.PI * 1.5 : Math.PI;

          webCtx.strokeStyle = 'rgba(240, 246, 255, 0.3)';
          webCtx.lineWidth = 0.9;

          const spokePoints = [];
          for (let s = 0; s < web.spokes; s++) {
            const angle = startAngle + s * spokeStep;
            const endX = web.x + Math.cos(angle) * web.radius;
            const endY = web.y + Math.sin(angle) * web.radius;

            webCtx.beginPath();
            webCtx.moveTo(web.x, web.y);
            webCtx.lineTo(endX, endY);
            webCtx.stroke();

            spokePoints.push({ angle });
          }

          for (let r = 1; r <= web.rings; r++) {
            const ringRadius = (web.radius / web.rings) * r;
            const isOuter = r === web.rings;
            webCtx.strokeStyle = isOuter ? 'rgba(255, 60, 75, 0.4)' : 'rgba(226, 232, 240, 0.25)';
            webCtx.lineWidth = isOuter ? 1.1 : 0.75;

            webCtx.beginPath();
            for (let s = 0; s < spokePoints.length; s++) {
              const pt = spokePoints[s];
              const px = web.x + Math.cos(pt.angle) * ringRadius;
              const py = web.y + Math.sin(pt.angle) * ringRadius;
              if (s === 0) webCtx.moveTo(px, py);
              else webCtx.lineTo(px, py);
            }
            webCtx.stroke();
          }
        }
      }

      // Pre-compute center galaxy radial gradient on resize (Zero garbage collector allocations in loop)
      const cX = width * 0.5;
      const cY = height * 0.5;
      galaxyGrad = ctx.createRadialGradient(cX, cY, 0, cX, cY, Math.min(width, height) * 0.38);
      galaxyGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
      galaxyGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.05)');
      galaxyGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.02)');
      galaxyGrad.addColorStop(1, 'transparent');
    };

    let cornerWebsCanvas = null;
    let galaxyGrad = null;

    handleResize();

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
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    let galaxyAngle = 0;
    let lastRenderTime = 0;

    // Main Render Loop with Adaptive Frame Rate Governor (Silky 60fps at all times, no scroll freeze)
    const render = (currentTime = 0) => {
      if (!prefersReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }

      // Frame throttle to standard display refresh (~60fps)
      if (currentTime - lastRenderTime < 16.6) {
        return;
      }
      lastRenderTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // Direct DOM update for poster & companion parallax (Zero React state overhead)
      if (mouse.active) {
        const normX = (mouse.x - width / 2) / (width / 2);
        const normY = (mouse.y - height / 2) / (height / 2);
        if (posterRef.current) {
          const transX = -normX * 18;
          const transY = -normY * 12;
          posterRef.current.style.transform = `translate3d(${transX}px, ${transY}px, 0)`;
        }
        if (shieldRef.current) {
          const px = ((mouse.x - width / 2) / width) * 16;
          const py = ((mouse.y - height / 2) / height) * 10;
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

      // Pre-cached Celestial Galaxy Glow
      if (galaxyGrad) {
        ctx.fillStyle = galaxyGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.min(width, height) * 0.38, 0, Math.PI * 2);
        ctx.fill();
      }

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
      // LAYER 4: CLEAN GEOMETRIC SPIDER-NETS (PRE-RENDERED HARDWARE BUFFER)
      // -------------------------------------------------------------
      if (cornerWebsCanvas) {
        ctx.drawImage(cornerWebsCanvas, 0, 0);
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
      document.removeEventListener('mouseleave', handleMouseLeave);
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
        {/* SPIDER-MAN 3 SYMBIOTE BLACK SUIT 3D INTERACTIVE POSTER    */}
        {/* ========================================================= */}
        <div
          ref={posterRef}
          className="absolute top-20 sm:top-24 right-3 sm:right-6 md:right-10 lg:right-14 xl:right-20 pointer-events-auto z-10 select-none will-change-transform"
        >
          {/* Subtle Ambient Symbiote Silver & Indigo Glow */}
          <div className="absolute -inset-5 bg-gradient-to-r from-blue-600/25 via-indigo-900/30 to-cyan-500/25 rounded-2xl blur-2xl pointer-events-none transition-opacity duration-300 opacity-70 group-hover:opacity-100" />

          {/* 3D Interactive Mini Poster Frame */}
          <div
            onClick={() => setIsPosterExpanded(true)}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="relative group w-32 sm:w-40 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden border border-white/30 hover:border-cyan-400/90 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_28px_70px_rgba(0,0,0,0.99),0_0_45px_rgba(56,189,248,0.55)] cursor-pointer select-none transition-all duration-300"
            style={{
              transform: cardTilt.active
                ? `perspective(800px) rotateX(${cardTilt.rotX}deg) rotateY(${cardTilt.rotY}deg) scale3d(1.06, 1.06, 1.06)`
                : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
              transition: cardTilt.active ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transformStyle: 'preserve-3d',
            }}
            title="Click to view full 4K Spider-Man 3 Black Suit poster"
          >
            {/* The Authentic Black Suit Theatrical Poster Artwork */}
            <img
              src="/assets/spiderman3_black_suit_poster.jpg"
              alt="Spider-Man 3 - Tobey Maguire in the Symbiote Black Suit"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Dynamic Interactive Specular Holographic Glare */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: cardTilt.active
                  ? `radial-gradient(circle 140px at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.12) 40%, transparent 80%)`
                  : 'none',
                opacity: cardTilt.active ? 1 : 0,
              }}
            />

            {/* Linear Shimmer Sweep on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {/* Expand Hover Hint */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="px-1.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-cyan-400/40 text-cyan-200 flex items-center gap-1 text-[9px] font-mono shadow-lg">
                <Maximize2 className="w-3 h-3 text-cyan-400" />
                <span>4K</span>
              </span>
            </div>

            {/* Bottom Metallic Lore Tag */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-between text-[8px] font-mono text-neutral-300 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                <span className="text-white font-bold tracking-wider">SPIDER-MAN 3</span>
              </div>
              <span className="text-[7.5px] text-cyan-300/80 uppercase font-semibold">BLACK SUIT</span>
            </div>
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
              alt="Captain America Vibranium Shield with Red Hulk Grip"
              loading="eager"
              decoding="async"
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
              <span className="text-red-400 font-bold truncate">VIBRANIUM SHIELD</span>
              <span className="text-[7px] text-neutral-400 shrink-0 ml-1">TACTICAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4K FULL POSTER MODAL VIEWER: SPIDER-MAN 3 BLACK SUIT      */}
      {/* ========================================================= */}
      {isPosterExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Spider-Man 3 Symbiote Black Suit Poster"
          className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setIsPosterExpanded(false)}
        >
          <div
            className="relative max-w-lg w-full rounded-2xl overflow-hidden border border-white/25 bg-gradient-to-b from-[#141624] via-[#090b14] to-[#040508] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_60px_rgba(56,189,248,0.25)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/15 bg-black/75">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span className="font-display font-black text-sm tracking-wider text-white uppercase">
                  SPIDER-MAN 3 &bull; THE SYMBIOTE BLACK SUIT
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
            <div className="p-4 flex items-center justify-center bg-black/80">
              <div className="max-h-[70vh] rounded-xl overflow-hidden border border-white/25 shadow-2xl bg-neutral-950">
                <img
                  src="/assets/spiderman3_black_suit_poster.jpg"
                  alt="Spider-Man 3 Symbiote Black Suit Official Theatrical Poster"
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-black/80 flex items-center justify-between font-mono text-xs text-neutral-300">
              <span className="text-neutral-400">Columbia Pictures &bull; Sam Raimi &bull; Tobey Maguire</span>
              <span className="text-cyan-400 font-bold">2007 Theatrical Release</span>
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
