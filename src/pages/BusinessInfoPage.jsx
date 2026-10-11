import LegalPageLayout from '../components/LegalPageLayout';
import PageSEO from '../components/PageSEO';
import { Mail, Phone, MapPin, ShieldCheck, Briefcase, UserCheck } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function BusinessInfoPage() {
  const { identity } = usePortfolioData();
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <LegalPageLayout
      title="Business Information"
      subtitle="Official merchant profile, commercial entity disclosure, and operational contact framework for digital services provided by Sahil Bhatia."
      category="MERCHANT & ENTITY DISCLOSURE"
      effectiveDate="March 2026"
    >
      <PageSEO
        title="Business Information — Sahil Bhatia | AI Consultant & Builder"
        description="Official business information, legal entity details, and digital services capabilities for Sahil Bhatia."
        canonicalUrl="https://sahil-bhatia-ai-portfolio.vercel.app/business-info"
      />

      <div className="space-y-10 text-neutral-300 font-sans leading-relaxed text-sm">
        {/* Compliance / Verification Status Notice */}
        <div className="rounded-xl bg-[#0c0d13] border border-red-500/25 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-red-400 uppercase tracking-widest font-semibold">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>PAYMENT GATEWAY &amp; MERCHANT VERIFICATION STATUS</span>
          </div>
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            This page provides transparent business disclosures required for payment gateway onboarding (including PayU and domestic/international payment processing), client contracting, and commercial verification.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-neutral-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OPERATIONAL STATUS: ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
              ENTITY: INDEPENDENT DIGITAL SERVICES PROVIDER
            </span>
          </div>
        </div>

        {/* 1. Legal Entity & Principal Information */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-red-400" />
              <span>1. Legal Entity &amp; Principal Details</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-neutral-500 uppercase block">
                LEGAL NAME OF PROPRIETOR / PRACTITIONER
              </span>
              <span className="text-base font-bold text-white font-display uppercase tracking-wide">
                SAHIL BHATIA
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-neutral-500 uppercase block">
                PROFESSIONAL ROLE &amp; POSITIONING
              </span>
              <span className="text-sm font-semibold text-neutral-200 font-sans">
                AI Generalist | AI Consultant | AI-Native Builder
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-neutral-500 uppercase block">
                BUSINESS STRUCTURE
              </span>
              <span className="text-sm text-neutral-300">
                Individual Practitioner / Sole Proprietorship (Digital Services)
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1">
              <span className="text-[11px] font-mono text-neutral-500 uppercase block">
                SYSTEM OPERATING PORTAL
              </span>
              <span className="text-sm font-mono text-red-400">
                sahil-bhatia-ai-portfolio.vercel.app
              </span>
            </div>
          </div>
        </section>

        {/* 2. Official Business Description & Scope */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-400" />
              <span>2. Core Business Activity &amp; Description</span>
            </h2>
          </div>

          <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-4">
            <blockquote className="border-l-2 border-red-500 pl-4 py-1 italic text-white text-base font-sans">
              &ldquo;Sahil Bhatia provides digital services including portfolio website development, business websites, landing pages, AI-powered digital solutions and workflow automation.&rdquo;
            </blockquote>

            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              All commercial engagements are executed directly with clients through clear written project proposals, scope specifications, and milestone-based deliverables. We do not provide consumer retail goods, physical inventory, regulated financial advisory, medical advice, legal counsel, or multi-level marketing programs.
            </p>
          </div>
        </section>

        {/* 3. Verified Contact & Operational Address Framework */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              <span>3. Verified Contact &amp; Operating Address</span>
            </h2>
          </div>

          <div className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-5">
            {/* Address Placeholder with Privacy Guard */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                  BUSINESS OPERATING ADDRESS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  EDITABLE FIELD // PRIVACY PROTECTED
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-black/60 border border-dashed border-white/20 font-mono text-xs text-neutral-300">
                [INSERT VERIFIED PAYU BUSINESS / OPERATING ADDRESS]
              </div>
              <p className="text-[11px] text-neutral-500 italic">
                Note: In strict compliance with privacy standards, personal residential addresses are not published automatically. The verified commercial operating address submitted to payment aggregators (PayU) is populated above.
              </p>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">
                  OFFICIAL BUSINESS EMAIL
                </span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-mono text-sm text-white hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{contactEmail}</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">
                  BUSINESS TELEPHONE / CONTACT
                </span>
                <div className="font-mono text-xs text-neutral-300 flex items-center gap-1.5 p-2 rounded bg-black/40 border border-dashed border-white/15">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>[INSERT VERIFIED BUSINESS CONTACT NUMBER / NOT SPECIFIED]</span>
                </div>
              </div>
            </div>

            {/* Verified Public Channels */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">
                VERIFIED PROFESSIONAL PROFILES
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <a
                  href="https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  LinkedIn: sahil-bhatia
                </a>
                <a
                  href="https://github.com/sahilbhatia7474-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  GitHub: sahilbhatia7474-tech
                </a>
                <a
                  href="https://www.instagram.com/neutronverse.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-colors"
                >
                  Instagram: @neutronverse.ai
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Zero Fabrication Standard */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>4. Zero-Fabrication Operating Integrity</span>
            </h2>
          </div>

          <div className="p-4 rounded-lg bg-[#0b0c10] border border-white/10 space-y-2 text-xs text-neutral-400 font-sans">
            <p className="leading-relaxed">
              In accordance with our strict operational ethics, this portfolio and commercial entity does not publish fabricated company registration numbers, false corporate registrations, invented GSTIN/CIN figures, or misleading credentials. Sahil Bhatia operates as an independent digital consultant and builder delivering verified custom engineering.
            </p>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
