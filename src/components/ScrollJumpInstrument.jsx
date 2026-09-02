import { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

/**
 * SAHIL PORTFOLIO OS — NAVIGATION INSTRUMENT
 * 
 * Floating precision scroll instrument:
 * - When near top: indicates "JUMP" (scrolls smoothly to middle content region)
 * - When scrolled past: indicates "TOP" (scrolls smoothly to top)
 * - Compact graphite & red border styling matching OS theme
 * - Accessible and non-intrusive on desktop and mobile
 */

export default function ScrollJumpInstrument() {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Threshold: 420px down triggers transition from JUMP to TOP
      setIsPastThreshold(window.scrollY > 420);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isPastThreshold) {
      // Return to Top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Jump to mid / next major content region (Projects or AI Systems)
      const target = document.getElementById('projects') || document.getElementById('capabilities');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 select-none">
      <button
        onClick={handleClick}
        aria-label={isPastThreshold ? 'Return to top of page' : 'Jump to major content region'}
        title={isPastThreshold ? 'Back to Top' : 'Jump to Projects & Systems'}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-[#0b0c13]/90 backdrop-blur-md border border-white/10 text-neutral-300 font-mono text-[10px] tracking-wider uppercase shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(0,0,0,0.5)] hover:border-red-500/60 hover:text-white hover:bg-[#12141f] transition-all duration-300"
      >
        {/* Subtle hover laser ring */}
        <span className="absolute -inset-0.5 rounded-full bg-red-500/10 blur-xs group-hover:bg-red-500/25 transition-all pointer-events-none" />

        {isPastThreshold ? (
          <>
            <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/15 group-hover:border-red-500/50">
              <ArrowUp className="w-2.5 h-2.5 text-neutral-300 group-hover:text-red-400 transition-colors" />
            </div>
            <span className="relative font-bold text-neutral-300 group-hover:text-white pr-1">
              TOP
            </span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/15 group-hover:border-red-500/50">
              <ArrowDown className="w-2.5 h-2.5 text-neutral-300 group-hover:text-red-400 transition-colors" />
            </div>
            <span className="relative font-bold text-neutral-300 group-hover:text-white pr-1">
              JUMP
            </span>
          </>
        )}
      </button>
    </div>
  );
}
