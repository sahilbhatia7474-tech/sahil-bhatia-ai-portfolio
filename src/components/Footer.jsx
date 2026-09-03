import { Cpu, ArrowUp, ShieldCheck, Lock } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { useAuth } from '../lib/authContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { identity, navigation } = usePortfolioData();
  const { isFounder } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = identity?.name || 'SAHIL BHATIA';
  const displayDomain = identity?.domain && identity.domain !== 'SAHILBHATIA.COM' ? identity.domain : 'sahil-bhatia-ai-portfolio.vercel.app';
  const systemName = identity?.systemName || 'PORTFOLIO OS';
  const contactEmail = identity?.contactEmail || 'sahilbhatia7474@gmail.com';

  return (
    <footer className="bg-[#050507] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 select-none relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#111218] border border-white/15 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white uppercase">
                {name}
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md leading-relaxed font-sans">
              AI Generalist, AI Consultant &amp; Digital Systems Creator. Translating frontline sales understanding into resilient agentic architectures and automated web applications.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>{systemName}</span>
              <span>&bull;</span>
              <span className="text-neutral-300">{displayDomain}</span>
            </div>

            {/* Public Verified Social Network Links */}
            <div className="pt-2 flex items-center gap-3 font-mono text-xs">
              <a
                href="https://www.instagram.com/neutronverse.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                title="Instagram @neutronverse.ai"
              >
                Instagram
              </a>
              <span className="text-neutral-600">&bull;</span>
              <a
                href="https://www.linkedin.com/in/sahil-bhatia-b3bb3a3a2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                LinkedIn
              </a>
              <span className="text-neutral-600">&bull;</span>
              <a
                href="https://github.com/sahilbhatia7474-tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
                title="GitHub Repositories"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              SYSTEM SECTIONS
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  01 &bull; Identity
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  02 &bull; Capability Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  03 &bull; Curated Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('ai-systems')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  04 &bull; AI Systems Laboratory
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  05 &bull; Professional Journey
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('proof')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  06 &bull; Proof Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  07 &bull; Future Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('apps')?.scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  08 &bull; Apps Hub
                </button>
              </li>
              {isFounder && (
                <li className="pt-2">
                  <Link to="/vault" className="text-red-400/80 hover:text-red-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Founder Vault Console</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Standards & Direct Access */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
              INTEGRITY STANDARD
            </div>
            <div className="p-3 rounded bg-[#0b0c10] border border-white/5 text-xs text-neutral-400 space-y-2 font-sans">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Fabrication Rule</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                All metrics, career intervals, and project deliverables strictly correspond to authentic work.
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="w-full py-2.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Return to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom copyright and timestamp */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} {name}. All systems operational.
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
              {contactEmail}
            </a>
            <span>&bull;</span>
            <span className="text-neutral-400">{displayDomain}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
