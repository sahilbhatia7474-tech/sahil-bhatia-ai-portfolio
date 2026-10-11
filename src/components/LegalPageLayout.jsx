import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft, ArrowUpRight, ShieldCheck, FileText, Briefcase, Info, RefreshCw, Mail } from 'lucide-react';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import { usePortfolioData } from '../context/PortfolioDataContext';

const LEGAL_NAV = [
  { label: 'Business Info', path: '/business-info', icon: Info },
  { label: 'Services', path: '/services', icon: Briefcase },
  { label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
  { label: 'Terms & Conditions', path: '/terms-and-conditions', icon: FileText },
  { label: 'Refund Policy', path: '/refund-policy', icon: RefreshCw },
  { label: 'Contact', path: '/#contact', icon: Mail },
];

export default function LegalPageLayout({
  title,
  subtitle,
  category = 'BUSINESS & LEGAL',
  effectiveDate = 'March 2026',
  children,
}) {
  const { identity } = usePortfolioData();
  const name = identity?.name || 'SAHIL BHATIA';

  return (
    <div className="bg-[#070708] min-h-screen text-neutral-100 flex flex-col font-sans selection:bg-red-600 selection:text-white antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#070708]/90 backdrop-blur-md border-b border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group select-none"
            aria-label="Return to Portfolio OS Home"
          >
            <div className="w-8 h-8 rounded-md bg-[#121318] border border-white/15 flex items-center justify-center group-hover:border-red-500/60 transition-colors">
              <Cpu className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-red-400 transition-colors">
                {name}
              </span>
              <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                PORTFOLIO OS &bull; LEGAL &amp; BUSINESS
              </span>
            </div>
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Portfolio OS</span>
              <span className="sm:hidden">Home</span>
            </Link>

            <a
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold transition-colors"
            >
              <span>Contact</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Header Banner */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#0d0e14] to-[#070708] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs text-red-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{category}</span>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-neutral-400">LAST UPDATED: {effectiveDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold uppercase tracking-tight text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Quick Subnav Tabs */}
          <div className="pt-4 flex flex-wrap gap-2">
            {LEGAL_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-red-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Compact Directory Cross-Link Band */}
      <div className="border-t border-white/10 bg-[#060608] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            <span className="text-neutral-500 uppercase mr-2">VERIFICATION ARCHITECTURE:</span>
            <span className="text-neutral-300">MERCHANT COMPLIANT // COMMERCIAL READY</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/business-info" className="hover:text-white transition-colors">
              Business Info
            </Link>
            <span>&bull;</span>
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <span>&bull;</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>&bull;</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
