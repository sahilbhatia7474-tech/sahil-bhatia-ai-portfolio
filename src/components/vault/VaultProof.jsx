import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import { useAuth } from '../../lib/authContext';
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Filter,
  FileCheck,
  Lock,
} from 'lucide-react';

const EVIDENCE_TYPES = [
  'Live Demo',
  'Screenshot',
  'Screen Recording',
  'GitHub Repository',
  'Prompt Engineering Artifact',
  'Workflow Artifact',
  'Case Study',
  'Testing Notes / Metrics',
  'Real Business Result',
  'Certificate',
  'Resume Document / Credential',
];

const PROOF_STATES = ['Concept', 'Prototype', 'In Progress', 'Built', 'Verified'];

const VaultProof = () => {
  const { proofItems, allProjects, refreshAllData } = usePortfolioData();
  const { canEdit } = useAuth();
  const [editingProof, setEditingProof] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    evidenceType: 'Live Demo',
    proofState: 'Verified',
    url: '',
    description: '',
    relatedProjectId: '',
    verifiedDate: new Date().toISOString().split('T')[0],
  });

  const filtered = proofItems.filter((item) => {
    const matchesType = typeFilter === 'ALL' || item.evidenceType === typeFilter;
    const matchesState = stateFilter === 'ALL' || item.proofState === stateFilter;
    return matchesType && matchesState;
  });

  const openEdit = (item) => {
    setEditingProof(item);
    setFormData({
      title: item.title || '',
      evidenceType: item.evidenceType || 'Live Demo',
      proofState: item.proofState || 'Verified',
      url: item.url || '',
      description: item.description || '',
      relatedProjectId: item.relatedProjectId || '',
      verifiedDate: item.verifiedDate || '',
    });
    setIsCreatingNew(false);
  };

  const openNew = () => {
    if (!canEdit) return;
    setEditingProof(null);
    setFormData({
      title: '',
      evidenceType: 'Live Demo',
      proofState: 'Verified',
      url: '',
      description: '',
      relatedProjectId: '',
      verifiedDate: new Date().toISOString().split('T')[0],
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      setFeedback({ type: 'error', text: 'Authentication required. Only the founder can save proof evidence.' });
      return;
    }
    if (!formData.title.trim()) {
      setFeedback({ type: 'error', text: 'Proof Title is required.' });
      return;
    }

    setSaving(true);
    const docId = isCreatingNew
      ? `proof-${Date.now().toString().slice(-4)}`
      : editingProof.id;

    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('proofItems', docId, payload, isCreatingNew);
    if (res.success) {
      setFeedback({ type: 'success', text: `Proof item "${formData.title}" saved.` });
      setIsCreatingNew(false);
      setEditingProof(null);
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save proof item.' });
    }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!canEdit) {
      setFeedback({ type: 'error', text: 'Unauthorized. Only the founder can delete proof items.' });
      return;
    }
    if (!window.confirm(`Delete proof item "${item.title}"?`)) return;
    const res = await deleteItem('proofItems', item.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted "${item.title}".` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-red-500" />
            <span>PROOF &amp; VERIFIABLE EVIDENCE MANAGER</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Attach concrete evidence (live demos, GitHub repos, telemetry, prompt artifacts) to claims.
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={openNew}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Proof Evidence</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900/80 border border-white/10 font-mono text-xs text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>FOUNDER ACCESS REQUIRED TO EDIT</span>
          </div>
        )}
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
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-4 flex flex-wrap gap-3 items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Evidence Types ({proofItems.length})</option>
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Verification States</option>
            {PROOF_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Proof List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#0c0d14] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold font-display text-white">{item.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300">
                  {item.evidenceType}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    item.proofState === 'Verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.proofState}
                </span>
              </div>

              {item.description && (
                <p className="text-xs text-neutral-300 font-sans">{item.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-neutral-400 pt-1">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <span>Inspect Evidence</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {item.verifiedDate && <span>Verified: {item.verifiedDate}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {canEdit ? (
                <>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-300 hover:text-white cursor-pointer"
                    title="Edit proof item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
                    title="Delete proof item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 px-2 py-1 rounded bg-black/30 border border-white/5">
                  <Lock className="w-3 h-3 text-neutral-600" />
                  <span>Read-Only</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400">
            No proof items match the filters. Click &ldquo;Add Proof Evidence&rdquo; above.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {(isCreatingNew || editingProof) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  {isCreatingNew ? 'NEW PROOF ARTIFACT' : `EDITING // ${formData.title}`}
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Evidence Specifications
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingProof(null);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs font-sans text-neutral-300">
              <fieldset disabled={!canEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Evidence Item Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NeutraCap Production Deployment Telemetry"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Evidence Type
                  </label>
                  <select
                    value={formData.evidenceType}
                    onChange={(e) => setFormData({ ...formData, evidenceType: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    {EVIDENCE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Proof State
                  </label>
                  <select
                    value={formData.proofState}
                    onChange={(e) => setFormData({ ...formData, proofState: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    {PROOF_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Evidence URL / Asset Link
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Associated Project
                </label>
                <select
                  value={formData.relatedProjectId}
                  onChange={(e) => setFormData({ ...formData, relatedProjectId: e.target.value })}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                >
                  <option value="">-- General / No Specific Project --</option>
                  {allProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Description / Verification Context
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain how this artifact verifies the implementation or business impact..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
              </fieldset>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingProof(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 font-mono text-xs cursor-pointer"
                >
                  {canEdit ? 'Cancel' : 'Close Specimen'}
                </button>
                {canEdit ? (
                  <button
                    type="submit"
                    disabled={saving}
                    className="min-h-[42px] px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Saving...' : 'Save Evidence'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 font-mono text-xs text-amber-300">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>LOCKED // READ-ONLY</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultProof;
