import { Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { menuService } from '../../services/menuService';

export function ConsumerMenu() {
  const categories = new Map(menuService.listCategories().map((category) => [category.id, category.name]));
  const items = menuService.list({ available: true });

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography component="h1" variant="h3">Our menu</Typography>
        <Typography color="text.secondary">Available items are loaded from the shared restaurant database.</Typography>
      </Stack>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Chip size="small" label={`${item.price.toLocaleString()} ETB`} color="primary" />
                  </Stack>
                  <Typography color="text.secondary">{item.description}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {categories.get(item.categoryId)} · About {item.prepTimeMinutes} min
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

