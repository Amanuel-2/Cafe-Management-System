import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onClose,
  onConfirm,
  destructive = false,
  isSubmitting = false,
}) {
  return (
    <Dialog open={open} onClose={isSubmitting ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} color="inherit">Cancel</Button>
        <Button
          onClick={onConfirm}
          disabled={isSubmitting}
          loading={isSubmitting}
          color={destructive ? 'error' : 'primary'}
          variant="contained"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

