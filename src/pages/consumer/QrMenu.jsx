import { Alert, Box, Button, Container, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { Copy, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { ConsumerMenu } from './Menu';

export function QrMenuPage() {
  const [image, setImage] = useState(''); const [copied, setCopied] = useState(false);
  const menuUrl = `${window.location.origin}/qr-menu`;
  useEffect(() => { QRCode.toDataURL(menuUrl, { width: 320, margin: 2, color: { dark: '#1c1917', light: '#ffffff' }, errorCorrectionLevel: 'H' }).then(setImage); }, [menuUrl]);
  const copy = async () => { await navigator.clipboard.writeText(menuUrl); setCopied(true); };
  return <Box component="main"><Box sx={{ bgcolor: '#1c1917', color: 'white' }}><Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}><Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={5}><Box sx={{ maxWidth: 620 }}><Stack direction="row" spacing={1} color="primary.light"><QrCode /><Typography variant="overline" fontWeight={900}>SCAN · BROWSE · ORDER</Typography></Stack><Typography component="h1" variant="h2" fontWeight={900} sx={{ mt: 2 }}>The menu in every guest's pocket.</Typography><Typography sx={{ color: 'grey.300', my: 2, fontSize: '1.08rem' }}>Scan this code from any phone to open the live menu. Availability, pricing, cart, checkout, and order tracking are always connected to the restaurant.</Typography><Button color="inherit" variant="outlined" startIcon={<Copy />} onClick={copy}>Copy QR menu link</Button></Box><Paper elevation={8} sx={{ p: 2.5, borderRadius: 5 }}>{image ? <Box component="img" src={image} alt={`QR code linking to ${menuUrl}`} sx={{ width: { xs: 230, sm: 290 }, display: 'block' }} /> : <Box sx={{ width: 290, height: 290 }} />}</Paper></Stack></Container></Box><ConsumerMenu qrMode /><Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)}><Alert severity="success" variant="filled">QR menu link copied.</Alert></Snackbar></Box>;
}
