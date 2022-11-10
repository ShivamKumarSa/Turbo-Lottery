import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { useLoginMutation } from '../api';
import { NavLink, useNavigate } from 'react-router-dom';
import theme from '../styles/theme';
import banner from '../Images/about-img.png';
import { useSnackbar } from 'notistack';
import { stringRequired } from '../validationSchema';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [userLogin] = useLoginMutation();
  const validationSchema = Yup.object().shape({
    username: stringRequired('Username'),
    password: stringRequired('Password'),
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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      enqueueSnackbar('Signing In!! Please wait', {
        preventDuplicate: true,
        variant: 'info',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      const response: any = await userLogin(data);
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
        // console.log(response.data.access_token);
        // const dcd = window.atob(response.data.access_token.split('.')[1]);
        // console.log(JSON.parse(dcd));
        // console.log(JSON.parse(dcd).exp);
        // console.log(Math.floor(Date.now() / 1000));
        localStorage.setItem('name', data['username']);
        localStorage.setItem('userId', response.data.id);
        if (response.data.isAdmin) {
          localStorage.setItem('userType', 'Admin');
          navigate('/adminDashboard/ticket');
        } else {
          localStorage.setItem('userType', 'User');
          navigate('/dashboard');
        }
        enqueueSnackbar('Successfully Sign In', {
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
    <Box
      px={3}
      py={3}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row-reverse',
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
            FILL THE SIGN IN FORM
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
              registerBool={false}
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
                Sign In
              </Button>
              <Box ml={3}>
                <Typography
                  variant="body1"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Doesn't have an account
                </Typography>
                <Typography variant="body1">
                  <NavLink
                    to="/register"
                    style={{
                      textDecoration: 'none',
                      color: `${theme.palette.secondary.dark}`,
                      textTransform: 'capitalize',
                    }}
                  >
                    Sign Up
                  </NavLink>{' '}
                  here.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
      <img src={banner} alt="banner" />
    </Box>
  );
};
export default Login;
