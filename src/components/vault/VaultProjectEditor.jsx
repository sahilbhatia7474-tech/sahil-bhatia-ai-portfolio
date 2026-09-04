import { useState } from 'react';
import { saveItem } from '../../lib/dbService';
import MediaUploadControl from './MediaUploadControl';
import { 
  X, Save, Eye, CheckCircle2, AlertCircle, RefreshCw, Star, 
  Link as LinkIcon, ExternalLink, Plus, Trash2, Globe,
  Image as ImageIcon, Film, ArrowUp, ArrowDown
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
        isPrimary: false,
        sortOrder: 3,
      });
    }
    if (project?.caseStudyUrl) {
      defaults.push({
        id: 'lnk-casestudy',
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
    heroImage: project?.heroImage || project?.coverImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    coverImageUrl: project?.coverImageUrl || project?.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    galleryImages: Array.isArray(project?.galleryImages) ? project.galleryImages : [],
    videoUrl: project?.videoUrl || '',
    videoSource: project?.videoSource || 'upload',
    videoPosterUrl: project?.videoPosterUrl || '',
    media: Array.isArray(project?.media) ? project.media : [],
    mediaCaption: project?.mediaCaption || '',
    mediaAltText: project?.mediaAltText || '',
    status: project?.status || 'DRAFT',
    visibility: project?.visibility || 'PUBLIC',
    featured: project?.featured ?? false,
    sortOrder: project?.sortOrder ?? 1,
  });

  const [techInput, setTechInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Real-time media upload lifecycle state
  const [mediaUploadState, setMediaUploadState] = useState({
    status: 'idle', // 'idle' | 'uploading' | 'completed' | 'saving' | 'verifying' | 'saved' | 'error'
    progress: 0,
    message: '',
    target: '', // 'cover' | 'gallery' | 'video' | 'videoPoster'
  });

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
    setLinks(links.map((link) => {
      if (link.id !== id) return link;
      const updated = { ...link, [field]: value };
      if (field === 'type' && (!link.label || link.label === DEFAULT_TYPE_LABELS[link.type])) {
        updated.label = DEFAULT_TYPE_LABELS[value] || 'Link';
      }
      return updated;
    }));
  };

  const handleSetPrimaryLink = (id) => {
    setLinks(links.map((link) => ({
      ...link,
      isPrimary: link.id === id,
    })));
  };

  const handleRemoveLink = (id) => {
    const remaining = links.filter((l) => l.id !== id);
    if (remaining.length > 0 && !remaining.some((l) => l.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    setLinks(remaining);
  };

  const handleSetAsCover = (url) => {
    setFormData((prev) => ({
      ...prev,
      coverImageUrl: url,
      heroImage: url,
    }));
  };

  const handleAddGalleryUrl = () => {
    const trimmed = galleryUrlInput.trim();
    if (!trimmed) return;
    if (!isValidHttpUrl(trimmed)) {
      setError('Please enter a valid HTTP/HTTPS image URL for the gallery.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), trimmed],
    }));
    setGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleMoveGalleryImage = (index, direction) => {
    const items = [...formData.galleryImages];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, galleryImages: items }));
  };

  const handleSave = async (targetStatus = formData.status) => {
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }

    const resolvedSlug = (isNew && !formData.slug.trim())
      ? formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : formData.slug.trim();

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
    setMediaUploadState({ status: 'saving', progress: 50, message: 'Writing records to Firestore...', target: 'save' });

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

    const docId = isNew ? (resolvedSlug || `proj-${Date.now().toString().slice(-4)}`) : project.id;
    const finalPayload = {
      ...formData,
      slug: resolvedSlug,
      heroImage: formData.coverImageUrl || formData.heroImage,
      coverImageUrl: formData.coverImageUrl || formData.heroImage,
      galleryImages: formData.galleryImages || [],
      videoUrl: (formData.videoUrl || '').trim(),
      videoSource: formData.videoSource || 'upload',
      videoPosterUrl: (formData.videoPosterUrl || '').trim(),
      mediaCaption: formData.mediaCaption || '',
      mediaAltText: formData.mediaAltText || '',
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

    setMediaUploadState({ status: 'verifying', progress: 85, message: 'Verifying data integrity...', target: 'save' });

    const res = await saveItem('projects', docId, finalPayload, isNew);
    if (res.success) {
      setMediaUploadState({ status: 'saved', progress: 100, message: 'Project saved successfully!', target: 'save' });
      setTimeout(() => {
        if (onSaved) onSaved();
      }, 500);
    } else {
      setError(res.error || 'Failed to save project.');
      setMediaUploadState({ status: 'error', progress: 0, message: res.error || 'Save failed', target: 'save' });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-red-500 font-bold tracking-wider uppercase">
              PROJECT ARCHITECT // {isNew ? 'CREATE SPEC' : `EDIT [${project?.id || 'PROJ'}]`}
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
              {formData.status}
            </span>
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

        {/* Real-time media lifecycle progress indicator banner */}
        {mediaUploadState.status !== 'idle' && (
          <div className={`mx-6 mt-3 p-3 rounded-lg border font-mono text-xs flex flex-col gap-1.5 ${
            mediaUploadState.status === 'error'
              ? 'bg-red-950/30 border-red-500/40 text-red-300'
              : mediaUploadState.status === 'completed' || mediaUploadState.status === 'saved'
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-[#141624] border-red-500/30 text-neutral-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {mediaUploadState.status === 'uploading' || mediaUploadState.status === 'saving' || mediaUploadState.status === 'verifying' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="uppercase font-bold tracking-wider">
                  {mediaUploadState.status === 'uploading' && `UPLOADING [${mediaUploadState.progress}%]`}
                  {mediaUploadState.status === 'completed' && 'UPLOAD COMPLETED'}
                  {mediaUploadState.status === 'saving' && 'SAVING RECORDS'}
                  {mediaUploadState.status === 'verifying' && 'VERIFYING DATA INTEGRITY'}
                  {mediaUploadState.status === 'saved' && 'SAVED SUCCESSFULLY'}
                  {mediaUploadState.status === 'error' && 'ERROR // RETRY REQUIRED'}
                </span>
              </span>
              <span className="text-[10px] text-neutral-400">{mediaUploadState.message}</span>
            </div>
            {mediaUploadState.status === 'uploading' && (
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-200" 
                  style={{ width: `${mediaUploadState.progress}%` }} 
                />
              </div>
            )}
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans text-neutral-300">
          
          {/* Core Info */}
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
              rows={3}
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

          {/* ============================================================ */}
          {/* PROJECT MEDIA & VISUAL ARCHITECTURE MANAGER                  */}
          {/* ============================================================ */}
          <div className="pt-4 border-t border-white/10 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                PROJECT MEDIA ARCHITECTURE &amp; VISUAL ASSETS
              </span>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                Manage cover visual, multi-image technical gallery, project video (upload or external), and metadata.
              </p>
            </div>

            {/* 1. Cover Image Section */}
            <div className="p-4 rounded-xl bg-[#12131c] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white font-semibold flex items-center gap-2">
                  <span>01. COVER IMAGE / HERO VISUAL</span>
                </span>
                {formData.coverImageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, coverImageUrl: '', heroImage: '' }))}
                    className="text-neutral-500 hover:text-red-400 text-[11px] font-mono cursor-pointer"
                  >
                    Remove Visual
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-5">
                  {formData.coverImageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/15 bg-black/40 group">
                      <img
                        src={formData.coverImageUrl}
                        alt={formData.mediaAltText || formData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-mono text-neutral-200">Current Cover</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-neutral-500 gap-1 bg-[#0d0e14]">
                      <ImageIcon className="w-6 h-6 text-neutral-600" />
                      <span className="text-[11px] font-mono">No cover selected</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-7 space-y-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                      Upload Cover Visual (Firebase Storage)
                    </label>
                    <MediaUploadControl
                      label="Select Cover Image"
                      folderPath="projects/covers"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                      currentUrl={formData.coverImageUrl}
                      onSuccess={(res) => {
                        if (res.downloadUrl) {
                          setFormData((prev) => ({
                            ...prev,
                            coverImageUrl: res.downloadUrl,
                            heroImage: res.downloadUrl,
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                      Or Paste Image URL Directly
                    </label>
                    <input
                      type="text"
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value, heroImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block font-mono text-[10px] text-neutral-500 uppercase">
                        Image Caption
                      </label>
                      <input
                        type="text"
                        value={formData.mediaCaption}
                        onChange={(e) => setFormData({ ...formData, mediaCaption: e.target.value })}
                        placeholder="e.g. Architectural diagram"
                        className="w-full px-2.5 py-1 rounded bg-[#141620] border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-neutral-500 uppercase">
                        Accessibility Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.mediaAltText}
                        onChange={(e) => setFormData({ ...formData, mediaAltText: e.target.value })}
                        placeholder="e.g. Spec dashboard view"
                        className="w-full px-2.5 py-1 rounded bg-[#141620] border border-white/10 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Gallery Images Section */}
            <div className="p-4 rounded-xl bg-[#12131c] border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-xs text-white font-semibold">
                    02. MULTI-IMAGE TECHNICAL GALLERY
                  </span>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    Screenshots, system flows, and technical schematics displayed in the modal lightbox.
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  <MediaUploadControl
                    label="Add Gallery Image"
                    folderPath="projects/gallery"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    onSuccess={(res) => {
                      if (res.downloadUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          galleryImages: [...(prev.galleryImages || []), res.downloadUrl],
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Add by URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  placeholder="Or paste screenshot URL to add to gallery..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              {/* Gallery List */}
              {formData.galleryImages.length === 0 ? (
                <div className="py-6 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-lg">
                  No additional gallery images configured yet.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formData.galleryImages.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/15 bg-black/40 aspect-video flex flex-col justify-between">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-neutral-300 font-mono text-[10px]">
                          <span>#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveGalleryImage(idx, -1)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                            title="Move left"
                          >
                            <ArrowUp className="w-3 h-3 -rotate-90" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(url)}
                            className="px-2 py-0.5 rounded bg-red-600/80 hover:bg-red-600 text-white font-mono text-[9px] cursor-pointer transition-colors"
                            title="Set as project cover image"
                          >
                            SET COVER
                          </button>
                          <button
                            type="button"
                            disabled={idx === formData.galleryImages.length - 1}
                            onClick={() => handleMoveGalleryImage(idx, 1)}
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 cursor-pointer"
                            title="Move right"
                          >
                            <ArrowDown className="w-3 h-3 -rotate-90" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Project Video Section */}
            <div className="p-4 rounded-xl bg-[#12131c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-white font-semibold flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-red-400" />
                    <span>03. PROJECT VIDEO OVERVIEW</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    Direct MP4/WebM uploaded to Firebase Storage, or embedded external link (YouTube, Vimeo, CDN).
                  </p>
                </div>

                {formData.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, videoUrl: '' }))}
                    className="text-neutral-500 hover:text-red-400 text-[11px] font-mono cursor-pointer"
                  >
                    Remove Video
                  </button>
                )}
              </div>

              {/* Source Switcher */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-neutral-400">VIDEO SOURCE:</span>
                <div className="inline-flex rounded-lg bg-[#141620] p-1 border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, videoSource: 'upload' }))}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      formData.videoSource === 'upload'
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Direct Upload (Storage)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, videoSource: 'external' }))}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      formData.videoSource === 'external'
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    External Link (YouTube / Vimeo / CDN)
                  </button>
                </div>
              </div>

              {/* Video inputs based on source */}
              {formData.videoSource === 'upload' ? (
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                    Upload Video Asset (MP4 / WebM &middot; Max 100MB)
                  </label>
                  <MediaUploadControl
                    label="Select Project Video Asset"
                    mediaType="video"
                    folderPath="projects/videos"
                    accept="video/mp4,video/webm,video/quicktime"
                    currentUrl={formData.videoUrl}
                    onSuccess={(res) => {
                      if (res.downloadUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          videoUrl: res.downloadUrl,
                          videoSource: 'upload',
                        }));
                      }
                    }}
                  />
                  {formData.videoUrl && (
                    <div className="text-[11px] font-mono text-emerald-400 truncate max-w-md pt-1">
                      Uploaded: {formData.videoUrl}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                    External Video Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {/* Video Poster Image */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5">
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                    Video Poster Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={formData.videoPosterUrl}
                    onChange={(e) => setFormData({ ...formData, videoPosterUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                    Or Upload Poster
                  </label>
                  <MediaUploadControl
                    label="Select Poster Image"
                    folderPath="projects/posters"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    currentUrl={formData.videoPosterUrl}
                    onSuccess={(res) => {
                      if (res.downloadUrl) {
                        setFormData((prev) => ({
                          ...prev,
                          videoPosterUrl: res.downloadUrl,
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Live Video Preview */}
              {formData.videoUrl && (
                <div className="pt-2">
                  <span className="block font-mono text-[10px] text-neutral-500 uppercase mb-1.5">
                    Live Video Player Preview
                  </span>
                  <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden border border-white/15 bg-black">
                    {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={formData.videoUrl.replace('watch?v=', 'embed/')}
                        title="Video Preview"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={formData.videoUrl}
                        poster={formData.videoPosterUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dedicated External Links Architecture Section */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  EXTERNAL LINK SYSTEM &amp; DEPLOYMENTS
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
                      {/* Top bar */}
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
                            <option value="DOCUMENTATION">Documentation</option>
                            <option value="APP_STORE">App Store / Mobile</option>
                            <option value="OTHER">Other External</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          {link.isPrimary ? (
                            <span className="px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-red-400 font-mono text-[10px] font-bold">
                              PRIMARY CALL-TO-ACTION
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryLink(link.id)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-[10px] cursor-pointer"
                            >
                              Make Primary
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveLink(link.id)}
                            className="p-1 rounded text-neutral-500 hover:text-red-400 cursor-pointer"
                            title="Remove Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4 space-y-1">
                          <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                            Button Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(link.id, 'label', e.target.value)}
                            placeholder="e.g. Visit Website"
                            className="w-full px-2.5 py-1.5 rounded bg-[#0e1017] border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-red-500"
                          />
                        </div>

                        <div className="sm:col-span-8 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block font-mono text-[10px] text-neutral-400 uppercase">
                              Target URL *
                            </label>
                            {hasUrl && (
                              <span className={`font-mono text-[9px] ${urlValid ? 'text-emerald-400' : 'text-red-400'}`}>
                                {urlValid ? 'VALID URL' : 'INVALID HTTP/HTTPS'}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => handleUpdateLink(link.id, 'url', e.target.value)}
                              placeholder="https://..."
                              className={`w-full px-2.5 py-1.5 pr-8 rounded bg-[#0e1017] border font-mono text-xs text-white focus:outline-none ${
                                hasUrl && !urlValid ? 'border-red-500' : 'border-white/10 focus:border-red-500'
                              }`}
                            />
                            {hasUrl && urlValid && (
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

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#10121a] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {/* Save as Draft Button */}
            <button
              type="button"
              onClick={() => handleSave('DRAFT')}
              disabled={saving}
              className="min-h-[42px] px-5 py-2 rounded-lg bg-[#181b26] hover:bg-[#202433] border border-white/15 text-neutral-200 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>Save as Draft</span>
            </button>

            {/* Save and Publish Button */}
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
