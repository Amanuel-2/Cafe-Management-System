import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { ConsumerCartProvider } from '../contexts/ConsumerCartContext';
import { OrderProvider } from '../contexts/OrderContext';
import { WaiterCartProvider } from '../contexts/WaiterCartContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { AppThemeProvider } from '../contexts/ThemeContext';
import { useAppTheme } from '../hooks/useAppTheme';

function MuiThemeBridge({ children }) {
  const { mode } = useAppTheme();
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
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function AppProviders({ children }) {
  return (
    <AppThemeProvider>
      <MuiThemeBridge>
        <AuthProvider>
          <NotificationProvider><OrderProvider><WaiterCartProvider><ConsumerCartProvider>{children}</ConsumerCartProvider></WaiterCartProvider></OrderProvider></NotificationProvider>
        </AuthProvider>
      </MuiThemeBridge>
    </AppThemeProvider>
  );
}

