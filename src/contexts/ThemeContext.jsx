import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './theme-context';

const THEME_KEY = 'restaurant-theme-mode';
function getInitialMode() {
  const savedMode = localStorage.getItem(THEME_KEY);
  if (savedMode === 'light' || savedMode === 'dark') return savedMode;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppThemeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const setMode = useCallback((nextMode) => {
    if (nextMode === 'light' || nextMode === 'dark') setModeState(nextMode);
  }, []);

  const toggle = useCallback(() => {
    setModeState((currentMode) => currentMode === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, setMode, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
