import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { buildKnowledgeIndex, searchKnowledgeIndex } from '../lib/knowledgeModel';

const CATEGORY_FILTERS = [
  'ALL',
  'PROJECTS',
  'AI SYSTEMS',
  'JOURNEY',
  'PROOF',
  'APPS',
  'SKILLS',
  'VAULT',
];

export default function GlobalSearch({ isOpen, onClose }) {
  const portfolioData = usePortfolioData();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Build searchable index from current portfolio data
  const knowledgeIndex = useMemo(() => {
    return buildKnowledgeIndex(portfolioData);
  }, [portfolioData]);

  // Filter and search
  const searchResults = useMemo(() => {
    const rawResults = searchKnowledgeIndex(knowledgeIndex, query);
    if (selectedCategory === 'ALL') return rawResults;

    const catMap = {
      PROJECTS: 'PROJECT',
      'AI SYSTEMS': 'AI SYSTEM',
      JOURNEY: 'JOURNEY',
      PROOF: 'PROOF',
      APPS: 'APP',
      SKILLS: 'SKILL',
      VAULT: 'VAULT ITEM',
    };
    const targetType = catMap[selectedCategory];
    return rawResults.filter((r) => r.type === targetType || (targetType === 'SKILL' && r.type === 'SKILL CLUSTER'));
  }, [knowledgeIndex, query, selectedCategory]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
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

  // Execute Direct Navigation to item
  const handleSelect = (item) => {
    if (!item) return;
    onClose();

    // Route navigation (e.g. /vault)
    if (item.destination?.startsWith('/')) {
      navigate(item.destination);
      return;
    }

    // Hash/Section navigation
    if (item.type === 'PROJECT') {
      const el = document.getElementById('projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      // Dispatch project modal open
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('open-project-detail', {
            detail: item.projectData || { id: item.id.replace('project-', ''), title: item.title },
          })
        );
      }, 150);
      return;
    }

    if (item.type === 'AI SYSTEM') {
      const el = document.getElementById('ai-systems');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      if (item.systemCode) {
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('select-ai-system', {
              detail: item.systemCode,
            })
          );
        }, 150);
      }
      return;
    }

    if (item.type === 'JOURNEY') {
      const targetId = item.elementId || 'journey';
      const el = document.getElementById(targetId) || document.getElementById('journey');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        // Pulse effect
        el.classList.add('ring-2', 'ring-red-500/50');
        setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/50'), 2000);
      }
      return;
    }

    // Default target section
    if (item.destination?.startsWith('#')) {
      const targetId = item.destination.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Keyboard navigation inside search dialog
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
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
        return <Lock className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="global-search-overlay"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Global Portfolio Search"
    >
      {/* Search Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0c0d14] border border-white/15 rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.15)] overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Top Header & Search Input */}
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-white/10 bg-[#0f1019]/70">
          <Search className="w-5 h-5 text-red-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search projects, AI systems, journey, proof, skills..."
            className="w-full bg-transparent text-white font-sans text-sm sm:text-base placeholder-neutral-500 focus:outline-none"
            aria-label="Search portfolio"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-neutral-400 hover:text-white mr-1.5"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-neutral-400 bg-white/5 px-2 py-1 rounded border border-white/10 shrink-0">
            <span>ESC</span>
          </div>
          <button
            onClick={onClose}
            className="sm:hidden p-1.5 rounded text-neutral-400 hover:text-white ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 overflow-x-auto scrollbar-none border-b border-white/5 bg-[#090a0f]">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto max-h-[50vh] p-2 sm:p-3 divide-y divide-white/5 space-y-1"
        >
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#151722] border border-red-500/40 shadow-md'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border mt-0.5 ${
                        isSelected
                          ? 'bg-red-950/40 border-red-500/50 text-red-300'
                          : 'bg-[#12131a] border-white/10 text-neutral-400'
                      }`}
                    >
                      {getCategoryIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                          {item.categoryLabel}
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-neutral-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate font-display group-hover:text-red-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-1 font-sans mt-0.5">
                        {item.subtitle ? `${item.subtitle} — ` : ''}
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Direct Navigation Action Hint */}
                  <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-400 shrink-0">
                    <span className="hidden sm:inline opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                      {item.type === 'PROJECT'
                        ? 'Open Specs'
                        : item.type === 'AI SYSTEM'
                        ? 'Inspect Lab'
                        : 'Navigate'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-neutral-400 px-6">
              <Search className="w-8 h-8 mx-auto text-neutral-600 mb-3" />
              <p className="text-sm text-neutral-300 font-sans">
                No portfolio records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-neutral-500 mt-1 font-mono">
                Try searching for &quot;NeutraCap&quot;, &quot;LYRA V2&quot;, &quot;Paytm&quot;, &quot;Prompt Engineering&quot;, or &quot;Apps&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-[#08080b] border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">↑↓</span> to navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-white">↵</span> to select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>DIRECT KNOWLEDGE ENGINE</span>
            <span className="text-red-500">&bull;</span>
            <span className="text-neutral-200">VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
