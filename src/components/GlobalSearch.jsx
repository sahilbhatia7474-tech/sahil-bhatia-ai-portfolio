import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Cpu,
  FolderGit2,
  Milestone,
  ShieldCheck,
  Smartphone,
  Layers,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import { buildKnowledgeIndex, searchKnowledgeIndex } from '../lib/knowledgeModel';
import { useBodyScrollLock, forceUnlockBodyScroll } from '../lib/scrollLock';

const CATEGORY_FILTERS = [
  'ALL',
  'PROJECTS',
  'AI SYSTEMS',
  'JOURNEY',
  'PROOF',
  'CERTIFICATES',
  'APPS',
  'SKILLS',
  'VAULT',
];

export default function GlobalSearch({ isOpen, onClose }) {
  const portfolioData = usePortfolioData();
  const { lockVault } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build searchable index from current portfolio data
  const knowledgeIndex = useMemo(() => {
    return buildKnowledgeIndex(portfolioData);
  }, [portfolioData]);

  // Filter and search with complete category support even with empty query
  const searchResults = useMemo(() => {
    const catMap = {
      PROJECTS: ['PROJECT'],
      'AI SYSTEMS': ['AI SYSTEM', 'BENCHMARK'],
      JOURNEY: ['JOURNEY'],
      PROOF: ['PROOF'],
      CERTIFICATES: ['CERTIFICATE'],
      APPS: ['APP'],
      SKILLS: ['SKILL', 'SKILL CLUSTER'],
      VAULT: ['VAULT ITEM', 'VAULT'],
    };

    if (!query || !query.trim()) {
      if (selectedCategory === 'ALL') {
        return searchKnowledgeIndex(knowledgeIndex, '');
      }
      const targetTypes = catMap[selectedCategory] || [];
      return knowledgeIndex.filter((item) => targetTypes.includes(item.type));
    }

    const rawResults = searchKnowledgeIndex(knowledgeIndex, query);
    if (selectedCategory === 'ALL') return rawResults;

    const targetTypes = catMap[selectedCategory] || [];
    return rawResults.filter((r) => targetTypes.includes(r.type));
  }, [knowledgeIndex, query, selectedCategory]);

  // Unified body scroll lock management
  useBodyScrollLock(isOpen);

  // Focus input when opened across all devices
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setQuery('');
      setSelectedCategory('ALL');
    }
  }, [isOpen]);

  // Keep selected index in valid range
  useEffect(() => {
    if (selectedIndex >= searchResults.length) {
      setSelectedIndex(Math.max(0, searchResults.length - 1));
    }
  }, [searchResults.length, selectedIndex]);

  // Close handler with guaranteed scroll unlock
  const handleClose = () => {
    forceUnlockBodyScroll();
    onClose();
  };

  // Global escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  // Execute Direct Navigation to item
  const handleSelect = (item) => {
    if (!item) return;

    // Immediately release body lock and close modal
    forceUnlockBodyScroll();
    onClose();

    // Check if external route (/vault, /business-info, /privacy-policy, /services, etc.)
    const dedicatedRoutes = ['/vault', '/business-info', '/privacy-policy', '/services', '/terms', '/refund-policy'];
    if (dedicatedRoutes.includes(item.destination) || (item.destination?.startsWith('/') && !item.destination.startsWith('/#') && !['/projects', '/ai-systems', '/benchmarks', '/proof', '/certificates', '/apps', '/contact', '/future-vault'].includes(item.destination))) {
      if (item.destination === '/vault' && lockVault) {
        lockVault();
      }
      navigate(item.destination);
      return;
    }

    const cleanId = (item.destination || '').replace(/^(\/|#)+/, '') || item.targetSection || '';

    const executeScrollAndActions = () => {
      forceUnlockBodyScroll();

      // If user is not on home page, navigate to home with target section
      if (location.pathname !== '/') {
        navigate(`/#${cleanId}`);
        return;
      }

      // 1. Projects: Scroll and open detailed modal
      if (item.type === 'PROJECT') {
        const el = document.getElementById('projects');
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
        }
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('open-project-detail', {
              detail: item.projectData || { id: item.id.replace('project-', ''), title: item.title },
            })
          );
        }, 180);
        return;
      }

      // 2. AI Systems: Scroll and select architecture system tab
      if (item.type === 'AI SYSTEM') {
        const el = document.getElementById('ai-systems');
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
        }
        if (item.systemCode) {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('select-ai-system', {
                detail: item.systemCode,
              })
            );
          }, 180);
        }
        return;
      }

      // 3. Journey: Open interactive timeline
      if (item.type === 'JOURNEY') {
        window.dispatchEvent(new CustomEvent('open-journey-timeline'));
        return;
      }

      // 4. Apps Hub: Scroll to apps section
      if (item.type === 'APP') {
        const el = document.getElementById('apps');
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
          el.classList.add('ring-2', 'ring-red-500/50');
          setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/50'), 1500);
        }
        return;
      }

      // 5. Default target section scroll with highlighted ring
      if (cleanId) {
        const el = document.getElementById(cleanId);
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: 'smooth' });
          el.classList.add('ring-2', 'ring-red-500/50');
          setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/50'), 1500);
          return;
        }
      }

      // Fallback
      if (item.destination) {
        navigate(`/${item.destination.replace(/^\//, '')}`);
      }
    };

    // Execute scroll smoothly once modal unmounts
    setTimeout(executeScrollAndActions, 60);
  };

  // Keyboard navigation inside search dialog
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      }
    }
  };

  // Helper icon for category
  const getCategoryIcon = (type) => {
    switch (type) {
      case 'PROJECT':
        return <FolderGit2 className="w-3.5 h-3.5 text-red-400" />;
      case 'AI SYSTEM':
        return <Cpu className="w-3.5 h-3.5 text-amber-400" />;
      case 'JOURNEY':
        return <Milestone className="w-3.5 h-3.5 text-blue-400" />;
      case 'PROOF':
      case 'CERTIFICATE':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'APP':
        return <Smartphone className="w-3.5 h-3.5 text-purple-400" />;
      case 'SKILL':
      case 'SKILL CLUSTER':
        return <Layers className="w-3.5 h-3.5 text-neutral-300" />;
      case 'VAULT':
      case 'VAULT ITEM':
        return <Lock className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="global-search-overlay"
      className="fixed inset-0 z-[120] flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer touch-manipulation overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Global Portfolio Search"
    >
      {/* Background Wall Ambient Glow & Avengers Constellation Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-red-600/10 blur-3xl" />
      </div>

      {/* Search Modal Panel — 3D Floating Command Chassis */}
      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#101220]/98 via-[#0b0c16]/98 to-[#05060c]/99 border border-white/20 sm:border-white/25 rounded-2xl shadow-[0_40px_100px_-15px_rgba(0,0,0,0.98),0_0_60px_rgba(255,42,58,0.2),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[85vh] cursor-default backdrop-blur-3xl my-auto sm:my-0"
      >
        {/* Specular Top Horizon Flare Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_16px_rgba(255,42,58,0.85)] pointer-events-none" />

        {/* Subtle Cybernetic Micro-Dot Mesh Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

        {/* Top Header & Search Input */}
        <div className="relative z-10 flex items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/15 bg-gradient-to-r from-[#141624]/90 via-[#0e101b]/90 to-[#0a0b14]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
          <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center mr-3 shrink-0 shadow-[0_0_12px_rgba(255,42,58,0.35)]">
            <Search className="w-4 h-4 text-red-400 drop-shadow-[0_0_8px_rgba(255,42,58,0.8)]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, AI systems, journey, certificates, skills..."
            className="w-full bg-transparent text-white font-sans text-sm sm:text-base placeholder-neutral-400 focus:outline-none select-text touch-manipulation tracking-wide caret-red-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            aria-label="Search portfolio"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-400 hover:text-white mr-1.5 cursor-pointer touch-manipulation hover:bg-white/10 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-neutral-300 bg-white/10 px-2 py-1 rounded-lg border border-white/15 shrink-0 mr-2 shadow-inner font-bold">
            <span>ESC</span>
          </div>
          <button
            type="button"
            id="global-search-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-red-600/50 border border-white/15 flex items-center justify-center text-neutral-200 hover:text-white cursor-pointer active:scale-95 transition-all touch-manipulation shadow-sm shrink-0"
            aria-label="Close search (Esc)"
          >
            <X className="w-4 h-4 text-white pointer-events-none" />
          </button>
        </div>

        {/* Category Filter Pills — 3D Tactile Filter Matrix */}
        <div className="relative z-10 flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 overflow-x-auto scrollbar-none border-b border-white/10 bg-[#06070c]/98 shadow-inner">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedIndex(0);
                }}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all touch-manipulation cursor-pointer active:scale-95 select-none ${
                  isActive
                    ? 'bg-gradient-to-b from-white via-neutral-100 to-neutral-200 text-black font-black shadow-[0_6px_20px_rgba(255,255,255,0.35),0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,1)] border border-white'
                    : 'bg-gradient-to-b from-[#131524] to-[#0d0e18] text-neutral-300 hover:text-white hover:border-white/25 border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-[#1a1d2e]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="relative z-10 overflow-y-auto max-h-[50vh] p-2.5 sm:p-4 space-y-2"
        >
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left group p-3 sm:p-3.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 sm:gap-3.5 touch-manipulation active:scale-[0.99] select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#221626] via-[#171324] to-[#0e0c18] border border-red-500/70 shadow-[0_12px_32px_rgba(255,42,58,0.28),0_4px_12px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.6)] ring-1 ring-red-500/40'
                      : 'bg-gradient-to-r from-[#0d0f1b]/85 via-[#090b14]/85 to-[#06070e]/90 hover:from-[#171b2d] hover:via-[#111424] hover:to-[#0c0e1a] border border-white/[0.08] hover:border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-b from-red-900/60 to-red-950/80 border-red-500/60 shadow-[0_0_14px_rgba(255,42,58,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]'
                          : 'bg-gradient-to-b from-[#181a28] to-[#10111d] border-white/12 shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]'
                      }`}
                    >
                      {getCategoryIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${isSelected ? 'text-red-400' : 'text-neutral-400'}`}>
                          {item.categoryLabel}
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-neutral-200 font-semibold shadow-inner">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-[15px] font-bold text-white truncate font-display tracking-tight group-hover:text-red-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] transition-colors flex items-center gap-2">
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 font-sans mt-0.5 leading-relaxed">
                        {item.subtitle ? `${item.subtitle} — ` : ''}
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Direct Navigation Action Hint */}
                  <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                    <span className="hidden sm:inline font-bold px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-inner">
                      {item.type === 'PROJECT'
                        ? 'Open Specs'
                        : item.type === 'AI SYSTEM'
                        ? 'Inspect Lab'
                        : 'Navigate'}
                    </span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                        : 'bg-white/5 border-white/10 text-neutral-400 group-hover:border-red-500/40 group-hover:text-red-400'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 sm:py-14 text-center text-neutral-400 px-4 sm:px-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Search className="w-6 h-6 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-200 font-sans font-medium">
                No portfolio records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-neutral-500 mt-1.5 font-mono">
                Try tapping any suggested query below:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['NeutraCap', 'LYRA V2', 'Paytm', 'Generative AI', 'Agentic Architecture', 'Apps'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:bg-red-600/40 text-neutral-200 text-xs font-mono cursor-pointer border border-white/15 active:scale-95 transition-all touch-manipulation"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="relative z-10 px-4 sm:px-5 py-3 bg-[#06070a] border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-white font-bold shadow-inner">↑↓</kbd>
              <span>navigate</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-white font-bold shadow-inner">↵</kbd>
              <span>select</span>
            </span>
            <span className="sm:hidden text-neutral-400">
              Tap any item to navigate
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
            <span className="font-bold text-neutral-300">DIRECT KNOWLEDGE ENGINE</span>
            <span className="text-neutral-500">&bull;</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
