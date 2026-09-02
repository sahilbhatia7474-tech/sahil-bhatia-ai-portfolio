import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { queryAIAssistant } from '../lib/knowledgeModel';

const SUGGESTED_PROMPTS = [
  'WHO IS SAHIL?',
  'WHAT HAS HE BUILT?',
  'SHOW AI SYSTEMS',
  'SHOW PROFESSIONAL JOURNEY',
  'SHOW PROOF',
  'SHOW CERTIFICATES',
];

let msgSeq = 0;
function getNextMsgId(prefix) {
  msgSeq += 1;
  return `${prefix}-${msgSeq}`;
}

export default function AIAssistant() {
  const portfolioData = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello. I am the Sahil Portfolio OS Intelligence Engine.\n\nI can answer questions regarding Sahil's verified projects (such as NeutraCap and LYRA V2), agentic systems architecture, commercial sales background (Paytm, Airtel, Excitel), and proof matrix.\n\nSelect a prompt below or ask any question to navigate directly.`,
      actions: [
        { label: 'WHO IS SAHIL?', prompt: 'WHO IS SAHIL?' },
        { label: 'WHAT HAS HE BUILT?', prompt: 'WHAT HAS HE BUILT?' },
        { label: 'SHOW AI SYSTEMS', prompt: 'SHOW AI SYSTEMS' },
      ],
    },
  ]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Global event listener to open assistant from header/menu
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  // Focus input when assistant opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Action Trigger (Navigation or Sub-prompt)
  const handleAction = (action) => {
    if (action.prompt) {
      handleSend(action.prompt);
      return;
    }

    if (action.type === 'external' && action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Scroll to section
    if (action.destination) {
      // If it's a project modal trigger
      if (action.type === 'project' || action.projectData || action.projectSlug) {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth' });

        const targetData =
          action.projectData ||
          (portfolioData.projects || []).find((p) => p.slug === action.projectSlug) ||
          { slug: action.projectSlug, title: action.label };

        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('open-project-detail', {
              detail: targetData,
            })
          );
        }, 200);
      } else if (action.type === 'ai-system' && action.systemCode) {
        const el = document.getElementById('ai-systems');
        if (el) el.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('select-ai-system', {
              detail: action.systemCode,
            })
          );
        }, 200);
      } else {
        const targetId = action.destination.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Submit query
  const handleSend = (overrideQuery) => {
    const query = (overrideQuery || inputQuery).trim();
    if (!query) return;

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
        actions: [
          { label: 'WHO IS SAHIL?', prompt: 'WHO IS SAHIL?' },
          { label: 'WHAT HAS HE BUILT?', prompt: 'WHAT HAS HE BUILT?' },
          { label: 'SHOW AI SYSTEMS', prompt: 'SHOW AI SYSTEMS' },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
        <button
          id="ai-assistant-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Assistant"
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0e0f17] border border-red-500/40 text-white font-mono text-xs uppercase tracking-wider shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(255,42,58,0.25)] hover:border-red-500 hover:bg-[#141624] hover:shadow-[0_10px_40px_rgba(255,42,58,0.35)] transition-all duration-300"
        >
          {/* Subtle Outer Pulse Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-red-500/20 blur-sm group-hover:bg-red-500/30 transition-all pointer-events-none" />

          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-red-950/60 border border-red-500/40">
            <Bot className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          </div>

          <span className="relative hidden sm:inline font-bold text-neutral-100 group-hover:text-white">
            ASK SAHIL AI
          </span>
          <span className="relative sm:hidden font-bold text-neutral-100">
            ASK AI
          </span>

          <span className="relative w-2 h-2 rounded-full bg-[#ff2a3a] animate-pulse" />
        </button>
      </div>

      {/* Spatial Assistant Window / Drawer */}
      {isOpen && (
        <div
          id="ai-assistant-panel"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[430px] max-h-[82vh] h-[580px] bg-[#090a10]/95 backdrop-blur-xl border border-white/15 sm:border-red-500/30 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#0e0f17] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-red-950/50 border border-red-500/40 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div>
                <h3 className="font-mono text-xs font-bold text-white tracking-wide flex items-center gap-2">
                  <span>SAHIL AI // PORTFOLIO INTELLIGENCE</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE &bull; PORTFOLIO KNOWLEDGE ENGINE</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Reset conversation"
                className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Reset chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#06070a] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest px-1 shrink-0">
              PROMPTS:
            </span>
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-950/40 hover:border-red-500/40 border border-white/10 text-[10px] font-mono text-neutral-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl p-3.5 leading-relaxed ${
                      isAi
                        ? 'bg-[#12141e] border border-white/10 text-neutral-200'
                        : 'bg-red-600 text-white font-medium shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Action Buttons for Navigation & Links */}
                    {isAi && msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(act)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#191c2b] hover:bg-red-950/50 border border-white/10 hover:border-red-500/40 text-[11px] font-mono font-semibold text-neutral-200 hover:text-white transition-all shadow-sm group"
                          >
                            <span>{act.label}</span>
                            {act.type === 'external' ? (
                              <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-red-400" />
                            ) : (
                              <ArrowRight className="w-3 h-3 text-red-400 group-hover:translate-x-0.5 transition-transform" />
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
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-xs px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-neutral-500">Formulating portfolio response...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#0b0c13] border-t border-white/10 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about projects, LYRA, journey, skills..."
              className="flex-1 bg-[#141520] border border-white/10 focus:border-red-500/50 rounded-lg px-3 py-2 text-white font-sans text-xs sm:text-sm placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-white transition-colors flex items-center justify-center shrink-0"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
