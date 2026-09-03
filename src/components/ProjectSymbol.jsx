/**
 * SAHIL BHATIA — PORTFOLIO OS
 * REUSABLE PROJECT SYMBOL SYSTEM
 *
 * Distinctive, non-emoji, SVG-based silhouettes for all curated projects:
 * - SAHIL AI OS: Neural / orbital AI system symbol
 * - LYRA V2: Directed execution graph / connected node DAG symbol
 * - NEUTRACAP: Stylized electrical capacitor / industrial energy symbol
 * - DENTAL CARE: Custom geometric tooth / precision medical symbol
 * - LINKBIO: Distinctive interlocking link / identity hub symbol
 * - SHOWTIME CINEMA BOOKING: Cinematic film-frame / aperture symbol
 * - SAHIL AI CONSULTANCY OS: Strategic compass / system architecture symbol
 */

export function ProjectSymbol({ slug, title, id, className = "w-4 h-4", active = false }) {
  const key = `${slug || ''} ${title || ''} ${id || ''}`.toLowerCase();

  // 1. NEUTRACAP: Stylized electrical capacitor / industrial energy symbol
  if (key.includes('neutra') || key.includes('capacitor') || key.includes('01')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        <line x1="2" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="4" x2="8" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="4" x2="16" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* Dielectric field & red core charge */}
        <line x1="12" y1="7" x2="12" y2="17" className="stroke-red-500" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" className="fill-red-500" />
      </svg>
    );
  }

  // 2. LYRA V2: Directed execution graph / connected node DAG symbol
  if (key.includes('lyra') || key.includes('02')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Topological DAG path vectors */}
        <path d="M7 11.5L10 6.5 M7 12.5L10 17.5 M14 6.5L17 11.5 M14 17.5L17 12.5 M10 6.5h4 M10 17.5h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        {/* Source & intermediate nodes */}
        <circle cx="5" cy="12" r="2.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
        <circle cx="12" cy="5.5" r="2.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="18.5" r="2.2" stroke="currentColor" strokeWidth="2" />
        {/* Goal / validation sink node with red accent */}
        <circle cx="19" cy="12" r="2.5" className="stroke-red-500 fill-red-500/20" strokeWidth="2" />
        <circle cx="19" cy="12" r="1" className="fill-red-500" />
      </svg>
    );
  }

  // 3. SAHIL AI OS: Neural / orbital AI system symbol
  if (key.includes('sahil-ai-os') || (key.includes('ai os') && !key.includes('consult')) || key.includes('03')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Orbital ring */}
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3.5 2.5" />
        {/* Axis crosshairs */}
        <path d="M12 2v3 M12 19v3 M2 12h3 M19 12h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        {/* Synaptic nodes */}
        <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        <circle cx="6" cy="18" r="1.5" fill="currentColor" />
        {/* Neural core kernel with brand red resonance */}
        <circle cx="12" cy="12" r="3.2" className="stroke-red-500 fill-red-500/20" strokeWidth="1.75" />
        <circle cx="12" cy="12" r="1.2" className="fill-red-500" />
      </svg>
    );
  }

  // 4. DENTAL CARE: Custom geometric tooth / precision medical symbol
  if (key.includes('dental') || key.includes('04')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Geometric tooth crown and root contours */}
        <path
          d="M6.5 3c-2.4 0-3.8 2-3.8 5 0 4 1.8 8.5 3.5 13 1 2.2 2 2.8 3.3 2.8 1.2 0 1.8-.8 2.5-3.2.7 2.4 1.3 3.2 2.5 3.2 1.3 0 2.3-.6 3.3-2.8 1.7-4.5 3.5-9 3.5-13 0-3-1.4-5-3.8-5-2 0-3.3 1.2-5.5 1.2S8.5 3 6.5 3z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Precision clinical cross element */}
        <path d="M12 7.5v5 M9.5 10h5" className="stroke-red-500" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // 5. LINKBIO: Distinctive interlocking link / identity hub symbol
  if (key.includes('linkbio') || key.includes('link') || key.includes('05')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Upper node */}
        <path
          d="M9.5 14.5L14.5 9.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="3"
          y="7.5"
          width="9"
          height="5.5"
          rx="2.75"
          transform="rotate(-45 7.5 10.25)"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <rect
          x="12"
          y="11"
          width="9"
          height="5.5"
          rx="2.75"
          transform="rotate(-45 16.5 13.75)"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        {/* Nexus identity hub dot */}
        <circle cx="12" cy="12" r="1.75" className="fill-red-500" />
      </svg>
    );
  }

  // 6. SHOWTIME CINEMA BOOKING: Cinematic film-frame / aperture symbol
  if (key.includes('cinema') || key.includes('showtime') || key.includes('06')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Cinematic wide frame */}
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.75" />
        {/* Film sprocket notches */}
        <line x1="2" y1="8" x2="4.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="16" x2="4.5" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19.5" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19.5" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19.5" y1="16" x2="22" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        {/* Lens aperture iris */}
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 10l4 2-4 2z" className="fill-red-500" />
      </svg>
    );
  }

  // 7. SAHIL AI CONSULTANCY OS: Strategic compass / system architecture symbol
  if (key.includes('consult') || key.includes('07')) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
        aria-hidden="true"
      >
        {/* Compass dial */}
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Coordinate axis lines */}
        <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        {/* North pointer (Crimson) */}
        <path d="M12 4L14.5 11.5h-5L12 4z" className="fill-red-500 stroke-red-500" strokeWidth="1" strokeLinejoin="round" />
        {/* South pointer */}
        <path d="M12 20L9.5 12.5h5L12 20z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.8" />
        {/* Center pivot point */}
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }

  // Default Fallback: Neural Core Node
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} transition-transform duration-200 group-hover:scale-110 shrink-0`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 2v4 M12 18v4 M2 12h4 M18 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" className="fill-red-500/20 stroke-red-500" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" className="fill-red-500" />
    </svg>
  );
}

export default ProjectSymbol;

