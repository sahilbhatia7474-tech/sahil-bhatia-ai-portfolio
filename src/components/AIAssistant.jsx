import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Bot,
  FileText,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { queryAIAssistant } from '../lib/knowledgeModel';
import { isValidHttpUrl } from '../lib/projectLinks';
import { useBodyScrollLock, forceUnlockBodyScroll } from '../lib/scrollLock';
import VaultPageTransitionOverlay from './vault/VaultPageTransitionOverlay';

const SUGGESTED_PROMPTS = [
  { label: '📄 VIEW RESUME (CV)', destination: '/resume', type: 'resume' },
  { label: 'WHO IS SAHIL?', prompt: 'WHO IS SAHIL?' },
  { label: 'WHAT HAS HE BUILT?', prompt: 'WHAT HAS HE BUILT?' },
  { label: 'SHOW AI SYSTEMS', prompt: 'SHOW AI SYSTEMS' },
  { label: 'SHOW BENCHMARKS', prompt: 'SHOW BENCHMARKS' },
  { label: 'SHOW PROFESSIONAL JOURNEY', prompt: 'SHOW PROFESSIONAL JOURNEY' },
  { label: 'SHOW PROOF', prompt: 'SHOW PROOF' },
  { label: 'SHOW CERTIFICATES', prompt: 'SHOW CERTIFICATES' },
];

const INITIAL_WELCOME_ACTIONS = [
  { label: '📄 VIEW RESUME (CV)', destination: '/resume', type: 'resume' },
  { label: 'WHO IS SAHIL?', prompt: 'WHO IS SAHIL?' },
  { label: 'WHAT HAS HE BUILT?', prompt: 'WHAT HAS HE BUILT?' },
  { label: 'SHOW AI SYSTEMS', prompt: 'SHOW AI SYSTEMS' },
  { label: 'SHOW BENCHMARKS', prompt: 'SHOW BENCHMARKS' },
  { label: 'SHOW PROFESSIONAL JOURNEY', prompt: 'SHOW PROFESSIONAL JOURNEY' },
  { label: 'SHOW CERTIFICATES', prompt: 'SHOW CERTIFICATES' },
  { label: 'SHOW PROOF', prompt: 'SHOW PROOF' },
];

let msgSeq = 0;
function getNextMsgId(prefix) {
  msgSeq += 1;
  return `${prefix}-${msgSeq}`;
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioData = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [resumeTransition, setResumeTransition] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Unified body scroll lock management
  useBodyScrollLock(isOpen);

  // Guarantee body scroll unlocks unconditionally when assistant closes
  useEffect(() => {
    if (!isOpen) {
      forceUnlockBodyScroll();
    }
  }, [isOpen]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello. I am the Sahil Portfolio OS Intelligence Engine.\n\nI can answer questions regarding Sahil's verified projects (such as NeutraCap and LYRA V2), agentic systems architecture, commercial sales background (Paytm, Airtel, Excitel), and proof matrix.\n\nSelect a prompt below to navigate directly to that section or ask any question:`,
      actions: INITIAL_WELCOME_ACTIONS,
    },
  ]);

  // Auto-scroll chat to bottom inside modal container without moving background page
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen, isTyping]);

  // Global event listener to open assistant from header/menu
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  // Escape key closes assistant
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Only auto-focus on desktop with hardware keyboard (avoid triggering mobile virtual keyboards)
  useEffect(() => {
    if (isOpen) {
      const isTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      if (!isTouch && window.innerWidth >= 768) {
        const timer = setTimeout(() => inputRef.current?.focus(), 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  // Handle Action Trigger (Navigation, Option Tap, or Sub-prompt)
  const handleAction = (action) => {
    if (!action) return;

    // 1. External verified URLs
    if (action.type === 'external' && action.url) {
      if (isValidHttpUrl(action.url)) {
        window.open(action.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // 2. If an action has a prompt, process it as a conversation turn in chat (keep window open!)
    if (action.prompt) {
      handleSend(action.prompt);
      return;
    }

    // 3. Determine target destination for navigation actions
    const destination =
      action.destination ||
      (action.type === 'project' ? '#projects' : null) ||
      (action.type === 'ai-system' ? '#ai-systems' : null);

    // If there is a navigation destination or entity type, navigate and close window
    if (destination || action.type === 'project' || action.type === 'ai-system') {
      setIsOpen(false);
      forceUnlockBodyScroll();

      // Route navigation (e.g. /business-info, /services, /vault)
      if (destination?.startsWith('/') && !destination.startsWith('/#')) {
        navigate(destination);
        return;
      }

      // If user is currently on a sub-route and clicked an anchor on the home page
      if (location.pathname !== '/' && (destination?.startsWith('#') || destination?.startsWith('/#'))) {
        const cleanAnchor = destination.replace(/^\/?#/, '');
        navigate(`/#${cleanAnchor}`);
        return;
      }

      // Normalize target anchor IDs
      const rawDest =
        destination ||
        (action.type === 'project' ? '#projects' : action.type === 'ai-system' ? '#ai-systems' : '');
      let targetId = rawDest.replace(/^\/?#/, '');

      if (targetId === 'journey-j-1') targetId = 'j-1';
      if (targetId === 'journey-j-2') targetId = 'j-2';
      if (targetId === 'journey-j-3') targetId = 'j-3';
      if (targetId === 'journey-j-4') targetId = 'j-4';
      if (targetId === 'journey-j-5') targetId = 'j-5';

      if (targetId === 'journey' || destination === '/journey' || action.type === 'journey-timeline') {
        window.dispatchEvent(new CustomEvent('open-journey-timeline'));
        return;
      }

      const executeScroll = () => {
        forceUnlockBodyScroll();

        let el = targetId ? document.getElementById(targetId) : null;
        if (!el && targetId === 'hero') el = document.getElementById('hero') || document.querySelector('header');
        if (!el && targetId) el = document.getElementById(`journey-${targetId}`);
        if (!el && targetId.startsWith('j-')) el = document.getElementById('journey');
        if (!el && action.type === 'project') el = document.getElementById('projects');
        if (!el && action.type === 'ai-system') el = document.getElementById('ai-systems');

        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Highlighting indicator for target sections & cards
          el.classList.add('ring-2', 'ring-red-500/70', 'transition-all');
          setTimeout(() => el.classList.remove('ring-2', 'ring-red-500/70'), 2500);
        } else if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Trigger project detail modal if requested
        if (action.type === 'project' || action.projectData || action.projectSlug) {
          const targetData =
            action.projectData ||
            (portfolioData?.projects || []).find((p) => p.slug === action.projectSlug) ||
            (portfolioData?.allProjects || []).find((p) => p.slug === action.projectSlug) ||
            { slug: action.projectSlug, title: action.label?.replace(/^OPEN\s+/i, '').replace(/\s+SPECS$/i, '').trim() };

          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('open-project-detail', {
                detail: targetData,
              })
            );
          }, 240);
        }

        // Trigger AI system selection if requested
        if (action.type === 'ai-system' && action.systemCode) {
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('select-ai-system', {
                detail: action.systemCode,
              })
            );
          }, 240);
        }
      };

      // Double-fire with short timeout to ensure smooth scroll completes after modal unmounts
      requestAnimationFrame(() => {
        setTimeout(executeScroll, 60);
      });
      return;
    }

    // Fallback: If only a prompt with no navigation destination, execute in chat
    if (action.prompt) {
      handleSend(action.prompt);
    }
  };

  // Submit query
  const handleSend = (overrideQuery) => {
    const rawQuery = (overrideQuery || inputQuery).trim();
    if (!rawQuery) return;
    const query = rawQuery.slice(0, 500);

    // Append user message
    const userMsg = {
      id: getNextMsgId('user'),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate crisp, sub-second reasoning response
    setTimeout(() => {
      const response = queryAIAssistant(query, portfolioData);
      const aiMsg = {
        id: getNextMsgId('ai'),
        sender: 'ai',
        text: response.text,
        actions: response.actions || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 280);
  };

  const handleClear = () => {
    setMessages([
      {
        id: getNextMsgId('welcome'),
        sender: 'ai',
        text: 'Conversation reset. How can I assist your navigation of Sahil’s portfolio?',
        actions: INITIAL_WELCOME_ACTIONS,
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 ${isOpen ? 'z-[110]' : 'z-[80]'}`}>
        <button
          id="ai-assistant-trigger"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0e0f17] border border-red-500/40 text-white font-mono text-xs uppercase tracking-wider shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,42,58,0.25)] hover:border-red-500 hover:bg-[#141624] hover:shadow-[0_10px_40px_rgba(255,42,58,0.35)] active:scale-95 transition-all duration-300 cursor-pointer touch-manipulation select-none"
        >
          {/* Subtle Outer Pulse Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-red-500/20 blur-sm group-hover:bg-red-500/30 transition-all pointer-events-none" />

          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-950/60 border border-red-500/40 pointer-events-none">
            <Bot className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform pointer-events-none" />
          </div>

          <span className="relative hidden sm:inline font-bold text-neutral-100 group-hover:text-white pointer-events-none">
            {isOpen ? 'CLOSE ASSISTANT' : 'ASK SAHIL AI'}
          </span>
          <span className="relative sm:hidden font-bold text-neutral-100 pointer-events-none">
            {isOpen ? 'CLOSE ✕' : 'ASK AI'}
          </span>

          <span className={`relative w-2 h-2 rounded-full ${isOpen ? 'bg-amber-400' : 'bg-[#ff2a3a]'} animate-pulse pointer-events-none`} />
        </button>
      </div>

      {/* Spatial Assistant Window / Drawer + Click-away Backdrop */}
      {isOpen && (
        <>
          {/* Backdrop Overlay - Tapping or clicking outside closes assistant */}
          <div
            id="ai-assistant-backdrop"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] animate-in fade-in duration-200 cursor-pointer touch-manipulation"
            aria-hidden="true"
          >
            {/* Ambient Wall Light & Stars Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-pulse" />
            </div>
          </div>

          {/* AI Assistant Spatial Window Panel */}
          <div
            id="ai-assistant-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sahil Portfolio AI Assistant"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[450px] max-h-[85vh] sm:max-h-[650px] h-[590px] bg-gradient-to-b from-[#111322]/98 via-[#0b0c16]/98 to-[#06070d]/99 backdrop-blur-3xl border border-white/20 sm:border-red-500/40 rounded-2xl shadow-[0_35px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(255,42,58,0.22),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 z-[100]"
          >
            {/* Top Specular Laser Horizon Line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_rgba(255,42,58,0.85)] pointer-events-none" />

            {/* Header (div:nth-of-type(1)) */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-[#0d0f1a] border-b border-white/12 shrink-0 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-red-900/60 via-red-950/80 to-[#100608] border border-red-500/60 flex items-center justify-center shadow-[0_0_16px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-red-400 drop-shadow-[0_0_10px_rgba(255,42,58,0.9)] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-mono text-xs font-bold text-white tracking-wide flex items-center gap-2 drop-shadow-sm">
                    <span>SAHIL AI // KNOWLEDGE ENGINE</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                    <span>ONLINE &bull; DIRECT REASONING ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Action Controls with High-Contrast Touch Targets */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClear}
                  title="Reset conversation"
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 touch-manipulation"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4 pointer-events-none" />
                </button>
                <button
                  type="button"
                  id="ai-assistant-close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  title="Close assistant (Esc)"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-red-600/40 hover:bg-red-600 active:bg-red-700 border border-red-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_18px_rgba(255,42,58,0.45)] active:scale-90 touch-manipulation pointer-events-auto"
                  aria-label="Close assistant"
                >
                  <X className="w-6 h-6 text-white pointer-events-none" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Carousel (div:nth-of-type(2)) with 3D tactile pill badge */}
            <div className="relative z-10 px-3.5 py-2.5 bg-gradient-to-r from-[#080912] via-[#05060a] to-[#040408] border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 shadow-inner">
              <span className="font-mono text-[10px] text-red-400/90 font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-red-950/50 border border-red-500/30 shrink-0 shadow-inner flex items-center gap-1 select-none pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse pointer-events-none" />
                PROMPTS:
              </span>
              {SUGGESTED_PROMPTS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(item);
                  }}
                  className="px-3 py-1 rounded-xl bg-gradient-to-b from-[#141726] to-[#0d0f1a] hover:from-red-950/60 hover:to-[#1a0c10] hover:border-red-500/60 border border-white/12 text-[11px] font-mono text-neutral-200 hover:text-white whitespace-nowrap transition-all shrink-0 cursor-pointer active:scale-95 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] touch-manipulation select-none"
                >
                  <span className="pointer-events-none">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Message Stream (div:nth-of-type(3)) — Rich 3D Viewport */}
            <div
              ref={chatContainerRef}
              className="relative z-10 flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm bg-gradient-to-b from-[#080911]/95 via-[#05060b]/98 to-[#030408]/99"
            >
              {/* Subtle background mesh */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`relative z-10 flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                  >
                    {/* Message Bubble Card (CSS selector 5) */}
                    <div
                      className={`max-w-[88%] rounded-2xl p-4 leading-relaxed transition-all duration-200 ${
                        isAi
                          ? 'bg-gradient-to-b from-[#141728]/95 via-[#0f1120]/95 to-[#0a0c16]/95 border border-white/15 text-neutral-200 shadow-[0_12px_28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.5)]'
                          : 'bg-gradient-to-b from-red-500 via-red-600 to-red-700 text-white font-medium shadow-[0_12px_28px_rgba(239,68,68,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] border border-red-400/40'
                      }`}
                    >
                      {/* Message Content Block (CSS selector 8) */}
                      <div className="whitespace-pre-line font-sans leading-relaxed text-neutral-200 sm:text-[13px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] selection:bg-red-500 selection:text-white">
                        {msg.text}
                      </div>

                      {/* Action Buttons for Navigation & Links */}
                      {isAi && msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(act);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#1c2033] to-[#121422] hover:from-red-950/60 hover:to-[#1a0a0f] border border-white/15 hover:border-red-500/50 text-[11px] font-mono font-bold text-neutral-200 hover:text-white transition-all shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] group cursor-pointer active:scale-95 touch-manipulation select-none"
                            >
                              <span className="pointer-events-none">{act.label}</span>
                              {act.type === 'external' ? (
                                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 pointer-events-none" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform pointer-events-none" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="relative z-10 flex items-center gap-2 text-neutral-300 font-mono text-xs px-2 py-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping pointer-events-none" />
                  <span className="text-neutral-400">Synthesizing portfolio intelligence...</span>
                </div>
              )}
            </div>

            {/* Bottom Chat Input Bar (form:nth-of-type(1)) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#090b13] border-t border-white/12 flex items-center gap-2.5 shrink-0 relative z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              {/* Input Field (CSS selector 3) */}
              <input
                ref={inputRef}
                type="text"
                maxLength={500}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about projects, LYRA, journey, skills..."
                className="flex-1 min-h-[48px] bg-gradient-to-b from-[#10121e] to-[#0a0b12] border border-white/20 focus:border-red-500/80 rounded-xl px-4 py-3 text-white font-sans text-xs sm:text-sm placeholder-neutral-400 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_4px_14px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(255,42,58,0.25),inset_0_2px_4px_rgba(0,0,0,0.9)] select-text touch-manipulation caret-red-500"
              />
              {/* Submit Button & SVG (CSS selector 4) */}
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-gradient-to-b from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:to-red-600 active:from-red-700 active:to-red-800 disabled:opacity-35 disabled:hover:from-red-600 text-white transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-[0_8px_24px_rgba(239,68,68,0.45),inset_0_1px_0_rgba(255,255,255,0.38),inset_0_-1px_0_rgba(0,0,0,0.5)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.65)] active:scale-95 active:translate-y-0.5 touch-manipulation border border-red-400/40 group"
                aria-label="Send query"
              >
                <Send className="w-4.5 h-4.5 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>

            {/* Quick Dismiss Utility Bar for Mobile */}
            <div className="px-4 py-2 bg-[#050609] border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 shrink-0">
              <span className="truncate flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                <span>Tap backdrop or [Esc] to exit</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-red-400 hover:text-white hover:bg-red-600 font-bold px-3 py-1.5 rounded-md bg-red-950/60 border border-red-500/50 hover:border-red-500/80 cursor-pointer touch-manipulation active:scale-95 transition-all shadow-inner"
              >
                CLOSE ✕
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
