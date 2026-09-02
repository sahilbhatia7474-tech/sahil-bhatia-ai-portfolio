import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Eye,
} from 'lucide-react';

const VaultEducation = ({ openCreateSignal, clearCreateSignal }) => {
  const { education, refreshAllData } = usePortfolioData();
  const [editingEdu, setEditingEdu] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  if (openCreateSignal && !isCreatingNew) {
    setIsCreatingNew(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    period: '',
    description: '',
    evidence: '',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    order: 1,
  });

  const openEdit = (edu) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      period: edu.period || '',
      description: edu.description || '',
      evidence: edu.evidence || '',
      status: edu.status || 'PUBLISHED',
      visibility: edu.visibility || 'PUBLIC',
      order: edu.order ?? 1,
    });
    setIsCreatingNew(false);
  };

  const openNew = () => {
    setEditingEdu(null);
    setFormData({
      degree: 'Bachelor of Technology (B.Tech IT)',
      institution: 'Guru Gobind Singh Indraprastha University (GGSIPU)',
      period: '2021 - 2025',
      description: 'Rigorous coursework in Data Structures, Distributed Systems, Software Engineering, AI & Machine Learning.',
      evidence: 'Degree credentials verified and logged.',
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      order: education.length + 1,
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) {
      setFeedback({ type: 'error', text: 'Degree and Institution are required.' });
      return;
    }

    setSaving(true);
    const docId = isCreatingNew
      ? `edu-${Date.now().toString().slice(-4)}`
      : editingEdu.id;

    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('education', docId, payload, isCreatingNew);
    if (res.success) {
      setFeedback({ type: 'success', text: `Education record saved.` });
      setIsCreatingNew(false);
      setEditingEdu(null);
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save education record.' });
    }
    setSaving(false);
  };

  const handleDelete = async (edu) => {
    if (!window.confirm(`Delete education record "${edu.degree}"?`)) return;
    const res = await deleteItem('education', edu.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted "${edu.degree}".` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-500" />
            <span>ACADEMIC FOUNDATION & EDUCATION</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Manage university credentials, graduation timeline, and specialization details.
          </p>
        </div>

        <button
          onClick={openNew}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education Record</span>
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

      {/* Education List */}
      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="rounded-xl bg-[#0c0d14] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold font-display text-white">{edu.degree}</h3>
                <span className="text-xs font-mono text-neutral-400">// {edu.institution}</span>
                <span className="text-xs font-mono text-neutral-400">({edu.period})</span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    edu.visibility === 'PUBLIC'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {edu.visibility}
                </span>
              </div>

              {edu.description && (
                <p className="text-xs text-neutral-300 font-sans">{edu.description}</p>
              )}

              {edu.evidence && (
                <div className="text-[11px] font-mono text-neutral-400">
                  Verification: <span className="text-neutral-300">{edu.evidence}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEdit(edu)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-200 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(edu)}
                className="min-h-[38px] p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editor */}
      {(isCreatingNew || editingEdu) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  {isCreatingNew ? 'NEW EDUCATION RECORD' : `EDITING // ${formData.degree}`}
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Academic Record Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingEdu(null);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs font-sans text-neutral-300">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Degree / Field of Study *
                </label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology in Information Technology"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Institution / University *
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. Guru Gobind Singh Indraprastha University (GGSIPU)"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Timeline Period
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2021 - 2025"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="PUBLIC">PUBLIC (Visible on Public Site)</option>
                    <option value="PRIVATE">PRIVATE (Founder Vault Only)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Coursework &amp; Academic Focus
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Evidence / Verification
                </label>
                <input
                  type="text"
                  value={formData.evidence}
                  onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                  placeholder="e.g. University enrollment credentials verified"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingEdu(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[42px] px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultEducation;
