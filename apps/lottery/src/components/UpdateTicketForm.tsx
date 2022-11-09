import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  styled,
  Switch,
  ToggleButton,
  toggleButtonClasses,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDeleteTicketMutation } from '../api';
import theme from '../styles/theme';
import ConfirmDialog from './ConfirmDialog';
import TicketCard from './TicketCard';
import * as Yup from 'yup';
import { numberGeneralSchema, ticketNameSchema } from '../validationSchema';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CreateTicketForm from './CreateTicketForm';
const UpdateTicketForm = ({ ticket }: any) => {
  const token = localStorage.getItem('token');
  const [ConfirmDelete, setConfirmDelete] = React.useState(false);
  const [type, setType] = React.useState<boolean | null>(ticket?.active);
  const [open, setOpen] = React.useState(false);
  const [alignment, setAlignment] = React.useState<boolean | null>(
    ticket?.active
  );

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: boolean | null
  ) => {
    setAlignment(newAlignment);
  };
  const validationSchema = Yup.object().shape({
    ticketName: ticketNameSchema,
    price: numberGeneralSchema('Price', 50),
    maxplayers: numberGeneralSchema('Players', 2),
  });
  const handleClickOpen = () => {
    setOpen(true);
    reset();
    setType(ticket?.active);
  };
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const handleClickConfirmDelete = () => {
    setConfirmDelete(true);
  };
  const { enqueueSnackbar } = useSnackbar();
  const [deleteTicket] = useDeleteTicketMutation();
  const handleDelete = async () => {
    try {
      const response: any = await deleteTicket({ token, ticketId: ticket._id });

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
      // console.log(response);
      if (response?.data) {
        enqueueSnackbar('Ticket Deleted successfully', {
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
  };
  return (
    <>
      {ConfirmDelete && (
        <ConfirmDialog
          open={ConfirmDelete}
          setOpen={setConfirmDelete}
          heading="Are you sure You want to delete this ticket?"
          acceptFunction={handleDelete}
        />
      )}
      <Grid item xs={12} md={6} lg={4}>
        <Card raised sx={{ border: `2px solid ${theme.palette.primary.dark}` }}>
          <CardContent>
            <TicketCard data={ticket}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Button
                  variant="outlined"
                  sx={{ mt: '10px' }}
                  onClick={handleClickOpen}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  sx={{ mt: '10px' }}
                  onClick={handleClickConfirmDelete}
                >
                  Delete
                </Button>
              </Box>
            </TicketCard>
          </CardContent>
        </Card>
      </Grid>
      <CreateTicketForm
        register={register}
        errors={errors}
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        methods={methods}
        ticket={ticket}
        type={type}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              // justifyContent: 'space-between',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
              Ticket Status :
            </Typography>

            {/* <Controller
              control={control}
              name="active"
              defaultValue={true}
              // render={({ value: valueProp, onChange }) => {
              //   return a;
              // }}
              render={({ field: { onChange, value } }) => {
                return (
                  <Switch
                    value={value}
                    onChange={(event, val) => {
                      return onChange(val);
                    }}
                  />
                );
              }}
            /> */}
            <RadioGroup
              row
              // aria-labelledby="demo-row-radio-buttons-group-label"
              name="active"
              value={type}
              onChange={(e) => setType(e.target.value === 'true')}
              sx={{ justifyContent: 'center' }}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Inactive"
              />
            </RadioGroup>
          </Box>
        </Grid>
      </CreateTicketForm>
    </>
  );
};

export default UpdateTicketForm;
