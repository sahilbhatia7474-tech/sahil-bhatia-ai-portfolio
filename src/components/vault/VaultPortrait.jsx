import { useState, useEffect, useRef } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem } from '../../lib/dbService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../lib/authContext';
import MediaUploadControl from './MediaUploadControl';
import FeaturedBuilderCard3D from '../FeaturedBuilderCard3D';
import { Save, Sparkles, Check, AlertCircle, RefreshCw, Crosshair, Eye, CheckCircle2, Type, Upload } from 'lucide-react';

const OFFICIAL_PORTRAIT_URL = 'https://i.ibb.co/svvJ3Fnc/793090671-2240593123170371-3167005344409012686-n.jpg';

const PORTRAIT_PRESETS = [
  {
    name: 'Sahil Bhatia — Cybernetic Systems (Official Direct Photo)',
    url: 'https://i.ibb.co/svvJ3Fnc/793090671-2240593123170371-3167005344409012686-n.jpg',
    focalX: 50,
    focalY: 20,
  },
  {
    name: 'Sahil Bhatia — Cybernetic Systems (Vector)',
    url: '/sahil-bhatia-portrait.svg',
    focalX: 50,
    focalY: 20,
  },
  {
    name: 'Sahil Bhatia — Studio Asset Path',
    url: '/assets/sahil-bhatia-portrait.svg',
    focalX: 50,
    focalY: 20,
  },
];

const VaultPortrait = () => {
  const { featuredPortrait, refreshAllData } = usePortfolioData();
  const { isFounder } = useAuth();
  const autoSyncedRef = useRef(false);

  // Core Visual & Positioning State
  const [imageUrl, setImageUrl] = useState(OFFICIAL_PORTRAIT_URL);
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(20);
  const [altText, setAltText] = useState('Sahil Bhatia — AI-Native Builder and Systems Architect');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [featured, setFeatured] = useState(true);
  const [publicationState, setPublicationState] = useState('PUBLISHED');

  // Founder Card Typography & HUD Copy State
  const [header, setHeader] = useState('FOUNDER CARD');
  const [role, setRole] = useState('SYSTEMS ARCHITECT');
  const [description, setDescription] = useState('Designing scalable systems.\nBuilding intelligent solutions.');
  const [statusLabel, setStatusLabel] = useState('SYSTEM STATUS');
  const [status, setStatus] = useState('ACTIVE');
  const [name, setName] = useState('SAHIL BHATIA');
  const [positioning, setPositioning] = useState('AI-NATIVE BUILDER • SYSTEMS ARCHITECT');
  const [capabilitiesStr, setCapabilitiesStr] = useState('AI AGENTS, WORKFLOWS, AUTOMATION');
  const [capabilityVectorsStr, setCapabilityVectorsStr] = useState('AI SYSTEMS ARCHITECTURE, AI-NATIVE DEVELOPMENT, AUTOMATION & WORKFLOWS');
  const [footerLead, setFooterLead] = useState('BUILDING INTELLIGENT SYSTEMS');
  const [footerSub, setFooterSub] = useState('FOR REAL IMPACT.');

  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePortraitUploadSuccess = (res) => {
    if (res.downloadUrl) {
      setImageUrl(res.downloadUrl);
      setMessage({
        type: 'success',
        text: 'Uploaded to Firebase Storage, verified, and persisted to Firestore.',
      });
      setIsSaved(true);
      refreshAllData();
    }
  };

  useEffect(() => {
    if (featuredPortrait) {
      let currentUrl = featuredPortrait.imageUrl?.trim();
      if (!currentUrl || currentUrl === '/sahil-bhatia-portrait.svg' || currentUrl === '/assets/sahil-bhatia-portrait.svg' || currentUrl.includes('photo-1534528741775-53994a69daeb') || currentUrl.includes('images.unsplash.com')) {
        currentUrl = OFFICIAL_PORTRAIT_URL;
      }
      setImageUrl(currentUrl);
      setFocalX(featuredPortrait.focalX ?? 50);
      setFocalY(featuredPortrait.focalY ?? 20);
      setAltText(featuredPortrait.altText || 'Sahil Bhatia — AI-Native Builder and Systems Architect');
      setVisibility(featuredPortrait.visibility || 'PUBLIC');
      setFeatured(featuredPortrait.featured ?? true);
      setPublicationState(featuredPortrait.publicationState || 'PUBLISHED');

      if (featuredPortrait.header) setHeader(featuredPortrait.header);
      if (featuredPortrait.role) setRole(featuredPortrait.role);
      if (featuredPortrait.description) setDescription(featuredPortrait.description);
      if (featuredPortrait.statusLabel) setStatusLabel(featuredPortrait.statusLabel);
      if (featuredPortrait.status) setStatus(featuredPortrait.status);
      if (featuredPortrait.name) setName(featuredPortrait.name);
      if (featuredPortrait.positioning) setPositioning(featuredPortrait.positioning);
      if (Array.isArray(featuredPortrait.capabilities)) {
        setCapabilitiesStr(featuredPortrait.capabilities.join(', '));
      }
      if (Array.isArray(featuredPortrait.capabilityVectors)) {
        setCapabilityVectorsStr(featuredPortrait.capabilityVectors.join(', '));
      }
      if (featuredPortrait.footerLead) setFooterLead(featuredPortrait.footerLead);
      if (featuredPortrait.footerSub) setFooterSub(featuredPortrait.footerSub);
    }
  }, [featuredPortrait]);

  const handleSave = async (overrideUrl = null) => {
    setSaving(true);
    setIsSaved(false);
    setMessage(null);

    const capabilities = capabilitiesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const capabilityVectors = capabilityVectorsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Step 1: Sanitize image source - never permit unsplash
    let cleanImageUrl = (typeof overrideUrl === 'string' && overrideUrl.trim()) ? overrideUrl.trim() : imageUrl.trim();
    if (!cleanImageUrl || cleanImageUrl.includes('photo-1534528741775-53994a69daeb') || cleanImageUrl.includes('images.unsplash.com')) {
      cleanImageUrl = OFFICIAL_PORTRAIT_URL;
    }

    // Step 2: Collect all card fields
    const payload = {
      imageUrl: cleanImageUrl,
      focalX: Number(focalX),
      focalY: Number(focalY),
      altText: altText.trim() || 'Sahil Bhatia — AI-Native Builder and Systems Architect',
      visibility,
      featured,
      publicationState,
      header: header.trim(),
      role: role.trim(),
      description: description.trim(),
      statusLabel: statusLabel.trim(),
      status: status.trim(),
      name: name.trim(),
      positioning: positioning.trim(),
      capabilities,
      capabilityVectors,
      footerLead: footerLead.trim(),
      footerSub: footerSub.trim(),
      updatedAt: new Date().toISOString(),
    };

    // Step 3: Save configuration to Firestore
    const res = await saveItem('featuredPortrait', 'primary', payload);
    if (res.success) {
      // Step 4 & 5: Read back document from Firestore to verify write
      try {
        const readBackSnap = await getDoc(doc(db, 'featuredPortrait', 'primary'));
        if (readBackSnap.exists()) {
          const data = readBackSnap.data();
          // Step 6: Confirm the saved values
          setImageUrl(data.imageUrl || OFFICIAL_PORTRAIT_URL);
          setFocalX(Number(data.focalX ?? 50));
          setFocalY(Number(data.focalY ?? 20));
          setAltText(data.altText || '');
          setVisibility(data.visibility || 'PUBLIC');
          setFeatured(data.featured ?? true);
          setPublicationState(data.publicationState || 'PUBLISHED');

          // Step 7: Only then display SAVED TO FOUNDER VAULT
          setIsSaved(true);
          setMessage({
            type: 'success',
            text: 'SAVED TO FOUNDER VAULT'
          });
          refreshAllData();
          setTimeout(() => setIsSaved(false), 4000);
        } else {
          setMessage({
            type: 'error',
            text: 'Document write did not return verified state from Firestore.'
          });
        }
      } catch (verifyErr) {
        console.error('Read-back verification error:', verifyErr);
        setMessage({
          type: 'error',
          text: `Firestore verification error: ${verifyErr.message}`
        });
      }
    } else {
      // Step 8: If Firestore write fails, display error and DO NOT show success
      setMessage({
        type: 'error',
        text: res.error || 'Failed to persist Founder Card configuration to Firestore.'
      });
    }
    setSaving(false);
  };

  // Auto-sync portrait if founder authenticated and still pointing to outdated default
  useEffect(() => {
    if (isFounder && featuredPortrait && !autoSyncedRef.current) {
      const currentUrl = featuredPortrait.imageUrl?.trim();
      if (currentUrl !== OFFICIAL_PORTRAIT_URL && (!currentUrl || currentUrl === '/sahil-bhatia-portrait.svg' || currentUrl === '/assets/sahil-bhatia-portrait.svg' || currentUrl.includes('unsplash'))) {
        autoSyncedRef.current = true;
        saveItem('featuredPortrait', 'primary', {
          ...featuredPortrait,
          imageUrl: OFFICIAL_PORTRAIT_URL,
          focalX: 50,
          focalY: 20,
          visibility: 'PUBLIC',
          publicationState: 'PUBLISHED',
          updatedAt: new Date().toISOString(),
        }).catch((err) => console.warn('Auto-sync note:', err.message));
      }
    }
  }, [isFounder, featuredPortrait]);

  const currentPreviewData = {
    imageUrl,
    focalX: Number(focalX),
    focalY: Number(focalY),
    altText,
    visibility,
    featured,
    publicationState,
    header,
    role,
    description,
    statusLabel,
    status,
    name,
    positioning,
    capabilities: capabilitiesStr.split(',').map((s) => s.trim()).filter(Boolean),
    capabilityVectors: capabilityVectorsStr.split(',').map((s) => s.trim()).filter(Boolean),
    footerLead,
    footerSub,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-semibold">
              FOUNDER CONTROL // PORTFOLIO OS
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>FOUNDER CARD ARCHITECTURE</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Calibrate the 3D collectible founder card, portrait focal geometry, identity copy, and publication state.
          </p>
        </div>

        <button
          id="btn-save-founder-card"
          onClick={() => handleSave()}
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying Firestore...</span>
            </>
          ) : isSaved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>SAVED TO FOUNDER VAULT</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Founder Card</span>
            </>
          )}
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
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
          <span className="break-words">{message.text}</span>
        </div>
      )}

      {/* Two Column Layout: Controls on Left, Real-Time 3D Card Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Image Source Selection */}
          <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-red-400" />
              <span>Portrait Image Source</span>
            </h3>

            {/* Direct Image URL input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">
                Image Web URL or Firebase Storage Link:
              </label>
              <input
                id="input-portrait-image-source"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Firebase Storage Unified File Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">
                Upload New Image (Firebase Storage):
              </label>
              <MediaUploadControl
                label="Choose Founder Portrait Image"
                folderPath="portraits"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                currentUrl={imageUrl}
                persistConfig={{
                  collectionName: 'featuredPortrait',
                  docId: 'primary',
                  fieldName: 'imageUrl',
                  additionalFields: {
                    focalX: Number(focalX),
                    focalY: Number(focalY),
                    altText: altText.trim() || 'Sahil Bhatia — AI-Native Builder and Systems Architect',
                    visibility,
                    featured,
                    publicationState,
                    name: name.trim(),
                    role: role.trim(),
                  }
                }}
                onSuccess={handlePortraitUploadSuccess}
              />
            </div>

            {/* Curated Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                Curated Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PORTRAIT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setFocalX(preset.focalX);
                      setFocalY(preset.focalY);
                    }}
                    className="p-2 rounded bg-[#12141c] hover:bg-[#181b26] border border-white/10 text-left text-xs font-mono text-neutral-300 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-white truncate">{preset.name}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Focal: {preset.focalX}% / {preset.focalY}%</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Focal Calibration & Spatial Offsets */}
          <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-red-400" />
              <span>Focal Center & Crop Calibration (Recommended: X=50%, Y=20%)</span>
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Keep horizontally centered (50%) and adjust vertical calibration (default 20%) so the founder face remains clearly visible near the top.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Horizontal Alignment (X):</span>
                  <span className="text-red-400 font-bold">{focalX}%</span>
                </div>
                <input
                  id="input-focal-x"
                  type="range"
                  min="0"
                  max="100"
                  value={focalX}
                  onChange={(e) => setFocalX(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-400">Vertical Alignment (Y):</span>
                  <span className="text-red-400 font-bold">{focalY}%</span>
                </div>
                <input
                  id="input-focal-y"
                  type="range"
                  min="0"
                  max="100"
                  value={focalY}
                  onChange={(e) => setFocalY(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setFocalX(50);
                  setFocalY(20);
                }}
                className="text-[11px] font-mono text-neutral-400 hover:text-red-300 underline cursor-pointer"
              >
                Reset to Recommended Defaults (X: 50%, Y: 20%)
              </button>
            </div>
          </div>

          {/* Founder Card Copy & HUD Structure */}
          <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-red-400" />
              <span>Founder Card Typography & Content</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Header</label>
                <input
                  type="text"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400 uppercase">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Status Label</label>
                <input
                  type="text"
                  value={statusLabel}
                  onChange={(e) => setStatusLabel(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Status</label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Founder Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Positioning</label>
                <input
                  type="text"
                  value={positioning}
                  onChange={(e) => setPositioning(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400 uppercase">
                Capability Vectors (comma-separated)
              </label>
              <input
                type="text"
                value={capabilityVectorsStr}
                onChange={(e) => setCapabilityVectorsStr(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400 uppercase">
                Core Capabilities (comma-separated)
              </label>
              <input
                type="text"
                value={capabilitiesStr}
                onChange={(e) => setCapabilitiesStr(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Footer Lead</label>
                <input
                  type="text"
                  value={footerLead}
                  onChange={(e) => setFooterLead(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">Footer Sub</label>
                <input
                  type="text"
                  value={footerSub}
                  onChange={(e) => setFooterSub(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Metadata & Visibility */}
          <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-5 space-y-4">
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-400" />
              <span>Card Metadata & Visibility</span>
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400 uppercase">
                Alt Text / Accessibility Description:
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">
                  Visibility Status
                </label>
                <select
                  id="select-card-visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="PUBLIC">PUBLIC (Shown on Hero)</option>
                  <option value="PRIVATE">PRIVATE (Hidden)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-neutral-400 uppercase">
                  Publication State
                </label>
                <select
                  id="select-card-publication-state"
                  value={publicationState}
                  onChange={(e) => setPublicationState(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                >
                  <option value="PUBLISHED">PUBLISHED (Live)</option>
                  <option value="DRAFT">DRAFT (Vault Only)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featuredCard"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-red-500 rounded cursor-pointer"
              />
              <label htmlFor="featuredCard" className="text-xs font-mono text-neutral-300 cursor-pointer">
                Featured Collectible Card Status (Hero Spotlight)
              </label>
            </div>
          </div>

        </div>

        {/* Real-time Interactive 3D Card Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-3 sticky top-6">
          <div className="w-full flex items-center justify-between px-2 font-mono text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE 3D CARD SIMULATOR
            </span>
            <span>INTERACTIVE PREVIEW</span>
          </div>

          {/* Embedded Card */}
          <div className="w-full flex justify-center p-4 rounded-2xl bg-[#06070a] border border-white/10 shadow-inner">
            <FeaturedBuilderCard3D
              featuredPortrait={currentPreviewData}
              inVault={true}
            />
          </div>

          <p className="text-[11px] font-mono text-neutral-400 text-center max-w-xs">
            Physical tilt constraints (&plusmn;8&deg; X, &plusmn;12&deg; Y), multi-layer depth parallax, and embedded soft vignette merging.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VaultPortrait;
