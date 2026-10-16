import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/authContext';
import VaultLogin from './VaultLogin';
import VaultPageTransitionOverlay from './VaultPageTransitionOverlay';
import { RefreshCw } from 'lucide-react';

/**
 * STRICT ROUTE-LEVEL SECURITY GATEWAY FOR FOUNDER VAULT WITH FRAMER MOTION TRANSITIONS
 * 
 * Enforces zero-trust route protection with high-tech cybernetic page transitions:
 * 1. While auth state is initializing: displays secure handshake screen.
 * 2. Manages cinematic Framer Motion page transition overlay using 'cyber-vault-bg'
 *    aesthetic when navigating between the lock page and the dashboard.
 * 3. Keeps state synchronized and accessible.
 */
export const ProtectedRoute = ({ children }) => {
  const { isVaultUnlocked, loading, authError, role } = useAuth();

  // Internal state tracking which screen is rendered under the shroud
  const [displayedUnlocked, setDisplayedUnlocked] = useState(isVaultUnlocked);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('unlock');
  
  const prevUnlockedRef = useRef(isVaultUnlocked);
  const isInitialMount = useRef(true);

  // Synchronize on transition
  useEffect(() => {
    // Skip initial mount so the page does not play an unwanted transition on initial load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayedUnlocked(isVaultUnlocked);
      prevUnlockedRef.current = isVaultUnlocked;
      return;
    }

    // Trigger overlay when lock/unlock state changes
    if (prevUnlockedRef.current !== isVaultUnlocked) {
      const direction = isVaultUnlocked ? 'unlock' : 'lock';
      setTransitionDirection(direction);
      prevUnlockedRef.current = isVaultUnlocked;
      setIsOverlayOpen(true);

      // Midpoint: Swap the underlying view while the overlay is 100% opaque and covering the viewport
      const midTimer = setTimeout(() => {
        setDisplayedUnlocked(isVaultUnlocked);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 340);

      // End: Reveal the newly mounted view smoothly
      const endTimer = setTimeout(() => {
        setIsOverlayOpen(false);
      }, 760);

      return () => {
        clearTimeout(midTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isVaultUnlocked]);

  // Handshake verification in progress
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center font-mono text-xs text-neutral-400 p-4">
        <div className="flex items-center gap-3 bg-[#0d0e14] border border-white/10 px-6 py-4 rounded-xl shadow-2xl">
          <RefreshCw className="w-4 h-4 text-red-500 animate-spin" />
          <span className="text-white font-semibold uppercase tracking-wider">
            VERIFYING VAULT GATEWAY CLEARANCE...
          </span>
        </div>
      </div>
    );
  }

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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
