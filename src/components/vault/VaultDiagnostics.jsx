import { useState, useEffect } from 'react';
import { 
  Wrench, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, 
  Database, HardDrive, ShieldCheck, Lock, Terminal, ExternalLink, Copy, Check
} from 'lucide-react';
import { app, auth, db, storage } from '../../lib/firebase';
import { useAuth } from '../../lib/authContext';
import { isAuthorizedFounderEmail } from '../../lib/authConstants';
import { 
  lastUploadDiagnostic, 
  getLastUploadDiagnostic, 
  testStorageConnectivity,
  uploadStorageAsset 
} from '../../lib/storageService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfigData from '../../../firebase-applet-config.json';

export default function VaultDiagnostics() {
  const { canEdit } = useAuth();
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastUploadInfo, setLastUploadInfo] = useState(getLastUploadDiagnostic());

  const [diagnostics, setDiagnostics] = useState({
    firebase: { status: 'CHECKING', details: '' },
    auth: { status: 'CHECKING', details: '' },
    user: { status: 'CHECKING', details: '' },
    storage: { status: 'CHECKING', details: '', bucket: '' },
    firestore: { status: 'CHECKING', details: '' },
    uploadTest: { status: 'IDLE', details: '', timestamp: null },
  });

  const runAllDiagnostics = async () => {
    setTesting(true);

    const currentUser = auth.currentUser;
    const configuredBucket = storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '';

    // 1. Firebase Core Check
    const firebaseOk = !!app && !!app.name;
    const firebaseState = {
      status: firebaseOk ? 'CONNECTED' : 'ERROR',
      details: firebaseOk 
        ? `App: "${app.name}", Project ID: "${firebaseConfigData.projectId || app.options.projectId}"`
        : 'Firebase app instance failed to initialize.',
    };

    // 2. Auth Check
    const authOk = !!currentUser;
    const authState = {
      status: authOk ? 'AUTHENTICATED' : 'NOT AUTHENTICATED',
      details: authOk 
        ? `User UID: ${currentUser.uid} (${currentUser.email || 'no email'})`
        : 'No active Firebase Auth session detected.',
    };

    // 3. User Authorization Check
    const userAuthOk = authOk && isAuthorizedFounderEmail(currentUser?.email);
    const userState = {
      status: userAuthOk ? 'AUTHORIZED' : 'UNAUTHORIZED',
      details: userAuthOk 
        ? `Authorized Founder Email confirmed: "${currentUser.email}"`
        : `Email "${currentUser?.email || 'None'}" is not recognized as an authorized founder.`,
    };

    // 4. Firestore Check
    let firestoreState = { status: 'CHECKING', details: '' };
    try {
      if (!db) {
        throw new Error('Firestore instance is null or undefined.');
      }
      // Test read to identity or settings
      const testRef = doc(db, 'portfolio', 'identity');
      const testSnap = await getDoc(testRef);
      firestoreState = {
        status: 'CONNECTED',
        details: `Connected to Firestore (dbId: ${db._databaseId?.database || 'default'}). Document read success (exists: ${testSnap.exists()}).`,
      };
    } catch (fsErr) {
      firestoreState = {
        status: 'ERROR',
        details: `Firestore connection failed: ${fsErr.message}`,
      };
    }

    // 5. Storage Connectivity Check
    let storageState = { status: 'CHECKING', details: '', bucket: configuredBucket };
    try {
      const probeRes = await testStorageConnectivity();
      if (probeRes.status === 404 || probeRes.errorCode === 'storage/bucket-not-found') {
        storageState = {
          status: 'ERROR',
          bucket: configuredBucket,
          details: 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.',
        };
      } else if (probeRes.reachable) {
        storageState = {
          status: 'CONNECTED',
          bucket: configuredBucket,
          details: `Reachable (HTTP ${probeRes.status}) for bucket "${configuredBucket}".`,
        };
      } else {
        storageState = {
          status: 'ERROR',
          bucket: configuredBucket,
          details: `Unreachable: ${probeRes.error}`,
        };
      }
    } catch (stErr) {
      storageState = {
        status: 'ERROR',
        bucket: configuredBucket,
        details: `Storage probe failed: ${stErr.message}`,
      };
    }

    setDiagnostics((prev) => ({
      ...prev,
      firebase: firebaseState,
      auth: authState,
      user: userState,
      firestore: firestoreState,
      storage: storageState,
    }));

    setLastUploadInfo(getLastUploadDiagnostic());
    setTesting(false);
  };

  const runLiveUploadTest = async () => {
    if (!canEdit) {
      setDiagnostics((prev) => ({
        ...prev,
        uploadTest: { status: 'LOCKED', details: 'Synthetic upload test requires Founder authentication.', timestamp: new Date().toLocaleTimeString() },
      }));
      return;
    }
    setTesting(true);
    setDiagnostics((prev) => ({
      ...prev,
      uploadTest: { status: 'TESTING', details: 'Creating synthetic test file and calling uploadBytesResumable()...' },
    }));

    try {
      const syntheticBlob = new Blob(['diagnostic_test_payload_' + Date.now()], { type: 'image/png' });
      const testFile = new File([syntheticBlob], `diag_test_${Date.now()}.png`, { type: 'image/png' });

      const res = await uploadStorageAsset(testFile, 'diagnostics', () => {}, { timeoutMs: 8000 });

      if (res.success) {
        setDiagnostics((prev) => ({
          ...prev,
          uploadTest: {
            status: 'PASS',
            details: `Upload succeeded! File: ${res.fileName}, URL: ${res.downloadUrl?.slice(0, 45)}...`,
            timestamp: new Date().toLocaleTimeString(),
          },
        }));
      } else {
        setDiagnostics((prev) => ({
          ...prev,
          uploadTest: {
            status: 'FAIL',
            details: `Upload test failed: ${res.error || 'Unknown failure'} (Code: ${res.errorCode || 'N/A'})`,
            timestamp: new Date().toLocaleTimeString(),
          },
        }));
      }
    } catch (err) {
      setDiagnostics((prev) => ({
        ...prev,
        uploadTest: {
          status: 'FAIL',
          details: `Upload test threw uncaught exception: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } finally {
      setLastUploadInfo(getLastUploadDiagnostic());
      setTesting(false);
    }
  };

  useEffect(() => {
    runAllDiagnostics();
  }, []);

  const handleCopyDiagnostics = () => {
    const report = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        diagnostics,
        lastUpload: lastUploadInfo,
        config: {
          projectId: firebaseConfigData.projectId,
          storageBucket: firebaseConfigData.storageBucket,
          databaseId: firebaseConfigData.firestoreDatabaseId,
        },
      },
      null,
      2
    );

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-400 border border-red-500/30 font-bold">
              ADMIN ONLY
            </span>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              Vault System Diagnostics
            </h1>
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            End-to-end telemetry for Firebase Core, Authentication, Firestore, and Cloud Storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyDiagnostics}
            className="min-h-[40px] px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
            title="Copy diagnostic report to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Report' : 'Copy Diagnostics'}</span>
          </button>

          <button
            onClick={runAllDiagnostics}
            disabled={testing}
            className="min-h-[40px] px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Probing...' : 'Re-Run Probes'}</span>
          </button>
        </div>
      </div>

      {/* Grid of System Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Firebase Core */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              Firebase App:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.firebase.status === 'CONNECTED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-400 border border-red-500/30'
              }`}
            >
              {diagnostics.firebase.status}
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-300 break-words leading-relaxed">
            {diagnostics.firebase.details}
          </p>
        </div>

        {/* Auth Status */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Auth:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.auth.status === 'AUTHENTICATED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-400 border border-red-500/30'
              }`}
            >
              {diagnostics.auth.status}
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-300 break-words leading-relaxed">
            {diagnostics.auth.details}
          </p>
        </div>

        {/* User Authorization */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              User:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.user.status === 'AUTHORIZED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-400 border border-red-500/30'
              }`}
            >
              {diagnostics.user.status}
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-300 break-words leading-relaxed">
            {diagnostics.user.details}
          </p>
        </div>

        {/* Firestore Database */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-red-400" />
              Firestore:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.firestore.status === 'CONNECTED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-400 border border-red-500/30'
              }`}
            >
              {diagnostics.firestore.status}
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-300 break-words leading-relaxed">
            {diagnostics.firestore.details}
          </p>
        </div>

        {/* Firebase Storage */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-red-400" />
              Storage:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.storage.status === 'CONNECTED'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-950/60 text-red-400 border border-red-500/30'
              }`}
            >
              {diagnostics.storage.status}
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-300 space-y-1">
            <div>
              <span className="text-neutral-500">Bucket: </span>
              <span className="text-red-400">{diagnostics.storage.bucket || 'Not configured'}</span>
            </div>
            <p className="text-neutral-400 break-words leading-relaxed">
              {diagnostics.storage.details}
            </p>
          </div>
        </div>

        {/* Live Upload Test */}
        <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Upload Test:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                diagnostics.uploadTest.status === 'PASS'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : diagnostics.uploadTest.status === 'FAIL'
                  ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {diagnostics.uploadTest.status}
            </span>
          </div>
          <p className="text-[11px] font-mono text-neutral-300 break-words leading-relaxed">
            {diagnostics.uploadTest.details || 'Click "Run Upload Test" below to execute an end-to-end binary upload test.'}
          </p>
          {canEdit ? (
            <button
              onClick={runLiveUploadTest}
              disabled={testing}
              className="w-full mt-2 py-1.5 px-3 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-mono text-xs cursor-pointer transition-colors"
            >
              Run Synthetic Upload Test
            </button>
          ) : (
            <div className="w-full mt-2 py-1.5 px-3 rounded bg-neutral-900 border border-white/10 text-neutral-400 font-mono text-xs flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Clearance Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Cloud Storage 404 Action Alert (Only displayed if Storage is not activated) */}
      {diagnostics.storage.status === 'ERROR' && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-mono text-xs font-bold text-amber-200 uppercase tracking-wider">
                Cloud Storage Activation Required in Firebase Console
              </h3>
              <p className="text-xs text-amber-300/90 leading-relaxed">
                The storage bucket <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-200 font-mono">{diagnostics.storage.bucket}</code> returned HTTP 404 Not Found.
                In Firebase, Firestore and Cloud Storage are separate services. Firestore is provisioned and functioning normally, but Cloud Storage has not yet been initialized in your Firebase Console project.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-black/50 border border-amber-500/20 font-mono text-xs text-neutral-300 space-y-2">
            <div className="font-bold text-amber-400">Step-by-step resolution:</div>
            <ol className="list-decimal list-inside space-y-1 text-neutral-400">
              <li>Open <a href={`https://console.firebase.google.com/project/${firebaseConfigData.projectId}/storage`} target="_blank" rel="noreferrer" className="text-red-400 hover:underline inline-flex items-center gap-1">Firebase Console &gt; Storage <ExternalLink className="w-3 h-3 inline" /></a></li>
              <li>Click the <strong>&quot;Get Started&quot;</strong> button to activate Cloud Storage</li>
              <li>Choose <strong>&quot;Start in Production mode&quot;</strong> and select your preferred region</li>
              <li>Click <strong>&quot;Done&quot;</strong> to provision the default storage bucket (<code className="text-white">{diagnostics.storage.bucket}</code>)</li>
              <li>Return here and click <strong>&quot;Re-Run Probes&quot;</strong> — uploads will immediately succeed!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Last Upload Telemetry Panel */}
      <div className="p-5 rounded-xl bg-[#090a0f] border border-white/10 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
            Last Upload Telemetry
          </span>
          <span className="text-[10px] font-mono text-neutral-500">
            {lastUploadInfo.timestamp ? new Date(lastUploadInfo.timestamp).toLocaleTimeString() : 'No uploads recorded this session'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-2.5 rounded bg-[#12141e] border border-white/5 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase">Filename</span>
            <div className="text-white truncate" title={lastUploadInfo.fileName || 'None'}>
              {lastUploadInfo.fileName || '—'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#12141e] border border-white/5 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase">Size</span>
            <div className="text-white">
              {lastUploadInfo.fileSize ? `${(lastUploadInfo.fileSize / 1024).toFixed(1)} KB` : '—'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#12141e] border border-white/5 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase">Progress</span>
            <div className="text-red-400 font-bold">
              {lastUploadInfo.progress !== null ? `${lastUploadInfo.progress}%` : '0%'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#12141e] border border-white/5 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase">Status</span>
            <div className="font-bold text-neutral-200">
              {lastUploadInfo.status || 'IDLE'}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#12141e] border border-white/5 space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase">Error Code</span>
            <div className="text-red-400 truncate" title={lastUploadInfo.errorCode || 'None'}>
              {lastUploadInfo.errorCode || 'NONE'}
            </div>
          </div>
        </div>

        {lastUploadInfo.errorMessage && (
          <div className="p-3 rounded bg-red-950/30 border border-red-500/30 font-mono text-xs text-red-300 space-y-1">
            <span className="font-bold text-red-400">Last Error Message:</span>
            <div className="whitespace-pre-line leading-relaxed text-[11px]">
              {lastUploadInfo.errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
