import { useState } from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext';
import { Activity, Clock, Filter, CheckCircle2, Shield } from 'lucide-react';

const VaultActivityLog = () => {
  const { activityLogs } = usePortfolioData();
  const [filterAction, setFilterAction] = useState('ALL');

  const filteredLogs = activityLogs.filter(
    (log) => filterAction === 'ALL' || log.action === filterAction
  );

  const actions = Array.from(new Set(activityLogs.map((l) => l.action).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span>FOUNDER ACTIVITY LOG & HISTORY</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Log of publishing operations, draft updates, security sessions, and data modifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Clock className="w-4 h-4 text-red-500" />
          <span>Total Entries: {activityLogs.length}</span>
        </div>
      </div>

      {/* Filter toolbar */}
      {actions.length > 0 && (
        <div className="rounded-xl bg-[#0b0c12] border border-white/10 p-4 flex items-center gap-3 text-xs font-mono">
          <Filter className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400">Filter Operation:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[#141620] border border-white/15 text-white text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      )}

      {/* Log Feed */}
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const date = new Date(log.timestamp);
          return (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-[#0c0d14] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-950/40 text-red-300 border border-red-500/30">
                    {log.action}
                  </span>
                  <span className="text-neutral-400">Target: {log.collection || 'SYSTEM'}</span>
                </div>
                <p className="text-neutral-200 font-sans">{log.summary}</p>
              </div>

              <div className="text-[11px] text-neutral-500 shrink-0 font-mono text-right">
                <div>{date.toLocaleDateString()}</div>
                <div>{date.toLocaleTimeString()}</div>
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center rounded-xl bg-[#0b0c12] border border-white/10 text-xs font-mono text-neutral-400">
            No activity logs recorded yet. Changes made in the Founder Vault will populate here automatically.
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultActivityLog;
