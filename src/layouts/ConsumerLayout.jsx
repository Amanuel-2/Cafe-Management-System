import { AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useConsumerCart } from '../hooks/useConsumerCart';
import { database } from '../services/database';

const links = [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Menu', to: '/menu' }, { label: 'Track order', to: '/track-order' }, { label: 'Contact', to: '/contact' }];

export function ConsumerLayout() {
  const [settings, setSettings] = useState(() => database.getSettings());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useConsumerCart();
  useEffect(() => { const refreshSettings = (event) => { if (String(event.detail?.collection ?? '').includes('settings')) setSettings(database.getSettings()); }; window.addEventListener(database.changeEvent, refreshSettings); return () => window.removeEventListener(database.changeEvent, refreshSettings); }, []);
  const navigation = links.map((link) => <Button key={link.to} color="inherit" component={NavLink} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)} sx={{ '&.active': { color: 'primary.main', bgcolor: 'action.hover' } }}>{link.label}</Button>);
  return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}><Container maxWidth="xl"><Toolbar disableGutters sx={{ gap: 1 }}><IconButton aria-label="Open navigation" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}><MenuIcon /></IconButton><Avatar component={Link} to="/" src={settings.logo} variant="rounded" sx={{ width: 38, height: 38 }} /><Typography component={Link} to="/" color="text.primary" sx={{ flex: 1, fontWeight: 900, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{settings.restaurantName}</Typography><Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>{navigation}</Stack><IconButton component={Link} to="/cart" color="primary" aria-label={`Cart with ${itemCount} items`}><Badge badgeContent={itemCount} color="secondary"><ShoppingBag /></Badge></IconButton><Button variant="outlined" component={NavLink} to="/login" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Staff sign in</Button></Toolbar></Container></AppBar>
    <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}><Stack sx={{ width: 290, p: 2 }} spacing={1}><Stack direction="row" alignItems="center" justifyContent="space-between"><Typography variant="h6" fontWeight={900}>Navigate</Typography><IconButton aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X /></IconButton></Stack><Divider />{navigation}<Button component={Link} to="/qr-menu" onClick={() => setMobileOpen(false)}>QR menu</Button><Button variant="contained" component={Link} to="/login" onClick={() => setMobileOpen(false)}>Staff sign in</Button></Stack></Drawer>
    <Box sx={{ flex: 1 }}><Outlet /></Box>
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', mt: 8 }}><Container maxWidth="lg" sx={{ py: 5 }}><Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}><Box><Typography variant="h6" fontWeight={900}>{settings.restaurantName}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>{settings.address}</Typography></Box><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>{links.slice(1).map((link) => <Button key={link.to} component={Link} to={link.to} color="inherit">{link.label}</Button>)}<Button component={Link} to="/qr-menu" color="inherit">QR menu</Button></Stack><Box><Typography variant="body2" fontWeight={800}>{settings.openingHours}</Typography><Typography variant="body2" color="text.secondary">{settings.phone} · {settings.email}</Typography></Box></Stack></Container></Box>
  </Box>;
}
