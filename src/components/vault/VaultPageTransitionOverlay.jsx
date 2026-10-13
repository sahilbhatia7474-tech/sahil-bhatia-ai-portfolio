import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Activity,
} from 'lucide-react';

/**
 * Web Audio synthetic cyber feedback for page transition
 */
function playTransitionSound(type = 'unlock') {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'unlock') {
      // Ascending dual-tone futuristic access chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.22);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Descending sealing lockout chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.14);
      osc.frequency.exponentialRampToValueAtTime(230, now + 0.24);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  } catch {
    // Graceful fallback if audio is restricted
  }
}

/**
 * Framer Motion Cyber Vault Page Transition Overlay
 * 
 * Provides an iconic, hardware-accelerated transition between the Lock Page and
 * Dashboard using the app's established 'cyber-vault-bg' dark obsidian & glowing neon aesthetic.
 */
export const VaultPageTransitionOverlay = ({
  isOpen = false,
  direction = 'unlock', // 'unlock' | 'lock'
  role = 'FOUNDER_OWNER',
  customTitle,
  customSubtitle,
}) => {
  const isUnlock = direction === 'unlock';

  // Play audio cue when transition triggers
  useEffect(() => {
    if (isOpen) {
      playTransitionSound(direction);
    }
  }, [isOpen, direction]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cyber-vault-transition-shroud"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none font-crisp cyber-vault-bg"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
          aria-live="assertive"
          role="status"
        >
          {/* ========================================================================= */}
          {/* CYBER-VAULT-BG AMBIENT NEON MESH & PERSPECTIVE GRID                      */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Ambient Breathing Neon Glows */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{ scale: [0.9, 1.15, 0.95], opacity: [0.45, 0.75, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[110px] ${
                isUnlock ? 'bg-cyan-500/25' : 'bg-red-600/30'
              }`}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className={`absolute -bottom-32 -right-32 w-[36rem] h-[36rem] rounded-full blur-[120px] ${
                isUnlock ? 'bg-emerald-500/20' : 'bg-amber-500/25'
              }`}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-indigo-600/15 blur-[130px]" />

            {/* Cyber Coordinate Grid Pattern */}
            <div className="absolute inset-0 cyber-grid-pattern opacity-60 mix-blend-screen" />

            {/* Diagonal Laser Stripe Runways */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255, 255, 255, 0.05) 40px, rgba(255, 255, 255, 0.05) 80px)',
              }}
            />

            {/* Concentric Rotating Cybernetic Gyro Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] h-[740px] pointer-events-none opacity-30">
              <svg viewBox="0 0 740 740" className="w-full h-full animate-rotating-gyro">
                <circle
                  cx="370"
                  cy="370"
                  r="340"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="8 14"
                  className={isUnlock ? 'text-cyan-400' : 'text-red-500'}
                />
                <circle
                  cx="370"
                  cy="370"
                  r="270"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="20 28"
                  className={isUnlock ? 'text-emerald-400' : 'text-amber-400'}
                />
                <circle
                  cx="370"
                  cy="370"
                  r="190"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  className={isUnlock ? 'text-cyan-300' : 'text-red-400'}
                />
                <line x1="370" y1="15" x2="370" y2="55" stroke="currentColor" strokeWidth="2" className={isUnlock ? 'text-cyan-400' : 'text-red-500'} />
                <line x1="370" y1="685" x2="370" y2="725" stroke="currentColor" strokeWidth="2" className={isUnlock ? 'text-cyan-400' : 'text-red-500'} />
                <line x1="15" y1="370" x2="55" y2="370" stroke="currentColor" strokeWidth="2" className={isUnlock ? 'text-cyan-400' : 'text-red-500'} />
                <line x1="685" y1="370" x2="725" y2="370" stroke="currentColor" strokeWidth="2" className={isUnlock ? 'text-cyan-400' : 'text-red-500'} />
              </svg>
            </div>

            {/* Reverse Secondary Radar Gyro */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] pointer-events-none opacity-20">
              <svg viewBox="0 0 540 540" className="w-full h-full animate-rotating-gyro-reverse">
                <circle
                  cx="270"
                  cy="270"
                  r="240"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 16"
                  className={isUnlock ? 'text-teal-300' : 'text-orange-400'}
                />
                <circle
                  cx="270"
                  cy="270"
                  r="160"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="14 24"
                  className={isUnlock ? 'text-cyan-400' : 'text-red-400'}
                />
              </svg>
            </div>

            {/* Real-time Vertical Sweeping Laser Scanner Line */}
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
              className={`absolute inset-x-0 h-[2px] pointer-events-none z-10 shadow-[0_0_20px_currentColor] ${
                isUnlock
                  ? 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent text-cyan-400'
                  : 'bg-gradient-to-r from-transparent via-red-500 to-transparent text-red-500'
              }`}
            />

            {/* Top & Bottom Precision Laser Horizon Status Rails */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff2a3a]" />
            <div className="absolute top-3 inset-x-0 flex justify-between items-center px-6 text-[10px] font-mono tracking-widest text-slate-300">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-ping ${isUnlock ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-red-500 shadow-[0_0_8px_#ff2a3a]'}`} />
                <span className="font-bold text-white">[ TRANSITION PROTOCOL // {isUnlock ? 'VAULT_UNLOCK' : 'VAULT_LOCK'} ]</span>
              </span>
              <span className="hidden sm:inline text-neutral-400 font-bold">[ ENCRYPTION: AES-256-GCM &bull; ZERO_TRUST ]</span>
              <span className="font-bold text-cyan-300">[ STATUS: EXECUTING ]</span>
            </div>

            <div className="absolute bottom-3 inset-x-0 flex justify-between items-center px-6 text-[10px] font-mono tracking-widest text-slate-300">
              <span className="text-neutral-400 font-bold">[ LATENCY: 0.8MS ]</span>
              <span className="hidden sm:inline font-bold text-white">[ ARCHITECT: SAHIL BHATIA &bull; ROOT CONSOLE ]</span>
              <span className="font-bold text-emerald-400">[ FIRESTORE: SYNC ]</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4]" />
          </div>

          {/* ========================================================================= */}
          {/* CENTRAL HOLOGRAPHIC COMMAND POD                                           */}
          {/* ========================================================================= */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: isUnlock ? 24 : -24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.04, opacity: 0, y: isUnlock ? -16 : 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-full max-w-md mx-4 p-6 sm:p-8 rounded-3xl bg-[#070914]/95 border-2 border-white/20 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.3)] text-center overflow-hidden"
          >
            {/* Top Specular Edge Laser Accent */}
            <div
              className={`absolute top-0 inset-x-0 h-[2px] ${
                isUnlock
                  ? 'bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#06b6d4]'
                  : 'bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_12px_#ff2a3a]'
              }`}
            />

            {/* Inner Background Radial Sheen */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: isUnlock
                  ? 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.25) 0%, transparent 70%)'
                  : 'radial-gradient(circle at 50% 20%, rgba(255, 42, 58, 0.25) 0%, transparent 70%)',
              }}
            />

            {/* Emblem Icon Node */}
            <div className="relative mx-auto mb-5 w-20 h-20 flex items-center justify-center">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className={`absolute inset-0 rounded-2xl border border-dashed ${
                  isUnlock ? 'border-cyan-400/50' : 'border-red-500/50'
                }`}
              />
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all shadow-xl ${
                  isUnlock
                    ? 'bg-gradient-to-b from-[#0e2738] via-[#091b26] to-[#040e14] border-cyan-400/80 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]'
                    : 'bg-gradient-to-b from-[#380e18] via-[#240810] to-[#120408] border-red-500/80 text-red-300 shadow-[0_0_30px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.4)]'
                }`}
              >
                {isUnlock ? (
                  <Unlock className="w-8 h-8 drop-shadow-[0_0_10px_#06b6d4] animate-pulse" />
                ) : (
                  <Lock className="w-8 h-8 drop-shadow-[0_0_10px_#ff2a3a] animate-pulse" />
                )}
              </div>
            </div>

            {/* Telemetry Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[11px] font-mono mb-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isUnlock
                    ? 'bg-cyan-400 animate-ping shadow-[0_0_8px_#06b6d4]'
                    : 'bg-red-500 animate-ping shadow-[0_0_8px_#ff2a3a]'
                }`}
              />
              <span className={`font-black tracking-wider uppercase ${isUnlock ? 'text-cyan-300' : 'text-red-400'}`}>
                {isUnlock ? 'CLEARANCE VERIFIED' : 'SECURITY SHIELD ENGAGED'}
              </span>
            </div>

            {/* Main Animated Title */}
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] mb-2">
              {customTitle || (isUnlock ? 'INITIALIZING VAULT CONSOLE' : 'SEALING VAULT ARCHIVE')}
            </h2>

            {/* Context Subtitle */}
            <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-sm mx-auto mb-6">
              {customSubtitle ||
                (isUnlock
                  ? 'Transitioning from authentication gateway into authorized Founder & Guest command console...'
                  : 'Terminating active console session and locking vault perimeter behind zero-trust shield...')}
            </p>

            {/* Animated High-Tech Holographic Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>MATRIX SYNC:</span>
                </span>
                <span className="text-white font-black tracking-widest font-mono">
                  {isUnlock ? 'DECRYPTING 100%' : 'ENCRYPTING 100%'}
                </span>
              </div>

              <div className="h-2 w-full bg-black/80 rounded-full border border-white/20 p-[1px] overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] relative">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full relative ${
                    isUnlock
                      ? 'bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 shadow-[0_0_14px_#06b6d4]'
                      : 'bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 shadow-[0_0_14px_#ff2a3a]'
                  }`}
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/3"
                  />
                </motion.div>
              </div>
            </div>

            {/* Four-Column Mini Telemetry HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10 text-[10px] font-mono">
              <div className="bg-black/40 border border-white/10 p-2 rounded-xl text-left">
                <div className="text-slate-400 text-[9px]">TARGET</div>
                <div className="text-white font-bold truncate">
                  {isUnlock ? 'DASHBOARD' : 'LOCK GATE'}
                </div>
              </div>
              <div className="bg-black/40 border border-white/10 p-2 rounded-xl text-left">
                <div className="text-slate-400 text-[9px]">PROTOCOL</div>
                <div className="text-cyan-300 font-bold truncate">AES-GCM-256</div>
              </div>
              <div className="bg-black/40 border border-white/10 p-2 rounded-xl text-left">
                <div className="text-slate-400 text-[9px]">CLEARANCE</div>
                <div className="text-emerald-400 font-bold truncate">
                  {role === 'PUBLIC_VIEWER' ? 'GUEST' : 'FOUNDER'}
                </div>
              </div>
              <div className="bg-black/40 border border-white/10 p-2 rounded-xl text-left">
                <div className="text-slate-400 text-[9px]">LATENCY</div>
                <div className="text-amber-300 font-bold truncate">0.6 MS</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VaultPageTransitionOverlay;
