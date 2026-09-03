import { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem } from '../../lib/dbService';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import { storage, db } from '../../lib/firebase';
import FeaturedBuilderCard3D from '../FeaturedBuilderCard3D';
import { Save, Sparkles, Upload, Check, AlertCircle, RefreshCw, Crosshair, Eye, CheckCircle2, Type } from 'lucide-react';

const PORTRAIT_PRESETS = [
  {
    name: 'Cinematic Ambient (Default)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 20,
  },
  {
    name: 'High-Contrast Studio Dark',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 20,
  },
  {
    name: 'Executive Systems Architectural',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 22,
  },
];

const VaultPortrait = () => {
  const { featuredPortrait, refreshAllData } = usePortfolioData();

  // Core Visual & Positioning State
  const [imageUrl, setImageUrl] = useState('');
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (featuredPortrait) {
      setImageUrl(featuredPortrait.imageUrl || PORTRAIT_PRESETS[0].url);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Invalid file type. Please upload a valid image (JPEG, PNG, WebP, GIF).',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'File size exceeds 10MB. Please select an optimized image under 10MB.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `portraits/${timestamp}_${sanitizedName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Firebase Storage upload error:', error);
          setMessage({
            type: 'error',
            text: `Firebase Storage upload failed (${error.code || error.message}). You can also paste an image URL directly below.`
          });
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadUrl);
            setIsUploading(false);
            setMessage({
              type: 'success',
              text: 'Image uploaded to Firebase Storage. Click "Save Founder Card" to verify and persist to Firestore.'
            });
          } catch (urlErr) {
            console.error('Failed to get download URL:', urlErr);
            setMessage({ type: 'error', text: 'Failed to retrieve uploaded image URL from Firebase Storage.' });
            setIsUploading(false);
          }
        }
      );
    } catch (err) {
      console.error('Upload initiation error:', err);
      setMessage({ type: 'error', text: `Upload initialization error: ${err.message}` });
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
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

    const payload = {
      imageUrl: imageUrl.trim(),
      focalX: Number(focalX),
      focalY: Number(focalY),
      altText: altText.trim(),
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
          setImageUrl(data.imageUrl || '');
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
      setMessage({
        type: 'error',
        text: res.error || 'Failed to persist Founder Card configuration to Firestore.'
      });
    }
    setSaving(false);
  };

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
          onClick={handleSave}
          disabled={saving || isUploading}
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
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Firebase Storage File Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">
                Upload New Image (Firebase Storage):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="w-full text-xs font-mono text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-red-600/20 file:border file:border-red-500/30 file:text-red-200 hover:file:bg-red-600/30 file:cursor-pointer"
              />
              {isUploading && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                    <span>Uploading to Firebase Storage...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Curated Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                Curated Presets:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
