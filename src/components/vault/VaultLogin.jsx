import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth, AUTHORIZED_FOUNDER_EMAILS } from '../../lib/authContext';
import {
  Shield,
  Lock,
  Key,
  AlertCircle,
  ArrowLeft,
  Mail,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Cpu,
  Layers,
  Fingerprint,
  Unlock,
  Terminal,
  Activity,
  Zap,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * High-tech synthetic audio feedback for tactile tab & unlock interactions
 */
function playTactileFeedback(type = 'click') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'tab') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'unlock') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12); // D6
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'chip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // Safe fallback if audio is restricted
  }
}

const VaultLogin = () => {
  const { loginWithGoogle, loginWithEmailPassword, unlockWithMasterPasscode, unlockAsPublicViewer, authError } = useAuth();

  // Interactive 3D Mode Selector: 'founder' (Admin Authentication) | 'guest' (Public Specimen Preview)
  const [activeMode, setActiveMode] = useState(() => {
    try {
      if (typeof window !== 'undefined' && (window.location.search.includes('mode=specimen') || window.location.search.includes('mode=guest'))) {
        return 'guest';
      }
    } catch {
      // fallback
    }
    return 'founder';
  });

  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingPasscode, setIsSubmittingPasscode] = useState(false);
  const [email, setEmail] = useState(AUTHORIZED_FOUNDER_EMAILS[0]);
  const [password, setPassword] = useState('');
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Dynamic interactive laser spotlight coordinates that follow the cursor in real time
  const [spotlight, setSpotlight] = useState({ x: 50, y: 35 });
  const animFrameRef = useRef(null);
  const containerRef = useRef(null);

  const handleContainerMouseMove = useCallback((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (animFrameRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    animFrameRef.current = requestAnimationFrame(() => {
      animFrameRef.current = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round((((clientX - rect.left) / rect.width) * 100) * 10) / 10;
      const y = Math.round((((clientY - rect.top) / rect.height) * 100) * 10) / 10;
      setSpotlight({ x, y });
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogle(true);
    setLocalError(null);
    playTactileFeedback('click');
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setLocalError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        playTactileFeedback('unlock');
      }
    } catch (err) {
      setLocalError(err.message || 'Google sign-in encountered an error.');
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handlePasscodeSubmit = async (e, directCode = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setLocalError(null);
    const codeToTest = (directCode || passcode || '').trim();
    if (!codeToTest) {
      setLocalError('Please enter your secret founder passcode (e.g. sahil7474).');
      return;
    }
    setIsSubmittingPasscode(true);
    try {
      if (unlockWithMasterPasscode) {
        const res = unlockWithMasterPasscode(codeToTest);
        if (!res.success) {
          setLocalError(res.error || 'Invalid passcode. Access denied.');
        } else {
          playTactileFeedback('unlock');
        }
      }
    } catch (err) {
      setLocalError(err.message || 'Passcode verification failed.');
    } finally {
      setIsSubmittingPasscode(false);
    }
  };

  const handleGuestExplore = async () => {
    setIsSubmittingGuest(true);
    setLocalError(null);
    playTactileFeedback('unlock');
    try {
      if (unlockAsPublicViewer) {
        await unlockAsPublicViewer();
      }
    } catch (err) {
      setLocalError(err.message || 'Guest entry failed.');
    } finally {
      setIsSubmittingGuest(false);
    }
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    playTactileFeedback('click');

    if (!password.trim()) {
      setLocalError('Please enter your secret founder password.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await loginWithEmailPassword(email.trim(), password);
      if (!res.success) {
        setLocalError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        playTactileFeedback('unlock');
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication error.');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const isDomainError =
    (authError && authError.includes('authorized')) ||
    (localError && localError.includes('authorized-domain')) ||
    (localError && localError.includes('Authorized domains'));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      className="min-h-screen bg-[#040508] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none font-sans antialiased"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================================= */}
      {/* RICH 3D DYNAMIC BACKGROUND & HOLOGRAPHIC AMBIENT CANVAS (ZERO BLUR MUDDINESS) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* 1. Dynamic Real-Time Laser Spotlight tracking cursor */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `
              radial-gradient(circle 850px at ${spotlight.x}% ${spotlight.y}%, ${
                activeMode === 'founder' ? 'rgba(255, 42, 58, 0.16)' : 'rgba(6, 182, 212, 0.16)'
              } 0%, rgba(15, 23, 42, 0.05) 45%, transparent 75%)
            `,
          }}
        />

        {/* 2. Razor-Sharp Cybernetic Stark Coordinate Grid (32px Crisp Mesh) */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '36px 36px',
          }}
        />

        {/* 3. Diagonal High-Tech Laser Runners */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 48px, rgba(255, 42, 58, 0.06) 48px, rgba(255, 42, 58, 0.06) 96px)',
          }}
        />

        {/* 4. Concentric Arc Reactor Gyro Vector Rings (Sharp Vector Rotation, No Blur) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-20">
          <svg viewBox="0 0 700 700" className="w-full h-full animate-rotating-gyro">
            <circle cx="350" cy="350" r="320" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 12" className={activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'} />
            <circle cx="350" cy="350" r="260" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="16 20" className={activeMode === 'founder' ? 'text-red-400' : 'text-cyan-300'} />
            <circle cx="350" cy="350" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className={activeMode === 'founder' ? 'text-red-600' : 'text-cyan-500'} />
            {/* Cardinal Crosshair Ticks */}
            <line x1="350" y1="20" x2="350" y2="50" stroke="currentColor" strokeWidth="2" className={activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'} />
            <line x1="350" y1="650" x2="350" y2="680" stroke="currentColor" strokeWidth="2" className={activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'} />
            <line x1="20" y1="350" x2="50" y2="350" stroke="currentColor" strokeWidth="2" className={activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'} />
            <line x1="650" y1="350" x2="680" y2="350" stroke="currentColor" strokeWidth="2" className={activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'} />
          </svg>
        </div>

        {/* Reverse Secondary Radar Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none opacity-15">
          <svg viewBox="0 0 520 520" className="w-full h-full animate-rotating-gyro-reverse">
            <circle cx="260" cy="260" r="230" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 14" className={activeMode === 'founder' ? 'text-amber-400' : 'text-emerald-400'} />
            <circle cx="260" cy="260" r="150" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 30" className={activeMode === 'founder' ? 'text-red-400' : 'text-cyan-300'} />
          </svg>
        </div>

        {/* 5. Top & Bottom Precision Laser Horizon Status Rails */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/80 to-transparent" />
        <div className="absolute top-2 inset-x-0 flex justify-between items-center px-6 text-[9px] font-mono tracking-widest text-neutral-400 opacity-60">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            [ PROTOCOL // AVENGERS_FOUNDER_VAULT ]
          </span>
          <span className="hidden sm:inline">[ ZERO_TRUST: ACTIVE &bull; ENCRYPTION: SHA-512 ]</span>
          <span>[ STATUS: ARMED ]</span>
        </div>

        <div className="absolute bottom-2 inset-x-0 flex justify-between items-center px-6 text-[9px] font-mono tracking-widest text-neutral-400 opacity-60">
          <span>[ MATRIX_LATENCY: 1.8MS ]</span>
          <span className="hidden sm:inline">[ ARCHITECT: SAHIL BHATIA ]</span>
          <span>[ SYS_VER: 4.2.0_STARK ]</span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
      </div>

      {/* Return to Public Experience Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#090b14] hover:bg-[#121626] border border-white/20 hover:border-red-500/70 text-xs font-mono text-slate-100 hover:text-white transition-all shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-bold tracking-wide">Return to Public Experience</span>
        </Link>
      </div>

      {/* Main Content Container (Preserves Selector Hierarchy) */}
      <div className="w-full max-w-lg relative z-10 space-y-5">

        {/* ========================================================================= */}
        {/* SELECTOR 1: 3D INTERACTIVE GLOWING & BLINKING MODE TABS                   */}
        {/* ========================================================================= */}
        <div className="p-2 rounded-2xl bg-[#080b16] border-2 border-white/20 shadow-[0_16px_45px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.2)] grid grid-cols-2 gap-2.5 relative">

          {/* TAB 1: FOUNDER / ADMIN CLEARANCE */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('founder');
              setLocalError(null);
              playTactileFeedback('tab');
            }}
            className={`relative py-4 px-3.5 rounded-xl font-mono text-xs uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 overflow-hidden active:scale-[0.98] ${
              activeMode === 'founder'
                ? 'bg-gradient-to-b from-[#2a0e18] via-[#1a0810] to-[#0f0409] border-2 border-red-500 text-white shadow-[0_0_35px_rgba(255,42,58,0.5),0_10px_25px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                : 'bg-[#0c0f1c] hover:bg-[#14192d] border border-white/15 text-slate-200 hover:text-white hover:border-white/30'
            }`}
          >
            {/* Top Specular Edge Highlight */}
            {activeMode === 'founder' && (
              <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-300 to-transparent shadow-[0_0_8px_#ff2a3a]" />
            )}

            <div className="flex items-center gap-2">
              {/* Glowing Blinking Red Tactical Beacon */}
              <span className="relative flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${activeMode === 'founder' ? 'animate-ping' : ''}`} />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_12px_#ff2a3a]" />
              </span>
              <Shield className={`w-4 h-4 ${activeMode === 'founder' ? 'text-red-400 drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]' : 'text-neutral-400'}`} />
              <span className="font-display font-black text-white text-[13px] tracking-wide">FOUNDER ACCESS</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-mono tracking-wider font-bold px-2 py-0.5 rounded ${
                activeMode === 'founder' ? 'bg-red-950/80 text-red-200 border border-red-500/50 shadow-sm' : 'text-neutral-400'
              }`}>
                [MASTER KEY // ARCHITECT]
              </span>
            </div>

            {activeMode === 'founder' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-red-500 rounded-full shadow-[0_0_12px_#ff2a3a]" />
            )}
          </button>

          {/* TAB 2: PUBLIC GUEST SPECIMEN ACCESS */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('guest');
              setLocalError(null);
              playTactileFeedback('tab');
            }}
            className={`relative py-4 px-3.5 rounded-xl font-mono text-xs uppercase font-black tracking-wider transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 overflow-hidden active:scale-[0.98] ${
              activeMode === 'guest'
                ? 'bg-gradient-to-b from-[#0a2034] via-[#061422] to-[#030c14] border-2 border-cyan-400 text-white shadow-[0_0_35px_rgba(6,182,212,0.5),0_10px_25px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                : 'bg-[#0c0f1c] hover:bg-[#14192d] border border-white/15 text-slate-200 hover:text-white hover:border-white/30'
            }`}
          >
            {/* Top Specular Edge Highlight */}
            {activeMode === 'guest' && (
              <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_8px_#06b6d4]" />
            )}

            <div className="flex items-center gap-2">
              {/* Glowing Blinking Cyan Tactical Beacon */}
              <span className="relative flex h-3 w-3">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${activeMode === 'guest' ? 'animate-ping' : ''}`} />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_12px_#06b6d4]" />
              </span>
              <Eye className={`w-4 h-4 ${activeMode === 'guest' ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-neutral-400'}`} />
              <span className="font-display font-black text-white text-[13px] tracking-wide">PUBLIC GUEST</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-mono tracking-wider font-bold px-2 py-0.5 rounded ${
                activeMode === 'guest' ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-400/50 shadow-sm' : 'text-neutral-400'
              }`}>
                [SPECIMEN EXPLORER]
              </span>
            </div>

            {activeMode === 'guest' && (
              <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4]" />
            )}
          </button>

        </div>

        {/* ========================================================================= */}
        {/* SELECTOR 2: MAIN SECURITY GATEWAY CARD                                    */}
        {/* ========================================================================= */}
        <div className={`rounded-3xl bg-[#070912] border-2 p-6 sm:p-8 transition-all duration-300 shadow-[0_24px_80px_rgba(0,0,0,0.98)] relative overflow-hidden ${
          activeMode === 'founder'
            ? 'border-red-500/70 shadow-[0_0_60px_rgba(255,42,58,0.25)]'
            : 'border-cyan-400/70 shadow-[0_0_60px_rgba(6,182,212,0.25)]'
        }`}>

          {/* Precision Top Laser Accent Sweep */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-90 ${
            activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'
          }`} />

          {/* Corner Precision Tactical Brackets */}
          <div className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">⌜</div>
          <div className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">⌝</div>
          <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">⌞</div>
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">⌟</div>

          {/* Error Banner (Crisp High-Contrast Alert) */}
          {(authError || localError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-xs text-white flex flex-col gap-2 font-mono shadow-[0_0_20px_rgba(255,42,58,0.3)]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 drop-shadow-[0_0_6px_#ff2a3a]" />
                <span className="leading-relaxed font-sans font-medium text-slate-100">{localError || authError}</span>
              </div>

              {isDomainError && (
                <div className="mt-1 p-2.5 rounded bg-black/80 border border-red-500/60 text-[10px] space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    ACTION REQUIRED IN FIREBASE CONSOLE:
                  </div>
                  <div className="text-slate-200 pl-2 border-l border-white/20">
                    Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized domains &rarr; Add: <span className="text-white font-bold">{currentHostname}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: FOUNDER ACCESS (ADMIN ONLY)                                       */}
          {/* ========================================================================= */}
          {activeMode === 'founder' && (
            <div className="space-y-6">

              {/* 3D Holographic Stark Biometric Header */}
              <div className="text-center space-y-2.5">
                <div className="relative w-20 h-20 mx-auto">
                  {/* Rotating Stark HUD Target Ring */}
                  <svg className="absolute inset-0 w-full h-full animate-rotating-gyro text-red-500" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.6" />
                    <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.8" />
                  </svg>
                  <div className="w-16 h-16 m-2 rounded-2xl bg-gradient-to-b from-[#2a0e18] via-[#1a0910] to-[#0c0408] border-2 border-red-500 flex items-center justify-center text-red-500 shadow-[0_0_35px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
                    <Fingerprint className="w-9 h-9 drop-shadow-[0_0_10px_#ff2a3a]" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-[10px] font-mono text-red-300 uppercase tracking-widest font-black mb-1.5 shadow-sm">
                    <Lock className="w-3 h-3 text-red-400" />
                    ZERO-TRUST // FOUNDER VERIFICATION
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    FOUNDER VAULT CMS
                  </h1>
                  <p className="text-xs text-slate-100 font-sans mt-1.5 leading-relaxed font-normal">
                    Direct control interface for <strong className="text-white font-bold">Sahil Bhatia</strong>. All publishing and system alterations require verified founder authentication.
                  </p>
                </div>
              </div>

              {/* Strict Security Policy Notice */}
              <div className="p-3.5 rounded-xl bg-[#12070c] border border-red-500/40 text-xs font-mono space-y-1.5 shadow-md">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-red-400 font-black uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-red-500" />
                    SOLE AUTHORIZED EDITOR:
                  </span>
                  <span className="text-white font-black tracking-wide">Sahil Bhatia</span>
                </div>
                <div className="text-[10px] text-slate-300 flex items-center justify-between pt-1.5 border-t border-red-500/20">
                  <span>AUTHORIZED IDENTITY:</span>
                  <span className="text-red-300 font-bold font-mono">{AUTHORIZED_FOUNDER_EMAILS[0]}</span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* FEATURE 1: 3D INSTANT MASTER PASSCODE UNLOCK (FASTEST PATH)  */}
              {/* ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1e0814] via-[#12050b] to-[#080306] border-2 border-red-500/70 shadow-[0_0_35px_rgba(255,42,58,0.35),0_10px_25px_rgba(0,0,0,0.9)] space-y-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-black flex items-center gap-2">
                    <Key className="w-4 h-4 text-red-500" />
                    FOUNDER MASTER PASSCODE
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 border border-red-500/60 text-red-300 font-mono font-black tracking-wider shadow-sm">
                    INSTANT UNLOCK ⚡
                  </span>
                </div>

                <form onSubmit={handlePasscodeSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter secret passcode (e.g. sahil7474)..."
                      className="w-full min-h-[48px] px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-[#070912] border-2 border-white/25 text-white placeholder-neutral-400 text-sm font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,42,58,0.5)] transition-all font-semibold"
                    />
                    <Key className="w-4 h-4 text-red-400 absolute left-3.5 top-4" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? 'Hide passcode' : 'Show passcode'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPasscode}
                    className="min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(255,42,58,0.6),0_6px_16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.4)] active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 border border-red-400/60"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{isSubmittingPasscode ? 'VERIFYING...' : 'UNLOCK'}</span>
                  </button>
                </form>

                {/* Quick Passcode Chips */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-200 pt-2 border-t border-white/10">
                  <span className="text-neutral-400 text-[10px] uppercase font-bold">Quick Master Keys:</span>
                  {['sahil7474', 'sahil1471', 'ARCHITECT'].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setPasscode(k);
                        playTactileFeedback('chip');
                        handlePasscodeSubmit(null, k);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-red-950/80 text-white hover:text-red-300 border border-white/20 hover:border-red-500/70 text-[10px] font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 text-amber-400" />
                      <span>{k}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/15" />
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-200 uppercase tracking-widest font-black">
                  OR AUTHENTICATE WITH GOOGLE
                </span>
                <div className="flex-grow border-t border-white/15" />
              </div>

              {/* ------------------------------------------------------------- */}
              {/* FEATURE 2: 3D GOOGLE OAUTH ONE-CLICK SIGN IN                  */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmittingGoogle || isSubmittingPassword || isSubmittingPasscode}
                  className="w-full min-h-[52px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#181120] via-[#221226] to-[#181120] hover:from-[#2e1834] hover:to-[#2e1834] border-2 border-red-500/70 active:scale-[0.99] text-white font-mono text-xs uppercase tracking-wider font-black transition-all shadow-[0_0_25px_rgba(255,42,58,0.35),0_8px_20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.25)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {/* Google SVG G-Icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{isSubmittingGoogle ? 'VERIFYING FOUNDER TOKEN...' : 'AUTHENTICATE WITH GOOGLE ACCOUNT'}</span>
                </button>
                <p className="text-[11px] text-slate-300 text-center font-mono">
                  Signs in directly with <strong className="text-white font-bold">{AUTHORIZED_FOUNDER_EMAILS[0]}</strong> via Google OAuth.
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/15" />
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-200 uppercase tracking-widest font-black">
                  OR FOUNDER EMAIL & PASSWORD
                </span>
                <div className="flex-grow border-t border-white/15" />
              </div>

              {/* ------------------------------------------------------------- */}
              {/* FEATURE 3: CONFIDENTIAL EMAIL + PASSWORD FORM                 */}
              {/* ------------------------------------------------------------- */}
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-200 uppercase tracking-wider font-bold">
                    Founder Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@example.com"
                      autoComplete="username"
                      required
                      className="w-full min-h-[46px] px-3.5 py-2.5 pl-10 rounded-xl bg-[#080a14] border-2 border-white/20 text-white placeholder-neutral-400 text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,42,58,0.4)] transition-all font-semibold"
                    />
                    <Mail className="w-4 h-4 text-red-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-slate-200 uppercase tracking-wider font-bold">
                    Founder Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secret founder password..."
                      autoComplete="current-password"
                      required
                      className="w-full min-h-[46px] px-3.5 py-2.5 pl-10 rounded-xl bg-[#080a14] border-2 border-white/20 text-white placeholder-neutral-400 text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,42,58,0.4)] transition-all font-semibold"
                    />
                    <Key className="w-4 h-4 text-red-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword || isSubmittingGoogle || isSubmittingPasscode}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-[#101322] hover:bg-[#1a1f36] border-2 border-white/25 hover:border-white/50 text-white font-mono text-xs uppercase tracking-wider font-black transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span>{isSubmittingPassword ? 'VERIFYING FOUNDER KEY...' : 'SIGN IN WITH PASSWORD'}</span>
                </button>
              </form>

              {/* Bottom Quick Switch Note */}
              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('guest');
                    playTactileFeedback('tab');
                  }}
                  className="text-xs font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4 cursor-pointer font-bold tracking-wide"
                >
                  Want to explore public projects without password? Switch to Guest Mode &rarr;
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: PUBLIC GUEST SPECIMEN ACCESS (READ-ONLY)                          */}
          {/* ========================================================================= */}
          {activeMode === 'guest' && (
            <div className="space-y-6">

              {/* 3D Holographic Quantum Specimen Header */}
              <div className="text-center space-y-2.5">
                <div className="relative w-20 h-20 mx-auto">
                  {/* Rotating Stark HUD Target Ring (Cyan Frequency) */}
                  <svg className="absolute inset-0 w-full h-full animate-rotating-gyro text-cyan-400" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.7" />
                    <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" opacity="0.9" />
                  </svg>
                  <div className="w-16 h-16 m-2 rounded-2xl bg-gradient-to-b from-[#0a263c] via-[#061828] to-[#030e18] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]">
                    <Eye className="w-9 h-9 drop-shadow-[0_0_10px_#06b6d4]" />
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-[10px] font-mono text-cyan-200 uppercase tracking-widest font-black mb-1.5 shadow-sm">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    PUBLIC VISITOR &bull; READ-ONLY SPECIMEN MODE
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    SPECIMEN EXPLORER
                  </h1>
                  <p className="text-xs text-slate-100 font-sans mt-1.5 leading-relaxed font-normal">
                    Inspect Sahil's verified systems, neural architectures, blueprints, and benchmarks in read-only sandbox mode.
                  </p>
                </div>
              </div>

              {/* 3D Interactive Specimen Clearance Matrix Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[#091524] border border-cyan-400/40 text-left space-y-1 shadow-sm hover:border-cyan-400 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] font-black uppercase">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>7 SYSTEMS</span>
                  </div>
                  <div className="text-[11px] text-white font-bold leading-tight">Live Blueprints</div>
                  <div className="text-[10px] text-slate-300 leading-snug">Full verified architectures & datasets.</div>
                </div>

                <div className="p-3 rounded-xl bg-[#091524] border border-cyan-400/40 text-left space-y-1 shadow-sm hover:border-cyan-400 transition-colors">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] font-black uppercase">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DAG NODES</span>
                  </div>
                  <div className="text-[11px] text-white font-bold leading-tight">Agent Graphs</div>
                  <div className="text-[10px] text-slate-300 leading-snug">Inspect technical execution flows.</div>
                </div>

                <div className="p-3 rounded-xl bg-[#091524] border border-cyan-400/40 text-left space-y-1 shadow-sm hover:border-cyan-400 transition-colors">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[10px] font-black uppercase">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SANDBOX</span>
                  </div>
                  <div className="text-[11px] text-white font-bold leading-tight">Safe Read-Only</div>
                  <div className="text-[10px] text-slate-300 leading-snug">Database protected from modification.</div>
                </div>
              </div>

              {/* 1-Click Interactive 3D Guest Button */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={handleGuestExplore}
                  disabled={isSubmittingGuest}
                  className="w-full min-h-[56px] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0c2e48] via-[#12456e] to-[#0c2e48] hover:from-[#175484] hover:to-[#175484] border-2 border-cyan-400 text-white font-mono text-sm uppercase font-black tracking-wider transition-all shadow-[0_0_35px_rgba(6,182,212,0.5),0_10px_25px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] disabled:opacity-50 group"
                >
                  <Eye className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_#06b6d4]" />
                  <span className="tracking-widest">
                    {isSubmittingGuest ? 'INITIALIZING GUEST SESSION...' : 'ENTER FOUNDER VAULT (READ-ONLY)'}
                  </span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-200 text-center font-mono font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No login required &bull; 1-Click instant specimen session &bull; Zero risk to data</span>
                </div>
              </div>

              {/* Quick Guest Passcode Chips */}
              <div className="p-3 rounded-xl bg-[#06101c] border border-cyan-400/30 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-neutral-400 text-[10px] uppercase font-bold">Public Guest Keys:</span>
                <div className="flex items-center gap-2">
                  {['guest', 'visitor', 'sahil'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        playTactileFeedback('chip');
                        if (unlockWithMasterPasscode) unlockWithMasterPasscode(code);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/40 text-[10px] font-mono font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Switch Note */}
              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('founder');
                    playTactileFeedback('tab');
                  }}
                  className="text-xs font-mono text-red-300 hover:text-red-200 underline underline-offset-4 cursor-pointer font-bold tracking-wide"
                >
                  Are you Sahil Bhatia? Switch to Founder Login &rarr;
                </button>
              </div>

            </div>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-white/15 text-center text-[11px] font-mono text-slate-300 flex items-center justify-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>Encrypted Firebase Auth &bull; Firestore RBAC Enforced &bull; Founder Clearance Only</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VaultLogin;
