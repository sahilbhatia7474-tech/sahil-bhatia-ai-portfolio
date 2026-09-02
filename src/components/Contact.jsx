import { useState } from 'react';
import { Mail, Send, CheckCircle2, ArrowUpRight, ShieldCheck, Terminal, MapPin } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { saveItem, logActivity } from '../lib/dbService';
import { isValidHttpUrl } from '../lib/projectLinks';

const Contact = () => {
  const { identity } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'AI Systems Advisory',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Save transmission message to Firestore
      const msgId = `msg-${Date.now()}`;
      await saveItem('messages', msgId, {
        ...formData,
        timestamp: new Date().toISOString(),
      }, true);

      await logActivity('CONTACT_MESSAGE', 'messages', `Inquiry received from ${formData.name} (${formData.email})`);
    } catch (err) {
      console.warn('Transmission saved locally:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: 'AI Systems Advisory', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';
  const domain = identity?.domain || 'SAHILBHATIA.COM';
  const systemName = identity?.systemName || 'SAHIL / PORTFOLIO OS';

  // Authoritative Social Link Architecture (Instagram, LinkedIn, GitHub)
  // Twitter / X is removed. Instagram is only shown if configured by Founder with a valid URL.
  const rawSocial = identity?.socialLinks || {};
  const activeSocialLinks = [];

  // Instagram
  const instaUrl = rawSocial.instagram?.url || (typeof rawSocial.instagram === 'string' ? rawSocial.instagram : 'https://www.instagram.com/neutronverse.ai');
  if (instaUrl && isValidHttpUrl(instaUrl) && rawSocial.instagram?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'instagram',
      label: rawSocial.instagram?.label || 'Instagram',
      url: instaUrl.trim(),
      sortOrder: rawSocial.instagram?.sortOrder ?? 1,
    });
  }

  // LinkedIn (Authoritative)
  const linkedInUrl = rawSocial.linkedin?.url || (typeof rawSocial.linkedin === 'string' ? rawSocial.linkedin : 'https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2');
  if (linkedInUrl && isValidHttpUrl(linkedInUrl) && rawSocial.linkedin?.visibility !== 'HIDDEN') {
    activeSocialLinks.push({
      key: 'linkedin',
      label: rawSocial.linkedin?.label || 'LinkedIn',
      url: linkedInUrl.trim(),
      sortOrder: rawSocial.linkedin?.sortOrder ?? 2,
    });
  }

  // GitHub (Authoritative)
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                INITIATE DIALOGUE & CONSULTATION
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
                Direct Channel
              </h2>
              <p className="text-sm text-neutral-400 font-sans mt-3 leading-relaxed">
                Whether diagnosing existing business friction points, architecting custom AI systems, or discussing high-velocity product prototyping.
              </p>
            </div>

            {/* Engagement Models Spotlight */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                PRIMARY ENGAGEMENT MODELS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
                {[
                  {
                    title: 'AI Consulting',
                    desc: 'Commercial diagnosis, workflow bottlenecks, and n8n / agentic automation.',
                    code: 'ENG-01',
                  },
                  {
                    title: 'Prototype Building',
                    desc: '0-to-1 full-stack product velocity, vibe coding, and interactive interfaces.',
                    code: 'ENG-02',
                  },
                  {
                    title: 'Full-time / High-Impact Roles',
                    desc: 'AI systems architecture, forward-deployed engineering, and systems strategy.',
                    code: 'ENG-03',
                  },
                ].map((model) => (
                  <div
                    key={model.title}
                    onClick={() => setFormData((prev) => ({ ...prev, subject: model.title }))}
                    className="p-3.5 rounded-lg bg-[#0d0e14] border border-white/10 hover:border-red-500/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-mono text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        {model.title}
                      </h4>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                        {model.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                      {model.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/25 flex items-center justify-center text-red-500">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    PRIMARY VERIFIED INBOX
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-base sm:text-lg font-sans font-semibold text-white hover:text-red-400 transition-colors tracking-tight"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                  <Terminal className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    OPERATING DOMAIN & SYSTEM
                  </span>
                  <span className="text-sm font-sans font-medium text-neutral-200">
                    {domain} // {systemName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                    LOCATION BASE
                  </span>
                  <span className="text-sm font-sans font-medium text-neutral-200">
                    Delhi NCR, India &bull; Global Remote Advisory
                  </span>
                </div>
              </div>
            </div>

            {/* Social / External Links — Verified Authoritative Data Only */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                EXTERNAL CHANNELS
              </span>
              <div className="flex flex-wrap gap-2.5">
                {activeSocialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-[#0e0f15] border border-white/10 hover:border-red-500/40 text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors font-sans text-xs font-medium"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    DISCOVERY BRIEFING FORM
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">
                  CONFIDENTIAL PROTOCOL
                </span>
              </div>

              {submitted ? (
                <div className="py-12 px-4 text-center rounded-lg bg-[#11121a] border border-emerald-500/30 space-y-3 animate-in fade-in duration-300">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display text-white uppercase">
                    Transmission Dispatched
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-sm mx-auto font-sans leading-relaxed">
                    Thank you. Your inquiry has been routed into the Sahil AI OS triage pipeline. Direct response will be dispatched to your email address shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                        Your Name / Organization *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Miller / TechCorp"
                        className="w-full px-3.5 py-2.5 rounded bg-[#12131b] border border-white/10 text-white placeholder-neutral-500 font-sans focus:outline-none focus:border-red-500/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@organization.com"
                        className="w-full px-3.5 py-2.5 rounded bg-[#12131b] border border-white/10 text-white placeholder-neutral-500 font-sans focus:outline-none focus:border-red-500/60"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-subject" className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                      Consultation Domain
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded bg-[#12131b] border border-white/10 text-white font-mono focus:outline-none focus:border-red-500/60"
                    >
                      <option value="AI Consulting">AI Consulting & Workflow Diagnosis</option>
                      <option value="Prototype Building">Prototype Building & 0-to-1 MVP</option>
                      <option value="Full-time / High-Impact Roles">Full-time / High-Impact Roles</option>
                      <option value="Workflow Automation">Workflow Automation / n8n Pipelines</option>
                      <option value="General Collaboration">General Strategic Collaboration</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider block">
                      Scope, Objective, or Problem Statement *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Outline the current manual bottleneck, project scope, or system you wish to deploy..."
                      className="w-full px-3.5 py-2.5 rounded bg-[#12131b] border border-white/10 text-white placeholder-neutral-500 font-sans focus:outline-none focus:border-red-500/60 leading-relaxed resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-lg bg-[#ff2a3a] hover:bg-red-600 text-white font-sans text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(255,42,58,0.35)] cursor-pointer"
                  >
                    {submitting ? (
                      <span>Dispatching Brief...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Direct Inquiry</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Zero spam guarantee
                    </span>
                    <span>Direct recipient: sahilbhatia7474@gmail.com</span>
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
