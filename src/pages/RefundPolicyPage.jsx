import LegalPageLayout from '../components/LegalPageLayout';
import PageSEO from '../components/PageSEO';
import { RefreshCw, CheckCircle2, AlertTriangle, Clock, ShieldCheck, FileCheck } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function RefundPolicyPage() {
  const { identity } = usePortfolioData();
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair, and transparent guidelines governing project cancellations, milestone reviews, and refund eligibility for custom digital services by Sahil Bhatia."
      category="BILLING & CANCELLATION FRAMEWORK"
      effectiveDate="March 2026"
    >
      <PageSEO
        title="Refund & Cancellation Policy — Sahil Bhatia"
        description="Clear refund and cancellation policies for digital design, development, and consulting services by Sahil Bhatia."
        canonicalUrl="https://sahil-bhatia-ai-portfolio.vercel.app/refund-policy"
      />

      <div className="space-y-10 text-neutral-300 font-sans leading-relaxed text-sm">
        {/* Core Digital Services Principle */}
        <div className="rounded-xl bg-[#0c0d12] border border-white/10 p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-red-400 uppercase tracking-widest font-semibold">
            <RefreshCw className="w-4 h-4" />
            <span>NATURE OF BESPOKE DIGITAL SERVICES</span>
          </div>
          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            Our business provides specialized digital engineering, custom software development, website architecture, and AI workflow consulting. Unlike mass-manufactured physical retail items, our services involve dedicated professional labor, custom code, architectural design time, and immediate allocation of development resources.
          </p>
        </div>

        {/* 1. Cancellation Windows & Timing */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              <span>1. When Can a Cancellation Be Requested?</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Clients may request cancellation of an engagement at any stage by submitting a written notice via email to <strong className="text-white">{contactEmail}</strong>.
            </p>
            <p>
              How the cancellation is handled depends upon the timing and execution stage of the project:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1.5">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>A. Cancellation Prior to Project Initiation</span>
                </span>
                <p className="text-xs text-neutral-300">
                  If written cancellation is requested before any discovery sessions, wireframing, architecture planning, or code development have commenced, the initial deposit is eligible for a full refund, minus any unrecoverable third-party payment gateway transaction processing fees (typically 2-3%).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1.5">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>B. Cancellation During Active Milestone Development</span>
                </span>
                <p className="text-xs text-neutral-300">
                  Once design or engineering work has actively begun for an agreed milestone, the labor and hours already dedicated are non-refundable. Any advance paid toward future uncommenced milestones will be refunded pro-rata. All work completed up to the date of cancellation will be packaged and delivered to the Client.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0a0b0f] border border-white/10 space-y-1.5">
                <span className="text-xs font-mono text-red-400 uppercase font-bold flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" />
                  <span>C. Completed &amp; Accepted Milestones</span>
                </span>
                <p className="text-xs text-neutral-300">
                  Milestones that have been delivered, reviewed, and accepted by the Client (or deemed accepted after the 7-day review window) are strictly non-refundable due to the irreversible nature of custom digital IP delivery and time allocation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Non-Refundable Scope */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>2. Non-Refundable Items &amp; Circumstances</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>The following are strictly non-refundable under any circumstances:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li>Completed consultation advisory sessions or technical discovery audits.</li>
              <li>Custom code, designs, or architectures formally signed off and deployed to live production.</li>
              <li>Direct third-party outlays incurred on behalf of the client (such as domain registrations, cloud hosting fees, or paid API usage licenses).</li>
              <li>Delays caused by client non-responsiveness, failure to supply required credentials, or fundamental scope creep beyond agreed parameters.</li>
            </ul>
          </div>
        </section>

        {/* 3. Defect Resolution & Quality Commitment */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>3. Warranty &amp; Defect Correction Commitment</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              Rather than uncertain refund disputes, we guarantee our technical craft. Every project deliverable includes a fourteen (14) day post-launch warranty period during which any technical defects, layout glitches, or code bugs strictly within the agreed project scope are remediated promptly at zero additional charge.
            </p>
          </div>
        </section>

        {/* 4. Refund Processing Workflow & Timeline */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-red-400" />
              <span>4. Refund Request Procedure &amp; Timelines</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>To submit a cancellation or refund request:</p>
            <ol className="list-decimal list-inside space-y-2 pl-2 text-neutral-300">
              <li>
                Send an email to <strong className="text-white">{contactEmail}</strong> with the subject line <code className="font-mono text-xs bg-white/5 px-1 py-0.5 rounded text-red-400">Cancellation / Refund Request - [Project Reference]</code>.
              </li>
              <li>Include the project invoice number, client legal name, and a clear explanation of the reason for cancellation.</li>
              <li>Our team will acknowledge receipt within two (2) business days and conduct an audit of hours/deliverables completed to date.</li>
              <li>
                If a refund is approved, it will be initiated within <strong className="text-white">five (5) to seven (7) business days</strong> through the original payment method (PayU, domestic card/UPI, or direct bank transfer) subject to banking clearing cycles.
              </li>
            </ol>
          </div>
        </section>

        {/* 5. Contact for Billing & Cancellations */}
        <section className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold">
            BILLING &amp; REFUND INQUIRIES
          </h3>
          <p className="text-xs text-neutral-300">
            For questions regarding milestone invoices, payment receipts, or cancellation terms:
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
