import { ErrorMessage } from '@hookform/error-message';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  List,
  ListItemText,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { FieldValues, FormProvider, SubmitHandler } from 'react-hook-form';
import theme from '../styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { useCreateTicketMutation, useUpdateTicketMutation } from '../api';
import InfoIcon from '@mui/icons-material/Info';
interface formDetailsInterface {
  heading: string;
  value: number;
  name: string;
}
const CreateTicketForm = ({
  register,
  errors,
  open,
  setOpen,
  handleSubmit,
  methods,
  children,
  ticket,
  type,
}: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');
  const [createTicket] = useCreateTicketMutation();
  const [updateTicket] = useUpdateTicketMutation();
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const formDetails: formDetailsInterface[] = [
    {
      heading: 'Amount',
      value: ticket?.price ? ticket.price : 100,
      name: 'price',
    },
    {
      heading: 'Players',
      value: ticket?.maxplayers ? ticket.maxplayers : 5,
      name: 'maxplayers',
    },
  ];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openPopper = Boolean(anchorEl);
  // let message;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    // setOpen((previousOpen) => !previousOpen);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    data = { ...data, ticketName: data['ticketName'].toLowerCase() };
    if (ticket?.price) {
      try {
        const response: any = await updateTicket({
          body: { ...data, active: type },
          token,
          ticketId: ticket._id,
        });
        if (response?.error) {
          enqueueSnackbar(
            `${response.error.data.statusCode}: ${response.error.data.message}`,
            {
              preventDuplicate: true,
              variant: 'error',
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            }
          );
        }
        if (response?.data) {
          // console.log(response);
          enqueueSnackbar('Ticket Updated successfully', {
            preventDuplicate: true,
            variant: 'success',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          });
        }
      } catch (error) {
        enqueueSnackbar(`${error}`, {
          preventDuplicate: true,
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        });
      }
    } else {
      // console.log(data);
      // console.log('creating');
      try {
        const response: any = await createTicket({ body: data, token });
        if (response?.error) {
          enqueueSnackbar(
            `${response.error.data.statusCode}: ${response.error.data.message}`,
            {
              preventDuplicate: true,
              variant: 'error',
              anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
            }
          );
        }
        if (response?.data) {
          // console.log(response);
          enqueueSnackbar('Ticket Created successfully', {
            preventDuplicate: true,
            variant: 'success',
            anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          });
        }
      } catch (error) {
        enqueueSnackbar(`${error}`, {
          preventDuplicate: true,
          variant: 'error',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        });
      }
    }
    handleClose();
  };
  return (
    <Dialog fullWidth open={open} onClose={handleClose} disableEnforceFocus>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          background: `${theme.palette.primary.dark}`,
        }}
      >
        <DialogTitle>
          <Typography
            variant="h3"
            sx={{
              fontWeight: '500',
              color: `${theme.palette.primary.contrastText}`,
              textTransform: 'capitalize',
            }}
          >
            {ticket?.ticketName ? <>Update </> : <>Fill </>}Ticket Details
          </Typography>
        </DialogTitle>
        <Button onClick={handleClose}>
          <CloseIcon
            sx={{
              width: '20px',
              color: `${theme.palette.primary.contrastText}`,
            }}
          />
        </Button>
      </Box>
      <FormProvider {...methods}>
        {openPopper && (
          <Popper
            open={openPopper}
            anchorEl={anchorEl}
            placement="right-start"
            style={{ zIndex: 1500 }}
          >
            <Box
              sx={{
                border: `3px solid ${theme.palette.action.hover}`,
                p: 1,
                bgcolor: 'background.paper',
                ml: '40px',
                width: '20vw',
              }}
            >
              <List>
                <ListItemText>
                  Ticket Name can only contain alphanumeric characters
                </ListItemText>
                <ListItemText>Minimum Length : 2 characters</ListItemText>
                <ListItemText>Maximum Length : 30 characters</ListItemText>
                <ListItemText>
                  Cannot inculde leading and trailing spaces
                </ListItemText>
              </List>
            </Box>
          </Popper>
        )}
        <Grid
          container
          spacing={2}
          sx={{
            p: '20px 40px 30px',
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
              Ticket Name
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '5px',
              }}
            >
              <TextField
                required
                fullWidth
                placeholder="Enter Ticket Name"
                defaultValue={ticket?.ticketName}
                type="text"
                margin="dense"
                {...register('ticketName')}
                error={errors['ticketName'] ? true : false}
              />
              <Button onClick={handleClick}>
                <InfoIcon color="primary" />
              </Button>
            </Box>
            {errors['ticketName'] ? (
              <span style={{ color: `${theme.palette.error.main}` }}>
                <ErrorMessage errors={errors} name="ticketName" />
              </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </Grid>
          {formDetails.map((detail: formDetailsInterface, index: number) => (
            <Grid item xs={6} key={index}>
              <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
                {detail.heading}
              </Typography>

              <TextField
                required
                defaultValue={detail.value}
                type="number"
                fullWidth
                margin="dense"
                {...register(detail.name)}
                error={errors[detail.name] ? true : false}
              />
              {errors[detail.name] ? (
                <span style={{ color: `${theme.palette.error.main}` }}>
                  <ErrorMessage errors={errors} name={detail.name} />
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
            </Grid>
          ))}
          {children}
          <Grid
            item
            xs={12}
            mt={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                p: '5px 25px',
                background: `linear-gradient(45deg,${theme.palette.secondary.dark},${theme.palette.secondary.main},${theme.palette.secondary.light});`,
              }}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Dialog>
  );
};

export default CreateTicketForm;
