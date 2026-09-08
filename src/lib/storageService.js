import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth, db } from './firebase';
import { isAuthorizedFounderEmail } from './authConstants';
import { saveItem } from './dbService';
import { doc, getDoc } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];
export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
];
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
];
export const MAX_DOCUMENT_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

// Default watchdog timeout: if no progress or state change occurs within 12 seconds, safely cancel & report
export const DEFAULT_UPLOAD_STALL_TIMEOUT_MS = 12000;

/**
 * Global telemetry tracker for the admin-only Vault Diagnostic mode
 */
export const lastUploadDiagnostic = {
  timestamp: null,
  fileName: null,
  fileSize: null,
  folderPath: null,
  progress: 0,
  status: 'IDLE', // IDLE | SELECTED | AUTHENTICATING | UPLOADING | PROCESSING | UPLOADED | SAVING | VERIFIED | ERROR | CANCELED
  errorCode: null,
  errorMessage: null,
  downloadUrl: null,
  storagePath: null,
  bucket: storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '',
};

export function updateDiagnosticTelemetry(patch) {
  Object.assign(lastUploadDiagnostic, {
    timestamp: new Date().toISOString(),
    ...patch,
  });
}

export function getLastUploadDiagnostic() {
  return { ...lastUploadDiagnostic };
}

/**
 * Deduce MIME type from file extension if browser/Android didn't provide one
 */
export function getMimeTypeFromFileName(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'gif':
      return 'image/gif';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Validate an image file before upload
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No image file selected.' };
  
  const mimeType = (file.type || getMimeTypeFromFileName(file.name)).toLowerCase();
  const isImageMime = mimeType.startsWith('image/') || SUPPORTED_IMAGE_TYPES.includes(mimeType);

  if (!isImageMime) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || mimeType}). Supported formats: JPG, JPEG, PNG, WEBP, SVG, GIF.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image file exceeds maximum 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true, mimeType };
}

/**
 * Validate a video file before upload
 */
export function validateVideoFile(file) {
  if (!file) return { valid: false, error: 'No video file selected.' };
  
  const mimeType = (file.type || getMimeTypeFromFileName(file.name)).toLowerCase();
  const isVideoMime = mimeType.startsWith('video/') || SUPPORTED_VIDEO_TYPES.includes(mimeType);

  if (!isVideoMime) {
    return {
      valid: false,
      error: `Unsupported video format (${file.type || mimeType}). Supported formats: MP4, WebM, QuickTime.`,
    };
  }

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video file exceeds maximum 100MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true, mimeType };
}

/**
 * Validate document file before upload
 */
export function validateDocumentFile(file) {
  if (!file) return { valid: false, error: 'No document file selected.' };
  const mimeType = (file.type || getMimeTypeFromFileName(file.name)).toLowerCase();
  if (mimeType !== 'application/pdf') {
    return {
      valid: false,
      error: `Unsupported document format (${mimeType}). Supported format: PDF.`,
    };
  }
  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: `Document exceeds maximum 25MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }
  return { valid: true, mimeType };
}

/**
 * Validate any media file based on category
 */
export function validateMediaFile(file, category = 'image') {
  if (category === 'video') return validateVideoFile(file);
  if (category === 'document' || category === 'pdf') return validateDocumentFile(file);
  return validateImageFile(file);
}

/**
 * Surface human-readable, precise error messages from Firebase Storage errors
 */
export function formatStorageError(error) {
  if (!error) return 'An unknown error occurred during upload.';

  const code = error.code || '';
  const message = error.message || '';
  const serverResponse = error.serverResponse || error.customData?.serverResponse || '';
  const status = error.status_ || null;
  const configuredBucket = storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '';
  const projectId = firebaseConfigData.projectId || '';

  if (code === 'storage/bucket-not-found' || status === 404 || (code === 'storage/unknown' && status === 404) || message.includes('404') || serverResponse.includes('Not Found') || message.includes('bucket does not exist')) {
    return 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.';
  }

  if (code === 'storage/unauthorized' || status === 403) {
    return 'Permission Denied (storage/unauthorized): Firebase Storage security rules rejected this upload. Please confirm you are logged in to Founder Vault with an authorized founder email.';
  }

  if (code === 'storage/unauthenticated' || code === 'auth/unauthenticated') {
    return 'Authentication Required (storage/unauthenticated): Authentication required before uploading files. Please sign in to Founder Vault.';
  }

  if (code === 'storage/stalled-timeout') {
    return 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.';
  }

  if (code === 'storage/quota-exceeded') {
    return 'Quota Exceeded (storage/quota-exceeded): The Firebase Storage quota for this project has been exceeded.';
  }

  if (code === 'storage/canceled') {
    return 'Upload Cancelled (storage/canceled): The upload operation was cancelled.';
  }

  if (code === 'storage/retry-limit-exceeded') {
    return `Network / Retry Limit Exceeded (storage/retry-limit-exceeded): Storage did not respond. Verify bucket "${configuredBucket}" in project "${projectId}" is activated in Firebase Console.`;
  }

  if (code === 'storage/invalid-checksum') {
    return 'Upload Corrupted (storage/invalid-checksum): The file checksum failed on the server. Please retry.';
  }

  if (message.includes('CORS') || message.includes('preflight')) {
    return `CORS / Network Block: The browser blocked the upload request to "${configuredBucket}". Verify Firebase Storage authorized domains and CORS headers.`;
  }

  return `Firebase Storage Error (${code || 'unknown'}): ${message || 'Check storage configuration and network.'}`;
}

/**
 * Verify current Firebase Auth state before initiating any upload
 */
export function verifyFounderAuth() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {
      authenticated: false,
      error: 'Authentication required before uploading files. Please sign in to Founder Vault.',
      errorCode: 'auth/unauthenticated',
    };
  }

  if (!isAuthorizedFounderEmail(currentUser.email)) {
    return {
      authenticated: false,
      error: `Unauthorized account (${currentUser.email}): Only verified founder accounts are permitted to upload media assets.`,
      errorCode: 'auth/unauthorized',
    };
  }

  return { authenticated: true, user: currentUser };
}

/**
 * Test Storage reachability & bucket configuration for diagnostics
 */
export async function testStorageConnectivity() {
  const configuredBucket = storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '';
  const projectId = firebaseConfigData.projectId || storage?.app?.options?.projectId || '';

  if (!configuredBucket) {
    return {
      reachable: false,
      status: 0,
      bucket: 'NOT_CONFIGURED',
      projectId,
      errorCode: 'storage/no-bucket-configured',
      error: 'Firebase Storage bucket is not configured in firebase-applet-config.json.',
    };
  }

  try {
    const probeUrl = `https://firebasestorage.googleapis.com/v0/b/${configuredBucket}/o`;
    const res = await fetch(probeUrl, { method: 'GET', mode: 'cors' });
    if (res.status === 404) {
      return {
        reachable: false,
        status: 404,
        bucket: configuredBucket,
        projectId,
        errorCode: 'storage/bucket-not-found',
        error: 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.',
        details: `Bucket "${configuredBucket}" in project "${projectId}" returned HTTP 404 (Not Found). Cloud Storage has not been activated in Firebase Console.`,
      };
    }
    return {
      reachable: true,
      status: res.status,
      bucket: configuredBucket,
      projectId,
    };
  } catch (err) {
    return {
      reachable: false,
      status: 0,
      bucket: configuredBucket,
      projectId,
      errorCode: 'storage/network-error',
      error: err.message || 'Network / CORS error reaching Firebase Storage bucket.',
    };
  }
}

/**
 * PRODUCTION-SAFE FIREBASE STORAGE UPLOAD SERVICE
 * 
 * Uses uploadBytesResumable() with real progress events,
 * hard timeout watchdog to prevent staying stuck at 0%,
 * content-type metadata, strict founder auth checks, and detailed error surfacing.
 * 
 * @param {File} file - The file to upload
 * @param {string} folderPath - Target storage folder (e.g. 'portraits', 'projects/covers', 'certificates')
 * @param {Function} onProgress - Progress callback (percent, bytesInfo) => void
 * @param {Object} options - { timeoutMs, onTaskCreated, onStatusChange }
 * @returns {Promise<{ success: boolean, downloadUrl?: string, storagePath?: string, error?: string, errorCode?: string }>}
 */
export async function uploadStorageAsset(
  file,
  folderPath = 'projects/media',
  onProgress = () => {},
  options = {}
) {
  const {
    timeoutMs = DEFAULT_UPLOAD_STALL_TIMEOUT_MS,
    onTaskCreated = () => {},
    onStatusChange = () => {},
  } = options;

  updateDiagnosticTelemetry({
    fileName: file?.name || 'unknown',
    fileSize: file?.size || 0,
    folderPath,
    progress: 0,
    status: 'SELECTED',
    errorCode: null,
    errorMessage: null,
  });
  onStatusChange('SELECTED');

  // Step 1: Pre-flight file validation
  if (!file) {
    const err = 'No file provided for upload.';
    updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'storage/invalid-file', errorMessage: err });
    onStatusChange('ERROR');
    return { success: false, error: err, errorCode: 'storage/invalid-file' };
  }

  // Step 2: Pre-flight storage initialization check
  if (!storage) {
    const err = 'Firebase Storage is not initialized in this application environment.';
    updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'storage/not-initialized', errorMessage: err });
    onStatusChange('ERROR');
    return { success: false, error: err, errorCode: 'storage/not-initialized' };
  }

  // Step 3: Pre-flight founder authentication verification
  onStatusChange('AUTHENTICATING');
  updateDiagnosticTelemetry({ status: 'AUTHENTICATING' });

  const authCheck = verifyFounderAuth();
  if (!authCheck.authenticated) {
    console.error('[Firebase Storage Upload Error - Auth]', {
      projectId: firebaseConfigData.projectId,
      bucket: storage.app.options.storageBucket,
      authenticatedUid: auth.currentUser?.uid || 'NONE',
      storagePath: folderPath,
      fileName: file.name,
      fileSize: file.size,
      uploadState: 'AUTH_FAILED',
      errorCode: authCheck.errorCode,
      errorMessage: authCheck.error,
    });
    updateDiagnosticTelemetry({ status: 'ERROR', errorCode: authCheck.errorCode, errorMessage: authCheck.error });
    onStatusChange('ERROR');
    return {
      success: false,
      error: authCheck.error,
      errorCode: authCheck.errorCode,
    };
  }

  // Step 4: Determine content-type and validate
  const isVideo = folderPath.includes('video') || file.type?.startsWith('video/');
  const isDoc = folderPath.includes('document') || file.type === 'application/pdf' || file.name.endsWith('.pdf');
  const category = isVideo ? 'video' : isDoc ? 'document' : 'image';
  const validation = validateMediaFile(file, category);
  if (!validation.valid) {
    updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'storage/invalid-file', errorMessage: validation.error });
    onStatusChange('ERROR');
    return { success: false, error: validation.error, errorCode: 'storage/invalid-file' };
  }

  const mimeType = validation.mimeType || file.type || getMimeTypeFromFileName(file.name);

  // Step 5: Pre-flight Storage Bucket Reachability Check
  onStatusChange('CHECKING_STORAGE');
  updateDiagnosticTelemetry({ status: 'CHECKING_STORAGE' });

  const bucketCheck = await testStorageConnectivity();
  if (!bucketCheck.reachable) {
    const bucketErrMsg = bucketCheck.error || 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.';
    const bucketErrCode = bucketCheck.errorCode || 'storage/bucket-not-found';
    console.error('[Firebase Storage Upload Error - Bucket Check Failed]', {
      projectId: bucketCheck.projectId,
      bucket: bucketCheck.bucket,
      status: bucketCheck.status,
      errorCode: bucketErrCode,
      error: bucketErrMsg,
    });
    updateDiagnosticTelemetry({
      status: 'ERROR',
      errorCode: bucketErrCode,
      errorMessage: bucketErrMsg,
    });
    onStatusChange('ERROR');
    return {
      success: false,
      error: bucketErrMsg,
      errorCode: bucketErrCode,
      details: bucketCheck.details,
    };
  }

  // Step 6: Construct deterministic storage reference & metadata
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${folderPath}/${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: mimeType,
    customMetadata: {
      uploadedBy: authCheck.user.email,
      originalName: file.name,
      fileSize: String(file.size),
      uploadedAt: new Date().toISOString(),
    },
  };

  // Step 7: Execute uploadBytesResumable with event tracking + Hard Stall Watchdog
  onStatusChange('UPLOADING');
  updateDiagnosticTelemetry({ status: 'UPLOADING', storagePath });

  return new Promise((resolve) => {
    let uploadTask;
    let isSettled = false;
    let stallTimer = null;
    let lastBytes = 0;

    const safeResolve = (result) => {
      if (isSettled) return;
      isSettled = true;
      if (stallTimer) clearTimeout(stallTimer);
      resolve(result);
    };

    // Watchdog: If no progress or state change occurs within timeoutMs, safely cancel & report
    const resetWatchdog = () => {
      if (stallTimer) clearTimeout(stallTimer);
      stallTimer = setTimeout(async () => {
        if (isSettled) return;

        const configuredBucket = storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '';
        console.error('[Firebase Storage Upload Error - Stalled Watchdog]', {
          projectId: firebaseConfigData.projectId,
          bucket: configuredBucket,
          authenticatedUid: auth.currentUser?.uid,
          storagePath,
          fileName: file.name,
          fileSize: file.size,
          uploadState: 'STALLED_AT_0_PERCENT',
          errorCode: 'storage/stalled-timeout',
          errorMessage: `Upload stalled at 0% for ${timeoutMs / 1000}s. Firebase Storage did not respond. Bucket "${configuredBucket}" returned 404 or is not activated in Firebase Console.`,
        });

        try {
          if (uploadTask) uploadTask.cancel();
        } catch {
          // ignore
        }

        const stallError = 'Firebase Storage bucket is not provisioned or does not exist. Activate Cloud Storage in the Firebase Console.';

        updateDiagnosticTelemetry({
          status: 'ERROR',
          progress: 0,
          errorCode: 'storage/stalled-timeout',
          errorMessage: stallError,
        });
        onStatusChange('ERROR');

        safeResolve({
          success: false,
          error: stallError,
          errorCode: 'storage/stalled-timeout',
        });
      }, timeoutMs);
    };

    try {
      uploadTask = uploadBytesResumable(storageRef, file, metadata);
      onTaskCreated(uploadTask);
      resetWatchdog();
    } catch (initErr) {
      console.error('[Firebase Storage Upload Error - Init Failed]', initErr);
      const friendlyErr = formatStorageError(initErr);
      updateDiagnosticTelemetry({ status: 'ERROR', errorCode: initErr.code || 'storage/init-failed', errorMessage: friendlyErr });
      onStatusChange('ERROR');
      return safeResolve({
        success: false,
        error: friendlyErr,
        errorCode: initErr.code || 'storage/init-failed',
      });
    }

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const total = snapshot.totalBytes;
        const transferred = snapshot.bytesTransferred;

        // Reset stall watchdog on active byte transfer
        if (transferred > lastBytes) {
          lastBytes = transferred;
          resetWatchdog();
        }

        if (total > 0) {
          const percent = Math.min(100, Math.max(0, Math.round((transferred / total) * 100)));
          updateDiagnosticTelemetry({ progress: percent, status: 'UPLOADING' });
          onProgress(percent, {
            bytesTransferred: transferred,
            totalBytes: total,
            state: snapshot.state,
          });
        }
      },
      (error) => {
        const configuredBucket = storage?.app?.options?.storageBucket || firebaseConfigData.storageBucket || '';
        console.error('[Firebase Storage Upload Error]', {
          projectId: firebaseConfigData.projectId,
          bucket: configuredBucket,
          authenticatedUid: auth.currentUser?.uid,
          storagePath,
          fileName: file.name,
          fileSize: file.size,
          uploadState: 'ERROR',
          errorCode: error.code,
          errorMessage: error.message,
          serverResponse: error.serverResponse || error.customData?.serverResponse,
          status_: error.status_,
        });

        if (error.code === 'storage/canceled') {
          updateDiagnosticTelemetry({ status: 'CANCELED', errorCode: 'storage/canceled', errorMessage: 'Upload was canceled.' });
          onStatusChange('CANCELED');
          return safeResolve({
            success: false,
            error: 'Upload was canceled by user or watchdog.',
            errorCode: 'storage/canceled',
          });
        }

        const userFriendlyError = formatStorageError(error);
        updateDiagnosticTelemetry({
          status: 'ERROR',
          errorCode: error.code || 'storage/unknown',
          errorMessage: userFriendlyError,
        });
        onStatusChange('ERROR');

        safeResolve({
          success: false,
          error: userFriendlyError,
          errorCode: error.code || 'storage/unknown',
          rawError: error,
        });
      },
      async () => {
        onStatusChange('PROCESSING');
        updateDiagnosticTelemetry({ progress: 100, status: 'PROCESSING' });

        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onStatusChange('UPLOADED');
          updateDiagnosticTelemetry({
            status: 'UPLOADED',
            downloadUrl,
            storagePath,
          });

          onProgress(100, {
            bytesTransferred: file.size,
            totalBytes: file.size,
            state: 'success',
          });

          safeResolve({
            success: true,
            downloadUrl,
            storagePath,
            fileName: sanitizedName,
            fileSize: file.size,
            mimeType,
          });
        } catch (urlErr) {
          console.error('[Firebase Storage DownloadURL Error]', urlErr);
          const urlErrorMsg = formatStorageError(urlErr) || 'Asset uploaded to Firebase Storage, but failed to retrieve public download URL.';
          updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'storage/url-failed', errorMessage: urlErrorMsg });
          onStatusChange('ERROR');

          safeResolve({
            success: false,
            error: urlErrorMsg,
            errorCode: 'storage/url-failed',
          });
        }
      }
    );
  });
}

/**
 * UNIFIED UPLOAD + PERSIST + VERIFY SERVICE
 * 
 * 1. Uploads file to Firebase Storage with resumable progress events
 * 2. Persists the download URL & metadata to the target Firestore document
 * 3. Immediately reads back the document to verify the URL
 * 4. Returns verified status
 */
export async function uploadAndPersistMedia({
  file,
  folderPath,
  collectionName,
  docId,
  fieldName = 'imageUrl',
  additionalFields = {},
  onProgress = () => {},
  onStatusChange = () => {},
  onTaskCreated = () => {},
}) {
  // Step 1: Upload to Firebase Storage
  const uploadResult = await uploadStorageAsset(file, folderPath, onProgress, {
    onStatusChange,
    onTaskCreated,
  });

  if (!uploadResult.success) {
    return uploadResult;
  }

  const { downloadUrl, storagePath } = uploadResult;

  // Step 2: Persist download URL in Firestore
  onStatusChange('SAVING');
  updateDiagnosticTelemetry({ status: 'SAVING' });

  const updatePayload = {
    [fieldName]: downloadUrl,
    updatedAt: new Date().toISOString(),
    ...additionalFields,
  };

  const saveRes = await saveItem(collectionName, docId, updatePayload, true);
  if (!saveRes.success) {
    const saveErr = `Upload succeeded, but failed to persist URL to Firestore document "${collectionName}/${docId}": ${saveRes.error}`;
    updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'firestore/save-failed', errorMessage: saveErr });
    onStatusChange('ERROR');
    return {
      success: false,
      downloadUrl,
      storagePath,
      error: saveErr,
      errorCode: 'firestore/save-failed',
    };
  }

  // Step 3: Read back document immediately to verify persistence
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      const verifyErr = `Persistence verification failed: Document "${collectionName}/${docId}" was not found upon read-back.`;
      updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'firestore/read-verify-failed', errorMessage: verifyErr });
      onStatusChange('ERROR');
      return {
        success: false,
        downloadUrl,
        storagePath,
        error: verifyErr,
        errorCode: 'firestore/read-verify-failed',
      };
    }

    const data = snap.data();
    if (data[fieldName] !== downloadUrl) {
      const mismatchErr = `Persistence verification failed: Value in "${collectionName}/${docId}.${fieldName}" did not match uploaded download URL.`;
      updateDiagnosticTelemetry({ status: 'ERROR', errorCode: 'firestore/mismatch-failed', errorMessage: mismatchErr });
      onStatusChange('ERROR');
      return {
        success: false,
        downloadUrl,
        storagePath,
        error: mismatchErr,
        errorCode: 'firestore/mismatch-failed',
      };
    }

    onStatusChange('VERIFIED');
    updateDiagnosticTelemetry({ status: 'VERIFIED', downloadUrl, storagePath });

    return {
      success: true,
      downloadUrl,
      storagePath,
      verified: true,
      docData: data,
    };
  } catch (verifyErr) {
    console.warn('Read-back verification warning:', verifyErr);
    onStatusChange('VERIFIED');
    return {
      success: true,
      downloadUrl,
      storagePath,
      verified: false,
      warning: 'URL saved to Firestore, but read-back verification threw a network notice.',
    };
  }
}

/**
 * Delete an asset from Firebase Storage by URL or path if applicable
 */
export async function deleteStorageAsset(pathOrUrl) {
  if (!pathOrUrl || !storage) return { success: false };
  try {
    const assetRef = ref(storage, pathOrUrl);
    await deleteObject(assetRef);
    return { success: true };
  } catch (err) {
    console.warn('Could not delete storage asset:', err);
    return { success: false, error: err.message };
  }
}

