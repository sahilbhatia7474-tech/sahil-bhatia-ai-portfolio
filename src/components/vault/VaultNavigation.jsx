import { useState, useEffect } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { saveNavigationItems } from '../../lib/dbService';
import { useAuth } from '../../lib/authContext';
import {
  Compass,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  RotateCcw,
  Lock,
} from 'lucide-react';

const DEFAULT_ITEMS = [
  { id: 'nav-1', label: 'Identity', target: '/', visible: true, order: 1 },
  { id: 'nav-2', label: 'Capabilities', target: '/#capabilities', visible: true, order: 2 },
  { id: 'nav-3', label: 'Projects', target: '/projects', visible: true, order: 3 },
  { id: 'nav-4', label: 'AI Systems', target: '/ai-systems', visible: true, order: 4 },
  { id: 'nav-5', label: 'Journey', target: '/journey', visible: true, order: 5 },
  { id: 'nav-6', label: 'Proof', target: '/proof', visible: true, order: 6 },
  { id: 'nav-6b', label: 'Certificates', target: '/certificates', visible: true, order: 7 },
  { id: 'nav-7', label: 'Future Vault', target: '/future-vault', visible: true, order: 8 },
  { id: 'nav-8', label: 'Apps', target: '/apps', visible: true, order: 9 },
];

const VaultNavigation = () => {
  const { navigation, refreshAllData } = usePortfolioData();
  const { canEdit } = useAuth();
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (navigation && navigation.length > 0) {
      setItems(navigation);
    }
  }, [navigation]);

  const handleToggleVisible = (index) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], visible: !next[index].visible };
      return next;
    });
  };

  const handleUpdateLabel = (index, newLabel) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], label: newLabel };
      return next;
    });
  };

  const handleUpdateTarget = (index, newTarget) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], target: newTarget };
      return next;
    });
  };

  const moveItem = (index, direction) => {
    if (!canEdit) return;
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    setItems((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleResetDefaults = () => {
    if (!canEdit) return;
    setItems(DEFAULT_ITEMS);
  };

  const handleSave = async () => {
    if (!canEdit) {
      setFeedback({ type: 'error', text: 'Authentication required. Only the founder can save navigation hierarchy.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    const res = await saveNavigationItems(items);
    if (res.success) {
      setFeedback({ type: 'success', text: 'Navigation hierarchy updated in Firestore.' });
      refreshAllData();
    } else {
      setFeedback({ type: 'error', text: res.error || 'Failed to save navigation.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500" />
            <span>GLOBAL NAVIGATION CONTROL</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Configure visible public menu items, custom routes, anchor targets, and ordering.
          </p>
        </div>

        {canEdit ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="min-h-[44px] px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_0_20px_rgba(255,42,58,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Syncing...' : 'Save Navigation'}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-900/80 border border-white/10 font-mono text-xs text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>FOUNDER ACCESS REQUIRED TO EDIT</span>
          </div>
        )}
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

      {/* Reorderable Items List */}
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={`p-4 rounded-xl bg-[#0c0d14] border transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
              item.visible !== false
                ? 'border-white/10 hover:border-white/20'
                : 'border-white/5 opacity-60 bg-[#08090d]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center font-mono text-xs text-neutral-500">
                #{index + 1}
              </span>

              <div className="space-y-1">
                <input
                  type="text"
                  value={item.label}
                  disabled={!canEdit}
                  onChange={(e) => handleUpdateLabel(index, e.target.value)}
                  className="min-h-[36px] px-3 py-1 rounded bg-[#141620] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-red-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  value={item.target}
                  disabled={!canEdit}
                  onChange={(e) => handleUpdateTarget(index, e.target.value)}
                  placeholder="/route or #anchor"
                  className="min-h-[36px] px-3 py-1 rounded bg-[#141620] border border-white/10 text-neutral-300 font-mono text-xs focus:outline-none focus:border-red-500 disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              {/* Visible Toggle */}
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => handleToggleVisible(index)}
                  className={`min-h-[36px] px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 cursor-pointer ${
                    item.visible !== false
                      ? 'bg-emerald-950/30 border border-emerald-500/30 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {item.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.visible !== false ? 'Shown' : 'Hidden'}</span>
                </button>
              ) : (
                <span className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 ${
                  item.visible !== false ? 'text-emerald-400 bg-emerald-950/30' : 'text-neutral-500 bg-neutral-900'
                }`}>
                  <Lock className="w-3 h-3 text-neutral-500" />
                  <span>{item.visible !== false ? 'Visible' : 'Hidden'}</span>
                </span>
              )}

              {/* Move Up */}
              {canEdit && (
                <>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveItem(index, -1)}
                    className="p-2 rounded bg-[#141620] hover:bg-[#1d202e] text-neutral-300 disabled:opacity-30 cursor-pointer"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, 1)}
                    className="p-2 rounded bg-[#141620] hover:bg-[#1d202e] text-neutral-300 disabled:opacity-30 cursor-pointer"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultNavigation;
