import { memo } from 'react';

/**
 * SpatialSectionDivider
 * 
 * An ultra-refined, high-contrast horizontal divider placed between major
 * portfolio sections to reinforce 3D depth, physical elevation stepping,
 * and spatial separation.
 * 
 * Anatomy:
 * 1. Upper Light-Crest: 1px specular filament with directional light-to-dark
 *    tapering (bright laser focus at center, fading out to transparent at bezels).
 * 2. Volumetric Gap Light Bloom: Subtle elliptical glow that simulates light
 *    spilling through the seam between two stacked architectural slabs.
 * 3. Deep Ambient Occlusion Trench: Deep velvet shadow falloff (light to dark)
 *    casting downwards, establishing unmistakable physical vertical separation.
 * 4. Precision Focal Micro-Node: Geometric diamond node and technical coordinate
 *    pill with tactile glass bevel and high-contrast typography.
 */

const ACCENT_CONFIGS = {
  crimson: {
    glow: 'rgba(255, 42, 58, 0.45)',
    ambient: 'rgba(255, 42, 58, 0.12)',
    beam: 'from-transparent via-red-500/80 to-transparent',
    dot: 'bg-red-500 shadow-[0_0_10px_#ff2a3a]',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  ruby: {
    glow: 'rgba(244, 63, 94, 0.45)',
    ambient: 'rgba(244, 63, 94, 0.12)',
    beam: 'from-transparent via-rose-500/80 to-transparent',
    dot: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
  },
  violet: {
    glow: 'rgba(168, 85, 247, 0.45)',
    ambient: 'rgba(168, 85, 247, 0.12)',
    beam: 'from-transparent via-purple-500/80 to-transparent',
    dot: 'bg-purple-500 shadow-[0_0_10px_#a855f7]',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  amber: {
    glow: 'rgba(245, 158, 11, 0.45)',
    ambient: 'rgba(245, 158, 11, 0.12)',
    beam: 'from-transparent via-amber-500/80 to-transparent',
    dot: 'bg-amber-500 shadow-[0_0_10px_#f59e0b]',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
  },
  emerald: {
    glow: 'rgba(16, 185, 129, 0.45)',
    ambient: 'rgba(16, 185, 129, 0.12)',
    beam: 'from-transparent via-emerald-500/80 to-transparent',
    dot: 'bg-emerald-500 shadow-[0_0_10px_#10b981]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  teal: {
    glow: 'rgba(20, 184, 166, 0.45)',
    ambient: 'rgba(20, 184, 166, 0.12)',
    beam: 'from-transparent via-teal-500/80 to-transparent',
    dot: 'bg-teal-500 shadow-[0_0_10px_#14b8a6]',
    border: 'border-teal-500/30',
    text: 'text-teal-400',
  },
  cyan: {
    glow: 'rgba(6, 182, 212, 0.45)',
    ambient: 'rgba(6, 182, 212, 0.12)',
    beam: 'from-transparent via-cyan-500/80 to-transparent',
    dot: 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
  },
  neutral: {
    glow: 'rgba(255, 255, 255, 0.35)',
    ambient: 'rgba(255, 255, 255, 0.08)',
    beam: 'from-transparent via-white/80 to-transparent',
    dot: 'bg-white shadow-[0_0_10px_#ffffff]',
    border: 'border-white/30',
    text: 'text-neutral-300',
  },
};

const SpatialSectionDivider = memo(function SpatialSectionDivider({
  index = '01',
  label = 'SECTION TRANSITION',
  accent = 'crimson',
  className = '',
}) {
  const theme = ACCENT_CONFIGS[accent] || ACCENT_CONFIGS.crimson;

  return (
    <div
      role="separator"
      aria-label={`${label} divider`}
      className={`relative w-full z-20 pointer-events-none select-none my-0 overflow-hidden ${className}`}
    >
      {/* 1. Volumetric Light Spillage (Atmospheric radial leak through the seam) */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-16 pointer-events-none blur-2xl opacity-60"
        style={{
          background: `radial-gradient(ellipse 65% 100% at 50% 0%, ${theme.ambient} 0%, transparent 75%)`,
        }}
      />

      {/* 2. Top Cast Shadow Edge: Creates negative depth above the seam */}
      <div
        aria-hidden="true"
        className="h-1 w-full bg-gradient-to-b from-transparent to-black/60"
      />

      {/* 3. The 3D High-Contrast Specular Seam Line */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Tapering Vector (transparent -> faint glow -> bright white apex) */}
        <div
          className="h-[1px] flex-1 max-w-2xl bg-gradient-to-r from-transparent via-white/10 via-white/35 to-white"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 40%, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, black)',
          }}
        />

        {/* Center Optical Focal Node */}
        <div className="relative mx-3 sm:mx-6 flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#08090d]/90 border border-white/15 backdrop-blur-md shadow-[0_0_25px_-5px_rgba(0,0,0,0.9)]">
          {/* Outer Pulse Corona */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-full opacity-35 blur-[6px]"
            style={{ background: theme.glow }}
          />

          {/* Precision Diamond Node */}
          <span
            className="w-1.5 h-1.5 rotate-45 rounded-[0.5px] border border-white/40 relative z-10 transition-transform duration-300"
            style={{ background: theme.glow }}
          />

          {/* Tactical Index & Label */}
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-semibold relative z-10">
            <span className={`${theme.text} mr-1.5 font-bold`}>{index}</span>
            <span className="text-neutral-600 mr-1.5">//</span>
            <span className="text-neutral-300">{label}</span>
          </span>

          {/* Right Precision Diamond Node */}
          <span
            className="w-1.5 h-1.5 rotate-45 rounded-[0.5px] border border-white/40 relative z-10 transition-transform duration-300"
            style={{ background: theme.glow }}
          />
        </div>

        {/* Right Tapering Vector (bright white apex -> faint glow -> transparent) */}
        <div
          className="h-[1px] flex-1 max-w-2xl bg-gradient-to-l from-transparent via-white/10 via-white/35 to-white"
          style={{
            maskImage: 'linear-gradient(to left, transparent, black 40%, black)',
            WebkitMaskImage: 'linear-gradient(to left, transparent, black 40%, black)',
          }}
        />
      </div>

      {/* 4. Deep Ambient Occlusion Trench: Light-to-dark vertical drop shadow */}
      <div
        aria-hidden="true"
        className="h-6 sm:h-8 w-full bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      />
    </div>
  );
});

export default SpatialSectionDivider;
