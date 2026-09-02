import { useState } from 'react';
import { useAuth, FOUNDER_EMAIL, FOUNDER_EMERGENCY_PASSCODE } from '../../lib/authContext';
import { Shield, Lock, Key, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const VaultLogin = () => {
  const { loginWithGoogle, loginWithFounderPasscode, authError } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setLocalError(null);
    const res = await loginWithGoogle();
    if (!res.success) {
      setLocalError(res.error || 'Authentication failed');
    }
    setIsSubmitting(false);
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!passcode.trim()) {
      setLocalError('Please provide the Founder Passcode.');
      return;
    }
    const res = loginWithFounderPasscode(passcode);
    if (!res.success) {
      setLocalError(res.error || 'Invalid passcode.');
    }
  };

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
        <div className="rounded-2xl bg-[#0b0c12]/90 border border-red-500/30 p-8 shadow-[0_0_50px_rgba(255,42,58,0.15)] backdrop-blur-xl space-y-6">
          
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
                Authorized identity control, live 3D card editor, and project content management.
              </p>
            </div>
          </div>

          {/* Authorization Notice */}
          <div className="p-3.5 rounded-lg bg-[#12141e] border border-white/10 text-xs text-neutral-300 font-mono space-y-1">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>AUTHORIZED OPERATOR:</span>
              <span className="text-emerald-400 font-bold">FOUNDER</span>
            </div>
            <div className="text-[11px] text-red-300 break-all">
              {FOUNDER_EMAIL}
            </div>
          </div>

          {/* Error Banner */}
          {(authError || localError) && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError || localError}</span>
            </div>
          )}

          {/* Primary Method: Google Sign-In */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_25px_rgba(255,42,58,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate with Google'}</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center font-mono">
              Direct sign-in using registered founder Google account.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              OR VERIFICATION PASSCODE
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Emergency / Iframe Fallback Passcode Form */}
          <form onSubmit={handlePasscodeSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Founder Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full min-h-[44px] px-3.5 py-2.5 pl-10 rounded-lg bg-[#0e1017] border border-white/15 text-white placeholder-neutral-600 text-xs font-mono focus:outline-none focus:border-red-500 transition-colors"
                />
                <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 px-4 rounded-lg bg-[#141620] hover:bg-[#1c1e2d] border border-white/15 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-neutral-400" />
              <span>Verify Founder Passcode</span>
            </button>

            <div className="text-[10px] text-neutral-400 text-center font-mono">
              Emergency bypass token: <code className="text-neutral-300 bg-white/5 px-1 py-0.5 rounded">{FOUNDER_EMERGENCY_PASSCODE}</code>
            </div>
          </form>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-white/10 text-center text-[10px] font-mono text-neutral-400">
            Encrypted session &bull; Firestore RBAC active &bull; Non-public vault
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultLogin;
