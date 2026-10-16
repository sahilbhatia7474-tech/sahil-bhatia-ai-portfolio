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
  return (
    <div
      className="crt-overlay-container"
      aria-hidden="true"
    >
      {/* 1. Micro-Raster Pixel Scanlines Pattern */}
      <div className="crt-scanlines-pattern" />

      {/* 2. Animated Slow-Moving Horizontal Electron Beam Sweep */}
      <div className="crt-beam-sweep">
        {/* Luminous Specular Lead Line */}
        <div className="crt-beam-lead-line" />
      </div>

      {/* 3. Subtle CRT Monitor Peripheral Vignette */}
      <div className="crt-screen-vignette" />
    </div>
  );
}

export default memo(CRTScanlineOverlay);
