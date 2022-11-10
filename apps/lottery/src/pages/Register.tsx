import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useRegisterMutation } from '../api';
import { NavLink, useNavigate } from 'react-router-dom';
import theme from '../styles/theme';
import banner from '../Images/banner-img.png';
import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { useSnackbar } from 'notistack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  confirmPasswordSchema,
  passwordSchema,
  usernameSchema,
} from '../validationSchema';
import LoginForm from '../components/LoginForm';

const Register = () => {
  const validationSchema = Yup.object().shape({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm({
    resolver: yupResolver(validationSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [userRegister] = useRegisterMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      enqueueSnackbar(`Registering User Please Wait.`, {
        preventDuplicate: true,
        variant: 'info',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      const response: any = await userRegister(data);
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
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userType', 'User');
        localStorage.setItem('name', data['username']);
        localStorage.setItem('userId', response.data.id);
        enqueueSnackbar('Successfully Registered', {
          preventDuplicate: true,
          variant: 'success',
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        });
        navigate('/dashboard');
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
    <Box
      px={3}
      py={3}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90vh',
        mx: '50px',
      }}
    >
      <Card sx={{ width: '35%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: `linear-gradient(315deg,${theme.palette.primary.dark},${theme.palette.primary.main},${theme.palette.primary.light});`,
            color: `${theme.palette.primary.contrastText}`,
            py: '18px',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            margin="dense"
            sx={{ textTransform: 'uppercase' }}
          >
            FILL THE SIGN UP FORM
          </Typography>
        </Box>
        <FormProvider {...methods}>
          <Grid
            container
            spacing={1}
            sx={{ display: 'flex', flexDirection: 'column', p: '40px' }}
          >
            <LoginForm
              register={register}
              errors={errors}
              registerBool={true}
            />

            <Grid
              item
              mt={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                sx={{
                  p: '5px 25px',
                  background: `linear-gradient(45deg,${theme.palette.secondary.dark},${theme.palette.secondary.main},${theme.palette.secondary.light});`,
                  textTransform: 'capitalize',
                }}
              >
                Sign Up
              </Button>
              <Box ml={3}>
                <Typography
                  variant="body1"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Already have an account
                </Typography>
                <Typography variant="body1">
                  <NavLink
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      color: `${theme.palette.secondary.dark}`,
                      textTransform: 'capitalize',
                    }}
                  >
                    Sign In
                  </NavLink>{' '}
                  here.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
      <img src={banner} alt="banner" width="40%" />
    </Box>
  );
};
export default Register;
