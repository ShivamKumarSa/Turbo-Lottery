import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import * as Yup from 'yup';
import { useGetTicketsQuery } from '../api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { numberGeneralSchema, ticketNameSchema } from '../validationSchema';
import { ticketInterface } from '@turbo-lottery/data';
import UpdateTicketForm from '../components/UpdateTicketForm';
import CreateTicketForm from '../components/CreateTicketForm';
import theme from '../styles/theme';
import bg from '../Images/cta-bg.png';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const response: any = useGetTicketsQuery(token);
  const [open, setOpen] = React.useState(false);
  const validationSchema = Yup.object().shape({
    ticketName: ticketNameSchema,
    price: numberGeneralSchema('Price', 50),
    maxplayers: numberGeneralSchema('Players', 2),
  });
  const handleClickOpen = () => {
    setOpen(true);
    reset();
  };
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

  if (response?.data) {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '15px' }}>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            sx={{ textTransform: 'capitalize', m: '25px 25px 0px' }}
          >
            Create New Ticket
          </Button>
        </Box>
        <Box sx={{ m: '0px 25px 25px' }}>
          {response.data.filter((ticket: any) => {
            return ticket.active === true;
          }).length > 0 && (
            <Typography
              variant="h2"
              sx={{
                my: '15px',
                display: 'flex',
                justifyContent: 'center',
                textDecoration: 'underline',
                color: `${theme.palette.primary.dark}`,
              }}
            >
              Active Tickets
            </Typography>
          )}

          <Grid container spacing={3}>
            {response.data
              .filter((ticket: any) => {
                return ticket.active === true;
              })
              .map((ticket: ticketInterface) => (
                <UpdateTicketForm ticket={ticket} key={ticket._id} />
              ))}
          </Grid>
        </Box>

        <Box sx={{ m: '0px 25px 25px' }}>
          {response.data.filter((ticket: any) => {
            return ticket.active === false;
          }).length > 0 && (
            <>
              <Divider />
              <Typography
                variant="h2"
                sx={{
                  my: '15px',
                  display: 'flex',
                  justifyContent: 'center',
                  textDecoration: 'underline',
                  color: `${theme.palette.primary.dark}`,
                }}
              >
                Inactive Tickets
              </Typography>
            </>
          )}
          <Grid container spacing={3}>
            {response.data
              .filter((ticket: any) => {
                return ticket.active === false;
              })
              .map((ticket: ticketInterface) => (
                <UpdateTicketForm ticket={ticket} key={ticket._id} />
              ))}
          </Grid>
        </Box>
        <CreateTicketForm
          register={register}
          errors={errors}
          open={open}
          setOpen={setOpen}
          handleSubmit={handleSubmit}
          methods={methods}
        />
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
