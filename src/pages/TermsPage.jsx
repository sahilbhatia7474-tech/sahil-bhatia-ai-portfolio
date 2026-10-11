import LegalPageLayout from '../components/LegalPageLayout';
import PageSEO from '../components/PageSEO';
import { FileText, ShieldAlert, CheckCircle2, Scale, DollarSign, Layers, Code } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function TermsPage() {
  const { identity } = usePortfolioData();
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Standard commercial engagement framework, service parameters, and operational terms governing digital services provided by Sahil Bhatia."
      category="COMMERCIAL TERMS OF SERVICE"
      effectiveDate="March 2026"
    >
      <PageSEO
        title="Terms & Conditions — Sahil Bhatia"
        description="Standard terms of service, engagement conditions, and delivery guidelines for digital services by Sahil Bhatia."
        canonicalUrl="https://sahil-bhatia-ai-portfolio.vercel.app/terms-and-conditions"
      />

      <div className="space-y-10 text-neutral-300 font-sans leading-relaxed text-sm">
        {/* Intro Overview */}
        <section className="space-y-3">
          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern the professional relationship between <strong className="text-white">Sahil Bhatia</strong> (&ldquo;Consultant&rdquo;, &ldquo;Developer&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;) and any individual, entity, or client (&ldquo;Client&rdquo; or &ldquo;you&rdquo;) contracting for digital services, including portfolio website development, business websites, landing pages, AI-powered digital solutions, and workflow automation.
          </p>
          <p>
            By commissioning a project, accepting an electronic proposal, or remitting an advance deposit, you agree to be bound by these Terms in conjunction with any specific written Statement of Work (&ldquo;SOW&rdquo;) or project estimate.
          </p>
        </section>

        {/* 1. Services & Project Scope */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-400" />
              <span>1. Engagement Scope &amp; Deliverables</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              All work is executed on a bespoke, project-by-project basis. Specific deliverables, technical stacks, milestones, and timelines are outlined in an individual project proposal or written agreement prior to initiation.
            </p>
            <p>
              Services offered are strictly confined to digital technology domains:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-neutral-300 font-mono">
              <li>Portfolio Website Development</li>
              <li>Business Website Development</li>
              <li>Landing Page Development</li>
              <li>AI-Powered Digital Solutions &amp; LLM Engineering</li>
              <li>Workflow &amp; Business Automation (n8n, Webhooks, APIs)</li>
            </ul>
            <p className="text-xs text-neutral-400">
              Any feature, integration, or deliverable not explicitly documented in the written project scope is deemed out-of-scope and will be quoted as a separate addendum.
            </p>
          </div>
        </section>

        {/* 2. Client Responsibilities */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-400" />
              <span>2. Client Responsibilities &amp; Cooperation</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>To ensure project momentum and delivery within estimated timelines, the Client agrees to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li>Provide all necessary brand assets, text copy, graphic materials, and third-party credentials in a timely manner.</li>
              <li>Designate a primary point of contact with decision-making authority for approvals and feedback.</li>
              <li>Respond to technical reviews, milestone staging links, and written requests within five (5) business days.</li>
              <li>Ensure all client-provided materials do not infringe upon any third-party copyright, trademark, or intellectual property rights.</li>
            </ul>
          </div>
        </section>

        {/* 3. Payments, Invoicing & Fees */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              <span>3. Fees, Invoicing &amp; Payment Terms</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Project fees are structured on a milestone schedule or fixed retainer as specified in the project proposal (commonly 50% advance deposit upon contract execution, and 50% upon milestone completion prior to final codebase handover).
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li>Invoices are due upon receipt or within the net terms stated on the invoice.</li>
              <li>Payments are processed securely via verified electronic payment gateways (such as PayU) or direct bank transfer.</li>
              <li>Work on subsequent milestones or final production code deployment is contingent on the timely settlement of due milestone invoices.</li>
              <li>All statutory transaction fees or local taxes are transparently itemized where applicable.</li>
            </ul>
          </div>
        </section>

        {/* 4. Delivery, Review & Acceptance */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-red-400" />
              <span>4. Delivery, Review &amp; Acceptance</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Upon completing a milestone or final deployment, the Client will receive a staging URL or test environment for verification. The Client has seven (7) business days to review the deliverable against the agreed specifications and provide a consolidated punch-list of any defects.
            </p>
            <p>
              If no written defect report or objection is received within this 7-day review window, the deliverable will be deemed approved and formally accepted.
            </p>
          </div>
        </section>

        {/* 5. Revisions & Scope Adjustments */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-400" />
              <span>5. Revisions &amp; Scope Adjustments</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Each project scope includes up to two (2) rounds of refinements and adjustments within the agreed design architecture. Requests that alter the foundational architecture, introduce new external APIs, or depart from the initial approved scope will be treated as change orders with separate timeline and cost estimates.
            </p>
          </div>
        </section>

        {/* 6. Intellectual Property Rights */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-400" />
              <span>6. Intellectual Property Ownership</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              <strong className="text-white">Client Deliverables:</strong> Upon full and final settlement of all agreed fees, the Client receives full ownership of the bespoke code, customized graphics, and distinctive website assets created specifically for the project.
            </p>
            <p>
              <strong className="text-white">Pre-Existing &amp; Open-Source Tools:</strong> Pre-existing reusable utility routines, foundational frameworks (e.g. React, Tailwind CSS), open-source packages, and third-party software libraries remain subject to their respective open-source licenses (MIT, Apache, etc.).
            </p>
            <p>
              <strong className="text-white">Portfolio Showcase:</strong> Sahil Bhatia retains the customary right to showcase non-confidential public project deliverables and screenshots as part of professional case studies and portfolio archives, unless protected under a prior executed Non-Disclosure Agreement (NDA).
            </p>
          </div>
        </section>

        {/* 7. Acceptable Use & Conduct */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>7. Acceptable Use &amp; Regulatory Compliance</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              The Client agrees that developed digital systems will not be utilized for deceptive practices, malware distribution, phishing, spamming, non-consensual surveillance, or any activity violating applicable laws. We reserve the right to immediately terminate services if a project is discovered to involve illegal or malicious activities.
            </p>
          </div>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-red-400" />
              <span>8. Limitation of Liability</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              To the maximum extent permitted by applicable law, Sahil Bhatia shall not be liable for any indirect, incidental, punitive, or consequential damages (including loss of profits, business interruption, or data corruption) arising out of or in connection with the digital deliverables or third-party service downtime (such as hosting outages, external API changes, or third-party provider modifications).
            </p>
            <p>
              Our total cumulative liability under any claim arising out of an engagement shall not exceed the total fees actually received by Sahil Bhatia for the specific milestone in dispute.
            </p>
          </div>
        </section>

        {/* 9. Termination */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-400" />
              <span>9. Termination</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Either party may terminate an engagement upon seven (7) days written notice. In the event of early termination, the Client remains responsible for payment of all work performed and milestone hours invested up to the effective termination date, as detailed in our Refund &amp; Cancellation Policy.
            </p>
          </div>
        </section>

        {/* 10. Contact Information */}
        <section className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold">
            LEGAL &amp; CONTRACTUAL INQUIRIES
          </h3>
          <p className="text-xs text-neutral-300">
            For contractual questions, SOW clarifications, or master service agreement requests, reach out directly:
          </p>
          <div className="font-mono text-xs text-white">
            Email:{' '}
            <a href={`mailto:${contactEmail}`} className="text-red-400 hover:underline">
              {contactEmail}
            </a>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
}
