import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import { useCreateTicketMutation, useGetTicketsQuery } from '../api';
import theme from '../styles/theme';
import CloseIcon from '@mui/icons-material/Close';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import { numberGeneralSchema, ticketNameSchema } from '../validationSchema';
import ChangePriorityForm from '../components/ChangePriorityForm';
import { ticketInterface } from '@turbo-lottery/data';
import { useSnackbar } from 'notistack';
import UpdateTicketForm from '../components/UpdateTicketForm';

interface formDetailsInterface {
  heading: string;
  value: number;
  name: string;
}
const AdminDashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');
  const response: any = useGetTicketsQuery(token);
  const [open, setOpen] = React.useState(false);
  const [createTicket] = useCreateTicketMutation();
  const validationSchema = Yup.object().shape({
    ticketName: ticketNameSchema,
    price: numberGeneralSchema('Price'),
    maxplayers: numberGeneralSchema('Players'),
    // timer: numberGeneralSchema('Timer'),
    // priority: numberGeneralSchema('Priority'),
  });

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
    reset();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response: any = await createTicket({ body: data, token });
      if (response) {
        // console.log(response);
        enqueueSnackbar('Ticket Created successfully', {
          preventDuplicate: true,
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        });
        handleClose();
      }
    } catch (error) {
      enqueueSnackbar(`${error}`, {
        preventDuplicate: true,
        variant: 'error',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
    }
  };
  const formDetails: formDetailsInterface[] = [
    { heading: 'Amount', value: 100, name: 'price' },
    { heading: 'Players', value: 5, name: 'maxplayers' },
    // { heading: 'Timer', value: 10, name: 'timer' },
    // { heading: 'Priority', value: 10, name: 'priority' },
  ];
  if (response?.data) {
    return (
      <Box sx={{ m: '25px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '15px' }}>
          <Button variant="outlined" onClick={handleClickOpen}>
            Create New Ticket
          </Button>
        </Box>
        {/* <Grid container spacing={3}>
          {response.data.map((ticket: ticketInterface) => (
            <ChangePriorityForm ticket={ticket} key={ticket._id} />
          ))}
        </Grid> */}
        <Grid container spacing={3}>
          {response.data.map((ticket: ticketInterface) => (
            <UpdateTicketForm ticket={ticket} key={ticket._id} />
          ))}
        </Grid>
        <Dialog fullWidth open={open} onClose={handleClose}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              background: `${theme.palette.primary.dark}`,
            }}
          >
            <DialogTitle>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: '500',
                  color: `${theme.palette.primary.contrastText}`,
                }}
              >
                Fill Ticket Details
              </Typography>
            </DialogTitle>
            <Button onClick={handleClose}>
              <CloseIcon sx={{ width: '20px' }} />
            </Button>
          </Box>
          <FormProvider {...methods}>
            <Grid
              container
              spacing={2}
              sx={{
                p: '20px 40px 30px',
              }}
            >
              <Grid item xs={12}>
                <Typography variant="h5">Ticket Name</Typography>

                <TextField
                  required
                  fullWidth
                  placeholder="Enter Ticket Name"
                  type="text"
                  margin="dense"
                  {...register('ticketName')}
                  error={errors['ticketName'] ? true : false}
                />
                {errors['ticketName'] ? (
                  <span style={{ color: `${theme.palette.error.main}` }}>
                    <ErrorMessage errors={errors} name="ticketName" />
                  </span>
                ) : (
                  <span>&nbsp;</span>
                )}
              </Grid>
              {formDetails.map(
                (detail: formDetailsInterface, index: number) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="h5">{detail.heading}</Typography>

                    <TextField
                      required
                      defaultValue={detail.value}
                      type={detail.name}
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
                )
              )}
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
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: '30px',
          height: '90%',
          width: '100%',
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }
};

export default AdminDashboard;
