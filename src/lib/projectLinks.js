/**
 * Project External Link System
 * Validates, normalizes, and extracts external links for projects.
 * Enforces:
 * - Real HTTP/HTTPS URLs only
 * - No empty links rendered publicly
 * - Exact URLs preserved without silent rewriting
 */

export function isValidHttpUrl(string) {
  if (!string || typeof string !== 'string') return false;
  const trimmed = string.trim();
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const LINK_TYPES = [
  { type: 'LIVE_WEBSITE', defaultLabel: 'Visit Website', actionLabel: 'VIEW LIVE PROJECT', priority: 1 },
  { type: 'DEMO', defaultLabel: 'Launch Demo', actionLabel: 'VIEW LIVE PROJECT', priority: 2 },
  { type: 'GITHUB', defaultLabel: 'Source Code', actionLabel: 'GITHUB', priority: 3 },
  { type: 'CASE_STUDY', defaultLabel: 'Read Case Study', actionLabel: 'CASE STUDY', priority: 4 },
  { type: 'DOCUMENTATION', defaultLabel: 'Documentation', actionLabel: 'DOCS', priority: 5 },
  { type: 'APP_STORE', defaultLabel: 'App Store / Mobile', actionLabel: 'APP STORE', priority: 6 },
  { type: 'OTHER', defaultLabel: 'External Link', actionLabel: 'EXTERNAL LINK', priority: 7 },
];

/**
 * Derives a clean status badge when no external public links are configured.
 */
export function deriveProjectBadge(project) {
  if (!project) return 'PROPRIETARY BUILD';
  const cat = (project.category || '').toUpperCase();
  if (cat.includes('ENTERPRISE') || cat.includes('INDUSTRIAL') || cat.includes('HARDWARE')) {
    return 'ENTERPRISE DEPLOYMENT';
  }
  if (cat.includes('AI') || cat.includes('SYSTEM') || cat.includes('OPERATING')) {
    return 'INTERNAL SYSTEM';
  }
  return 'PROPRIETARY BUILD';
}

/**
 * Extracts and consolidates all valid public external links for a project.
 * Guaranteed to only return items with valid HTTP/HTTPS URLs and visibility !== 'HIDDEN'.
 */
export function getProjectPublicLinks(project) {
  if (!project) return [];

  const candidateLinks = [];
  const registeredUrls = new Set();

  // 1. Structured links array from CMS
  if (Array.isArray(project.links)) {
    project.links.forEach((link, idx) => {
      if (!link) return;
      const url = typeof link.url === 'string' ? link.url.trim() : '';
      if (isValidHttpUrl(url) && link.visibility !== 'HIDDEN') {
        const typeInfo = LINK_TYPES.find((t) => t.type === link.type) || {
          actionLabel: link.label?.toUpperCase() || 'LINK',
          defaultLabel: link.label || 'Link',
          priority: 8,
        };
        candidateLinks.push({
          id: link.id || `link-${idx}`,
          label: link.label || typeInfo.defaultLabel,
          actionLabel: typeInfo.actionLabel || link.label?.toUpperCase() || 'LINK',
          url,
          type: link.type || 'OTHER',
          sortOrder: typeof link.sortOrder === 'number' ? link.sortOrder : idx + 1,
          visibility: 'PUBLIC',
          isPrimary: Boolean(link.isPrimary),
        });
        registeredUrls.add(url);
      }
    });
  }

  // 2. Direct named fields if not already registered in links array
  const directFields = [
    { key: 'liveWebsiteUrl', type: 'LIVE_WEBSITE', label: 'Visit Website', actionLabel: 'LIVE WEBSITE', defaultSort: 1 },
    { key: 'demoUrl', type: 'DEMO', label: 'Launch Demo', actionLabel: 'LAUNCH DEMO', defaultSort: 2 },
    { key: 'githubUrl', type: 'GITHUB', label: 'Source Code', actionLabel: 'GITHUB', defaultSort: 3 },
    { key: 'caseStudyUrl', type: 'CASE_STUDY', label: 'Read Case Study', actionLabel: 'CASE STUDY', defaultSort: 4 },
    { key: 'documentationUrl', type: 'DOCUMENTATION', label: 'Documentation', actionLabel: 'DOCS', defaultSort: 5 },
    { key: 'appStoreUrl', type: 'APP_STORE', label: 'App Store', actionLabel: 'APP STORE', defaultSort: 6 },
  ];

  directFields.forEach((field) => {
    const rawVal = project[field.key];
    if (typeof rawVal === 'string' && isValidHttpUrl(rawVal)) {
      const trimmed = rawVal.trim();
      if (!registeredUrls.has(trimmed)) {
        candidateLinks.push({
          id: field.key,
          label: field.label,
          actionLabel: field.actionLabel,
          url: trimmed,
          type: field.type,
          sortOrder: field.defaultSort,
          visibility: 'PUBLIC',
          isPrimary: field.type === 'LIVE_WEBSITE' && !candidateLinks.some((l) => l.isPrimary),
        });
        registeredUrls.add(trimmed);
      }
    }
  });

  // Sort links by sortOrder ascending
  candidateLinks.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));

  // Ensure at least one primary link if any exists, but prefer user-specified
  const hasUserPrimary = candidateLinks.some((l) => l.isPrimary);
  if (!hasUserPrimary && candidateLinks.length > 0) {
    candidateLinks[0].isPrimary = true;
  }

  return candidateLinks;
}

/**
 * Returns specific actions for public project card buttons
 */
export function getProjectCardActions(project) {
  const publicLinks = getProjectPublicLinks(project);
  const actions = [];

  // 1. VIEW PROJECT is always available (opens modal / detail)
  actions.push({
    type: 'VIEW_PROJECT',
    label: 'VIEW PROJECT',
    isExternal: false,
  });

  // 2. Add external link actions for available valid URLs
  publicLinks.forEach((link) => {
    // Avoid duplicate action labels
    if (!actions.some((a) => a.label === link.actionLabel)) {
      actions.push({
        type: link.type,
        label: link.actionLabel,
        url: link.url,
        isExternal: true,
        isPrimary: link.isPrimary,
      });
    }
  });

  return actions;
}
