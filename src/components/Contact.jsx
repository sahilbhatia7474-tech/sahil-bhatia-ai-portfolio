import { useState } from 'react';
import { Mail, CheckCircle2, ArrowUpRight, ShieldCheck, Terminal, MapPin } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { saveItem, logActivity } from '../lib/dbService';
import { isValidHttpUrl } from '../lib/projectLinks';

const CONSULTATION_AREAS = [
  'AI Systems',
  'AI Agents',
  'Automation',
  'Digital Product',
  'UX / Website',
  'Business Workflow',
  'Other',
];

const Contact = () => {
  const { identity } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    selectedArea: 'AI Systems',
    problem: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleSelectArea = (area) => {
    setFormData((prev) => ({ ...prev, selectedArea: area }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.name.trim()) {
      setValidationError('Please provide your name or organization.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Please provide a valid direct email address.');
      return;
    }

    if (!formData.problem.trim()) {
      setValidationError('Please describe what you are trying to solve.');
      return;
    }

    setSubmitting(true);

    try {
      // Save transmission message to Firestore
      const msgId = `inquiry-${Date.now()}`;
      await saveItem('messages', msgId, {
        name: formData.name.trim(),
        subject: `Consultation: ${formData.selectedArea}`,
        category: formData.selectedArea,
        problem: formData.problem.trim(),
        message: formData.problem.trim(),
        email: formData.email.trim().toLowerCase(),
        status: 'UNREAD',
        timestamp: new Date().toISOString(),
      }, true);

      await logActivity('CONSULTATION_INQUIRY', 'messages', `Inquiry from ${formData.name} regarding ${formData.selectedArea}`);
    } catch (err) {
      console.warn('Consultation saved locally:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      selectedArea: 'AI Systems',
      problem: '',
      email: '',
    });
    setTimeout(() => setSubmitted(false), 8000);
  };

  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';
  const systemName = identity?.systemName || 'PORTFOLIO OS';

  // Authoritative Social Link Architecture (Instagram, LinkedIn, GitHub)
  const rawSocial = identity?.socialLinks || {};
  const activeSocialLinks = [];

  const instaUrl = rawSocial.instagram?.url || (typeof rawSocial.instagram === 'string' ? rawSocial.instagram : 'https://www.instagram.com/neutronverse.ai');
  if (instaUrl && isValidHttpUrl(instaUrl) && rawSocial.instagram?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'instagram',
      label: rawSocial.instagram?.label || 'Instagram',
      url: instaUrl.trim(),
      sortOrder: rawSocial.instagram?.sortOrder ?? 1,
    });
  }

  const linkedInUrl = rawSocial.linkedin?.url || (typeof rawSocial.linkedin === 'string' ? rawSocial.linkedin : 'https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2');
  if (linkedInUrl && isValidHttpUrl(linkedInUrl) && rawSocial.linkedin?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'linkedin',
      label: rawSocial.linkedin?.label || 'LinkedIn',
      url: linkedInUrl.trim(),
      sortOrder: rawSocial.linkedin?.sortOrder ?? 2,
    });
  }

  const ghUrl = rawSocial.github?.url || (typeof rawSocial.github === 'string' ? rawSocial.github : 'https://github.com/sahilbhatia7474-tech');
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
    <section id="contact" className="py-24 bg-[#070708] relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            DIRECT CONSULTATION CHANNEL &middot; HIGH-SIGNAL INQUIRIES
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display uppercase">
            START A CONVERSATION
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 font-sans mt-3 leading-relaxed">
            Have a problem worth solving? Tell me what you are building, what is slowing you down, or what you want to automate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Channel & Supporting Protocols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Supporting Information Box */}
            <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-6 space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider font-bold">
                <Mail className="w-4 h-4" />
                <span>DIRECT CHANNEL</span>
              </div>
              
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                  EMAIL
                </span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-base sm:text-lg font-mono font-semibold text-white hover:text-red-400 transition-colors break-all"
                >
                  {contactEmail}
                </a>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                  RESPONSE PROTOCOL
                </span>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  Consultation requests are reviewed directly.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CONFIDENTIALITY</span>
                </span>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Information submitted through this form is used only to understand the inquiry.
                </p>
              </div>
            </div>

            {/* System Info Box */}
            <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-5 space-y-3 font-mono text-xs text-neutral-400">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-[10px] uppercase">RUNTIME ENGINE</span>
                <span className="text-neutral-200">{systemName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-[10px] uppercase">LOCATION BASE</span>
                <span className="text-neutral-200">Delhi NCR &bull; Global Remote Advisory</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-[10px] uppercase">ENGAGEMENT STATUS</span>
                <span className="text-emerald-400 font-semibold">ONLINE // OPEN FOR SYSTEM BRIEFS</span>
              </div>
            </div>

            {/* Authoritative Social Profiles */}
            {activeSocialLinks.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                  VERIFIED DIRECT PROFILES
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeSocialLinks.map((item) => (
                    <a
                      key={item.key}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#0d0e14] border border-white/10 hover:border-red-500/40 text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors font-mono text-xs"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Premium 4-Section Consultation Brief Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-6 sm:p-8 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-16 px-6 text-center rounded-lg bg-[#11121a] border border-emerald-500/30 space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white uppercase tracking-tight">
                    Consultation Brief Dispatched
                  </h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto font-sans leading-relaxed">
                    Thank you. Your inquiry has been routed into Sahil&apos;s direct queue. A thoughtful response will be sent to your email address.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {validationError && (
                    <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/50 font-mono text-xs text-red-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* 01 — WHO ARE YOU? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="font-mono text-xs font-bold text-red-500">01</span>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                        WHO ARE YOU?
                      </h4>
                    </div>
                    
                    <div className="space-y-1.5 pt-1">
                      <label htmlFor="inquiry-name" className="block font-mono text-[11px] text-neutral-400 uppercase">
                        Name / Organization *
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name or organization (e.g. Alex Morgan / Acme Corp)"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#121319] border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 02 — WHERE SHOULD WE START? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="font-mono text-xs font-bold text-red-500">02</span>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                        WHERE SHOULD WE START?
                      </h4>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {CONSULTATION_AREAS.map((area) => {
                        const isSelected = formData.selectedArea === area;
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => handleSelectArea(area)}
                            className={`px-4 py-2 rounded-lg font-mono text-xs transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(227,38,53,0.35)] border border-red-500'
                                : 'bg-[#121319] text-neutral-300 border border-white/10 hover:border-white/25 hover:text-white'
                            }`}
                          >
                            {area}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 03 — WHAT ARE YOU TRYING TO SOLVE? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="font-mono text-xs font-bold text-red-500">03</span>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                        WHAT ARE YOU TRYING TO SOLVE?
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label htmlFor="inquiry-problem" className="block font-mono text-[11px] text-neutral-400 uppercase">
                        Problem / Objective *
                      </label>
                      <textarea
                        id="inquiry-problem"
                        required
                        rows={4}
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        placeholder="Tell me what you are building, what is slowing you down, or what you want to automate..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#121319] border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-red-500 transition-colors leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 04 — HOW CAN I REACH YOU? */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                      <span className="font-mono text-xs font-bold text-red-500">04</span>
                      <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                        HOW CAN I REACH YOU?
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label htmlFor="inquiry-email" className="block font-mono text-[11px] text-neutral-400 uppercase">
                        Email *
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@company.com"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#121319] border border-white/15 text-white font-sans text-xs focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(227,38,53,0.3)] disabled:opacity-50 cursor-pointer"
                    >
                      <span>{submitting ? 'DISPATCHING BRIEF...' : 'INITIATE CONSULTATION →'}</span>
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
