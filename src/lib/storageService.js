import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

/**
 * Validate an image file before upload
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' };
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported image format (${file.type || 'unknown'}). Supported formats: JPG, JPEG, PNG, WEBP.`,
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image file exceeds maximum 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }
  return { valid: true };
}

/**
 * Validate a video file before upload
 */
export function validateVideoFile(file) {
  if (!file) return { valid: false, error: 'No video file selected.' };
  if (!SUPPORTED_VIDEO_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported video format (${file.type || 'unknown'}). Supported formats: MP4, WebM.`,
    };
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video file exceeds maximum 100MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }
  return { valid: true };
}

/**
 * Upload an asset file (image, video, document) to Firebase Storage
 * with real-time progress callbacks.
 * 
 * @param {File} file 
 * @param {string} folderPath e.g. 'projects/covers', 'projects/gallery', 'projects/videos', 'identity/intro'
 * @param {Function} onProgress (percent: number) => void
 * @returns {Promise<{ success: boolean, downloadUrl?: string, path?: string, error?: string }>}
 */
export async function uploadStorageAsset(file, folderPath = 'projects/media', onProgress = () => {}) {
  if (!file) {
    return { success: false, error: 'No file provided for upload.' };
  }

  if (!storage) {
    return { success: false, error: 'Firebase Storage is not initialized.' };
  }

  try {
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folderPath}/${timestamp}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          resolve({
            success: false,
            error: error.message || 'Firebase Storage upload failed',
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress(100);
            resolve({
              success: true,
              downloadUrl,
              path: storagePath,
            });
          } catch (urlErr) {
            console.error('Failed to get download URL:', urlErr);
            resolve({
              success: false,
              error: 'Failed to retrieve uploaded asset URL.',
            });
          }
        }
      );
    });
  } catch (err) {
    console.error('Upload initiation error:', err);
    return { success: false, error: err.message || 'Failed to initiate upload' };
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
