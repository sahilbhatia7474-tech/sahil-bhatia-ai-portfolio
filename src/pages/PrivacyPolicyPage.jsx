import LegalPageLayout from '../components/LegalPageLayout';
import PageSEO from '../components/PageSEO';
import { ShieldCheck, Lock, Database, Mail, Eye, Server } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

export default function PrivacyPolicyPage() {
  const { identity } = usePortfolioData();
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Transparent data governance practices, security protocols, and privacy standards applicable to Sahil Bhatia's portfolio and digital services."
      category="DATA PRIVACY & INTEGRITY"
      effectiveDate="March 2026"
    >
      <PageSEO
        title="Privacy Policy — Sahil Bhatia"
        description="Privacy policy and data protection framework for portfolio and digital services by Sahil Bhatia."
        canonicalUrl="https://sahil-bhatia-ai-portfolio.vercel.app/privacy-policy"
      />

      <div className="space-y-10 text-neutral-300 font-sans leading-relaxed text-sm">
        {/* Intro Overview */}
        <section className="space-y-3">
          <p>
            This Privacy Policy explains how <strong className="text-white">Sahil Bhatia</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating via the website <span className="font-mono text-xs text-red-400">sahil-bhatia-ai-portfolio.vercel.app</span> (&ldquo;Portfolio OS&rdquo;), collects, uses, and safeguards information when you visit this website, submit a project consultation inquiry, or engage in digital services.
          </p>
          <p>
            We operate with a fundamental philosophy of minimal data collection: we collect only what is strictly necessary to communicate with you and fulfill requested engineering or consulting services. We do not sell, rent, or trade your personal information with data brokers or marketing aggregators.
          </p>
        </section>

        {/* 1. Information Collected */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-red-400" />
              <span>1. Information We Collect</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>We collect information you voluntarily provide to us when using the website:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li>
                <strong className="text-white">Contact &amp; Inquiry Data:</strong> When you submit a project brief through our consultation form or reach out via email, we collect your name or organization, email address, selected consultation category, and the project problem or description you submit.
              </li>
              <li>
                <strong className="text-white">Direct Correspondence:</strong> If you communicate with us via email, we retain the record of the conversation to facilitate project delivery and support.
              </li>
              <li>
                <strong className="text-white">Device &amp; Session Context:</strong> Standard server access logs (such as IP addresses, browser user agent, and request timestamps) automatically recorded by our hosting infrastructure for security auditing and traffic routing.
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Contact Forms & Communication */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-400" />
              <span>2. How We Use Your Information</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>Your information is used strictly for legitimate commercial and engineering purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li>To evaluate and respond to your consultation briefs, inquiries, and proposals.</li>
              <li>To perform contracted web development, system architecture, or workflow automation services.</li>
              <li>To maintain project records, issue service invoices, and provide after-delivery support.</li>
              <li>To protect against spam, fraudulent inquiries, or malicious attacks against the website.</li>
            </ul>
            <p className="text-xs text-neutral-400 italic">
              We never subscribe you to unsolicited promotional newsletters without your explicit consent.
            </p>
          </div>
        </section>

        {/* 3. Analytics, Cookies & Local Storage */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-400" />
              <span>3. Cookies &amp; Storage Preferences</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              This website does not deploy third-party advertising cookies, cross-site trackers, or behavioral tracking pixels.
            </p>
            <p>
              We utilize browser <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded text-red-400">sessionStorage</code> and <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded text-red-400">localStorage</code> strictly for technical user experience preferences:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-neutral-400 font-mono">
              <li>Remembering that the initial system boot animation has completed for the session.</li>
              <li>Preserving your selected theme mode (dark / futuristic HUD).</li>
              <li>Throttling rapid-fire contact form submissions to prevent automated spam abuse.</li>
            </ul>
          </div>
        </section>

        {/* 4. Verified Third-Party Service Providers */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-red-400" />
              <span>4. Third-Party Service Infrastructure</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              We rely only on verified, industry-standard infrastructure providers strictly necessary to host the website and process inbound requests:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-lg bg-[#0c0d12] border border-white/10 space-y-1">
                <span className="font-mono text-xs text-white font-semibold">Google Firebase (Firestore)</span>
                <p className="text-xs text-neutral-400">
                  Used for encrypted storage and queuing of inbound consultation inquiries submitted via the contact form.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0c0d12] border border-white/10 space-y-1">
                <span className="font-mono text-xs text-white font-semibold">Vercel / Cloud Run</span>
                <p className="text-xs text-neutral-400">
                  Provides high-availability global edge hosting, SSL/TLS certificate termination, and DDoS mitigation.
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-400">
              Each infrastructure partner operates under their respective enterprise security standards and data processing agreements.
            </p>
          </div>
        </section>

        {/* 5. Data Security & Storage */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              <span>5. Data Security &amp; Retention</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>
              All data transmitted to and from this site is encrypted in transit using industry-standard TLS 1.3 / HTTPS. We enforce strict client-side validation and database security rules to prevent unauthorized access or parameter tampering.
            </p>
            <p>
              Inquiry submissions are retained only as long as necessary to maintain active business communications, deliver contracted services, or comply with statutory commercial accounting obligations.
            </p>
          </div>
        </section>

        {/* 6. User Rights */}
        <section className="space-y-4">
          <div className="border-b border-white/10 pb-2">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              <span>6. Your Privacy Rights</span>
            </h2>
          </div>

          <div className="space-y-3">
            <p>Regardless of your geographic location, you retain full rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-300">
              <li><strong className="text-white">Access &amp; Portability:</strong> You may request a copy of the personal information you have submitted to us.</li>
              <li><strong className="text-white">Correction:</strong> You may request corrections to any inaccurate contact information.</li>
              <li><strong className="text-white">Erasure:</strong> You may request that we permanently delete your contact history from our inquiry database at any time.</li>
            </ul>
          </div>
        </section>

        {/* 7. Contact Details */}
        <section className="p-5 rounded-xl bg-[#0c0d12] border border-white/10 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-red-400 font-bold">
            PRIVACY &amp; DATA INQUIRIES
          </h3>
          <p className="text-xs text-neutral-300">
            For any questions regarding this Privacy Policy or to exercise your rights to data access or deletion, contact Sahil Bhatia directly:
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
