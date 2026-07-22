import { Box, Stack, Typography } from '@mui/material';

export function PageHeader({ title, description, eyebrow, action, actions }) {
  const headerAction = action ?? actions;
  return (
    <Stack
      component="header"
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      justifyContent="space-between"
      gap={2}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow ? (
          <Typography color="primary" variant="overline" sx={{ fontWeight: 800, letterSpacing: 1 }}>
            {eyebrow}
          </Typography>
        ) : null}
        <Typography component="h2" variant="h4" sx={{ fontWeight: 800 }}>{title}</Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>{description}</Typography>
        ) : null}
      </Box>
      {headerAction ? <Box sx={{ flexShrink: 0 }}>{headerAction}</Box> : null}
    </Stack>
  );
}
