import ProjectSymbol from './ProjectSymbol';
import { PROJECT_COVER_IMAGES } from '../data/portfolioData';

/**
 * Dedicated Technical Media Placeholder Component
 * 
 * Used when a project does not have real media attached.
 * Adheres strictly to Section 7 & Section 12:
 * - Never shows random stock imagery
 * - Renders an intentional architectural technical blueprint
 * - Features project symbol, index, title, and architectural crosshair coordinates
 * - Fully styled for Dark Mode and Light Mode
 */
const ProjectMediaPlaceholder = ({ project, className = '', aspect = 'video' }) => {
  const aspectClass = aspect === 'video' ? 'aspect-[16/9]' : 'aspect-video';
  const titleKey = (project?.title || '').trim().toUpperCase();
  const coverUrl = (PROJECT_COVER_IMAGES && PROJECT_COVER_IMAGES[titleKey]) || project?.coverImageUrl || project?.heroImage;

  if (coverUrl) {
    return (
      <div className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-white/10 bg-[#12131b] ${className}`}>
        <img
          src={coverUrl}
          alt={`${project?.title || 'Project'} cover`}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-lg overflow-hidden border border-white/10 dark:border-white/10 bg-[#0c0e15] flex flex-col items-center justify-center p-4 select-none group/placeholder transition-all duration-300 ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Corner Technical Crosshairs */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-red-500/50" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-red-500/50" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-red-500/50" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-red-500/50" />

      {/* Subtle Central Accent Radial Glow */}
      <div className="absolute inset-0 bg-radial from-red-600/5 via-transparent to-transparent pointer-events-none" />

      {/* Center Spec Badge with SVG Symbol */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-2.5 max-w-[280px]">
        <div className="w-12 h-12 rounded-xl bg-[#141622] border border-white/15 ring-1 ring-white/5 flex items-center justify-center text-red-400 shadow-lg group-hover/placeholder:scale-105 group-hover/placeholder:border-red-500/40 transition-all duration-300">
          <ProjectSymbol slug={project.slug} title={project.title} id={project.id} className="w-6 h-6" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-neutral-400 tracking-wider uppercase">
            <span className="w-1 h-1 rounded-full bg-red-500" />
            <span>PROJECT MEDIA SPEC</span>
            <span className="text-neutral-500">[{project.id}]</span>
          </div>

          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
            {project.title}
          </h4>

          <div className="pt-1">
            <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-neutral-300 uppercase tracking-widest">
              MEDIA WILL BE ADDED
            </span>
          </div>
        </div>
      </div>

      {/* Technical Blueprint Footer Ribbon */}
      <div className="absolute bottom-2 inset-x-3 flex items-center justify-between font-mono text-[8px] text-neutral-500 uppercase tracking-wider pointer-events-none">
        <span>ARCHITECTURAL SCHEMATIC</span>
        <span>STATUS: {project.status || 'VERIFIED'}</span>
      </div>
    </div>
  );
};

export default ProjectMediaPlaceholder;
