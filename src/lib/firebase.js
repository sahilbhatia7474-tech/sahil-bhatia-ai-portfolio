import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setLogLevel,
} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

// Configure log level to suppress routine connection/offline transition notices
setLogLevel('silent');

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const dbId = firebaseConfigData.firestoreDatabaseId;

export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Graceful connection probe that resolves quickly and never blocks the client thread
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const probePromise = getDocFromServer(doc(db, 'test', 'connection'));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('probe_timeout')), 2000)
      );
      await Promise.race([probePromise, timeoutPromise]);
    } catch {
      // Local cache and graceful offline operation are active
    }
  })();
}

export { app };
export default app;
