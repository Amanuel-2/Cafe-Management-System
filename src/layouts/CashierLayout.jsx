import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { ProfileMenu } from '../components/common/ProfileMenu';
import { ThemeSwitch } from '../components/common/ThemeSwitch';

const links = [
  { label: 'Dashboard', to: '/cashier', end: true },
  { label: 'POS', to: '/cashier/pos' },
  { label: 'Orders', to: '/cashier/orders' },
  { label: 'Payments', to: '/cashier/payments' },
  { label: 'Receipts', to: '/cashier/receipts' },
];

export function CashierLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, whiteSpace: 'nowrap' }}>Cashier Station</Typography>
          <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflowX: 'auto' }}>
            {links.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.end}
                color="inherit"
                sx={{ '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
          <ThemeSwitch />
          <ProfileMenu />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}

