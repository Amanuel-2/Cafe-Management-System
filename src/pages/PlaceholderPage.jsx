import { Alert, Stack, Typography } from '@mui/material';
export function PlaceholderPage({ title, description }) { return <Stack spacing={2}><Typography component="h1" variant="h4" fontWeight={900}>{title}</Typography><Alert severity="info">{description}</Alert></Stack>; }
