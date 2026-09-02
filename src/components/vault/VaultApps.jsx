import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import {
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  Star,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';

const APP_PLATFORMS = ['Android APK', 'Progressive Web App (PWA)', 'Web Application', 'iOS TestFlight'];

const VaultApps = ({ openCreateSignal, clearCreateSignal }) => {
  const { allApps, refreshAllData } = usePortfolioData();
  const [editingApp, setEditingApp] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  if (openCreateSignal && !isCreatingNew) {
    setIsCreatingNew(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    platform: 'Android APK',
    version: 'v1.0.0',
    fileSize: '18.4 MB',
    downloadUrl: '',
    previewUrl: '',
    changelog: '',
    features: [],
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    featured: false,
    order: 1,
  });

  const [featureInput, setFeatureInput] = useState('');

  const openEdit = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name || '',
      tagline: app.tagline || '',
      description: app.description || '',
      platform: app.platform || 'Android APK',
      version: app.version || 'v1.0.0',
      fileSize: app.fileSize || '18.4 MB',
      downloadUrl: app.downloadUrl || '',
      previewUrl: app.previewUrl || '',
      changelog: app.changelog || '',
      features: app.features || [],
      status: app.status || 'PUBLISHED',
      visibility: app.visibility || 'PUBLIC',
      featured: app.featured ?? false,
      order: app.order ?? 1,
    });
    setIsCreatingNew(false);
  };

  const openNew = () => {
    setEditingApp(null);
    setFormData({
      name: '',
      tagline: '',
      description: '',
      platform: 'Android APK',
      version: 'v1.0.0',
      fileSize: '15.2 MB',
      downloadUrl: '',
      previewUrl: '',
      changelog: 'Initial production build release.',
      features: [],
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      featured: false,
      order: allApps.length + 1,
    });
    setIsCreatingNew(true);
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feat) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feat),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', text: 'App name is required.' });
      return;
    }

    setSaving(true);
    const docId = isCreatingNew
      ? `app-${Date.now().toString().slice(-4)}`
      : editingApp.id;

    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('apps', docId, payload, isCreatingNew);
    if (res.success) {
      setFeedback({ type: 'success', text: `App "${formData.name}" saved.` });
      setIsCreatingNew(false);
      setEditingApp(null);
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save app.' });
    }
    setSaving(false);
  };

  const handleDelete = async (app) => {
    if (!window.confirm(`Delete application entry "${app.name}"?`)) return;
    const res = await deleteItem('apps', app.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted "${app.name}".` });
      refreshAllData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-red-500" />
            <span>DISTRIBUTED APPS HUB MANAGER</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Manage installable packages, APK downloads, PWA links, release notes, and versioning.
          </p>
        </div>

        <button
          onClick={openNew}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
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

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allApps.map((app) => (
          <div
            key={app.id}
            className="rounded-xl bg-[#0c0d14] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-display text-white">{app.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/40 border border-red-500/30 text-red-400">
                      {app.version}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400 mt-0.5">{app.tagline}</p>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    app.status === 'PUBLISHED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-sans">{app.description}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                  {app.platform}
                </span>
                {app.fileSize && <span>Size: {app.fileSize}</span>}
              </div>

              {app.features && app.features.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Core Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {app.features.map((f) => (
                      <span key={f} className="px-2 py-0.5 rounded bg-[#13151f] text-[10px] font-mono text-neutral-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {app.downloadUrl && (
                  <a
                    href={app.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
                {app.previewUrl && (
                  <a
                    href={app.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(app)}
                  className="p-1.5 rounded-md bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-neutral-300 hover:text-white cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(app)}
                  className="p-1.5 rounded-md bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {allApps.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400">
            No application packages configured yet. Click &ldquo;Add Application&rdquo; above.
          </div>
        )}
      </div>

      {/* Modal Editor */}
      {(isCreatingNew || editingApp) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  {isCreatingNew ? 'NEW APPLICATION ENTRY' : `EDITING // ${formData.name}`}
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Application Hub Specifications
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingApp(null);
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
                    App Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sahil AI OS Mobile"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Platform Type
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    {APP_PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Offline-first AI mobile orchestration hub"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Release Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g. v2.1.0"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    placeholder="e.g. 18.4 MB"
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Download Link / Binary URL (APK or ZIP)
                </label>
                <input
                  type="text"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  App Highlights &amp; Features
                </label>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {formData.features.map((f) => (
                    <span key={f} className="px-2.5 py-1 rounded bg-[#171a25] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5">
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(f)}
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
                    placeholder="Add feature (e.g. Gemini 2.5 Flash, Zero Latency Cache)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on /apps)</option>
                    <option value="DRAFT">DRAFT (Private Staging)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featApp"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                  />
                  <label htmlFor="featApp" className="font-mono text-xs text-neutral-300 cursor-pointer">
                    Spotlight on Apps Hub header
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingApp(null);
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
                  <span>{saving ? 'Saving...' : 'Save App'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultApps;
