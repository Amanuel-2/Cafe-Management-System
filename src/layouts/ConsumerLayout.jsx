import { AppBar, Avatar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { database } from '../services/database';

export function ConsumerLayout() {
  const [settings, setSettings] = useState(() => database.getSettings());
  useEffect(() => { const refreshSettings = (event) => { if (String(event.detail?.collection ?? '').includes('settings')) setSettings(database.getSettings()); }; window.addEventListener(database.changeEvent, refreshSettings); return () => window.removeEventListener(database.changeEvent, refreshSettings); }, []);
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Avatar src={settings.logo} variant="rounded" sx={{ width: 34, height: 34 }} />
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 900 }}>{settings.restaurantName}</Typography>
            <Button color="inherit" component={NavLink} to="/" end>Home</Button>
            <Button color="inherit" component={NavLink} to="/menu">Menu</Button>
            <Button variant="contained" component={NavLink} to="/login">Staff sign in</Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </Box>
  );
}
