import { LIGHT_MODE_ENABLED } from '../context/ThemeContext';

/**
 * ThemeToggle
 * Light mode is disabled as per design specification.
 * The application is strictly anchored in the signature dark cybernetic aesthetic.
 */
export const ThemeToggle = () => {
  if (!LIGHT_MODE_ENABLED) {
    return null;
  }
  return null;
};

export default ThemeToggle;
