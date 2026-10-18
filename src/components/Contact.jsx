import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Mail,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Send,
  Clock,
  Cpu,
  Bot,
  Layers,
  Sparkles,
  Zap,
  Lock,
  Check,
  Copy,
  Sliders,
  CornerDownRight,
  ChevronDown,
  Shield,
  Radio,
  User,
  AlertCircle,
  Flame,
  Globe
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { submitInquiry } from '../lib/dbService';
import { sendDirectEmail, TARGET_EMAIL } from '../lib/emailService';
import MinimalistTerminalContactForm from './MinimalistTerminalContactForm';
import { isValidHttpUrl } from '../lib/projectLinks';

const CONSULTATION_TRACKS = [
  {
    id: 'AI Systems',
    label: 'AI Systems & Architecture',
    tag: 'PRODUCTION AI',
    beacon: 'LIVE PIPELINE',
    beaconColor: 'bg-red-400',
    pingColor: 'bg-red-500',
    icon: Cpu,
    glowColor: 'rgba(239, 68, 68, 0.45)',
    borderGlow: 'hover:border-red-500/70 hover:shadow-[0_10px_30px_rgba(239,68,68,0.3)]',
    activeStyle: 'border-red-500 bg-gradient-to-br from-[#2a1017] via-[#1a0c14] to-[#100914] shadow-[0_12px_36px_rgba(239,68,68,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'LLM pipelines, RAG engines, multi-model orchestrations & real-time inference architectures.',
    samplePrompts: ['Production RAG over proprietary company data', 'High-throughput LLM gateway with caching', 'Local / Cloud hybrid model routing']
  },
  {
    id: 'AI Agents',
    label: 'Autonomous AI Agents',
    tag: 'AGENTIC WORKFLOWS',
    beacon: 'AGENT SWARM',
    beaconColor: 'bg-emerald-400',
    pingColor: 'bg-emerald-500',
    icon: Bot,
    glowColor: 'rgba(52, 211, 153, 0.45)',
    borderGlow: 'hover:border-emerald-500/70 hover:shadow-[0_10px_30px_rgba(52,211,153,0.3)]',
    activeStyle: 'border-emerald-500 bg-gradient-to-br from-[#0c2419] via-[#091b13] to-[#07130f] shadow-[0_12px_36px_rgba(52,211,153,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'Goal-driven autonomous agents with deterministic tool-calling, memory & swarm execution.',
    samplePrompts: ['Autonomous customer intelligence agent', 'Self-correcting data extraction swarm', 'Lead enrichment & automated outreach agent']
  },
  {
    id: 'Automation',
    label: 'Intelligent Automation',
    tag: 'SYSTEM INTEGRATION',
    beacon: 'HIGH VOLTAGE',
    beaconColor: 'bg-amber-400',
    pingColor: 'bg-amber-500',
    icon: Zap,
    glowColor: 'rgba(245, 158, 11, 0.45)',
    borderGlow: 'hover:border-amber-500/70 hover:shadow-[0_10px_30px_rgba(245,158,11,0.3)]',
    activeStyle: 'border-amber-500 bg-gradient-to-br from-[#271809] via-[#1c1207] to-[#110a04] shadow-[0_12px_36px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'End-to-end business logic pipelines, webhook triggers & unified API orchestration.',
    samplePrompts: ['CRM to LLM automated synchronization', 'Intelligent invoice & contract parsing', 'Zero-touch billing & reconciliation engine']
  },
  {
    id: 'Digital Product',
    label: 'AI-Native Digital Product',
    tag: '0-TO-1 MVP / SCALE',
    beacon: 'QUANTUM BUILD',
    beaconColor: 'bg-cyan-400',
    pingColor: 'bg-cyan-500',
    icon: Layers,
    glowColor: 'rgba(6, 182, 212, 0.45)',
    borderGlow: 'hover:border-cyan-500/70 hover:shadow-[0_10px_30px_rgba(6,182,212,0.3)]',
    activeStyle: 'border-cyan-500 bg-gradient-to-br from-[#0a202d] via-[#071720] to-[#040f16] shadow-[0_12px_36px_rgba(6,182,212,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'From concept and rapid architecture to production-hardened SaaS web & mobile applications.',
    samplePrompts: ['Full-stack AI SaaS MVP built in 3 weeks', 'High-conversion interactive web platform', 'Enterprise dashboard with live analytics']
  },
  {
    id: 'UX / Website',
    label: 'Ultra-Modern UX / Web Engine',
    tag: 'EXPERIENCE & SPEED',
    beacon: 'CINEMATIC 3D',
    beaconColor: 'bg-purple-400',
    pingColor: 'bg-purple-500',
    icon: Sparkles,
    glowColor: 'rgba(168, 85, 247, 0.45)',
    borderGlow: 'hover:border-purple-500/70 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)]',
    activeStyle: 'border-purple-500 bg-gradient-to-br from-[#230f2d] via-[#1a0a22] to-[#110617] shadow-[0_12px_36px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'Cinematic interactive interfaces, sub-second latency, micro-animations & award-grade design.',
    samplePrompts: ['Cinematic brand landing page & showreel', 'Interactive 3D product demonstration', 'High-conversion design system implementation']
  },
  {
    id: 'Business Workflow',
    label: 'Enterprise Business Systems',
    tag: 'OPERATIONAL SCALE',
    beacon: 'ENTERPRISE',
    beaconColor: 'bg-indigo-400',
    pingColor: 'bg-indigo-500',
    icon: Sliders,
    glowColor: 'rgba(99, 102, 241, 0.45)',
    borderGlow: 'hover:border-indigo-500/70 hover:shadow-[0_10px_30px_rgba(99,102,241,0.3)]',
    activeStyle: 'border-indigo-500 bg-gradient-to-br from-[#12142d] via-[#0d0f22] to-[#070916] shadow-[0_12px_36px_rgba(99,102,241,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'Operational audits, automated knowledge bases & tailored high-leverage internal tools.',
    samplePrompts: ['Executive intelligence decision dashboard', 'Internal knowledge AI copilot for teams', 'Multi-department workflow migration to AI']
  },
  {
    id: 'Other',
    label: 'Bespoke Advisory / Custom Scope',
    tag: 'CUSTOM INQUIRY',
    beacon: 'BESPOKE KEY',
    beaconColor: 'bg-rose-400',
    pingColor: 'bg-rose-500',
    icon: Terminal,
    glowColor: 'rgba(244, 63, 94, 0.45)',
    borderGlow: 'hover:border-rose-500/70 hover:shadow-[0_10px_30px_rgba(244,63,94,0.3)]',
    activeStyle: 'border-rose-500 bg-gradient-to-br from-[#270e17] via-[#1c0a10] to-[#12060a] shadow-[0_12px_36px_rgba(244,63,94,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]',
    desc: 'Technical advisory, feasibility analysis, code security auditing or private workshop.',
    samplePrompts: ['Architecture review & security audit', 'AI feasibility study for founders / investors', 'Private technical advisory & training session']
  },
];

const ENGAGEMENT_VELOCITIES = [
  { id: 'URGENT', label: 'Priority Sprint (< 2 weeks)', beacon: 'FAST-TRACK', dot: 'bg-rose-400', color: 'text-rose-400' },
  { id: 'STANDARD', label: 'Standard Scope (2 - 6 weeks)', beacon: 'BALANCED', dot: 'bg-amber-400', color: 'text-amber-400' },
  { id: 'STRATEGIC', label: 'Quarterly Strategic Advisory', beacon: 'ONGOING', dot: 'bg-emerald-400', color: 'text-emerald-400' },
];

const ESTIMATED_BUDGETS = [
  'Pre-seed / Exploratory (< $5k)',
  'MVP / Production Build ($5k - $20k)',
  'Enterprise System Scale ($20k+)',
  'Equity / Strategic Advisory',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DirectProfileLink({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative px-4 py-2.5 rounded-xl bg-[#0c0e18] hover:bg-[#141828] border border-white/15 hover:border-red-500/60 text-neutral-200 hover:text-white flex items-center gap-2 font-mono text-xs font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_6px_22px_rgba(255,42,58,0.25)] transition-all duration-200 active:scale-95"
    >
      <span>{item.label}</span>
      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

const Contact = () => {
  const { identity } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    selectedArea: 'AI Systems',
    problem: '',
    email: '',
    timeline: 'STANDARD',
    budget: 'MVP / Production Build ($5k - $20k)',
    confidentialityRequired: true,
    companyUrl: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [receiptCode, setReceiptCode] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeFormMode, setActiveFormMode] = useState('minimalist'); // 'minimalist' | 'comprehensive'
  const lastSubmitRef = useRef(0);

  // Dynamic light tracking for rich interactive background
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  const handleConsoleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
    setLightPos({ x, y });
  }, []);

  const handleSelectArea = (area) => {
    setFormData((prev) => ({ ...prev, selectedArea: area }));
  };

  const handleApplyPrompt = (promptText) => {
    setFormData((prev) => ({
      ...prev,
      problem: prev.problem ? `${prev.problem}\n\nObjective: ${promptText}` : promptText,
    }));
  };

  const copyEmailAddress = () => {
    const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';
    navigator.clipboard.writeText(contactEmail).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const stepsCompleted = useMemo(() => {
    let count = 0;
    if (formData.name.trim().length > 1) count += 1;
    if (formData.selectedArea) count += 1;
    if (formData.problem.trim().length >= 10) count += 1;
    if (EMAIL_REGEX.test(formData.email.trim())) count += 1;
    return count;
  }, [formData]);

  const completionPercentage = useMemo(() => {
    return Math.round((stepsCompleted / 4) * 100);
  }, [stepsCompleted]);

  const activeTrackMeta = useMemo(() => {
    return CONSULTATION_TRACKS.find((t) => t.id === formData.selectedArea) || CONSULTATION_TRACKS[0];
  }, [formData.selectedArea]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    const now = Date.now();
    if (now - lastSubmitRef.current < 4000) {
      setValidationError('Please wait a moment before dispatching another consultation brief.');
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 200) {
      setValidationError('Please provide a valid name or organization (2-200 characters).');
      return;
    }

    const trimmedEmail = formData.email.trim().toLowerCase();
    if (!trimmedEmail || trimmedEmail.length > 254 || !EMAIL_REGEX.test(trimmedEmail)) {
      setValidationError('Please provide a valid direct email address.');
      return;
    }

    const trimmedProblem = formData.problem.trim();
    if (!trimmedProblem || trimmedProblem.length < 5 || trimmedProblem.length > 5000) {
      setValidationError('Please outline your core objective or system challenge (5-5,000 characters).');
      return;
    }

    lastSubmitRef.current = now;
    setSubmitting(true);

    try {
      // 1. Save to Firestore
      const res = await submitInquiry({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedProblem,
        subject: `Consultation: ${formData.selectedArea}`,
        category: formData.selectedArea,
        timeline: formData.timeline,
        budget: formData.budget,
        confidentialityRequested: formData.confidentialityRequired,
        honeypot: formData.companyUrl,
      });

      // 2. Dispatch to sahilbhatia7474@gmail.com via lightweight email service
      sendDirectEmail({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedProblem,
        subject: `[Consultation Intake] ${formData.selectedArea} - ${trimmedName}`,
        category: formData.selectedArea,
        timeline: formData.timeline,
        budget: formData.budget,
        confidentiality: formData.confidentialityRequired,
      }).catch((emailErr) => console.warn('Direct email dispatch note:', emailErr?.message));

      if (res.success) {
        setReceiptCode(res.id || `INQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
        setSubmitted(true);
        setFormData({
          name: '',
          selectedArea: 'AI Systems',
          problem: '',
          email: '',
          timeline: 'STANDARD',
          budget: 'MVP / Production Build ($5k - $20k)',
          confidentialityRequired: true,
          companyUrl: '',
        });
      } else {
        setValidationError(res.error || 'Transmission failed. Please check network connectivity and try again.');
      }
    } catch (err) {
      setValidationError(err?.message || 'A network error occurred while transmitting to Firestore.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  const rawSocial = identity?.socialLinks || {};
  const activeSocialLinks = [];

  const instaUrl =
    rawSocial.instagram?.url ||
    (typeof rawSocial.instagram === 'string'
      ? rawSocial.instagram
      : 'https://www.instagram.com/neutronverse.ai');
  if (instaUrl && isValidHttpUrl(instaUrl) && rawSocial.instagram?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'instagram',
      label: rawSocial.instagram?.label || 'Instagram',
      url: instaUrl.trim(),
      sortOrder: rawSocial.instagram?.sortOrder ?? 1,
    });
  }

  const linkedInUrl =
    rawSocial.linkedin?.url ||
    (typeof rawSocial.linkedin === 'string'
      ? rawSocial.linkedin
      : 'https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2');
  if (linkedInUrl && isValidHttpUrl(linkedInUrl) && rawSocial.linkedin?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'linkedin',
      label: rawSocial.linkedin?.label || 'LinkedIn',
      url: linkedInUrl.trim(),
      sortOrder: rawSocial.linkedin?.sortOrder ?? 2,
    });
  }

  const ghUrl =
    rawSocial.github?.url ||
    (typeof rawSocial.github === 'string'
      ? rawSocial.github
      : 'https://github.com/sahilbhatia7474-tech');
  if (ghUrl && isValidHttpUrl(ghUrl) && rawSocial.github?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'github',
      label: rawSocial.github?.label || 'GitHub',
      url: ghUrl.trim(),
      sortOrder: rawSocial.github?.sortOrder ?? 3,
    });
  }

  activeSocialLinks.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 bg-transparent border-b border-white/10 relative overflow-hidden"
    >
      {/* ========================================================= */}
      {/* RICH FUTURISTIC BACKGROUND RIG (ATMOSPHERIC NEON AURA)    */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Layered Cyber Void Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080914]/30 to-transparent" />

        {/* Luminous Neon Grid Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 42, 58, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 42, 58, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)',
          }}
        />

        {/* Laser Horizon Specular Lines */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_24px_#ff2a3a]" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[3px] bg-gradient-to-r from-transparent via-rose-500 to-transparent blur-[2px]" />

        {/* Dual Atmospheric Volumetric Backlights */}
        <div className="absolute -top-32 right-12 w-[800px] h-[600px] bg-red-600/[0.12] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-24 left-10 w-[700px] h-[500px] bg-indigo-600/[0.1] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-rose-500/[0.04] rounded-full blur-[180px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================= */}
        {/* SECTION HEADER: ICONIC, HIGH-IMPACT LAUNCHPAD             */}
        {/* ========================================================= */}
        <div className="max-w-4xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 via-rose-500/15 to-red-500/10 border border-red-500/40 shadow-[0_0_24px_rgba(255,42,58,0.3)] font-mono text-xs text-red-300 uppercase tracking-widest font-black mb-5">
            <span className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute w-4 h-4 rounded-full bg-red-500/50 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_#ff2a3a]" />
            </span>
            <span>HIGH-IMPACT INTAKE CONSOLE // DIRECT FOUNDER ACCESS</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/30 text-white border border-red-500/50 hidden sm:inline-block">
              24H SLA
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase leading-[1.08]">
            PROJECT INTAKE <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">&amp;</span> CONSULTATION CONSOLE
          </h2>

          <p className="text-base sm:text-lg text-neutral-200 font-sans mt-4 leading-relaxed max-w-3xl font-normal">
            Direct gateway for launching production AI architectures, autonomous agents, modern digital products, and high-leverage business systems. Tell me what you are building or the bottleneck slowing your growth.
          </p>

          {/* Quick SLA & Trust Guarantee Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c0e1a] border border-white/20 hover:border-emerald-500/50 text-xs font-mono text-neutral-200 shadow-md font-medium transition-colors">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Founder Review</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c0e1a] border border-white/20 hover:border-red-500/50 text-xs font-mono text-neutral-200 shadow-md font-medium transition-colors">
              <Clock className="w-4 h-4 text-red-400" />
              <span>&le; 24h Response SLA</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c0e1a] border border-white/20 hover:border-cyan-500/50 text-xs font-mono text-neutral-200 shadow-md font-medium transition-colors">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Strict NDA &amp; Mutual Confidentiality</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0c0e1a] border border-emerald-500/40 text-xs font-mono text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.2)] font-semibold">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Direct Channel Active</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2-COLUMN LAYOUT: ICONIC PROFILE + CONSOLE                 */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ------------------------------------------------------- */}
          {/* LEFT COLUMN: FOUNDER IDENTITY & SIGNAL TELEMETRY        */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channel Profile Card */}
            <div className="rounded-3xl bg-gradient-to-b from-[#101322] via-[#0b0d18] to-[#070810] border-2 border-white/15 p-7 space-y-6 shadow-[0_24px_50px_rgba(0,0,0,0.85)] relative overflow-hidden group">
              {/* Luminous Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_#ff2a3a]" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-mono text-red-400 uppercase tracking-wider font-black">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(255,42,58,0.35)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>DIRECT CONSULTATION CHANNEL</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 font-black shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ONLINE
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-black block mb-1">
                  PRINCIPAL CONSULTANT &amp; ARCHITECT
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide block">
                  SAHIL BHATIA
                </span>
                <span className="text-sm text-neutral-300 font-sans block mt-1.5 leading-relaxed font-normal">
                  AI Generalist &bull; System Architect &bull; AI-Native Builder &bull; Full-Stack Engineer
                </span>
              </div>

              {/* Direct Mail Box with Click-to-Copy */}
              <div className="pt-5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-neutral-300 uppercase tracking-wider font-bold">
                    VERIFIED DIRECT EMAIL
                  </span>
                  <button
                    type="button"
                    onClick={copyEmailAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-neutral-100 hover:text-white transition-all cursor-pointer font-bold active:scale-95 shadow-sm"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIED TO CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-300" />
                        <span>COPY ADDRESS</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${contactEmail}?subject=Consultation%20Inquiry%20-%20Project%20Brief`}
                  className="text-base sm:text-lg font-mono font-bold text-white hover:text-red-400 transition-colors break-all flex items-center justify-between p-3.5 rounded-xl bg-[#05060d] border border-white/20 hover:border-red-500/60 shadow-inner group/mail"
                >
                  <span className="truncate">{contactEmail}</span>
                  <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover/mail:text-red-400 group-hover/mail:translate-x-1 group-hover/mail:-translate-y-1 transition-transform shrink-0 ml-2" />
                </a>
              </div>

              {/* Consultation Protocol Information */}
              <div className="pt-5 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider font-black">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>RESPONSE PROTOCOL</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  Briefs submitted here bypass spam filters and land directly in Sahil’s priority queue. High-signal submissions receive a detailed feasibility assessment and direct scheduling link within 24 hours.
                </p>
              </div>

              {/* Confidentiality Guarantee */}
              <div className="pt-5 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>MUTUAL NON-DISCLOSURE GUARANTEE</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  Every concept, repository, business data point, and IP shared is treated as proprietary. Standard bilateral NDAs executed prior to deep architectural teardowns upon request.
                </p>
              </div>
            </div>

            {/* Verified Direct Profiles */}
            {activeSocialLinks.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-black">
                    VERIFIED DIRECT PROFILES
                  </span>
                  <span className="text-xs font-mono text-red-400 font-bold">FOUNDER SOCIALS</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {activeSocialLinks.map((item) => (
                    <DirectProfileLink key={item.key} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT COLUMN (FOCAL POINT): PROJECT BRIEFING CONSOLE    */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-7">
            {/* Console Chassis Box - Selector 1 */}
            <div
              onMouseMove={handleConsoleMouseMove}
              className="rounded-3xl bg-gradient-to-b from-[#13172e] via-[#0c0f20] to-[#060814] border-2 border-red-500/40 hover:border-red-500/60 p-6 sm:p-9 lg:p-10 shadow-[0_35px_90px_-10px_rgba(0,0,0,0.98),0_0_0_1px_rgba(255,255,255,0.14),0_0_40px_rgba(255,42,58,0.18),inset_0_1px_1px_rgba(255,255,255,0.25)] relative overflow-hidden group transition-all duration-300 antialiased"
              style={{
                backgroundImage: `
                  radial-gradient(800px circle at ${lightPos.x}% ${lightPos.y}%, rgba(255, 42, 58, 0.16), rgba(99, 102, 241, 0.08) 32%, transparent 70%),
                  linear-gradient(to bottom, rgba(19, 23, 46, 0.98), rgba(6, 8, 20, 0.99))
                `,
              }}
            >
              {/* Tactical HUD Corner Registration Brackets */}
              <span className="absolute top-3 left-3 text-red-500/60 font-mono text-sm font-black select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,42,58,0.4)]">┌</span>
              <span className="absolute top-3 right-3 text-red-500/60 font-mono text-sm font-black select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,42,58,0.4)]">┐</span>
              <span className="absolute bottom-3 left-3 text-red-500/60 font-mono text-sm font-black select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,42,58,0.4)]">└</span>
              <span className="absolute bottom-3 right-3 text-red-500/60 font-mono text-sm font-black select-none pointer-events-none drop-shadow-[0_0_8px_rgba(255,42,58,0.4)]">┘</span>

              {/* Luminous Top Perimeter Accent */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_24px_#ff2a3a]" />
              <div className="absolute top-0 inset-x-16 h-[3px] bg-gradient-to-r from-transparent via-red-500/90 to-transparent blur-[2px]" />

              {/* Console Header Bar with High-Impact Readiness Progress Bar */}
              <div className="pb-6 mb-8 border-b-2 border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex items-center justify-center w-3 h-3">
                      <span className="absolute w-4 h-4 rounded-full bg-red-500/60 animate-ping" />
                      <span className="relative w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ff2a3a]" />
                    </span>
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest font-black">
                      INTAKE CONSOLE // DIRECT SUBMISSION GATEWAY
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white flex items-center gap-3">
                    <span>{activeFormMode === 'minimalist' ? 'MINIMALIST TERMINAL FORM' : 'PROJECT SPECIFICATION'}</span>
                    <span className="text-xs font-mono font-bold text-white px-3 py-1 rounded-lg bg-white/10 border-2 border-white/20 tracking-wider hidden sm:inline-block shadow-inner">
                      TLS 1.3 SECURED
                    </span>
                  </h3>
                </div>

                {/* Form Mode Selector & Readiness Meter */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Mode Selector Pill */}
                  <div className="p-1.5 rounded-2xl bg-black/80 border-2 border-white/15 flex items-center gap-1.5 shadow-inner font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveFormMode('minimalist')}
                      className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-2 transition-all duration-150 cursor-pointer active:scale-95 ${
                        activeFormMode === 'minimalist'
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_16px_rgba(255,42,58,0.6)] border border-red-400/50'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-white" />
                      <span>MINIMALIST TERMINAL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFormMode('comprehensive')}
                      className={`px-3.5 py-2 rounded-xl font-black flex items-center gap-2 transition-all duration-150 cursor-pointer active:scale-95 ${
                        activeFormMode === 'comprehensive'
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_16px_rgba(255,42,58,0.6)] border border-red-400/50'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Sliders className="w-4 h-4 text-white" />
                      <span>DEEP SPECIFICATION</span>
                    </button>
                  </div>

                  {/* Specification Readiness Meter (visible in comprehensive mode) */}
                  {activeFormMode === 'comprehensive' && (
                    <div className="flex items-center gap-3.5 bg-[#05060e] px-4 py-2.5 rounded-2xl border-2 border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider block font-black">
                          READINESS PROGRESS
                        </span>
                        <div className="flex items-center gap-1.5 justify-end">
                          {completionPercentage === 100 && <Check className="w-4 h-4 text-emerald-400" />}
                          <span className={`text-xs font-mono font-black ${completionPercentage === 100 ? 'text-emerald-400' : 'text-white'}`}>
                            {completionPercentage}% {completionPercentage === 100 ? 'READY' : `(${stepsCompleted}/4)`}
                          </span>
                        </div>
                      </div>
                      <div className="w-20 h-3 rounded-full bg-white/10 overflow-hidden relative p-[2px] border border-white/20 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            completionPercentage === 100
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_16px_#34d399]'
                              : 'bg-gradient-to-r from-red-600 via-rose-500 to-red-500 shadow-[0_0_12px_#ff2a3a]'
                          }`}
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {submitted ? (
                /* Success Dispatch State: High-Resolution Cryptographic Receipt */
                <div className="py-14 sm:py-16 px-6 sm:px-8 text-center rounded-2xl bg-gradient-to-b from-[#101424] to-[#070912] border-2 border-emerald-500/50 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.9)] relative z-10 overflow-hidden">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_36px_rgba(52,211,153,0.35)] relative">
                    <CheckCircle2 className="w-10 h-10" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-xs text-black font-black font-mono">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-2 max-w-lg mx-auto">
                    <div className="font-mono text-xs text-emerald-400 uppercase tracking-widest font-black flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>DISPATCH CONFIRMED // INTAKE REGISTERED</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-display text-white uppercase tracking-tight">
                      Consultation Brief Transmitted
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-200 font-sans leading-relaxed pt-1">
                      Your project brief has been securely encrypted and deposited into Sahil&apos;s priority queue and dispatched directly to <span className="text-red-400 font-mono font-bold">{contactEmail}</span>. A thorough review and direct scheduling proposal will be sent to your email address within 24 hours.
                    </p>
                  </div>

                  {/* Summary of submitted brief telemetry */}
                  <div className="p-5 rounded-xl bg-black/75 border border-white/15 max-w-md mx-auto text-left font-mono text-xs text-neutral-200 space-y-2.5 shadow-inner">
                    {receiptCode && (
                      <div className="flex justify-between items-center text-neutral-300 pb-2 border-b border-white/10">
                        <span className="text-xs tracking-wider uppercase font-bold">RECEIPT REF:</span>
                        <span className="text-white font-mono font-bold text-xs bg-white/15 px-2.5 py-0.5 rounded border border-white/20">
                          {receiptCode}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-neutral-300 pb-2 border-b border-white/10">
                      <span className="text-xs tracking-wider uppercase font-bold">ROUTING STATUS:</span>
                      <span className="text-emerald-400 font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        DIRECT RELAY + FIRESTORE QUEUED
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-xs tracking-wider uppercase font-bold">CONFIDENTIALITY:</span>
                      <span className="text-white font-bold">ENFORCED (MUTUAL NDA)</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-300">
                      <span className="text-xs tracking-wider uppercase font-bold">EXPECTED RESPONSE SLA:</span>
                      <span className="text-emerald-400 font-black">&le; 24 HOURS</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
                    >
                      <span>Submit Another Brief</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : activeFormMode === 'minimalist' ? (
                /* Minimalist Secure Terminal Contact Form */
                <MinimalistTerminalContactForm
                  onSuccess={(receipt) => {
                    setReceiptCode(receipt.id);
                  }}
                />
              ) : (
                /* Primary Interactive Briefing Console Form */
                <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
                  {/* Anti-bot Honeypot Input */}
                  <div aria-hidden="true" className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden">
                    <label htmlFor="inquiry-company-url">Company Website URL</label>
                    <input
                      id="inquiry-company-url"
                      name="company_url_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.companyUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, companyUrl: e.target.value }))}
                    />
                  </div>

                  {validationError && (
                    <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 font-mono text-xs sm:text-sm text-red-100 flex items-center gap-3 shadow-[0_6px_28px_rgba(255,42,58,0.5)] animate-in fade-in">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="leading-relaxed flex-1 font-bold">{validationError}</span>
                    </div>
                  )}

                  {/* STEP 01 — IDENTITY & ORGANIZATION (Selector 3) */}
                  <div className="rounded-3xl bg-[#090b17] border-2 border-white/15 hover:border-red-500/60 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 p-5 sm:p-6 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-white px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30">
                          01
                        </span>
                        <div>
                          <h4 className="font-mono text-sm sm:text-base uppercase tracking-wider text-white font-black flex items-center gap-2">
                            <span>WHO IS REACHING OUT?</span>
                            <span className="text-[10px] text-red-400 font-bold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 hidden sm:inline-block">
                              FOUNDER / LEAD
                            </span>
                          </h4>
                          <span className="text-xs font-sans text-neutral-300 block font-normal">
                            Your name, startup, enterprise organization, or firm
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.name.trim().length > 1 ? (
                          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-black bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                            <Check className="w-3.5 h-3.5" /> LOGGED
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-red-400 uppercase font-black bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg">REQUIRED *</span>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan · Founder at Nova Systems (or Independent Builder)"
                        className="w-full min-h-[52px] pl-11 pr-4 py-3 rounded-2xl bg-[#05060d] border-2 border-white/20 text-white font-sans text-sm sm:text-base font-medium focus:outline-none focus:border-red-500 focus:bg-[#070914] focus:ring-2 focus:ring-red-500/30 transition-all placeholder:text-neutral-400 select-text shadow-inner"
                      />
                    </div>
                  </div>

                  {/* STEP 02 — 3D INTERACTIVE GLOWING BLINKING TABS (Selector 2) */}
                  <div className="rounded-3xl bg-[#090b17] border-2 border-white/15 p-5 sm:p-6 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-white px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30">
                          02
                        </span>
                        <div>
                          <h4 className="font-mono text-sm sm:text-base uppercase tracking-wider text-white font-black flex items-center gap-2">
                            <span>WHAT DOMAIN OR SYSTEM ARE WE BUILDING?</span>
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                          </h4>
                          <span className="text-xs font-sans text-neutral-300 block font-normal">
                            Select primary engineering track or consultation domain
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-red-400 uppercase font-black bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg hidden sm:inline-block">
                        CHOOSE TRACK
                      </span>
                    </div>

                    {/* 3D Interactive Glowing Blinking Tabs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {CONSULTATION_TRACKS.map((track) => {
                        const isSelected = formData.selectedArea === track.id;
                        const Icon = track.icon;
                        return (
                          <button
                            key={track.id}
                            type="button"
                            onClick={() => handleSelectArea(track.id)}
                            className={`p-4.5 rounded-2xl text-left transition-all duration-200 cursor-pointer select-none relative overflow-hidden group/btn hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.8)] active:translate-y-0.5 active:scale-[0.98] border-2 ${
                              isSelected
                                ? `${track.activeStyle} ring-2 ring-red-500/40`
                                : `bg-[#06070e] border-white/15 ${track.borderGlow} hover:bg-[#0c0f1e] shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)]`
                            }`}
                          >
                            {/* Glowing perimeter reflection edge */}
                            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                            <div className="flex items-start justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-3">
                                {/* 3D Glowing Icon Container */}
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-md ${
                                    isSelected
                                      ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.8)] border border-white/30'
                                      : 'bg-white/10 text-neutral-300 group-hover/btn:text-white group-hover/btn:bg-white/15 group-hover/btn:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className={`font-mono text-xs sm:text-sm font-black block tracking-tight ${isSelected ? 'text-white' : 'text-neutral-100 group-hover/btn:text-white'}`}>
                                    {track.label}
                                  </span>
                                </div>
                              </div>

                              {/* Blinking Status Beacon Badge */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${track.pingColor} opacity-75`} />
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${track.beaconColor} shadow-[0_0_8px_currentColor]`} />
                                </span>
                                <span
                                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-black ${
                                    isSelected
                                      ? 'bg-red-500/30 text-red-200 border border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                      : 'bg-white/10 text-neutral-300 border border-white/15'
                                  }`}
                                >
                                  {track.beacon}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-neutral-300 font-sans leading-relaxed line-clamp-2 pl-13 font-normal">
                              {track.desc}
                            </p>

                            {/* Active Tab Glowing Badge Bar */}
                            {isSelected && (
                              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-red-300 font-black">
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                                  ACTIVE ENGINE SELECTED
                                </span>
                                <span className="text-white bg-red-600/60 px-2 py-0.2 rounded font-mono">
                                  ✓ READY
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Track Quick-Prompts Pill Helper (Selector 4) */}
                    {activeTrackMeta?.samplePrompts && (
                      <div className="mt-4.5 p-4 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.02] to-white/[0.04] border-2 border-white/15 space-y-2.5 shadow-md">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-200 uppercase tracking-wider font-black">
                          <CornerDownRight className="w-4 h-4 text-red-400" />
                          <span>COMMON OBJECTIVES FOR {activeTrackMeta.label.toUpperCase()} (CLICK TO APPEND):</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeTrackMeta.samplePrompts.map((promptText, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleApplyPrompt(promptText)}
                              className="px-3.5 py-2 rounded-xl bg-[#06070e] hover:bg-[#181d33] hover:border-red-500/80 hover:shadow-[0_0_16px_rgba(255,42,58,0.35)] text-xs font-sans text-neutral-200 hover:text-white border border-white/20 transition-all cursor-pointer hover:-translate-y-0.5 active:scale-95 text-left inline-flex items-center gap-1.5 shadow-sm font-semibold"
                            >
                              <span className="text-red-400 font-mono font-black text-sm">+</span>
                              <span>{promptText}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 03 — PROBLEM, OBJECTIVE & TECHNICAL BOTTLENECK (Selector 5) */}
                  <div className="rounded-3xl bg-[#090b17] border-2 border-white/15 hover:border-red-500/60 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 p-5 sm:p-6 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-white px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30">
                          03
                        </span>
                        <div>
                          <h4 className="font-mono text-sm sm:text-base uppercase tracking-wider text-white font-black flex items-center gap-2">
                            <span>WHAT ARE YOU TRYING TO SOLVE OR BUILD?</span>
                          </h4>
                          <span className="text-xs font-sans text-neutral-300 block font-normal">
                            Outline current bottleneck, architecture ambition, or product scope
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.problem.trim().length >= 10 ? (
                          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-black bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                            <Check className="w-3.5 h-3.5" /> DEFINED
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-red-400 uppercase font-black bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg">REQUIRED *</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        id="inquiry-problem"
                        required
                        rows={5}
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        placeholder="Detail your project context: What is the current manual process or technical barrier? What is your ideal outcome or delivery target? (e.g., We have 5,000 PDF contracts processed manually per week and need an accurate autonomous extraction RAG pipeline...)"
                        className="w-full px-4.5 py-3.5 rounded-2xl bg-[#05060d] border-2 border-white/20 text-white font-sans text-sm sm:text-base font-normal focus:outline-none focus:border-red-500 focus:bg-[#070914] focus:ring-2 focus:ring-red-500/30 transition-all leading-relaxed placeholder:text-neutral-400 select-text shadow-inner"
                      />
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300 px-1 font-bold">
                        <span>Characters: {formData.problem.length} / 5,000</span>
                        <span className={formData.problem.length >= 10 ? 'text-emerald-400 font-black' : 'text-neutral-400'}>
                          {formData.problem.length >= 10 ? '✓ Minimum length satisfied' : 'Brief description required (min 10 chars)'}
                        </span>
                      </div>
                    </div>

                    {/* Timeline & Budget Parameters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                      <div className="p-4 rounded-2xl bg-[#05060d] border-2 border-white/15 space-y-2 shadow-sm">
                        <label className="block text-xs font-mono text-neutral-200 uppercase tracking-wider font-black flex items-center justify-between">
                          <span>TARGET DELIVERY SPRINT</span>
                          <span className="text-[10px] text-amber-400 font-bold">VELOCITY</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.timeline}
                            onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                            className="w-full appearance-none bg-[#0e1120] text-white font-mono text-xs sm:text-sm font-bold rounded-xl pl-3.5 pr-8 py-3 border border-white/25 focus:outline-none focus:border-red-500 cursor-pointer shadow-inner"
                          >
                            {ENGAGEMENT_VELOCITIES.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#05060d] border-2 border-white/15 space-y-2 shadow-sm">
                        <label className="block text-xs font-mono text-neutral-200 uppercase tracking-wider font-black flex items-center justify-between">
                          <span>ESTIMATED SCOPE / BUDGET</span>
                          <span className="text-[10px] text-emerald-400 font-bold">TIER</span>
                        </label>
                        <div className="relative">
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full appearance-none bg-[#0e1120] text-white font-mono text-xs sm:text-sm font-bold rounded-xl pl-3.5 pr-8 py-3 border border-white/25 focus:outline-none focus:border-red-500 cursor-pointer shadow-inner"
                          >
                            {ESTIMATED_BUDGETS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 04 — CONTACT & TRANSMISSION (Selector 6) */}
                  <div className="rounded-3xl bg-[#090b17] border-2 border-white/15 hover:border-red-500/60 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 p-5 sm:p-6 transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-white px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 shadow-[0_0_12px_rgba(239,68,68,0.5)] border border-red-400/30">
                          04
                        </span>
                        <div>
                          <h4 className="font-mono text-sm sm:text-base uppercase tracking-wider text-white font-black flex items-center gap-2">
                            <span>WHERE SHALL I SEND THE ARCHITECTURAL ASSESSMENT?</span>
                          </h4>
                          <span className="text-xs font-sans text-neutral-300 block font-normal">
                            Direct email address for response and scheduling proposal
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {EMAIL_REGEX.test(formData.email.trim()) ? (
                          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-black bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                            <Check className="w-3.5 h-3.5" /> VALID FORMAT
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-red-400 uppercase font-black bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded-lg">REQUIRED *</span>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com or personal direct email"
                        className="w-full min-h-[52px] pl-11 pr-4 py-3 rounded-2xl bg-[#05060d] border-2 border-white/20 text-white font-sans text-sm sm:text-base font-medium focus:outline-none focus:border-red-500 focus:bg-[#070914] focus:ring-2 focus:ring-red-500/30 transition-all placeholder:text-neutral-400 select-text shadow-inner"
                      />
                    </div>

                    {/* Confidentiality toggle card */}
                    <div className="pt-4">
                      <label className="flex items-start sm:items-center gap-3.5 p-4 rounded-2xl bg-[#05060d] border-2 border-white/15 hover:border-emerald-500/50 cursor-pointer transition-colors select-none shadow-sm">
                        <input
                          type="checkbox"
                          checked={formData.confidentialityRequired}
                          onChange={(e) => setFormData({ ...formData, confidentialityRequired: e.target.checked })}
                          className="w-5 h-5 rounded mt-0.5 sm:mt-0 bg-[#0e1120] border-white/30 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600 shrink-0"
                        />
                        <div className="flex-1 text-xs font-mono text-neutral-200">
                          <span className="font-black text-white flex items-center gap-2 text-xs sm:text-sm">
                            <Lock className="w-4 h-4 text-cyan-400 inline" />
                            Enforce Mutual Confidentiality (NDA Protocol)
                          </span>
                          <span className="text-neutral-300 block text-xs font-sans mt-0.5 font-normal">
                            All shared architectural details, business logic, and code are held under bilateral confidentiality.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Primary CTA Button Row (Selector 7 & Selector 8) */}
                  <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-mono text-neutral-300 flex items-center gap-2 font-bold">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Encrypted SSL Handshake &bull; 0 Spam Guarantee</span>
                    </div>

                    {/* Submit CTA Button - Selector 8 */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto relative group/cta inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white font-mono text-sm sm:text-base font-black uppercase tracking-wider transition-all duration-300 shadow-[0_12px_40px_rgba(255,42,58,0.65),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_18px_50px_rgba(255,42,58,0.85)] hover:-translate-y-0.5 active:translate-y-1 active:scale-[0.98] disabled:opacity-50 cursor-pointer overflow-hidden select-none border border-white/25"
                    >
                      {/* Laser Beacon Scanning Animation Effect */}
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_10px_#ffffff]"></span>
                      </span>

                      <Send className="w-5 h-5 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5 transition-transform" />

                      {/* Text span inside CTA Button - Selector 7 */}
                      <span className="tracking-widest font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        {submitting ? 'TRANSMITTING PROJECT BRIEF...' : 'TRANSMIT PROJECT BRIEF →'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
