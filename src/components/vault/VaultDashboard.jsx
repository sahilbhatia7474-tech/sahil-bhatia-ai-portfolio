import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import {
  FolderKanban,
  Award,
  Image as ImageIcon,
  Briefcase,
  GraduationCap,
  Smartphone,
  PlusCircle,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VaultDashboard = ({ setActiveTab, openNewModal }) => {
  const {
    allProjects,
    certificates,
    media,
    allJourney,
    education,
    allApps,
    activityLogs,
    siteSettings,
    previewMode,
    setPreviewMode,
  } = usePortfolioData();

  const publishedProjects = allProjects.filter((p) => p.status === 'PUBLISHED').length;
  const draftProjects = allProjects.filter((p) => p.status === 'DRAFT').length;
  const verifyItems = allJourney.filter((j) => j.status === 'VERIFY' || !j.verified).length;

  const statCards = [
    {
      title: 'SITE STATUS',
      value: siteSettings?.maintenanceMode ? 'MAINTENANCE' : 'ONLINE // NOMINAL',
      desc: 'Public endpoints active',
      icon: Activity,
      color: siteSettings?.maintenanceMode ? 'text-amber-400' : 'text-emerald-400',
      border: 'border-white/10',
    },
    {
      title: 'CURATED PROJECTS',
      value: `${allProjects.length}`,
      desc: `${publishedProjects} Published &bull; ${draftProjects} Draft`,
      icon: FolderKanban,
      color: 'text-red-400',
      border: 'border-white/10',
      action: () => setActiveTab('projects'),
    },
    {
      title: 'CERTIFICATES',
      value: `${certificates.length}`,
      desc: 'Verified Credentials',
      icon: Award,
      color: 'text-blue-400',
      border: 'border-white/10',
      action: () => setActiveTab('certificates'),
    },
    {
      title: 'MEDIA ASSETS',
      value: `${media.length}`,
      desc: 'Portraits, Specs & Graphics',
      icon: ImageIcon,
      color: 'text-purple-400',
      border: 'border-white/10',
      action: () => setActiveTab('media'),
    },
    {
      title: 'JOURNEY RECORDS',
      value: `${allJourney.length}`,
      desc: verifyItems > 0 ? `${verifyItems} Audit Pending` : 'All Verified',
      icon: Briefcase,
      color: verifyItems > 0 ? 'text-amber-400' : 'text-emerald-400',
      border: verifyItems > 0 ? 'border-amber-500/30' : 'border-white/10',
      action: () => setActiveTab('journey'),
    },
    {
      title: 'DISTRIBUTED APPS',
      value: `${allApps.length}`,
      desc: 'APK, PWA & Web Hubs',
      icon: Smartphone,
      color: 'text-cyan-400',
      border: 'border-white/10',
      action: () => setActiveTab('apps'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Control Cockpit */}
      <div className="rounded-2xl bg-gradient-to-r from-[#11131c] via-[#0e0f17] to-[#12131d] border border-white/10 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-red-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-red-400 uppercase font-bold">
                FOUNDER CONTROL COCKPIT // SAHIL OS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight uppercase">
              CONTENT MANAGEMENT SUITE
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Real-time Firestore sync &bull; 3D card customization &bull; Draft/publish staging &bull; Zero fake data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>View Public App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={stat.action}
              className={`rounded-xl bg-[#0c0d13] border ${stat.border} p-5 hover:border-red-500/40 transition-all ${
                stat.action ? 'cursor-pointer hover:bg-[#11131a]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  {stat.title}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div
                className="text-xs text-neutral-400 mt-1 font-sans"
                dangerouslySetInnerHTML={{ __html: stat.desc }}
              />
            </div>
          );
        })}
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
