import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Gauge, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  RefreshCw, 
  Sparkles,
  DollarSign,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
} from 'lucide-react';
import { AI_CASE_STUDIES } from '../data/aiCaseStudiesData';

/**
 * Subtle high-tech audio feedback helper for tactile tab interactions
 */
function playTactileFeedback(type = 'tab') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'tab') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'replay') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    }
  } catch {
    // gracefully ignore
  }
}

const METRIC_TABS = [
  { id: 'all', label: 'All Metrics', icon: Layers },
  { id: 'latency', label: 'Latency Reduction', icon: Clock },
  { id: 'throughput', label: 'Throughput Gains', icon: TrendingUp },
  { id: 'tokens', label: 'Cost & Efficiency', icon: DollarSign },
  { id: 'reliability', label: 'Reliability & Precision', icon: ShieldCheck },
];

/**
 * Individual Metric Bar Chart Row
 * Razor-Sharp Subpixel Rendering without GPU Downsampling Blur
 */
function MetricComparisonBar({ metric, baselineLabel, optimizedLabel, isKeyHighlight = false }) {
  const isLowerBetter = metric.better === 'lower';
  
  const maxVal = Math.max(metric.baseline, metric.optimized);
  const baselinePct = maxVal > 0 ? (metric.baseline / maxVal) * 100 : 0;
  const optimizedPct = maxVal > 0 ? (metric.optimized / maxVal) * 100 : 0;

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 select-none relative overflow-hidden ${
      isKeyHighlight 
        ? 'bg-gradient-to-b from-[#141628] via-[#0d0f1c] to-[#070810] border-red-500/60 shadow-[0_16px_45px_rgba(0,0,0,0.9),0_0_30px_rgba(255,42,58,0.2)]' 
        : 'bg-gradient-to-b from-[#0e101d] via-[#090b14] to-[#05060b] border-white/15 hover:border-red-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
    }`}>
      {/* Specular hairline top accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_12px_#ff2a3a] opacity-80" />

      {/* Metric Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-lg bg-red-950/60 text-red-300 border border-red-500/30">
              {metric.category}
            </span>
            <h4 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight drop-shadow-sm">
              {metric.name}
            </h4>
          </div>
          <p className="font-sans text-xs text-neutral-300 mt-1 font-normal">
            {metric.context}
          </p>
        </div>

        {/* Delta Badges with Glowing Halo */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="font-mono text-xs font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 to-[#06241b] text-emerald-300 border-2 border-emerald-500/50 flex items-center gap-1.5 shadow-[0_0_16px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>{metric.deltaLabel}</span>
          </span>
          <span className="font-mono text-xs font-black px-2.5 py-1.5 rounded-xl bg-red-950/60 text-red-300 border-2 border-red-500/40 shadow-[0_0_12px_rgba(255,42,58,0.25)]">
            {metric.multiplier}
          </span>
        </div>
      </div>

      {/* Comparison Bar Chart (Baseline vs Optimized) */}
      <div className="space-y-4 font-mono">
        {/* Baseline Bar (Legacy / Unoptimized) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-neutral-600 border border-white/20" />
              <span>{baselineLabel}</span>
            </span>
            <span className="text-neutral-200">
              {metric.baseline.toLocaleString()} <span className="text-neutral-400 font-normal">{metric.unit}</span>
            </span>
          </div>
          <div className="h-8 w-full bg-[#05060b] rounded-xl p-1 border border-white/10 relative overflow-hidden flex items-center shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(6, baselinePct)}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-lg bg-gradient-to-r from-neutral-700 to-neutral-600 relative flex items-center justify-end pr-2.5 border border-white/10"
            >
              <span className="text-[11px] text-white font-black whitespace-nowrap pl-1">
                {metric.baseline.toLocaleString()} {metric.unit}
              </span>
            </motion.div>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 pl-1 font-sans">
            &bull; {metric.baselineNote}
          </p>
        </div>

        {/* Optimized Bar (AI Engineered / Active) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
              <span className="text-red-400">{optimizedLabel}</span>
              <span className="text-[10px] text-emerald-300 font-black px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
                {isLowerBetter ? 'OPTIMIZED' : 'MAXIMUM GAIN'}
              </span>
            </span>
            <span className="text-white font-black">
              {metric.optimized.toLocaleString()} <span className="text-red-400">{metric.unit}</span>
            </span>
          </div>
          <div className="h-9 w-full bg-[#05060b] rounded-xl p-1 border-2 border-red-500/40 relative overflow-hidden flex items-center shadow-[inset_0_0_14px_rgba(255,42,58,0.1)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(6, optimizedPct)}%` }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-lg bg-gradient-to-r from-red-600 via-rose-500 to-red-500 relative flex items-center justify-end pr-2.5 shadow-[0_0_22px_rgba(255,42,58,0.5)] border border-red-300/40"
            >
              <span className="text-[11px] text-white font-black whitespace-nowrap pl-1 drop-shadow-sm">
                {metric.optimized.toLocaleString()} {metric.unit}
              </span>
            </motion.div>
          </div>
          <p className="text-[11px] text-emerald-300 mt-1 pl-1 flex items-center gap-1.5 font-sans font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{metric.optimizedNote}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Cross-Study Aggregate Comparison Bar Chart
 */
function CrossStudyBenchmarkChart({ selectedCategory }) {
  const benchmarkItems = useMemo(() => {
    return AI_CASE_STUDIES.map((cs) => {
      let targetMetric = cs.metrics.find((m) => m.id === 'latency');
      if (selectedCategory === 'throughput') {
        targetMetric = cs.metrics.find((m) => m.id === 'throughput');
      } else if (selectedCategory === 'tokens') {
        targetMetric = cs.metrics.find((m) => m.id === 'tokens');
      } else if (selectedCategory === 'reliability') {
        targetMetric = cs.metrics.find((m) => m.id === 'reliability');
      }
      return {
        code: cs.code,
        title: cs.title,
        badge: cs.badge,
        metric: targetMetric || cs.metrics[0],
      };
    });
  }, [selectedCategory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {benchmarkItems.map((item) => (
        <div
          key={item.code}
          className="p-5 rounded-2xl bg-gradient-to-b from-[#13162a] to-[#070912] border-2 border-white/15 hover:border-red-500/50 transition-all shadow-[0_12px_35px_rgba(0,0,0,0.85)] space-y-3"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-white px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/40">
                {item.code}
              </span>
              <h5 className="font-display font-black text-sm text-white uppercase truncate">
                {item.title}
              </h5>
            </div>
            <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
              {item.metric.deltaLabel}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-neutral-400">
              <span>Baseline: {item.metric.baseline} {item.metric.unit}</span>
              <span className="text-white font-bold">Optimized: {item.metric.optimized} {item.metric.unit}</span>
            </div>
            <div className="h-6 w-full bg-black/60 rounded-lg p-0.5 border border-white/10 relative overflow-hidden">
              <div
                className="h-full rounded bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_12px_rgba(255,42,58,0.5)]"
                style={{ width: `${Math.min(100, Math.max(15, (item.metric.optimized / Math.max(item.metric.baseline, item.metric.optimized)) * 100))}%` }}
              />
            </div>
            <p className="text-[11px] text-neutral-300 font-sans">{item.metric.context}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AICaseStudyMetrics() {
  const [activeCaseStudyId, setActiveCaseStudyId] = useState(AI_CASE_STUDIES[0].id);
  const [selectedMetricTab, setSelectedMetricTab] = useState('all');
  const [viewMode, setViewMode] = useState('detail'); // 'detail' | 'cross-study'
  const [replayKey, setReplayKey] = useState(0);

  const activeCaseStudy = useMemo(() => {
    return AI_CASE_STUDIES.find((cs) => cs.id === activeCaseStudyId) || AI_CASE_STUDIES[0];
  }, [activeCaseStudyId]);

  const displayedMetrics = useMemo(() => {
    if (selectedMetricTab === 'all') return activeCaseStudy.metrics;
    return activeCaseStudy.metrics.filter((m) => m.id === selectedMetricTab);
  }, [activeCaseStudy, selectedMetricTab]);

  const handleReplayAnimation = useCallback(() => {
    playTactileFeedback('replay');
    setReplayKey((k) => k + 1);
  }, []);

  return (
    <section
      id="benchmarks"
      className="py-24 bg-transparent border-b border-white/10 section-spatial-containment overflow-hidden relative select-none"
    >
      <div id="case-study-metrics" className="sr-only" />

      {/* Background Spatial Coordinate Grid Plane */}
      <div
        aria-hidden="true"
        className="spatial-grid-plane opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_85%_65%_at_50%_35%,#000_50%,transparent_100%)] pointer-events-none"
      />

      {/* Spatial Depth Occlusion Mask */}
      <div aria-hidden="true" className="depth-occlusion-mask-layer pointer-events-none" />

      {/* Ambient Radiant Glow Nebulas */}
      <div className="absolute top-1/4 right-1/4 w-[650px] h-[400px] bg-red-600/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[550px] h-[350px] bg-emerald-600/[0.06] rounded-full blur-[130px] pointer-events-none" />

      {/* Laser Horizon Rail */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_16px_rgba(255,42,58,0.8)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ff2a3a]" />
              </span>
              <span className="font-black text-red-400 bg-red-950/60 px-2.5 py-1 rounded-full border border-red-500/40">
                EMPIRICAL AI BENCHMARKS // COMPARATIVE METRICS
              </span>
              <span className="text-[10px] text-neutral-400 font-bold hidden sm:inline">
                MEASURED RUNTIMES
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display uppercase drop-shadow-sm">
              AI Engineering Case Studies
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-2 max-w-2xl leading-relaxed">
              Quantitative comparison of production AI systems before and after architectural engineering. Measured across end-to-end latency reduction (-80% to -87%), throughput scaling (+420% to +1,180%), and token efficiency.
            </p>
          </div>

          {/* 3D Glowing View Mode Switcher & Replay Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div className="p-1.5 rounded-2xl bg-gradient-to-b from-[#151728] to-[#0a0b14] border-2 border-white/20 flex items-center gap-1.5 font-mono text-xs shadow-lg">
              <button
                type="button"
                onClick={() => {
                  playTactileFeedback('tab');
                  setViewMode('detail');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  viewMode === 'detail'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_16px_rgba(255,42,58,0.5)] border border-red-400/40'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Deep-Dive Study</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileFeedback('tab');
                  setViewMode('cross-study');
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  viewMode === 'cross-study'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_16px_rgba(255,42,58,0.5)] border border-red-400/40'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Cross-System Matrix</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReplayAnimation}
              title="Replay chart animations"
              className="p-2.5 rounded-2xl bg-gradient-to-b from-[#181a28] to-[#0d0f1b] border-2 border-white/20 hover:border-red-500/60 text-neutral-200 hover:text-white transition-all cursor-pointer flex items-center gap-2 font-mono text-xs shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-red-400" />
              <span className="font-bold hidden sm:inline">Replay</span>
            </button>
          </div>
        </div>

        {/* 3D Glowing Blinking Case Study Tabs */}
        {viewMode === 'detail' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {AI_CASE_STUDIES.map((cs) => {
              const isSelected = cs.id === activeCaseStudyId;
              const latencyMetric = cs.metrics.find((m) => m.id === 'latency');
              const throughputMetric = cs.metrics.find((m) => m.id === 'throughput');

              return (
                <button
                  key={cs.id}
                  onClick={() => {
                    playTactileFeedback('tab');
                    setActiveCaseStudyId(cs.id);
                  }}
                  className={`text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group cursor-pointer hover:-translate-y-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#221018] via-[#160c14] to-[#0c0810] border-red-500 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,58,0.35)] ring-2 ring-red-500/50'
                      : 'bg-gradient-to-b from-[#101222] via-[#0b0c16] to-[#06070e] border-white/15 hover:border-red-500/50 hover:bg-[#151829]'
                  }`}
                >
                  {/* Blinking 3D Radar Beacon */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-white px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-500/30">
                      {cs.code}
                    </span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                      <span className="font-mono text-[10px] text-emerald-300 font-black">
                        {latencyMetric?.deltaLabel}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-sm sm:text-base text-white uppercase tracking-tight truncate group-hover:text-red-300 transition-colors drop-shadow-sm">
                    {cs.title}
                  </h3>
                  <p className="font-mono text-[11px] text-neutral-300 truncate mt-1">
                    {cs.badge} &bull; <span className="text-emerald-400 font-bold">{throughputMetric?.deltaLabel}</span>
                  </p>

                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-red-600 shadow-[0_0_12px_#ff2a3a]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 3D Tactile Metric Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-8 border-b border-white/10 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400 mr-1 text-[11px] uppercase tracking-wider font-bold hidden sm:inline">
              Filter By Metric:
            </span>
            {METRIC_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedMetricTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playTactileFeedback('tab');
                    setSelectedMetricTab(tab.id);
                  }}
                  className={`px-3.5 py-2 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer font-bold active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-b from-white via-neutral-100 to-neutral-200 text-black border-white shadow-[0_6px_20px_rgba(255,255,255,0.35)]'
                      : 'bg-gradient-to-b from-[#141626] to-[#0a0c16] text-neutral-200 border-white/15 hover:border-red-500/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-red-500" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-neutral-300 font-semibold">
              <span className="w-3 h-3 rounded-md bg-neutral-600 border border-white/20" />
              <span>Baseline (Legacy)</span>
            </div>
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="w-3 h-3 rounded-md bg-gradient-to-r from-red-600 to-rose-500 shadow-[0_0_8px_#ff2a3a]" />
              <span className="text-red-400">Engineered (Optimized)</span>
            </div>
          </div>
        </div>

        {/* View Mode 1: Detailed Single Case Study Bar Charts */}
        {viewMode === 'detail' && (
          <div key={`study-${activeCaseStudy.id}-${replayKey}`} className="space-y-8">
            {/* Case Study Overview Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#141628] via-[#0c0e1a] to-[#06070f] border-2 border-red-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_14px_#ff2a3a]" />

              <div className="space-y-2 max-w-3xl relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-red-950/70 text-red-300 border border-red-500/40 font-black shadow-sm">
                    {activeCaseStudy.code} // {activeCaseStudy.badge}
                  </span>
                  <span className="font-mono text-xs text-neutral-300 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    SAMPLE VOLUME: {activeCaseStudy.sampleVolume}
                  </span>
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight drop-shadow-sm">
                  {activeCaseStudy.title}
                </h3>
                <p className="font-mono text-xs text-red-300 font-bold">
                  {activeCaseStudy.subtitle}
                </p>
                <p className="font-sans text-xs sm:text-sm text-neutral-200 leading-relaxed pt-1">
                  {activeCaseStudy.summary}
                </p>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-2 gap-3 shrink-0 font-mono relative z-10">
                <div className="p-4 rounded-2xl bg-[#080912] border-2 border-emerald-500/40 space-y-1 shadow-inner">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Latency Reduction
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 block drop-shadow-sm">
                    {activeCaseStudy.metrics.find((m) => m.id === 'latency')?.deltaLabel}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-bold">
                    {activeCaseStudy.metrics.find((m) => m.id === 'latency')?.multiplier}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#080912] border-2 border-emerald-500/40 space-y-1 shadow-inner">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Throughput Gain
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 block drop-shadow-sm">
                    {activeCaseStudy.metrics.find((m) => m.id === 'throughput')?.deltaLabel}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-bold">
                    {activeCaseStudy.metrics.find((m) => m.id === 'throughput')?.multiplier}
                  </span>
                </div>
              </div>
            </div>

            {/* Bar Charts Grid for the Active Case Study */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedMetrics.map((metric, idx) => (
                <MetricComparisonBar
                  key={metric.id}
                  metric={metric}
                  baselineLabel={activeCaseStudy.baselineLabel}
                  optimizedLabel={activeCaseStudy.optimizedLabel}
                  isKeyHighlight={idx === 0 || metric.id === 'latency'}
                />
              ))}
            </div>

            {/* Architectural Engineering Notes Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#101222] via-[#0a0b14] to-[#05060c] border-2 border-white/15 space-y-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <h4 className="font-mono text-xs uppercase tracking-widest text-white flex items-center gap-2 font-black">
                  <Terminal className="w-4 h-4 text-red-500" />
                  ARCHITECTURAL INTERVENTIONS THAT UNLOCKED THESE GAINS
                </h4>
                <span className="font-mono text-[11px] text-neutral-300 font-bold bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  ENV: {activeCaseStudy.runtimeEnv}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {activeCaseStudy.architectureNotes.map((note, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-2xl bg-[#080912] border border-white/10 font-sans text-xs sm:text-sm text-neutral-200 flex items-start gap-3 shadow-inner hover:border-red-500/40 transition-colors"
                  >
                    <span className="font-mono text-xs font-black text-white px-2 py-0.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 border border-red-400/30 shrink-0">
                      0{index + 1}
                    </span>
                    <p className="leading-relaxed">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Cross-Study Matrix Comparison */}
        {viewMode === 'cross-study' && (
          <div key={`cross-${replayKey}`} className="space-y-6">
            <div className="p-4.5 rounded-2xl bg-[#121424] border-2 border-white/15 flex items-center justify-between text-xs font-mono text-neutral-200">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-red-400" />
                <span>Comparing all 4 AI engineering systems on: <strong className="text-white uppercase font-black">{selectedMetricTab === 'all' ? 'Latency Reduction' : selectedMetricTab}</strong></span>
              </div>
              <span className="text-neutral-400 hidden sm:inline font-bold">
                Baseline (Muted) vs Engineered (Crimson)
              </span>
            </div>

            <CrossStudyBenchmarkChart selectedCategory={selectedMetricTab} />
          </div>
        )}

        {/* Empirical Testing Methodology Footer */}
        <div className="mt-12 p-5 rounded-2xl bg-[#090b14] border-2 border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-neutral-300 shadow-lg">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All benchmarks verified through automated test suites with controlled request concurrency, fixed seed distributions, and zero synthetic warming bias.
            </span>
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-white hover:text-red-400 transition-colors font-black shrink-0 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 active:scale-95"
          >
            <span>Request Full Audit Telemetry</span>
            <ArrowUpRight className="w-4 h-4 text-red-400" />
          </a>
        </div>

      </div>
    </section>
  );
}
