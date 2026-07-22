import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Container, Grid, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { Clock3, Plus, QrCode, Search, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsumerCart } from '../../hooks/useConsumerCart';
import { menuService } from '../../services/menuService';
import { formatETB } from '../../utils/currency';

export function ConsumerMenu({ qrMode = false }) {
  const categories = menuService.listCategories().filter((category) => category.status !== 'inactive');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const { addItem, itemCount } = useConsumerCart();
  const items = useMemo(() => menuService.list({ available: true, categoryId: category, query }), [category, query]);
  const add = (item) => { addItem(item); setFeedback(`${item.name} added to your cart.`); };
  return <Container component="main" maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={3} sx={{ mb: 4 }}><Box><Stack direction="row" alignItems="center" spacing={1}><Typography color="primary" variant="overline" fontWeight={900}>{qrMode ? 'QR MENU' : 'ORDER ONLINE'}</Typography>{qrMode ? <QrCode size={18} /> : null}</Stack><Typography component="h1" variant="h3" fontWeight={900}>Our menu</Typography><Typography color="text.secondary">Fresh availability and pricing from the restaurant kitchen.</Typography></Box><Button component={Link} to="/cart" variant="contained" startIcon={<ShoppingBag />} sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}>View cart ({itemCount})</Button></Stack>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}><TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes and drinks" fullWidth slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={19} /></InputAdornment> } }} /><Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}><Chip clickable color={category === 'all' ? 'primary' : 'default'} label="All" onClick={() => setCategory('all')} />{categories.map((entry) => <Chip clickable key={entry.id} color={category === entry.id ? 'primary' : 'default'} label={entry.name} onClick={() => setCategory(entry.id)} />)}</Stack></Stack>
    {items.length ? <Grid container spacing={3}>{items.map((item) => <Grid key={item.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}><Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}><Box component={Link} to={`/menu/${item.id}`} sx={{ display: 'block', bgcolor: 'action.hover' }}><Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', height: 210, objectFit: 'cover' }} /></Box><CardContent sx={{ flex: 1 }}><Stack spacing={1.5}><Stack direction="row" justifyContent="space-between" gap={2}><Typography component={Link} to={`/menu/${item.id}`} color="text.primary" variant="h6" fontWeight={900} sx={{ textDecoration: 'none' }}>{item.name}</Typography><Typography color="primary" fontWeight={900} whiteSpace="nowrap">{formatETB(item.price)}</Typography></Stack><Typography color="text.secondary" variant="body2">{item.description}</Typography><Stack direction="row" spacing={1} alignItems="center"><Clock3 size={15} /><Typography variant="caption">About {item.prepTimeMinutes} min</Typography></Stack></Stack></CardContent><CardActions sx={{ px: 2, pb: 2 }}><Button fullWidth variant="contained" startIcon={<Plus />} onClick={() => add(item)}>Add to cart</Button></CardActions></Card></Grid>)}</Grid> : <Box sx={{ py: 12, textAlign: 'center' }}><Typography variant="h5" fontWeight={900}>No menu items found</Typography><Typography color="text.secondary">Try a different search or category.</Typography></Box>}
    <Snackbar open={Boolean(feedback)} autoHideDuration={2500} onClose={() => setFeedback('')}><Alert severity="success" variant="filled">{feedback}</Alert></Snackbar>
  </Container>;
}
