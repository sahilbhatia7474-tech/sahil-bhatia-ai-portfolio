import { useState } from 'react';
import { useAuth, FOUNDER_EMAIL } from '../../lib/authContext';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import VaultLogin from './VaultLogin';
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
  ExternalLink,
  Menu,
  X,
  Cpu,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
];

const VaultLayout = () => {
  const { isFounder, logout, currentUser } = useAuth();
  const { previewMode, setPreviewMode, siteSettings } = usePortfolioData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createSignal, setCreateSignal] = useState(null);

  // If not authenticated as founder, render the Vault Login screen
  if (!isFounder) {
    return <VaultLogin />;
  }

  const handleOpenNewModal = (tabId) => {
    setActiveTab(tabId);
    setCreateSignal(tabId);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-neutral-100 flex flex-col font-sans">
      {/* Top Founder Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#141620] border border-white/10 text-neutral-300 hover:text-white cursor-pointer"
            aria-label="Toggle Vault Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:border-red-500 transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs tracking-wider text-white group-hover:text-red-400 transition-colors uppercase">
                FOUNDER VAULT // {siteSettings?.systemName || 'SAHIL OS'}
              </span>
              <span className="font-mono text-[10px] text-red-400 tracking-wider">
                AUTHORIZED FOUNDER CONSOLE
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Preview Mode Selector */}
          <div className="hidden sm:flex items-center p-1 rounded-lg bg-[#10121a] border border-white/10 text-[11px] font-mono">
            <span className="px-2 text-neutral-500">MODE:</span>
            <button
              onClick={() => setPreviewMode('PUBLISHED')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                previewMode === 'PUBLISHED'
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Site
            </button>
            <button
              onClick={() => setPreviewMode('DRAFT')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                previewMode === 'DRAFT'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Draft Preview
            </button>
          </div>

          {/* Exit to Public Link */}
          <Link
            to="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Founder Identity Badge & Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex flex-col text-right font-mono text-[10px]">
              <span className="text-emerald-400 font-bold">OPERATOR: FOUNDER</span>
              <span className="text-neutral-400 truncate max-w-[160px]">
                {currentUser?.email || FOUNDER_EMAIL}
              </span>
            </div>

            <button
              onClick={logout}
              className="min-h-[38px] p-2 sm:px-3 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title="Logout of Founder Vault"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit Vault</span>
            </button>
          </div>
        </div>
      </header>

      {/* Vault Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:static top-[57px] bottom-0 left-0 z-30 w-64 bg-[#090a0f] border-r border-white/10 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              VAULT CONTROLLERS
            </div>

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,42,58,0.3)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar bottom telemetry */}
          <div className="p-4 border-t border-white/10 text-[10px] font-mono text-neutral-500 space-y-1 bg-[#06070a]">
            <div className="flex justify-between">
              <span>FIRESTORE SYNC:</span>
              <span className="text-emerald-400 font-bold">REAL-TIME</span>
            </div>
            <div className="flex justify-between">
              <span>SECURITY:</span>
              <span className="text-red-400 font-bold">RBAC HARDENED</span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <VaultDashboard
                setActiveTab={setActiveTab}
                openNewModal={handleOpenNewModal}
              />
            )}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default VaultLayout;
