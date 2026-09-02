import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SystemBootLoader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [bootLog, setBootLog] = useState('SYS_INIT: SAHIL / PORTFOLIO OS v2.6.4');

  useEffect(() => {
    const logs = [
      'SYS_INIT: SAHIL / PORTFOLIO OS v2.6.4',
      'LOADING: AGENTIC ROUTING MATRIX & DAG SCHEDULER...',
      'CONNECTING: SAHILBHATIA.COM RUNTIME...',
      'STATUS: CORE ENGINE READY // DEPLOYING INTERFACE',
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      logIndex += 1;
      if (logIndex < logs.length) {
        setBootLog(logs[logIndex]);
      } else {
        clearInterval(interval);
      }
    }, 280);

    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    tl.set(containerRef.current, { autoAlpha: 1 })
      .fromTo(
        contentRef.current,
        { scale: 0.96, opacity: 0, filter: 'blur(6px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
      )
      .to(contentRef.current, {
        opacity: 0,
        y: -10,
        filter: 'blur(8px)',
        duration: 0.35,
        ease: 'power2.in',
        delay: 1.1,
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#070708] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      <div ref={contentRef} className="flex flex-col items-center gap-6 px-6 max-w-md w-full text-center">
        {/* System telemetry radar ring */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-red-500/20 animate-ping absolute" />
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff2a3a] shadow-[0_0_8px_#ff2a3a]" />
          </div>
        </div>

        {/* Identity & System Brand */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
            EXPERIENCE INITIALIZATION
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-[0.15em] text-white uppercase font-display">
            SAHIL BHATIA
          </h1>
          <div className="text-xs font-mono text-red-500 font-medium tracking-wider">
            SAHIL / PORTFOLIO OS
          </div>
        </div>

        {/* Dynamic Telemetry Log */}
        <div className="w-full bg-[#0e0f13] border border-white/10 rounded-md py-2 px-3">
          <div className="text-[11px] font-mono text-neutral-300 truncate">
            &gt; {bootLog}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemBootLoader;
