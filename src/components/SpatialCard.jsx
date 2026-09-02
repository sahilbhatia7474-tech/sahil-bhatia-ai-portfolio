import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';

/**
 * SAHIL PORTFOLIO OS — SPATIAL PHYSICS V2
 * 
 * True 3D Spatial Card Physics with:
 * - Resting state elevation & restrained border
 * - Press/touch lift (scale ~1.015 - 1.02, translateZ lift)
 * - Controlled 3D transform (-8deg to +8deg rotateX, -12deg to +12deg rotateY)
 * - 3-Layer Internal Parallax (Surface / Content / Highlight)
 * - Directional Red Edge Light (follows pointer/finger position)
 * - Specular acrylic sheen with moving reflection
 * - Physics-based spring-back on release
 * - Touch-safe mobile gesture thresholding (zero scroll hijacking)
 * - User-driven only (no constant looping/floating animation)
 */

const SpatialContext = createContext({
  isInteracting: false,
  normX: 0,
  normY: 0,
  depths: { layer1: 0, layer2: 12, layer3: 26 },
});

export const useSpatialCard = () => useContext(SpatialContext);

// Sub-component for Layered Parallax
export function SpatialLayer({ depth = 2, className = '', children, style = {}, ...props }) {
  const { isInteracting, normX, normY, depths } = useSpatialCard();
  
  let zOffset = depths.layer2;
  let moveMultiplier = 4;
  if (depth === 1) {
    zOffset = depths.layer1;
    moveMultiplier = 1;
  } else if (depth === 3) {
    zOffset = depths.layer3;
    moveMultiplier = 8;
  } else if (typeof depth === 'number') {
    zOffset = depth;
    moveMultiplier = depth * 0.3;
  }

  // Calculate subtle lateral parallax translation based on tilt angle
  const transX = isInteracting ? normX * moveMultiplier : 0;
  const transY = isInteracting ? normY * moveMultiplier : 0;

  return (
    <div
      className={`transition-transform duration-150 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, ${zOffset}px)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

const INTENSITY_MAP = {
  high: {
    maxRotX: 8.5,
    maxRotY: 12.5,
    scale: 1.022,
    liftZ: 22,
    depths: { layer1: 0, layer2: 16, layer3: 34 },
    glareAlpha: 0.18,
    edgeGlow: 0.35,
  },
  'medium-high': {
    maxRotX: 8.0,
    maxRotY: 11.5,
    scale: 1.018,
    liftZ: 18,
    depths: { layer1: 0, layer2: 14, layer3: 28 },
    glareAlpha: 0.15,
    edgeGlow: 0.3,
  },
  strong: {
    maxRotX: 8.0,
    maxRotY: 11.5,
    scale: 1.018,
    liftZ: 18,
    depths: { layer1: 0, layer2: 14, layer3: 28 },
    glareAlpha: 0.15,
    edgeGlow: 0.3,
  },
  medium: {
    maxRotX: 6.5,
    maxRotY: 9.5,
    scale: 1.015,
    liftZ: 14,
    depths: { layer1: 0, layer2: 10, layer3: 22 },
    glareAlpha: 0.12,
    edgeGlow: 0.25,
  },
  subtle: {
    maxRotX: 5.5,
    maxRotY: 8.0,
    scale: 1.012,
    liftZ: 10,
    depths: { layer1: 0, layer2: 8, layer3: 16 },
    glareAlpha: 0.1,
    edgeGlow: 0.2,
  },
  low: {
    maxRotX: 3.5,
    maxRotY: 5.5,
    scale: 1.008,
    liftZ: 6,
    depths: { layer1: 0, layer2: 5, layer3: 10 },
    glareAlpha: 0.08,
    edgeGlow: 0.15,
  },
  micro: {
    maxRotX: 2.5,
    maxRotY: 4.0,
    scale: 1.005,
    liftZ: 4,
    depths: { layer1: 0, layer2: 3, layer3: 6 },
    glareAlpha: 0.06,
    edgeGlow: 0.12,
  },
};

export default function SpatialCard({
  children,
  className = '',
  intensity = 'medium',
  glare = true,
  activeBorder = true,
  onClick,
  id,
  role,
  tabIndex,
  style = {},
  ...rest
}) {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0, time: 0 });
  const isTouchScrolling = useRef(false);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [normX, setNormX] = useState(0);
  const [normY, setNormY] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const config = INTENSITY_MAP[intensity] || INTENSITY_MAP.medium;

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);

      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (media.addEventListener) {
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
      }
    }
  }, []);

  // Physics Spring-Back Animation
  const springBack = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let currentX = rotX;
    let currentY = rotY;
    let currentNormX = normX;
    let currentNormY = normY;

    const animate = () => {
      // Damped spring physics
      currentX += (0 - currentX) * 0.18;
      currentY += (0 - currentY) * 0.18;
      currentNormX += (0 - currentNormX) * 0.18;
      currentNormY += (0 - currentNormY) * 0.18;

      if (Math.abs(currentX) < 0.05 && Math.abs(currentY) < 0.05) {
        setRotX(0);
        setRotY(0);
        setNormX(0);
        setNormY(0);
        setIsInteracting(false);
        setGlarePos((prev) => ({ ...prev, opacity: 0 }));
      } else {
        setRotX(currentX);
        setRotY(currentY);
        setNormX(currentNormX);
        setNormY(currentNormY);
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [rotX, rotY, normX, normY]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Mouse Move Handler
  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nX = Math.max(-1, Math.min(1, (mouseX / width - 0.5) * 2));
    const nY = Math.max(-1, Math.min(1, (mouseY / height - 0.5) * 2));

    // Controlled 3D rotation: rotateX inverted for natural physical pitch
    const newRotX = -nY * config.maxRotX;
    const newRotY = nX * config.maxRotY;

    setRotX(newRotX);
    setRotY(newRotY);
    setNormX(nX);
    setNormY(nY);
    setIsInteracting(true);

    if (glare) {
      setGlarePos({
        x: Math.round((mouseX / width) * 100),
        y: Math.round((mouseY / height) * 100),
        opacity: config.glareAlpha,
      });
    }
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    setIsInteracting(true);
  };

  const handleMouseLeave = () => {
    springBack();
  };

  // Touch Handlers with Gesture Thresholding (ZERO hijacking of vertical page scroll)
  const handleTouchStart = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    isTouchScrolling.current = false;
  };

  const handleTouchMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || isTouchScrolling.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

    // If vertical displacement dominates, defer to native browser page scrolling
    if (deltaY > 12 && deltaY > deltaX * 1.4) {
      isTouchScrolling.current = true;
      springBack();
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    const nX = Math.max(-1, Math.min(1, (mouseX / rect.width - 0.5) * 2));
    const nY = Math.max(-1, Math.min(1, (mouseY / rect.height - 0.5) * 2));

    // Noticeable, tactile mobile rotation response
    const newRotX = -nY * config.maxRotX;
    const newRotY = nX * config.maxRotY;

    setRotX(newRotX);
    setRotY(newRotY);
    setNormX(nX);
    setNormY(nY);
    setIsInteracting(true);

    if (glare) {
      setGlarePos({
        x: Math.round((mouseX / rect.width) * 100),
        y: Math.round((mouseY / rect.height) * 100),
        opacity: config.glareAlpha * 1.1,
      });
    }
  };

  const handleTouchEnd = () => {
    isTouchScrolling.current = false;
    springBack();
  };

  // Calculate dynamic directional red edge lighting
  const directionalShadow = isInteracting && activeBorder && !prefersReducedMotion
    ? `${(-normX * 10).toFixed(1)}px ${(-normY * 8).toFixed(1)}px 28px rgba(255,42,58,${config.edgeGlow}), 0 24px 55px -12px rgba(0,0,0,0.92)`
    : '0 10px 30px -15px rgba(0,0,0,0.7)';

  return (
    <SpatialContext.Provider value={{ isInteracting, normX, normY, depths: config.depths }}>
      <div
        style={{ perspective: prefersReducedMotion ? 'none' : '1100px' }}
        className="w-full h-full"
      >
        <div
          id={id}
          ref={cardRef}
          role={role}
          tabIndex={tabIndex}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`relative overflow-hidden select-none ${className} ${
            isInteracting && activeBorder ? 'border-red-500/60 ring-1 ring-red-500/30' : ''
          }`}
          style={{
            transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
            transform: prefersReducedMotion
              ? 'none'
              : `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(${isInteracting ? config.liftZ : 0}px) scale(${isInteracting ? config.scale : 1})`,
            transition: isInteracting
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.35s ease, border-color 0.3s ease',
            boxShadow: prefersReducedMotion ? undefined : directionalShadow,
            ...style,
          }}
          {...rest}
        >
          {/* DIRECTIONAL RED EDGE LIGHT OVERLAY */}
          {activeBorder && !prefersReducedMotion && (
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-200 z-20"
              style={{
                opacity: isInteracting ? 1 : 0,
                background: `radial-gradient(ellipse 130% 130% at ${(50 + normX * 45).toFixed(0)}% ${(50 + normY * 45).toFixed(0)}%, rgba(255,42,58,0.22) 0%, transparent 65%)`,
              }}
            />
          )}

          {/* SPECULAR ACRYLIC GLARE / LIGHT REFLECTION */}
          {glare && !prefersReducedMotion && (
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-150 z-30 mix-blend-screen"
              style={{
                background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, rgba(255,42,58,0.08) 45%, transparent 75%)`,
                opacity: glarePos.opacity,
              }}
            />
          )}

          {/* INTERNAL CONTENT (Parallax Root) */}
          <div
            className="relative z-10 w-full h-full"
            style={{ transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d' }}
          >
            {children}
          </div>
        </div>
      </div>
    </SpatialContext.Provider>
  );
}

SpatialCard.Layer = SpatialLayer;
