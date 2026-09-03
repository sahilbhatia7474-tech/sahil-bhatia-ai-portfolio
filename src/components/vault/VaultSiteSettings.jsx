import { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveSiteSettings, seedInitialDatabase } from '../../lib/dbService';
import {
  Settings,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Database,
} from 'lucide-react';

const VaultSiteSettings = () => {
  const { siteSettings, refreshAllData } = usePortfolioData();
  const [formData, setFormData] = useState({
    title: 'SAHIL BHATIA — AI PORTFOLIO & SYSTEMS',
    domain: 'SAHIL / PORTFOLIO OS',
    systemName: 'SAHIL / PORTFOLIO OS',
    version: 'v2.6.4',
    brandSubtitle: 'AI SYSTEMS ARCHITECT & BUILDER',
    contactEmail: 'sahilbhatia7474@gmail.com',
    announcementBanner: 'FOUNDER VAULT CMS ACTIVE // LIVE FIRESTORE SYNCHRONIZATION',
    showAnnouncement: false,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedFeedback, setSeedFeedback] = useState(null);

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        title: siteSettings.title || 'SAHIL BHATIA — AI PORTFOLIO & SYSTEMS',
        domain: siteSettings.domain || 'SAHIL / PORTFOLIO OS',
        systemName: siteSettings.systemName || 'SAHIL / PORTFOLIO OS',
        version: siteSettings.version || 'v2.6.4',
        brandSubtitle: siteSettings.brandSubtitle || 'AI SYSTEMS ARCHITECT & BUILDER',
        contactEmail: siteSettings.contactEmail || 'sahilbhatia7474@gmail.com',
        announcementBanner: siteSettings.announcementBanner || '',
        showAnnouncement: siteSettings.showAnnouncement ?? false,
        maintenanceMode: siteSettings.maintenanceMode ?? false,
      });
    }
  }, [siteSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const res = await saveSiteSettings(formData);
    if (res.success) {
      setFeedback({ type: 'success', text: 'Global site settings saved to Firestore.' });
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save site settings.' });
    }
    setSaving(false);
  };

  const handleSeedDatabase = async (force = false) => {
    setSeeding(true);
    setSeedFeedback(null);
    try {
      const res = await seedInitialDatabase(force);
      if (res.seeded) {
        setSeedFeedback({ type: 'success', text: 'Database synchronized with verified founder presets.' });
        refreshAllData();
      } else {
        setSeedFeedback({ type: 'info', text: res.message || res.error || 'Database already initialized.' });
      }
    } catch (err) {
      setSeedFeedback({ type: 'error', text: err.message || 'Operation could not complete.' });
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-5 h-5 text-red-500" />
            <span>GLOBAL SITE SETTINGS & METADATA</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Domain configuration, system version string, announcement broadcast, and emergency controls.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Syncing...' : 'Save Site Settings'}</span>
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

      {/* Form Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase">
              Brand / Site Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase">
              Target Domain *
            </label>
            <input
              type="text"
              value={formData.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase">
              Internal System Name
            </label>
            <input
              type="text"
              value={formData.systemName}
              onChange={(e) => handleChange('systemName', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase">
              System Version
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => handleChange('version', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase">
              Contact / Inquiry Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="p-5 rounded-xl bg-[#0c0d14] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono text-white uppercase font-bold">
              Top Announcement Banner
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showAnn"
                checked={formData.showAnnouncement}
                onChange={(e) => handleChange('showAnnouncement', e.target.checked)}
                className="w-4 h-4 accent-red-500 rounded cursor-pointer"
              />
              <label htmlFor="showAnn" className="text-xs font-mono text-neutral-300 cursor-pointer">
                Display Announcement
              </label>
            </div>
          </div>
          <input
            type="text"
            value={formData.announcementBanner}
            onChange={(e) => handleChange('announcementBanner', e.target.value)}
            placeholder="e.g. Currently accepting high-impact AI consultations for Q2"
            className="w-full min-h-[42px] px-3.5 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Emergency Maintenance Mode */}
        <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>MAINTENANCE MODE CONTROL</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                When active, public visitors will see a dignified systems maintenance screen while the Founder continues editing in the Vault.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="maintMode"
                checked={formData.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-5 h-5 accent-red-500 rounded cursor-pointer"
              />
              <label htmlFor="maintMode" className="text-xs font-mono text-red-300 font-bold cursor-pointer">
                ENABLE MAINTENANCE
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* Database Calibration and Initialization Card */}
      <div className="p-5 rounded-xl bg-[#0d0f18] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-mono text-xs uppercase font-bold">
              <Database className="w-4 h-4 text-red-500" />
              <span>DATABASE SYNCHRONIZATION & PRESETS</span>
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              Populate or re-sync Firestore collections with authoritative presets (Identity, Projects, AI Systems, Apps, Journey, Certificates).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={seeding}
              onClick={() => handleSeedDatabase(false)}
              className="min-h-[38px] px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {seeding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>Sync Presets</span>
            </button>
            <button
              type="button"
              disabled={seeding}
              onClick={() => handleSeedDatabase(true)}
              className="min-h-[38px] px-4 py-2 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-300 font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Force Re-seed</span>
            </button>
          </div>
        </div>

        {seedFeedback && (
          <div
            className={`p-3 rounded text-xs font-mono flex items-center justify-between gap-2 ${
              seedFeedback.type === 'success'
                ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                : seedFeedback.type === 'info'
                ? 'bg-blue-950/40 border border-blue-500/40 text-blue-300'
                : 'bg-red-950/40 border border-red-500/40 text-red-300'
            }`}
          >
            <span>{seedFeedback.text}</span>
            <button type="button" onClick={() => setSeedFeedback(null)} className="text-neutral-400 hover:text-white cursor-pointer">
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultSiteSettings;
