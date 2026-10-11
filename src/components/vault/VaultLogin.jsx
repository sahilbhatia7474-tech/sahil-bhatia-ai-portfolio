import { useState } from 'react';
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
  Sparkles,
  Cpu,
  Layers,
  Fingerprint,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VaultLogin = () => {
  const { loginWithGoogle, loginWithEmailPassword, unlockAsPublicViewer, authError } = useAuth();
  
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
  const [email, setEmail] = useState(AUTHORIZED_FOUNDER_EMAILS[0]);
  const [password, setPassword] = useState('');
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);
  const [localError, setLocalError] = useState(null);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogle(true);
    setLocalError(null);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setLocalError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setLocalError(err.message || 'Google sign-in encountered an error.');
    } finally {
      setIsSubmittingGoogle(false);
    }
  };

  const handleGuestExplore = async () => {
    setIsSubmittingGuest(true);
    setLocalError(null);
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

    if (!password.trim()) {
      setLocalError('Please enter your secret founder password.');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await loginWithEmailPassword(email.trim(), password);
      if (!res.success) {
        setLocalError(res.error || 'Authentication failed. Please verify credentials.');
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
    <div className="min-h-screen bg-[#040508] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* RICH 3D DYNAMIC BACKGROUND & HOLOGRAPHIC AMBIENT CANVAS */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Crisp Cybernetic Spatial Grid */}
        <div 
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 42, 58, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Diagonal Ray Laser Runners */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255, 42, 58, 0.05) 40px, rgba(255, 42, 58, 0.05) 80px)',
          }}
        />

        {/* Floating Vivid Cybernetic Lighting Spheres (No Blurry Overlays on Content) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[7000ms]" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-b from-red-600/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Return to Public Experience Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0c0e17]/90 hover:bg-[#151928] border border-white/15 text-xs font-mono text-neutral-300 hover:text-white hover:border-red-500/40 transition-all shadow-lg active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
          <span>Return to Public Experience</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg relative z-10 space-y-5">
        
        {/* ========================================================================= */}
        {/* 3D INTERACTIVE GLOWING & BLINKING MODE TABS */}
        {/* ========================================================================= */}
        <div className="p-1.5 rounded-2xl bg-[#0a0c14]/95 border-2 border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl grid grid-cols-2 gap-2">
          
          {/* TAB 1: FOUNDER / ADMIN CLEARANCE */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('founder');
              setLocalError(null);
            }}
            className={`relative py-3.5 px-3 rounded-xl font-mono text-xs uppercase font-black tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              activeMode === 'founder'
                ? 'bg-gradient-to-b from-[#240e14] to-[#12070a] border-2 border-red-500 text-white shadow-[0_0_30px_rgba(255,42,58,0.45)] scale-[1.02]'
                : 'bg-[#0f111c]/60 hover:bg-[#161a2c] border border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Glowing Blinking Red Beacon */}
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 ${activeMode === 'founder' ? 'animate-ping' : ''}`} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_#ff2a3a]" />
              </span>
              <Shield className={`w-4 h-4 ${activeMode === 'founder' ? 'text-red-400' : 'text-neutral-400'}`} />
              <span className="font-display">FOUNDER ACCESS</span>
            </div>
            <span className={`text-[9px] font-mono tracking-widest ${activeMode === 'founder' ? 'text-red-300 font-bold' : 'text-neutral-400'}`}>
              [SOLE AUTHORIZED EDITOR]
            </span>
            {activeMode === 'founder' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-500 rounded-full shadow-[0_0_8px_#ff2a3a]" />
            )}
          </button>

          {/* TAB 2: PUBLIC GUEST SPECIMEN ACCESS */}
          <button
            type="button"
            onClick={() => {
              setActiveMode('guest');
              setLocalError(null);
            }}
            className={`relative py-3.5 px-3 rounded-xl font-mono text-xs uppercase font-black tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
              activeMode === 'guest'
                ? 'bg-gradient-to-b from-[#0e1e2c] to-[#071018] border-2 border-cyan-400 text-white shadow-[0_0_30px_rgba(6,182,212,0.45)] scale-[1.02]'
                : 'bg-[#0f111c]/60 hover:bg-[#161a2c] border border-white/10 text-neutral-400 hover:text-neutral-200 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Glowing Blinking Cyan Beacon */}
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 ${activeMode === 'guest' ? 'animate-ping' : ''}`} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
              </span>
              <Eye className={`w-4 h-4 ${activeMode === 'guest' ? 'text-cyan-400' : 'text-neutral-400'}`} />
              <span className="font-display">PUBLIC GUEST</span>
            </div>
            <span className={`text-[9px] font-mono tracking-widest ${activeMode === 'guest' ? 'text-cyan-300 font-bold' : 'text-neutral-400'}`}>
              [READ-ONLY SPECIMEN]
            </span>
            {activeMode === 'guest' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#06b6d4]" />
            )}
          </button>

        </div>

        {/* ========================================================================= */}
        {/* MAIN SECURITY GATEWAY CARD */}
        {/* ========================================================================= */}
        <div className={`rounded-3xl bg-[#090b14]/95 border-2 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 shadow-2xl relative overflow-hidden ${
          activeMode === 'founder'
            ? 'border-red-500/50 shadow-[0_0_60px_rgba(255,42,58,0.2)]'
            : 'border-cyan-400/50 shadow-[0_0_60px_rgba(6,182,212,0.2)]'
        }`}>

          {/* Top Laser Accent Sweep */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80 ${
            activeMode === 'founder' ? 'text-red-500' : 'text-cyan-400'
          }`} />

          {/* Error Banner */}
          {(authError || localError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/60 border-2 border-red-500/70 text-xs text-red-200 flex flex-col gap-2 font-mono shadow-lg">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans">{localError || authError}</span>
              </div>
              
              {isDomainError && (
                <div className="mt-1 p-2.5 rounded bg-black/60 border border-red-500/40 text-[10px] space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    ACTION REQUIRED IN FIREBASE CONSOLE:
                  </div>
                  <div className="text-neutral-300 pl-2 border-l border-white/20">
                    Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized domains &rarr; Add: <span className="text-white font-bold">{currentHostname}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: FOUNDER ACCESS (ADMIN ONLY) */}
          {/* ========================================================================= */}
          {activeMode === 'founder' && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-b from-[#250d14] to-[#120609] border-2 border-red-500/60 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(255,42,58,0.35)]">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/50 text-[10px] font-mono text-red-300 uppercase tracking-widest font-black mb-1.5">
                    <Lock className="w-3 h-3 text-red-400" />
                    ZERO-TRUST // FOUNDER VERIFICATION
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">
                    FOUNDER VAULT CMS
                  </h1>
                  <p className="text-xs text-neutral-300 font-sans mt-1">
                    Direct access for <strong className="text-white">Sahil Bhatia</strong> only. All write, update, and deletion operations require cryptographically verified founder credentials.
                  </p>
                </div>
              </div>

              {/* Strict Security Policy Notice */}
              <div className="p-3.5 rounded-xl bg-[#12080c] border border-red-500/30 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-red-400 font-black uppercase flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-red-500" />
                    SOLE AUTHORIZED EDITOR:
                  </span>
                  <span className="text-white font-bold">Sahil Bhatia</span>
                </div>
                <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-1 border-t border-red-500/20">
                  <span>AUTHORIZED IDENTITY:</span>
                  <span className="text-red-300 font-bold">{AUTHORIZED_FOUNDER_EMAILS[0]}</span>
                </div>
              </div>

              {/* Primary Method: Google Sign-In with Verified Founder Identity */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmittingGoogle || isSubmittingPassword}
                  className="w-full min-h-[50px] py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1c0c14] via-[#240e18] to-[#1c0c14] hover:from-[#2e1220] hover:to-[#2e1220] border-2 border-red-500/60 active:scale-[0.99] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_25px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>{isSubmittingGoogle ? 'Verifying Founder Token...' : 'Authenticate with Google Account'}</span>
                </button>
                <p className="text-[10px] text-neutral-400 text-center font-mono">
                  Recommended: Signs in directly with <strong className="text-white">sahilbhatia7474@gmail.com</strong> via Google OAuth.
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
                  OR FOUNDER PASSWORD
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Confidential Email + Password Form */}
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-300 uppercase tracking-wider font-semibold">
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
                      className="w-full min-h-[44px] px-3.5 py-2.5 pl-10 rounded-xl bg-[#0e1017] border-2 border-white/15 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-neutral-300 uppercase tracking-wider font-semibold">
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
                      className="w-full min-h-[44px] px-3.5 py-2.5 pl-10 rounded-xl bg-[#0e1017] border-2 border-white/15 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                    />
                    <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword || isSubmittingGoogle}
                  className="w-full min-h-[46px] py-3 px-4 rounded-xl bg-[#141622] hover:bg-[#1d2030] border-2 border-white/20 hover:border-white/40 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span>{isSubmittingPassword ? 'Verifying Founder Key...' : 'Sign In as Founder'}</span>
                </button>
              </form>

              {/* Bottom Quick Switch Note */}
              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveMode('guest')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                >
                  Want to explore public projects? Switch to Guest Mode &rarr;
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: PUBLIC GUEST SPECIMEN ACCESS (READ-ONLY) */}
          {/* ========================================================================= */}
          {activeMode === 'guest' && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-b from-[#0c2438] to-[#06121c] border-2 border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)]">
                  <Eye className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 uppercase tracking-widest font-black mb-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    PUBLIC VISITOR &bull; READ-ONLY MODE
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">
                    SPECIMEN EXPLORER
                  </h1>
                  <p className="text-xs text-neutral-300 font-sans mt-1">
                    Explore all projects, systems, blueprints, and benchmarks in read-only mode without modifying data.
                  </p>
                </div>
              </div>

              {/* Features of Guest Mode */}
              <div className="p-4 rounded-xl bg-[#091522] border border-cyan-400/30 text-xs font-mono space-y-2.5">
                <div className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PUBLIC CLEARANCE SPECIFICATIONS:</span>
                </div>
                <ul className="text-[11px] text-neutral-300 space-y-1.5 pl-2 border-l border-cyan-400/30 font-sans">
                  <li>&bull; Full read access to all projects, research signals, and case studies.</li>
                  <li>&bull; Inspect technical specifications, Directed Acyclic Graph nodes, and stacks.</li>
                  <li>&bull; <strong className="text-amber-300">Strict Safety Enforced:</strong> All write, publish, and delete operations are locked.</li>
                </ul>
              </div>

              {/* 1-Click Interactive 3D Guest Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGuestExplore}
                  disabled={isSubmittingGuest}
                  className="w-full min-h-[52px] py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#0e2c46] via-[#103a5e] to-[#0e2c46] hover:from-[#144874] hover:to-[#144874] border-2 border-cyan-400 text-white font-mono text-xs uppercase font-black tracking-wider transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  <Eye className="w-5 h-5 text-cyan-300" />
                  <span>{isSubmittingGuest ? 'Initializing Guest Session...' : 'Enter Founder Vault (Read-Only)'}</span>
                </button>
                <p className="text-[10px] text-neutral-400 text-center font-mono">
                  No login required &bull; Instant anonymous Firebase read session &bull; Zero risk to data
                </p>
              </div>

              {/* Bottom Quick Switch Note */}
              <div className="text-center pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveMode('founder')}
                  className="text-xs font-mono text-red-400 hover:text-red-300 underline underline-offset-4 cursor-pointer"
                >
                  Are you Sahil Bhatia? Switch to Founder Login &rarr;
                </button>
              </div>

            </div>
          )}

          {/* Footer Security Note */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[10px] font-mono text-neutral-400 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Encrypted Firebase Auth &bull; Firestore RBAC Enforced &bull; Founder Clearance Only</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default VaultLogin;
