import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Cpu, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import FeaturedBuilderCard3D from './FeaturedBuilderCard3D';

const Hero = () => {
  const { identity, siteSettings } = usePortfolioData();
  const { isFounder } = useAuth();
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const intro = identity?.introVideo;
  const isIntroEnabled = Boolean(intro?.enabled && (intro?.videoUrl || '').trim());

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const isExternalEmbedVideo = isIntroEnabled && (
    intro.videoUrl.includes('youtube.com') ||
    intro.videoUrl.includes('youtu.be') ||
    intro.videoUrl.includes('vimeo.com')
  );

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-center bg-[#070708] bg-spatial-grid bg-radial-gradient overflow-hidden border-b border-white/10"
    >
      {/* Background Architectural Accent Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl xl:max-w-[1480px] 2xl:max-w-[1560px] h-full pointer-events-none">
        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent hidden md:block" />
        <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/15 via-white/5 to-transparent hidden md:block" />
      </div>

      <div className="max-w-7xl xl:max-w-[1480px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10 w-full">
        {/* System Breadcrumb / OS Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-[#121319] border border-white/15 text-xs font-mono text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-[#ff2a3a] animate-pulse" />
            <span className="text-white font-medium">{siteSettings?.systemName || identity?.systemName || 'PORTFOLIO OS'}</span>
            <span className="text-neutral-600">//</span>
            <span className="text-neutral-400">AI PORTFOLIO & SYSTEMS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>AI-NATIVE RUNTIME &bull; FOUNDER VAULT</span>
          </div>
        </motion.div>

        {/* Main Display Typography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 xl:flex xl:flex-row xl:items-center xl:justify-between gap-10 xl:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 xl:flex-1 xl:min-w-0 space-y-6"
          >
            <div>
              <p className="text-xs sm:text-sm font-mono tracking-[0.25em] text-neutral-400 uppercase mb-2">
                PERSONAL OPERATING SPACE // IDENTITY
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white font-display uppercase leading-[0.95] break-words">
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

              {isIntroEnabled && (
                <button
                  type="button"
                  onClick={() => setShowIntroModal(true)}
                  className="px-5 py-3 rounded-md bg-[#161824] hover:bg-[#1f2233] border border-red-500/40 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 group shadow-[0_0_15px_rgba(255,42,58,0.15)] cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </div>
                  <span>PLAY INTRO VIDEO</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono">
                    {intro.durationBadge || '90 SEC'}
                  </span>
                </button>
              )}

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
            className="lg:col-span-5 xl:shrink-0 flex justify-center items-center lg:-mt-6 xl:-mt-4"
          >
            <FeaturedBuilderCard3D />
          </motion.div>
        </div>
      </div>

      {/* Cinematic Intro Video Modal */}
      {showIntroModal && isIntroEnabled && (
        <div
          className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setShowIntroModal(false);
            if (videoRef.current) videoRef.current.pause();
          }}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-[#0d0e14] border border-white/20 p-5 sm:p-7 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="font-mono text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                  {intro.durationBadge || 'FOUNDER PERSPECTIVE'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                  {intro.headline || 'Founder Introduction // Sahil Bhatia'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowIntroModal(false);
                  if (videoRef.current) videoRef.current.pause();
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {intro.subheadline && (
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                {intro.subheadline}
              </p>
            )}

            {/* Video Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black">
              {isExternalEmbedVideo ? (
                <iframe
                  src={getEmbedUrl(intro.videoUrl)}
                  title="Founder Introduction Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    src={intro.videoUrl}
                    poster={intro.videoPosterUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="font-mono text-[10px] text-neutral-300">
                        OFFICIAL FOUNDER DISPATCH
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
