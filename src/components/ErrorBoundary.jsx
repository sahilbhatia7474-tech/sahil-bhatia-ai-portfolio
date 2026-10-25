import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Portfolio Error Boundary caught an issue:', error, errorInfo);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070708] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-[#0d0e14] border border-red-500/40 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-xl bg-red-600/10 border border-red-500/40 flex items-center justify-center text-red-500">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            </div>
            <div>
              <div className="font-mono text-xs text-red-400 uppercase tracking-widest mb-1">
                SYSTEM RECOVERY // AUTONOMIC RESTART
              </div>
              <h1 className="text-2xl font-bold font-display uppercase tracking-tight text-white">
                SAHIL BHATIA &bull; PORTFOLIO OS
              </h1>
              <p className="text-xs text-neutral-400 mt-2 font-sans leading-relaxed">
                The interface encountered a runtime initialization anomaly. Autonomic recovery is ready.
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,42,58,0.4)] transition-all cursor-pointer"
            >
              Reload Portfolio OS
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
