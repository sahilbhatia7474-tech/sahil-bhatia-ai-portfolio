import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem, publishItem } from '../../lib/dbService';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';
import VaultProjectEditor from './VaultProjectEditor';

const VaultProjects = ({ openCreateSignal, clearCreateSignal }) => {
  const { allProjects, refreshAllData } = usePortfolioData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // If parent triggered creation
  if (openCreateSignal && !isCreatingNew) {
    setIsCreatingNew(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  // Filter projects
  const filtered = allProjects.filter((p) => {
    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(new Set(allProjects.map((p) => p.category).filter(Boolean)));

  const handleTogglePublish = async (project) => {
    const isCurrentlyPublished = project.status === 'PUBLISHED';
    const res = await publishItem('projects', project.id, !isCurrentlyPublished);
    if (res.success) {
      setFeedback({
        type: 'success',
        text: `Project "${project.title}" is now ${isCurrentlyPublished ? 'DRAFT (hidden from public)' : 'PUBLISHED (live on public site)'}.`,
      });
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to update status.' });
    }
  };

  const handleDuplicate = async (project) => {
    const newId = `copy-${Date.now().toString().slice(-4)}`;
    const copyPayload = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
      status: 'DRAFT',
      visibility: 'PRIVATE',
      featured: false,
      sortOrder: (project.sortOrder || 1) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('projects', newId, copyPayload, true);
    if (res.success) {
      setFeedback({ type: 'success', text: `Duplicated "${project.title}" as draft.` });
      refreshAllData();
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await deleteItem('projects', id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Project "${title}" deleted.` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-red-500" />
            <span>CURATED PROJECT MANAGER</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Manage projects, drafts, case studies, technologies, and publication status.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setIsCreatingNew(true);
          }}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg flex items-center justify-between gap-3 text-xs font-mono ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search projects by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[40px] pl-9 pr-4 py-2 rounded-lg bg-[#12141d] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#12141d] border border-white/10 text-white text-xs font-mono focus:outline-none"
            >
              <option value="ALL">All Statuses ({allProjects.length})</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Draft Only</option>
              <option value="ARCHIVED">Archived Only</option>
              <option value="VERIFY">Verify Before Publish</option>
            </select>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#12141d] border border-white/10 text-white text-xs font-mono focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Projects Table / Cards */}
      <div className="space-y-3">
        {filtered.map((proj) => {
          const isPublished = proj.status === 'PUBLISHED';
          const isDraft = proj.status === 'DRAFT';

          return (
            <div
              key={proj.id}
              className="rounded-xl bg-[#0c0d14] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Info Column */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-neutral-400">#{proj.sortOrder || proj.id}</span>
                  <h3 className="text-base font-bold font-display text-white truncate">
                    {proj.title}
                  </h3>
                  {proj.subtitle && (
                    <span className="text-xs font-mono text-neutral-400 truncate">
                      // {proj.subtitle}
                    </span>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider ${
                      isPublished
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : isDraft
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {proj.status || 'DRAFT'}
                  </span>

                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 text-red-300 border border-red-500/30 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-red-400 fill-current" />
                      FEATURED
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 font-sans line-clamp-2">
                  {proj.shortDescription || proj.summary || proj.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(proj.technologies || proj.techStack || []).slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400"
                    >
                      {t}
                    </span>
                  ))}
                  {(proj.technologies || proj.techStack || []).length > 5 && (
                    <span className="text-[10px] font-mono text-neutral-400">
                      +{(proj.technologies || proj.techStack || []).length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                {/* Publish / Unpublish Toggle */}
                <button
                  onClick={() => handleTogglePublish(proj)}
                  title={isPublished ? 'Unpublish to Draft' : 'Publish to Live'}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isPublished
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
                  }`}
                >
                  {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isPublished ? 'Live' : 'Draft'}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setEditingProject(proj);
                    setIsCreatingNew(false);
                  }}
                  title="Edit full project specs"
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-200 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Edit</span>
                </button>

                {/* Duplicate */}
                <button
                  onClick={() => handleDuplicate(proj)}
                  title="Duplicate as new draft"
                  className="min-h-[38px] p-2 rounded-lg bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  title="Delete project"
                  className="min-h-[38px] p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400 space-y-3">
            <p>No projects match your current filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="px-3 py-1.5 rounded bg-white/10 text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Full Modal Project Editor */}
      {(isCreatingNew || editingProject) && (
        <VaultProjectEditor
          project={editingProject}
          isNew={isCreatingNew}
          onClose={() => {
            setIsCreatingNew(false);
            setEditingProject(null);
          }}
          onSaved={() => {
            setIsCreatingNew(false);
            setEditingProject(null);
            refreshAllData();
          }}
        />
      )}
    </div>
  );
};

export default VaultProjects;
