import LegalPageLayout from '../components/LegalPageLayout';
import PageSEO from '../components/PageSEO';
import { ArrowUpRight, CheckCircle2, Terminal } from 'lucide-react';

const SERVICES = [
  {
    id: 'portfolio-dev',
    number: '01',
    title: 'Portfolio Website Development',
    kicker: 'PERSONAL OS & INTERACTIVE SHOWCASES',
    description:
      'Architecting bespoke, high-performance portfolio applications and interactive personal operating systems tailored for founders, software engineers, and technical creators. Focused on spatial clarity, dark UI aesthetics, responsive micro-interactions, and instant loading.',
    deliverables: [
      'Custom React / Vite / Next.js single-page application',
      'Spatial UX, custom HUD layouts & interactive components',
      'Mobile-first responsive architecture & performance optimization',
      'CMS integration, structured content registries & project modals',
      'Production deployment on modern edge platforms (Vercel, Cloud Run)',
    ],
    techStack: 'React · Tailwind CSS · TypeScript/JavaScript · Vite · Headless CMS',
  },
  {
    id: 'business-websites',
    number: '02',
    title: 'Business Website Development',
    kicker: 'MODERN COMMERCIAL WEB PLATFORMS',
    description:
      'Designing and developing modern, production-grade corporate and commercial websites built for performance, clear information architecture, and high search engine discoverability. Engineered to represent your brand with technical credibility.',
    deliverables: [
      'Multi-page responsive commercial website architecture',
      'Search Engine Optimization (SEO) & OpenGraph social share cards',
      'Secure contact intake forms & lead routing pipelines',
      'WCAG AA accessible interface design & zero-layout shift',
      'Fast CDN distribution & security header hardening',
    ],
    techStack: 'Modern Frontend Frameworks · Responsive Tailwind CSS · Web Analytics',
  },
  {
    id: 'landing-pages',
    number: '03',
    title: 'Landing Page Development',
    kicker: 'HIGH-CONVERSION NARRATIVE PAGES',
    description:
      'High-impact, narrative-driven landing pages designed for product launches, SaaS propositions, and targeted marketing campaigns. Combining persuasive structural hierarchy with lightning-fast load times and compelling visual storytelling.',
    deliverables: [
      'Single-focus conversion-engineered layout and copy hierarchy',
      'Interactive product preview demos & feature showcases',
      'Dynamic waitlist / newsletter sign-up integrations',
      'Cross-device mobile and desktop responsive perfection',
      'A/B testing readiness and lightweight analytics integration',
    ],
    techStack: 'Tailwind CSS · React · Framer Motion · Micro-Interactions',
  },
  {
    id: 'ai-solutions',
    number: '04',
    title: 'AI-Powered Digital Solutions',
    kicker: 'PRACTICAL INTELLIGENCE & LLM APPS',
    description:
      'Designing and deploying tangible AI-powered capabilities into web applications. Ranging from domain-grounded knowledge assistants and structured LLM prompt workflows to intelligent content generation pipelines that produce operational utility without generic AI hype.',
    deliverables: [
      'Modern LLM integration (Gemini, Claude, OpenAI APIs)',
      'Domain-grounded retrieval and structured knowledge assistants',
      'Structured JSON prompting with strict schema validation',
      'Safe API key management & server-side proxy architectures',
      'Multimodal intelligence (text, audio, image analysis workflows)',
    ],
    techStack: '@google/genai · REST/JSON Proxies · Structured Prompts · Vector Context',
  },
  {
    id: 'workflow-automation',
    number: '05',
    title: 'Workflow / Business Automation',
    kicker: 'REPETITIVE TASK ELIMINATION & WEBHOOKS',
    description:
      'Building event-driven automation pipelines and operational connectors that eliminate tedious manual workflows, sync data across business tools, and streamline client intake or internal management.',
    deliverables: [
      'n8n / webhook-driven automation pipelines',
      'Automated lead intake notifications (Email, Slack, Discord, CRM)',
      'Data extraction, formatting, and cross-platform synchronization',
      'Scheduled background cron tasks & API integration pipelines',
      'Error alerting, fallback handling, and execution logging',
    ],
    techStack: 'n8n · Webhooks · Serverless Functions · Cloud Tasks · REST APIs',
  },
];

export default function ServicesPage() {
  return (
    <LegalPageLayout
      title="Services & Capabilities"
      subtitle="Comprehensive digital services delivered by Sahil Bhatia: custom web engineering, bespoke personal systems, and pragmatic AI workflow automation."
      category="DIGITAL SERVICES CATALOG"
      effectiveDate="March 2026"
    >
      <PageSEO
        title="Services — Sahil Bhatia | AI Solutions & Web Engineering"
        description="Portfolio websites, business web applications, landing pages, AI-powered systems, and workflow automation by Sahil Bhatia."
        canonicalUrl="https://sahil-bhatia-ai-portfolio.vercel.app/services"
      />

      <div className="space-y-12">
        {/* Scope Clarity Notice */}
        <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-red-400 uppercase tracking-widest font-semibold">
            <Terminal className="w-4 h-4" />
            <span>COMMERCIAL ENGAGEMENT SCOPE</span>
          </div>
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            All services are provided on a tailored, contract-based engagement model with fixed project deliverables or agreed milestone sprints. We strictly do not claim or offer regulated financial, legal, insurance, or medical services.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-8">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="rounded-xl bg-[#0a0b0f] border border-white/10 hover:border-white/20 p-6 sm:p-8 space-y-6 transition-colors shadow-lg relative group"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <div className="font-mono text-xs text-red-500 uppercase tracking-wider mb-1">
                    {srv.number} &bull; {srv.kicker}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-white">
                    {srv.title}
                  </h3>
                </div>
                <div className="font-mono text-xs text-neutral-500 shrink-0">
                  STATUS: AVAILABLE
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                {srv.description}
              </p>

              {/* Key Deliverables */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                  KEY DELIVERABLES &amp; SCOPE INCLUSIONS
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-300 font-sans">
                  {srv.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack & Action */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div className="text-neutral-400">
                  <span className="text-neutral-500 uppercase mr-1.5">STACK:</span>
                  <span className="text-neutral-200">{srv.techStack}</span>
                </div>

                <a
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-red-500/40 transition-colors shrink-0"
                >
                  <span>Inquire for {srv.title.split(' ')[0]}</span>
                  <ArrowUpRight className="w-3 h-3 text-red-400" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="rounded-xl bg-gradient-to-r from-red-950/30 to-[#0c0d12] border border-red-500/30 p-6 sm:p-8 space-y-4 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h4 className="text-xl font-bold font-display uppercase tracking-tight text-white">
              Ready to Discuss Your Project?
            </h4>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Every engagement starts with a direct technical brief and scope outline. Share what you want to build and receive an actionable proposal.
            </p>
          </div>

          <a
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shrink-0"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </LegalPageLayout>
  );
}
