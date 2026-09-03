import { useState } from 'react';
import { useAuth, AUTHORIZED_FOUNDER_EMAILS } from '../../lib/authContext';
import { Shield, Lock, Key, AlertCircle, ArrowLeft, Mail, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const VaultLogin = () => {
  const { loginWithGoogle, loginWithEmailPassword, authError } = useAuth();
  const [email, setEmail] = useState(AUTHORIZED_FOUNDER_EMAILS[0]);
  const [password, setPassword] = useState('');
  const [isSubmittingGoogle, setIsSubmittingGoogle] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const getDomainType = (host) => {
    if (host === 'localhost' || host === '127.0.0.1') return 'Local Development';
    if (host.includes('vercel.app')) return 'Production Vercel Domain';
    if (host.includes('run.app')) return 'AI Studio Dev/Preview';
    return 'Production Host';
  };

  const domainType = getDomainType(currentHostname);

  const handleGoogleSignIn = async () => {
    setIsSubmittingGoogle(true);
    setLocalError(null);
    const res = await loginWithGoogle();
    if (!res.success) {
      setLocalError(res.error || 'Authentication failed');
    }
    setIsSubmittingGoogle(false);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('Please enter both founder email and password.');
      return;
    }

    setIsSubmittingPassword(true);
    const res = await loginWithEmailPassword(email.trim(), password);
    if (!res.success) {
      setLocalError(res.error || 'Authentication failed');
    }
    setIsSubmittingPassword(false);
  };

  const isDomainError = 
    (authError && authError.includes('authorized')) || 
    (localError && localError.includes('authorized-domain')) ||
    (localError && localError.includes('Authorized domains'));

  return (
    <div className="min-h-screen bg-[#06070a] bg-spatial-grid flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Site */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#10121a] border border-white/10 text-xs font-mono text-neutral-400 hover:text-white hover:border-white/20 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Experience</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Security Shield Card */}
        <div className="rounded-2xl bg-[#0b0c12]/95 border border-red-500/30 p-7 sm:p-8 shadow-[0_0_50px_rgba(255,42,58,0.15)] backdrop-blur-xl space-y-6">
          
          {/* Header Badge */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(255,42,58,0.3)]">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/30 border border-red-500/30 text-[10px] font-mono text-red-300 uppercase tracking-widest font-semibold mb-2">
                <Lock className="w-3 h-3 text-red-400" />
                RESTRICTED // FOUNDER ACCESS ONLY
              </div>
              <h1 className="text-2xl font-black font-display text-white tracking-tight uppercase">
                FOUNDER VAULT CMS
              </h1>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Authorized identity control, live 3D card calibration, and portfolio content management.
              </p>
            </div>
          </div>

          {/* Runtime Environment Info */}
          <div className="p-3.5 rounded-lg bg-[#10121a] border border-white/10 text-xs font-mono space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-red-400" />
                RUNTIME HOST:
              </span>
              <span className="text-white font-medium">{currentHostname}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>ENVIRONMENT:</span>
              <span className="text-neutral-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">{domainType}</span>
            </div>
            <div className="pt-1 border-t border-white/5 flex flex-col gap-0.5 text-[10px] text-neutral-400">
              <span className="font-semibold text-neutral-300">AUTHORIZED FOUNDER IDENTITIES:</span>
              {AUTHORIZED_FOUNDER_EMAILS.map((fEmail) => (
                <span key={fEmail} className="text-red-300 font-mono text-[10px]">{fEmail}</span>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {(authError || localError) && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/60 flex flex-col gap-2 text-xs text-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="break-words leading-relaxed">{localError || authError}</span>
              </div>
              
              {isDomainError && (
                <div className="mt-1 p-2.5 rounded bg-black/40 border border-red-500/30 font-mono text-[10px] text-neutral-300 space-y-1">
                  <div className="font-bold text-red-400 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    ACTION REQUIRED IN FIREBASE CONSOLE:
                  </div>
                  <div className="text-neutral-400 pl-2 border-l border-white/20">
                    Firebase Console → Authentication → Settings → Authorized domains → Add: <span className="text-white font-bold">{currentHostname}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary Method: Google Sign-In */}
          <div className="space-y-2.5">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmittingGoogle || isSubmittingPassword}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_25px_rgba(255,42,58,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmittingGoogle ? 'Verifying Credentials...' : 'Authenticate with Google'}</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center font-mono">
              Direct sign-in using registered founder Google account.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              OR EMAIL & PASSWORD SIGN-IN
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Email + Password Form */}
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Founder Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@example.com"
                  autoComplete="username"
                  className="w-full min-h-[44px] px-3.5 py-2.5 pl-10 rounded-lg bg-[#0e1017] border border-white/15 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Firebase Account Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password..."
                  autoComplete="current-password"
                  className="w-full min-h-[44px] px-3.5 py-2.5 pl-10 rounded-lg bg-[#0e1017] border border-white/15 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                />
                <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingPassword || isSubmittingGoogle}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#141620] hover:bg-[#1c1e2d] border border-white/15 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>{isSubmittingPassword ? 'Authenticating...' : 'Sign In with Email & Password'}</span>
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-white/10 text-center text-[10px] font-mono text-neutral-400">
            Encrypted Firebase Auth &bull; Firestore RBAC Enforced &bull; Founder Clearance Only
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultLogin;
