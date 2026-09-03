import { useState, useEffect } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import ProjectModal from './ProjectModal';
import SpatialCard from './SpatialCard';
import { ArrowUpRight, ExternalLink, Globe, Code2, Play } from 'lucide-react';
import { getProjectPublicLinks, deriveProjectBadge } from '../lib/projectLinks';
import ProjectSymbol from './ProjectSymbol';
import ProjectMediaPlaceholder from './ProjectMediaPlaceholder';

const Projects = () => {
  const { projects } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // Listen for open-project-detail events from GlobalSearch and AIAssistant
  useEffect(() => {
    const handleOpenDetail = (e) => {
      const target = e.detail;
      if (!target) return;
      const found = projects.find(
        (p) =>
          (target.id && (p.id === target.id || p.id === `0${target.id}`)) ||
          (target.slug && p.slug === target.slug) ||
          (target.title && p.title.toLowerCase() === target.title.toLowerCase())
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

  const filteredProjects = projects.filter((p) => {
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

  return (
    <section id="projects" className="py-24 bg-[#070708] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              CURATED PRODUCTION REPERTOIRE
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              Curated Projects
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-2 max-w-xl">
              Strictly verified builds and architectural systems. Single consolidated LinkBio representation; zero cloned or fabricated entries.
            </p>
          </div>

          {/* Filter Pills with Tactile Dimensionality */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0e0f14] p-1.5 rounded-lg border border-white/10 ring-1 ring-white/5 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all select-none ${
                  filter === cat
                    ? 'bg-[#181922] text-white font-semibold border border-red-500/40 shadow-[0_0_12px_rgba(255,42,58,0.25)] ring-1 ring-red-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Project Navigation Tabs Strip: [PROJECT SYMBOL] PROJECT NAME */}
        <div className="mb-10 pb-2 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max">
            {projects.map((proj) => {
              const isSelected = selectedProject?.id === proj.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProject(proj)}
                  className={`group/tab relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs transition-all duration-200 cursor-pointer select-none border ${
                    isSelected
                      ? 'bg-[#15161f] border-red-500/50 text-white shadow-[0_0_15px_rgba(255,42,58,0.2)] ring-1 ring-red-500/30'
                      : 'bg-[#0b0c10] border-white/10 text-neutral-400 hover:text-white hover:bg-[#121319] hover:border-white/20'
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-black/40 border border-white/10 flex items-center justify-center text-neutral-400 group-hover/tab:text-red-400 transition-colors">
                    <ProjectSymbol slug={proj.slug} title={proj.title} id={proj.id} className="w-3 h-3" />
                  </span>
                  <span className="font-semibold tracking-wider uppercase text-[11px]">{proj.title}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">[{proj.id}]</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const publicLinks = getProjectPublicLinks(project);
            const primaryLink = publicLinks.find((l) => l.isPrimary) || publicLinks[0];
            const secondaryLinks = publicLinks.filter((l) => l !== primaryLink).slice(0, 2);
            const fallbackBadge = deriveProjectBadge(project);

            return (
              <SpatialCard
                key={project.id}
                intensity="medium"
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer rounded-xl bg-[#0c0d12] hover:bg-[#111219] border border-white/10 hover:border-red-500/40 ring-1 ring-white/5 hover:ring-red-500/20 p-6 flex flex-col justify-between shadow-xl hover:shadow-[0_12px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,42,58,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent group-hover:before:via-red-500/40"
              >
                {/* Top Row: Index and Status */}
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                    <span className="font-mono text-xs font-bold text-neutral-500 group-hover:text-red-400 transition-colors">
                      {project.id} // 07
                    </span>
                    <div className="flex items-center gap-2">
                      {Boolean((project.videoUrl || '').trim()) && (
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 font-semibold">
                          <Play className="w-2 h-2 fill-red-400 text-red-400" />
                          <span>VIDEO</span>
                        </span>
                      )}
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-semibold border ${
                          project.status === 'BUILT'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : project.status === 'IN PROGRESS'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                            : 'bg-red-500/10 text-red-400 border-red-500/25'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Cover Visual Preview if Present OR Architectural Blueprint Placeholder */}
                  {(project.coverImageUrl || project.heroImage) ? (
                    <div className="relative w-full aspect-[16/9] mb-4 rounded-lg overflow-hidden border border-white/10 bg-[#12131b]">
                      <img
                        src={project.coverImageUrl || project.heroImage}
                        alt={project.mediaAltText || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      {Boolean((project.videoUrl || '').trim()) && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono text-white shadow-sm">
                          <Play className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                          <span>PLAY VIDEO</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <ProjectMediaPlaceholder project={project} />
                    </div>
                  )}

                  {/* Title & Subtitle with [PROJECT SYMBOL] PROJECT NAME */}
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-md bg-[#161720] border border-white/15 ring-1 ring-white/5 flex items-center justify-center text-neutral-400 group-hover:text-red-400 group-hover:border-red-500/50 group-hover:bg-red-950/20 transition-all shadow-inner shrink-0">
                      <ProjectSymbol slug={project.slug} title={project.title} id={project.id} className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-white tracking-tight uppercase">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-red-400 mb-3">
                    {project.subtitle}
                  </p>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed line-clamp-3 mb-5">
                    {project.summary}
                  </p>
                </div>

                {/* Bottom Row: Tech Stack & Action Links */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Dynamic External Link Actions & Badge */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    {primaryLink ? (
                      <div className="flex items-center flex-wrap gap-1.5">
                        {/* Dominant Primary Action CTA */}
                        <a
                          href={primaryLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ff2a3a] hover:bg-red-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,42,58,0.25)] select-none"
                          title={primaryLink.label}
                        >
                          {primaryLink.type === 'GITHUB' ? (
                            <Code2 className="w-3.5 h-3.5" />
                          ) : (
                            <Globe className="w-3.5 h-3.5" />
                          )}
                          <span>VIEW LIVE PROJECT</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>

                        {/* Secondary Links */}
                        {secondaryLinks.map((sec) => (
                          <a
                            key={sec.id || sec.url}
                            href={sec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 font-mono text-[11px] transition-colors"
                            title={sec.label}
                          >
                            {sec.type === 'GITHUB' ? (
                              <Code2 className="w-3 h-3" />
                            ) : (
                              <ExternalLink className="w-3 h-3" />
                            )}
                            <span className="truncate max-w-[85px]">{sec.actionLabel || sec.label}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      /* Clean Status Badge when no external links exist */
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                        <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          {fallbackBadge}
                        </span>
                      </div>
                    )}

                    {/* Trigger for detail inspection */}
                    <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors ml-auto">
                      <span className="text-[11px] uppercase tracking-wider">Specs</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle Precision Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </SpatialCard>
            );
          })}
        </div>

        {/* Honesty Rule Callout Banner */}
        <div className="mt-12 p-4 rounded-lg bg-[#0e0f15] border border-white/10 flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-neutral-300 font-semibold uppercase">Project Honesty Rule Applied:</span>
            <span>No exaggerated ARR metrics, no phantom client logos. Verified technical builds only.</span>
          </div>
          <span className="text-neutral-500">CURATED 7-PROJECT REGISTRY</span>
        </div>
      </div>

      {/* Interactive Project Inspection Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;
