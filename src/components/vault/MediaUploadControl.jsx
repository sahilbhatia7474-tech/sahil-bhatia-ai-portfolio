import { useState, useRef } from 'react';
import { 
  Upload, AlertCircle, CheckCircle2, RotateCw, Image as ImageIcon, 
  Video as VideoIcon, FileText, ExternalLink, X, Ban, ShieldCheck, Database
} from 'lucide-react';
import { 
  uploadStorageAsset, 
  uploadAndPersistMedia, 
  validateMediaFile, 
  verifyFounderAuth,
  formatStorageError,
  testStorageConnectivity
} from '../../lib/storageService';
import { useAuth } from '../../lib/authContext';

/**
 * PRODUCTION-READY FIREBASE STORAGE UPLOAD CONTROL
 * 
 * Strict explicit states:
 * IDLE -> SELECTED -> AUTHENTICATING -> CHECKING_STORAGE -> UPLOADING -> PROCESSING -> UPLOADED -> SAVING -> VERIFIED -> ERROR | CANCELED
 */
export default function MediaUploadControl({
  label = 'Select Media File',
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif',
  mediaType = 'image', // 'image' | 'video' | 'document'
  folderPath = 'media',
  persistConfig = null, // { collectionName, docId, fieldName, additionalFields }
  currentUrl = '',
  onSuccess = () => {},
  onError = () => {},
  className = '',
}) {
  const { isFounder, user } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('IDLE'); // IDLE | SELECTED | AUTHENTICATING | CHECKING_STORAGE | UPLOADING | PROCESSING | UPLOADED | SAVING | VERIFIED | ERROR | CANCELED
  const [progress, setProgress] = useState(0);
  const [bytesInfo, setBytesInfo] = useState({ transferred: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  const fileInputRef = useRef(null);
  const activeTaskRef = useRef(null);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const probe = await testStorageConnectivity();
      if (probe.reachable) {
        setConnectionStatus({
          ok: true,
          message: `Storage Bucket "${probe.bucket}" is reachable (HTTP ${probe.status}). Ready to upload.`,
        });
      } else {
        setConnectionStatus({
          ok: false,
          message: probe.error || 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.',
        });
      }
    } catch (err) {
      setConnectionStatus({
        ok: false,
        message: err.message || 'Error probing storage connection.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleCancel = () => {
    if (activeTaskRef.current) {
      try {
        activeTaskRef.current.cancel();
      } catch (err) {
        console.warn('Task cancel notice:', err);
      }
    }
    setStatus('CANCELED');
  };

  const startUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setStatus('SELECTED');
    setFile(selectedFile);
    setProgress(0);
    setBytesInfo({ transferred: 0, total: selectedFile.size });
    setErrorMessage('');
    setErrorCode('');

    // Pre-flight file validation
    const validation = validateMediaFile(selectedFile, mediaType);
    if (!validation.valid) {
      setStatus('ERROR');
      setErrorMessage(validation.error);
      setErrorCode('storage/invalid-file');
      onError(validation.error);
      return;
    }

    // Pre-flight founder authentication verification
    setStatus('AUTHENTICATING');
    const authCheck = verifyFounderAuth();
    if (!authCheck.authenticated) {
      setStatus('ERROR');
      setErrorMessage(authCheck.error);
      setErrorCode(authCheck.errorCode || 'auth/unauthenticated');
      onError(authCheck.error);
      return;
    }

    const progressCallback = (percent, info) => {
      setProgress(percent);
      if (info) {
        setBytesInfo({ transferred: info.bytesTransferred, total: info.totalBytes });
      }
    };

    let result;
    if (persistConfig && persistConfig.collectionName && persistConfig.docId) {
      result = await uploadAndPersistMedia({
        file: selectedFile,
        folderPath,
        collectionName: persistConfig.collectionName,
        docId: persistConfig.docId,
        fieldName: persistConfig.fieldName || 'imageUrl',
        additionalFields: persistConfig.additionalFields || {},
        onProgress: progressCallback,
        onStatusChange: (newStatus) => setStatus(newStatus),
        onTaskCreated: (task) => { activeTaskRef.current = task; },
      });
    } else {
      result = await uploadStorageAsset(selectedFile, folderPath, progressCallback, {
        onStatusChange: (newStatus) => setStatus(newStatus),
        onTaskCreated: (task) => { activeTaskRef.current = task; },
      });
    }

    activeTaskRef.current = null;

    if (result.success && result.downloadUrl) {
      setStatus(persistConfig ? 'VERIFIED' : 'UPLOADED');
      setProgress(100);
      setUploadedUrl(result.downloadUrl);
      onSuccess(result);
    } else {
      setStatus('ERROR');
      const err = result.error || 'Upload to Firebase Storage failed.';
      setErrorMessage(err);
      setErrorCode(result.errorCode || 'storage/unknown');
      onError(err);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      startUpload(selected);
    }
  };

  const handleRetry = () => {
    if (file) {
      startUpload(file);
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReset = () => {
    setStatus('IDLE');
    setFile(null);
    setProgress(0);
    setBytesInfo({ transferred: 0, total: 0 });
    setErrorMessage('');
    setErrorCode('');
    activeTaskRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isUploadingState = ['SELECTED', 'AUTHENTICATING', 'CHECKING_STORAGE', 'UPLOADING', 'PROCESSING', 'UPLOADED', 'SAVING'].includes(status);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Hidden file input supporting Android, iOS, and desktop browsers */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* IDLE STATE: Clean action button */}
      {status === 'IDLE' && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#141620] hover:bg-[#1a1e2d] border border-white/15 hover:border-red-500/40 text-neutral-200 hover:text-white font-mono text-xs cursor-pointer transition-all active:scale-[0.99]"
          >
            {mediaType === 'video' ? (
              <VideoIcon className="w-4 h-4 text-red-400" />
            ) : mediaType === 'document' ? (
              <FileText className="w-4 h-4 text-red-400" />
            ) : (
              <Upload className="w-4 h-4 text-red-400" />
            )}
            <span className="font-semibold">{label}</span>
          </button>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 px-1">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="text-neutral-400 hover:text-red-400 underline cursor-pointer flex items-center gap-1.5"
            >
              {testingConnection && <RotateCw className="w-3 h-3 animate-spin text-red-400" />}
              <span>Test Storage Connection</span>
            </button>
            <span>
              {mediaType === 'video' 
                ? 'MP4, WebM (Max 100MB)' 
                : mediaType === 'document' 
                ? 'PDF Document (Max 25MB)' 
                : 'JPG, PNG, WebP (Max 15MB)'}
            </span>
          </div>

          {connectionStatus && (
            <div className={`p-2.5 rounded-md text-[11px] font-mono border ${
              connectionStatus.ok
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-red-950/40 text-red-300 border-red-500/40'
            }`}>
              <div className="flex items-start gap-1.5">
                {connectionStatus.ok ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="break-words leading-relaxed">
                  {connectionStatus.message}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE UPLOAD / AUTH / PROBING / PROCESSING / SAVING STATES */}
      {isUploadingState && (
        <div className="p-3.5 rounded-lg bg-[#12141e] border border-red-500/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <RotateCw className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span className="font-semibold">
                {status === 'AUTHENTICATING' && 'Verifying Founder Credentials...'}
                {status === 'CHECKING_STORAGE' && 'Checking Storage Bucket Provisioning...'}
                {status === 'UPLOADING' && 'Uploading to Firebase Storage...'}
                {status === 'PROCESSING' && 'Finalizing Download URL...'}
                {status === 'SAVING' && 'Persisting Records to Firestore...'}
                {status === 'UPLOADED' && 'Upload Complete...'}
                {status === 'SELECTED' && 'Preparing File...'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-500/30">
                {status}
              </span>
              <span className="text-red-400 font-bold">{progress}%</span>
            </div>
          </div>

          {/* Real progress bar derived from uploadBytesResumable events */}
          <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="truncate max-w-[180px] sm:max-w-[240px]">{file?.name}</span>
            <div className="flex items-center gap-3">
              <span>
                {(bytesInfo.transferred / 1024).toFixed(0)} KB / {(bytesInfo.total / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELED STATE */}
      {status === 'CANCELED' && (
        <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-700 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
            <Ban className="w-4 h-4 text-amber-400" />
            <span className="font-semibold">Upload Operation Canceled</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-md bg-transparent text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}

      {/* ERROR STATE: Surfaces exact Firebase error and diagnostic details */}
      {status === 'ERROR' && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/50 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-200 font-mono">
                  Firebase Storage Error
                </span>
                {errorCode && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-500/30">
                    {errorCode}
                  </span>
                )}
              </div>
              <div className="text-xs text-red-300 font-sans leading-relaxed whitespace-pre-line break-words">
                {errorMessage}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-red-500/20">
            <button
              type="button"
              onClick={handleRetry}
              className="min-h-[36px] px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <RotateCw className="w-3 h-3" />
              <span>Retry Upload</span>
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="min-h-[36px] px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white font-mono text-xs cursor-pointer flex items-center gap-1.5"
            >
              {testingConnection && <RotateCw className="w-3 h-3 animate-spin text-red-400" />}
              <span>Test Storage Connection</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="min-h-[36px] px-3 py-1.5 rounded-md bg-transparent text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              Select New File
            </button>
          </div>

          {connectionStatus && (
            <div className={`p-2 rounded text-[11px] font-mono border ${
              connectionStatus.ok
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-black/50 text-red-300 border-red-500/30'
            }`}>
              {connectionStatus.message}
            </div>
          )}
        </div>
      )}

      {/* VERIFIED / COMPLETED STATE */}
      {(status === 'VERIFIED' || status === 'UPLOADED') && (
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {status === 'VERIFIED' ? 'Uploaded & Persisted to Firestore' : 'Uploaded to Firebase Storage'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-mono text-neutral-400 hover:text-white cursor-pointer"
            >
              Upload New
            </button>
          </div>

          {uploadedUrl && (
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-black/40 border border-emerald-500/20 text-[11px] font-mono">
              <span className="text-neutral-300 truncate max-w-[280px]">{uploadedUrl}</span>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 shrink-0 p-1"
                title="Open uploaded asset in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

