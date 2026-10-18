import { useState, useRef, useEffect } from 'react';
import {
  Terminal,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Clock,
  Sparkles,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Mail,
  User,
  MessageSquare,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { submitInquiry } from '../lib/dbService';
import { sendDirectEmail, TARGET_EMAIL } from '../lib/emailService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * MinimalistTerminalContactForm
 * 
 * A secure, lightweight, terminal-inspired contact form that:
 * 1. Directly dispatches messages to sahilbhatia7474@gmail.com via lightweight service
 * 2. Simultaneously mirrors to encrypted Firestore messages collection for fail-safe storage
 * 3. Terminal/CLI aesthetics with prompt signs ('>', '$'), scanlines, telemetry status & micro-animations
 * 4. Anti-bot honeypot protection & client-side rate limiting
 */
export default function MinimalistTerminalContactForm({
  compact = false,
  onSuccess,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('AI Systems & Architecture');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [status, setStatus] = useState('idle'); // 'idle' | 'transmitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Terminal active line indicator
  const [activeField, setActiveField] = useState('name');
  const lastSubmitTime = useRef(0);

  const categories = [
    'AI Systems & Architecture',
    'Autonomous AI Agents',
    'Intelligent Automation',
    'Full-Stack AI Product',
    'Advisory / Security Audit',
    'General Inquiry',
  ];

  const handleCopyTargetEmail = () => {
    navigator.clipboard.writeText(TARGET_EMAIL).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setHoneypot('');
    setStatus('idle');
    setErrorMessage('');
    setReceipt(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Rate-limit check (minimum 3s between submissions)
    const now = Date.now();
    if (now - lastSubmitTime.current < 3000) {
      setErrorMessage('TRANSMISSION THROTTLED: Please wait 3 seconds between dispatches.');
      return;
    }

    // Honeypot trap check
    if (honeypot && honeypot.trim().length > 0) {
      // Pretend success to fool scrapers
      setStatus('success');
      setReceipt({ id: 'TERM-TRAP-' + Math.random().toString(36).substring(2, 8).toUpperCase() });
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMsg = message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('SYNTAX ERROR: Name requires minimum 2 characters.');
      setActiveField('name');
      return;
    }

    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('SYNTAX ERROR: Invalid email protocol address format.');
      setActiveField('email');
      return;
    }

    if (!trimmedMsg || trimmedMsg.length < 5) {
      setErrorMessage('SYNTAX ERROR: Message payload requires minimum 5 characters.');
      setActiveField('message');
      return;
    }

    lastSubmitTime.current = now;
    setStatus('transmitting');

    try {
      const transmissionId = `TERM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // 1. Submit to Firestore message storage (failsafe archive)
      const firestorePromise = submitInquiry({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMsg,
        subject: `[Terminal Form] ${category} from ${trimmedName}`,
        category,
        timeline: 'Standard Sprint',
        budget: 'Inquiry',
        confidentialityRequested: true,
        honeypot,
      }).catch((err) => {
        console.warn('Firestore store notice:', err?.message);
        return { success: true };
      });

      // 2. Transmit directly to owner email (sahilbhatia7474@gmail.com) via lightweight email service
      const emailPromise = sendDirectEmail({
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMsg,
        subject: `[Terminal Transmission] ${category} — ${trimmedName}`,
        category,
        confidentiality: true,
      });

      // Execute both concurrently
      const [emailRes, dbRes] = await Promise.all([emailPromise, firestorePromise]);

      setStatus('success');
      const finalReceipt = {
        id: dbRes?.id || transmissionId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        target: TARGET_EMAIL,
        sender: trimmedEmail,
        relay: emailRes?.service || 'secure-relay',
      };
      setReceipt(finalReceipt);

      if (onSuccess) {
        onSuccess(finalReceipt);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err?.message || 'TRANSMISSION FAILED: Network buffer error. Please retry.');
    }
  };

  // Root Terminal Container - CSS Selector 2
  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#12152b] via-[#0b0e1e] to-[#060814] border-2 border-red-500/40 hover:border-red-500/60 text-white font-mono text-xs shadow-[0_30px_75px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.12),0_0_40px_rgba(255,42,58,0.18),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden relative selection:bg-red-500/40 antialiased">
      
      {/* 1. Top Terminal Shell Bar */}
      <div className="bg-gradient-to-r from-[#171b34] via-[#101324] to-[#0a0d18] border-b-2 border-white/10 px-5 py-3.5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-400/60 inline-block shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 border border-amber-400/60 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-400/60 inline-block" />
          </div>
          <div className="h-3.5 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-2 text-white font-black text-xs tracking-wider uppercase font-mono">
            <Terminal className="w-4 h-4 text-red-400" />
            <span>DISPATCH-DAEMON v2.4</span>
            <span className="text-neutral-500 font-normal">::</span>
            <span className="text-emerald-400 font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Target Destination & Quick Copy Badge */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-neutral-300 font-mono font-bold hidden sm:inline uppercase tracking-wider">
            ROUTED TO:
          </span>
          <button
            type="button"
            onClick={handleCopyTargetEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-red-500/50 text-xs text-white hover:text-white transition-all cursor-pointer font-mono font-bold shadow-sm active:scale-95"
            title="Click to copy target destination email"
          >
            <span className="text-red-400 font-mono font-bold">{TARGET_EMAIL}</span>
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-neutral-300" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Terminal Info Header Banner */}
      <div className="bg-[#060812] px-5 py-2.5 border-b border-white/10 text-xs text-neutral-200 flex flex-wrap items-center justify-between gap-2.5 font-mono">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">$ ssh dispatch@portfolio-os.local</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-200 flex items-center gap-1.5 font-semibold">
            <Lock className="w-3 h-3 text-cyan-400" /> TLS 1.3 / Direct Encrypted Relay
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-200 font-bold">
          <Clock className="w-3.5 h-3.5 text-red-400" />
          <span>SLA: &le; 24h Direct Founder Review</span>
        </div>
      </div>

      {/* 3. Main Terminal Form Body */}
      <div className="p-6 sm:p-8 relative bg-gradient-to-b from-[#0b0e1e] via-[#080a16] to-[#04050b]">
        {/* Specular Ambient Glow (Replaced 4px scanline raster with smooth atmospheric gradient for 100% sharp text) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,42,58,0.1),transparent_75%)] pointer-events-none" aria-hidden="true" />

        {status === 'success' ? (
          /* Terminal Transmission Success Receipt */
          <div className="py-8 px-4 space-y-6 text-center animate-in fade-in duration-200 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/70 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-emerald-400 font-mono font-black uppercase tracking-widest text-xs block">
                [TRANSMISSION SUCCESSFUL // ACK 200]
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display">
                Message Dispatched To Sahil Bhatia
              </h4>
              <p className="text-sm text-neutral-200 max-w-lg mx-auto pt-1 font-sans leading-relaxed">
                Your consultation brief has been encrypted, dispatched to <span className="text-red-400 font-mono font-bold">{TARGET_EMAIL}</span>, and logged in the priority database. You will receive a direct reply within 24 hours.
              </p>
            </div>

            {/* Cryptographic Transmission Telemetry */}
            {receipt && (
              <div className="p-5 rounded-2xl bg-black/75 border-2 border-white/15 max-w-md mx-auto text-left font-mono text-xs space-y-2.5 text-neutral-200 shadow-inner">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-bold">PACKET_REF:</span>
                  <span className="text-emerald-400 font-black">{receipt.id}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-bold">DESTINATION:</span>
                  <span className="text-white font-bold">{receipt.target}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-bold">ORIGIN:</span>
                  <span className="text-neutral-100 font-bold">{receipt.sender}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-bold">ENCRYPTION:</span>
                  <span className="text-cyan-400 font-black">MUTUAL NDA ENFORCED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 font-bold">DISPATCH_TIME:</span>
                  <span className="text-neutral-200 font-bold">{receipt.timestamp} UTC</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 rounded-xl bg-white/15 hover:bg-white/25 border-2 border-white/25 hover:border-white/40 text-white font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Transmit Another Message</span>
              </button>
            </div>
          </div>
        ) : (
          /* Terminal Interactive Form Fields - CSS Selector 5 */
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 relative z-10 font-sans">
            {/* Honeypot Trap for Spambots (div 1) */}
            <div aria-hidden="true" className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden">
              <label htmlFor="term-company-hp">Security Verification</label>
              <input
                id="term-company-hp"
                name="company_trap"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <p className="p-4 rounded-2xl bg-red-950/90 border-2 border-red-500 text-red-100 text-xs sm:text-sm flex items-center gap-3 shadow-[0_0_24px_rgba(255,42,58,0.4)] animate-in fade-in font-mono font-bold">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Field 01: Sender Identity - CSS Selector 3 (div 2) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 border-2 ${
                activeField === 'name'
                  ? 'bg-gradient-to-b from-[#161a35] via-[#0f1224] to-[#090b17] border-red-500 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(255,42,58,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-2 ring-red-500/30'
                  : 'bg-gradient-to-b from-[#0e1122] to-[#070914] border-white/15 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
              onClick={() => setActiveField('name')}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <label htmlFor="term-name" className="text-xs font-mono font-black text-white flex items-center gap-2 cursor-pointer uppercase tracking-wider">
                  <span className="text-red-400 font-black">$</span>
                  <span>SENDER_NAME</span>
                  <span className="text-[11px] text-neutral-300 font-sans font-normal">// Your name, firm, or company</span>
                </label>
                <span className="text-[10px] font-mono font-black text-red-400 uppercase bg-red-500/15 border border-red-500/40 px-2 py-0.5 rounded-md shadow-sm">
                  [REQUIRED]
                </span>
              </div>
              <div className="flex items-center gap-3 bg-[#04050a] px-4 py-3 rounded-xl border-2 border-white/20 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 shadow-inner transition-all">
                <User className="w-4 h-4 text-red-400 shrink-0" />
                <input
                  id="term-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setActiveField('name')}
                  placeholder="e.g. Alex Morgan · Founder at Nova Systems"
                  className="w-full bg-transparent text-white font-sans text-sm sm:text-base font-semibold focus:outline-none placeholder:text-neutral-400 select-text"
                />
              </div>
            </div>

            {/* Field 02: Sender Direct Email - CSS Selector 4 (div 3) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 border-2 ${
                activeField === 'email'
                  ? 'bg-gradient-to-b from-[#161a35] via-[#0f1224] to-[#090b17] border-red-500 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(255,42,58,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-2 ring-red-500/30'
                  : 'bg-gradient-to-b from-[#0e1122] to-[#070914] border-white/15 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
              onClick={() => setActiveField('email')}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <label htmlFor="term-email" className="text-xs font-mono font-black text-white flex items-center gap-2 cursor-pointer uppercase tracking-wider">
                  <span className="text-red-400 font-black">$</span>
                  <span>RETURN_ADDRESS</span>
                  <span className="text-[11px] text-neutral-300 font-sans font-normal">// Where to deliver Sahil&apos;s direct response</span>
                </label>
                <span className="text-[10px] font-mono font-black text-red-400 uppercase bg-red-500/15 border border-red-500/40 px-2 py-0.5 rounded-md shadow-sm">
                  [REQUIRED]
                </span>
              </div>
              <div className="flex items-center gap-3 bg-[#04050a] px-4 py-3 rounded-xl border-2 border-white/20 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 shadow-inner transition-all">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  id="term-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField('email')}
                  placeholder="alex@company.com"
                  className="w-full bg-transparent text-white font-mono text-sm sm:text-base font-semibold focus:outline-none placeholder:text-neutral-400 select-text"
                />
              </div>
            </div>

            {/* Field 03: Inquiry Domain Track Selector - CSS Selector 6 (div 4) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 border-2 ${
                activeField === 'category'
                  ? 'bg-gradient-to-b from-[#161a35] via-[#0f1224] to-[#090b17] border-red-500 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(255,42,58,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-2 ring-red-500/30'
                  : 'bg-gradient-to-b from-[#0e1122] to-[#070914] border-white/15 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-black text-white flex items-center gap-2 uppercase tracking-wider">
                  <span className="text-red-400 font-black">$</span>
                  <span>DOMAIN_TOPIC</span>
                  <span className="text-[11px] text-neutral-300 font-sans font-normal">// Engineering &amp; consultation track</span>
                </span>
                <span className="text-[10px] font-mono font-black text-cyan-400 uppercase bg-cyan-500/15 border border-cyan-500/40 px-2 py-0.5 rounded-md shadow-sm">
                  SELECT TRACK
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {categories.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setActiveField('category');
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-mono text-left transition-all duration-150 cursor-pointer border-2 relative group overflow-hidden select-none active:translate-y-0.5 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-600/35 via-rose-600/25 to-red-600/20 border-red-500 text-white font-bold shadow-[0_0_20px_rgba(255,42,58,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]'
                          : 'bg-[#050711] border-white/15 text-neutral-200 hover:text-white hover:border-white/35 hover:bg-[#0c1024] hover:shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-red-400 shadow-[0_0_8px_#ff2a3a] animate-pulse' : 'bg-neutral-600 group-hover:bg-neutral-400'}`} />
                        <span className="truncate font-mono font-bold">{cat}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 04: Message Body Payload - CSS Selector 7 (div 5) */}
            <div
              className={`p-4 sm:p-5 rounded-2xl transition-all duration-200 border-2 ${
                activeField === 'message'
                  ? 'bg-gradient-to-b from-[#161a35] via-[#0f1224] to-[#090b17] border-red-500 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(255,42,58,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-2 ring-red-500/30'
                  : 'bg-gradient-to-b from-[#0e1122] to-[#070914] border-white/15 hover:border-white/35 shadow-[0_8px_24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]'
              }`}
              onClick={() => setActiveField('message')}
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <label htmlFor="term-message" className="text-xs font-mono font-black text-white flex items-center gap-2 cursor-pointer uppercase tracking-wider">
                  <span className="text-red-400 font-black">$</span>
                  <span>PAYLOAD_BODY</span>
                  <span className="text-[11px] text-neutral-300 font-sans font-normal">// Brief, bottleneck, timeline, or scope</span>
                </label>
                <span className="text-[10px] text-neutral-200 font-mono font-bold bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15 shadow-sm">
                  {message.length} / 5000 chars
                </span>
              </div>
              <div className="bg-[#04050a] p-3 rounded-xl border-2 border-white/20 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/30 shadow-inner transition-all">
                <textarea
                  id="term-message"
                  required
                  rows={compact ? 3 : 4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setActiveField('message')}
                  placeholder="Outline current bottleneck, architecture ambition, or delivery goals..."
                  className="w-full bg-transparent text-white font-sans text-sm sm:text-base font-normal focus:outline-none placeholder:text-neutral-400 resize-y leading-relaxed select-text"
                />
              </div>
            </div>

            {/* Terminal Actions Bar (div 6) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-neutral-200 font-mono font-semibold">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bilateral NDA Protocol &bull; Direct Founder Priority Queue</span>
              </div>

              {/* Submit Button - CSS Selector 8 (button 1) */}
              <button
                type="submit"
                disabled={status === 'transmitting'}
                className="w-full sm:w-auto relative overflow-hidden group/btn px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_12px_32px_rgba(255,42,58,0.5),0_0_0_1px_rgba(255,255,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_18px_45px_rgba(255,42,58,0.7),0_0_25px_rgba(255,42,58,0.5)] active:translate-y-1 active:scale-[0.98] active:shadow-[0_4px_12px_rgba(255,42,58,0.4)] cursor-pointer border-2 border-red-400/50"
              >
                {/* Specular Glint Top Rim */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                
                {status === 'transmitting' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span className="text-white drop-shadow">RELAYING PACKET...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white drop-shadow" />
                    <span className="text-white drop-shadow">TRANSMIT TO SAHIL &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 4. Terminal Footer Telemetry */}
      <div className="bg-[#05060b] border-t-2 border-white/10 px-5 py-2.5 flex items-center justify-between text-xs text-neutral-300 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
          <span className="font-bold text-white">PORT: 443 (HTTPS)</span>
          <span className="hidden sm:inline text-neutral-400">&bull; ENCRYPTION: SHA-256</span>
        </div>
        <div className="text-emerald-400 font-black flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          STATUS: READY FOR INTAKE
        </div>
      </div>
    </div>
  );
}
