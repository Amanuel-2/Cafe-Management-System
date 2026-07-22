import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';

function ThemeEffect() {
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#c2410c' },
      secondary: { main: '#0f766e' },
      background: mode === 'light'
        ? { default: '#f8fafc', paper: '#ffffff' }
        : { default: '#0c0a09', paper: '#1c1917' },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontWeight: 750 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeEffect />
      {children}
    </ThemeProvider>
  );
}

