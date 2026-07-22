import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import hero from '../assets/hero.png';
export function AuthLayout() { return <Box component="main" sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.05fr 0.95fr' }, bgcolor: 'background.default' }}><Box component="section" aria-label="Restaurant interior" sx={{ display: { xs: 'none', lg: 'block' }, backgroundImage: `linear-gradient(rgba(28,25,23,.15), rgba(28,25,23,.4)), url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} /><Box component="section" sx={{ display: 'grid', placeItems: 'center', p: 3 }}><Outlet /></Box></Box>; }
