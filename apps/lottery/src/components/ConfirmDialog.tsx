import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAcceptClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
