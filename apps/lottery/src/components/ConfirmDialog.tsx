import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import theme from '../styles/theme';

interface ConfirmDialogProps {
  acceptFunction: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
}

const ConfirmDialog = ({
  acceptFunction,
  open,
  setOpen,
  heading,
}: ConfirmDialogProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleAcceptClose = () => {
    acceptFunction();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <Typography
          variant="h4"
          sx={{ color: `${theme.palette.primary.dark}` }}
        >
          {heading}
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} size="large">
          <Typography variant="h5" sx={{ fontWeight: '600' }}>
            Discard
          </Typography>
        </Button>
        <Button onClick={handleAcceptClose} size="large">
          <Typography variant="h5" sx={{ fontWeight: '600' }}>
            Proceed
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
