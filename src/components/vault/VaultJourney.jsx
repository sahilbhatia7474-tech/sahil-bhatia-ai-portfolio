import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

const VaultJourney = ({ openCreateSignal, clearCreateSignal }) => {
  const { allJourney, refreshAllData } = usePortfolioData();
  const [editingItem, setEditingItem] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  // If parent triggered creation
  if (openCreateSignal && !isCreatingNew) {
    setIsCreatingNew(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '',
    verified: true,
    status: 'PUBLISHED',
    responsibilities: [],
    coreThemes: [],
    evidence: '',
    order: 1,
  });

  const [respInput, setRespInput] = useState('');

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      company: item.company || '',
      role: item.role || '',
      period: item.period || '',
      verified: item.verified ?? true,
      status: item.status || (item.verified ? 'PUBLISHED' : 'VERIFY'),
      responsibilities: item.responsibilities || [],
      coreThemes: item.coreThemes || [],
      evidence: item.evidence || '',
      order: item.order ?? 1,
    });
    setIsCreatingNew(false);
  };

  const openNew = () => {
    setEditingItem(null);
    setFormData({
      company: '',
      role: '',
      period: '',
      verified: true,
      status: 'PUBLISHED',
      responsibilities: [],
      coreThemes: [],
      evidence: '',
      order: allJourney.length + 1,
    });
    setIsCreatingNew(true);
  };

  const handleAddResp = (e) => {
    e.preventDefault();
    if (respInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, respInput.trim()],
      }));
      setRespInput('');
    }
  };

  const handleRemoveResp = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      setFeedback({ type: 'error', text: 'Company and Role are required.' });
      return;
    }

    setSaving(true);
    const docId = isCreatingNew
      ? `journey-${Date.now().toString().slice(-4)}`
      : editingItem.id;

    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('journey', docId, payload, isCreatingNew);
    if (res.success) {
      setFeedback({
        type: 'success',
        text: `Journey entry for ${formData.company} saved successfully.`,
      });
      setIsCreatingNew(false);
      setEditingItem(null);
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save journey entry.' });
    }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete experience record for ${item.company}?`)) return;
    const res = await deleteItem('journey', item.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted ${item.company}.` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-red-500" />
            <span>PROFESSIONAL JOURNEY & CAREER MANAGER</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Maintain verified professional experience, career milestones, and key contributions.
          </p>
        </div>

        <button
          onClick={openNew}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Journey Record</span>
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

      {/* Honesty Notice */}
      <div className="p-4 rounded-xl bg-[#10121a] border border-white/10 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 font-sans text-neutral-300">
          <span className="font-mono font-bold text-white text-xs block">
            STRICT VERIFICATION POLICY (ZERO FABRICATION)
          </span>
          <p>
            Records marked <strong className="text-amber-400">VERIFY</strong> (e.g. PhonePe) are withheld from public display until the Founder confirms explicit verification documentation. Paytm, Airtel, and Excitel are marked verified.
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {allJourney.map((item) => {
          const isVerified = item.verified && item.status !== 'VERIFY';
          return (
            <div
              key={item.id}
              className={`rounded-xl bg-[#0c0d14] border p-5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                isVerified ? 'border-white/10 hover:border-white/20' : 'border-amber-500/40 bg-amber-950/10'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold font-display text-white">{item.company}</h3>
                  <span className="text-xs font-mono text-neutral-400">// {item.role}</span>
                  <span className="text-xs font-mono text-neutral-400">({item.period})</span>

                  {/* Status */}
                  {isVerified ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      VERIFIED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      VERIFY BEFORE PUBLISHING
                    </span>
                  )}
                </div>

                {/* Responsibilities list */}
                {item.responsibilities && item.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-neutral-300 font-sans space-y-1 pt-1">
                    {item.responsibilities.map((r, i) => (
                      <li key={i} className="line-clamp-2">{r}</li>
                    ))}
                  </ul>
                )}

                {item.evidence && (
                  <div className="text-[11px] font-mono text-neutral-400 pt-1">
                    Evidence Notes: <span className="text-neutral-300">{item.evidence}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-200 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="min-h-[38px] p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  {isCreatingNew ? 'NEW EXPERIENCE RECORD' : `EDITING // ${formData.company}`}
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Journey Timeline Specifications
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingItem(null);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs font-sans text-neutral-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Paytm, Airtel..."
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Sales Specialist / Operations"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Period / Dates
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="e.g. 2023 - 2024"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Verification State
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        status: val,
                        verified: val === 'PUBLISHED',
                      });
                    }}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="PUBLISHED">VERIFIED (Live on Public Experience)</option>
                    <option value="VERIFY">VERIFY BEFORE PUBLISHING (Withhold from Public)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Responsibilities &amp; Takeaways
                </label>
                <div className="space-y-1.5">
                  {formData.responsibilities.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-[#141620] border border-white/10 text-xs text-neutral-200">
                      <span>{r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResp(i)}
                        className="text-neutral-400 hover:text-red-400 cursor-pointer ml-2"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add specific achievement or responsibility..."
                    value={respInput}
                    onChange={(e) => setRespInput(e.target.value)}
                    className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddResp}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Evidence notes */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Evidence / Verification Notes
                </label>
                <input
                  type="text"
                  value={formData.evidence}
                  onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
                  placeholder="e.g. Official offer letter on record, performance evaluation"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
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

export default VaultJourney;
