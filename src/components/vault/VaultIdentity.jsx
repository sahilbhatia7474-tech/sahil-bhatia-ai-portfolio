import { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem } from '../../lib/dbService';
import { isValidHttpUrl } from '../../lib/projectLinks';
import { Save, Check, AlertCircle, RefreshCw, UserCheck, Eye, EyeOff, Film, Play, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadStorageAsset } from '../../lib/storageService';
import MediaUploadControl from './MediaUploadControl';

const VaultIdentity = () => {
  const { identity, refreshAllData } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    positioning: [],
    coreThemes: [],
    heroStatement: '',
    subStatement: '',
    bio: '',
    location: '',
    contactEmail: '',
    status: '',
    availability: '',
  });

  const [socialLinks, setSocialLinks] = useState({
    instagram: {
      url: '',
      label: 'Instagram',
      visibility: 'PUBLIC',
      sortOrder: 1,
    },
    linkedin: {
      url: 'https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2',
      label: 'LinkedIn',
      visibility: 'PUBLIC',
      sortOrder: 2,
    },
    github: {
      url: 'https://github.com/sahilbhatia7474-tech',
      label: 'GitHub',
      visibility: 'PUBLIC',
      sortOrder: 3,
    },
  });

  const [introVideo, setIntroVideo] = useState({
    enabled: false,
    videoUrl: '',
    videoSource: 'upload',
    videoPosterUrl: '',
    headline: 'Founder Introduction // Sahil Bhatia',
    subheadline: 'On building AI-native systems, agentic workflows, and digital operating leverage.',
    durationBadge: '90 SEC INTRO',
  });

  const [uploadProgress, setUploadProgress] = useState({ video: null, poster: null });
  const [newRole, setNewRole] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (identity) {
      setFormData({
        name: identity.name || '',
        headline: identity.headline || '',
        positioning: identity.positioning || [],
        coreThemes: identity.coreThemes || [],
        heroStatement: identity.heroStatement || '',
        subStatement: identity.subStatement || '',
        bio: identity.bio || identity.longBio || '',
        location: identity.location || 'Delhi NCR, India',
        contactEmail: identity.contactEmail || 'sahilbhatia7474@gmail.com',
        status: identity.status || 'ONLINE // OPERATIONAL',
        availability: identity.availability || 'AVAILABLE FOR SYSTEMS CONSULTATION',
      });

      if (identity.introVideo) {
        setIntroVideo({
          enabled: Boolean(identity.introVideo.enabled),
          videoUrl: identity.introVideo.videoUrl || '',
          videoSource: identity.introVideo.videoSource || 'upload',
          videoPosterUrl: identity.introVideo.videoPosterUrl || '',
          headline: identity.introVideo.headline || 'Founder Introduction // Sahil Bhatia',
          subheadline: identity.introVideo.subheadline || 'On building AI-native systems, agentic workflows, and digital operating leverage.',
          durationBadge: identity.introVideo.durationBadge || '90 SEC INTRO',
        });
      }

      const raw = identity.socialLinks || {};
      setSocialLinks({
        instagram: {
          url: raw.instagram?.url ?? (typeof raw.instagram === 'string' ? raw.instagram : ''),
          label: raw.instagram?.label || 'Instagram',
          visibility: raw.instagram?.visibility || 'PUBLIC',
          sortOrder: raw.instagram?.sortOrder ?? 1,
        },
        linkedin: {
          url: (raw.linkedin?.url && raw.linkedin.url.includes('sahil-bhatia-b3bb3a3a2'))
            ? raw.linkedin.url
            : (typeof raw.linkedin === 'string' && raw.linkedin.includes('sahil-bhatia-b3bb3a3a2')
              ? raw.linkedin
              : 'https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2'),
          label: raw.linkedin?.label || 'LinkedIn',
          visibility: raw.linkedin?.visibility || 'PUBLIC',
          sortOrder: raw.linkedin?.sortOrder ?? 2,
        },
        github: {
          url: (raw.github?.url && raw.github.url.includes('github.com'))
            ? raw.github.url
            : (typeof raw.github === 'string' && raw.github.includes('github.com')
              ? raw.github
              : 'https://github.com/sahilbhatia7474-tech'),
          label: raw.github?.label || 'GitHub',
          visibility: raw.github?.visibility || 'PUBLIC',
          sortOrder: raw.github?.sortOrder ?? 3,
        },
      });
    }
  }, [identity]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (network, field, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [network]: {
        ...prev[network],
        [field]: value,
      },
    }));
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (newRole.trim() && !formData.positioning.includes(newRole.trim())) {
      setFormData((prev) => ({
        ...prev,
        positioning: [...prev.positioning, newRole.trim()],
      }));
      setNewRole('');
    }
  };

  const handleRemoveRole = (role) => {
    setFormData((prev) => ({
      ...prev,
      positioning: prev.positioning.filter((r) => r !== role),
    }));
  };

  const handleAddTheme = (e) => {
    e.preventDefault();
    if (newTheme.trim() && !formData.coreThemes.includes(newTheme.trim().toUpperCase())) {
      setFormData((prev) => ({
        ...prev,
        coreThemes: [...prev.coreThemes, newTheme.trim().toUpperCase()],
      }));
      setNewTheme('');
    }
  };

  const handleRemoveTheme = (theme) => {
    setFormData((prev) => ({
      ...prev,
      coreThemes: prev.coreThemes.filter((t) => t !== theme),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Validate social URLs before saving
    const networks = ['instagram', 'linkedin', 'github'];
    for (const net of networks) {
      const url = (socialLinks[net]?.url || '').trim();
      if (url && !isValidHttpUrl(url)) {
        setMessage({
          type: 'error',
          text: `Validation Error: Invalid URL for ${socialLinks[net]?.label || net}. Please enter a valid URL starting with http:// or https://`,
        });
        setSaving(false);
        return;
      }
    }

    const payload = {
      name: formData.name,
      headline: formData.headline,
      positioning: formData.positioning,
      coreThemes: formData.coreThemes,
      heroStatement: formData.heroStatement,
      subStatement: formData.subStatement,
      bio: formData.bio,
      location: formData.location,
      contactEmail: formData.contactEmail,
      socialLinks: {
        instagram: {
          url: (socialLinks.instagram.url || '').trim(),
          label: socialLinks.instagram.label || 'Instagram',
          visibility: socialLinks.instagram.visibility || 'PUBLIC',
          sortOrder: Number(socialLinks.instagram.sortOrder) || 1,
        },
        linkedin: {
          url: (socialLinks.linkedin.url || '').trim(),
          label: socialLinks.linkedin.label || 'LinkedIn',
          visibility: socialLinks.linkedin.visibility || 'PUBLIC',
          sortOrder: Number(socialLinks.linkedin.sortOrder) || 2,
        },
        github: {
          url: (socialLinks.github.url || '').trim(),
          label: socialLinks.github.label || 'GitHub',
          visibility: socialLinks.github.visibility || 'PUBLIC',
          sortOrder: Number(socialLinks.github.sortOrder) || 3,
        },
      },
      status: formData.status,
      availability: formData.availability,
      introVideo: {
        enabled: Boolean(introVideo.enabled),
        videoUrl: (introVideo.videoUrl || '').trim(),
        videoSource: introVideo.videoSource || 'upload',
        videoPosterUrl: (introVideo.videoPosterUrl || '').trim(),
        headline: (introVideo.headline || '').trim(),
        subheadline: (introVideo.subheadline || '').trim(),
        durationBadge: (introVideo.durationBadge || '').trim(),
      },
    };

    const res = await saveItem('identity', 'primary', payload);
    if (res.success) {
      setMessage({ type: 'success', text: 'Identity metadata & social links updated successfully in Firestore.' });
      refreshAllData();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update identity.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-red-500" />
            <span>IDENTITY & PROFILE MANAGEMENT</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Controls global name, headline, bio, core themes, and availability indicators.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Synchronizing...' : 'Save Identity'}</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 text-xs font-mono ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border border-red-500/40 text-red-300'
          }`}
        >
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Professional Headline
            </label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Hero Display Statement */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Display Hero Statement (&ldquo;I build AI-powered digital experiences.&rdquo;)
          </label>
          <input
            type="text"
            value={formData.heroStatement}
            onChange={(e) => handleChange('heroStatement', e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Sub-statement */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Sub-Statement / Mission Summary
          </label>
          <textarea
            rows={2}
            value={formData.subStatement}
            onChange={(e) => handleChange('subStatement', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Long Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Extended Architectural Bio
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Primary Positioning Roles */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Positioning Roles (Pills on Hero)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.positioning.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded bg-[#161822] border border-white/15 text-xs font-mono text-white flex items-center gap-2"
              >
                <span>{role}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
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
              placeholder="Add positioning role (e.g. AI-Native Builder)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleAddRole}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-semibold cursor-pointer"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Core Themes */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
            Core Themes Tags (e.g. #AI + SYSTEMS, #VIBE CODING)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.coreThemes.map((theme) => (
              <span
                key={theme}
                className="px-2.5 py-1 rounded text-xs font-mono bg-red-950/30 border border-red-500/30 text-red-300 flex items-center gap-1.5"
              >
                <span>#{theme}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTheme(theme)}
                  className="text-neutral-400 hover:text-red-300 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add theme tag (e.g. AGENTIC WORKFLOWS)"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
            />
            <button
              type="button"
              onClick={handleAddTheme}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-semibold cursor-pointer"
            >
              Add Theme
            </button>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Operational Base / Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[#0e1017] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Social Links — Authoritative Architecture (Instagram, LinkedIn, GitHub) */}
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider font-bold">
                Authoritative Social Links (Vault Identity)
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Instagram &bull; LinkedIn &bull; GitHub (Twitter / X Removed)
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 font-sans">
              Enter exact URLs for your public social links. URLs must start with http:// or https://. Empty links are never displayed publicly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Instagram (Configurable by Founder, not invented) */}
            <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">01 // INSTAGRAM</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSocialChange(
                      'instagram',
                      'visibility',
                      socialLinks.instagram.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC'
                    )
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                    socialLinks.instagram.visibility === 'PUBLIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 border border-white/10'
                  }`}
                >
                  {socialLinks.instagram.visibility === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{socialLinks.instagram.visibility}</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourhandle"
                  value={socialLinks.instagram.url}
                  onChange={(e) => handleSocialChange('instagram', 'url', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
                <span className="text-[10px] font-mono text-neutral-500 block">
                  Leave empty if not yet active; never displayed empty.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Label</label>
                  <input
                    type="text"
                    value={socialLinks.instagram.label}
                    onChange={(e) => handleSocialChange('instagram', 'label', e.target.value)}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Order</label>
                  <input
                    type="number"
                    value={socialLinks.instagram.sortOrder}
                    onChange={(e) => handleSocialChange('instagram', 'sortOrder', Number(e.target.value))}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. LinkedIn (Verified URL) */}
            <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">02 // LINKEDIN</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSocialChange(
                      'linkedin',
                      'visibility',
                      socialLinks.linkedin.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC'
                    )
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                    socialLinks.linkedin.visibility === 'PUBLIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 border border-white/10'
                  }`}
                >
                  {socialLinks.linkedin.visibility === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{socialLinks.linkedin.visibility}</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={socialLinks.linkedin.url}
                  onChange={(e) => handleSocialChange('linkedin', 'url', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
                <span className="text-[10px] font-mono text-emerald-400/80 block">
                  Verified authoritative profile link
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Label</label>
                  <input
                    type="text"
                    value={socialLinks.linkedin.label}
                    onChange={(e) => handleSocialChange('linkedin', 'label', e.target.value)}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Order</label>
                  <input
                    type="number"
                    value={socialLinks.linkedin.sortOrder}
                    onChange={(e) => handleSocialChange('linkedin', 'sortOrder', Number(e.target.value))}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. GitHub (Verified URL) */}
            <div className="p-4 rounded-xl bg-[#0c0e14] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-red-400">03 // GITHUB</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSocialChange(
                      'github',
                      'visibility',
                      socialLinks.github.visibility === 'PUBLIC' ? 'HIDDEN' : 'PUBLIC'
                    )
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors ${
                    socialLinks.github.visibility === 'PUBLIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 border border-white/10'
                  }`}
                >
                  {socialLinks.github.visibility === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{socialLinks.github.visibility}</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={socialLinks.github.url}
                  onChange={(e) => handleSocialChange('github', 'url', e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
                <span className="text-[10px] font-mono text-emerald-400/80 block">
                  Verified authoritative profile link
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Label</label>
                  <input
                    type="text"
                    value={socialLinks.github.label}
                    onChange={(e) => handleSocialChange('github', 'label', e.target.value)}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">Order</label>
                  <input
                    type="number"
                    value={socialLinks.github.sortOrder}
                    onChange={(e) => handleSocialChange('github', 'sortOrder', Number(e.target.value))}
                    className="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 04. FUTURE INTRO VIDEO SYSTEM (ARCHITECTURE) */}
        <div className="p-5 rounded-xl bg-[#0e1017] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  FOUNDER INTRO VIDEO ARCHITECTURE
                </h3>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                Cinematic video presentation system. When disabled, zero broken players or placeholders are displayed.
              </p>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <span className="font-mono text-xs text-neutral-300">
                {introVideo.enabled ? 'ACTIVE ON HERO' : 'DISABLED (STANDBY)'}
              </span>
              <div
                onClick={() => setIntroVideo((prev) => ({ ...prev, enabled: !prev.enabled }))}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  introVideo.enabled ? 'bg-red-600' : 'bg-neutral-800 border border-white/15'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    introVideo.enabled ? 'left-6' : 'left-1'
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Source & URL */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-mono text-neutral-400 uppercase">Video Source:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIntroVideo((prev) => ({ ...prev, videoSource: 'upload' }))}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer ${
                      introVideo.videoSource === 'upload'
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    Storage Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntroVideo((prev) => ({ ...prev, videoSource: 'external' }))}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer ${
                      introVideo.videoSource === 'external'
                        ? 'bg-red-600 text-white font-bold'
                        : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    External Link / Embed
                  </button>
                </div>
              </div>

              {introVideo.videoSource === 'upload' ? (
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                    Upload MP4/WebM Video (Max 100MB)
                  </label>
                  <MediaUploadControl
                    label="Choose Intro Video"
                    mediaType="video"
                    folderPath="identity/intro"
                    accept="video/mp4,video/webm,video/quicktime"
                    currentUrl={introVideo.videoUrl}
                    onSuccess={(res) => {
                      if (res.downloadUrl) {
                        setIntroVideo((prev) => ({ ...prev, videoUrl: res.downloadUrl }));
                      }
                    }}
                  />
                  {introVideo.videoUrl && (
                    <div className="text-[10px] font-mono text-emerald-400 truncate">
                      Asset: {introVideo.videoUrl}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                    External Video URL (YouTube, Vimeo, MP4 link)
                  </label>
                  <input
                    type="url"
                    value={introVideo.videoUrl}
                    onChange={(e) => setIntroVideo((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtu.be/..."
                    className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              )}

              {/* Poster Image */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  Video Poster Image
                </label>
                <div className="space-y-2">
                  <MediaUploadControl
                    label="Select Poster Image"
                    folderPath="identity/posters"
                    accept="image/*"
                    currentUrl={introVideo.videoPosterUrl}
                    onSuccess={(res) => {
                      if (res.downloadUrl) {
                        setIntroVideo((prev) => ({ ...prev, videoPosterUrl: res.downloadUrl }));
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={introVideo.videoPosterUrl}
                    onChange={(e) => setIntroVideo((prev) => ({ ...prev, videoPosterUrl: e.target.value }))}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Video Copy & Duration Metadata */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  Video Modal Headline
                </label>
                <input
                  type="text"
                  value={introVideo.headline}
                  onChange={(e) => setIntroVideo((prev) => ({ ...prev, headline: e.target.value }))}
                  placeholder="Founder Introduction // Sahil Bhatia"
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  Subheadline / Abstract
                </label>
                <textarea
                  rows={2}
                  value={introVideo.subheadline}
                  onChange={(e) => setIntroVideo((prev) => ({ ...prev, subheadline: e.target.value }))}
                  placeholder="On building AI-native systems, agentic workflows..."
                  className="w-full p-2.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-sans focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                  Duration Badge Text
                </label>
                <input
                  type="text"
                  value={introVideo.durationBadge}
                  onChange={(e) => setIntroVideo((prev) => ({ ...prev, durationBadge: e.target.value }))}
                  placeholder="90 SEC INTRO"
                  className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VaultIdentity;
