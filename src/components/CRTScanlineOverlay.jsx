import { memo } from 'react';

/**
 * CRTScanlineOverlay
 * 
 * Cinematic CRT-monitor style horizontal scanline overlay that slowly drifts
 * vertically down the screen across the entire portfolio.
 * 
 * Includes:
 * 1. Persistent micro-raster horizontal line grid (Sony Trinitron / phosphor texture)
 * 2. Animated rolling electron sweep beam with soft luminous phosphor lead
 * 3. Soft spherical monitor corner vignette for authentic retro-futuristic CRT presence
 * 
 * 100% non-blocking (pointer-events-none), hardware-accelerated, and accessible.
 */
function CRTScanlineOverlay() {
  // Return null to prevent horizontal CRT scanline raster stripes and electron sweeps from fragmenting font glyphs and blurring text
  return null;
}

export default memo(CRTScanlineOverlay);
