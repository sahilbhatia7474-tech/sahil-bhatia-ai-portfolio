import { useState, useRef } from 'react';
import { 
  X, ShieldCheck, Cpu, Code2, Layers, CheckCircle2, 
  ExternalLink, Globe, ArrowUpRight, FileText, BookOpen, Smartphone,
  Play, Pause, Volume2, VolumeX, Maximize2, Image as ImageIcon, Film
} from 'lucide-react';
import { getProjectPublicLinks, deriveProjectBadge } from '../lib/projectLinks';
import ProjectSymbol from './ProjectSymbol';
import ProjectMediaPlaceholder from './ProjectMediaPlaceholder';

const LINK_TYPE_ICONS = {
  LIVE_WEBSITE: Globe,
  DEMO: ExternalLink,
  GITHUB: Code2,
  CASE_STUDY: FileText,
  DOCUMENTATION: BookOpen,
  APP_STORE: Smartphone,
  OTHER: ExternalLink,
};

const ProjectModal = ({ project, onClose }) => {
  const [activeMediaTab, setActiveMediaTab] = useState('MAIN'); // 'MAIN' | 'VIDEO' | 'GALLERY'
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Custom video player controls state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!project) return null;

  const publicLinks = getProjectPublicLinks(project);
  const primaryLink = publicLinks.find((l) => l.isPrimary) || publicLinks[0];
  const fallbackBadge = deriveProjectBadge(project);

  const coverImage = project.coverImageUrl || project.heroImage;
  const gallery = Array.isArray(project.galleryImages) ? project.galleryImages : [];
  const hasVideo = Boolean((project.videoUrl || '').trim());
  const hasGallery = gallery.length > 0;
  const hasCover = Boolean(coverImage);

  const isExternalEmbedVideo = hasVideo && (
    project.videoUrl.includes('youtube.com') ||
    project.videoUrl.includes('youtu.be') ||
    project.videoUrl.includes('vimeo.com')
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

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div
          className="relative w-full max-w-3xl rounded-xl bg-[#0e0f14] border border-white/20 p-6 sm:p-8 shadow-2xl text-left my-8 max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-md bg-[#181920] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all cursor-pointer z-10"
            aria-label="Close project inspection"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Metadata & Primary CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-12">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-white/10 text-neutral-300 font-semibold">
                PROJECT {project.id}
              </span>
              <span
                className={`font-mono text-xs px-2.5 py-0.5 rounded font-semibold border ${
                  project.status === 'BUILT'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : project.status === 'IN PROGRESS'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}
              >
                STATUS: {project.status}
              </span>
              <span className="font-mono text-xs text-neutral-500">
                YEAR: {project.year}
              </span>
            </div>

            {/* Prominent Primary Link Header Button */}
            {primaryLink && (
              <a
                href={primaryLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#ff2a3a] hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,42,58,0.3)]"
              >
                <span>VIEW LIVE PROJECT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Title and Subtitle with Distinctive Project Symbol */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#14151e] border border-white/15 ring-1 ring-white/5 flex items-center justify-center text-red-400 shrink-0 shadow-sm">
              <ProjectSymbol slug={project.slug} title={project.title} id={project.id} className="w-4 h-4" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold font-display text-white uppercase tracking-tight">
              {project.title}
            </h3>
          </div>
          <p className="text-sm font-mono text-red-400 mb-6">
            {project.subtitle} &bull; {project.category}
          </p>

          {/* ============================================================ */}
          {/* MEDIA ARCHITECTURE PRESENTATION SYSTEM                       */}
          {/* ============================================================ */}
          {(hasCover || hasVideo || hasGallery) ? (
            <div className="mb-6 space-y-3">
              {/* Media Mode Tabs */}
              {(hasVideo || hasGallery) && (
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  {hasCover && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('MAIN')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
                        activeMediaTab === 'MAIN'
                          ? 'bg-red-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>HERO VISUAL</span>
                    </button>
                  )}
                  {hasVideo && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('VIDEO')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
                        activeMediaTab === 'VIDEO'
                          ? 'bg-red-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>PROJECT VIDEO</span>
                    </button>
                  )}
                  {hasGallery && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('GALLERY')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded font-mono text-xs transition-colors cursor-pointer ${
                        activeMediaTab === 'GALLERY'
                          ? 'bg-red-600 text-white font-semibold'
                          : 'text-neutral-400 hover:text-white bg-white/5'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>GALLERY ({gallery.length})</span>
                    </button>
                  )}
                </div>
              )}

              {/* 1. Main Cover Visual (with Zoom Capability) */}
              {(activeMediaTab === 'MAIN' || (!hasVideo && !hasGallery)) && hasCover && (
                <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black group">
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isZoomed ? 'cursor-zoom-out max-h-[500px]' : 'cursor-zoom-in max-h-[360px]'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  >
                    <img
                      src={coverImage}
                      alt={project.mediaAltText || project.title}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isZoomed ? 'scale-125' : 'scale-100 hover:scale-105'
                      }`}
                    />
                  </div>

                  {/* Zoom Badge & Caption */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLightboxImage(coverImage)}
                      className="p-1.5 rounded-md bg-black/80 hover:bg-black text-neutral-300 hover:text-white border border-white/20 backdrop-blur-md text-xs cursor-pointer flex items-center gap-1"
                      title="Expand to Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px] hidden sm:inline">FULLSCREEN</span>
                    </button>
                  </div>

                  {project.mediaCaption && (
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/80 border border-white/10 backdrop-blur-md font-mono text-[10px] text-neutral-300">
                      {project.mediaCaption}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Video Player with Custom Controls */}
              {activeMediaTab === 'VIDEO' && hasVideo && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black group">
                  {isExternalEmbedVideo ? (
                    <iframe
                      src={getEmbedUrl(project.videoUrl)}
                      title={`${project.title} Video Presentation`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={project.videoUrl}
                        poster={project.videoPosterUrl || coverImage}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        className="w-full h-full object-contain"
                      />

                      {/* Custom Control Overlay Bar */}
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleTogglePlay}
                            className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                          </button>
                          <button
                            type="button"
                            onClick={handleToggleMute}
                            className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          <span className="font-mono text-[10px] text-neutral-300">
                            PROPRIETARY SYSTEM VIDEO
                          </span>
                        </div>

                        {project.mediaCaption && (
                          <div className="font-mono text-[10px] text-neutral-400 truncate max-w-xs">
                            {project.mediaCaption}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Interactive Gallery with Thumbnails & Click-to-Expand */}
              {activeMediaTab === 'GALLERY' && hasGallery && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black">
                    <img
                      src={gallery[activeGalleryIndex]}
                      alt={`Gallery Slide ${activeGalleryIndex + 1}`}
                      className="w-full h-full object-contain cursor-zoom-in"
                      onClick={() => setLightboxImage(gallery[activeGalleryIndex])}
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxImage(gallery[activeGalleryIndex])}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-md bg-black/80 hover:bg-black text-neutral-300 hover:text-white border border-white/20 backdrop-blur-md text-xs cursor-pointer flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">FULLVIEW</span>
                    </button>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {gallery.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveGalleryIndex(idx)}
                        className={`relative w-20 h-14 rounded-md overflow-hidden border shrink-0 transition-all cursor-pointer ${
                          activeGalleryIndex === idx
                            ? 'border-red-500 ring-2 ring-red-500/30 scale-105'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <ProjectMediaPlaceholder project={project} aspect="video" />
            </div>
          )}

          {/* Summary */}
          <div className="p-4 rounded-lg bg-[#14151e] border border-white/10 mb-6">
            <p className="text-sm text-neutral-200 leading-relaxed font-sans">
              {project.summary}
            </p>
          </div>

          {/* Full Architectural Breakdown */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-400" />
                SYSTEM OVERVIEW &amp; DESIGN INTENT
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                {project.description}
              </p>
            </div>

            {/* Dedicated Deployments & Resources Section */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-red-400" />
                DEPLOYMENTS &amp; EXTERNAL RESOURCES
              </h4>

              {publicLinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {publicLinks.map((link) => {
                    const Icon = LINK_TYPE_ICONS[link.type] || ExternalLink;
                    const isPri = link.isPrimary;

                    return (
                      <a
                        key={link.id || link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all group ${
                          isPri
                            ? 'bg-red-950/30 border-red-500/40 hover:bg-red-900/40 text-white'
                            : 'bg-[#121319] border-white/10 hover:border-white/20 text-neutral-200 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded ${isPri ? 'bg-red-600/30 text-red-400' : 'bg-white/5 text-neutral-400'}`}>
                            <Icon className="w-4 h-4 shrink-0" />
                          </div>
                          <div className="truncate">
                            <div className="font-sans text-xs font-semibold truncate group-hover:text-white">
                              {link.label}
                            </div>
                            <div className="font-mono text-[10px] text-neutral-500 truncate">
                              {link.url.replace(/^https?:\/\//, '')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {isPri && (
                            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-600/40 text-red-300 font-bold border border-red-500/40">
                              PRIMARY
                            </span>
                          )}
                          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3.5 rounded-lg bg-[#121319] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                    <span>Deployment Architecture:</span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-white/5 text-neutral-300 border border-white/10 font-semibold">
                    {fallbackBadge}
                  </span>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-red-400" />
                ENGINEERING ARCHITECTURE
              </h4>
              <ul className="space-y-2">
                {project.architecture?.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-neutral-300 flex items-start gap-2.5 bg-[#121318] p-2.5 rounded border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-red-400" />
                TECHNOLOGY STACK
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-[#181922] border border-white/10 font-mono text-xs text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2.5">
                KEY DELIVERABLE HIGHLIGHTS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {project.highlights?.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded bg-[#111218] border border-white/5 text-xs text-neutral-300 font-sans"
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer info & Honesty disclaimer */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PROJECT HONESTY RULE COMPLIANT // NO FABRICATED METRICS</span>
            </div>

            <div className="flex items-center gap-2.5">
              {primaryLink && (
                <a
                  href={primaryLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>VIEW LIVE PROJECT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution View */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default ProjectModal;
