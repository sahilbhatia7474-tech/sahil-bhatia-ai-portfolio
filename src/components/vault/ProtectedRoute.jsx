import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/authContext';
import VaultLogin from './VaultLogin';
import VaultPageTransitionOverlay from './VaultPageTransitionOverlay';

/**
 * STRICT ROUTE-LEVEL SECURITY GATEWAY FOR FOUNDER VAULT WITH ULTRA-FAST CYBER TRANSITIONS
 * 
 * Flow:
 * 1. Public Site -> Lock Screen: Loads IMMEDIATELY (0ms wait, zero blockage).
 * 2. Lock Screen -> Vault Dashboard: Snappy cyber unlock transition (~550ms total, well under 1-2s limit).
 * 3. Preloads VaultLayout chunk in the background so dashboard reveals with zero hesitation.
 */
export const ProtectedRoute = ({ children }) => {
  const { isVaultUnlocked, authError, role } = useAuth();

  // Internal state tracking which screen is rendered
  const [displayedUnlocked, setDisplayedUnlocked] = useState(isVaultUnlocked);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('unlock');
  
  const prevUnlockedRef = useRef(isVaultUnlocked);
  const isInitialMount = useRef(true);

  // Synchronize on transition
  useEffect(() => {
    // Initial mount: display correct screen immediately without blocking the user
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayedUnlocked(isVaultUnlocked);
      prevUnlockedRef.current = isVaultUnlocked;
      setIsOverlayOpen(false);

      // Pre-warm private VaultLayout chunk in background while user views lock screen
      import('./VaultLayout').catch(() => null);
      return;
    }

    // Trigger snappy overlay when lock/unlock state changes
    if (prevUnlockedRef.current !== isVaultUnlocked) {
      const direction = isVaultUnlocked ? 'unlock' : 'lock';
      setTransitionDirection(direction);
      prevUnlockedRef.current = isVaultUnlocked;
      setIsOverlayOpen(true);

      // View swap midpoint (220ms) while fully shrouded
      const midTimer = setTimeout(() => {
        setDisplayedUnlocked(isVaultUnlocked);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 220);

      // Snappy smooth reveal (550ms total, well within 1-second limit)
      const endTimer = setTimeout(() => {
        setIsOverlayOpen(false);
      }, 550);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isVaultUnlocked]);

  return (
    <div className="relative min-h-screen bg-[#040509]">
      {/* Framer Motion Cyber Vault Page Transition Shroud */}
      <VaultPageTransitionOverlay
        isOpen={isOverlayOpen}
        direction={transitionDirection}
        role={role}
      />

      {/* Underlying View with Smooth Framer Motion Cross-Fade */}
      <AnimatePresence mode="wait">
        {!displayedUnlocked ? (
          <motion.div
            key="vault-security-lock-gate"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            <VaultLogin authError={authError} />
          </motion.div>
        ) : (
          <motion.div
            key="vault-operational-dashboard"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="w-full min-h-screen"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProtectedRoute;
