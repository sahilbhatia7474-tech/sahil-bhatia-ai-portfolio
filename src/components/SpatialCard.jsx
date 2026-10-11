import { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * SAHIL PORTFOLIO OS — FRAMER-MOTION SPATIAL PHYSICS
 * 
 * Powered by Framer Motion:
 * - True 3D Spatial Card Physics with spring inertia & damping
 * - Spring-damped 3D rotation (rotateX & rotateY)
 * - Lateral parallax translation (translateX & translateY)
 * - Z-axis elevation lift (translateZ) and subtle depth scale
 * - Dynamic directional red edge light & specular glare
 * - Full reduced-motion graceful fallback
 * - Touch-safe mobile gesture thresholding
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
    magX: 10,
    magY: 8,
    scale: 1.022,
    liftZ: 22,
    depths: { layer1: 0, layer2: 16, layer3: 34 },
    glareAlpha: 0.18,
    edgeGlow: 0.35,
  },
  'medium-high': {
    maxRotX: 8.0,
    maxRotY: 11.5,
    magX: 8,
    magY: 6,
    scale: 1.018,
    liftZ: 18,
    depths: { layer1: 0, layer2: 14, layer3: 28 },
    glareAlpha: 0.15,
    edgeGlow: 0.3,
  },
  strong: {
    maxRotX: 8.0,
    maxRotY: 11.5,
    magX: 8,
    magY: 6,
    scale: 1.018,
    liftZ: 18,
    depths: { layer1: 0, layer2: 14, layer3: 28 },
    glareAlpha: 0.15,
    edgeGlow: 0.3,
  },
  medium: {
    maxRotX: 6.5,
    maxRotY: 9.5,
    magX: 7,
    magY: 5,
    scale: 1.015,
    liftZ: 14,
    depths: { layer1: 0, layer2: 10, layer3: 22 },
    glareAlpha: 0.12,
    edgeGlow: 0.25,
  },
  subtle: {
    maxRotX: 5.5,
    maxRotY: 8.0,
    magX: 5,
    magY: 4,
    scale: 1.012,
    liftZ: 10,
    depths: { layer1: 0, layer2: 8, layer3: 16 },
    glareAlpha: 0.1,
    edgeGlow: 0.2,
  },
  low: {
    maxRotX: 3.5,
    maxRotY: 5.5,
    magX: 4,
    magY: 3,
    scale: 1.008,
    liftZ: 6,
    depths: { layer1: 0, layer2: 5, layer3: 10 },
    glareAlpha: 0.08,
    edgeGlow: 0.15,
  },
  micro: {
    maxRotX: 2.5,
    maxRotY: 4.0,
    magX: 3,
    magY: 2,
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
  const touchStartPos = useRef({ x: 0, y: 0, time: 0 });
  const isTouchScrolling = useRef(false);

  const [isInteracting, setIsInteracting] = useState(false);
  const [normState, setNormState] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const config = INTENSITY_MAP[intensity] || INTENSITY_MAP.medium;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (media.addEventListener) {
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
      }
    }
  }, []);

  // Framer Motion spring values
  const x = useMotionValue(0); // -0.5 to 0.5
  const y = useMotionValue(0); // -0.5 to 0.5
  const lift = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 280, damping: 25, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 280, damping: 25, mass: 0.5 });
  const springLift = useSpring(lift, { stiffness: 320, damping: 28, mass: 0.5 });

  const rotateX = useTransform(springY, [-0.5, 0.5], prefersReducedMotion ? ['0deg', '0deg'] : [`${config.maxRotX}deg`, `-${config.maxRotX}deg`]);
  const rotateY = useTransform(springX, [-0.5, 0.5], prefersReducedMotion ? ['0deg', '0deg'] : [`-${config.maxRotY}deg`, `${config.maxRotY}deg`]);
  const transX = useTransform(springX, [-0.5, 0.5], prefersReducedMotion ? ['0px', '0px'] : [`-${config.magX || 6}px`, `${config.magX || 6}px`]);
  const transY = useTransform(springY, [-0.5, 0.5], prefersReducedMotion ? ['0px', '0px'] : [`-${config.magY || 5}px`, `${config.magY || 5}px`]);
  const transZ = useTransform(springLift, [0, 1], prefersReducedMotion ? ['0px', '0px'] : ['0px', `${config.liftZ}px`]);
  const scale = useTransform(springLift, [0, 1], prefersReducedMotion ? [1, 1] : [1, config.scale]);

  const glareX = useTransform(springX, [-0.5, 0.5], ['10%', '90%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['10%', '90%']);
  const glareOpacity = useTransform(springLift, [0, 1], [0, config.glareAlpha]);

  const handleMouseMove = useCallback((e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const normMouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const normMouseY = (e.clientY - rect.top) / rect.height - 0.5;

    const clampedX = Math.max(-0.5, Math.min(0.5, normMouseX));
    const clampedY = Math.max(-0.5, Math.min(0.5, normMouseY));

    x.set(clampedX);
    y.set(clampedY);
    setNormState({ x: clampedX * 2, y: clampedY * 2 });
    setIsInteracting(true);
  }, [prefersReducedMotion, x, y]);

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsInteracting(true);
    lift.set(1);
  }, [prefersReducedMotion, lift]);

  const handleMouseLeave = useCallback(() => {
    setIsInteracting(false);
    x.set(0);
    y.set(0);
    lift.set(0);
    setNormState({ x: 0, y: 0 });
  }, [x, y, lift]);

  // Touch handlers
  const handleTouchStart = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    isTouchScrolling.current = false;
  };

  const handleTouchMove = (e) => {
    if (prefersReducedMotion || !cardRef.current || isTouchScrolling.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      isTouchScrolling.current = true;
      handleMouseLeave();
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const normMouseX = Math.max(-0.5, Math.min(0.5, (touch.clientX - rect.left) / rect.width - 0.5));
    const normMouseY = Math.max(-0.5, Math.min(0.5, (touch.clientY - rect.top) / rect.height - 0.5));

    x.set(normMouseX);
    y.set(normMouseY);
    lift.set(1);
    setNormState({ x: normMouseX * 2, y: normMouseY * 2 });
    setIsInteracting(true);
  };

  const handleTouchEnd = () => {
    handleMouseLeave();
  };

  return (
    <SpatialContext.Provider value={{ isInteracting, normX: normState.x, normY: normState.y, depths: config.depths }}>
      <div
        style={{ perspective: prefersReducedMotion ? 'none' : '1100px' }}
        className="w-full h-full"
      >
        <motion.div
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
          className={`relative overflow-hidden select-none depth-occlude-grid ${className} ${
            isInteracting && activeBorder ? 'border-red-500/60 ring-1 ring-red-500/30' : ''
          }`}
          style={{
            rotateX,
            rotateY,
            x: transX,
            y: transY,
            z: transZ,
            scale,
            transformStyle: prefersReducedMotion ? 'flat' : 'preserve-3d',
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
                background: `radial-gradient(ellipse 130% 130% at ${(50 + normState.x * 45).toFixed(0)}% ${(50 + normState.y * 45).toFixed(0)}%, rgba(255,42,58,0.22) 0%, transparent 65%)`,
              }}
            />
          )}

          {/* SPECULAR ACRYLIC GLARE / LIGHT REFLECTION */}
          {glare && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-[inherit] z-30 mix-blend-screen"
              style={{
                background: 'radial-gradient(circle 280px at center, rgba(255,255,255,0.2) 0%, rgba(255,42,58,0.08) 45%, transparent 75%)',
                left: glareX,
                top: glareY,
                opacity: glareOpacity,
                transform: 'translate(-50%, -50%)',
                width: '180%',
                height: '180%',
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
        </motion.div>
      </div>
    </SpatialContext.Provider>
  );
}

SpatialCard.Layer = SpatialLayer;
