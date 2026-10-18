import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth, AUTHORIZED_FOUNDER_EMAILS } from '../../lib/authContext';
import {
  Shield,
  Lock,
  Key,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
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
      setLocalError('Please enter your secret founder passcode.');
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
            className={`group relative py-4 px-3.5 rounded-xl font-mono text-xs uppercase font-black tracking-wider transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1.5 overflow-hidden active:scale-[0.98] ${
              activeMode === 'guest'
                ? 'bg-gradient-to-b from-[#0e304d] via-[#082036] to-[#04111d] border-2 border-cyan-300 text-white shadow-[0_0_40px_rgba(6,182,212,0.65),0_12px_28px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.6)] scale-[1.02]'
                : 'bg-gradient-to-b from-[#0b1c2e] via-[#071322] to-[#040c16] hover:from-[#0f2740] hover:to-[#081726] border-2 border-cyan-500/60 hover:border-cyan-300 text-cyan-100 hover:text-white shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-[1.01]'
            }`}
          >
            {/* Top Free Access Pulsing Ribbon Tag */}
            <span className="absolute -top-0.5 right-2 px-2 py-0.5 rounded-b-md bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#040d16] font-mono font-black text-[9px] uppercase tracking-wider shadow-[0_0_14px_rgba(6,182,212,0.9)] animate-pulse z-10 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>FREE ACCESS</span>
            </span>

            {/* Top Specular Edge Highlight Laser */}
            <span className={`absolute top-0 inset-x-0 h-[2px] ${
              activeMode === 'guest'
                ? 'bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_12px_#06b6d4]'
                : 'bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_#06b6d4]'
            }`} />

            <div className="flex items-center gap-2 mt-0.5">
              {/* Glowing Blinking Cyan Tactical Beacon (Always Pinging to attract clicks) */}
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-90 animate-ping" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_14px_#06b6d4]" />
              </span>
              <Eye className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.9)] group-hover:scale-110 transition-transform" />
              <span className="font-display font-black text-white text-[13px] tracking-wide group-hover:text-cyan-200 transition-colors">
                PUBLIC GUEST
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono tracking-wider font-black px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-amber-300" />
                <span>NO PASSWORD REQUIRED</span>
              </span>
            </div>

            {/* Bottom Horizon Accent Bar */}
            <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-cyan-400 rounded-full shadow-[0_0_14px_#06b6d4] transition-all duration-300 ${
              activeMode === 'guest' ? 'opacity-100 scale-100' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
            }`} />
          </button>

        </div>

        {/* ========================================================================= */}
        {/* SELECTOR 2: MAIN SECURITY GATEWAY CARD                                    */}
        {/* ========================================================================= */}
        <div className={`rounded-3xl bg-gradient-to-b from-[#090c1a] via-[#070914] to-[#04050c] border-2 p-6 sm:p-8 transition-all duration-500 shadow-[0_24px_80px_rgba(0,0,0,0.98)] relative overflow-hidden ${
          activeMode === 'founder'
            ? 'border-red-500/70 shadow-[0_0_70px_rgba(255,42,58,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
            : 'border-cyan-400/80 shadow-[0_0_70px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]'
        }`}>

          {/* Ambient Inner Holographic Sheen */}
          <div
            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
              activeMode === 'founder' ? 'bg-red-600/15' : 'bg-cyan-500/20'
            }`}
          />

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
                  <button
                    type="button"
                    onClick={() => {
                      playTactileFeedback('click');
                      if (passcode.trim()) {
                        handlePasscodeSubmit();
                      } else {
                        const input = document.getElementById('founder-passcode-input');
                        if (input) input.focus();
                        setLocalError('Please enter your secret founder passcode below.');
                      }
                    }}
                    title="Verified Founder Biometric Gateway"
                    className="w-16 h-16 m-2 rounded-2xl bg-gradient-to-b from-[#2a0e18] via-[#1a0910] to-[#0c0408] border-2 border-red-500 hover:border-cyan-400 flex items-center justify-center text-red-500 hover:text-cyan-300 shadow-[0_0_35px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] cursor-pointer active:scale-95 transition-all group focus:outline-none"
                  >
                    <Fingerprint className="w-9 h-9 drop-shadow-[0_0_10px_#ff2a3a] group-hover:drop-shadow-[0_0_10px_#22d3ee] transition-all" />
                  </button>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-[10px] font-mono text-red-300 uppercase tracking-widest font-black mb-1.5 shadow-sm">
                    <Lock className="w-3 h-3 text-red-400" />
                    ZERO-TRUST // FOUNDER VERIFICATION
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider mb-1">
                    SECURE ZERO-TRUST AUTHENTICATION REQUIRED
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
              <div className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#240816] via-[#15060e] to-[#090307] border-2 border-red-500/80 shadow-[0_0_40px_rgba(255,42,58,0.4),0_12px_32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.2)] space-y-4 overflow-hidden group">
                {/* Luminous Top Cybernetic Laser Rail */}
                <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_14px_#ff2a3a]" />
                
                {/* Ambient Breathing Sheen */}
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-red-600/20 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs font-mono relative z-10">
                  <span className="text-white font-black flex items-center gap-2 tracking-wide">
                    <span className="w-7 h-7 rounded-lg bg-red-950/90 border border-red-500/80 flex items-center justify-center text-red-400 shadow-[0_0_12px_rgba(255,42,58,0.5)]">
                      <Key className="w-4 h-4 text-red-400" />
                    </span>
                    <span>FOUNDER MASTER PASSCODE</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500/60 text-red-300 font-mono text-[10px] font-black tracking-wider shadow-[0_0_12px_rgba(255,42,58,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ff2a3a]" />
                    <span>ENCRYPTED &bull; ZERO-TRUST</span>
                  </span>
                </div>

                <form onSubmit={handlePasscodeSubmit} className="flex flex-col sm:flex-row gap-2.5 relative z-10">
                  <div className="relative flex-1">
                    <input
                      id="founder-passcode-input"
                      type={showPassword ? 'text' : 'password'}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter secret founder passcode..."
                      autoComplete="current-password"
                      className="w-full min-h-[52px] px-4 py-3 pl-11 pr-11 rounded-xl bg-[#060812] border-2 border-white/20 text-white placeholder-neutral-400 text-sm font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(255,42,58,0.6)] transition-all font-semibold"
                    />
                    <Key className="w-4 h-4 text-red-400 absolute left-4 top-4 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title={showPassword ? 'Hide passcode' : 'Show passcode'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingPasscode}
                    className="group/btn relative min-h-[52px] px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-red-600 hover:from-red-500 hover:via-rose-400 hover:to-red-500 ring-2 ring-red-500/70 hover:ring-red-300 ring-offset-2 ring-offset-[#090307] text-white font-mono text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_38px_rgba(255,42,58,0.8),0_10px_24px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_0_55px_rgba(255,42,58,1),0_14px_32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.8)] hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5 shrink-0 border-2 border-red-300/90 overflow-hidden"
                  >
                    {/* Top Specular Edge Laser Accent */}
                    <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent shadow-[0_0_12px_#ffffff]" />
                    {/* Continuous Shimmer Light Beam */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                    <Unlock className="w-4 h-4 text-white drop-shadow-[0_0_8px_#ffffff] group-hover/btn:rotate-[-8deg] transition-transform duration-300" />
                    <span className="relative z-10 font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {isSubmittingPasscode ? 'VERIFYING...' : 'UNLOCK VAULT'}
                    </span>
                    <Zap className="w-3.5 h-3.5 text-amber-300 animate-bounce relative z-10 drop-shadow-[0_0_8px_#f59e0b]" />
                  </button>
                </form>

                {/* Private Security Verification Indicator */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-white/10 relative z-10">
                  <span className="flex items-center gap-1.5 text-neutral-300 text-[10px] uppercase font-bold">
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                    <span>PRIVATE PASSCODE PROTECTION &bull; ZERO-KNOWLEDGE</span>
                  </span>
                  <span className="text-emerald-400 font-bold text-[10px] tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    [ARMED &amp; ACTIVE]
                  </span>
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
                  className="group/google relative w-full min-h-[60px] py-4 px-5 rounded-2xl bg-gradient-to-r from-[#240e1f] via-[#35142d] to-[#240e1f] hover:from-[#3a1532] hover:via-[#4c1941] hover:to-[#3a1532] border-2 border-red-500 hover:border-red-300 ring-2 ring-red-500/40 hover:ring-red-400/90 ring-offset-2 ring-offset-[#070914] hover:-translate-y-0.5 hover:scale-[1.015] active:translate-y-0 active:scale-[0.99] text-white font-mono text-xs uppercase tracking-wider font-black transition-all duration-300 shadow-[0_0_38px_rgba(255,42,58,0.5),0_12px_28px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.35)] hover:shadow-[0_0_55px_rgba(255,42,58,0.8),0_16px_36px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.6)] flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50 overflow-hidden"
                >
                  {/* Top Specular Edge Highlight */}
                  <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-300 to-transparent shadow-[0_0_12px_#ff2a3a]" />
                  {/* Shimmer Sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/google:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  <div className="flex items-center gap-3.5 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-white/25 flex items-center justify-center p-2 shadow-md group-hover/google:scale-110 group-hover/google:border-red-300 transition-all">
                      {/* Google SVG G-Icon */}
                      <svg className="w-full h-full drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-display font-black text-white text-xs sm:text-sm tracking-wide group-hover/google:text-red-200 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {isSubmittingGoogle ? 'VERIFYING FOUNDER TOKEN...' : 'AUTHENTICATE WITH GOOGLE'}
                      </div>
                      <div className="text-[10px] font-mono text-red-300 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                        <span>INSTANT ZERO-TOUCH LOGIN &bull; {AUTHORIZED_FOUNDER_EMAILS[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/90 border border-red-500/60 text-red-300 text-[10px] font-mono font-bold tracking-wider shadow-[0_0_10px_rgba(255,42,58,0.3)]">
                      <Zap className="w-3 h-3 text-amber-300" />
                      <span>1-CLICK AUTH</span>
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/10 group-hover/google:bg-red-500 group-hover/google:text-white flex items-center justify-center text-red-400 transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 group-hover/google:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
                <p className="text-[11px] text-slate-300 text-center font-mono">
                  Direct founder clearance for <strong className="text-white font-bold">{AUTHORIZED_FOUNDER_EMAILS[0]}</strong>.
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
              <form onSubmit={handleEmailPasswordSubmit} className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#1c0819] via-[#10050e] to-[#070206] border-2 border-red-500/70 hover:border-red-500/90 shadow-[0_0_35px_rgba(255,42,58,0.3),0_14px_32px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.2)] space-y-4 overflow-hidden transition-all duration-300 group/form">
                {/* Luminous Top Cybernetic Laser Rail */}
                <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_12px_#ff2a3a]" />

                {/* Form Tactical Header */}
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                  <span className="text-white font-black flex items-center gap-2 tracking-wide">
                    <span className="w-6 h-6 rounded-md bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400 shadow-sm">
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                    </span>
                    <span>CONFIDENTIAL FOUNDER CREDENTIALS</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-red-400" />
                    <span>FIREBASE AUTH</span>
                  </span>
                </div>

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
                      className="w-full min-h-[50px] px-4 py-3 pl-11 rounded-xl bg-[#080a14] border-2 border-white/20 text-white placeholder-neutral-400 text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(255,42,58,0.55)] transition-all font-semibold"
                    />
                    <Mail className="w-4 h-4 text-red-400 absolute left-3.5 top-4 pointer-events-none" />
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
                      className="w-full min-h-[50px] px-4 py-3 pl-11 rounded-xl bg-[#080a14] border-2 border-white/20 text-white placeholder-neutral-400 text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(255,42,58,0.55)] transition-all font-semibold"
                    />
                    <Key className="w-4 h-4 text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword || isSubmittingGoogle || isSubmittingPasscode}
                  className="group/pwd relative w-full min-h-[54px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#2c0e1e] via-[#48122c] to-[#2c0e1e] hover:from-red-600 hover:via-rose-600 hover:to-red-600 border-2 border-red-500/80 hover:border-red-300 ring-2 ring-red-500/30 hover:ring-red-400/80 ring-offset-2 ring-offset-[#080206] text-white font-mono text-xs uppercase tracking-wider font-black transition-all duration-300 shadow-[0_0_30px_rgba(255,42,58,0.4),0_8px_22px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_55px_rgba(255,42,58,0.85),0_12px_28px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 hover:scale-[1.015] active:translate-y-0 active:scale-[0.98] flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50 overflow-hidden"
                >
                  {/* Top Specular Edge Highlight */}
                  <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-300 to-transparent shadow-[0_0_10px_#ff2a3a]" />
                  {/* Shimmer Sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/pwd:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  <div className="flex items-center gap-2.5 relative z-10">
                    <CheckCircle2 className="w-5 h-5 text-red-400 group-hover/pwd:text-emerald-300 group-hover/pwd:scale-110 drop-shadow-[0_0_8px_#ff2a3a] transition-all" />
                    <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {isSubmittingPassword ? 'VERIFYING FOUNDER KEY...' : 'SIGN IN WITH PASSWORD'}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover/pwd:bg-white group-hover/pwd:text-black flex items-center justify-center text-red-300 transition-all shadow-sm relative z-10">
                    <ArrowRight className="w-4 h-4 group-hover/pwd:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </form>

              {/* Bottom Quick Switch Note (Unmissable, Lively, Ultra-Inviting 3D Banner Button) */}
              <div className="pt-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('guest');
                    playTactileFeedback('tab');
                  }}
                  className="group relative w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071d2e] via-[#0d3452] to-[#071d2e] hover:from-[#0b283e] hover:via-[#134468] hover:to-[#0b283e] border-2 border-cyan-400 hover:border-cyan-200 ring-2 ring-cyan-400/40 hover:ring-cyan-300 ring-offset-2 ring-offset-[#070914] text-white transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.45),0_10px_28px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_0_55px_rgba(6,182,212,0.75),0_14px_36px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:scale-[1.015] active:translate-y-0 active:scale-[0.98] cursor-pointer flex items-center justify-between gap-3 overflow-hidden text-left"
                >
                  {/* Top Specular Edge Highlight Laser */}
                  <span className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_12px_#22d3ee]" />

                  {/* Shimmer Light Reflection Sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Left Side: Glowing Eye + Headline + Subtitle */}
                  <div className="flex items-center gap-3.5 relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-black/60 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:border-cyan-200 transition-all shadow-[0_0_18px_rgba(6,182,212,0.5)] shrink-0">
                      <Eye className="w-5 h-5 drop-shadow-[0_0_8px_#06b6d4] group-hover:rotate-6 transition-transform" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-90" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                        </span>
                        <span className="font-display font-black text-sm sm:text-base text-white tracking-wide group-hover:text-cyan-200 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          NO PASSWORD? EXPLORE AS GUEST
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-bounce hidden sm:inline" />
                      </div>
                      <div className="text-[11px] font-mono text-cyan-200 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <span className="text-emerald-300 font-extrabold">100% FREE ACCESS</span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-slate-300 font-medium">1-Click Specimen Sandbox</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: High-Energy Action Pill & Arrow */}
                  <div className="flex items-center gap-2 relative z-10 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-black font-mono font-black text-[11px] uppercase tracking-wider shadow-[0_0_14px_rgba(6,182,212,0.9)] group-hover:scale-105 transition-all">
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>SWITCH TO GUEST &rarr;</span>
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/15 group-hover:bg-cyan-300 group-hover:text-black flex items-center justify-center text-cyan-200 transition-all group-hover:translate-x-1 shadow-md">
                      <ArrowRight className="w-4 h-4 font-bold" />
                    </div>
                  </div>

                  {/* Bottom Horizon Accent Light Strip */}
                  <span className="absolute -bottom-0.5 inset-x-8 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_14px_#06b6d4]" />
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

              {/* 1-Click Interactive 3D Guest Button (Ultra-Lively, High Energy & Irresistible) */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleGuestExplore}
                  disabled={isSubmittingGuest}
                  className="group relative w-full min-h-[76px] py-4 px-5 sm:px-7 rounded-2xl bg-gradient-to-r from-[#07243d] via-[#104b77] to-[#07243d] hover:from-[#0b3354] hover:via-[#165d93] hover:to-[#0b3354] border-2 border-cyan-300 hover:border-cyan-100 ring-2 ring-cyan-400/40 hover:ring-cyan-300/80 ring-offset-2 ring-offset-[#050814] text-white font-mono text-sm uppercase font-black tracking-wider transition-all duration-300 shadow-[0_0_55px_rgba(6,182,212,0.7),0_16px_36px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.7)] hover:shadow-[0_0_75px_rgba(6,182,212,0.95),0_20px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 overflow-hidden"
                >
                  {/* Top Specular Edge Laser Accent */}
                  <span className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent shadow-[0_0_16px_#22d3ee]" />

                  {/* Dynamic Shimmer Light Sweep on Hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Ambient Pulsing Background Glow */}
                  <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Left Side: Eye Icon + Dynamic Live Beacon + Action Text */}
                  <div className="flex items-center gap-3.5 relative z-10">
                    <span className="relative flex h-4 w-4 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-90" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 shadow-[0_0_14px_#06b6d4]" />
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-black/60 border-2 border-cyan-300/80 flex items-center justify-center text-cyan-200 group-hover:scale-110 group-hover:text-white group-hover:border-cyan-100 transition-all shadow-[0_0_22px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] shrink-0">
                      <Eye className="w-6 h-6 drop-shadow-[0_0_10px_#06b6d4] group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-display font-black text-base sm:text-lg tracking-wider flex items-center gap-2 group-hover:text-cyan-200 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <span>{isSubmittingGuest ? 'INITIALIZING GUEST SESSION...' : 'ENTER FOUNDER VAULT'}</span>
                        <Sparkles className="w-4 h-4 text-amber-300 animate-bounce hidden sm:inline" />
                      </div>
                      <div className="text-[11px] font-mono text-cyan-200 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                        <span className="text-emerald-300 font-extrabold">1-CLICK INSTANT ACCESS</span>
                        <span className="text-neutral-400">&bull;</span>
                        <span className="text-slate-300 font-medium">NO PASSWORD REQUIRED</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: High-Energy Action Pill & Bouncing Arrow */}
                  <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                    <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 text-black font-mono font-black text-[11px] uppercase tracking-wider shadow-[0_0_16px_rgba(6,182,212,0.9)] group-hover:scale-105 transition-all">
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>CLICK TO ENTER &rarr;</span>
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/15 group-hover:bg-cyan-300 group-hover:text-black flex items-center justify-center text-cyan-200 transition-all group-hover:translate-x-1.5 shadow-md">
                      <ArrowRight className="w-5 h-5 font-bold" />
                    </div>
                  </div>

                  {/* Bottom Horizon Accent Light Strip */}
                  <span className="absolute -bottom-0.5 inset-x-6 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full shadow-[0_0_18px_#06b6d4]" />
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-300 text-center font-mono font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Public Specimen Sandbox &bull; Instant Exploration &bull; Zero Credentials Needed</span>
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
