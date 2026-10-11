import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * useFramer3DTilt
 * 
 * Production-grade Framer Motion hook for authentic 3D spatial tilt,
 * translate, lift, and specular glare physics driven by pointer movement.
 * 
 * Features:
 * - Spring-damped inertia (no robotic linear tilts)
 * - Restrained pitch/yaw limits preventing distortion
 * - Z-axis elevation & scale lift
 * - Specular optical reflection tracking
 * - Smooth spring-return to resting plane on pointer leave
 * - Respects prefers-reduced-motion automatically
 */
export function useFramer3DTilt({
  maxRotateX = 7.5,
  maxRotateY = 9.5,
  maxTranslateX = 7,
  maxTranslateY = 5,
  liftZ = 16,
  scale = 1.015,
  stiffness = 280,
  damping = 26,
} = {}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isReduced, setIsReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handler = (e) => setIsReduced(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  // Normalized pointer coordinates within card bounds (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const lift = useMotionValue(0);

  // Framer-motion physical springs with mass & damping
  const springX = useSpring(normX, { stiffness, damping, mass: 0.55 });
  const springY = useSpring(normY, { stiffness, damping, mass: 0.55 });
  const springLift = useSpring(lift, { stiffness: 320, damping: 28, mass: 0.5 });

  // 3D Motion transforms
  const rotateX = useTransform(springY, [-0.5, 0.5], isReduced ? ['0deg', '0deg'] : [`${maxRotateX}deg`, `-${maxRotateX}deg`]);
  const rotateY = useTransform(springX, [-0.5, 0.5], isReduced ? ['0deg', '0deg'] : [`-${maxRotateY}deg`, `${maxRotateY}deg`]);
  const translateX = useTransform(springX, [-0.5, 0.5], isReduced ? ['0px', '0px'] : [`-${maxTranslateX}px`, `${maxTranslateX}px`]);
  const translateY = useTransform(springY, [-0.5, 0.5], isReduced ? ['0px', '0px'] : [`-${maxTranslateY}px`, `${maxTranslateY}px`]);
  const translateZ = useTransform(springLift, [0, 1], isReduced ? ['0px', '0px'] : ['0px', `${liftZ}px`]);
  const cardScale = useTransform(springLift, [0, 1], isReduced ? [1, 1] : [1, scale]);

  // Specular Glare values
  const glareX = useTransform(springX, [-0.5, 0.5], ['10%', '90%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['10%', '90%']);
  const glareOpacity = useTransform(springLift, [0, 1], [0, 0.22]);

  const handleMouseMove = useCallback((e) => {
    if (isReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    normX.set(Math.max(-0.5, Math.min(0.5, x)));
    normY.set(Math.max(-0.5, Math.min(0.5, y)));
  }, [isReduced, normX, normY]);

  const handleMouseEnter = useCallback(() => {
    if (isReduced) return;
    setIsHovered(true);
    lift.set(1);
  }, [isReduced, lift]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
    lift.set(0);
  }, [normX, normY, lift]);

  return {
    cardRef,
    isHovered,
    rotateX,
    rotateY,
    translateX,
    translateY,
    translateZ,
    scale: cardScale,
    glareX,
    glareY,
    glareOpacity,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    motionProps: {
      ref: cardRef,
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      style: {
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        z: translateZ,
        scale: cardScale,
        transformStyle: isReduced ? 'flat' : 'preserve-3d',
      },
    },
  };
}
