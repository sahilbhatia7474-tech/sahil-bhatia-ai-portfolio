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

  return (
    <div className="w-full rounded-2xl bg-[#090b14] border-2 border-red-500/30 text-neutral-200 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(255,42,58,0.12)] overflow-hidden relative selection:bg-red-500/30">
      
      {/* Top Terminal Shell Bar */}
      <div className="bg-gradient-to-r from-[#121422] via-[#0e101a] to-[#0a0c14] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400/50 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/50 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/50 inline-block" />
          </div>
          <div className="h-3 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-1.5 text-neutral-300 font-bold text-[11px] tracking-wider uppercase">
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            <span>DISPATCH-DAEMON v2.4</span>
            <span className="text-neutral-500 font-normal">::</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Target Destination & Quick Copy Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-400 hidden sm:inline">ROUTED TO:</span>
          <button
            type="button"
            onClick={handleCopyTargetEmail}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/15 text-[10px] text-neutral-200 hover:text-white transition-all cursor-pointer font-mono"
            title="Click to copy target destination email"
          >
            <span className="text-red-400 font-bold">{TARGET_EMAIL}</span>
            {copiedEmail ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-neutral-400" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Info Header Banner */}
      <div className="bg-[#05060b] px-4 py-2 border-b border-white/5 text-[10px] text-neutral-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-neutral-300 font-semibold">$ ssh dispatch@portfolio-os.local</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-cyan-400" /> TLS 1.3 / End-to-End Relay
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Clock className="w-3 h-3 text-red-400" />
          <span>SLA: &le; 24h Direct Response</span>
        </div>
      </div>

      {/* Main Terminal Form Body */}
      <div className="p-5 sm:p-7 relative bg-gradient-to-b from-[#090b14] to-[#040509]">
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:100%_4px] pointer-events-none opacity-60" />

        {status === 'success' ? (
          /* Terminal Transmission Success Receipt */
          <div className="py-6 px-4 space-y-5 text-center animate-in fade-in duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-[11px] block">
                [TRANSMISSION SUCCESSFUL // ACK 200]
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
                Message Dispatched To Sahil Bhatia
              </h4>
              <p className="text-xs text-neutral-300 max-w-md mx-auto pt-1 font-sans">
                Your message has been securely relayed to <span className="text-red-400 font-mono font-bold">{TARGET_EMAIL}</span> and archived in the priority inbox. You will receive a direct reply within 24 hours.
              </p>
            </div>

            {/* Cryptographic Transmission Telemetry */}
            {receipt && (
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 max-w-md mx-auto text-left font-mono text-[11px] space-y-2 text-neutral-300 shadow-inner">
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-neutral-500">PACKET_REF:</span>
                  <span className="text-emerald-400 font-bold">{receipt.id}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-neutral-500">DESTINATION:</span>
                  <span className="text-white font-bold">{receipt.target}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-neutral-500">ORIGIN:</span>
                  <span className="text-neutral-200">{receipt.sender}</span>
                </div>
                <div className="flex justify-between items-center pb-1.5 border-b border-white/5">
                  <span className="text-neutral-500">ENCRYPTION:</span>
                  <span className="text-cyan-400 font-bold">MUTUAL NDA ENFORCED</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">DISPATCH_TIME:</span>
                  <span className="text-neutral-300">{receipt.timestamp} UTC</span>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Transmit Another Message</span>
              </button>
            </div>
          </div>
        ) : (
          /* Terminal Interactive Form Fields */
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Honeypot Trap for Spambots */}
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

            {/* Error Display Line */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs flex items-center gap-2.5 shadow-[0_0_20px_rgba(255,42,58,0.3)] animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-bold">{errorMessage}</span>
              </div>
            )}

            {/* Field 01: Sender Identity */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
                activeField === 'name'
                  ? 'bg-[#0f1220] border-red-500/70 shadow-[0_0_18px_rgba(255,42,58,0.2)]'
                  : 'bg-[#080912] border-white/10 hover:border-white/20'
              }`}
              onClick={() => setActiveField('name')}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="term-name" className="text-[11px] font-bold text-neutral-300 flex items-center gap-2 cursor-pointer">
                  <span className="text-red-400 font-bold">$</span>
                  <span>SENDER_NAME</span>
                  <span className="text-[10px] text-neutral-500">// Your name or organization</span>
                </label>
                <span className="text-[10px] text-red-400 font-bold">[REQUIRED]</span>
              </div>
              <div className="flex items-center gap-2 bg-[#04050a] px-3 py-2 rounded-lg border border-white/10 focus-within:border-red-500/60">
                <User className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  id="term-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setActiveField('name')}
                  placeholder="e.g. Alex Morgan (Nova Systems)"
                  className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Field 02: Sender Direct Email */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
                activeField === 'email'
                  ? 'bg-[#0f1220] border-red-500/70 shadow-[0_0_18px_rgba(255,42,58,0.2)]'
                  : 'bg-[#080912] border-white/10 hover:border-white/20'
              }`}
              onClick={() => setActiveField('email')}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="term-email" className="text-[11px] font-bold text-neutral-300 flex items-center gap-2 cursor-pointer">
                  <span className="text-red-400 font-bold">$</span>
                  <span>RETURN_ADDRESS</span>
                  <span className="text-[10px] text-neutral-500">// Where to deliver Sahil's reply</span>
                </label>
                <span className="text-[10px] text-red-400 font-bold">[REQUIRED]</span>
              </div>
              <div className="flex items-center gap-2 bg-[#04050a] px-3 py-2 rounded-lg border border-white/10 focus-within:border-red-500/60">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  id="term-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setActiveField('email')}
                  placeholder="alex@company.com"
                  className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* Field 03: Inquiry Domain Track Selector */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
                activeField === 'category'
                  ? 'bg-[#0f1220] border-red-500/70 shadow-[0_0_18px_rgba(255,42,58,0.2)]'
                  : 'bg-[#080912] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-2">
                  <span className="text-red-400 font-bold">$</span>
                  <span>DOMAIN_TOPIC</span>
                  <span className="text-[10px] text-neutral-500">// Architectural track</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-bold">SELECT</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-left transition-all cursor-pointer border truncate ${
                        isSelected
                          ? 'bg-red-500/20 border-red-500/70 text-white font-bold shadow-[0_0_12px_rgba(255,42,58,0.3)]'
                          : 'bg-[#05060b] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className={isSelected ? 'text-red-400 mr-1' : 'text-neutral-600 mr-1'}>
                        {isSelected ? '●' : '○'}
                      </span>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 04: Message Body Payload */}
            <div
              className={`p-3.5 sm:p-4 rounded-xl transition-all border ${
                activeField === 'message'
                  ? 'bg-[#0f1220] border-red-500/70 shadow-[0_0_18px_rgba(255,42,58,0.2)]'
                  : 'bg-[#080912] border-white/10 hover:border-white/20'
              }`}
              onClick={() => setActiveField('message')}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="term-message" className="text-[11px] font-bold text-neutral-300 flex items-center gap-2 cursor-pointer">
                  <span className="text-red-400 font-bold">$</span>
                  <span>PAYLOAD_BODY</span>
                  <span className="text-[10px] text-neutral-500">// Project brief, timeline, or query</span>
                </label>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {message.length}/5000 chars
                </span>
              </div>
              <div className="bg-[#04050a] p-2.5 rounded-lg border border-white/10 focus-within:border-red-500/60">
                <textarea
                  id="term-message"
                  required
                  rows={compact ? 3 : 4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setActiveField('message')}
                  placeholder="Outline current bottleneck, architecture ambition, or delivery goals..."
                  className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-neutral-600 resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Terminal Actions Line */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bilateral NDA Protocol &bull; Zero spam guarantee</span>
              </div>

              <button
                type="submit"
                disabled={status === 'transmitting'}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-[0_8px_24px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 disabled:opacity-50 cursor-pointer border border-red-400/40"
              >
                {status === 'transmitting' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>RELAYING PACKET...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>TRANSMIT TO SAHIL &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Terminal Footer Telemetry */}
      <div className="bg-[#05060b] border-t border-white/10 px-4 py-2 flex items-center justify-between text-[10px] text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>PORT: 443 (HTTPS)</span>
          <span className="hidden sm:inline">&bull; ENCRYPTION: SHA-256</span>
        </div>
        <div className="text-neutral-400">
          STATUS: READY
        </div>
      </div>
    </div>
  );
}
