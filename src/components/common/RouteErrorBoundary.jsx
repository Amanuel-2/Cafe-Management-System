import { Alert, AlertTitle, Box, Button, Container, Stack } from '@mui/material';
import { Component } from 'react';
import { useLocation } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route rendering failed', error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <Box component="main" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'background.default', p: 2 }}>
        <Container maxWidth="sm">
          <Alert severity="error" variant="outlined">
            <AlertTitle>We could not open this workspace</AlertTitle>
            <Stack spacing={2}>
              <span>The page encountered an unexpected problem. Your saved restaurant data has not been removed.</span>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="contained" onClick={() => window.location.reload()}>Try again</Button>
                <Button variant="outlined" onClick={() => window.location.assign('/dashboard')}>Return to dashboard</Button>
              </Stack>
            </Stack>
          </Alert>
        </Container>
      </Box>
    );
  }
}

export function RouteErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

