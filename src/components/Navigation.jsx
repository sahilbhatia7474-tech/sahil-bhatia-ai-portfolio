import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, ArrowUpRight, Cpu, Lock, Search, Bot } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import GlobalSearch from './GlobalSearch';
import ThemeToggle from './ThemeToggle';

const DEFAULT_NAV = [
  { label: 'Identity', path: '/' },
  { label: 'Capabilities', path: '/#capabilities' },
  { label: 'Projects', path: '/projects' },
  { label: 'AI Systems', path: '/ai-systems' },
  { label: 'Journey', path: '/journey' },
  { label: 'Proof', path: '/proof' },
  { label: 'Future Vault', path: '/future-vault' },
  { label: 'Apps', path: '/apps' },
];

const Navigation = () => {
  const { identity, siteSettings, navigation } = usePortfolioData();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = navigation && navigation.length > 0
    ? navigation.filter((n) => n.visible !== false).map((n) => ({ label: n.label, path: n.target }))
    : DEFAULT_NAV;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#070708]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / OS Identity */}
          <Link
            to="/"
            className="group flex items-center gap-3 select-none"
            aria-label="Sahil Bhatia Portfolio OS Home"
          >
            <div className="w-8 h-8 rounded-md bg-[#121318] border border-white/15 flex items-center justify-center group-hover:border-red-500/60 transition-colors">
              <Cpu className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-wider text-white group-hover:text-red-400 transition-colors">
                {identity?.name || 'SAHIL BHATIA'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono text-[10px] text-neutral-400 tracking-wider">
                  {siteSettings?.systemName || 'SAHIL / PORTFOLIO OS'}
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isRouteActive = location.pathname === item.path || (item.path.startsWith('/#') && location.pathname === '/');
              return (
                <a
                  key={item.label}
                  href={item.path}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all ${
                    isRouteActive
                      ? 'text-white bg-white/10 border border-white/15'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Group: Global Search, Founder Vault & Contact */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Global Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#121319] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs font-mono transition-colors shadow-sm"
              title="Global Intelligent Search (⌘K)"
              aria-label="Global Intelligent Search"
            >
              <Search className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden xl:inline text-neutral-400">Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Persistent Founder Vault Access */}
            <Link
              to="/vault"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#161317] border border-red-500/30 text-red-400 hover:text-white hover:bg-red-950/40 text-xs font-mono transition-colors shadow-sm"
              title="Founder Vault (CMS)"
            >
              <span>FOUNDER VAULT</span>
              <span>🔒</span>
            </Link>

            {/* AI Assistant Direct Access */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#12141f] border border-red-500/30 text-neutral-200 hover:text-white hover:border-red-500/60 text-xs font-mono transition-colors shadow-sm cursor-pointer"
              title="Ask Sahil AI Assistant"
              aria-label="Open AI Assistant"
            >
              <Bot className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden xl:inline">AI ASSISTANT</span>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#101116] border border-white/10 font-mono text-[11px] text-neutral-400">
              <Terminal className="w-3 h-3 text-red-500" />
              <span>SYSTEM:</span>
              <span className="text-neutral-200">{siteSettings?.systemName || 'SAHIL / PORTFOLIO OS'}</span>
            </div>

            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>Direct Channel</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Right Controls: Search + Theme + Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md bg-[#121318] border border-white/10 text-neutral-300 hover:text-white"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4 text-red-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-[#121318] border border-white/10 text-neutral-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0d] border-b border-white/15 px-5 py-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {/* Mobile Quick Search Input */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 mb-2 rounded-md bg-[#121319] border border-white/10 text-neutral-400 hover:text-white text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-red-400" />
                  <span>Search Knowledge Model...</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                  SEARCH
                </span>
              </button>

              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex justify-between items-center">
                <span>SYSTEM NAVIGATION</span>
                <span className="text-red-400">LIVE</span>
              </div>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-mono text-neutral-300 hover:text-white hover:bg-white/10"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-neutral-600">→</span>
                </a>
              ))}

              {/* Mobile Persistent Founder Vault */}
              <Link
                to="/vault"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-mono text-red-400 bg-red-950/20 border border-red-500/30 hover:bg-red-950/40"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>FOUNDER VAULT</span>
                  <span>🔒</span>
                </div>
                <span className="text-xs text-red-400 font-bold">ACCESS</span>
              </Link>

              {/* Mobile AI Assistant Trigger */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-ai-assistant'));
                }}
                className="flex items-center justify-between py-2.5 px-3 rounded-md text-sm font-mono text-neutral-200 bg-[#12141f] border border-red-500/30 hover:border-red-500/60 text-left"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-red-400" />
                  <span>ASK SAHIL AI</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                  INTELLIGENCE
                </span>
              </button>

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                <a
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-700"
                >
                  <span>Initiate Contact</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 px-2">
                  <span>{siteSettings?.systemName || 'SAHIL / PORTFOLIO OS'}</span>
                  <span className="text-red-400">STATUS: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Intelligent Search Overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navigation;
