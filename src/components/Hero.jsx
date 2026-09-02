import { motion } from 'framer-motion';
import { ArrowDown, Cpu } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import FeaturedBuilderCard3D from './FeaturedBuilderCard3D';

const Hero = () => {
  const { identity, siteSettings } = usePortfolioData();
  const { isFounder } = useAuth();

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-center bg-[#070708] bg-spatial-grid bg-radial-gradient overflow-hidden border-b border-white/10"
    >
      {/* Background Architectural Accent Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent hidden md:block" />
        <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent hidden md:block" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* System Breadcrumb / OS Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121319] border border-white/15 text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-[#ff2a3a] animate-pulse" />
            <span className="text-white font-medium">{siteSettings?.systemName || identity?.systemName || 'SAHIL / PORTFOLIO OS'}</span>
            <span className="text-neutral-600">//</span>
            <span className="text-neutral-400">{siteSettings?.domain || identity?.domain || 'SAHILBHATIA.COM'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>AI-NATIVE RUNTIME &bull; FOUNDER VAULT CMS v2.6</span>
          </div>
        </motion.div>

        {/* Main Display Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-neutral-400 uppercase mb-2">
                PERSONAL OPERATING SPACE // IDENTITY
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight text-white font-display uppercase leading-[0.95]">
                {identity?.name || 'SAHIL BHATIA'}
              </h1>
            </div>

            {/* Core Hero Statement */}
            <div className="relative pl-4 border-l-2 border-red-500 py-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-neutral-100 font-display">
                &ldquo;{identity?.heroStatement || 'I build AI-powered digital experiences.'}&rdquo;
              </p>
              <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed font-sans">
                {identity?.subStatement || identity?.shortBio}
              </p>
            </div>

            {/* Positioning Pills */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase mb-2.5">
                PRIMARY ROLES & POSITIONING
              </div>
              <div className="flex flex-wrap gap-2">
                {(identity?.positioning || ['AI Generalist', 'AI Consultant', 'AI-Native Builder', 'Digital Systems Creator']).map((pos) => (
                  <span
                    key={pos}
                    className="px-3 py-1.5 rounded bg-[#13141a] border border-white/10 text-xs sm:text-sm font-medium text-neutral-200 hover:border-red-500/40 hover:text-white transition-colors"
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>

            {/* Capability Themes Marquee / Cluster */}
            <div className="pt-2">
              <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase mb-2">
                CORE CAPABILITY THEMES
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(identity?.coreThemes || ['AI + SYSTEMS', 'VIBE CODING', 'AUTOMATION', 'PRODUCT', 'UX']).map((theme) => (
                  <span
                    key={theme}
                    className="px-2.5 py-1 rounded text-[11px] font-mono bg-white/5 border border-white/10 text-neutral-300"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Group */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 rounded-md bg-[#ff2a3a] text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(255,42,58,0.35)] flex items-center gap-2"
              >
                <span>Inspect Curated Projects</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#ai-systems"
                className="px-6 py-3 rounded-md bg-[#13141a] border border-white/15 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:border-white/30 hover:bg-[#1b1c24] transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-red-400" />
                <span>AI Systems Architecture</span>
              </a>

              {isFounder && (
                <a
                  href="/vault"
                  className="px-5 py-3 rounded-md bg-transparent border border-red-500/30 text-red-400 hover:text-white hover:bg-red-950/30 font-mono text-xs tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>Founder Vault</span>
                  <span>🔒</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* 3D FEATURED BUILDER CARD COLUMN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <FeaturedBuilderCard3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
