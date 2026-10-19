import { useState } from 'react';
import { Lock, Key, Eye, EyeOff, ShieldCheck, X, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function FounderUnlockModal({ isOpen, onClose, onSuccess }) {
  const { unlockWithMasterPasscode } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!passcode.trim()) {
      setError('Please enter your secret founder passcode.');
      return;
    }

    setLoading(true);
    try {
      const res = unlockWithMasterPasscode(passcode.trim());
      if (res && res.success) {
        setPasscode('');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setError(res?.error || 'Invalid founder passcode. Access denied.');
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#1a0a14] via-[#10060e] to-[#080207] border-2 border-red-500/80 shadow-[0_0_50px_rgba(255,42,58,0.5),0_20px_50px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* Specular top neon edge */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_12px_#ff2a3a]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-950/90 border border-red-500/80 flex items-center justify-center text-red-400 shadow-[0_0_14px_rgba(255,42,58,0.4)]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest">
              SECURITY PROTOCOL // ZERO-TRUST
            </div>
            <h3 className="text-base sm:text-lg font-black font-display text-white uppercase tracking-tight">
              UNLOCK FOUNDER CONTROLS
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-300 font-sans mb-5 leading-relaxed">
          Write operations, content modifications, and publishing controls are restricted strictly to <strong className="text-white">Sahil Bhatia</strong>. Enter your confidential founder passcode to unlock editing clearance.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/60 text-xs font-mono text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono text-neutral-300 uppercase tracking-wider font-bold">
              Founder Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter secret founder passcode..."
                autoFocus
                autoComplete="current-password"
                className="w-full min-h-[48px] px-4 py-2.5 pl-11 pr-11 rounded-xl bg-[#070914] border-2 border-white/20 text-white placeholder-neutral-500 text-xs font-mono focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(255,42,58,0.55)] transition-all font-semibold"
              />
              <Key className="w-4 h-4 text-red-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={showPasscode ? 'Hide passcode' : 'Show passcode'}
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[46px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-[46px] px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,42,58,0.7)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{loading ? 'VERIFYING...' : 'ENABLE EDITING'}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted Zero-Knowledge Authentication</span>
        </div>
      </div>
    </div>
  );
}
