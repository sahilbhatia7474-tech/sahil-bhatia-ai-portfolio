import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, auth, db } from './firebase';
import { isAuthorizedFounderEmail } from './authConstants';
import { saveItem } from './dbService';
import { doc, getDoc } from 'firebase/firestore';

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
 * Validate any media file based on category
 */
export function validateMediaFile(file, category = 'image') {
  if (category === 'video') return validateVideoFile(file);
  return validateImageFile(file);
}

/**
 * Surface human-readable, precise error messages from Firebase Storage errors
 */
export function formatStorageError(error) {
  if (!error) return 'An unknown error occurred during upload.';

  const code = error.code || '';
  const message = error.message || '';
  const serverResponse = error.serverResponse || '';
  const status = error.status_ || null;

  if (code === 'storage/unauthorized' || status === 403) {
    return 'Permission Denied (storage/unauthorized): Firebase Storage security rules rejected this upload. Please confirm you are logged in to Founder Vault with an authorized founder email.';
  }

  if (code === 'storage/unauthenticated') {
    return 'Authentication Required (storage/unauthenticated): No active founder session. Please log in to Founder Vault before uploading.';
  }

  if (status === 404 || code === 'storage/bucket-not-found' || message.includes('404') || serverResponse.includes('Not Found')) {
    const bucket = storage?.app?.options?.storageBucket || 'configured bucket';
    return `Bucket Not Found (HTTP 404): The Firebase Storage bucket "${bucket}" does not exist or Cloud Storage is not activated in Firebase Console. Go to Firebase Console → Storage → "Get Started" to activate the default bucket.`;
  }

  if (code === 'storage/quota-exceeded') {
    return 'Quota Exceeded (storage/quota-exceeded): The Firebase Storage quota for this project has been exceeded.';
  }

  if (code === 'storage/canceled') {
    return 'Upload Cancelled: The upload operation was cancelled.';
  }

  if (code === 'storage/retry-limit-exceeded') {
    return 'Network Timeout (storage/retry-limit-exceeded): The upload timed out. Please check your internet connection and retry.';
  }

  if (code === 'storage/invalid-checksum') {
    return 'Upload Corrupted (storage/invalid-checksum): The file checksum failed on the server. Please retry.';
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
      error: 'Authentication required: You must be logged into Founder Vault with an authorized founder email to upload media assets.',
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
 * PRODUCTION-SAFE FIREBASE STORAGE UPLOAD SERVICE
 * 
 * Uses uploadBytesResumable() with real progress events,
 * strict file validation, content-type metadata, and thorough error surfacing.
 * 
 * @param {File} file - The file to upload
 * @param {string} folderPath - Target storage folder (e.g. 'portraits', 'projects/covers', 'certificates')
 * @param {Function} onProgress - Progress callback ({ percent: number, bytesTransferred: number, totalBytes: number }) => void
 * @returns {Promise<{ success: boolean, downloadUrl?: string, storagePath?: string, error?: string, errorCode?: string }>}
 */
export async function uploadStorageAsset(file, folderPath = 'projects/media', onProgress = () => {}) {
  // Step 1: Pre-flight file validation
  if (!file) {
    return { success: false, error: 'No file provided for upload.' };
  }

  // Step 2: Pre-flight storage initialization check
  if (!storage) {
    return {
      success: false,
      error: 'Firebase Storage is not initialized in this application environment.',
      errorCode: 'storage/not-initialized',
    };
  }

  // Step 3: Pre-flight founder authentication verification
  const authCheck = verifyFounderAuth();
  if (!authCheck.authenticated) {
    return {
      success: false,
      error: authCheck.error,
      errorCode: authCheck.errorCode,
    };
  }

  // Step 4: Determine content-type and validate
  const isVideo = folderPath.includes('video') || file.type?.startsWith('video/');
  const validation = isVideo ? validateVideoFile(file) : validateImageFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error, errorCode: 'storage/invalid-file' };
  }

  const mimeType = validation.mimeType || file.type || getMimeTypeFromFileName(file.name);

  // Step 5: Construct storage reference & metadata
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

  // Step 6: Execute uploadBytesResumable with event tracking
  return new Promise((resolve) => {
    let uploadTask;
    try {
      uploadTask = uploadBytesResumable(storageRef, file, metadata);
    } catch (initErr) {
      console.error('Failed to create upload task:', initErr);
      return resolve({
        success: false,
        error: formatStorageError(initErr),
        errorCode: initErr.code || 'storage/init-failed',
      });
    }

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const total = snapshot.totalBytes;
        const transferred = snapshot.bytesTransferred;
        if (total > 0) {
          const percent = Math.min(100, Math.max(0, Math.round((transferred / total) * 100)));
          onProgress(percent, {
            bytesTransferred: transferred,
            totalBytes: total,
            state: snapshot.state,
          });
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        const userFriendlyError = formatStorageError(error);
        resolve({
          success: false,
          error: userFriendlyError,
          errorCode: error.code || 'storage/unknown',
          rawError: error,
        });
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onProgress(100, {
            bytesTransferred: file.size,
            totalBytes: file.size,
            state: 'success',
          });
          resolve({
            success: true,
            downloadUrl,
            storagePath,
            fileName: sanitizedName,
            fileSize: file.size,
            mimeType,
          });
        } catch (urlErr) {
          console.error('Failed to get download URL:', urlErr);
          resolve({
            success: false,
            error: 'Asset uploaded to Firebase Storage, but failed to retrieve public download URL.',
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
 * 1. Uploads file to Firebase Storage with progress events
 * 2. Persists the download URL to the target Firestore document
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
}) {
  // Step 1: Upload to Firebase Storage
  const uploadResult = await uploadStorageAsset(file, folderPath, onProgress);
  if (!uploadResult.success) {
    return uploadResult;
  }

  const { downloadUrl, storagePath } = uploadResult;

  // Step 2: Persist download URL in Firestore
  const updatePayload = {
    [fieldName]: downloadUrl,
    updatedAt: new Date().toISOString(),
    ...additionalFields,
  };

  const saveRes = await saveItem(collectionName, docId, updatePayload, true);
  if (!saveRes.success) {
    return {
      success: false,
      downloadUrl,
      storagePath,
      error: `Upload succeeded, but failed to persist URL to Firestore document "${collectionName}/${docId}": ${saveRes.error}`,
      errorCode: 'firestore/save-failed',
    };
  }

  // Step 3: Read back document immediately to verify persistence
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return {
        success: false,
        downloadUrl,
        storagePath,
        error: `Persistence verification failed: Document "${collectionName}/${docId}" was not found upon read-back.`,
        errorCode: 'firestore/read-verify-failed',
      };
    }

    const data = snap.data();
    if (data[fieldName] !== downloadUrl) {
      return {
        success: false,
        downloadUrl,
        storagePath,
        error: `Persistence verification failed: Value in "${collectionName}/${docId}.${fieldName}" did not match uploaded download URL.`,
        errorCode: 'firestore/mismatch-failed',
      };
    }

    return {
      success: true,
      downloadUrl,
      storagePath,
      verified: true,
      docData: data,
    };
  } catch (verifyErr) {
    console.warn('Read-back verification warning:', verifyErr);
    // Even if read-back threw an error, saveItem was successful
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
