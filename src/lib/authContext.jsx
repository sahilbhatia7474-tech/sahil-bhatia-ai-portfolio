import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signOut as fbSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { AUTHORIZED_FOUNDER_EMAILS, FOUNDER_EMAIL, isAuthorizedFounderEmail } from './authConstants';
import { seedInitialDatabase } from './dbService';

export { AUTHORIZED_FOUNDER_EMAILS, FOUNDER_EMAIL, isAuthorizedFounderEmail };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFounder, setIsFounder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const getDomainErrorMessage = () => {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current hostname';
    return `Firebase authentication domain is not authorized for "${currentHost}". Add this hostname in Firebase Console → Authentication → Settings → Authorized domains.`;
  };

  const formatAuthError = (err) => {
    if (!err) return 'Authentication failed.';
    const code = err.code || '';
    if (code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
      return getDomainErrorMessage();
    }
    if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
      return 'Founder authentication is not configured yet. Create the authorized Firebase Email/Password account before signing in.';
    }
    if (code === 'auth/wrong-password') {
      return 'Email or password is incorrect.';
    }
    if (code === 'auth/invalid-email') {
      return 'Invalid email address format.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many failed login attempts. Please try again later.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was closed before completing authentication.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Sign-in popup was blocked by browser. Please enable popups for this site.';
    }
    return err.message || 'Authentication failed.';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authorized = isAuthorizedFounderEmail(firebaseUser.email);
        if (authorized) {
          setUser(firebaseUser);
          setIsFounder(true);
          setAuthError(null);
          // Seed initial database if uninitialized now that founder credentials are authenticated
          seedInitialDatabase().catch((e) => console.warn('Founder session seed note:', e.message));
        } else {
          // Account authenticated via Firebase but not on founder allowlist
          setUser(null);
          setIsFounder(false);
          setAuthError(`This account (${firebaseUser.email}) is authenticated but is not authorized for Founder Vault access.`);
          try {
            await fbSignOut(auth);
          } catch {
            // ignore
          }
        }
      } else {
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
      const email = result.user?.email || '';
      if (isAuthorizedFounderEmail(email)) {
        setUser(result.user);
        setIsFounder(true);
        setAuthError(null);
        return { success: true };
      } else {
        await fbSignOut(auth);
        setUser(null);
        setIsFounder(false);
        const errMsg = 'This account is authenticated but is not authorized for Founder Vault access.';
        setAuthError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.warn('Google Sign-In error:', err);
      const friendlyError = formatAuthError(err);
      setAuthError(friendlyError);
      return { success: false, error: friendlyError, rawError: err };
    }
  };

  const loginWithEmailPassword = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = (email || '').toLowerCase().trim();
    
    if (!normalizedEmail || !password) {
      const msg = 'Please enter both your founder email and password.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    if (!isAuthorizedFounderEmail(normalizedEmail)) {
      const msg = 'This account is authenticated but is not authorized for Founder Vault access.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      if (isAuthorizedFounderEmail(result.user?.email)) {
        setUser(result.user);
        setIsFounder(true);
        setAuthError(null);
        return { success: true };
      } else {
        await fbSignOut(auth);
        setUser(null);
        setIsFounder(false);
        const errMsg = 'This account is authenticated but is not authorized for Founder Vault access.';
        setAuthError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.warn('Email/Password Sign-In error:', err);
      const friendlyError = formatAuthError(err);
      setAuthError(friendlyError);
      return { success: false, error: friendlyError, rawError: err };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error(e);
    }
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
        loginWithEmailPassword,
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
