import {
  AppBar,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Menu, UtensilsCrossed, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useLocation } from 'react-router-dom';
import { NotificationPanel } from '../components/common/NotificationPanel';
import { ProfileMenu } from '../components/common/ProfileMenu';
import { ThemeSwitch } from '../components/common/ThemeSwitch';
import { useAuth } from '../hooks/useAuth';
import { roleService } from '../services/roleService';
import { database } from '../services/database';

const DRAWER_WIDTH = 272;

function Navigation({ items, onNavigate }) {
  return (
    <List component="nav" aria-label="Workspace navigation" sx={{ px: 1.5, py: 1 }}>
      {items.map(({ label, to, icon: Icon, end }) => (
        <ListItemButton
          key={to}
          component={NavLink}
          to={to}
          end={end}
          onClick={onNavigate}
          sx={{
            minHeight: 46,
            mb: 0.5,
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            '&.active': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
              '& .MuiListItemIcon-root': { color: 'inherit' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: 'text.secondary' }}>
            <Icon size={19} aria-hidden="true" />
          </ListItemIcon>
          <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
        </ListItemButton>
      ))}
    </List>
  );
}

function Brand({ workspace, onClose, mobile, restaurantName, logo }) {
  return (
    <Toolbar sx={{ minHeight: 72, gap: 1.5, px: 2 }}>
      <Box sx={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 2.5, bgcolor: 'primary.main', color: 'primary.contrastText', overflow: 'hidden' }}>{logo ? <Box component="img" src={logo} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UtensilsCrossed size={21} aria-hidden="true" />}</Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography noWrap sx={{ fontWeight: 900, lineHeight: 1.2 }}>{restaurantName}</Typography>
        <Typography noWrap variant="caption" color="text.secondary">{workspace}</Typography>
      </Box>
      {mobile ? (
        <IconButton aria-label="Close navigation" onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      ) : null}
    </Toolbar>
  );
}

export function StaffLayout({ workspace, roleLabel, navItems }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState(() => database.getSettings());
  useEffect(() => { const refreshSettings = (event) => { if (String(event.detail?.collection ?? '').includes('settings')) setSettings(database.getSettings()); }; window.addEventListener(database.changeEvent, refreshSettings); return () => window.removeEventListener(database.changeEvent, refreshSettings); }, []);
  const location = useLocation();
  const { user } = useAuth();
  const allowedNavItems = navItems.filter((item) => roleService.userHasPermission(user, item.permission));

  const activeItem = [...allowedNavItems]
    .sort((a, b) => b.to.length - a.to.length)
    .find((item) => item.end ? location.pathname === item.to : location.pathname.startsWith(item.to));

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const drawerContent = (mobile = false) => (
    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <Brand workspace={workspace} mobile={mobile} onClose={() => setMobileOpen(false)} restaurantName={settings.restaurantName} logo={settings.logo} />
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Navigation items={allowedNavItems} onNavigate={() => setMobileOpen(false)} />
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="body2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
            <Typography noWrap variant="caption" color="text.secondary">Local database connected</Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, gap: 1 }}>
          <Tooltip title="Open navigation">
            <IconButton
              aria-label="Open navigation"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { md: 'none' } }}
            >
              <Menu size={21} />
            </IconButton>
          </Tooltip>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Breadcrumbs aria-label="Breadcrumb" separator="/" sx={{ display: { xs: 'none', sm: 'flex' }, mb: 0.25 }}>
              <Link component={RouterLink} underline="hover" color="inherit" to={`/${pathSegments[0] ?? ''}`} variant="caption">
                {roleLabel}
              </Link>
              {pathSegments.slice(1).map((segment, index) => (
                <Typography key={`${segment}-${index}`} color="text.secondary" variant="caption" sx={{ textTransform: 'capitalize' }}>
                  {segment.replaceAll('-', ' ')}
                </Typography>
              ))}
            </Breadcrumbs>
            <Typography component="h1" noWrap variant="h6" sx={{ fontWeight: 800 }}>
              {activeItem?.label ?? workspace}
            </Typography>
          </Box>
          <Chip label={roleLabel} size="small" color="primary" variant="outlined" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
          <NotificationPanel />
          <ThemeSwitch />
          <ProfileMenu />
        </Toolbar>
      </AppBar>

      <Box component="nav" aria-label="Primary navigation" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent(true)}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRightColor: 'divider',
            },
          }}
        >
          {drawerContent(false)}
        </Drawer>
      </Box>

      <Box component="main" sx={{ minWidth: 0, flex: 1, pt: { xs: 8, md: 9 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2.5, md: 4 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
