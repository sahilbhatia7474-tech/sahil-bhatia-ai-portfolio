import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  FolderKanban,
  Award,
  Image as ImageIcon,
  Briefcase,
  Smartphone,
  PlusCircle,
  Activity,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Settings,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VaultDashboard = ({ setActiveTab, openNewModal }) => {
  const {
    allProjects,
    certificates,
    media,
    allJourney,
    activityLogs,
    siteSettings,
    previewMode,
    setPreviewMode,
  } = usePortfolioData();

  const publishedProjects = allProjects.filter((p) => p.status === 'PUBLISHED').length;
  const draftProjects = allProjects.filter((p) => p.status === 'DRAFT').length;
  const verifyItems = allJourney.filter((j) => j.status === 'VERIFY' || !j.verified).length;

  // Real, meaningful system indicators — zero fabrication
  const systemStatusCards = [
    {
      title: 'SYSTEM STATUS',
      value: 'AUTHENTICATED',
      desc: 'Founder authorization verified',
      icon: Activity,
      color: 'text-emerald-400',
      border: 'border-white/10',
    },
    {
      title: 'PUBLIC EXPERIENCE',
      value: siteSettings?.maintenanceMode ? 'MAINTENANCE' : 'LIVE',
      desc: siteSettings?.maintenanceMode ? 'Public traffic paused' : 'Serving production runtime',
      icon: ShieldCheck,
      color: siteSettings?.maintenanceMode ? 'text-amber-400' : 'text-emerald-400',
      border: 'border-white/10',
      action: () => setActiveTab('settings'),
    },
    {
      title: 'FOUNDER VAULT',
      value: 'PRIVATE',
      desc: 'Restricted root access console',
      icon: ShieldCheck,
      color: 'text-red-400',
      border: 'border-white/10',
    },
  ];

  // Core Operating Sections
  const operationalSections = [
    {
      title: 'PORTFOLIO CONTROL',
      desc: 'Manage what is publicly visible across the portfolio.',
      badge: 'CONTROLS',
      icon: Settings,
      action: () => setActiveTab('settings'),
    },
    {
      title: 'CLIENT INQUIRIES',
      desc: 'Review consultation requests and project briefs submitted via the portfolio.',
      badge: 'INBOX',
      icon: Mail,
      action: () => setActiveTab('inquiries'),
    },
    {
      title: 'FOUNDER CARD',
      desc: 'Control the featured portrait, focal position, identity copy, and public visibility.',
      badge: 'LIVE 3D',
      icon: Sparkles,
      action: () => setActiveTab('portrait'),
    },
    {
      title: 'PROJECT SYSTEM',
      desc: 'Manage curated projects, demos, case studies, and publication state.',
      meta: `${allProjects.length} Curated Records (${publishedProjects} Live • ${draftProjects} Staging)`,
      badge: 'REPERTOIRE',
      icon: FolderKanban,
      action: () => setActiveTab('projects'),
    },
    {
      title: 'PROOF & CREDENTIALS',
      desc: 'Manage certificates, evidence, media, and supporting proof.',
      meta: `${certificates.length} Verified Certificates • Zero Fabrication`,
      badge: 'EVIDENCE',
      icon: Award,
      action: () => setActiveTab('certificates'),
    },
    {
      title: 'FUTURE VAULT',
      desc: 'Store experiments, future work, assets, and unpublished material.',
      meta: `${media.length} Media Assets & Work-in-Progress`,
      badge: 'STORAGE',
      icon: ImageIcon,
      action: () => setActiveTab('media'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Founder Control Room */}
      <div className="rounded-2xl bg-gradient-to-r from-[#11131c] via-[#0e0f17] to-[#12131d] border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-red-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-bold">
                FOUNDER CONTROL // SAHIL OS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">
              FOUNDER VAULT
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Private control room for portfolio systems, identity, projects, proof, and the Founder Card.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Founder Access Status Indicator */}
            <div className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="font-bold tracking-wider">FOUNDER ACCESS // ACTIVE</span>
            </div>

            {/* Live vs Draft Preview Toggle */}
            <div className="p-1 rounded-lg bg-[#08090d] border border-white/15 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setPreviewMode('PUBLISHED')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  previewMode === 'PUBLISHED'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Live (Published)
              </button>
              <button
                onClick={() => setPreviewMode('DRAFT')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  previewMode === 'DRAFT'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Staging (Drafts)
              </button>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View Public App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real Status Indicators (Zero Fake Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {systemStatusCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={stat.action}
              className={`rounded-xl bg-[#0c0d13] border ${stat.border} p-5 transition-all ${
                stat.action ? 'cursor-pointer hover:border-red-500/40 hover:bg-[#11131a]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  {stat.title}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-xl font-black font-mono tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-neutral-400 mt-1 font-sans">
                {stat.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Section Operating Consoles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            OPERATIONAL SECTIONS // DIRECT ACCESS
          </div>
          <div className="font-mono text-[11px] text-red-400">
            SYSTEM STATUS: AUTHENTICATED // FOUNDER
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationalSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                onClick={sec.action}
                className="p-5 rounded-xl bg-[#0c0d13] border border-white/10 hover:border-red-500/40 hover:bg-[#11131a] transition-all cursor-pointer flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                      {sec.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-1 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>

                {sec.meta && (
                  <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-500">
                    {sec.meta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Creator Actions */}
      <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              RAPID ACTIONS & CONTENT CREATION
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">TOUCH-READY DIRECT DISPATCH</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Add Project', tab: 'projects', openModal: true, icon: FolderKanban },
            { label: 'Edit 3D Card', tab: 'portrait', openModal: false, icon: Sparkles },
            { label: 'Add Certificate', tab: 'certificates', openModal: true, icon: Award },
            { label: 'Add Photo/Media', tab: 'media', openModal: true, icon: ImageIcon },
            { label: 'Add Experience', tab: 'journey', openModal: true, icon: Briefcase },
            { label: 'Add App Entry', tab: 'apps', openModal: true, icon: Smartphone },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  setActiveTab(action.tab);
                  if (action.openModal && openNewModal) {
                    openNewModal(action.tab);
                  }
                }}
                className="min-h-[44px] p-3 rounded-lg bg-[#12141c] hover:bg-[#181b26] border border-white/10 hover:border-red-500/40 text-left transition-colors flex flex-col justify-between gap-2 cursor-pointer group"
              >
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-mono text-neutral-200 font-semibold leading-tight">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Activity Log & Honesty Audit Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Activity Feed */}
        <div className="lg:col-span-8 rounded-xl bg-[#0b0c12] border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                RECENT VAULT ACTIVITY
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('activity')}
              className="text-[11px] font-mono text-neutral-400 hover:text-white cursor-pointer"
            >
              View Full Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[#11131a] border border-white/5 flex items-start justify-between gap-3 text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <span className="text-red-400 font-bold">{log.action}</span>
                    <p className="text-neutral-300 font-sans">{log.summary}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs font-mono text-neutral-400">
                Initial Founder Vault ready. Actions taken will appear in this feed.
              </div>
            )}
          </div>
        </div>

        {/* Honesty Rule Audit Guard */}
        <div className="lg:col-span-4 rounded-xl bg-[#0b0c12] border border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              PROJECT HONESTY GUARD
            </h3>
          </div>

          <div className="space-y-3 text-xs font-sans text-neutral-300">
            <p className="leading-relaxed">
              Every professional claim on this portfolio is audited before public publication.
            </p>
            <div className="p-3 rounded bg-[#13141f] border border-amber-500/30 text-amber-300 space-y-1 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>PhonePe Timeline Audit</span>
              </div>
              <p className="text-neutral-300 font-sans text-[11px]">
                Kept as &ldquo;Verify Before Publishing&rdquo; to adhere strictly to zero-fabrication rules.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-t border-white/10">
              <span>UNVERIFIED ITEMS:</span>
              <span className="text-amber-400 font-bold">{verifyItems} BLOCKED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VaultDashboard;
