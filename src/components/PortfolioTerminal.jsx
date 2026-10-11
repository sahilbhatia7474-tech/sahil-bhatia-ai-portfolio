import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  CornerDownLeft,
  Volume2,
  VolumeX,
  Palette,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Command,
  Activity,
  Layers,
  Cpu,
  Shield,
  Briefcase
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { queryAIAssistant } from '../lib/knowledgeModel';

const TERMINAL_THEMES = {
  crimson: {
    id: 'crimson',
    name: 'Laser Crimson (Default)',
    accent: '#ff2a3a',
    accentText: 'text-red-400',
    accentBg: 'bg-red-500/20',
    accentBorder: 'border-red-500/40',
    glow: 'rgba(255, 42, 58, 0.4)',
    promptColor: 'text-red-400',
    windowBorder: 'border-red-500/40',
    headerBg: 'bg-gradient-to-r from-[#1a0a0f] via-[#12080c] to-[#080509]',
  },
  emerald: {
    id: 'emerald',
    name: 'Cyber Matrix',
    accent: '#10b981',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500/20',
    accentBorder: 'border-emerald-500/40',
    glow: 'rgba(16, 185, 129, 0.4)',
    promptColor: 'text-emerald-400',
    windowBorder: 'border-emerald-500/40',
    headerBg: 'bg-gradient-to-r from-[#061a12] via-[#05140e] to-[#040d09]',
  },
  amber: {
    id: 'amber',
    name: 'Phosphor Amber CRT',
    accent: '#f59e0b',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500/20',
    accentBorder: 'border-amber-500/40',
    glow: 'rgba(245, 158, 11, 0.4)',
    promptColor: 'text-amber-400',
    windowBorder: 'border-amber-500/40',
    headerBg: 'bg-gradient-to-r from-[#1c1204] via-[#140d03] to-[#0a0701]',
  },
  cyan: {
    id: 'cyan',
    name: 'Quantum Cyan',
    accent: '#06b6d4',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500/20',
    accentBorder: 'border-cyan-500/40',
    glow: 'rgba(6, 182, 212, 0.4)',
    promptColor: 'text-cyan-400',
    windowBorder: 'border-cyan-500/40',
    headerBg: 'bg-gradient-to-r from-[#051622] via-[#04111a] to-[#020b12]',
  },
};

const SUGGESTED_QUERIES = [
  { label: 'help', cmd: 'help', desc: 'Display all commands' },
  { label: 'projects', cmd: 'projects', desc: 'Query all curated projects' },
  { label: 'skills', cmd: 'skills', desc: 'Inspect skills matrix' },
  { label: 'systems', cmd: 'systems', desc: 'Production AI architectures' },
  { label: 'query RAG', cmd: 'query RAG architectures', desc: 'Query RAG knowledge' },
  { label: 'journey', cmd: 'journey', desc: 'Career trajectory & milestones' },
  { label: 'benchmarks', cmd: 'benchmarks', desc: 'Latency & ROI metrics' },
  { label: 'contact', cmd: 'contact', desc: 'Direct consultation endpoints' },
  { label: 'whoami', cmd: 'whoami', desc: 'Session & cipher diagnostics' },
];

export default function PortfolioTerminal() {
  const portfolioData = usePortfolioData();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [themeKey, setThemeKey] = useState('crimson');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);
  const audioCtxRef = useRef(null);

  const activeTheme = TERMINAL_THEMES[themeKey] || TERMINAL_THEMES.crimson;

  // Web Audio subtle key click feedback
  const playTerminalBeep = useCallback((freq = 520, duration = 0.03) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
      }
    } catch (_e) {
      // Audio autoplay gracefully suppressed
    }
  }, [soundEnabled]);

  // Initial welcome message
  const [entries, setEntries] = useState([
    {
      id: 'init-1',
      type: 'system',
      text: [
        '========================================================================',
        '  SAHIL BHATIA // PORTFOLIO OS — INTERACTIVE COMMAND TERMINAL v2.6.4',
        '  Kernel: Linux x86_64-ai-agentic-wasm | Session: AUTHORIZED GUEST',
        '  Type "help" or click suggestion chips below to query this portfolio.',
        '========================================================================',
      ].join('\n'),
    },
    {
      id: 'init-2',
      type: 'info',
      text: 'Type "projects", "skills", "systems", "journey", or "query <topic>" to inspect.',
    },
  ]);

  // Auto-scroll terminal log to bottom
  useEffect(() => {
    if (isOpen && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [entries, isOpen]);

  // Global event listener & keyboard shortcut (backtick ` or ~)
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-portfolio-terminal', handleOpenEvent);

    const handleKeyDown = (e) => {
      // Toggle with backtick ` if not typing inside an input/textarea
      if (e.key === '`' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close on Escape if terminal is open
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-portfolio-terminal', handleOpenEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Helper to scroll to section
  const handleScrollToSection = (sectionId) => {
    const cleanId = sectionId.replace('#', '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
    return false;
  };

  // Execute command logic
  const executeCommand = useCallback((rawCmd) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    playTerminalBeep(440, 0.04);

    // Save to command history
    setCommandHistory((prev) => [trimmed, ...prev.filter((c) => c !== trimmed)].slice(0, 50));
    setHistoryPointer(-1);

    const cmdLower = trimmed.toLowerCase();
    const parts = trimmed.split(/\s+/);
    const primaryCmd = parts[0].toLowerCase();
    const cmdArgs = parts.slice(1).join(' ').trim();

    const timestamp = new Date().toLocaleTimeString();

    // 1. CLEAR command
    if (primaryCmd === 'clear' || primaryCmd === 'cls') {
      setEntries([]);
      return;
    }

    // Command echo entry
    const commandEntry = {
      id: `cmd-${Date.now()}-${Math.random()}`,
      type: 'command',
      command: trimmed,
      timestamp,
    };

    let resultEntry = null;

    // 2. HELP command
    if (primaryCmd === 'help' || primaryCmd === '?') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'help',
        title: 'AVAILABLE TERMINAL COMMANDS & QUERY SYNTAX:',
        commands: [
          { cmd: 'projects', desc: 'Query all curated production builds & repositories' },
          { cmd: 'skills', desc: 'Inspect full stack, AI/ML, and architecture skills matrix' },
          { cmd: 'systems', desc: 'View SYS-01, SYS-02, SYS-03 agentic architectures' },
          { cmd: 'journey', desc: 'Query professional career milestones (Paytm, Airtel, Excitel)' },
          { cmd: 'benchmarks', desc: 'Inspect empirical latency, ROI, and extraction metrics' },
          { cmd: 'contact', desc: 'Display direct consultation email, SLA, & mutual NDA' },
          { cmd: 'query <text>', desc: 'Semantic knowledge search over all portfolio facts' },
          { cmd: 'cat <file>', desc: 'Read file (cat bio, cat stack, cat contact, cat sysinfo)' },
          { cmd: 'goto <section>', desc: 'Navigate page to section (projects, systems, contact, etc.)' },
          { cmd: 'whoami', desc: 'Display client session, cipher diagnostics, and clearance' },
          { cmd: 'theme <name>', desc: 'Change theme: crimson, emerald, amber, cyan' },
          { cmd: 'matrix', desc: 'Run digital green cyber rain sequence' },
          { cmd: 'clear', desc: 'Clear terminal screen' },
        ],
      };
    }

    // 3. WHOAMI
    else if (primaryCmd === 'whoami') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'whoami',
        data: {
          user: 'guest@portfolio-client',
          role: 'AUTHORIZED_EVALUATOR',
          system: portfolioData.identity?.systemName || 'SAHIL / PORTFOLIO OS',
          cipher: 'TLS 1.3 / AES-256-GCM Verified Handshake',
          location: 'Remote Client Node',
          runtime: 'Vite 6.4 + React 19 + Tailwind v4 + WebAssembly',
          uptime: '100% Operational // Ready for Consultation',
        },
      };
    }

    // 4. PROJECTS / LS PROJECTS
    else if (primaryCmd === 'projects' || (primaryCmd === 'ls' && cmdArgs === 'projects')) {
      const projects = portfolioData.projects || [];
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'projects',
        title: `CURATED PRODUCTION PROJECTS (${projects.length} VERIFIED SYSTEMS):`,
        projects: projects.map((p, idx) => ({
          idx: idx + 1,
          id: p.id || p.slug,
          title: p.title,
          category: p.category || 'Production',
          year: p.year || '2025',
          stack: (p.techStack || []).slice(0, 3).join(', '),
          summary: p.summary || p.description,
          status: p.status || 'DEPLOYED',
        })),
      };
    }

    // 5. SKILLS / STACK
    else if (primaryCmd === 'skills' || primaryCmd === 'stack' || primaryCmd === 'capabilities') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'skills',
        title: 'VERIFIED TECHNICAL CAPABILITIES & PROFICIENCY MATRIX:',
        clusters: [
          {
            cluster: 'AI / LLM & Multi-Agent Architecture',
            skills: ['RAG Architectures', 'DAG Agent Planners', 'FastAPI Microservices', 'Prompt Engineering', 'LangChain / LlamaIndex'],
          },
          {
            cluster: 'Full-Stack & Reactive Engineering',
            skills: ['React 19 / Next.js', 'TypeScript', 'Tailwind CSS v4', 'Node.js / Express', 'Python / Pydantic'],
          },
          {
            cluster: 'System Infrastructure & Storage',
            skills: ['Firebase / Firestore', 'PostgreSQL / Cloud SQL', 'Vector Databases (Pinecone/Chroma)', 'Docker & Cloud Run'],
          },
          {
            cluster: 'Commercial Truth & Execution',
            skills: ['B2B Field Sales (Paytm)', 'BDE Telecommunications (Airtel)', 'Zero-to-One Product Scoping', 'Enterprise Client Advisory'],
          },
        ],
      };
    }

    // 6. SYSTEMS / AI-SYSTEMS
    else if (primaryCmd === 'systems' || primaryCmd === 'ai-systems') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'systems',
        title: 'AGENTIC ARCHITECTURES & PRODUCTION LAB (SYS-01 - SYS-03):',
        systems: [
          {
            code: 'SYS-01',
            title: 'SAHIL AI OS Companion Framework',
            tag: 'PERSONAL AGENT RUNTIME',
            desc: 'Cross-platform PWA & Android agent runtime with local cache and cloud synchronization.',
            metrics: 'Sub-100ms response &bull; PWA Installable',
          },
          {
            code: 'SYS-02',
            title: 'LYRA V2 Directed Acyclic Graph Planner',
            tag: 'DETERMINISTIC MULTI-AGENT SWARM',
            desc: 'Self-correcting workflow scheduler with memory persistence and validation checkpoints.',
            metrics: 'Zero-hallucination routing &bull; Automated self-repair',
          },
          {
            code: 'SYS-03',
            title: 'Enterprise AI Consultancy Operating System',
            tag: 'SME REVENUE ENGINE',
            desc: 'End-to-end automation playbook delivering high-leverage workflows and automated invoicing.',
            metrics: '99.2% extraction accuracy &bull; < 24h setup',
          },
        ],
      };
    }

    // 7. JOURNEY / EXPERIENCE
    else if (primaryCmd === 'journey' || primaryCmd === 'experience' || primaryCmd === 'career') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'journey',
        title: 'COMMERCIAL TRAJECTORY & CAREER MILESTONES:',
        milestones: [
          {
            period: 'July 2024 – March 2025',
            role: 'Field Sales Executive',
            company: 'Paytm (One97 Communications)',
            truth: 'Ground-truth commercial execution. Mastered objection handling and human conversion dynamics.',
          },
          {
            period: 'March 2025 – Dec 2026',
            role: 'BDE / Xstream Fiber Expert',
            company: 'Airtel Broadband (Bharti Airtel)',
            truth: 'Enterprise telecommunications sales and SLA fulfillment across high-density corridors.',
          },
          {
            period: 'Current / Scaling',
            role: 'Enterprise Territory Specialist',
            company: 'Excitel Broadband',
            truth: 'High-speed fiber rollout and commercial pipeline development with frontline accountability.',
          },
        ],
      };
    }

    // 8. BENCHMARKS / METRICS
    else if (primaryCmd === 'benchmarks' || primaryCmd === 'metrics') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'benchmarks',
        title: 'EMPIRICAL BENCHMARKS & PERFORMANCE PROOF:',
        metrics: [
          { label: 'Unstructured Document Extraction Accuracy', value: '99.2%', baseline: 'Industry std: 84%' },
          { label: 'RAG End-to-End Pipeline Latency', value: '< 240ms', baseline: 'Industry avg: 1.2s' },
          { label: 'Multi-Agent Self-Correction Rate', value: '94.8%', baseline: 'Sub-agent retry' },
          { label: 'Commercial Contract Intake Velocity', value: '10x Faster', baseline: 'Manual baseline' },
        ],
      };
    }

    // 9. CONTACT / HIRE
    else if (primaryCmd === 'contact' || primaryCmd === 'hire' || primaryCmd === 'email') {
      const email = portfolioData.identity?.contactEmail || 'sahilbhatia7474@gmail.com';
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'contact',
        title: 'DIRECT FOUNDER CONSULTATION GATEWAY:',
        email,
        sla: '< 24 Hours Guaranteed Review',
        confidentiality: 'Strict Bilateral Non-Disclosure Agreement (Mutual NDA)',
        actionTarget: 'contact',
      };
    }

    // 10. GOTO / CD (Navigation on page)
    else if (primaryCmd === 'goto' || primaryCmd === 'cd' || primaryCmd === 'jump') {
      const target = cmdArgs.toLowerCase().replace('#', '');
      const validTargets = ['hero', 'capabilities', 'skills', 'projects', 'systems', 'ai-systems', 'benchmarks', 'metrics', 'proof', 'certificates', 'contact', 'apps'];
      
      let actualTarget = target;
      if (target === 'skills') actualTarget = 'capabilities';
      if (target === 'systems') actualTarget = 'ai-systems';
      if (target === 'metrics') actualTarget = 'benchmarks';

      const success = handleScrollToSection(actualTarget);
      resultEntry = {
        id: `res-${Date.now()}`,
        type: success ? 'success' : 'error',
        text: success
          ? `[200 OK] Navigated viewport smoothly to #${actualTarget}`
          : `[404 NOT FOUND] Target "${target}" unrecognized. Valid sections: projects, systems, capabilities, benchmarks, proof, certificates, contact, hero`,
      };
    }

    // 11. CAT (Read File)
    else if (primaryCmd === 'cat') {
      const file = cmdArgs.toLowerCase();
      if (file === 'bio' || file === 'bio.md' || file === 'about') {
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'text',
          text: [
            '=== BIO: SAHIL BHATIA ===',
            'AI Generalist, AI Consultant & Systems Builder.',
            'Bridging frontline commercial realism (Paytm, Airtel) with advanced agentic systems engineering.',
            'Specialties: LLM RAG pipelines, autonomous agent swarms, sub-second UX engines, and high-conversion software.',
            'Location: Delhi NCR · Global Remote Advisory',
          ].join('\n'),
        };
      } else if (file === 'contact' || file === 'contact.json') {
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'text',
          text: JSON.stringify(
            {
              email: portfolioData.identity?.contactEmail || 'sahilbhatia7474@gmail.com',
              status: 'ACCEPTING Q2/Q3 BRIEFS',
              responseSLA: '< 24 hours',
              nda: 'Enforced bilateral confidentiality',
              links: portfolioData.identity?.socialLinks || {},
            },
            null,
            2
          ),
        };
      } else if (file === 'sysinfo' || file === 'system.log') {
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'text',
          text: [
            `System Name: ${portfolioData.identity?.systemName || 'SAHIL / PORTFOLIO OS'}`,
            'Release Version: v2.6.4 (Production)',
            'Architecture: Client SPA + Firebase Firestore + Google GenAI',
            'Security: TLS 1.3 Strict HTTPS · 0 Telemetry Cookies',
            'Status: HEALTH_NOMINAL_100%',
          ].join('\n'),
        };
      } else {
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'error',
          text: `cat: ${cmdArgs}: No such file. Try: cat bio, cat contact, cat sysinfo, or use 'ls'`,
        };
      }
    }

    // 12. LS / DIR
    else if (primaryCmd === 'ls' || primaryCmd === 'dir') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'text',
        text: [
          'drwxr-xr-x  projects/         (7 Curated Production Builds)',
          'drwxr-xr-x  ai-systems/       (SYS-01, SYS-02, SYS-03 Architectures)',
          'drwxr-xr-x  skills/           (AI/ML, RAG, Full-Stack, Cloud)',
          'drwxr-xr-x  journey/          (Commercial Trajectory: Paytm, Airtel, Excitel)',
          'drwxr-xr-x  benchmarks/       (Latency, ROI, Empirical Metrics)',
          'drwxr-xr-x  certificates/     (Google Cloud, DeepLearning.AI, IBM)',
          '-rw-r--r--  bio.md            (Principal Architect Profile)',
          '-rw-r--r--  contact.json      (Direct Founder Gateway & NDA)',
          '-rw-r--r--  sysinfo           (PORTFOLIO OS v2.6.4 Diagnostics)',
        ].join('\n'),
      };
    }

    // 13. THEME
    else if (primaryCmd === 'theme') {
      const requestedTheme = cmdArgs.toLowerCase();
      if (TERMINAL_THEMES[requestedTheme]) {
        setThemeKey(requestedTheme);
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'success',
          text: `Terminal palette shifted to "${TERMINAL_THEMES[requestedTheme].name}".`,
        };
      } else {
        resultEntry = {
          id: `res-${Date.now()}`,
          type: 'info',
          text: `Available themes: crimson, emerald, amber, cyan. Current: ${themeKey}. Usage: theme <color>`,
        };
      }
    }

    // 14. DATE
    else if (primaryCmd === 'date') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'text',
        text: new Date().toUTCString(),
      };
    }

    // 15. MATRIX EASTER EGG
    else if (primaryCmd === 'matrix') {
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'matrix',
        text: 'Waking up the neural matrix...',
      };
    }

    // 16. QUERY OR NATURAL LANGUAGE QUERY (via Knowledge Model)
    else {
      // If starts with "query", strip the word "query"
      const searchPrompt = primaryCmd === 'query' ? cmdArgs : trimmed;
      
      const knowledgeResponse = queryAIAssistant(searchPrompt, portfolioData);
      resultEntry = {
        id: `res-${Date.now()}`,
        type: 'knowledge',
        query: searchPrompt,
        text: knowledgeResponse?.text || `No matching records found for "${searchPrompt}". Type "help" or "ls" to inspect available data.`,
        actions: knowledgeResponse?.actions || [],
      };
    }

    setEntries((prev) => [...prev, commandEntry, resultEntry]);
  }, [portfolioData, themeKey, playTerminalBeep]);

  // Handle Input KeyDown (Enter, Up, Down, Tab)
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = inputVal;
      setInputVal('');
      executeCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextPointer = Math.min(historyPointer + 1, commandHistory.length - 1);
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const nextPointer = historyPointer - 1;
        setHistoryPointer(nextPointer);
        setInputVal(commandHistory[nextPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const val = inputVal.toLowerCase().trim();
      const candidate = SUGGESTED_QUERIES.find((sq) => sq.cmd.startsWith(val));
      if (candidate) {
        setInputVal(candidate.cmd);
      }
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING LAUNCHER DOCK WIDGET (BOTTOM RIGHT)               */}
      {/* ========================================================= */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border-2 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.85)] cursor-pointer active:scale-95 ${
            isOpen
              ? 'bg-gradient-to-r from-red-600 to-rose-600 border-white/40 text-white shadow-[0_0_24px_rgba(255,42,58,0.6)]'
              : 'bg-[#0a0d18] hover:bg-[#12172b] border-white/20 hover:border-red-500/70 text-neutral-200 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.7)]'
          }`}
          title="Open Interactive Command Terminal (Press ` to toggle)"
          aria-label="Toggle Interactive Portfolio Terminal"
        >
          {/* Subtle perimeter glow */}
          <span className="absolute -inset-0.5 rounded-2xl bg-red-500/15 blur-xs group-hover:bg-red-500/35 transition-all pointer-events-none" />

          {/* Terminal Icon & Prompt Glyph */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-black/50 border border-white/20 group-hover:border-red-500/50">
            <TerminalIcon className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
          </div>

          <div className="relative text-left font-mono">
            <div className="flex items-center gap-1.5 text-xs font-bold leading-tight">
              <span>sahil@os:~$</span>
              <span className="w-1.5 h-3 bg-red-400 animate-pulse inline-block" />
            </div>
            <span className="text-[10px] text-neutral-400 block font-normal leading-none pt-0.5 group-hover:text-neutral-300">
              CLI TERMINAL <span className="text-red-400 font-bold hidden sm:inline">[`]</span>
            </span>
          </div>

          {/* Live Activity Pulse Beacon */}
          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* FLOATING EXPANDED TERMINAL WINDOW                         */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Portfolio Interactive Terminal"
          className={`fixed z-50 flex flex-col font-mono text-xs transition-all duration-300 animate-in fade-in zoom-in-95 shadow-[0_30px_90px_rgba(0,0,0,0.95)] ${
            isMaximized
              ? 'inset-3 sm:inset-6 rounded-2xl'
              : 'bottom-20 right-4 sm:bottom-24 sm:right-6 w-[94vw] sm:w-[580px] md:w-[680px] max-w-[96vw] h-[540px] max-h-[82vh] rounded-2xl'
          } bg-[#070912]/98 border-2 ${activeTheme.windowBorder} overflow-hidden backdrop-blur-2xl`}
          style={{
            boxShadow: `0 0 50px ${activeTheme.glow}, 0 25px 60px rgba(0, 0, 0, 0.95)`,
          }}
        >
          {/* Luminous Top Horizon Accent Bar */}
          <div
            className="h-[2px] w-full"
            style={{
              background: `linear-gradient(to right, transparent, ${activeTheme.accent}, transparent)`,
            }}
          />

          {/* Terminal Window Header Bar (macOS / Linux style) */}
          <div className={`px-4 py-3 ${activeTheme.headerBg} border-b border-white/10 flex items-center justify-between gap-3 shrink-0 select-none`}>
            {/* Window Controls: Red (Close), Yellow (Clear), Green (Maximize) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-400/50 flex items-center justify-center transition-all cursor-pointer group"
                title="Close Terminal (Esc)"
              >
                <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
              </button>
              <button
                type="button"
                onClick={() => setEntries([])}
                className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 border border-amber-400/50 flex items-center justify-center transition-all cursor-pointer group"
                title="Clear Terminal Buffer"
              >
                <Trash2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized((prev) => !prev)}
                className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-400/50 flex items-center justify-center transition-all cursor-pointer group"
                title={isMaximized ? 'Restore Window Size' : 'Maximize Terminal'}
              >
                {isMaximized ? (
                  <Minimize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
                ) : (
                  <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
                )}
              </button>

              <span className="text-neutral-400 text-[11px] font-bold pl-2 truncate">
                sahil@portfolio-os: ~/cli (bash 5.2)
              </span>
            </div>

            {/* Right Action Tools: Sound, Theme, Close */}
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  soundEnabled
                    ? 'bg-white/10 text-white border-white/20'
                    : 'hover:bg-white/5 text-neutral-400 border-transparent'
                }`}
                title={soundEnabled ? 'Terminal Audio Active' : 'Enable Terminal Audio Feedback'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Theme Cycle Button */}
              <button
                type="button"
                onClick={() => {
                  const keys = Object.keys(TERMINAL_THEMES);
                  const nextIndex = (keys.indexOf(themeKey) + 1) % keys.length;
                  setThemeKey(keys[nextIndex]);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10 cursor-pointer"
                title={`Switch Terminal Theme (Current: ${activeTheme.name})`}
              >
                <Palette className="w-3.5 h-3.5" style={{ color: activeTheme.accent }} />
              </button>

              {/* Minimize / Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors border border-transparent hover:border-white/10 cursor-pointer"
                title="Minimize Terminal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ======================================================= */}
          {/* TERMINAL BODY / SCROLLABLE BUFFER                        */}
          {/* ======================================================= */}
          <div
            ref={terminalBodyRef}
            className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 text-neutral-200 select-text scroll-smooth"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)
              `,
              backgroundSize: '16px 16px',
            }}
          >
            {entries.map((entry) => {
              if (entry.type === 'command') {
                return (
                  <div key={entry.id} className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <span className={activeTheme.promptColor}>guest@sahil-os:~$</span>
                    <span className="text-white font-bold">{entry.command}</span>
                    <span className="text-[10px] text-neutral-400 ml-auto">{entry.timestamp}</span>
                  </div>
                );
              }

              if (entry.type === 'system') {
                return (
                  <div key={entry.id} className="text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed">
                    {entry.text}
                  </div>
                );
              }

              if (entry.type === 'help') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {entry.commands.map((c, i) => (
                        <div
                          key={i}
                          onClick={() => executeCommand(c.cmd)}
                          className="p-2 rounded-lg bg-[#05060d] hover:bg-white/10 border border-white/10 hover:border-red-500/50 cursor-pointer transition-all flex flex-col gap-0.5 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white font-mono group-hover:text-red-400 transition-colors">
                              $ {c.cmd}
                            </span>
                            <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <span className="text-[11px] text-neutral-300">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'projects') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="space-y-2">
                      {entry.projects.map((p) => (
                        <div
                          key={p.id}
                          className="p-2.5 rounded-lg bg-[#05060d] border border-white/10 hover:border-red-500/50 transition-colors space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-xs sm:text-sm">
                              [{p.idx}] {p.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                              {p.year}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-300">{p.summary}</div>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-300">
                            <span>Stack: {p.stack}</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleScrollToSection('projects');
                                setIsOpen(false);
                              }}
                              className="text-red-400 hover:text-white underline cursor-pointer inline-flex items-center gap-1 font-bold"
                            >
                              <span>View Project Card</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'skills') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {entry.clusters.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#05060d] border border-white/10 space-y-1">
                          <span className="text-red-400 font-bold text-xs block">{c.cluster}</span>
                          <ul className="text-[11px] text-neutral-300 space-y-0.5 list-disc list-inside">
                            {c.skills.map((s, si) => (
                              <li key={si}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'systems') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="space-y-2">
                      {entry.systems.map((s) => (
                        <div key={s.code} className="p-2.5 rounded-lg bg-[#05060d] border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">
                              {s.code}: {s.title}
                            </span>
                            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              {s.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-300">{s.desc}</p>
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between pt-1">
                            <span dangerouslySetInnerHTML={{ __html: s.metrics }} />
                            <button
                              type="button"
                              onClick={() => {
                                handleScrollToSection('ai-systems');
                                setIsOpen(false);
                              }}
                              className="text-red-400 hover:text-white underline cursor-pointer"
                            >
                              Inspect Architecture →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'journey') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="space-y-2">
                      {entry.milestones.map((m, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-[#05060d] border border-white/10 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{m.company}</span>
                            <span className="text-neutral-400 text-[10px]">{m.period}</span>
                          </div>
                          <div className="text-red-400 text-xs font-semibold">{m.role}</div>
                          <p className="text-[11px] text-neutral-300 leading-relaxed">{m.truth}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'contact') {
                return (
                  <div key={entry.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-neutral-400">EMAIL:</span>
                        <a href={`mailto:${entry.email}`} className="text-red-400 hover:text-white font-bold underline">
                          {entry.email}
                        </a>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-white/10">
                        <span className="text-neutral-400">RESPONSE SLA:</span>
                        <span className="text-emerald-400 font-bold">{entry.sla}</span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-neutral-400">CONFIDENTIALITY:</span>
                        <span className="text-white">{entry.confidentiality}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleScrollToSection('contact');
                        setIsOpen(false);
                      }}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase cursor-pointer text-center"
                    >
                      Open Project Intake Console →
                    </button>
                  </div>
                );
              }

              if (entry.type === 'benchmarks') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="font-bold text-white uppercase tracking-wider text-xs">
                      {entry.title}
                    </div>
                    <div className="space-y-1.5">
                      {entry.metrics.map((bm, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#05060d] border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-white text-xs block font-medium">{bm.label}</span>
                            <span className="text-[10px] text-neutral-400">{bm.baseline}</span>
                          </div>
                          <span className="text-emerald-400 font-bold text-sm font-mono pl-3">{bm.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (entry.type === 'whoami') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                    {Object.entries(entry.data).map(([k, v]) => (
                      <div key={k} className="flex items-start justify-between py-0.5 border-b border-white/5">
                        <span className="text-neutral-400 uppercase">{k}:</span>
                        <span className="text-white font-bold text-right pl-3">{v}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              if (entry.type === 'knowledge') {
                return (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1.5">
                      <span className="text-neutral-400 uppercase">QUERY: &ldquo;{entry.query}&rdquo;</span>
                      <span className="text-emerald-400 font-bold">[FACT-CHECKED RESULT]</span>
                    </div>
                    <div className="text-neutral-200 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans">
                      {entry.text}
                    </div>
                    {entry.actions && entry.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                        {entry.actions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              if (act.destination) {
                                handleScrollToSection(act.destination);
                                setIsOpen(false);
                              } else if (act.prompt) {
                                executeCommand(act.prompt);
                              }
                            }}
                            className="px-2.5 py-1 rounded bg-[#0e1122] hover:bg-red-600 border border-white/20 hover:border-red-500 text-[11px] font-mono text-white transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Default text / error / success
              return (
                <div
                  key={entry.id}
                  className={`whitespace-pre-wrap leading-relaxed ${
                    entry.type === 'error'
                      ? 'text-red-400 font-bold'
                      : entry.type === 'success'
                      ? 'text-emerald-400 font-bold'
                      : 'text-neutral-300'
                  }`}
                >
                  {entry.text}
                </div>
              );
            })}
          </div>

          {/* ======================================================= */}
          {/* QUICK CHIP SUGGESTIONS BAR (1-CLICK EXECUTION)          */}
          {/* ======================================================= */}
          <div className="px-3.5 py-2 bg-[#05070f] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Command className="w-3 h-3 text-red-400" />
              QUICK:
            </span>
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q.cmd}
                type="button"
                onClick={() => executeCommand(q.cmd)}
                className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 hover:border-red-500/50 text-[11px] font-mono text-neutral-300 hover:text-white transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
              >
                ${q.label}
              </button>
            ))}
          </div>

          {/* ======================================================= */}
          {/* TERMINAL INPUT LINE                                     */}
          {/* ======================================================= */}
          <div className="p-3 sm:p-4 bg-[#030409] border-t border-white/15 flex items-center gap-2 shrink-0">
            <span className={`${activeTheme.promptColor} font-bold text-xs sm:text-sm select-none shrink-0`}>
              guest@sahil-os:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type command or query (e.g. 'projects', 'skills', 'query RAG', 'help')..."
              className="flex-1 bg-transparent border-none text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-neutral-400"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => {
                const cmd = inputVal;
                setInputVal('');
                executeCommand(cmd);
              }}
              disabled={!inputVal.trim()}
              className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              title="Run Command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
