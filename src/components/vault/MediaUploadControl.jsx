import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, RotateCw, Image as ImageIcon, Video as VideoIcon, ExternalLink, X } from 'lucide-react';
import { uploadStorageAsset, uploadAndPersistMedia, validateMediaFile } from '../../lib/storageService';
import { useAuth } from '../../lib/authContext';

/**
 * Reusable, production-safe Firebase Storage upload control
 * 
 * Features:
 * - Real-time progress percentage & byte counters from uploadBytesResumable
 * - Strict client-side validation for formats & size
 * - Never gets stuck at "0%": immediately surfaces Firebase error
 * - Surfaces exact Firebase error code and human-readable cause
 * - Includes Retry action
 * - Supports optional immediate Firestore persistence + read-back verification
 */
export default function MediaUploadControl({
  label = 'Select Media File',
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif',
  mediaType = 'image', // 'image' | 'video'
  folderPath = 'media',
  persistConfig = null, // { collectionName, docId, fieldName, additionalFields }
  currentUrl = '',
  onSuccess = () => {},
  onError = () => {},
  compact = false,
  className = '',
}) {
  const { isFounder } = useAuth();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'completed' | 'error'
  const [progress, setProgress] = useState(0);
  const [bytesInfo, setBytesInfo] = useState({ transferred: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || '');
  const fileInputRef = useRef(null);

  const startUpload = async (selectedFile) => {
    if (!selectedFile) return;

    // Validate
    const validation = validateMediaFile(selectedFile, mediaType);
    if (!validation.valid) {
      setStatus('error');
      setErrorMessage(validation.error);
      onError(validation.error);
      return;
    }

    setFile(selectedFile);
    setStatus('uploading');
    setProgress(0);
    setBytesInfo({ transferred: 0, total: selectedFile.size });
    setErrorMessage('');

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
      });
    } else {
      result = await uploadStorageAsset(selectedFile, folderPath, progressCallback);
    }

    if (result.success && result.downloadUrl) {
      setStatus('completed');
      setProgress(100);
      setUploadedUrl(result.downloadUrl);
      onSuccess(result);
    } else {
      setStatus('error');
      const err = result.error || 'Upload to Firebase Storage failed.';
      setErrorMessage(err);
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
    setStatus('idle');
    setFile(null);
    setProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* IDLE STATE: Action button */}
      {status === 'idle' && (
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[44px] flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#141620] hover:bg-[#1a1e2d] border border-white/15 hover:border-red-500/40 text-neutral-200 hover:text-white font-mono text-xs cursor-pointer transition-all active:scale-[0.99]"
          >
            {mediaType === 'video' ? (
              <VideoIcon className="w-4 h-4 text-red-400" />
            ) : (
              <Upload className="w-4 h-4 text-red-400" />
            )}
            <span className="font-semibold">{label}</span>
          </button>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-1 px-1">
            <span>Direct to Firebase Storage ({folderPath})</span>
            <span>{mediaType === 'video' ? 'MP4, WebM (Max 100MB)' : 'JPG, PNG, WebP (Max 15MB)'}</span>
          </div>
        </div>
      )}

      {/* UPLOADING STATE: Real progress bar and live counters */}
      {status === 'uploading' && (
        <div className="p-3.5 rounded-lg bg-[#12141e] border border-red-500/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white">
              <RotateCw className="w-3.5 h-3.5 text-red-400 animate-spin" />
              <span className="font-semibold">Uploading to Firebase Storage...</span>
            </div>
            <span className="text-red-400 font-bold">{progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="truncate max-w-[200px]">{file?.name}</span>
            <span>
              {(bytesInfo.transferred / 1024).toFixed(0)} KB / {(bytesInfo.total / 1024).toFixed(0)} KB
            </span>
          </div>
        </div>
      )}

      {/* ERROR STATE: Surfaces exact Firebase error and Retry action */}
      {status === 'error' && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/50 space-y-2.5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-red-200 font-mono">
                Firebase Storage Upload Error
              </div>
              <div className="text-xs text-red-300 font-sans leading-relaxed break-words">
                {errorMessage}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-red-500/20">
            <button
              type="button"
              onClick={handleRetry}
              className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Retry Upload</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-neutral-300 font-mono text-xs cursor-pointer"
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}
      {status === 'completed' && (
        <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-mono font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Uploaded &amp; Verified</span>
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
                className="text-emerald-400 hover:text-emerald-300 shrink-0"
                title="Open in new tab"
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
