import { useState } from 'react';
import { useAuth } from '../../lib/authContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import VaultDashboard from './VaultDashboard';
import VaultIdentity from './VaultIdentity';
import VaultPortrait from './VaultPortrait';
import VaultProjects from './VaultProjects';
import VaultJourney from './VaultJourney';
import VaultEducation from './VaultEducation';
import VaultCertificates from './VaultCertificates';
import VaultProof from './VaultProof';
import VaultMedia from './VaultMedia';
import VaultApps from './VaultApps';
import VaultNavigation from './VaultNavigation';
import VaultSiteSettings from './VaultSiteSettings';
import VaultActivityLog from './VaultActivityLog';
import VaultDiagnostics from './VaultDiagnostics';
import VaultInquiries from './VaultInquiries';

import {
  LayoutDashboard,
  UserCheck,
  Sparkles,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Award,
  ShieldCheck,
  Image as ImageIcon,
  Smartphone,
  Compass,
  Settings,
  Activity,
  LogOut,
  Lock,
  ExternalLink,
  Menu,
  X,
  Cpu,
  Wrench,
  Mail,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Client Inquiries', icon: Mail },
  { id: 'identity', label: 'Identity & Bio', icon: UserCheck },
  { id: 'portrait', label: '3D Card & Portrait', icon: Sparkles },
  { id: 'projects', label: 'Project Manager', icon: FolderKanban },
  { id: 'journey', label: 'Journey & Audit', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'proof', label: 'Verifiable Proof', icon: ShieldCheck },
  { id: 'media', label: 'Media Assets', icon: ImageIcon },
  { id: 'apps', label: 'Apps Hub', icon: Smartphone },
  { id: 'navigation', label: 'Navigation', icon: Compass },
  { id: 'settings', label: 'Site Settings', icon: Settings },
  { id: 'activity', label: 'Activity Log', icon: Activity },
  { id: 'diagnostics', label: 'Diagnostics & Storage', icon: Wrench },
];

function playSidebarTactileSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Safe fallback if restricted
  }
}

const VaultLayout = () => {
  const { canEdit, logout, lockVault } = useAuth();
  const { previewMode, setPreviewMode, siteSettings } = usePortfolioData();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract active tab from URL path (e.g. /vault/projects -> 'projects', /vault/settings -> 'settings')
  const pathSegment = location.pathname.replace(/^\/vault\/?/, '').split('/')[0];
  const activeTab = TABS.some((t) => t.id === pathSegment) ? pathSegment : 'dashboard';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createSignal, setCreateSignal] = useState(null);

  const handleSelectTab = (tabId) => {
    navigate(`/vault/${tabId}`);
    setSidebarOpen(false);
  };

  const handleOpenNewModal = (tabId) => {
    navigate(`/vault/${tabId}`);
    setCreateSignal(tabId);
  };

  return (
    <div
      className="min-h-screen cyber-vault-bg text-neutral-100 flex flex-col font-sans antialiased relative selection:bg-red-600 selection:text-white overflow-hidden font-crisp"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
    >
      {/* ========================================================================= */}
      {/* RICH DYNAMIC AMBIENT CYBERNETIC BACKGROUND LAYERS                        */}
      {/* ========================================================================= */}
      {/* Layer 1: Ambient Cyber Glow Orbs & Volumetric Cones */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-600/15 blur-[100px] animate-neon-aura" />
        <div className="absolute top-1/4 -right-40 w-[30rem] h-[30rem] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-2/3 left-1/3 w-[26rem] h-[26rem] rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[90px]" />

        {/* Layer 2: Subtle Cybernetic Floor Perspective Grid */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-40 mix-blend-screen" />

        {/* Layer 3: Soft Vignette & Atmospheric Depth Mask */}
        <div className="absolute inset-0 bg-radial-gradient opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040509]/30 via-transparent to-[#040509]/80" />

        {/* Layer 4: Shimmer Holographic Light Sweep */}
        <div className="absolute -inset-x-full top-0 h-full w-[300%] bg-gradient-to-r from-transparent via-red-500/[0.03] to-transparent animate-holographic-sweep pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* SELECTOR 1: TOP FOUNDER NAVIGATION BAR — 3D HOLOGRAPHIC COMMAND STRIP    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#080b18]/85 backdrop-blur-2xl border-b border-red-500/40 px-4 sm:px-6 py-3 flex items-center justify-between shadow-[0_16px_45px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.22)] relative select-none">
        {/* Specular Top Rim Shine */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.9)]" />
        {/* Bottom Laser Horizon Rail */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-85 shadow-[0_0_8px_#ff2a3a]" />

        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#12162a]/90 border border-white/25 text-neutral-200 hover:text-white cursor-pointer active:scale-95 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
            aria-label="Toggle Vault Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#2e101c] via-[#1a0a12] to-[#0c0408] border border-red-500/80 flex items-center justify-center text-red-400 group-hover:border-red-400 group-hover:text-red-300 transition-all shadow-[0_0_22px_rgba(255,42,58,0.45),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:scale-105">
              <Cpu className="w-4.5 h-4.5 drop-shadow-[0_0_8px_#ff2a3a]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xs sm:text-sm tracking-wider text-white group-hover:text-red-300 transition-colors uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  FOUNDER VAULT // {siteSettings?.systemName || 'SAHIL OS'}
                </span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ff2a3a]" />
              </div>
              <span className="font-mono text-[10px] text-red-400 font-bold tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                AUTHORIZED ROOT // ARCHITECT CONSOLE
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* 3D Tactile Preview Mode Selector */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#060812]/90 border border-white/20 text-[11px] font-mono shadow-[inset_0_2px_6px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,0,0,0.5)]">
            <span className="px-2 text-slate-300 font-black tracking-wider text-[10px]">MODE:</span>
            <button
              onClick={() => setPreviewMode('PUBLISHED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                previewMode === 'PUBLISHED'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_18px_rgba(255,42,58,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Live Site
            </button>
            <button
              onClick={() => setPreviewMode('DRAFT')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider text-[10px] ${
                previewMode === 'DRAFT'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-[0_0_18px_rgba(245,158,11,0.7),inset_0_1px_0_rgba(255,255,255,0.4)] scale-[1.02]'
                  : 'text-neutral-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Draft Preview
            </button>
          </div>

          {/* Exit to Public Link */}
          <Link
            to="/"
            onClick={() => {
              if (lockVault) lockVault();
            }}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1326]/90 hover:bg-[#182040] border border-white/20 hover:border-cyan-400 text-slate-100 hover:text-white text-xs font-mono font-bold transition-all shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-95 group"
            title="Return to Public Portfolio (Locks Vault)"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Founder Identity Badge & Lock / Logout Controls */}
          <div className="flex items-center gap-2">
            {canEdit ? (
              <div className="hidden xl:flex flex-col text-right font-mono text-[10px] pl-2 border-l border-white/15">
                <span className="text-emerald-300 font-black flex items-center justify-end gap-1.5 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  FOUNDER: SAHIL BHATIA
                </span>
                <span className="text-amber-300 font-bold tracking-wider">
                  [SOLE AUTHORIZED ROOT]
                </span>
              </div>
            ) : (
              <div className="hidden xl:flex flex-col text-right font-mono text-[10px] pl-2 border-l border-white/15">
                <span className="text-cyan-300 font-black flex items-center justify-end gap-1.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  PUBLIC GUEST VIEWER
                </span>
                <span className="text-neutral-300 font-bold">
                  [READ-ONLY SPECIMEN]
                </span>
              </div>
            )}

            {/* 3D Glossy Quick Lock Button */}
            <button
              onClick={() => {
                if (lockVault) lockVault();
              }}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#2a1a08] via-[#1a1005] to-[#0e0802] hover:from-[#3a250c] hover:to-[#221406] border border-amber-500/80 text-amber-200 hover:text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_20px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] active:scale-95"
              title="Lock Vault Console (Requires Authentication/Passcode to re-open)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_#f59e0b]" />
              <span className="hidden sm:inline">Lock Vault</span>
            </button>

            {/* 3D Glossy Exit Button */}
            <button
              onClick={logout}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-gradient-to-b from-[#2a0e16] via-[#18070d] to-[#0d0307] hover:from-[#3a131f] hover:to-[#220a13] border border-red-500/80 text-red-200 hover:text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_20px_rgba(255,42,58,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] active:scale-95"
              title="Logout of Founder Vault"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 drop-shadow-[0_0_8px_#ff2a3a]" />
              <span className="hidden sm:inline">Exit Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Vault Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar Navigation (Glassloomy Command Panel) */}
        {/* Sidebar Navigation (3D Glassloomy Command Panel) */}
        <aside
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-30 w-64 sm:w-72 bg-gradient-to-b from-[#0a0d1e]/95 via-[#070914]/98 to-[#05060d]/98 backdrop-blur-2xl border-r-2 border-red-500/30 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 shadow-[16px_0_40px_rgba(0,0,0,0.92),0_0_30px_rgba(255,42,58,0.15)] relative overflow-hidden select-none font-crisp ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            transform: sidebarOpen ? 'translateX(0)' : undefined,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          {/* Specular Top-Right Edge Line & Vertical Neon Laser Rail */}
          <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-red-500/80 via-rose-500/40 to-transparent shadow-[0_0_10px_#ff2a3a] pointer-events-none z-20" />
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />

          {/* Ambient Glow Orbs inside sidebar */}
          <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-red-600/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-20 -right-20 w-44 h-44 rounded-full bg-indigo-600/10 blur-[60px] pointer-events-none" />

          {/* Top Title Bar */}
          <div className="p-3.5 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-300 font-black uppercase tracking-widest flex items-center justify-between border-b border-white/10 pb-2.5 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a3a] animate-pulse" />
                VAULT CONTROLLERS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[9px] font-black tracking-widest flex items-center gap-1 shadow-[0_0_8px_rgba(255,42,58,0.3)]">
                ROOT ACTIVE
              </span>
            </div>

            {/* Tab list */}
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSidebarTactileSound();
                    handleSelectTab(tab.id);
                  }}
                  className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl text-xs font-mono flex items-center gap-3 transition-all duration-200 cursor-pointer relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-[0_0_24px_rgba(255,42,58,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] border-2 border-red-400/80 scale-[1.02] translate-x-1'
                      : 'text-slate-200 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] hover:translate-x-1.5 border border-white/10 hover:border-white/25 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <div className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  )}

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? 'bg-black/30 text-white drop-shadow-[0_0_8px_#fff]'
                      : 'bg-black/50 text-slate-300 border border-white/10 group-hover:text-red-400 group-hover:scale-110 group-hover:border-red-500/50 group-hover:drop-shadow-[0_0_8px_#ff2a3a]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className={`truncate tracking-wide text-xs ${isActive ? 'font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : 'font-semibold text-slate-200 group-hover:text-white'}`}>
                    {tab.label}
                  </span>

                  {isActive ? (
                    <span className="ml-auto flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
                    </span>
                  ) : (
                    <span className="ml-auto text-[10px] text-slate-500 group-hover:text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar bottom telemetry diagnostic pod */}
          <div className="m-3 p-3.5 rounded-xl bg-[#060814]/95 border-2 border-white/15 text-[10px] font-mono text-slate-300 space-y-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9),0_6px_16px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden">
            {/* Specular top rim shine */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-400">FIRESTORE SYNC:</span>
              <span className="text-emerald-400 font-black drop-shadow-[0_0_6px_#10b981] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
                REAL-TIME
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-400">SECURITY:</span>
              <span className="text-red-400 font-black drop-shadow-[0_0_6px_#ff2a3a] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#ff2a3a]" />
                RBAC HARDENED
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400 font-bold">
              <span>CONSOLE:</span>
              <span className="text-cyan-400 font-black tracking-wider">v2.4 // SAHIL OS</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/70 backdrop-blur-md lg:hidden"
          />
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* PUBLIC VISITOR NOTICE BANNER (Only Sahil Bhatia Can Edit) */}
            {!canEdit && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181328] via-[#100e1e] to-[#0a0a14] border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black uppercase text-cyan-300 tracking-wider">
                        VAULT GUEST SPECIMEN MODE &bull; READ-ONLY ACCESS
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        LOCKED FOR EDITING
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans mt-0.5">
                      You are exploring the live Founder Vault. <strong className="text-white">Strict Security Notice:</strong> All content, projects, models, and systems can be edited and published exclusively by <span className="text-red-400 font-mono font-black">Sahil Bhatia</span> (Verified Founder).
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] font-mono text-neutral-400 block">AUTHORIZATION:</span>
                  <span className="text-xs font-mono font-bold text-red-400">SAHIL BHATIA ONLY</span>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <VaultDashboard
                setActiveTab={handleSelectTab}
                openNewModal={handleOpenNewModal}
              />
            )}
            {activeTab === 'inquiries' && <VaultInquiries />}
            {activeTab === 'identity' && <VaultIdentity />}
            {activeTab === 'portrait' && <VaultPortrait />}
            {activeTab === 'projects' && (
              <VaultProjects
                openCreateSignal={createSignal === 'projects'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'journey' && (
              <VaultJourney
                openCreateSignal={createSignal === 'journey'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'education' && (
              <VaultEducation
                openCreateSignal={createSignal === 'education'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'certificates' && (
              <VaultCertificates
                openCreateSignal={createSignal === 'certificates'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'proof' && <VaultProof />}
            {activeTab === 'media' && (
              <VaultMedia
                openCreateSignal={createSignal === 'media'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'apps' && (
              <VaultApps
                openCreateSignal={createSignal === 'apps'}
                clearCreateSignal={() => setCreateSignal(null)}
              />
            )}
            {activeTab === 'navigation' && <VaultNavigation />}
            {activeTab === 'settings' && <VaultSiteSettings />}
            {activeTab === 'activity' && <VaultActivityLog />}
            {activeTab === 'diagnostics' && <VaultDiagnostics />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VaultLayout;
