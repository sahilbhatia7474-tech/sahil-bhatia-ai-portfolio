import { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveItem } from '../../lib/dbService';
import FeaturedBuilderCard3D from '../FeaturedBuilderCard3D';
import { Save, Sparkles, Upload, Check, AlertCircle, RefreshCw, Crosshair, Eye } from 'lucide-react';

const PORTRAIT_PRESETS = [
  {
    name: 'Cinematic Ambient (Default)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 35,
  },
  {
    name: 'High-Contrast Studio Dark',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 30,
  },
  {
    name: 'Executive Systems Architectural',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    focalX: 50,
    focalY: 32,
  },
];

const VaultPortrait = () => {
  const { featuredPortrait, refreshAllData } = usePortfolioData();

  const [imageUrl, setImageUrl] = useState('');
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(35);
  const [altText, setAltText] = useState('Sahil Bhatia — AI Systems Architect');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [featured, setFeatured] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (featuredPortrait) {
      setImageUrl(featuredPortrait.imageUrl || PORTRAIT_PRESETS[0].url);
      setFocalX(featuredPortrait.focalX ?? 50);
      setFocalY(featuredPortrait.focalY ?? 35);
      setAltText(featuredPortrait.altText || 'Sahil Bhatia — AI Systems Architect');
      setVisibility(featuredPortrait.visibility || 'PUBLIC');
      setFeatured(featuredPortrait.featured ?? true);
    }
  }, [featuredPortrait]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      imageUrl,
      focalX: Number(focalX),
      focalY: Number(focalY),
      altText,
      visibility,
      featured,
      updatedAt: new Date().toISOString(),
    };

    const res = await saveItem('featuredPortrait', 'primary', payload);
    if (res.success) {
      setMessage({ type: 'success', text: 'Featured Portrait & 3D Card settings saved to Firestore.' });
      refreshAllData();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save portrait settings.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>FEATURED PORTRAIT & 3D CARD SYSTEM</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Configure embedded portrait blending, focal calibration, and live 3D card physics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving Calibration...' : 'Publish 3D Card'}</span>
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
                Image Web URL or Storage Link:
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0e1017] border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Local File Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">
                Or Upload from Device (Base64 data URL):
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs font-mono text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
              />
            </div>

            {/* Curated Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                Curated High-Contrast Presets:
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
              <span>Focal Center & Crop Calibration</span>
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Adjust the centering to ensure the face aligns properly with the dark background gradient falloff.
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

              <div className="flex items-center gap-3 pt-6">
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

        </div>

        {/* Real-time Interactive 3D Card Preview Column */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-3">
          <div className="w-full flex items-center justify-between px-2 font-mono text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE 3D CARD SIMULATOR
            </span>
            <span>TEST HOVER / DRAG</span>
          </div>

          {/* Embedded Card */}
          <div className="w-full flex justify-center p-4 rounded-2xl bg-[#06070a] border border-white/10 shadow-inner">
            <FeaturedBuilderCard3D />
          </div>

          <p className="text-[11px] font-mono text-neutral-400 text-center max-w-xs">
            Card features physical tilt constraints (±8&deg; X, ±12&deg; Y), multi-layer depth parallax, and embedded soft vignette merging.
          </p>
        </div>

      </div>
    </div>
  );
};

export default VaultPortrait;
