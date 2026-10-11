/**
 * Unified Body Scroll Lock Manager
 * Maintains a reference count and preserves original window scroll position.
 * Prevents mobile rubber-banding and background scrolling without locking stuck states.
 */

let lockCount = 0;
let originalBodyStyles = {
  overflow: '',
  position: '',
  top: '',
  width: '',
};

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    originalBodyStyles = {
      overflow: document.body.style.overflow || '',
      position: document.body.style.position || '',
      top: document.body.style.top || '',
      width: document.body.style.width || '',
    };

    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = originalBodyStyles.overflow || '';
    document.body.style.position = originalBodyStyles.position || '';
    document.body.style.top = originalBodyStyles.top || '';
    document.body.style.width = originalBodyStyles.width || '';
  }
}

export function forceUnlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = 0;
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
}

/**
 * React hook to lock scroll while component is mounted / active
 */
import { useEffect } from 'react';

export function useBodyScrollLock(isActive) {
  useEffect(() => {
    if (!isActive) return;
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, [isActive]);
}
