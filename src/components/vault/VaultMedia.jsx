import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem, deleteItem } from '../../lib/dbService';
import MediaUploadControl from './MediaUploadControl';
import {
  Image as ImageIcon,
  Copy,
  Check,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Filter,
} from 'lucide-react';

const MEDIA_CATEGORIES = [
  'Profile / Portrait',
  'Project Screenshot',
  'System Diagram',
  'Certificate',
  'App Icon',
  'Downloadable APK / File',
  'Resume / Document',
];

const VaultMedia = ({ openCreateSignal, clearCreateSignal }) => {
  const { media, refreshAllData } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);

  if (openCreateSignal && !isUploading) {
    setIsUploading(true);
    if (clearCreateSignal) clearCreateSignal();
  }

  const [formData, setFormData] = useState({
    title: '',
    category: 'Project Screenshot',
    url: '',
    altText: '',
    fileSize: '',
    fileType: 'image',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      setFeedback({ type: 'error', text: 'Asset title and URL/file are required.' });
      return;
    }

    setSaving(true);
    const docId = `media-${Date.now().toString().slice(-4)}`;
    const payload = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    const res = await saveItem('media', docId, payload, true);
    if (res.success) {
      setFeedback({ type: 'success', text: `Media asset "${formData.title}" added.` });
      setIsUploading(false);
      setFormData({
        title: '',
        category: 'Project Screenshot',
        url: '',
        altText: '',
        fileSize: '',
        fileType: 'image',
      });
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save media asset.' });
    }
    setSaving(false);
  };

  const handleCopyUrl = (item) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete media asset "${item.title}"?`)) return;
    const res = await deleteItem('media', item.id);
    if (res.success) {
      setFeedback({ type: 'success', text: `Deleted "${item.title}".` });
      refreshAllData();
    }
  };

  const filteredMedia = media.filter(
    (m) => selectedCategory === 'ALL' || m.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-500" />
            <span>MEDIA ASSET SYSTEM</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Central repository for diagrams, screenshots, portrait variants, icons, and binary distributions.
          </p>
        </div>

        <button
          onClick={() => setIsUploading(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Asset</span>
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

      {/* Filter toolbar */}
      <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-4 flex flex-wrap gap-3 items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400">
          <Filter className="w-4 h-4" />
          <span>Category:</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
        >
          <option value="ALL">All Media Categories ({media.length})</option>
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-[#0c0d14] border border-white/10 overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            {/* Thumbnail Preview */}
            <div className="relative aspect-video bg-[#08090e] flex items-center justify-center overflow-hidden border-b border-white/10">
              {item.url && item.url.startsWith('http') || item.url.startsWith('data:image') ? (
                <img
                  src={item.url}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="p-4 text-center text-xs font-mono text-neutral-400">
                  <ImageIcon className="w-8 h-8 mx-auto text-neutral-600 mb-1" />
                  <span>Binary / File Asset</span>
                </div>
              )}

              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-neutral-300 border border-white/10">
                {item.category}
              </span>
            </div>

            {/* Info and Actions */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold font-display text-white truncate" title={item.title}>
                  {item.title}
                </h4>
                {item.fileSize && (
                  <span className="text-[10px] font-mono text-neutral-500">{item.fileSize}</span>
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="px-2.5 py-1.5 rounded bg-[#141620] hover:bg-[#1d202e] border border-white/15 text-[11px] font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  title="Copy direct URL to clipboard"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-neutral-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 cursor-pointer"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400">
            No media assets found. Click &ldquo;Upload Asset&rdquo; above.
          </div>
        )}
      </div>

      {/* Upload Asset Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg my-8 rounded-2xl bg-[#0c0d14] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#10121a]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold">
                  MEDIA REPOSITORY
                </span>
                <h3 className="text-lg font-bold font-display text-white">
                  Add Media Asset
                </h3>
              </div>
              <button
                onClick={() => setIsUploading(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-sans text-neutral-300">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Asset Title / Label *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NeutraCap Architectural Diagram"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Category Tag
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none"
                >
                  {MEDIA_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-[#0e1017] border border-white/10">
                <label className="block font-mono text-[11px] text-neutral-300 uppercase font-semibold">
                  Upload Asset (Firebase Storage)
                </label>
                <MediaUploadControl
                  label="Select Media File to Upload"
                  folderPath="media"
                  accept="image/*,video/*,application/pdf"
                  currentUrl={formData.url}
                  onSuccess={(res) => {
                    if (res.downloadUrl) {
                      const sizeStr = res.fileSize ? `${(res.fileSize / 1024).toFixed(1)} KB` : '';
                      setFormData((prev) => ({
                        ...prev,
                        url: res.downloadUrl,
                        fileSize: sizeStr || prev.fileSize,
                        fileType: res.mimeType?.startsWith('video/') ? 'video' : 'image',
                        title: prev.title || res.fileName?.replace(/\.[^/.]+$/, '') || 'Media Asset',
                      }));
                    }
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Asset Web URL (or uploaded link):
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] text-neutral-400 uppercase">
                  Alt Text / Accessibility Context
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="e.g. High-contrast system topology visualization"
                  className="w-full min-h-[40px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
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
                  <span>{saving ? 'Adding...' : 'Add Media Asset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultMedia;
