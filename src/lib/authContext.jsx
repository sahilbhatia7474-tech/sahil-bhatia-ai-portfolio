import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { AUTHORIZED_FOUNDER_EMAILS, FOUNDER_EMAIL, isAuthorizedFounderEmail } from './authConstants';
import { seedInitialDatabase } from './dbService';

export { AUTHORIZED_FOUNDER_EMAILS, FOUNDER_EMAIL, isAuthorizedFounderEmail };

export const MASTER_FOUNDER_PASSCODES = [
  'sahil7474',
  'sahil1471',
  'NETFLIX2025',
  'VAULT2025',
  'ARCHITECT',
  'SAHIL7474',
];

// Universal Guest Access Codes so anyone in the public can explore the Vault in Read-Only Specimen mode
export const GUEST_VIEWER_PASSCODES = [
  'guest',
  'visitor',
  'public',
  'explore',
  'portfolio',
  'viewer',
  'sahil',
];

export const isMasterFounderPasscode = (pass) => {
  if (!pass || typeof pass !== 'string') return false;
  const normalized = pass.trim();
  return MASTER_FOUNDER_PASSCODES.some((p) => p.toLowerCase() === normalized.toLowerCase());
};

export const isGuestPasscode = (pass) => {
  if (!pass || typeof pass !== 'string') return false;
  const normalized = pass.trim();
  return GUEST_VIEWER_PASSCODES.some((p) => p.toLowerCase() === normalized.toLowerCase());
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Session initialization
  const [role, setRole] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem('sahil_vault_role');
        if (storedRole === 'FOUNDER_OWNER' || storedRole === 'PUBLIC_VIEWER') {
          return storedRole;
        }
        if (sessionStorage.getItem('sahil_founder_authorized') === 'true') {
          return 'FOUNDER_OWNER';
        }
      }
    } catch {
      // safe fallback
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem('sahil_vault_role');
        if (storedRole === 'FOUNDER_OWNER' || sessionStorage.getItem('sahil_founder_authorized') === 'true') {
          return {
            email: FOUNDER_EMAIL,
            displayName: 'Sahil Bhatia (Verified Founder & Sole Editor)',
            uid: 'founder-master-session',
          };
        }
        if (storedRole === 'PUBLIC_VIEWER') {
          return {
            email: 'public.viewer@guest.os',
            displayName: 'Public Visitor (Read-Only Guest Mode)',
            uid: 'guest-viewer-session',
          };
        }
      }
    } catch {
      // safe fallback
    }
    return null;
  });

  const [isFounder, setIsFounder] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem('sahil_vault_role');
        return storedRole === 'FOUNDER_OWNER' || storedRole === 'PUBLIC_VIEWER' || sessionStorage.getItem('sahil_founder_authorized') === 'true';
      }
    } catch {
      // safe fallback
    }
    return false;
  });

  const [canEdit, setCanEdit] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedRole = sessionStorage.getItem('sahil_vault_role');
        if (storedRole === 'PUBLIC_VIEWER') return false;
        return storedRole === 'FOUNDER_OWNER' || sessionStorage.getItem('sahil_founder_authorized') === 'true';
      }
    } catch {
      // safe fallback
    }
    return false;
  });

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
      return 'Founder authentication credentials invalid. Please check your email and password or sign in with Google.';
    }
    if (code === 'auth/wrong-password') {
      return 'Email or password is incorrect. Please verify your founder credentials.';
    }
    if (code === 'auth/invalid-email') {
      return 'Invalid email address format.';
    }
    if (code === 'auth/too-many-requests') {
      return 'Too many failed login attempts. Please try again later or authenticate with Google.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Google sign-in popup was closed before completing authentication.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Sign-in popup was blocked by browser. Please enable popups or use Master Passcode.';
    }
    return err.message || 'Authentication failed.';
  };

  useEffect(() => {
    // If already authorized via session in sessionStorage
    try {
      const storedRole = sessionStorage.getItem('sahil_vault_role');
      if (storedRole === 'PUBLIC_VIEWER') {
        setRole('PUBLIC_VIEWER');
        setIsFounder(true);
        setCanEdit(false);
        if (!user) {
          setUser({
            email: 'public.viewer@guest.os',
            displayName: 'Public Visitor (Read-Only Guest Mode)',
            uid: 'guest-viewer-session',
          });
        }
        setLoading(false);
      } else if (storedRole === 'FOUNDER_OWNER' || sessionStorage.getItem('sahil_founder_authorized') === 'true') {
        setRole('FOUNDER_OWNER');
        setIsFounder(true);
        setCanEdit(true);
        if (!user) {
          setUser({
            email: FOUNDER_EMAIL,
            displayName: 'Sahil Bhatia (Verified Founder & Sole Editor)',
            uid: 'founder-master-session',
          });
        }
        setLoading(false);
      }
    } catch {
      // safe fallback
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.isAnonymous) {
          // Public visitor signed in anonymously via Firebase Auth
          setUser(firebaseUser);
          setIsFounder(true);
          setCanEdit(false);
          setRole('PUBLIC_VIEWER');
          try {
            sessionStorage.setItem('sahil_vault_role', 'PUBLIC_VIEWER');
            sessionStorage.removeItem('sahil_founder_authorized');
          } catch {
            // safe fallback
          }
          setAuthError(null);
        } else {
          const authorized = isAuthorizedFounderEmail(firebaseUser.email);
          if (authorized) {
            // Admin Founder: Sahil Bhatia
            setUser(firebaseUser);
            setIsFounder(true);
            setCanEdit(true);
            setRole('FOUNDER_OWNER');
            try {
              sessionStorage.setItem('sahil_founder_authorized', 'true');
              sessionStorage.setItem('sahil_vault_role', 'FOUNDER_OWNER');
            } catch {
              // safe fallback
            }
            setAuthError(null);
            seedInitialDatabase().catch(() => {});
          } else {
            // Public user authenticated with non-admin Google/Email account:
            // Allowed anonymous/visitor read access, restricted from writing
            setUser(firebaseUser);
            setIsFounder(true);
            setCanEdit(false);
            setRole('PUBLIC_VIEWER');
            try {
              sessionStorage.setItem('sahil_vault_role', 'PUBLIC_VIEWER');
              sessionStorage.removeItem('sahil_founder_authorized');
            } catch {
              // safe fallback
            }
            setAuthError(null);
          }
        }
      } else {
        const storedRole = typeof window !== 'undefined' ? sessionStorage.getItem('sahil_vault_role') : null;
        if (storedRole !== 'FOUNDER_OWNER' && storedRole !== 'PUBLIC_VIEWER') {
          setUser(null);
          setIsFounder(false);
          setCanEdit(false);
          setRole(null);
        }
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
        setCanEdit(true);
        setRole('FOUNDER_OWNER');
        try {
          sessionStorage.setItem('sahil_founder_authorized', 'true');
          sessionStorage.setItem('sahil_vault_role', 'FOUNDER_OWNER');
        } catch {
          // safe fallback
        }
        setAuthError(null);
        return { success: true, role: 'FOUNDER_OWNER' };
      } else {
        // Authenticated as public guest
        setUser(result.user);
        setIsFounder(true);
        setCanEdit(false);
        setRole('PUBLIC_VIEWER');
        try {
          sessionStorage.setItem('sahil_vault_role', 'PUBLIC_VIEWER');
          sessionStorage.removeItem('sahil_founder_authorized');
        } catch {
          // safe fallback
        }
        setAuthError(null);
        return { 
          success: true, 
          role: 'PUBLIC_VIEWER', 
          message: 'Signed in as Public Visitor. Read-only clearance granted; write operations are restricted to Sahil Bhatia (sahilbhatia7474@gmail.com).' 
        };
      }
    } catch (err) {
      const friendlyError = formatAuthError(err);
      setAuthError(friendlyError);
      return { success: false, error: friendlyError };
    }
  };

  const loginWithEmailPassword = async (email, password) => {
    setAuthError(null);
    const normalizedEmail = (email || '').toLowerCase().trim();
    const trimmedPassword = (password || '').trim();

    if (!trimmedPassword) {
      const msg = 'Please enter your password.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    // Check Master Founder Passcode
    if (isMasterFounderPasscode(trimmedPassword)) {
      const founderUser = {
        email: normalizedEmail && isAuthorizedFounderEmail(normalizedEmail) ? normalizedEmail : FOUNDER_EMAIL,
        displayName: 'Sahil Bhatia (Master Key Authorized)',
        uid: 'founder-master-key',
      };
      setUser(founderUser);
      setIsFounder(true);
      setCanEdit(true);
      setRole('FOUNDER_OWNER');
      try {
        sessionStorage.setItem('sahil_founder_authorized', 'true');
        sessionStorage.setItem('sahil_vault_role', 'FOUNDER_OWNER');
      } catch {
        // safe fallback
      }
      setAuthError(null);
      seedInitialDatabase().catch(() => {});
      return { success: true };
    }

    if (!normalizedEmail) {
      const msg = 'Please enter both your founder email and password.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    if (!isAuthorizedFounderEmail(normalizedEmail)) {
      const msg = 'Invalid credentials or unauthorized founder account.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const result = await signInWithEmailAndPassword(auth, normalizedEmail, trimmedPassword);
      if (isAuthorizedFounderEmail(result.user?.email)) {
        setUser(result.user);
        setIsFounder(true);
        setCanEdit(true);
        setRole('FOUNDER_OWNER');
        try {
          sessionStorage.setItem('sahil_founder_authorized', 'true');
          sessionStorage.setItem('sahil_vault_role', 'FOUNDER_OWNER');
        } catch {
          // safe fallback
        }
        setAuthError(null);
        return { success: true };
      } else {
        await fbSignOut(auth);
        setUser(null);
        setIsFounder(false);
        setCanEdit(false);
        setRole(null);
        const errMsg = 'This account is authenticated but is not authorized for Founder Vault access.';
        setAuthError(errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      const friendlyError = formatAuthError(err);
      setAuthError(friendlyError);
      return { success: false, error: friendlyError };
    }
  };

  const unlockWithMasterPasscode = (passcode) => {
    const trimmed = (passcode || '').trim();
    if (isMasterFounderPasscode(trimmed)) {
      const founderUser = {
        email: FOUNDER_EMAIL,
        displayName: 'Sahil Bhatia (Verified Founder & Sole Editor)',
        uid: 'founder-master-key',
      };
      setUser(founderUser);
      setIsFounder(true);
      setCanEdit(true);
      setRole('FOUNDER_OWNER');
      try {
        sessionStorage.setItem('sahil_founder_authorized', 'true');
        sessionStorage.setItem('sahil_vault_role', 'FOUNDER_OWNER');
      } catch {
        // safe fallback
      }
      setAuthError(null);
      seedInitialDatabase().catch(() => {});
      return { success: true };
    }

    if (isGuestPasscode(trimmed)) {
      return unlockAsPublicViewer();
    }

    const errMsg = 'Invalid credentials. Enter your founder credentials or click "Explore in Guest Preview (Read-Only)".';
    setAuthError(errMsg);
    return { success: false, error: errMsg };
  };

  const unlockAsPublicViewer = async () => {
    let firebaseAnonUser = null;
    try {
      const res = await signInAnonymously(auth);
      firebaseAnonUser = res.user;
    } catch (err) {
      console.warn('Notice on anonymous sign-in attempt:', err?.message);
    }

    const guestUser = firebaseAnonUser || {
      email: null,
      isAnonymous: true,
      displayName: 'Public Visitor (Read-Only Specimen Mode)',
      uid: firebaseAnonUser?.uid || 'guest-viewer-session',
    };
    setUser(guestUser);
    setIsFounder(true); // Allows opening the vault
    setCanEdit(false);   // Strictly READ-ONLY; editing, saving, deleting are blocked
    setRole('PUBLIC_VIEWER');
    try {
      sessionStorage.setItem('sahil_vault_role', 'PUBLIC_VIEWER');
      sessionStorage.removeItem('sahil_founder_authorized');
    } catch {
      // safe fallback
    }
    setAuthError(null);
    return { success: true, user: guestUser };
  };

  const signInAsAnonymousVisitor = async () => {
    return await unlockAsPublicViewer();
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // Safe fallback
    }
    try {
      sessionStorage.removeItem('sahil_founder_authorized');
      sessionStorage.removeItem('sahil_vault_role');
    } catch {
      // safe fallback
    }
    setUser(null);
    setIsFounder(false);
    setCanEdit(false);
    setRole(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isFounder,
        isFounderSession: isFounder,
        canEdit,
        isEditor: canEdit,
        isAdmin: canEdit,
        isVisitor: !canEdit,
        role,
        loading,
        authError,
        loginWithGoogle,
        loginWithEmailPassword,
        unlockWithMasterPasscode,
        unlockAsPublicViewer,
        signInAsAnonymousVisitor,
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
