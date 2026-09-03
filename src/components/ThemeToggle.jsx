import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, LIGHT_MODE_ENABLED } from '../context/ThemeContext';

export const ThemeToggle = ({ compact = false, className = '' }) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If public light mode is on hold, do not render the toggle
  if (!LIGHT_MODE_ENABLED) {
    return null;
  }

  const options = [
    { key: 'dark', label: 'Dark Mode', icon: Moon },
    { key: 'light', label: 'Light Mode', icon: Sun },
    { key: 'system', label: 'System', icon: Laptop },
  ];

  const CurrentIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Laptop;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#121319] hover:bg-[#1a1b24] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs font-mono select-none"
        title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        aria-label="Toggle visual theme"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-neutral-300" />
        {!compact && <span className="uppercase text-[10px] tracking-wider hidden sm:inline">{theme}</span>}
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-36 rounded-lg bg-[#0e0f15] border border-white/15 p-1 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-neutral-400 border-b border-white/10 mb-1">
            Visual Theme
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setTheme(opt.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-red-950/40 text-red-300 font-semibold border border-red-500/30'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
