import { Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';

const cards = [
  { label: "Today's sales", value: 'ETB 0.00', note: 'Completed payments' },
  { label: 'Open orders', value: '0', note: 'Awaiting checkout' },
  { label: 'Receipts', value: '0', note: 'Issued today' },
];

export function CashierDashboard() {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
        <div>
          <Typography variant="h4">Cashier dashboard</Typography>
          <Typography color="text.secondary">Process orders, payments, and receipts from one workspace.</Typography>
        </div>
        <Chip color="success" label="Register open" sx={{ alignSelf: 'flex-start' }} />
      </Stack>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" variant="body2">{card.label}</Typography>
                <Typography variant="h4" sx={{ my: 1 }}>{card.value}</Typography>
                <Typography color="text.secondary" variant="caption">{card.note}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">POS foundation ready</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            The dedicated POS, payment, and receipt workflows are scheduled in Phase 7 after menu, inventory, and order services are complete.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

