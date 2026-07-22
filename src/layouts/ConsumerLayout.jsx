import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

export function ConsumerLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 900 }}>Restaurant</Typography>
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
