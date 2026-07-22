import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

export function FormDialog({
  open,
  title,
  description,
  submitLabel = 'Save',
  onClose,
  onSubmit,
  isSubmitting = false,
  maxWidth = 'sm',
  children,
}) {
  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} fullWidth maxWidth={maxWidth}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogTitle sx={{ pb: description ? 0.5 : 2 }}>{title}</DialogTitle>
        {description ? <Typography color="text.secondary" sx={{ px: 3 }}>{description}</Typography> : null}
        <DialogContent dividers sx={{ mt: 2 }}>
          <Stack spacing={2}>{children}</Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>{submitLabel}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

