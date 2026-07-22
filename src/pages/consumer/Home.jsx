import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function ConsumerHome() {
  return (
    <Box component="main">
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 14 } }}>
        <Stack spacing={3} sx={{ maxWidth: 720 }}>
          <Typography color="primary" sx={{ fontWeight: 800, letterSpacing: 1 }}>WELCOME</Typography>
          <Typography component="h1" variant="h2">Fresh food, simple ordering, better service.</Typography>
          <Typography color="text.secondary" variant="h6">
            Explore the menu, choose your favorites, and follow your order from the kitchen to your table.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} to="/menu" size="large" variant="contained">View menu</Button>
            <Button component={Link} to="/track-order" size="large" variant="outlined">Track an order</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

