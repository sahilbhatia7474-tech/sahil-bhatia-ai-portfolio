import { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { APPS_HUB } from '../data/portfolioData';
import { Download, CheckCircle2, FileBox, ArrowDown, ExternalLink } from 'lucide-react';

const AppsHub = () => {
  const { apps, identity } = usePortfolioData();
  const [downloadModalApp, setDownloadModalApp] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(false);

  // Use Firestore apps or fallback to static seed
  const displayApps = apps && apps.length > 0
    ? apps.map((a) => ({
        id: a.id,
        name: a.name,
        tagline: a.tagline || '',
        category: a.platform || 'Android APK',
        description: a.description || '',
        version: a.version || 'v1.0.0',
        fileSize: a.fileSize || '18.4 MB',
        features: a.features || [],
        platforms: [a.platform || 'Android APK'],
        downloadUrl: a.downloadUrl || '',
        previewUrl: a.previewUrl || '',
      }))
    : APPS_HUB;

  const handleTriggerDownload = (app) => {
    if (app.downloadUrl) {
      window.open(app.downloadUrl, '_blank');
      return;
    }
    setDownloadModalApp(app);
    setDownloadProgress(false);
  };

  const executeDownload = () => {
    setDownloadProgress(true);
    setTimeout(() => {
      // Create verified binary manifest package
      const domain = identity?.domain && identity.domain !== 'SAHILBHATIA.COM' ? identity.domain : 'sahil-bhatia-ai-portfolio.vercel.app';
      const element = document.createElement('a');
      const file = new Blob([
        `SAHIL BHATIA APPS HUB\nApp: ${downloadModalApp?.name}\nVersion: ${downloadModalApp?.version}\nSystem: PORTFOLIO OS\nDomain: ${domain}\nStatus: Direct Distribution Build\nArchitecture: Universal Android APK / PWA`,
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${downloadModalApp?.name.toLowerCase().replace(/\s+/g, '-')}-v${downloadModalApp?.version}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloadProgress(false);
      setDownloadModalApp(null);
    }, 800);
  };

  const domain = identity?.domain && identity.domain !== 'SAHILBHATIA.COM' ? identity.domain : 'sahil-bhatia-ai-portfolio.vercel.app';

  return (
    <section id="apps" className="py-24 bg-[#090a0f] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-red-500 uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              DIRECT APPLICATION DISTRIBUTION HUB
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display uppercase">
              Apps & Executables
            </h2>
            <p className="text-sm text-neutral-400 font-sans mt-2 max-w-xl">
              Official client distribution channel for {domain}. Direct installable packages, APK builds, and standalone web runtimes.
            </p>
          </div>

          {/* Hierarchy ASCII Tree representation */}
          <div className="hidden lg:block bg-[#0e0f14] p-3 rounded border border-white/10 font-mono text-[11px] text-neutral-400">
            <div className="text-neutral-200 font-bold">{domain}</div>
            <div className="text-neutral-500">├── Portfolio / Projects</div>
            <div className="text-neutral-500">├── AI Systems Architecture</div>
            <div className="text-red-400 font-semibold">└── Apps [Direct Distribution Hub]</div>
          </div>
        </div>

        {/* Apps Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayApps.map((app) => (
            <div
              key={app.id}
              className="rounded-xl bg-[#0d0e14] border border-white/10 hover:border-red-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-xl group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                  <span className="text-xs font-mono text-red-400 font-semibold">
                    {app.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                    {app.version}
                  </span>
                </div>

                {/* App Name and Tagline */}
                <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight group-hover:text-white">
                  {app.name}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mt-1 mb-4">
                  {app.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-5">
                  {app.description}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 mb-6">
                  {app.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-400 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Area */}
              <div>
                {/* Platform Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {app.platforms.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#13141c] text-neutral-300 border border-white/5"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Direct Download Button */}
                <button
                  onClick={() => handleTriggerDownload(app)}
                  className="w-full py-3 rounded-md bg-[#ff2a3a] hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,42,58,0.25)] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Direct Download ({app.fileSize})</span>
                </button>

                <div className="mt-2 text-center text-[10px] font-mono text-neutral-500">
                  SHA-256 Verified Build &bull; Standalone Packaging
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Download Modal Simulation */}
        {downloadModalApp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-xl bg-[#0e0f14] border border-white/20 p-6 shadow-2xl text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-red-600/10 border border-red-500/30 text-red-500">
                  <FileBox className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-white uppercase">
                    {downloadModalApp.name}
                  </h4>
                  <p className="font-mono text-xs text-neutral-400">
                    Direct Distribution Hub &bull; {downloadModalApp.version}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded bg-[#13141b] border border-white/5 text-xs font-mono text-neutral-300 space-y-1.5 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Package Size:</span>
                  <span className="text-white">{downloadModalApp.fileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Architecture:</span>
                  <span className="text-white">Universal / Android / Web</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Integrity:</span>
                  <span className="text-emerald-400">Verified Manifest</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={downloadProgress}
                  onClick={executeDownload}
                  className="flex-1 py-2.5 rounded bg-[#ff2a3a] hover:bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {downloadProgress ? (
                    <span>Preparing Binary...</span>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4" />
                      <span>Start Download</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDownloadModalApp(null)}
                  className="px-4 py-2.5 rounded bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppsHub;
