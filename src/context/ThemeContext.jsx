import { createContext, useContext, useEffect } from 'react';

// Light Mode is completely disabled; the application strictly uses the signature dark aesthetic.
export const LIGHT_MODE_ENABLED = false;

const ThemeContext = createContext({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  cycleTheme: () => {},
  lightModeEnabled: false,
});

const STORAGE_KEY = 'portfolio_theme_pref';

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Strictly enforce signature dark mode on root document
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Safe fallback
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme: 'dark',
        resolvedTheme: 'dark',
        setTheme: () => {},
        cycleTheme: () => {},
        lightModeEnabled: false,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
