import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, TableCell, TableRow, TextField } from '@mui/material';
import * as Yup from 'yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import theme from '../styles/theme';
import { useUpdateUserMutation } from '../api';
import React from 'react';
import ConfirmDialog from './ConfirmDialog';
import { UserInterfaceWithId } from '../pages/AdminDashboardUserView';
import { useSnackbar } from 'notistack';

interface addCreditFormInterface {
  user: UserInterfaceWithId;
  id: number;
}
const AddCreditForm = ({ user, id }: addCreditFormInterface) => {
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');
  const [ConfirmOpen, confirmSetOpen] = React.useState(false);
  const validationSchema = Yup.object().shape({
    credit: Yup.number()
      .typeError('Please enter a valid credit')
      .integer('Credit can only be integer')
      .positive("Credit can't be negative")
      .min(0, 'Minimum credit can be 1')
      .required('Please enter the credit'),
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

  const [updateUser] = useUpdateUserMutation();

  const onUpdate: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response: any = await updateUser({
        body: data,
        token,
        userId: user._id,
      });
      if (response) {
        enqueueSnackbar('Credit is added successfully', {
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
      {ConfirmOpen && (
        <ConfirmDialog
          open={ConfirmOpen}
          setOpen={confirmSetOpen}
          heading="Do you want to add credit?"
          acceptFunction={handleSubmit(onUpdate)}
        />
      )}
      <TableRow>
        <TableCell>{id}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.isAdmin ? 'true' : 'false'}</TableCell>
        <TableCell>{user.credit}</TableCell>
        <TableCell
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TextField
            required
            type="number"
            margin="dense"
            defaultValue={500}
            {...register('credit')}
            error={errors['credit'] ? true : false}
          />
          {errors['credit'] ? (
            <span style={{ color: `${theme.palette.error.main}` }}>
              <ErrorMessage errors={errors} name="credit" />
            </span>
          ) : (
            <span>&nbsp;</span>
          )}

          <Button
            variant="contained"
            onClick={() => {
              confirmSetOpen(true);
            }}
          >
            Add Credit
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default AddCreditForm;
