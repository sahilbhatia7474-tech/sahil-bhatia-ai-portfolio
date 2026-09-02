import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { FOUNDER_EMAIL, FOUNDER_EMERGENCY_PASSCODE } from './authConstants';
import { seedInitialDatabase } from './dbService';

export { FOUNDER_EMAIL, FOUNDER_EMERGENCY_PASSCODE };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('sahil_os_founder_session') === 'active') {
        return {
          email: FOUNDER_EMAIL,
          displayName: 'Sahil Bhatia (Founder)',
          photoURL: null,
          uid: 'founder-local-session',
        };
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isFounder, setIsFounder] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('sahil_os_founder_session') === 'active';
    } catch {
      return false;
    }
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check persisted session or local founder token for iframe sandboxes
  useEffect(() => {
    const localFounder = localStorage.getItem('sahil_os_founder_session');

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const emailLower = (firebaseUser.email || '').toLowerCase().trim();
        const authorized = emailLower === FOUNDER_EMAIL.toLowerCase();
        setIsFounder(authorized);
        if (!authorized) {
          setAuthError(`Access Denied: ${firebaseUser.email} is not authorized for Founder Vault.`);
        } else {
          setAuthError(null);
          // Seed initial database if uninitialized now that founder credentials are authenticated
          seedInitialDatabase().catch((e) => console.warn('Founder session seed note:', e.message));
        }
      } else if (localFounder !== 'active') {
        setUser(null);
        setIsFounder(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = (result.user.email || '').toLowerCase().trim();
      if (email === FOUNDER_EMAIL.toLowerCase()) {
        setIsFounder(true);
        localStorage.setItem('sahil_os_founder_session', 'active');
        return { success: true };
      } else {
        setIsFounder(false);
        setAuthError(`Unauthorized account: ${result.user.email}. Only ${FOUNDER_EMAIL} is granted Vault clearance.`);
        return { success: false, error: 'Unauthorized email' };
      }
    } catch (err) {
      console.warn('Google Sign-In popup warning/fallback:', err);
      setAuthError(err.message || 'Authentication failed');
      return { success: false, error: err.message };
    }
  };

  const loginWithFounderPasscode = (passcode) => {
    setAuthError(null);
    if (passcode.trim() === FOUNDER_EMERGENCY_PASSCODE) {
      const founderUser = {
        email: FOUNDER_EMAIL,
        displayName: 'Sahil Bhatia (Founder)',
        photoURL: null,
        uid: 'founder-master-session',
      };
      setUser(founderUser);
      setIsFounder(true);
      localStorage.setItem('sahil_os_founder_session', 'active');
      return { success: true };
    } else {
      setAuthError('Invalid Founder Verification Passcode.');
      return { success: false, error: 'Invalid Passcode' };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('sahil_os_founder_session');
    setUser(null);
    setIsFounder(false);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isFounder,
        isFounderSession: isFounder,
        loading,
        authError,
        loginWithGoogle,
        loginWithFounderPasscode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
