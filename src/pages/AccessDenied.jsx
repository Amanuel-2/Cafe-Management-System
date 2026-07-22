import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AccessDenied() {
  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Paper variant="outlined" sx={{ width: '100%', p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
        <Stack alignItems="center" spacing={2}>
          <ShieldX size={52} aria-hidden="true" />
          <Typography component="h1" variant="h4" sx={{ fontWeight: 850 }}>Access denied</Typography>
          <Typography color="text.secondary">Your assigned role does not include permission to open this page.</Typography>
          <Button component={Link} to="/dashboard" variant="contained">Return to your dashboard</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

