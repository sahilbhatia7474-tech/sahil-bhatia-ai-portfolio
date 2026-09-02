import { useState } from 'react';
import { saveItem } from '../../lib/dbService';
import { 
  X, Save, Eye, CheckCircle2, AlertCircle, RefreshCw, Star, 
  Link as LinkIcon, ExternalLink, Plus, Trash2, EyeOff, Globe 
} from 'lucide-react';
import { isValidHttpUrl } from '../../lib/projectLinks';

const DEFAULT_TYPE_LABELS = {
  LIVE_WEBSITE: 'Visit Website',
  DEMO: 'Launch Demo',
  GITHUB: 'Source Code',
  CASE_STUDY: 'Read Case Study',
  DOCUMENTATION: 'Documentation',
  APP_STORE: 'App Store / Mobile',
  OTHER: 'External Link',
};

const VaultProjectEditor = ({ project, isNew, onClose, onSaved }) => {
  // Initialize links with full support for legacy and new link schemas
  const [links, setLinks] = useState(() => {
    if (Array.isArray(project?.links) && project.links.length > 0) {
      return project.links.map((l, i) => ({
        id: l.id || `lnk-${Date.now()}-${i}`,
        type: l.type || 'LIVE_WEBSITE',
        label: l.label || DEFAULT_TYPE_LABELS[l.type] || 'Link',
        url: l.url || '',
        visibility: l.visibility || 'PUBLIC',
        isPrimary: Boolean(l.isPrimary),
        sortOrder: l.sortOrder ?? i + 1,
      }));
    }
    const defaults = [];
    if (project?.liveWebsiteUrl) {
      defaults.push({
        id: 'lnk-live',
        type: 'LIVE_WEBSITE',
        label: 'Visit Website',
        url: project.liveWebsiteUrl,
        visibility: 'PUBLIC',
        isPrimary: true,
        sortOrder: 1,
      });
    }
    if (project?.demoUrl) {
      defaults.push({
        id: 'lnk-demo',
        type: 'DEMO',
        label: 'Launch Demo',
        url: project.demoUrl,
        visibility: 'PUBLIC',
        isPrimary: defaults.length === 0,
        sortOrder: 2,
      });
    }
    if (project?.githubUrl) {
      defaults.push({
        id: 'lnk-github',
        type: 'GITHUB',
        label: 'Source Code',
        url: project.githubUrl,
        visibility: 'PUBLIC',
        isPrimary: defaults.length === 0,
        sortOrder: 3,
      });
    }
    if (project?.caseStudyUrl) {
      defaults.push({
        id: 'lnk-case',
        type: 'CASE_STUDY',
        label: 'Read Case Study',
        url: project.caseStudyUrl,
        visibility: 'PUBLIC',
        isPrimary: false,
        sortOrder: 4,
      });
    }
    if (project?.documentationUrl) {
      defaults.push({
        id: 'lnk-docs',
        type: 'DOCUMENTATION',
        label: 'Documentation',
        url: project.documentationUrl,
        visibility: 'PUBLIC',
        isPrimary: false,
        sortOrder: 5,
      });
    }
    return defaults;
  });

  const [formData, setFormData] = useState({
    title: project?.title || '',
    subtitle: project?.subtitle || '',
    slug: project?.slug || '',
    category: project?.category || 'AI Systems & Engineering',
    year: project?.year || new Date().getFullYear().toString(),
    role: project?.role || 'Lead Architect & Builder',
    shortDescription: project?.shortDescription || project?.summary || '',
    longDescription: project?.longDescription || project?.description || '',
    technologies: project?.technologies || project?.techStack || ['React', 'TypeScript', 'Tailwind CSS'],
    heroImage: project?.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    status: project?.status || 'DRAFT',
    visibility: project?.visibility || 'PUBLIC',
    featured: project?.featured ?? false,
    sortOrder: project?.sortOrder ?? 1,
  });

  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleAddTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (tech) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  // Link Management Handlers
  const handleAddLink = () => {
    const newId = `lnk-${Date.now()}`;
    const newLink = {
      id: newId,
      type: 'LIVE_WEBSITE',
      label: DEFAULT_TYPE_LABELS.LIVE_WEBSITE,
      url: '',
      visibility: 'PUBLIC',
      isPrimary: links.length === 0,
      sortOrder: links.length + 1,
    };
    setLinks([...links, newLink]);
  };

  const handleUpdateLink = (id, field, value) => {
    setLinks((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          if (field === 'isPrimary' && value === true) {
            return { ...item, isPrimary: false };
          }
          return item;
        }

        const updated = { ...item, [field]: value };
        // If type changed and user hasn't typed a custom label, update default label
        if (field === 'type' && (!item.label || item.label === DEFAULT_TYPE_LABELS[item.type])) {
          updated.label = DEFAULT_TYPE_LABELS[value] || 'Link';
        }
        return updated;
      })
    );
  };

  const handleRemoveLink = (id) => {
    setLinks((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      if (filtered.length > 0 && !filtered.some((l) => l.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSave = async (targetStatus) => {
    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }

    // Comprehensive URL Validation for Links
    for (const link of links) {
      const trimmedUrl = (link.url || '').trim();
      if (trimmedUrl) {
        if (!isValidHttpUrl(trimmedUrl)) {
          setError(`Invalid external URL: "${trimmedUrl}" for "${link.label}". Must start with http:// or https:// and be a valid web address.`);
          return;
        }
      }
    }

    setSaving(true);
    setError(null);

    // Filter out completely empty URLs
    const sanitizedLinks = links
      .filter((l) => (l.url || '').trim())
      .map((l, index) => ({
        ...l,
        url: l.url.trim(),
        label: l.label.trim() || DEFAULT_TYPE_LABELS[l.type] || 'Link',
        sortOrder: index + 1,
      }));

    // Extract direct URLs for legacy consumers
    const liveWebsiteLink = sanitizedLinks.find((l) => l.type === 'LIVE_WEBSITE' && l.visibility !== 'HIDDEN');
    const demoLink = sanitizedLinks.find((l) => l.type === 'DEMO' && l.visibility !== 'HIDDEN');
    const githubLink = sanitizedLinks.find((l) => l.type === 'GITHUB' && l.visibility !== 'HIDDEN');
    const caseStudyLink = sanitizedLinks.find((l) => l.type === 'CASE_STUDY' && l.visibility !== 'HIDDEN');
    const docsLink = sanitizedLinks.find((l) => l.type === 'DOCUMENTATION' && l.visibility !== 'HIDDEN');

    const docId = isNew ? (formData.slug.trim() || `proj-${Date.now().toString().slice(-4)}`) : project.id;
    const finalPayload = {
      ...formData,
      links: sanitizedLinks,
      liveWebsiteUrl: liveWebsiteLink ? liveWebsiteLink.url : '',
      demoUrl: demoLink ? demoLink.url : '',
      githubUrl: githubLink ? githubLink.url : '',
      caseStudyUrl: caseStudyLink ? caseStudyLink.url : '',
      documentationUrl: docsLink ? docsLink.url : '',
      status: targetStatus,
      visibility: targetStatus === 'PUBLISHED' ? 'PUBLIC' : formData.visibility,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('projects', docId, finalPayload, isNew);
    if (res.success) {
      if (onSaved) onSaved();
    } else {
      setError(res.error || 'Failed to save project.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
              {isNew ? 'CREATING NEW PROJECT' : `EDITING // ${project?.title}`}
            </span>
            <h3 className="text-lg font-bold font-display text-white">
              {isNew ? 'Architect New Project' : 'Edit Project Specifications'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/50 flex items-center gap-2 text-xs font-mono text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs font-sans text-neutral-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. NeutraCap, LYRA V2..."
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Industrial Capacitors Showcase"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. AI Systems & Graphs"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Year
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Lead Architect"
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] text-neutral-400 uppercase">
              Short Summary (Visible on primary project card)
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Long Description / Architectural Deep Dive */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] text-neutral-400 uppercase">
              Extended Architecture & Problem Solving Narrative
            </label>
            <textarea
              rows={4}
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="block font-mono text-[11px] text-neutral-400 uppercase">
              Technologies Stack
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {formData.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded bg-[#171a25] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="text-neutral-400 hover:text-red-400 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add technology (e.g. LLM Tool-Calling, n8n, WebSockets)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Hero Image URL */}
          <div className="space-y-1.5">
            <label className="block font-mono text-[11px] text-neutral-400 uppercase">
              Hero Showcase Image URL
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Dedicated External Links Architecture Section */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  EXTERNAL LINK SYSTEM & DEPLOYMENTS
                </span>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Configure live deployments, source repos, demos, and docs. Valid HTTP/HTTPS required.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/30 font-mono text-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            {links.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#12141c] border border-dashed border-white/15 text-center space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-white/5 mx-auto flex items-center justify-center text-neutral-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono text-neutral-300">
                  No external links configured
                </div>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto font-sans leading-relaxed">
                  Public project card will automatically display an architectural status badge (e.g. &ldquo;PROPRIETARY BUILD&rdquo;) instead of empty or broken links.
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLinks([
                        {
                          id: `lnk-${Date.now()}`,
                          type: 'LIVE_WEBSITE',
                          label: 'Visit Website',
                          url: '',
                          visibility: 'PUBLIC',
                          isPrimary: true,
                          sortOrder: 1,
                        }
                      ]);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white font-mono text-[11px]"
                  >
                    + Add Live Website
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLinks([
                        {
                          id: `lnk-${Date.now()}`,
                          type: 'GITHUB',
                          label: 'Source Code',
                          url: '',
                          visibility: 'PUBLIC',
                          isPrimary: false,
                          sortOrder: 1,
                        }
                      ]);
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white font-mono text-[11px]"
                  >
                    + Add GitHub Repo
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {links.map((link, idx) => {
                  const hasUrl = Boolean((link.url || '').trim());
                  const urlValid = hasUrl && isValidHttpUrl(link.url);

                  return (
                    <div
                      key={link.id}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        link.isPrimary
                          ? 'bg-gradient-to-r from-red-950/20 via-[#141622] to-[#141622] border-red-500/40'
                          : 'bg-[#141622] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Top bar: Type, Primary Badge, Visibility & Delete */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-neutral-500 font-bold">
                            #{idx + 1}
                          </span>
                          <select
                            value={link.type}
                            onChange={(e) => handleUpdateLink(link.id, 'type', e.target.value)}
                            className="px-2.5 py-1 rounded bg-[#0e1017] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                          >
                            <option value="LIVE_WEBSITE">Live Website (Primary App)</option>
                            <option value="DEMO">Demo / Prototype</option>
                            <option value="GITHUB">GitHub / Source Code</option>
                            <option value="CASE_STUDY">Case Study</option>
                            <option value="DOCUMENTATION">Documentation / Specs</option>
                            <option value="APP_STORE">App Store / Mobile Build</option>
                            <option value="OTHER">Other External Resource</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Primary CTA Flag */}
                          <button
                            type="button"
                            onClick={() => handleUpdateLink(link.id, 'isPrimary', !link.isPrimary)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
                              link.isPrimary
                                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,42,58,0.4)]'
                                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                            }`}
                            title="Set as dominant Primary Action CTA"
                          >
                            <Star className={`w-3 h-3 ${link.isPrimary ? 'fill-white text-white' : ''}`} />
                            <span>{link.isPrimary ? 'Primary CTA' : 'Make Primary'}</span>
                          </button>

                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => handleUpdateLink(link.id, 'visibility', link.visibility === 'HIDDEN' ? 'PUBLIC' : 'HIDDEN')}
                            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                              link.visibility === 'HIDDEN'
                                ? 'bg-neutral-800 text-neutral-500 hover:text-neutral-400'
                                : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                            }`}
                            title={link.visibility === 'HIDDEN' ? 'Hidden from public website' : 'Visible on public website'}
                          >
                            {link.visibility === 'HIDDEN' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete Link */}
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(link.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Remove link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inputs: Label & URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        <div className="sm:col-span-4 space-y-1">
                          <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                            placeholder="Visit Website"
                            className="w-full px-3 py-1.5 rounded-lg bg-[#0e1017] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div className="sm:col-span-8 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                              Target URL (HTTP / HTTPS)
                            </label>
                            {hasUrl && (
                              <span className={`font-mono text-[10px] flex items-center gap-1 ${urlValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                {urlValid ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Valid URL</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Must begin with http:// or https://</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                              placeholder="https://example.com"
                              className={`w-full px-3 py-1.5 rounded-lg bg-[#0e1017] border text-white font-mono text-xs focus:outline-none pr-8 ${
                                hasUrl && !urlValid
                                  ? 'border-red-500/70 focus:border-red-500'
                                  : 'border-white/15 focus:border-red-500'
                              }`}
                            />
                            {urlValid && (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                                title="Open preview in new tab"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings & Toggles */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Sort Display Order
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featProj"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-red-500 rounded cursor-pointer"
              />
              <label htmlFor="featProj" className="font-mono text-xs text-neutral-300 cursor-pointer flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-red-400" />
                Featured Highlight
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                Current Status
              </label>
              <div className="text-xs font-mono text-amber-400 py-2">
                {formData.status}
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer: Clear distinction between Draft and Publish! */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#10121a] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {/* Save as Draft Button (does NOT publish) */}
            <button
              type="button"
              onClick={() => handleSave('DRAFT')}
              disabled={saving}
              className="min-h-[42px] px-5 py-2 rounded-lg bg-[#181b26] hover:bg-[#202433] border border-white/15 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>Save as Draft (Private)</span>
            </button>

            {/* Save and Publish Button (Publishes to live site) */}
            <button
              type="button"
              onClick={() => handleSave('PUBLISHED')}
              disabled={saving}
              className="min-h-[42px] px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              <span>Save &amp; Publish (Live)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VaultProjectEditor;
