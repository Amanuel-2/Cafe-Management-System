import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

const toneColor = {
  primary: 'primary.main',
  success: 'success.main',
  warning: 'warning.main',
  error: 'error.main',
  neutral: 'text.secondary',
};

export function MetricCard({ label, value, helper, icon: Icon, tone = 'primary' }) {
  const color = toneColor[tone] ?? toneColor.primary;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 650 }}>{label}</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 850 }}>{value}</Typography>
            {helper ? <Typography variant="caption" color="text.secondary">{helper}</Typography> : null}
          </Box>
          {Icon ? (
            <Box sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 2.5, bgcolor: 'action.hover', color }}>
              <Icon size={22} aria-hidden="true" />
            </Box>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

