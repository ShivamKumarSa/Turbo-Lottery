import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CardContent, Grid, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useUpdateTicketMutation } from '../api';
import theme from '../styles/theme';
import TicketCard from './TicketCard';

const ChangePriorityForm = ({ ticket }: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');
  const validationSchema = Yup.object().shape({
    priority: Yup.number()
      .typeError('Please enter a valid priority')
      .integer('Priority can only be integer')
      .positive("Priority can't be negative")
      .min(1, 'Maximum priority can be 1')
      .required('Please enter the priority'),
  });

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [updateTicket] = useUpdateTicketMutation();

  const onUpdate: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response: any = await updateTicket({
        body: data,
        token,
        ticketId: ticket._id,
      });
      if (response) {
        enqueueSnackbar('Priority has changed successfully', {
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
    <Grid item xs={12} md={6} lg={4}>
      <Card raised sx={{ border: `2px solid ${theme.palette.primary.dark}` }}>
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TicketCard data={ticket}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <TextField
                size="small"
                required
                type="number"
                margin="dense"
                placeholder="Priority"
                {...register('priority')}
                error={errors['priority'] ? true : false}
                defaultValue={ticket.priority}
              />
              {errors['priority'] ? (
                <span style={{ color: `${theme.palette.error.main}` }}>
                  <ErrorMessage errors={errors} name="priority" />
                </span>
              ) : (
                <span>&nbsp;</span>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit(onUpdate)}
                sx={{ mt: '10px' }}
              >
                Update Priority
              </Button>
            </Box>
          </TicketCard>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ChangePriorityForm;
