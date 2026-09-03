import { useAuth } from '../../lib/authContext';
import VaultLogin from './VaultLogin';
import { RefreshCw, ShieldAlert } from 'lucide-react';

/**
 * STRICT ROUTE-LEVEL SECURITY GATEWAY FOR FOUNDER VAULT
 * 
 * Enforces zero-trust route protection:
 * 1. While auth state is initializing: displays secure handshake screen (never leaks content).
 * 2. If user is unauthenticated OR authenticated but unauthorized: strictly renders VaultLogin.
 * 3. Only allows Founder Vault / CMS / Site Settings to render when authenticated as an authorized founder.
 */
export const ProtectedRoute = ({ children }) => {
  const { isFounder, loading, authError } = useAuth();

  // Handshake verification in progress
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070708] flex items-center justify-center font-mono text-xs text-neutral-400 p-4">
        <div className="flex items-center gap-3 bg-[#0d0e14] border border-white/10 px-6 py-4 rounded-xl shadow-2xl">
          <RefreshCw className="w-4 h-4 text-red-500 animate-spin" />
          <span className="text-white font-semibold uppercase tracking-wider">
            VERIFYING FOUNDER AUTHORIZATION...
          </span>
        </div>
      </div>
    );
  }

  // Not authorized founder -> render login gate
  if (!isFounder) {
    return <VaultLogin authError={authError} />;
  }

  // Fully authenticated & authorized founder
  return children;
};

export default ProtectedRoute;
