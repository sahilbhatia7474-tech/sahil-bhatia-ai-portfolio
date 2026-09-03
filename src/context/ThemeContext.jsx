import { createContext, useContext, useState, useEffect } from 'react';

// Feature Flag: Public Light Mode is temporarily on hold.
// Set to true when Light Mode is ready to be re-enabled.
export const LIGHT_MODE_ENABLED = false;

const ThemeContext = createContext({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  cycleTheme: () => {},
  lightModeEnabled: LIGHT_MODE_ENABLED,
});

const STORAGE_KEY = 'portfolio_theme_pref';

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (!LIGHT_MODE_ENABLED) return 'dark';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'dark'; // Default brand theme
  });

  const [systemPref, setSystemPref] = useState(() => {
    if (!LIGHT_MODE_ENABLED) return 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (!LIGHT_MODE_ENABLED) return;
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => {
      setSystemPref(e.matches ? 'light' : 'dark');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When LIGHT_MODE_ENABLED is false, resolvedTheme is ALWAYS 'dark'
  const resolvedTheme = LIGHT_MODE_ENABLED
    ? (theme === 'system' ? systemPref : theme)
    : 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme) => {
    if (!LIGHT_MODE_ENABLED) return; // Prevent switching when disabled
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return;
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // Ignore storage error
    }
  };

  const cycleTheme = () => {
    if (!LIGHT_MODE_ENABLED) return; // Prevent switching when disabled
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme: LIGHT_MODE_ENABLED ? theme : 'dark', resolvedTheme, setTheme, cycleTheme, lightModeEnabled: LIGHT_MODE_ENABLED }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
