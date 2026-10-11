import { useState, useEffect, useRef, useMemo } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import ProjectModal from './ProjectModal';
import { ArrowUpRight, ExternalLink, Globe, Code2, Play, ShieldCheck, Compass, Sparkles } from 'lucide-react';
import { getProjectPublicLinks, deriveProjectBadge } from '../lib/projectLinks';
import ProjectSymbol from './ProjectSymbol';
import ProjectMediaPlaceholder from './ProjectMediaPlaceholder';
import { PROJECT_COVER_IMAGES, CURATED_PROJECTS as DEFAULT_PROJECTS } from '../data/portfolioData';

/**
 * Razor-Sharp 3D Tactile Project Card
 * Eliminates GPU texture blur by replacing heavy 3D matrix transforms with
 * pixel-perfect vector rendering, multi-layer specular bevels, and crisp tactile elevation.
 */
function CinematicProjectCard({
  project,
  index,
  total,
  onSelect,
  isDimmed,
  onHoverChange,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const publicLinks = getProjectPublicLinks(project);
  const primaryLink = publicLinks.find((l) => l.isPrimary) || publicLinks[0];
  const secondaryLinks = publicLinks.filter((l) => l !== primaryLink).slice(0, 2);
  const fallbackBadge = deriveProjectBadge(project);

  const domainTag = useMemo(() => {
    if (!project) return 'SYSTEM ARCH';
    const slug = (project.slug || '').toLowerCase();
    const title = (project.title || '').toLowerCase();
    if (slug.includes('neutracap') || title.includes('neutracap')) return 'INDUSTRIAL HW';
    if (slug.includes('lyra') || title.includes('lyra')) return 'AGENTIC GRAPH';
    if (slug.includes('sahil-ai-os') || title.includes('sahil ai os')) return 'NEURAL OS';
    if (slug.includes('dental') || title.includes('dental')) return 'HEALTHCARE UX';
    if (slug.includes('linkbio') || title.includes('linkbio')) return 'CREATOR HUB';
    if (slug.includes('showtime') || title.includes('cinema') || title.includes('showtime')) return 'CINEMA ENGINE';
    if (slug.includes('consultan') || title.includes('consultancy')) return 'CONSULTING OS';

    if (project.category) {
      const cat = project.category.toUpperCase();
      if (cat.includes('AI')) return 'AI ARCHITECTURE';
      if (cat.includes('HARDWARE')) return 'HARDWARE SPEC';
      if (cat.includes('DIGITAL')) return 'DIGITAL PRODUCT';
      if (cat.includes('ENTERPRISE')) return 'ENTERPRISE SYS';
    }
    return 'PRODUCTION ARCH';
  }, [project]);

  const titleKey = (project.title || '').trim().toUpperCase();
  const coverImg = (PROJECT_COVER_IMAGES && PROJECT_COVER_IMAGES[titleKey]) || project.coverImageUrl || project.heroImage;

  return (
    <div
      className={`h-full transition-all duration-300 ${isDimmed ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'}`}
    >
      <div
        onClick={() => onSelect(project)}
        onMouseEnter={() => {
          setIsHovered(true);
          onHoverChange(project.id);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHoverChange(null);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(project);
          }
        }}
        className={`group relative rounded-3xl bg-gradient-to-b from-[#111426] via-[#0b0d1a] to-[#070812] border-2 p-6 sm:p-7 flex flex-col justify-between cursor-pointer select-none overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.35)] active:translate-y-0.5 active:scale-[0.99] ${
          isHovered
            ? 'border-red-500 ring-2 ring-red-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,42,58,0.35)]'
            : 'border-white/15 hover:border-red-500/70 shadow-[0_12px_32px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* TOP HAIRLINE SPECULAR EDGE */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-red-500 transition-colors pointer-events-none" />

        {/* MACHINED CORNER PRECISION BRACKETS */}
        <span className="absolute top-2.5 left-2.5 w-2 h-2 border-t-2 border-l-2 border-white/20 group-hover:border-red-500 transition-colors pointer-events-none" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 border-t-2 border-r-2 border-white/20 group-hover:border-red-500 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b-2 border-l-2 border-white/20 group-hover:border-red-500 transition-colors pointer-events-none" />
        <span className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b-2 border-r-2 border-white/20 group-hover:border-red-500 transition-colors pointer-events-none" />

        {/* CARD HEADER: Index, Reel Tag, and Blinking Status */}
        <div className="relative z-10 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-white group-hover:text-red-400 transition-colors tracking-wider px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 group-hover:border-red-500/50 group-hover:shadow-[0_0_12px_rgba(255,42,58,0.4)]">
                [{project.id || `0${index + 1}`}]
              </span>
              <span className="text-[11px] font-mono text-neutral-400 font-semibold">/ 0{total}</span>
            </div>

            <div className="flex items-center gap-2">
              {Boolean((project.videoUrl || '').trim()) && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-red-600/25 text-red-200 border border-red-500/60 font-bold shadow-[0_0_12px_rgba(255,42,58,0.4)]">
                  <Play className="w-2 h-2 fill-red-400 text-red-400" />
                  <span>VIDEO REEL</span>
                </span>
              )}
              {/* Blinking Live Status Beacon */}
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase px-3 py-1 rounded-full font-black border shadow-md ${
                  project.status === 'BUILT'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                    : project.status === 'IN PROGRESS'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-red-500/20 text-red-300 border-red-500/50'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </span>
                {project.status === 'BUILT' ? 'VERIFIED BUILT' : project.status}
              </span>
            </div>
          </div>
        </div>

        {/* MEDIA SHOWCASE WINDOW (Crisp High-Contrast Canvas) */}
        <div className="relative z-10 mb-4">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-red-500/60 bg-[#080912] shadow-inner transition-colors">
            {coverImg ? (
              <div className="absolute inset-0 overflow-hidden group/media">
                <img
                  src={coverImg}
                  alt={`${project.title} cover`}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070e] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity pointer-events-none" />
              </div>
            ) : (
              <div className="absolute inset-0">
                <ProjectMediaPlaceholder project={project} />
              </div>
            )}

            {/* Top Floating Glass Badges */}
            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
              {/* Domain Tag */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 shadow-md font-mono text-[9px] sm:text-[10px] tracking-wider text-white uppercase font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse shrink-0" />
                <span className="truncate max-w-[130px]">{domainTag}</span>
              </div>

              {/* Verified Production Tag */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 shadow-md font-mono text-[9px] sm:text-[10px] tracking-wider text-white uppercase font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>PROD &bull; &apos;{((project.year || '2025').slice(-2))}</span>
              </div>
            </div>

            {/* Bottom Floating Glass Badges */}
            <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 shadow-md font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-200 uppercase font-bold">
                <Code2 className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate max-w-[120px]">{project.techStack[0] || 'REACT 19'}</span>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/90 border border-white/25 shadow-md font-mono text-[9px] sm:text-[10px] tracking-wider text-neutral-200 uppercase font-bold">
                <Compass className="w-3 h-3 text-red-400 shrink-0" />
                <span>SYSTEM SPEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT BODY: Insignia, Title, Subtitle & Summary */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#222538] to-[#0e0f18] border-2 border-white/20 group-hover:border-red-500/80 group-hover:shadow-[0_0_18px_rgba(255,42,58,0.5)] flex items-center justify-center text-neutral-100 group-hover:text-red-400 transition-all shrink-0 shadow-md">
              <ProjectSymbol slug={project.slug} title={project.title} id={project.id} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight uppercase truncate">
                {project.title}
              </h3>
            </div>
          </div>

          <p className="text-xs font-mono text-red-400 mb-2 tracking-wider flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>{project.subtitle}</span>
          </p>

          <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed line-clamp-3 font-normal">
            {project.summary}
          </p>
        </div>

        {/* FOOTER: Tech Stack Chips & Action Controls */}
        <div className="relative z-10 mt-auto">
          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/10 text-neutral-200 border border-white/20 group-hover:border-white/30 transition-colors shadow-sm"
              >
                {t}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-white/5 text-neutral-400 border border-white/10">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>

          {/* Action Links & Inspection Trigger */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
            {primaryLink ? (
              <div className="flex items-center flex-wrap gap-2">
                <a
                  href={primaryLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(255,42,58,0.5)] active:scale-95 cursor-pointer touch-manipulation"
                  title={primaryLink.label}
                >
                  {primaryLink.type === 'GITHUB' ? (
                    <Code2 className="w-3.5 h-3.5" />
                  ) : (
                    <Globe className="w-3.5 h-3.5" />
                  )}
                  <span>VIEW LIVE PROJECT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                {secondaryLinks.map((sec) => (
                  <a
                    key={sec.id || sec.url}
                    href={sec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-white/20 hover:border-white/40 font-mono text-xs font-bold transition-all cursor-pointer touch-manipulation"
                    title={sec.label}
                  >
                    {sec.type === 'GITHUB' ? (
                      <Code2 className="w-3.5 h-3.5" />
                    ) : (
                      <ExternalLink className="w-3.5 h-3.5" />
                    )}
                    <span className="truncate max-w-[90px]">{sec.actionLabel || sec.label}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-500" />
                <span className="text-xs font-mono tracking-wider uppercase text-neutral-300 font-bold px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">
                  {fallbackBadge}
                </span>
              </div>
            )}

            {/* Quick Specs Trigger */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 group-hover:text-white transition-colors ml-auto cursor-pointer touch-manipulation font-bold">
              <span className="text-[11px] uppercase tracking-wider">Specs</span>
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 group-hover:bg-red-600 group-hover:border-red-400 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(255,42,58,0.6)] flex items-center justify-center transition-all shadow-inner">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIVE LASER ACCENT LINE (Glows on Hover) */}
        <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_18px_#ff2a3a] pointer-events-none" />
      </div>
    </div>
  );
}

const Projects = () => {
  const { projects } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [_hoveredCardId, setHoveredCardId] = useState(null);
  const sectionRef = useRef(null);

  // Dynamic light tracking for environmental volumetric lighting
  const [lightPos, setLightPos] = useState({ x: 50, y: 30 });

  const handleSectionMouseMove = (e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setLightPos({ x, y });
  };

  // Listen for open-project-detail events from GlobalSearch and AIAssistant
  useEffect(() => {
    const handleOpenDetail = (e) => {
      const target = e.detail;
      if (!target) return;
      const cleanTargetTitle = (target.title || '').replace(/^open\s+/i, '').replace(/\s+specs$/i, '').trim().toLowerCase();
      const found =
        projects.find(
          (p) =>
            (target.id && (p.id === target.id || p.id === `0${target.id}`)) ||
            (target.slug && p.slug?.toLowerCase() === target.slug?.toLowerCase()) ||
            (cleanTargetTitle && (
              p.title.toLowerCase() === cleanTargetTitle ||
              p.title.toLowerCase().includes(cleanTargetTitle) ||
              cleanTargetTitle.includes(p.title.toLowerCase())
            ))
        ) ||
        DEFAULT_PROJECTS.find(
          (p) =>
            (target.id && (p.id === target.id || p.id === `0${target.id}`)) ||
            (target.slug && p.slug?.toLowerCase() === target.slug?.toLowerCase()) ||
            (cleanTargetTitle && (
              p.title.toLowerCase() === cleanTargetTitle ||
              p.title.toLowerCase().includes(cleanTargetTitle) ||
              cleanTargetTitle.includes(p.title.toLowerCase())
            ))
        );
      if (found) {
        setSelectedProject(found);
      } else if (target.title) {
        setSelectedProject(target);
      }
    };

    window.addEventListener('open-project-detail', handleOpenDetail);
    return () => window.removeEventListener('open-project-detail', handleOpenDetail);
  }, [projects]);

  const categories = ['ALL', 'AI & SYSTEMS', 'DIGITAL PRODUCTS', 'ENTERPRISE'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filter === 'ALL') return true;
      const cat = (p.category || '').toUpperCase();
      if (filter === 'AI & SYSTEMS') {
        return cat.includes('AI') || cat.includes('OPERATING') || cat.includes('SYSTEM');
      }
      if (filter === 'DIGITAL PRODUCTS') {
        return cat.includes('DIGITAL') || cat.includes('CREATOR') || cat.includes('ENTERTAINMENT') || cat.includes('HEALTHCARE') || cat.includes('WEB');
      }
      if (filter === 'ENTERPRISE') {
        return cat.includes('ENTERPRISE') || cat.includes('HARDWARE') || cat.includes('INDUSTRIAL');
      }
      return true;
    });
  }, [projects, filter]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      className="py-24 sm:py-32 bg-transparent border-b border-white/10 relative overflow-hidden select-none"
    >
      {/* 1. RICH CYBERNETIC BACKGROUND RIG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Layered Subtle Transparent Wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080914]/40 to-transparent" />

        {/* Luminous Neon Cyber-Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 42, 58, 0.14) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 42, 58, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 85%)',
          }}
        />

        {/* Dynamic Cursor-Tracking Ambient Spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(900px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 42, 58, 0.12), rgba(99, 102, 241, 0.04) 40%, transparent 75%)`,
          }}
        />

        {/* Atmospheric Backlights */}
        <div className="absolute -top-32 right-10 w-[800px] h-[550px] bg-red-600/[0.09] rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[700px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* ========================================================= */}
        {/* SECTION HEADER: High-Impact Editorial & Filters (Selector 1)*/}
        {/* ========================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 via-rose-500/15 to-red-500/10 border border-red-500/40 shadow-[0_0_20px_rgba(255,42,58,0.25)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_10px_#ff2a3a]" />
              </span>
              <span className="text-red-400 font-black">CURATED PRODUCTION REPERTOIRE</span>
              <span className="text-neutral-500">&bull;</span>
              <span className="text-white font-bold">7 VERIFIED BUILDS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              Curated Projects
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 font-sans mt-3.5 max-w-2xl leading-relaxed font-normal">
              Strictly verified engineering builds and production systems. Single consolidated LinkBio representation; zero cloned or fabricated entries.
            </p>
          </div>

          {/* 3D Interactive Segmented Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0a0c18] p-2.5 rounded-2xl border-2 border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.8)]">
            {categories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 select-none cursor-pointer active:scale-95 flex items-center gap-2 font-bold ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-400/50 shadow-[0_0_20px_rgba(255,42,58,0.5)] -translate-y-0.5'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent'
                  }`}
                >
                  <span>{cat}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3D INTERACTIVE GLOWING BLINKING TABS STRIP (Selector 2)   */}
        {/* ========================================================= */}
        <div className="mb-12 p-3.5 rounded-3xl bg-gradient-to-b from-[#101326] via-[#090b16] to-[#05060d] border-2 border-red-500/35 hover:border-red-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,42,58,0.12)] relative overflow-x-auto scrollbar-thin transition-colors group/dock">
          {/* Luminous Top Perimeter Accent */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ff2a3a]" />

          {/* Tactical Corner Brackets */}
          <span className="absolute top-2 left-2 text-red-500/40 font-mono text-[10px] select-none pointer-events-none">┌</span>
          <span className="absolute top-2 right-2 text-red-500/40 font-mono text-[10px] select-none pointer-events-none">┐</span>
          <span className="absolute bottom-2 left-2 text-red-500/40 font-mono text-[10px] select-none pointer-events-none">└</span>
          <span className="absolute bottom-2 right-2 text-red-500/40 font-mono text-[10px] select-none pointer-events-none">┘</span>

          <div className="flex items-center gap-2.5 min-w-max px-1">
            {projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProject(proj)}
                  className={`group/tab relative flex items-center gap-3 px-4.5 py-3 rounded-2xl font-mono text-xs transition-all duration-200 cursor-pointer select-none border-2 hover:-translate-y-1 active:scale-95 shadow-md ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#281119] via-[#1a0c14] to-[#10080e] border-red-500 text-white shadow-[0_0_28px_rgba(255,42,58,0.5),inset_0_1px_1px_rgba(255,255,255,0.35)] ring-2 ring-red-500/40'
                      : 'bg-[#06070e] hover:bg-[#12162a] border-white/15 hover:border-red-500/60 text-neutral-200 hover:text-white'
                  }`}
                >
                  {/* Blinking Radar Beacon on EVERY Tab */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
                  </span>

                  {/* 3D Glowing Symbol Box */}
                  <span className="w-7 h-7 rounded-xl bg-black/80 border border-white/20 flex items-center justify-center text-neutral-200 group-hover/tab:text-red-400 group-hover/tab:border-red-500/50 shadow-inner transition-colors">
                    <ProjectSymbol slug={proj.slug} title={proj.title} id={proj.id} className="w-4 h-4" />
                  </span>

                  <span className="font-bold tracking-wider uppercase text-xs text-white">
                    {proj.title}
                  </span>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black ${
                    isSelected
                      ? 'bg-red-500 text-white shadow-[0_0_10px_#ff2a3a]'
                      : 'bg-white/10 text-neutral-300'
                  }`}>
                    [{proj.id}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* CINEMATIC 3D PROJECT CARDS GRID (Selector 6)              */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {filteredProjects.map((project, idx) => (
            <CinematicProjectCard
              key={project.id || project.slug}
              project={project}
              index={idx}
              total={filteredProjects.length}
              onSelect={setSelectedProject}
              isDimmed={Boolean(selectedProject && selectedProject.id !== project.id)}
              onHoverChange={setHoveredCardId}
            />
          ))}
        </div>
      </div>

      {/* DETAILED PROJECT MODAL INSPECTOR */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={Boolean(selectedProject)}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
