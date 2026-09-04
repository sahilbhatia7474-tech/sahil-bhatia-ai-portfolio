import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import MediaUploadControl from './MediaUploadControl';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
} from 'lucide-react';

const VaultCertificates = ({ openCreateSignal, clearCreateSignal }) => {
  const { certificates, refreshAllData } = usePortfolioData();
  const [editingCert, setEditingCert] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  if (openCreateSignal && !isCreatingNew) {
    setIsCreatingNew(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    imageUrl: '',
    verificationUrl: '',
    description: '',
    skills: [],
    visibility: 'PUBLIC',
    featured: false,
    sortOrder: 1,
  });

  const [skillInput, setSkillInput] = useState('');

  const openEdit = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      imageUrl: cert.imageUrl || '',
      verificationUrl: cert.verificationUrl || '',
      description: cert.description || '',
      skills: cert.skills || [],
      visibility: cert.visibility || 'PUBLIC',
      featured: cert.featured ?? false,
      sortOrder: cert.sortOrder ?? 1,
    });
    setIsCreatingNew(false);
  };

  const openNew = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      imageUrl: '',
      verificationUrl: '',
      description: '',
      skills: [],
      visibility: 'PUBLIC',
      featured: false,
      sortOrder: certificates.length + 1,
    });
    setIsCreatingNew(true);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) {
      setFeedback({ type: 'error', text: 'Certificate Title and Issuer are required.' });
      return;
    }

    setSaving(true);
    const docId = isCreatingNew
      ? `cert-${Date.now().toString().slice(-4)}`
      : editingCert.id;

    const payload = {
      ...formData,
      status: 'PUBLISHED',
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('certificates', docId, payload, isCreatingNew);
    if (res.success) {
      setFeedback({ type: 'success', text: `Certificate "${formData.title}" saved.` });
      setIsCreatingNew(false);
      setEditingCert(null);
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save certificate.' });
    }
    setSaving(false);
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete certificate "${cert.title}"?`)) return;
    const res = await deleteItem('certificates', cert.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted "${cert.title}".` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-red-500" />
            <span>CERTIFICATE & CREDENTIALS VAULT</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Manage validated credentials, badges, issuing organizations, and verification hyperlinks.
          </p>
        </div>

        <button
          onClick={openNew}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
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

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl bg-[#0c0d14] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  {cert.featured && (
                    <span className="p-1 rounded bg-red-950/50 text-red-400 border border-red-500/30" title="Featured Credential">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      cert.visibility === 'PUBLIC'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {cert.visibility}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold font-display text-white">{cert.title}</h3>
                <div className="text-xs font-mono text-neutral-400">{cert.issuer} &bull; {cert.date}</div>
              </div>

              {cert.description && (
                <p className="text-xs text-neutral-300 font-sans line-clamp-2">{cert.description}</p>
              )}

              {/* Skills covered */}
              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {cert.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-neutral-400">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {cert.verificationUrl ? (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[10px] font-mono text-neutral-500">Self-Verified</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(cert)}
                  className="p-1.5 rounded-md bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-300 hover:text-white cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cert)}
                  className="p-1.5 rounded-md bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400">
            No certificates added yet. Click &ldquo;Add Certificate&rdquo; above.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {(isCreatingNew || editingCert) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  {isCreatingNew ? 'NEW CREDENTIAL' : `EDITING // ${formData.title}`}
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Certificate Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingCert(null);
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs font-sans text-neutral-300">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Google Cloud Certified: Professional Machine Learning"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Issuer *
                  </label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. Google, DeepLearning.AI, Stanford"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Issue Date / Year
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. Nov 2024"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Verification URL
                </label>
                <input
                  type="url"
                  value={formData.verificationUrl}
                  onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Certificate Media & Badge Asset */}
              <div className="space-y-2 p-3.5 rounded-lg bg-[#0e1017] border border-white/10">
                <label className="block font-mono text-[11px] text-neutral-300 uppercase font-semibold">
                  Certificate Media / Credential Badge Asset
                </label>
                <MediaUploadControl
                  label="Upload Certificate Media (Firebase Storage)"
                  folderPath="certificates"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
                  currentUrl={formData.imageUrl}
                  onSuccess={(res) => {
                    if (res.downloadUrl) {
                      setFormData((prev) => ({ ...prev, imageUrl: res.downloadUrl }));
                    }
                  }}
                />
                <div className="space-y-1 pt-1">
                  <label className="block font-mono text-[10px] text-neutral-500 uppercase">
                    Or Image / Badge Web URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141620] border border-white/10 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Description / Topics Covered
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Skills Covered
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {formData.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded bg-[#171a25] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
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
                    placeholder="Add skill (e.g. Prompt Engineering, Agent Architecture)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Visibility and Featured Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="PUBLIC">PUBLIC (Shown in Proof &amp; Credentials)</option>
                    <option value="PRIVATE">PRIVATE (Founder Vault Only)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featCert"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                  />
                  <label htmlFor="featCert" className="font-mono text-xs text-neutral-300 cursor-pointer">
                    Feature on Proof / Credentials spotlight
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingCert(null);
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
                  <span>{saving ? 'Saving...' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultCertificates;
